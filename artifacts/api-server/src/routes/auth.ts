import { Router, type IRouter } from "express";
import { supabaseAdmin } from "../lib/supabase";
import { requireAuth } from "../middlewares/auth";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { LoginBody, RegisterBody, LoginResponse, GetMeResponse } from "@workspace/api-zod";
import { z } from "zod";

const router: IRouter = Router();

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, password } = parsed.data;
  const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });

  if (error || !data.user || !data.session) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const users = await db.select().from(usersTable).where(eq(usersTable.id, data.user.id));
  let user = users[0];
  if (!user) {
    const inserted = await db.insert(usersTable).values({
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.name || email.split("@")[0],
      plan: "free",
    }).returning();
    user = inserted[0];
  }

  res.json(LoginResponse.parse({ user: { ...user, createdAt: user.createdAt.toISOString() }, token: data.session.access_token }));
});

router.post("/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, password, name } = parsed.data;
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  });

  if (error || !data.user) {
    res.status(400).json({ error: error?.message || "Registration failed" });
    return;
  }

  const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({ email, password });
  if (signInError || !signInData.session) {
    res.status(400).json({ error: "Account created but sign-in failed" });
    return;
  }

  const [user] = await db.insert(usersTable).values({
    id: data.user.id,
    email,
    name,
    plan: "free",
  }).onConflictDoNothing().returning();

  res.status(201).json(LoginResponse.parse({
    user: { ...user, createdAt: user.createdAt.toISOString() },
    token: signInData.session.access_token,
  }));
});

router.post("/auth/logout", async (_req, res): Promise<void> => {
  res.json({ success: true });
});

router.get("/auth/me", requireAuth, async (req, res): Promise<void> => {
  const users = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!));
  if (!users.length) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const user = users[0];
  res.json(GetMeResponse.parse({ ...user, createdAt: user.createdAt.toISOString() }));
});

const ResetPasswordBody = z.object({
  email: z.string().email(),
});

router.post("/auth/reset-password", async (req, res): Promise<void> => {
  const parsed = ResetPasswordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Valid email is required" });
    return;
  }

  const { error } = await supabaseAdmin.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.FRONTEND_URL || ""}/reset-password`,
  });

  if (error) {
    res.status(400).json({ error: error.message });
    return;
  }

  res.json({ success: true, message: "Password reset email sent" });
});

router.delete("/auth/account", requireAuth, async (req, res): Promise<void> => {
  const userId = req.userId!;

  try {
    await db.delete(usersTable).where(eq(usersTable.id, userId));

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) {
      res.status(500).json({ error: "Failed to delete account" });
      return;
    }

    res.json({ success: true, message: "Account deleted successfully" });
  } catch {
    res.status(500).json({ error: "Failed to delete account" });
  }
});

export default router;
