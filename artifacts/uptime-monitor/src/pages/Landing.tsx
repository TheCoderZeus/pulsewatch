import { useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import {
  Activity, Zap, Shield, Globe, ArrowRight, CheckCircle2,
  Bell, BarChart3, Clock, Server, AlertTriangle, Star,
  Twitter, Github, Linkedin, Mail
} from "lucide-react";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { BentoGrid, type BentoItem } from "@/components/ui/bento-grid";
import { TextRotate } from "@/components/ui/text-rotate";
import { AuthModal } from "@/components/auth/AuthModal";

const bentoItems: BentoItem[] = [
  {
    title: "Real-Time Monitoring",
    meta: "30s intervals",
    description: "Continuous HTTP checks from multiple global regions with sub-second precision and instant alerting.",
    icon: <Activity className="w-4 h-4 text-violet-400" />,
    status: "Live",
    tags: ["HTTP", "HTTPS", "PING"],
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
    cta: "Configure →",
  },
  {
    title: "Uptime Analytics",
    meta: "1yr history",
    description: "Beautiful charts showing response time trends and uptime percentage over any time range.",
    icon: <BarChart3 className="w-4 h-4 text-blue-400" />,
    status: "Charts",
    tags: ["Recharts", "Export"],
    cta: "View demo →",
  },
  {
    title: "Public Status Pages",
    meta: "Custom domain",
    description: "Keep your customers in the loop with branded, beautiful public status pages that build trust.",
    icon: <Globe className="w-4 h-4 text-emerald-400" />,
    status: "Custom",
    tags: ["Branding", "Public"],
    cta: "Preview →",
  },
  {
    title: "Incident Management",
    meta: "Auto-resolved",
    description: "Automatic incident creation, timeline tracking, and resolution detection with root cause logs.",
    icon: <AlertTriangle className="w-4 h-4 text-red-400" />,
    status: "Auto",
    tags: ["Incidents", "Logs"],
    colSpan: 2,
    cta: "Learn more →",
  },
];

const plans = [
  {
    name: "Hobby",
    price: "$0",
    period: "/mo",
    desc: "Perfect for personal projects and hobby sites.",
    features: [
      "5 Monitors",
      "5-minute check interval",
      "Email alerts only",
      "30-day data retention",
      "Community support",
    ],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    desc: "For teams that need reliability at scale.",
    features: [
      "50 Monitors",
      "1-minute check interval",
      "Email, Discord & Webhook",
      "Public Status Page",
      "1-year data retention",
      "Priority support",
    ],
    cta: "Start 14-day Trial",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/mo",
    desc: "Unlimited scale with white-label options.",
    features: [
      "Unlimited Monitors",
      "30-second check interval",
      "All notification channels",
      "White-label status pages",
      "Custom domain",
      "SLA guarantee",
    ],
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

export function LandingPage() {
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: "login" | "register" }>({
    isOpen: false,
    mode: "login",
  });

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
      />

      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">PulseWatch</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#status" className="hover:text-white transition-colors">Status</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAuthModal({ isOpen: true, mode: "login" })}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Log in
            </button>
            <button
              onClick={() => setAuthModal({ isOpen: true, mode: "register" })}
              className="group relative inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-full bg-gradient-to-b from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="relative pt-36 pb-24 px-4 min-h-[92vh] flex flex-col items-center justify-center">
        <BackgroundPaths />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-8"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-400" />
            </span>
            Monitoring Reimagined for 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6"
          >
            Know when your{" "}
            <br className="hidden sm:block" />
            <LayoutGroup>
              <motion.span layout className="inline-flex items-center gap-3 flex-wrap justify-center">
                <span className="text-gray-400">APIs</span>
                <TextRotate
                  texts={["go down.", "are slow.", "break.", "timeout.", "fail.", "spike."]}
                  mainClassName="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-violet-400 overflow-hidden"
                  splitLevelClassName="overflow-hidden"
                  staggerFrom="last"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-110%" }}
                  staggerDuration={0.02}
                  transition={{ type: "spring", damping: 28, stiffness: 350 }}
                  rotationInterval={2200}
                />
              </motion.span>
            </LayoutGroup>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            High-frequency synthetic monitoring for APIs, websites, and servers.
            Get alerted in seconds — before your users notice.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => setAuthModal({ isOpen: true, mode: "register" })}
              className="group relative inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-full bg-gradient-to-b from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5 transition-all duration-200"
            >
              Start Monitoring Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <div
              className="group relative bg-gradient-to-b from-white/10 to-white/5 p-px rounded-full overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <button className="rounded-full px-8 py-3.5 text-base font-semibold backdrop-blur-md bg-white/5 hover:bg-white/10 text-white transition-all duration-300 border border-white/10">
                View Demo
              </button>
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
          >
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Features / Bento Grid ─── */}
      <section id="features" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-medium mb-5">
              <Zap className="w-3 h-3 text-violet-400" />
              Powerful Features
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Everything you need to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                stay in control
              </span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Built for modern engineering teams who care about reliability, speed, and visibility.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <BentoGrid items={bentoItems} />
          </motion.div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Up and running in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">60 seconds</span>
            </h2>
            <p className="text-gray-400">No complex setup. Just add a URL and we handle the rest.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "01", icon: <Globe className="w-5 h-5 text-violet-400" />, title: "Add your endpoint", desc: "Paste in any URL — API, website, or server. Choose your check frequency." },
              { step: "02", icon: <Server className="w-5 h-5 text-blue-400" />, title: "We monitor 24/7", desc: "Our global network pings your endpoint every 30 seconds from multiple regions." },
              { step: "03", icon: <Bell className="w-5 h-5 text-amber-400" />, title: "Get notified instantly", desc: "Receive alerts via email, Discord, Slack, or webhook within seconds of downtime." },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm text-left group hover:border-violet-500/30 hover:bg-white/8 transition-all duration-300"
              >
                <div className="text-xs font-mono text-violet-500/60 mb-4">{step.step}</div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:bg-white/15 transition-colors">
                  {step.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/10 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-medium mb-5">
              <Star className="w-3 h-3 text-amber-400" />
              Simple Pricing
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Start free,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                scale as you grow
              </span>
            </h2>
            <p className="text-gray-400">No hidden fees. Cancel anytime.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 items-center">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-7 flex flex-col border transition-all duration-300 ${
                  plan.highlight
                    ? "border-violet-500/40 bg-gradient-to-b from-violet-950/60 to-[#0a0a0f] scale-[1.03] shadow-2xl shadow-violet-500/20"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-violet-500/30">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-base font-semibold text-gray-300 mb-1">{plan.name}</h3>
                  <p className="text-xs text-gray-500 mb-4">{plan.desc}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-500 mb-1.5">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-gray-300">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${plan.highlight ? "bg-violet-500/20" : "bg-white/10"}`}>
                        <CheckCircle2 className={`w-3 h-3 ${plan.highlight ? "text-violet-400" : "text-gray-400"}`} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    if (plan.name !== "Enterprise") {
                      setAuthModal({ isOpen: true, mode: "register" });
                    }
                  }}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 text-sm ${
                    plan.highlight
                      ? "bg-gradient-to-b from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5"
                      : "bg-white/10 text-white hover:bg-white/15 border border-white/10"
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl p-12 text-center overflow-hidden border border-violet-500/20 bg-gradient-to-b from-violet-950/40 to-[#0a0a0f]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.15)_0%,transparent_70%)] pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to stop flying blind?
              </h2>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Join thousands of engineers who trust PulseWatch to keep their services running.
              </p>
              <button
                onClick={() => setAuthModal({ isOpen: true, mode: "register" })}
                className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-full bg-gradient-to-b from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5 transition-all duration-200"
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
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                  <Activity className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-white">PulseWatch</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                The fastest way to know when your APIs go down. Trusted by engineering teams worldwide.
              </p>
              <div className="flex items-center gap-3 mt-6">
                {[Twitter, Github, Linkedin].map((Icon, i) => (
                  <button key={i} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              { title: "Product", links: ["Features", "Pricing", "Status Page", "Changelog", "Roadmap"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
              { title: "Legal", links: ["Privacy", "Terms", "Security", "Cookies"] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
            <span>© 2026 PulseWatch. All rights reserved.</span>
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
