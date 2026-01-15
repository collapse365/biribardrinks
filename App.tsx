
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import QuotePage from './pages/QuotePage';

const LandingPage: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Header scrolled={scrolled} />
      
      <main className="flex-grow">
        <section id="home">
          <Hero />
        </section>
        
        <section id="services" className="py-20 bg-brand-richBlack">
          <Services />
        </section>
        
        <section id="gallery" className="py-20 bg-brand-graphite">
          <Gallery />
        </section>
        
        <section id="testimonials" className="py-20 bg-brand-richBlack">
          <Testimonials />
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quote" element={<QuotePage />} />
        <Route path="/dashboard/*" element={<DashboardLayout />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
