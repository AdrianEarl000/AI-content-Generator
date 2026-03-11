import Link from "next/link";
import { ArrowRight, Zap, Shield, BarChart3, Sparkles, Check, Star } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#080810] text-white overflow-x-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">ContentAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-white/70 hover:text-white transition-colors px-4 py-2">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium px-4 py-2 rounded-lg gradient-bg hover:opacity-90 transition-opacity"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-medium mb-8">
          <Sparkles className="w-3 h-3" />
          Powered by GPT-4 Technology
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-none">
          Create content that{" "}
          <span className="gradient-text">converts</span>
          <br />
          in seconds.
        </h1>
        <p className="text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
          Generate blog posts, social captions, marketing copy, and product descriptions
          with AI. Save hours every week — focus on what matters.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="group flex items-center gap-2 px-6 py-3 rounded-xl gradient-bg font-semibold text-white hover:opacity-90 transition-all shadow-lg shadow-violet-500/25"
          >
            Start generating for free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-all"
          >
            Sign in to dashboard
          </Link>
        </div>
        <p className="mt-4 text-xs text-white/30">No credit card required · 10 free generations</p>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to create{" "}
            <span className="gradient-text">great content</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Four content types, unlimited creative possibilities.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "📝", title: "Blog Posts", desc: "SEO-optimized long-form articles that rank and convert." },
            { icon: "📱", title: "Social Captions", desc: "Engaging captions for every platform with hashtags." },
            { icon: "📣", title: "Marketing Copy", desc: "Conversion-focused copy using proven frameworks." },
            { icon: "🛍️", title: "Product Descriptions", desc: "Compelling descriptions that drive purchase decisions." },
          ].map((f) => (
            <div key={f.title} className="glass-card rounded-2xl p-6 hover:bg-white/10 transition-colors">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {[
            { icon: <Zap className="w-5 h-5" />, title: "Lightning Fast", desc: "Generate content in under 10 seconds with our optimized AI pipeline." },
            { icon: <Shield className="w-5 h-5" />, title: "Secure & Private", desc: "Your content and prompts are never used to train AI models." },
            { icon: <BarChart3 className="w-5 h-5" />, title: "Track Usage", desc: "Monitor your generations, tokens, and content history in real-time." },
          ].map((f) => (
            <div key={f.title} className="glass-card rounded-2xl p-6">
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-white/50">Start free. Upgrade when you need more.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <div className="glass-card rounded-2xl p-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-1">Free</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">$0</span>
                <span className="text-white/40">/month</span>
              </div>
              <p className="text-white/50 text-sm mt-2">Perfect for getting started</p>
            </div>
            <ul className="space-y-3 mb-8">
              {["10 generations/month", "All content types", "Copy & download results", "Content history"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                  <Check className="w-4 h-4 text-green-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="block w-full text-center py-3 rounded-xl border border-white/20 text-white/80 hover:bg-white/5 transition-colors font-medium">
              Get started free
            </Link>
          </div>
          {/* Pro */}
          <div className="relative rounded-2xl p-8 bg-gradient-to-br from-violet-600/40 to-indigo-600/40 border border-violet-500/40">
            <div className="absolute -top-3 right-6 flex items-center gap-1 px-3 py-1 rounded-full bg-violet-500 text-xs font-bold">
              <Star className="w-3 h-3" />
              MOST POPULAR
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-1">Pro</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">$19</span>
                <span className="text-white/40">/month</span>
              </div>
              <p className="text-white/50 text-sm mt-2">For power users & teams</p>
            </div>
            <ul className="space-y-3 mb-8">
              {["Unlimited generations", "All content types", "Priority AI processing", "Advanced history & filters", "Export to multiple formats", "Email support"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                  <Check className="w-4 h-4 text-violet-300 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="block w-full text-center py-3 rounded-xl gradient-bg font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25">
              Start Pro trial
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md gradient-bg flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-sm">ContentAI</span>
          </div>
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} ContentAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
