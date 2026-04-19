"use client";

import { useProjectStore, Product } from "@/store/useProjectStore";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function ProjectDashboardTab() {
  const params = useParams();
  const project = useProjectStore(state => state.projects.find(p => p.id === params.id));

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
  const avgMargin = enriched.length ? enriched.reduce((s, p) => s + p.actualMargin, 0) / enriched.length : 0;

  const bestProduct = enriched.length > 0
    ? [...enriched].sort((a,b) => b.actualMargin - a.actualMargin)[0]
    : null;

  const chartData = enriched.map(p => ({
    name: p.name.length > 12 ? p.name.substring(0, 12) + "..." : p.name,
    HPP: p.hpp,
    Profit: p.profit
  }));

  // Semantic color functions
  const getMarginColor = (m: number) => m >= 60 ? 'text-[var(--success)]' : m >= 45 ? 'text-[var(--warning)]' : 'text-[var(--danger)]';
  const getMarginBg = (m: number) => m >= 60
    ? 'bg-[var(--success)]/10 border-[var(--success)]/20'
    : m >= 45
    ? 'bg-[var(--warning)]/10 border-[var(--warning)]/20'
    : 'bg-[var(--danger)]/10 border-[var(--danger)]/20';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/60 rounded-xl">
          <CardContent className="p-5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2">Total Produk</p>
            <p className="text-3xl font-black">{enriched.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Aktif di menu</p>
          </CardContent>
        </Card>
        <Card className="bg-card/60 rounded-xl">
          <CardContent className="p-5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2">Avg Margin</p>
            <p className={`text-3xl font-black ${getMarginColor(avgMargin)}`}>{avgMargin.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-1">Rata-rata semua produk</p>
          </CardContent>
        </Card>
        <Card className="bg-card/60 rounded-xl">
          <CardContent className="p-5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2">Produk Terbaik</p>
            <p className="text-2xl font-black text-[var(--info)] truncate">{bestProduct ? bestProduct.name : "-"}</p>
            <p className="text-xs text-muted-foreground mt-1">{bestProduct ? `Margin ${bestProduct.actualMargin.toFixed(1)}%` : "Belum ada"}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/60 rounded-xl">
          <CardContent className="p-5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-2">Total Modal</p>
            <p className="text-2xl font-black text-purple-400">Rp {(totalCapital / 1e6).toFixed(1)}M</p>
            <p className="text-xs text-muted-foreground mt-1">Investasi Awal</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-card/60 flex flex-col rounded-xl">
          <CardHeader>
            <CardDescription className="uppercase tracking-widest font-bold text-[10px]">HPP vs Profit per Produk</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value) => `Rp ${Number(value).toLocaleString('id-ID')}`}
                    cursor={{fill: 'var(--accent)'}}
                    contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card)' }}
                  />
                  <Legend />
                  <Bar dataKey="HPP" stackId="a" fill="var(--danger)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Profit" stackId="a" fill="var(--success)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                Belum ada data produk.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/60 rounded-xl">
          <CardHeader>
            <CardDescription className="uppercase tracking-widest font-bold text-[10px]">Ringkasan Produk</CardDescription>
          </CardHeader>
          <CardContent>
            {enriched.length > 0 ? (
              <div className="space-y-3">
                {enriched.map(p => (
                  <div key={p.id} className="flex justify-between items-center p-4 bg-muted/40 rounded-lg border border-border/50 hover:border-border transition-colors">
                    <div>
                      <p className="font-bold text-sm">{p.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{p.category} &middot; HPP: Rp {p.hpp.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm mb-1">Rp {p.sell.toLocaleString('id-ID')}</p>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getMarginBg(p.actualMargin)} ${getMarginColor(p.actualMargin)}`}>
                        {p.actualMargin.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm border-2 border-dashed border-border/50 rounded-lg">
                Tidak ada produk. Silakan tambahkan di Tab Produk & HPP.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
