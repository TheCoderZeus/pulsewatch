import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EMAIL = "john@example.com";
const PASS_DOTS = "••••••••";

const bars = [55, 70, 40, 85, 60, 75, 50, 88, 45, 65, 80, 55];
const monitors = [
  { name: "Production API", url: "api.example.com", ms: "42ms", uptime: "99.99%", status: "up" },
  { name: "Payment Gateway", url: "pay.internal", ms: "118ms", uptime: "100%", status: "up" },
  { name: "Auth Service", url: "auth.example.com", ms: "31ms", uptime: "99.97%", status: "up" },
];

function CursorIcon() {
  return (
    <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
      <path d="M1 1L17 8L9.5 10.5L7 17L1 1Z" fill="white" stroke="#0f172a" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function BrowserFrame({ children, url }: { children: React.ReactNode; url: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/8 bg-[#08090f] shadow-2xl shadow-black/60">
      <div className="flex items-center gap-1.5 px-3 py-2.5 bg-[#0c0d15] border-b border-white/5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
        <div className="flex-1 mx-3">
          <div className="w-52 h-4 mx-auto rounded bg-white/5 flex items-center justify-center">
            <span className="text-[9px] text-gray-600">{url}</span>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

function LoginScreen({
  emailText, passText, emailFocused, passFocused, btnState,
}: {
  emailText: string; passText: string; emailFocused: boolean;
  passFocused: boolean; btnState: "idle" | "pressed" | "loading";
}) {
  return (
    <div className="h-[280px] bg-[#08090f] flex items-center justify-center">
      <div className="w-72 px-6 py-8">
        <div className="flex items-center gap-2 justify-center mb-5">
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
            <path d="M4 22 Q16 4 28 22" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <path d="M8 23 Q16 11 24 23" stroke="#7dd3fc" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
            <circle cx="16" cy="24" r="2" fill="#38bdf8" />
          </svg>
          <span className="text-sm font-bold text-white">SkyWatch</span>
        </div>
        <p className="text-center text-xs text-gray-500 mb-5">Sign in to your account</p>

        <div className="space-y-3">
          <div>
            <label className="block text-[10px] font-medium text-gray-400 mb-1">Email</label>
            <div className={`px-3 py-2 rounded-lg border text-[11px] font-mono min-h-[30px] transition-colors ${emailFocused ? "border-sky-500/50 bg-sky-500/5" : "border-white/10 bg-white/5"}`}>
              {emailText}
              {emailFocused && <span className="animate-pulse">|</span>}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-medium text-gray-400 mb-1">Password</label>
            <div className={`px-3 py-2 rounded-lg border text-[11px] min-h-[30px] transition-colors ${passFocused ? "border-sky-500/50 bg-sky-500/5" : "border-white/10 bg-white/5"}`}>
              {passText}
              {passFocused && <span className="animate-pulse">|</span>}
            </div>
          </div>
          <motion.div
            animate={btnState === "pressed" ? { scale: 0.96 } : { scale: 1 }}
            transition={{ duration: 0.1 }}
            className={`mt-4 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[11px] font-semibold text-white transition-all ${btnState === "loading" ? "bg-sky-600" : "bg-sky-500"}`}
          >
            {btnState === "loading" ? (
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : "Sign in"}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function DashboardScreen() {
  return (
    <div className="h-[280px] bg-[#08090f] flex overflow-hidden">
      <div className="w-28 border-r border-white/5 bg-[#0a0b12] p-2.5 flex flex-col gap-1">
        <div className="flex items-center gap-1.5 mb-3 px-1 pt-1">
          <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
            <path d="M4 22 Q16 4 28 22" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <circle cx="16" cy="24" r="2" fill="#38bdf8" />
          </svg>
          <span className="text-[9px] font-bold text-white">SkyWatch</span>
        </div>
        {["Dashboard", "Monitors", "Incidents", "Alerts"].map((item, i) => (
          <div key={item} className={`px-2 py-1.5 rounded-lg flex items-center gap-1.5 ${i === 0 ? "bg-sky-500/10 border border-sky-500/15" : ""}`}>
            <div className={`w-1 h-1 rounded-full ${i === 0 ? "bg-sky-400" : "bg-gray-700"}`} />
            <span className={`text-[9px] font-medium ${i === 0 ? "text-sky-300" : "text-gray-600"}`}>{item}</span>
          </div>
        ))}
      </div>
      <div className="flex-1 p-3 overflow-hidden">
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {[
            { label: "Monitors Up", value: "47", color: "#22d3a6" },
            { label: "Avg Response", value: "63ms", color: "#38bdf8" },
            { label: "Incidents", value: "3", color: "#fb923c" },
          ].map((card) => (
            <div key={card.label} className="p-2 rounded-lg border border-white/6 bg-white/3">
              <div className="text-[8px] text-gray-500">{card.label}</div>
              <div className="text-sm font-bold mt-0.5" style={{ color: card.color }}>{card.value}</div>
            </div>
          ))}
        </div>
        <div className="mb-2 p-2 rounded-lg border border-white/6 bg-white/3">
          <div className="text-[8px] text-gray-500 mb-1.5">Response Time — 12h</div>
          <div className="flex items-end gap-0.5 h-8">
            {bars.map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-sm"
                style={{ background: "linear-gradient(to top, #0ea5e9, #38bdf850)" }}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
              />
            ))}
          </div>
        </div>
        <div className="space-y-1">
          {monitors.map((m, i) => (
            <motion.div
              key={i}
              initial={{ x: -8, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              className="flex items-center justify-between px-2 py-1.5 rounded-lg border border-white/5 bg-white/2"
            >
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[9px] font-medium text-white">{m.name}</span>
              </div>
              <span className="text-[8px] text-emerald-400">{m.uptime}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LoginTutorial() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loopKey, setLoopKey] = useState(0);
  const [emailText, setEmailText] = useState("");
  const [passText, setPassText] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const [btnState, setBtnState] = useState<"idle" | "pressed" | "loading">("idle");
  const [showDashboard, setShowDashboard] = useState(false);
  const [cursorX, setCursorX] = useState(200);
  const [cursorY, setCursorY] = useState(30);

  useEffect(() => {
    const t: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => t.push(setTimeout(fn, ms));

    // Measure container — form is w-72 (288px) centered, cursor targets center
    const W = containerRef.current?.offsetWidth ?? 600;
    const cx = W / 2; // form center

    // Y positions (browser bar ~30px; form centered in h-[280px])
    // Vertical centering offset ≈ (280 - 220content) / 2 = 30px → content starts at y=60
    const emailY = 162; // 30bar + 30center + 32py + 40logo + 36sub + 14label + 15field_half
    const passY  = 218; // emailY + 15 + 12gap + 14label + 15field_half
    const btnY   = 265; // passY  + 15 + 16mt + 16btn_half

    at(600, () => { setCursorX(cx); setCursorY(emailY); });
    at(1100, () => { setEmailFocused(true); });

    EMAIL.split("").forEach((ch, i) => {
      at(1350 + i * 65, () => setEmailText((p) => p + ch));
    });

    const afterEmail = 1350 + EMAIL.length * 65;

    at(afterEmail + 300, () => { setCursorX(cx); setCursorY(passY); setEmailFocused(false); });
    at(afterEmail + 650, () => { setPassFocused(true); });

    PASS_DOTS.split("").forEach((ch, i) => {
      at(afterEmail + 850 + i * 80, () => setPassText((p) => p + ch));
    });

    const afterPass = afterEmail + 850 + PASS_DOTS.length * 80;

    at(afterPass + 300, () => { setCursorX(cx); setCursorY(btnY); setPassFocused(false); });
    at(afterPass + 700, () => { setBtnState("pressed"); });
    at(afterPass + 900, () => { setBtnState("loading"); });
    at(afterPass + 1700, () => { setShowDashboard(true); });

    at(afterPass + 5000, () => {
      setEmailText(""); setPassText(""); setEmailFocused(false); setPassFocused(false);
      setBtnState("idle"); setShowDashboard(false); setCursorX(cx); setCursorY(30);
      setTimeout(() => setLoopKey((k) => k + 1), 100);
    });

    return () => t.forEach(clearTimeout);
  }, [loopKey]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden rounded-xl select-none">
      <BrowserFrame url="app.skywatch.io/login">
        <AnimatePresence mode="wait">
          {showDashboard ? (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <DashboardScreen />
            </motion.div>
          ) : (
            <motion.div key="login" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              <LoginScreen
                emailText={emailText}
                passText={passText}
                emailFocused={emailFocused}
                passFocused={passFocused}
                btnState={btnState}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </BrowserFrame>

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
