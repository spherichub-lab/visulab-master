import React from 'react';
import { Icon } from '../components/Icon';
import { Purchase } from '../types';

const MOCK_PURCHASES: Purchase[] = [
    { id: '1', displayId: '#PO-4921', supplier: 'Essilor Int.', supplierInitials: 'E', supplierColorClass: 'bg-indigo-100 text-indigo-600', date: '24 Out, 2023', itemsDescription: '150x Visão Simples 1.56, 20x Prog...', amount: 3420.00, status: 'Received' },
    { id: '2', displayId: '#PO-4920', supplier: 'Hoya Corp.', supplierInitials: 'H', supplierColorClass: 'bg-blue-100 text-blue-600', date: '22 Out, 2023', itemsDescription: 'Reposição de estoque: Blue Control...', amount: 1250.50, status: 'Pending' },
    { id: '3', displayId: '#PO-4919', supplier: 'Zeiss Vision', supplierInitials: 'Z', supplierColorClass: 'bg-slate-100 text-slate-600', date: '20 Out, 2023', itemsDescription: '10x Alto Índice 1.74 (Custom)', amount: 890.00, status: 'Received' },
    { id: '4', displayId: '#PO-4918', supplier: 'Rodenstock', supplierInitials: 'R', supplierColorClass: 'bg-purple-100 text-purple-600', date: '18 Out, 2023', itemsDescription: 'Suprimentos de consumo mensais', amount: 450.00, status: 'Cancelled' },
    { id: '5', displayId: '#PO-4917', supplier: 'Essilor Int.', supplierInitials: 'E', supplierColorClass: 'bg-indigo-100 text-indigo-600', date: '15 Out, 2023', itemsDescription: 'Lote A - Fotossensível 1.56', amount: 2100.00, status: 'Received' },
    { id: '6', displayId: '#PO-4916', supplier: 'Hoya Corp.', supplierInitials: 'H', supplierColorClass: 'bg-blue-100 text-blue-600', date: '12 Out, 2023', itemsDescription: 'Pedido Especial: Lentes Trivex', amount: 750.25, status: 'Received' },
    { id: '7', displayId: '#PO-4915', supplier: 'Zeiss Vision', supplierInitials: 'Z', supplierColorClass: 'bg-slate-100 text-slate-600', date: '10 Out, 2023', itemsDescription: 'Consumíveis de Laboratório', amount: 320.00, status: 'Received' },
];

