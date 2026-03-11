"use client";

import { useState } from "react";
import {
  Sparkles,
  Copy,
  RefreshCw,
  Loader2,
  CheckCheck,
  FileText,
  Smartphone,
  Megaphone,
  ShoppingBag,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ContentType } from "@prisma/client";

const CONTENT_TYPES = [
  {
    type: "BLOG_POST" as ContentType,
    label: "Blog Post",
    icon: FileText,
    description: "SEO-optimized articles",
    color: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30",
    active: "bg-blue-500/20 border-blue-500/40",
    iconColor: "text-blue-400",
  },
  {
    type: "SOCIAL_CAPTION" as ContentType,
    label: "Social Caption",
    icon: Smartphone,
    description: "Viral social content",
    color: "from-pink-500/20 to-rose-500/20",
    border: "border-pink-500/30",
    active: "bg-pink-500/20 border-pink-500/40",
    iconColor: "text-pink-400",
  },
  {
    type: "MARKETING_COPY" as ContentType,
    label: "Marketing Copy",
    icon: Megaphone,
    description: "Conversion-focused copy",
    color: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/30",
    active: "bg-amber-500/20 border-amber-500/40",
    iconColor: "text-amber-400",
  },
  {
    type: "PRODUCT_DESCRIPTION" as ContentType,
    label: "Product Description",
    icon: ShoppingBag,
    description: "E-commerce copy",
    color: "from-emerald-500/20 to-green-500/20",
    border: "border-emerald-500/30",
    active: "bg-emerald-500/20 border-emerald-500/40",
    iconColor: "text-emerald-400",
  },
];

const TONES = ["Professional", "Casual", "Humorous", "Persuasive", "Informative", "Inspirational"];
const LENGTHS = [
  { value: "short", label: "Short", desc: "~300 words" },
  { value: "medium", label: "Medium", desc: "~600 words" },
  { value: "long", label: "Long", desc: "~1000 words" },
];

export default function GeneratePage() {
  const [selectedType, setSelectedType] = useState<ContentType>("BLOG_POST");
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState("");
  const [tokens, setTokens] = useState(0);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || prompt.length < 10) {
      setError("Please provide a more detailed prompt (at least 10 characters)");
      return;
    }

    setIsGenerating(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: selectedType, prompt, tone, length }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.limitReached) {
          setError("Monthly generation limit reached. Upgrade to Pro for unlimited generations.");
        } else {
          setError(data.error || "Failed to generate content");
        }
        return;
      }

      setResult(data.result);
      setTokens(data.tokens);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    setResult("");
    handleGenerate();
  };

  const selectedTypeData = CONTENT_TYPES.find((t) => t.type === selectedType)!;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Generate Content</h1>
        <p className="text-white/40 text-sm mt-1">Choose a type, write your prompt, and let AI do the rest</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: Config */}
        <div className="lg:col-span-2 space-y-4">
          {/* Content Type Selector */}
          <div className="glass-card rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white/70 mb-3">Content Type</h2>
            <div className="grid grid-cols-2 gap-2">
              {CONTENT_TYPES.map((ct) => {
                const isActive = selectedType === ct.type;
                return (
                  <button
                    key={ct.type}
                    onClick={() => setSelectedType(ct.type)}
                    className={cn(
                      "flex flex-col items-start gap-1.5 p-3 rounded-xl border transition-all text-left",
                      isActive
                        ? `${ct.active} border-2`
                        : `border-white/10 hover:bg-white/5`
                    )}
                  >
                    <ct.icon className={cn("w-4 h-4", isActive ? ct.iconColor : "text-white/40")} />
                    <div>
                      <p className={cn("text-xs font-semibold leading-none", isActive ? "text-white" : "text-white/60")}>
                        {ct.label}
                      </p>
                      <p className="text-xs text-white/30 mt-0.5 leading-none">{ct.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tone & Length */}
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-white/70 mb-2">Tone</h2>
              <div className="relative">
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                >
                  {TONES.map((t) => (
                    <option key={t} value={t} className="bg-[#0e0e1a]">{t}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white/70 mb-2">Length</h2>
              <div className="grid grid-cols-3 gap-1.5">
                {LENGTHS.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLength(l.value as typeof length)}
                    className={cn(
                      "py-2 rounded-lg text-xs font-medium transition-all border",
                      length === l.value
                        ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                        : "border-white/10 text-white/40 hover:bg-white/5 hover:text-white/60"
                    )}
                  >
                    <div>{l.label}</div>
                    <div className="text-white/30 font-normal">{l.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Prompt + Result */}
        <div className="lg:col-span-3 space-y-4">
          {/* Prompt Input */}
          <div className="glass-card rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white/70 mb-3">Your Prompt</h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                selectedType === "BLOG_POST"
                  ? "e.g. Write a blog post about the benefits of remote work for software developers..."
                  : selectedType === "SOCIAL_CAPTION"
                  ? "e.g. Create an Instagram caption for my new coffee shop launch with a cozy autumn vibe..."
                  : selectedType === "MARKETING_COPY"
                  ? "e.g. Write compelling marketing copy for a new productivity app that helps teams collaborate..."
                  : "e.g. Describe a premium noise-cancelling wireless headphone with 30-hour battery life..."
              }
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/30 resize-none text-sm leading-relaxed transition-all"
            />
            <div className="flex items-center justify-between mt-3">
              <span className={cn("text-xs", prompt.length > 900 ? "text-red-400" : "text-white/30")}>
                {prompt.length}/1000
              </span>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-bg text-sm font-semibold text-white hover:opacity-90 transition-all disabled:opacity-40 shadow-lg shadow-violet-500/20"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                {isGenerating ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Loading skeleton */}
          {isGenerating && (
            <div className="glass-card rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-violet-400 mb-4">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="text-sm font-medium">AI is crafting your content...</span>
              </div>
              {[100, 80, 90, 60, 75].map((w, i) => (
                <div key={i} className={`h-3 bg-white/5 rounded-full shimmer`} style={{ width: `${w}%` }} />
              ))}
            </div>
          )}

          {/* Result */}
          {result && !isGenerating && (
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-green-400`} />
                  <span className="text-sm font-semibold text-white">Generated Content</span>
                  <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{tokens} tokens</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRegenerate}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-xs transition-all"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate
                  </button>
                  <button
                    onClick={handleCopy}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      copied
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "gradient-bg text-white hover:opacity-90"
                    )}
                  >
                    {copied ? <CheckCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="prose-custom text-sm leading-relaxed text-white/80 whitespace-pre-wrap">
                  {result}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
