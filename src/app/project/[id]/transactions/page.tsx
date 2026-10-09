"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useProjectStore, DailyTransaction } from "@/store/useProjectStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UpgradeModal } from "@/components/UpgradeModal";
import {
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Lock,
  Crown,
  Sparkles,
  BarChart2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";

export default function TransactionsTab() {
  const params = useParams();
  const projectId = params.id as string;
  const { projects, addTransaction, deleteTransaction, userTier } = useProjectStore();
  const project = projects.find(p => p.id === projectId);

  const [formOpen, setFormOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [lockedFeature, setLockedFeature] = useState("");

  const [type, setType] = useState<'IN' | 'OUT'>('IN');
  const [amount, setAmount] = useState<number | "">("");
  const [category, setCategory] = useState("Penjualan");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");

  if (!project) return null;

  const transactions = project.transactions || [];

  // Filter 30 days for Free Tier
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const visibleTransactions = userTier === 'FREE'
    ? transactions.filter(t => new Date(t.date) >= thirtyDaysAgo)
    : transactions;

  const hiddenCount = transactions.length - visibleTransactions.length;

  // Summaries
  const totalIn = visibleTransactions.filter(t => t.type === 'IN').reduce((s, t) => s + t.amount, 0);
  const totalOut = visibleTransactions.filter(t => t.type === 'OUT').reduce((s, t) => s + t.amount, 0);
  const netCashflow = totalIn - totalOut;

  // BEP Target comparison for Premium
  const avgMargin = (project.products || []).length > 0
    ? (project.products || []).reduce((s, p) => s + (p.targetMargin || 50), 0) / (project.products || []).length
    : 50;
  const totalCapital = (project.capitalItems || []).reduce((s, c) => s + c.cost, 0);
  const monthlyOps = project.bepMonthlyOps || 500000;
  const bepTargetDays = project.bepTargetDays || 30;
  const monthlyTargetRevenue = (totalCapital / (bepTargetDays / 30)) + monthlyOps;
  const bepAchievementPct = monthlyTargetRevenue > 0 ? (totalIn / monthlyTargetRevenue) * 100 : 0;

  // Chart data aggregation (by last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const weeklyChartData = last7Days.map(dayStr => {
    const dayName = new Date(dayStr).toLocaleDateString('id-ID', { weekday: 'short' });
    const inSum = transactions
      .filter(t => t.type === 'IN' && t.date.startsWith(dayStr))
      .reduce((s, t) => s + t.amount, 0);
    const outSum = transactions
      .filter(t => t.type === 'OUT' && t.date.startsWith(dayStr))
      .reduce((s, t) => s + t.amount, 0);
    return { day: dayName, 'Kas Masuk': inSum, 'Kas Keluar': outSum };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    addTransaction(projectId, {
      projectId,
      date: new Date(date).toISOString(),
      type,
      amount: Number(amount),
      category,
      description: description.trim() || undefined,
    });

    setAmount("");
    setDescription("");
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-foreground">
            Buku Transaksi & Arus Kas Harian
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Catat pemasukan dan pengeluaran harian untuk evaluasi penjualan riil UMKM Anda.
          </p>
        </div>
        <Button
          onClick={() => setFormOpen(!formOpen)}
          className="rounded-xl bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Transaksi</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="playful-card p-4 bg-card">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
            <span>Total Kas Masuk (Omset)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-600">
            Rp {totalIn.toLocaleString('id-ID')}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            {userTier === 'FREE' ? '30 hari terakhir' : 'Seluruh data'}
          </p>
        </Card>

        <Card className="playful-card p-4 bg-card">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
            <span>Total Kas Keluar (Beban)</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-rose-500">
            Rp {totalOut.toLocaleString('id-ID')}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            Bahan baku & operasional
          </p>
        </Card>

        <Card className="playful-card p-4 bg-card">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
            <span>Arus Kas Bersih (Net)</span>
            <div className="w-7 h-7 rounded-lg bg-[#1E3A8A]/10 text-[#1E3A8A] dark:text-blue-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-xl sm:text-2xl font-black ${netCashflow >= 0 ? 'text-[#1E3A8A] dark:text-blue-400' : 'text-rose-500'}`}>
            Rp {netCashflow.toLocaleString('id-ID')}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">
            {netCashflow >= 0 ? 'Surplus kas riil' : 'Defisit kas harian'}
          </p>
        </Card>
      </div>

      {/* Transaction Entry Form */}
      {formOpen && (
        <Card className="border-2 border-[#1E3A8A]/20 bg-muted/20 p-5 rounded-2xl animate-in fade-in duration-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-display font-bold text-base text-foreground">Tambah Catatan Kas</h3>
              <button type="button" onClick={() => setFormOpen(false)} className="text-xs text-muted-foreground hover:text-foreground">
                Batal
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <Label className="text-xs mb-1 block">Tipe Kas</Label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setType('IN'); setCategory('Penjualan'); }}
                    className={`flex-1 py-2 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                      type === 'IN'
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                        : 'bg-card text-muted-foreground border-border hover:bg-muted'
                    }`}
                  >
                    + Kas Masuk
                  </button>
                  <button
                    type="button"
                    onClick={() => { setType('OUT'); setCategory('Bahan Baku'); }}
                    className={`flex-1 py-2 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                      type === 'OUT'
                        ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                        : 'bg-card text-muted-foreground border-border hover:bg-muted'
                    }`}
                  >
                    - Kas Keluar
                  </button>
                </div>
              </div>

              <div>
                <Label className="text-xs mb-1 block">Nominal (Rp)</Label>
                <Input
                  type="number"
                  placeholder="Contoh: 150000"
                  value={amount}
                  onChange={e => setAmount(e.target.value ? Number(e.target.value) : "")}
                  required
                  className="rounded-xl h-9 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs mb-1 block">Kategori</Label>
                <Select value={category} onValueChange={(val) => setCategory(val || 'Penjualan')}>
                  <SelectTrigger className="rounded-xl h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {type === 'IN' ? (
                      <>
                        <SelectItem value="Penjualan">Penjualan Menu</SelectItem>
                        <SelectItem value="Pendapatan Lainnya">Pendapatan Lainnya</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="Bahan Baku">Bahan Baku</SelectItem>
                        <SelectItem value="Kemasan">Kemasan / Packaging</SelectItem>
                        <SelectItem value="Operasional">Operasional & Listrik</SelectItem>
                        <SelectItem value="Gaji / Upah">Gaji / Upah Karyawan</SelectItem>
                        <SelectItem value="Sewa Tempat">Sewa Tempat</SelectItem>
                        <SelectItem value="Lainnya">Pengeluaran Lainnya</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs mb-1 block">Tanggal</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="rounded-xl h-9 text-xs"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs mb-1 block">Catatan / Keterangan (Opsional)</Label>
              <Input
                placeholder="Misal: Penjualan 25 porsi Nasi Goreng, beli beras 5kg"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="rounded-xl h-9 text-xs"
              />
            </div>

            <div className="flex justify-end pt-1">
              <Button type="submit" size="sm" className="bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90 rounded-xl px-5 cursor-pointer">
                Simpan Transaksi
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Feature 4.2.d: Weekly Chart & BEP vs Realisasi Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Weekly Trend Chart */}
        <Card className="playful-card p-5 bg-card">
          <CardHeader className="p-0 pb-3">
            <CardTitle className="text-sm font-bold font-display flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#1E3A8A] dark:text-blue-400" />
              <span>Rekapitulasi Kas Mingguan</span>
            </CardTitle>
            <CardDescription className="text-xs">Perbandingan kas masuk vs keluar dalam 7 hari terakhir.</CardDescription>
          </CardHeader>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `Rp ${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => `Rp ${Number(v).toLocaleString('id-ID')}`} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Kas Masuk" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Kas Keluar" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Feature 4.2.d Premium: BEP Target vs Realisasi Penjualan Aktual */}
        <Card className={`playful-card p-5 bg-card relative overflow-hidden ${userTier === 'FREE' ? 'border-[#F5A623]/30' : ''}`}>
          <div className="flex items-center justify-between pb-2 border-b">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-sm text-foreground">Target BEP vs Realisasi Aktual</span>
                {userTier === 'FREE' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F5A623]/20 text-[#B45309] dark:text-[#FBBF24] flex items-center gap-1">
                    <Crown className="w-3 h-3" /> Premium
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Evaluasi: Apakah penjualan riil sudah mencapai target balik modal?
              </p>
            </div>
          </div>

          {userTier === 'FREE' ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#F5A623]/15 text-[#F5A623] flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Analisis perbandingan Target BEP dengan transaksi riil merupakan fitur pembeda <strong>HPPmate Premium</strong>.
              </p>
              <Button
                size="sm"
                onClick={() => { setLockedFeature("Perbandingan Target BEP vs Realisasi"); setUpgradeOpen(true); }}
                className="rounded-xl bg-[#F5A623] hover:bg-[#F5A623]/90 text-slate-900 font-bold text-xs cursor-pointer"
              >
                Buka Analisis Realisasi BEP
              </Button>
            </div>
          ) : (
            <div className="pt-4 space-y-4">
              <div className="p-3.5 rounded-xl bg-muted/40 border space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Target Penjualan BEP Proyeksi:</span>
                  <span className="font-bold text-foreground">Rp {Math.round(monthlyTargetRevenue).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Realisasi Penjualan Aktual (Kas Masuk):</span>
                  <span className="font-bold text-emerald-600">Rp {totalIn.toLocaleString('id-ID')}</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(bepAchievementPct, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-muted-foreground">Ketercapaian Balik Modal:</span>
                  <span className="font-black text-[#1E3A8A] dark:text-blue-400">{bepAchievementPct.toFixed(1)}%</span>
                </div>
              </div>

              <div className="p-3 rounded-xl border border-blue-500/20 bg-blue-500/5 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-muted-foreground">
                  {bepAchievementPct >= 100
                    ? "Selamat! Penjualan aktual Anda sudah melampaui target titik balik modal periode ini."
                    : `Anda memerlukan tambahan penjualan sekitar Rp ${Math.max(0, Math.round(monthlyTargetRevenue - totalIn)).toLocaleString('id-ID')} untuk mencapai titik impas modal sesuai rencana.`}
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Transaction History Table */}
      <Card className="playful-card p-5 bg-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <CardTitle className="text-sm font-bold font-display flex items-center gap-2">
            <span>Riwayat Transaksi</span>
            <span className="text-xs font-normal text-muted-foreground">({visibleTransactions.length} transaksi)</span>
          </CardTitle>
          {userTier === 'FREE' && hiddenCount > 0 && (
            <button
              onClick={() => { setLockedFeature("Riwayat Transaksi Tanpa Batas"); setUpgradeOpen(true); }}
              className="text-xs text-[#B45309] dark:text-[#FBBF24] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Crown className="w-3 h-3 text-[#F5A623]" />
              <span>{hiddenCount} transaksi lama terkunci (Buka di Premium)</span>
            </button>
          )}
        </div>

        {visibleTransactions.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-xs border border-dashed rounded-xl">
            Belum ada catatan kas. Klik tombol &quot;+ Catat Transaksi&quot; untuk memasukkan penjualan atau pengeluaran pertama Anda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b text-muted-foreground text-left uppercase text-[10px] tracking-wider">
                  <th className="py-2 px-3">Tanggal</th>
                  <th className="py-2 px-3">Tipe</th>
                  <th className="py-2 px-3">Kategori</th>
                  <th className="py-2 px-3">Keterangan</th>
                  <th className="py-2 px-3 text-right">Nominal</th>
                  <th className="py-2 px-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {visibleTransactions.map(t => (
                  <tr key={t.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-2.5 px-3 font-medium whitespace-nowrap">
                      {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.type === 'IN' ? 'bg-emerald-500/15 text-emerald-600' : 'bg-rose-500/15 text-rose-500'
                      }`}>
                        {t.type === 'IN' ? '+ Masuk' : '- Keluar'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold">{t.category}</td>
                    <td className="py-2.5 px-3 text-muted-foreground max-w-[200px] truncate">{t.description || "-"}</td>
                    <td className={`py-2.5 px-3 text-right font-bold whitespace-nowrap ${t.type === 'IN' ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {t.type === 'IN' ? '+' : '-'} Rp {t.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => deleteTransaction(projectId, t.id)}
                        className="text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <UpgradeModal
        isOpen={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        featureName={lockedFeature}
      />
    </div>
  );
}
