
import React, { useState, useEffect } from 'react';
import { Instagram, Heart, MessageCircle, ExternalLink } from 'lucide-react';
import { db } from '../db';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    db.get().then(data => setImages(data.gallery || []));
  }, []);

  return (
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div className="reveal">
          <h2 className="text-sm uppercase tracking-[0.5em] text-brand-gold font-bold mb-4">Portfólio Vivo</h2>
          <h3 className="text-4xl md:text-5xl font-cinzel text-white leading-tight">
            Nossa <span className="text-brand-gold italic">Estética</span> <br /> em Tempo Real
          </h3>
        </div>
        <div className="max-w-md text-right reveal" style={{ transitionDelay: '0.2s' }}>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Acompanhe nossos eventos e as criações mais recentes de nossos mixologistas. 
            Cada drink é uma obra de arte efêmera capturada para sua inspiração.
          </p>
          <a 
            href="https://instagram.com/biribardrinks" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
          >
            Seguir @biribardrinks <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {images.map((img, idx) => (
          <div 
            key={idx} 
            className={`reveal relative group aspect-square overflow-hidden rounded-xl border border-white/5 bg-brand-graphite`}
            style={{ transitionDelay: `${(idx % 4) * 0.1}s` }}
          >
            <img 
              src={img} 
              alt={`Galeria BiriBar ${idx}`}
              className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1"
            />
            
            {/* Instagram Overlay Effect */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center backdrop-blur-[2px]">
              <div className="flex gap-6 text-white mb-2">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-5 h-5 fill-white" />
                  <span className="text-sm font-bold">{Math.floor(Math.random() * 200) + 50}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span className="text-sm font-bold">{Math.floor(Math.random() * 20) + 5}</span>
                </div>
              </div>
              <p className="text-[10px] text-brand-gold font-bold uppercase tracking-[0.2em] mt-2">Ver Postagem</p>
            </div>

            {/* Icon Tag */}
            <div className="absolute top-3 right-3 p-1.5 bg-black/40 backdrop-blur-md rounded-lg group-hover:opacity-0 transition-opacity">
              <Instagram className="w-3.5 h-3.5 text-white/70" />
            </div>
          </div>
        ))}
      </div>
      
      {images.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
          <Instagram className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">Aguardando sincronização de conteúdo...</p>
        </div>
      )}

      <div className="mt-20 flex flex-col items-center reveal">
        <div className="w-px h-20 bg-gradient-to-b from-brand-gold to-transparent mb-8"></div>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.4em] mb-4">Mais de 500 eventos realizados</p>
        <button 
          onClick={() => window.open('https://instagram.com/biribardrinks', '_blank')}
          className="group relative px-10 py-5 bg-transparent border border-brand-gold/30 overflow-hidden rounded-full"
        >
          <div className="absolute inset-0 bg-brand-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          <span className="relative z-10 text-brand-gold group-hover:text-brand-richBlack font-bold uppercase tracking-widest text-xs transition-colors duration-500">
            Explorar Feed Completo
          </span>
        </button>
      </div>
    </div>
  );
};

export default Gallery;
