import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { genAI, getSystemPrompt, PLAN_LIMITS } from "@/lib/gemini";
import { ContentType } from "@prisma/client";

const generateSchema = z.object({
  type: z.enum(["BLOG_POST", "SOCIAL_CAPTION", "MARKETING_COPY", "PRODUCT_DESCRIPTION"]),
  prompt: z.string().min(10).max(1000),
  tone: z.string().optional(),
  length: z.enum(["short", "medium", "long"]).optional(),
});

const LENGTH_TOKENS: Record<string, number> = {
  short: 300,
  medium: 600,
  long: 1000,
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, prompt, tone, length = "medium" } = generateSchema.parse(body);

    // Check subscription and usage
    const [subscription, usageTracking] = await Promise.all([
      prisma.subscription.findUnique({ where: { userId: session.user.id } }),
      prisma.usageTracking.findUnique({ where: { userId: session.user.id } }),
    ]);

    const plan = subscription?.plan ?? "FREE";
    const monthlyLimit = PLAN_LIMITS[plan];
    const monthlyUsage = usageTracking?.monthlyGenerations ?? 0;

    if (monthlyUsage >= monthlyLimit) {
      return NextResponse.json(
        {
          error: "Monthly generation limit reached. Please upgrade to Pro.",
          limitReached: true,
        },
        { status: 429 }
      );
    }

    // Build the user prompt
    const toneInstructions = tone ? `\n\nTone: ${tone}` : "";
    const lengthInstructions = `\n\nLength: Please write a ${length} length response (approximately ${LENGTH_TOKENS[length]} words).`;
    const fullPrompt = `${prompt}${toneInstructions}${lengthInstructions}`;

    
    // Call Google Gemini API
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: getSystemPrompt(type as ContentType),
    });

    const completion = await model.generateContent(fullPrompt);
    
    // 1. Get the text and tokens from Gemini
    const result = completion.response.text();
    const tokensUsed = completion.response.usageMetadata?.totalTokenCount ?? 0;

    // 2. Save generation to database
    const generation = await prisma.generation.create({
      data: {
        userId: session.user.id,
        type: type as ContentType,
        prompt,
        result,
        tokens: tokensUsed, // I changed this back to 'tokens' to match your old database setup
      },
    });

    // Update usage tracking
    await prisma.usageTracking.update({
      where: { userId: session.user.id },
      data: {
        totalGenerations: { increment: 1 },
        totalTokens: { increment: tokensUsed },
        monthlyGenerations: { increment: 1 },
        monthlyTokens: { increment: tokensUsed },
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      id: generation.id,
      result,
      tokens: tokensUsed,
      type,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate content. Please try again." },
      { status: 500 }
    );
  }
}
