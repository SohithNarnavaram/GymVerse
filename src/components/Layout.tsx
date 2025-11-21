import { ReactNode, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  HomeIcon,
  CalendarIcon,
  ShoppingBagIcon,
  UserIcon,
  QrCodeIcon,
  ChartBarIcon,
  DocumentTextIcon,
  Bars3Icon,
  XMarkIcon,
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
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Filter navigation items based on user role
  const getDesktopNavItems = () => {
    const items = [...desktopNavItems];
    // Remove Profile for admins
    if (user?.role === 'admin') {
      return items.filter(item => item.path !== '/profile');
    }
    return items;
  };

  const getMobileNavItems = () => {
    const items = [...mobileNavItems];
    // Remove Profile for admins
    if (user?.role === 'admin') {
      return items.filter(item => item.path !== '/profile');
    }
    return items;
  };

  const roleSpecificLinks = () => {
    if (user?.role === 'admin') {
      return [
        { path: '/admin', label: 'Admin Control', icon: ChartBarIcon },
        { path: '/plans', label: 'Plans', icon: DocumentTextIcon },
      ];
    }
    if (user?.role === 'trainer') {
      return [
        { path: '/trainer', label: 'Trainer Control', icon: ChartBarIcon },
        { path: '/profile', label: 'Profile', icon: UserIcon },
      ];
    }
    return [{ path: '/profile', label: 'Profile', icon: UserIcon }];
  };

  const handleDrawerClose = () => setIsMobileDrawerOpen(false);

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
              {/* Dashboard */}
              {desktopNavItems
                .filter(item => item.path === '/dashboard')
                .map((item) => {
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
              
              {/* Admin - right after Dashboard */}
              {user?.role === 'admin' && (
                <>
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
                  <li>
                    <Link
                      to="/plans"
                        className={clsx(
                          'group flex gap-x-3 rounded-xl p-3 text-sm font-semibold leading-6 transition-all duration-200',
                          isActive('/plans')
                            ? 'bg-primary-500/20 text-white shadow-lg border border-primary-500/30'
                            : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                        )}
                    >
                      <DocumentTextIcon
                        className={clsx(
                          'h-6 w-6 shrink-0',
                          isActive('/plans')
                            ? 'text-white'
                            : 'text-gray-400 group-hover:text-white'
                        )}
                        aria-hidden="true"
                      />
                      Plans
                    </Link>
                  </li>
                </>
              )}

              {/* Other navigation items (excluding Dashboard and Profile for admins) */}
              {getDesktopNavItems()
                .filter(item => item.path !== '/dashboard')
                .map((item) => {
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
              
              {/* Trainer - after other items */}
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
          {getMobileNavItems().map((item) => {
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
                <Icon className={clsx('h-5 w-5 transition-transform', active && 'scale-110')} aria-hidden="true" />
                <span className={clsx('text-[10px] mt-0.5 font-medium', active && 'font-bold')}>{item.label}</span>
              </Link>
            );
          })}
          {user?.role === 'admin' && (
            <>
              <Link
                to="/admin"
                className={clsx(
                  'flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 relative',
                  isActive('/admin') ? 'text-white' : 'text-gray-400'
                )}
                aria-label="Admin"
                aria-current={isActive('/admin') ? 'page' : undefined}
              >
                {isActive('/admin') && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-b-full shadow-lg shadow-primary-500/50"></div>
                )}
                <ChartBarIcon className={clsx('h-5 w-5 transition-transform', isActive('/admin') && 'scale-110')} aria-hidden="true" />
                <span className={clsx('text-[10px] mt-0.5 font-medium', isActive('/admin') && 'font-bold')}>Admin</span>
              </Link>
              <Link
                to="/plans"
                className={clsx(
                  'flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 relative',
                  isActive('/plans') ? 'text-white' : 'text-gray-400'
                )}
                aria-label="Plans"
                aria-current={isActive('/plans') ? 'page' : undefined}
              >
                {isActive('/plans') && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-b-full shadow-lg shadow-primary-500/50"></div>
                )}
                <DocumentTextIcon className={clsx('h-5 w-5 transition-transform', isActive('/plans') && 'scale-110')} aria-hidden="true" />
                <span className={clsx('text-[10px] mt-0.5 font-medium', isActive('/plans') && 'font-bold')}>Plans</span>
              </Link>
            </>
          )}
          {user?.role === 'trainer' && (
            <Link
              to="/trainer"
              className={clsx(
                'flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 relative',
                isActive('/trainer') ? 'text-white' : 'text-gray-400'
              )}
              aria-label="Trainer"
              aria-current={isActive('/trainer') ? 'page' : undefined}
            >
              {isActive('/trainer') && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-b-full shadow-lg shadow-primary-500/50"></div>
              )}
              <ChartBarIcon className={clsx('h-5 w-5 transition-transform', isActive('/trainer') && 'scale-110')} aria-hidden="true" />
              <span className={clsx('text-[10px] mt-0.5 font-medium', isActive('/trainer') && 'font-bold')}>Trainer</span>
            </Link>
          )}
          {/* More Menu / Sign Out */}
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 text-gray-400 hover:text-white"
            aria-label="Open menu"
          >
            <Bars3Icon className="h-5 w-5" aria-hidden="true" />
            <span className="text-[10px] mt-0.5 font-medium">Menu</span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMobileDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={handleDrawerClose}
          />
          <div className="fixed inset-y-0 right-0 w-72 bg-[#0a0a0a] border-l border-[#1f1f1f] z-50 flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f1f1f]">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Signed in as</p>
                <p className="text-sm font-semibold text-white">{user?.name || 'Guest'}</p>
                {user?.role && (
                  <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                )}
              </div>
              <button
                onClick={handleDrawerClose}
                className="text-gray-400 hover:text-white transition"
                aria-label="Close menu"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">Navigate</p>
                <div className="space-y-1">
                  {getMobileNavItems().map((item) => {
                    const active = isActive(item.path);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={handleDrawerClose}
                        className={clsx(
                          'flex items-center gap-3 px-3 py-2 rounded-xl border transition-colors',
                          active
                            ? 'border-primary-500/40 bg-primary-500/10 text-white'
                            : 'border-transparent text-gray-300 hover:border-gray-700 hover:bg-gray-900'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3">Account</p>
                <div className="space-y-1">
                  {roleSpecificLinks().map((link) => {
                    const active = isActive(link.path);
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={handleDrawerClose}
                        className={clsx(
                          'flex items-center gap-3 px-3 py-2 rounded-xl border transition-colors',
                          active
                            ? 'border-secondary-500/40 bg-secondary-500/10 text-white'
                            : 'border-transparent text-gray-300 hover:border-gray-700 hover:bg-gray-900'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="text-sm font-medium">{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-[#1f1f1f]">
              <button
                onClick={() => {
                  logout();
                  handleDrawerClose();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 px-4 py-3 text-sm font-semibold hover:bg-red-500/20 transition"
              >
                Sign out
              </button>
            </div>
          </div>
        </>
      )}

      {/* Mobile content padding */}
      <div className="lg:hidden pb-16" />
    </div>
  );
}
