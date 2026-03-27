import { db, monitorsTable, checksTable, incidentsTable, alertsTable, notificationSettingsTable } from "@workspace/db";
import { eq, and, desc, gte, count, sql } from "drizzle-orm";
import { logger } from "./logger";
import crypto from "crypto";

async function performCheck(monitor: typeof monitorsTable.$inferSelect): Promise<{
  status: "up" | "down";
  responseTime: number | null;
  statusCode: number | null;
  error: string | null;
}> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(monitor.url, {
      method: "GET",
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timeout);
    const responseTime = Date.now() - start;
    const status = response.ok ? "up" : "down";
    return { status, responseTime, statusCode: response.status, error: null };
  } catch (err: any) {
    const responseTime = Date.now() - start;
    return { status: "down", responseTime, statusCode: null, error: err.message || "Unknown error" };
  }
}

async function handleIncidents(monitor: typeof monitorsTable.$inferSelect, newStatus: "up" | "down"): Promise<void> {
  const previousStatus = monitor.status;

  if (newStatus === "down" && previousStatus !== "down") {
    // Start new incident
    const incidentId = crypto.randomUUID();
    await db.insert(incidentsTable).values({
      id: incidentId,
      monitorId: monitor.id,
      status: "ongoing",
    });

    // Create in-app alert
    await db.insert(alertsTable).values({
      id: crypto.randomUUID(),
      userId: monitor.userId,
      monitorId: monitor.id,
      type: "down",
      message: `${monitor.name} is DOWN - ${monitor.url}`,
      isRead: false,
    });

    // Send discord notification if configured
    const notifSettings = await db.select().from(notificationSettingsTable).where(eq(notificationSettingsTable.userId, monitor.userId));
    if (notifSettings.length && notifSettings[0].discordEnabled && notifSettings[0].discordWebhookUrl) {
      try {
        await fetch(notifSettings[0].discordWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            embeds: [{
              title: "🔴 Monitor Down",
              description: `**${monitor.name}** is unreachable\n${monitor.url}`,
              color: 0xff0000,
            }],
          }),
        });
      } catch (e) {
        logger.warn({ monitorId: monitor.id }, "Failed to send Discord notification");
      }
    }

    // Send webhook if configured
    if (notifSettings.length && notifSettings[0].webhookEnabled && notifSettings[0].webhookUrl) {
      try {
        await fetch(notifSettings[0].webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "monitor.down",
            monitorId: monitor.id,
            monitorName: monitor.name,
            url: monitor.url,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (e) {
        logger.warn({ monitorId: monitor.id }, "Failed to send webhook notification");
      }
    }
  } else if (newStatus === "up" && previousStatus === "down") {
    // Resolve ongoing incident
    const ongoingIncidents = await db.select().from(incidentsTable).where(
      and(eq(incidentsTable.monitorId, monitor.id), eq(incidentsTable.status, "ongoing"))
    );

    for (const incident of ongoingIncidents) {
      const duration = Math.floor((Date.now() - incident.startedAt.getTime()) / 1000);
      await db.update(incidentsTable).set({
        resolvedAt: new Date(),
        duration,
        status: "resolved",
      }).where(eq(incidentsTable.id, incident.id));
    }

    // Create recovery alert
    await db.insert(alertsTable).values({
      id: crypto.randomUUID(),
      userId: monitor.userId,
      monitorId: monitor.id,
      type: "recovered",
      message: `${monitor.name} has recovered and is back UP`,
      isRead: false,
    });
  }
}

export async function runChecks(): Promise<void> {
  const now = new Date();
  const allMonitors = await db.select().from(monitorsTable).where(eq(monitorsTable.isPaused, false));

  for (const monitor of allMonitors) {
    const lastChecked = monitor.lastCheckedAt;
    const secondsSinceCheck = lastChecked ? (now.getTime() - lastChecked.getTime()) / 1000 : Infinity;

    if (secondsSinceCheck < monitor.interval) {
      continue;
    }

    try {
      const result = await performCheck(monitor);

      const checkId = crypto.randomUUID();
      await db.insert(checksTable).values({
        id: checkId,
        monitorId: monitor.id,
        status: result.status,
        responseTime: result.responseTime,
        statusCode: result.statusCode,
        error: result.error,
        checkedAt: new Date(),
      });

      // Calculate uptime
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const checksResult = await db.select({
        total: count(),
        upCount: sql<number>`SUM(CASE WHEN status = 'up' THEN 1 ELSE 0 END)::int`,
      }).from(checksTable).where(and(
        eq(checksTable.monitorId, monitor.id),
        gte(checksTable.checkedAt, thirtyDaysAgo)
      ));

      const total = checksResult[0]?.total || 1;
      const upCount = checksResult[0]?.upCount || 0;
      const uptimePercent = (upCount / total) * 100;

      await db.update(monitorsTable).set({
        status: result.status,
        responseTime: result.responseTime,
        uptimePercent,
        lastCheckedAt: new Date(),
      }).where(eq(monitorsTable.id, monitor.id));

      await handleIncidents(monitor, result.status);

      logger.debug({ monitorId: monitor.id, status: result.status, responseTime: result.responseTime }, "Check completed");
    } catch (err) {
      logger.error({ monitorId: monitor.id, err }, "Error running check for monitor");
    }
  }
}

export function startMonitoringWorker(): void {
  logger.info("Starting monitoring worker");
  setInterval(() => {
    runChecks().catch((err) => {
      logger.error({ err }, "Error in monitoring worker cycle");
    });
  }, 30000); // Run every 30 seconds and skip monitors that aren't due

  // Run immediately on startup
  runChecks().catch((err) => {
    logger.error({ err }, "Error in initial monitoring run");
  });
}
