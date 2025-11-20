import { ReactNode } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  HomeIcon,
  CalendarIcon,
  ShoppingBagIcon,
  UserIcon,
  QrCodeIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  CalendarIcon as CalendarIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid,
  UserIcon as UserIconSolid,
  QrCodeIcon as QrCodeIconSolid,
} from '@heroicons/react/24/solid';
import clsx from 'clsx';

interface LayoutProps {
  children: ReactNode;
}

const mobileNavItems = [
  { path: '/dashboard', icon: HomeIcon, iconSolid: HomeIconSolid, label: 'Home' },
  { path: '/classes', icon: CalendarIcon, iconSolid: CalendarIconSolid, label: 'Classes' },
  { path: '/check-in', icon: QrCodeIcon, iconSolid: QrCodeIconSolid, label: 'Check-in' },
  { path: '/store', icon: ShoppingBagIcon, iconSolid: ShoppingBagIconSolid, label: 'Store' },
  { path: '/profile', icon: UserIcon, iconSolid: UserIconSolid, label: 'Profile' },
];

const desktopNavItems = [
  { path: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
  { path: '/classes', icon: CalendarIcon, label: 'Classes' },
  { path: '/check-in', icon: QrCodeIcon, label: 'Check-in' },
  { path: '/store', icon: ShoppingBagIcon, label: 'Store' },
  { path: '/profile', icon: UserIcon, label: 'Profile' },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-black">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-900 shadow-2xl px-6 pb-4 bg-black">
          <div className="flex h-16 shrink-0 items-center border-b border-gray-900">
            <h1 className="text-2xl font-black bg-gradient-to-r from-primary-400 via-primary-300 to-secondary-400 bg-clip-text text-transparent tracking-tight">
              GymVerse
            </h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-1">
              {desktopNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={clsx(
                        'group flex gap-x-3 rounded-xl p-3 text-sm font-semibold leading-6 transition-all duration-200',
                        active
                          ? 'bg-primary-500/20 text-white shadow-lg border border-primary-500/30'
                          : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                      )}
                    >
                      <Icon
                        className={clsx(
                          'h-6 w-6 shrink-0',
                          active ? 'text-white' : 'text-gray-400 group-hover:text-white'
                        )}
                        aria-hidden="true"
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              {user?.role === 'trainer' && (
                <li>
                  <Link
                    to="/trainer"
                      className={clsx(
                        'group flex gap-x-3 rounded-xl p-3 text-sm font-semibold leading-6 transition-all duration-200',
                        isActive('/trainer')
                          ? 'bg-primary-500/20 text-white shadow-lg border border-primary-500/30'
                          : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                      )}
                  >
                    <ChartBarIcon
                      className={clsx(
                        'h-6 w-6 shrink-0',
                        isActive('/trainer')
                          ? 'text-white'
                          : 'text-gray-400 group-hover:text-white'
                      )}
                      aria-hidden="true"
                    />
                    Trainer
                  </Link>
                </li>
              )}
              {user?.role === 'admin' && (
                <li>
                  <Link
                    to="/admin"
                      className={clsx(
                        'group flex gap-x-3 rounded-xl p-3 text-sm font-semibold leading-6 transition-all duration-200',
                        isActive('/admin')
                          ? 'bg-primary-500/20 text-white shadow-lg border border-primary-500/30'
                          : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                      )}
                  >
                    <ChartBarIcon
                      className={clsx(
                        'h-6 w-6 shrink-0',
                        isActive('/admin')
                          ? 'text-white'
                          : 'text-gray-400 group-hover:text-white'
                      )}
                      aria-hidden="true"
                    />
                    Admin
                  </Link>
                </li>
              )}
            </ul>
            <div className="mt-auto pt-4 border-t border-gray-900">
              <button
                onClick={logout}
                className="group flex gap-x-3 rounded-lg p-3 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-900 hover:text-secondary-400 w-full transition-all"
              >
                <svg
                  className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-secondary-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                  />
                </svg>
                Sign out
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="px-4 py-6 sm:px-6 lg:px-8 min-h-screen">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav
        className="lg:hidden fixed inset-x-0 bottom-0 z-50 border-t border-gray-900 shadow-2xl safe-area-bottom bg-black"
        aria-label="Bottom navigation"
      >
        <div className="flex h-16 items-center justify-around">
          {mobileNavItems.map((item) => {
            const active = isActive(item.path);
            const Icon = active ? item.iconSolid : item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 relative',
                  active ? 'text-white' : 'text-gray-400'
                )}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
              >
                {active && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-b-full shadow-lg shadow-primary-500/50"></div>
                )}
                <Icon className={clsx('h-6 w-6 transition-transform', active && 'scale-110')} aria-hidden="true" />
                <span className={clsx('text-xs mt-0.5 font-medium', active && 'font-bold')}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile content padding */}
      <div className="lg:hidden pb-16" />
    </div>
  );
}
