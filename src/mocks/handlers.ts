import { http, HttpResponse } from 'msw';
import type { User, Slot, Booking, Product, Order } from '@/types';

const mockUsers: User[] = [
  {
    id: '1',
    email: 'member@example.com',
    name: 'John Doe',
    role: 'member',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'trainer@example.com',
    name: 'Sarah Johnson',
    role: 'trainer',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
];

const mockSlots: Slot[] = [
  {
    id: '1',
    type: 'Yoga',
    trainerId: '2',
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
    type: 'HIIT',
    trainerId: '3',
    trainerName: 'Alex Rivera',
    capacity: 20,
    booked: 18,
    waitlist: 2,
    startTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString(),
    location: 'Studio B',
  },
];

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Protein Powder',
    description: 'High-quality whey protein',
    price: 49.99,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=700&q=80',
    category: 'supplements',
    stock: 50,
    inStock: true,
  },
  {
    id: '2',
    name: 'Gym Tank Top',
    description: 'Breathable workout top',
    price: 29.99,
    currency: 'USD',
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=700&q=80',
    category: 'apparel',
    stock: 30,
    inStock: true,
  },
];

export const handlers = [
  // Auth
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    const user = mockUsers.find((u) => u.email === body.email);
    if (user) {
      return HttpResponse.json({
        user,
        token: 'mock-jwt-token',
      });
    }
    return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }),

  http.post('/api/auth/signup', async ({ request }) => {
    const body = await request.json() as { email: string; name: string; phone: string };
    const newUser: User = {
      id: Date.now().toString(),
      email: body.email,
      name: body.name,
      phone: body.phone,
      role: 'member',
      createdAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return HttpResponse.json({
      user: newUser,
      token: 'mock-jwt-token',
    });
  }),

  http.post('/api/auth/verify-otp', async () => {
    return HttpResponse.json({ verified: true });
  }),

  // Slots
  http.get('/api/slots', () => {
    return HttpResponse.json(mockSlots);
  }),

  http.get('/api/slots/:id', ({ params }) => {
    const slot = mockSlots.find((s) => s.id === params.id);
    if (slot) {
      return HttpResponse.json(slot);
    }
    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  }),

  // Bookings
  http.post('/api/bookings', async ({ request }) => {
    const body = await request.json() as { slotId: string; userId: string };
    const slot = mockSlots.find((s) => s.id === body.slotId);
    if (!slot) {
      return HttpResponse.json({ error: 'Slot not found' }, { status: 404 });
    }
    const booking: Booking = {
      id: Date.now().toString(),
      userId: body.userId,
      slotId: body.slotId,
      status: slot.capacity - slot.booked > 0 ? 'confirmed' : 'waitlist',
      bookedAt: new Date().toISOString(),
      slot,
    };
    if (booking.status === 'confirmed') {
      slot.booked += 1;
    } else {
      slot.waitlist += 1;
    }
    return HttpResponse.json(booking);
  }),

  http.delete('/api/bookings/:id', ({ params }) => {
    return HttpResponse.json({ success: true });
  }),

  // Products
  http.get('/api/products', () => {
    return HttpResponse.json(mockProducts);
  }),

  http.get('/api/products/:id', ({ params }) => {
    const product = mockProducts.find((p) => p.id === params.id);
    if (product) {
      return HttpResponse.json(product);
    }
    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  }),

  // Orders
  http.post('/api/orders', async ({ request }) => {
    const body = await request.json() as { userId: string; items: any[]; total: number };
    const order: Order = {
      id: Date.now().toString(),
      userId: body.userId,
      items: body.items,
      total: body.total,
      currency: 'USD',
      status: 'processing',
      createdAt: new Date().toISOString(),
    };
    return HttpResponse.json(order);
  }),

  // Attendance
  http.post('/api/attendance/check-in', async ({ request }) => {
    const body = await request.json() as { userId: string; slotId: string; method: string };
    return HttpResponse.json({
      id: Date.now().toString(),
      ...body,
      checkedInAt: new Date().toISOString(),
    });
  }),

  http.get('/api/attendance', () => {
    return HttpResponse.json([]);
  }),
];

