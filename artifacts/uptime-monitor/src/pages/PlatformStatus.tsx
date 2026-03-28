import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, AlertTriangle, XCircle, Activity, ArrowUpRight, RefreshCw } from "lucide-react";
import { Link } from "wouter";

type MonitorStatus = {
  id: string; name: string; status: "up" | "down" | "paused";
  uptimePercent: number | null; responseTime: number | null;
};

type Category = {
  id: string; name: string;
  monitors: (MonitorStatus | null)[];
};

type PlatformStatusData = {
  name: string;
  description: string | null;
  monitors: MonitorStatus[];
  categories: Category[];
  overallStatus: "operational" | "degraded" | "outage";
};

function usePlatformStatus() {
  return useQuery<PlatformStatusData>({
    queryKey: ["/api/platform-status"],
    queryFn: async () => {
      const r = await fetch("/api/platform-status");
      if (!r.ok) throw new Error("Failed to load");
      return r.json();
    },
    refetchInterval: 30_000,
  });
}

const STATUS_CONFIG = {
  operational: {
    icon: CheckCircle2,
    label: "All Systems Operational",
    banner: "bg-emerald-500/8 border-emerald-500/20",
    dot: "bg-emerald-400",
    color: "text-emerald-400",
    ring: "ring-emerald-500/20",
  },
  degraded: {
    icon: AlertTriangle,
    label: "Partial Service Degradation",
    banner: "bg-amber-500/8 border-amber-500/20",
    dot: "bg-amber-400",
    color: "text-amber-400",
    ring: "ring-amber-500/20",
  },
  outage: {
    icon: XCircle,
    label: "Service Disruption",
    banner: "bg-red-500/8 border-red-500/20",
    dot: "bg-red-400",
    color: "text-red-400",
    ring: "ring-red-500/20",
  },
};

function statusLabel(s: MonitorStatus["status"]) {
  if (s === "up") return "Operational";
  if (s === "paused") return "Paused";
  return "Outage";
}
function statusColor(s: MonitorStatus["status"]) {
  if (s === "up") return "text-emerald-400";
  if (s === "paused") return "text-amber-400";
  return "text-red-400";
}
function statusDot(s: MonitorStatus["status"]) {
  if (s === "up") return "bg-emerald-400";
  if (s === "paused") return "bg-amber-400";
  return "bg-red-400";
}

