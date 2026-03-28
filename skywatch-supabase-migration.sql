-- ================================================================
-- SkyWatch — Supabase Migration SQL
-- Run this in the Supabase SQL Editor to set up the full schema.
-- ================================================================

-- ── Extensions ────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Enum types ────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE monitor_type     AS ENUM ('http', 'https', 'ping', 'port');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE check_type       AS ENUM ('api', 'page');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE monitor_status   AS ENUM ('up', 'down', 'paused', 'pending');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE check_status     AS ENUM ('up', 'down');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE incident_status  AS ENUM ('ongoing', 'resolved');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE alert_type       AS ENUM ('down', 'recovered', 'slow');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE plan             AS ENUM ('free', 'pro', 'enterprise');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ── Tables ────────────────────────────────────────────────────────

-- users
-- Note: Supabase handles auth via auth.users. This table stores profile/plan data.
-- The id here maps to auth.users.id (UUID from Supabase Auth).
CREATE TABLE IF NOT EXISTS users (
  id          TEXT        PRIMARY KEY,
  email       TEXT        NOT NULL UNIQUE,
  name        TEXT        NOT NULL,
  plan        plan        NOT NULL DEFAULT 'free',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- monitors
CREATE TABLE IF NOT EXISTS monitors (
  id               TEXT            PRIMARY KEY,
  user_id          TEXT            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name             TEXT            NOT NULL,
  url              TEXT            NOT NULL,
  type             monitor_type    NOT NULL DEFAULT 'https',
  check_type       check_type      NOT NULL DEFAULT 'api',
  interval         INTEGER         NOT NULL DEFAULT 60,
  status           monitor_status  NOT NULL DEFAULT 'pending',
  response_time    INTEGER,
  uptime_percent   REAL,
  last_checked_at  TIMESTAMPTZ,
  is_paused        BOOLEAN         NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- checks  (historical ping results)
CREATE TABLE IF NOT EXISTS checks (
  id             TEXT          PRIMARY KEY,
  monitor_id     TEXT          NOT NULL REFERENCES monitors(id) ON DELETE CASCADE,
  status         check_status  NOT NULL,
  response_time  INTEGER,
  status_code    INTEGER,
  checked_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  error          TEXT
);

-- incidents
CREATE TABLE IF NOT EXISTS incidents (
  id           TEXT             PRIMARY KEY,
  monitor_id   TEXT             NOT NULL REFERENCES monitors(id) ON DELETE CASCADE,
  started_at   TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  resolved_at  TIMESTAMPTZ,
  duration     INTEGER,
  status       incident_status  NOT NULL DEFAULT 'ongoing'
);

-- status_pages
-- categories is a JSONB array: [{ "id": "...", "name": "...", "monitorIds": [...] }]
CREATE TABLE IF NOT EXISTS status_pages (
  id           TEXT        PRIMARY KEY,
  user_id      TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name         TEXT        NOT NULL,
  slug         TEXT        NOT NULL UNIQUE,
  description  TEXT,
  is_public    BOOLEAN     NOT NULL DEFAULT TRUE,
  monitor_ids  TEXT[]      NOT NULL DEFAULT '{}',
  categories   JSONB       NOT NULL DEFAULT '[]',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- notification_settings  (one row per user)
CREATE TABLE IF NOT EXISTS notification_settings (
  user_id              TEXT     PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  email_enabled        BOOLEAN  NOT NULL DEFAULT FALSE,
  email_address        TEXT,
  webhook_enabled      BOOLEAN  NOT NULL DEFAULT FALSE,
  webhook_url          TEXT,
  discord_enabled      BOOLEAN  NOT NULL DEFAULT FALSE,
  discord_webhook_url  TEXT,
  in_app_enabled       BOOLEAN  NOT NULL DEFAULT TRUE
);

-- alerts  (in-app notification feed)
CREATE TABLE IF NOT EXISTS alerts (
  id          TEXT        PRIMARY KEY,
  user_id     TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  monitor_id  TEXT        NOT NULL REFERENCES monitors(id) ON DELETE CASCADE,
  type        alert_type  NOT NULL,
  message     TEXT        NOT NULL,
  is_read     BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ───────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_monitors_user_id         ON monitors(user_id);
CREATE INDEX IF NOT EXISTS idx_monitors_status          ON monitors(status);
CREATE INDEX IF NOT EXISTS idx_checks_monitor_id        ON checks(monitor_id);
CREATE INDEX IF NOT EXISTS idx_checks_checked_at        ON checks(checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_incidents_monitor_id     ON incidents(monitor_id);
CREATE INDEX IF NOT EXISTS idx_incidents_status         ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_status_pages_slug        ON status_pages(slug);
CREATE INDEX IF NOT EXISTS idx_status_pages_user_id     ON status_pages(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id           ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_is_read           ON alerts(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_alerts_monitor_id        ON alerts(monitor_id);

-- ── Row Level Security (RLS) ──────────────────────────────────────
-- Enable RLS on all tables so users can only access their own data.

ALTER TABLE users                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitors               ENABLE ROW LEVEL SECURITY;
ALTER TABLE checks                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents              ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_pages           ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts                 ENABLE ROW LEVEL SECURITY;

-- Users: can only read/update their own row
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (id = auth.uid()::text);

CREATE POLICY "users_insert_own" ON users
  FOR INSERT WITH CHECK (id = auth.uid()::text);

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (id = auth.uid()::text);

-- Monitors: full CRUD for owner
CREATE POLICY "monitors_select_own" ON monitors
  FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "monitors_insert_own" ON monitors
  FOR INSERT WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "monitors_update_own" ON monitors
  FOR UPDATE USING (user_id = auth.uid()::text);

CREATE POLICY "monitors_delete_own" ON monitors
  FOR DELETE USING (user_id = auth.uid()::text);

-- Checks: owner can read checks for their monitors
CREATE POLICY "checks_select_own" ON checks
  FOR SELECT USING (
    monitor_id IN (SELECT id FROM monitors WHERE user_id = auth.uid()::text)
  );

CREATE POLICY "checks_insert_own" ON checks
  FOR INSERT WITH CHECK (
    monitor_id IN (SELECT id FROM monitors WHERE user_id = auth.uid()::text)
  );

-- Incidents: owner access
CREATE POLICY "incidents_select_own" ON incidents
  FOR SELECT USING (
    monitor_id IN (SELECT id FROM monitors WHERE user_id = auth.uid()::text)
  );

CREATE POLICY "incidents_insert_own" ON incidents
  FOR INSERT WITH CHECK (
    monitor_id IN (SELECT id FROM monitors WHERE user_id = auth.uid()::text)
  );

CREATE POLICY "incidents_update_own" ON incidents
  FOR UPDATE USING (
    monitor_id IN (SELECT id FROM monitors WHERE user_id = auth.uid()::text)
  );

-- Status pages: owner manages, public pages readable by anyone
CREATE POLICY "status_pages_select_own" ON status_pages
  FOR SELECT USING (user_id = auth.uid()::text OR is_public = TRUE);

CREATE POLICY "status_pages_insert_own" ON status_pages
  FOR INSERT WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "status_pages_update_own" ON status_pages
  FOR UPDATE USING (user_id = auth.uid()::text);

CREATE POLICY "status_pages_delete_own" ON status_pages
  FOR DELETE USING (user_id = auth.uid()::text);

-- Notification settings
CREATE POLICY "notif_settings_select_own" ON notification_settings
  FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "notif_settings_insert_own" ON notification_settings
  FOR INSERT WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "notif_settings_update_own" ON notification_settings
  FOR UPDATE USING (user_id = auth.uid()::text);

-- Alerts
CREATE POLICY "alerts_select_own" ON alerts
  FOR SELECT USING (user_id = auth.uid()::text);

CREATE POLICY "alerts_insert_own" ON alerts
  FOR INSERT WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "alerts_update_own" ON alerts
  FOR UPDATE USING (user_id = auth.uid()::text);

CREATE POLICY "alerts_delete_own" ON alerts
  FOR DELETE USING (user_id = auth.uid()::text);

-- ── Supabase Auth trigger ─────────────────────────────────────────
-- Automatically creates a users row when a new Supabase auth user signs up.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, plan)
  VALUES (
    NEW.id::text,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'free'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
