import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLAN_LIMITS, getContentTypeLabel, CONTENT_TYPE_ICONS } from "@/lib/gemini";
import { formatDate, truncate, formatNumber } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Zap, TrendingUp, FileText, Clock } from "lucide-react";
import { ContentType } from "@prisma/client";

async function getDashboardData(userId: string) {
  const [user, recentGenerations, generationCounts] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true, usageTracking: true },
    }),
    prisma.generation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.generation.groupBy({
      by: ["type"],
      where: { userId },
      _count: true,
    }),
  ]);

  return { user, recentGenerations, generationCounts };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const { user, recentGenerations, generationCounts } = await getDashboardData(session.user.id);

  const plan = user?.subscription?.plan ?? "FREE";
  const monthlyLimit = PLAN_LIMITS[plan];
  const monthlyUsed = user?.usageTracking?.monthlyGenerations ?? 0;
  const totalTokens = user?.usageTracking?.totalTokens ?? 0;
  const totalGenerations = user?.usageTracking?.totalGenerations ?? 0;
  const usagePercent = monthlyLimit === Infinity ? 0 : Math.min((monthlyUsed / monthlyLimit) * 100, 100);

  const typeBreakdown = generationCounts.reduce((acc, g) => {
    acc[g.type as ContentType] = g._count;
    return acc;
  }, {} as Record<ContentType, number>);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"},{" "}
            {session.user.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-white/40 text-sm mt-1">Here's your content overview</p>
        </div>
        <Link
          href="/dashboard/generate"
          className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-bg text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25"
        >
          <Zap className="w-4 h-4" />
          Generate content
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Generations", value: formatNumber(totalGenerations), icon: <FileText className="w-5 h-5" />, color: "text-violet-400", bg: "bg-violet-500/10" },
          { label: "Tokens Used", value: formatNumber(totalTokens), icon: <TrendingUp className="w-5 h-5" />, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "This Month", value: `${monthlyUsed}${monthlyLimit !== Infinity ? `/${monthlyLimit}` : ""}`, icon: <Clock className="w-5 h-5" />, color: "text-green-400", bg: "bg-green-500/10" },
          { label: "Plan", value: plan, icon: <Zap className="w-5 h-5" />, color: "text-amber-400", bg: "bg-amber-500/10" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <p className="text-white/40 text-xs mb-1">{stat.label}</p>
            <p className="text-xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Usage + Content Types */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Usage bar */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Monthly Usage</h2>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              plan === "FREE" ? "bg-white/10 text-white/60" : "bg-violet-500/20 text-violet-300"
            }`}>
              {plan}
            </span>
          </div>
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/60">{monthlyUsed} generations used</span>
              <span className="text-white/40">{monthlyLimit === Infinity ? "∞" : monthlyLimit} limit</span>
            </div>
            <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full gradient-bg transition-all duration-1000"
                style={{ width: `${monthlyLimit === Infinity ? 20 : usagePercent}%` }}
              />
            </div>
          </div>
          {plan === "FREE" && (
            <div className="mt-4 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <p className="text-sm text-violet-300">
                Upgrade to Pro for unlimited generations.{" "}
                <Link href="/dashboard/pricing" className="font-semibold underline">
                  View plans →
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Content Types */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-4">Content Breakdown</h2>
          {totalGenerations === 0 ? (
            <div className="flex flex-col items-center justify-center h-24 text-white/30">
              <FileText className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No content generated yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {(["BLOG_POST", "SOCIAL_CAPTION", "MARKETING_COPY", "PRODUCT_DESCRIPTION"] as ContentType[]).map((type) => {
                const count = typeBreakdown[type] ?? 0;
                const pct = totalGenerations > 0 ? (count / totalGenerations) * 100 : 0;
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-white/60">
                        {CONTENT_TYPE_ICONS[type]} {getContentTypeLabel(type)}
                      </span>
                      <span className="text-white/40">{count}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-violet-500/60 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Generations */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-white">Recent Generations</h2>
          <Link href="/dashboard/history" className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {recentGenerations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">✨</div>
            <p className="text-white/40 text-sm mb-4">No content generated yet</p>
            <Link
              href="/dashboard/generate"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl gradient-bg text-sm font-medium text-white"
            >
              Create your first content
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentGenerations.map((gen) => (
              <div key={gen.id} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/8 transition-colors">
                <div className="text-2xl shrink-0">{CONTENT_TYPE_ICONS[gen.type]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">
                      {getContentTypeLabel(gen.type)}
                    </span>
                    <span className="text-xs text-white/30">{gen.tokens} tokens</span>
                  </div>
                  <p className="text-sm text-white/70 truncate">{truncate(gen.prompt, 80)}</p>
                  <p className="text-xs text-white/30 mt-1">{formatDate(gen.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
