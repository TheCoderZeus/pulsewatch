import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";

function SkyWatchLogo({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M4 22 Q16 4 28 22" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M8 23 Q16 11 24 23" stroke="#7dd3fc" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M12 24 Q16 17 20 24" stroke="#bae6fd" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5" />
      <circle cx="16" cy="24" r="2" fill="#38bdf8" />
      <circle cx="16" cy="24" r="4" stroke="#38bdf8" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "login" | "register";
}

export function AuthModal({ isOpen, onClose, mode: initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setSuccess(null);
    }
  }, [isOpen, initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        setSuccess("Check your email to confirm your account.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ type: "spring", damping: 28, stiffness: 360 }}
          className="relative w-full max-w-md"
        >
          {/* Subtle glow ring */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-sky-500/15 via-sky-500/5 to-transparent pointer-events-none" />

          <div className="relative rounded-2xl bg-[#0c0d14] border border-white/8 shadow-2xl shadow-black/60 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500/30 to-transparent" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 text-gray-600 hover:text-white rounded-lg hover:bg-white/8 transition-all z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-8">
              {/* Branding */}
              <div className="flex items-center gap-2.5 mb-8">
                <SkyWatchLogo size={26} />
                <span className="font-bold text-white">SkyWatch</span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-1">
                {mode === "login" ? "Welcome back" : "Create account"}
              </h2>
              <p className="text-sm text-gray-600 mb-7">
                {mode === "login"
                  ? "Sign in to access your monitoring dashboard."
                  : "Start monitoring your APIs in 60 seconds."}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "register" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/4 border border-white/8 text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500/30 transition-all text-sm"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/4 border border-white/8 text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500/30 transition-all text-sm"
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Password</label>
                    {mode === "login" && (
                      <button type="button" className="text-xs text-sky-500 hover:text-sky-400 transition-colors">
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/4 border border-white/8 text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500/30 transition-all text-sm"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 rounded-xl bg-red-500/8 border border-red-500/15 text-red-400 text-sm"
                    >
                      {error}
                    </motion.div>
                  )}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/15 text-emerald-400 text-sm"
                    >
                      {success}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full py-3 rounded-xl bg-sky-500 text-white font-semibold shadow-lg shadow-sky-500/15 hover:bg-sky-400 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {mode === "login" ? "Sign In" : "Create Account"}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5" />
                </div>
                <div className="relative flex justify-center text-xs text-gray-700">
                  <span className="px-3 bg-[#0c0d14]">
                    {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); setSuccess(null); }}
                className="w-full py-2.5 rounded-xl border border-white/8 text-sm text-gray-500 hover:text-white hover:border-white/15 hover:bg-white/4 transition-all duration-200"
              >
                {mode === "login" ? "Create a free account →" : "Sign in instead →"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
