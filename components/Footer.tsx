
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-brand-richBlack border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <a 
              href="https://instagram.com/biribardrinks" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block group"
            >
              <h2 className="text-3xl font-cinzel font-bold text-white mb-6 group-hover:text-brand-gold transition-colors">
                BIRIBAR<span className="text-brand-gold"> DRINK'S</span>
              </h2>
            </a>
            <p className="text-gray-400 max-w-sm leading-relaxed mb-8">
              A marca líder em open bar de luxo, transformando eventos sociais e corporativos 
              em experiências sensoriais memoráveis. Elevamos o conceito de serviço de bar 
              a um novo patamar de sofisticação.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com/biribardrinks" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs uppercase tracking-widest font-bold text-brand-gold hover:text-white transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Navegação</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><button onClick={() => scrollToSection('home')} className="hover:text-brand-gold transition-colors text-left w-full">Início</button></li>
              <li><button onClick={() => scrollToSection('services')} className="hover:text-brand-gold transition-colors text-left w-full">Nossos Serviços</button></li>
              <li><button onClick={() => scrollToSection('gallery')} className="hover:text-brand-gold transition-colors text-left w-full">Portfólio</button></li>
              <li><button onClick={() => scrollToSection('testimonials')} className="hover:text-brand-gold transition-colors text-left w-full">O que dizem os clientes</button></li>
              <li><Link to="/quote" className="hover:text-brand-gold transition-colors text-left w-full block text-brand-gold font-bold">Pedir Orçamento</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Contato Direto</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>contato@biribar.com.br</li>
              <li>+55 (91) 99259-8660</li>
              <li>Breves - PA</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-xs uppercase tracking-widest">
            © {new Date().getFullYear()} BiriBar Drink's. Todos os direitos reservados.
          </p>
          <p className="text-gray-500 text-xs uppercase tracking-widest">
            Design & Experience by <span className="text-brand-gold">Premium Agency</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
