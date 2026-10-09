"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EducationBanner() {
  const [show, setShow] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !localStorage.getItem("hppmate_edu_dismissed");
  });

  const handleDismiss = () => {
    localStorage.setItem("hppmate_edu_dismissed", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-[#1E3A8A]/10 via-[#F5A623]/10 to-transparent border-2 border-[#1E3A8A]/20 relative overflow-hidden flex flex-col md:flex-row items-center gap-6 shadow-sm"
      >
        <div className="absolute top-3 right-3">
          <button
            onClick={handleDismiss}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors"
            title="Tutup banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0">
          <Image
            src="/hppmate-maskot.png"
            alt="HPPmate Mascot"
            fill
            className="object-contain drop-shadow"
          />
        </div>

        <div className="flex-1 space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F5A623]/20 text-[#B45309] dark:text-[#FBBF24] text-xs font-bold">
            <Sparkles className="w-3 h-3 text-[#F5A623]" />
            <span>Selamat Datang di HPPmate!</span>
          </div>
          <h3 className="font-display text-xl font-bold text-foreground">
            Belum paham cara menghitung HPP & Margin yang benar?
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            Jangan biarkan bisnis rugi karena salah menentukan harga jual. Pelajari konsep dasar HPP, margin, dan markup dengan bahasa yang sangat sederhana khusus UMKM.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full md:w-auto">
          <Link href="/belajar-hpp" className="w-full sm:w-auto">
            <Button className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl text-xs font-bold h-10 px-5 shadow-sm">
              <BookOpen className="w-4 h-4 mr-2" /> Mulai Belajar HPP
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={handleDismiss}
            className="w-full sm:w-auto rounded-xl text-xs h-10 border-border"
          >
            Lewati
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
