import { motion } from "framer-motion";

const bars = [65, 40, 80, 55, 90, 45, 70, 85, 60, 75, 50, 88];

const monitors = [
  { name: "Production API", url: "api.skywatch.io", ms: "42ms", uptime: "99.99%", status: "up" },
  { name: "Payment Gateway", url: "pay.internal", ms: "118ms", uptime: "100%", status: "up" },
  { name: "Auth Service", url: "auth.skywatch.io", ms: "31ms", uptime: "99.97%", status: "up" },
  { name: "DB Replica", url: "pg-replica.internal", ms: "—", uptime: "98.2%", status: "down" },
];

const statCards = [
  { label: "Monitors Up", value: "47", sub: "of 50 total", color: "#22d3a6" },
  { label: "Avg Response", value: "63ms", sub: "↓ 12% vs yesterday", color: "#38bdf8" },
  { label: "Incidents (30d)", value: "3", sub: "2 resolved", color: "#fb923c" },
];

export function DashboardAnimation() {
  return (
    <div className="relative w-full max-w-3xl mx-auto h-[460px] flex items-center justify-center">
      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-64 bg-sky-500/8 blur-[80px] rounded-full" />
      </div>

      {/* Browser frame */}
      <motion.div
        initial={{ rotateX: 16, rotateY: -8, scale: 0.88, opacity: 0 }}
        animate={{ rotateX: 0, rotateY: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ perspective: 1000 }}
        className="relative z-10 w-full rounded-2xl overflow-hidden border border-white/8 bg-[#08090f] shadow-2xl shadow-black/60"
      >
        {/* Mac bar */}
        <div className="flex items-center gap-1.5 px-4 py-3 bg-[#0c0d15] border-b border-white/5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
          <div className="flex-1 mx-4">
            <div className="w-40 h-4 mx-auto rounded bg-white/5 flex items-center justify-center">
              <span className="text-[9px] text-gray-600">app.skywatch.io/dashboard</span>
            </div>
          </div>
        </div>

        {/* App body */}
        <div className="flex h-[360px]">
          {/* Sidebar */}
          <motion.aside
            initial={{ x: -16, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-40 border-r border-white/5 bg-[#0a0b12] p-3 flex flex-col gap-1 flex-shrink-0"
          >
            <div className="flex items-center gap-2 mb-4 px-2 pt-1">
              <div className="w-5 h-5 rounded-md bg-sky-500/20 border border-sky-500/30 flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-[10px] font-bold text-white">SkyWatch</span>
            </div>
            {["Dashboard", "Monitors", "Incidents", "Status Pages", "Alerts"].map((item, i) => (
              <div
                key={item}
                className={`px-2 py-1.5 rounded-lg flex items-center gap-2 ${i === 0 ? "bg-sky-500/10 border border-sky-500/15" : "text-gray-600"}`}
              >
                <div className={`w-1 h-1 rounded-full ${i === 0 ? "bg-sky-400" : "bg-gray-700"}`} />
                <span className={`text-[10px] font-medium ${i === 0 ? "text-sky-300" : "text-gray-600"}`}>{item}</span>
              </div>
            ))}
          </motion.aside>

          {/* Main */}
          <div className="flex-1 p-4 overflow-hidden">
            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {statCards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
                  className="p-2.5 rounded-xl border border-white/6 bg-white/3"
                >
                  <div className="text-[9px] text-gray-500 mb-1">{card.label}</div>
                  <div className="text-lg font-bold text-white leading-none mb-0.5" style={{ color: card.color }}>{card.value}</div>
                  <div className="text-[8px] text-gray-600">{card.sub}</div>
                </motion.div>
              ))}
            </div>

            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="mb-3 p-3 rounded-xl border border-white/6 bg-white/3"
            >
              <div className="text-[9px] text-gray-500 mb-2">Response Time — 12h</div>
              <div className="flex items-end gap-1 h-12">
                {bars.map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{ background: "linear-gradient(to top, #0ea5e9, #38bdf850)" }}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.8 + i * 0.04, duration: 0.5, ease: "easeOut" }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Monitor list */}
            <div className="space-y-1.5">
              {monitors.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -8, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.9 + i * 0.07, duration: 0.4 }}
                  className="flex items-center justify-between px-3 py-2 rounded-lg border border-white/5 bg-white/2"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: m.status === "up" ? "#22d3a6" : "#f87171" }}
                    />
                    <div>
                      <div className="text-[10px] font-medium text-white leading-none">{m.name}</div>
                      <div className="text-[8px] text-gray-600 mt-0.5">{m.url}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-white">{m.ms}</div>
                    <div className="text-[8px]" style={{ color: m.status === "up" ? "#22d3a6" : "#f87171" }}>{m.uptime}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating badge */}
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 1.4, type: "spring", stiffness: 220, damping: 22 }}
        className="absolute -right-4 -bottom-4 z-20 px-4 py-3 rounded-xl border border-sky-500/20 bg-[#0c1320] shadow-xl shadow-black/40"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <div>
            <div className="text-[9px] text-gray-400">Global Network</div>
            <div className="text-[11px] font-bold text-emerald-400">All Operational</div>
          </div>
        </div>
      </motion.div>

      {/* Floating alert badge */}
      <motion.div
        initial={{ scale: 0, opacity: 0, x: -20 }}
        animate={{ scale: 1, opacity: 1, x: 0 }}
        transition={{ delay: 1.7, type: "spring", stiffness: 200, damping: 20 }}
        className="absolute -left-4 top-16 z-20 px-3 py-2 rounded-xl border border-white/8 bg-[#0c0d15] shadow-xl shadow-black/40"
      >
        <div className="text-[8px] text-gray-500">Alert sent</div>
        <div className="text-[10px] font-semibold text-sky-300">DB Replica ↓ down</div>
      </motion.div>
    </div>
  );
}
