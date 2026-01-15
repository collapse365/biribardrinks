import React from 'react';
import { 
  Wine, 
  Package, 
  LogOut, 
  Settings as SettingsIcon,
  Briefcase,
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  Info
} from 'lucide-react';
import { Routes, Route, NavLink, Link, useNavigate, Navigate } from 'react-router-dom';
import Overview from './Overview';
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

  const handleLogout = async () => {
    if (window.confirm('Deseja encerrar sua sessão administrativa?')) {
      await db.signOut();
      // Reset total da aplicação para garantir que a sessão foi destruída
      window.location.href = window.location.origin + window.location.pathname;
    }
  };

  const menuItems = [
    { path: '/dashboard/events', icon: Briefcase, label: 'Gestão de Eventos' },
    { path: '/dashboard/menu', icon: Wine, label: 'Cardápio & Receitas' },
    { path: '/dashboard/inventory', icon: Package, label: 'Custos de Insumos' },
    { path: '/dashboard/services', icon: Sparkles, label: 'Serviços' },
    { path: '/dashboard/about', icon: Info, label: 'Institucional' },
    { path: '/dashboard/gallery', icon: ImageIcon, label: 'Galeria' },
    { path: '/dashboard/testimonials', icon: MessageSquare, label: 'Depoimentos' },
    { path: '/dashboard/settings', icon: SettingsIcon, label: 'Precificação' },
  ];

  return (
    <div className="flex h-screen bg-brand-richBlack font-montserrat overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-brand-graphite border-r border-white/5 flex flex-col shadow-2xl z-20">
        <div className="p-10 border-b border-white/5">
          <Link to="/" className="block">
            <h1 className="text-2xl font-cinzel font-bold text-white tracking-widest">
              BIRIBAR <span className="text-brand-gold">OS</span>
            </h1>
          </Link>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mt-2 font-bold">Management Suite</p>
        </div>

        <nav className="flex-grow p-6 space-y-3 mt-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300
                ${isActive 
                  ? 'bg-brand-gold text-brand-richBlack shadow-[0_10px_20px_rgba(250,204,21,0.2)]' 
                  : 'text-gray-500 hover:bg-white/5 hover:text-white'}
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 text-gray-500 hover:text-red-400 font-bold uppercase tracking-widest text-[10px] transition-colors text-left"
          >
            <LogOut className="w-5 h-5" />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-grow flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-24 bg-brand-graphite border-b border-white/5 flex items-center justify-end px-12 shrink-0">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold text-white tracking-wide">Biri Admin</p>
                <p className="text-[10px] text-brand-gold uppercase tracking-tighter font-bold">Diretor de Operações</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-brand-gold flex items-center justify-center text-brand-richBlack font-black shadow-lg shadow-brand-gold/10">
                BA
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-grow overflow-y-auto p-12 bg-brand-richBlack/20">
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