import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const URL_TEXT = "https://api.example.com/health";
const NAME_TEXT = "Production API";

function CursorIcon() {
  return (
    <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
      <path d="M1 1L17 8L9.5 10.5L7 17L1 1Z" fill="white" stroke="#0f172a" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/8 bg-[#08090f] shadow-2xl shadow-black/60">
      <div className="flex items-center gap-1.5 px-3 py-2.5 bg-[#0c0d15] border-b border-white/5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
        <div className="flex-1 mx-3">
          <div className="w-52 h-4 mx-auto rounded bg-white/5 flex items-center justify-center">
            <span className="text-[9px] text-gray-600">app.skywatch.io/monitors</span>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

const initialMonitors = [
  { name: "Homepage", url: "skywatch.app", ms: "78ms", uptime: "100%", status: "up" as const },
  { name: "Auth Service", url: "auth.example.com", ms: "31ms", uptime: "99.97%", status: "up" as const },
];

export function CreateMonitorTutorial() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loopKey, setLoopKey] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [urlText, setUrlText] = useState("");
  const [nameText, setNameText] = useState("");
  const [urlFocused, setUrlFocused] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState("");
  const [btnState, setBtnState] = useState<"idle" | "pressed" | "loading">("idle");
  const [monitors, setMonitors] = useState(initialMonitors);
  const [newMonitorVisible, setNewMonitorVisible] = useState(false);
  const [btnHighlight, setBtnHighlight] = useState(false);
  const [createBtnHighlight, setCreateBtnHighlight] = useState(false);
  const [cursorX, setCursorX] = useState(200);
  const [cursorY, setCursorY] = useState(30);

  useEffect(() => {
    const t: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => t.push(setTimeout(fn, ms));

    // Measure container
    const W = containerRef.current?.offsetWidth ?? 600;
    const sidebarW = 112; // w-28 = 7rem
    const formCx = (sidebarW + W) / 2; // center of slide-in form (covers main area)

    // "New Monitor" button is near the right edge of the main header
    const newBtnX = W - 70;
    const newBtnY = 53; // 30bar + 12p-3 + 11 (half button height)

    // Slide-in form Y positions (form is absolute inset-0 in main, starts at y=30)
    const urlY      = 105; // 30 + 16(p-4) + 30(title+mb-4) + 13(label) + 14(field_half)
    const nameY     = 158; // urlY-14 + 28 + 12(gap) + 13(label) + 14
    const intervalY = 208; // nameY-14 + 28 + 12(gap) + 13(label) + 10(btn_half)
    const createY   = 237; // intervalY-10 + 21 + 4(mt-1) + 13(btn_half)

    at(600, () => { setCursorX(newBtnX); setCursorY(newBtnY); });
    at(1100, () => { setBtnHighlight(true); });
    at(1400, () => { setBtnHighlight(false); setShowForm(true); });

    at(1900, () => { setCursorX(formCx); setCursorY(urlY); });
    at(2350, () => { setUrlFocused(true); });

    URL_TEXT.split("").forEach((ch, i) => {
      at(2600 + i * 45, () => setUrlText((p) => p + ch));
    });

    const afterUrl = 2600 + URL_TEXT.length * 45;

    at(afterUrl + 300, () => { setCursorX(formCx); setCursorY(nameY); setUrlFocused(false); });
    at(afterUrl + 650, () => { setNameFocused(true); });

    NAME_TEXT.split("").forEach((ch, i) => {
      at(afterUrl + 850 + i * 70, () => setNameText((p) => p + ch));
    });

    const afterName = afterUrl + 850 + NAME_TEXT.length * 70;

    at(afterName + 300, () => { setCursorX(formCx - 40); setCursorY(intervalY); setNameFocused(false); });
    at(afterName + 700, () => { setSelectedInterval("1 min"); });

    at(afterName + 1100, () => { setCursorX(formCx); setCursorY(createY); });
    at(afterName + 1600, () => { setCreateBtnHighlight(true); setBtnState("pressed"); });
    at(afterName + 1850, () => { setCreateBtnHighlight(false); setBtnState("loading"); });
    at(afterName + 2600, () => { setShowForm(false); setBtnState("idle"); setNewMonitorVisible(true); });

    at(afterName + 5800, () => {
      setUrlText(""); setNameText(""); setUrlFocused(false); setNameFocused(false);
      setSelectedInterval(""); setBtnState("idle"); setShowForm(false);
      setNewMonitorVisible(false); setMonitors(initialMonitors);
      setBtnHighlight(false); setCursorX(W * 0.7); setCursorY(30);
      setTimeout(() => setLoopKey((k) => k + 1), 100);
    });

    return () => t.forEach(clearTimeout);
  }, [loopKey]);

  const intervals = ["30s", "1 min", "5 min"];

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden rounded-xl select-none">
      <BrowserFrame>
        <div className="h-[310px] bg-[#08090f] flex">
          {/* Sidebar */}
          <div className="w-28 border-r border-white/5 bg-[#0a0b12] p-2.5 flex-shrink-0">
            <div className="flex items-center gap-1.5 mb-3 px-1 pt-1">
              <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
                <path d="M4 22 Q16 4 28 22" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
                <circle cx="16" cy="24" r="2" fill="#38bdf8" />
              </svg>
              <span className="text-[9px] font-bold text-white">SkyWatch</span>
            </div>
            {["Dashboard", "Monitors", "Incidents", "Alerts"].map((item, i) => (
              <div key={item} className={`px-2 py-1.5 rounded-lg flex items-center gap-1.5 ${i === 1 ? "bg-sky-500/10 border border-sky-500/15" : ""}`}>
                <div className={`w-1 h-1 rounded-full ${i === 1 ? "bg-sky-400" : "bg-gray-700"}`} />
                <span className={`text-[9px] font-medium ${i === 1 ? "text-sky-300" : "text-gray-600"}`}>{item}</span>
              </div>
            ))}
          </div>

          {/* Main */}
          <div className="flex-1 p-3 overflow-hidden relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[11px] font-bold text-white">Monitors</p>
                <p className="text-[8px] text-gray-600">{monitors.length + (newMonitorVisible ? 1 : 0)} total</p>
              </div>
              <motion.button
                animate={btnHighlight ? { scale: 0.94, backgroundColor: "rgba(14,165,233,0.3)" } : { scale: 1, backgroundColor: "rgba(14,165,233,0.1)" }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-sky-500/20 text-[9px] font-semibold text-sky-300"
              >
                + New Monitor
              </motion.button>
            </div>

            {/* Monitor list */}
            <div className="space-y-1.5">
              {monitors.map((m, i) => (
                <div key={i} className="flex items-center justify-between px-2.5 py-2 rounded-lg border border-white/5 bg-white/2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <div>
                      <p className="text-[10px] font-medium text-white">{m.name}</p>
                      <p className="text-[8px] text-gray-600">{m.url}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-mono text-white">{m.ms}</p>
                    <p className="text-[8px] text-emerald-400">{m.uptime}</p>
                  </div>
                </div>
              ))}
              <AnimatePresence>
                {newMonitorVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between px-2.5 py-2 rounded-lg border border-sky-500/20 bg-sky-500/5"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <div>
                        <p className="text-[10px] font-medium text-sky-300">{NAME_TEXT}</p>
                        <p className="text-[8px] text-gray-600">api.example.com</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] text-sky-400">Just added</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Slide-in form */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "100%", opacity: 0 }}
                  transition={{ type: "spring", stiffness: 280, damping: 30 }}
                  className="absolute inset-0 bg-[#0c0e18] border-l border-white/8 p-4 overflow-hidden"
                >
                  <p className="text-[11px] font-bold text-white mb-4">New Monitor</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[9px] font-medium text-gray-400 mb-1">URL</label>
                      <div className={`px-2.5 py-2 rounded-lg border text-[10px] font-mono min-h-[28px] transition-colors ${urlFocused ? "border-sky-500/50 bg-sky-500/5" : "border-white/10 bg-white/5"}`}>
                        {urlText}
                        {urlFocused && <span className="animate-pulse text-sky-400">|</span>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-medium text-gray-400 mb-1">Name</label>
                      <div className={`px-2.5 py-2 rounded-lg border text-[10px] min-h-[28px] transition-colors ${nameFocused ? "border-sky-500/50 bg-sky-500/5" : "border-white/10 bg-white/5"}`}>
                        {nameText}
                        {nameFocused && <span className="animate-pulse text-sky-400">|</span>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-medium text-gray-400 mb-1">Check Interval</label>
                      <div className="flex gap-1.5">
                        {intervals.map((iv) => (
                          <button
                            key={iv}
                            className={`flex-1 py-1.5 rounded-lg border text-[9px] font-semibold transition-colors ${selectedInterval === iv ? "bg-sky-500/20 border-sky-500/40 text-sky-300" : "border-white/10 bg-white/5 text-gray-500"}`}
                          >
                            {iv}
                          </button>
                        ))}
                      </div>
                    </div>
                    <motion.button
                      animate={btnState === "pressed" ? { scale: 0.96 } : { scale: 1 }}
                      className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-semibold text-white mt-1 transition-colors ${btnState === "loading" ? "bg-sky-600" : "bg-sky-500"}`}
                    >
                      {btnState === "loading"
                        ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : "Create Monitor"}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </BrowserFrame>

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
