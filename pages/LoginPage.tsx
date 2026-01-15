
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Key, Loader2, ChevronLeft, AlertCircle } from 'lucide-react';
import { db } from '../db';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await db.signIn(email, password);
      
      if (authError) {
        // Se o erro for um objeto, extraímos a mensagem. Caso contrário, usamos o próprio erro.
        const errorMsg = typeof authError === 'object' && authError !== null && 'message' in authError 
          ? (authError as any).message 
          : String(authError);
          
        throw new Error(errorMsg);
      }

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Erro de login:', err);
      
      let message = err.message || 'Erro ao conectar ao servidor.';
      
      if (message === 'Invalid login credentials') {
        message = 'E-mail ou senha incorretos.';
      } else if (message.includes('not configured')) {
        message = 'O sistema não está configurado. Verifique o arquivo db.ts.';
      } else if (message.includes('API key')) {
        message = 'Chave API inválida. Verifique a configuração no arquivo db.ts.';
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-richBlack flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-30"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-gold/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-gold/5 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md animate-fade-in relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-gold transition-colors text-xs font-bold uppercase tracking-widest mb-12">
          <ChevronLeft className="w-4 h-4" /> Voltar para o Site
        </Link>

        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-brand-gold/10 border border-brand-gold/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Lock className="w-10 h-10 text-brand-gold" />
          </div>
          <h1 className="text-3xl font-cinzel font-bold text-white tracking-widest uppercase">Área Restrita</h1>
          <p className="text-gray-500 text-xs mt-2 uppercase tracking-[0.2em] font-medium">BiriBar Management Suite</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">E-mail Corporativo</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-gold transition-colors" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-graphite border border-white/5 rounded-2xl p-4 pl-12 text-white focus:outline-none focus:border-brand-gold transition-all outline-none"
                placeholder="admin@biribar.com.br"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest ml-1">Chave de Acesso</label>
            <div className="relative group">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-gold transition-colors" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-graphite border border-white/5 rounded-2xl p-4 pl-12 text-white focus:outline-none focus:border-brand-gold transition-all outline-none"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-red-500 text-[11px] font-bold leading-tight">{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-brand-gold text-brand-richBlack font-bold uppercase tracking-[0.3em] rounded-2xl hover:bg-white hover:scale-[1.02] transition-all shadow-xl disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Acessar Sistema'}
          </button>
        </form>

        <p className="text-center mt-12 text-gray-600 text-[10px] uppercase font-bold tracking-widest">
          Acesso exclusivo para colaboradores autorizados.<br/>
          <span className="text-gray-700">© BiriBar Drink's Ops</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
