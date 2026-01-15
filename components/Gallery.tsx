
import React, { useState, useEffect, useCallback } from 'react';
import { ExternalLink, Instagram, Image as ImageIcon, Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { db } from '../db';

const Gallery: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<string[]>([]);
  const [brokenItems, setBrokenItems] = useState<Set<number>>(new Set());
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);

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
    if (!url) return false;
    return url.startsWith('data:video/') || 
           url.toLowerCase().endsWith('.mp4') || 
           url.toLowerCase().endsWith('.webm') || 
           url.toLowerCase().endsWith('.mov');
  };

  const validItems = mediaItems.map((url, idx) => ({ url, index: idx }))
                               .filter(item => !brokenItems.has(item.index));

  const openModal = (index: number) => {
    setSelectedMediaIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = useCallback(() => {
    setSelectedMediaIndex(null);
    document.body.style.overflow = 'auto';
  }, []);

  const navigateMedia = useCallback((direction: 'next' | 'prev') => {
    if (selectedMediaIndex === null || validItems.length === 0) return;
    
    const currentIndexInValid = validItems.findIndex(item => item.index === selectedMediaIndex);
    let nextIndex;
    
    if (direction === 'next') {
      nextIndex = (currentIndexInValid + 1) % validItems.length;
    } else {
      nextIndex = (currentIndexInValid - 1 + validItems.length) % validItems.length;
    }
    
    setSelectedMediaIndex(validItems[nextIndex].index);
  }, [selectedMediaIndex, validItems]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedMediaIndex === null) return;
      if (e.key === 'ArrowRight') navigateMedia('next');
      if (e.key === 'ArrowLeft') navigateMedia('prev');
      if (e.key === 'Escape') closeModal();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMediaIndex, navigateMedia, closeModal]);

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
            Clique em qualquer item para ver em detalhes e navegar pela nossa galeria.
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
              onClick={() => openModal(item.index)}
              className={`reveal relative group aspect-square overflow-hidden rounded-xl border border-white/5 bg-brand-graphite cursor-pointer shadow-lg hover:shadow-brand-gold/10 transition-shadow`}
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
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                  onError={() => handleError(item.index)}
                  loading="lazy"
                />
              )}
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center backdrop-blur-[2px]">
                <div className="p-4 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold scale-75 group-hover:scale-100 transition-transform duration-500">
                  {video ? <Play className="w-6 h-6 fill-brand-gold" /> : <ImageIcon className="w-6 h-6" />}
                </div>
                <p className="text-[10px] text-brand-gold font-bold uppercase tracking-[0.4em] mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  {video ? 'Reproduzir' : 'Ver Detalhes'}
                </p>
              </div>
              
              {video && (
                <div className="absolute top-4 left-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-brand-gold group-hover:opacity-0 transition-opacity">
                  <Play className="w-3 h-3 fill-brand-gold" />
                </div>
              )}
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

      {/* Lightbox Modal */}
      {selectedMediaIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex items-center justify-center animate-fade-in"
          onClick={closeModal}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 p-4 text-white/50 hover:text-brand-gold transition-all z-[120] hover:rotate-90 duration-300"
            onClick={closeModal}
          >
            <X className="w-8 h-8 md:w-10 md:h-10" />
          </button>

          {/* Navigation Arrows */}
          <button 
            className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 p-4 text-white/20 hover:text-brand-gold transition-all z-[110] group"
            onClick={(e) => { e.stopPropagation(); navigateMedia('prev'); }}
          >
            <ChevronLeft className="w-10 h-10 md:w-16 md:h-16 group-hover:-translate-x-1 transition-transform" />
          </button>

          <button 
            className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 p-4 text-white/20 hover:text-brand-gold transition-all z-[110] group"
            onClick={(e) => { e.stopPropagation(); navigateMedia('next'); }}
          >
            <ChevronRight className="w-10 h-10 md:w-16 md:h-16 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Media Content */}
          <div 
            className="relative w-full h-full flex items-center justify-center p-6 md:p-24"
            onClick={(e) => e.stopPropagation()}
          >
            {isVideo(mediaItems[selectedMediaIndex]) ? (
              <video 
                key={`modal-video-${selectedMediaIndex}`}
                src={mediaItems[selectedMediaIndex]} 
                className="max-w-full max-h-full rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10"
                controls
                autoPlay
                playsInline
              />
            ) : (
              <img 
                key={`modal-img-${selectedMediaIndex}`}
                src={mediaItems[selectedMediaIndex]} 
                alt="BiriBar Portfólio"
                className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/10 animate-fade-in"
              />
            )}
            
            <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
               <p className="text-brand-gold/40 text-[9px] font-bold uppercase tracking-[0.6em]">
                 BiriBar Exclusive Experience
               </p>
            </div>
          </div>
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
