
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  User,
  Phone,
  Users,
  MapPin,
  Calendar,
  Clock,
  Hourglass,
  Layers,
  Sparkles,
  Beer,
  Droplets,
  Wine,
} from 'lucide-react';
import { db, PricingConfig, AppData, Drink } from '../db';

const PLAN_TYPES = [
  { id: 'com-alcool', name: 'Com Álcool', icon: Beer },
  { id: 'sem-alcool', name: 'Sem Álcool', icon: Droplets },
  { id: 'misto', name: 'Bar Misto', icon: Layers },
];

const LABELS_CONFIG = {
  vodka: [{ id: 'roskoff', name: 'Roskoff (Padrão)' }, { id: 'skyy', name: 'Skyy (Premium)' }],
  gin: [{ id: 'rocks', name: 'Rocks (Padrão)' }, { id: 'tanqueray', name: 'Tanqueray (Premium)' }],
  cachaca: [{ id: 'tatuzinho', name: 'Tatuzinho' }, { id: 'velho-barreiro', name: 'Velho Barreiro' }]
};

const QuestionWrapper: React.FC<{ title: string; subtitle?: string; children: React.ReactNode; error?: string; }> = ({ title, subtitle, children, error }) => (
  <div className="max-w-xl mx-auto space-y-8 animate-fade-in">
    <div className="space-y-2 text-center">
      <h2 className="text-3xl font-cinzel font-bold text-white tracking-tight leading-tight uppercase">{title}</h2>
      {subtitle && <p className="text-gray-400 text-sm font-medium">{subtitle}</p>}
    </div>
    <div className="space-y-4">
      {children}
      {error && <p className="text-red-500 text-xs flex items-center gap-1 justify-center animate-bounce font-bold"><AlertCircle className="w-3 h-3" /> {error}</p>}
    </div>
  </div>
);

const QuotePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [appData, setAppData] = useState<AppData | null>(null);

  useEffect(() => {
    setAppData(db.get());
  }, []);

  const [data, setData] = useState({
    name: '', phone: '', guests: '', location: '', date: '', time: '', duration: '',
    needsCounter: null as boolean | null, cupType: null as 'standard' | 'glass' | null, glassQuantity: '',
    planType: '', caipiFlavors: [] as string[], frozenFlavors: [] as string[],
    specialDrinks: [] as { id: string; name: string }[],
    labels: { vodka: [] as string[], gin: [] as string[], cachaca: [] as string[] }
  });

  const specialDrinksList = useMemo(() => {
    return appData?.drinks.filter(d => d.isSpecial) || [];
  }, [appData]);

  const steps = useMemo(() => {
    const s = ['name', 'phone', 'guests', 'location', 'date', 'time', 'duration', 'needsCounter', 'cupType'];
    if (data.cupType === 'glass') s.push('glassQuantity');
    s.push('planType', 'caipiFlavors', 'frozenFlavors', 'specialDrinks');
    if (data.planType !== 'sem-alcool') s.push('labels');
    s.push('summary');
    return s;
  }, [data.planType, data.cupType]);

  const currentKey = steps[currentStep];

  const totalBudget = useMemo(() => {
    if (!data.planType || !data.guests || !appData) return 0;
    const nGuests = parseInt(data.guests) || 0;
    const nHours = parseInt(data.duration) || 4;
    const pricing = appData.pricing;
    
    // 1. Cálculo do valor por pessoa (PPG) baseado no plano
    let ppg = data.planType === 'com-alcool' ? pricing.baseAlcohol : data.planType === 'sem-alcool' ? pricing.baseNonAlcohol : pricing.baseMisto;
    
    // Adicional de horas extras no valor por pessoa
    if (nHours > 4) {
      ppg += ppg * ((nHours - 4) * pricing.extraHourMultiplier);
    }
    
    // Adicional de rótulos premium
    if (data.labels.vodka.some(v => v.includes('Premium')) || data.labels.gin.some(g => g.includes('Premium'))) {
      ppg += pricing.premiumLabelFee;
    }
    
    // Adicional de drinks especiais por pessoa
    ppg += (data.specialDrinks.length * pricing.specialDrinkFee);

    // 2. Cálculo do custo de equipe (Staff)
    // Regra: 1 barman para cada 50 convidados (mínimo 1)
    const staffNeeded = Math.ceil(nGuests / 50) || 1;
    const staffCost = staffNeeded * pricing.staffHourlyRate * nHours;

    // 3. Somatória Final
    let total = (ppg * nGuests) + staffCost;
    
    // Taxas fixas de estrutura
    if (data.needsCounter) total += pricing.counterFixedFee;
    
    // Aluguel de taças de vidro (preço unitário)
    if (data.cupType === 'glass') {
      const qTaças = parseInt(data.glassQuantity) || 0;
      total += (qTaças * pricing.glasswareFixedFee);
    }
    
    return total;
  }, [data, appData]);

  const handleNext = () => {
    if (currentKey === 'summary') {
      db.addLead({ ...data, total: totalBudget });
      alert('Pedido de orçamento enviado! Nossa equipe entrará em contato.');
      navigate('/');
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const renderContinueButton = (disabled: boolean = false) => (
    <button 
      onClick={handleNext} 
      disabled={disabled}
      className="w-full mt-6 py-5 bg-brand-gold text-brand-richBlack font-bold uppercase tracking-[0.2em] rounded-xl hover:scale-[1.02] transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-30 disabled:scale-100"
    >
      Continuar <ChevronRight className="w-5 h-5" />
    </button>
  );

  if (!appData) return null;

  const renderQuestion = () => {
    switch (currentKey) {
      case 'name': return (
        <QuestionWrapper title="Olá! Qual o seu nome?">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gold"/>
            <input autoFocus type="text" placeholder="Nome completo" value={data.name} onChange={e => setData({...data, name: e.target.value})} onKeyDown={e => e.key === 'Enter' && data.name.trim() && handleNext()} className="w-full bg-brand-graphite border border-white/10 rounded-xl p-5 pl-14 text-white focus:border-brand-gold focus:outline-none text-lg"/>
          </div>
          {renderContinueButton(!data.name.trim())}
        </QuestionWrapper>
      );
      case 'phone': return (
        <QuestionWrapper title="WhatsApp para contato?">
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gold"/>
            <input autoFocus type="tel" placeholder="(00) 00000-0000" value={data.phone} onChange={e => setData({...data, phone: e.target.value})} onKeyDown={e => e.key === 'Enter' && data.phone.trim() && handleNext()} className="w-full bg-brand-graphite border border-white/10 rounded-xl p-5 pl-14 text-white focus:border-brand-gold focus:outline-none text-lg"/>
          </div>
          {renderContinueButton(!data.phone.trim())}
        </QuestionWrapper>
      );
      case 'guests': return (
        <QuestionWrapper title="Quantos convidados?">
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gold"/>
            <input autoFocus type="number" placeholder="Ex: 150" value={data.guests} onChange={e => setData({...data, guests: e.target.value})} onKeyDown={e => e.key === 'Enter' && data.guests && handleNext()} className="w-full bg-brand-graphite border border-white/10 rounded-xl p-5 pl-14 text-white focus:border-brand-gold focus:outline-none text-lg"/>
          </div>
          {renderContinueButton(!data.guests)}
        </QuestionWrapper>
      );
      case 'location': return (
        <QuestionWrapper title="Local do evento?">
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gold"/>
            <input autoFocus type="text" placeholder="Cidade ou Espaço" value={data.location} onChange={e => setData({...data, location: e.target.value})} onKeyDown={e => e.key === 'Enter' && data.location.trim() && handleNext()} className="w-full bg-brand-graphite border border-white/10 rounded-xl p-5 pl-14 text-white focus:border-brand-gold focus:outline-none text-lg"/>
          </div>
          {renderContinueButton(!data.location.trim())}
        </QuestionWrapper>
      );
      case 'date': return (
        <QuestionWrapper title="Qual a data?">
          <input type="date" value={data.date} onChange={e => setData({...data, date: e.target.value})} className="w-full bg-brand-graphite border border-white/10 rounded-xl p-5 text-white focus:border-brand-gold focus:outline-none text-lg [color-scheme:dark]"/>
          {renderContinueButton(!data.date)}
        </QuestionWrapper>
      );
      case 'time': return (
        <QuestionWrapper title="Início do serviço?">
          <input type="time" value={data.time} onChange={e => setData({...data, time: e.target.value})} className="w-full bg-brand-graphite border border-white/10 rounded-xl p-5 text-white focus:border-brand-gold focus:outline-none text-lg [color-scheme:dark]"/>
          {renderContinueButton(!data.time)}
        </QuestionWrapper>
      );
      case 'duration': return (
        <QuestionWrapper title="Duração (em horas)?">
          <input type="number" placeholder="Ex: 5" value={data.duration} onChange={e => setData({...data, duration: e.target.value})} onKeyDown={e => e.key === 'Enter' && data.duration && handleNext()} className="w-full bg-brand-graphite border border-white/10 rounded-xl p-5 text-white focus:border-brand-gold focus:outline-none text-lg"/>
          {renderContinueButton(!data.duration)}
        </QuestionWrapper>
      );
      case 'needsCounter': return <QuestionWrapper title="Precisa de balcão?"><div className="grid grid-cols-2 gap-4"><button onClick={() => {setData({...data, needsCounter: true}); handleNext();}} className="p-8 rounded-xl border-2 border-white/10 hover:border-brand-gold transition-all font-bold uppercase text-xs">SIM</button><button onClick={() => {setData({...data, needsCounter: false}); handleNext();}} className="p-8 rounded-xl border-2 border-white/10 hover:border-brand-gold transition-all font-bold uppercase text-xs">NÃO</button></div></QuestionWrapper>;
      case 'cupType': return (
        <QuestionWrapper title="Tipo de Copos?">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => {setData({...data, cupType: 'standard'}); handleNext();}} 
              className="p-10 rounded-2xl border-2 border-white/10 hover:border-brand-gold hover:bg-white/5 transition-all group flex flex-col items-center gap-4"
            >
              <Droplets className="w-12 h-12 text-gray-400 group-hover:text-brand-gold" />
              <div className="text-center">
                <p className="font-bold uppercase tracking-widest text-sm text-white">Copos Descartáveis</p>
                <p className="text-[10px] text-gray-500 font-bold mt-1">(Padrão de Serviço)</p>
              </div>
            </button>
            <button 
              onClick={() => {setData({...data, cupType: 'glass'}); handleNext();}} 
              className="p-10 rounded-2xl border-2 border-white/10 hover:border-brand-gold hover:bg-white/5 transition-all group flex flex-col items-center gap-4"
            >
              <Wine className="w-12 h-12 text-gray-400 group-hover:text-brand-gold" />
              <div className="text-center">
                <p className="font-bold uppercase tracking-widest text-sm text-white">Taças de Vidro</p>
                <p className="text-[10px] text-brand-gold font-bold mt-1">(Aluguel Premium)</p>
              </div>
            </button>
          </div>
        </QuestionWrapper>
      );
      case 'glassQuantity': return (
        <QuestionWrapper title="Quantidade de Taças?" subtitle="Quantas taças deseja alugar para o seu evento?">
          <div className="relative">
            <Wine className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gold"/>
            <input 
              autoFocus 
              type="number" 
              placeholder="Ex: 200" 
              value={data.glassQuantity} 
              onChange={e => setData({...data, glassQuantity: e.target.value})} 
              onKeyDown={e => e.key === 'Enter' && data.glassQuantity && handleNext()} 
              className="w-full bg-brand-graphite border border-white/10 rounded-xl p-5 pl-14 text-white focus:border-brand-gold focus:outline-none text-lg"
            />
          </div>
          <p className="text-center text-xs text-gray-500 font-medium">Recomendamos pelo menos 1.5 taças por convidado.</p>
          {renderContinueButton(!data.glassQuantity)}
        </QuestionWrapper>
      );
      case 'planType': return <QuestionWrapper title="Escolha o Plano:"><div className="grid grid-cols-1 gap-4">{PLAN_TYPES.map(p => (<button key={p.id} onClick={() => {setData({...data, planType: p.id}); handleNext();}} className="flex items-center gap-4 p-6 rounded-xl border-2 border-white/10 hover:border-brand-gold transition-all"><p.icon className="w-8 h-8 text-brand-gold"/><span className="font-bold uppercase tracking-widest">{p.name}</span></button>))}</div></QuestionWrapper>;
      case 'caipiFlavors': return <QuestionWrapper title="Escolha 3 frutas (Caipi):" subtitle="Selecione exatamente 3"><div className="grid grid-cols-2 md:grid-cols-3 gap-3">{appData.caipiFlavors.map(f => (<button key={f} onClick={() => {const active = data.caipiFlavors.includes(f); if (active) setData({...data, caipiFlavors: data.caipiFlavors.filter(x => x !== f)}); else if (data.caipiFlavors.length < 3) setData({...data, caipiFlavors: [...data.caipiFlavors, f]});}} className={`p-4 rounded-lg border-2 font-bold uppercase text-[10px] transition-all ${data.caipiFlavors.includes(f) ? 'bg-brand-gold border-brand-gold text-brand-richBlack' : 'bg-brand-graphite border-white/10 text-gray-400 hover:border-brand-gold/30'}`}>{f}</button>))}</div><button onClick={handleNext} disabled={data.caipiFlavors.length !== 3} className="w-full mt-6 p-4 bg-brand-gold text-brand-richBlack font-bold rounded-xl disabled:opacity-30">Confirmar Frutas</button></QuestionWrapper>;
      case 'frozenFlavors': return <QuestionWrapper title="Escolha 2 Frozens:" subtitle="Selecione exatamente 2"><div className="grid grid-cols-2 md:grid-cols-3 gap-3">{appData.frozenFlavors.map(f => (<button key={f} onClick={() => {const active = data.frozenFlavors.includes(f); if (active) setData({...data, frozenFlavors: data.frozenFlavors.filter(x => x !== f)}); else if (data.frozenFlavors.length < 2) setData({...data, frozenFlavors: [...data.frozenFlavors, f]});}} className={`p-4 rounded-lg border-2 font-bold uppercase text-[10px] transition-all ${data.frozenFlavors.includes(f) ? 'bg-brand-gold border-brand-gold text-brand-richBlack' : 'bg-brand-graphite border-white/10 text-gray-400 hover:border-brand-gold/30'}`}>{f}</button>))}</div><button onClick={handleNext} disabled={data.frozenFlavors.length !== 2} className="w-full mt-6 p-4 bg-brand-gold text-brand-richBlack font-bold rounded-xl disabled:opacity-30">Confirmar Frozens</button></QuestionWrapper>;
      case 'specialDrinks': return <QuestionWrapper title="Drinks Especiais (Opcional):" subtitle="Você pode escolher quantos desejar"><div className="grid grid-cols-1 gap-3">{specialDrinksList.map(d => {const selected = data.specialDrinks.find(s => s.id === d.id); return (<button key={d.id} onClick={() => selected ? setData({...data, specialDrinks: data.specialDrinks.filter(s => s.id !== d.id)}) : setData({...data, specialDrinks: [...data.specialDrinks, {id: d.id, name: d.name}]})} className={`p-5 rounded-xl border-2 flex justify-between items-center transition-all ${selected ? 'bg-brand-gold border-brand-gold text-brand-richBlack font-bold' : 'bg-brand-graphite border-white/10 text-white'}`}><span>{d.name}</span>{selected && <CheckCircle2 className="w-5 h-5"/>}</button>);})}</div><button onClick={handleNext} className="w-full mt-6 p-4 bg-brand-gold text-brand-richBlack font-bold rounded-xl">Ver Resumo</button></QuestionWrapper>;
      case 'labels': return <QuestionWrapper title="Rótulos Premium?"><div className="space-y-6">{Object.entries(LABELS_CONFIG).map(([key, labels]) => (<div key={key} className="space-y-2"><label className="text-[10px] uppercase font-bold text-gray-500">{key}</label><div className="grid grid-cols-2 gap-2">{labels.map(l => {const active = data.labels[key as keyof typeof data.labels].includes(l.name); return (<button key={l.id} onClick={() => setData({...data, labels: {...data.labels, [key]: active ? data.labels[key as keyof typeof data.labels].filter(x => x !== l.name) : [...data.labels[key as keyof typeof data.labels], l.name]}})} className={`p-3 rounded-lg border-2 text-[10px] font-bold uppercase transition-all ${active ? 'bg-brand-gold border-brand-gold text-brand-richBlack' : 'bg-brand-graphite border-white/10 text-gray-400'}`}>{l.name}</button>);})}</div></div>))}</div><button onClick={handleNext} className="w-full mt-4 p-4 bg-brand-gold text-brand-richBlack font-bold rounded-xl">Finalizar</button></QuestionWrapper>;
      case 'summary': return (
        <div className="max-w-xl mx-auto bg-brand-graphite rounded-3xl border border-brand-gold/30 overflow-hidden shadow-2xl animate-fade-in mb-12">
          <div className="bg-brand-gold p-8 text-brand-richBlack text-center"><h2 className="text-2xl font-cinzel font-bold uppercase">Orçamento Estimado</h2></div>
          <div className="p-8 space-y-6">
            <div className="text-center py-4 border-b border-white/5">
              <p className="text-[10px] uppercase tracking-widest text-gray-500">Valor Estimado</p>
              <h3 className="text-4xl font-cinzel font-bold text-white mt-1">R$ {totalBudget.toLocaleString('pt-BR')}</h3>
            </div>
            <div className="space-y-2 text-xs text-gray-400">
               <p>• <strong>Plano:</strong> {PLAN_TYPES.find(p=>p.id===data.planType)?.name}</p>
               <p>• <strong>Convidados:</strong> {data.guests}</p>
               <p>• <strong>Tipo de Copos:</strong> {data.cupType === 'glass' ? `Taças de Vidro (${data.glassQuantity} un)` : 'Copos Descartáveis (Padrão)'}</p>
               <p>• <strong>Frutas:</strong> {data.caipiFlavors.join(', ')}</p>
               <p>• <strong>Especiais:</strong> {data.specialDrinks.length > 0 ? data.specialDrinks.map(d=>d.name).join(', ') : 'Nenhum'}</p>
               <p>• <strong>Serviço:</strong> Inclui equipe profissional calculada para {data.duration}h</p>
            </div>
            <button onClick={handleNext} className="w-full py-5 bg-brand-gold text-brand-richBlack font-bold uppercase tracking-[0.2em] rounded-xl hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-3">Confirmar Pedido <Sparkles className="w-5 h-5"/></button>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-brand-richBlack font-montserrat flex flex-col text-white">
      <header className="h-20 border-b border-white/5 bg-brand-graphite flex items-center px-6 sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-brand-gold"><ChevronLeft className="w-5 h-5" /><span>Sair</span></Link>
        <div className="flex-grow text-center font-cinzel font-bold text-brand-gold tracking-widest">BIRIBAR PLANNER</div>
      </header>
      <div className="h-1 bg-white/5"><div className="h-full bg-brand-gold transition-all duration-700" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}/></div>
      <main className="flex-grow flex items-center justify-center p-6"><div className="w-full max-w-3xl">{renderQuestion()}</div></main>
    </div>
  );
};

export default QuotePage;
