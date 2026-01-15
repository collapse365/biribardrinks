
import React, { useState } from 'react';
import { Send, Calendar, Users, MapPin, Instagram } from 'lucide-react';

const QuoteForm: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      alert('Orçamento solicitado com sucesso! Nossa equipe entrará em contato em breve.');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-6">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row bg-brand-richBlack rounded-2xl overflow-hidden shadow-2xl border border-white/5">
        {/* Contact Info Side */}
        <div className="lg:w-1/3 bg-brand-gold p-12 text-brand-richBlack flex flex-col justify-between">
          <div>
            <h3 className="text-3xl font-cinzel font-bold mb-6">Vamos criar algo épico?</h3>
            <p className="mb-10 text-brand-darkGold font-medium">
              Preencha os detalhes e receba uma proposta personalizada em até 24 horas.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 mt-1" />
                <div>
                  <h4 className="font-bold">Localização</h4>
                  <p className="text-sm opacity-80">Breves - PA</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Calendar className="w-6 h-6 mt-1" />
                <div>
                  <h4 className="font-bold">Disponibilidade</h4>
                  <p className="text-sm opacity-80">Atendimento 24/7 para eventos</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <p className="text-xs uppercase tracking-widest font-bold opacity-60 mb-4">Siga-nos</p>
            <div className="flex gap-4">
              <a 
                href="https://instagram.com/biribardrinks" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 border border-brand-darkGold rounded-full flex items-center justify-center hover:bg-brand-richBlack hover:text-brand-gold transition-all cursor-pointer"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="lg:w-2/3 p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Seu Nome</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: João Silva"
                  className="w-full bg-brand-graphite border border-white/10 rounded-md p-4 text-white focus:outline-none focus:border-brand-gold transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Seu E-mail</label>
                <input 
                  type="email" 
                  required
                  placeholder="Ex: joao@email.com"
                  className="w-full bg-brand-graphite border border-white/10 rounded-md p-4 text-white focus:outline-none focus:border-brand-gold transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Data do Evento</label>
                <input 
                  type="date" 
                  required
                  className="w-full bg-brand-graphite border border-white/10 rounded-md p-4 text-white focus:outline-none focus:border-brand-gold transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Número de Convidados</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    type="number" 
                    required
                    placeholder="Ex: 150"
                    className="w-full bg-brand-graphite border border-white/10 rounded-md p-4 pl-12 text-white focus:outline-none focus:border-brand-gold transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Tipo de Evento</label>
              <select className="w-full bg-brand-graphite border border-white/10 rounded-md p-4 text-white focus:outline-none focus:border-brand-gold transition-all">
                <option>Casamento</option>
                <option>Formatura</option>
                <option>Corporativo</option>
                <option>Aniversário</option>
                <option>Outros</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">Sua Mensagem (Opcional)</label>
              <textarea 
                rows={4}
                placeholder="Conte-nos mais sobre seu evento..."
                className="w-full bg-brand-graphite border border-white/10 rounded-md p-4 text-white focus:outline-none focus:border-brand-gold transition-all resize-none"
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-brand-gold text-brand-richBlack font-bold uppercase tracking-widest py-5 rounded-md hover:bg-white transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? 'Processando...' : (
                <>
                  Enviar Solicitação
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuoteForm;
