"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, Check, X, ShieldAlert } from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
}

export function UpgradeModal({ isOpen, onClose, featureName }: UpgradeModalProps) {
  const { setUserTier } = useProjectStore();

  if (!isOpen) return null;

  const handleSimulateUpgrade = () => {
    setUserTier('PREMIUM');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-card border-2 border-[#F5A623]/30 rounded-3xl p-6 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#1E3A8A] via-[#F5A623] to-[#1E3A8A]"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center pt-2">
          {/* Mascot in Modal */}
          <div className="relative w-24 h-24 mx-auto mb-3">
            <Image
              src="/hppmate-maskot.png"
              alt="HPPmate Mascot"
              width={96}
              height={96}
              className="object-contain"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5A623]/15 text-[#B45309] dark:text-[#FBBF24] text-xs font-bold mb-2">
            <Crown className="w-3.5 h-3.5 text-[#F5A623]" />
            <span>Fitur Khusus HPPmate Premium</span>
          </div>

          <h3 className="font-display text-xl font-bold text-foreground">
            {featureName ? `Buka Akses ${featureName}` : "Tingkatkan ke HPPmate Premium"}
          </h3>

          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed max-w-sm mx-auto">
            Dapatkan kontrol finansial penuh untuk ekspansi bisnis kuliner Anda tanpa batasan.
          </p>

          {/* Benefits list */}
          <div className="my-5 p-4 rounded-2xl bg-muted/40 border border-border/70 text-left space-y-2.5 text-xs font-medium">
            <div className="flex items-center gap-2 text-foreground">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Analisis Skor Kesehatan Bisnis & Break Even Point (BEP)</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Ekspor PDF resmi &quot;Laporan Analisis Produk&quot; siap cetak</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Transaksi harian tanpa batas & perbandingan BEP vs Realisasi</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Peringatan stok bahan baku tanpa batas jumlah item</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {/* Direct testing simulation button */}
            <Button
              onClick={handleSimulateUpgrade}
              className="w-full bg-[#F5A623] hover:bg-[#F5A623]/90 text-slate-900 font-bold rounded-xl h-11 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Coba Sekarang (Aktifkan Mode Premium)</span>
            </Button>

            {/* Official contact button per PRD (no hardcoded price) */}
            <a
              href="mailto:halo@hppmate.id?subject=Informasi%20Paket%20HPPmate%20Premium"
              className="block w-full py-2.5 text-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Hubungi Tim Kami untuk Informasi Langganan Resmi
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
