import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { ToastProvider } from './components/ui/Toast';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Dashboard from './pages/Dashboard';
import Classes from './pages/Classes';
import CheckIn from './pages/CheckIn';
import TrainerDashboard from './pages/TrainerDashboard';
import AdminDashboard from './pages/AdminDashboard';
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

function App() {
  return (
    <ToastProvider>
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
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={['admin']}>
              <Layout>
                <AdminDashboard />
              </Layout>
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

