"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSession, signOut } from "next-auth/react";
import { LogOut, User, LogIn } from "lucide-react";

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full glass">
      <div className="container flex h-16 items-center max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-primary text-xl tracking-tighter sm:tracking-tight bg-primary/5 px-2 py-1 rounded">
              Fpp<span className="text-foreground">Business</span>
            </span>
          </Link>
          <nav className="hidden sm:flex items-center space-x-1 underline-offset-4 text-sm font-medium">
            <Link
              href="/dashboard"
              className="px-3 py-2 transition-colors hover:text-primary text-muted-foreground rounded-lg hover:bg-muted/50"
            >
              Dashboard
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
          
          {status === "loading" ? (
            <div className="w-10 sm:w-20 h-8 bg-muted animate-pulse rounded-md"></div>
          ) : session ? (
            <div className="flex items-center gap-2 md:gap-3 ml-1 sm:ml-2 border-l border-border/50 pl-2 sm:pl-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground mr-1">
                <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                  {session.user?.name?.charAt(0).toUpperCase() || session.user?.email?.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[100px] truncate">{session.user?.name || session.user?.email}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-muted-foreground hover:text-destructive transition-colors p-2 rounded-lg hover:bg-muted/80"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2 ml-1 sm:ml-2 border-l border-border/50 pl-2 sm:pl-4">
              <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm", className: "rounded-lg text-xs sm:text-sm px-2 sm:px-3" })}>
                Masuk
              </Link>
              <Link href="/register" className={buttonVariants({ size: "sm", className: "gradient-bg rounded-lg shadow-sm text-xs sm:text-sm px-2 sm:px-4" })}>
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
