"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProjectStore } from "@/store/useProjectStore";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FolderOpen, Trash2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { projects, loading, fetchProjects, deleteProject, createProject } = useProjectStore();
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchProjects();
    }
  }, [status, router, fetchProjects]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleCreateNew = async () => {
    setCreating(true);
    try {
      const newId = await createProject({
        businessName: "Proyek Baru",
        industryCategory: "F&B",
      });
      router.push(`/project/${newId}`);
    } finally {
      setCreating(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-12 relative">
      {/* Decorative blob */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 animate-blob pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Portofolio Bisnis</h1>
          <p className="text-muted-foreground mt-2">Kelola proyek bisnis dan produk Anda di sini.</p>
        </div>
        <Button onClick={handleCreateNew} disabled={creating} size="lg" className="gradient-bg rounded-lg shadow-lg shadow-primary/15">
          {creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-5 h-5 mr-2" />}
          Buat Proyek Baru
        </Button>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Memuat data...</span>
        </div>
      ) : projects.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="text-center py-20 glass-card">
            <CardContent>
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FolderOpen className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Belum Ada Proyek</h3>
              <p className="text-muted-foreground mb-8">Mulai rencanakan keuangan produk pertama Anda!</p>
              <Button onClick={handleCreateNew} disabled={creating} size="lg" className="gradient-bg rounded-lg">
                <Plus className="w-5 h-5 mr-2" /> Buat Proyek Pertama
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {projects.map((proj) => {
              const totalCapital = proj.capitalItems.reduce((s, c) => s + c.cost, 0);
              return (
                <motion.div key={proj.id} variants={itemVariants} layout exit={{ opacity: 0, scale: 0.8 }}>
                  <Card className="flex flex-col h-full glass-card cursor-pointer" onClick={() => router.push(`/project/${proj.id}`)}>
                    <CardHeader>
                      <CardTitle className="text-lg font-bold">{proj.businessName}</CardTitle>
                      <CardDescription className="font-semibold text-xs uppercase tracking-wider text-primary">{proj.industryCategory}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Jumlah Produk:</span>
                          <span className="font-bold">{proj.products.length} Item</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Total Modal:</span>
                          <span className="font-bold text-primary">Rp {totalCapital.toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2 pt-4">
                      <Button
                        className="flex-1 gradient-bg rounded-lg"
                        onClick={(e) => { e.stopPropagation(); router.push(`/project/${proj.id}`); }}
                      >
                        Buka Proyek
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="rounded-lg"
                        onClick={(e) => { e.stopPropagation(); deleteProject(proj.id); }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
