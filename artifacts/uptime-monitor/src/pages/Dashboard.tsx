import { useGetDashboardStats, useGetMonitors } from "@workspace/api-client-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Activity, CheckCircle2, XCircle, Clock, AlertTriangle, Bell, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { StatusBadge } from "@/components/ui/StatusIndicator";
import { UptimeBar } from "@/components/ui/UptimeBar";
import { formatMs, formatPercent } from "@/lib/utils";

export function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: monitors, isLoading: monitorsLoading } = useGetMonitors();

  if (statsLoading || monitorsLoading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-secondary rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-secondary rounded-2xl"></div>)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    { title: "Total Monitors", value: stats?.totalMonitors || 0, icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Monitors Up", value: stats?.monitorsUp || 0, icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
    { title: "Monitors Down", value: stats?.monitorsDown || 0, icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
    { title: "Avg Uptime", value: formatPercent(stats?.avgUptime), icon: Clock, color: "text-primary", bg: "bg-primary/10" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your infrastructure status.</p>
        </div>
        <div className="flex gap-3">
          {stats?.activeIncidents ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 font-medium text-sm">
              <AlertTriangle className="w-4 h-4" />
              {stats.activeIncidents} Active Incidents
            </div>
          ) : null}
          {stats?.unreadAlerts ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-warning/10 text-warning border border-warning/20 font-medium text-sm">
              <Bell className="w-4 h-4" />
              {stats.unreadAlerts} Unread Alerts
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground">{card.title}</h3>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.bg}`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <div className="text-3xl font-display font-bold">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold">Recent Monitors</h2>
          <Link href="/monitors" className="text-sm text-primary hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {monitors?.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold mb-2">No monitors yet</h3>
            <p className="text-muted-foreground mb-6">Create your first monitor to start tracking uptime.</p>
            <Link 
              href="/monitors" 
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium"
            >
              Create Monitor
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {monitors?.slice(0, 5).map(monitor => (
              <div key={monitor.id} className="p-4 sm:p-6 hover:bg-secondary/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <StatusBadge status={monitor.status} />
                  <div>
                    <Link href={`/monitors/${monitor.id}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                      {monitor.name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">{monitor.url}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-8 text-sm">
                  <div className="hidden md:block">
                    <p className="text-muted-foreground mb-1">Response</p>
                    <p className="font-medium">{formatMs(monitor.responseTime)}</p>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-muted-foreground mb-1">Uptime (30d)</p>
                    <p className="font-medium">{formatPercent(monitor.uptimePercent)}</p>
                  </div>
                  <Link 
                    href={`/monitors/${monitor.id}`}
                    className="px-4 py-2 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 font-medium transition-colors"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
