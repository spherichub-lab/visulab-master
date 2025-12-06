import React, { useState, useEffect } from 'react';
import { Icon } from '../components/Icon';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell, PieChart, Pie } from 'recharts';

const initialDataBar = [
  { name: '1.56 Mid', value: 45, color: '#137fec' },
  { name: '1.60 High', value: 28, color: '#8b5cf6' },
  { name: '1.67 Ultra', value: 15, color: '#f97316' },
  { name: '1.74 Thin', value: 12, color: '#10b981' },
];

const initialDataPie = [
  { name: 'Blue Cut', value: 40, color: '#8b5cf6' },
  { name: 'HMC', value: 30, color: '#137fec' },
  { name: 'Photochromic', value: 20, color: '#f97316' },
  { name: 'Others', value: 10, color: '#e2e8f0' },
];

const recentShortages = [
  { index: '1.56', esfCil: '+1.00 -2.25', user: 'Junior Carvalho', treatment: 'Filtro Azul (Verde)', company: 'AMX', time: '2 min atrás' },
  { index: '1.74', esfCil: '-4.50 -1.00', user: 'Sarah Jenkins', treatment: 'AR Premium', company: 'Master', time: '45 min atrás' },
  { index: '1.60', esfCil: '+2.00 -0.50', user: 'Michael Korb', treatment: 'Photochromic', company: 'Ultra Optics', time: '2 hrs atrás' },
  { index: '1.49', esfCil: '+0.00 -1.25', user: 'Robert Wilson', treatment: 'HMC', company: 'GBO', time: '5 hrs atrás' },
];

