import React, { useState, useEffect } from 'react';
import { Icon } from '../components/Icon';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { shortageService } from '../src/services/shortageService';
import { getCompanyBranding } from '../src/utils/companyBranding';

// --- Helper Functions from Original Design ---
const getIndexColor = (index: string) => {
  if (!index) return 'bg-slate-100 text-slate-600 border-slate-200';
  const cleanIndex = index.split(' ')[0];
  switch (cleanIndex) {
    case '1.49': return 'bg-slate-100 text-slate-600 border-slate-200';
    case '1.56': return 'bg-blue-50 text-primary border-blue-100';
    case '1.60': return 'bg-purple-50 text-accent-purple border-purple-100';
    case '1.67': return 'bg-orange-50 text-accent-orange border-orange-100';
    case '1.74': return 'bg-emerald-50 text-accent-green border-emerald-100';
    default: return 'bg-slate-100 text-slate-600 border-slate-200';
  }
};

const formatTimeAgo = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'agora';
  if (diffMins < 60) return `${diffMins} min atrás`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hora' : 'hrs'} atrás`;
  return `${diffDays} ${diffDays === 1 ? 'dia' : 'dias'} atrás`;
};

const Dashboard: React.FC = () => {
  // --- State ---
  const [statistics, setStatistics] = useState<any>(null);
  const [recentShortages, setRecentShortages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [stats, shortages] = await Promise.all([
          shortageService.getStatistics(),
          shortageService.getAllShortages()
        ]);

        setStatistics(stats);
        setRecentShortages(shortages.slice(0, 4));
      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Prepare Chart Data ---
  const barData = statistics?.indexCounts ?
    Object.entries(statistics.indexCounts)
      .map(([name, value]) => {
        // Map colors based on index
        let color = '#e2e8f0';
        if (name.includes('1.56')) color = '#137fec';
        if (name.includes('1.60')) color = '#8b5cf6';
        if (name.includes('1.67')) color = '#f97316';
        if (name.includes('1.74')) color = '#10b981';
        return { name, value: value as number, color };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 4) : [];

  const pieData = statistics?.coatingCounts ?
    Object.entries(statistics.coatingCounts)
      .map(([name, value]) => {
        // Map colors based on coating
        let color = '#e2e8f0';
        if (name.includes('Blue')) color = '#8b5cf6';
        if (name.includes('HMC') || name.includes('AR')) color = '#137fec';
        if (name.includes('Photo')) color = '#f97316';
        return { name, value: value as number, color };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 4) : [];

  const totalShortages = statistics?.totalShortages || 0;

  if (error) {
    return <div className="p-8 text-center text-red-500">Erro: {error}</div>;
  }

  return (
    <div className="h-full overflow-y-auto px-4 md:px-6 py-6 w-full max-w-[1440px] mx-auto flex flex-col gap-6 no-scrollbar">

      {/* Top Section: 4 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Left Block */}
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white p-5 rounded-3xl shadow-soft border border-slate-100 flex flex-col justify-center gap-2 hover:shadow-hover hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                <Icon name="error_outline" className="!text-xl md:!text-2xl" />
              </div>
              <span className="flex items-center text-[10px] md:text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                +8% <Icon name="trending_up" className="!text-xs md:!text-sm ml-0.5" />
              </span>
            </div>
            <div>
              <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-wide">Total de Faltas</p>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
                {isLoading ? '...' : totalShortages}
              </h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-soft border border-slate-100 flex flex-col justify-center gap-2 hover:shadow-hover hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center">
                <Icon name="today" className="!text-xl md:!text-2xl" />
              </div>
              <span className="flex items-center text-[10px] md:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                -2 <Icon name="trending_down" className="!text-xs md:!text-sm ml-0.5" />
              </span>
            </div>
            <div>
              <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-wide">Faltas de Hoje</p>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
                {isLoading ? '...' : statistics?.todayShortages || 0}
              </h3>
            </div>
          </div>
        </div>

        {/* Right Block */}
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white p-5 rounded-3xl shadow-soft border border-slate-100 flex flex-col justify-center gap-2 hover:shadow-hover hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-amber-50 text-accent-orange flex items-center justify-center">
                <Icon name="analytics" className="!text-xl md:!text-2xl" />
              </div>
              <span className="flex items-center text-[10px] md:text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg whitespace-nowrap">
                Top #1
              </span>
            </div>
            <div>
              <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-wide truncate">Maior Falta</p>
              <h3 className="text-lg md:text-xl font-black text-slate-900 mt-1 leading-tight">
                {isLoading ? '...' : statistics?.mostCommon ? statistics.mostCommon.index : 'N/A'}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {statistics?.mostCommon ? `${statistics.mostCommon.quantity} unidades` : ''}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-soft border border-slate-100 flex flex-col justify-center gap-2 hover:shadow-hover hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Icon name="receipt_long" className="!text-xl md:!text-2xl" />
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-wide truncate">Última Compra</p>
              <h3 className="text-lg md:text-xl font-black text-slate-900 mt-1 whitespace-nowrap">
                {recentShortages[0] ? new Date(recentShortages[0].created_at).toLocaleDateString('pt-BR') : 'N/A'}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Registrada</p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Shortage Analytics (Charts) */}
      <div className="flex flex-col gap-6">

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Análise de Faltas</h3>
            <p className="text-sm text-slate-500 mt-1">Visão geral das faltas em tempo real.</p>
          </div>
        </div>

        {/* Charts Row: Two Separate Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Card 1: By Refractive Index (Progress Bars) */}
          <div className={`bg-white p-6 rounded-3xl shadow-soft border border-slate-100 flex flex-col transition-all duration-300 hover:shadow-hover hover:-translate-y-1 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-primary rounded-lg">
                  <Icon name="bar_chart" className="!text-lg" />
                </div>
                Por Índice de Refração
              </h4>
              <button className="text-slate-400 hover:text-primary transition-colors">
                <Icon name="more_horiz" />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center gap-5">
              {barData.length === 0 ? <p className="text-center text-slate-400">Sem dados</p> : barData.map((item, idx) => {
                const percentage = totalShortages > 0 ? Math.round((item.value / totalShortages) * 100) : 0;
                return (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-slate-700">{item.name}</span>
                      <span className="font-bold text-slate-900">{percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div className="h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${percentage}%`, backgroundColor: item.color }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Card 2: By Treatment (Pie Chart) */}
          <div className={`bg-white p-6 rounded-3xl shadow-soft border border-slate-100 flex flex-col transition-all duration-300 hover:shadow-hover hover:-translate-y-1 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <div className="p-2 bg-purple-50 text-accent-purple rounded-lg">
                  <Icon name="pie_chart" className="!text-lg" />
                </div>
                Por Tratamento
              </h4>
              <button className="text-slate-400 hover:text-accent-purple transition-colors">
                <Icon name="more_horiz" />
              </button>
            </div>
            <div className="flex-1 flex flex-col sm:flex-row items-center gap-6 justify-center">
              <div className="relative h-48 w-48 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={0}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                      animationDuration={1000}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <span className="block text-3xl font-bold text-slate-900">{totalShortages}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Total</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full max-w-[200px]">
                {pieData.map((item, idx) => {
                  const percentage = totalShortages > 0 ? Math.round((item.value / totalShortages) * 100) : 0;
                  return (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-xs font-medium text-slate-600">{item.name}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-900">{percentage}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Section: Recent Activity & Generate Report */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Activity Card */}
        <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-100 h-full flex flex-col hover:shadow-hover hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Atividade Recente</h3>
            <a href="#" className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors">Ver Tudo</a>
          </div>
          <div className="space-y-6 flex-1">
            {recentShortages.length === 0 ? <p className="text-center text-slate-400">Nenhuma atividade recente</p> : recentShortages.map((item, idx) => (
              <div key={idx} className="flex gap-4 relative">
                {/* Timeline Line */}
                {idx !== recentShortages.length - 1 && (
                  <div className="absolute left-[20px] top-10 bottom-[-24px] w-px bg-slate-100 -translate-x-1/2 z-0"></div>
                )}

                {/* Icon */}
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-[11px] font-bold border-2 border-white shadow-sm z-10 relative shrink-0 ${getIndexColor(item.refractive_index)}`}>
                  {item.refractive_index ? item.refractive_index.split(' ')[0] : '?'}
                </div>

                {/* Content Container - Modified Layout */}
                <div className="flex-1 flex flex-col justify-center min-w-0 py-1 gap-1">

                  {/* Top Line: ESF + CIL + Treatment + Company Icon */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-900 whitespace-nowrap">
                      {Number(item.sphere) > 0 ? '+' : ''}{item.sphere} {Number(item.cylinder) > 0 ? '+' : ''}{item.cylinder}
                    </span>
                    <span className="text-xs text-slate-500 font-medium whitespace-nowrap truncate max-w-[120px] md:max-w-none">
                      {item.coating}
                    </span>

                    {/* Company Icon Inline */}
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-bold shadow-sm shrink-0 ${item.company_color_class || 'bg-slate-200 text-slate-600'}`} title={item.company_name}>
                      {item.company_initials || '?'}
                    </div>
                  </div>

                  {/* Second Line: User Name + Timestamp */}
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-semibold text-slate-700">{item.user_name}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(item.created_at)}</span>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Report Card (Static Placeholder for now to match layout) */}
        <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-100 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
            <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-md">
              <Icon name="description" className="!text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Gerar Relatório</h3>
              <p className="text-xs text-slate-500">Exporte dados de faltas filtrados.</p>
            </div>
          </div>

          <div className="flex flex-col gap-5 flex-1 justify-between">
            {/* Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date Inputs */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide ml-1">De</label>
                  <input type="date" className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 focus:ring-primary focus:border-primary px-3 py-2.5 cursor-pointer" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide ml-1">Até</label>
                  <input type="date" className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 focus:ring-primary focus:border-primary px-3 py-2.5 cursor-pointer" />
                </div>
              </div>

              {/* Dropdowns */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide ml-1">Índice</label>
                  <select className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 focus:ring-primary focus:border-primary px-3 py-2.5 cursor-pointer">
                    <option>Todos</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide ml-1">Tratamento</label>
                  <select className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 focus:ring-primary focus:border-primary px-3 py-2.5 cursor-pointer">
                    <option>Todos</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide ml-1">Empresa</label>
                  <select className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 focus:ring-primary focus:border-primary px-3 py-2.5 cursor-pointer">
                    <option>Todas</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="grid grid-cols-2 gap-4 mt-auto">
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all text-sm group">
                <Icon name="description" className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                TXT
              </button>
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all text-sm group">
                <Icon name="picture_as_pdf" className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                PDF
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;