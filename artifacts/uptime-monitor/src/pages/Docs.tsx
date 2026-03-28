import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import {
  Search, Activity, Bell, BarChart3, Globe, Shield, Zap, Clock,
  Server, CheckCircle2, AlertTriangle, Key, ChevronRight,
  Menu, X, ExternalLink, BookOpen, Layers, CreditCard, HelpCircle,
  Terminal, ArrowRight, Crown,
} from "lucide-react";

function SkyWatchLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M4 22 Q16 4 28 22" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 23 Q16 11 24 23" stroke="#7dd3fc" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <path d="M12 24 Q16 17 20 24" stroke="#bae6fd" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <circle cx="16" cy="24" r="2" fill="#38bdf8" />
    </svg>
  );
}

type Section = {
  id: string;
  label: string;
  icon: React.ReactNode;
  subsections: { id: string; label: string }[];
};

const NAV: Section[] = [
  {
    id: "getting-started",
    label: "Getting Started",
    icon: <BookOpen className="w-4 h-4" />,
    subsections: [
      { id: "introduction", label: "Introduction" },
      { id: "quick-setup", label: "Quick Setup" },
      { id: "first-monitor", label: "Your First Monitor" },
    ],
  },
  {
    id: "monitors",
    label: "Monitors",
    icon: <Activity className="w-4 h-4" />,
    subsections: [
      { id: "creating-monitors", label: "Creating a Monitor" },
      { id: "check-types", label: "Check Types" },
      { id: "check-intervals", label: "Check Intervals" },
      { id: "status-codes", label: "Expected Status Codes" },
    ],
  },
  {
    id: "alerts",
    label: "Alerts & Notifications",
    icon: <Bell className="w-4 h-4" />,
    subsections: [
      { id: "email-alerts", label: "Email Alerts" },
      { id: "webhooks", label: "Webhooks" },
      { id: "discord-slack", label: "Discord & Slack" },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart3 className="w-4 h-4" />,
    subsections: [
      { id: "uptime-reports", label: "Uptime Reports" },
      { id: "response-times", label: "Response Time Charts" },
      { id: "incidents", label: "Incident History" },
    ],
  },
  {
    id: "status-pages",
    label: "Status Pages",
    icon: <Globe className="w-4 h-4" />,
    subsections: [
      { id: "creating-page", label: "Creating a Status Page" },
      { id: "custom-domain", label: "Custom Domain" },
      { id: "branding", label: "Branding & Theming" },
    ],
  },
  {
    id: "plans",
    label: "Plans & Pricing",
    icon: <CreditCard className="w-4 h-4" />,
    subsections: [
      { id: "hobby", label: "Hobby (Free)" },
      { id: "pro", label: "Pro ($29/mo)" },
      { id: "enterprise", label: "Enterprise ($99/mo)" },
    ],
  },
  {
    id: "security",
    label: "Security",
    icon: <Shield className="w-4 h-4" />,
    subsections: [
      { id: "account-security", label: "Account Security" },
      { id: "data-protection", label: "Data Protection" },
      { id: "delete-account", label: "Deleting Your Account" },
    ],
  },
  {
    id: "faq",
    label: "FAQ",
    icon: <HelpCircle className="w-4 h-4" />,
    subsections: [
      { id: "general-faq", label: "General Questions" },
      { id: "billing-faq", label: "Billing Questions" },
      { id: "technical-faq", label: "Technical Questions" },
    ],
  },
];

type ContentSection = {
  id: string;
  title: string;
  badge?: string;
  content: React.ReactNode;
};

function CodeBlock({ children, lang = "bash" }: { children: string; lang?: string }) {
  return (
    <div className="mt-3 rounded-xl overflow-hidden border border-white/8">
      <div className="flex items-center gap-2 px-4 py-2 bg-white/3 border-b border-white/6">
        <Terminal className="w-3.5 h-3.5 text-gray-500" />
        <span className="text-xs text-gray-500 font-mono">{lang}</span>
      </div>
      <pre className="p-4 text-sm font-mono text-gray-300 bg-[#080a10] overflow-x-auto leading-relaxed">
        {children}
      </pre>
    </div>
  );
}

function InfoBox({ icon, title, children, color = "sky" }: {
  icon: React.ReactNode; title: string; children: React.ReactNode; color?: "sky" | "amber" | "green" | "red";
}) {
  const colors = {
    sky: "border-sky-500/20 bg-sky-500/5 text-sky-400",
    amber: "border-amber-500/20 bg-amber-500/5 text-amber-400",
    green: "border-green-500/20 bg-green-500/5 text-green-400",
    red: "border-red-500/20 bg-red-500/5 text-red-400",
  };
  return (
    <div className={`mt-4 p-4 rounded-xl border ${colors[color]} text-sm`}>
      <div className="flex items-center gap-2 font-semibold mb-1">
        {icon}
        {title}
      </div>
      <div className="text-gray-400">{children}</div>
    </div>
  );
}

function PlanCard({ name, price, features, highlight }: { name: string; price: string; features: string[]; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-5 border ${highlight ? "border-sky-500/30 bg-sky-500/5" : "border-white/8 bg-white/3"}`}>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-xl font-bold text-white">{price}</span>
        {price !== "Free" && <span className="text-xs text-gray-500">/mo</span>}
      </div>
      <p className="font-semibold text-white mb-3">{name}</p>
      <ul className="space-y-2">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
            <CheckCircle2 className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

const ALL_CONTENT: ContentSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    badge: "Getting Started",
    content: (
      <div className="space-y-4 text-gray-400 leading-relaxed text-sm">
        <p>
          <strong className="text-white">SkyWatch</strong> is a high-frequency synthetic monitoring platform for APIs, websites,
          and servers. It continuously checks your configured endpoints and alerts you the moment something goes wrong —
          before your users notice.
        </p>
        <p>
          With SkyWatch you get real-time uptime monitoring, beautiful analytics, multi-channel alert routing, and
          public status pages — all in one place.
        </p>
        <div className="grid grid-cols-2 gap-4 mt-6">
          {[
            { icon: <Activity className="w-5 h-5 text-sky-400" />, label: "Real-Time Checks", desc: "Checks every 30 seconds from global regions" },
            { icon: <Bell className="w-5 h-5 text-amber-400" />, label: "Instant Alerts", desc: "Notified in under 60 seconds of downtime" },
            { icon: <BarChart3 className="w-5 h-5 text-blue-400" />, label: "1-Year History", desc: "Full analytics and trend reports" },
            { icon: <Globe className="w-5 h-5 text-teal-400" />, label: "Status Pages", desc: "Custom branded public status pages" },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/3 border border-white/6">
              {item.icon}
              <p className="text-white font-medium text-sm mt-2">{item.label}</p>
              <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "quick-setup",
    title: "Quick Setup",
    badge: "Getting Started",
    content: (
      <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
        <p>Get up and running with SkyWatch in under 2 minutes:</p>
        <ol className="space-y-4">
          {[
            { step: "1", title: "Create an account", desc: "Sign up at skywatch.app. No credit card required for the free Hobby plan." },
            { step: "2", title: "Add your first monitor", desc: "Go to Monitors → New Monitor. Enter the URL you want to watch." },
            { step: "3", title: "Set up alerts", desc: "Go to Notifications and connect your email, Discord, or webhook." },
            { step: "4", title: "Monitor your uptime", desc: "SkyWatch starts checking immediately. View results on the Dashboard." },
          ].map((item) => (
            <li key={item.step} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-sky-500/15 border border-sky-500/20 text-sky-400 font-bold text-sm flex items-center justify-center shrink-0">
                {item.step}
              </div>
              <div>
                <p className="text-white font-medium">{item.title}</p>
                <p className="text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    ),
  },
  {
    id: "first-monitor",
    title: "Your First Monitor",
    badge: "Getting Started",
    content: (
      <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
        <p>After signing in, navigate to <strong className="text-white">Monitors</strong> and click <strong className="text-white">New Monitor</strong>. Fill in the required fields:</p>
        <ul className="space-y-2">
          {[
            { field: "Name", desc: "A friendly name like 'Production API' or 'Landing Page'." },
            { field: "URL", desc: "The full URL to check, e.g. https://api.example.com/health." },
            { field: "Method", desc: "HTTP method to use (GET, POST, HEAD, etc.)." },
            { field: "Expected Status", desc: "The HTTP status code that means the service is up (usually 200)." },
            { field: "Check Interval", desc: "How often to check — 30s on Enterprise, 1min on Pro, 5min on Hobby." },
          ].map((item) => (
            <li key={item.field} className="flex gap-3">
              <span className="text-sky-400 font-mono font-semibold w-32 shrink-0">{item.field}</span>
              <span>{item.desc}</span>
            </li>
          ))}
        </ul>
        <InfoBox icon={<CheckCircle2 className="w-4 h-4" />} title="Tip" color="green">
          Use a dedicated <code className="font-mono text-xs">/health</code> or <code className="font-mono text-xs">/ping</code> endpoint that is lightweight and returns quickly. Avoid endpoints that trigger heavy database queries.
        </InfoBox>
      </div>
    ),
  },
  {
    id: "creating-monitors",
    title: "Creating a Monitor",
    badge: "Monitors",
    content: (
      <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
        <p>
          Monitors are the core of SkyWatch. Each monitor represents one URL or endpoint that SkyWatch polls at your
          configured interval from multiple global regions.
        </p>
        <p>
          When a monitor fails (response doesn't match expected status, or times out), an incident is automatically
          created and alerts are sent through your configured notification channels.
        </p>
        <InfoBox icon={<Layers className="w-4 h-4" />} title="Monitor Limits by Plan" color="sky">
          Hobby: 5 monitors · Pro: 50 monitors · Enterprise: Unlimited
        </InfoBox>
      </div>
    ),
  },
  {
    id: "check-types",
    title: "Check Types",
    badge: "Monitors",
    content: (
      <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
        <p>SkyWatch supports the following check types:</p>
        <div className="space-y-3">
          {[
            { type: "HTTP/HTTPS", desc: "Standard web endpoint check. Validates status code, response time, and optionally response body content." },
            { type: "HEAD", desc: "Lightweight check that only fetches headers. Useful for large files or CDN endpoints." },
            { type: "POST", desc: "Send a POST request with a JSON body. Useful for API endpoints that require input." },
          ].map((item) => (
            <div key={item.type} className="p-4 rounded-xl bg-white/3 border border-white/6">
              <div className="flex items-center gap-2 mb-1">
                <Server className="w-4 h-4 text-sky-400" />
                <span className="font-mono font-semibold text-white text-xs">{item.type}</span>
              </div>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "check-intervals",
    title: "Check Intervals",
    badge: "Monitors",
    content: (
      <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
        <p>The check interval controls how frequently SkyWatch pings your endpoint:</p>
        <div className="overflow-hidden rounded-xl border border-white/8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/3 border-b border-white/6">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Plan</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Min Interval</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Monitors</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {[
                { plan: "Hobby", interval: "5 minutes", monitors: "5" },
                { plan: "Pro", interval: "1 minute", monitors: "50" },
                { plan: "Enterprise", interval: "30 seconds", monitors: "Unlimited" },
              ].map((row) => (
                <tr key={row.plan}>
                  <td className="px-4 py-3 text-white">{row.plan}</td>
                  <td className="px-4 py-3 font-mono text-sky-400">{row.interval}</td>
                  <td className="px-4 py-3 text-gray-400">{row.monitors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    id: "status-codes",
    title: "Expected Status Codes",
    badge: "Monitors",
    content: (
      <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
        <p>
          When creating a monitor, you specify the HTTP status code that indicates your service is healthy. Any response
          with a different status code, or a timeout, triggers an incident.
        </p>
        <p>Common expected status codes:</p>
        <ul className="space-y-1.5">
          {[
            { code: "200 OK", desc: "Most common — successful GET request" },
            { code: "201 Created", desc: "POST endpoints that create resources" },
            { code: "204 No Content", desc: "Health check endpoints that return no body" },
            { code: "301/302", desc: "Redirect endpoints — only if you expect the redirect itself" },
          ].map((item) => (
            <li key={item.code} className="flex items-center gap-3">
              <code className="font-mono text-xs bg-white/5 px-2 py-1 rounded text-sky-300 w-32 shrink-0">{item.code}</code>
              <span>{item.desc}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "email-alerts",
    title: "Email Alerts",
    badge: "Alerts",
    content: (
      <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
        <p>
          Email alerts are available on all plans. When a monitor goes down, SkyWatch immediately sends an alert email
          to your registered address. When it recovers, a recovery email is sent automatically.
        </p>
        <p>Email notifications include:</p>
        <ul className="space-y-1 list-disc pl-5 text-gray-400">
          <li>Monitor name and URL</li>
          <li>Time of incident and duration</li>
          <li>HTTP status code received vs. expected</li>
          <li>Response time at the time of failure</li>
        </ul>
        <InfoBox icon={<Bell className="w-4 h-4" />} title="Alert Delay" color="amber">
          Alerts are sent after 2 consecutive failed checks to avoid false positives from transient network issues.
        </InfoBox>
      </div>
    ),
  },
  {
    id: "webhooks",
    title: "Webhooks",
    badge: "Alerts",
    content: (
      <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
        <p>
          Webhooks let you integrate SkyWatch with any system. When a monitor changes state (down or recovered), a POST
          request is sent to your configured URL with a JSON payload.
        </p>
        <p>Example webhook payload:</p>
        <CodeBlock lang="json">{`{
  "event": "monitor.down",
  "monitor": {
    "id": "mon_abc123",
    "name": "Production API",
    "url": "https://api.example.com/health"
  },
  "incident": {
    "startedAt": "2026-03-28T12:00:00Z",
    "statusCode": 503,
    "responseTime": null
  }
}`}</CodeBlock>
      </div>
    ),
  },
  {
    id: "discord-slack",
    title: "Discord & Slack",
    badge: "Alerts",
    content: (
      <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
        <p>Connect your Discord or Slack workspace to receive rich, formatted alert messages with one click.</p>
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-white/3 border border-white/6">
            <p className="text-white font-medium mb-1">Discord</p>
            <ol className="space-y-1 list-decimal pl-4 text-gray-500">
              <li>Go to your Discord channel settings → Integrations → Webhooks</li>
              <li>Create a new webhook and copy the URL</li>
              <li>Paste it in SkyWatch → Notifications → Add Discord Webhook</li>
            </ol>
          </div>
          <div className="p-4 rounded-xl bg-white/3 border border-white/6">
            <p className="text-white font-medium mb-1">Slack</p>
            <ol className="space-y-1 list-decimal pl-4 text-gray-500">
              <li>Create a Slack Incoming Webhook in your workspace</li>
              <li>Copy the webhook URL</li>
              <li>Paste it in SkyWatch → Notifications → Add Slack Webhook</li>
            </ol>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "uptime-reports",
    title: "Uptime Reports",
    badge: "Analytics",
    content: (
      <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
        <p>
          The Dashboard shows your overall uptime percentage across all monitors. The Monitor Detail page shows a
          detailed timeline for each monitor, including all incidents and check results.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "99.99%", label: "Our platform uptime SLA" },
            { value: "1yr", label: "Data retention on Pro" },
            { value: "12+", label: "Global check regions" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-xl bg-white/3 border border-white/6">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "response-times",
    title: "Response Time Charts",
    badge: "Analytics",
    content: (
      <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
        <p>
          For each monitor, SkyWatch charts response times over time. You can view trends over 24 hours, 7 days, or
          30 days to identify degradations before they become outages.
        </p>
        <p>Metrics tracked per check:</p>
        <ul className="space-y-1 list-disc pl-5">
          <li>Total response time (ms)</li>
          <li>HTTP status code returned</li>
          <li>Pass / fail result</li>
          <li>Check timestamp (UTC)</li>
        </ul>
      </div>
    ),
  },
  {
    id: "incidents",
    title: "Incident History",
    badge: "Analytics",
    content: (
      <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
        <p>
          Every outage detected by SkyWatch creates an incident. Incidents are stored in your account and visible from
          the Incidents page. Each incident includes start time, end time (if resolved), duration, and the affected monitor.
        </p>
        <InfoBox icon={<AlertTriangle className="w-4 h-4" />} title="Incident Resolution" color="amber">
          Incidents are automatically closed when the monitor recovers (returns the expected status code again).
        </InfoBox>
      </div>
    ),
  },
  {
    id: "creating-page",
    title: "Creating a Status Page",
    badge: "Status Pages",
    content: (
      <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
        <p>
          Public Status Pages let your users see the current health of your services without logging in. They're
          automatically updated in real-time as SkyWatch checks run.
        </p>
        <p>To create a status page:</p>
        <ol className="space-y-2 list-decimal pl-5">
          <li>Go to <strong className="text-white">Status Pages</strong> in the sidebar</li>
          <li>Click <strong className="text-white">New Status Page</strong></li>
          <li>Give it a name and a unique slug (e.g. <code className="font-mono text-xs">status.example.com</code>)</li>
          <li>Add monitors to display on the page</li>
          <li>Your page is live at <code className="font-mono text-xs">skywatch.app/status/your-slug</code></li>
        </ol>
      </div>
    ),
  },
  {
    id: "custom-domain",
    title: "Custom Domain",
    badge: "Status Pages",
    content: (
      <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
        <p>
          Pro and Enterprise plans can configure a custom domain for their status page (e.g.{" "}
          <code className="font-mono text-xs">status.yourcompany.com</code>).
        </p>
        <ol className="space-y-2 list-decimal pl-5">
          <li>Go to your Status Page settings</li>
          <li>Enter your custom domain</li>
          <li>Add a CNAME record pointing to <code className="font-mono text-xs">cname.skywatch.app</code></li>
          <li>TLS is provisioned automatically</li>
        </ol>
        <InfoBox icon={<Crown className="w-4 h-4" />} title="Pro Feature" color="sky">
          Custom domains require a Pro or Enterprise plan.
        </InfoBox>
      </div>
    ),
  },
  {
    id: "branding",
    title: "Branding & Theming",
    badge: "Status Pages",
    content: (
      <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
        <p>
          Enterprise users can white-label status pages with custom logos, colors, and remove all SkyWatch branding.
          Pro users can add a custom logo.
        </p>
      </div>
    ),
  },
  {
    id: "hobby",
    title: "Hobby Plan — Free",
    badge: "Plans",
    content: (
      <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
        <PlanCard
          name="Hobby"
          price="Free"
          features={[
            "5 Monitors",
            "5-minute check intervals",
            "Email alerts only",
            "30-day data retention",
            "Community support",
          ]}
        />
        <p className="mt-2">
          The Hobby plan is perfect for personal projects, side projects, and experimenting with SkyWatch. No credit
          card required. Sign up and start monitoring in under 2 minutes.
        </p>
      </div>
    ),
  },
  {
    id: "pro",
    title: "Pro Plan — $29/mo",
    badge: "Plans",
    content: (
      <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
        <PlanCard
          name="Pro"
          price="$29"
          highlight
          features={[
            "50 Monitors",
            "1-minute check intervals",
            "Email, Discord & Webhook alerts",
            "Public Status Pages",
            "1-year data retention",
            "Priority support",
          ]}
        />
        <p className="mt-2">
          Designed for teams that depend on reliability. Includes a 14-day free trial, no credit card required upfront.
        </p>
      </div>
    ),
  },
  {
    id: "enterprise",
    title: "Enterprise Plan — $99/mo",
    badge: "Plans",
    content: (
      <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
        <PlanCard
          name="Enterprise"
          price="$99"
          features={[
            "Unlimited Monitors",
            "30-second check intervals",
            "All notification channels",
            "White-label status pages",
            "Custom domain support",
            "SLA guarantee",
          ]}
        />
        <p className="mt-2">
          Built for scale. Contact us at <span className="text-sky-400">sales@skywatch.app</span> for custom pricing or
          private cloud deployment options.
        </p>
      </div>
    ),
  },
  {
    id: "account-security",
    title: "Account Security",
    badge: "Security",
    content: (
      <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
        <p>SkyWatch implements multiple layers of security to protect your account:</p>
        <ul className="space-y-2 list-disc pl-5">
          <li><strong className="text-white">Encrypted connections</strong> — all traffic uses TLS 1.3</li>
          <li><strong className="text-white">Hashed credentials</strong> — passwords are never stored in plain text</li>
          <li><strong className="text-white">Rate limiting</strong> — login and registration endpoints are rate-limited to prevent brute-force</li>
          <li><strong className="text-white">JWT validation</strong> — all API requests require a valid session token via Supabase Auth</li>
          <li><strong className="text-white">Input validation</strong> — all inputs are validated server-side using Zod schemas</li>
        </ul>
        <InfoBox icon={<Key className="w-4 h-4" />} title="Reset your password" color="sky">
          You can request a password reset at any time from{" "}
          <Link href="/settings" className="text-sky-400 hover:underline">Settings → Security</Link>. A secure reset
          link will be emailed to your registered address.
        </InfoBox>
      </div>
    ),
  },
  {
    id: "data-protection",
    title: "Data Protection",
    badge: "Security",
    content: (
      <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
        <p>
          All user data is stored in an encrypted PostgreSQL database. We never sell or share your data with third parties.
          Monitor URLs and response data are stored only for the retention period of your plan.
        </p>
        <p>
          To report a security vulnerability, email{" "}
          <span className="text-sky-400">security@skywatch.app</span>.
        </p>
      </div>
    ),
  },
  {
    id: "delete-account",
    title: "Deleting Your Account",
    badge: "Security",
    content: (
      <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
        <p>
          You can permanently delete your account from{" "}
          <Link href="/settings" className="text-sky-400 hover:underline">Settings → Danger Zone</Link>. Here's what happens:
        </p>
        <ol className="space-y-2 list-decimal pl-5">
          <li>You confirm deletion by typing your email address</li>
          <li>All your data (monitors, incidents, status pages, notifications) is deleted immediately</li>
          <li>Your Supabase auth account is removed within <strong className="text-white">1 minute</strong></li>
          <li>You are signed out of all active sessions automatically</li>
          <li>This action is <strong className="text-red-400">irreversible</strong> — we do not retain any backups of deleted data</li>
        </ol>
        <InfoBox icon={<AlertTriangle className="w-4 h-4" />} title="No recovery possible" color="red">
          Account deletion is permanent. If you think you may want to return, consider downgrading to the free Hobby plan instead.
        </InfoBox>
      </div>
    ),
  },
  {
    id: "general-faq",
    title: "General Questions",
    badge: "FAQ",
    content: (
      <div className="space-y-5 text-gray-400 text-sm leading-relaxed">
        {[
          { q: "Is SkyWatch free?", a: "Yes! The Hobby plan is completely free with no credit card required. It includes 5 monitors with 5-minute check intervals." },
          { q: "How quickly are alerts sent?", a: "Alerts are sent within 60 seconds of a confirmed failure. We confirm failures over 2 consecutive checks to avoid false positives." },
          { q: "What regions do you check from?", a: "SkyWatch checks from 12+ global regions including US East, US West, Europe, Asia-Pacific, and South America." },
          { q: "Can I monitor non-HTTP services?", a: "Currently SkyWatch supports HTTP and HTTPS monitoring. TCP/ping monitoring is coming soon for Pro and Enterprise plans." },
        ].map((item) => (
          <div key={item.q}>
            <p className="text-white font-medium">{item.q}</p>
            <p className="mt-1">{item.a}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "billing-faq",
    title: "Billing Questions",
    badge: "FAQ",
    content: (
      <div className="space-y-5 text-gray-400 text-sm leading-relaxed">
        {[
          { q: "When am I charged?", a: "Pro and Enterprise plans are billed monthly. The billing cycle starts on the day you upgrade." },
          { q: "Can I cancel anytime?", a: "Yes. You can downgrade or cancel at any time from Settings. Your plan remains active until the end of the billing period." },
          { q: "Do you offer refunds?", a: "We do not issue refunds for partial billing periods. If you cancel, you retain access until the end of the paid period." },
          { q: "Is there a free trial?", a: "Yes! The Pro plan includes a 14-day free trial. The Hobby plan is free forever." },
        ].map((item) => (
          <div key={item.q}>
            <p className="text-white font-medium">{item.q}</p>
            <p className="mt-1">{item.a}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "technical-faq",
    title: "Technical Questions",
    badge: "FAQ",
    content: (
      <div className="space-y-5 text-gray-400 text-sm leading-relaxed">
        {[
          { q: "Does SkyWatch follow redirects?", a: "Yes. By default, SkyWatch follows up to 10 HTTP redirects. You can configure this per monitor." },
          { q: "What timeout does SkyWatch use?", a: "By default, checks time out after 30 seconds. A timeout is treated as a failure." },
          { q: "Can I set custom request headers?", a: "Custom headers are available on Pro and Enterprise plans. Useful for authentication headers like API keys." },
          { q: "Is there an API?", a: "A public REST API is planned for Enterprise users. All endpoints are documented in OpenAPI 3.1 format internally." },
        ].map((item) => (
          <div key={item.q}>
            <p className="text-white font-medium">{item.q}</p>
            <p className="mt-1">{item.a}</p>
          </div>
        ))}
      </div>
    ),
  },
];

export function Docs() {
  const [activeId, setActiveId] = useState("introduction");
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeContent = useMemo(
    () => ALL_CONTENT.find((c) => c.id === activeId),
    [activeId]
  );

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return ALL_CONTENT.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.badge ?? "").toLowerCase().includes(q)
    );
  }, [search]);

  const navigate = (id: string) => {
    setActiveId(id);
    setSearch("");
    setMobileOpen(false);
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    document.title = `Docs — SkyWatch`;
  }, []);

  const Sidebar = () => (
    <nav className="space-y-1">
      {NAV.map((section) => (
        <div key={section.id} className="mb-3">
          <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {section.icon}
            {section.label}
          </div>
          {section.subsections.map((sub) => (
            <button
              key={sub.id}
              onClick={() => navigate(sub.id)}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                activeId === sub.id
                  ? "bg-sky-500/10 text-sky-300 border border-sky-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {activeId === sub.id && <ChevronRight className="w-3 h-3 shrink-0" />}
              {sub.label}
            </button>
          ))}
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#08090f] text-white">
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#08090f]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 mr-4 shrink-0">
            <SkyWatchLogo size={22} />
            <span className="font-bold text-white text-sm">SkyWatch</span>
          </Link>
          <span className="text-gray-700 text-sm hidden sm:block">/</span>
          <span className="text-gray-400 text-sm font-medium hidden sm:block">Documentation</span>

          {/* Search */}
          <div className="flex-1 max-w-md relative ml-auto sm:ml-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search docs..."
              className="w-full pl-9 pr-4 py-1.5 bg-white/5 border border-white/8 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-sky-500/40 focus:ring-1 focus:ring-sky-500/20 transition-all"
            />
            {search && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-[#0e1117] border border-white/8 rounded-xl shadow-2xl overflow-hidden z-50">
                {searchResults.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500">No results found</div>
                ) : (
                  searchResults.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => navigate(r.id)}
                      className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex items-center gap-3"
                    >
                      <BookOpen className="w-4 h-4 text-gray-500 shrink-0" />
                      <div>
                        <p className="text-sm text-white">{r.title}</p>
                        {r.badge && <p className="text-xs text-gray-500">{r.badge}</p>}
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto sm:ml-2 shrink-0">
            <Link href="/" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors">
              <ArrowRight className="w-3 h-3 rotate-180" />
              Home
            </Link>
            <a href="https://github.com/TheCoderZeus/pulsewatch" target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors">
              <ExternalLink className="w-3 h-3" />
              GitHub
            </a>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="sm:hidden p-1.5 text-gray-400">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 flex">
        {/* ── Sidebar Desktop ── */}
        <aside className="hidden sm:block w-64 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-8 pr-4">
          <Sidebar />
        </aside>

        {/* ── Mobile Sidebar ── */}
        {mobileOpen && (
          <div className="fixed inset-0 z-30 top-14 bg-[#08090f] overflow-y-auto p-4 sm:hidden">
            <Sidebar />
          </div>
        )}

        {/* ── Content ── */}
        <main className="flex-1 min-w-0 py-10 sm:pl-8 sm:border-l border-white/5">
          {activeContent ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                {activeContent.badge && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    {activeContent.badge}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-white mb-6">{activeContent.title}</h1>
              <div>{activeContent.content}</div>

              {/* ── Navigation footer ── */}
              <div className="mt-12 pt-8 border-t border-white/6 flex items-center justify-between">
                {(() => {
                  const flat = ALL_CONTENT;
                  const idx = flat.findIndex((c) => c.id === activeId);
                  const prev = idx > 0 ? flat[idx - 1] : null;
                  const next = idx < flat.length - 1 ? flat[idx + 1] : null;
                  return (
                    <>
                      {prev ? (
                        <button onClick={() => navigate(prev.id)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                          <ChevronRight className="w-4 h-4 rotate-180" />
                          {prev.title}
                        </button>
                      ) : <div />}
                      {next ? (
                        <button onClick={() => navigate(next.id)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                          {next.title}
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : <div />}
                    </>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">Select a topic from the sidebar.</div>
          )}
        </main>
      </div>
    </div>
  );
}
