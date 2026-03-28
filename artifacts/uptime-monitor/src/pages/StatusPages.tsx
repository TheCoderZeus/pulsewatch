import { useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useGetMonitors } from "@workspace/api-client-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import {
  Plus, Globe, ExternalLink, Shield, X, ChevronRight, ChevronLeft,
  Eye, EyeOff, Trash2, Pencil, GripVertical, FolderPlus, Loader2,
  Check, AlertCircle, Copy, CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Types ──────────────────────────────────────────── */
type Category = { id: string; name: string; monitorIds: string[] };
type StatusPage = {
  id: string; name: string; slug: string; description: string | null;
  isPublic: boolean; monitorIds: string[]; categories: Category[]; createdAt: string;
};
type MonitorItem = { id: string; name: string; url: string; status: string };

/* ── API Helpers ────────────────────────────────────── */
function useStatusPages(token: string | null) {
  return useQuery<StatusPage[]>({
    queryKey: ["/api/status-pages"],
    queryFn: async () => {
      const r = await fetch("/api/status-pages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok) throw new Error("Failed to load");
      return r.json();
    },
    enabled: !!token,
  });
}

async function parseErrorMessage(r: Response): Promise<string> {
  const ct = r.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    const e = await r.json().catch(() => ({}));
    return e.error || `Error ${r.status}`;
  }
  return `Error ${r.status}`;
}

function useCreatePage(token: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: object) => {
      const r = await fetch("/api/status-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!r.ok) { throw new Error(await parseErrorMessage(r)); }
      return r.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/status-pages"] }),
  });
}

