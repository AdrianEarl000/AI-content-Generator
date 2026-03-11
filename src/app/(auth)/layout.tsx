import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#080810] flex flex-col items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
      </div>

      <Link href="/" className="relative z-10 flex items-center gap-2 mb-8">
        <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-violet-500/30">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">ContentAI</span>
      </Link>

      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
