import { Router, type IRouter } from "express";
import { eq, and, inArray } from "drizzle-orm";
import { db, statusPagesTable, monitorsTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import {
  GetStatusPagesResponse,
  CreateStatusPageBody,
  GetPublicStatusPageResponse,
} from "@workspace/api-zod";
import crypto from "crypto";

const router: IRouter = Router();

function formatPage(p: typeof statusPagesTable.$inferSelect) {
  return {
    ...p,
    description: p.description ?? null,
    monitorIds: p.monitorIds ?? [],
    createdAt: p.createdAt.toISOString(),
  };
}

router.get("/status-pages", requireAuth, async (req, res): Promise<void> => {
  const pages = await db.select().from(statusPagesTable).where(eq(statusPagesTable.userId, req.userId!));
  res.json(GetStatusPagesResponse.parse(pages.map(formatPage)));
});

router.post("/status-pages", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateStatusPageBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [page] = await db.insert(statusPagesTable).values({
    id: crypto.randomUUID(),
    userId: req.userId!,
    ...parsed.data,
  }).returning();

  res.status(201).json(formatPage(page));
});

router.get("/status-pages/:slug/public", async (req, res): Promise<void> => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const pages = await db.select().from(statusPagesTable).where(
    and(eq(statusPagesTable.slug, slug), eq(statusPagesTable.isPublic, true))
  );

  if (!pages.length) { res.status(404).json({ error: "Status page not found" }); return; }

  const page = pages[0];
  const monitorIds = page.monitorIds ?? [];

  let monitors: typeof monitorsTable.$inferSelect[] = [];
  if (monitorIds.length > 0) {
    monitors = await db.select().from(monitorsTable).where(inArray(monitorsTable.id, monitorIds));
  }

  const monitorStatuses = monitors.map(m => ({
    name: m.name,
    status: m.isPaused ? "paused" as const : (m.status === "up" || m.status === "down" ? m.status : "up" as const),
    uptimePercent: m.uptimePercent ?? null,
  }));

  const anyDown = monitorStatuses.some(m => m.status === "down");
  const anyPaused = monitorStatuses.some(m => m.status === "paused");
  const overallStatus = anyDown ? "outage" : anyPaused ? "degraded" : "operational";

  res.json(GetPublicStatusPageResponse.parse({
    name: page.name,
    description: page.description ?? null,
    monitors: monitorStatuses,
    overallStatus,
  }));
});

export default router;
