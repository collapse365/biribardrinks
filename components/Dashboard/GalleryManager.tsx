
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, Upload, X, Check, Save, Instagram, RefreshCw, Loader2, Search } from 'lucide-react';
import { db } from '../../db';
import { GoogleGenAI } from "@google/genai";

const GalleryManager: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [igHandle, setIgHandle] = useState('biribardrinks');
  const [lastSync, setLastSync] = useState('');

  useEffect(() => {
    db.get().then(data => {
      setImages(data.gallery || []);
      setIgHandle(data.instagramHandle || 'biribardrinks');
      setLastSync(data.lastIgSync || '');
    });
  }, []);

  const handleSyncInstagram = async () => {
    if (isSyncing) return;
    setIsSyncing(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Quando usamos googleSearch, não podemos usar responseSchema ou responseMimeType JSON.
      // Precisamos extrair as URLs do texto e do groundingMetadata.
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Acesse o perfil do Instagram https://www.instagram.com/${igHandle} e identifique as URLs diretas das imagens (CDN/Static) das postagens mais recentes de drinks e eventos. Liste as URLs das imagens encontradas separadas por vírgula.`,
        config: {
          tools: [{ googleSearch: {} }]
        },
      });

      const responseText = response.text || "";
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      // Coletamos URLs do texto da resposta e das fontes de busca
      const foundUrls: string[] = [];
      
      // 1. Extrair URLs do texto (procurando padrões de imagem)
      const urlRegex = /(https?:\/\/[^\s,]+?\.(?:jpg|jpeg|png|webp|gif))/gi;
      const matches = responseText.match(urlRegex);
      if (matches) foundUrls.push(...matches);

      // 2. Extrair das fontes da busca (grounding chunks)
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) {
          // Se for um link direto de imagem ou conter padrões de CDN
          if (chunk.web.uri.match(/\.(jpg|jpeg|png|webp)/i) || chunk.web.uri.includes('fbcdn.net')) {
            foundUrls.push(chunk.web.uri);
          }
        }
      });

      // 3. Filtrar links duplicados e inválidos
      const validImages = [...new Set(foundUrls)].filter(url => 
        url.startsWith('http') && (url.includes('cdn') || url.includes('instagram') || url.match(/\.(jpg|jpeg|png|webp)/i))
      );

      if (validImages.length > 0) {
        const updatedGallery = [...new Set([...validImages, ...images])].slice(0, 32);
        setImages(updatedGallery);
        
        const now = new Date().toLocaleString('pt-BR');
        setLastSync(now);
        
        await db.updateGallery(updatedGallery);
        await db.updateInstagramSettings(igHandle, now);
        
        alert(`Sincronização concluída! ${validImages.length} novas referências encontradas.`);
      } else {
        alert('O modelo encontrou o perfil, mas não conseguiu extrair URLs de imagens diretas. Tente adicionar algumas manualmente ou verifique se o perfil é público.');
      }
    } catch (error) {
      console.error('Erro na sincronização Gemini:', error);
      alert('Erro técnico na conexão com a Inteligência Artificial. Verifique sua chave de API ou tente novamente em instantes.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    const updatedImages = [newImageUrl.trim(), ...images];
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
        const updatedImages = [base64, ...images];
        setImages(updatedImages);
        db.updateGallery(updatedImages);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-cinzel font-bold text-white">Curadoria Visual</h2>
          <p className="text-gray-500 mt-1">Gerencie seu portfólio manual ou sincronize com o Instagram através de IA.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsAdding(true)}
            className="px-6 py-3 border border-white/10 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-white/5 transition-all"
          >
            <Plus className="w-5 h-5" /> Manual
          </button>
          <button 
            onClick={handleSyncInstagram}
            disabled={isSyncing}
            className="px-6 py-3 bg-brand-gold text-brand-richBlack rounded-xl font-bold flex items-center gap-2 hover:bg-white transition-all shadow-xl disabled:opacity-50"
          >
            {isSyncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Instagram className="w-5 h-5" />}
            {isSyncing ? 'Sincronizando...' : 'Sync Instagram'}
          </button>
        </div>
      </div>

      <div className="bg-brand-graphite p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Instagram className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Perfil Monitorado</p>
            <p className="text-white font-bold">@ {igHandle}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Última Varredura</p>
          <p className="text-brand-gold font-medium text-sm">{lastSync || 'Nunca sincronizado'}</p>
        </div>
      </div>

      {isAdding && (
        <div className="bg-brand-graphite p-8 rounded-2xl border border-brand-gold/30 space-y-6 animate-fade-in shadow-2xl">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-widest">Adição Manual</h3>
            <button onClick={() => setIsAdding(false)} className="text-gray-500 hover:text-white uppercase text-[10px] font-bold">Cancelar</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">URL da Imagem</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="https://exemplo.com/foto.jpg"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-grow bg-brand-richBlack border border-white/10 rounded-xl p-4 text-white outline-none focus:border-brand-gold"
                />
                <button onClick={handleAddImage} className="px-6 bg-brand-gold text-brand-richBlack font-bold rounded-xl hover:bg-white"><Check className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Upload Direto</label>
              <label className="w-full flex items-center justify-center gap-3 p-4 border-2 border-dashed border-white/10 rounded-xl hover:border-brand-gold/50 cursor-pointer transition-all">
                <Upload className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-500">Escolher arquivo</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <div key={idx} className="group relative aspect-square bg-brand-graphite rounded-xl overflow-hidden shadow-lg border border-white/5">
            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <button 
                onClick={() => handleDeleteImage(idx)}
                className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            {(img.startsWith('http') && (img.includes('instagram') || img.includes('fbcdn'))) && (
              <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md p-1.5 rounded-lg">
                <Instagram className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryManager;