function useUpdatePage(token: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: object }) => {
      const r = await fetch(`/api/status-pages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      if (!r.ok) { throw new Error(await parseErrorMessage(r)); }
      return r.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/status-pages"] }),
  });
}

function useDeletePage(token: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/status-pages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/status-pages"] }),
  });
}

/* ── Status Dot ─────────────────────────────────────── */
function StatusDot({ status }: { status: string }) {
  const color = status === "up" ? "bg-emerald-400" : status === "down" ? "bg-red-400" : "bg-gray-500";
  return <span className={`inline-block w-2 h-2 rounded-full ${color}`} />;
}

/* ── Live Preview ────────────────────────────────────── */
function StatusPagePreview({
  name, description, isPublic, categories, monitors, uncategorized,
}: {
  name: string; description: string; isPublic: boolean;
  categories: Category[]; monitors: MonitorItem[]; uncategorized: MonitorItem[];
}) {
  const monitorById = new Map(monitors.map(m => [m.id, m]));
  const allIds = [...categories.flatMap(c => c.monitorIds), ...uncategorized.map(m => m.id)];
  const anyDown = allIds.some(id => monitorById.get(id)?.status === "down");
  const overall = anyDown ? "outage" : "operational";

  return (
    <div className="bg-[#0a0b12] rounded-2xl border border-white/8 overflow-hidden h-full">
      {/* Status page header */}
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-2 mb-1">
          <Globe className="w-4 h-4 text-sky-400" />
          <span className="text-xs text-gray-600 font-mono">preview</span>
          {!isPublic && (
            <span className="ml-auto px-2 py-0.5 text-[10px] rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/15">Private</span>
          )}
        </div>
        <h2 className="text-base font-bold text-white mt-2">{name || "My Status Page"}</h2>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
          overall === "operational"
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/15"
            : "bg-red-500/10 text-red-400 border-red-500/15"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${overall === "operational" ? "bg-emerald-400" : "bg-red-400"}`} />
          {overall === "operational" ? "All systems operational" : "Service disruption"}
        </div>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto max-h-80">
        {categories.filter(c => c.monitorIds.length > 0).map(cat => (
          <div key={cat.id}>
            <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">{cat.name}</h3>
            <div className="space-y-1.5">
              {cat.monitorIds.map(mid => {
                const m = monitorById.get(mid);
                if (!m) return null;
                return (
                  <div key={mid} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/3 border border-white/5">
                    <div className="flex items-center gap-2">
                      <StatusDot status={m.status} />
                      <span className="text-xs text-white">{m.name}</span>
                    </div>
                    <span className={`text-[10px] font-medium ${m.status === "up" ? "text-emerald-400" : "text-red-400"}`}>
                      {m.status === "up" ? "Operational" : "Down"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {uncategorized.length > 0 && (
          <div>
            {categories.filter(c => c.monitorIds.length > 0).length > 0 && (
              <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">General</h3>
            )}
            <div className="space-y-1.5">
              {uncategorized.map(m => (
                <div key={m.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/3 border border-white/5">
                  <div className="flex items-center gap-2">
                    <StatusDot status={m.status} />
                    <span className="text-xs text-white">{m.name}</span>
                  </div>
                  <span className={`text-[10px] font-medium ${m.status === "up" ? "text-emerald-400" : "text-red-400"}`}>
                    {m.status === "up" ? "Operational" : "Down"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {categories.every(c => c.monitorIds.length === 0) && uncategorized.length === 0 && (
          <p className="text-xs text-gray-700 text-center py-8">No monitors added yet</p>
        )}
      </div>
    </div>
  );
}

/* ── Builder Component ───────────────────────────────── */
function StatusPageBuilder({
  monitors,
  editPage,
  onClose,
  token,
}: {
  monitors: MonitorItem[];
  editPage: StatusPage | null;
  onClose: () => void;
  token: string | null;
}) {
  const createMutation = useCreatePage(token);
  const updateMutation = useUpdatePage(token);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(editPage?.name ?? "");
  const [slug, setSlug] = useState(editPage?.slug ?? "");
  const [description, setDescription] = useState(editPage?.description ?? "");
  const [isPublic, setIsPublic] = useState(editPage?.isPublic ?? true);
  const [categories, setCategories] = useState<Category[]>(editPage?.categories ?? []);
  const [selectedMonitorIds, setSelectedMonitorIds] = useState<Set<string>>(
    new Set(editPage?.monitorIds ?? [])
  );
  const [newCatName, setNewCatName] = useState("");
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  const autoSlug = (n: string) => n.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");

  const categorizedIds = new Set(categories.flatMap(c => c.monitorIds));
  const uncategorizedMonitors = monitors.filter(m => selectedMonitorIds.has(m.id) && !categorizedIds.has(m.id));
  const selectedMonitors = monitors.filter(m => selectedMonitorIds.has(m.id));

  const addCategory = () => {
    if (!newCatName.trim()) return;
    setCategories(prev => [...prev, { id: crypto.randomUUID(), name: newCatName.trim(), monitorIds: [] }]);
    setNewCatName("");
  };

  const removeCategory = (id: string) => setCategories(prev => prev.filter(c => c.id !== id));
  const renameCategory = (id: string, name: string) => setCategories(prev => prev.map(c => c.id === id ? { ...c, name } : c));

  const addMonitorToCategory = (catId: string, monitorId: string) => {
    setSelectedMonitorIds(prev => new Set([...prev, monitorId]));
    setCategories(prev => prev.map(c =>
      c.id === catId && !c.monitorIds.includes(monitorId)
        ? { ...c, monitorIds: [...c.monitorIds, monitorId] }
        : c
    ));
  };

  const removeMonitorFromCategory = (catId: string, monitorId: string) => {
    setCategories(prev => prev.map(c =>
      c.id === catId ? { ...c, monitorIds: c.monitorIds.filter(id => id !== monitorId) } : c
    ));
  };

  const toggleMonitor = (id: string) => {
    setSelectedMonitorIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setCategories(cats => cats.map(c => ({ ...c, monitorIds: c.monitorIds.filter(mid => mid !== id) })));
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    setError(null);
    const payload = {
      name, slug, description: description || undefined, isPublic,
      monitorIds: Array.from(selectedMonitorIds),
      categories,
    };
    try {
      if (editPage) {
        await updateMutation.mutateAsync({ id: editPage.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const steps = ["Basic Info", "Monitors & Categories", "Preview"];

  return (
    <div className="fixed inset-0 z-50 flex">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative ml-auto w-full max-w-5xl h-full bg-[#09090f] border-l border-white/8 flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
          <div>
            <h2 className="font-bold text-white">{editPage ? "Edit Status Page" : "Create Status Page"}</h2>
            <p className="text-xs text-gray-600 mt-0.5">Configure your public-facing status dashboard</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/6 text-gray-600 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-0 px-6 py-3 border-b border-white/5">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <button
                onClick={() => i <= step && setStep(i)}
                disabled={i > step}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  i === step ? "bg-sky-500/10 text-sky-300 border border-sky-500/15" :
                  i < step ? "text-gray-400 hover:text-white cursor-pointer" :
                  "text-gray-700 cursor-not-allowed"
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                  i < step ? "bg-emerald-500/20 text-emerald-400" :
                  i === step ? "bg-sky-500/20 text-sky-400" : "bg-white/5 text-gray-700"
                }`}>
                  {i < step ? <Check className="w-3 h-3" /> : i + 1}
                </span>
                {s}
              </button>
              {i < steps.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-gray-700 flex-shrink-0" />}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex">
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {/* ── Step 0: Basic Info ── */}
              {step === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-5 max-w-lg">
                  <div>
                    <h3 className="font-semibold text-white mb-1">Page Details</h3>
                    <p className="text-xs text-gray-500">Basic information about your status page.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Page Name *</label>
                    <input
                      value={name}
                      onChange={e => { setName(e.target.value); if (!editPage) setSlug(autoSlug(e.target.value)); }}
                      placeholder="Acme Inc. Status"
                      className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/8 text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-500/25 transition-all text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Slug *</label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 font-mono whitespace-nowrap">skywatch.io/status/</span>
                      <input
                        value={slug}
                        onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                        placeholder="acme-inc"
                        className="flex-1 px-4 py-3 rounded-xl bg-white/4 border border-white/8 text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-500/25 transition-all text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Description</label>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Real-time system status for Acme Inc."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/8 text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-500/25 transition-all text-sm resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-white/8 bg-white/3">
                    <div>
                      <div className="text-sm font-medium text-white">Public page</div>
                      <div className="text-xs text-gray-600 mt-0.5">Anyone with the link can view this status page</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPublic(!isPublic)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${isPublic ? "bg-sky-500" : "bg-white/10"}`}
                    >
                      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ${isPublic ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── Step 1: Monitors & Categories ── */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <div className="mb-5">
                    <h3 className="font-semibold text-white mb-1">Monitors & Categories</h3>
                    <p className="text-xs text-gray-500">Select which monitors to include and group them into categories for a cleaner layout.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    {/* Left: Monitor pool */}
                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        Available Monitors ({monitors.length})
                      </div>
                      <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                        {monitors.length === 0 && (
                          <p className="text-xs text-gray-700 text-center py-6">No monitors yet. Create some first.</p>
                        )}
                        {monitors.map(m => (
                          <div
                            key={m.id}
                            onClick={() => toggleMonitor(m.id)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${
                              selectedMonitorIds.has(m.id)
                                ? "border-sky-500/20 bg-sky-500/6"
                                : "border-white/6 bg-white/2 hover:border-white/12 hover:bg-white/4"
                            }`}
                          >
                            <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border ${
                              selectedMonitorIds.has(m.id)
                                ? "bg-sky-500 border-sky-500"
                                : "bg-transparent border-white/20"
                            }`}>
                              {selectedMonitorIds.has(m.id) && <Check className="w-2.5 h-2.5 text-white" />}
                            </div>
                            <StatusDot status={m.status} />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-medium text-white truncate">{m.name}</div>
                              <div className="text-[10px] text-gray-600 truncate">{m.url}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Categories */}
                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Categories</div>

                      {/* Add category */}
                      <div className="flex gap-2 mb-3">
                        <input
                          value={newCatName}
                          onChange={e => setNewCatName(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addCategory())}
                          placeholder="Category name..."
                          className="flex-1 px-3 py-2 rounded-lg bg-white/4 border border-white/8 text-white placeholder:text-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-500/20 text-xs"
                        />
                        <button
                          type="button"
                          onClick={addCategory}
                          className="px-3 py-2 rounded-lg bg-white/6 border border-white/8 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                        >
                          <FolderPlus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                        {categories.map(cat => (
                          <div key={cat.id} className="rounded-xl border border-white/8 bg-white/2 overflow-hidden">
                            <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5">
                              {editingCatId === cat.id ? (
                                <input
                                  autoFocus
                                  value={cat.name}
                                  onChange={e => renameCategory(cat.id, e.target.value)}
                                  onBlur={() => setEditingCatId(null)}
                                  onKeyDown={e => e.key === "Enter" && setEditingCatId(null)}
                                  className="flex-1 text-xs font-semibold bg-transparent text-white border-b border-sky-500/40 focus:outline-none pb-0.5"
                                />
                              ) : (
                                <span className="flex-1 text-xs font-semibold text-white">{cat.name}</span>
                              )}
                              <button onClick={() => setEditingCatId(cat.id)} className="p-1 text-gray-600 hover:text-white rounded transition-colors">
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button onClick={() => removeCategory(cat.id)} className="p-1 text-gray-700 hover:text-red-400 rounded transition-colors">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="p-2 space-y-1">
                              {cat.monitorIds.map(mid => {
                                const m = monitors.find(m => m.id === mid);
                                if (!m) return null;
                                return (
                                  <div key={mid} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/4 group">
                                    <GripVertical className="w-3 h-3 text-gray-700" />
                                    <StatusDot status={m.status} />
                                    <span className="text-[11px] text-white flex-1 truncate">{m.name}</span>
                                    <button
                                      onClick={() => removeMonitorFromCategory(cat.id, mid)}
                                      className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-600 hover:text-red-400 transition-all"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                );
                              })}
                              {/* Add monitor to category */}
                              <select
                                value=""
                                onChange={e => e.target.value && addMonitorToCategory(cat.id, e.target.value)}
                                className="w-full mt-1 px-2 py-1.5 rounded-lg bg-transparent border border-dashed border-white/10 text-[10px] text-gray-600 focus:outline-none focus:border-sky-500/30 cursor-pointer"
                              >
                                <option value="">+ Add monitor to category</option>
                                {monitors
                                  .filter(m => selectedMonitorIds.has(m.id) && !cat.monitorIds.includes(m.id))
                                  .map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                  ))}
                              </select>
                            </div>
                          </div>
                        ))}

                        {categories.length === 0 && (
                          <div className="text-center py-8">
                            <FolderPlus className="w-6 h-6 text-gray-700 mx-auto mb-2" />
                            <p className="text-xs text-gray-700">Add categories to group your monitors</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Step 2: Preview ── */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                  <div className="mb-5">
                    <h3 className="font-semibold text-white mb-1">Preview & Publish</h3>
                    <p className="text-xs text-gray-500">This is how your status page will look to visitors. Review before publishing.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl border border-white/8 bg-white/3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">URL</span>
                          <span className="font-mono text-sky-400">/status/{slug}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Visibility</span>
                          <span className={isPublic ? "text-emerald-400" : "text-amber-400"}>{isPublic ? "Public" : "Private"}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Monitors</span>
                          <span className="text-white">{selectedMonitorIds.size}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Categories</span>
                          <span className="text-white">{categories.length}</span>
                        </div>
                      </div>

                      {error && (
                        <div className="p-3 rounded-xl bg-red-500/8 border border-red-500/15 text-red-400 text-xs flex items-start gap-2">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                          {error}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!name || !slug || isPending}
                        className="w-full py-3 rounded-xl bg-sky-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/15 hover:bg-sky-400 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                        {editPage ? "Save Changes" : "Publish Status Page"}
                      </button>
                    </div>
                    <StatusPagePreview
                      name={name} description={description} isPublic={isPublic}
                      categories={categories} monitors={monitors} uncategorized={uncategorizedMonitors}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right preview column for steps 0 and 1 */}
          {step < 2 && (
            <div className="w-72 border-l border-white/5 p-4 overflow-y-auto hidden lg:block">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">Live Preview</div>
              <StatusPagePreview
                name={name} description={description} isPublic={isPublic}
                categories={categories} monitors={monitors} uncategorized={uncategorizedMonitors}
              />
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/6">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/8 text-sm text-gray-500 hover:text-white hover:border-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          {step < 2 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={step === 0 && (!name || !slug)}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-sky-500 text-white text-sm font-semibold hover:bg-sky-400 hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-sky-500/15"
            >
              {step === 1 ? "Preview" : "Next"} <ChevronRight className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}

/* ── Page Card ───────────────────────────────────────── */
function PageCard({ page, onEdit, onDelete }: { page: StatusPage; onEdit: () => void; onDelete: () => void }) {
  const [copied, setCopied] = useState(false);
  const url = `/status/${page.slug}`;

  const copyUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.origin + url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl p-5 flex flex-col hover:border-white/14 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/15 flex items-center justify-center">
          <Globe className="w-5 h-5 text-sky-400" />
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium border ${
          page.isPublic
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/15"
            : "bg-amber-500/10 text-amber-400 border-amber-500/15"
        }`}>
          {page.isPublic ? "Public" : "Private"}
        </span>
      </div>

      <h3 className="font-semibold text-white mb-1 text-sm">{page.name}</h3>
      {page.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{page.description}</p>
      )}

      <div className="flex items-center gap-1.5 text-[10px] text-gray-600 mb-4">
        <span className="font-mono bg-white/5 px-2 py-1 rounded">{page.slug}</span>
        {(page.categories?.length ?? 0) > 0 && (
          <span className="px-2 py-1 rounded bg-white/5">{page.categories?.length} categories</span>
        )}
        <span className="px-2 py-1 rounded bg-white/5">{page.monitorIds.length} monitors</span>
      </div>

      <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={copyUrl}
            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/6"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy URL"}
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onEdit}
            className="p-1.5 text-gray-600 hover:text-white hover:bg-white/8 rounded-lg transition-all"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 text-gray-600 hover:text-sky-400 hover:bg-sky-500/8 rounded-lg transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-700 hover:text-red-400 hover:bg-red-500/8 rounded-lg transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────── */
export function StatusPages() {
  const { session } = useAuth();
  const token = session?.access_token ?? null;
  const [builderOpen, setBuilderOpen] = useState(false);
  const [editPage, setEditPage] = useState<StatusPage | null>(null);
  const qc = useQueryClient();

  const { data: pages, isLoading } = useStatusPages(token);
  const { data: monitorsRaw } = useGetMonitors();
  const deleteMutation = useDeletePage(token);

  const monitors: MonitorItem[] = (monitorsRaw ?? []).map(m => ({
    id: m.id, name: m.name, url: m.url, status: m.status,
  }));

  const openCreate = () => { setEditPage(null); setBuilderOpen(true); };
  const openEdit = (page: StatusPage) => { setEditPage(page); setBuilderOpen(true); };
  const closeBuilder = () => { setBuilderOpen(false); setEditPage(null); };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Status Pages</h1>
          <p className="text-gray-500 mt-1 text-sm">Public dashboards to keep your users informed.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 text-white text-sm font-semibold hover:bg-sky-400 hover:-translate-y-0.5 transition-all shadow-lg shadow-sky-500/15"
        >
          <Plus className="w-4 h-4" /> Create Page
        </button>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2].map(i => (
            <div key={i} className="h-52 bg-white/3 rounded-2xl border border-white/6 animate-pulse" />
          ))}
        </div>
      ) : pages && pages.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pages.map(page => (
            <PageCard
              key={page.id}
              page={page}
              onEdit={() => openEdit(page)}
              onDelete={() => deleteMutation.mutate(page.id)}
            />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center rounded-2xl border border-dashed border-white/8 bg-white/2">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/10 flex items-center justify-center mx-auto mb-5">
            <Shield className="w-7 h-7 text-sky-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Build trust with a status page</h3>
          <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
            Be transparent about your system's uptime. Create a beautiful, public status page with monitor groups and categories.
          </p>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 text-white text-sm font-semibold hover:bg-sky-400 hover:-translate-y-0.5 transition-all shadow-lg shadow-sky-500/15"
          >
            <Plus className="w-4 h-4" /> Create your first status page
          </button>
        </div>
      )}

      <AnimatePresence>
        {builderOpen && (
          <StatusPageBuilder
            monitors={monitors}
            editPage={editPage}
            onClose={closeBuilder}
            token={token}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
