import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { useBranchStore } from '@/store/branchStore';
import { useToast } from '@/components/ui/Toast';
import type { Branch } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import {
  MapPinIcon,
  BuildingOfficeIcon,
  UsersIcon,
  UserGroupIcon,
  ChartBarIcon,
  PhoneIcon,
  EnvelopeIcon,
  PencilIcon,
  ArrowLeftIcon,
  CalendarIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

interface BranchMember {
  id: string;
  name: string;
  email: string;
  membershipPlan: string;
  membershipStatus: 'active' | 'expired' | 'pending';
  joinDate: string;
  totalCheckIns: number;
}

interface BranchTrainer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalClasses: number;
  upcomingClasses: number;
  rating: number;
  status: 'active' | 'inactive';
}

export default function BranchDetails() {
  const navigate = useNavigate();
  const { branchId } = useParams<{ branchId: string }>();
  const { branches, selectBranch } = useBranchStore();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [members, setMembers] = useState<BranchMember[]>([]);
  const [trainers, setTrainers] = useState<BranchTrainer[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    status: 'active' as 'active' | 'inactive' | 'maintenance',
  });

  useEffect(() => {
    // Find branch from store
    const foundBranch = branches.find((b) => b.id === branchId);
    if (foundBranch) {
      setBranch(foundBranch);
      setEditFormData({
        name: foundBranch.name,
        address: foundBranch.address,
        city: foundBranch.city,
        state: foundBranch.state || '',
        zipCode: foundBranch.zipCode || '',
        phone: foundBranch.phone || '',
        email: foundBranch.email || '',
        status: foundBranch.status,
      });

      // Mock members for this branch
      const mockMembers: BranchMember[] = [
        {
          id: 'm1',
          name: 'Rahul Sharma',
          email: 'rahul.sharma@example.com',
          membershipPlan: 'Premium',
          membershipStatus: 'active',
          joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          totalCheckIns: 45,
        },
        {
          id: 'm2',
          name: 'Priya Patel',
          email: 'priya.patel@example.com',
          membershipPlan: 'Elite',
          membershipStatus: 'active',
          joinDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
          totalCheckIns: 32,
        },
        {
          id: 'm3',
          name: 'Arjun Reddy',
          email: 'arjun.reddy@example.com',
          membershipPlan: 'Basic',
          membershipStatus: 'expired',
          joinDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
          totalCheckIns: 18,
        },
      ];
      setMembers(mockMembers);

      // Mock trainers for this branch
      const mockTrainers: BranchTrainer[] = [
        {
          id: 't1',
          name: 'Meera Krishnan',
          email: 'meera.krishnan@example.com',
          phone: '+91 98765 45670',
          totalClasses: 48,
          upcomingClasses: 12,
          rating: 4.8,
          status: 'active',
        },
        {
          id: 't2',
          name: 'Vikram Singh',
          email: 'vikram.singh@example.com',
          phone: '+91 98765 45671',
          totalClasses: 36,
          upcomingClasses: 8,
          rating: 4.6,
          status: 'active',
        },
      ];
      setTrainers(mockTrainers);
    }
    setLoading(false);
  }, [branchId, branches]);

  const handleEdit = () => {
    if (!branch) return;
    setIsEditModalOpen(true);
  };

  const handleUpdateBranch = () => {
    if (!branch) return;
    
    const updatedBranch: Branch = {
      ...branch,
      ...editFormData,
    };
    
    // In production, this would update via API
    showToast({
      variant: 'success',
      title: 'Branch updated',
      description: 'Branch information has been updated successfully',
    });
    
    setIsEditModalOpen(false);
    setBranch(updatedBranch);
  };

  const handleSelectBranch = () => {
    if (branch) {
      selectBranch(branch);
      navigate('/admin');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading branch details...</p>
        </div>
      </div>
    );
  }

  if (!branch) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Branch not found</p>
          <Button onClick={() => navigate('/admin/branches')}>Back to Branches</Button>
        </div>
      </div>
    );
  }

  const activeMembers = members.filter((m) => m.membershipStatus === 'active').length;
  const totalRevenue = 388166; // Mock revenue
  const monthlyGrowth = 15; // Mock growth percentage

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/branches')}
            className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-900 hover:border-gray-600"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-white tracking-tight">{branch.name}</h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${
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
            <div className="flex items-center gap-2 mt-2">
              <MapPinIcon className="h-4 w-4 text-gray-400" />
              <p className="text-gray-300">{branch.address}, {branch.city}, {branch.state} {branch.zipCode}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleEdit}
            className="bg-transparent border-primary-500 text-primary-400 hover:bg-primary-500/20 hover:border-primary-400"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit Branch
          </Button>
          <Button
            onClick={handleSelectBranch}
            className="bg-primary-500 hover:bg-primary-600 text-white"
          >
            Select This Branch
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Members</p>
              <p className="text-2xl font-bold text-white">{branch.totalMembers}</p>
              <p className="text-xs text-emerald-400 mt-1">{branch.activeMembers} active</p>
            </div>
            <div className="p-3 bg-primary-500/20 rounded-lg border border-primary-500/30">
              <UsersIcon className="h-6 w-6 text-primary-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Trainers</p>
              <p className="text-2xl font-bold text-white">{branch.totalTrainers}</p>
              <p className="text-xs text-gray-400 mt-1">{trainers.filter(t => t.status === 'active').length} active</p>
            </div>
            <div className="p-3 bg-secondary-500/20 rounded-lg border border-secondary-500/30">
              <UserGroupIcon className="h-6 w-6 text-secondary-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Monthly Revenue</p>
              <p className="text-2xl font-bold text-white">₹{totalRevenue.toLocaleString('en-IN')}</p>
              <p className="text-xs text-emerald-400 mt-1">+{monthlyGrowth}% vs last month</p>
            </div>
            <div className="p-3 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
              <CurrencyDollarIcon className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Active Rate</p>
              <p className="text-2xl font-bold text-white">
                {branch.totalMembers > 0
                  ? Math.round((branch.activeMembers / branch.totalMembers) * 100)
                  : 0}%
              </p>
              <p className="text-xs text-gray-400 mt-1">Member retention</p>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
              <ChartBarIcon className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Branch Information */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Branch Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Branch Name</p>
              <p className="text-sm font-medium text-white">{branch.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Address</p>
              <p className="text-sm text-gray-300">{branch.address}</p>
              <p className="text-sm text-gray-300">{branch.city}, {branch.state} {branch.zipCode}</p>
            </div>
            {branch.phone && (
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-300">{branch.phone}</p>
              </div>
            )}
            {branch.email && (
              <div className="flex items-center gap-2">
                <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-300">{branch.email}</p>
              </div>
            )}
            {branch.managerName && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Manager</p>
                <p className="text-sm font-medium text-white">{branch.managerName}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-500 mb-1">Established</p>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-300">
                  {format(new Date(branch.createdAt), 'MMMM dd, yyyy')}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Members */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Members</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin')}
              className="bg-transparent border-primary-500 text-primary-400 hover:bg-primary-500/20"
            >
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {members.slice(0, 5).map((member) => (
              <div
                key={member.id}
                className="p-3 bg-gray-900 rounded-lg border border-gray-800 hover:border-primary-500/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{member.name}</p>
                    <p className="text-xs text-gray-400">{member.email}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        member.membershipStatus === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : member.membershipStatus === 'expired'
                          ? 'bg-red-500/20 text-red-400 border-red-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }`}
                    >
                      {member.membershipStatus}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{member.membershipPlan}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-800">
                  <p className="text-xs text-gray-500">
                    {member.totalCheckIns} check-ins
                  </p>
                  <p className="text-xs text-gray-500">
                    Joined {format(new Date(member.joinDate), 'MMM yyyy')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Trainers */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Branch Trainers</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin')}
            className="bg-transparent border-primary-500 text-primary-400 hover:bg-primary-500/20"
          >
            Manage Trainers
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trainers.map((trainer) => (
            <div
              key={trainer.id}
              className="p-4 bg-gray-900 rounded-lg border border-gray-800 hover:border-primary-500/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-white">{trainer.name}</p>
                  <p className="text-xs text-gray-400">{trainer.email}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${
                    trainer.status === 'active'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                  }`}
                >
                  {trainer.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-gray-500">Total Classes</p>
                  <p className="text-lg font-bold text-white">{trainer.totalClasses}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Upcoming</p>
                  <p className="text-lg font-bold text-primary-400">{trainer.upcomingClasses}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Rating</p>
                  <p className="text-lg font-bold text-emerald-400">{trainer.rating}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="text-lg font-bold text-white capitalize">{trainer.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Edit Branch Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Branch"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Branch Name"
            value={editFormData.name}
            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
            placeholder="GymVerse Downtown"
          />
          <Input
            label="Address"
            value={editFormData.address}
            onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
            placeholder="123 Main Street"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              value={editFormData.city}
              onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
              placeholder="Bengaluru"
            />
            <Input
              label="State"
              value={editFormData.state}
              onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
              placeholder="Karnataka"
            />
          </div>
          <Input
            label="Zip Code"
            value={editFormData.zipCode}
            onChange={(e) => setEditFormData({ ...editFormData, zipCode: e.target.value })}
            placeholder="10001"
          />
          <Input
            label="Phone"
            type="tel"
            value={editFormData.phone}
            onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
          />
          <Input
            label="Email"
            type="email"
            value={editFormData.email}
            onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
            placeholder="branch@gymverse.com"
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              value={editFormData.status}
              onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as any })}
              className="input"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button fullWidth onClick={handleUpdateBranch}>
              Update Branch
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

