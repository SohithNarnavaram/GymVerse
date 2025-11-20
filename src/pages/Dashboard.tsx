import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { useAuthStore } from '@/store/authStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const { user } = useAuthStore();
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
    { name: 'Completed', value: membershipProgress.daysCompleted, color: '#FF6B35' }, // Orange
    { name: 'Remaining', value: membershipProgress.daysRemaining, color: '#1A1A1A' }, // Dark
  ];

  const todayClasses = [
    {
      id: '1',
      type: 'Yoga',
      time: '09:00',
      trainer: 'Sarah Johnson',
      booked: 12,
      capacity: 20,
    },
    {
      id: '2',
      type: 'HIIT',
      time: '18:00',
      trainer: 'Alex Rivera',
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
        <h1 className="text-4xl font-medium tracking-tight text-white">
          Hey {user?.name?.split(' ')[0]}, ready for your next win?
        </h1>
        <p className="mt-2 text-base text-gray-300">
          Here's what's happening today inside GymVerse
        </p>
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

