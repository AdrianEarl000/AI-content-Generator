"use client";

import { useState, useEffect, useCallback } from "react";
import { Copy, Trash2, CheckCheck, Search, Filter, ChevronLeft, ChevronRight, Loader2, FileText, Smartphone, Megaphone, ShoppingBag } from "lucide-react";
import { formatDate, truncate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ContentType } from "@prisma/client";

const TYPE_FILTERS = [
  { value: "", label: "All Types", icon: null },
  { value: "BLOG_POST", label: "Blog Post", icon: FileText },
  { value: "SOCIAL_CAPTION", label: "Social Caption", icon: Smartphone },
  { value: "MARKETING_COPY", label: "Marketing Copy", icon: Megaphone },
  { value: "PRODUCT_DESCRIPTION", label: "Product Desc.", icon: ShoppingBag },
];

const TYPE_ICONS: Record<ContentType, string> = {
  BLOG_POST: "📝",
  SOCIAL_CAPTION: "📱",
  MARKETING_COPY: "📣",
  PRODUCT_DESCRIPTION: "🛍️",
};

const TYPE_LABELS: Record<ContentType, string> = {
  BLOG_POST: "Blog Post",
  SOCIAL_CAPTION: "Social Caption",
  MARKETING_COPY: "Marketing Copy",
  PRODUCT_DESCRIPTION: "Product Description",
};

interface Generation {
  id: string;
  type: ContentType;
  prompt: string;
  result: string;
  tokens: number;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function HistoryPage() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "8" });
      if (typeFilter) params.set("type", typeFilter);
      const res = await fetch(`/api/history?${params}`);
      const data = await res.json();
      setGenerations(data.generations);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, typeFilter]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this generation?")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/history?id=${id}`, { method: "DELETE" });
      setGenerations((prev) => prev.filter((g) => g.id !== id));
      if (pagination) {
        setPagination((p) => p ? { ...p, total: p.total - 1 } : p);
      }
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Content History</h1>
          <p className="text-white/40 text-sm mt-1">
            {pagination ? `${pagination.total} total generations` : "Loading..."}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex flex-wrap gap-2">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => { setTypeFilter(f.value); setPage(1); }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                typeFilter === f.value
                  ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                  : "border-white/10 text-white/40 hover:bg-white/5 hover:text-white/60"
              )}
            >
              {f.icon && <f.icon className="w-3 h-3" />}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
        </div>
      ) : generations.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <div className="text-5xl mb-4">📄</div>
          <h3 className="text-white font-semibold mb-2">No content found</h3>
          <p className="text-white/40 text-sm">
            {typeFilter ? "No generations found for this type." : "Start generating content to see your history here."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {generations.map((gen) => (
            <div key={gen.id} className="glass-card rounded-2xl overflow-hidden hover:bg-white/8 transition-colors">
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-4 cursor-pointer"
                onClick={() => setExpandedId(expandedId === gen.id ? null : gen.id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl shrink-0">{TYPE_ICONS[gen.type]}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">
                        {TYPE_LABELS[gen.type]}
                      </span>
                      <span className="text-xs text-white/30">{gen.tokens} tokens</span>
                    </div>
                    <p className="text-sm text-white/70 truncate">{truncate(gen.prompt, 90)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <span className="hidden md:block text-xs text-white/30">{formatDate(gen.createdAt)}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleCopy(gen.id, gen.result); }}
                    className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      copiedId === gen.id ? "text-green-400" : "text-white/30 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {copiedId === gen.id ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(gen.id); }}
                    disabled={deletingId === gen.id}
                    className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                  >
                    {deletingId === gen.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded content */}
              {expandedId === gen.id && (
                <div className="border-t border-white/5 px-5 py-4">
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">Prompt</p>
                    <p className="text-sm text-white/60 bg-white/5 rounded-lg p-3">{gen.prompt}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">Result</p>
                    <div className="text-sm text-white/70 bg-white/5 rounded-lg p-4 max-h-64 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                      {gen.result}
                    </div>
                  </div>
                  <p className="text-xs text-white/30 mt-3 md:hidden">{formatDate(gen.createdAt)}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-white/10 text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-sm font-medium transition-all",
                    page === p
                      ? "gradient-bg text-white shadow-lg shadow-violet-500/20"
                      : "text-white/40 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {p}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="p-2 rounded-lg border border-white/10 text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
