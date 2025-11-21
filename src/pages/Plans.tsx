import { useState, useEffect } from 'react';
import { TrashIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { useAuthStore } from '@/store/authStore';
import type { MembershipPlan } from '@/types';

export default function Plans() {
  const { showToast } = useToast();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  
  // Admin modals
  const [isCreatePlanModalOpen, setIsCreatePlanModalOpen] = useState(false);
  const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState(false);
  const [isDeletePlanModalOpen, setIsDeletePlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<MembershipPlan | null>(null);
  const [planFormData, setPlanFormData] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'INR',
    duration: '',
    features: '',
    popular: false,
  });

  useEffect(() => {
    // Mock plans data
    const mockPlans: MembershipPlan[] = [
      {
        id: '1',
        name: 'Basic',
        description: 'Perfect for beginners',
        price: 2999,
        currency: 'INR',
        duration: 30, // days
        features: ['Access to all classes', 'Basic equipment', 'Mobile app access'],
        popular: false,
      },
      {
        id: '2',
        name: 'Premium',
        description: 'Most popular choice',
        price: 5999,
        currency: 'INR',
        duration: 30,
        features: [
          'Unlimited classes',
          'Premium equipment',
          'Personal trainer sessions',
          'Nutrition guidance',
          'Priority booking',
        ],
        popular: true,
      },
      {
        id: '3',
        name: 'Elite',
        description: 'Ultimate fitness experience',
        price: 9999,
        currency: 'INR',
        duration: 30,
        features: [
          'Everything in Premium',
          '24/7 access',
          'Locker & towel service',
          'Guest passes',
          'Spa access',
        ],
        popular: false,
      },
    ];
    setPlans(mockPlans);
  }, []);

  // Admin handlers
  const handleCreatePlan = () => {
    const features = planFormData.features
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    if (features.length === 0) {
      showToast({
        variant: 'error',
        title: 'Invalid features',
        description: 'Please add at least one feature',
      });
      return;
    }

    const newPlan: MembershipPlan = {
      id: Date.now().toString(),
      name: planFormData.name,
      description: planFormData.description,
      price: parseFloat(planFormData.price),
      currency: planFormData.currency,
      duration: parseInt(planFormData.duration) || 30,
      features,
      popular: planFormData.popular,
    };

    setPlans([...plans, newPlan]);
    setIsCreatePlanModalOpen(false);
    setPlanFormData({
      name: '',
      description: '',
      price: '',
      currency: 'INR',
      duration: '',
      features: '',
      popular: false,
    });
    showToast({
      variant: 'success',
      title: 'Plan created',
      description: `${newPlan.name} plan has been created successfully`,
    });
  };

  const handleEditPlan = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setPlanFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price.toString(),
      currency: plan.currency,
      duration: plan.duration.toString(),
      features: plan.features.join('\n'),
      popular: plan.popular || false,
    });
    setIsEditPlanModalOpen(true);
  };

  const handleUpdatePlan = () => {
    if (!editingPlan) return;

    const features = planFormData.features
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    if (features.length === 0) {
      showToast({
        variant: 'error',
        title: 'Invalid features',
        description: 'Please add at least one feature',
      });
      return;
    }

    const updatedPlan: MembershipPlan = {
      ...editingPlan,
      name: planFormData.name,
      description: planFormData.description,
      price: parseFloat(planFormData.price),
      currency: planFormData.currency,
      duration: parseInt(planFormData.duration) || 30,
      features,
      popular: planFormData.popular,
    };

    setPlans(plans.map(p => p.id === editingPlan.id ? updatedPlan : p));
    setIsEditPlanModalOpen(false);
    setEditingPlan(null);
    setPlanFormData({
      name: '',
      description: '',
      price: '',
      currency: 'INR',
      duration: '',
      features: '',
      popular: false,
    });
    showToast({
      variant: 'success',
      title: 'Plan updated',
      description: 'Plan information has been updated',
    });
  };

  const handleDeletePlan = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      setDeletingPlan(plan);
      setIsDeletePlanModalOpen(true);
    }
  };

  const confirmDeletePlan = () => {
    if (!deletingPlan) return;
    const planName = deletingPlan.name;
    setPlans(plans.filter(p => p.id !== deletingPlan.id));
    setIsDeletePlanModalOpen(false);
    setDeletingPlan(null);
    showToast({
      variant: 'success',
      title: 'Plan deleted',
      description: `${planName} plan has been removed`,
    });
  };

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Plans</h1>
          <p className="mt-2 text-gray-300 font-medium">View available membership plans</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                plan.popular 
                  ? 'border-[#ff6b35] ring-2 ring-[#ff6b35]/50 shadow-lg shadow-[#ff6b35]/20' 
                  : 'border-[#252525] hover:border-primary-500/50'
              }`}
            >
              {/* Gradient overlay for popular plan */}
              {plan.popular && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b35]/5 via-transparent to-primary-500/5 pointer-events-none" />
              )}
              
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-[#ff6b35]/30">
                    Popular
                  </span>
                </div>
              )}

              <div className="text-center pt-12 pb-6 px-6 relative z-0">
                {/* Plan name with gradient */}
                <h3 className={`text-3xl font-black mb-2 bg-clip-text text-transparent ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-[#ff6b35] to-primary-400' 
                    : 'text-white'
                }`}>
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-400 mb-6">{plan.description}</p>
                
                {/* Price with enhanced styling */}
                <div className="mb-8 relative">
                  <div className={`inline-flex items-baseline ${
                    plan.popular ? 'text-[#ff6b35]' : 'text-primary-400'
                  }`}>
                    <span className="text-5xl font-black">
                      ₹{plan.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-gray-400 ml-2 text-lg">/{plan.duration} days</span>
                  </div>
                  {plan.popular && (
                    <div className="absolute -top-2 -right-2 w-16 h-16 bg-[#ff6b35]/10 rounded-full blur-xl" />
                  )}
                </div>

                {/* Features list with enhanced styling */}
                <ul className="space-y-4 text-left mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start group">
                      <div className={`flex-shrink-0 mr-3 mt-0.5 ${
                        plan.popular ? 'text-[#ff6b35]' : 'text-primary-500'
                      }`}>
                        <svg
                          className="h-5 w-5 group-hover:scale-110 transition-transform"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  fullWidth
                  className={plan.popular ? 'bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] hover:from-[#ff8c5a] hover:to-[#ff6b35]' : ''}
                >
                  Select Plan
                </Button>

                {/* Decorative element */}
                {plan.popular && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff6b35] via-primary-500 to-[#ff6b35]" />
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Membership Plans</h1>
          <p className="mt-2 text-gray-300 font-medium">Manage membership plans and pricing</p>
        </div>
        <Button
          onClick={() => setIsCreatePlanModalOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Create Plan
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
              plan.popular 
                ? 'border-[#ff6b35] ring-2 ring-[#ff6b35]/50 shadow-lg shadow-[#ff6b35]/20' 
                : 'border-[#252525] hover:border-primary-500/50'
            }`}
          >
            {/* Gradient overlay for popular plan */}
            {plan.popular && (
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b35]/5 via-transparent to-primary-500/5 pointer-events-none" />
            )}
            
            {/* Admin controls */}
            <div className="absolute top-3 right-3 flex gap-2 z-10">
              <button
                onClick={() => handleEditPlan(plan)}
                className="p-2 bg-primary-500/20 text-primary-200 border border-primary-500 hover:bg-transparent hover:border-primary-500/50 hover:text-primary-300 rounded-lg transition-colors backdrop-blur-sm"
                title="Edit plan"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDeletePlan(plan.id)}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors border border-gray-700 hover:border-red-500/30 backdrop-blur-sm"
                title="Delete plan"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Popular badge */}
            {plan.popular && (
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-[#ff6b35]/30">
                  Popular
                </span>
              </div>
            )}

            <div className="text-center pt-12 pb-6 px-6 relative z-0">
              {/* Plan name with gradient */}
              <h3 className={`text-3xl font-black mb-2 bg-clip-text text-transparent ${
                plan.popular 
                  ? 'bg-gradient-to-r from-[#ff6b35] to-primary-400' 
                  : 'text-white'
              }`}>
                {plan.name}
              </h3>
              <p className="text-sm text-gray-400 mb-6">{plan.description}</p>
              
              {/* Price with enhanced styling */}
              <div className="mb-8 relative">
                <div className={`inline-flex items-baseline ${
                  plan.popular ? 'text-[#ff6b35]' : 'text-primary-400'
                }`}>
                  <span className="text-5xl font-black">
                    ₹{plan.price}
                  </span>
                  <span className="text-gray-400 ml-2 text-lg">/{plan.duration} days</span>
                </div>
                {plan.popular && (
                  <div className="absolute -top-2 -right-2 w-16 h-16 bg-[#ff6b35]/10 rounded-full blur-xl" />
                )}
              </div>

              {/* Features list with enhanced styling */}
              <ul className="space-y-4 text-left mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start group">
                    <div className={`flex-shrink-0 mr-3 mt-0.5 ${
                      plan.popular ? 'text-[#ff6b35]' : 'text-primary-500'
                    }`}>
                      <svg
                        className="h-5 w-5 group-hover:scale-110 transition-transform"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Decorative element */}
              {plan.popular && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff6b35] via-primary-500 to-[#ff6b35]" />
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Create Plan Modal */}
      <Modal
        isOpen={isCreatePlanModalOpen}
        onClose={() => setIsCreatePlanModalOpen(false)}
        title="Create New Plan"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Plan Name</label>
            <Input
              value={planFormData.name}
              onChange={(e) => setPlanFormData({ ...planFormData, name: e.target.value })}
              placeholder="e.g., Premium"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <Input
              value={planFormData.description}
              onChange={(e) => setPlanFormData({ ...planFormData, description: e.target.value })}
              placeholder="Brief description of the plan"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Price (₹)</label>
              <Input
                type="number"
                step="1"
                value={planFormData.price}
                onChange={(e) => setPlanFormData({ ...planFormData, price: e.target.value })}
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Duration (days)</label>
              <Input
                type="number"
                value={planFormData.duration}
                onChange={(e) => setPlanFormData({ ...planFormData, duration: e.target.value })}
                placeholder="30"
                min="1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
            <select
              value={planFormData.currency}
              onChange={(e) => setPlanFormData({ ...planFormData, currency: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Features (one per line)</label>
            <textarea
              value={planFormData.features}
              onChange={(e) => setPlanFormData({ ...planFormData, features: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows={5}
              placeholder="Access to all classes&#10;Premium equipment&#10;Personal trainer sessions"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="popular"
              checked={planFormData.popular}
              onChange={(e) => setPlanFormData({ ...planFormData, popular: e.target.checked })}
              className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-primary-500 focus:ring-primary-500 focus:ring-offset-gray-900"
            />
            <label htmlFor="popular" className="ml-2 text-sm text-gray-300">
              Mark as popular plan
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setIsCreatePlanModalOpen(false)}
            >
              Cancel
            </Button>
            <Button fullWidth onClick={handleCreatePlan}>
              Create Plan
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Plan Modal */}
      <Modal
        isOpen={isEditPlanModalOpen}
        onClose={() => {
          setIsEditPlanModalOpen(false);
          setEditingPlan(null);
        }}
        title="Edit Plan"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Plan Name</label>
            <Input
              value={planFormData.name}
              onChange={(e) => setPlanFormData({ ...planFormData, name: e.target.value })}
              placeholder="e.g., Premium"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <Input
              value={planFormData.description}
              onChange={(e) => setPlanFormData({ ...planFormData, description: e.target.value })}
              placeholder="Brief description of the plan"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Price (₹)</label>
              <Input
                type="number"
                step="1"
                value={planFormData.price}
                onChange={(e) => setPlanFormData({ ...planFormData, price: e.target.value })}
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Duration (days)</label>
              <Input
                type="number"
                value={planFormData.duration}
                onChange={(e) => setPlanFormData({ ...planFormData, duration: e.target.value })}
                placeholder="30"
                min="1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
            <select
              value={planFormData.currency}
              onChange={(e) => setPlanFormData({ ...planFormData, currency: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Features (one per line)</label>
            <textarea
              value={planFormData.features}
              onChange={(e) => setPlanFormData({ ...planFormData, features: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows={5}
              placeholder="Access to all classes&#10;Premium equipment&#10;Personal trainer sessions"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="edit-popular"
              checked={planFormData.popular}
              onChange={(e) => setPlanFormData({ ...planFormData, popular: e.target.checked })}
              className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-primary-500 focus:ring-primary-500 focus:ring-offset-gray-900"
            />
            <label htmlFor="edit-popular" className="ml-2 text-sm text-gray-300">
              Mark as popular plan
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                setIsEditPlanModalOpen(false);
                setEditingPlan(null);
              }}
            >
              Cancel
            </Button>
            <Button fullWidth onClick={handleUpdatePlan}>
              Update Plan
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Plan Confirmation Modal */}
      <Modal
        isOpen={isDeletePlanModalOpen}
        onClose={() => {
          setIsDeletePlanModalOpen(false);
          setDeletingPlan(null);
        }}
        title="Delete Plan"
        size="md"
      >
        {deletingPlan && (
          <div className="space-y-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-red-400 font-semibold mb-2">Warning: This action cannot be undone</p>
              <p className="text-gray-300 text-sm">
                Are you sure you want to delete the <span className="font-semibold text-white">{deletingPlan.name}</span> plan?
              </p>
              <p className="text-yellow-400 text-sm mt-2">
                Members currently on this plan may be affected.
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setIsDeletePlanModalOpen(false);
                  setDeletingPlan(null);
                }}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                onClick={confirmDeletePlan}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Delete Plan
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

