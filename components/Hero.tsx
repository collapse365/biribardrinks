
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
    <div className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Ken Burns Effect */}
      <div 
        className="absolute inset-0 z-0 animate-ken-burns"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)',
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      ></div>
      
      {/* Deep Gradient Overlay for Premium Look */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-richBlack/95 via-brand-richBlack/50 to-brand-richBlack z-[1]"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center pt-20 animate-fade-in-up">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 md:px-4 md:py-1.5 border border-brand-gold/30 rounded-full bg-brand-gold/10 backdrop-blur-sm mb-6 md:mb-8">
          <Star className="w-3 h-3 md:w-4 md:h-4 text-brand-gold fill-brand-gold" />
          <span className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-brand-gold font-bold">Experiência Premium de Open Bar</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-8xl cinzel-premium font-bold text-white mb-6 leading-tight animate-glow">
          A Arte da <br /> 
          <span className="text-brand-gold">Mixologia</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-gray-300 text-base md:text-xl font-light mb-10 md:mb-12 tracking-wide leading-relaxed px-4">
          Transformamos seu evento em uma celebração épica com coquetéis artesanais, 
          mixologistas premiados e estrutura luxuosa.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 px-4">
          <Link
            to="/quote"
            className="w-full sm:w-auto px-10 py-4 md:px-12 md:py-5 bg-brand-gold text-brand-richBlack font-black uppercase tracking-[0.2em] text-[10px] md:text-xs rounded-sm hover:bg-white hover:scale-105 transition-all duration-500 shadow-[0_20px_50px_rgba(250,204,21,0.3)]"
          >
            Pedir Orçamento
          </Link>
          <button
            onClick={() => scrollToSection('gallery')}
            className="w-full sm:w-auto px-10 py-4 md:px-12 md:py-5 border border-white/20 text-white font-black uppercase tracking-[0.2em] text-[10px] md:text-xs rounded-sm hover:bg-white/10 transition-all duration-500 flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <GlassWater className="w-4 h-4" />
            Nossa Galeria
          </button>
        </div>
      </div>

      {/* Scroll Down Hint */}
      <button 
        onClick={() => scrollToSection('services')}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer hover:text-brand-gold transition-colors z-10 hidden md:block"
      >
        <ChevronDown className="w-8 h-8 text-white/50" />
      </button>
    </div>
  );
};

export default Hero;
