
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, Upload, X, Check, Save } from 'lucide-react';
import { db } from '../../db';

const GalleryManager: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    setImages(db.get().gallery || []);
  }, []);

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    const updatedImages = [...images, newImageUrl.trim()];
    setImages(updatedImages);
    db.updateGallery(updatedImages);
    setNewImageUrl('');
    setIsAdding(false);
  };

  const handleDeleteImage = (index: number) => {
    if (confirm('Deseja remover esta foto da galeria?')) {
      const updatedImages = images.filter((_, i) => i !== index);
      setImages(updatedImages);
      db.updateGallery(updatedImages);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const updatedImages = [...images, base64];
        setImages(updatedImages);
        db.updateGallery(updatedImages);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-cinzel font-bold text-white">Galeria de Fotos</h2>
          <p className="text-gray-500 mt-1">Gerencie as imagens que aparecem na página inicial do site.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-3 bg-brand-gold text-brand-richBlack rounded-xl font-bold flex items-center gap-2 hover:bg-white transition-all shadow-xl"
        >
          <Plus className="w-5 h-5" /> Adicionar Foto
        </button>
      </div>

      {isAdding && (
        <div className="bg-brand-graphite p-8 rounded-2xl border border-brand-gold/30 space-y-6 animate-fade-in shadow-2xl">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-widest">Nova Foto</h3>
            <button onClick={() => setIsAdding(false)} className="text-gray-500 hover:text-white uppercase text-[10px] font-bold">Cancelar</button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">URL da Imagem</label>
              <div className="flex gap-4">
                <input 
                  type="text" 
                  placeholder="https://exemplo.com/foto.jpg"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-grow bg-brand-richBlack border border-white/10 rounded-xl p-4 text-white outline-none focus:border-brand-gold"
                />
                <button 
                  onClick={handleAddImage}
                  className="px-8 bg-brand-gold text-brand-richBlack font-bold rounded-xl hover:bg-white transition-all"
                >
                  Confirmar
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 py-4">
              <div className="flex-grow h-px bg-white/5"></div>
              <span className="text-[10px] uppercase font-bold text-gray-600">OU</span>
              <div className="flex-grow h-px bg-white/5"></div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Upload de Arquivo</label>
              <label className="w-full flex flex-col items-center justify-center p-10 border-2 border-dashed border-white/10 rounded-2xl hover:border-brand-gold/50 cursor-pointer transition-all group">
                <Upload className="w-10 h-10 text-gray-600 group-hover:text-brand-gold mb-2" />
                <span className="text-sm text-gray-500 group-hover:text-gray-300">Selecione uma foto do seu computador</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img, idx) => (
          <div key={idx} className="group relative aspect-square bg-brand-graphite rounded-2xl border border-white/5 overflow-hidden shadow-xl">
            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
              <button 
                onClick={() => handleDeleteImage(idx)}
                className="p-4 bg-red-500 text-white rounded-full hover:scale-110 transition-transform shadow-2xl"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        ))}
        {images.length === 0 && !isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="aspect-square bg-brand-richBlack border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-gray-600 hover:border-brand-gold/30 hover:text-brand-gold transition-all gap-4 group"
          >
            <Plus className="w-10 h-10 group-hover:scale-125 transition-transform" />
            <span className="font-bold uppercase tracking-widest text-xs">Adicionar Primeira Foto</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default GalleryManager;
