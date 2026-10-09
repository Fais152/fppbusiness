import { create } from 'zustand';

export interface Ingredient {
  id: string;
  name: string;
  qty: number;
  unit: string;
  unitCost: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  targetMargin: number;
  ingredients: Ingredient[];
  packaging: number;
  labor: number;
  overhead: number;
}

export interface CapitalItem {
  id: string;
  name: string;
  category: string;
  cost: number;
}

export interface DailyTransaction {
  id: string;
  projectId: string;
  date: string;
  type: 'IN' | 'OUT';
  amount: number;
  category: string;
  description?: string;
  createdAt?: string;
}

export interface BusinessProject {
  id: string;
  businessName: string;
  industryCategory: string;
  products: Product[];
  capitalItems: CapitalItem[];
  transactions?: DailyTransaction[];
  bepMonthlyOps: number;
  bepTargetDays: number;
  createdAt: string;
}

export type UserTier = 'FREE' | 'PREMIUM';

interface ProjectState {
  projects: BusinessProject[];
  currentProjectId: string | null;
  loading: boolean;
  syncing: boolean;
  userTier: UserTier;

  setUserTier: (tier: UserTier) => void;
  toggleUserTier: () => void;
  fetchProjects: () => Promise<void>;
  fetchProject: (id: string) => Promise<BusinessProject | null>;
  createProject: (init?: Partial<BusinessProject>) => Promise<string>;
  setCurrentProject: (id: string) => void;
  updateProject: (id: string, updates: Partial<BusinessProject>) => void;
  saveProject: (id: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addTransaction: (projectId: string, tx: Omit<DailyTransaction, 'id'>) => void;
  deleteTransaction: (projectId: string, txId: string) => void;
}

export const useProjectStore = create<ProjectState>()((set, get) => ({
  projects: [],
  currentProjectId: null,
  loading: false,
  syncing: false,
  userTier: 'FREE',

  setUserTier: (tier) => set({ userTier: tier }),
  toggleUserTier: () => set(state => ({ userTier: state.userTier === 'FREE' ? 'PREMIUM' : 'FREE' })),

  fetchProjects: async () => {
    set({ loading: true });
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) {
        set({ loading: false });
        return;
      }
      const data = await res.json();
      set({ projects: Array.isArray(data) ? data : [], loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchProject: async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) return null;
      const data = await res.json();
      set(state => ({
        projects: state.projects.some(p => p.id === id)
          ? state.projects.map(p => p.id === id ? data : p)
          : [...state.projects, data]
      }));
      return data;
    } catch {
      return null;
    }
  },

  createProject: async (init) => {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: init?.businessName || 'Proyek Baru',
        industryCategory: init?.industryCategory || 'F&B',
      }),
    });
    const newProject = await res.json();
    set(state => ({
      projects: [newProject, ...state.projects],
      currentProjectId: newProject.id,
    }));
    return newProject.id;
  },

  setCurrentProject: (id) => set({ currentProjectId: id }),

  updateProject: (id, updates) => set(state => ({
    projects: state.projects.map(proj =>
      proj.id === id ? { ...proj, ...updates } : proj
    )
  })),

  saveProject: async (id: string) => {
    const project = get().projects.find(p => p.id === id);
    if (!project) return;
    set({ syncing: true });
    try {
      await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
    } finally {
      set({ syncing: false });
    }
  },

  deleteProject: async (id) => {
    set(state => ({
      projects: state.projects.filter(p => p.id !== id),
      currentProjectId: state.currentProjectId === id ? null : state.currentProjectId,
    }));
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
  },

  addTransaction: (projectId, tx) => {
    const newTx: DailyTransaction = {
      ...tx,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    set(state => ({
      projects: state.projects.map(p => {
        if (p.id !== projectId) return p;
        const currentTxs = p.transactions || [];
        return {
          ...p,
          transactions: [newTx, ...currentTxs],
        };
      })
    }));
  },

  deleteTransaction: (projectId, txId) => {
    set(state => ({
      projects: state.projects.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          transactions: (p.transactions || []).filter(t => t.id !== txId),
        };
      })
    }));
  }
}));
