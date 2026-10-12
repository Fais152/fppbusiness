"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useProjectStore } from "@/store/useProjectStore";
import Link from "next/link";
import {
  BarChart3,
  Package,
  DollarSign,
  PieChart,
  Target,
  ArrowLeft,
  Save,
  Loader2,
  Check,
  Receipt,
  Printer,
  Lock,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UpgradeModal } from "@/components/UpgradeModal";
import { ReportPrintModal } from "@/components/ReportPrintModal";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const projectId = params.id as string;

  const [mounted, setMounted] = useState(() => typeof window !== 'undefined');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [lockedFeatureName, setLockedFeatureName] = useState("");
  const [printModalOpen, setPrintModalOpen] = useState(false);

  const { projects, fetchProject, saveProject, syncing, userTier } = useProjectStore();
  const project = projects.find(p => p.id === projectId);

  useEffect(() => {
    if (mounted) {
      fetchProject(projectId);
    }
  }, [projectId, fetchProject, mounted]);

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

  const handlePdfClick = () => {
    if (userTier === 'FREE') {
      setLockedFeatureName("Ekspor Dokumen PDF");
      setUpgradeModalOpen(true);
    } else {
      setPrintModalOpen(true);
    }
  };

  const TABS = [
    { id: '', icon: BarChart3, label: 'Ringkasan' },
    { id: 'products', icon: Package, label: 'Produk & HPP' },
    { id: 'capital', icon: DollarSign, label: 'Modal Awal' },
    { id: 'transactions', icon: Receipt, label: 'Transaksi Kas', badge: 'Baru' },
    { id: 'analysis', icon: PieChart, label: 'Analisis', isPremium: true },
    { id: 'bep', icon: Target, label: 'Break Even', isPremium: true },
  ];

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => router.push('/dashboard')}
        className="flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Portofolio
      </button>

      {/* Project Banner Card */}
      <div className="playful-card mb-8 p-6 relative overflow-hidden bg-card text-card-foreground">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[#F5A623] uppercase tracking-wider">HPPmate Proyek</span>
              <span className="text-muted-foreground">&bull;</span>
              <span className="text-xs text-muted-foreground font-semibold">{project.industryCategory}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-foreground">
              {project.businessName || "Proyek Tanpa Nama"}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Platform Manajemen HPP, Transaksi & Kalkulasi Finansial
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Export PDF Button */}
            <Button
              onClick={handlePdfClick}
              size="sm"
              variant="outline"
              className="rounded-xl border-[#F5A623]/40 bg-[#F5A623]/10 hover:bg-[#F5A623]/20 text-[#B45309] dark:text-[#FBBF24] font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Ekspor PDF</span>
              {userTier === 'FREE' && <Lock className="w-3 h-3 ml-0.5 opacity-70" />}
            </Button>

            {/* Save Button */}
            <Button onClick={handleSave} disabled={syncing} size="sm" className="rounded-xl bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white font-semibold cursor-pointer">
              {saveStatus === 'saving' ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> :
               saveStatus === 'saved' ? <Check className="w-4 h-4 mr-1.5 text-emerald-400" /> :
               <Save className="w-4 h-4 mr-1.5" />}
              {saveStatus === 'saved' ? 'Tersimpan!' : 'Simpan'}
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2 border-t border-border/60 pt-4">
          {TABS.map(tab => {
            const isRoot = tab.id === '';
            const isActive = isRoot
              ? pathname === `/project/${project.id}`
              : pathname.includes(`/project/${project.id}/${tab.id}`);

            const Icon = tab.icon;
            const isLocked = tab.isPremium && userTier === 'FREE';

            return (
              <Link
                key={tab.id}
                href={`/project/${project.id}${isRoot ? '' : `/${tab.id}`}`}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border cursor-pointer ${
                  isActive
                    ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60 border-transparent'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#F5A623]/20 text-[#B45309] dark:text-[#FBBF24] font-bold">
                    {tab.badge}
                  </span>
                )}
                {isLocked && (
                  <Lock className="w-3 h-3 text-muted-foreground/80 ml-0.5" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="glass-card min-h-screen p-4 sm:p-6 rounded-2xl">
        {children}
      </div>

      {/* Modals */}
      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        featureName={lockedFeatureName}
      />

      <ReportPrintModal
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        project={project}
      />
    </div>
  );
}
