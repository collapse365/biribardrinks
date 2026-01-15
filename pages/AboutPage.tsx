
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { db, AboutContent } from '../db';
import { Target, Eye, ShieldCheck, Gem } from 'lucide-react';

const AboutPage: React.FC = () => {
  const [content, setContent] = useState<AboutContent | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setContent(db.get().about);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!content) return null;

  return (
    <div className="min-h-screen bg-brand-richBlack font-montserrat flex flex-col">
      <Header scrolled={scrolled} />

      <main className="flex-grow pt-32">
        {/* Hero Section */}
        <section className="container mx-auto px-6 mb-24">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-sm uppercase tracking-[0.5em] text-brand-gold font-bold">Nossa Essência</h2>
            <h1 className="text-5xl md:text-7xl font-cinzel font-bold text-white">Sobre o <span className="text-brand-gold">BiriBar</span></h1>
            <p className="text-gray-400 text-lg leading-relaxed italic">"Transformando momentos em memórias através da coquetelaria de luxo."</p>
          </div>
        </section>

        {/* History Section */}
        <section className="bg-brand-graphite py-24 border-y border-white/5">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-brand-gold/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img 
                src="https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&q=80&w=800" 
                alt="História BiriBar" 
                className="relative rounded-2xl border border-white/10 shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="space-y-8">
              <h3 className="text-3xl font-cinzel font-bold text-white flex items-center gap-4">
                <span className="w-12 h-px bg-brand-gold"></span>
                Nossa Jornada
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                {content.history}
              </p>
            </div>
          </div>
        </section>

        {/* Mission Vision Values */}
        <section className="py-24 container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-10 rounded-3xl space-y-6 hover:border-brand-gold/40 transition-all group">
              <div className="w-14 h-14 bg-brand-gold/10 rounded-2xl flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-cinzel font-bold text-white">Missão</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{content.mission}</p>
            </div>

            <div className="glass-card p-10 rounded-3xl space-y-6 hover:border-brand-gold/40 transition-all group">
              <div className="w-14 h-14 bg-brand-gold/10 rounded-2xl flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform">
                <Eye className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-cinzel font-bold text-white">Visão</h4>
              <p className="text-gray-400 text-sm leading-relaxed">{content.vision}</p>
            </div>

            <div className="glass-card p-10 rounded-3xl space-y-6 hover:border-brand-gold/40 transition-all group">
              <div className="w-14 h-14 bg-brand-gold/10 rounded-2xl flex items-center justify-center text-brand-gold group-hover:scale-110 transition-transform">
                <Gem className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-cinzel font-bold text-white">Valores</h4>
              <ul className="space-y-3">
                {content.values.map((v, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300 text-sm font-medium">
                    <ShieldCheck className="w-4 h-4 text-brand-gold" />
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default AboutPage;
