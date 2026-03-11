import { GoogleGenerativeAI } from "@google/generative-ai";
import { ContentType } from "@prisma/client";


export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);


export const PLAN_LIMITS = {
  FREE: 10,
  PRO: Infinity,
  ENTERPRISE: Infinity,
};

export function getSystemPrompt(type: ContentType): string {
  const prompts: Record<ContentType, string> = {
    BLOG_POST: `You are an expert content writer specializing in creating engaging, SEO-optimized blog posts. 
    Write well-structured blog posts with clear headings, compelling introductions, informative body content, 
    and strong calls-to-action. Use markdown formatting for headings and structure.`,

    SOCIAL_CAPTION: `You are a social media expert who creates viral, engaging captions. 
    Write punchy, attention-grabbing captions that are platform-optimized. 
    Include relevant hashtags and emojis where appropriate. Keep it concise and impactful.`,

    MARKETING_COPY: `You are a world-class copywriter specializing in conversion-focused marketing copy. 
    Write persuasive, benefit-driven copy that speaks to the target audience's pain points and desires. 
    Use proven copywriting frameworks like AIDA or PAS. Focus on value proposition and clear CTAs.`,

    PRODUCT_DESCRIPTION: `You are an e-commerce copywriting specialist who creates compelling product descriptions. 
    Write descriptions that highlight key features, benefits, and unique selling points. 
    Use sensory language to help customers visualize using the product. 
    Include relevant keywords naturally for SEO purposes.`,
  };

  return prompts[type];
}

export function getContentTypeLabel(type: ContentType): string {
  const labels: Record<ContentType, string> = {
    BLOG_POST: "Blog Post",
    SOCIAL_CAPTION: "Social Caption",
    MARKETING_COPY: "Marketing Copy",
    PRODUCT_DESCRIPTION: "Product Description",
  };
  return labels[type];
}

export const CONTENT_TYPE_ICONS: Record<ContentType, string> = {
  BLOG_POST: "📝",
  SOCIAL_CAPTION: "📱",
  MARKETING_COPY: "📣",
  PRODUCT_DESCRIPTION: "🛍️",
};
