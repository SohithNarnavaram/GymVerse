# GymVerse - Modern Gym Webapp

A full-featured, mobile-first gym management webapp built with React, TypeScript, Vite, and Tailwind CSS. Inspired by CULT and other modern fitness apps.

## 🎨 Design

- **Color Scheme**: Deep violet primary (#7C00FE), accent yellow (#F9E400), warm orange (#FFAF00), energetic red (#F5004F)
- **Mobile-First**: Responsive design with bottom navigation on mobile, sidebar on desktop
- **Accessibility**: WCAG AA compliant with keyboard navigation and ARIA attributes
- **Microcopy**: Friendly, motivating messages throughout the app

## 🚀 Features

### Pages & Functionality

1. **Landing Page** - Hero section, pricing cards, classes preview, trainers carousel, store highlight
2. **Authentication** - Sign up/Sign in with phone OTP mock and session persistence
3. **User Dashboard** - Membership card, today's classes, quick actions, weight progress chart
4. **Classes/Booking** - Calendar/list toggle, slot cards, booking modal, capacity & waitlist handling
5. **Check-in/Attendance** - QR scanner mock, manual check-in, attendance history
6. **Trainer Dashboard** - Today's classes, attendees list, quick check-in, notes
7. **Admin Dashboard** - Metrics, manage classes/plans/products, CSV export
8. **Store** - Product listing, product modal, cart (persisted), checkout mock
9. **Profile** - Body measurements (BMS), weight history, weekly workout editor, reminder preferences

### Tech Stack

- **React 18+** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** with custom theme configuration
- **React Router** for navigation
- **Zustand** for state management
- **Framer Motion** for animations
- **Headless UI** & **Radix UI** for accessible components
- **MSW (Mock Service Worker)** for API mocking
- **Vitest** + **Testing Library** for testing
- **Recharts** for data visualization
- **ESLint** + **Prettier** for code quality

## 📦 Installation

```bash
# Install dependencies
npm install

# Initialize MSW (first time only)
npm run msw:init
```

## 🛠️ Development

```bash
# Start development server
npm run dev

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

## 🏗️ Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/            # Primitive components (Button, Input, Card, Modal, Toast)
│   └── Layout.tsx     # Main layout with navigation
├── pages/             # Page components
│   ├── auth/          # Authentication pages
│   ├── Dashboard.tsx
│   ├── Classes.tsx
│   ├── CheckIn.tsx
│   ├── TrainerDashboard.tsx
│   ├── AdminDashboard.tsx
│   ├── Store.tsx
│   ├── Profile.tsx
│   └── Landing.tsx
├── store/             # Zustand stores
│   ├── authStore.ts   # Authentication state
│   └── appStore.ts    # App-wide state (cart, bookings)
├── types/             # TypeScript type definitions
│   └── index.ts
├── mocks/             # MSW mock handlers
│   ├── handlers.ts
│   └── browser.ts
├── test/              # Test setup and examples
│   ├── setup.ts
│   ├── server.ts
│   └── example.test.tsx
├── App.tsx            # Main app component with routing
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## 🎯 Key Features

### Mobile-First Design
- Bottom navigation bar on mobile devices
- Responsive sidebar on desktop
- Touch-friendly interface elements
- Optimized for small screens

### State Management
- Zustand for lightweight state management
- Persistent authentication state
- Cart and booking state management

### Mocking
- MSW for API mocking in development
- Realistic mock data and responses
- Easy to extend with new endpoints

### Accessibility
- Keyboard navigation support
- ARIA labels and roles
- Focus management
- Screen reader friendly

### Testing
- Vitest for unit and integration tests
- Testing Library for component testing
- Example tests included
- Coverage reporting

## 🔐 Authentication

The app includes mock authentication with:
- Email/password login
- Phone OTP verification (mock)
- Session persistence using Zustand persist middleware
- Protected routes based on user roles

## 📊 Data Models

All TypeScript interfaces are defined in `src/types/index.ts`:
- User, MembershipPlan, Slot, Booking
- AttendanceRecord, Product, Order
- TrainerNote, BodyMeasurement, WorkoutPlan
- UserPreferences

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
- Primary: `#7C00FE` (deep violet)
- Accent Yellow: `#F9E400`
- Accent Orange: `#FFAF00`
- Accent Red: `#F5004F`

### Components
All UI components are in `src/components/ui/` and can be customized as needed.

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Lint code
- `npm run format` - Format code
- `npm run format:check` - Check code formatting
- `npm run msw:init` - Initialize MSW (first time only)

## 🚧 Development Notes

- MSW is only active in development mode
- All API calls are mocked using MSW handlers
- Authentication state persists across page refreshes
- Cart state is managed in-memory (can be extended to persist)

## 📄 License

MIT

## 🙏 Credits

Inspired by CULT and other modern fitness apps. Built with modern web technologies and best practices.

