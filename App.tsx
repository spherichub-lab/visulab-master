import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Shortages from './pages/Shortages';
import Users from './pages/Users';
import Companies from './pages/Companies';
import Purchases from './pages/Purchases';
import Login from './pages/Login';

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

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/shortages" element={<Shortages />} />
          <Route path="/users" element={<Users />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/purchases" element={<Purchases />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;