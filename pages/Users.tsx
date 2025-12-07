import React, { useState, useEffect } from 'react';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { User, Company } from '../types';
import { userService } from '../src/services/userService';

const Users: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [newUser, setNewUser] = useState({ fullName: '', companyId: '', role: 'User' });
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const data = await userService.getAllCompanies();
      setCompanies(data);
      if (data.length > 0) {
        setNewUser(prev => ({ ...prev, companyId: data[0].id }));
      }
    } catch (err) {
      console.error('Failed to fetch companies:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCompanies();
  }, []);

  // Generate email when name or company changes
  useEffect(() => {
    if (!newUser.fullName || !newUser.companyId) {
      setGeneratedEmail('');
      return;
    }
    const firstName = newUser.fullName.split(' ')[0].toLowerCase();
    const selectedCompany = companies.find(c => c.id === newUser.companyId);
    if (selectedCompany) {
      const companyNameClean = selectedCompany.name.toLowerCase().replace(/\s+/g, '');
      setGeneratedEmail(`${firstName}@${companyNameClean}.com`);
    } else {
      setGeneratedEmail('');
    }
  }, [newUser.fullName, newUser.companyId, companies]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const selectedCompany = companies.find(c => c.id === newUser.companyId);
      if (!selectedCompany) throw new Error('Company not found');

      const form = e.target as HTMLFormElement;
      const passwordInput = form.elements.namedItem('password') as HTMLInputElement;
      const password = passwordInput.value;

      await userService.createUser({
        fullName: newUser.fullName,
        companyId: newUser.companyId,
        companyName: selectedCompany.name,
        password: password
      });

      await fetchUsers();
      setIsModalOpen(false);
      setNewUser({ fullName: '', companyId: companies[0]?.id || '', role: 'User' });
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await userService.deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user');
      }
    }
  };

  return (
    <div className="h-full flex flex-col px-4 md:px-6 py-4 overflow-hidden">
      {/* Header Area */}
      <div className="flex-none flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4 md:mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Gerenciar Usuários</h2>
          <p className="text-slate-500 mt-1 text-sm">Administre membros da equipe, funções e permissões de acesso.</p>
        </div>
        <div className="w-full lg:w-auto grid grid-cols-3 gap-3 md:flex md:gap-4">
          {/* Metric Cards */}
          {[
            { label: 'Total', value: users.length.toString(), icon: 'group', color: 'text-primary', bg: 'bg-blue-50' },
            { label: 'Ativos', value: users.filter(u => u.status === 'Active').length.toString(), icon: 'verified_user', color: 'text-accent-green', bg: 'bg-green-50' },
            { label: 'Novos', value: '0', icon: 'person_add', color: 'text-accent-orange', bg: 'bg-amber-50' },
          ].map((metric) => (
            <div key={metric.label} className="bg-white rounded-2xl p-3 px-4 shadow-soft flex flex-col md:flex-row items-center md:gap-3 border border-slate-100 justify-center md:justify-start text-center md:text-left hover:shadow-hover hover:-translate-y-1 transition-all duration-300">
              <div className={`h-8 w-8 md:h-10 md:w-10 rounded-full ${metric.bg} ${metric.color} flex items-center justify-center mb-1 md:mb-0`}>
                <Icon name={metric.icon} className="!text-lg md:!text-xl" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">{metric.label}</p>
                <p className="text-base md:text-lg font-bold text-slate-900">{metric.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-3xl shadow-soft border border-slate-100 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex-none flex flex-col md:flex-row justify-between items-center p-4 md:p-6 gap-4 border-b border-slate-50">
          <div className="relative w-full md:w-96 group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
              <Icon name="search" />
            </span>
            <input className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-base md:text-sm font-medium text-slate-700 placeholder-slate-400 focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Buscar por nome, email ou função..." type="text" />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex-1 md:flex-none">
              <Icon name="filter_list" className="!text-lg" />
              <span>Filtros</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex-1 md:flex-none whitespace-nowrap"
            >
              <Icon name="add" className="!text-lg" />
              <span>Adicionar Usuário</span>
            </button>
          </div>
        </div>

        {/* Scrollable Table Area */}
        <div className="flex-1 overflow-auto no-scrollbar relative">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-slate-400">
              <span className="w-6 h-6 border-2 border-slate-200 border-t-primary rounded-full animate-spin mr-2"></span>
              Carregando usuários...
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px] md:min-w-0">
              <thead className="sticky top-0 bg-white z-10 shadow-sm">
                <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="py-4 px-2 font-bold pl-6">Usuário</th>
                  <th className="py-4 px-2 font-bold">Função</th>
                  <th className="py-4 px-2 font-bold text-center">Status</th>
                  <th className="py-4 px-2 font-bold">Último Acesso</th>
                  <th className="py-4 px-2 font-bold text-right pr-6">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {users.map((user) => (
                  <tr key={user.id} className="group hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                    <td className="py-3 px-2 pl-6">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          <div className="h-10 w-10 rounded-full bg-slate-200 bg-center bg-cover border border-slate-100 shrink-0" style={{ backgroundImage: `url("${user.avatarUrl}")` }}></div>
                        ) : (
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold border border-slate-100 shrink-0 bg-slate-100 text-slate-600`}>
                            {user.initials}
                          </div>
                        )}
                        <div>
                          <p className="text-slate-900 font-bold">{user.name}</p>
                          <p className="text-slate-500 text-xs">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Icon name={user.role === 'Admin' ? 'admin_panel_settings' : user.role === 'Viewer' ? 'person_outline' : 'person'}
                          className={`!text-lg ${user.role === 'Admin' ? 'text-accent-purple' : user.role === 'Viewer' ? 'text-slate-400' : 'text-primary'}`} />
                        <span>{user.role}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <div className="flex justify-center">
                        <span className={`h-2.5 w-2.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} title={user.status}></span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-slate-500">{user.lastActive}</td>
                    <td className="py-3 px-2 text-right pr-6">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white text-slate-400 hover:text-primary hover:shadow-sm transition-all border border-transparent hover:border-slate-200">
                          <Icon name="edit" className="!text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white text-slate-400 hover:text-red-500 hover:shadow-sm transition-all border border-transparent hover:border-slate-200"
                        >
                          <Icon name={user.status === 'Pending' ? 'close' : 'delete'} className="!text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="flex-none flex items-center justify-between p-4 border-t border-slate-100">
          <p className="text-sm text-slate-500">Mostrando <span className="font-bold text-slate-900">{users.length}</span> usuários</p>
          <div className="flex gap-2">
            <button disabled className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-500 hover:bg-slate-50 disabled:opacity-50 transition-colors">Anterior</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-500 hover:bg-slate-50 transition-colors">Próximo</button>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Adicionar Novo Usuário">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome Completo</label>
            <input
              type="text"
              name="fullName"
              value={newUser.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-base md:text-sm focus:ring-2 focus:ring-primary/50"
              placeholder="ex: João da Silva"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Empresa</label>
            <select
              name="companyId"
              value={newUser.companyId}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-base md:text-sm focus:ring-2 focus:ring-primary/50"
              required
            >
              {companies.map(company => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tipo</label>
            <select
              name="role"
              value={newUser.role}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-base md:text-sm focus:ring-2 focus:ring-primary/50"
              required
            >
              <option value="User">Usuário</option>
              <option value="Admin">Administrador</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email (Gerado Automaticamente)</label>
            <input
              type="email"
              value={generatedEmail}
              readOnly
              className="w-full px-4 py-2.5 bg-slate-100 border-none rounded-xl text-base md:text-sm text-slate-500"
              placeholder="ex: joao@visulab.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Senha</label>
            <input
              type="text"
              name="password"
              defaultValue="123456"
              className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-base md:text-sm focus:ring-2 focus:ring-primary/50"
              placeholder="123456"
            />
            <p className="text-xs text-slate-400 mt-1">Senha padrão: 123456</p>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
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
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Criando...
                </>
              ) : 'Criar Usuário'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;