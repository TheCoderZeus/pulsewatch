import { useState } from "react";
import { Link } from "wouter";
import { motion, LayoutGroup } from "framer-motion";
import {
  Activity, Zap, Shield, Globe, ArrowRight, CheckCircle2,
  Bell, BarChart3, Clock, Server, AlertTriangle, Star,
  Twitter, Github, Linkedin,
} from "lucide-react";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { BentoGrid, type BentoItem } from "@/components/ui/bento-grid";
import { TextRotate } from "@/components/ui/text-rotate";
import { AuthModal } from "@/components/auth/AuthModal";
import { DashboardAnimation } from "@/components/landing/DashboardAnimation";

/* ── Logo ─────────────────────────────────────────────── */
function SkyWatchLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Outer ring — horizon arc */}
      <path
        d="M4 22 Q16 4 28 22"
        stroke="#38bdf8"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Middle arc */}
      <path
        d="M8 23 Q16 11 24 23"
        stroke="#7dd3fc"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      {/* Inner arc */}
      <path
        d="M12 24 Q16 17 20 24"
        stroke="#bae6fd"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      {/* Center dot */}
      <circle cx="16" cy="24" r="2" fill="#38bdf8" />
      {/* Pulse ring */}
      <circle cx="16" cy="24" r="4" stroke="#38bdf8" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

/* ── Bento items ─────────────────────────────────────── */
const bentoItems: BentoItem[] = [
  {
    title: "Real-Time Monitoring",
    meta: "30s intervals",
    description: "Continuous HTTP checks from multiple global regions with sub-second precision and instant alerting on any anomaly.",
    icon: <Activity className="w-4 h-4 text-sky-400" />,
    status: "Live",
    tags: ["HTTP", "HTTPS", "TCP"],
    colSpan: 2,
    hasPersistentHover: true,
    cta: "See how →",
  },
  {
    title: "Instant Alerts",
    meta: "< 60s",
    description: "Get notified via email, Discord, Slack, or webhook the moment something goes wrong.",
    icon: <Bell className="w-4 h-4 text-amber-400" />,
    status: "Multi-channel",
    tags: ["Email", "Webhook"],
  },
  {
    title: "Uptime Analytics",
    meta: "1yr history",
    description: "Beautiful charts showing response time trends and uptime percentage over any time range.",
    icon: <BarChart3 className="w-4 h-4 text-blue-400" />,
    status: "Charts",
    tags: ["Trends", "Export"],
  },
  {
    title: "Public Status Pages",
    meta: "Custom domain",
    description: "Keep your customers in the loop with branded, beautiful public status pages that build trust.",
    icon: <Globe className="w-4 h-4 text-teal-400" />,
    status: "Custom",
    tags: ["Branding", "Public"],
    colSpan: 2,
  },
];

/* ── Pricing plans ───────────────────────────────────── */
const plans = [
  {
    name: "Hobby",
    price: "$0",
    period: "/mo",
    desc: "Perfect for personal projects and hobby sites.",
    features: ["5 Monitors", "5-minute check interval", "Email alerts only", "30-day data retention", "Community support"],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    desc: "For teams that need reliability at scale.",
    features: ["50 Monitors", "1-minute check interval", "Email, Discord & Webhook", "Public Status Page", "1-year data retention", "Priority support"],
    cta: "Start 14-day Trial",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/mo",
    desc: "Unlimited scale with white-label options.",
    features: ["Unlimited Monitors", "30-second check interval", "All notification channels", "White-label status pages", "Custom domain", "SLA guarantee"],
    cta: "Contact Sales",
    highlight: false,
  },
];

const stats = [
  { value: "99.99%", label: "Platform uptime" },
  { value: "< 30s", label: "Alert response time" },
  { value: "12+", label: "Global check regions" },
  { value: "50k+", label: "Monitors running" },
];

