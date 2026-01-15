
import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Star, DollarSign, CheckCircle, AlertCircle, Trash2, Mail, Phone as PhoneIcon } from 'lucide-react';
import { db, Lead } from '../../db';

const Planner: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'events' | 'leads'>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    setLeads(db.get().leads || []);
  }, []);

  const handleUpdateStatus = (id: number, status: Lead['status']) => {
    db.updateLeadStatus(id, status);
    setLeads(db.get().leads);
  };

  const handleDeleteLead = (id: number) => {
    if (confirm('Excluir esta solicitação de orçamento?')) {
      db.deleteLead(id);
      setLeads(db.get().leads);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-cinzel font-bold text-white">Gestão de Eventos</h2>
          <p className="text-gray-500 mt-1">Gerencie orçamentos recebidos e agenda de execução.</p>
        </div>
        <div className="flex bg-brand-graphite p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setActiveTab('leads')}
            className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'leads' ? 'bg-brand-gold text-brand-richBlack' : 'text-gray-500'}`}
          >
            Orçamentos do Site ({leads.filter(l => l.status === 'Pendente').length})
          </button>
          <button 
            onClick={() => setActiveTab('events')}
            className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'events' ? 'bg-brand-gold text-brand-richBlack' : 'text-gray-500'}`}
          >
            Agenda Confirmada
          </button>
        </div>
      </div>

      {activeTab === 'leads' ? (
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
                      <p className="text-[9px] uppercase font-bold text-gray-600">Local & Data</p>
                      <p className="text-sm text-gray-300 flex items-center gap-2"><MapPin className="w-3 h-3" /> {lead.location}</p>
                      <p className="text-sm text-gray-300 flex items-center gap-2"><Clock className="w-3 h-3" /> {lead.date} às {lead.time}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase font-bold text-gray-600">Convidados</p>
                      <p className="text-sm text-white font-bold">{lead.guests} pessoas</p>
                      <p className="text-[10px] text-gray-500">{lead.planType}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase font-bold text-gray-600">Configurações</p>
                      <p className="text-[10px] text-gray-400">Caipis: {lead.caipiFlavors?.join(', ') || 'N/A'}</p>
                      <p className="text-[10px] text-gray-400">Especiais: {lead.specialDrinks?.length || 0} drinks</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase font-bold text-gray-600">Estimativa</p>
                      <p className="text-xl font-bold text-brand-gold">R$ {lead.total?.toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-8">
                  <button 
                    onClick={() => handleUpdateStatus(lead.id, 'Aprovado')}
                    className="p-3 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDeleteLead(lead.id)}
                    className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <a href={`https://wa.me/55${lead.phone.replace(/\D/g,'')}`} target="_blank" className="px-6 py-3 bg-brand-gold text-brand-richBlack rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                    <PhoneIcon className="w-4 h-4" /> Contatar
                  </a>
                </div>
              </div>
            </div>
          ))}

          {leads.length === 0 && (
            <div className="py-20 text-center text-gray-600 bg-brand-graphite rounded-3xl border border-dashed border-white/10">
              Nenhuma solicitação de orçamento recebida ainda.
            </div>
          )}
        </div>
      ) : (
        <div className="py-20 text-center text-gray-600">
           A funcionalidade de Agenda Confirmada está sendo alimentada pelos Orçamentos Aprovados.
        </div>
      )}
    </div>
  );
};

export default Planner;
