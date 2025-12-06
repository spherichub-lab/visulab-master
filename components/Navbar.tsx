import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Icon } from './Icon';
import { supabase } from '../lib/supabase';

const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Faltas', path: '/shortages' },
    { name: 'Usuários', path: '/users' },
    { name: 'Empresas', path: '/companies' },
    { name: 'Compras', path: '/purchases' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="px-4 pt-4 md:px-6 md:pt-6 w-full max-w-[1440px] mx-auto z-20 relative flex-none">
      <nav className="w-full rounded-2xl md:rounded-full bg-white shadow-soft border border-slate-100 p-2 pl-4 pr-2 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 pr-4 md:border-r border-slate-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">
              <Icon name="visibility" className="!text-xl" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 hidden md:block">
              VisuLab
            </h1>
          </div>
          
          <div className="hidden lg:flex items-center bg-slate-100/80 rounded-full p-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm font-semibold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {item.name}
                </NavLink>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
            <Icon name="search" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors relative">
            <Icon name="notifications" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
          </button>
          <div className="flex items-center gap-3 pl-2 ml-1">
            <div 
              className="h-10 w-10 rounded-full bg-slate-200 bg-center bg-cover border-2 border-white shadow-sm" 
              style={{ backgroundImage: 'url("https://picsum.photos/200")' }}
            ></div>
            <button 
              onClick={handleLogout}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
              title="Logout"
            >
              <Icon name="logout" />
            </button>
            <Icon name="expand_more" className="hidden sm:block text-slate-400 text-sm" />
          </div>
        </div>
      </nav>
      
      {/* Mobile Navigation */}
      <div className="lg:hidden mt-4">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
             {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-100'
                    }`}
                  >
                    {item.name}
                  </NavLink>
                );
              })}
          </div>
          {/* Subtle Mobile Scroll Indicator */}
          <div className="flex justify-end pr-4 -mt-1">
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-300 uppercase tracking-wider animate-pulse">
               <span>Mais</span>
               <Icon name="arrow_forward" className="!text-xs" />
            </div>
          </div>
      </div>
    </div>
  );
};

export default Navbar;