import React, { useState, useRef } from 'react';
import { Icon } from '../components/Icon';
import { ShortageFormData } from '../types';
import { shortageService } from '../src/services/shortageService';

const Shortages: React.FC = () => {
  const [formData, setFormData] = useState<ShortageFormData>({
    material: '1.56',
    lensType: 'Branca',
    coating: 'AR',
    sphere: '',
    cylinder: '',
    quantity: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sphereRef = useRef<HTMLInputElement>(null);

  const materialOptions = [
    '1.49',
    '1.53 (Trivex)',
    '1.56',
    '1.59 (Poly)',
    '1.60',
    '1.61',
    '1.67',
    '1.74'
  ];

  const typeOptions = ['Branca', 'Fotossensível (Photo)'];
  const coatingOptions = ['Branca', 'AR', 'Filtro Azul (Verde)', 'BlueCut (Azul)'];

  const is149 = formData.material === '1.49';

  const formatDiopter = (value: string, isCyl = false) => {
    if (!value) return '';
    let num = parseFloat(value);
    if (isNaN(num)) return value;
    if (isCyl) num = -Math.abs(num);
    if (num === 0) return '+0.00';
    const formatted = num.toFixed(2);
    return num > 0 ? `+${formatted}` : formatted;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'material' && value === '1.49') {
      setFormData(prev => ({
        ...prev,
        material: value,
        lensType: 'Branca',
        coating: 'Branca'
      }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'sphere' || name === 'cylinder') {
      const formatted = formatDiopter(value, name === 'cylinder');
      setFormData(prev => ({ ...prev, [name]: formatted }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await shortageService.createShortage({
        refractive_index: formData.material,
        lens_type: formData.lensType,
        coating: formData.coating,
        sphere: formData.sphere,
        cylinder: formData.cylinder,
        quantity: formData.quantity
      });

      alert("Falta registrada com sucesso!");

      // Reset specific fields but keep material, lensType, coating
      setFormData(prev => ({
        ...prev,
        sphere: '',
        cylinder: '',
        quantity: 1
      }));

      // Return cursor to ESF field
      setTimeout(() => {
        sphereRef.current?.focus();
      }, 0);
    } catch (err: any) {
      alert('Erro ao registrar falta: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col px-4 md:px-6 py-4 w-full max-w-[1440px] mx-auto overflow-hidden">

      {/* Header Section */}
      <div className="flex-none mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-amber-50 text-accent-orange text-[10px] md:text-xs font-bold rounded-md uppercase tracking-wide">Controle de Inventário</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Registrar Falta</h2>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm whitespace-nowrap">
          <Icon name="history" className="!text-lg" />
          Histórico Recente
        </button>
      </div>

      {/* Main Content Card - Fit to Screen on Desktop, Scrollable on Mobile */}
      <div className="flex-1 bg-white rounded-3xl shadow-soft border border-slate-100 flex flex-col transition-all duration-300 overflow-hidden mb-2">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Scrollable Form Area */}
          <div className="p-4 md:px-10 md:py-6 flex-1 overflow-y-auto no-scrollbar flex flex-col justify-start md:justify-center">
            <div className="max-w-5xl mx-auto space-y-6 w-full py-2">

              {/* Section 1: Lens Specifications */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <Icon name="lens" className="text-primary !text-base" />
                  Especificações da Lente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Refractive Index */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Índice de Refração</label>
                    <div className="relative">
                      <select
                        name="material"
                        value={formData.material}
                        onChange={handleChange}
                        required
                        className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer hover:bg-slate-100"
                      >
                        {materialOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <Icon name="expand_more" className="!text-lg" />
                      </span>
                    </div>
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Tipo</label>
                    <div className="relative">
                      <select
                        name="lensType"
                        value={formData.lensType}
                        onChange={handleChange}
                        disabled={is149}
                        required
                        className={`w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${is149 ? 'opacity-60 cursor-not-allowed bg-slate-100' : 'cursor-pointer hover:bg-slate-100'}`}
                      >
                        {typeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <Icon name="expand_more" className="!text-lg" />
                      </span>
                    </div>
                  </div>

                  {/* Treatment */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Tratamento</label>
                    <div className="relative">
                      <select
                        name="coating"
                        value={formData.coating}
                        onChange={handleChange}
                        disabled={is149}
                        required
                        className={`w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${is149 ? 'opacity-60 cursor-not-allowed bg-slate-100' : 'cursor-pointer hover:bg-slate-100'}`}
                      >
                        {coatingOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <Icon name="expand_more" className="!text-lg" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Prescription & Quantity */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <Icon name="tune" className="text-accent-purple !text-base" />
                  Parâmetros
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Sphere */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Esférico (ESF)</label>
                    <input
                      name="sphere"
                      ref={sphereRef}
                      value={formData.sphere}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                      placeholder="+0.00"
                      type="text"
                      inputMode="decimal"
                    />
                  </div>

                  {/* Cylinder */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Cilíndrico (CIL)</label>
                    <input
                      name="cylinder"
                      value={formData.cylinder}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-red-600 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                      placeholder="-0.00"
                      type="text"
                      inputMode="decimal"
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 ml-1">Quantidade</label>
                    <div className="relative">
                      <input
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                        min="1"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-4 pr-12 py-2.5 text-slate-900 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
                        type="number"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs font-bold bg-slate-100 px-1.5 py-0.5 rounded">PÇS</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex-none p-4 md:px-10 md:py-6 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <button
              onClick={() => setFormData({
                material: '1.56',
                lensType: 'Branca',
                coating: 'AR',
                sphere: '',
                cylinder: '',
                quantity: 1
              })}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-all text-sm"
              type="button"
            >
              Limpar Formulário
            </button>
            <button
              className="w-full sm:w-auto px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isSubmitting}
            >
              <Icon name="check" className="!text-lg" />
              {isSubmitting ? 'Salvando...' : 'Confirmar Falta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Shortages;