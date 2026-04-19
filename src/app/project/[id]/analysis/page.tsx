"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useProjectStore, Product } from "@/store/useProjectStore";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ShieldCheck, AlertTriangle, TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AnalysisTab() {
  const params = useParams();
  const project = useProjectStore(state => state.projects.find(p => p.id === params.id));

  const [selId, setSelId] = useState<string>('');

  if (!project) return null;

  const calcHPP = (p: Product) => p.ingredients.reduce((s, i) => s + (i.qty * i.unitCost), 0) + p.packaging + p.labor + p.overhead;
  const calcSell = (hpp: number, margin: number) => hpp <= 0 ? 0 : Math.ceil(hpp / (1 - Math.min(margin, 99) / 100) / 100) * 100;

  const enriched = project.products.map(p => {
    const hpp = calcHPP(p);
    const sell = calcSell(hpp, p.targetMargin);
    const profit = sell - hpp;
    const actualMargin = sell > 0 ? (profit / sell) * 100 : 0;
    return { ...p, hpp, sell, profit, actualMargin };
  });

  const totalCapital = project.capitalItems.reduce((s, c) => s + c.cost, 0);
  const totalHPP = enriched.reduce((s, p) => s + p.hpp, 0);
  const totalRevenue = enriched.reduce((s, p) => s + p.sell, 0);
  const totalProfit = enriched.reduce((s, p) => s + p.profit, 0);
  const avgMargin = enriched.length ? enriched.reduce((s, p) => s + p.actualMargin, 0) / enriched.length : 0;
  const capitalVsRevRatio = totalRevenue > 0 ? totalCapital / totalRevenue : 0;

  const low = enriched.filter(p => p.actualMargin < 50);
  const high = enriched.filter(p => p.actualMargin >= 65);
  const sorted = [...enriched].sort((a,b) => b.actualMargin - a.actualMargin);

  let healthScore = 0;
  const notes = [];
  if(avgMargin >= 60) { healthScore+=30; notes.push({type:'green', text:`Margin rata-rata ${avgMargin.toFixed(1)}% — sangat sehat untuk bisnis ini.`});}
  else if(avgMargin >= 45) { healthScore+=20; notes.push({type:'amber', text:`Margin rata-rata ${avgMargin.toFixed(1)}% — cukup, tapi masih bisa dioptimasi.`});}
  else { healthScore+=5; notes.push({type:'red', text:`Margin rata-rata ${avgMargin.toFixed(1)}% — di bawah standar industri umum (45–65%).`});}
  
  if(low.length===0 && enriched.length > 0) { healthScore+=20; notes.push({type:'green', text:`Tidak ada produk dengan margin merah (<50%). Portofolio sehat.`});}
  else if(low.length > 0) { notes.push({type:'red', text:`${low.length} produk bermargin <50% — perlu perbaikan segera.`});}
  
  if(capitalVsRevRatio < 3 && capitalVsRevRatio > 0) { healthScore+=20; notes.push({type:'green', text:`Rasio modal terhadap harga jual produk wajar untuk bisnis ini.`});}
  else if(capitalVsRevRatio >= 3) { notes.push({type:'amber', text:`Modal awal cukup besar dibanding total harga jual. Pastikan volume penjualan harian mencukupi.`});}
  
  if((totalProfit/totalRevenue) > 0.5) { healthScore+=15; notes.push({type:'green', text:`Total profit ${((totalProfit/totalRevenue)*100).toFixed(0)}% dari total revenue — sangat baik.`});}
  else if (totalRevenue > 0) { notes.push({type:'amber', text:`Total profit ${((totalProfit/totalRevenue)*100).toFixed(0)}% dari total revenue. Standar F&B 50–70%.`});}
  else { notes.push({type:'amber', text:`Belum ada revenue terhitung. Tambahkan produk dengan target margin.`}); }

  const healthLabel = healthScore >= 70 ? 'Sangat Sehat' : healthScore >= 50 ? 'Cukup Sehat' : 'Perlu Perbaikan';
  const healthColor = healthScore >= 70 ? 'text-[var(--success)] bg-[var(--success)]' : healthScore >= 50 ? 'text-[var(--warning)] bg-[var(--warning)]' : 'text-[var(--danger)] bg-[var(--danger)]';

  const defaultSel = selId || (enriched[0]?.id || '');
  const selP = enriched.find(p => p.id === defaultSel) || enriched[0];

  const pieData = selP ? [
    { name: 'Bahan Baku', value: selP.ingredients.reduce((s,i) => s + (i.qty * i.unitCost), 0) },
    { name: 'Packaging', value: selP.packaging },
    { name: 'Tenaga Kerja', value: selP.labor },
    { name: 'Overhead', value: selP.overhead }
  ].filter(x => x.value > 0) : [];

  const COLORS = ['#6c8ef5', '#3ecf6a', '#f5a623', '#a855f7'];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <Card className="bg-card/60 border-border/50 rounded-xl">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <p className="text-xl font-bold tracking-tight">Penilaian Kesehatan Bisnis</p>
              <p className="text-sm text-muted-foreground mt-1">Berdasarkan portofolio produk dan modal awal.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 h-2.5 bg-background/50 rounded-full overflow-hidden border border-border/50">
                <div className={`h-full rounded-full transition-all duration-1000 ${healthColor.split(' ')[1]}`} style={{ width: `${Math.min(healthScore, 100)}%` }}></div>
              </div>
              <span className={`font-black text-lg ${healthColor.split(' ')[0]}`}>{healthLabel}</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {notes.map((n, i) => (
              <div key={i} className={`p-4 rounded-lg text-sm leading-relaxed border ${
                n.type === 'green' ? 'bg-[var(--success)]/10 border-[var(--success)]/20 text-[var(--success)]' :
                n.type === 'amber' ? 'bg-[var(--warning)]/10 border-[var(--warning)]/20 text-[var(--warning)]' :
                'bg-[var(--danger)]/10 border-[var(--danger)]/20 text-[var(--danger)]'
              }`}>
                {n.text}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-card/60 rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardDescription className="uppercase tracking-widest font-bold text-xs">Breakdown HPP per Produk</CardDescription>
            {enriched.length > 0 && (
              <Select value={defaultSel} onValueChange={val => setSelId(val || '')}>
                <SelectTrigger className="w-[180px] h-8 text-xs bg-background/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {enriched.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          </CardHeader>
          <CardContent className="h-[300px]">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value" stroke="rgba(255,255,255,0.05)" strokeWidth={2}>
                    {pieData.map((e, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(value) => `Rp ${Number(value).toLocaleString('id-ID')}`} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">Pilih produk yang memiliki komponen biaya HPP.</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/60 rounded-xl">
          <CardHeader>
            <CardDescription className="uppercase tracking-widest font-bold text-xs">Ranking Margin Produk</CardDescription>
          </CardHeader>
          <CardContent>
            {sorted.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 text-muted-foreground pb-2 uppercase text-[10px] tracking-wider">
                    <th className="text-left py-2">#</th>
                    <th className="text-left py-2">Produk</th>
                    <th className="text-right py-2">HPP</th>
                    <th className="text-right py-2">Margin</th>
                    <th className="text-right py-2 font-bold">Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {sorted.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-muted/10">
                      <td className="py-3 text-muted-foreground font-bold">{idx + 1}</td>
                      <td className="py-3 font-semibold">{p.name.length > 15 ? p.name.substring(0,15)+'...' : p.name}</td>
                      <td className="py-3 text-right text-muted-foreground">Rp {p.hpp.toLocaleString('id-ID')}</td>
                      <td className="py-3 text-right">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          p.actualMargin >= 60 ? 'bg-[var(--success)]/10 text-[var(--success)]' : p.actualMargin >= 45 ? 'bg-[var(--warning)]/10 text-[var(--warning)]' : 'bg-[var(--danger)]/10 text-[var(--danger)]'
                        }`}>
                          {p.actualMargin.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 text-right font-bold text-[var(--success)]">Rp {p.profit.toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
               <div className="flex items-center justify-center min-h-[200px] text-muted-foreground text-sm">Belum ada produk tersimpan.</div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
