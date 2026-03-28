import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const bars = [48, 62, 38, 78, 55, 70, 45, 82, 52, 68, 75, 60];

const monitors = [
  { name: "Production API", url: "api.example.com", ms: "42ms", uptime: "99.99%", resp: [55,60,48,70,52,65,45,68], status: "up" },
  { name: "Payment Gateway", url: "pay.internal", ms: "118ms", uptime: "100%", resp: [90,85,92,80,88,95,82,86], status: "up" },
  { name: "Auth Service", url: "auth.example.com", ms: "31ms", uptime: "99.97%", resp: [28,32,30,35,25,33,29,31], status: "up" },
  { name: "DB Replica", url: "pg.internal", ms: "—", uptime: "98.2%", resp: [60,55,0,0,0,58,52,57], status: "down" },
];

function CursorIcon() {
  return (
    <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
      <path d="M1 1L17 8L9.5 10.5L7 17L1 1Z" fill="white" stroke="#0f172a" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function DashboardTourTutorial() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loopKey, setLoopKey] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredMonitor, setHoveredMonitor] = useState<number | null>(null);
  const [detailMonitor, setDetailMonitor] = useState<number | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [cursorX, setCursorX] = useState(200);
  const [cursorY, setCursorY] = useState(30);

  useEffect(() => {
    const t: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => t.push(setTimeout(fn, ms));

    // Measure container for dynamic X positions
    const W = containerRef.current?.offsetWidth ?? 600;
    const sW = 112; // w-28 sidebar
    const pad = 12; // p-3
    const mainStart = sW + pad; // x=124
    const mainEnd = W - pad;
    const mainCx = (mainStart + mainEnd) / 2;

    // 3-column stat cards within main area (gap-1.5 = 6px)
    const usable = mainEnd - mainStart;
    const cw = (usable - 12) / 3; // 12 = 2 gaps * 6px
    const card0X = mainStart + cw / 2;
    const card1X = mainStart + cw + 6 + cw / 2;
    const card2X = mainStart + 2 * (cw + 6) + cw / 2;

    // Y positions (browser bar 30px; p-3 = 12px; stats 54px; mb-3; chart 70px; mb-2)
    const cardY    = 69;  // 42(start) + 27(half of 54px card)
    const chartY   = 140; // chart center: 108 + 35
    const mon0Y    = 204; // 190(monitors start) + 14
    const mon1Y    = 236; // mon0Y + 28 + 4(gap)
    const mon2Y    = 268; // mon1Y + 28 + 4
    const mon3Y    = 300; // mon2Y + 28 + 4

    at(700,  () => { setCursorX(card0X); setCursorY(cardY); });
    at(1100, () => { setHoveredCard(0); });
    at(2000, () => { setCursorX(card1X); setCursorY(cardY); setHoveredCard(null); });
    at(2200, () => { setHoveredCard(1); });
    at(3000, () => { setCursorX(card2X); setCursorY(cardY); setHoveredCard(null); });
    at(3200, () => { setHoveredCard(2); });

    at(4000, () => { setCursorX(mainCx); setCursorY(chartY); setHoveredCard(null); });
    at(4400, () => { setShowTooltip(true); });
    at(5200, () => { setShowTooltip(false); });

    at(5600, () => { setCursorX(mainCx); setCursorY(mon0Y); });
    at(6000, () => { setHoveredMonitor(0); });
    at(6800, () => { setCursorX(mainCx); setCursorY(mon1Y); setHoveredMonitor(1); });
    at(7500, () => { setCursorX(mainCx); setCursorY(mon2Y); setHoveredMonitor(2); });
    at(8200, () => { setCursorX(mainCx); setCursorY(mon3Y); setHoveredMonitor(3); });
    at(8700, () => { setDetailMonitor(3); setHoveredMonitor(null); });

    at(12500, () => {
      setHoveredCard(null); setHoveredMonitor(null); setDetailMonitor(null);
      setShowTooltip(false); setCursorX(W * 0.7); setCursorY(30);
      setTimeout(() => setLoopKey((k) => k + 1), 100);
    });

    return () => t.forEach(clearTimeout);
  }, [loopKey]);

  const statCards = [
    { label: "Monitors Up", value: "47", sub: "of 50 total", color: "#22d3a6" },
    { label: "Avg Response", value: "63ms", sub: "↓ 12% vs yesterday", color: "#38bdf8" },
    { label: "Incidents (30d)", value: "3", sub: "2 resolved", color: "#fb923c" },
  ];

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden rounded-xl select-none">
      <div className="rounded-xl overflow-hidden border border-white/8 bg-[#08090f] shadow-2xl shadow-black/60">
        {/* Browser bar */}
        <div className="flex items-center gap-1.5 px-3 py-2.5 bg-[#0c0d15] border-b border-white/5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
          <div className="flex-1 mx-3">
            <div className="w-52 h-4 mx-auto rounded bg-white/5 flex items-center justify-center">
              <span className="text-[9px] text-gray-600">app.skywatch.io/dashboard</span>
            </div>
          </div>
        </div>

        <div className="flex h-[310px]">
          {/* Sidebar */}
          <div className="w-28 border-r border-white/5 bg-[#0a0b12] p-2.5 flex-shrink-0">
            <div className="flex items-center gap-1.5 mb-3 px-1 pt-1">
              <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
                <path d="M4 22 Q16 4 28 22" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
                <circle cx="16" cy="24" r="2" fill="#38bdf8" />
              </svg>
              <span className="text-[9px] font-bold text-white">SkyWatch</span>
            </div>
            {["Dashboard", "Monitors", "Incidents", "Status Pages", "Alerts"].map((item, i) => (
              <div key={item} className={`px-2 py-1.5 rounded-lg flex items-center gap-1.5 ${i === 0 ? "bg-sky-500/10 border border-sky-500/15" : ""}`}>
                <div className={`w-1 h-1 rounded-full ${i === 0 ? "bg-sky-400" : "bg-gray-700"}`} />
                <span className={`text-[9px] font-medium ${i === 0 ? "text-sky-300" : "text-gray-600"}`}>{item}</span>
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 p-3 overflow-hidden relative">
            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              {statCards.map((card, i) => (
                <motion.div
                  key={i}
                  animate={hoveredCard === i ? { borderColor: "rgba(56,189,248,0.3)", backgroundColor: "rgba(56,189,248,0.06)" } : { borderColor: "rgba(255,255,255,0.06)", backgroundColor: "rgba(255,255,255,0.03)" }}
                  className="p-2 rounded-lg border"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <div className="text-[8px] text-gray-500">{card.label}</div>
                  <div className="text-sm font-bold mt-0.5" style={{ color: card.color }}>{card.value}</div>
                  <div className="text-[7px] text-gray-600">{card.sub}</div>
                </motion.div>
              ))}
            </div>

            {/* Chart */}
            <div className="mb-2 p-2 rounded-lg border border-white/6 bg-white/3 relative">
              <div className="text-[8px] text-gray-500 mb-1.5">Response Time — 24h</div>
              <div className="flex items-end gap-0.5 h-10">
                {bars.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm transition-all"
                    style={{
                      height: `${h}%`,
                      background: i === 8 ? "linear-gradient(to top, #f87171, #fca5a5)" : "linear-gradient(to top, #0ea5e9, #38bdf850)",
                    }}
                  />
                ))}
              </div>
              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-2 right-2 px-2 py-1.5 rounded-lg bg-[#111827] border border-white/10 text-[8px]"
                  >
                    <div className="text-gray-400">Avg Response</div>
                    <div className="text-sky-400 font-bold">63ms</div>
                    <div className="text-gray-600">p99: 142ms</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Monitor list */}
            <div className="space-y-1">
              {monitors.map((m, i) => (
                <motion.div
                  key={i}
                  animate={
                    hoveredMonitor === i
                      ? { backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.12)" }
                      : { backgroundColor: "rgba(255,255,255,0.01)", borderColor: "rgba(255,255,255,0.05)" }
                  }
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg border cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: m.status === "up" ? "#22d3a6" : "#f87171" }}
                    />
                    <div>
                      <p className="text-[9px] font-medium text-white">{m.name}</p>
                      <p className="text-[7px] text-gray-600">{m.url}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-mono text-gray-400">{m.ms}</p>
                    <p className="text-[7px]" style={{ color: m.status === "up" ? "#22d3a6" : "#f87171" }}>{m.uptime}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Detail panel for down monitor */}
            <AnimatePresence>
              {detailMonitor !== null && (
                <motion.div
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "100%", opacity: 0 }}
                  transition={{ type: "spring", stiffness: 280, damping: 30 }}
                  className="absolute inset-0 bg-[#0c0e18] border-l border-white/8 p-3"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <p className="text-[11px] font-bold text-white">DB Replica</p>
                    <span className="ml-auto text-[8px] px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">Down</span>
                  </div>
                  <div className="p-2 rounded-lg bg-red-500/5 border border-red-500/15 mb-3">
                    <p className="text-[9px] font-semibold text-red-300">Incident Active</p>
                    <p className="text-[8px] text-gray-500 mt-0.5">Started 14 minutes ago · 503 Service Unavailable</p>
                  </div>
                  <div className="text-[8px] text-gray-500 mb-1.5">Response Time History</div>
                  <div className="flex items-end gap-0.5 h-10 mb-3">
                    {monitors[3].resp.map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm"
                        style={{
                          height: h === 0 ? "4px" : `${(h / 100) * 100}%`,
                          background: h === 0 ? "#f87171" : "linear-gradient(to top, #0ea5e9, #38bdf850)",
                        }}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="p-2 rounded-lg bg-white/3 border border-white/6">
                      <p className="text-[8px] text-gray-500">Uptime (30d)</p>
                      <p className="text-[11px] font-bold text-white">98.2%</p>
                    </div>
                    <div className="p-2 rounded-lg bg-white/3 border border-white/6">
                      <p className="text-[8px] text-gray-500">Last Response</p>
                      <p className="text-[11px] font-bold text-red-400">503</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Cursor */}
      <motion.div
        className="absolute pointer-events-none z-50"
        animate={{ x: cursorX, y: cursorY }}
        transition={{ type: "spring", stiffness: 200, damping: 28 }}
        style={{ top: 0, left: 0 }}
      >
        <CursorIcon />
      </motion.div>
    </div>
  );
}
