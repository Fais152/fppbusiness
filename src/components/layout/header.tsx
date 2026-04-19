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
      <div className="container flex h-14 items-center max-w-6xl mx-auto px-4">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-primary text-lg tracking-tight">
              Fpp Business
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/dashboard"
              className="transition-colors hover:text-primary text-muted-foreground"
            >
              Dashboard
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-3">
          <ThemeToggle />
          
          {status === "loading" ? (
            <div className="w-20 h-8 bg-muted animate-pulse rounded-md"></div>
          ) : session ? (
            <div className="flex items-center gap-3 ml-2 border-l border-border/50 pl-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground mr-1">
                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                  {session.user?.name?.charAt(0).toUpperCase() || session.user?.email?.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[100px] truncate">{session.user?.name || session.user?.email}</span>
              </div>
              <Link href="/dashboard" className={buttonVariants({ variant: "outline", size: "sm", className: "hidden md:flex rounded-lg" })}>
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-muted-foreground hover:text-destructive transition-colors p-2 rounded-lg hover:bg-muted"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-2 border-l border-border/50 pl-4">
              <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm", className: "rounded-lg" })}>
                Masuk
              </Link>
              <Link href="/register" className={buttonVariants({ size: "sm", className: "gradient-bg rounded-lg shadow-sm" })}>
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
