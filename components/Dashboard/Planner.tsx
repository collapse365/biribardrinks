
import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Star, DollarSign, CheckCircle, AlertCircle, Trash2, Mail, Phone as PhoneIcon, Loader2 } from 'lucide-react';
import { db, Lead } from '../../db';

const Planner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'events' | 'leads'>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    setLoading(true);
    const data = await db.get();
    setLeads(data.leads || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleUpdateStatus = async (id: number, status: Lead['status']) => {
    await db.updateLeadStatus(id, status);
    fetchLeads();
  };

  const handleDeleteLead = async (id: number) => {
    if (confirm('Excluir esta solicitação de orçamento?')) {
      await db.deleteLead(id);
      fetchLeads();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-cinzel font-bold text-white uppercase tracking-wider">Gestão de Eventos</h2>
          <p className="text-gray-500 mt-1">Gerencie orçamentos recebidos e agenda de execução.</p>
        </div>
        <div className="flex bg-brand-graphite p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setActiveTab('leads')}
            className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'leads' ? 'bg-brand-gold text-brand-richBlack' : 'text-gray-500'}`}
          >
            Orçamentos ({leads.filter(l => l.status === 'Pendente').length})
          </button>
          <button 
            onClick={() => setActiveTab('events')}
            className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'events' ? 'bg-brand-gold text-brand-richBlack' : 'text-gray-500'}`}
          >
            Agenda
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-10 h-10 text-brand-gold animate-spin" />
          <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">Sincronizando com a nuvem...</p>
        </div>
      ) : activeTab === 'leads' ? (
        <div className="space-y-6">
          {leads.map((lead) => (
            <div key={lead.id} className="bg-brand-graphite p-8 rounded-2xl border border-white/5 hover:border-brand-gold/30 transition-all shadow-xl group">
              <div className="flex flex-col lg:flex-row justify-between gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl font-bold text-white">{lead.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      lead.status === 'Pendente' ? 'bg-yellow-500/10 text-yellow-500' : 
                      lead.status === 'Aprovado' ? 'bg-green-500/10 text-green-500' : 'bg-white/5 text-gray-500'
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase font-bold text-gray-600 tracking-widest">Local & Data</p>
                      <p className="text-sm text-gray-300 flex items-center gap-2 font-medium"><MapPin className="w-3 h-3 text-brand-gold" /> {lead.location}</p>
                      <p className="text-sm text-gray-300 flex items-center gap-2 font-medium"><Clock className="w-3 h-3 text-brand-gold" /> {lead.date}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase font-bold text-gray-600 tracking-widest">Convidados</p>
                      <p className="text-sm text-white font-bold">{lead.guests} pessoas</p>
                      <p className="text-[10px] text-brand-gold font-bold uppercase">{lead.planType.replace('-',' ')}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase font-bold text-gray-600 tracking-widest">Insumos</p>
                      <p className="text-[10px] text-gray-400 font-medium">{lead.caipiFlavors?.join(', ') || 'N/A'}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{lead.specialDrinks?.length || 0} drinks especiais</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase font-bold text-gray-600 tracking-widest">Estimativa</p>
                      <p className="text-xl font-bold text-brand-gold">R$ {lead.total?.toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-8">
                  {lead.status === 'Pendente' && (
                    <button 
                      onClick={() => handleUpdateStatus(lead.id, 'Aprovado')}
                      className="p-4 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-lg"
                      title="Aprovar Orçamento"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteLead(lead.id)}
                    className="p-4 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg"
                    title="Excluir Lead"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <a href={`https://wa.me/55${lead.phone.replace(/\D/g,'')}`} target="_blank" className="px-8 py-4 bg-brand-gold text-brand-richBlack rounded-xl font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2 hover:scale-105 transition-all shadow-xl">
                    <PhoneIcon className="w-4 h-4" /> Contatar
                  </a>
                </div>
              </div>
            </div>
          ))}

          {leads.length === 0 && (
            <div className="py-24 text-center text-gray-600 bg-brand-graphite rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center gap-4">
              <AlertCircle className="w-12 h-12 opacity-20" />
              <p className="font-bold uppercase tracking-widest text-xs">Nenhum lead disponível no momento</p>
            </div>
          )}
        </div>
      ) : (
        <div className="py-24 text-center text-gray-600 bg-brand-graphite rounded-3xl border-2 border-dashed border-white/5">
           <p className="font-bold uppercase tracking-widest text-xs">A funcionalidade de Agenda está sendo sincronizada.</p>
        </div>
      )}
    </div>
  );
};

export default Planner;
