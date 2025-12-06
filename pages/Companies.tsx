import React, { useState, useRef } from 'react';
import { Icon } from '../components/Icon';
import { Modal } from '../components/Modal';
import { Company } from '../types';

const MOCK_COMPANIES: Company[] = [
    { id: '1', name: 'Master', displayId: '#CP-8821', type: 'Head Office', contactName: 'Sarah Jenkins', contactEmail: 'sarah@master.com', status: 'Active', initials: 'M', colorClass: 'bg-slate-900 text-white' },
    { id: '2', name: 'AMX', displayId: '#CP-9932', type: 'Branch', contactName: 'Michael Korb', contactEmail: 'michael@amx.com', status: 'Active', initials: 'A', colorClass: 'bg-blue-600 text-white' },
    { id: '3', name: 'Ultra Optics', displayId: '#CP-7741', type: 'Supplier', contactName: 'Robert Wilson', contactEmail: 'robert@ultraoptics.com', status: 'Active', initials: 'UO', colorClass: 'bg-emerald-600 text-white' },
    { id: '4', name: 'GBO', displayId: '#CP-5520', type: 'Supplier', contactName: 'Emily Chen', contactEmail: 'emily@gbo.com', status: 'Active', initials: 'GBO', colorClass: 'bg-orange-500 text-white' },
];

