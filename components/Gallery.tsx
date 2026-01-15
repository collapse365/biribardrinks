
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, ExternalLink, Instagram, Image as ImageIcon, Play } from 'lucide-react';
import { db } from '../db';

const Gallery: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<string[]>([]);
  const [brokenItems, setBrokenItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    db.get().then(data => setMediaItems(data.gallery || []));
  }, []);

  const handleError = (index: number) => {
    setBrokenItems(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  const isVideo = (url: string) => {
    return url.startsWith('data:video/') || 
           url.toLowerCase().endsWith('.mp4') || 
           url.toLowerCase().endsWith('.webm') || 
           url.toLowerCase().endsWith('.mov');
  };

  const validItems = mediaItems.map((url, idx) => ({ url, index: idx }))
                               .filter(item => !brokenItems.has(item.index));

  return (
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div className="reveal">
          <h2 className="text-sm uppercase tracking-[0.5em] text-brand-gold font-bold mb-4">Elegância em Movimento</h2>
          <h3 className="text-4xl md:text-5xl font-cinzel text-white leading-tight">
            Nosso <span className="text-brand-gold italic">Portfólio</span> <br /> de Alto Padrão
          </h3>
        </div>
        <div className="max-w-md text-right reveal" style={{ transitionDelay: '0.2s' }}>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Uma seleção exclusiva das nossas montagens e coquetéis. 
            Agora com registros em vídeo para você sentir a energia de cada celebração.
          </p>
          <a 
            href="https://instagram.com/biribardrinks" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
          >
            Siga nossa jornada <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {validItems.map((item, idx) => {
          const video = isVideo(item.url);
          return (
            <div 
              key={`public-media-${item.index}`} 
              className={`reveal relative group aspect-square overflow-hidden rounded-xl border border-white/5 bg-brand-graphite`}
              style={{ transitionDelay: `${(idx % 4) * 0.1}s` }}
            >
              {video ? (
                <video 
                  src={item.url}
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                  muted
                  loop
                  playsInline
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                  onError={() => handleError(item.index)}
                />
              ) : (
                <img 
                  src={item.url} 
                  alt={`Galeria BiriBar ${idx}`}
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1"
                  onError={() => handleError(item.index)}
                  loading="lazy"
                />
              )}
              
              {/* Video Indicator */}
              {video && (
                <div className="absolute top-4 left-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-brand-gold opacity-100 group-hover:opacity-0 transition-opacity">
                  <Play className="w-3 h-3 fill-brand-gold" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center backdrop-blur-[2px]">
                <div className="flex gap-6 text-white mb-2">
                  <div className="flex items-center gap-1.5">
                    <Heart className="w-5 h-5 fill-brand-gold text-brand-gold" />
                    <span className="text-sm font-bold">{Math.floor(Math.random() * 300) + 100}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-5 h-5 fill-white text-white" />
                    <span className="text-sm font-bold">{Math.floor(Math.random() * 40) + 10}</span>
                  </div>
                </div>
                <p className="text-[9px] text-brand-gold font-bold uppercase tracking-[0.3em] mt-3">
                  {video ? 'Assista ao Momento' : 'Excelência BiriBar'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {validItems.length === 0 && (
        <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[40px] bg-white/[0.01]">
          <ImageIcon className="w-12 h-12 text-gray-800 mx-auto mb-4" />
          <p className="text-gray-600 font-bold uppercase tracking-[0.4em] text-[10px]">Novas experiências visuais em breve...</p>
        </div>
      )}

      <div className="mt-24 flex flex-col items-center reveal">
        <div className="w-px h-24 bg-gradient-to-b from-brand-gold to-transparent mb-10"></div>
        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.6em] mb-6">Requinte & Mixologia</p>
        <button 
          onClick={() => window.open('https://instagram.com/biribardrinks', '_blank')}
          className="group relative px-12 py-5 bg-transparent border border-brand-gold/20 overflow-hidden rounded-full transition-all hover:border-brand-gold/50"
        >
          <div className="absolute inset-0 bg-brand-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          <span className="relative z-10 text-brand-gold group-hover:text-brand-richBlack font-bold uppercase tracking-[0.3em] text-[10px] transition-colors duration-500 flex items-center gap-3">
            <Instagram className="w-4 h-4" /> Ver Feed no Instagram
          </span>
        </button>
      </div>
    </div>
  );
};

export default Gallery;