function MonitorRow({ monitor }: { monitor: MonitorStatus }) {
  const isUp = monitor.status === "up";
  return (
    <div className="flex items-center justify-between py-3.5 px-5 group">
      <div className="flex items-center gap-3">
        <span className="relative flex h-2 w-2 flex-shrink-0">
          {isUp && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${statusDot(monitor.status)}`} />
        </span>
        <span className="text-sm font-medium text-white/90">{monitor.name}</span>
      </div>
      <div className="flex items-center gap-5">
        {monitor.responseTime != null && (
          <span className="text-xs text-gray-600 font-mono hidden sm:block">
            {monitor.responseTime}ms
          </span>
        )}
        {monitor.uptimePercent != null && (
          <span className="text-xs text-gray-600 font-mono hidden sm:block">
            {monitor.uptimePercent.toFixed(2)}%
          </span>
        )}
        <span className={`text-xs font-semibold ${statusColor(monitor.status)}`}>
          {statusLabel(monitor.status)}
        </span>
      </div>
    </div>
  );
}

function EmptyMonitors() {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/2 py-16 flex flex-col items-center gap-3">
      <Activity className="w-8 h-8 text-gray-700" />
      <p className="text-sm text-gray-600">Monitoring data will appear here once services are configured</p>
    </div>
  );
}

export function PlatformStatus() {
  const { data, isLoading, error, dataUpdatedAt, refetch, isFetching } = usePlatformStatus();

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : null;

  return (
    <div className="min-h-screen bg-[#08090f] text-white">
      {/* Top bar */}
      <header className="border-b border-white/5 px-6 py-4 sticky top-0 bg-[#08090f]/95 backdrop-blur-sm z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <path d="M4 22 Q16 4 28 22" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
              <path d="M8 23 Q16 11 24 23" stroke="#7dd3fc" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              <path d="M12 24 Q16 17 20 24" stroke="#bae6fd" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
              <circle cx="16" cy="24" r="2" fill="#38bdf8" />
            </svg>
            <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">SkyWatch</span>
          </Link>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-gray-600">Updated {lastUpdated}</span>
            )}
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-1.5 rounded-lg text-gray-600 hover:text-gray-400 hover:bg-white/5 transition-all disabled:opacity-40"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-16">
        {/* Page title */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-sky-400 uppercase tracking-widest mb-3">System Status</p>
          <h1 className="text-4xl font-bold text-white mb-3">SkyWatch Platform</h1>
          <p className="text-gray-500 text-sm">
            Real-time health of SkyWatch's infrastructure and services
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Activity className="w-6 h-6 text-sky-400 animate-spin" />
          </div>
        ) : error || !data ? (
          <div className="rounded-2xl border border-red-500/15 bg-red-500/5 py-12 flex flex-col items-center gap-3">
            <XCircle className="w-8 h-8 text-red-500/50" />
            <p className="text-sm text-gray-500">Unable to load status data</p>
          </div>
        ) : (
          <>
            {/* Overall status banner */}
            {(() => {
              const cfg = STATUS_CONFIG[data.overallStatus];
              const Icon = cfg.icon;
              return (
                <div className={`flex items-center gap-4 px-6 py-5 rounded-2xl border ${cfg.banner} mb-10`}>
                  <span className="relative flex h-3 w-3 flex-shrink-0">
                    {data.overallStatus === "operational" && (
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cfg.dot} opacity-50`} />
                    )}
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${cfg.dot}`} />
                  </span>
                  <Icon className={`w-5 h-5 ${cfg.color} flex-shrink-0`} />
                  <span className={`font-semibold text-lg ${cfg.color}`}>{cfg.label}</span>
                  <span className="ml-auto text-xs text-gray-600 hidden sm:block">
                    {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              );
            })()}

            {/* Services */}
            {data.monitors.length === 0 && data.categories.length === 0 ? (
              <EmptyMonitors />
            ) : data.categories.some(c => c.monitors.length > 0) ? (
              <div className="space-y-6">
                {data.categories.filter(cat => cat.monitors.length > 0).map(cat => (
                  <div key={cat.id}>
                    <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2.5 px-1">
                      {cat.name}
                    </h2>
                    <div className="rounded-2xl border border-white/8 bg-white/2 overflow-hidden divide-y divide-white/5">
                      {cat.monitors.filter(Boolean).map(m => m && (
                        <MonitorRow key={m.id} monitor={m} />
                      ))}
                    </div>
                  </div>
                ))}
                {/* uncategorized */}
                {(() => {
                  const catIds = new Set(data.categories.flatMap(c => c.monitors.map(m => m?.id)));
                  const uncategorized = data.monitors.filter(m => !catIds.has(m.id));
                  return uncategorized.length > 0 ? (
                    <div>
                      <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2.5 px-1">Other</h2>
                      <div className="rounded-2xl border border-white/8 bg-white/2 overflow-hidden divide-y divide-white/5">
                        {uncategorized.map(m => <MonitorRow key={m.id} monitor={m} />)}
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/8 bg-white/2 overflow-hidden divide-y divide-white/5">
                {data.monitors.map(m => <MonitorRow key={m.id} monitor={m} />)}
              </div>
            )}

            {/* Uptime summary strip */}
            {data.monitors.length > 0 && (
              <div className="mt-8 grid grid-cols-3 gap-3">
                {[
                  {
                    label: "Operational",
                    count: data.monitors.filter(m => m.status === "up").length,
                    color: "text-emerald-400",
                  },
                  {
                    label: "Degraded",
                    count: data.monitors.filter(m => m.status === "paused").length,
                    color: "text-amber-400",
                  },
                  {
                    label: "Outage",
                    count: data.monitors.filter(m => m.status === "down").length,
                    color: "text-red-400",
                  },
                ].map(s => (
                  <div key={s.label} className="bg-white/2 border border-white/8 rounded-xl px-4 py-3 text-center">
                    <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-white/5 flex items-center justify-between text-xs text-gray-700">
          <span>Monitored by SkyWatch · Refreshes every 30s</span>
          <Link href="/" className="flex items-center gap-1 text-gray-600 hover:text-sky-400 transition-colors">
            Go to SkyWatch <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </main>
    </div>
  );
}
