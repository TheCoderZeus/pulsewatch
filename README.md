# SkyWatch — API Uptime Monitor

A full-stack, production-ready uptime monitoring SaaS built with **React + Vite** (frontend), **Express 5** (API), **PostgreSQL + Drizzle ORM** (database), and **Supabase Auth** (authentication).

---

## Table of Contents

- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Deploy to Vercel (Frontend)](#deploy-to-vercel-frontend)
- [Deploy to Heroku (Backend)](#deploy-to-heroku-backend)
- [Deploy to Railway (Full Stack)](#deploy-to-railway-full-stack)
- [Deploy to Render (Full Stack)](#deploy-to-render-full-stack)
- [Post-Deploy Checklist](#post-deploy-checklist)

---

## Project Structure

```
/
├── artifacts/
│   ├── uptime-monitor/   # React + Vite frontend (SkyWatch UI)
│   └── api-server/       # Express 5 API server
├── lib/
│   ├── db/               # Drizzle ORM schema + PostgreSQL client
│   ├── api-spec/         # OpenAPI spec + codegen config
│   ├── api-client-react/ # Generated React Query hooks
│   └── api-zod/          # Generated Zod schemas
├── vercel.json           # Vercel deploy config (frontend)
├── Procfile              # Heroku process file (backend)
└── app.json              # Heroku app manifest
```

---

## Environment Variables

### Frontend (`artifacts/uptime-monitor`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Full URL of your deployed API server | `https://skywatch-api.railway.app` |
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJ...` |

### Backend (`artifacts/api-server`)

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `SUPABASE_URL` | Your Supabase project URL | `https://xxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (secret!) | `eyJ...` |
| `FRONTEND_URL` | URL of the deployed frontend (for CORS) | `https://skywatch.vercel.app` |
| `PORT` | Port for the API server (auto-set on most platforms) | `8080` |

> **Note:** Get your Supabase keys from: [supabase.com](https://supabase.com) → your project → Settings → API

---

## Deploy to Vercel (Frontend)

The frontend is a static React + Vite SPA. Vercel is the easiest option.

### Steps

**1. Install Vercel CLI (optional)**
```bash
npm i -g vercel
```

**2. Push your code to GitHub**
```bash
git add -A && git commit -m "ready for deploy"
git push origin main
```

**3. Connect repo on Vercel**
- Go to [vercel.com/new](https://vercel.com/new)
- Import your GitHub repository
- **Framework Preset:** Vite
- **Root Directory:** `artifacts/uptime-monitor`
- **Build Command:** `pnpm --filter @workspace/uptime-monitor run build`
- **Output Directory:** `artifacts/uptime-monitor/dist/public`
- **Install Command:** `pnpm install`

**4. Set environment variables**

In Vercel → Project → Settings → Environment Variables, add:
```
VITE_API_URL        = https://your-api-url.com
VITE_SUPABASE_URL   = https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY = eyJ...
```

**5. Deploy**
- Click **Deploy** — Vercel will build and deploy automatically.
- All routes are handled by `vercel.json` (already included in the repo):

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**6. Set your domain**
- In Vercel → Project → Settings → Domains → Add your custom domain.
- Update `FRONTEND_URL` on your backend to the new domain.

---

## Deploy to Heroku (Backend)

The API server uses a `Procfile` for Heroku.

### Steps

**1. Install Heroku CLI**
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows / Linux: https://devcenter.heroku.com/articles/heroku-cli
```

**2. Login and create app**
```bash
heroku login
heroku create skywatch-api
```

**3. Add PostgreSQL**
```bash
heroku addons:create heroku-postgresql:essential-0 --app skywatch-api
```
This automatically sets `DATABASE_URL`.

**4. Set environment variables**
```bash
heroku config:set \
  SUPABASE_URL=https://xxxx.supabase.co \
  SUPABASE_ANON_KEY=eyJ... \
  SUPABASE_SERVICE_ROLE_KEY=eyJ... \
  FRONTEND_URL=https://your-vercel-app.vercel.app \
  --app skywatch-api
```

**5. Deploy**
```bash
git push heroku main
```

The `Procfile` runs:
```
web: pnpm --filter @workspace/api-server run start:prod
```

And `heroku-postbuild` in `package.json` handles the build step automatically.

**6. Run database migrations**
```bash
heroku run pnpm --filter @workspace/db run push --app skywatch-api
```

**7. Check logs**
```bash
heroku logs --tail --app skywatch-api
```

---

## Deploy to Railway (Full Stack)

Railway can host both the API and optionally the frontend in one project with a free PostgreSQL add-on.

### API Server on Railway

**1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub repo**

**2. Add a PostgreSQL database**
- In your project, click **+ New** → **Database** → **PostgreSQL**
- Railway auto-sets `DATABASE_URL` in your service environment.

**3. Create the API service**
- Click **+ New** → **GitHub Repo** → select your repo
- **Root Directory:** `artifacts/api-server` *(or leave blank and override commands)*
- **Build Command:** `pnpm install && pnpm --filter @workspace/api-server run build`
- **Start Command:** `node artifacts/api-server/dist/index.mjs`

**4. Set environment variables** in the Railway service dashboard:
```
SUPABASE_URL             = https://xxxx.supabase.co
SUPABASE_ANON_KEY        = eyJ...
SUPABASE_SERVICE_ROLE_KEY = eyJ...
FRONTEND_URL             = https://your-frontend.vercel.app
```
> `DATABASE_URL` and `PORT` are set automatically by Railway.

**5. Run database migrations**
```bash
# Via Railway CLI
railway run pnpm --filter @workspace/db run push
```

### Frontend on Railway (optional)

- Add another service from the same repo
- **Build Command:** `pnpm install && pnpm --filter @workspace/uptime-monitor run build`
- **Start Command:** `npx serve -s artifacts/uptime-monitor/dist/public -l $PORT`
- Set the same frontend env vars as in the Vercel section above.

---

## Deploy to Render (Full Stack)

Render supports both static sites (frontend) and web services (backend) with a free PostgreSQL tier.

### Backend — Web Service

**1. Go to [render.com](https://render.com) → New → Web Service**

**2. Connect your GitHub repo**

**3. Configure:**
| Setting | Value |
|---|---|
| **Name** | `skywatch-api` |
| **Runtime** | `Node` |
| **Build Command** | `pnpm install && pnpm --filter @workspace/api-server run build` |
| **Start Command** | `node artifacts/api-server/dist/index.mjs` |

**4. Add PostgreSQL**
- Render → New → PostgreSQL
- Choose the **Free** tier
- Copy the **Internal Database URL** into your web service's `DATABASE_URL` env var.

**5. Set environment variables** in the service dashboard:
```
DATABASE_URL              = postgresql://...  (from Render Postgres)
SUPABASE_URL              = https://xxxx.supabase.co
SUPABASE_ANON_KEY         = eyJ...
SUPABASE_SERVICE_ROLE_KEY = eyJ...
FRONTEND_URL              = https://skywatch.onrender.com
```

**6. Run database migrations** via Render Shell:
```bash
pnpm --filter @workspace/db run push
```

### Frontend — Static Site

**1. Render → New → Static Site**

**2. Connect your GitHub repo**

**3. Configure:**
| Setting | Value |
|---|---|
| **Name** | `skywatch-ui` |
| **Build Command** | `pnpm install && pnpm --filter @workspace/uptime-monitor run build` |
| **Publish Directory** | `artifacts/uptime-monitor/dist/public` |

**4. Set environment variables:**
```
VITE_API_URL           = https://skywatch-api.onrender.com
VITE_SUPABASE_URL      = https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY = eyJ...
```

**5. Add rewrite rule** (Render → Static Site → Redirects/Rewrites):
| Source | Destination | Type |
|---|---|---|
| `/*` | `/index.html` | Rewrite |

---

## Post-Deploy Checklist

After deploying to any platform, verify:

- [ ] `GET /api/health` returns `200` on your API URL
- [ ] Frontend loads and the login form works
- [ ] Create a test monitor and confirm it starts checking
- [ ] Send a test alert to confirm notifications are delivered
- [ ] Set `FRONTEND_URL` on the backend to your actual frontend domain (required for CORS)
- [ ] Confirm Supabase Auth redirect URLs include your domain:
  - Supabase Dashboard → Auth → URL Configuration → Site URL → add your deployed URL
  - Also add your URL to the **Redirect URLs** whitelist

---

## Supabase Auth Configuration

After deploying, update Supabase to allow your production URLs:

1. Go to [supabase.com](https://supabase.com) → your project → **Authentication → URL Configuration**
2. Set **Site URL** to your frontend URL (e.g. `https://skywatch.vercel.app`)
3. Add to **Redirect URLs**:
   - `https://skywatch.vercel.app/**`
   - `https://your-custom-domain.com/**`

---

## Local Development

```bash
# Install dependencies
pnpm install

# Copy environment files
cp artifacts/api-server/.env.example artifacts/api-server/.env
cp artifacts/uptime-monitor/.env.example artifacts/uptime-monitor/.env
# Fill in your Supabase credentials

# Push database schema
pnpm --filter @workspace/db run push

# Start all services
pnpm run dev
```

The frontend runs at `http://localhost:PORT` and the API at `http://localhost:8080`.

---

## License

MIT
