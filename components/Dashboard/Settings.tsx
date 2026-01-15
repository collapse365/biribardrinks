
import React, { useState, useEffect } from 'react';
import { Save, DollarSign, Users, Layout, Calculator, Clock } from 'lucide-react';
import { db, PricingConfig } from '../../db';

const Settings: React.FC = () => {
  const [pricing, setPricing] = useState<PricingConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Fix: db.get() returns a Promise<AppData>, handle it asynchronously.
    db.get().then(data => setPricing(data.pricing));
  }, []);

  const handleSaveAll = () => {
    if (pricing) {
      setIsSaving(true);
      db.updatePricing(pricing);
      setTimeout(() => setIsSaving(false), 800);
    }
  };

  if (!pricing) return null;

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-cinzel font-bold text-white">Taxas & Precificação</h2>
          <p className="text-gray-500 mt-1">Configure as bases matemáticas para generation automática de orçamentos.</p>
        </div>
        <button 
          onClick={handleSaveAll}
          className="px-8 py-4 bg-brand-gold text-brand-richBlack rounded-xl font-bold flex items-center gap-2 hover:bg-white transition-all shadow-xl"
        >
          {isSaving ? 'Salvando...' : <><Save className="w-5 h-5" /> Salvar Taxas</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-brand-graphite p-8 rounded-3xl border border-white/5 space-y-6">
          <h3 className="text-sm font-cinzel font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2 border-b border-white/5 pb-4">
            <DollarSign className="w-4 h-4 text-brand-gold" /> Planos por Pessoa
          </h3>
          <div className="grid grid-cols-2 gap-4">
             <div><label className="text-[10px] text-gray-500 uppercase font-bold">Plano Álcool</label><div className="relative mt-1"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">R$</span><input type="number" value={pricing.baseAlcohol} onChange={e => setPricing({...pricing, baseAlcohol: Number(e.target.value)})} className="w-full bg-brand-richBlack border border-white/10 rounded-lg p-3 pl-8 text-white"/></div></div>
             <div><label className="text-[10px] text-gray-500 uppercase font-bold">Plano Misto</label><div className="relative mt-1"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">R$</span><input type="number" value={pricing.baseMisto} onChange={e => setPricing({...pricing, baseMisto: Number(e.target.value)})} className="w-full bg-brand-richBlack border border-white/10 rounded-lg p-3 pl-8 text-white"/></div></div>
             <div><label className="text-[10px] text-gray-500 uppercase font-bold">Plano Sem Álcool</label><div className="relative mt-1"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">R$</span><input type="number" value={pricing.baseNonAlcohol} onChange={e => setPricing({...pricing, baseNonAlcohol: Number(e.target.value)})} className="w-full bg-brand-richBlack border border-white/10 rounded-lg p-3 pl-8 text-white"/></div></div>
          </div>
        </div>

        <div className="bg-brand-graphite p-8 rounded-3xl border border-white/5 space-y-6">
          <h3 className="text-sm font-cinzel font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2 border-b border-white/5 pb-4">
            <Users className="w-4 h-4 text-brand-gold" /> Estrutura & Equipe
          </h3>
          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="text-[10px] text-gray-500 uppercase font-bold">Hora Barman (Profissional)</label>
               <div className="relative mt-1">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">R$</span>
                 <input type="number" value={pricing.staffHourlyRate} onChange={e => setPricing({...pricing, staffHourlyRate: Number(e.target.value)})} className="w-full bg-brand-richBlack border border-white/10 rounded-lg p-3 pl-8 text-white" placeholder="0,00"/>
               </div>
             </div>
             <div><label className="text-[10px] text-gray-500 uppercase font-bold">Taxa Balcão Única</label><div className="relative mt-1"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">R$</span><input type="number" value={pricing.counterFixedFee} onChange={e => setPricing({...pricing, counterFixedFee: Number(e.target.value)})} className="w-full bg-brand-richBlack border border-white/10 rounded-lg p-3 pl-8 text-white"/></div></div>
             <div><label className="text-[10px] text-gray-500 uppercase font-bold">Hr Extra (Multiplicador %)</label><input type="number" step="0.01" value={pricing.extraHourMultiplier} onChange={e => setPricing({...pricing, extraHourMultiplier: Number(e.target.value)})} className="w-full bg-brand-richBlack border border-white/10 rounded-lg p-3 mt-1 text-white"/></div>
             <div><label className="text-[10px] text-gray-500 uppercase font-bold">Taxa Cristais/Vidro</label><div className="relative mt-1"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">R$</span><input type="number" value={pricing.glasswareFixedFee} onChange={e => setPricing({...pricing, glasswareFixedFee: Number(e.target.value)})} className="w-full bg-brand-richBlack border border-white/10 rounded-lg p-3 pl-8 text-white"/></div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
