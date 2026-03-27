import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useRoute, Link } from "wouter";
import { 
  useGetMonitor, 
  useGetMonitorStats, 
  useGetMonitorChecks,
  usePauseMonitor,
  useResumeMonitor,
  useDeleteMonitor
} from "@workspace/api-client-react";
import { StatusBadge } from "@/components/ui/StatusIndicator";
import { formatMs, formatPercent } from "@/lib/utils";
import { BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";
import { ArrowLeft, Play, Pause, Trash2, ExternalLink, Activity } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export function MonitorDetail() {
  const [, params] = useRoute("/monitors/:id");
  const id = params?.id || "";
  
  const queryClient = useQueryClient();
  const { data: monitor, isLoading: isMonitorLoading } = useGetMonitor(id);
  const { data: stats } = useGetMonitorStats(id);
  const { data: checks } = useGetMonitorChecks(id, { limit: 100 });
  
  const pauseMutation = usePauseMonitor();
  const resumeMutation = useResumeMonitor();
  const deleteMutation = useDeleteMonitor();

  const handleTogglePause = () => {
    if (monitor?.isPaused) {
      resumeMutation.mutate({ id }, { onSuccess: () => invalidate() });
    } else {
      pauseMutation.mutate({ id }, { onSuccess: () => invalidate() });
    }
  };

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [`/api/monitors/${id}`] });
  };

  if (isMonitorLoading) {
    return <DashboardLayout><div className="animate-pulse h-64 bg-card rounded-2xl"></div></DashboardLayout>;
  }

  if (!monitor) return <DashboardLayout>Monitor not found</DashboardLayout>;

  // Prepare chart data (reverse so oldest is left)
  const chartData = checks ? [...checks].reverse().map(c => ({
    time: new Date(c.checkedAt).toLocaleTimeString(),
    responseTime: c.responseTime || 0,
    status: c.status
  })) : [];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link href="/monitors" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Monitors
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <StatusBadge status={monitor.status} />
            <h1 className="text-3xl font-display font-bold text-foreground">{monitor.name}</h1>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleTogglePause}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-secondary transition-colors text-sm font-medium"
            >
              {monitor.isPaused ? <><Play className="w-4 h-4"/> Resume</> : <><Pause className="w-4 h-4"/> Pause</>}
            </button>
            <button 
              onClick={() => {
                if (confirm("Are you sure?")) {
                  deleteMutation.mutate({ id }, { onSuccess: () => window.location.href = "/monitors" });
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
        <a href={monitor.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline mt-2 text-sm font-medium">
          {monitor.url} <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-6">
          <p className="text-sm text-muted-foreground mb-1">24h Uptime</p>
          <p className="text-2xl font-display font-bold">{formatPercent(stats?.uptime24h)}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <p className="text-sm text-muted-foreground mb-1">7d Uptime</p>
          <p className="text-2xl font-display font-bold">{formatPercent(stats?.uptime7d)}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <p className="text-sm text-muted-foreground mb-1">30d Uptime</p>
          <p className="text-2xl font-display font-bold">{formatPercent(stats?.uptime30d)}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <p className="text-sm text-muted-foreground mb-1">Avg Response</p>
          <p className="text-2xl font-mono font-bold">{formatMs(stats?.avgResponseTime)}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-bold">Response Time (Last 100 Checks)</h2>
        </div>
        <div className="h-64 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="time" hide />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                />
                <Bar dataKey="responseTime" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.status === 'up' ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">No data available yet</div>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-bold">Recent Checks</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground font-medium">
              <tr>
                <th className="px-6 py-3 rounded-tl-xl">Status</th>
                <th className="px-6 py-3">Date & Time</th>
                <th className="px-6 py-3">Response Time</th>
                <th className="px-6 py-3">HTTP Code</th>
                <th className="px-6 py-3 rounded-tr-xl">Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {checks?.slice(0, 10).map((check) => (
                <tr key={check.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-md text-xs font-bold ${check.status === 'up' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                      {check.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(check.checkedAt).toLocaleString()}</td>
                  <td className="px-6 py-4 font-mono">{formatMs(check.responseTime)}</td>
                  <td className="px-6 py-4 font-mono">{check.statusCode || '-'}</td>
                  <td className="px-6 py-4 text-destructive truncate max-w-[200px]">{check.error || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
