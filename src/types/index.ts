export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  role: 'member' | 'trainer' | 'admin';
  avatar?: string;
  membershipPlanId?: string;
  membershipExpiresAt?: string; // ISO date
  createdAt: string; // ISO date
}

export interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number; // days
  features: string[];
  popular?: boolean;
}

export interface Slot {
  id: string;
  type: 'Yoga' | 'Boxing' | 'Dance' | 'Aerobics' | 'Pilates' | 'HIIT' | 'Strength' | string;
  trainerId: string;
  trainerName: string;
  capacity: number;
  booked: number;
  waitlist: number;
  startTime: string; // ISO
  endTime: string; // ISO
  location?: string;
  description?: string;
  imageUrl?: string;
}

export interface Booking {
  id: string;
  userId: string;
  slotId: string;
  status: 'confirmed' | 'waitlist' | 'cancelled' | 'completed';
  bookedAt: string; // ISO
  cancelledAt?: string; // ISO
  slot?: Slot;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  slotId: string;
  checkedInAt: string; // ISO
  method: 'qr' | 'manual';
  slot?: Slot;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  category: 'supplements' | 'apparel' | 'equipment' | 'accessories';
  stock: number;
  inStock: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  currency: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string; // ISO
  shippingAddress?: string;
}

export interface TrainerNote {
  id: string;
  trainerId: string;
  slotId: string;
  userId: string;
  content: string;
  createdAt: string; // ISO
}

export interface BodyMeasurement {
  id: string;
  userId: string;
  chest?: number; // cm
  waist?: number; // cm
  hips?: number; // cm
  weight?: number; // kg
  recordedAt: string; // ISO
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  week: number; // 1-52
  year: number;
  days: {
    [day: string]: {
      exercises: Array<{
        name: string;
        sets?: number;
        reps?: number;
        weight?: number;
        duration?: number; // minutes
      }>;
    };
  };
}

export interface UserPreferences {
  userId: string;
  reminders: {
    classReminder: boolean;
    workoutReminder: boolean;
    reminderTime?: string; // HH:mm
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

