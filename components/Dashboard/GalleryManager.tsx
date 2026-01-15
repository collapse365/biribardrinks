
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, Upload, X, Check, Save, Instagram, RefreshCw, Loader2, Search, ExternalLink } from 'lucide-react';
import { db } from '../../db';
import { GoogleGenAI } from "@google/genai";

// Declaração para TypeScript reconhecer a API do AI Studio
// Fix: Use AIStudio interface and readonly modifier to match expected global environment definitions and avoid "identical modifiers" errors.
interface AIStudio {
  hasSelectedApiKey(): Promise<boolean>;
  openSelectKey(): Promise<void>;
}

declare global {
  interface Window {
    readonly aistudio: AIStudio;
  }
}

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
      // 1. Verificar se estamos no ambiente AI Studio e se há uma chave selecionada
      if (typeof window.aistudio !== 'undefined') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          alert("Para usar a sincronização inteligente com Google Search, você precisa selecionar uma API Key de um projeto faturável.");
          await window.aistudio.openSelectKey();
          // Conforme diretriz, assumimos sucesso após o diálogo abrir e prosseguimos
        }
      }

      // 2. Obter a chave do ambiente (injetada após a seleção)
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        throw new Error("API Key não encontrada. Certifique-se de selecionar uma chave válida.");
      }

      // 3. Criar nova instância da API (sempre no momento do uso)
      const ai = new GoogleGenAI({ apiKey });
      
      // Conforme diretriz: Upgrade para 'gemini-3-pro-image-preview' quando usar googleSearch para informações em tempo real
      // Use direct string for prompt content as recommended.
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: `Acesse o perfil do Instagram https://www.instagram.com/${igHandle}. 
                   Localize e extraia as URLs diretas de imagens (links estáticos de CDN como fbcdn.net) das postagens recentes de coquetéis e bar. 
                   Liste as URLs encontradas separadas por vírgulas. Não forneça explicações, apenas as URLs.`,
        config: {
          tools: [{ googleSearch: {} }]
        },
      });

      let foundUrls: string[] = [];
      
      // Extração do texto - Using response.text getter directly.
      try {
        const responseText = response.text || "";
        const urlRegex = /(https?:\/\/[^\s,]+?\.(?:jpg|jpeg|png|webp|avif))/gi;
        const matches = responseText.match(urlRegex);
        if (matches) foundUrls.push(...matches);
      } catch (e) {
        console.warn("Texto da resposta indisponível.");
      }

      // Extração dos Grounding Chunks (Busca do Google)
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
      if (groundingMetadata?.groundingChunks) {
        groundingMetadata.groundingChunks.forEach((chunk: any) => {
          if (chunk.web?.uri) {
            const uri = chunk.web.uri;
            if (uri.includes('fbcdn.net') || uri.includes('cdninstagram') || uri.match(/\.(jpg|jpeg|png|webp)/i)) {
              foundUrls.push(uri);
            }
          }
        });
      }

      const validImages = [...new Set(foundUrls)].filter(url => 
        url.startsWith('http') && 
        (url.includes('cdn') || url.includes('instagram') || url.includes('fbcdn') || url.match(/\.(jpg|jpeg|png|webp)/i))
      );

      if (validImages.length > 0) {
        const updatedGallery = [...new Set([...validImages, ...images])].slice(0, 40);
        setImages(updatedGallery);
        const now = new Date().toLocaleString('pt-BR');
        setLastSync(now);
        await db.updateGallery(updatedGallery);
        await db.updateInstagramSettings(igHandle, now);
        alert(`Sincronização realizada! ${validImages.length} novas fotos encontradas.`);
      } else {
        alert('O perfil foi analisado, mas nenhuma URL direta de imagem foi extraída. Tente novamente mais tarde.');
      }

    } catch (error: any) {
      console.error('Erro detalhado Gemini Sync:', error);
      const errorMsg = error.message || "";

      // Caso o erro indique que a chave selecionada não é válida (Requested entity was not found)
      if (errorMsg.includes("Requested entity was not found") && typeof window.aistudio !== 'undefined') {
        alert("A chave selecionada não foi encontrada ou não possui permissão. Por favor, selecione uma chave de um projeto com faturamento ativo.");
        await window.aistudio.openSelectKey();
      } else if (errorMsg.includes("API Key must be set")) {
        alert("Erro: A chave API não foi detectada. Se estiver no AI Studio, use o botão de seleção de chave.");
        if (typeof window.aistudio !== 'undefined') await window.aistudio.openSelectKey();
      } else {
        alert(`Falha na sincronização: ${errorMsg || 'Erro de conexão com o servidor de IA'}.`);
      }
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
          <h2 className="text-3xl font-cinzel font-bold text-white uppercase tracking-wider">Curadoria Visual</h2>
          <p className="text-gray-500 mt-1">Gestão inteligente de portfólio sincronizada com seu Instagram.</p>
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
            {isSyncing ? 'Conectando IA...' : 'Sync Instagram'}
          </button>
        </div>
      </div>

      <div className="bg-brand-graphite p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Instagram className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Feed Integrado</p>
            <p className="text-white font-bold">@ {igHandle}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Último Check-in</p>
          <p className="text-brand-gold font-medium text-sm">{lastSync || 'Sincronize para começar'}</p>
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-[9px] text-gray-600 hover:text-brand-gold flex items-center justify-end gap-1 mt-1 underline">
             Info sobre Faturamento <ExternalLink className="w-2 h-2" />
          </a>
        </div>
      </div>

      {isAdding && (
        <div className="bg-brand-graphite p-8 rounded-2xl border border-brand-gold/30 space-y-6 animate-fade-in shadow-2xl">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-widest">Adição Manual</h3>
            <button onClick={() => setIsAdding(false)} className="text-gray-500 hover:text-white uppercase text-[10px] font-bold">Fechar</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">URL Direta (JPG/PNG)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="https://..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-grow bg-brand-richBlack border border-white/10 rounded-xl p-4 text-white outline-none focus:border-brand-gold"
                />
                <button onClick={handleAddImage} className="px-6 bg-brand-gold text-brand-richBlack font-bold rounded-xl hover:bg-white"><Check className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Carregar do Arquivo</label>
              <label className="w-full flex items-center justify-center gap-3 p-4 border-2 border-dashed border-white/10 rounded-xl hover:border-brand-gold/50 cursor-pointer transition-all">
                <Upload className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-500">Procurar Imagem</span>
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
