import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';

export default function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { showToast } = useToast();
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showToast({
        variant: 'error',
        title: 'Password mismatch',
        description: 'Passwords do not match',
      });
      return;
    }
    setIsLoading(true);

    // Mock: Show OTP modal
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 1000);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock OTP verification
    setTimeout(() => {
      const mockUser = {
        id: '1',
        email: formData.email,
        phone: formData.phone,
        name: formData.name,
        role: 'member' as const,
        createdAt: new Date().toISOString(),
      };
      login(mockUser, 'mock-token');
      showToast({
        variant: 'success',
        title: 'Welcome to GymVerse!',
        description: "You're all set — see you in class!",
      });
      navigate('/dashboard');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent/5 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-500 via-primary-600 to-accent bg-clip-text text-transparent">
              GymVerse
            </h1>
          </Link>
          <p className="mt-2 text-gray-600">Create your account</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full Name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              autoComplete="name"
            />

            <Input
              label="Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              autoComplete="email"
            />

            <Input
              label="Phone Number"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
              autoComplete="tel"
            />

            <Input
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              autoComplete="new-password"
              helperText="At least 8 characters"
            />

            <Input
              label="Confirm Password"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="••••••••"
              autoComplete="new-password"
            />

            <Button type="submit" fullWidth isLoading={isLoading}>
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>

      {/* OTP Modal */}
      <Modal
        isOpen={step === 'otp'}
        onClose={() => setStep('form')}
        title="Verify Your Phone"
        size="sm"
      >
        <form onSubmit={handleOtpSubmit} className="space-y-6">
          <p className="text-sm text-gray-600">
            We sent a verification code to <strong>{formData.phone}</strong>
          </p>
          <Input
            label="Enter OTP"
            type="text"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="123456"
            maxLength={6}
            pattern="[0-9]{6}"
          />
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => setStep('form')}
            >
              Back
            </Button>
            <Button type="submit" fullWidth isLoading={isLoading}>
              Verify
            </Button>
          </div>
          <p className="text-xs text-center text-gray-500">
            Didn't receive the code?{' '}
            <button type="button" className="text-primary-600 hover:text-primary-700">
              Resend
            </button>
          </p>
        </form>
      </Modal>
    </div>
  );
}

