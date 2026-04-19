"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useProjectStore, CapitalItem } from "@/store/useProjectStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, X } from "lucide-react";

const CAT_COLORS: Record<string, string> = {
  'Peralatan': '#f5a623',
  'Furnitur': '#3ecf6a',
  'Renovasi': '#6c8ef5',
  'Legalitas': '#a855f7',
  'Bahan Baku': '#ff5c5c',
  'Sewa': '#22d3ee',
  'Operasional': '#f97316'
};

export default function CapitalTab() {
  const params = useParams();
  const { projects, updateProject } = useProjectStore();
  const project = projects.find(p => p.id === params.id);

  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Partial<CapitalItem>>({ name: '', category: 'Peralatan', cost: 0 });

  if (!project) return null;

  const handleAdd = () => {
    if (!form.name || !form.cost) return;
    const newItem: CapitalItem = {
      id: crypto.randomUUID(),
      name: form.name,
      category: form.category || 'Peralatan',
      cost: form.cost
    };
    updateProject(project.id, { capitalItems: [...project.capitalItems, newItem] });
    setForm({ name: '', category: 'Peralatan', cost: 0 });
    setAdding(false);
  };

  const handleRemove = (id: string) => {
    updateProject(project.id, { capitalItems: project.capitalItems.filter(c => c.id !== id) });
  };

  const totalCapital = project.capitalItems.reduce((s, c) => s + c.cost, 0);

  const categoryMap: Record<string, number> = {};
  project.capitalItems.forEach(item => {
    categoryMap[item.category] = (categoryMap[item.category] || 0) + item.cost;
  });
  const sortedCategories = Object.keys(categoryMap).map(k => ({ name: k, val: categoryMap[k] })).sort((a,b) => b.val - a.val);

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-extrabold">Rincian Modal Awal</h2>
          <Button onClick={() => setAdding(!adding)} variant={adding ? "outline" : "default"} className={!adding ? "gradient-bg shadow-sm" : ""}>
            {adding ? 'Batal' : <><Plus className="w-4 h-4 mr-1" /> Tambah Item</>}
          </Button>
        </div>

        {adding && (
          <div className="bg-card/60 border border-primary/20 p-4 rounded-lg mb-6 shadow-sm grid md:grid-cols-[1fr_150px_150px_auto] gap-4 items-end">
            <div className="space-y-1.5">
              <Label className="text-xs">Nama Item</Label>
              <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Cth: Mesin Kopi" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Kategori</Label>
              <Select value={form.category} onValueChange={v => setForm({...form, category: v || 'Peralatan'})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.keys(CAT_COLORS).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Biaya (Rp)</Label>
              <Input type="number" value={form.cost || ''} onChange={e => setForm({...form, cost: parseInt(e.target.value)||0})} placeholder="0" />
            </div>
            <Button onClick={handleAdd} className="w-full">Simpan</Button>
          </div>
        )}

        <div className="border border-border/50 rounded-xl overflow-hidden bg-card/40">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border/50 text-muted-foreground uppercase text-xs tracking-wider">
                <th className="text-left font-bold p-4">Item Pengeluaran</th>
                <th className="text-left font-bold p-4">Kategori</th>
                <th className="text-right font-bold p-4">Biaya</th>
                <th className="p-4 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {project.capitalItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-8 text-muted-foreground">Belum ada rincian modal. Tambahkan modal pertama Anda.</td>
                </tr>
              ) : (
                project.capitalItems.map(item => {
                  const color = CAT_COLORS[item.category] || '#888';
                  return (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-semibold">{item.name}</td>
                      <td className="p-4">
                        <span 
                          className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
                          style={{ backgroundColor: `${color}1A`, color: color, border: `1px solid ${color}40` }}
                        >
                          {item.category}
                        </span>
                      </td>
                      <td className="text-right p-4 font-bold text-foreground">Rp {item.cost.toLocaleString('id-ID')}</td>
                      <td className="p-4 text-center">
                        <Button variant="ghost" size="icon" onClick={() => handleRemove(item.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                          <X className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {project.capitalItems.length > 0 && (
              <tfoot>
                <tr className="bg-primary/5 border-t border-primary/20">
                  <td colSpan={2} className="p-4 font-black uppercase text-sm">Total Modal Awal</td>
                  <td className="p-4 text-right font-black text-lg text-primary">Rp {totalCapital.toLocaleString('id-ID')}</td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      <div className="space-y-6">
        <div className="gradient-bg p-6 rounded-xl shadow-lg shadow-primary/10">
          <p className="text-xs font-bold text-primary-foreground/70 uppercase tracking-widest mb-2">Total Modal Dibutuhkan</p>
          <p className="text-4xl font-black text-primary-foreground mb-2">Rp {(totalCapital / 1e6).toFixed(1)}M</p>
          <p className="text-sm text-primary-foreground/80">Seluruh kebutuhan investasi awal</p>
        </div>

        {sortedCategories.length > 0 && (
          <div className="bg-card/60 border border-border/50 p-6 rounded-xl">
            <h3 className="font-bold mb-6">Distribusi per Kategori</h3>
            <div className="space-y-5">
              {sortedCategories.map(cat => {
                const pct = (cat.val / totalCapital) * 100;
                const color = CAT_COLORS[cat.name] || '#888';
                return (
                  <div key={cat.name}>
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span>{cat.name}</span>
                      <span style={{ color }}>{pct.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: color }}></div>
                    </div>
                    <div className="text-right text-[10px] text-muted-foreground mt-1">Rp {cat.val.toLocaleString('id-ID')}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