const Companies: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All Companies');
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const formatPhoneNumber = (value: string, previousValue: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Handle cursor position
    const cursorPosition = value.length;
    const previousDigits = previousValue.replace(/\D/g, '');
    const digitDiff = digits.length - previousDigits.length;
    
    // Format based on length
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 2)})${digits.slice(2)}`;
    } else if (digits.length <= 10) {
      return `(${digits.slice(0, 2)})${digits.slice(2, 6)}-${digits.slice(6)}`;
    } else if (digits.length <= 11) {
      return `(${digits.slice(0, 2)})${digits.slice(2, 7)}-${digits.slice(7)}`;
    } else {
      return previousValue;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const previousValue = input.value;
    const newValue = formatPhoneNumber(input.value, previousValue);
    
    if (newValue !== previousValue) {
      // Calculate cursor position
      const cursorPos = input.selectionStart || 0;
      const beforeCursor = previousValue.substring(0, cursorPos);
      const beforeCursorDigits = beforeCursor.replace(/\D/g, '');
      
      // Find new cursor position
      let newCursorPos = cursorPos;
      let formattedBeforeCursor = formatPhoneNumber(beforeCursor, '');
      
      // Adjust cursor position if needed
      if (formattedBeforeCursor.length > beforeCursor.length) {
        newCursorPos += formattedBeforeCursor.length - beforeCursor.length;
      }
      
      input.value = newValue;
      input.setSelectionRange(newCursorPos, newCursorPos);
    }
  };

  return (
    <div className="h-full flex flex-col px-4 md:px-6 py-4 overflow-hidden">
      {/* Header Area */}
      <div className="flex-none flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-6">
         <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Gerenciar Empresas</h2>
            <p className="text-slate-500 text-sm mt-1">Supervisione laboratórios parceiros, fornecedores e clínicas clientes.</p>
         </div>
         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="relative group flex-1 md:flex-none">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                    <Icon name="search" className="!text-xl" />
                </span>
                <input type="text" placeholder="Buscar..." className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full md:w-64 transition-all shadow-sm" />
            </div>
            <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-full text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm">
                    <Icon name="filter_list" className="!text-xl" />
                    <span className="inline">Filtrar</span>
                </button>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-full text-sm font-semibold shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 whitespace-nowrap"
                >
                    <Icon name="add" className="!text-xl" />
                    <span>Adicionar Empresa</span>
                </button>
            </div>
         </div>
      </div>

      {/* Metrics Row */}
      <div className="flex-none grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
         {[
            { label: 'Total de Parceiros', value: '124', icon: 'domain', bg: 'bg-blue-50', color: 'text-primary' },
            { label: 'Ativos', value: '112', icon: 'check_circle', bg: 'bg-green-50', color: 'text-accent-green' },
            { label: 'Fornecedores', value: '45', icon: 'handshake', bg: 'bg-purple-50', color: 'text-accent-purple' },
         ].map(metric => (
            <div key={metric.label} className="bg-white p-3 md:p-4 rounded-3xl shadow-soft border border-slate-100 flex flex-col sm:flex-row items-center sm:gap-4 group hover:shadow-hover hover:-translate-y-1 transition-all duration-300 text-center sm:text-left justify-center sm:justify-start">
                <div className={`h-10 w-10 md:h-12 md:w-12 rounded-2xl ${metric.bg} ${metric.color} flex items-center justify-center group-hover:scale-110 transition-transform mb-2 sm:mb-0`}>
                    <Icon name={metric.icon} />
                </div>
                <div>
                    <p className="text-[10px] md:text-xs font-medium text-slate-400 uppercase tracking-wide leading-tight">{metric.label}</p>
                    <p className="text-lg md:text-xl font-bold text-slate-900">{metric.value}</p>
                </div>
            </div>
         ))}
      </div>

      {/* Main Content Area - functional, no hover effect */}
      <div className="flex-1 bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden flex flex-col">
         {/* Tabs */}
         <div className="flex-none px-6 py-4 border-b border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
             {['Todas as Empresas', 'Fornecedores', 'Clínicas', 'Arquivadas'].map(tab => (
                 <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${activeTab === tab ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                 >
                     {tab}
                 </button>
             ))}
         </div>
         
         {/* Scrollable Table */}
         <div className="flex-1 overflow-auto no-scrollbar relative pb-10">
             <table className="w-full text-left border-collapse min-w-[800px] md:min-w-0">
                 <thead className="sticky top-0 bg-white z-10">
                     <tr className="bg-slate-50/50 border-b border-slate-100">
                         <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider w-[60px]">
                             <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary/20" />
                         </th>
                         <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Nome da Empresa</th>
                         <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Tipo</th>
                         <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Contato</th>
                         <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                         <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Ações</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                     {MOCK_COMPANIES.map(company => (
                         <tr key={company.id} className="group hover:bg-slate-50 transition-colors cursor-pointer">
                             <td className="px-6 py-4">
                                 <input type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary/20" />
                             </td>
                             <td className="px-6 py-4">
                                 <div className="flex items-center gap-4">
                                     <div className={`h-10 w-10 rounded-xl ${company.colorClass} flex items-center justify-center text-sm font-bold shrink-0`}>
                                         {company.initials}
                                     </div>
                                     <div>
                                         <p className="text-sm font-bold text-slate-900">{company.name}</p>
                                         <p className="text-xs text-slate-500">ID: {company.displayId}</p>
                                     </div>
                                 </div>
                             </td>
                             <td className="px-6 py-4">
                                 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${company.type === 'Supplier' ? 'bg-purple-50 text-accent-purple' : company.type === 'Branch' ? 'bg-blue-50 text-primary' : 'bg-purple-100 text-purple-600'}`}>
                                     <span className={`w-1.5 h-1.5 rounded-full ${company.type === 'Supplier' ? 'bg-accent-purple' : company.type === 'Branch' ? 'bg-primary' : 'bg-purple-600'}`}></span>
                                     {company.type}
                                 </span>
                             </td>
                             <td className="px-6 py-4">
                                 <div className="flex flex-col">
                                     <span className="text-sm font-medium text-slate-700">{company.contactName}</span>
                                     <span className="text-xs text-slate-400">{company.contactEmail}</span>
                                 </div>
                             </td>
                             <td className="px-6 py-4 text-center">
                                 <div className="flex justify-center">
                                     <span className={`h-2.5 w-2.5 rounded-full ${company.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} title={company.status}></span>
                                 </div>
                             </td>
                             <td className="px-6 py-4 text-right">
                                 <button className="text-slate-400 hover:text-primary transition-colors p-2 hover:bg-blue-50 rounded-lg">
                                     <Icon name="edit" className="!text-lg" />
                                 </button>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>

         {/* Footer */}
         <div className="flex-none p-4 px-6 border-t border-slate-100 flex items-center justify-between">
             <span className="text-xs font-medium text-slate-400">Mostrando 1-4 de 4 empresas</span>
             <div className="flex items-center gap-2">
                 <button disabled className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-50">
                     <Icon name="chevron_left" className="!text-lg" />
                 </button>
                 <button className="h-9 w-9 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shadow-md">1</button>
                 <button disabled className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-colors disabled:opacity-50">
                     <Icon name="chevron_right" className="!text-lg" />
                 </button>
             </div>
         </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Adicionar Nova Empresa">
          <div className="space-y-4">
              <div>
                  <label htmlFor="company-name" className="block text-xs font-semibold text-slate-500 mb-1">Nome da Empresa</label>
                  <input type="text" id="company-name" placeholder="ex: LensTech Soluções" className="w-full rounded-xl border-slate-200 bg-slate-50 text-base md:text-sm focus:ring-primary focus:border-primary px-4 py-2.5" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label htmlFor="company-type" className="block text-xs font-semibold text-slate-500 mb-1">Tipo</label>
                      <select id="company-type" defaultValue="Supplier" className="w-full rounded-xl border-slate-200 bg-slate-50 text-base md:text-sm focus:ring-primary focus:border-primary px-4 py-2.5">
                          <option value="Supplier">Supplier / Fornecedor</option>
                          <option value="Branch">Branch / Filial</option>
                      </select>
                  </div>
                  <div>
                      <label htmlFor="company-status" className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
                      <select id="company-status" className="w-full rounded-xl border-slate-200 bg-slate-50 text-base md:text-sm focus:ring-primary focus:border-primary px-4 py-2.5">
                          <option value="Active">Active / Ativo</option>
                          <option value="Inactive">Inactive / Inativo</option>
                      </select>
                  </div>
              </div>
              <div>
                  <label htmlFor="contact-number" className="block text-xs font-semibold text-slate-500 mb-1">Contact Number</label>
                  <input 
                    type="tel" 
                    id="contact-number" 
                    placeholder="(XX)XXXX-XXXX" 
                    className="w-full rounded-xl border-slate-200 bg-slate-50 text-base md:text-sm focus:ring-primary focus:border-primary px-4 py-2.5"
                    maxLength={16}
                    onChange={handlePhoneChange}
                  />
              </div>
              <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-500 mb-1">Contact Email</label>
                  <input type="email" id="contact-email" placeholder="contato@empresa.com" className="w-full rounded-xl border-slate-200 bg-slate-50 text-base md:text-sm focus:ring-primary focus:border-primary px-4 py-2.5" />
              </div>
              <div className="pt-4 flex flex-col sm:flex-row-reverse gap-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="inline-flex w-full sm:w-auto justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary-dark hover:-translate-y-0.5 transition-all">Criar Empresa</button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="inline-flex w-full sm:w-auto justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all">Cancelar</button>
              </div>
          </div>
      </Modal>
    </div>
  );
};

export default Companies;