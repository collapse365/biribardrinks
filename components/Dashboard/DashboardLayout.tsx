
import React, { useState } from 'react';
import { 
  Wine, 
  Package, 
  LogOut, 
  Settings as SettingsIcon,
  Briefcase,
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  Info,
  Menu,
  X
} from 'lucide-react';
import { Routes, Route, NavLink, Link, useNavigate, Navigate } from 'react-router-dom';
import MenuManager from './MenuManager';
import Inventory from './Inventory';
import Planner from './Planner';
import Settings from './Settings';
import GalleryManager from './GalleryManager';
import TestimonialsManager from './TestimonialsManager';
import ServicesManager from './ServicesManager';
import AboutManager from './AboutManager';
import { db } from '../../db';

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    if (window.confirm('Deseja encerrar sua sessão administrativa?')) {
      await db.signOut();
      window.location.href = window.location.origin + window.location.pathname;
    }
  };

  const menuItems = [
    { path: '/dashboard/events', icon: Briefcase, label: 'Eventos' },
    { path: '/dashboard/menu', icon: Wine, label: 'Cardápio' },
    { path: '/dashboard/inventory', icon: Package, label: 'Custos' },
    { path: '/dashboard/services', icon: Sparkles, label: 'Serviços' },
    { path: '/dashboard/about', icon: Info, label: 'Institucional' },
    { path: '/dashboard/gallery', icon: ImageIcon, label: 'Galeria' },
    { path: '/dashboard/testimonials', icon: MessageSquare, label: 'Depoimentos' },
    { path: '/dashboard/settings', icon: SettingsIcon, label: 'Precificação' },
  ];

  return (
    <div className="flex h-screen bg-brand-richBlack font-montserrat overflow-hidden relative">
      
      {/* Sidebar Overlay (Mobile) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 w-72 bg-brand-graphite border-r border-white/5 flex flex-col shadow-2xl z-50 transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <Link to="/" className="block">
            <h1 className="text-xl font-cinzel font-bold text-white tracking-widest">
              BIRIBAR <span className="text-brand-gold">OS</span>
            </h1>
          </Link>
          <button className="lg:hidden text-gray-500 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-grow p-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `
                w-full flex items-center gap-4 px-5 py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300
                ${isActive 
                  ? 'bg-brand-gold text-brand-richBlack shadow-lg' 
                  : 'text-gray-500 hover:bg-white/5 hover:text-white'}
              `}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 text-gray-500 hover:text-red-400 font-bold uppercase tracking-widest text-[10px] transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-grow flex flex-col overflow-hidden w-full">
        {/* Top Header */}
        <header className="h-20 bg-brand-graphite border-b border-white/5 flex items-center justify-between lg:justify-end px-6 lg:px-12 shrink-0">
          <button 
            className="lg:hidden p-2 text-white bg-white/5 rounded-lg"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white tracking-wide">Biri Admin</p>
              <p className="text-[10px] text-brand-gold uppercase font-bold">Diretor</p>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-brand-gold flex items-center justify-center text-brand-richBlack font-black shadow-lg">
              BA
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-grow overflow-y-auto p-6 lg:p-12 bg-brand-richBlack/20 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route index element={<Navigate to="events" replace />} />
              <Route path="events" element={<Planner />} />
              <Route path="menu" element={<MenuManager />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="gallery" element={<GalleryManager />} />
              <Route path="testimonials" element={<TestimonialsManager />} />
              <Route path="services" element={<ServicesManager />} />
              <Route path="about" element={<AboutManager />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Planner />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
