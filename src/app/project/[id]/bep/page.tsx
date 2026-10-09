"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProjectStore, Product } from "@/store/useProjectStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UpgradeModal } from "@/components/UpgradeModal";
import { Target, TrendingUp, AlertTriangle, Crown, Lock, Plus, Sparkles } from "lucide-react";
import Image from "next/image";

export default function BreakEvenTab() {
  const params = useParams();
  const router = useRouter();
  const { projects, updateProject, userTier } = useProjectStore();
  const project = projects.find(p => p.id === params.id);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  if (!project) return null;

  const handleUpdate = (field: string, value: number | string) => {
    updateProject(project.id, { [field]: value });
  };

  const calcHPP = (p: Product) =>
    (p.ingredients || []).reduce((s, i) => s + (i.qty * i.unitCost), 0) + p.packaging + p.labor + p.overhead;
  const calcSell = (hpp: number, margin: number) =>
    hpp <= 0 ? 0 : Math.ceil(hpp / (1 - Math.min(margin, 99) / 100) / 100) * 100;

  const enriched = (project.products || []).map(p => {
    const hpp = calcHPP(p);
    const sell = calcSell(hpp, p.targetMargin);
    const profit = sell - hpp;
    return { ...p, hpp, sell, profit };
  });

  const totalCapital = (project.capitalItems || []).reduce((s, c) => s + c.cost, 0);

  // Gating for Free Tier per PRD Section 4.1 & 5
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
          Analisis Titik Balik Modal (BEP) Terkunci
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Ketahui berapa porsi yang harus terjual per hari dan berapa bulan yang Anda butuhkan untuk mengembalikan seluruh modal investasi usaha Anda secara presisi.
        </p>

        <div className="pt-2">
          <Button
            onClick={() => setUpgradeOpen(true)}
            className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-xl h-11 px-6 font-semibold shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4 mr-2 text-[#F5A623]" />
            <span>Buka Akses Analisis & BEP</span>
          </Button>
        </div>

        <UpgradeModal
          isOpen={upgradeOpen}
          onClose={() => setUpgradeOpen(false)}
          featureName="Kalkulator Break Even Point (BEP)"
        />
      </div>
    );
  }

  // Bug fix per PRD Section 4.1: If no products or 0 profit, show friendly empty state
  if (enriched.length === 0 || enriched.every(p => p.profit <= 0)) {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-4">
        <div className="relative w-28 h-28 mx-auto">
          <Image
            src="/hppmate-maskot.png"
            alt="HPPmate Mascot"
            width={112}
            height={112}
            className="object-contain"
          />
        </div>
        <h3 className="font-display text-xl font-bold text-foreground">
          Tambahkan Produk Terlebih Dahulu
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Kalkulasi titik balik modal (BEP) membutuhkan data harga jual dan margin keuntungan dari produk Anda.
        </p>
        <Button
          onClick={() => router.push(`/project/${project.id}/products`)}
          className="rounded-xl bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white text-xs font-semibold cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          <span>Tambah Menu & Produk Sekarang</span>
        </Button>
      </div>
    );
  }

  // Averages for generic product mix
  const validProducts = enriched.filter(p => p.profit > 0);
  const avgProfit = validProducts.reduce((s, p) => s + p.profit, 0) / validProducts.length;
  const avgSell = validProducts.reduce((s, p) => s + p.sell, 0) / validProducts.length;

  const days = project.bepTargetDays || 30;
  const monthlyFixed = project.bepMonthlyOps || 500000;

  // Real calculations
  const bepUnits = avgProfit > 0 ? Math.ceil(totalCapital / avgProfit) : 0;
  const bepRevenue = bepUnits * avgSell;
  const bepMonthUnits = avgProfit > 0 ? Math.ceil(monthlyFixed / avgProfit) : 0;

  const dailyTarget = Math.ceil(bepUnits / days);
  const dailyOpTarget = Math.ceil(bepMonthUnits / 30);

  const scenarios = [30, 60, 90, 180, 365].map(d => ({
    days: d,
    daily: Math.ceil(bepUnits / d),
    rev: Math.ceil(bepUnits / d) * avgSell * d
  }));

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[300px_1fr] gap-6 animate-in fade-in duration-300">
      {/* Config sidebar */}
      <div className="space-y-6">
        <Card className="playful-card p-5 bg-card">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base font-bold font-display">Target Waktu & Biaya</CardTitle>
            <CardDescription className="text-xs">Atur parameter balik modal usaha Anda.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Target Balik Modal</Label>
              <Select value={project.bepTargetDays.toString()} onValueChange={v => handleUpdate('bepTargetDays', parseInt(v || '30'))}>
                <SelectTrigger className="h-9 text-xs rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 hari (1 bulan)</SelectItem>
                  <SelectItem value="60">60 hari (2 bulan)</SelectItem>
                  <SelectItem value="90">90 hari (3 bulan)</SelectItem>
                  <SelectItem value="180">180 hari (6 bulan)</SelectItem>
                  <SelectItem value="365">365 hari (1 tahun)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Beban Operasional / Bulan (Rp)</Label>
              <Input
                type="number"
                className="h-9 text-xs rounded-xl"
                value={project.bepMonthlyOps || ''}
                onChange={e => handleUpdate('bepMonthlyOps', parseInt(e.target.value)||0)}
              />
            </div>
            <div className="p-3.5 bg-[#F5A623]/10 border border-[#F5A623]/30 rounded-xl mt-3 text-xs">
              <p className="font-bold text-[#B45309] dark:text-[#FBBF24]">Asumsi Rata-Rata:</p>
              <p className="text-muted-foreground mt-0.5 leading-relaxed text-[11px]">
                Menggunakan rata-rata margin Rp {Math.round(avgProfit).toLocaleString('id-ID')} / porsi dengan asumsi variasi menu terjual secara berimbang.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="playful-card p-5 bg-card border-blue-500/30">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">
              BEP Total Modal Investasi ({days} hari)
            </p>
            <p className="text-3xl font-black text-[#1E3A8A] dark:text-blue-400 mb-1">
              {bepUnits.toLocaleString('id-ID')} <span className="text-base font-medium">porsi</span>
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Total Omset Penjualan: <span className="font-bold text-foreground">Rp {bepRevenue.toLocaleString('id-ID')}</span>
            </p>
            <div className="h-px w-full bg-border/60 mb-3"></div>
            <p className="text-xs font-medium">
              Kecepatan Harian: <span className="font-black text-[#1E3A8A] dark:text-blue-400 text-base">{dailyTarget}</span> porsi/hari
            </p>
          </Card>

          <Card className="playful-card p-5 bg-card border-emerald-500/30">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">
              BEP Operasional Bulanan
            </p>
            <p className="text-3xl font-black text-emerald-600 mb-1">
              {bepMonthUnits.toLocaleString('id-ID')} <span className="text-base font-medium">porsi</span>
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Untuk Menutup Beban: <span className="font-bold text-foreground">Rp {monthlyFixed.toLocaleString('id-ID')}</span>
            </p>
            <div className="h-px w-full bg-border/60 mb-3"></div>
            <p className="text-xs font-medium">
              Kecepatan Operasional: <span className="font-black text-emerald-600 text-base">{dailyOpTarget}</span> porsi/hari
            </p>
          </Card>
        </div>

        <Card className="playful-card p-5 bg-card">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-base font-bold font-display">Simulasi Berbagai Periode Waktu</CardTitle>
            <CardDescription className="text-xs">Pilihan target waktu balik modal yang paling realistis bagi kapasitas dapur Anda.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b text-muted-foreground text-left uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Periode</th>
                    <th className="py-2.5 px-3">Total Porsi</th>
                    <th className="py-2.5 px-3 font-bold text-foreground">Target Harian</th>
                    <th className="py-2.5 px-3">Estimasi Omset</th>
                    <th className="py-2.5 px-3 text-center">Status Laju</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {scenarios.map(sc => {
                    const isRealistic = sc.daily <= 100;
                    return (
                      <tr key={sc.days} className="hover:bg-muted/40 transition-colors">
                        <td className="py-3 px-3 font-semibold">{sc.days} Hari</td>
                        <td className="py-3 px-3 text-muted-foreground">{bepUnits.toLocaleString('id-ID')} porsi</td>
                        <td className={`py-3 px-3 font-bold text-sm ${sc.daily <= 50 ? 'text-emerald-600' : sc.daily <= 100 ? 'text-[#B45309] dark:text-[#FBBF24]' : 'text-rose-500'}`}>
                          {sc.daily} porsi/hari
                        </td>
                        <td className="py-3 px-3 font-semibold text-foreground">Rp {(sc.rev / 1e6).toFixed(1)} Juta</td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isRealistic ? 'bg-emerald-500/15 text-emerald-600' : 'bg-rose-500/15 text-rose-500'
                          }`}>
                            {isRealistic ? 'Realistis' : 'Target Berat'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
