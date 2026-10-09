"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useProjectStore, Product } from "@/store/useProjectStore";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ShieldCheck, AlertTriangle, TrendingUp, Crown, Lock, Sparkles } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UpgradeModal } from "@/components/UpgradeModal";
import Image from "next/image";

export default function AnalysisTab() {
  const params = useParams();
  const { projects, userTier } = useProjectStore();
  const project = projects.find(p => p.id === params.id);

  const [selId, setSelId] = useState<string>('');
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  if (!project) return null;

  // Free Tier Gating per PRD Section 4.1 & 5
  if (userTier === 'FREE') {
    return (
      <div className="py-12 px-4 text-center max-w-lg mx-auto space-y-5">
        <div className="relative w-32 h-32 mx-auto">
          <Image
            src="/hppmate-maskot.png"
            alt="HPPmate Mascot"
            width={128}
            height={128}
            className="object-contain"
          />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5A623]/20 text-[#B45309] dark:text-[#FBBF24] text-xs font-bold">
          <Crown className="w-3.5 h-3.5 text-[#F5A623]" />
          <span>Fitur HPPmate Premium</span>
        </div>

        <h3 className="font-display text-2xl font-bold text-foreground">
          Penilaian Kesehatan Bisnis Terkunci
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Dapatkan skor kesehatan portofolio menu, peringatan margin merah di bawah 50%, serta rincian visual struktur biaya HPP Anda secara otomatis.
        </p>

        <div className="pt-2">
          <Button
            onClick={() => setUpgradeOpen(true)}
            className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl h-11 px-6 font-semibold shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4 mr-2 text-[#F5A623]" />
            <span>Buka Analisis Portofolio Menu</span>
          </Button>
        </div>

        <UpgradeModal
          isOpen={upgradeOpen}
          onClose={() => setUpgradeOpen(false)}
          featureName="Penilaian Kesehatan Bisnis & Portofolio Margin"
        />
      </div>
    );
  }

  const calcHPP = (p: Product) =>
    (p.ingredients || []).reduce((s, i) => s + (i.qty * i.unitCost), 0) + p.packaging + p.labor + p.overhead;
  const calcSell = (hpp: number, margin: number) =>
    hpp <= 0 ? 0 : Math.ceil(hpp / (1 - Math.min(margin, 99) / 100) / 100) * 100;

  const enriched = (project.products || []).map(p => {
    const hpp = calcHPP(p);
    const sell = calcSell(hpp, p.targetMargin);
    const profit = sell - hpp;
    const actualMargin = sell > 0 ? (profit / sell) * 100 : 0;
    return { ...p, hpp, sell, profit, actualMargin };
  });

  const totalCapital = (project.capitalItems || []).reduce((s, c) => s + c.cost, 0);
  const totalRevenue = enriched.reduce((s, p) => s + p.sell, 0);
  const totalProfit = enriched.reduce((s, p) => s + p.profit, 0);
  const avgMargin = enriched.length ? enriched.reduce((s, p) => s + p.actualMargin, 0) / enriched.length : 0;
  const capitalVsRevRatio = totalRevenue > 0 ? totalCapital / totalRevenue : 0;

  const low = enriched.filter(p => p.actualMargin < 50);
  const sorted = [...enriched].sort((a,b) => b.actualMargin - a.actualMargin);

  let healthScore = 0;
  const notes = [];
  if (avgMargin >= 60) {
    healthScore += 30;
    notes.push({ type: 'green', text: `Margin rata-rata ${avgMargin.toFixed(1)}% — sangat prima untuk standar bisnis F&B.` });
  } else if (avgMargin >= 45) {
    healthScore += 20;
    notes.push({ type: 'amber', text: `Margin rata-rata ${avgMargin.toFixed(1)}% — cukup aman, namun masih bisa dioptimalkan pada porsi/resep.` });
  } else {
    healthScore += 5;
    notes.push({ type: 'red', text: `Margin rata-rata ${avgMargin.toFixed(1)}% — di bawah ambang sehat industri F&B (45%–65%).` });
  }
  
  if (low.length === 0 && enriched.length > 0) {
    healthScore += 20;
    notes.push({ type: 'green', text: `Hebat! Tidak ada menu dengan margin kritis (<50%). Seluruh menu menguntungkan.` });
  } else if (low.length > 0) {
    notes.push({ type: 'red', text: `Perhatian: Ada ${low.length} menu dengan margin <50%. Periksa kembali harga jual atau efisiensi bahan.` });
  }
  
  if (capitalVsRevRatio < 3 && capitalVsRevRatio > 0) {
    healthScore += 20;
    notes.push({ type: 'green', text: `Rasio modal awal terhadap estimasi omset wajar dan tergolong efisien.` });
  } else if (capitalVsRevRatio >= 3) {
    notes.push({ type: 'amber', text: `Modal awal tergolong tinggi. Pastikan fokus pada akselerasi penjualan di bulan-bulan awal.` });
  }
  
  if (totalRevenue > 0 && (totalProfit / totalRevenue) > 0.5) {
    healthScore += 15;
    notes.push({ type: 'green', text: `Potensi margin keuntungan bersih mencapai ${((totalProfit/totalRevenue)*100).toFixed(0)}% dari omset.` });
  } else if (totalRevenue > 0) {
    notes.push({ type: 'amber', text: `Estimasi laba bersih ${((totalProfit/totalRevenue)*100).toFixed(0)}% dari omset. (Standar F&B sehat: 50–70%).` });
  } else {
    notes.push({ type: 'amber', text: `Belum ada omset terhitung. Tambahkan produk dengan target margin.` });
  }

  const healthLabel = healthScore >= 70 ? 'Sangat Sehat' : healthScore >= 50 ? 'Cukup Sehat' : 'Perlu Perbaikan';
  const healthColor = healthScore >= 70 ? 'text-emerald-600 bg-emerald-500' : healthScore >= 50 ? 'text-amber-500 bg-amber-500' : 'text-rose-500 bg-rose-500';

  const defaultSel = selId || (enriched[0]?.id || '');
  const selP = enriched.find(p => p.id === defaultSel) || enriched[0];

  const pieData = selP ? [
    { name: 'Bahan Baku', value: (selP.ingredients || []).reduce((s,i) => s + (i.qty * i.unitCost), 0) },
    { name: 'Kemasan', value: selP.packaging },
    { name: 'Tenaga Kerja', value: selP.labor },
    { name: 'Overhead', value: selP.overhead }
  ].filter(x => x.value > 0) : [];

  const COLORS = ['#1E3A8A', '#F5A623', '#10B981', '#0284C7'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Health Score Card */}
      <Card className="playful-card p-6 bg-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold font-display text-foreground">Penilaian Kesehatan Bisnis</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Diagnosa otomatis berdasarkan perbandingan HPP, margin menu, dan modal awal.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-28 sm:w-36 h-3 bg-muted rounded-full overflow-hidden border">
              <div className={`h-full rounded-full transition-all duration-1000 ${healthColor.split(' ')[1]}`} style={{ width: `${Math.min(healthScore, 100)}%` }}></div>
            </div>
            <span className={`font-black text-base sm:text-lg ${healthColor.split(' ')[0]}`}>{healthLabel}</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {notes.map((n, i) => (
            <div key={i} className={`p-3.5 rounded-xl text-xs leading-relaxed border ${
              n.type === 'green' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400' :
              n.type === 'amber' ? 'bg-[#F5A623]/10 border-[#F5A623]/25 text-[#B45309] dark:text-[#FBBF24]' :
              'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
            }`}>
              {n.text}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Breakdown Pie Chart */}
        <Card className="playful-card p-5 bg-card">
          <div className="flex flex-row items-center justify-between pb-3 border-b">
            <CardTitle className="text-sm font-bold font-display">Komposisi Biaya per Menu</CardTitle>
            {enriched.length > 0 && (
              <Select value={defaultSel} onValueChange={val => setSelId(val || '')}>
                <SelectTrigger className="w-[180px] h-8 text-xs rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {enriched.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="h-[280px] pt-2">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={85} paddingAngle={4} dataKey="value">
                    {pieData.map((e, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(value) => `Rp ${Number(value).toLocaleString('id-ID')}`} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-xs">
                Pilih menu yang sudah memiliki komponen biaya HPP.
              </div>
            )}
          </div>
        </Card>

        {/* Margin Ranking Table */}
        <Card className="playful-card p-5 bg-card">
          <CardHeader className="p-0 pb-3 border-b">
            <CardTitle className="text-sm font-bold font-display">Peringkat Margin Menu</CardTitle>
          </CardHeader>
          <div className="pt-2">
            {sorted.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-muted-foreground text-left uppercase text-[10px] tracking-wider">
                      <th className="py-2 px-2">#</th>
                      <th className="py-2 px-2">Menu</th>
                      <th className="py-2 px-2 text-right">HPP</th>
                      <th className="py-2 px-2 text-right">Margin</th>
                      <th className="py-2 px-2 text-right font-bold">Laba / Porsi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {sorted.map((p, idx) => (
                      <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                        <td className="py-2.5 px-2 text-muted-foreground font-bold">{idx + 1}</td>
                        <td className="py-2.5 px-2 font-semibold text-foreground">{p.name}</td>
                        <td className="py-2.5 px-2 text-right text-muted-foreground">Rp {p.hpp.toLocaleString('id-ID')}</td>
                        <td className="py-2.5 px-2 text-right">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.actualMargin >= 60 ? 'bg-emerald-500/15 text-emerald-600' : p.actualMargin >= 45 ? 'bg-[#F5A623]/20 text-[#B45309] dark:text-[#FBBF24]' : 'bg-rose-500/15 text-rose-500'
                          }`}>
                            {p.actualMargin.toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-right font-bold text-emerald-600">Rp {p.profit.toLocaleString('id-ID')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground text-xs">Belum ada menu produk tersimpan.</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
