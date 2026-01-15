
import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton: React.FC = () => {
  return (
    <a 
      href="https://wa.me/5591992598660" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 group"
    >
      <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25 group-hover:opacity-0 transition-opacity"></div>
      <div className="relative bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 hover:scale-110 transition-all duration-300">
        <MessageCircle className="w-8 h-8 fill-white/20" />
      </div>
      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-brand-richBlack text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg">
        Falar no WhatsApp
      </div>
    </a>
  );
};

export default WhatsAppButton;
