import { ContentType, PlanType } from "@prisma/client";

export interface GenerationWithUser {
  id: string;
  userId: string;
  type: ContentType;
  prompt: string;
  result: string;
  tokens: number;
  model: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithSubscription {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  subscription: {
    plan: PlanType;
    status: string;
  } | null;
  usageTracking: {
    totalGenerations: number;
    totalTokens: number;
    monthlyGenerations: number;
    monthlyTokens: number;
  } | null;
}

export interface DashboardStats {
  totalGenerations: number;
  totalTokens: number;
  monthlyGenerations: number;
  monthlyLimit: number;
  plan: PlanType;
  recentGenerations: GenerationWithUser[];
  generationsByType: Record<ContentType, number>;
}

export interface GenerateRequest {
  type: ContentType;
  prompt: string;
  tone?: string;
  length?: "short" | "medium" | "long";
}

export interface GenerateResponse {
  id: string;
  result: string;
  tokens: number;
  type: ContentType;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
