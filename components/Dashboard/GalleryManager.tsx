
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Image as ImageIcon, Upload, X, Check, Loader2, AlertCircle, RefreshCw, Link as LinkIcon, Play, Video, Camera } from 'lucide-react';
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
          <h2 className="text-3xl font-cinzel font-bold text-white uppercase tracking-wider">Mídias do Portfólio</h2>
          <div className="flex items-center gap-3 mt-1">
            {saveStatus === 'saving' && <span className="text-brand-gold text-[10px] font-bold animate-pulse uppercase tracking-widest flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Sincronizando...</span>}
            {saveStatus === 'processing' && <span className="text-brand-gold text-[10px] font-bold animate-pulse uppercase tracking-widest flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Convertendo arquivos...</span>}
            {saveStatus === 'saved' && <span className="text-green-500 text-[10px] font-bold uppercase tracking-widest">✓ Conteúdo Publicado</span>}
            {saveStatus === 'idle' && <p className="text-gray-500 text-xs font-medium">Fotos e vídeos para encantar seus clientes.</p>}
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={loadGallery} className="p-3 bg-white/5 text-gray-500 hover:text-white rounded-xl transition-all border border-white/5">
            <RefreshCw className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsAdding(true)} 
            className="flex-grow md:flex-none px-8 py-4 bg-brand-gold text-brand-richBlack rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl uppercase tracking-widest text-[10px]"
          >
            <Plus className="w-4 h-4" /> Adicionar Mídias
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {media.map((url, idx) => {
          const video = isVideo(url);
          return (
            <div key={`mgr-media-${idx}`} className="group relative aspect-square bg-brand-graphite rounded-2xl overflow-hidden border border-white/5 shadow-2xl transition-all hover:border-brand-gold/30">
              {brokenItems[idx] ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-red-500/5 p-4 text-center">
                  <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                  <p className="text-[9px] text-red-400 font-bold uppercase">Item Não Encontrado</p>
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
                  <div className="absolute top-3 left-3 p-1.5 bg-black/60 backdrop-blur-md rounded-lg text-brand-gold">
                    <Video className="w-4 h-4" />
                  </div>
                </div>
              ) : (
                <div className="w-full h-full relative">
                  <img 
                    src={url} 
                    className="w-full h-full object-cover"
                    onError={() => setBrokenItems(prev => ({ ...prev, [idx]: true }))}
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 p-1.5 bg-black/60 backdrop-blur-md rounded-lg text-white/40">
                    <Camera className="w-4 h-4" />
                  </div>
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center">
                <button 
                  onClick={() => handleDeleteItem(idx)}
                  className="p-5 bg-red-600 text-white rounded-full hover:bg-red-500 hover:scale-110 transition-all shadow-[0_0_30px_rgba(220,38,38,0.5)] active:scale-95"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
                <p className="text-[10px] text-white font-bold uppercase mt-4 tracking-[0.2em]">Excluir {video ? 'Vídeo' : 'Imagem'}</p>
              </div>
            </div>
          );
        })}

        {media.length === 0 && (
          <div className="col-span-full py-40 text-center border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.01] flex flex-col items-center justify-center gap-6">
            <div className="flex gap-4">
               <ImageIcon className="w-12 h-12 text-gray-800" />
               <Video className="w-12 h-12 text-gray-800" />
            </div>
            <div className="space-y-1">
              <p className="text-gray-500 uppercase tracking-[0.4em] text-xs font-bold">Galeria Vazia</p>
              <p className="text-gray-700 text-[10px] font-medium uppercase tracking-widest">Sua vitrine visual começa aqui.</p>
            </div>
          </div>
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in">
          <div className="bg-brand-graphite w-full max-w-lg rounded-[40px] border border-white/10 p-10 space-y-8 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent"></div>
            
            <div className="flex justify-between items-center border-b border-white/5 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-gold/10 rounded-xl flex items-center justify-center text-brand-gold">
                   <Plus className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-cinzel font-bold text-white uppercase tracking-widest">Nova Mídia</h3>
              </div>
              <button onClick={() => setIsAdding(false)} className="text-gray-500 hover:text-white transition-colors bg-white/5 p-2 rounded-full"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="space-y-8">
              <label className={`w-full flex flex-col items-center justify-center gap-6 p-12 border-2 border-dashed border-white/10 rounded-[32px] hover:border-brand-gold/40 cursor-pointer bg-white/[0.02] transition-all group ${saveStatus === 'processing' ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform">
                    {saveStatus === 'processing' ? <Loader2 className="w-8 h-8 animate-spin" /> : <Camera className="w-8 h-8" />}
                  </div>
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform delay-75">
                    {saveStatus === 'processing' ? <Loader2 className="w-8 h-8 animate-spin" /> : <Video className="w-8 h-8" />}
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-[13px] text-white font-bold uppercase tracking-widest">
                    {saveStatus === 'processing' ? 'Processando arquivos...' : 'Importar Fotos e Vídeos'}
                  </p>
                  <p className="text-[9px] text-gray-500 uppercase tracking-widest">JPG, PNG, MP4, MOV - Múltiplos Arquivos</p>
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
                <span className="relative bg-brand-graphite px-6 text-[10px] text-gray-700 font-black uppercase tracking-[0.5em]">Ou via Link</span>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gold" />
                  <input 
                    type="text" 
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="URL direta da foto ou vídeo (.mp4)..."
                    className="w-full bg-brand-richBlack border border-white/10 rounded-2xl p-6 pl-14 text-white text-sm outline-none focus:border-brand-gold transition-all"
                  />
                </div>
                <button 
                  onClick={handleAddManual}
                  disabled={!newUrl.trim() || saveStatus === 'processing'}
                  className="w-full py-5 bg-brand-gold text-brand-richBlack font-black rounded-2xl hover:bg-white transition-all disabled:opacity-20 uppercase tracking-[0.3em] text-[11px] shadow-xl"
                >
                  Adicionar Link Individual
                </button>
              </div>
            </div>
            
            <div className="bg-brand-gold/5 p-4 rounded-2xl border border-brand-gold/10">
              <p className="text-[9px] text-center text-brand-gold font-bold uppercase tracking-widest leading-relaxed">
                Dica Premium: Vídeos de curta duração e fotos em alta definição garantem a melhor experiência visual no site.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
