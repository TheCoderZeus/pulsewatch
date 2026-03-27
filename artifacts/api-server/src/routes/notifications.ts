import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, notificationSettingsTable, alertsTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import {
  GetNotificationSettingsResponse,
  UpdateNotificationSettingsBody,
  UpdateNotificationSettingsResponse,
  GetAlertsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/notifications", requireAuth, async (req, res): Promise<void> => {
  const userId = req.userId!;
  const settings = await db.select().from(notificationSettingsTable).where(eq(notificationSettingsTable.userId, userId));

  if (!settings.length) {
    const defaultSettings = {
      userId,
      emailEnabled: false,
      emailAddress: null,
      webhookEnabled: false,
      webhookUrl: null,
      discordEnabled: false,
      discordWebhookUrl: null,
      inAppEnabled: true,
    };
    await db.insert(notificationSettingsTable).values(defaultSettings).onConflictDoNothing();
    res.json(GetNotificationSettingsResponse.parse(defaultSettings));
    return;
  }

  const s = settings[0];
  res.json(GetNotificationSettingsResponse.parse({
    ...s,
    emailAddress: s.emailAddress ?? null,
    webhookUrl: s.webhookUrl ?? null,
    discordWebhookUrl: s.discordWebhookUrl ?? null,
  }));
});

router.put("/notifications", requireAuth, async (req, res): Promise<void> => {
  const parsed = UpdateNotificationSettingsBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const userId = req.userId!;
  await db.insert(notificationSettingsTable).values({ userId, ...parsed.data }).onConflictDoNothing();
  const [updated] = await db.update(notificationSettingsTable).set(parsed.data).where(eq(notificationSettingsTable.userId, userId)).returning();

  res.json(UpdateNotificationSettingsResponse.parse({
    ...updated,
    emailAddress: updated.emailAddress ?? null,
    webhookUrl: updated.webhookUrl ?? null,
    discordWebhookUrl: updated.discordWebhookUrl ?? null,
  }));
});

router.get("/alerts", requireAuth, async (req, res): Promise<void> => {
  const userId = req.userId!;
  const { monitorsTable } = await import("@workspace/db");
  const { desc } = await import("drizzle-orm");

  const alerts = await db.select({
    alert: alertsTable,
    monitorName: monitorsTable.name,
  }).from(alertsTable)
    .innerJoin(monitorsTable, eq(alertsTable.monitorId, monitorsTable.id))
    .where(eq(alertsTable.userId, userId))
    .orderBy(desc(alertsTable.createdAt))
    .limit(50);

  res.json(GetAlertsResponse.parse(alerts.map(r => ({
    ...r.alert,
    monitorName: r.monitorName,
    createdAt: r.alert.createdAt.toISOString(),
  }))));
});

router.post("/alerts/:id/read", requireAuth, async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await db.update(alertsTable).set({ isRead: true }).where(eq(alertsTable.id, id));
  res.json({ success: true });
});

router.post("/alerts/read-all", requireAuth, async (req, res): Promise<void> => {
  await db.update(alertsTable).set({ isRead: true }).where(eq(alertsTable.userId, req.userId!));
  res.json({ success: true });
});

export default router;
