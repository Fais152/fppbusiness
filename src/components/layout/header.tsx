"use client";

import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSession, signOut } from "next-auth/react";
import { LogOut, BookOpen, Crown, Sparkles } from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";

export function Header() {
  const { data: session, status } = useSession();
  const { userTier, toggleUserTier } = useProjectStore();

  return (
    <header className="sticky top-0 z-50 w-full bg-card/85 backdrop-blur-md border-b border-border/80 shadow-xs">
      <div className="container flex h-16 items-center max-w-6xl mx-auto px-4 justify-between">
        {/* Brand & Nav */}
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/" className="flex items-center gap-2 group transition-transform hover:scale-[1.02]">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-primary/10 flex items-center justify-center p-0.5">
              <Image
                src="/hppmate-logo.png"
                alt="HPPmate Logo"
                width={32}
                height={32}
                className="object-contain"
                priority
              />
            </div>
            <span className="font-display font-bold text-xl tracking-tight flex items-center">
              <span className="text-[#1E3A8A] dark:text-[#60A5FA]">HPP</span>
              <span className="text-[#F5A623]">mate</span>
            </span>
          </Link>

           <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
            <Link
              href="/dashboard"
              className="px-3 py-1.5 transition-colors hover:text-primary text-muted-foreground rounded-lg hover:bg-muted font-medium text-xs sm:text-sm"
            >
              Dashboard
            </Link>
            <Link
              href="/belajar-hpp"
              className="px-3 py-1.5 transition-colors hover:text-[#D97706] dark:hover:text-[#FBBF24] text-muted-foreground rounded-lg hover:bg-[#F5A623]/10 font-medium text-xs sm:text-sm flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#F5A623]" />
              <span>Belajar HPP</span>
            </Link>
          </nav>
        </div>

        {/* Right Section: Tier Switcher, Theme & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Tier Switcher Simulation */}
          <button
            onClick={toggleUserTier}
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 cursor-pointer ${
              userTier === 'PREMIUM'
                ? 'bg-[#F5A623]/15 text-[#B45309] dark:text-[#FBBF24] border-[#F5A623]/40 shadow-xs'
                : 'bg-muted text-muted-foreground border-border hover:border-primary/40'
            }`}
            title="Klik untuk mengubah simulasi Tier (Free / Premium)"
          >
            {userTier === 'PREMIUM' ? (
              <>
                <Crown className="w-3 h-3 text-[#F5A623]" />
                <span className="hidden sm:inline">Tier:</span> Premium
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3" />
                <span className="hidden sm:inline">Tier:</span> Free
              </>
            )}
          </button>

          <ThemeToggle />

          {status === "loading" ? (
            <div className="w-8 h-8 bg-muted animate-pulse rounded-full"></div>
          ) : session ? (
            <div className="flex items-center gap-2 border-l border-border/60 pl-2 sm:pl-3">
              <div className="w-7 h-7 rounded-full bg-[#1E3A8A]/10 text-[#1E3A8A] dark:bg-blue-900/40 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                {session.user?.name?.charAt(0).toUpperCase() || session.user?.email?.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-lg hover:bg-muted"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 border-l border-border/60 pl-2 sm:pl-3">
              <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm", className: "rounded-lg text-xs" })}>
                Masuk
              </Link>
              <Link href="/register" className={buttonVariants({ size: "sm", className: "bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-lg shadow-xs text-xs" })}>
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
