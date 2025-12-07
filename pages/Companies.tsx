import React, { useState, useEffect } from 'react';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { Company, CreateCompanyParams } from '../types';
import { userService } from '../src/services/userService';

const Companies: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [formData, setFormData] = useState<CreateCompanyParams>({
    name: '',
    type: 'Partner',
    contact_name: '',
    contact_email: '',
    status: 'Active'
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getAllCompanies();
      setCompanies(data);
    } catch (err) {
      console.error('Failed to fetch companies:', err);
      setError('Failed to load companies');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (editingId) {
        await userService.updateCompany(editingId, formData);
      } else {
        await userService.createCompany(formData);
      }
      await fetchCompanies();
      handleCloseModal();
    } catch (err: any) {
      setError(err.message || 'Failed to save company');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta empresa?')) {
      try {
        await userService.deleteCompany(id);
        setCompanies(companies.filter(c => c.id !== id));
      } catch (err) {
        console.error('Error deleting company:', err);
        alert('Failed to delete company');
      }
    }
  };

  const handleEdit = (company: Company) => {
    setFormData({
      name: company.name,
      type: company.type,
      contact_name: company.contact_name,
      contact_email: company.contact_email,
      status: company.status
    });
    setEditingId(company.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      name: '',
      type: 'Partner',
      contact_name: '',
      contact_email: '',
      status: 'Active'
    });
    setError('');
  };

  return (
    <div className="h-full flex flex-col px-4 md:px-6 py-4 overflow-hidden">
      {/* Header Area */}
      <div className="flex-none flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4 md:mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Gerenciar Empresas</h2>
          <p className="text-slate-500 mt-1 text-sm">Administre parceiros, fornecedores e filiais.</p>
        </div>
        <div className="w-full lg:w-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all w-full md:w-auto"
          >
            <Icon name="add" className="!text-lg" />
            <span>Adicionar Empresa</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-3xl shadow-soft border border-slate-100 flex flex-col overflow-hidden">
        {/* Table Area */}
        <div className="flex-1 overflow-auto no-scrollbar relative">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-slate-400">
              <span className="w-6 h-6 border-2 border-slate-200 border-t-primary rounded-full animate-spin mr-2"></span>
              Carregando empresas...
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px] md:min-w-0">
              <thead className="sticky top-0 bg-white z-10 shadow-sm">
                <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="py-4 px-2 font-bold pl-6">Empresa</th>
                  <th className="py-4 px-2 font-bold">Tipo</th>
                  <th className="py-4 px-2 font-bold">Contato</th>
                  <th className="py-4 px-2 font-bold text-center">Status</th>
                  <th className="py-4 px-2 font-bold text-right pr-6">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {companies.map((company) => (
                  <tr key={company.id} className="group hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                    <td className="py-3 px-2 pl-6">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-lg font-bold border border-slate-100 shrink-0 bg-slate-100 text-slate-600`}>
                          {company.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-slate-900 font-bold">{company.name}</p>
                          <p className="text-slate-500 text-xs">{company.display_id || 'ID: ' + company.id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
                        {company.type || 'Partner'}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div>
                        <p className="text-slate-900">{company.contact_name || '-'}</p>
                        <p className="text-slate-500 text-xs">{company.contact_email || '-'}</p>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <div className="flex justify-center">
                        <span className={`h-2.5 w-2.5 rounded-full ${company.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`} title={company.status}></span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right pr-6">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(company)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white text-slate-400 hover:text-primary hover:shadow-sm transition-all border border-transparent hover:border-slate-200"
                        >
                          <Icon name="edit" className="!text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(company.id)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white text-slate-400 hover:text-red-500 hover:shadow-sm transition-all border border-transparent hover:border-slate-200"
                        >
                          <Icon name="delete" className="!text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {companies.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      Nenhuma empresa encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingId ? "Editar Empresa" : "Adicionar Nova Empresa"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome da Empresa</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-base md:text-sm focus:ring-2 focus:ring-primary/50"
              placeholder="ex: Óticas VisuLab"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tipo</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-base md:text-sm focus:ring-2 focus:ring-primary/50"
              >
                <option value="Partner">Parceiro</option>
                <option value="Supplier">Fornecedor</option>
                <option value="Client">Cliente</option>
                <option value="Head Office">Matriz</option>
                <option value="Branch">Filial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-base md:text-sm focus:ring-2 focus:ring-primary/50"
              >
                <option value="Active">Ativo</option>
                <option value="Inactive">Inativo</option>
                <option value="Pending">Pendente</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome do Contato</label>
              <input
                type="text"
                name="contact_name"
                value={formData.contact_name || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-base md:text-sm focus:ring-2 focus:ring-primary/50"
                placeholder="ex: Maria Silva"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email do Contato</label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-base md:text-sm focus:ring-2 focus:ring-primary/50"
                placeholder="ex: contato@empresa.com"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={handleCloseModal}
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
                  Salving...
                </>
              ) : (editingId ? 'Salvar Alterações' : 'Criar Empresa')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Companies;