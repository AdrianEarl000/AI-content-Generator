import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Check, Zap, Star, Shield } from "lucide-react";
import Link from "next/link";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for getting started",
    features: [
      "10 generations per month",
      "All 4 content types",
      "Copy & download results",
      "Content history (30 days)",
      "Standard AI model",
    ],
    cta: "Current Plan",
    highlight: false,
    planKey: "FREE",
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For creators and marketers",
    features: [
      "Unlimited generations",
      "All 4 content types",
      "Priority AI processing",
      "Unlimited content history",
      "Advanced filtering & export",
      "Email support",
      "Early access to new features",
    ],
    cta: "Upgrade to Pro",
    highlight: true,
    planKey: "PRO",
  },
  {
    name: "Enterprise",
    price: "$79",
    period: "/month",
    description: "For teams and agencies",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Custom brand voice training",
      "API access",
      "Dedicated account manager",
      "SLA guarantee",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    highlight: false,
    planKey: "ENTERPRISE",
  },
];

export default async function PricingPage() {
  const session = await getServerSession(authOptions);
  let currentPlan = "FREE";

  if (session?.user?.id) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });
    currentPlan = subscription?.plan ?? "FREE";
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-3">
          Simple, transparent pricing
        </h1>
        <p className="text-white/40 max-w-md mx-auto">
          Choose the plan that fits your needs. Upgrade or downgrade at any time.
        </p>
      </div>

      {/* Current Plan Banner */}
      {currentPlan !== "FREE" && (
        <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
            <Star className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              You're on the {currentPlan} plan
            </p>
            <p className="text-xs text-white/40">Manage your subscription anytime</p>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {PLANS.map((plan) => {
          const isCurrentPlan = plan.planKey === currentPlan;
          return (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-7 flex flex-col ${
                plan.highlight
                  ? "bg-gradient-to-br from-violet-600/30 to-indigo-600/30 border-2 border-violet-500/50"
                  : "glass-card border border-white/5"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full bg-violet-500 text-xs font-bold whitespace-nowrap">
                  <Star className="w-3 h-3" />
                  MOST POPULAR
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-black text-white">{plan.price}</span>
                  <span className="text-white/40 text-sm">{plan.period}</span>
                </div>
                <p className="text-sm text-white/50">{plan.description}</p>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? "text-violet-300" : "text-green-400"}`} />
                    <span className="text-white/70">{f}</span>
                  </li>
                ))}
              </ul>

              {isCurrentPlan ? (
                <div className="w-full py-3 rounded-xl text-center text-sm font-semibold bg-white/10 text-white/60 border border-white/10">
                  ✓ Current Plan
                </div>
              ) : plan.planKey === "ENTERPRISE" ? (
                <a
                  href="mailto:sales@contentai.com"
                  className="block w-full py-3 rounded-xl text-center text-sm font-semibold border border-white/20 text-white/70 hover:bg-white/5 transition-colors"
                >
                  {plan.cta}
                </a>
              ) : (
                <button
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                    plan.highlight
                      ? "gradient-bg text-white hover:opacity-90 shadow-lg shadow-violet-500/25"
                      : "border border-white/20 text-white/70 hover:bg-white/5"
                  }`}
                  onClick={() => alert("Stripe integration required. Add STRIPE_SECRET_KEY to enable payments.")}
                >
                  {plan.cta}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="glass-card rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              q: "Can I cancel anytime?",
              a: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
            },
            {
              q: "What happens when I reach my limit?",
              a: "On the Free plan, you'll be notified and prompted to upgrade. Your existing content will remain accessible.",
            },
            {
              q: "Is my data secure?",
              a: "Yes. We use enterprise-grade encryption and never share or sell your data. Your prompts are never used to train AI models.",
            },
            {
              q: "Do unused generations roll over?",
              a: "On the Free plan, generations reset monthly and don't roll over. Pro plan users have unlimited generations so this doesn't apply.",
            },
          ].map((faq) => (
            <div key={faq.q}>
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-violet-400 shrink-0" />
                {faq.q}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
