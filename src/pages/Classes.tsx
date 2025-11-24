import { useState, useEffect, useMemo } from 'react';
import { format, isToday, isTomorrow, addDays, isSameDay } from 'date-fns';
import { TrashIcon, PencilIcon, PlusIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { useToast } from '@/components/ui/Toast';
import { useAuthStore } from '@/store/authStore';
import type { Slot } from '@/types';

const FALLBACK_CLASS_IMAGE =
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=700&q=80';

const CLASS_IMAGES: Record<string, string> = {
  Yoga: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
  HIIT: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&w=700&h=500&q=80',
  Boxing: 'https://images.unsplash.com/photo-1501426026826-31c667bdf23d?auto=format&fit=crop&w=700&h=500&q=80',
  Dance: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=700&h=500&q=80',
  Default: FALLBACK_CLASS_IMAGE,
};

const CLASS_CATEGORIES = ['Yoga', 'HIIT', 'Boxing', 'Dance', 'Pilates', 'Aerobics', 'Strength', 'Cardio', 'CrossFit'];

// Mock trainers list
const MOCK_TRAINERS = [
  { id: 't1', name: 'Meera Krishnan' },
  { id: 't2', name: 'Vikram Singh' },
  { id: 't3', name: 'Divya Menon' },
  { id: 't4', name: 'Rohit Kapoor' },
];

export default function Classes() {
  const { showToast } = useToast();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [bookings, setBookings] = useState<Record<string, 'confirmed' | 'waitlisted'>>({});
  const [latestBooking, setLatestBooking] = useState<{ slot: Slot; status: 'confirmed' | 'waitlisted' } | null>(null);
  
  // Admin modals
  const [isCreateClassModalOpen, setIsCreateClassModalOpen] = useState(false);
  const [isEditClassModalOpen, setIsEditClassModalOpen] = useState(false);
  const [isDeleteClassModalOpen, setIsDeleteClassModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null);
  const [deletingSlot, setDeletingSlot] = useState<Slot | null>(null);
  const [classFormData, setClassFormData] = useState({
    type: '',
    trainerId: '',
    trainerName: '',
    capacity: 20,
    startDate: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
  });

  // Admin filters
  const [filterTrainer, setFilterTrainer] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [filterDateRange, setFilterDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [filterRecency, setFilterRecency] = useState<'all' | 'recent'>('all');

  useEffect(() => {
    // Mock slots data
    const mockSlots: Slot[] = [
      {
        id: '1',
        type: 'Yoga',
        trainerId: 't1',
        trainerName: 'Meera Krishnan',
        capacity: 20,
        booked: 12,
        waitlist: 0,
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
        location: 'Main Studio',
        description: 'Gentle flow yoga for all levels',
        createdAt: addDays(new Date(), -1).toISOString(),
      },
      {
        id: '2',
        type: 'HIIT',
        trainerId: 't2',
        trainerName: 'Rohit Kapoor',
        capacity: 20,
        booked: 18,
        waitlist: 2,
        startTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString(),
        location: 'Cardio Studio',
        description: 'High-intensity interval training',
        createdAt: addDays(new Date(), -2).toISOString(),
      },
      {
        id: '3',
        type: 'Boxing',
        trainerId: 't3',
        trainerName: 'Vikram Singh',
        capacity: 15,
        booked: 8,
        waitlist: 0,
        startTime: addDays(new Date(), 1).toISOString(),
        endTime: addDays(new Date(), 1).toISOString(),
        location: 'Boxing Arena',
        description: 'Boxing fundamentals and conditioning',
        createdAt: addDays(new Date(), -7).toISOString(),
      },
      {
        id: '4',
        type: 'Dance',
        trainerId: 't4',
        trainerName: 'Divya Menon',
        capacity: 25,
        booked: 22,
        waitlist: 5,
        startTime: addDays(new Date(), 1).toISOString(),
        endTime: addDays(new Date(), 1).toISOString(),
        location: 'Dance Hall',
        description: 'Fun and energetic dance workout',
        createdAt: addDays(new Date(), -12).toISOString(),
      },
    ];
    setSlots(mockSlots);
  }, []);

  const handleBook = (slot: Slot) => {
    setSelectedSlot(slot);
    setIsBookingModalOpen(true);
  };

  const confirmBooking = () => {
    if (!selectedSlot) return;

    const spotsLeft = selectedSlot.capacity - selectedSlot.booked;
    if (spotsLeft <= 0) {
      showToast({
        variant: 'info',
        title: 'Added to waitlist',
        description: "You'll be notified if a spot opens up!",
      });
      setBookings((prev) => ({ ...prev, [selectedSlot.id]: 'waitlisted' }));
      setSlots((prev) =>
        prev.map((slot) =>
          slot.id === selectedSlot.id ? { ...slot, waitlist: (slot.waitlist ?? 0) + 1 } : slot,
        ),
      );
      setLatestBooking({ slot: selectedSlot, status: 'waitlisted' });
    } else {
      showToast({
        variant: 'success',
        title: 'Booking confirmed!',
        description: "You're all set — see you in class!",
      });
      setBookings((prev) => ({ ...prev, [selectedSlot.id]: 'confirmed' }));
      setSlots((prev) =>
        prev.map((slot) =>
          slot.id === selectedSlot.id ? { ...slot, booked: Math.min(slot.capacity, slot.booked + 1) } : slot,
        ),
      );
      setLatestBooking({ slot: selectedSlot, status: 'confirmed' });
    }
    setIsBookingModalOpen(false);
    setSelectedSlot(null);
  };

  const formatTime = (date: string) => format(new Date(date), 'HH:mm');
  const formatDate = (date: string) => {
    const d = new Date(date);
    if (isToday(d)) return 'Today';
    if (isTomorrow(d)) return 'Tomorrow';
    return format(d, 'MMM dd');
  };

  // Admin handlers
  const handleCreateClass = () => {
    const trainer = MOCK_TRAINERS.find(t => t.id === classFormData.trainerId);
    if (!trainer) {
      showToast({
        variant: 'error',
        title: 'Invalid trainer',
        description: 'Please select a valid trainer',
      });
      return;
    }

    const startDateTime = new Date(`${classFormData.startDate}T${classFormData.startTime}`);
    const endDateTime = new Date(`${classFormData.startDate}T${classFormData.endTime}`);
    
    if (endDateTime <= startDateTime) {
      showToast({
        variant: 'error',
        title: 'Invalid time',
        description: 'End time must be after start time',
      });
      return;
    }

    const newSlot: Slot = {
      id: Date.now().toString(),
      type: classFormData.type,
      trainerId: classFormData.trainerId,
      trainerName: trainer.name,
      capacity: classFormData.capacity,
      booked: 0,
      waitlist: 0,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      location: classFormData.location,
      description: classFormData.description,
      createdAt: new Date().toISOString(),
    };

    setSlots([...slots, newSlot]);
    setIsCreateClassModalOpen(false);
    setClassFormData({
      type: '',
      trainerId: '',
      trainerName: '',
      capacity: 20,
      startDate: '',
      startTime: '',
      endTime: '',
      location: '',
      description: '',
    });
    showToast({
      variant: 'success',
      title: 'Class created',
      description: `${newSlot.type} class has been created successfully`,
    });
  };

  const handleEditClass = (slot: Slot) => {
    setEditingSlot(slot);
    const startDate = new Date(slot.startTime);
    setClassFormData({
      type: slot.type,
      trainerId: slot.trainerId,
      trainerName: slot.trainerName,
      capacity: slot.capacity,
      startDate: format(startDate, 'yyyy-MM-dd'),
      startTime: format(startDate, 'HH:mm'),
      endTime: format(new Date(slot.endTime), 'HH:mm'),
      location: slot.location || '',
      description: slot.description || '',
    });
    setIsEditClassModalOpen(true);
  };

  const handleUpdateClass = () => {
    if (!editingSlot) return;

    const trainer = MOCK_TRAINERS.find(t => t.id === classFormData.trainerId);
    if (!trainer) {
      showToast({
        variant: 'error',
        title: 'Invalid trainer',
        description: 'Please select a valid trainer',
      });
      return;
    }

    const startDateTime = new Date(`${classFormData.startDate}T${classFormData.startTime}`);
    const endDateTime = new Date(`${classFormData.startDate}T${classFormData.endTime}`);
    
    if (endDateTime <= startDateTime) {
      showToast({
        variant: 'error',
        title: 'Invalid time',
        description: 'End time must be after start time',
      });
      return;
    }

    const updatedSlot: Slot = {
      ...editingSlot,
      type: classFormData.type,
      trainerId: classFormData.trainerId,
      trainerName: trainer.name,
      capacity: classFormData.capacity,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      location: classFormData.location,
      description: classFormData.description,
      createdAt: editingSlot.createdAt || editingSlot.startTime,
    };

    setSlots(slots.map(s => s.id === editingSlot.id ? updatedSlot : s));
    setIsEditClassModalOpen(false);
    setEditingSlot(null);
    setClassFormData({
      type: '',
      trainerId: '',
      trainerName: '',
      capacity: 20,
      startDate: '',
      startTime: '',
      endTime: '',
      location: '',
      description: '',
    });
    showToast({
      variant: 'success',
      title: 'Class updated',
      description: 'Class information has been updated',
    });
  };

  const handleDeleteClass = (slotId: string) => {
    const slot = slots.find(s => s.id === slotId);
    if (slot) {
      setDeletingSlot(slot);
      setIsDeleteClassModalOpen(true);
    }
  };

  const confirmDeleteClass = () => {
    if (!deletingSlot) return;
    const slotType = deletingSlot.type;
    setSlots(slots.filter(s => s.id !== deletingSlot.id));
    setIsDeleteClassModalOpen(false);
    setDeletingSlot(null);
    showToast({
      variant: 'success',
      title: 'Class deleted',
      description: `${slotType} class has been removed`,
    });
  };

  const handleTrainerChange = (trainerId: string) => {
    const trainer = MOCK_TRAINERS.find(t => t.id === trainerId);
    setClassFormData({
      ...classFormData,
      trainerId,
      trainerName: trainer?.name || '',
    });
  };

  // Admin statistics
  const adminStats = useMemo(() => {
    const totalClasses = slots.length;
    const totalBookings = slots.reduce((sum, slot) => sum + slot.booked, 0);
    const totalWaitlist = slots.reduce((sum, slot) => sum + (slot.waitlist || 0), 0);
    const totalCapacity = slots.reduce((sum, slot) => sum + slot.capacity, 0);
    const avgUtilization = totalCapacity > 0 ? Math.round((totalBookings / totalCapacity) * 100) : 0;
    const upcomingToday = slots.filter(slot => isToday(new Date(slot.startTime))).length;
    
    return {
      totalClasses,
      totalBookings,
      totalWaitlist,
      avgUtilization,
      upcomingToday,
    };
  }, [slots]);

  // Filtered slots for admin
  const filteredSlots = useMemo(() => {
    let filtered = [...slots];
    
    if (filterTrainer !== 'all') {
      filtered = filtered.filter(slot => slot.trainerId === filterTrainer);
    }
    
    if (filterLocation !== 'all') {
      filtered = filtered.filter(slot => slot.location === filterLocation);
    }
    
    if (filterDateRange !== 'all') {
      const now = new Date();
      filtered = filtered.filter(slot => {
        const slotDate = new Date(slot.startTime);
        switch (filterDateRange) {
          case 'today':
            return isToday(slotDate);
          case 'week':
            return slotDate >= now && slotDate <= addDays(now, 7);
          case 'month':
            return slotDate >= now && slotDate <= addDays(now, 30);
          default:
            return true;
        }
      });
    }

    if (filterRecency === 'recent') {
      const weekAgo = addDays(new Date(), -7);
      filtered = filtered
        .filter(slot => {
          const createdAt = slot.createdAt ? new Date(slot.createdAt) : new Date(slot.startTime);
          return createdAt >= weekAgo;
        })
        .sort(
          (a, b) =>
            new Date(b.createdAt || b.startTime).getTime() - new Date(a.createdAt || a.startTime).getTime(),
        );
    }
    
    return filtered;
  }, [slots, filterTrainer, filterLocation, filterDateRange, filterRecency]);

  // Get unique locations
  const uniqueLocations = useMemo(() => {
    return Array.from(new Set(slots.map(slot => slot.location).filter(Boolean)));
  }, [slots]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Classes</h1>
          <p className="mt-2 text-gray-300 font-medium">
            {isAdmin ? 'Manage classes and schedules' : 'Book your favorite workouts'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Button
              onClick={() => setIsCreateClassModalOpen(true)}
              className="flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Create Class
            </Button>
          )}
          <div className="relative flex w-48 rounded-2xl border border-[#262626] bg-[#101010] p-1 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
            <span
              className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-xl bg-gradient-to-r from-[#7a33ff] to-[#a555ff] transition-transform duration-300"
              style={{ transform: view === 'calendar' ? 'translateX(100%)' : 'translateX(0)' }}
            />
            <button
              onClick={() => setView('list')}
              className={`relative z-10 flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                view === 'list' ? 'text-[#eeeeee]' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`relative z-10 flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                view === 'calendar' ? 'text-[#eeeeee]' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Admin Statistics */}
      {isAdmin && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card className="bg-[#0a0a0a] border border-[#252525]">
            <p className="text-sm text-gray-400 mb-1">Total Classes</p>
            <p className="text-2xl font-bold text-white">{adminStats.totalClasses}</p>
          </Card>
          <Card className="bg-[#0a0a0a] border border-[#252525]">
            <p className="text-sm text-gray-400 mb-1">Total Bookings</p>
            <p className="text-2xl font-bold text-primary-400">{adminStats.totalBookings}</p>
          </Card>
          <Card className="bg-[#0a0a0a] border border-[#252525]">
            <p className="text-sm text-gray-400 mb-1">Waitlist</p>
            <p className="text-2xl font-bold text-secondary-400">{adminStats.totalWaitlist}</p>
          </Card>
          <Card className="bg-[#0a0a0a] border border-[#252525]">
            <p className="text-sm text-gray-400 mb-1">Avg Utilization</p>
            <p className="text-2xl font-bold text-emerald-400">{adminStats.avgUtilization}%</p>
          </Card>
          <Card className="bg-[#0a0a0a] border border-[#252525]">
            <p className="text-sm text-gray-400 mb-1">Today's Classes</p>
            <p className="text-2xl font-bold text-[#ff6b35]">{adminStats.upcomingToday}</p>
          </Card>
        </div>
      )}

      {/* Admin Filters */}
      {isAdmin && (
        <Card className="bg-[#0a0a0a] border border-[#252525]">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[150px]">
              <select
                value={filterTrainer}
                onChange={(e) => setFilterTrainer(e.target.value)}
                className="w-full px-3 py-2 pr-8 bg-[#0a0a0a] border border-gray-800 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-primary-500/50 focus:bg-gray-900 transition-colors appearance-none cursor-pointer hover:border-gray-700"
              >
                <option value="all" className="bg-[#0a0a0a]">All Trainers</option>
                {MOCK_TRAINERS.map((trainer) => (
                  <option key={trainer.id} value={trainer.id} className="bg-[#0a0a0a]">
                    {trainer.name}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative flex-1 min-w-[150px]">
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full px-3 py-2 pr-8 bg-[#0a0a0a] border border-gray-800 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-primary-500/50 focus:bg-gray-900 transition-colors appearance-none cursor-pointer hover:border-gray-700"
              >
                <option value="all" className="bg-[#0a0a0a]">All Locations</option>
                {uniqueLocations.map((location) => (
                  <option key={location} value={location} className="bg-[#0a0a0a]">
                    {location}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative flex-1 min-w-[150px]">
              <select
                value={filterDateRange}
                onChange={(e) => setFilterDateRange(e.target.value as typeof filterDateRange)}
                className="w-full px-3 py-2 pr-8 bg-[#0a0a0a] border border-gray-800 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-primary-500/50 focus:bg-gray-900 transition-colors appearance-none cursor-pointer hover:border-gray-700"
              >
                <option value="all" className="bg-[#0a0a0a]">All Dates</option>
                <option value="today" className="bg-[#0a0a0a]">Today</option>
                <option value="week" className="bg-[#0a0a0a]">This Week</option>
                <option value="month" className="bg-[#0a0a0a]">This Month</option>
              </select>
              <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="relative flex-1 min-w-[150px]">
              <select
                value={filterRecency}
                onChange={(e) => setFilterRecency(e.target.value as typeof filterRecency)}
                className="w-full px-3 py-2 pr-8 bg-[#0a0a0a] border border-gray-800 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-primary-500/50 focus:bg-gray-900 transition-colors appearance-none cursor-pointer hover:border-gray-700"
              >
                <option value="all" className="bg-[#0a0a0a]">All Classes</option>
                <option value="recent" className="bg-[#0a0a0a]">Recently Added</option>
              </select>
              <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </Card>
      )}

      {view === 'list' ? (
        <div className="space-y-4">
          {(isAdmin ? filteredSlots : slots).map((slot) => {
            const spotsLeft = slot.capacity - slot.booked;
            const isAlmostFull = spotsLeft <= 3 && spotsLeft > 0;
            const isFull = spotsLeft === 0;

            return (
              <Card key={slot.id} className="bg-[#0a0a0a] border border-[#252525] hover:border-primary-500/30 transition-colors" hover>
                <div className="flex flex-col sm:flex-row gap-5">
                  <ImageWithFallback
                    src={CLASS_IMAGES[slot.type] ?? CLASS_IMAGES.Default}
                    alt={`${slot.type} class`}
                    wrapperClassName="w-full sm:w-32 h-40 sm:h-32 rounded-2xl border border-white/10 shadow-lg shadow-black/40"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2">
                        <h3 className="text-lg font-bold text-white">{slot.type}</h3>
                        <p className="text-sm text-gray-300">with {slot.trainerName}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mt-2">
                        <span>{formatDate(slot.startTime)}</span>
                        <span>•</span>
                        <span>
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </span>
                        {slot.location && (
                          <>
                            <span>•</span>
                            <span>{slot.location}</span>
                          </>
                        )}
                      </div>
                      {slot.description && (
                        <p className="text-sm text-gray-400 mt-2">{slot.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-sm text-gray-300">
                          {slot.booked}/{slot.capacity} booked
                        </span>
                        {isAlmostFull && (
                      <span className="text-sm font-bold text-secondary-400 bg-secondary-500/10 px-3 py-1 rounded-full inline-block border border-secondary-500/30">
                            Only {spotsLeft} {spotsLeft === 1 ? 'seat' : 'seats'} left!
                          </span>
                        )}
                        {isFull && (
                          <span className="text-sm font-medium text-gray-400">
                            Fully booked ({slot.waitlist} on waitlist)
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:w-auto w-full">
                      {isAdmin ? (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClass(slot)}
                            className="bg-primary-500/20 text-primary-200 border-primary-500 hover:bg-transparent hover:border-primary-500/50 hover:text-primary-300 flex-1"
                          >
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <button
                            onClick={() => handleDeleteClass(slot.id)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors border border-gray-700 hover:border-red-500/30"
                            title="Delete class"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleBook(slot)}
                          disabled={isFull && slot.waitlist > 10}
                          fullWidth
                        >
                          {isFull ? 'Join Waitlist' : 'Book Now'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {latestBooking && (
            <Card className="bg-[#1a1a1a] border border-[#2a2a2a] shadow-[0_0_35px_rgba(122,51,255,0.12)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-[#9c9c9c]">Latest update</p>
                  <p className="text-lg font-semibold text-[#eeeeee] mt-1">
                    {latestBooking.status === 'confirmed' ? 'Booking confirmed' : 'Added to waitlist'}
                  </p>
                  <p className="text-sm text-[#cfcfcf]">
                    {latestBooking.slot.type} • {formatDate(latestBooking.slot.startTime)} at{' '}
                    {formatTime(latestBooking.slot.startTime)}
                  </p>
                </div>
                <Button variant="secondary" onClick={() => setView('list')}>
                  Manage bookings
                </Button>
              </div>
            </Card>
          )}

          <Card className="bg-[#141414] border border-[#262626]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-[#eeeeee]">Weekly calendar</h2>
                <p className="text-sm text-[#b3b3b3]">
                  {isAdmin 
                    ? 'Click on any class to edit. Color coding: Green (available), Yellow (almost full), Red (full).'
                    : 'Booked sessions show up below with confirmation status.'}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setView('list')}>
                Switch to List View
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 7 }, (_, index) => addDays(new Date(), index)).map((day) => {
                const daySlots = (isAdmin ? filteredSlots : slots).filter((slot) => isSameDay(new Date(slot.startTime), day));
                return (
                  <div
                    key={day.toISOString()}
                    className="rounded-2xl border border-[#262626] bg-[#1a1a1a] p-4 space-y-3"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                        {format(day, 'EEE')}
                      </p>
                      <p className="text-lg font-semibold text-[#eeeeee]">{format(day, 'MMM d')}</p>
                    </div>
                    {daySlots.length === 0 ? (
                      <p className="text-sm text-[#6e6e6e]">No classes scheduled</p>
                    ) : (
                      <div className="space-y-3">
                        {daySlots.map((slot) => {
                          const bookingStatus = bookings[slot.id];
                          const spotsLeft = slot.capacity - slot.booked;
                          const utilization = Math.round((slot.booked / slot.capacity) * 100);
                          const isFull = spotsLeft === 0;
                          const isAlmostFull = spotsLeft <= 3 && spotsLeft > 0;
                          
                          // Admin-specific styling based on capacity
                          const slotAccentClass = isAdmin
                            ? isFull
                              ? 'border-red-500/70 bg-red-500/10'
                              : isAlmostFull
                                ? 'border-yellow-500/70 bg-yellow-500/10'
                                : 'border-emerald-500/70 bg-emerald-500/10'
                            : bookingStatus === 'confirmed'
                              ? 'border-[#ff6b35]/70 bg-[#ff6b35]/10'
                              : bookingStatus === 'waitlisted'
                                ? 'border-[#7a33ff]/70 bg-[#7a33ff]/10'
                                : 'border-[#262626] bg-[#181818]';
                          
                          return (
                            <div
                              key={slot.id}
                              className={`rounded-xl border px-3 py-3 text-sm transition-colors ${slotAccentClass} ${isAdmin ? 'cursor-pointer hover:opacity-80' : ''}`}
                              onClick={isAdmin ? () => handleEditClass(slot) : undefined}
                            >
                              <div className="flex items-center justify-between gap-2 text-[#eeeeee]">
                                <span className="font-semibold">{slot.type}</span>
                                <span className="text-xs text-gray-400">
                                  {formatTime(slot.startTime)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-400 mt-1">{slot.trainerName}</p>
                              {isAdmin ? (
                                <div className="mt-2 space-y-1">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-400">Capacity:</span>
                                    <span className={`font-semibold ${
                                      isFull ? 'text-red-400' : isAlmostFull ? 'text-yellow-400' : 'text-emerald-400'
                                    }`}>
                                      {slot.booked}/{slot.capacity} ({utilization}%)
                                    </span>
                                  </div>
                                  {slot.waitlist > 0 && (
                                    <div className="flex items-center justify-between text-xs">
                                      <span className="text-gray-400">Waitlist:</span>
                                      <span className="text-secondary-400 font-semibold">{slot.waitlist}</span>
                                    </div>
                                  )}
                                  {slot.location && (
                                    <p className="text-xs text-gray-500 mt-1">{slot.location}</p>
                                  )}
                                  <div className="flex gap-1 mt-2 pt-2 border-t border-gray-700/50">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditClass(slot);
                                      }}
                                      className="flex-1 px-2 py-1 text-xs bg-primary-500/20 text-primary-200 border border-primary-500 hover:bg-primary-500/30 rounded transition-colors"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClass(slot.id);
                                      }}
                                      className="px-2 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors border border-gray-700 hover:border-red-500/30"
                                    >
                                      <TrashIcon className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                bookingStatus && (
                                  <span
                                    className={`mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                      bookingStatus === 'confirmed'
                                        ? 'bg-[#ff6b35]/15 text-[#ff6b35]'
                                        : 'bg-[#7a33ff]/15 text-[#d4bbff]'
                                    }`}
                                  >
                                    {bookingStatus === 'confirmed' ? 'Booked' : 'Waitlisted'}
                                  </span>
                                )
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Booking Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title={selectedSlot ? `Book ${selectedSlot.type}` : 'Book Class'}
      >
        {selectedSlot && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-300 mb-1">Trainer</p>
              <p className="font-semibold text-white">{selectedSlot.trainerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-300 mb-1">Time</p>
              <p className="font-semibold text-white">
                {formatDate(selectedSlot.startTime)} at {formatTime(selectedSlot.startTime)} -{' '}
                {formatTime(selectedSlot.endTime)}
              </p>
            </div>
            {selectedSlot.location && (
              <div>
                <p className="text-sm text-gray-300 mb-1">Location</p>
                <p className="font-semibold text-white">{selectedSlot.location}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-300 mb-1">Availability</p>
              <p className="font-semibold text-white">
                {selectedSlot.capacity - selectedSlot.booked} of {selectedSlot.capacity} spots
                available
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setIsBookingModalOpen(false)}
              >
                Cancel
              </Button>
              <Button fullWidth onClick={confirmBooking}>
                {selectedSlot.capacity - selectedSlot.booked > 0 ? 'Confirm Booking' : 'Join Waitlist'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Class Modal */}
      <Modal
        isOpen={isCreateClassModalOpen}
        onClose={() => setIsCreateClassModalOpen(false)}
        title="Create New Class"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Class Category</label>
            <select
              value={classFormData.type}
              onChange={(e) => setClassFormData({ ...classFormData, type: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select category</option>
              {CLASS_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Trainer</label>
            <select
              value={classFormData.trainerId}
              onChange={(e) => handleTrainerChange(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select trainer</option>
              {MOCK_TRAINERS.map((trainer) => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
              <Input
                type="date"
                value={classFormData.startDate}
                onChange={(e) => setClassFormData({ ...classFormData, startDate: e.target.value })}
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Capacity</label>
              <Input
                type="number"
                value={classFormData.capacity}
                onChange={(e) => setClassFormData({ ...classFormData, capacity: parseInt(e.target.value) || 20 })}
                min="1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
              <Input
                type="time"
                value={classFormData.startTime}
                onChange={(e) => setClassFormData({ ...classFormData, startTime: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">End Time</label>
              <Input
                type="time"
                value={classFormData.endTime}
                onChange={(e) => setClassFormData({ ...classFormData, endTime: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
            <Input
              value={classFormData.location}
              onChange={(e) => setClassFormData({ ...classFormData, location: e.target.value })}
              placeholder="e.g., Main Studio"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={classFormData.description}
              onChange={(e) => setClassFormData({ ...classFormData, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows={3}
              placeholder="Class description..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setIsCreateClassModalOpen(false)}
            >
              Cancel
            </Button>
            <Button fullWidth onClick={handleCreateClass}>
              Create Class
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Class Modal */}
      <Modal
        isOpen={isEditClassModalOpen}
        onClose={() => {
          setIsEditClassModalOpen(false);
          setEditingSlot(null);
        }}
        title="Edit Class"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Class Category</label>
            <select
              value={classFormData.type}
              onChange={(e) => setClassFormData({ ...classFormData, type: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {CLASS_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Trainer</label>
            <select
              value={classFormData.trainerId}
              onChange={(e) => handleTrainerChange(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {MOCK_TRAINERS.map((trainer) => (
                <option key={trainer.id} value={trainer.id}>
                  {trainer.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
              <Input
                type="date"
                value={classFormData.startDate}
                onChange={(e) => setClassFormData({ ...classFormData, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Capacity</label>
              <Input
                type="number"
                value={classFormData.capacity}
                onChange={(e) => setClassFormData({ ...classFormData, capacity: parseInt(e.target.value) || 20 })}
                min="1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
              <Input
                type="time"
                value={classFormData.startTime}
                onChange={(e) => setClassFormData({ ...classFormData, startTime: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">End Time</label>
              <Input
                type="time"
                value={classFormData.endTime}
                onChange={(e) => setClassFormData({ ...classFormData, endTime: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
            <Input
              value={classFormData.location}
              onChange={(e) => setClassFormData({ ...classFormData, location: e.target.value })}
              placeholder="e.g., Main Studio"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              value={classFormData.description}
              onChange={(e) => setClassFormData({ ...classFormData, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows={3}
              placeholder="Class description..."
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                setIsEditClassModalOpen(false);
                setEditingSlot(null);
              }}
            >
              Cancel
            </Button>
            <Button fullWidth onClick={handleUpdateClass}>
              Update Class
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Class Confirmation Modal */}
      <Modal
        isOpen={isDeleteClassModalOpen}
        onClose={() => {
          setIsDeleteClassModalOpen(false);
          setDeletingSlot(null);
        }}
        title="Delete Class"
        size="md"
      >
        {deletingSlot && (
          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400 font-semibold mb-2">Warning: This action cannot be undone</p>
              <p className="text-gray-300 text-sm">
                Are you sure you want to delete the <span className="font-semibold text-white">{deletingSlot.type}</span> class?
              </p>
              {deletingSlot.booked > 0 && (
                <p className="text-yellow-400 text-sm mt-2">
                  This class has {deletingSlot.booked} {deletingSlot.booked === 1 ? 'booking' : 'bookings'}. 
                  All bookings will be cancelled.
                </p>
              )}
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setIsDeleteClassModalOpen(false);
                  setDeletingSlot(null);
                }}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                onClick={confirmDeleteClass}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Delete Class
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

