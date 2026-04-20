"use client";

import { useParams } from "next/navigation";
import { useProjectStore, Product } from "@/store/useProjectStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, TrendingUp, AlertTriangle } from "lucide-react";

export default function BreakEvenTab() {
  const params = useParams();
  const { projects, updateProject } = useProjectStore();
  const project = projects.find(p => p.id === params.id);

  if (!project) return null;

  const handleUpdate = (field: string, value: any) => {
    updateProject(project.id, { [field]: value });
  };

  const calcHPP = (p: Product) => p.ingredients.reduce((s, i) => s + (i.qty * i.unitCost), 0) + p.packaging + p.labor + p.overhead;
  const calcSell = (hpp: number, margin: number) => hpp <= 0 ? 0 : Math.ceil(hpp / (1 - Math.min(margin, 99) / 100) / 100) * 100;

  const enriched = project.products.map(p => {
    const hpp = calcHPP(p);
    const sell = calcSell(hpp, p.targetMargin);
    const profit = sell - hpp;
    return { ...p, hpp, sell, profit };
  });

  const totalCapital = project.capitalItems.reduce((s, c) => s + c.cost, 0);
  
  // Averages for generic mix
  const n = enriched.length || 1;
  const avgProfit = enriched.reduce((s, p) => s + p.profit, 0) / n || 1;
  const avgSell = enriched.reduce((s, p) => s + p.sell, 0) / n || 1;

  // Assume the "basis" relies on average across all products for simplicity
  const usedProfit = avgProfit;
  const usedSell = avgSell;

  const days = project.bepTargetDays || 30;
  const monthlyFixed = project.bepMonthlyOps || 500000;

  // Calculations
  const bepUnits = usedProfit > 0 ? Math.ceil(totalCapital / usedProfit) : 0;
  const bepRevenue = bepUnits * usedSell;
  const bepMonthUnits = usedProfit > 0 ? Math.ceil(monthlyFixed / usedProfit) : 0;
  
  const dailyTarget = Math.ceil(bepUnits / days);
  const dailyOpTarget = Math.ceil(bepMonthUnits / 30);

  const scenarios = [30, 60, 90, 180, 365].map(d => ({
    days: d,
    daily: Math.ceil(bepUnits / d),
    rev: Math.ceil(bepUnits / d) * usedSell * d
  }));

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[300px_1fr] gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Config sidebar */}
      <div className="space-y-6">
        <Card className="bg-card/60 rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg">Konfigurasi BEP</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Target Balik Modal</Label>
              <Select value={project.bepTargetDays.toString()} onValueChange={v => handleUpdate('bepTargetDays', parseInt(v || '30'))}>
                <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 hari (1 bulan)</SelectItem>
                  <SelectItem value="60">60 hari (2 bulan)</SelectItem>
                  <SelectItem value="90">90 hari (3 bulan)</SelectItem>
                  <SelectItem value="180">180 hari (6 bulan)</SelectItem>
                  <SelectItem value="365">365 hari (1 tahun)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Biaya Operasional / Bulan (Rp)</Label>
              <Input type="number" className="bg-background/50" value={project.bepMonthlyOps || ''} onChange={e => handleUpdate('bepMonthlyOps', parseInt(e.target.value)||0)} />
            </div>
            <div className="p-4 bg-[var(--info)]/10 rounded-lg mt-4">
              <p className="text-xs text-primary font-bold">Note:</p>
              <p className="text-xs text-primary/80 mt-1">Estimasi menggunakan margin rata-rata ({Math.round(avgProfit).toLocaleString('id-ID')} / porsi) karena asumsi proporsi variasi produk terjual secara merata.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-6 rounded-xl bg-[var(--info)]/5 border border-[var(--info)]/20">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1.5">BEP Total Modal &mdash; ({days} hari)</p>
            <p className="text-3xl font-black text-[var(--info)] mb-1">{bepUnits.toLocaleString('id-ID')} porsi</p>
            <p className="text-xs text-muted-foreground mb-4">Total Revenue Syarat: <span className="font-bold text-foreground">Rp {bepRevenue.toLocaleString('id-ID')}</span></p>
            <div className="h-px w-full bg-border/50 mb-4"></div>
            <p className="text-sm font-medium">Target Harian: <span className="font-extrabold text-[var(--info)] text-lg">{dailyTarget}</span> porsi/hari</p>
          </div>
          
          <div className="p-6 rounded-xl bg-[var(--success)]/5 border border-[var(--success)]/20">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1.5">BEP Operasional / Bulan</p>
            <p className="text-3xl font-black text-[var(--success)] mb-1">{bepMonthUnits.toLocaleString('id-ID')} porsi</p>
            <p className="text-xs text-muted-foreground mb-4">Untuk menutup operasional: <span className="font-bold text-foreground">Rp {monthlyFixed.toLocaleString('id-ID')}</span></p>
            <div className="h-px w-full bg-border/50 mb-4"></div>
            <p className="text-sm font-medium">Target Harian: <span className="font-extrabold text-[var(--success)] text-lg">{dailyOpTarget}</span> porsi/hari</p>
          </div>
        </div>

        <Card className="bg-card/60 rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg">Skenario Waktu Balik Modal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="border-b border-border/50 text-muted-foreground pb-2 uppercase text-[10px] tracking-wider text-left">
                    <th className="py-2">Target Hari</th>
                    <th className="py-2">Total Porsi</th>
                    <th className="py-2 font-bold text-foreground">Target Harian</th>
                    <th className="py-2">Total Revenue</th>
                    <th className="py-2 text-center">Status Laju</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {scenarios.map(sc => {
                    const ok = sc.daily <= 100;
                    return (
                      <tr key={sc.days} className="hover:bg-muted/10">
                        <td className="py-3 font-semibold">{sc.days} Hari</td>
                        <td className="py-3 text-muted-foreground">{bepUnits.toLocaleString('id-ID')} porsi</td>
                        <td className={`py-3 font-extrabold ${sc.daily <= 50 ? 'text-[var(--success)]' : sc.daily <= 100 ? 'text-[var(--warning)]' : 'text-[var(--danger)]'}`}>
                          {sc.daily} porsi/h
                        </td>
                        <td className="py-3 font-semibold text-[var(--info)]">Rp {(sc.rev / 1e6).toFixed(1)}M</td>
                        <td className="py-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            ok ? 'bg-[var(--success)]/10 text-[var(--success)]' : 'bg-[var(--danger)]/10 text-[var(--danger)]'
                          }`}>
                            {ok ? 'Realistis' : 'Berat'}
                          </span>
                        </td>
                      </tr>
                    )
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
