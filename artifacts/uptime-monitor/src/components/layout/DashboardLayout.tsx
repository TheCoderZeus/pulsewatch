import React from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard, Activity, AlertTriangle, Globe,
  Settings, Bell, LogOut, Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

function SkyWatchLogo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M4 22 Q16 4 28 22" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M8 23 Q16 11 24 23" stroke="#7dd3fc" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M12 24 Q16 17 20 24" stroke="#bae6fd" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.5" />
      <circle cx="16" cy="24" r="2" fill="#38bdf8" />
    </svg>
  );
}

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/monitors", label: "Monitors", icon: Activity },
  { href: "/incidents", label: "Incidents", icon: AlertTriangle },
  { href: "/status-pages", label: "Status Pages", icon: Globe },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, signOut } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const avatarLetter = user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-[#08090f] text-white flex">
      {/* ─── Sidebar ─── */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-56 flex flex-col border-r border-white/5 bg-[#0a0b12] transition-transform duration-300",
        "md:translate-x-0 md:static",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2">
            <SkyWatchLogo size={22} />
            <span className="font-bold text-sm text-white">SkyWatch</span>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1 text-gray-600 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                  isActive
                    ? "bg-sky-500/10 text-sky-300 border border-sky-500/15"
                    : "text-gray-600 hover:text-gray-300 hover:bg-white/4"
                )}
              >
                <item.icon className={cn(
                  "w-4 h-4 flex-shrink-0",
                  isActive ? "text-sky-400" : "text-gray-600 group-hover:text-gray-400"
                )} />
                {item.label}
                {isActive && <div className="ml-auto w-1 h-1 rounded-full bg-sky-400" />}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-2.5 border-t border-white/5">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/3 border border-white/5 mb-1.5">
            <div className="w-6 h-6 rounded-lg bg-sky-500/15 border border-sky-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-sky-400">{avatarLetter}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-gray-300 truncate">{user?.email}</p>
              <p className="text-[10px] text-gray-700">Pro Plan</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-600 hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* ─── Main ─── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <div className="md:hidden h-14 flex items-center justify-between px-4 border-b border-white/5 bg-[#0a0b12]">
          <div className="flex items-center gap-2">
            <SkyWatchLogo size={20} />
            <span className="font-bold text-sm text-white">SkyWatch</span>
          </div>
          <button onClick={() => setIsMobileOpen(true)} className="p-2 text-gray-600 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
