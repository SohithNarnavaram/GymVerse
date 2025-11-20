import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import type { Slot } from '@/types';

export default function TrainerDashboard() {
  const { showToast } = useToast();
  const [todayClasses, setTodayClasses] = useState<Slot[]>([]);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    // Mock today's classes
    const mockClasses: Slot[] = [
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
      },
      {
        id: '2',
        type: 'Pilates',
        trainerId: 't1',
        trainerName: 'Sarah Johnson',
        capacity: 15,
        booked: 10,
        waitlist: 0,
        startTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        location: 'Studio A',
      },
    ];
    setTodayClasses(mockClasses);
  }, []);

  const mockAttendees = [
    { id: '1', name: 'John Doe', checkedIn: true },
    { id: '2', name: 'Jane Smith', checkedIn: true },
    { id: '3', name: 'Bob Johnson', checkedIn: false },
  ];

  const handleQuickCheckIn = (_memberId: string) => {
    showToast({
      variant: 'success',
      title: 'Checked in',
      description: 'Member successfully checked in',
    });
  };

  const handleAddNote = () => {
    setIsNoteModalOpen(true);
  };

  const saveNote = () => {
    if (!noteContent.trim()) return;
    showToast({
      variant: 'success',
      title: 'Note saved',
      description: 'Note has been added successfully',
    });
    setIsNoteModalOpen(false);
    setNoteContent('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Trainer Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage your classes and members</p>
      </div>

      {/* Today's Classes */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Classes</h2>
        <div className="space-y-4">
          {todayClasses.map((classItem) => (
            <Card key={classItem.id}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{classItem.type}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {format(new Date(classItem.startTime), 'HH:mm')} -{' '}
                    {format(new Date(classItem.endTime), 'HH:mm')}
                  </p>
                  <p className="text-sm text-gray-600">{classItem.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {classItem.booked}/{classItem.capacity} attendees
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Attendees</h4>
                <div className="space-y-2">
                  {mockAttendees.map((attendee) => (
                    <div
                      key={attendee.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-900">{attendee.name}</span>
                      <div className="flex items-center gap-2">
                        {!attendee.checkedIn && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuickCheckIn(attendee.id)}
                          >
                            Check In
                          </Button>
                        )}
                        {attendee.checkedIn && (
                          <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                            Checked in
                          </span>
                        )}
                        <Button size="sm" variant="ghost" onClick={handleAddNote}>
                          Add Note
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Note Modal */}
      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false);
          setNoteContent('');
        }}
        title="Add Note"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Note"
            as="textarea"
            rows={4}
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Add notes about this member..."
          />
          <div className="flex gap-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                setIsNoteModalOpen(false);
                setNoteContent('');
              }}
            >
              Cancel
            </Button>
            <Button fullWidth onClick={saveNote}>
              Save Note
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

