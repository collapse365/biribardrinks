
import React from 'react';
import { TrendingUp, Users, Wine, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Overview: React.FC = () => {
  const stats = [
    { label: 'Receita Mensal', value: 'R$ 42.500', trend: '+12.5%', isUp: true, icon: TrendingUp },
    { label: 'Eventos Confirmados', value: '18', trend: '+2', isUp: true, icon: Calendar },
    { label: 'Drinks Vendidos', value: '1.240', trend: '-5%', isUp: false, icon: Wine },
    { label: 'Leads de Orçamento', value: '45', trend: '+8', isUp: true, icon: Users },
  ];

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-cinzel font-bold text-white">Visão Geral</h2>
          <p className="text-gray-500 mt-1">Bem-vindo de volta ao centro de comando BiriBar.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 border border-white/10 rounded-lg text-white hover:bg-white/5 transition-all text-sm font-bold">Exportar Relatório</button>
          <button className="px-6 py-2 bg-brand-gold text-brand-richBlack rounded-lg font-bold hover:bg-white transition-all text-sm">Novo Evento</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-brand-graphite p-6 rounded-xl border border-white/5 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-lg bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center text-xs font-bold ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                {stat.trend}
                {stat.isUp ? <ArrowUpRight className="w-3 h-3 ml-1" /> : <ArrowDownRight className="w-3 h-3 ml-1" />}
              </div>
            </div>
            <p className="text-gray-500 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-brand-gold opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-brand-graphite p-8 rounded-xl border border-white/5">
          <h3 className="text-lg font-bold text-white mb-6">Desempenho Financeiro</h3>
          <div className="h-64 flex items-end gap-4">
            {[40, 65, 45, 90, 85, 60, 75, 55, 95, 80, 70, 85].map((h, i) => (
              <div key={i} className="flex-grow bg-white/5 rounded-t-sm relative group">
                <div 
                  className="absolute bottom-0 w-full bg-brand-gold/60 rounded-t-sm transition-all duration-700 group-hover:bg-brand-gold" 
                  style={{ height: `${h}%` }}
                ></div>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-brand-richBlack px-2 py-1 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  R$ {(h * 500).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
            <span>Jan</span><span>Mar</span><span>Jun</span><span>Ago</span><span>Nov</span><span>Dez</span>
          </div>
        </div>

        <div className="bg-brand-graphite p-8 rounded-xl border border-white/5 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">Mix de Vendas</h3>
          <div className="flex-grow flex items-center justify-center">
            {/* Simple CSS-based pie chart visualization */}
            <div className="relative w-48 h-48 rounded-full border-[12px] border-brand-gold border-r-brand-darkGold border-b-white/5 animate-spin-slow">
              <div className="absolute inset-0 flex flex-col items-center justify-center -rotate-[inherit]">
                <p className="text-2xl font-bold text-white">68%</p>
                <p className="text-[10px] text-gray-500 uppercase">Premium</p>
              </div>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2 text-gray-400"><span className="w-3 h-3 rounded-full bg-brand-gold"></span> Drinks Premium</span>
              <span className="text-white font-bold">68%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2 text-gray-400"><span className="w-3 h-3 rounded-full bg-brand-darkGold"></span> Clássicos</span>
              <span className="text-white font-bold">22%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2 text-gray-400"><span className="w-3 h-3 rounded-full bg-white/20"></span> Non-Alc</span>
              <span className="text-white font-bold">10%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
