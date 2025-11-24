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
        name: 'GymVerse Koramangala',
        address: '123, 5th Block, Koramangala',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560095',
        phone: '+91 80 2555 1234',
        email: 'koramangala@gymverse.com',
        managerName: 'Rajesh Kumar',
        totalMembers: 245,
        activeMembers: 198,
        totalTrainers: 12,
        status: 'active',
        rating: 4.7,
        totalReviews: 128,
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'branch-2',
        name: 'GymVerse Indiranagar',
        address: '456, 100 Feet Road, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560038',
        phone: '+91 80 2555 2345',
        email: 'indiranagar@gymverse.com',
        managerName: 'Priya Sharma',
        totalMembers: 189,
        activeMembers: 156,
        totalTrainers: 9,
        status: 'active',
        rating: 4.5,
        totalReviews: 95,
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'branch-3',
        name: 'GymVerse Whitefield',
        address: '789, ITPL Main Road, Whitefield',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560066',
        phone: '+91 80 2555 3456',
        email: 'whitefield@gymverse.com',
        managerName: 'Vikram Reddy',
        totalMembers: 312,
        activeMembers: 267,
        totalTrainers: 15,
        status: 'active',
        rating: 4.9,
        totalReviews: 187,
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

