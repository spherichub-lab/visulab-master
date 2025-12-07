import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Shortages from './pages/Shortages';
import Users from './pages/Users';
import Companies from './pages/Companies';
import Purchases from './pages/Purchases';
import Login from './pages/Login';
import { supabase } from './lib/supabaseClient';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/' || location.pathname === '/login';

  return (
    <div className="h-screen supports-[height:100dvh]:h-[100dvh] bg-background-light flex flex-col font-display antialiased text-slate-900 overflow-hidden">
      {!isLoginPage && <Navbar />}
      <main className={`flex-1 flex flex-col overflow-hidden relative w-full ${!isLoginPage ? 'max-w-[1440px] mx-auto' : ''}`}>
        {children}
      </main>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ children, allowedRoles }) => {
  const [loading, setLoading] = React.useState(true);
  const [authorized, setAuthorized] = React.useState(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      if (!allowedRoles) {
        setAuthorized(true);
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile && allowedRoles.includes(profile.role)) {
        setAuthorized(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, [allowedRoles]);

  if (loading) return <div className="h-screen flex items-center justify-center">Carregando...</div>;
  if (!authorized) return <Navigate to="/" replace />;

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Navigate to="/" replace />} />

          {/* Routes accessible by everyone (authenticated) */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/shortages" element={
            <ProtectedRoute>
              <Shortages />
            </ProtectedRoute>
          } />

          {/* Admin only routes */}
          <Route path="/users" element={
            <ProtectedRoute allowedRoles={['Admin', 'Administrator']}>
              <Users />
            </ProtectedRoute>
          } />
          <Route path="/companies" element={
            <ProtectedRoute allowedRoles={['Admin', 'Administrator']}>
              <Companies />
            </ProtectedRoute>
          } />
          <Route path="/purchases" element={
            <ProtectedRoute allowedRoles={['Admin', 'Administrator']}>
              <Purchases />
            </ProtectedRoute>
          } />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;