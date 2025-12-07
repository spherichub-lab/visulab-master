import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Icon } from './Icon';
import { supabase } from '../lib/supabaseClient';
import { Modal } from './Modal';
import { userService } from '../src/services/userService';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string, email: string, name: string } | null>(null);
  const [formData, setFormData] = useState({ name: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        setCurrentUser({
          id: user.id,
          email: user.email || '',
          name: profile?.full_name || user.user_metadata?.full_name || ''
        });
        setFormData(prev => ({ ...prev, name: profile?.full_name || user.user_metadata?.full_name || '' }));
      }
    };
    fetchUser();
  }, []);

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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      await userService.updateProfile(currentUser.id, {
        fullName: formData.name,
        password: formData.password || undefined
      });
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      setFormData(prev => ({ ...prev, password: '' }));
      // Update local state name
      setCurrentUser(prev => prev ? ({ ...prev, name: formData.name }) : null);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Erro ao atualizar perfil.' });
    } finally {
      setIsSubmitting(false);
    }
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
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${isActive
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
          {/* Removed Search and Notifications as requested */}

          <div className="flex items-center gap-3 pl-2 ml-1">
            <div
              className="h-10 w-10 rounded-full bg-slate-200 bg-center bg-cover border-2 border-white shadow-sm flex items-center justify-center text-slate-500 font-bold"
            >
              {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
            </div>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
              title="Configurações"
            >
              <Icon name="settings" />
            </button>

            <button
              onClick={handleLogout}
              className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
              title="Logout"
            >
              <Icon name="logout" />
            </button>
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
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-100'
                  }`}
              >
                {item.name}
              </NavLink>
            );
          })}
        </div>
      </div>

      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Minha Conta">
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          {message.text && (
            <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-base md:text-sm focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
            <input
              type="email"
              value={currentUser?.email || ''}
              readOnly
              className="w-full px-4 py-2.5 bg-slate-100 border-none rounded-xl text-base md:text-sm text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nova Senha (Opcional)</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Digite para alterar"
              className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-base md:text-sm focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="flex-1 py-2.5 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Navbar;