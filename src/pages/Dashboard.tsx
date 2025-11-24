import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format, startOfWeek, addDays, isSameDay, isToday, isTomorrow } from 'date-fns';
import { useAuthStore } from '@/store/authStore';
import { useBranchStore } from '@/store/branchStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { useToast } from '@/components/ui/Toast';
import { CalendarIcon, UserGroupIcon, ChartBarIcon, ClockIcon, BuildingOfficeIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/outline';
import type { Slot } from '@/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from 'recharts';

interface Member {
  id: string;
  name: string;
  email: string;
  membershipStatus: 'active' | 'expired' | 'pending' | 'cancelled';
  membershipPlan: string;
  membershipExpiresAt: string;
  feeStatus: 'paid' | 'overdue' | 'pending';
  lastPaymentDate?: string;
  totalCheckIns: number;
  joinDate: string;
}

interface Trainer {
  id: string;
  name: string;
  email: string;
  totalClasses: number;
  upcomingClasses: number;
  totalAttendees: number;
  averageAttendance: number;
  rating: number;
}

interface AttendanceData {
  date: string;
  checkIns: number;
  day: string;
}

interface RevenueData {
  month: string;
  revenue: number;
  memberships: number;
  products: number;
}

// Admin Dashboard Component - Stats and Analytics
function AdminDashboardView() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { selectedBranch, branches, hasMultipleBranches, selectBranch } = useBranchStore();
  const [members, setMembers] = useState<Member[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [isBranchSelectModalOpen, setIsBranchSelectModalOpen] = useState(false);

  useEffect(() => {
    // Mock members data
    const mockMembers: Member[] = [
      {
        id: '1',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
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
        membershipStatus: 'pending',
        membershipPlan: 'Basic',
        membershipExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        feeStatus: 'pending',
        totalCheckIns: 0,
        joinDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '6',
        name: 'Sneha Desai',
        email: 'sneha.desai@example.com',
        membershipStatus: 'active',
        membershipPlan: 'Premium',
        membershipExpiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        feeStatus: 'paid',
        lastPaymentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        totalCheckIns: 52,
        joinDate: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '7',
        name: 'Rohan Malhotra',
        email: 'rohan.malhotra@example.com',
        membershipStatus: 'active',
        membershipPlan: 'Elite',
        membershipExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        feeStatus: 'paid',
        lastPaymentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        totalCheckIns: 89,
        joinDate: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '8',
        name: 'Kavya Rao',
        email: 'kavya.rao@example.com',
        membershipStatus: 'active',
        membershipPlan: 'Basic',
        membershipExpiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        feeStatus: 'paid',
        lastPaymentDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        totalCheckIns: 28,
        joinDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '9',
        name: 'Aditya Joshi',
        email: 'aditya.joshi@example.com',
        membershipStatus: 'active',
        membershipPlan: 'Premium',
        membershipExpiresAt: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
        feeStatus: 'paid',
        lastPaymentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        totalCheckIns: 41,
        joinDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '10',
        name: 'Meera Nair',
        email: 'meera.nair@example.com',
        membershipStatus: 'expired',
        membershipPlan: 'Basic',
        membershipExpiresAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        feeStatus: 'overdue',
        totalCheckIns: 15,
        joinDate: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '11',
        name: 'Vikram Shetty',
        email: 'vikram.shetty@example.com',
        membershipStatus: 'active',
        membershipPlan: 'Elite',
        membershipExpiresAt: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
        feeStatus: 'paid',
        lastPaymentDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        totalCheckIns: 76,
        joinDate: new Date(Date.now() - 250 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '12',
        name: 'Pooja Iyer',
        email: 'pooja.iyer@example.com',
        membershipStatus: 'active',
        membershipPlan: 'Premium',
        membershipExpiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        feeStatus: 'paid',
        lastPaymentDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        totalCheckIns: 33,
        joinDate: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '13',
        name: 'Suresh Kumar',
        email: 'suresh.kumar@example.com',
        membershipStatus: 'pending',
        membershipPlan: 'Basic',
        membershipExpiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        feeStatus: 'pending',
        totalCheckIns: 0,
        joinDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '14',
        name: 'Anjali Reddy',
        email: 'anjali.reddy@example.com',
        membershipStatus: 'active',
        membershipPlan: 'Premium',
        membershipExpiresAt: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
        feeStatus: 'paid',
        lastPaymentDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        totalCheckIns: 58,
        joinDate: new Date(Date.now() - 130 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '15',
        name: 'Rajesh Patel',
        email: 'rajesh.patel@example.com',
        membershipStatus: 'active',
        membershipPlan: 'Elite',
        membershipExpiresAt: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000).toISOString(),
        feeStatus: 'paid',
        lastPaymentDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        totalCheckIns: 94,
        joinDate: new Date(Date.now() - 280 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '16',
        name: 'Divya Menon',
        email: 'divya.menon@example.com',
        membershipStatus: 'active',
        membershipPlan: 'Basic',
        membershipExpiresAt: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
        feeStatus: 'paid',
        lastPaymentDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        totalCheckIns: 24,
        joinDate: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '17',
        name: 'Amit Shah',
        email: 'amit.shah@example.com',
        membershipStatus: 'expired',
        membershipPlan: 'Premium',
        membershipExpiresAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        feeStatus: 'overdue',
        totalCheckIns: 37,
        joinDate: new Date(Date.now() - 170 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '18',
        name: 'Neha Gupta',
        email: 'neha.gupta@example.com',
        membershipStatus: 'active',
        membershipPlan: 'Premium',
        membershipExpiresAt: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
        feeStatus: 'paid',
        lastPaymentDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        totalCheckIns: 49,
        joinDate: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '19',
        name: 'Ravi Verma',
        email: 'ravi.verma@example.com',
        membershipStatus: 'active',
        membershipPlan: 'Elite',
        membershipExpiresAt: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
        feeStatus: 'paid',
        lastPaymentDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
        totalCheckIns: 82,
        joinDate: new Date(Date.now() - 220 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '20',
        name: 'Shreya Kapoor',
        email: 'shreya.kapoor@example.com',
        membershipStatus: 'active',
        membershipPlan: 'Basic',
        membershipExpiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        feeStatus: 'paid',
        lastPaymentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        totalCheckIns: 19,
        joinDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    setMembers(mockMembers);

    // Mock trainers data
    const mockTrainers: Trainer[] = [
      {
        id: 't1',
        name: 'Meera Krishnan',
        email: 'meera.krishnan@example.com',
        totalClasses: 48,
        upcomingClasses: 12,
        totalAttendees: 456,
        averageAttendance: 9.5,
        rating: 4.8,
      },
      {
        id: 't2',
        name: 'Vikram Singh',
        email: 'vikram.singh@example.com',
        totalClasses: 36,
        upcomingClasses: 8,
        totalAttendees: 312,
        averageAttendance: 8.7,
        rating: 4.6,
      },
      {
        id: 't3',
        name: 'Divya Menon',
        email: 'divya.menon@example.com',
        totalClasses: 42,
        upcomingClasses: 10,
        totalAttendees: 389,
        averageAttendance: 9.3,
        rating: 4.9,
      },
    ];
    setTrainers(mockTrainers);

    // Mock attendance data
    const generateAttendanceData = (days: number): AttendanceData[] => {
      const data: AttendanceData[] = [];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
          date: format(date, 'MMM dd'),
          checkIns: Math.floor(Math.random() * 50) + 20,
          day: dayNames[date.getDay()],
        });
      }
      return data;
    };
    setAttendanceData(generateAttendanceData(selectedDateRange === '7d' ? 7 : selectedDateRange === '30d' ? 30 : 90));

    // Mock revenue data (in Indian Rupees)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mockRevenue: RevenueData[] = months.slice(-6).map((month) => ({
      month,
      revenue: Math.floor(Math.random() * 200000) + 300000, // ₹3-5 lakhs
      memberships: Math.floor(Math.random() * 100000) + 200000, // ₹2-3 lakhs
      products: Math.floor(Math.random() * 50000) + 50000, // ₹50k-1 lakh
    }));
    setRevenueData(mockRevenue);
  }, [selectedDateRange]);

  const metrics = [
    {
      label: 'Total Members',
      value: members.length.toString(),
      change: '+12%',
      positive: true,
      detail: `${members.filter((m) => m.membershipStatus === 'active').length} active`,
    },
    {
      label: 'Active Trainers',
      value: trainers.length.toString(),
      change: '+2',
      positive: true,
      detail: `${trainers.reduce((sum, t) => sum + t.upcomingClasses, 0)} upcoming classes`,
    },
    {
      label: 'Today\'s Check-ins',
      value: attendanceData[attendanceData.length - 1]?.checkIns.toString() || '0',
      change: '+8%',
      positive: true,
      detail: 'vs yesterday',
    },
    {
      label: 'Monthly Revenue',
      value: `₹${revenueData[revenueData.length - 1]?.revenue.toLocaleString('en-IN') || '0'}`,
      change: '+15%',
      positive: true,
      detail: 'vs last month',
    },
  ];

  const membershipDistribution = [
    { name: 'Active', value: members.filter((m) => m.membershipStatus === 'active').length, color: '#10B981' },
    { name: 'Expired', value: members.filter((m) => m.membershipStatus === 'expired').length, color: '#EF4444' },
    { name: 'Pending', value: members.filter((m) => m.membershipStatus === 'pending').length, color: '#F59E0B' },
    { name: 'Cancelled', value: members.filter((m) => m.membershipStatus === 'cancelled').length, color: '#6B7280' },
  ];

  const weeklyAttendance = attendanceData.reduce((acc, data) => {
    if (!acc[data.day]) acc[data.day] = 0;
    acc[data.day] += data.checkIns;
    return acc;
  }, {} as { [key: string]: number });

  const weeklyData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => ({
    day,
    checkIns: weeklyAttendance[day] || 0,
  }));

  const totalRevenue = revenueData.reduce((sum, r) => sum + r.revenue, 0);
  const totalMemberships = revenueData.reduce((sum, r) => sum + r.memberships, 0);
  const totalProducts = revenueData.reduce((sum, r) => sum + r.products, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-white">
              Admin Dashboard
            </h1>
            {selectedBranch && (
              <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 bg-primary-500/20 border border-primary-500/30 rounded-lg w-fit">
                <BuildingOfficeIcon className="h-4 w-4 text-primary-400" />
                <span className="text-xs sm:text-sm font-semibold text-primary-400 truncate max-w-[200px] sm:max-w-none">{selectedBranch.name}</span>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <p className="text-sm sm:text-base text-gray-300">
              Overview of your gym operations and analytics
            </p>
            {selectedBranch && (
              <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-400">
                <MapPinIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{selectedBranch.city}, {selectedBranch.state}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {hasMultipleBranches() && (
            <Button 
              variant="outline" 
              onClick={() => setIsBranchSelectModalOpen(true)}
              className="bg-transparent border-secondary-500 text-secondary-400 hover:bg-secondary-500/20 hover:border-secondary-400 hover:text-secondary-300 text-xs sm:text-sm px-3 sm:px-4"
            >
              Switch Branch
            </Button>
          )}
          {hasMultipleBranches() && (
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/branches')}
              className="bg-transparent border-primary-500 text-primary-400 hover:bg-primary-500/20 hover:border-primary-400 hover:text-primary-300 text-xs sm:text-sm px-3 sm:px-4"
            >
              All Branches
            </Button>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <p className="text-sm text-gray-400 mb-1">{metric.label}</p>
            <p className="text-2xl font-bold text-white">{metric.value}</p>
            <p className="text-xs text-gray-500 mt-1">{metric.detail}</p>
            <p
              className={`text-sm mt-2 ${
                metric.positive ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {metric.change}
            </p>
          </Card>
        ))}
      </div>

      {/* Members Management Overview */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-white">Members Management</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/admin')}
            className="bg-primary-500/20 !text-[#b475ff] border-primary-500 hover:bg-transparent hover:border-primary-500/50 hover:text-white w-full sm:w-auto"
          >
            Manage
          </Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Membership Status Distribution */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Membership Status</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={membershipDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {membershipDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              {membershipDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-gray-400">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fee Status Overview */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Fee Status</h3>
            <div className="space-y-3">
              <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Paid</span>
                  <span className="text-lg font-bold text-emerald-400">
                    {members.filter((m) => m.feeStatus === 'paid').length}
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{
                      width: `${(members.filter((m) => m.feeStatus === 'paid').length / members.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Overdue</span>
                  <span className="text-lg font-bold text-red-400">
                    {members.filter((m) => m.feeStatus === 'overdue').length}
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{
                      width: `${(members.filter((m) => m.feeStatus === 'overdue').length / members.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Pending</span>
                  <span className="text-lg font-bold text-yellow-400">
                    {members.filter((m) => m.feeStatus === 'pending').length}
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{
                      width: `${(members.filter((m) => m.feeStatus === 'pending').length / members.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Trainers Overview */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-white">Trainers Overview</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/admin')}
            className="bg-primary-500/20 text-[#B475FF] border-primary-500 hover:bg-transparent hover:border-primary-500/50 hover:text-white w-full sm:w-auto"
          >
            Manage
          </Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {trainers.map((trainer) => (
            <div
              key={trainer.id}
              className="p-4 bg-gray-900 rounded-lg border border-gray-800"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-white">{trainer.name}</p>
                  <p className="text-xs text-gray-400">{trainer.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Rating</p>
                  <p className="text-sm font-bold text-primary-400">{trainer.rating} ⭐</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
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
            </div>
          ))}
        </div>
      </Card>

      {/* Attendance Analytics */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-white">Attendance Analytics</h2>
          <div className="flex gap-2">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedDateRange(range)}
                className={`
                  px-3 py-1 rounded-lg text-xs font-semibold transition-all
                  ${
                    selectedDateRange === range
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }
                `}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        <div className="h-64 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={attendanceData}>
              <defs>
                <linearGradient id="colorCheckIns" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7A33FF" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#7A33FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Area
                type="monotone"
                dataKey="checkIns"
                stroke="#7A33FF"
                fillOpacity={1}
                fill="url(#colorCheckIns)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-white mb-3">Weekly Pattern</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="checkIns" fill="#00D9FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      {/* Revenue Analytics */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-white">Revenue Analytics</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/admin')}
            className="bg-primary-500/20 text-[#B475FF] border-primary-500 hover:bg-transparent hover:border-primary-500/50 hover:text-white w-full sm:w-auto"
          >
            View Details
          </Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-3 mb-4">
          <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
            <p className="text-sm text-gray-400 mb-1">Total Revenue (6 months)</p>
            <p className="text-2xl font-bold text-white">₹{totalRevenue.toLocaleString('en-IN')}</p>
            <p className="text-xs text-emerald-400 mt-1">+15% vs previous period</p>
          </div>
          <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
            <p className="text-sm text-gray-400 mb-1">Memberships</p>
            <p className="text-2xl font-bold text-primary-400">₹{totalMemberships.toLocaleString('en-IN')}</p>
            <p className="text-xs text-gray-500 mt-1">Primary revenue source</p>
          </div>
          <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
            <p className="text-sm text-gray-400 mb-1">Products</p>
            <p className="text-2xl font-bold text-secondary-400">₹{totalProducts.toLocaleString('en-IN')}</p>
            <p className="text-xs text-gray-500 mt-1">Store sales</p>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#00D9FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMemberships" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7A33FF" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#7A33FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
              <YAxis 
                stroke="#9CA3AF" 
                fontSize={12}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
                formatter={(value: number, name: string) => {
                  if (name === 'Total Revenue' || name === 'Memberships' || name === 'Products') {
                    return [`₹${value.toLocaleString('en-IN')}`, name];
                  }
                  return [value, name];
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#00D9FF"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Total Revenue"
              />
              <Area
                type="monotone"
                dataKey="memberships"
                stroke="#7A33FF"
                fillOpacity={1}
                fill="url(#colorMemberships)"
                name="Memberships"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

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

// Trainer Analytics Dashboard Component
function TrainerDashboardView() {
  const { user } = useAuthStore();
  const [classSchedule, setClassSchedule] = useState<Slot[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<
    Array<{ date: string; attendance: number; day: string }>
  >([]);

  useEffect(() => {
    // Mock classes for trainer
    const mockClasses: Slot[] = [
      {
        id: '1',
        type: 'Yoga Flow',
        trainerId: user?.id || 't1',
        trainerName: user?.name || 'Trainer',
        capacity: 20,
        booked: 18,
        waitlist: 2,
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
        location: 'Studio A',
        description: 'Morning flexibility session',
      },
      {
        id: '2',
        type: 'Pilates Core',
        trainerId: user?.id || 't1',
        trainerName: user?.name || 'Trainer',
        capacity: 15,
        booked: 11,
        waitlist: 0,
        startTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString(),
        location: 'Studio B',
        description: 'Core strengthening & control',
      },
      {
        id: '3',
        type: 'HIIT Power',
        trainerId: user?.id || 't1',
        trainerName: user?.name || 'Trainer',
        capacity: 20,
        booked: 16,
        waitlist: 1,
        startTime: addDays(new Date(), 1).toISOString(),
        endTime: addDays(new Date(), 1).toISOString(),
        location: 'Arena',
        description: 'High intensity cardio blast',
      },
      {
        id: '4',
        type: 'Strength Lab',
        trainerId: user?.id || 't1',
        trainerName: user?.name || 'Trainer',
        capacity: 18,
        booked: 12,
        waitlist: 0,
        startTime: addDays(new Date(), 2).toISOString(),
        endTime: addDays(new Date(), 2).toISOString(),
        location: 'Strength Zone',
        description: 'Compound lifts & form work',
      },
    ];
    setClassSchedule(mockClasses);

    const stats: Array<{ date: string; attendance: number; day: string }> = [];
    for (let i = 6; i >= 0; i--) {
      const date = addDays(new Date(), -i);
      stats.push({
        date: format(date, 'MMM dd'),
        attendance: Math.floor(Math.random() * 12) + 8,
        day: format(date, 'EEE'),
      });
    }
    setAttendanceStats(stats);
  }, [user]);

  const todayClasses = useMemo(
    () => classSchedule.filter((slot) => isToday(new Date(slot.startTime))),
    [classSchedule],
  );

  const upcomingClasses = useMemo(() => {
    const today = new Date();
    const nextWeek = addDays(today, 7);
    return classSchedule
      .filter((slot) => {
        const slotDate = new Date(slot.startTime);
        return slotDate > today && slotDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [classSchedule]);

  const stats = useMemo(() => {
    const totalBookings = classSchedule.reduce((sum, slot) => sum + slot.booked, 0);
    const totalCapacity = classSchedule.reduce((sum, slot) => sum + slot.capacity, 0);
    const avgAttendance = totalCapacity ? Math.round((totalBookings / totalCapacity) * 100) : 0;
    const totalWaitlist = classSchedule.reduce((sum, slot) => sum + (slot.waitlist || 0), 0);

    return {
      todayClasses: todayClasses.length,
      upcomingClasses: upcomingClasses.length,
      totalBookings,
      avgAttendance,
      totalWaitlist,
    };
  }, [classSchedule, todayClasses, upcomingClasses]);

  const classTypeData = useMemo(() => {
    const typeTotals: Record<
      string,
      { total: number; capacity: number; utilization: number }
    > = {};

    classSchedule.forEach((slot) => {
      if (!typeTotals[slot.type]) {
        typeTotals[slot.type] = { total: 0, capacity: 0, utilization: 0 };
      }
      typeTotals[slot.type].total += slot.booked;
      typeTotals[slot.type].capacity += slot.capacity;
      typeTotals[slot.type].utilization =
        Math.round((typeTotals[slot.type].total / typeTotals[slot.type].capacity) * 100) || 0;
    });

    return Object.entries(typeTotals).map(([type, value]) => ({
      type,
      bookings: value.total,
      utilization: value.utilization,
    }));
  }, [classSchedule]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-white">
          Trainer Overview
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-300">
          Insights and performance for your upcoming classes
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#0a0a0a] border border-[#252525]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Today's Classes</p>
              <p className="text-2xl font-bold text-white">{stats.todayClasses}</p>
            </div>
            <CalendarIcon className="h-8 w-8 text-primary-400" />
          </div>
        </Card>
        <Card className="bg-[#0a0a0a] border border-[#252525]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Next 7 Days</p>
              <p className="text-2xl font-bold text-primary-400">{stats.upcomingClasses}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-primary-400" />
          </div>
        </Card>
        <Card className="bg-[#0a0a0a] border border-[#252525]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Bookings</p>
              <p className="text-2xl font-bold text-secondary-400">{stats.totalBookings}</p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-secondary-400" />
          </div>
        </Card>
        <Card className="bg-[#0a0a0a] border border-[#252525]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Avg Attendance</p>
              <p className="text-2xl font-bold text-emerald-400">{stats.avgAttendance}%</p>
            </div>
            <ChartBarIcon className="h-8 w-8 text-emerald-400" />
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 bg-[#0a0a0a] border border-[#252525]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                Attendance Trend (Last 7 Days)
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Monitor how many members attend your sessions
              </p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#00D9FF"
                  strokeWidth={2}
                  dot={{ fill: '#00D9FF', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="bg-[#0a0a0a] border border-[#252525]">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white">
              Class Performance
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Average utilization per class type
            </p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="type"
                  stroke="#9CA3AF"
                  fontSize={11}
                  tickFormatter={(value) => value.split(' ')[0]}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value: number) => [`${value}%`, 'Utilization']}
                />
                <Bar dataKey="utilization" fill="#FF6B35" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="bg-[#0a0a0a] border border-[#252525]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-white">Today's Schedule</h2>
          <Button variant="ghost" size="sm" className="w-full sm:w-auto">
            Export
          </Button>
        </div>
        {todayClasses.length === 0 ? (
          <p className="text-gray-400 text-center py-6">No classes scheduled for today</p>
        ) : (
          <div className="space-y-4">
            {todayClasses.map((slot) => {
              const utilization = Math.round((slot.booked / slot.capacity) * 100);
              const spotsLeft = slot.capacity - slot.booked;
              return (
                <div
                  key={slot.id}
                  className="p-4 rounded-2xl border border-[#252525] bg-[#141414] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">{slot.type}</h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${
                          utilization >= 90
                            ? 'bg-red-500/10 text-red-400 border-red-500/30'
                            : utilization >= 70
                              ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {utilization}% full
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {format(new Date(slot.startTime), 'HH:mm')} – {format(new Date(slot.endTime), 'HH:mm')} •{' '}
                      {slot.location}
                    </p>
                    {slot.description && (
                      <p className="text-sm text-gray-500 mt-1">{slot.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-300">
                      {slot.booked}/{slot.capacity} booked
                    </p>
                    {spotsLeft > 0 ? (
                      <p className="text-xs text-gray-500">{spotsLeft} spots left</p>
                    ) : (
                      <p className="text-xs text-secondary-400">{slot.waitlist} on waitlist</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {upcomingClasses.length > 0 && (
        <Card className="bg-[#0a0a0a] border border-[#252525]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-white">Next 7 Days</h2>
            <Button variant="ghost" size="sm" className="w-full sm:w-auto">
              View calendar
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingClasses.map((slot) => {
              const slotDate = new Date(slot.startTime);
              const utilization = Math.round((slot.booked / slot.capacity) * 100);
              return (
                <div
                  key={slot.id}
                  className="p-4 rounded-2xl border border-[#252525] bg-[#141414] hover:border-primary-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-white">{slot.type}</p>
                    <span className="text-xs text-gray-500">
                      {isTomorrow(slotDate) ? 'Tomorrow' : format(slotDate, 'MMM dd')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {format(slotDate, 'HH:mm')} • {slot.location}
                  </p>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Bookings</span>
                      <span className="text-white font-semibold">
                        {slot.booked}/{slot.capacity}
                      </span>
                    </div>
                    <div className="h-2 bg-[#1f1f1f] rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                        style={{ width: `${utilization}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

// Regular User Dashboard Component
function UserDashboardView() {
  const { user } = useAuthStore();
  const { selectedBranch } = useBranchStore();
  const [weightData, setWeightData] = useState<Array<{ date: string; weight: number }>>([]);
  const [membershipProgress, setMembershipProgress] = useState({ daysCompleted: 0, totalDays: 30, daysRemaining: 0 });

  // Mock weight data
  useEffect(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: format(date, 'MMM dd'),
        weight: 75 - Math.random() * 2,
      });
    }
    setWeightData(data);
  }, []);

  // Calculate membership progress
  useEffect(() => {
    // Mock: 12 days completed out of 30 day membership
    const daysCompleted = 12;
    const totalDays = 30;
    const daysRemaining = totalDays - daysCompleted;
    setMembershipProgress({ daysCompleted, totalDays, daysRemaining });
  }, []);

  // Get current week days
  const getWeekDays = () => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const days = [];
    for (let i = 0; i < 5; i++) {
      const day = addDays(weekStart, i);
      const isToday = isSameDay(day, today);
      const isPast = day < today && !isToday;
      days.push({
        day: format(day, 'EEE'),
        date: format(day, 'dd'),
        fullDate: day,
        isToday,
        isPast,
      });
    }
    return days;
  };

  const weekDays = getWeekDays();
  const membershipPercentage = Math.round((membershipProgress.daysCompleted / membershipProgress.totalDays) * 100);

  // Circular chart data
  const chartData = [
    { name: 'Completed', value: membershipProgress.daysCompleted, color: '#FF6B35' },
    { name: 'Remaining', value: membershipProgress.daysRemaining, color: '#1A1A1A' },
  ];

  const todayClasses = [
    {
      id: '1',
      type: 'Yoga',
      time: '09:00',
      trainer: 'Meera Krishnan',
      booked: 12,
      capacity: 20,
    },
    {
      id: '2',
      type: 'HIIT',
      time: '18:00',
      trainer: 'Rohit Kapoor',
      booked: 18,
      capacity: 20,
    },
  ];

  const quickActions = [
    {
      label: 'Book Class',
      path: '/classes',
      image:
        'https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?auto=format&fit=crop&w=300&q=80',
    },
    {
      label: 'Check In',
      path: '/check-in',
      image:
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=300&q=80',
    },
    {
      label: 'Shop',
      path: '/store',
      image:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&q=80',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-medium tracking-tight text-white">
            Hey {user?.name?.split(' ')[0]}, ready for your next win?
          </h1>
          {selectedBranch && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-500/20 border border-primary-500/30 rounded-lg">
              <BuildingOfficeIcon className="h-4 w-4 text-primary-400" />
              <span className="text-sm font-semibold text-primary-400">{selectedBranch.name}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <p className="text-base text-gray-300">
            Here's what's happening today inside GymVerse
          </p>
          {selectedBranch && (
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <MapPinIcon className="h-4 w-4" />
              <span>{selectedBranch.city}, {selectedBranch.state}</span>
            </div>
          )}
        </div>
      </div>

      {/* Membership Card */}
      <Card className="card-gradient relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16 blur-2xl"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <p className="text-white/80 text-sm mb-1 font-medium">Active Membership</p>
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Premium Plan</h2>
            <p className="text-white/80 text-sm">
              Expires {user?.membershipExpiresAt ? format(new Date(user.membershipExpiresAt), 'MMM dd, yyyy') : 'Never'}
            </p>
          </div>
          <Button variant="accent" size="sm" className="bg-gradient-to-r from-secondary-400 to-secondary-500 text-black hover:from-secondary-300 hover:to-secondary-400 font-bold shadow-lg shadow-secondary-500/30">
            Manage
          </Button>
        </div>
      </Card>

      {/* Membership Progress Card */}
      <Card className="relative overflow-hidden">
        <div className="flex flex-col items-center justify-center py-6">
          {/* Circular Progress Chart */}
          <div className="relative w-48 h-48 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-black text-[#FF6B35]" style={{ color: '#FF6B35' }}>
                  {membershipPercentage}%
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {membershipProgress.daysCompleted}/{membershipProgress.totalDays} days
                </div>
              </div>
            </div>
          </div>

          {/* Days to Go Counter */}
          <div className="w-full">
            <div className="text-center mb-4">
              <p className="text-2xl font-black text-white">
                {membershipProgress.daysRemaining} to go!
              </p>
            </div>
            
            {/* Week Days */}
            <div className="flex justify-center gap-2">
              {weekDays.map((day, index) => (
                <button
                  key={index}
                  className={`flex flex-col items-center justify-center w-14 h-16 rounded-xl font-semibold transition-all ${
                    day.isPast || day.isToday
                      ? 'bg-[#FFD700] text-gray-900 shadow-lg shadow-yellow-500/30'
                      : 'bg-gray-900 text-gray-400 border border-gray-800'
                  }`}
                >
                  <span className="text-xs">{day.day}</span>
                  <span className="text-lg font-black">{day.date}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Link key={action.path} to={action.path}>
            <Card hover className="text-center">
              <div className="mb-3">
                <ImageWithFallback
                  src={action.image}
                  alt={action.label}
                  wrapperClassName="mx-auto h-14 w-14 rounded-2xl shadow-lg shadow-black/40 border border-white/10"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-sm font-medium text-gray-200">{action.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Today's Classes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-white tracking-tight">Today's Classes</h2>
          <Link to="/classes">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>
        <div className="space-y-4">
          {todayClasses.map((classItem) => {
            const spotsLeft = classItem.capacity - classItem.booked;
            const isAlmostFull = spotsLeft <= 3;
            return (
              <Card key={classItem.id} hover>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-white">{classItem.type}</h3>
                      <span className="text-sm text-gray-400">• {classItem.time}</span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">with {classItem.trainer}</p>
                    {isAlmostFull && spotsLeft > 0 && (
                      <p className="text-sm font-black text-secondary-400 bg-secondary-500/20 px-3 py-1 rounded-full inline-block border border-secondary-500/30">
                        Only {spotsLeft} {spotsLeft === 1 ? 'seat' : 'seats'} left — book now!
                      </p>
                    )}
                    {spotsLeft === 0 && (
                      <p className="text-sm font-medium text-gray-400">Fully booked</p>
                    )}
                  </div>
                  <Link to="/classes">
                    <Button size="sm">Book</Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Weight Progress */}
      <Card>
        <h2 className="text-xl font-black text-white mb-4 tracking-tight">Weight Progress</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightData}>
              <XAxis 
                dataKey="date" 
                stroke="#666"
                tick={{ fill: '#999' }}
              />
              <YAxis 
                domain={['dataMin - 1', 'dataMax + 1']}
                stroke="#666"
                tick={{ fill: '#999' }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#471396"
                strokeWidth={3}
                dot={{ fill: '#471396', r: 5 }}
                activeDot={{ r: 7, fill: '#00D9FF' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-300">Last 7 days</span>
          <span className="font-black bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
            {weightData.length > 0 && `${weightData[weightData.length - 1].weight.toFixed(1)} kg`}
          </span>
        </div>
      </Card>
    </div>
  );
}

// Main Dashboard Component - Conditionally renders based on user role
export default function Dashboard() {
  const { user } = useAuthStore();

  // Show admin dashboard for admins, regular dashboard for others
  if (user?.role === 'admin') {
    return <AdminDashboardView />;
  }
  if (user?.role === 'trainer') {
    return <TrainerDashboardView />;
  }

  return <UserDashboardView />;
}
