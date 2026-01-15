
import React from 'react';
import { Download, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

const Financial: React.FC = () => {
  const transactions = [
    { client: 'Juliana Mendes', event: 'Casamento', date: '12/10/2024', amount: 'R$ 8.500,00', status: 'Pago' },
    { client: 'TechCorp SA', event: 'Lançamento', date: '25/10/2024', amount: 'R$ 12.400,00', status: 'Pendente' },
    { client: 'Ricardo Santos', event: 'Aniversário', date: '05/11/2024', amount: 'R$ 3.200,00', status: 'Cancelado' },
    { client: 'Beatriz Oliveira', event: 'Debutante', date: '18/11/2024', amount: 'R$ 9.100,00', status: 'Pago' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-cinzel font-bold text-white">Gestão Financeira</h2>
          <p className="text-gray-500 mt-1">Acompanhe pagamentos, faturas e orçamentos enviados.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 border border-white/10 text-white rounded-lg flex items-center gap-2 hover:bg-white/5 transition-all">
            <Download className="w-5 h-5" /> Exportar CSV
          </button>
          <button className="px-6 py-3 bg-brand-gold text-brand-richBlack rounded-lg font-bold flex items-center gap-2 hover:bg-white transition-all shadow-xl">
            <FileText className="w-5 h-5" /> Novo Orçamento
          </button>
        </div>
      </div>

      <div className="bg-brand-graphite rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-white/5 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
              <th className="px-6 py-4">Cliente / Evento</th>
              <th className="px-6 py-4">Data Prevista</th>
              <th className="px-6 py-4">Valor Total</th>
              <th className="px-6 py-4">Status Pagto.</th>
              <th className="px-6 py-4 text-center">Contrato</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.map((t, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-5">
                  <div>
                    <p className="text-white font-bold">{t.client}</p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{t.event}</p>
                  </div>
                </td>
                <td className="px-6 py-5 text-gray-400 font-mono">{t.date}</td>
                <td className="px-6 py-5 text-white font-bold">{t.amount}</td>
                <td className="px-6 py-5">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    t.status === 'Pago' ? 'text-green-500 bg-green-500/10' :
                    t.status === 'Pendente' ? 'text-yellow-500 bg-yellow-500/10' :
                    'text-red-500 bg-red-500/10'
                  }`}>
                    {t.status === 'Pago' && <CheckCircle className="w-3 h-3" />}
                    {t.status === 'Pendente' && <Clock className="w-3 h-3" />}
                    {t.status === 'Cancelado' && <XCircle className="w-3 h-3" />}
                    {t.status}
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <button className="text-brand-gold hover:text-white transition-colors underline text-[10px] font-bold uppercase tracking-widest">
                    Ver PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Financial;
