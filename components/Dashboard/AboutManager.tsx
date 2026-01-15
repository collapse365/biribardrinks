
import React, { useState, useEffect } from 'react';
import { Save, Info, Target, Eye, Gem, Plus, X, Sparkles } from 'lucide-react';
import { db, AboutContent } from '../../db';

const AboutManager: React.FC = () => {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    setContent(db.get().about);
  }, []);

  const handleSave = () => {
    if (content) {
      setIsSaving(true);
      db.updateAbout(content);
      setTimeout(() => setIsSaving(false), 800);
    }
  };

  const addValue = () => {
    if (newValue.trim() && content) {
      setContent({ ...content, values: [...content.values, newValue.trim()] });
      setNewValue('');
    }
  };

  const removeValue = (index: number) => {
    if (content) {
      setContent({ ...content, values: content.values.filter((_, i) => i !== index) });
    }
  };

  if (!content) return null;

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-cinzel font-bold text-white uppercase tracking-wider">Sobre a Empresa</h2>
          <p className="text-gray-500 mt-1">Gerencie a história, missão, visão e os valores exibidos no site.</p>
        </div>
        <button 
          onClick={handleSave}
          className="px-8 py-4 bg-brand-gold text-brand-richBlack rounded-xl font-bold flex items-center gap-2 hover:bg-white transition-all shadow-xl"
        >
          {isSaving ? 'Salvando...' : <><Save className="w-5 h-5" /> Salvar Conteúdo</>}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* História */}
        <div className="bg-brand-graphite p-8 rounded-3xl border border-white/5 space-y-4">
          <h3 className="text-lg font-cinzel font-bold text-white flex items-center gap-3">
            <Info className="w-5 h-5 text-brand-gold" /> Nossa História
          </h3>
          <textarea 
            rows={6}
            value={content.history}
            onChange={e => setContent({ ...content, history: e.target.value })}
            className="w-full bg-brand-richBlack border border-white/10 rounded-xl p-5 text-white outline-none focus:border-brand-gold resize-none leading-relaxed"
            placeholder="Conte a trajetória da empresa..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Missão */}
          <div className="bg-brand-graphite p-8 rounded-3xl border border-white/5 space-y-4">
            <h3 className="text-lg font-cinzel font-bold text-white flex items-center gap-3">
              <Target className="w-5 h-5 text-brand-gold" /> Missão
            </h3>
            <textarea 
              rows={4}
              value={content.mission}
              onChange={e => setContent({ ...content, mission: e.target.value })}
              className="w-full bg-brand-richBlack border border-white/10 rounded-xl p-5 text-white outline-none focus:border-brand-gold resize-none"
            />
          </div>

          {/* Visão */}
          <div className="bg-brand-graphite p-8 rounded-3xl border border-white/5 space-y-4">
            <h3 className="text-lg font-cinzel font-bold text-white flex items-center gap-3">
              <Eye className="w-5 h-5 text-brand-gold" /> Visão
            </h3>
            <textarea 
              rows={4}
              value={content.vision}
              onChange={e => setContent({ ...content, vision: e.target.value })}
              className="w-full bg-brand-richBlack border border-white/10 rounded-xl p-5 text-white outline-none focus:border-brand-gold resize-none"
            />
          </div>
        </div>

        {/* Valores */}
        <div className="bg-brand-graphite p-8 rounded-3xl border border-white/5 space-y-6">
          <h3 className="text-lg font-cinzel font-bold text-white flex items-center gap-3">
            <Gem className="w-5 h-5 text-brand-gold" /> Nossos Valores
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.values.map((v, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-brand-richBlack rounded-xl border border-white/5 group">
                <span className="text-gray-300 font-medium flex items-center gap-3">
                   <Sparkles className="w-3 h-3 text-brand-gold" /> {v}
                </span>
                <button onClick={() => removeValue(i)} className="text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Novo valor..."
                value={newValue}
                onChange={e => setNewValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addValue()}
                className="flex-grow bg-brand-richBlack border border-white/10 rounded-xl px-4 text-sm text-white focus:border-brand-gold outline-none"
              />
              <button onClick={addValue} className="p-4 bg-brand-gold text-brand-richBlack rounded-xl hover:bg-white transition-all">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutManager;
