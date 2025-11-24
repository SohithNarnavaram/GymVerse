import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Branch } from '@/types';

interface BranchState {
  selectedBranch: Branch | null;
  branches: Branch[];
  setBranches: (branches: Branch[]) => void;
  selectBranch: (branch: Branch | null) => void;
  clearBranch: () => void;
  hasMultipleBranches: () => boolean;
}

export const useBranchStore = create<BranchState>()(
  persist(
    (set, get) => ({
      selectedBranch: null,
      branches: [],
      setBranches: (branches) => set({ branches }),
      selectBranch: (branch) => set({ selectedBranch: branch }),
      clearBranch: () => set({ selectedBranch: null }),
      hasMultipleBranches: () => get().branches.length > 1,
    }),
    {
      name: 'branch-storage',
    }
  )
);

