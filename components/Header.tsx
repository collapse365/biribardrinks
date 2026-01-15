import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight, Lock, LogOut, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase, db } from '../db';

interface HeaderProps {
  scrolled: boolean;
}

const Header: React.FC<HeaderProps> = ({ scrolled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const navItems = [
    { name: 'Início', target: 'home', isExternal: false, isRoute: true, path: '/' },
    { name: 'Serviços', target: 'services', isExternal: false, isRoute: false },
    { name: 'Sobre Nós', target: 'about', isExternal: false, isRoute: true, path: '/about' },
    { name: 'Galeria', target: 'https://instagram.com/biribardrinks', isExternal: true, isRoute: false },
    { name: 'Depoimentos', target: 'testimonials', isExternal: false, isRoute: false },
  ];

  const handleLogout = async () => {
    if (window.confirm('Deseja realmente sair do sistema?')) {
      await db.signOut();
      // Limpa estado local do componente
      setUser(null);
      setIsOpen(false);
      // Força redirecionamento via navegador para o início, ignorando o hash do Router
      // para garantir que a aplicação seja reinicializada sem cache de sessão.
      window.location.href = window.location.origin + window.location.pathname;
    }
  };

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (item: any) => {
    if (item.isExternal) {
      window.open(item.target, '_blank', 'noopener,noreferrer');
      setIsOpen(false);
    } else if (item.isRoute && item.path) {
      navigate(item.path);
      setIsOpen(false);
      window.scrollTo(0, 0);
    } else {
      scrollToSection(item.target);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-brand-richBlack/95 backdrop-blur-lg border-b border-brand-gold/20 py-3 shadow-2xl' 
        : 'bg-gradient-to-b from-black/80 to-transparent py-6'
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link to="/" className="relative block group">
            <span className="text-2xl font-cinzel font-bold tracking-widest text-white group-hover:text-brand-gold transition-colors">
              BIRIBAR<span className="text-brand-gold"> DRINK'S</span>
            </span>
            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-brand-gold to-transparent opacity-50"></div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex items-center space-x-6 mr-4">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item)}
                className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-300 hover:text-brand-gold transition-colors duration-300"
              >
                {item.name}
              </button>
            ))}
            
            {/* Links de Administração / Logout */}
            <div className="flex items-center border-l border-white/10 pl-6 gap-4">
              {user ? (
                <>
                  <Link 
                    to="/dashboard"
                    className="text-brand-gold hover:text-white transition-colors flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-[0.2em]"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Painel
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-red-500/80 hover:text-red-500 transition-colors flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-[0.2em]"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sair
                  </button>
                </>
              ) : (
                <Link 
                  to="/login"
                  className="text-gray-400 hover:text-brand-gold transition-colors flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-[0.2em]"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Restrito
                </Link>
              )}
            </div>
          </div>
          
          <Link
            to="/quote"
            className="px-6 py-2.5 bg-brand-gold text-brand-richBlack text-[11px] font-bold tracking-tighter uppercase rounded-sm hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 flex items-center group"
          >
            Solicitar Orçamento
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white hover:text-brand-gold transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-brand-richBlack z-40 transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item)}
              className="text-2xl font-cinzel text-white hover:text-brand-gold transition-colors"
            >
              {item.name}
            </button>
          ))}
          
          <div className="w-2/3 h-px bg-white/5 my-4"></div>
          
          {user ? (
            <div className="flex flex-col items-center gap-6">
              <Link 
                to="/dashboard" 
                onClick={() => setIsOpen(false)} 
                className="text-brand-gold uppercase tracking-widest font-bold flex items-center gap-2"
              >
                <LayoutDashboard className="w-5 h-5" /> Painel Admin
              </Link>
              <button 
                onClick={handleLogout}
                className="text-red-500 uppercase tracking-widest font-bold flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" /> Sair da Conta
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              onClick={() => setIsOpen(false)} 
              className="text-gray-500 uppercase tracking-widest font-bold"
            >
              Acesso Restrito
            </Link>
          )}

          <Link
            to="/quote"
            onClick={() => setIsOpen(false)}
            className="mt-4 px-8 py-4 bg-brand-gold text-brand-richBlack text-lg font-bold uppercase tracking-widest rounded-sm"
          >
            Solicitar Orçamento
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;