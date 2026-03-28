import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetMe } from "@workspace/api-client-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
  User, Mail, Shield, Crown, Trash2, KeyRound,
  AlertTriangle, CheckCircle2, Loader2, LogOut,
} from "lucide-react";

function Avatar({ name, email }: { name?: string; email?: string }) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : email?.slice(0, 2).toUpperCase() ?? "??";
  return (
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500/30 to-indigo-500/30 border border-sky-500/20 flex items-center justify-center text-xl font-bold text-sky-300 select-none">
      {initials}
    </div>
  );
}

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#0e1117] border border-white/6 rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}

export function Settings() {
  const { data: user, isLoading } = useGetMe();
  const { signOut } = useAuth();
  const { toast } = useToast();

  const [resetLoading, setResetLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const planColors: Record<string, string> = {
    free: "text-gray-400 bg-white/5 border-white/10",
    pro: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    enterprise: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  };
  const planLabel: Record<string, string> = {
    free: "Hobby",
    pro: "Pro",
    enterprise: "Enterprise",
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email);
      if (error) throw error;
      setResetSent(true);
      toast({ title: "Email sent", description: "Check your inbox for the reset link." });
    } catch {
      toast({ title: "Error", description: "Could not send reset email. Try again.", variant: "destructive" });
    } finally {
      setResetLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== user?.email) return;
    setDeleteLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/auth/account`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (!res.ok) throw new Error("Deletion failed");
      await signOut();
      toast({ title: "Account deleted", description: "Your account has been permanently removed." });
    } catch {
      toast({ title: "Error", description: "Could not delete account. Try again.", variant: "destructive" });
      setDeleteLoading(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-[#0e1117] rounded-2xl animate-pulse border border-white/5" />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  const plan = user?.plan ?? "free";

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Account Settings</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage your profile, security, and account preferences.</p>
        </div>

        <div className="space-y-5">
          {/* ── Profile ── */}
          <SectionCard>
            <div className="flex items-start gap-4">
              <Avatar name={user?.name} email={user?.email} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-lg font-semibold text-white truncate">{user?.name}</h2>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${planColors[plan]}`}>
                    {planLabel[plan] ?? plan} Plan
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">{user?.email}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-600">
                  <User className="w-3.5 h-3.5" />
                  <span>Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—"}</span>
                </div>
              </div>
            </div>

            {plan === "free" && (
              <div className="mt-5 pt-5 border-t border-white/6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Upgrade to Pro</p>
                    <p className="text-xs text-gray-500 mt-0.5">Get 50 monitors, 1-min intervals, and status pages.</p>
                  </div>
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold rounded-xl transition-colors">
                    <Crown className="w-3.5 h-3.5" />
                    Upgrade
                  </button>
                </div>
              </div>
            )}
          </SectionCard>

          {/* ── Security ── */}
          <SectionCard>
            <div className="flex items-center gap-2 mb-5">
              <Shield className="w-4 h-4 text-sky-400" />
              <h2 className="text-base font-semibold text-white">Security</h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Password</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {resetSent
                    ? "Reset link sent — check your inbox."
                    : "We'll send a password reset link to your email."}
                </p>
              </div>
              <button
                onClick={handleResetPassword}
                disabled={resetLoading || resetSent}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/8 text-sm font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resetLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : resetSent ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <KeyRound className="w-3.5 h-3.5" />
                )}
                {resetSent ? "Email sent" : "Reset Password"}
              </button>
            </div>

            <div className="mt-5 pt-5 border-t border-white/6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Sign out</p>
                <p className="text-xs text-gray-500 mt-0.5">Sign out from all devices on this session.</p>
              </div>
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/8 text-sm font-medium rounded-xl transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </button>
            </div>
          </SectionCard>

          {/* ── Danger Zone ── */}
          <SectionCard className="border-red-500/15">
            <div className="flex items-center gap-2 mb-5">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <h2 className="text-base font-semibold text-red-400">Danger Zone</h2>
            </div>

            {!deleteOpen ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Delete Account</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Permanently remove your account and all data. This cannot be undone.
                  </p>
                </div>
                <button
                  onClick={() => setDeleteOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-medium rounded-xl transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Account
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-red-500/5 border border-red-500/15 rounded-xl">
                  <p className="text-sm text-red-300 font-medium mb-1">Are you absolutely sure?</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    This will permanently delete your account, all monitors, incidents, and data within{" "}
                    <span className="text-red-400 font-semibold">1 minute</span> of confirmation. There is no undo.
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Type your email <span className="text-white font-mono">{user?.email}</span> to confirm:
                  </label>
                  <input
                    type="email"
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    placeholder={user?.email}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setDeleteOpen(false); setDeleteConfirm(""); }}
                    className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/8 text-sm font-medium rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirm !== user?.email || deleteLoading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/80 hover:bg-red-500 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {deleteLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Permanently Delete
                  </button>
                </div>
              </div>
            )}
          </SectionCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
