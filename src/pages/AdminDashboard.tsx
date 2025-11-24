import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { TrashIcon, ChevronDownIcon, BuildingOfficeIcon, MapPinIcon, UsersIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { useBranchStore } from '@/store/branchStore';

interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  membershipStatus: 'active' | 'expired' | 'pending' | 'cancelled';
  membershipPlan: string;
  membershipExpiresAt: string;
  feeStatus: 'paid' | 'overdue' | 'pending' | 'free';
  lastPaymentDate?: string;
  totalCheckIns: number;
  joinDate: string;
}

interface Trainer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalClasses: number;
  upcomingClasses: number;
  totalAttendees: number;
  averageAttendance: number;
  rating: number;
  status: 'active' | 'inactive';
}

export default function AdminDashboard() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { selectedBranch, branches, hasMultipleBranches, selectBranch } = useBranchStore();
  
  // Modals
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isAddTrainerModalOpen, setIsAddTrainerModalOpen] = useState(false);
  const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false);
  const [isEditTrainerModalOpen, setIsEditTrainerModalOpen] = useState(false);
  const [isDeleteMemberModalOpen, setIsDeleteMemberModalOpen] = useState(false);
  const [isBranchSelectModalOpen, setIsBranchSelectModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [deletingMember, setDeletingMember] = useState<Member | null>(null);
  
  // Form data
  const [exportType, setExportType] = useState<'classes' | 'members' | 'attendance'>('members');
  const [memberFormData, setMemberFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    membershipPlan: string;
    membershipStatus: 'active' | 'expired' | 'pending' | 'cancelled';
  }>({
    name: '',
    email: '',
    phone: '',
    membershipPlan: 'Basic',
    membershipStatus: 'active',
  });
  const [trainerFormData, setTrainerFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    status: 'active' | 'inactive';
  }>({
    name: '',
    email: '',
    phone: '',
    status: 'active',
  });
  
  // Data
  const [members, setMembers] = useState<Member[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired' | 'pending' | 'cancelled'>('all');
  const [filterMembership, setFilterMembership] = useState<'all' | 'Basic' | 'Premium' | 'Elite'>('all');
  const [sortBy, setSortBy] = useState<'joinDate' | 'expiryDate' | 'lastPayment' | 'name'>('joinDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');


  useEffect(() => {
    // Mock members data
    const mockMembers: Member[] = [
      {
        id: '1',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        phone: '+91 98765 43210',
        membershipStatus: 'active',
        membershipPlan: 'Premium',
        membershipExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        feeStatus: 'paid',
        lastPaymentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        totalCheckIns: 45,
        joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        name: 'Priya Patel',
        email: 'priya.patel@example.com',
        phone: '+91 98765 43211',
        membershipStatus: 'active',
        membershipPlan: 'Elite',
        membershipExpiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        feeStatus: 'overdue',
        lastPaymentDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
        totalCheckIns: 32,
        joinDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        name: 'Arjun Reddy',
        email: 'arjun.reddy@example.com',
        phone: '+91 98765 43212',
        membershipStatus: 'expired',
        membershipPlan: 'Basic',
        membershipExpiresAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        feeStatus: 'overdue',
        totalCheckIns: 18,
        joinDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        name: 'Ananya Iyer',
        email: 'ananya.iyer@example.com',
        phone: '+91 98765 43213',
        membershipStatus: 'active',
        membershipPlan: 'Premium',
        membershipExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        feeStatus: 'paid',
        lastPaymentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        totalCheckIns: 67,
        joinDate: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '5',
        name: 'Karthik Nair',
        email: 'karthik.nair@example.com',
        phone: '+91 98765 43214',
        membershipStatus: 'pending',
        membershipPlan: 'Basic',
        membershipExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        feeStatus: 'pending',
        totalCheckIns: 0,
        joinDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    setMembers(mockMembers);

    // Mock trainers data
    const mockTrainers: Trainer[] = [
      {
        id: 't1',
        name: 'Meera Krishnan',
        email: 'meera.krishnan@example.com',
        phone: '+91 98765 45670',
        totalClasses: 48,
        upcomingClasses: 12,
        totalAttendees: 456,
        averageAttendance: 9.5,
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
        totalAttendees: 312,
        averageAttendance: 8.7,
        rating: 4.6,
        status: 'active',
      },
      {
        id: 't3',
        name: 'Divya Menon',
        email: 'divya.menon@example.com',
        phone: '+91 98765 45672',
        totalClasses: 42,
        upcomingClasses: 10,
        totalAttendees: 389,
        averageAttendance: 9.3,
        rating: 4.9,
        status: 'active',
      },
    ];
    setTrainers(mockTrainers);
  }, []);

  const filteredMembers = members
    .filter((member) => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatusFilter = filterStatus === 'all' || member.membershipStatus === filterStatus;
      const matchesMembershipFilter = filterMembership === 'all' || member.membershipPlan === filterMembership;
      return matchesSearch && matchesStatusFilter && matchesMembershipFilter;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'joinDate':
          comparison = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
          break;
        case 'expiryDate':
          comparison = new Date(a.membershipExpiresAt).getTime() - new Date(b.membershipExpiresAt).getTime();
          break;
        case 'lastPayment':
          const aDate = a.lastPaymentDate ? new Date(a.lastPaymentDate).getTime() : 0;
          const bDate = b.lastPaymentDate ? new Date(b.lastPaymentDate).getTime() : 0;
          comparison = aDate - bDate;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'paid':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'expired':
      case 'overdue':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getMembershipPlanColor = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'premium':
        return '#E83C91'; // Pink
      case 'elite':
        return '#FAB12F'; // Gold
      case 'basic':
        return '#CBCBCB'; // Silver
      default:
        return '#9CA3AF'; // Default gray
    }
  };

  const handleAddMember = () => {
    const newMember: Member = {
      id: Date.now().toString(),
      ...memberFormData,
      membershipExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      feeStatus: memberFormData.membershipStatus === 'active' ? 'paid' : 'pending',
      totalCheckIns: 0,
      joinDate: new Date().toISOString(),
    };
    setMembers([...members, newMember]);
    setIsAddMemberModalOpen(false);
    setMemberFormData({ name: '', email: '', phone: '', membershipPlan: 'Basic', membershipStatus: 'active' });
    showToast({
      variant: 'success',
      title: 'Member added',
      description: `${newMember.name} has been added successfully`,
    });
  };

  const handleEditMember = (member: Member) => {
    setSelectedMember(member);
    setMemberFormData({
      name: member.name,
      email: member.email,
      phone: member.phone || '',
      membershipPlan: member.membershipPlan,
      membershipStatus: member.membershipStatus,
    });
    setIsEditMemberModalOpen(true);
  };

  const handleUpdateMember = () => {
    if (!selectedMember) return;
    setMembers(members.map((m) => (m.id === selectedMember.id ? { ...selectedMember, ...memberFormData } : m)));
    setIsEditMemberModalOpen(false);
    setSelectedMember(null);
    setMemberFormData({ name: '', email: '', phone: '', membershipPlan: 'Basic', membershipStatus: 'active' });
    showToast({
      variant: 'success',
      title: 'Member updated',
      description: 'Member information has been updated',
    });
  };

  const handleDeleteMember = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (member) {
      setDeletingMember(member);
      setIsDeleteMemberModalOpen(true);
    }
  };

  const confirmDeleteMember = () => {
    if (!deletingMember) return;
    const memberName = deletingMember.name;
    setMembers(members.filter((m) => m.id !== deletingMember.id));
    setIsDeleteMemberModalOpen(false);
    setDeletingMember(null);
    showToast({
      variant: 'success',
      title: 'Member removed',
      description: `${memberName} has been removed from the system`,
    });
  };

  const handleAddTrainer = () => {
    const newTrainer: Trainer = {
      id: `t${Date.now()}`,
      ...trainerFormData,
      totalClasses: 0,
      upcomingClasses: 0,
      totalAttendees: 0,
      averageAttendance: 0,
      rating: 0,
    };
    setTrainers([...trainers, newTrainer]);
    setIsAddTrainerModalOpen(false);
    setTrainerFormData({ name: '', email: '', phone: '', status: 'active' });
    showToast({
      variant: 'success',
      title: 'Trainer added',
      description: `${newTrainer.name} has been added successfully`,
    });
  };

  const handleEditTrainer = (trainer: Trainer) => {
    setSelectedTrainer(trainer);
    setTrainerFormData({
      name: trainer.name,
      email: trainer.email,
      phone: trainer.phone || '',
      status: trainer.status,
    });
    setIsEditTrainerModalOpen(true);
  };

  const handleUpdateTrainer = () => {
    if (!selectedTrainer) return;
    setTrainers(trainers.map((t) => (t.id === selectedTrainer.id ? { ...selectedTrainer, ...trainerFormData } : t)));
    setIsEditTrainerModalOpen(false);
    setSelectedTrainer(null);
    setTrainerFormData({ name: '', email: '', phone: '', status: 'active' });
    showToast({
      variant: 'success',
      title: 'Trainer updated',
      description: 'Trainer information has been updated',
    });
  };

  const handleDeleteTrainer = (trainerId: string) => {
    setTrainers(trainers.filter((t) => t.id !== trainerId));
    showToast({
      variant: 'success',
      title: 'Trainer removed',
      description: 'Trainer has been removed from the system',
    });
  };

  const handleExport = () => {
    showToast({
      variant: 'success',
      title: 'Export started',
      description: `Exporting ${exportType} data...`,
    });
    setIsExportModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-black text-white tracking-tight">Admin Control Panel</h1>
            {selectedBranch && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-500/20 border border-primary-500/30 rounded-lg">
                <BuildingOfficeIcon className="h-4 w-4 text-primary-400" />
                <span className="text-sm font-semibold text-primary-400">{selectedBranch.name}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <p className="text-gray-300 font-medium">Manage members, trainers, and operations</p>
            {selectedBranch && (
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <MapPinIcon className="h-4 w-4" />
                <span>{selectedBranch.city}, {selectedBranch.state}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {hasMultipleBranches() && (
            <Button 
              variant="outline" 
              onClick={() => setIsBranchSelectModalOpen(true)}
              className="bg-transparent border-secondary-500 text-secondary-400 hover:bg-secondary-500/20 hover:border-secondary-400 hover:text-secondary-300"
            >
              Switch Branch
            </Button>
          )}
          {hasMultipleBranches() && (
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/branches')}
              className="bg-transparent border-primary-500 text-primary-400 hover:bg-primary-500/20 hover:border-primary-400 hover:text-primary-300"
            >
              All Branches
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="bg-transparent border-primary-500 text-primary-400 hover:bg-primary-500/20 hover:border-primary-400 hover:text-primary-300"
          >
            View Dashboard
          </Button>
          <Button onClick={() => setIsExportModalOpen(true)}>Export Data</Button>
        </div>
      </div>


      {/* Members Management */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-white">Members Management</h2>
          <Button onClick={() => setIsAddMemberModalOpen(true)} className="w-full sm:w-auto">Add Member</Button>
        </div>
        
        {/* Search and Filter */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-3 flex-1">
            <div className="flex-1 relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                className="w-full px-3 py-2 pr-8 bg-[#0a0a0a] border border-gray-800 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-primary-500/50 focus:bg-gray-900 transition-colors appearance-none cursor-pointer hover:border-gray-700"
              >
                <option value="all" className="bg-[#0a0a0a]">All Status</option>
                <option value="active" className="bg-[#0a0a0a]">Active</option>
                <option value="expired" className="bg-[#0a0a0a]">Expired</option>
                <option value="pending" className="bg-[#0a0a0a]">Pending</option>
                <option value="cancelled" className="bg-[#0a0a0a]">Cancelled</option>
              </select>
              <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="flex-1 relative">
              <select
                value={filterMembership}
                onChange={(e) => setFilterMembership(e.target.value as typeof filterMembership)}
                className="w-full px-3 py-2 pr-8 bg-[#0a0a0a] border border-gray-800 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-primary-500/50 focus:bg-gray-900 transition-colors appearance-none cursor-pointer hover:border-gray-700"
              >
                <option value="all" className="bg-[#0a0a0a]">All Plans</option>
                <option value="Basic" className="bg-[#0a0a0a]">Basic</option>
                <option value="Premium" className="bg-[#0a0a0a]">Premium</option>
                <option value="Elite" className="bg-[#0a0a0a]">Elite</option>
              </select>
              <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="flex-1 relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-full px-3 py-2 pr-8 bg-[#0a0a0a] border border-gray-800 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-primary-500/50 focus:bg-gray-900 transition-colors appearance-none cursor-pointer hover:border-gray-700"
              >
                <option value="joinDate" className="bg-[#0a0a0a]">Join Date</option>
                <option value="expiryDate" className="bg-[#0a0a0a]">Expiry Date</option>
                <option value="lastPayment" className="bg-[#0a0a0a]">Last Payment</option>
                <option value="name" className="bg-[#0a0a0a]">Name</option>
              </select>
              <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
                className="w-full px-3 py-2 pr-8 bg-[#0a0a0a] border border-gray-800 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-primary-500/50 focus:bg-gray-900 transition-colors appearance-none cursor-pointer hover:border-gray-700 min-w-[120px]"
              >
                <option value="desc" className="bg-[#0a0a0a]">Newest</option>
                <option value="asc" className="bg-[#0a0a0a]">Oldest</option>
              </select>
              <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  Member
                </th>
                <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  Membership
                </th>
                <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  Fee Status
                </th>
                <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  Check-ins
                </th>
                <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-900/50 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium text-white">{member.name}</p>
                      <p className="text-xs text-gray-400">{member.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getMembershipPlanColor(member.membershipPlan) }}
                        />
                        <p className="text-sm text-white">{member.membershipPlan}</p>
                      </div>
                      <p className="text-xs text-gray-400">
                        Expires: {format(new Date(member.membershipExpiresAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                        member.membershipStatus
                      )}`}
                    >
                      {member.membershipStatus.charAt(0).toUpperCase() + member.membershipStatus.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                        member.feeStatus
                      )}`}
                    >
                      {member.feeStatus.charAt(0).toUpperCase() + member.feeStatus.slice(1)}
                    </span>
                    {member.lastPaymentDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Last: {format(new Date(member.lastPaymentDate), 'MMM dd')}
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-white">{member.totalCheckIns}</p>
                    <p className="text-xs text-gray-400">total visits</p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditMember(member)}
                        className="bg-primary-500/40 border-primary-400 text-primary-100 hover:bg-primary-500/50 hover:border-primary-300 hover:text-white transition-all duration-200"
                      >
                        Edit
                      </Button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete member"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Trainers Management */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Trainers Management</h2>
          <Button onClick={() => setIsAddTrainerModalOpen(true)}>Add Trainer</Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {trainers.map((trainer) => (
            <div
              key={trainer.id}
              className="p-4 bg-gray-900 rounded-lg border border-gray-800"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-white">{trainer.name}</p>
                  <p className="text-xs text-gray-400">{trainer.email}</p>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
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
                  <p className="text-xs text-gray-500">Total Attendees</p>
                  <p className="text-lg font-bold text-white">{trainer.totalAttendees}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Avg Attendance</p>
                  <p className="text-lg font-bold text-emerald-400">{trainer.averageAttendance}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  fullWidth 
                  onClick={() => handleEditTrainer(trainer)}
                  className="bg-primary-500/40 border-primary-400 text-white hover:bg-primary-500/50 hover:border-primary-300 transition-all duration-200"
                >
                  Edit
                </Button>
                <button
                  onClick={() => handleDeleteTrainer(trainer.id)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors border border-gray-700 hover:border-red-500/30"
                  title="Delete trainer"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
        ))}
      </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card hover className="cursor-pointer" onClick={() => navigate('/classes')}>
          <h3 className="font-semibold text-white mb-2">Manage Classes</h3>
          <p className="text-sm text-gray-400 mb-4">
            Create, edit, and manage class schedules
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            fullWidth
            className="bg-transparent border border-primary-500 text-[#B475FF] hover:bg-primary-500/20 hover:border-primary-400 hover:text-white transition-all duration-200"
          >
            Manage
          </Button>
        </Card>

        <Card hover className="cursor-pointer">
          <h3 className="font-semibold text-white mb-2">Manage Plans</h3>
          <p className="text-sm text-gray-400 mb-4">
            Update membership plans and pricing
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            fullWidth
            onClick={() => navigate('/plans')}
            className="bg-transparent border border-primary-500 text-[#B475FF] hover:bg-primary-500/20 hover:border-primary-400 hover:text-white transition-all duration-200"
          >
            Manage
          </Button>
        </Card>

        <Card hover className="cursor-pointer" onClick={() => navigate('/store')}>
          <h3 className="font-semibold text-white mb-2">Manage Products</h3>
          <p className="text-sm text-gray-400 mb-4">
            Update store inventory and products
          </p>
          <Button
            variant="outline" 
            size="sm" 
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              navigate('/store');
            }}
            className="bg-transparent border border-primary-500 text-[#B475FF] hover:bg-primary-500/20 hover:border-primary-400 hover:text-white transition-all duration-200"
          >
            Manage
          </Button>
        </Card>
      </div>

      {/* Add Member Modal */}
      <Modal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        title="Add New Member"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={memberFormData.name}
            onChange={(e) => setMemberFormData({ ...memberFormData, name: e.target.value })}
            placeholder="Rahul Sharma"
          />
          <Input
            label="Email"
            type="email"
            value={memberFormData.email}
            onChange={(e) => setMemberFormData({ ...memberFormData, email: e.target.value })}
            placeholder="rahul.sharma@example.com"
          />
          <Input
            label="Phone"
            type="tel"
            value={memberFormData.phone}
            onChange={(e) => setMemberFormData({ ...memberFormData, phone: e.target.value })}
            placeholder="+91 98765 43210"
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Membership Plan</label>
            <select
              value={memberFormData.membershipPlan}
              onChange={(e) => setMemberFormData({ ...memberFormData, membershipPlan: e.target.value })}
              className="input"
            >
              <option value="Basic">Basic</option>
              <option value="Premium">Premium</option>
              <option value="Elite">Elite</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              value={memberFormData.membershipStatus}
              onChange={(e) => setMemberFormData({ ...memberFormData, membershipStatus: e.target.value as any })}
              className="input"
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" fullWidth onClick={() => setIsAddMemberModalOpen(false)}>
              Cancel
            </Button>
            <Button fullWidth onClick={handleAddMember}>
              Add Member
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Member Modal */}
      <Modal
        isOpen={isEditMemberModalOpen}
        onClose={() => {
          setIsEditMemberModalOpen(false);
          setSelectedMember(null);
        }}
        title="Edit Member"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={memberFormData.name}
            onChange={(e) => setMemberFormData({ ...memberFormData, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={memberFormData.email}
            onChange={(e) => setMemberFormData({ ...memberFormData, email: e.target.value })}
          />
          <Input
            label="Phone"
            type="tel"
            value={memberFormData.phone}
            onChange={(e) => setMemberFormData({ ...memberFormData, phone: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Membership Plan</label>
            <select
              value={memberFormData.membershipPlan}
              onChange={(e) => setMemberFormData({ ...memberFormData, membershipPlan: e.target.value })}
              className="input"
            >
              <option value="Basic">Basic</option>
              <option value="Premium">Premium</option>
              <option value="Elite">Elite</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              value={memberFormData.membershipStatus}
              onChange={(e) => setMemberFormData({ ...memberFormData, membershipStatus: e.target.value as any })}
              className="input"
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                setIsEditMemberModalOpen(false);
                setSelectedMember(null);
              }}
            >
              Cancel
            </Button>
            <Button fullWidth onClick={handleUpdateMember}>
              Update Member
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Trainer Modal */}
      <Modal
        isOpen={isAddTrainerModalOpen}
        onClose={() => setIsAddTrainerModalOpen(false)}
        title="Add New Trainer"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={trainerFormData.name}
            onChange={(e) => setTrainerFormData({ ...trainerFormData, name: e.target.value })}
            placeholder="Meera Krishnan"
          />
          <Input
            label="Email"
            type="email"
            value={trainerFormData.email}
            onChange={(e) => setTrainerFormData({ ...trainerFormData, email: e.target.value })}
            placeholder="meera.krishnan@example.com"
          />
          <Input
            label="Phone"
            type="tel"
            value={trainerFormData.phone}
            onChange={(e) => setTrainerFormData({ ...trainerFormData, phone: e.target.value })}
            placeholder="+91 98765 43210"
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              value={trainerFormData.status}
              onChange={(e) => setTrainerFormData({ ...trainerFormData, status: e.target.value as any })}
              className="input"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" fullWidth onClick={() => setIsAddTrainerModalOpen(false)}>
              Cancel
            </Button>
            <Button fullWidth onClick={handleAddTrainer}>
              Add Trainer
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Trainer Modal */}
      <Modal
        isOpen={isEditTrainerModalOpen}
        onClose={() => {
          setIsEditTrainerModalOpen(false);
          setSelectedTrainer(null);
        }}
        title="Edit Trainer"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={trainerFormData.name}
            onChange={(e) => setTrainerFormData({ ...trainerFormData, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={trainerFormData.email}
            onChange={(e) => setTrainerFormData({ ...trainerFormData, email: e.target.value })}
          />
          <Input
            label="Phone"
            type="tel"
            value={trainerFormData.phone}
            onChange={(e) => setTrainerFormData({ ...trainerFormData, phone: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              value={trainerFormData.status}
              onChange={(e) => setTrainerFormData({ ...trainerFormData, status: e.target.value as any })}
              className="input"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                setIsEditTrainerModalOpen(false);
                setSelectedTrainer(null);
              }}
            >
              Cancel
            </Button>
            <Button fullWidth onClick={handleUpdateTrainer}>
              Update Trainer
            </Button>
            </div>
        </div>
      </Modal>

      {/* Export Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Data"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Export Type
            </label>
            <select
              value={exportType}
              onChange={(e) => setExportType(e.target.value as typeof exportType)}
              className="input"
            >
              <option value="members">Members</option>
              <option value="classes">Classes</option>
              <option value="attendance">Attendance</option>
            </select>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setIsExportModalOpen(false)}
            >
              Cancel
            </Button>
            <Button fullWidth onClick={handleExport}>
              Export CSV
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Member Confirmation Modal */}
      <Modal
        isOpen={isDeleteMemberModalOpen}
        onClose={() => {
          setIsDeleteMemberModalOpen(false);
          setDeletingMember(null);
        }}
        title="Delete Member"
        size="md"
      >
        {deletingMember && (
          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400 font-semibold mb-2">Warning: This action cannot be undone</p>
              <p className="text-gray-300 text-sm">
                Are you sure you want to delete <span className="font-semibold text-white">{deletingMember.name}</span>?
              </p>
              <div className="mt-3 space-y-1 text-sm text-gray-400">
                <p>• Email: {deletingMember.email}</p>
                <p>• Membership: {deletingMember.membershipPlan}</p>
                <p>• Status: {deletingMember.membershipStatus}</p>
                {deletingMember.totalCheckIns > 0 && (
                  <p className="text-yellow-400">
                    • This member has {deletingMember.totalCheckIns} check-ins recorded.
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setIsDeleteMemberModalOpen(false);
                  setDeletingMember(null);
                }}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                onClick={confirmDeleteMember}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Delete Member
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Branch Selection Modal */}
      <Modal
        isOpen={isBranchSelectModalOpen}
        onClose={() => setIsBranchSelectModalOpen(false)}
        title="Switch Branch"
        size="lg"
      >
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-300 font-medium">
              Choose a branch to manage
            </p>
          </div>

          <div className="flex justify-center mb-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsBranchSelectModalOpen(false);
                navigate('/admin/branches');
              }}
              className="bg-transparent border-primary-500 text-primary-400 hover:bg-primary-500/20 hover:border-primary-400 hover:text-primary-300"
            >
              View All Branches Dashboard
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 max-h-[60vh] overflow-y-auto">
            {branches.map((branch) => (
              <Card
                key={branch.id}
                hover
                className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary-500/20"
                onClick={() => {
                  selectBranch(branch);
                  setIsBranchSelectModalOpen(false);
                  showToast({
                    variant: 'success',
                    title: 'Branch switched',
                    description: `Switched to ${branch.name}`,
                  });
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary-500/20 rounded-lg border border-primary-500/30">
                        <BuildingOfficeIcon className="h-6 w-6 text-primary-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{branch.name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPinIcon className="h-4 w-4 text-gray-400" />
                          <p className="text-sm text-gray-400">{branch.city}, {branch.state}</p>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
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

                  <div className="pt-4 border-t border-gray-800">
                    <p className="text-sm text-gray-400 mb-1">{branch.address}</p>
                    {branch.phone && (
                      <p className="text-sm text-gray-400">{branch.phone}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-800">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <UsersIcon className="h-4 w-4 text-primary-400" />
                        <p className="text-xs text-gray-500">Members</p>
                      </div>
                      <p className="text-lg font-bold text-white">{branch.totalMembers}</p>
                      <p className="text-xs text-emerald-400">{branch.activeMembers} active</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <UserGroupIcon className="h-4 w-4 text-secondary-400" />
                        <p className="text-xs text-gray-500">Trainers</p>
                      </div>
                      <p className="text-lg font-bold text-white">{branch.totalTrainers}</p>
                    </div>
                    <div className="flex items-center justify-center">
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectBranch(branch);
                          setIsBranchSelectModalOpen(false);
                          showToast({
                            variant: 'success',
                            title: 'Branch switched',
                            description: `Switched to ${branch.name}`,
                          });
                        }}
                        className="w-full bg-primary-500 hover:bg-primary-600 text-white"
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
