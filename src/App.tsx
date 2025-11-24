import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useBranchStore } from './store/branchStore';
import { ToastProvider } from './components/ui/Toast';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Dashboard from './pages/Dashboard';
import Classes from './pages/Classes';
import CheckIn from './pages/CheckIn';
import TrainerDashboard from './pages/TrainerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BranchSelection from './pages/BranchSelection';
import BranchesDashboard from './pages/BranchesDashboard';
import BranchDetails from './pages/BranchDetails';
import Store from './pages/Store';
import Profile from './pages/Profile';
import Plans from './pages/Plans';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/signin" replace />;
}

function RoleRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: ('member' | 'trainer' | 'admin')[];
}) {
  const { user } = useAuthStore();
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { selectedBranch, branches, hasMultipleBranches } = useBranchStore();
  const location = useLocation();

  // Allow access to branch selection and branches dashboard without branch selection
  if (location.pathname === '/admin/branches/select' || location.pathname === '/admin/branches') {
    return <>{children}</>;
  }

  // If branches are loaded and admin has multiple branches but no branch is selected, redirect to selection
  // Use a small delay to ensure branches have time to load
  if (branches.length > 0 && hasMultipleBranches() && !selectedBranch) {
    return <Navigate to="/admin/branches/select" replace />;
  }

  // Allow access in all other cases:
  // - Branches haven't loaded yet (will load in Layout component)
  // - Only one branch exists (will auto-select in useBranchInit)
  // - Branch is already selected
  return <>{children}</>;
}

function App() {
  return (
    <ToastProvider>
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/classes"
        element={
          <ProtectedRoute>
            <Layout>
              <Classes />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/check-in"
        element={
          <ProtectedRoute>
            <Layout>
              <CheckIn />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trainer"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['trainer', 'admin']}>
              <Layout>
                <TrainerDashboard />
              </Layout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/branches/select"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['admin']}>
              <Layout>
                <BranchSelection />
              </Layout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/branches/:branchId"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['admin']}>
              <Layout>
                <BranchDetails />
              </Layout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/branches"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['admin']}>
              <Layout>
                <BranchesDashboard />
              </Layout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['admin']}>
              <AdminRoute>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </AdminRoute>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/plans"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['admin']}>
              <Layout>
                <Plans />
              </Layout>
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/store"
        element={
          <ProtectedRoute>
            <Layout>
              <Store />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
    </ToastProvider>
  );
}

export default App;

