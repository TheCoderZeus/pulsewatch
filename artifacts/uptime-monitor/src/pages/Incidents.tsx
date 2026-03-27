import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetIncidents } from "@workspace/api-client-react";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

export function Incidents() {
  const { data: incidents, isLoading } = useGetIncidents();

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Incidents</h1>
        <p className="text-muted-foreground mt-1">History of outages and degradations.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center animate-pulse">Loading...</div>
        ) : incidents?.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
            <h3 className="text-lg font-bold">All clear</h3>
            <p className="text-muted-foreground">No incidents have been recorded.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {incidents?.map(incident => (
              <div key={incident.id} className="p-6 flex flex-col sm:flex-row justify-between gap-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center ${
                    incident.status === 'ongoing' ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'
                  }`}>
                    {incident.status === 'ongoing' ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold">Monitor Down: {incident.monitorName}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                        incident.status === 'ongoing' ? 'bg-destructive/20 text-destructive' : 'bg-secondary text-muted-foreground'
                      }`}>
                        {incident.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Started {formatDistanceToNow(new Date(incident.startedAt), { addSuffix: true })}
                    </p>
                    {incident.resolvedAt && (
                      <p className="text-sm text-muted-foreground">
                        Resolved {formatDistanceToNow(new Date(incident.resolvedAt), { addSuffix: true })} 
                        ({Math.floor((incident.duration || 0) / 60)} minutes)
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Link 
                    href={`/monitors/${incident.monitorId}`}
                    className="px-4 py-2 bg-secondary rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors"
                  >
                    View Monitor
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
