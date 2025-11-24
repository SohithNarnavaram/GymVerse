import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useBranchStore } from '@/store/branchStore';
import type { Branch } from '@/types';

export function useBranchInit() {
  const { user } = useAuthStore();
  const { branches, setBranches, selectBranch } = useBranchStore();

  useEffect(() => {
    // Only initialize branches for admins
    if (user?.role !== 'admin') {
      return;
    }

    // If branches are already loaded, don't reload
    if (branches.length > 0) {
      return;
    }

    // Mock branches data - In production, this would come from an API
    const mockBranches: Branch[] = [
      {
        id: 'branch-1',
        name: 'GymVerse Downtown',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        phone: '+1 (555) 123-4567',
        email: 'downtown@gymverse.com',
        managerName: 'John Manager',
        totalMembers: 245,
        activeMembers: 198,
        totalTrainers: 12,
        status: 'active',
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'branch-2',
        name: 'GymVerse Uptown',
        address: '456 Park Avenue',
        city: 'New York',
        state: 'NY',
        zipCode: '10022',
        phone: '+1 (555) 234-5678',
        email: 'uptown@gymverse.com',
        managerName: 'Sarah Manager',
        totalMembers: 189,
        activeMembers: 156,
        totalTrainers: 9,
        status: 'active',
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'branch-3',
        name: 'GymVerse Brooklyn',
        address: '789 Ocean Drive',
        city: 'Brooklyn',
        state: 'NY',
        zipCode: '11201',
        phone: '+1 (555) 345-6789',
        email: 'brooklyn@gymverse.com',
        managerName: 'Mike Manager',
        totalMembers: 312,
        activeMembers: 267,
        totalTrainers: 15,
        status: 'active',
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // Simulate API call
    const loadBranches = async () => {
      // In production: const branches = await fetchBranches();
      setBranches(mockBranches);

      // Auto-select first branch if only one exists
      // Check selectedBranch from store state
      const currentState = useBranchStore.getState();
      if (mockBranches.length === 1 && !currentState.selectedBranch) {
        selectBranch(mockBranches[0]);
      }
    };

    loadBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);
}

