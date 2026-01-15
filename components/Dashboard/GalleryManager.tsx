
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Image as ImageIcon, Upload, X, Check, Loader2, AlertCircle, RefreshCw, Link as LinkIcon, Play, Video } from 'lucide-react';
import { db } from '../../db';

const GalleryManager: React.FC = () => {
  const [media, setMedia] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error' | 'processing'>('idle');
  const [brokenItems, setBrokenItems] = useState<Record<number, boolean>>({});

  const loadGallery = useCallback(async () => {
    try {
      const data = await db.get();
      setMedia(data.gallery || []);
      setBrokenItems({});
    } catch (err) {
      console.error("Erro ao carregar galeria:", err);
      setSaveStatus('error');
    }
  }, []);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  const syncWithDatabase = async (updatedList: string[]) => {
    setSaveStatus('saving');
    try {
      await db.updateGallery(updatedList);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error("Erro ao persistir galeria:", err);
      setSaveStatus('error');
    }
  };

  const isVideo = (url: string) => {
    return url.startsWith('data:video/') || 
           url.toLowerCase().endsWith('.mp4') || 
           url.toLowerCase().endsWith('.webm') || 
           url.toLowerCase().endsWith('.mov');
  };

  const handleAddManual = () => {
    if (!newUrl.trim()) return;
    const newList = [newUrl.trim(), ...media];
    setMedia(newList);
    syncWithDatabase(newList);
    setNewUrl('');
    setIsAdding(false);
  };

  const handleDeleteItem = (indexToDelete: number) => {
    if (!confirm('Deseja remover este item do seu portfólio?')) return;
    const newList = media.filter((_, index) => index !== indexToDelete);
    setMedia(newList);
    syncWithDatabase(newList);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setSaveStatus('processing');
    
    const readFileAsDataURL = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    try {
      const results = await Promise.all(Array.from(files).map(file => readFileAsDataURL(file as File)));
      const newList = [...results, ...media];
      setMedia(newList);
      await syncWithDatabase(newList);
      setIsAdding(false);
    } catch (err) {
      console.error("Erro no upload múltiplo:", err);
      setSaveStatus('error');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-cinzel font-bold text-white uppercase tracking-wider">Portfólio Multimídia</h2>
          <div className="flex items-center gap-3 mt-1">
            {saveStatus === 'saving' && <span className="text-brand-gold text-[10px] font-bold animate-pulse uppercase tracking-widest flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Atualizando...</span>}
            {saveStatus === 'processing' && <span className="text-brand-gold text-[10px] font-bold animate-pulse uppercase tracking-widest flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Processando...</span>}
            {saveStatus === 'saved' && <span className="text-green-500 text-[10px] font-bold uppercase tracking-widest">✓ Portfólio Atualizado</span>}
            {saveStatus === 'idle' && <p className="text-gray-500 text-xs">Adicione fotos e vídeos dos seus melhores eventos.</p>}
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={loadGallery} className="p-3 border border-white/10 text-gray-500 hover:text-white rounded-xl transition-all">
            <RefreshCw className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsAdding(true)} 
            className="flex-grow md:flex-none px-6 py-4 bg-brand-gold text-brand-richBlack rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl uppercase tracking-widest text-[10px]"
          >
            <Plus className="w-4 h-4" /> Novo Conteúdo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {media.map((url, idx) => {
          const video = isVideo(url);
          return (
            <div key={`mgr-media-${idx}`} className="group relative aspect-square bg-brand-graphite rounded-xl overflow-hidden border border-white/5 shadow-xl">
              {brokenItems[idx] ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-red-500/5 p-4 text-center">
                  <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                  <p className="text-[9px] text-red-400 font-bold uppercase">Item Corrompido</p>
                </div>
              ) : video ? (
                <div className="w-full h-full relative">
                  <video 
                    src={url} 
                    className="w-full h-full object-cover" 
                    muted 
                    playsInline
                    onMouseEnter={e => e.currentTarget.play()}
                    onMouseLeave={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                    onError={() => setBrokenItems(prev => ({ ...prev, [idx]: true }))}
                  />
                  <div className="absolute top-2 left-2 p-1.5 bg-black/60 rounded-md text-brand-gold">
                    <Play className="w-3 h-3 fill-brand-gold" />
                  </div>
                </div>
              ) : (
                <img 
                  src={url} 
                  className="w-full h-full object-cover"
                  onError={() => setBrokenItems(prev => ({ ...prev, [idx]: true }))}
                  loading="lazy"
                />
              )}
              
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                <button 
                  onClick={() => handleDeleteItem(idx)}
                  className="p-5 bg-red-600 text-white rounded-full hover:bg-red-500 hover:scale-110 transition-all shadow-2xl"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
                <p className="text-[10px] text-white font-bold uppercase mt-4 tracking-widest">Remover {video ? 'Vídeo' : 'Foto'}</p>
              </div>
            </div>
          );
        })}

        {media.length === 0 && (
          <div className="col-span-full py-32 text-center border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.01] flex flex-col items-center justify-center gap-6">
            <Video className="w-16 h-16 text-gray-800" />
            <p className="text-gray-500 uppercase tracking-[0.3em] text-xs font-bold">Galeria Vazia</p>
          </div>
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in">
          <div className="bg-brand-graphite w-full max-w-md rounded-[32px] border border-white/10 p-10 space-y-8 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="text-xl font-cinzel font-bold text-white uppercase tracking-widest">Novo Conteúdo</h3>
              <button onClick={() => setIsAdding(false)} className="text-gray-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="space-y-6">
              <label className={`w-full flex flex-col items-center justify-center gap-4 p-10 border-2 border-dashed border-white/10 rounded-3xl hover:border-brand-gold/40 cursor-pointer bg-white/[0.02] transition-all group ${saveStatus === 'processing' ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="w-14 h-14 bg-brand-gold/10 rounded-2xl flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform">
                  {saveStatus === 'processing' ? <Loader2 className="w-7 h-7 animate-spin" /> : <Upload className="w-7 h-7" />}
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-white font-bold uppercase tracking-widest">Upload de Fotos & Vídeos</p>
                  <p className="text-[8px] text-gray-500 mt-2 uppercase">Formatos: JPG, PNG, MP4, MOV</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  multiple 
                  accept="image/*,video/*" 
                  onChange={handleFileUpload} 
                  disabled={saveStatus === 'processing'}
                />
              </label>

              <div className="relative py-2 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                <span className="relative bg-brand-graphite px-4 text-[10px] text-gray-700 font-bold uppercase tracking-[0.4em]">Ou Link</span>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gold" />
                  <input 
                    type="text" 
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="URL da Imagem ou Vídeo (.mp4)..."
                    className="w-full bg-brand-richBlack border border-white/10 rounded-2xl p-5 pl-12 text-white text-sm outline-none focus:border-brand-gold transition-all"
                  />
                </div>
                <button 
                  onClick={handleAddManual}
                  disabled={!newUrl.trim() || saveStatus === 'processing'}
                  className="w-full mt-4 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-brand-gold hover:text-brand-richBlack transition-all disabled:opacity-20 uppercase tracking-widest text-[10px]"
                >
                  Adicionar via Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
