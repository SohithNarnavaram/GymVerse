import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { useToast } from '@/components/ui/Toast';
import type { AttendanceRecord } from '@/types';

const CHECKIN_VISUALS = {
  qr: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&w=500&q=80',
  manual: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=500&q=80',
};

export default function CheckIn() {
  const { showToast } = useToast();
  const [checkInMethod, setCheckInMethod] = useState<'qr' | 'manual' | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    // Mock attendance history
    const mockHistory: AttendanceRecord[] = [
      {
        id: '1',
        userId: '1',
        slotId: '1',
        checkedInAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        method: 'qr',
        slot: {
          id: '1',
          type: 'Yoga',
          trainerId: 't1',
          trainerName: 'Sarah Johnson',
          capacity: 20,
          booked: 12,
          waitlist: 0,
          startTime: '',
          endTime: '',
        },
      },
      {
        id: '2',
        userId: '1',
        slotId: '2',
        checkedInAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        method: 'manual',
        slot: {
          id: '2',
          type: 'HIIT',
          trainerId: 't2',
          trainerName: 'Alex Rivera',
          capacity: 20,
          booked: 18,
          waitlist: 0,
          startTime: '',
          endTime: '',
        },
      },
    ];
    setAttendanceHistory(mockHistory);
  }, []);

  const handleQRScan = () => {
    setCheckInMethod('qr');
    setIsScanning(true);

    // Mock QR scan
    setTimeout(() => {
      setIsScanning(false);
      const newRecord: AttendanceRecord = {
        id: Date.now().toString(),
        userId: '1',
        slotId: '1',
        checkedInAt: new Date().toISOString(),
        method: 'qr',
      };
      setAttendanceHistory([newRecord, ...attendanceHistory]);
      showToast({
        variant: 'success',
        title: 'Checked in!',
        description: "You're all set — enjoy your workout!",
      });
      setCheckInMethod(null);
    }, 2000);
  };

  const handleManualCheckIn = () => {
    setCheckInMethod('manual');
  };

  const confirmManualCheckIn = () => {
    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      userId: '1',
      slotId: '1',
      checkedInAt: new Date().toISOString(),
      method: 'manual',
    };
    setAttendanceHistory([newRecord, ...attendanceHistory]);
    showToast({
      variant: 'success',
      title: 'Checked in!',
      description: "You're all set — enjoy your workout!",
    });
    setCheckInMethod(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Check In</h1>
        <p className="mt-2 text-gray-300 font-medium">Scan QR code or check in manually</p>
      </div>

      {/* Check-in Options */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card hover className="text-center cursor-pointer bg-[#0a0a0a] border border-[#252525]" onClick={handleQRScan}>
          <div className="mb-4">
            <ImageWithFallback
              src={CHECKIN_VISUALS.qr}
              alt="Scan QR code"
              wrapperClassName="w-20 h-20 mx-auto rounded-2xl border border-white/10 shadow-lg shadow-black/40"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Scan QR Code</h3>
          <p className="text-sm text-gray-300">Quick and easy check-in</p>
        </Card>

        <Card hover className="text-center cursor-pointer bg-[#0a0a0a] border border-[#252525]" onClick={handleManualCheckIn}>
          <div className="mb-4">
            <ImageWithFallback
              src={CHECKIN_VISUALS.manual}
              alt="Manual check-in"
              wrapperClassName="w-20 h-20 mx-auto rounded-2xl border border-white/10 shadow-lg shadow-black/40"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Manual Check-in</h3>
          <p className="text-sm text-gray-300">Check in with trainer</p>
        </Card>
      </div>

      {/* QR Scanner Modal */}
      <Modal
        isOpen={checkInMethod === 'qr'}
        onClose={() => {
          setCheckInMethod(null);
          setIsScanning(false);
        }}
        title="Scan QR Code"
        size="sm"
      >
        <div className="space-y-4">
          {isScanning ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mb-4" />
              <p className="text-gray-300">Scanning QR code...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-900 rounded-lg p-4 text-center border border-gray-800">
                <ImageWithFallback
                  src={CHECKIN_VISUALS.qr}
                  alt="QR guidance"
                  wrapperClassName="w-full h-64 rounded-2xl border border-white/10"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-sm text-center text-gray-300">
                Position the QR code within the frame
              </p>
              <Button fullWidth onClick={handleQRScan}>
                Start Scanning
              </Button>
            </div>
          )}
        </div>
      </Modal>

      {/* Manual Check-in Modal */}
      <Modal
        isOpen={checkInMethod === 'manual'}
        onClose={() => setCheckInMethod(null)}
        title="Manual Check-in"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-300">
            Please confirm with your trainer to complete check-in.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" fullWidth onClick={() => setCheckInMethod(null)}>
              Cancel
            </Button>
            <Button fullWidth onClick={confirmManualCheckIn}>
              Confirm Check-in
            </Button>
          </div>
        </div>
      </Modal>

      {/* Attendance History */}
      <div>
        <h2 className="text-xl font-black text-white mb-4 tracking-tight">Recent Check-ins</h2>
        <div className="space-y-3">
            {attendanceHistory.length === 0 ? (
            <Card className="bg-[#0a0a0a] border border-[#252525]">
              <p className="text-center text-gray-400 py-8">No check-ins yet</p>
            </Card>
          ) : (
            attendanceHistory.map((record) => (
              <Card key={record.id} className="bg-[#0a0a0a] border border-[#252525]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white">
                      {record.slot?.type || 'Class'}
                    </h3>
                    <p className="text-sm text-gray-300 mt-1">
                      {format(new Date(record.checkedInAt), 'MMM dd, yyyy • HH:mm')}
                    </p>
                    <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-gray-900 text-gray-300 border border-gray-800">
                      {record.method === 'qr' ? 'QR Code' : 'Manual'}
                    </span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

