import { useState } from "react";
import { Link } from "wouter";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetMonitors, useCreateMonitor } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { StatusBadge } from "@/components/ui/StatusIndicator";
import { formatMs, formatPercent } from "@/lib/utils";
import { Plus, Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Monitors() {
  const { data: monitors, isLoading } = useGetMonitors();
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredMonitors = monitors?.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Monitors</h1>
          <p className="text-muted-foreground mt-1">Manage your monitored endpoints.</p>
        </div>
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Create Monitor
        </button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Search monitors by name or URL..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-card animate-pulse rounded-2xl" />)}
        </div>
      ) : filteredMonitors?.length === 0 ? (
        <div className="p-12 text-center bg-card border border-border rounded-2xl">
          <p className="text-lg text-muted-foreground">No monitors found.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredMonitors?.map(monitor => (
            <Link key={monitor.id} href={`/monitors/${monitor.id}`}>
              <div className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1"><StatusBadge status={monitor.status} /></div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{monitor.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{monitor.url}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span className="uppercase px-2 py-1 bg-secondary rounded-md font-medium">{monitor.type}</span>
                        <span>Interval: {monitor.interval}s</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Response Time</p>
                      <p className="font-mono font-medium text-foreground">{formatMs(monitor.responseTime)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Uptime</p>
                      <p className="font-mono font-medium text-foreground">{formatPercent(monitor.uptimePercent)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <CreateMonitorModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </DashboardLayout>
  );
}

function CreateMonitorModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const queryClient = useQueryClient();
  const createMutation = useCreateMonitor();

  const [formData, setFormData] = useState({
    name: "",
    url: "https://",
    type: "http" as "http"|"https"|"ping"|"port",
    checkType: "api" as "api"|"page",
    interval: 60
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { data: formData },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/monitors"] });
          onClose();
        }
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl p-6"
      >
        <h2 className="text-2xl font-display font-bold mb-6">Create Monitor</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input 
              required
              className="w-full px-4 py-2 bg-secondary border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="Production API"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">URL / Hostname</label>
            <input 
              required
              className="w-full px-4 py-2 bg-secondary border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none"
              value={formData.url}
              onChange={e => setFormData({...formData, url: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Monitor Category</label>
            <div className="grid grid-cols-2 gap-2">
              {(["api", "page"] as const).map(ct => (
                <button
                  key={ct}
                  type="button"
                  onClick={() => setFormData({...formData, checkType: ct})}
                  className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    formData.checkType === ct
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-secondary text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {ct === "api" ? "🔌 API / Endpoint" : "🌐 Web Page"}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {formData.checkType === "api" ? "Monitor REST APIs, JSON endpoints, and backend services." : "Monitor web pages — login screens, dashboards, and UI pages."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Protocol</label>
              <select 
                className="w-full px-4 py-2 bg-secondary border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as any})}
              >
                <option value="http">HTTP</option>
                <option value="https">HTTPS</option>
                <option value="ping">PING</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Interval</label>
              <select 
                className="w-full px-4 py-2 bg-secondary border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none"
                value={formData.interval}
                onChange={e => setFormData({...formData, interval: Number(e.target.value)})}
              >
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
                <option value={300}>5 minutes</option>
                <option value={600}>10 minutes</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-medium hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={createMutation.isPending}
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Monitor
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
