import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetNotificationSettings, useUpdateNotificationSettings } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Bell, Mail, Webhook, MessageSquare, Loader2 } from "lucide-react";

export function Notifications() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useGetNotificationSettings();
  const updateMutation = useUpdateNotificationSettings();

  const [form, setForm] = useState({
    emailEnabled: false, emailAddress: "",
    webhookEnabled: false, webhookUrl: "",
    discordEnabled: false, discordWebhookUrl: ""
  });

  useEffect(() => {
    if (settings) {
      setForm({
        emailEnabled: settings.emailEnabled, emailAddress: settings.emailAddress || "",
        webhookEnabled: settings.webhookEnabled, webhookUrl: settings.webhookUrl || "",
        discordEnabled: settings.discordEnabled, discordWebhookUrl: settings.discordWebhookUrl || ""
      });
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ data: form }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/notifications"] })
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">Alerts & Notifications</h1>
          <p className="text-muted-foreground mt-1">Configure how you want to be notified when things go wrong.</p>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-card rounded-2xl"></div>
            <div className="h-32 bg-card rounded-2xl"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold">Email Alerts</h3>
                    <p className="text-sm text-muted-foreground">Receive incident updates via email.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer mt-2">
                  <input type="checkbox" className="sr-only peer" checked={form.emailEnabled} onChange={e => setForm({...form, emailEnabled: e.target.checked})} />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              {form.emailEnabled && (
                <div className="mt-4 pt-4 border-t border-border">
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={form.emailAddress} 
                    onChange={e => setForm({...form, emailAddress: e.target.value})}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none"
                    placeholder="alerts@company.com"
                  />
                </div>
              )}
            </div>

            {/* Webhook */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center">
                    <Webhook className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="font-bold">Custom Webhook</h3>
                    <p className="text-sm text-muted-foreground">Send POST requests to your own endpoint.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer mt-2">
                  <input type="checkbox" className="sr-only peer" checked={form.webhookEnabled} onChange={e => setForm({...form, webhookEnabled: e.target.checked})} />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              {form.webhookEnabled && (
                <div className="mt-4 pt-4 border-t border-border">
                  <label className="block text-sm font-medium mb-2">Webhook URL</label>
                  <input 
                    type="url" 
                    value={form.webhookUrl} 
                    onChange={e => setForm({...form, webhookUrl: e.target.value})}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-xl focus:ring-2 focus:ring-primary/50 outline-none"
                    placeholder="https://api.yourdomain.com/webhooks/uptime"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit"
                disabled={updateMutation.isPending}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                {updateMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Preferences
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
