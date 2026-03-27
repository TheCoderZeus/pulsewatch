import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetNotificationSettings, useUpdateNotificationSettings } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Loader2, ExternalLink, CheckCircle2, AlertCircle, Send } from "lucide-react";

export function Notifications() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useGetNotificationSettings();
  const updateMutation = useUpdateNotificationSettings();

  const [discordEnabled, setDiscordEnabled] = useState(false);
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState("");
  const [testStatus, setTestStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  useEffect(() => {
    if (settings) {
      setDiscordEnabled(settings.discordEnabled);
      setDiscordWebhookUrl(settings.discordWebhookUrl || "");
    }
  }, [settings]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(
      {
        data: {
          emailEnabled: false,
          emailAddress: "",
          webhookEnabled: false,
          webhookUrl: "",
          discordEnabled,
          discordWebhookUrl,
        },
      },
      { onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/notifications"] }) }
    );
  };

  const handleTestDiscord = async () => {
    if (!discordWebhookUrl) return;
    setTestStatus("sending");
    try {
      await fetch(discordWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [
            {
              title: "✅ SkyWatch Test Alert",
              description: "Your Discord notification is configured correctly! You'll receive alerts here when monitors go down.",
              color: 0x0ea5e9,
              footer: { text: "SkyWatch — API Monitoring" },
            },
          ],
        }),
      });
      setTestStatus("ok");
    } catch {
      setTestStatus("error");
    }
    setTimeout(() => setTestStatus("idle"), 4000);
  };

  const isValidWebhook = discordWebhookUrl.startsWith("https://discord.com/api/webhooks/");

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Alerts & Notifications</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Get notified instantly on Discord when any of your monitors go down.
          </p>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-white/4 rounded-2xl border border-white/6" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            <div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#5865F2]/15 border border-[#5865F2]/20">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#5865F2">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">Discord Webhook</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Receive rich alert embeds directly in your Discord server.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDiscordEnabled(!discordEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${discordEnabled ? "bg-sky-500" : "bg-white/10"}`}
                >
                  <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ${discordEnabled ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Webhook URL</label>
                  <div className="relative">
                    <input
                      type="url"
                      value={discordWebhookUrl}
                      onChange={(e) => { setDiscordWebhookUrl(e.target.value); setTestStatus("idle"); }}
                      placeholder="https://discord.com/api/webhooks/..."
                      disabled={!discordEnabled}
                      className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/8 text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-mono"
                    />
                    {discordWebhookUrl && isValidWebhook && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </div>
                    )}
                  </div>
                  {discordWebhookUrl && !isValidWebhook && (
                    <p className="text-xs text-amber-400 flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3" />
                      Must start with https://discord.com/api/webhooks/
                    </p>
                  )}
                </div>

                <div className="rounded-xl bg-sky-500/5 border border-sky-500/10 p-4">
                  <h4 className="text-xs font-semibold text-sky-300 mb-2.5">How to get your webhook URL</h4>
                  <ol className="text-xs text-gray-500 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold font-mono mt-0.5 flex-shrink-0">1.</span>
                      Open Discord → go to the channel you want alerts in → <strong className="text-gray-400">Edit Channel</strong>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold font-mono mt-0.5 flex-shrink-0">2.</span>
                      Go to <strong className="text-gray-400">Integrations</strong> → <strong className="text-gray-400">Webhooks</strong> → <strong className="text-gray-400">New Webhook</strong>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold font-mono mt-0.5 flex-shrink-0">3.</span>
                      Click <strong className="text-gray-400">Copy Webhook URL</strong> and paste it above
                    </li>
                  </ol>
                  <a
                    href="https://support.discord.com/hc/en-us/articles/228383668"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 mt-3 transition-colors"
                  >
                    Discord documentation <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <button
                  type="button"
                  onClick={handleTestDiscord}
                  disabled={!discordEnabled || !isValidWebhook || testStatus === "sending"}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/8 bg-white/4 text-sm font-medium text-gray-400 hover:text-white hover:border-white/15 hover:bg-white/8 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {testStatus === "sending" ? <Loader2 className="w-4 h-4 animate-spin" /> : testStatus === "ok" ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : testStatus === "error" ? <AlertCircle className="w-4 h-4 text-red-400" /> : <Send className="w-4 h-4" />}
                  {testStatus === "sending" ? "Sending..." : testStatus === "ok" ? "Message sent!" : testStatus === "error" ? "Failed — check URL" : "Send test message"}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
              <h3 className="text-sm font-semibold text-white mb-3">What triggers a Discord alert?</h3>
              <div className="space-y-3">
                {[
                  { dot: "bg-red-400", label: "Monitor goes DOWN", desc: "Sent immediately when a check fails" },
                  { dot: "bg-emerald-400", label: "Monitor recovers", desc: "Sent when the monitor comes back up" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.dot} flex-shrink-0`} />
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-white">{item.label}</span>
                      <span className="text-xs text-gray-600">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/15 hover:bg-sky-400 hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Save Settings
              </button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