const Purchases: React.FC = () => {
  return (
    <div className="h-full flex flex-col px-4 md:px-6 py-4 overflow-hidden">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0 overflow-y-auto lg:overflow-hidden no-scrollbar">
            
            {/* Left Column (Desktop): Metrics & History (Span 8) */}
            <div className="lg:col-span-8 flex flex-col gap-4 h-full overflow-hidden min-h-[500px] lg:min-h-0 order-1">
                <div className="flex-none grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { label: 'Gasto Mensal', value: 'R$12.450', icon: 'receipt_long', bg: 'bg-blue-50', color: 'text-primary' },
                        { label: 'Recebidos', value: '18 Pedidos', icon: 'check_circle', bg: 'bg-green-50', color: 'text-accent-green' },
                    ].map(metric => (
                        <div key={metric.label} className="bg-white rounded-2xl p-4 shadow-soft border border-slate-100 flex items-center gap-4 hover:shadow-hover hover:-translate-y-1 transition-all duration-300">
                            <div className={`h-10 w-10 rounded-full ${metric.bg} ${metric.color} flex items-center justify-center`}>
                                <Icon name={metric.icon} />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-slate-400 uppercase">{metric.label}</p>
                                <p className="text-lg font-bold text-slate-900">{metric.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex-1 bg-white rounded-3xl shadow-soft border border-slate-100 flex flex-col overflow-hidden">
                    <div className="flex-none p-6 pb-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div>
                                 <h2 className="text-2xl font-bold text-slate-900">Histórico de Compras</h2>
                                 <p className="text-sm text-slate-500 mt-1">Gerencie e rastreie as aquisições de estoque de lentes.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200">
                                    <Icon name="file_download" className="!text-lg" />
                                    Exportar
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-semibold shadow-md hover:opacity-90 transition-opacity">
                                    <Icon name="filter_list" className="!text-lg" />
                                    Filtrar
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mb-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                             <div className="relative flex-1 min-w-[200px]">
                                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                     <Icon name="search" className="!text-lg" />
                                 </span>
                                 <input type="text" placeholder="Buscar por ID, Fornecedor..." className="w-full bg-white border-none rounded-xl py-2 pl-10 pr-4 text-base md:text-sm focus:ring-2 focus:ring-primary shadow-sm text-slate-700" />
                             </div>
                             <select className="bg-white border-none rounded-xl py-2 pl-4 pr-8 text-base md:text-sm focus:ring-2 focus:ring-primary shadow-sm text-slate-600 cursor-pointer">
                                 <option>Todos os Status</option>
                                 <option>Recebido</option>
                                 <option>Pendente</option>
                                 <option>Cancelado</option>
                             </select>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto no-scrollbar relative">
                        <table className="w-full text-left border-collapse min-w-[800px] lg:min-w-0">
                            <thead className="sticky top-0 bg-white z-10">
                                <tr className="border-b border-slate-100">
                                    <th className="py-4 px-3 pl-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">ID</th>
                                    <th className="py-4 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Fornecedor</th>
                                    <th className="py-4 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Data</th>
                                    <th className="py-4 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Itens</th>
                                    <th className="py-4 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Valor</th>
                                    <th className="py-4 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Status</th>
                                    <th className="py-4 px-3 pr-6 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-slate-50">
                                {MOCK_PURCHASES.map(purchase => (
                                    <tr key={purchase.id} className="group hover:bg-slate-50 transition-colors cursor-pointer">
                                        <td className="py-4 px-3 pl-6 font-medium text-primary">{purchase.displayId}</td>
                                        <td className="py-4 px-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-8 w-8 rounded-full ${purchase.supplierColorClass} flex items-center justify-center font-bold text-xs`}>
                                                    {purchase.supplierInitials}
                                                </div>
                                                <span className="font-semibold text-slate-700">{purchase.supplier}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-3 text-slate-500">{purchase.date}</td>
                                        <td className="py-4 px-3 text-slate-500 max-w-[150px] truncate">{purchase.itemsDescription}</td>
                                        <td className="py-4 px-3 font-bold text-slate-900 text-right">R${purchase.amount.toFixed(2)}</td>
                                        <td className="py-4 px-3 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium 
                                                ${purchase.status === 'Received' ? 'bg-green-100 text-green-700' : ''}
                                                ${purchase.status === 'Pending' ? 'bg-amber-100 text-amber-700' : ''}
                                                ${purchase.status === 'Cancelled' ? 'bg-red-100 text-red-700' : ''}
                                            `}>
                                                {purchase.status === 'Received' ? 'Recebido' : purchase.status === 'Pending' ? 'Pendente' : 'Cancelado'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-3 pr-6 text-right">
                                            <button className="text-slate-400 hover:text-slate-600 transition-colors">
                                                <Icon name="more_vert" className="!text-lg" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="flex-none flex items-center justify-between p-4 px-6 border-t border-slate-100">
                         <span className="text-sm text-slate-500">Mostrando 1-7 de 48 itens</span>
                         <div className="flex gap-2">
                             <button disabled className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors disabled:opacity-50">
                                 <Icon name="chevron_left" className="!text-lg" />
                             </button>
                             <button className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-sm">1</button>
                             <button className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors text-sm font-medium">2</button>
                             <button className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">
                                 <Icon name="chevron_right" className="!text-lg" />
                             </button>
                         </div>
                    </div>
                </div>
            </div>

            {/* Right Column (Desktop): Form (Span 4) - Moves to bottom on mobile due to DOM order + grid-cols-1 */}
            <div className="lg:col-span-4 flex flex-col gap-4 h-auto lg:h-full lg:overflow-y-auto pr-1 no-scrollbar shrink-0 order-2">
                <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Icon name="add_shopping_cart" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Nova Compra</h2>
                    </div>
                    <form className="flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-3">
                             <div className="col-span-1">
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Fornecedor</label>
                                <select className="w-full rounded-xl border-slate-200 bg-slate-50 text-slate-700 focus:border-primary focus:ring-primary text-base md:text-sm py-2.5 px-4 shadow-sm">
                                    <option>Selecione</option>
                                    <option>Essilor International</option>
                                    <option>Hoya Corporation</option>
                                    <option>Zeiss Vision</option>
                                    <option>Rodenstock</option>
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Data</label>
                                <input type="date" className="w-full rounded-xl border-slate-200 bg-slate-50 text-slate-700 focus:border-primary focus:ring-primary text-base md:text-sm py-2.5 px-4 shadow-sm" />
                            </div>
                        </div>
                        
                        <div>
                             <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Descrição dos Itens</label>
                             <textarea rows={2} placeholder="Ex: 50x Lentes Blue Cut, 20x Bifocal..." className="w-full rounded-xl border-slate-200 bg-slate-50 text-slate-700 focus:border-primary focus:ring-primary text-base md:text-sm py-2.5 px-4 shadow-sm resize-none"></textarea>
                        </div>
                        <div>
                             <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Valor Total</label>
                             <div className="relative">
                                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">R$</span>
                                 <input type="number" placeholder="0.00" className="w-full rounded-xl border-slate-200 bg-slate-50 text-slate-700 focus:border-primary focus:ring-primary text-base md:text-sm py-2.5 px-4 pl-9 shadow-sm" />
                             </div>
                        </div>
                        <div>
                             <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Status</label>
                             <div className="flex gap-2">
                                <label className="flex-1 cursor-pointer">
                                    <input type="radio" name="status" className="peer sr-only" defaultChecked />
                                    <div className="rounded-xl border border-slate-200 p-2.5 text-center text-sm font-medium text-slate-500 hover:bg-slate-50 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all">Pendente</div>
                                </label>
                                <label className="flex-1 cursor-pointer">
                                    <input type="radio" name="status" className="peer sr-only" />
                                    <div className="rounded-xl border border-slate-200 p-2.5 text-center text-sm font-medium text-slate-500 hover:bg-slate-50 peer-checked:border-accent-green peer-checked:bg-accent-green/5 peer-checked:text-accent-green transition-all">Recebido</div>
                                </label>
                             </div>
                        </div>
                        <button type="button" className="mt-2 w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                             <Icon name="save" className="!text-lg" />
                             Salvar Compra
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Purchases;