/* ── Page ────────────────────────────────────────────── */
export function LandingPage() {
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: "login" | "register" }>({
    isOpen: false, mode: "login",
  });
  const openAuth = (mode: "login" | "register") => setAuthModal({ isOpen: true, mode });

  return (
    <div className="min-h-screen bg-[#08090f] text-white overflow-hidden">
      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={() => setAuthModal((s) => ({ ...s, isOpen: false }))}
      />

      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-[#08090f]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <SkyWatchLogo size={28} />
            <span className="font-bold text-lg tracking-tight text-white">SkyWatch</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
            <Link href="/status" className="hover:text-white transition-colors">Status</Link>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => openAuth("login")}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Log in
            </button>
            <button
              onClick={() => openAuth("register")}
              className="group relative inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 hover:border-sky-500/50 hover:-translate-y-0.5 transition-all duration-200"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative pt-28 pb-12 px-4 min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <BackgroundPaths />
        {/* Radial gradient behind content */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(14,165,233,0.06)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
          {/* Left copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-medium mb-7"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-400" />
              </span>
              Monitoring Reimagined for 2026
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-5"
            >
              Know when your
              <br />
              <LayoutGroup>
                <motion.span layout className="inline-flex items-center whitespace-pre">
                  <TextRotate
                    texts={["APIs", "endpoints", "services", "servers", "monitors", "webhooks"]}
                    mainClassName="text-sky-300 px-3 bg-sky-500/12 overflow-hidden py-1 rounded-xl border border-sky-500/20 justify-center"
                    splitLevelClassName="overflow-hidden pb-1"
                    staggerFrom="last"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.025}
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={2200}
                  />
                  <motion.span
                    layout
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    className="text-white"
                  >
                    {" "}go down.
                  </motion.span>
                </motion.span>
              </LayoutGroup>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="text-lg text-gray-500 mb-9 max-w-md leading-relaxed"
            >
              High-frequency synthetic monitoring for APIs, websites, and servers.
              Get alerted in seconds — before your users notice.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.26 }}
              className="flex flex-wrap gap-3"
            >
              <button
                onClick={() => openAuth("register")}
                className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold rounded-full bg-sky-500 text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400 hover:-translate-y-0.5 transition-all duration-200"
              >
                Start Monitoring Free
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="relative bg-gradient-to-b from-white/8 to-white/4 p-px rounded-full">
                <button className="rounded-full px-7 py-3 text-sm font-semibold bg-white/4 hover:bg-white/8 text-gray-300 transition-all duration-200 border border-white/8">
                  View Demo
                </button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-12 grid grid-cols-2 gap-6 max-w-sm"
            >
              {stats.map((s, i) => (
                <div key={i}>
                  <div className="text-xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Dashboard animation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <DashboardAnimation />
          </motion.div>
        </div>
      </section>

      {/* ─── Features / Bento ─── */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-gray-500 text-xs font-medium mb-5">
              <Zap className="w-3 h-3 text-sky-400" />
              Powerful Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything you need to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400">
                stay in control
              </span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm">
              Built for modern engineering teams who care about reliability, speed, and visibility.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <BentoGrid items={bentoItems} />
          </motion.div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Up and running in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400">60 seconds</span>
            </h2>
            <p className="text-gray-500 text-sm">No complex setup. Just add a URL and we handle the rest.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { step: "01", icon: <Globe className="w-4 h-4 text-sky-400" />, title: "Add your endpoint", desc: "Paste in any URL — API, website, or server. Choose your check frequency and method." },
              { step: "02", icon: <Server className="w-4 h-4 text-blue-400" />, title: "We monitor 24/7", desc: "Our global network pings your endpoint every 30 seconds from multiple regions worldwide." },
              { step: "03", icon: <Bell className="w-4 h-4 text-teal-400" />, title: "Get notified instantly", desc: "Receive alerts via email, Discord, Slack, or webhook within seconds of any downtime." },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative p-6 rounded-2xl border border-white/8 bg-white/3 text-left group hover:border-sky-500/20 hover:bg-sky-500/3 transition-all duration-300"
              >
                <div className="text-xs font-mono text-gray-700 mb-4">{step.step}</div>
                <div className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center mb-4 group-hover:bg-white/12 transition-colors">
                  {step.icon}
                </div>
                <h3 className="font-semibold text-white mb-2 text-sm">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-gray-500 text-xs font-medium mb-5">
              <Star className="w-3 h-3 text-amber-400" />
              Simple Pricing
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Start free,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400">
                scale as you grow
              </span>
            </h2>
            <p className="text-gray-500 text-sm">No hidden fees. Cancel anytime.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 items-center">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-7 flex flex-col border transition-all duration-300 ${
                  plan.highlight
                    ? "border-sky-500/25 bg-gradient-to-b from-sky-950/40 to-[#08090f] scale-[1.03] shadow-2xl shadow-sky-500/10"
                    : "border-white/8 bg-white/3 hover:border-white/15"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-sky-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-sky-500/25">
                    {plan.badge}
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 mb-1">{plan.name}</h3>
                  <p className="text-xs text-gray-600 mb-4">{plan.desc}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-600 mb-1">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-xs text-gray-400">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${plan.highlight ? "bg-sky-500/15" : "bg-white/8"}`}>
                        <CheckCircle2 className={`w-2.5 h-2.5 ${plan.highlight ? "text-sky-400" : "text-gray-500"}`} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => { if (plan.name !== "Enterprise") openAuth("register"); }}
                  className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    plan.highlight
                      ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400 hover:-translate-y-0.5"
                      : "bg-white/8 text-gray-300 hover:bg-white/12 border border-white/8"
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl p-12 text-center overflow-hidden border border-white/8 bg-gradient-to-b from-white/4 to-transparent"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,165,233,0.08)_0%,transparent_70%)] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to stop flying blind?
              </h2>
              <p className="text-gray-500 mb-8 max-w-xl mx-auto text-sm">
                Join thousands of engineers who trust SkyWatch to keep their services running smoothly.
              </p>
              <button
                onClick={() => openAuth("register")}
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-full bg-sky-500 text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400 hover:-translate-y-0.5 transition-all duration-200"
              >
                Start for Free
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/5 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <SkyWatchLogo size={24} />
                <span className="font-bold text-white">SkyWatch</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
                The fastest way to know when your APIs go down. Trusted by engineering teams worldwide.
              </p>
              <div className="flex items-center gap-2.5 mt-6">
                {[Twitter, Github, Linkedin].map((Icon, i) => (
                  <button key={i} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-600 hover:text-white hover:bg-white/10 transition-all">
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </div>
            {[
              { title: "Product", links: [
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
                { label: "Status Page", href: "#" },
                { label: "Changelog", href: "#" },
              ]},
              { title: "Company", links: [
                { label: "About", href: "#" },
                { label: "Blog", href: "#" },
                { label: "Careers", href: "#" },
              ]},
              { title: "Legal", links: [
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Security", href: "/security" },
                { label: "Cookie Policy", href: "/privacy#cookies" },
              ]},
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href={link.href} className="text-sm text-gray-600 hover:text-gray-300 transition-colors">{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-700">
            <span>© 2026 SkyWatch. All rights reserved.</span>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
