import { useState, useEffect } from 'react';
import { format, isToday, isTomorrow, addDays, isSameDay } from 'date-fns';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { useToast } from '@/components/ui/Toast';
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

export default function Classes() {
  const { showToast } = useToast();
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [bookings, setBookings] = useState<Record<string, 'confirmed' | 'waitlisted'>>({});
  const [latestBooking, setLatestBooking] = useState<{ slot: Slot; status: 'confirmed' | 'waitlisted' } | null>(null);

  useEffect(() => {
    // Mock slots data
    const mockSlots: Slot[] = [
      {
        id: '1',
        type: 'Yoga',
        trainerId: 't1',
        trainerName: 'Sarah Johnson',
        capacity: 20,
        booked: 12,
        waitlist: 0,
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
        location: 'Studio A',
        description: 'Gentle flow yoga for all levels',
      },
      {
        id: '2',
        type: 'HIIT',
        trainerId: 't2',
        trainerName: 'Alex Rivera',
        capacity: 20,
        booked: 18,
        waitlist: 2,
        startTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString(),
        location: 'Studio B',
        description: 'High-intensity interval training',
      },
      {
        id: '3',
        type: 'Boxing',
        trainerId: 't3',
        trainerName: 'Mike Chen',
        capacity: 15,
        booked: 8,
        waitlist: 0,
        startTime: addDays(new Date(), 1).toISOString(),
        endTime: addDays(new Date(), 1).toISOString(),
        location: 'Boxing Ring',
        description: 'Boxing fundamentals and conditioning',
      },
      {
        id: '4',
        type: 'Dance',
        trainerId: 't4',
        trainerName: 'Emma Davis',
        capacity: 25,
        booked: 22,
        waitlist: 5,
        startTime: addDays(new Date(), 1).toISOString(),
        endTime: addDays(new Date(), 1).toISOString(),
        location: 'Dance Studio',
        description: 'Fun and energetic dance workout',
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Classes</h1>
          <p className="mt-2 text-gray-300 font-medium">Book your favorite workouts</p>
        </div>
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

      {view === 'list' ? (
        <div className="space-y-4">
          {slots.map((slot) => {
            const spotsLeft = slot.capacity - slot.booked;
            const isAlmostFull = spotsLeft <= 3 && spotsLeft > 0;
            const isFull = spotsLeft === 0;

            return (
              <Card key={slot.id} className="bg-[#171717] border border-[#252525] hover:border-primary-500/30 transition-colors" hover>
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
                      <Button
                        onClick={() => handleBook(slot)}
                        disabled={isFull && slot.waitlist > 10}
                        fullWidth
                      >
                        {isFull ? 'Join Waitlist' : 'Book Now'}
                      </Button>
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
                  Booked sessions show up below with confirmation status.
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setView('list')}>
                Switch to List View
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 7 }, (_, index) => addDays(new Date(), index)).map((day) => {
                const daySlots = slots.filter((slot) => isSameDay(new Date(slot.startTime), day));
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
                          const slotAccentClass =
                            bookingStatus === 'confirmed'
                              ? 'border-[#ff6b35]/70 bg-[#ff6b35]/10'
                              : bookingStatus === 'waitlisted'
                                ? 'border-[#7a33ff]/70 bg-[#7a33ff]/10'
                                : 'border-[#262626] bg-[#181818]';
                          const pillAccentClass =
                            bookingStatus === 'confirmed'
                              ? 'bg-[#ff6b35]/15 text-[#ff6b35]'
                              : 'bg-[#7a33ff]/15 text-[#d4bbff]';
                          return (
                            <div
                              key={slot.id}
                              className={`rounded-xl border px-3 py-3 text-sm transition-colors ${slotAccentClass}`}
                            >
                              <div className="flex items-center justify-between gap-2 text-[#eeeeee]">
                                <span className="font-semibold">{slot.type}</span>
                                <span className="text-xs text-gray-400">
                                  {formatTime(slot.startTime)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-400 mt-1">{slot.trainerName}</p>
                              {bookingStatus && (
                                <span
                                  className={`mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${pillAccentClass}`}
                                >
                                  {bookingStatus === 'confirmed' ? 'Booked' : 'Waitlisted'}
                                </span>
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
    </div>
  );
}

