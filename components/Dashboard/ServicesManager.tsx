
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Image as ImageIcon, Upload, X, Check, Save, Martini, Coffee, PartyPopper, Users, Sparkles, Star } from 'lucide-react';
import { db, Service } from '../../db';

const ICON_OPTIONS = {
  Martini: Martini,
  Coffee: Coffee,
  PartyPopper: PartyPopper,
  Users: Users,
  Sparkles: Sparkles,
  Star: Star
};

const ServicesManager: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);

  useEffect(() => {
    // Fix: db.get() returns a Promise<AppData>, handle it asynchronously.
    db.get().then(data => setServices(data.services || []));
  }, []);

  const handleSave = () => {
    if (editingService) {
      let newList;
      const exists = services.find(s => s.id === editingService.id);
      if (exists) {
        newList = services.map(s => s.id === editingService.id ? editingService : s);
      } else {
        newList = [...services, editingService];
      }
      setServices(newList);
      db.updateServices(newList);
      setEditingService(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja excluir este serviço?')) {
      const newList = services.filter(s => s.id !== id);
      setServices(newList);
      db.updateServices(newList);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingService) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingService({ ...editingService, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (editingService) {
    return (
      <div className="bg-brand-graphite p-8 rounded-2xl border border-brand-gold/20 space-y-8 max-w-4xl mx-auto shadow-2xl animate-fade-in">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-brand-gold" /> 
            {editingService.title ? `Editando: ${editingService.title}` : 'Novo Serviço'}
          </h3>
          <button onClick={() => setEditingService(null)} className="text-gray-500 hover:text-white uppercase text-[10px] font-bold">Cancelar</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Título do Serviço</label>
            <input 
              type="text" 
              value={editingService.title} 
              onChange={e => setEditingService({...editingService, title: e.target.value})} 
              className="w-full bg-brand-richBlack border border-white/10 rounded-xl p-4 text-white outline-none focus:border-brand-gold"
              placeholder="Ex: Bar de Casamentos Premium"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Ícone Representativo</label>
            <div className="grid grid-cols-6 gap-2">
              {Object.keys(ICON_OPTIONS).map((iconKey) => {
                const IconComp = ICON_OPTIONS[iconKey as keyof typeof ICON_OPTIONS];
                return (
                  <button
                    key={iconKey}
                    onClick={() => setEditingService({...editingService, iconName: iconKey})}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center ${editingService.iconName === iconKey ? 'border-brand-gold bg-brand-gold/10 text-brand-gold' : 'border-white/5 text-gray-500 hover:border-white/20'}`}
                  >
                    <IconComp className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Descrição (Legenda)</label>
          <textarea 
            rows={4}
            value={editingService.description} 
            onChange={e => setEditingService({...editingService, description: e.target.value})} 
            className="w-full bg-brand-richBlack border border-white/10 rounded-xl p-4 text-white outline-none focus:border-brand-gold resize-none"
            placeholder="Descreva o que está incluído neste serviço..."
          ></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Foto de Capa do Serviço</label>
          <div className="flex gap-4">
            <div className="relative flex-grow">
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                placeholder="https://sua-imagem.com/foto.jpg"
                value={editingService.image} 
                onChange={e => setEditingService({...editingService, image: e.target.value})}
                className="w-full bg-brand-richBlack border border-white/10 rounded-xl p-4 pl-12 text-white outline-none focus:border-brand-gold"
              />
            </div>
            <label className="cursor-pointer px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
              <Upload className="w-4 h-4" /> Upload
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>
          {editingService.image && (
            <div className="mt-4 relative h-40 w-full rounded-xl overflow-hidden border border-brand-gold/20">
              <img src={editingService.image} className="w-full h-full object-cover" alt="Preview" />
              <button 
                onClick={() => setEditingService({...editingService, image: ''})} 
                className="absolute top-2 right-2 p-2 bg-brand-richBlack/80 rounded-full text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-white/5 flex justify-end">
          <button 
            onClick={handleSave} 
            className="px-12 py-4 bg-brand-gold text-brand-richBlack font-bold uppercase tracking-widest rounded-xl shadow-xl hover:scale-105 transition-all"
          >
            Salvar Serviço
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-cinzel font-bold text-white">Gestão de Serviços</h2>
          <p className="text-gray-500 mt-1">Personalize os serviços exibidos na landing page principal.</p>
        </div>
        <button 
          onClick={() => setEditingService({ id: 's-'+Date.now(), iconName: 'Martini', title: '', description: '', image: '' })}
          className="px-6 py-3 bg-brand-gold text-brand-richBlack rounded-xl font-bold flex items-center gap-2 hover:bg-white transition-all shadow-xl"
        >
          <Plus className="w-5 h-5" /> Adicionar Serviço
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {services.map((service) => {
          const IconComp = ICON_OPTIONS[service.iconName as keyof typeof ICON_OPTIONS] || Martini;
          return (
            <div key={service.id} className="bg-brand-graphite rounded-3xl border border-white/5 overflow-hidden hover:border-brand-gold/30 transition-all group flex flex-col shadow-xl">
              <div className="h-56 relative overflow-hidden">
                <img src={service.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt={service.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-richBlack via-brand-richBlack/20 to-transparent"></div>
                <div className="absolute bottom-6 left-8 flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-gold text-brand-richBlack flex items-center justify-center rounded-xl shadow-2xl">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-cinzel font-bold text-white tracking-wide">{service.title}</h4>
                </div>
              </div>
              <div className="p-8 space-y-4 flex-grow flex flex-col">
                <p className="text-gray-400 text-sm leading-relaxed flex-grow">{service.description}</p>
                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button onClick={() => setEditingService(service)} className="flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-400 hover:text-white rounded-lg transition-all text-[10px] font-bold uppercase tracking-widest">
                    <Edit3 className="w-3.5 h-3.5" /> Editar
                  </button>
                  <button onClick={() => handleDelete(service.id)} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all text-[10px] font-bold uppercase tracking-widest">
                    <Trash2 className="w-3.5 h-3.5" /> Excluir
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {services.length === 0 && (
          <button 
            onClick={() => setEditingService({ id: 's-'+Date.now(), iconName: 'Martini', title: '', description: '', image: '' })}
            className="col-span-2 h-60 bg-brand-richBlack border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-gray-600 hover:border-brand-gold/30 hover:text-brand-gold transition-all gap-4 group"
          >
            <Plus className="w-10 h-10 group-hover:scale-125 transition-transform" />
            <span className="font-bold uppercase tracking-widest text-xs">Adicionar Primeiro Serviço</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ServicesManager;
