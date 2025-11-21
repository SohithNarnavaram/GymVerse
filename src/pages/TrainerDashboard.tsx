import { useState } from 'react';
import {
  MapPinIcon,
  ClipboardIcon,
  UserPlusIcon,
  SparklesIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { useToast } from '@/components/ui/Toast';
import { useAuthStore } from '@/store/authStore';

interface AssignedMember {
  id: string;
  name: string;
  goal: string;
  plan: 'Basic' | 'Premium' | 'Elite';
  status: 'on-track' | 'attention' | 'new';
  nextSession: string;
}

interface ControlTask {
  id: string;
  title: string;
  detail: string;
  due: string;
  completed: boolean;
}

const initialMembers: AssignedMember[] = [
  {
    id: 'm1',
    name: 'Priya Sharma',
    goal: 'Weight loss & flexibility',
    plan: 'Premium',
    status: 'on-track',
    nextSession: 'Today • 6:00 PM',
  },
  {
    id: 'm2',
    name: 'Arjun Patel',
    goal: 'Strength & conditioning',
    plan: 'Elite',
    status: 'attention',
    nextSession: 'Tomorrow • 7:30 AM',
  },
  {
    id: 'm3',
    name: 'Sonia Mehra',
    goal: 'Posture correction',
    plan: 'Basic',
    status: 'new',
    nextSession: 'Fri • 5:00 PM',
  },
];

const initialTasks: ControlTask[] = [
  {
    id: 't1',
    title: 'Update Monday HIIT plan',
    detail: 'Refresh progressions for advanced group',
    due: 'Today',
    completed: false,
  },
  {
    id: 't2',
    title: 'Share nutrition guide with Priya',
    detail: 'Attach week 3 macro plan',
    due: 'Tomorrow',
    completed: false,
  },
  {
    id: 't3',
    title: 'Review new member assessments',
    detail: '2 assessments pending approval',
    due: 'This week',
    completed: false,
  },
];

export default function TrainerDashboard() {
  const { user } = useAuthStore();
  const { showToast } = useToast();
  const [members] = useState<AssignedMember[]>(initialMembers);
  const [tasks, setTasks] = useState<ControlTask[]>(initialTasks);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  const handleTaskToggle = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const handleAddNote = () => {
    if (!noteContent.trim()) return;
    showToast({
      variant: 'success',
      title: 'Note saved',
      description: 'Your note has been saved to your control panel.',
    });
    setNoteContent('');
    setIsNoteModalOpen(false);
  };

  const getStatusTag = (status: AssignedMember['status']) => {
    switch (status) {
      case 'on-track':
        return 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20';
      case 'attention':
        return 'bg-amber-500/15 text-amber-300 border border-amber-500/20';
      case 'new':
      default:
        return 'bg-primary-500/15 text-primary-200 border border-primary-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Trainer Control Panel</h1>
        <p className="mt-2 text-gray-300 font-medium">
          Manage your profile, members, and daily operations
        </p>
      </div>

      {/* Profile & Overview */}
      <Card className="bg-[#0a0a0a] border border-[#252525]">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-4 flex-1">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80"
              alt="Trainer avatar"
              wrapperClassName="h-20 w-20 rounded-2xl border border-white/10 shadow-lg shadow-black/40"
            />
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500">
                {user?.role === 'trainer' ? 'Lead Trainer' : 'Trainer'}
              </p>
              <h2 className="text-2xl font-bold text-white">{user?.name || 'Trainer'}</h2>
              <p className="text-sm text-gray-400">
                Strength • Mobility • Performance Coaching
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-3">
                <span className="inline-flex items-center gap-1">
                  <SparklesIcon className="h-4 w-4 text-primary-400" />
                  8 yrs experience
                </span>
                <span className="inline-flex items-center gap-1">
                  <ClipboardIcon className="h-4 w-4 text-secondary-400" />
                  ACE & CrossFit L2
                </span>
                <span className="inline-flex items-center gap-1">
                  <ArrowPathIcon className="h-4 w-4 text-emerald-400" />
                  Avg rating 4.9/5
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4" />
              Update availability
            </Button>
            <Button>
              Edit profile
            </Button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 mt-6">
          {[
            { label: 'Active clients', value: '18', sub: '+3 this month' },
            { label: 'Weekly sessions', value: '32', sub: '4 group slots open' },
            { label: 'Avg attendance', value: '92%', sub: 'Consistent' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-[#1f1f1f] bg-[#121212] p-4">
              <p className="text-sm text-gray-400">{item.label}</p>
              <p className="text-2xl font-black text-white mt-2">{item.value}</p>
              <p className="text-xs text-gray-500 mt-1">{item.sub}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick controls */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: 'Schedule manager',
            detail: 'Adjust class slots & waitlists',
            action: 'Edit schedule',
            href: '/classes',
          },
          {
            title: 'Member onboarding',
            detail: 'Approve assessments & plans',
            action: 'Review requests',
            href: '/admin',
          },
          {
            title: 'Resource library',
            detail: 'Upload programs & assets',
            action: 'Add resource',
            href: '/store',
          },
          {
            title: 'Broadcast update',
            detail: 'Notify members about changes',
            action: 'Send update',
            href: '/check-in',
          },
        ].map((item) => (
          <Card
            key={item.title}
            className="bg-[#0a0a0a] border border-[#252525] hover:border-primary-500/40 transition-colors cursor-pointer"
          >
            <div className="flex flex-col h-full">
              <UserPlusIcon className="h-6 w-6 text-primary-400 mb-3" />
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-gray-400 mt-1 flex-1">{item.detail}</p>
              <a href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4 text-primary-300 hover:text-white"
                >
                  {item.action}
                </Button>
              </a>
            </div>
          </Card>
        ))}
      </div>

      {/* Members management */}
      <Card className="bg-[#0a0a0a] border border-[#252525]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Members under you</h2>
            <p className="text-sm text-gray-400">Quick view on progress & next sessions</p>
          </div>
          <Button variant="outline" size="sm">
            View all members
          </Button>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-[#1f1f1f]">
          <table className="w-full text-sm">
            <thead className="bg-[#111111] text-gray-400 uppercase tracking-wide text-xs">
              <tr>
                <th className="text-left py-3 px-4">Member</th>
                <th className="text-left py-3 px-4">Goal</th>
                <th className="text-left py-3 px-4">Plan</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Next session</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f1f1f]">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-[#111111] transition-colors">
                  <td className="py-3 px-4 text-white font-medium">{member.name}</td>
                  <td className="py-3 px-4 text-gray-300">{member.goal}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-2 text-gray-200">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            member.plan === 'Elite'
                              ? '#FAB12F'
                              : member.plan === 'Premium'
                                ? '#E83C91'
                                : '#CBCBCB',
                        }}
                      />
                      {member.plan}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusTag(member.status)}`}
                    >
                      {member.status === 'on-track'
                        ? 'On track'
                        : member.status === 'attention'
                          ? 'Needs attention'
                          : 'New member'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-300">{member.nextSession}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Button variant="outline" size="sm">
                        View profile
                      </Button>
                      <Button
                        size="sm"
                        className="bg-primary-500/20 text-primary-100 border border-primary-500 hover:bg-primary-500/30"
                        onClick={() => setIsNoteModalOpen(true)}
                      >
                        Add note
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Tasks & Resources */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-[#0a0a0a] border border-[#252525]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Task centre</h2>
            <Button variant="ghost" size="sm" onClick={() => setTasks(initialTasks)}>
              Reset list
            </Button>
          </div>
          <div className="space-y-3">
            {tasks.map((task) => (
              <label
                key={task.id}
                className={`flex items-start gap-3 rounded-2xl border border-[#1f1f1f] p-4 cursor-pointer transition-all ${
                  task.completed ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-[#121212]'
                }`}
              >
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-gray-600 bg-transparent text-primary-500"
                  checked={task.completed}
                  onChange={() => handleTaskToggle(task.id)}
                />
                <div>
                  <p className="text-white font-medium">{task.title}</p>
                  <p className="text-sm text-gray-400">{task.detail}</p>
                  <p className="text-xs text-gray-500 mt-1">Due: {task.due}</p>
                </div>
              </label>
            ))}
          </div>
        </Card>

        <Card className="bg-[#0a0a0a] border border-[#252525]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Notes & resources</h2>
            <Button size="sm" onClick={() => setIsNoteModalOpen(true)}>
              Add note
            </Button>
          </div>
          <div className="space-y-4">
            {[
              {
                title: 'Mobility warm-up sequence',
                updated: 'Updated 2 days ago',
                tags: ['PDF', 'Warm-up'],
              },
              {
                title: 'Elite strength block - Week 4',
                updated: 'Shared last week',
                tags: ['Program', 'Strength'],
              },
              {
                title: 'Nutrition talking points',
                updated: 'Draft',
                tags: ['Communication'],
              },
            ].map((resource) => (
              <div
                key={resource.title}
                className="rounded-2xl border border-[#1f1f1f] bg-[#121212] p-4 flex items-start justify-between"
              >
                <div>
                  <h3 className="text-white font-semibold">{resource.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{resource.updated}</p>
                  <div className="flex gap-2 mt-3">
                    {resource.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Open
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false);
          setNoteContent('');
        }}
        title="Add trainer note"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Note"
            as="textarea"
            rows={5}
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Add details about a member, class idea, or operational update..."
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
            <Button fullWidth onClick={handleAddNote}>
              Save note
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

