import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetStatusPages, useCreateStatusPage, useGetMonitors } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Globe, ExternalLink, Shield } from "lucide-react";
import { Link } from "wouter";

export function StatusPages() {
  const { data: pages, isLoading } = useGetStatusPages();
  const { data: monitors } = useGetMonitors();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Status Pages</h1>
          <p className="text-muted-foreground mt-1">Public dashboards to communicate uptime with your users.</p>
        </div>
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
        >
          <Plus className="w-5 h-5" />
          Create Page
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages?.map(page => (
          <div key={page.id} className="bg-card border border-border rounded-2xl p-6 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${page.isPublic ? 'bg-success/10 text-success' : 'bg-secondary text-muted-foreground'}`}>
                {page.isPublic ? 'Public' : 'Private'}
              </span>
            </div>
            <h3 className="text-xl font-bold mb-1">{page.name}</h3>
            <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{page.description || "No description provided."}</p>
            
            <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-mono">/{page.slug}</span>
              <a 
                href={`/status/${page.slug}`} 
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {pages?.length === 0 && !isLoading && (
        <div className="p-16 text-center bg-card border border-border rounded-2xl">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Build trust with a status page</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">Be transparent about your system's uptime and incidents. Create your first public status page.</p>
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium"
          >
            Create Status Page
          </button>
        </div>
      )}

      {/* Basic Create Modal placeholder - wired to API */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">New Status Page</h2>
            <p className="text-muted-foreground mb-6">Status page creation involves selecting monitors and customizing branding. This functionality would be expanded here.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsCreateOpen(false)} className="px-4 py-2 rounded-xl bg-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
