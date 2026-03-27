import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, AlertTriangle, XCircle, Activity } from "lucide-react";

type MonitorStatus = {
  id: string; name: string; status: "up" | "down" | "paused";
  uptimePercent: number | null; responseTime?: number | null;
};

type Category = {
  id: string; name: string;
  monitors: (MonitorStatus | null)[];
};

type PublicPage = {
  name: string; description: string | null;
  monitors: MonitorStatus[];
  categories: Category[];
  overallStatus: "operational" | "degraded" | "outage";
};

function usePublicPage(slug: string) {
  return useQuery<PublicPage>({
    queryKey: ["/api/status-pages/public", slug],
    queryFn: async () => {
      const r = await fetch(`/api/status-pages/${slug}/public`);
      if (!r.ok) throw new Error("Not found");
      return r.json();
    },
    enabled: !!slug,
  });
}

function MonitorRow({ monitor }: { monitor: MonitorStatus }) {
  const isUp = monitor.status === "up";
  return (
    <div className="flex items-center justify-between py-3.5 px-5">
      <div className="flex items-center gap-3">
        <span className={`relative flex h-2 w-2 flex-shrink-0`}>
          {isUp && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${isUp ? "bg-emerald-400" : "bg-red-400"}`} />
        </span>
        <span className="text-sm font-medium text-white">{monitor.name}</span>
      </div>
      <div className="flex items-center gap-4">
        {monitor.uptimePercent != null && (
          <span className="text-xs text-gray-600 font-mono hidden sm:block">
            {monitor.uptimePercent.toFixed(2)}%
          </span>
        )}
        <span className={`text-xs font-semibold ${isUp ? "text-emerald-400" : "text-red-400"}`}>
          {isUp ? "Operational" : monitor.status === "paused" ? "Paused" : "Outage"}
        </span>
      </div>
    </div>
  );
}

export function PublicStatusPage() {
  const [, params] = useRoute("/status/:slug");
  const slug = params?.slug || "";
  const { data: page, isLoading, error } = usePublicPage(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090f] flex items-center justify-center">
        <Activity className="w-6 h-6 text-sky-400 animate-spin" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-[#08090f] flex flex-col items-center justify-center gap-3">
        <XCircle className="w-10 h-10 text-gray-700" />
        <p className="text-gray-500 text-sm">Status page not found</p>
      </div>
    );
  }

  const statusConfig = {
    operational: {
      icon: CheckCircle2, text: "All Systems Operational",
      bg: "bg-emerald-500/8 border-emerald-500/15", color: "text-emerald-400", dot: "bg-emerald-400",
    },
    degraded: {
      icon: AlertTriangle, text: "Partial Degradation",
      bg: "bg-amber-500/8 border-amber-500/15", color: "text-amber-400", dot: "bg-amber-400",
    },
    outage: {
      icon: XCircle, text: "Service Disruption",
      bg: "bg-red-500/8 border-red-500/15", color: "text-red-400", dot: "bg-red-400",
    },
  };

  const cfg = statusConfig[page.overallStatus];
  const StatusIcon = cfg.icon;

  const hasCategories = page.categories && page.categories.some(c => c.monitors.length > 0);
  const categorizedIds = new Set(page.categories?.flatMap(c => c.monitors.map(m => m?.id)) ?? []);
  const uncategorized = page.monitors.filter(m => !categorizedIds.has(m.id));

  return (
    <div className="min-h-screen bg-[#08090f] text-white py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Branding */}
        <div className="flex items-center justify-center mb-12">
          <a href="/" className="flex items-center gap-2 text-gray-700 hover:text-gray-400 transition-colors">
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
              <path d="M4 22 Q16 4 28 22" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
              <path d="M8 23 Q16 11 24 23" stroke="#7dd3fc" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
              <path d="M12 24 Q16 17 20 24" stroke="#bae6fd" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
              <circle cx="16" cy="24" r="2" fill="#38bdf8" />
            </svg>
            <span className="text-xs font-medium">SkyWatch</span>
          </a>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">{page.name}</h1>
          {page.description && <p className="text-gray-500 text-sm">{page.description}</p>}
        </div>

        {/* Overall Status Banner */}
        <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl border ${cfg.bg} mb-8`}>
          <StatusIcon className={`w-5 h-5 ${cfg.color} flex-shrink-0`} />
          <span className={`font-semibold ${cfg.color}`}>{cfg.text}</span>
          <span className="ml-auto text-xs text-gray-600">
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>

        {/* Services */}
        {hasCategories ? (
          <div className="space-y-5">
            {page.categories.filter(cat => cat.monitors.length > 0).map(cat => (
              <div key={cat.id}>
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 px-1">{cat.name}</h3>
                <div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden divide-y divide-white/5">
                  {cat.monitors.filter(Boolean).map(m => (
                    m && <MonitorRow key={m.id} monitor={m} />
                  ))}
                </div>
              </div>
            ))}
            {uncategorized.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 px-1">General</h3>
                <div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden divide-y divide-white/5">
                  {uncategorized.map(m => <MonitorRow key={m.id} monitor={m} />)}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden divide-y divide-white/5">
            {page.monitors.length === 0 && (
              <p className="text-center py-12 text-sm text-gray-700">No monitors configured</p>
            )}
            {page.monitors.map(m => <MonitorRow key={m.id} monitor={m} />)}
          </div>
        )}

        <div className="mt-16 text-center text-xs text-gray-700">
          Monitored by <span className="text-gray-500">SkyWatch</span> · Updates every 30s
        </div>
      </div>
    </div>
  );
}
