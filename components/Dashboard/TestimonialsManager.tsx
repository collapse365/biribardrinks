
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, User, MessageSquare, Upload, X, Check, Image as ImageIcon } from 'lucide-react';
import { db, Testimonial } from '../../db';

const TestimonialsManager: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  useEffect(() => {
    setTestimonials(db.get().testimonials || []);
  }, []);

  const handleSave = () => {
    if (editingTestimonial) {
      let newList;
      const exists = testimonials.find(t => t.id === editingTestimonial.id);
      if (exists) {
        newList = testimonials.map(t => t.id === editingTestimonial.id ? editingTestimonial : t);
      } else {
        newList = [...testimonials, editingTestimonial];
      }
      setTestimonials(newList);
      db.updateTestimonials(newList);
      setEditingTestimonial(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Excluir este depoimento?')) {
      const newList = testimonials.filter(t => t.id !== id);
      setTestimonials(newList);
      db.updateTestimonials(newList);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingTestimonial) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingTestimonial({ ...editingTestimonial, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (editingTestimonial) {
    return (
      <div className="bg-brand-graphite p-8 rounded-2xl border border-brand-gold/20 space-y-8 max-w-4xl mx-auto shadow-2xl animate-fade-in">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-gold" /> 
            {editingTestimonial.name ? `Editando: ${editingTestimonial.name}` : 'Novo Depoimento'}
          </h3>
          <button onClick={() => setEditingTestimonial(null)} className="text-gray-500 hover:text-white uppercase text-[10px] font-bold">Cancelar</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Nome do Cliente</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                value={editingTestimonial.name} 
                onChange={e => setEditingTestimonial({...editingTestimonial, name: e.target.value})} 
                className="w-full bg-brand-richBlack border border-white/10 rounded-xl p-4 pl-12 text-white outline-none focus:border-brand-gold"
                placeholder="Ex: Maria Silva"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Cargo / Papel</label>
            <input 
              type="text" 
              value={editingTestimonial.role} 
              onChange={e => setEditingTestimonial({...editingTestimonial, role: e.target.value})} 
              className="w-full bg-brand-richBlack border border-white/10 rounded-xl p-4 text-white outline-none focus:border-brand-gold"
              placeholder="Ex: Noiva, Aniversariante, Gerente..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Comentário</label>
          <textarea 
            rows={4}
            value={editingTestimonial.content} 
            onChange={e => setEditingTestimonial({...editingTestimonial, content: e.target.value})} 
            className="w-full bg-brand-richBlack border border-white/10 rounded-xl p-4 text-white outline-none focus:border-brand-gold resize-none"
            placeholder="O que o cliente achou do serviço?"
          ></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Foto do Cliente (Avatar)</label>
          <div className="flex gap-4">
            <div className="relative flex-grow">
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                placeholder="https://sua-imagem.com/avatar.jpg"
                value={editingTestimonial.image} 
                onChange={e => setEditingTestimonial({...editingTestimonial, image: e.target.value})}
                className="w-full bg-brand-richBlack border border-white/10 rounded-xl p-4 pl-12 text-white outline-none focus:border-brand-gold"
              />
            </div>
            <label className="cursor-pointer px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
              <Upload className="w-4 h-4" /> Upload
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>
          {editingTestimonial.image && (
            <div className="mt-4 relative w-20 h-20 rounded-full overflow-hidden border-2 border-brand-gold">
              <img src={editingTestimonial.image} className="w-full h-full object-cover" alt="Preview" />
              <button 
                onClick={() => setEditingTestimonial({...editingTestimonial, image: ''})} 
                className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
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
            Salvar Depoimento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-cinzel font-bold text-white">Depoimentos</h2>
          <p className="text-gray-500 mt-1">Gerencie os comentários de satisfação exibidos no site.</p>
        </div>
        <button 
          onClick={() => setEditingTestimonial({ id: 't-'+Date.now(), name: '', role: '', content: '', image: '' })}
          className="px-6 py-3 bg-brand-gold text-brand-richBlack rounded-xl font-bold flex items-center gap-2 hover:bg-white transition-all shadow-xl"
        >
          <Plus className="w-5 h-5" /> Adicionar Depoimento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-brand-graphite p-8 rounded-2xl border border-white/5 hover:border-brand-gold/30 transition-all group flex flex-col shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-brand-gold/30">
                  {t.image ? (
                    <img src={t.image} className="w-full h-full object-cover" alt={t.name} />
                  ) : (
                    <div className="w-full h-full bg-brand-richBlack flex items-center justify-center text-brand-gold">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{t.name}</h4>
                  <p className="text-brand-gold text-[10px] font-bold uppercase tracking-wider">{t.role}</p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditingTestimonial(t)} className="text-gray-500 hover:text-white transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(t.id)} className="text-gray-500 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-400 italic text-sm leading-relaxed flex-grow">
              "{t.content}"
            </p>
          </div>
        ))}

        {testimonials.length === 0 && (
          <button 
            onClick={() => setEditingTestimonial({ id: 't-'+Date.now(), name: '', role: '', content: '', image: '' })}
            className="aspect-video md:aspect-auto h-full min-h-[250px] bg-brand-richBlack border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-gray-600 hover:border-brand-gold/30 hover:text-brand-gold transition-all gap-4 group"
          >
            <Plus className="w-10 h-10 group-hover:scale-125 transition-transform" />
            <span className="font-bold uppercase tracking-widest text-xs">Adicionar Primeiro Depoimento</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TestimonialsManager;
