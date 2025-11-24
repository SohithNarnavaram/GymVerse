import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useBranchStore } from '@/store/branchStore';
import type { Branch } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  MapPinIcon,
  BuildingOfficeIcon,
  UsersIcon,
  UserGroupIcon,
  ChartBarIcon,
  StarIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function BranchesDashboard() {
  const navigate = useNavigate();
  const { branches, setBranches, selectBranch } = useBranchStore();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
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
      {
        id: 'branch-4',
        name: 'GymVerse HSR Layout',
        address: '234, 27th Main Road, HSR Layout',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560102',
        phone: '+91 80 2555 4567',
        email: 'hsr@gymverse.com',
        managerName: 'Anjali Nair',
        totalMembers: 278,
        activeMembers: 234,
        totalTrainers: 14,
        status: 'active',
        rating: 4.6,
        totalReviews: 142,
        createdAt: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'branch-5',
        name: 'GymVerse Jayanagar',
        address: '567, 4th Block, Jayanagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560011',
        phone: '+91 80 2555 5678',
        email: 'jayanagar@gymverse.com',
        managerName: 'Suresh Iyer',
        totalMembers: 198,
        activeMembers: 167,
        totalTrainers: 10,
        status: 'active',
        rating: 4.8,
        totalReviews: 103,
        createdAt: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'branch-6',
        name: 'GymVerse Malleswaram',
        address: '890, Sampige Road, Malleswaram',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560003',
        phone: '+91 80 2555 6789',
        email: 'malleswaram@gymverse.com',
        managerName: 'Kavitha Rao',
        totalMembers: 167,
        activeMembers: 142,
        totalTrainers: 8,
        status: 'active',
        rating: 4.4,
        totalReviews: 78,
        createdAt: new Date(Date.now() - 420 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'branch-7',
        name: 'GymVerse Electronic City',
        address: '345, Hosur Road, Electronic City',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560100',
        phone: '+91 80 2555 7890',
        email: 'electroniccity@gymverse.com',
        managerName: 'Ramesh Shetty',
        totalMembers: 423,
        activeMembers: 378,
        totalTrainers: 18,
        status: 'active',
        rating: 4.8,
        totalReviews: 201,
        createdAt: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'branch-8',
        name: 'GymVerse Marathahalli',
        address: '678, Outer Ring Road, Marathahalli',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560037',
        phone: '+91 80 2555 8901',
        email: 'marathahalli@gymverse.com',
        managerName: 'Deepak Joshi',
        totalMembers: 356,
        activeMembers: 298,
        totalTrainers: 16,
        status: 'active',
        rating: 4.7,
        totalReviews: 165,
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // Simulate API call
    setTimeout(() => {
      setBranches(mockBranches);
      setLoading(false);
    }, 500);
  }, [setBranches]);

  const handleSelectBranch = (branch: Branch) => {
    selectBranch(branch);
    navigate('/admin');
  };

  const totalMembers = branches.reduce((sum, branch) => sum + branch.totalMembers, 0);
  const totalActiveMembers = branches.reduce((sum, branch) => sum + branch.activeMembers, 0);
  const totalTrainers = branches.reduce((sum, branch) => sum + branch.totalTrainers, 0);
  const activeBranches = branches.filter((b) => b.status === 'active').length;

  // Filter branches based on search term
  const filteredBranches = branches.filter((branch) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      branch.name.toLowerCase().includes(searchLower) ||
      branch.city.toLowerCase().includes(searchLower) ||
      branch.address.toLowerCase().includes(searchLower) ||
      branch.managerName?.toLowerCase().includes(searchLower) ||
      branch.state?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading branches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Branches Dashboard</h1>
          <p className="mt-2 text-gray-300 font-medium">Overview of all gym branches and locations</p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/admin/branches/select')}
          className="bg-transparent border-primary-500 text-primary-400 hover:bg-primary-500/20 hover:border-primary-400 hover:text-primary-300"
        >
          Select Branch
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Branches</p>
              <p className="text-2xl font-bold text-white">{branches.length}</p>
              <p className="text-xs text-emerald-400 mt-1">{activeBranches} active</p>
            </div>
            <div className="p-3 bg-primary-500/20 rounded-lg border border-primary-500/30">
              <BuildingOfficeIcon className="h-6 w-6 text-primary-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Members</p>
              <p className="text-2xl font-bold text-white">{totalMembers}</p>
              <p className="text-xs text-emerald-400 mt-1">{totalActiveMembers} active</p>
            </div>
            <div className="p-3 bg-secondary-500/20 rounded-lg border border-secondary-500/30">
              <UsersIcon className="h-6 w-6 text-secondary-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Trainers</p>
              <p className="text-2xl font-bold text-white">{totalTrainers}</p>
              <p className="text-xs text-gray-400 mt-1">Across all branches</p>
            </div>
            <div className="p-3 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
              <UserGroupIcon className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Avg. Members/Branch</p>
              <p className="text-2xl font-bold text-white">
                {branches.length > 0 ? Math.round(totalMembers / branches.length) : 0}
              </p>
              <p className="text-xs text-gray-400 mt-1">Average</p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
              <ChartBarIcon className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Branches List */}
      <Card>
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold text-white">All Branches</h2>
          <div className="w-full max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search branches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBranches.map((branch) => (
            <div
              key={branch.id}
              className="p-5 bg-gray-900 rounded-lg border border-gray-800 hover:border-primary-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-500/20 rounded-lg border border-primary-500/30">
                    <BuildingOfficeIcon className="h-5 w-5 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{branch.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPinIcon className="h-3.5 w-3.5 text-gray-400" />
                      <p className="text-xs text-gray-400">{branch.city}, {branch.state}</p>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${
                    branch.status === 'active'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : branch.status === 'maintenance'
                      ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                  }`}
                >
                  {branch.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-400">{branch.address}</p>
                {branch.managerName && (
                  <p className="text-xs text-gray-500">Manager: {branch.managerName}</p>
                )}
                {branch.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => {
                        const starValue = i + 1;
                        const rating = branch.rating || 0;
                        const isFilled = starValue <= Math.floor(rating);
                        const isHalfFilled = !isFilled && starValue === Math.ceil(rating) && rating % 1 >= 0.25;
                        return (
                          <span key={i} className="text-yellow-400">
                            {isFilled ? (
                              <StarIconSolid className="h-4 w-4" />
                            ) : isHalfFilled ? (
                              <StarIconSolid className="h-4 w-4 opacity-50" />
                            ) : (
                              <StarIcon className="h-4 w-4 text-gray-600" />
                            )}
                          </span>
                        );
                      })}
                    </div>
                    <span className="text-sm font-semibold text-white">{branch.rating.toFixed(1)}</span>
                    {branch.totalReviews && (
                      <span className="text-xs text-gray-500">({branch.totalReviews} reviews)</span>
                    )}
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Established: {format(new Date(branch.createdAt), 'MMM yyyy')}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4 pt-4 border-t border-gray-800">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Members</p>
                  <p className="text-sm font-bold text-white">{branch.totalMembers}</p>
                  <p className="text-xs text-emerald-400">{branch.activeMembers} active</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Trainers</p>
                  <p className="text-sm font-bold text-white">{branch.totalTrainers}</p>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-400">
                      {branch.activeMembers > 0
                        ? Math.round((branch.activeMembers / branch.totalMembers) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => navigate(`/admin/branches/${branch.id}`)}
                  className="bg-secondary-500/20 border-secondary-500/50 text-secondary-400 hover:bg-secondary-500/30 hover:border-secondary-400 hover:text-secondary-300 transition-all duration-200"
                >
                  View Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => handleSelectBranch(branch)}
                  className="bg-primary-500/20 border-primary-500/50 text-primary-400 hover:bg-primary-500/30 hover:border-primary-400 hover:text-primary-300 transition-all duration-200"
                >
                  Select
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

