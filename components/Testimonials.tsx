
import React, { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';
import { db, Testimonial } from '../db';

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    // Fix: db.get() returns a Promise<AppData>, handle it asynchronously.
    db.get().then(data => setTestimonials(data.testimonials || []));
  }, []);

  return (
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-sm uppercase tracking-[0.5em] text-brand-gold font-bold mb-4">Feedback</h2>
        <h3 className="text-4xl font-cinzel text-white">O que dizem sobre nós</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t) => (
          <div key={t.id} className="glass-card p-10 rounded-xl relative flex flex-col">
            <Quote className="absolute top-6 right-10 w-12 h-12 text-brand-gold/10" />
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-full border-2 border-brand-gold/30 overflow-hidden shrink-0">
                {t.image ? (
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-brand-richBlack flex items-center justify-center text-brand-gold font-bold">
                    {t.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-white font-bold">{t.name}</h4>
                <p className="text-brand-gold text-xs uppercase tracking-wider">{t.role}</p>
              </div>
            </div>
            <p className="text-gray-300 italic leading-relaxed mb-6 flex-grow">
              "{t.content}"
            </p>
          </div>
        ))}
        {testimonials.length === 0 && (
          <div className="col-span-3 text-center py-20 text-gray-500 font-medium italic">
            Novos depoimentos serão publicados em breve.
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonials;
