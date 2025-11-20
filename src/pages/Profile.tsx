import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  Tooltip,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import type { BodyMeasurement, WorkoutPlan } from '@/types';

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'bms' | 'weight' | 'workout' | 'prefs'>('bms');
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [weightHistory, setWeightHistory] = useState<Array<{ date: string; weight: number }>>([]);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [formData, setFormData] = useState({
    chest: '',
    waist: '',
    hips: '',
    weight: '',
  });
  const [preferences, setPreferences] = useState({
    classReminder: true,
    workoutReminder: true,
    reminderTime: '08:00',
    email: true,
    sms: false,
    push: true,
  });

  const profileStats = [
    { label: 'Height', value: "5'10″", detail: '178 cm' },
    { label: 'Age', value: '27', detail: 'Years Young' },
    { label: 'Weight', value: '75 kg', detail: 'Goal 72 kg' },
  ];

  const summaryMetrics = [
    {
      title: 'Sessions this week',
      value: '5 / 6',
      description: 'Workout streak',
      progress: 0.83,
      accent: '#ff6b35',
      icon: '🏋️‍♂️',
    },
    {
      title: 'Active minutes',
      value: '342',
      description: 'This week so far',
      progress: 0.68,
      accent: '#ff6b35',
      icon: '⏱',
    },
    {
      title: 'Calories burned',
      value: '2,450 kcal',
      description: '+14% vs last week',
      progress: 0.74,
      accent: '#ff6b35',
      icon: '🔥',
    },
  ];

  const workoutSplit = [
    { day: 'Mon', minutes: 45 },
    { day: 'Tue', minutes: 60 },
    { day: 'Wed', minutes: 30 },
    { day: 'Thu', minutes: 0 },
    { day: 'Fri', minutes: 50 },
    { day: 'Sat', minutes: 35 },
    { day: 'Sun', minutes: 40 },
  ];

  const bodyFocus = [
    { name: 'Strength', value: 70, fill: '#7A33FF' },
    { name: 'Cardio', value: 55, fill: '#00D9FF' },
    { name: 'Mobility', value: 45, fill: '#FF6B35' },
  ];

  useEffect(() => {
    // Mock data
    const mockMeasurements: BodyMeasurement[] = [
      {
        id: '1',
        userId: '1',
        chest: 100,
        waist: 85,
        hips: 95,
        weight: 75,
        recordedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        userId: '1',
        chest: 102,
        waist: 83,
        hips: 93,
        weight: 74.5,
        recordedAt: new Date().toISOString(),
      },
    ];
    setMeasurements(mockMeasurements);

    const weightData = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      weightData.push({
        date: format(date, 'MMM dd'),
        weight: 75 - Math.random() * 3,
      });
    }
    setWeightHistory(weightData);

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const week = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
    
    setWorkoutPlan({
      id: '1',
      userId: '1',
      week: week,
      year: now.getFullYear(),
      days: {
        Monday: {
          exercises: [
            { name: 'Bench Press', sets: 4, reps: 8, weight: 80 },
            { name: 'Squats', sets: 4, reps: 10, weight: 100 },
          ],
        },
        Wednesday: {
          exercises: [
            { name: 'Deadlift', sets: 4, reps: 6, weight: 120 },
            { name: 'Pull-ups', sets: 3, reps: 10 },
          ],
        },
        Friday: {
          exercises: [
            { name: 'Overhead Press', sets: 4, reps: 8, weight: 60 },
            { name: 'Rows', sets: 4, reps: 10, weight: 70 },
          ],
        },
      },
    });
  }, []);

  const handleSaveMeasurement = () => {
    const newMeasurement: BodyMeasurement = {
      id: Date.now().toString(),
      userId: '1',
      chest: formData.chest ? parseFloat(formData.chest) : undefined,
      waist: formData.waist ? parseFloat(formData.waist) : undefined,
      hips: formData.hips ? parseFloat(formData.hips) : undefined,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      recordedAt: new Date().toISOString(),
    };
    setMeasurements([newMeasurement, ...measurements]);
    setFormData({ chest: '', waist: '', hips: '', weight: '' });
  };

  const tabs = [
    { id: 'bms', label: 'Body Measurements' },
    { id: 'weight', label: 'Weight History' },
    { id: 'workout', label: 'Workout Plan' },
    { id: 'prefs', label: 'Preferences' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Profile</h1>
        <p className="mt-2 text-gray-300 font-medium">Manage your account and preferences</p>
      </div>

      {/* User Info */}
      <Card>
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-20 h-20 rounded-3xl border border-[#2a2a2a] shadow-lg overflow-hidden">
              <img
                src="/profilepic-.jpg"
                alt={user?.name ?? 'Profile avatar'}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-gray-500">Member</p>
              <h2 className="text-2xl font-bold text-white capitalize">{user?.name}</h2>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 w-full lg:w-auto">
            {profileStats.map((stat) => (
              <div
                key={stat.label}
                className="group bg-gradient-to-br from-[#101010] to-[#141414] rounded-xl border border-[#1f1f1f] p-4 text-center transition-all duration-200 hover:-translate-y-1 hover:border-primary-500/60"
              >
                <p className="text-xs uppercase tracking-[0.35em] text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-semibold text-white">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Performance Highlights */}
      <div className="grid gap-4 md:grid-cols-3">
        {summaryMetrics.map((metric) => (
          <div
            key={metric.title}
            className="rounded-2xl bg-[#1a1a1a] border border-[#262626] shadow-[0_15px_30px_rgba(0,0,0,0.35)] p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{metric.title}</p>
                <p className="text-2xl font-black text-white mt-1">{metric.value}</p>
                <p className="text-sm text-gray-500">{metric.description}</p>
              </div>
              <span className="text-2xl bg-[#242424] text-white/80 rounded-full px-2 py-1">
                {metric.icon}
              </span>
            </div>
            <div className="mt-4">
              <div className="h-2 w-full bg-[#242424] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${metric.progress * 100}%`,
                    backgroundColor: metric.accent,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800 overflow-x-auto no-scrollbar">
        <nav className="flex min-w-max -mb-px px-2 space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`relative whitespace-nowrap py-3 text-sm font-semibold ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
              <span
                className={`absolute left-0 right-0 -bottom-px h-0.5 rounded-full transition-colors duration-200 ${
                  activeTab === tab.id ? 'bg-primary-500' : 'bg-transparent'
                }`}
              />
            </button>
          ))}
        </nav>
      </div>

      {/* Body Measurements Tab */}
      {activeTab === 'bms' && (
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-lg font-black text-white mb-2 tracking-tight">Add Measurement</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Track your progress and keep your trainer updated.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-500">Chest (cm)</label>
                    <div className="flex gap-2 items-center mt-1">
                      <span className="text-xs text-gray-500">Prev 102</span>
                      <span className="text-xs text-emerald-400">-2</span>
                    </div>
                    <Input
                      type="number"
                      value={formData.chest}
                      onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-500">Waist (cm)</label>
                    <div className="flex gap-2 items-center mt-1">
                      <span className="text-xs text-gray-500">Prev 87</span>
                      <span className="text-xs text-emerald-400">-2</span>
                    </div>
                    <Input
                      type="number"
                      value={formData.waist}
                      onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                      placeholder="85"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-500">Hips (cm)</label>
                    <div className="flex gap-2 items-center mt-1">
                      <span className="text-xs text-gray-500">Prev 95</span>
                      <span className="text-xs text-gray-400">0</span>
                    </div>
                    <Input
                      type="number"
                      value={formData.hips}
                      onChange={(e) => setFormData({ ...formData, hips: e.target.value })}
                      placeholder="95"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-500">Weight (kg)</label>
                    <div className="flex gap-2 items-center mt-1">
                      <span className="text-xs text-gray-500">Prev 76</span>
                      <span className="text-xs text-emerald-400">-1</span>
                    </div>
                    <Input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="75"
                    />
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {['Bulking', 'Cutting', 'Maintenance'].map((tag) => (
                    <button
                      key={tag}
                      className="px-3 py-1 rounded-full border border-gray-700 text-xs text-gray-300 hover:border-primary-500 hover:text-white transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Trend</p>
                    <div className="flex items-center gap-2 text-sm text-emerald-400">
                      <span className="text-lg font-bold">▲ 2.4%</span>
                      <span className="text-gray-400">vs last month</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Goal proximity</p>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-lg font-bold">82%</span>
                      <span className="text-gray-400">towards target</span>
                    </div>
                  </div>
                </div>
                <Button className="w-full sm:w-auto" onClick={handleSaveMeasurement}>
                  Save Measurement
                </Button>
              </div>
              <div className="flex-1 bg-[#171717] border border-gray-800 rounded-2xl p-4 space-y-4 shadow-inner shadow-black/40">
                <h4 className="text-sm text-gray-400 uppercase tracking-[0.3em]">Insights</h4>
                <div className="space-y-3">
                  {[
                    { label: 'Chest', value: '-2 cm', status: 'Great job keeping consistency.' },
                    { label: 'Waist', value: '-2 cm', status: 'On track for summer goals.' },
                    { label: 'Hips', value: 'Stable', status: 'Solid maintenance.' },
                    { label: 'Weight', value: '-1 kg', status: 'Controlled rate of change.' },
                  ].map((insight) => (
                    <div key={insight.label} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
                      <div>
                        <p className="text-sm font-semibold text-white">{insight.label}</p>
                        <p className="text-xs text-gray-500">{insight.status}</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-400">{insight.value}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-black/20 rounded-xl p-3 border border-gray-800">
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Next check-in</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white">Coach review</p>
                      <p className="text-xs text-gray-400">Scheduled for Sun, 10 AM</p>
                    </div>
                    <Button size="sm" variant="ghost">
                      Sync
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-black text-white mb-4 tracking-tight">Training Focus</h3>
            <div className="h-64 flex items-center gap-6">
              <ResponsiveContainer width="60%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="20%"
                  outerRadius="90%"
                  barSize={12}
                  data={bodyFocus}
                >
                  <RadialBar
                    minAngle={15}
                    background
                    clockWise
                    dataKey="value"
                    cornerRadius={12}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f0a14', border: '1px solid #1f1b2e' }}
                    labelStyle={{ color: '#fff' }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {bodyFocus.map((focus) => (
                  <div key={focus.name} className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: focus.fill }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">{focus.name}</p>
                      <p className="text-xs text-gray-400">{focus.value}% of total time</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Visual Insights */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-black text-white">Weekly Workout Split</h3>
              <p className="text-sm text-gray-400">Target: 45 min / day</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workoutSplit}>
                <defs>
                  <linearGradient id="workoutBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7A33FF" stopOpacity={1} />
                    <stop offset="100%" stopColor="#00D9FF" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f0a14', border: '1px solid #1f1b2e' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="minutes" fill="url(#workoutBar)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Measurements - Global */}
      <Card>
        <h3 className="text-lg font-black text-white mb-4 tracking-tight">Recent Measurements</h3>
        <div className="space-y-4">
          {measurements.map((measurement) => (
            <div
              key={measurement.id}
              className="relative rounded-2xl bg-[#1a1a1a] border border-[#252525] px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
            >
              <div className="absolute inset-y-0 left-0 w-1 rounded-full" style={{ background: '#ff6b35' }} />
              <div className="pl-3 flex flex-col gap-2">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <p className="text-sm font-bold text-white">
                    {format(new Date(measurement.recordedAt), 'MMM dd, yyyy')}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Logged via app</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-300">
                  {measurement.chest && (
                    <span className="px-3 py-1 rounded-full bg-black/30 border border-[#252525]">
                      Chest {measurement.chest}cm
                    </span>
                  )}
                  {measurement.waist && (
                    <span className="px-3 py-1 rounded-full bg-black/30 border border-[#252525]">
                      Waist {measurement.waist}cm
                    </span>
                  )}
                  {measurement.hips && (
                    <span className="px-3 py-1 rounded-full bg-black/30 border border-[#252525]">
                      Hips {measurement.hips}cm
                    </span>
                  )}
                  {measurement.weight && (
                    <span className="px-3 py-1 rounded-full bg-black/30 border border-[#252525]">
                      Weight {measurement.weight}kg
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Weight History Tab */}
      {activeTab === 'weight' && (
        <Card>
          <h3 className="text-lg font-black text-white mb-4 tracking-tight">Weight History</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightHistory}>
                <XAxis dataKey="date" />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
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
        </Card>
      )}

      {/* Workout Plan Tab */}
      {activeTab === 'workout' && (
        <Card>
          <h3 className="text-lg font-black text-white mb-4 tracking-tight">Weekly Workout Plan</h3>
          {workoutPlan && (
            <div className="space-y-4">
              {Object.entries(workoutPlan.days).map(([day, data]) => (
                <div key={day} className="border border-gray-800 rounded-lg p-4 bg-gray-900">
                  <h4 className="font-bold text-white mb-2">{day}</h4>
                  <div className="space-y-2">
                    {data.exercises.map((exercise, index) => (
                      <div key={index} className="text-sm text-gray-300">
                        <span className="font-semibold">{exercise.name}</span>
                        {exercise.sets && <span> • {exercise.sets} sets</span>}
                        {exercise.reps && <span> × {exercise.reps} reps</span>}
                        {exercise.weight && <span> @ {exercise.weight}kg</span>}
                        {exercise.duration && <span> ({exercise.duration} min)</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Preferences Tab */}
      {activeTab === 'prefs' && (
        <Card>
          <h3 className="text-lg font-black text-white mb-4 tracking-tight">Notification Preferences</h3>
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.classReminder}
                  onChange={(e) =>
                    setPreferences({ ...preferences, classReminder: e.target.checked })
                  }
                  className="rounded border-gray-700 bg-gray-900 text-primary-500 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-300">Class reminders</span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.workoutReminder}
                  onChange={(e) =>
                    setPreferences({ ...preferences, workoutReminder: e.target.checked })
                  }
                  className="rounded border-gray-700 bg-gray-900 text-primary-500 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-300">Workout reminders</span>
              </label>
            </div>
            {preferences.workoutReminder && (
              <Input
                label="Reminder Time"
                type="time"
                value={preferences.reminderTime}
                onChange={(e) =>
                  setPreferences({ ...preferences, reminderTime: e.target.value })
                }
              />
            )}
            <div className="border-t border-gray-800 pt-4">
              <h4 className="font-bold text-white mb-2">Notification Channels</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.email}
                    onChange={(e) =>
                      setPreferences({ ...preferences, email: e.target.checked })
                    }
                    className="rounded border-gray-700 bg-gray-900 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">Email</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.sms}
                    onChange={(e) =>
                      setPreferences({ ...preferences, sms: e.target.checked })
                    }
                    className="rounded border-gray-700 bg-gray-900 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">SMS</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.push}
                    onChange={(e) =>
                      setPreferences({ ...preferences, push: e.target.checked })
                    }
                    className="rounded border-gray-700 bg-gray-900 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-300">Push notifications</span>
                </label>
              </div>
            </div>
            <Button className="mt-4">Save Preferences</Button>
          </div>
        </Card>
      )}
    </div>
  );
}

