
import React, { useState, useEffect } from 'react';
import { db } from '../db';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    // Fix: db.get() returns a Promise<AppData>, handle it asynchronously.
    db.get().then(data => setImages(data.gallery || []));
  }, []);

  return (
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div>
          <h2 className="text-sm uppercase tracking-[0.5em] text-brand-gold font-bold mb-4">Nossa Estética</h2>
          <h3 className="text-4xl md:text-5xl font-cinzel text-white">Momentos & Coquetéis</h3>
        </div>
        <p className="max-w-md text-gray-400 text-right">
          Capturamos a essência de cada evento através de nossa arte. Confira alguns dos nossos setups e drinks mais icônicos.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[250px]">
        {images.map((img, idx) => (
          <div 
            key={idx} 
            className={`relative group overflow-hidden rounded-md ${
              idx === 0 ? 'md:col-span-2 md:row-span-2' : ''
            } ${idx === 3 ? 'md:row-span-2' : ''}`}
          >
            <img 
              src={img} 
              alt={`Gallery image ${idx}`}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-brand-richBlack/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="p-4 border border-brand-gold text-brand-gold text-xs uppercase tracking-[0.3em] backdrop-blur-sm">
                BiriBar Detail
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <a 
          href="https://instagram.com/biribardrinks"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-4 border border-brand-gold/30 text-brand-gold hover:bg-brand-gold hover:text-brand-richBlack transition-all duration-300 font-bold uppercase tracking-widest rounded-sm"
        >
          Ver Álbum Completo no Instagram
        </a>
      </div>
    </div>
  );
};

export default Gallery;