const getIndexColor = (index: string) => {
    switch(index) {
        case '1.49': return 'bg-slate-100 text-slate-600 border-slate-200';
        case '1.56': return 'bg-blue-50 text-primary border-blue-100';
        case '1.60': return 'bg-purple-50 text-accent-purple border-purple-100';
        case '1.67': return 'bg-orange-50 text-accent-orange border-orange-100';
        case '1.74': return 'bg-emerald-50 text-accent-green border-emerald-100';
        default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
};

const getCompanyLogoStyle = (company: string) => {
    switch(company) {
        case 'Master': return 'bg-slate-900 text-white'; // Head Office
        case 'AMX': return 'bg-blue-600 text-white'; // Branch
        case 'Ultra Optics': return 'bg-emerald-600 text-white'; // Supplier
        case 'GBO': return 'bg-orange-500 text-white'; // Supplier
        default: return 'bg-slate-200 text-slate-600';
    }
};

const getCompanyInitials = (company: string) => {
    switch(company) {
        case 'Master': return 'M';
        case 'AMX': return 'A';
        case 'Ultra Optics': return 'UO';
        case 'GBO': return 'G';
        default: return company.substring(0,2).toUpperCase();
    }
};

const Dashboard: React.FC = () => {
  // --- Chart Data State ---
  const [barData, setBarData] = useState(initialDataBar);
  const [pieData, setPieData] = useState(initialDataPie);
  const [isChartLoading, setIsChartLoading] = useState(false);

  // --- Filters for "Generate Report" ---
  const [reportFilters, setReportFilters] = useState({
    startDate: '',
    endDate: '',
    index: 'Todos',
    treatment: 'Todos',
    company: 'Todas'
  });

  // --- Filters for "Shortage Analytics" (Charts) ---
  const [analyticsFilters, setAnalyticsFilters] = useState({
    company: 'All', // 'All', 'Master', 'AMX'
    range: '7 Days', // 'Today', '7 Days', '30 Days', 'Custom'
    customStart: '',
    customEnd: ''
  });

  // Handle Report Filter Changes
  const handleReportFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setReportFilters(prev => ({ ...prev, [name]: value }));
  };

  // Handle Analytics Filter Changes
  const handleAnalyticsChange = (key: string, value: string) => {
    setAnalyticsFilters(prev => ({ ...prev, [key]: value }));
  };

  // Effect to simulate chart update when Analytics Filters change
  useEffect(() => {
    setIsChartLoading(true);
    const timer = setTimeout(() => {
        // Generate random distribution for demo purposes based on filters
        const generateRandomData = () => {
            const r1 = Math.random();
            const r2 = Math.random();
            const r3 = Math.random();
            const r4 = Math.random();
            const sum = r1 + r2 + r3 + r4;
            return [r1, r2, r3, r4].map(r => Math.round((r / sum) * 100));
        };

        const newBarVals = generateRandomData();
        const newPieVals = generateRandomData();

        const newBarData = [
            { name: '1.56 Mid', value: newBarVals[0], color: '#137fec' },
            { name: '1.60 High', value: newBarVals[1], color: '#8b5cf6' },
            { name: '1.67 Ultra', value: newBarVals[2], color: '#f97316' },
            { name: '1.74 Thin', value: newBarVals[3], color: '#10b981' },
        ].sort((a,b) => b.value - a.value);

        const newPieData = [
            { name: 'Blue Cut', value: newPieVals[0], color: '#8b5cf6' },
            { name: 'HMC', value: newPieVals[1], color: '#137fec' },
            { name: 'Photochromic', value: newPieVals[2], color: '#f97316' },
            { name: 'Others', value: newPieVals[3], color: '#e2e8f0' },
        ];

        setBarData(newBarData);
        setPieData(newPieData);
        setIsChartLoading(false);
    }, 400); // Simulate network delay

    return () => clearTimeout(timer);
  }, [analyticsFilters]);

  const handleExportTxt = () => {
    console.log("Exporting TXT with report filters:", reportFilters);
    alert("Exportando dados para .txt usando filtros de 'Gerar Relatório'...");
  };

  const handleExportPdf = () => {
    console.log("Exporting PDF with report filters:", reportFilters);
    alert("Gerando relatório PDF usando filtros de 'Gerar Relatório'...");
  };

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
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">142</h3>
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
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">12</h3>
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
                <h3 className="text-lg md:text-xl font-black text-slate-900 mt-1 leading-tight">1.56 Blue Cut</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">42 unidades</p>
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
                <h3 className="text-lg md:text-xl font-black text-slate-900 mt-1 whitespace-nowrap">24/10/23</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Verificada</p>
              </div>
           </div>
        </div>
      </div>

      {/* Middle Section: Shortage Analytics (Unified Filters + 2 Chart Cards) */}
      <div className="flex flex-col gap-6">
        
        {/* Analytics Header & Unified Filters */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
             <div>
                <h3 className="text-xl font-bold text-slate-900">Análise de Faltas</h3>
                <p className="text-sm text-slate-500 mt-1">Visão geral das faltas em tempo real.</p>
             </div>

             {/* Unified Filter Bar */}
             <div className="flex flex-col md:flex-row gap-4 md:items-center bg-white p-2 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                 {/* Company Dropdown */}
                 <div className="min-w-[160px] px-2">
                     <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Empresa</label>
                     <div className="relative">
                        <select 
                            value={analyticsFilters.company}
                            onChange={(e) => handleAnalyticsChange('company', e.target.value)}
                            className="w-full appearance-none bg-transparent border-none p-0 text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer pr-6"
                        >
                            <option value="All">Todas</option>
                            <option value="Master">Master</option>
                            <option value="AMX">AMX</option>
                        </select>
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <Icon name="expand_more" className="!text-lg" />
                        </span>
                     </div>
                 </div>

                 <div className="w-px bg-slate-100 hidden md:block h-8"></div>

                 {/* Quick Filter Buttons */}
                 <div className="flex gap-2 flex-wrap">
                    {['Hoje', '7 Dias', '30 Dias', 'Personalizado'].map((period) => (
                        <button 
                            key={period}
                            onClick={() => handleAnalyticsChange('range', period)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                analyticsFilters.range === period 
                                ? 'bg-slate-900 text-white shadow-md' 
                                : 'text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            {period}
                        </button>
                    ))}
                 </div>

                 {/* Custom Date Inputs (Conditional) */}
                 {analyticsFilters.range === 'Personalizado' && (
                     <div className="flex gap-2 animate-fade-in pl-2 border-l border-slate-100">
                         <input 
                             type="date" 
                             value={analyticsFilters.customStart}
                             onChange={(e) => handleAnalyticsChange('customStart', e.target.value)}
                             className="rounded-lg border-slate-200 bg-slate-50 py-1.5 px-2 text-xs font-semibold text-slate-700 shadow-sm focus:ring-primary focus:border-primary" 
                         />
                         <span className="self-center text-slate-400">-</span>
                         <input 
                             type="date" 
                             value={analyticsFilters.customEnd}
                             onChange={(e) => handleAnalyticsChange('customEnd', e.target.value)}
                             className="rounded-lg border-slate-200 bg-slate-50 py-1.5 px-2 text-xs font-semibold text-slate-700 shadow-sm focus:ring-primary focus:border-primary" 
                         />
                     </div>
                 )}
            </div>
        </div>

        {/* Charts Row: Two Separate Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: By Refractive Index */}
            <div className={`bg-white p-6 rounded-3xl shadow-soft border border-slate-100 flex flex-col transition-all duration-300 hover:shadow-hover hover:-translate-y-1 ${isChartLoading ? 'opacity-50' : 'opacity-100'}`}>
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
                  {barData.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-slate-700">{item.name}</span>
                        <span className="font-bold text-slate-900">{item.value}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div className="h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${item.value}%`, backgroundColor: item.color }}></div>
                      </div>
                    </div>
                  ))}
                </div>
            </div>

            {/* Card 2: By Treatment */}
            <div className={`bg-white p-6 rounded-3xl shadow-soft border border-slate-100 flex flex-col transition-all duration-300 hover:shadow-hover hover:-translate-y-1 ${isChartLoading ? 'opacity-50' : 'opacity-100'}`}>
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
                        <span className="block text-3xl font-bold text-slate-900">142</span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Total</span>
                      </div>
                   </div>
                   <div className="flex flex-col gap-3 w-full max-w-[200px]">
                     {pieData.map((item, idx) => (
                       <div key={idx} className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: item.color}}></div>
                           <span className="text-xs font-medium text-slate-600">{item.name}</span>
                         </div>
                         <span className="text-xs font-bold text-slate-900">{item.value}%</span>
                       </div>
                     ))}
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
             {recentShortages.map((item, idx) => (
                <div key={idx} className="flex gap-4 relative">
                  {/* Timeline Line */}
                  {idx !== recentShortages.length - 1 && (
                      <div className="absolute left-[20px] top-10 bottom-[-24px] w-px bg-slate-100 -translate-x-1/2 z-0"></div>
                  )}

                  {/* Icon */}
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center text-[11px] font-bold border-2 border-white shadow-sm z-10 relative shrink-0 ${getIndexColor(item.index)}`}>
                    {item.index}
                  </div>

                  {/* Content Container - Flex row */}
                  <div className="flex-1 flex items-center justify-between min-w-0 py-2">
                    
                    {/* Text Info - Modified to be 2 lines */}
                    <div className="flex flex-col gap-0.5 mr-2 min-w-0">
                         {/* Top Line: ESF + CIL + Treatment */}
                         <div className="flex flex-wrap items-baseline gap-2">
                            <span className="text-sm font-bold text-slate-900 whitespace-nowrap">{item.esfCil}</span>
                            <span className="text-xs text-slate-500 font-medium whitespace-nowrap truncate">{item.treatment}</span>
                         </div>
                         {/* Second Line: User Name */}
                         <div className="flex items-center">
                            <span className="text-xs font-semibold text-slate-700">{item.user}</span>
                         </div>
                    </div>

                    {/* Right Side: Logo + Time */}
                    <div className="flex items-center gap-3 shrink-0 pl-2">
                        {/* Logo - Circular */}
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${getCompanyLogoStyle(item.company)}`}>
                            {getCompanyInitials(item.company)}
                        </div>
                        
                        {/* Time */}
                        <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap w-[70px] text-right">{item.time}</span>
                    </div>
                  </div>
                </div>
             ))}
          </div>
        </div>

        {/* Generate Report Card */}
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
                            <input 
                                type="date" 
                                name="startDate"
                                value={reportFilters.startDate}
                                onChange={handleReportFilterChange}
                                className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 focus:ring-primary focus:border-primary px-3 py-2.5 cursor-pointer" 
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide ml-1">Até</label>
                            <input 
                                type="date" 
                                name="endDate"
                                value={reportFilters.endDate}
                                onChange={handleReportFilterChange}
                                className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 focus:ring-primary focus:border-primary px-3 py-2.5 cursor-pointer" 
                            />
                        </div>
                    </div>

                    {/* Dropdowns */}
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide ml-1">Índice</label>
                            <select 
                                name="index"
                                value={reportFilters.index}
                                onChange={handleReportFilterChange}
                                className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 focus:ring-primary focus:border-primary px-3 py-2.5 cursor-pointer"
                            >
                                <option>Todos</option>
                                <option>1.49</option>
                                <option>1.56</option>
                                <option>1.60</option>
                                <option>1.67</option>
                                <option>1.74</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide ml-1">Tratamento</label>
                            <select 
                                name="treatment"
                                value={reportFilters.treatment}
                                onChange={handleReportFilterChange}
                                className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 focus:ring-primary focus:border-primary px-3 py-2.5 cursor-pointer"
                            >
                                <option>Todos</option>
                                <option>HMC</option>
                                <option>Blue Cut</option>
                                <option>Photochromic</option>
                                <option>White</option>
                            </select>
                        </div>
                         <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide ml-1">Empresa</label>
                            <select 
                                name="company"
                                value={reportFilters.company}
                                onChange={handleReportFilterChange}
                                className="w-full rounded-xl border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 focus:ring-primary focus:border-primary px-3 py-2.5 cursor-pointer"
                            >
                                <option>Todas</option>
                                <option>OptiLens Pro</option>
                                <option>Visionary Clinics</option>
                                <option>EyeTech</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Export Buttons */}
                <div className="grid grid-cols-2 gap-4 mt-auto">
                   <button 
                      onClick={handleExportTxt}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all text-sm group"
                   >
                      <Icon name="description" className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                      TXT
                   </button>
                   <button 
                      onClick={handleExportPdf}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all text-sm group"
                   >
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