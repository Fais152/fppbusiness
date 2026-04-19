"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Calculator, PieChart, Target, FileText, Zap } from "lucide-react";
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const features = [
    { icon: Calculator, title: "Kalkulator HPP", desc: "Masukan bahan baku, biaya tenaga kerja, dan overhead untuk mendapatkan harga pokok penjualan secara akurat.", color: "text-[var(--info)]", bg: "bg-[var(--info)]/10" },
    { icon: PieChart, title: "Analisis Margin", desc: "Simulasikan harga jual dan margin untuk melihat seberapa besar profit yang Anda dapatkan.", color: "text-[var(--success)]", bg: "bg-[var(--success)]/10" },
    { icon: Target, title: "Target BEP", desc: "Atur target berdasarkan unit atau waktu untuk mengetahui kapan bisnis Anda akan mencapai titik balik modal.", color: "text-[var(--warning)]", bg: "bg-[var(--warning)]/10" },
    { icon: FileText, title: "Ekspor Laporan", desc: "Cetak atau simpan draf proyek interaktif Anda ke dalam PDF untuk dipresentasikan kepada investor.", color: "text-purple-400", bg: "bg-purple-400/10" }
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)] overflow-hidden relative">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-[var(--info)]/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-10 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-32 z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-4xl mx-auto space-y-8"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 border border-primary/40 rounded-full text-sm font-bold text-primary bg-primary/5">
            <Zap className="w-4 h-4" />
            <span>v2.0 — Backend Ready</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Rencanakan <span className="gradient-text">Keuangan Produk</span> Anda dengan Cerdas
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Fpp Business dirancang khusus untuk UMKM. Hitung HPP, margin keuntungan, dan target Break Even Point (BEP) dengan mudah, cepat, dan akurat.
          </motion.p>

          <motion.div variants={itemVariants} className="pt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/dashboard"
              className={buttonVariants({ size: "lg", className: "gradient-bg text-lg px-8 h-14 rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg shadow-primary/20" })}
            >
              Mulai Sekarang <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="#fitur"
              className={buttonVariants({ size: "lg", variant: "outline", className: "text-lg px-8 h-14 rounded-lg hover:bg-accent transition-all duration-200" })}
            >
              Pelajari Lebih Lanjut
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section id="fitur" className="py-32 px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-20 space-y-4">
            <h2 className="text-4xl font-bold">Fitur Utama</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Semua alat yang Anda butuhkan untuk menskalakan margin bisnis Anda secara profesional.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((Feature, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="glass-card h-full">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${Feature.bg} flex items-center justify-center mb-4`}>
                      <Feature.icon className={`w-6 h-6 ${Feature.color}`} />
                    </div>
                    <CardTitle className="text-lg mb-2">{Feature.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{Feature.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
