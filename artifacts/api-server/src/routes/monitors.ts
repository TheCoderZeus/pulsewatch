import { Router, type IRouter } from "express";
import { eq, and, desc, gte, count, sql, avg } from "drizzle-orm";
import { db, monitorsTable, checksTable, incidentsTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import {
  CreateMonitorBody,
  GetMonitorsResponse,
  GetMonitorResponse,
  UpdateMonitorBody,
  UpdateMonitorResponse,
  PauseMonitorResponse,
  ResumeMonitorResponse,
  GetMonitorChecksResponse,
  GetMonitorStatsResponse,
  GetDashboardStatsResponse,
} from "@workspace/api-zod";
import crypto from "crypto";

const router: IRouter = Router();

function formatMonitor(m: typeof monitorsTable.$inferSelect) {
  return {
    ...m,
    responseTime: m.responseTime ?? null,
    uptimePercent: m.uptimePercent ?? null,
    lastCheckedAt: m.lastCheckedAt?.toISOString() ?? null,
    createdAt: m.createdAt.toISOString(),
  };
}

router.get("/dashboard/stats", requireAuth, async (req, res): Promise<void> => {
  const userId = req.userId!;
  const monitors = await db.select().from(monitorsTable).where(eq(monitorsTable.userId, userId));

  const monitorsUp = monitors.filter(m => m.status === "up").length;
  const monitorsDown = monitors.filter(m => m.status === "down").length;
  const monitorsPaused = monitors.filter(m => m.isPaused).length;
  const avgUptime = monitors.length > 0
    ? monitors.reduce((acc, m) => acc + (m.uptimePercent ?? 100), 0) / monitors.length
    : 100;

  const activeIncidents = await db.select({ c: count() }).from(incidentsTable)
    .innerJoin(monitorsTable, eq(incidentsTable.monitorId, monitorsTable.id))
    .where(and(eq(monitorsTable.userId, userId), eq(incidentsTable.status, "ongoing")));

  const { alertsTable } = await import("@workspace/db");
  const unreadAlertsResult = await db.select({ c: count() }).from(alertsTable)
    .where(and(eq(alertsTable.userId, userId), eq(alertsTable.isRead, false)));

  res.json(GetDashboardStatsResponse.parse({
    totalMonitors: monitors.length,
    monitorsUp,
    monitorsDown,
    monitorsPaused,
    avgUptime: Math.round(avgUptime * 100) / 100,
    activeIncidents: activeIncidents[0]?.c ?? 0,
    unreadAlerts: unreadAlertsResult[0]?.c ?? 0,
  }));
});

router.get("/monitors", requireAuth, async (req, res): Promise<void> => {
  const monitors = await db.select().from(monitorsTable)
    .where(eq(monitorsTable.userId, req.userId!))
    .orderBy(desc(monitorsTable.createdAt));
  res.json(GetMonitorsResponse.parse(monitors.map(formatMonitor)));
});

router.post("/monitors", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateMonitorBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [monitor] = await db.insert(monitorsTable).values({
    id: crypto.randomUUID(),
    userId: req.userId!,
    ...parsed.data,
    status: "pending",
  }).returning();

  res.status(201).json(GetMonitorResponse.parse(formatMonitor(monitor)));
});

router.get("/monitors/:id", requireAuth, async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const monitors = await db.select().from(monitorsTable).where(
    and(eq(monitorsTable.id, id), eq(monitorsTable.userId, req.userId!))
  );
  if (!monitors.length) {
    res.status(404).json({ error: "Monitor not found" });
    return;
  }
  res.json(GetMonitorResponse.parse(formatMonitor(monitors[0])));
});

router.patch("/monitors/:id", requireAuth, async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = UpdateMonitorBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [monitor] = await db.update(monitorsTable).set(parsed.data)
    .where(and(eq(monitorsTable.id, id), eq(monitorsTable.userId, req.userId!)))
    .returning();

  if (!monitor) {
    res.status(404).json({ error: "Monitor not found" });
    return;
  }
  res.json(UpdateMonitorResponse.parse(formatMonitor(monitor)));
});

router.delete("/monitors/:id", requireAuth, async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const [monitor] = await db.delete(monitorsTable)
    .where(and(eq(monitorsTable.id, id), eq(monitorsTable.userId, req.userId!)))
    .returning();
  if (!monitor) {
    res.status(404).json({ error: "Monitor not found" });
    return;
  }
  res.json({ success: true });
});

router.post("/monitors/:id/pause", requireAuth, async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const [monitor] = await db.update(monitorsTable).set({ isPaused: true, status: "paused" })
    .where(and(eq(monitorsTable.id, id), eq(monitorsTable.userId, req.userId!)))
    .returning();
  if (!monitor) { res.status(404).json({ error: "Not found" }); return; }
  res.json(PauseMonitorResponse.parse(formatMonitor(monitor)));
});

router.post("/monitors/:id/resume", requireAuth, async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const [monitor] = await db.update(monitorsTable).set({ isPaused: false, status: "pending" })
    .where(and(eq(monitorsTable.id, id), eq(monitorsTable.userId, req.userId!)))
    .returning();
  if (!monitor) { res.status(404).json({ error: "Not found" }); return; }
  res.json(ResumeMonitorResponse.parse(formatMonitor(monitor)));
});

router.get("/monitors/:id/checks", requireAuth, async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const limitRaw = req.query.limit;
  const limit = limitRaw ? parseInt(String(limitRaw), 10) : 100;

  const checks = await db.select().from(checksTable)
    .where(eq(checksTable.monitorId, id))
    .orderBy(desc(checksTable.checkedAt))
    .limit(limit);

  res.json(GetMonitorChecksResponse.parse(checks.map(c => ({
    ...c,
    responseTime: c.responseTime ?? null,
    statusCode: c.statusCode ?? null,
    error: c.error ?? null,
    checkedAt: c.checkedAt.toISOString(),
  }))));
});

router.get("/monitors/:id/stats", requireAuth, async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const now = Date.now();
  const calc = async (ms: number) => {
    const since = new Date(now - ms);
    const result = await db.select({
      total: count(),
      upCount: sql<number>`SUM(CASE WHEN status = 'up' THEN 1 ELSE 0 END)::int`,
      avgResp: avg(checksTable.responseTime),
    }).from(checksTable).where(and(eq(checksTable.monitorId, id), gte(checksTable.checkedAt, since)));
    const total = result[0]?.total ?? 0;
    const upCount = result[0]?.upCount ?? 0;
    return { uptime: total > 0 ? (upCount / total) * 100 : 100, avgResp: Number(result[0]?.avgResp) || null, total, down: total - upCount };
  };

  const [s24, s7, s30] = await Promise.all([
    calc(24 * 60 * 60 * 1000),
    calc(7 * 24 * 60 * 60 * 1000),
    calc(30 * 24 * 60 * 60 * 1000),
  ]);

  res.json(GetMonitorStatsResponse.parse({
    monitorId: id,
    uptime24h: Math.round(s24.uptime * 100) / 100,
    uptime7d: Math.round(s7.uptime * 100) / 100,
    uptime30d: Math.round(s30.uptime * 100) / 100,
    avgResponseTime: s30.avgResp,
    totalChecks: s30.total,
    totalDown: s30.down,
  }));
});

export default router;
