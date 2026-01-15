
import React from 'react';
import { GlassWater, Star, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-brand-richBlack/80 via-brand-richBlack/40 to-brand-richBlack"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center pt-24 md:pt-32">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 border border-brand-gold/30 rounded-full bg-brand-gold/10 backdrop-blur-sm mb-8 animate-fade-in">
          <Star className="w-4 h-4 text-brand-gold fill-brand-gold" />
          <span className="text-xs uppercase tracking-[0.3em] text-brand-gold font-semibold">Experiência Premium de Open Bar</span>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-cinzel font-bold text-white mb-6 leading-tight tracking-tight">
          A Arte da Mixologia <br /> 
          <span className="text-brand-gold text-glow">Inesquecível</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-gray-300 text-lg md:text-xl font-light mb-12 tracking-wide leading-relaxed">
          Transformamos seu evento em uma celebração épica com coquetéis artesanais, 
          baristas premiados e uma estrutura luxuosa para atender os paladares mais exigentes.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            to="/quote"
            className="w-full sm:w-auto px-10 py-5 bg-brand-gold text-brand-richBlack font-bold uppercase tracking-widest rounded-sm hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(250,204,21,0.2)]"
          >
            Pedir Orçamento Agora
          </Link>
          <button
            onClick={() => scrollToSection('gallery')}
            className="w-full sm:w-auto px-10 py-5 border border-white/20 text-white font-bold uppercase tracking-widest rounded-sm hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <GlassWater className="w-5 h-4" />
            Nossa Galeria
          </button>
        </div>
      </div>

      {/* Scroll Down Hint */}
      <button 
        onClick={() => scrollToSection('services')}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer hover:text-brand-gold transition-colors"
      >
        <ChevronDown className="w-8 h-8 text-white/50" />
      </button>
    </div>
  );
};

export default Hero;
