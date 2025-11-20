import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';

export default function AdminDashboard() {
  const { showToast } = useToast();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportType, setExportType] = useState<'classes' | 'members' | 'sales'>('members');

  const metrics = [
    { label: 'Total Members', value: '1,234', change: '+12%', positive: true },
    { label: 'Active Classes', value: '48', change: '+5', positive: true },
    { label: 'Today\'s Check-ins', value: '156', change: '+8%', positive: true },
    { label: 'Monthly Revenue', value: '$45,678', change: '+15%', positive: true },
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your gym operations</p>
        </div>
        <Button onClick={() => setIsExportModalOpen(true)}>Export Data</Button>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            <p
              className={`text-sm mt-2 ${
                metric.positive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {metric.change}
            </p>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card hover className="cursor-pointer">
          <h3 className="font-semibold text-gray-900 mb-2">Manage Classes</h3>
          <p className="text-sm text-gray-600 mb-4">
            Create, edit, and manage class schedules
          </p>
          <Button variant="outline" size="sm" fullWidth>
            Manage
          </Button>
        </Card>

        <Card hover className="cursor-pointer">
          <h3 className="font-semibold text-gray-900 mb-2">Manage Plans</h3>
          <p className="text-sm text-gray-600 mb-4">
            Update membership plans and pricing
          </p>
          <Button variant="outline" size="sm" fullWidth>
            Manage
          </Button>
        </Card>

        <Card hover className="cursor-pointer">
          <h3 className="font-semibold text-gray-900 mb-2">Manage Products</h3>
          <p className="text-sm text-gray-600 mb-4">
            Update store inventory and products
          </p>
          <Button variant="outline" size="sm" fullWidth>
            Manage
          </Button>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { action: 'New member registered', time: '2 minutes ago' },
            { action: 'Class booking cancelled', time: '15 minutes ago' },
            { action: 'Product order placed', time: '1 hour ago' },
            { action: 'New class created', time: '2 hours ago' },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span className="text-sm text-gray-900">{activity.action}</span>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Export Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Data"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Type
            </label>
            <select
              value={exportType}
              onChange={(e) => setExportType(e.target.value as typeof exportType)}
              className="input"
            >
              <option value="members">Members</option>
              <option value="classes">Classes</option>
              <option value="sales">Sales</option>
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
    </div>
  );
}

