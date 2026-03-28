import { pgTable, text, integer, boolean, timestamp, real, pgEnum, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const monitorTypeEnum = pgEnum("monitor_type", ["http", "https", "ping", "port"]);
export const checkTypeEnum = pgEnum("check_type", ["api", "page"]);
export const monitorStatusEnum = pgEnum("monitor_status", ["up", "down", "paused", "pending"]);
export const checkStatusEnum = pgEnum("check_status", ["up", "down"]);
export const incidentStatusEnum = pgEnum("incident_status", ["ongoing", "resolved"]);
export const alertTypeEnum = pgEnum("alert_type", ["down", "recovered", "slow"]);
export const planEnum = pgEnum("plan", ["free", "pro", "enterprise"]);

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  plan: planEnum("plan").notNull().default("free"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const monitorsTable = pgTable("monitors", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  url: text("url").notNull(),
  type: monitorTypeEnum("type").notNull().default("https"),
  checkType: checkTypeEnum("check_type").notNull().default("api"),
  interval: integer("interval").notNull().default(60),
  status: monitorStatusEnum("status").notNull().default("pending"),
  responseTime: integer("response_time"),
  uptimePercent: real("uptime_percent"),
  lastCheckedAt: timestamp("last_checked_at"),
  isPaused: boolean("is_paused").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const checksTable = pgTable("checks", {
  id: text("id").primaryKey(),
  monitorId: text("monitor_id").notNull().references(() => monitorsTable.id, { onDelete: "cascade" }),
  status: checkStatusEnum("status").notNull(),
  responseTime: integer("response_time"),
  statusCode: integer("status_code"),
  checkedAt: timestamp("checked_at").defaultNow().notNull(),
  error: text("error"),
});

export const incidentsTable = pgTable("incidents", {
  id: text("id").primaryKey(),
  monitorId: text("monitor_id").notNull().references(() => monitorsTable.id, { onDelete: "cascade" }),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
  duration: integer("duration"),
  status: incidentStatusEnum("status").notNull().default("ongoing"),
});

export type StatusPageCategory = {
  id: string;
  name: string;
  monitorIds: string[];
};

export const statusPagesTable = pgTable("status_pages", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  isPublic: boolean("is_public").notNull().default(true),
  monitorIds: text("monitor_ids").array().notNull().default([]),
  categories: json("categories").$type<StatusPageCategory[]>().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notificationSettingsTable = pgTable("notification_settings", {
  userId: text("user_id").primaryKey().references(() => usersTable.id, { onDelete: "cascade" }),
  emailEnabled: boolean("email_enabled").notNull().default(false),
  emailAddress: text("email_address"),
  webhookEnabled: boolean("webhook_enabled").notNull().default(false),
  webhookUrl: text("webhook_url"),
  discordEnabled: boolean("discord_enabled").notNull().default(false),
  discordWebhookUrl: text("discord_webhook_url"),
  inAppEnabled: boolean("in_app_enabled").notNull().default(true),
});

export const alertsTable = pgTable("alerts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  monitorId: text("monitor_id").notNull().references(() => monitorsTable.id, { onDelete: "cascade" }),
  type: alertTypeEnum("type").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMonitorSchema = createInsertSchema(monitorsTable).omit({ id: true, userId: true, createdAt: true });
export const insertCheckSchema = createInsertSchema(checksTable).omit({ id: true });

export type User = typeof usersTable.$inferSelect;
export type Monitor = typeof monitorsTable.$inferSelect;
export type Check = typeof checksTable.$inferSelect;
export type Incident = typeof incidentsTable.$inferSelect;
export type StatusPage = typeof statusPagesTable.$inferSelect;
export type NotificationSettings = typeof notificationSettingsTable.$inferSelect;
export type Alert = typeof alertsTable.$inferSelect;
