"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Calculator, Target, TrendingUp, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function BelajarHPP() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 py-12">
      <Link href="/dashboard" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Dashboard
      </Link>

      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-12">
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <div className="w-16 h-16 bg-[#F5A623]/10 text-[#F5A623] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight">Pusat Edukasi HPPmate</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pahami konsep dasar keuangan UMKM untuk membantu Anda menetapkan harga yang menguntungkan dan berkelanjutan.
          </p>
        </motion.div>

        {/* Concept Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* HPP Section */}
          <motion.div variants={itemVariants}>
            <Card className="playful-card h-full bg-card">
              <CardHeader>
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-2">
                  <Calculator className="w-5 h-5" />
                </div>
                <CardTitle className="font-display text-2xl">Apa itu HPP?</CardTitle>
                <CardDescription>Harga Pokok Penjualan (COGS)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-relaxed">
                <p>
                  <strong>HPP</strong> adalah total biaya langsung yang dikeluarkan untuk menghasilkan satu porsi produk Anda.
                </p>
                <div className="bg-muted/50 p-4 rounded-xl border border-border/50">
                  <p className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Rumus Sederhana:</p>
                  <code className="text-sm font-bold text-[#1E3A8A] dark:text-blue-400">
                    Bahan Baku + Kemasan + Tenaga Kerja + Overhead = HPP
                  </code>
                </div>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  <li><strong>Bahan Baku:</strong> Beras, daging, bumbu, minyak, dll.</li>
                  <li><strong>Kemasan:</strong> Kotak, plastik, sendok, sticker.</li>
                  <li><strong>Tenaga Kerja:</strong> Gaji karyawan per porsi.</li>
                  <li><strong>Overhead:</strong> Gas, listrik, air, biaya kebersihan.</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Margin vs Markup Section */}
          <motion.div variants={itemVariants}>
            <Card className="playful-card h-full bg-card">
              <CardHeader>
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-2">
                  <Target className="w-5 h-5" />
                </div>
                <CardTitle className="font-display text-2xl">Margin vs Markup</CardTitle>
                <CardDescription>Dua cara pandang keuntungan yang berbeda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-relaxed">
                <div className="grid gap-4">
                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                    <p className="font-bold text-emerald-700 dark:text-emerald-400 mb-1">Margin Keuntungan</p>
                    <p className="text-xs text-muted-foreground italic mb-2">Persentase profit dari Harga Jual</p>
                    <p className="font-medium text-[11px] bg-white/50 dark:bg-black/20 p-2 rounded">
                      Rumus: (Profit / Harga Jual) x 100%
                    </p>
                  </div>
                  <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                    <p className="font-bold text-blue-700 dark:text-blue-400 mb-1">Markup</p>
                    <p className="text-xs text-muted-foreground italic mb-2">Persentase penambahan dari HPP</p>
                    <p className="font-medium text-[11px] bg-white/50 dark:bg-black/20 p-2 rounded">
                      Rumus: (Profit / HPP) x 100%
                    </p>
                  </div>
                </div>
                <p className="text-xs bg-[#F5A623]/10 p-3 rounded-lg border border-[#F5A623]/20 flex gap-2">
                  <Info className="w-4 h-4 text-[#F5A623] shrink-0" />
                  <span><strong>Penting:</strong> HPPmate menggunakan sistem <strong>Margin</strong> untuk kalkulasi harga jual optimal Anda.</span>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Infographic Section */}
        <motion.div variants={itemVariants} className="bg-card border-2 border-border rounded-3xl p-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <TrendingUp className="w-48 h-48" />
          </div>
          
          <div className="relative z-10 space-y-6">
            <h2 className="font-display text-3xl font-bold tracking-tight">Mengapa Margin 50-60%?</h2>
            <div className="max-w-xl space-y-4">
              <p className="text-muted-foreground">
                Dalam standar industri Food & Beverage (F&B) skala kecil, margin 50-60% adalah zona aman agar bisnis Anda tetap sehat setelah dipotong biaya operasional lainnya.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="px-4 py-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-full text-xs font-bold">
                  Margin &lt; 40%: Risiko Rugi
                </div>
                <div className="px-4 py-2 bg-[#F5A623]/10 text-[#B45309] border border-[#F5A623]/20 rounded-full text-xs font-bold">
                  Margin 45-55%: Standar UMKM
                </div>
                <div className="px-4 py-2 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-full text-xs font-bold">
                  Margin &gt; 60%: Sangat Prima
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-48 h-48 shrink-0">
                <Image 
                  src="/hppmate-maskot.png" 
                  alt="HPPmate Mascot" 
                  fill 
                  className="object-contain"
                />
              </div>
              <div className="space-y-4">
                <h3 className="font-display text-xl font-bold">Siap Mulai Hitung Bisnis Anda?</h3>
                <p className="text-sm text-muted-foreground">
                  Gunakan kalkulator HPPmate untuk mendapatkan angka presisi dan hindari kesalahan penentuan harga.
                </p>
                <Link href="/dashboard" className="inline-block">
                  <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl px-8 h-12 font-bold shadow-lg shadow-primary/15 transition-transform hover:scale-[1.02]">
                    Buka Dashboard Sekarang
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
