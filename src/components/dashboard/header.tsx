"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import { LogOut, Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

interface HeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function DashboardHeader({ user }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-white/5 bg-[#080810]/80 backdrop-blur-md flex items-center justify-between px-6">
      <div className="lg:hidden w-8" /> {/* Spacer for mobile menu button */}
      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-colors"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
              {user.image ? (
                <Image src={user.image} alt="Avatar" width={28} height={28} className="rounded-full" />
              ) : (
                <User className="w-4 h-4 text-violet-400" />
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-medium text-white leading-none">{user.name}</p>
              <p className="text-xs text-white/40 leading-none mt-0.5">{user.email}</p>
            </div>
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 glass-card rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  <p className="text-xs text-white/40 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
