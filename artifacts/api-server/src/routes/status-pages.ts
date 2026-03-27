import { Router, type IRouter } from "express";
import { eq, and, inArray } from "drizzle-orm";
import { db, statusPagesTable, monitorsTable } from "@workspace/db";
import type { StatusPageCategory } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import {
  GetStatusPagesResponse,
  GetPublicStatusPageResponse,
} from "@workspace/api-zod";
import { z } from "zod";
import crypto from "crypto";

const router: IRouter = Router();

const CategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  monitorIds: z.array(z.string()),
});

const CreateStatusPageSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().optional(),
  isPublic: z.boolean(),
  monitorIds: z.array(z.string()),
  categories: z.array(CategorySchema).optional().default([]),
});

const UpdateStatusPageSchema = CreateStatusPageSchema.partial();

function formatPage(p: typeof statusPagesTable.$inferSelect) {
  return {
    ...p,
    description: p.description ?? null,
    monitorIds: p.monitorIds ?? [],
    categories: (p.categories as StatusPageCategory[]) ?? [],
    createdAt: p.createdAt.toISOString(),
  };
}

router.get("/status-pages", requireAuth, async (req, res): Promise<void> => {
  const pages = await db.select().from(statusPagesTable).where(eq(statusPagesTable.userId, req.userId!));
  res.json(pages.map(formatPage));
});

router.post("/status-pages", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateStatusPageSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { categories = [], ...rest } = parsed.data;
  const allMonitorIds = Array.from(new Set([
    ...rest.monitorIds,
    ...categories.flatMap(c => c.monitorIds),
  ]));

  const [page] = await db.insert(statusPagesTable).values({
    id: crypto.randomUUID(),
    userId: req.userId!,
    ...rest,
    monitorIds: allMonitorIds,
    categories: categories as StatusPageCategory[],
  }).returning();

  res.status(201).json(formatPage(page));
});

router.put("/status-pages/:id", requireAuth, async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = UpdateStatusPageSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const existing = await db.select().from(statusPagesTable).where(
    and(eq(statusPagesTable.id, id), eq(statusPagesTable.userId, req.userId!))
  );
  if (!existing.length) { res.status(404).json({ error: "Not found" }); return; }

  const { categories = existing[0].categories as StatusPageCategory[], ...rest } = parsed.data;
  const allMonitorIds = Array.from(new Set([
    ...(rest.monitorIds ?? existing[0].monitorIds ?? []),
    ...categories.flatMap(c => c.monitorIds),
  ]));

  const [updated] = await db.update(statusPagesTable)
    .set({ ...rest, monitorIds: allMonitorIds, categories: categories as StatusPageCategory[] })
    .where(and(eq(statusPagesTable.id, id), eq(statusPagesTable.userId, req.userId!)))
    .returning();

  res.json(formatPage(updated));
});

router.delete("/status-pages/:id", requireAuth, async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await db.delete(statusPagesTable).where(
    and(eq(statusPagesTable.id, id), eq(statusPagesTable.userId, req.userId!))
  );
  res.status(204).end();
});

router.get("/status-pages/:slug/public", async (req, res): Promise<void> => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const pages = await db.select().from(statusPagesTable).where(
    and(eq(statusPagesTable.slug, slug), eq(statusPagesTable.isPublic, true))
  );

  if (!pages.length) { res.status(404).json({ error: "Status page not found" }); return; }

  const page = pages[0];
  const categories = (page.categories as StatusPageCategory[]) ?? [];
  const allIds = Array.from(new Set([
    ...(page.monitorIds ?? []),
    ...categories.flatMap(c => c.monitorIds),
  ]));

  let monitors: typeof monitorsTable.$inferSelect[] = [];
  if (allIds.length > 0) {
    monitors = await db.select().from(monitorsTable).where(inArray(monitorsTable.id, allIds));
  }

  const monitorMap = new Map(monitors.map(m => [m.id, m]));

  const monitorStatuses = monitors.map(m => ({
    id: m.id,
    name: m.name,
    status: m.isPaused ? "paused" as const : (m.status === "up" || m.status === "down" ? m.status : "up" as const),
    uptimePercent: m.uptimePercent ?? null,
    responseTime: m.responseTime ?? null,
  }));

  const categoriesWithStatus = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    monitors: cat.monitorIds.map(mid => {
      const m = monitorMap.get(mid);
      if (!m) return null;
      return {
        id: m.id,
        name: m.name,
        status: m.isPaused ? "paused" as const : (m.status === "up" || m.status === "down" ? m.status : "up" as const),
        uptimePercent: m.uptimePercent ?? null,
        responseTime: m.responseTime ?? null,
      };
    }).filter(Boolean),
  }));

  const anyDown = monitorStatuses.some(m => m.status === "down");
  const anyPaused = monitorStatuses.some(m => m.status === "paused");
  const overallStatus = anyDown ? "outage" : anyPaused ? "degraded" : "operational";

  res.json({
    name: page.name,
    description: page.description ?? null,
    monitors: monitorStatuses,
    categories: categoriesWithStatus,
    overallStatus,
  });
});

export default router;
