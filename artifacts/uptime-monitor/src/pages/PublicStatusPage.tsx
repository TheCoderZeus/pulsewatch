import { useRoute } from "wouter";
import { useGetPublicStatusPage } from "@workspace/api-client-react";
import { Activity, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { formatPercent } from "@/lib/utils";

export function PublicStatusPage() {
  const [, params] = useRoute("/status/:slug");
  const slug = params?.slug || "";
  
  const { data: page, isLoading, error } = useGetPublicStatusPage(slug);

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Activity className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  if (error || !page) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-xl font-display font-bold">Status Page Not Found</div>;
  }

  const statusConfig = {
    operational: { color: "text-success", bg: "bg-success", icon: CheckCircle2, text: "All Systems Operational" },
    degraded: { color: "text-warning", bg: "bg-warning", icon: AlertTriangle, text: "Partial System Outage" },
    outage: { color: "text-destructive", bg: "bg-destructive", icon: XCircle, text: "Major System Outage" }
  };

  const currentStatus = statusConfig[page.overallStatus];

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="w-16 h-16 bg-card border border-border rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Activity className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-display font-bold mb-3">{page.name}</h1>
          {page.description && <p className="text-lg text-muted-foreground">{page.description}</p>}
        </div>

        {/* Global Status Banner */}
        <div className={`p-6 rounded-2xl flex items-center gap-4 mb-12 shadow-lg ${currentStatus.bg}/10 border border-${currentStatus.bg}/20`}>
          <currentStatus.icon className={`w-8 h-8 ${currentStatus.color}`} />
          <h2 className={`text-2xl font-bold ${currentStatus.color}`}>{currentStatus.text}</h2>
        </div>

        {/* Services */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold mb-6">System Metrics</h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="divide-y divide-border">
              {page.monitors.map((m, i) => (
                <div key={i} className="p-5 flex items-center justify-between">
                  <span className="font-medium text-lg">{m.name}</span>
                  <div className="flex items-center gap-6">
                    <span className="text-muted-foreground font-mono">{formatPercent(m.uptimePercent)}</span>
                    <span className={`font-bold flex items-center gap-2 ${
                      m.status === 'up' ? 'text-success' : 'text-destructive'
                    }`}>
                      <span className={`w-2.5 h-2.5 rounded-full ${m.status === 'up' ? 'bg-success animate-pulse-ring' : 'bg-destructive'}`}></span>
                      {m.status === 'up' ? 'Operational' : 'Outage'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          Powered by <span className="font-bold text-foreground">SkyWatch</span>
        </div>
      </div>
    </div>
  );
}
