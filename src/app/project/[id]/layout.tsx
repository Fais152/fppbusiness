"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useProjectStore } from "@/store/useProjectStore";
import Link from "next/link";
import { BarChart3, Package, DollarSign, PieChart, Target, ArrowLeft, Save, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const projectId = params.id as string;

  const [mounted, setMounted] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const { projects, fetchProject, saveProject, syncing } = useProjectStore();
  const project = projects.find(p => p.id === projectId);

  useEffect(() => {
    setMounted(true);
    fetchProject(projectId);
  }, [projectId, fetchProject]);

  if (!mounted) return null;

  if (!project) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-32 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Memuat proyek...</p>
      </div>
    );
  }

  const handleSave = async () => {
    setSaveStatus('saving');
    await saveProject(projectId);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const TABS = [
    { id: '', icon: BarChart3, label: 'Dashboard' },
    { id: 'products', icon: Package, label: 'Produk & HPP' },
    { id: 'capital', icon: DollarSign, label: 'Modal Awal' },
    { id: 'analysis', icon: PieChart, label: 'Analisis' },
    { id: 'bep', icon: Target, label: 'Break Even' }
  ];

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <button onClick={() => router.push('/dashboard')} className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Portofolio
      </button>

      <div className="glass-card mb-8 p-6 rounded-xl relative overflow-hidden text-card-foreground">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight gradient-text">
              {project.businessName || "Proyek Tanpa Nama"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Platform Manajemen Bisnis & Kalkulasi Finansial</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-xs font-semibold text-primary">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              {project.industryCategory}
            </div>
            <Button onClick={handleSave} disabled={syncing} size="sm" variant="outline" className="rounded-lg">
              {saveStatus === 'saving' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> :
               saveStatus === 'saved' ? <Check className="w-4 h-4 mr-2 text-[var(--success)]" /> :
               <Save className="w-4 h-4 mr-2" />}
              {saveStatus === 'saved' ? 'Tersimpan!' : 'Simpan'}
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
          {TABS.map(tab => {
            const isRoot = tab.id === '';
            const isActive = isRoot
              ? pathname === `/project/${project.id}`
              : pathname.includes(`/project/${project.id}/${tab.id}`);

            const Icon = tab.icon;

            return (
              <Link
                key={tab.id}
                href={`/project/${project.id}${isRoot ? '' : `/${tab.id}`}`}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="glass-card min-h-[500px] p-6 rounded-xl">
        {children}
      </div>
    </div>
  );
}
