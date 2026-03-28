import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "skywatch_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ type: "spring", damping: 28, stiffness: 350 }}
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4"
        >
          <div className="rounded-2xl border border-white/10 bg-[#0d0e18]/95 backdrop-blur-xl shadow-2xl shadow-black/60 p-5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mt-0.5">
                <Cookie className="w-4 h-4 text-sky-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white mb-1">We use cookies</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  SkyWatch uses only essential cookies for authentication and session management. No tracking or advertising cookies.{" "}
                  <Link href="/privacy" className="text-sky-400 hover:text-sky-300 transition-colors">Privacy Policy</Link>
                </p>
              </div>
              <button
                onClick={decline}
                className="flex-shrink-0 text-gray-600 hover:text-gray-400 transition-colors mt-0.5"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2 mt-4 pl-13">
              <button
                onClick={decline}
                className="flex-1 px-4 py-2 text-xs font-medium text-gray-400 border border-white/8 rounded-xl hover:bg-white/5 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={accept}
                className="flex-1 px-4 py-2 text-xs font-medium text-white bg-sky-500 hover:bg-sky-400 rounded-xl transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
