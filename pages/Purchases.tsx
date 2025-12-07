import React, { useState, useEffect } from 'react';
import { Icon } from '../components/Icon';
import { Purchase, Company } from '../types';
import { userService } from '../src/services/userService';
import { purchaseService, CreatePurchaseParams } from '../src/services/purchaseService';

const Purchases: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState<CreatePurchaseParams>({
        supplier_id: '',
        date: new Date().toISOString().split('T')[0],
        items_description: '',
        amount: 0,
        status: 'Pending'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchPurchases = async () => {
        try {
            const purchasesData = await purchaseService.getAllPurchases();
            setPurchases(purchasesData);
        } catch (err) {
            console.error('Failed to fetch purchases:', err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [companiesData, purchasesData] = await Promise.all([
                    userService.getAllCompanies(),
                    purchaseService.getAllPurchases()
                ]);
                setCompanies(companiesData);
                setPurchases(purchasesData);

                // Set default supplier if available
                const suppliers = companiesData.filter(c => c.type === 'Fornecedor');
                if (suppliers.length > 0) {
                    setFormData(prev => ({ ...prev, supplier_id: suppliers[0].id }));
                }
            } catch (err) {
                console.error('Failed to fetch data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter only suppliers
    const suppliers = companies.filter(company => company.type === 'Fornecedor');

    // Calculate total cost
    const totalCost = purchases.reduce((sum, p) => sum + p.amount, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await purchaseService.createPurchase(formData);
            await fetchPurchases();

            // Reset form
            setFormData({
                supplier_id: suppliers[0]?.id || '',
                date: new Date().toISOString().split('T')[0],
                items_description: '',
                amount: 0,
                status: 'Pending'
            });

            alert('Compra criada com sucesso!');
        } catch (err: any) {
            alert('Erro ao criar compra: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'amount' ? parseFloat(value) || 0 : value
        }));
    };

    return (
        <div className="h-full flex flex-col px-4 md:px-6 py-4 overflow-hidden">
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0 overflow-y-auto lg:overflow-hidden no-scrollbar">

                {/* Left Column (Desktop): Metrics & History (Span 8) */}
                <div className="lg:col-span-8 flex flex-col gap-4 h-full overflow-hidden min-h-[500px] lg:min-h-0 order-1">
                    <div className="flex-none grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            {
                                label: 'Custo Total',
                                value: `R$${totalCost.toFixed(2)}`,
                                icon: 'receipt_long',
                                bg: 'bg-blue-50',
                                color: 'text-primary'
                            },
                            {
                                label: 'Recebidos',
                                value: `${purchases.filter(p => p.status === 'Received').length} Pedidos`,
                                icon: 'check_circle',
                                bg: 'bg-green-50',
                                color: 'text-accent-green'
                            },
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
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-slate-400">Carregando...</p>
                                </div>
                            ) : purchases.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                    <Icon name="shopping_cart" className="!text-6xl text-slate-300 mb-4" />
                                    <p className="text-slate-500 font-medium">Nenhuma compra registrada</p>
                                    <p className="text-slate-400 text-sm mt-1">Adicione sua primeira compra usando o formulário ao lado</p>
                                </div>
                            ) : (
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
                                        {purchases.map(purchase => (
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
                            )}
                        </div>

                        <div className="flex-none flex items-center justify-between p-4 px-6 border-t border-slate-100">
                            <span className="text-sm text-slate-500">Mostrando {purchases.length} {purchases.length === 1 ? 'item' : 'itens'}</span>
                            <div className="flex gap-2">
                                <button disabled className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors disabled:opacity-50">
                                    <Icon name="chevron_left" className="!text-lg" />
                                </button>
                                <button className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-sm">1</button>
                                <button className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">
                                    <Icon name="chevron_right" className="!text-lg" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Desktop): Form (Span 4) */}
                <div className="lg:col-span-4 flex flex-col gap-4 h-auto lg:h-full lg:overflow-y-auto pr-1 no-scrollbar shrink-0 order-2">
                    <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Icon name="add_shopping_cart" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">Nova Compra</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-1">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Fornecedor</label>
                                    <select
                                        name="supplier_id"
                                        value={formData.supplier_id}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full rounded-xl border-slate-200 bg-slate-50 text-slate-700 focus:border-primary focus:ring-primary text-base md:text-sm py-2.5 px-4 shadow-sm"
                                    >
                                        <option value="">Selecione</option>
                                        {suppliers.map(supplier => (
                                            <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Data</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full rounded-xl border-slate-200 bg-slate-50 text-slate-700 focus:border-primary focus:ring-primary text-base md:text-sm py-2.5 px-4 shadow-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Descrição dos Itens</label>
                                <textarea
                                    rows={2}
                                    name="items_description"
                                    value={formData.items_description}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Ex: 50x Lentes Blue Cut, 20x Bifocal..."
                                    className="w-full rounded-xl border-slate-200 bg-slate-50 text-slate-700 focus:border-primary focus:ring-primary text-base md:text-sm py-2.5 px-4 shadow-sm resize-none"
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Valor Total</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">R$</span>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        required
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        className="w-full rounded-xl border-slate-200 bg-slate-50 text-slate-700 focus:border-primary focus:ring-primary text-base md:text-sm py-2.5 px-4 pl-9 shadow-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Status</label>
                                <div className="flex gap-2">
                                    <label className="flex-1 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="Pending"
                                            checked={formData.status === 'Pending'}
                                            onChange={handleInputChange}
                                            className="peer sr-only"
                                        />
                                        <div className="rounded-xl border border-slate-200 p-2.5 text-center text-sm font-medium text-slate-500 hover:bg-slate-50 peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all">Pendente</div>
                                    </label>
                                    <label className="flex-1 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="Received"
                                            checked={formData.status === 'Received'}
                                            onChange={handleInputChange}
                                            className="peer sr-only"
                                        />
                                        <div className="rounded-xl border border-slate-200 p-2.5 text-center text-sm font-medium text-slate-500 hover:bg-slate-50 peer-checked:border-accent-green peer-checked:bg-accent-green/5 peer-checked:text-accent-green transition-all">Recebido</div>
                                    </label>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="mt-2 w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Icon name="save" className="!text-lg" />
                                {isSubmitting ? 'Salvando...' : 'Salvar Compra'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Purchases;