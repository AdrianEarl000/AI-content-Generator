import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLAN_LIMITS } from "@/lib/gemini";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user, recentGenerations, generationsByType] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          subscription: true,
          usageTracking: true,
        },
      }),
      prisma.generation.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.generation.groupBy({
        by: ["type"],
        where: { userId: session.user.id },
        _count: true,
      }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const plan = user.subscription?.plan ?? "FREE";
    const monthlyLimit = PLAN_LIMITS[plan];

    const typeBreakdown = generationsByType.reduce(
      (acc, item) => {
        acc[item.type] = item._count;
        return acc;
      },
      {} as Record<string, number>
    );

    return NextResponse.json({
      plan,
      totalGenerations: user.usageTracking?.totalGenerations ?? 0,
      totalTokens: user.usageTracking?.totalTokens ?? 0,
      monthlyGenerations: user.usageTracking?.monthlyGenerations ?? 0,
      monthlyLimit,
      recentGenerations,
      generationsByType: typeBreakdown,
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
