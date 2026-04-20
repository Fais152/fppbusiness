"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useProjectStore, Product, Ingredient } from "@/store/useProjectStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Save, X, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductsTab() {
  const params = useParams();
  const { projects, updateProject } = useProjectStore();
  const project = projects.find(p => p.id === params.id);

  const [form, setForm] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);

  if (!project) return null;

  const products = project.products || [];

  const handleCreateNew = () => {
    setIsNew(true);
    setForm({
      id: crypto.randomUUID(),
      name: "",
      category: "Makanan",
      targetMargin: 55,
      ingredients: [],
      packaging: 0,
      labor: 0,
      overhead: 0
    });
  };

  const handleEdit = (p: Product) => {
    setIsNew(false);
    setForm(JSON.parse(JSON.stringify(p))); // deep clone
  };

  const handleSave = () => {
    if (!form || !form.name.trim()) return;
    
    let newProducts;
    if (isNew) {
      newProducts = [...products, form];
    } else {
      newProducts = products.map(p => p.id === form.id ? form : p);
    }
    
    updateProject(project.id, { products: newProducts });
    setForm(null);
    setIsNew(false);
  };

  const handleDeleteProduct = (id: string) => {
    const newProducts = products.filter(p => p.id !== id);
    updateProject(project.id, { products: newProducts });
    if (form && form.id === id) setForm(null);
  };

  const handleIngChange = (index: number, field: keyof Ingredient, value: string | number) => {
    setForm(prev => {
      if (!prev) return prev;
      const nf = { ...prev, ingredients: [...prev.ingredients] };
      const val = (field === 'qty' || field === 'unitCost') ? (parseFloat(value as string) || 0) : value;
      nf.ingredients[index] = { ...nf.ingredients[index], [field]: val };
      return nf;
    });
  };

  const addIngredient = () => {
    setForm(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        ingredients: [...prev.ingredients, { id: crypto.randomUUID(), name: '', qty: 0, unit: 'gr', unitCost: 0 }]
      };
    });
  };

  const removeIngredient = (idx: number) => {
    setForm(prev => {
      if (!prev) return prev;
      const nf = { ...prev, ingredients: [...prev.ingredients] };
      nf.ingredients.splice(idx, 1);
      return nf;
    });
  };

  const calcHPP = (p: Product) => p.ingredients.reduce((s, i) => s + (i.qty * i.unitCost), 0) + p.packaging + p.labor + p.overhead;
  const calcSell = (hpp: number, margin: number) => hpp <= 0 ? 0 : Math.ceil(hpp / (1 - Math.min(margin, 99) / 100) / 100) * 100;
  
  const fhpp = form ? calcHPP(form) : 0;
  const fsell = form ? calcSell(fhpp, form.targetMargin) : 0;
  const fprofit = fsell - fhpp;
  const fmarg = fsell > 0 ? (fprofit / fsell) * 100 : 0;

  return (
    <div className="flex flex-col md:grid md:grid-cols-[300px_1fr] gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Sidebar List */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Produk ({products.length})</span>
          <Button onClick={handleCreateNew} size="sm" className="gradient-bg rounded-lg shadow-sm"><Plus className="w-4 h-4 mr-1" /> Baru</Button>
        </div>
        
        <div className="space-y-3">
          <AnimatePresence>
            {products.map(p => {
              const hpp = calcHPP(p);
              const sell = calcSell(hpp, p.targetMargin);
              const isActive = form?.id === p.id;
              
              return (
                <motion.div 
                  key={p.id}
                  layout 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => handleEdit(p)}
                  className={`p-4 rounded-lg cursor-pointer transition-all border ${
                    isActive 
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
                      : 'border-border/50 bg-card/60 hover:border-primary/30'
                  }`}
                >
                  <p className={`font-bold text-sm ${isActive ? 'text-primary' : ''}`}>{p.name}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground font-medium">Rp {sell.toLocaleString('id-ID')}</span>
                    <span className="inline-block px-2 py-0.5 rounded border border-border/50 bg-background text-[10px] font-bold">
                      {p.targetMargin}%
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Form Editor */}
      {form ? (
        <div className="bg-card/60 border border-border/50 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="text-xl font-extrabold">{isNew ? 'Tambah Produk Baru' : 'Edit Produk'}</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              {!isNew && <Button variant="destructive" size="sm" className="flex-1 sm:flex-none" onClick={() => handleDeleteProduct(form.id)}><Trash2 className="w-4 h-4 mr-2" /> Hapus</Button>}
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={() => { setForm(null); setIsNew(false); }}>Batal</Button>
              <Button size="sm" className="gradient-bg flex-1 sm:flex-none" onClick={handleSave}><Save className="w-4 h-4 mr-2" /> Simpan</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2 text-sm font-medium">
              <Label>Nama Produk</Label>
              <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="bg-background/80" placeholder="Cth: Nasi Goreng" />
            </div>
            <div className="space-y-2 text-sm font-medium">
              <Label>Kategori</Label>
              <Select value={form.category} onValueChange={v => setForm({...form, category: v || 'Makanan'})}>
                <SelectTrigger className="bg-background/80"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Makanan">Makanan</SelectItem>
                  <SelectItem value="Minuman">Minuman</SelectItem>
                  <SelectItem value="Snack">Snack</SelectItem>
                  <SelectItem value="Dessert">Dessert</SelectItem>
                  <SelectItem value="Lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 text-sm font-medium sm:col-span-2 md:col-span-1">
              <Label>Target Margin (%)</Label>
              <Input type="number" value={form.targetMargin} onChange={e => setForm({...form, targetMargin: parseFloat(e.target.value)||0})} className="bg-background/80" />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Komposisi Bahan Baku</Label>
              <Button variant="outline" size="sm" onClick={addIngredient} className="h-8 shadow-sm">
                <Plus className="w-4 h-4 mr-1" /> Bahan
              </Button>
            </div>
            
            <div className="border border-border/50 rounded-lg overflow-hidden bg-card/40">
              {/* Desktop Header */}
              <div className="hidden lg:grid lg:grid-cols-[1fr_80px_80px_100px_100px_40px] gap-2 p-3 bg-muted/50 text-[11px] font-bold uppercase tracking-wide text-muted-foreground border-b border-border/50">
                <div>Nama Bahan</div>
                <div className="text-right">Qty</div>
                <div>Satuan</div>
                <div className="text-right">Harga/Sat</div>
                <div className="text-right">Total</div>
                <div></div>
              </div>
              
              {form.ingredients.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">Belum ada bahan baku. Klik '+ Bahan'.</div>
              ) : (
                <div className="divide-y divide-border/50">
                  {form.ingredients.map((ing, idx) => (
                    <div key={idx} className="flex flex-col lg:grid lg:grid-cols-[1fr_80px_80px_100px_100px_40px] gap-3 lg:gap-2 p-4 lg:p-2 items-start lg:items-center hover:bg-muted/10 relative">
                      <div className="w-full lg:w-auto">
                        <Label className="lg:hidden text-[10px] uppercase font-bold text-muted-foreground mb-1 block">Nama Bahan</Label>
                        <Input value={ing.name} onChange={e => handleIngChange(idx, 'name', e.target.value)} className="h-9 lg:h-8 text-sm lg:text-xs bg-muted/30 lg:bg-transparent border-border/30 lg:border-transparent focus-visible:border-primary/50 focus-visible:bg-background" placeholder="Bahan..." />
                      </div>
                      <div className="grid grid-cols-2 lg:block gap-4 w-full lg:w-auto">
                        <div className="w-full lg:w-auto">
                          <Label className="lg:hidden text-[10px] uppercase font-bold text-muted-foreground mb-1 block text-right lg:text-left">Qty</Label>
                          <Input type="number" value={ing.qty} onChange={e => handleIngChange(idx, 'qty', e.target.value)} className="h-9 lg:h-8 text-sm lg:text-xs bg-muted/30 lg:bg-transparent border-border/30 lg:border-transparent text-right focus-visible:border-primary/50 focus-visible:bg-background" />
                        </div>
                        <div className="w-full lg:w-auto">
                          <Label className="lg:hidden text-[10px] uppercase font-bold text-muted-foreground mb-1 block">Satuan</Label>
                          <Input value={ing.unit} onChange={e => handleIngChange(idx, 'unit', e.target.value)} className="h-9 lg:h-8 text-sm lg:text-xs bg-muted/30 lg:bg-transparent border-border/30 lg:border-transparent focus-visible:border-primary/50 focus-visible:bg-background" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 lg:block gap-4 w-full lg:w-auto">
                        <div className="w-full lg:w-auto">
                          <Label className="lg:hidden text-[10px] uppercase font-bold text-muted-foreground mb-1 block text-right lg:text-left">Harga/Sat</Label>
                          <Input type="number" value={ing.unitCost} onChange={e => handleIngChange(idx, 'unitCost', e.target.value)} className="h-9 lg:h-8 text-sm lg:text-xs bg-muted/30 lg:bg-transparent border-border/30 lg:border-transparent text-right focus-visible:border-primary/50 focus-visible:bg-background" />
                        </div>
                        <div className="w-full lg:w-auto">
                          <Label className="lg:hidden text-[10px] uppercase font-bold text-muted-foreground mb-1 block text-right lg:text-left">Total</Label>
                          <div className="h-9 lg:h-8 flex items-center justify-end text-xs font-bold text-primary lg:text-muted-foreground">
                            Rp {(ing.qty * ing.unitCost).toLocaleString('id-ID')}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 absolute top-4 right-4 lg:relative lg:top-0 lg:right-0 text-muted-foreground hover:text-destructive" onClick={() => removeIngredient(idx)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="space-y-2 text-sm font-medium">
              <Label>Packaging (Rp)</Label>
              <Input type="number" value={form.packaging} onChange={e => setForm({...form, packaging: parseFloat(e.target.value)||0})} className="bg-background/80" />
            </div>
            <div className="space-y-2 text-sm font-medium">
              <Label>Tenaga Kerja/Porsi (Rp)</Label>
              <Input type="number" value={form.labor} onChange={e => setForm({...form, labor: parseFloat(e.target.value)||0})} className="bg-background/80" />
            </div>
            <div className="space-y-2 text-sm font-medium">
              <Label>Overhead/Porsi (Rp)</Label>
              <Input type="number" value={form.overhead} onChange={e => setForm({...form, overhead: parseFloat(e.target.value)||0})} className="bg-background/80" />
            </div>
          </div>

          <div className="gradient-bg p-5 rounded-xl shadow-lg shadow-primary/10">
            <p className="text-[10px] font-bold text-primary-foreground/70 uppercase tracking-widest mb-4">Kalkulasi Otomatis (Per Porsi)</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-primary-foreground/70 font-medium mb-1">HPP Total</p>
                <p className="text-xl font-black text-primary-foreground">Rp {fhpp.toLocaleString('id-ID')}</p>
              </div>
              <div>
                <p className="text-xs text-primary-foreground/70 font-medium mb-1">Harga Jual Optimal</p>
                <p className="text-xl font-black text-primary-foreground">Rp {fsell.toLocaleString('id-ID')}</p>
              </div>
              <div>
                <p className="text-xs text-primary-foreground/70 font-medium mb-1">Profit Bersih</p>
                <p className="text-xl font-black text-emerald-200">Rp {fprofit.toLocaleString('id-ID')}</p>
              </div>
              <div>
                <p className="text-xs text-primary-foreground/70 font-medium mb-1">Margin Aktual</p>
                <p className="text-xl font-black text-sky-200">{fmarg.toFixed(1)}%</p>
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-border/50 rounded-xl p-6 text-muted-foreground">
          <Package className="w-16 h-16 opacity-20 mb-4" />
          <p className="font-bold text-lg mb-1">Pilih Produk atau Buat Baru</p>
          <p className="text-sm">Klik dari daftar di samping kiri, atau buat produk baru untuk memasukkan komponen HPP.</p>
        </div>
      )}

    </div>
  );
}
