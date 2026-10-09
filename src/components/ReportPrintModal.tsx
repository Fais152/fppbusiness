"use client";

import { BusinessProject } from "@/store/useProjectStore";
import { Button } from "@/components/ui/button";
import { Printer, X, ShieldCheck } from "lucide-react";
import Image from "next/image";

interface ReportPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: BusinessProject;
}

export function ReportPrintModal({ isOpen, onClose, project }: ReportPrintModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const calcHPP = (p: { ingredients?: { qty: number; unitCost: number }[]; packaging: number; labor: number; overhead: number }) =>
    (p.ingredients || []).reduce((s: number, i) => s + (i.qty * i.unitCost), 0) +
    p.packaging + p.labor + p.overhead;

  const calcSell = (hpp: number, margin: number) =>
    hpp <= 0 ? 0 : Math.ceil(hpp / (1 - Math.min(margin, 99) / 100) / 100) * 100;

  const enrichedProducts = (project.products || []).map(p => {
    const hpp = calcHPP(p);
    const sell = calcSell(hpp, p.targetMargin);
    const profit = sell - hpp;
    const actualMargin = sell > 0 ? (profit / sell) * 100 : 0;
    return { ...p, hpp, sell, profit, actualMargin };
  });

  const totalCapital = (project.capitalItems || []).reduce((s, c) => s + c.cost, 0);
  const avgMargin = enrichedProducts.length
    ? enrichedProducts.reduce((s, p) => s + p.actualMargin, 0) / enrichedProducts.length
    : 0;

  // BEP Calculation
  const avgProfit = enrichedProducts.length
    ? enrichedProducts.reduce((s, p) => s + p.profit, 0) / enrichedProducts.length
    : 0;
  const bepUnits = avgProfit > 0 ? Math.ceil(totalCapital / avgProfit) : 0;
  const bepDays = project.bepTargetDays || 30;
  const dailyTarget = bepUnits > 0 ? Math.ceil(bepUnits / bepDays) : 0;

  const printDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:p-0 print:m-0">
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print flex items-center justify-between border-b pb-4 mb-6">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Dokumen Resmi HPPmate</span>
            <h2 className="text-xl font-bold font-display">Laporan Analisis Produk</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handlePrint} size="sm" className="bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90 gap-1.5 rounded-xl cursor-pointer">
              <Printer className="w-4 h-4" /> Cetak / Simpan PDF
            </Button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div className="print-content space-y-6">
          {/* Header Document */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Image src="/hppmate-logo.png" alt="HPPmate" width={28} height={28} className="object-contain" />
                <span className="text-lg font-bold font-display tracking-tight text-[#1E3A8A]">HPPmate</span>
              </div>
              <h1 className="text-2xl font-black mt-2 font-display uppercase tracking-tight">Ringkasan Kalkulasi Bisnis</h1>
              <p className="text-xs text-slate-600">Dokumen Analisis Struktur Biaya & Titik Balik Modal</p>
            </div>
            <div className="text-right text-xs text-slate-600">
              <p className="font-bold text-slate-900 text-sm">{project.businessName}</p>
              <p>Kategori: {project.industryCategory}</p>
              <p>Tanggal Cetak: {printDate}</p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 border rounded-xl">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Total Produk</p>
              <p className="text-xl font-black text-slate-900">{enrichedProducts.length}</p>
            </div>
            <div className="p-3 bg-slate-50 border rounded-xl">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Rata-rata Margin</p>
              <p className="text-xl font-black text-emerald-600">{avgMargin.toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-slate-50 border rounded-xl">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Total Modal Awal</p>
              <p className="text-xl font-black text-slate-900">Rp {totalCapital.toLocaleString('id-ID')}</p>
            </div>
            <div className="p-3 bg-slate-50 border rounded-xl">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Target Balik Modal</p>
              <p className="text-xl font-black text-blue-600">{dailyTarget} <span className="text-xs font-normal">porsi/hari</span></p>
            </div>
          </div>

          {/* Section 1: Produk & HPP */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 border-b pb-1 font-display">
              1. Rincian Harga Pokok Penjualan (HPP) & Margin
            </h3>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-left">
                  <th className="p-2 border">Nama Menu / Produk</th>
                  <th className="p-2 border text-right">HPP / Unit</th>
                  <th className="p-2 border text-right">Harga Jual</th>
                  <th className="p-2 border text-right">Target Margin</th>
                  <th className="p-2 border text-right">Laba / Porsi</th>
                </tr>
              </thead>
              <tbody>
                {enrichedProducts.map(p => (
                  <tr key={p.id}>
                    <td className="p-2 border font-medium">{p.name} ({p.category})</td>
                    <td className="p-2 border text-right">Rp {p.hpp.toLocaleString('id-ID')}</td>
                    <td className="p-2 border text-right font-bold text-slate-900">Rp {p.sell.toLocaleString('id-ID')}</td>
                    <td className="p-2 border text-right font-semibold text-emerald-700">{p.actualMargin.toFixed(1)}%</td>
                    <td className="p-2 border text-right font-bold text-emerald-600">Rp {p.profit.toLocaleString('id-ID')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 2: Modal Awal */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 border-b pb-1 font-display">
              2. Kebutuhan Investasi & Modal Awal
            </h3>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-left">
                  <th className="p-2 border">Item Pengeluaran</th>
                  <th className="p-2 border">Kategori</th>
                  <th className="p-2 border text-right">Estimasi Biaya</th>
                </tr>
              </thead>
              <tbody>
                {(project.capitalItems || []).map(c => (
                  <tr key={c.id}>
                    <td className="p-2 border">{c.name}</td>
                    <td className="p-2 border text-slate-600">{c.category}</td>
                    <td className="p-2 border text-right font-semibold">Rp {c.cost.toLocaleString('id-ID')}</td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-bold">
                  <td colSpan={2} className="p-2 border text-right uppercase">Total Investasi Awal</td>
                  <td className="p-2 border text-right text-[#1E3A8A]">Rp {totalCapital.toLocaleString('id-ID')}</td>
                </tr>
              </tbody>
            </table>
          </div>

        {/* Section 3: Analisis BEP */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 border-b pb-1 font-display">
            3. Analisis Titik Impas Modal (Break Even Point)
          </h3>
          <div className="p-3.5 bg-slate-50 border rounded-xl text-xs space-y-1.5 leading-relaxed">
            <p>• <strong>Target Periode Balik Modal:</strong> {bepDays} Hari</p>
            <p>• <strong>Beban Operasional Bulanan:</strong> Rp {(project.bepMonthlyOps || 500000).toLocaleString('id-ID')}</p>
            <p>• <strong>Total Unit Harus Terjual (BEP Investasi):</strong> {bepUnits.toLocaleString('id-ID')} porsi</p>
            <p>• <strong>Kecepatan Penjualan Minimal:</strong> <span className="font-bold text-[#1E3A8A]">{dailyTarget} porsi per hari</span></p>
          </div>
        </div>

        {/* Section 4: Penilaian Kesehatan Bisnis */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 border-b pb-1 font-display">
            4. Penilaian Kesehatan Bisnis
          </h3>
          <div className="p-3.5 bg-slate-50 border rounded-xl text-xs space-y-2">
            {/* Reuse calculation logic from AnalysisTab */}
            {(() => {
              const totalRevenue = enrichedProducts.reduce((s, p) => s + p.sell, 0);
              const totalProfit = enrichedProducts.reduce((s, p) => s + p.profit, 0);
              const capitalVsRevRatio = totalRevenue > 0 ? totalCapital / totalRevenue : 0;
              const low = enrichedProducts.filter(p => p.actualMargin < 50);
              let healthScore = 0;
              const notes = [];
              if (enrichedProducts.length > 0) {
                const avgMargin = enrichedProducts.reduce((s, p) => s + p.actualMargin, 0) / enrichedProducts.length;
                if (avgMargin >= 60) {
                  healthScore += 30;
                  notes.push(`Margin rata-rata ${avgMargin.toFixed(1)}% — sangat prima untuk standar bisnis F&B.`);
                } else if (avgMargin >= 45) {
                  healthScore += 20;
                  notes.push(`Margin rata-rata ${avgMargin.toFixed(1)}% — cukup aman, namun masih bisa dioptimalkan pada porsi/resep.`);
                } else {
                  healthScore += 5;
                  notes.push(`Margin rata-rata ${avgMargin.toFixed(1)}% — di bawah ambang sehat industri F&B (45%–65%).`);
                }
                if (low.length === 0) {
                  healthScore += 20;
                  notes.push(`Hebat! Tidak ada menu dengan margin kritis (<50%). Seluruh menu menguntungkan.`);
                } else if (low.length > 0) {
                  notes.push(`Perhatian: Ada ${low.length} menu dengan margin <50%. Periksa kembali harga jual atau efisiensi bahan.`);
                }
                if (capitalVsRevRatio < 3 && capitalVsRevRatio > 0) {
                  healthScore += 20;
                  notes.push(`Rasio modal awal terhadap estimasi omset wajar dan tergolong efisien.`);
                } else if (capitalVsRevRatio >= 3) {
                  notes.push(`Modal awal tergolong tinggi. Pastikan fokus pada akselerasi penjualan di bulan-bulan awal.`);
                }
                if (totalRevenue > 0 && (totalProfit / totalRevenue) > 0.5) {
                  healthScore += 15;
                  notes.push(`Potensi margin keuntungan bersih достигает ${((totalProfit/totalRevenue)*100).toFixed(0)}% от оборота.`);
                } else if (totalRevenue > 0) {
                  notes.push(`Estimasi laba bersih ${((totalProfit/totalRevenue)*100).toFixed(0)}% от оборота. (Standar F&B sehat: 50–70%).`);
                } else {
                  notes.push(`Belum ada omset terhitung. Tambahkan produk dengan target margin.`);
                }
              }
              const healthLabel = healthScore >= 70 ? 'Sangat Sehat' : healthScore >= 50 ? 'Cukup Sehat' : 'Perlu Perbaikan';
              const healthColor = healthScore >= 70 ? 'text-emerald-600' : healthScore >= 50 ? 'text-amber-500' : 'text-rose-500';
              return (
                <>
                  <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Skor Kesehatan Bisnis</span>
                    <span className={`font-black ${healthColor}`}>{healthScore}/100</span>
                  </div>
                  <div className="w-full bg-muted rounded-full overflow-hidden border">
                    <div className={`h-3 rounded-full transition-all duration-1000 ${healthColor === 'text-emerald-600' ? 'bg-emerald-500' : healthColor === 'text-amber-500' ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${Math.min(healthScore, 100)}%` }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{healthLabel}</p>
                  {notes.length > 0 && (
                    <div className="mt-3 space-y-2 text-xs">
                      <p className="font-bold text-[10px] uppercase tracking-wider mb-1">Catatan:</p>
                      {notes.map((note, idx) => (
                        <p key={idx} className="text-muted-foreground pl-2">{'• ' + note}</p>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>

        {/* Verification Footer */}
          <div className="pt-4 border-t flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Dihitung otomatis melalui platform HPPmate</span>
            </div>
            <p>HPPmate &copy; {new Date().getFullYear()} &mdash; Sahabat Finansial UMKM</p>
          </div>
        </div>
      </div>
    </div>
  );
}
