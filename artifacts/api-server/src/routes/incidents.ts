import { Router, type IRouter } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db, incidentsTable, monitorsTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { GetIncidentsResponse, GetIncidentResponse } from "@workspace/api-zod";

const router: IRouter = Router();

function formatIncident(i: typeof incidentsTable.$inferSelect, monitorName: string) {
  return {
    id: i.id,
    monitorId: i.monitorId,
    monitorName,
    startedAt: i.startedAt.toISOString(),
    resolvedAt: i.resolvedAt?.toISOString() ?? null,
    duration: i.duration ?? null,
    status: i.status,
  };
}

router.get("/incidents", requireAuth, async (req, res): Promise<void> => {
  const incidents = await db.select({
    incident: incidentsTable,
    monitorName: monitorsTable.name,
  }).from(incidentsTable)
    .innerJoin(monitorsTable, eq(incidentsTable.monitorId, monitorsTable.id))
    .where(eq(monitorsTable.userId, req.userId!))
    .orderBy(desc(incidentsTable.startedAt))
    .limit(100);

  res.json(GetIncidentsResponse.parse(incidents.map(r => formatIncident(r.incident, r.monitorName))));
});

router.get("/incidents/:id", requireAuth, async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const results = await db.select({
    incident: incidentsTable,
    monitorName: monitorsTable.name,
  }).from(incidentsTable)
    .innerJoin(monitorsTable, eq(incidentsTable.monitorId, monitorsTable.id))
    .where(and(eq(incidentsTable.id, id), eq(monitorsTable.userId, req.userId!)));

  if (!results.length) { res.status(404).json({ error: "Not found" }); return; }
  res.json(GetIncidentResponse.parse(formatIncident(results[0].incident, results[0].monitorName)));
});

export default router;
