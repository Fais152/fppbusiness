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

export interface BusinessProject {
  id: string;
  businessName: string;
  industryCategory: string;
  products: Product[];
  capitalItems: CapitalItem[];
  bepMonthlyOps: number;
  bepTargetDays: number;
  createdAt: string;
}

interface ProjectState {
  projects: BusinessProject[];
  currentProjectId: string | null;
  loading: boolean;
  syncing: boolean;

  fetchProjects: () => Promise<void>;
  fetchProject: (id: string) => Promise<BusinessProject | null>;
  createProject: (init?: Partial<BusinessProject>) => Promise<string>;
  setCurrentProject: (id: string) => void;
  updateProject: (id: string, updates: Partial<BusinessProject>) => void;
  saveProject: (id: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>()((set, get) => ({
  projects: [],
  currentProjectId: null,
  loading: false,
  syncing: false,

  fetchProjects: async () => {
    set({ loading: true });
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      set({ projects: data, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchProject: async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) return null;
      const data = await res.json();
      // Update in local state
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

  // Optimistic local update (call saveProject after to persist)
  updateProject: (id, updates) => set(state => ({
    projects: state.projects.map(proj =>
      proj.id === id ? { ...proj, ...updates } : proj
    )
  })),

  // Persist current state to server
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
}));
