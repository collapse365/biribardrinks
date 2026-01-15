
import React, { useState, useEffect } from 'react';
import { Martini, Coffee, PartyPopper, Users, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, Service } from '../db';

const ICON_MAP = {
  Martini: Martini,
  Coffee: Coffee,
  PartyPopper: PartyPopper,
  Users: Users,
  Sparkles: Sparkles,
  Star: Star
};

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    setServices(db.get().services || []);
  }, []);

  return (
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-sm uppercase tracking-[0.5em] text-brand-gold font-bold mb-4">Exclusividade em Cada Gole</h2>
        <h3 className="text-4xl md:text-5xl font-cinzel text-white">Serviços de Alto Padrão</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => {
          const IconComp = ICON_MAP[service.iconName as keyof typeof ICON_MAP] || Martini;
          return (
            <div key={service.id} className="group relative overflow-hidden rounded-lg bg-brand-graphite border border-white/5 hover:border-brand-gold/30 transition-all duration-500">
              <div className="h-64 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-richBlack to-transparent opacity-80"></div>
              </div>
              
              <div className="p-8 relative -mt-20 z-10">
                <div className="w-12 h-12 bg-brand-gold text-brand-richBlack flex items-center justify-center rounded-sm mb-6 shadow-[0_0_15px_rgba(250,204,21,0.4)] group-hover:scale-110 transition-transform duration-300">
                  <IconComp className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-cinzel text-white mb-4 group-hover:text-brand-gold transition-colors">{service.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
                <Link 
                  to="/quote" 
                  className="text-xs uppercase tracking-widest text-brand-gold font-bold flex items-center gap-2 hover:translate-x-2 transition-transform"
                >
                  Ver Detalhes <span className="text-lg">→</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Services;
