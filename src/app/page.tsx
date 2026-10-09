"use client";

import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ArrowRight,
  Calculator,
  Target,
  FileText,
  Sparkles,
  BookOpen,
  Boxes,
  Receipt,
  TrendingUp,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const features = [
    {
      icon: Calculator,
      title: "Kalkulator HPP Presisi",
      desc: "Input bahan baku, kemasan, tenaga kerja, hingga overhead untuk dapatkan HPP akurat per porsi.",
      badge: "Inti"
    },
    {
      icon: Receipt,
      title: "Transaksi Harian & Kas",
      desc: "Catat kas masuk dan kas keluar harian dengan mudah untuk memantau arus kas bisnis Anda.",
      badge: "Baru"
    },
    {
      icon: Boxes,
      title: "Peringatan Stok Bahan",
      desc: "Pantau stok bahan baku otomatis dan dapatkan peringatan sebelum stok habis di dapur.",
      badge: "Baru"
    },
    {
      icon: Target,
      title: "Target BEP vs Realisasi",
      desc: "Hitung titik impas modal dan bandingkan proyeksi BEP dengan penjualan riil aktual Anda.",
      badge: "Unggulan"
    },
    {
      icon: FileText,
      title: "Ekspor Ringkasan Bisnis",
      desc: "Unduh Laporan Analisis Produk dalam format PDF rapi untuk dokumentasi atau presentasi investor.",
      badge: "Premium"
    },
    {
      icon: BookOpen,
      title: "Edukasi Margin vs Markup",
      desc: "Pahami perbedaan esensial antara Margin & Markup agar tidak salah menetapkan harga jual.",
      badge: "Gratis"
    }
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Hero Section with HPPmate Mascot */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-12 pb-20 relative">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-5xl mx-auto space-y-6"
        >
          {/* Badge & Mascot Intro */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#F5A623]/40 bg-[#F5A623]/10 text-xs font-bold text-[#B45309] dark:text-[#FBBF24]">
            <Sparkles className="w-3.5 h-3.5 text-[#F5A623]" />
            <span>HPPmate — Sahabat Cerdas Finansial UMKM F&B</span>
          </motion.div>

          <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-8 items-center text-left pt-2">
            <div>
              <motion.h1 variants={itemVariants} className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
                Hitung <span className="text-[#1E3A8A] dark:text-[#60A5FA]">HPP & Margin</span> Tanpa Bikin Pusing!
              </motion.h1>

              <motion.p variants={itemVariants} className="text-base sm:text-lg text-muted-foreground mt-4 leading-relaxed">
                Platform all-in-one untuk UMKM kuliner. Hitung harga pokok, pantau stok bahan, catat transaksi harian, dan ketahui kapan balik modal (BEP) secara presisi.
              </motion.p>

              <motion.div variants={itemVariants} className="pt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    size: "lg",
                    className: "bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white text-base px-6 h-12 rounded-xl shadow-md transition-all hover:translate-y-[-1px] font-semibold"
                  })}
                >
                  Mulai Hitung Sekarang <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link
                  href="/belajar-hpp"
                  className={buttonVariants({
                    size: "lg",
                    variant: "outline",
                    className: "border-border/80 hover:bg-muted text-base px-6 h-12 rounded-xl transition-all font-semibold"
                  })}
                >
                  <BookOpen className="mr-2 w-4 h-4 text-[#F5A623]" /> Belajar HPP Dulu
                </Link>
              </motion.div>

              <motion.div variants={itemVariants} className="pt-6 flex items-center gap-4 text-xs text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free Tier Tersedia</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Rumus Akurat Standar UMKM</span>
              </motion.div>
            </div>

            {/* Mascot Showcase Card */}
            <motion.div variants={itemVariants} className="relative flex justify-center">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 p-3 bg-[#F5A623]/10 border-2 border-[#F5A623]/30 rounded-3xl shadow-lg flex items-center justify-center">
                <Image
                  src="/hppmate-maskot.png"
                  alt="HPPmate Mascot"
                  width={280}
                  height={280}
                  className="object-contain drop-shadow-md hover:scale-105 transition-transform duration-300"
                  priority
                />
                <div className="absolute -bottom-3 bg-card border border-border px-3.5 py-1 rounded-full shadow-sm text-xs font-bold text-foreground flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Siap temani bisnis Anda!
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid Section */}
      <section id="fitur" className="py-16 px-4 bg-muted/30 border-t border-border/60">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-12 space-y-3">
            <h2 className="font-display text-3xl font-bold tracking-tight">Semua Alat Hitung dalam Satu Aplikasi</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">Dirancang khusus untuk kebutuhan riil operasional warung, kafe, katering, dan UMKM makanan-minuman.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={i} variants={itemVariants}>
                  <Card className="playful-card h-full flex flex-col justify-between p-5 bg-card">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#1E3A8A]/10 text-[#1E3A8A] dark:text-[#60A5FA] flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#F5A623]/15 text-[#B45309] dark:text-[#FBBF24]">
                          {item.badge}
                        </span>
                      </div>
                      <CardTitle className="text-lg font-bold mb-2 font-display">{item.title}</CardTitle>
                      <CardDescription className="text-sm leading-relaxed">{item.desc}</CardDescription>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
