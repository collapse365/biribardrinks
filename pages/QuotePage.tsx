
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
  Layers,
  Sparkles,
  Beer,
  Droplets,
  Wine,
  Loader2
} from 'lucide-react';
import { db, AppData } from '../db';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    db.get().then(setAppData);
  }, []);

  const [formData, setFormData] = useState({
    name: '', phone: '', guests: '', location: '', date: '', time: '', duration: '',
    needsCounter: null as boolean | null, cupType: null as 'standard' | 'glass' | null, glassQuantity: '',
    planType: '', caipiFlavors: [] as string[], frozenFlavors: [] as string[],
    specialDrinks: [] as { id: string; name: string }[],
    labels: { vodka: [] as string[], gin: [] as string[], cachaca: [] as string[] }
  });

  const specialDrinksList = useMemo(() => appData?.drinks.filter(d => d.isSpecial) || [], [appData]);

  const steps = useMemo(() => {
    const s = ['name', 'phone', 'guests', 'location', 'date', 'time', 'duration', 'needsCounter', 'cupType'];
    if (formData.cupType === 'glass') s.push('glassQuantity');
    s.push('planType', 'caipiFlavors', 'frozenFlavors', 'specialDrinks');
    if (formData.planType !== 'sem-alcool') s.push('labels');
    s.push('summary');
    return s;
  }, [formData.planType, formData.cupType]);

  const currentKey = steps[currentStep];

  const toggleLabel = (category: string, labelName: string) => {
    const cat = category as keyof typeof formData.labels;
    const currentLabels = formData.labels[cat];
    const isAlreadySelected = currentLabels.includes(labelName);
    
    setFormData({
      ...formData,
      labels: {
        ...formData.labels,
        [cat]: isAlreadySelected 
          ? currentLabels.filter(l => l !== labelName)
          : [...currentLabels, labelName]
      }
    });
  };

  const totalBudget = useMemo(() => {
    if (!formData.planType || !formData.guests || !appData) return 0;
    const nGuests = parseInt(formData.guests) || 0;
    const nHours = parseInt(formData.duration) || 4;
    const pricing = appData.pricing;
    
    let ppg = formData.planType === 'com-alcool' ? pricing.baseAlcohol : formData.planType === 'sem-alcool' ? pricing.baseNonAlcohol : pricing.baseMisto;
    if (nHours > 4) ppg += ppg * ((nHours - 4) * pricing.extraHourMultiplier);
    if (formData.labels.vodka.some(v => v.includes('Premium')) || formData.labels.gin.some(g => g.includes('Premium'))) ppg += pricing.premiumLabelFee;
    ppg += (formData.specialDrinks.length * pricing.specialDrinkFee);

    let laborCost = nGuests > 300 ? 1000 + (nGuests - 300) * 3.5 : Math.min(1000, nGuests * 10);
    let total = (ppg * nGuests) + laborCost;
    if (formData.needsCounter) total += pricing.counterFixedFee;
    if (formData.cupType === 'glass') total += ((parseInt(formData.glassQuantity) || 0) * pricing.glasswareFixedFee);
    
    return total;
  }, [formData, appData]);

  const handleNext = async () => {
    if (currentKey === 'summary') {
      setIsSubmitting(true);
      await db.addLead({ ...formData, total: totalBudget });
      setIsSubmitting(false);
      navigate('/');
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const renderContinueButton = (disabled: boolean = false) => (
    <button 
      onClick={handleNext} 
      disabled={disabled || isSubmitting}
      className="w-full mt-6 py-5 bg-brand-gold text-brand-richBlack font-bold uppercase tracking-[0.2em] rounded-xl hover:scale-105 transition-all shadow-xl disabled:opacity-30 flex items-center justify-center gap-2"
    >
      {isSubmitting ? <Loader2 className="animate-spin" /> : <>Próximo Passo <ChevronRight className="w-5 h-5" /></>}
    </button>
  );

  if (!appData) return <div className="min-h-screen bg-brand-richBlack flex items-center justify-center"><Loader2 className="w-12 h-12 text-brand-gold animate-spin" /></div>;

  const renderQuestion = () => {
    switch (currentKey) {
      case 'name': return <QuestionWrapper title="Olá! Qual o seu nome?"><div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gold"/><input autoFocus type="text" placeholder="Nome completo" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} onKeyDown={e => e.key === 'Enter' && formData.name.trim() && handleNext()} className="w-full bg-brand-graphite border border-white/10 rounded-xl p-5 pl-14 text-white focus:border-brand-gold focus:outline-none text-lg"/></div>{renderContinueButton(!formData.name.trim())}</QuestionWrapper>;
      case 'phone': return <QuestionWrapper title="WhatsApp para contato?"><div className="relative"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gold"/><input autoFocus type="tel" placeholder="(00) 00000-0000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} onKeyDown={e => e.key === 'Enter' && formData.phone.trim() && handleNext()} className="w-full bg-brand-graphite border border-white/10 rounded-xl p-5 pl-14 text-white focus:border-brand-gold focus:outline-none text-lg"/></div>{renderContinueButton(!formData.phone.trim())}</QuestionWrapper>;
      case 'guests': return <QuestionWrapper title="Quantos convidados?"><div className="relative"><Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gold"/><input autoFocus type="number" placeholder="Ex: 150" value={formData.guests} onChange={e => setFormData({...formData, guests: e.target.value})} onKeyDown={e => e.key === 'Enter' && formData.guests && handleNext()} className="w-full bg-brand-graphite border border-white/10 rounded-xl p-5 pl-14 text-white focus:border-brand-gold focus:outline-none text-lg"/></div>{renderContinueButton(!formData.guests)}</QuestionWrapper>;
      case 'location': return <QuestionWrapper title="Local do evento?"><div className="relative"><MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gold"/><input autoFocus type="text" placeholder="Cidade ou Espaço" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} onKeyDown={e => e.key === 'Enter' && formData.location.trim() && handleNext()} className="w-full bg-brand-graphite border border-white/10 rounded-xl p-5 pl-14 text-white focus:border-brand-gold focus:outline-none text-lg"/></div>{renderContinueButton(!formData.location.trim())}</QuestionWrapper>;
      case 'date': return <QuestionWrapper title="Qual a data?"><input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-brand-graphite border border-white/10 rounded-xl p-5 text-white focus:border-brand-gold focus:outline-none text-lg [color-scheme:dark]"/>{renderContinueButton(!formData.date)}</QuestionWrapper>;
      case 'time': return <QuestionWrapper title="Início do serviço?"><input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-brand-graphite border border-white/10 rounded-xl p-5 text-white focus:border-brand-gold focus:outline-none text-lg [color-scheme:dark]"/>{renderContinueButton(!formData.time)}</QuestionWrapper>;
      case 'duration': return <QuestionWrapper title="Duração (em horas)?"><input type="number" placeholder="Ex: 5" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} onKeyDown={e => e.key === 'Enter' && formData.duration && handleNext()} className="w-full bg-brand-graphite border border-white/10 rounded-xl p-5 text-white focus:border-brand-gold focus:outline-none text-lg"/>{renderContinueButton(!formData.duration)}</QuestionWrapper>;
      case 'needsCounter': return <QuestionWrapper title="Precisa de balcão?"><div className="grid grid-cols-2 gap-4"><button onClick={() => {setFormData({...formData, needsCounter: true}); setCurrentStep(prev => prev + 1);}} className="p-8 rounded-xl border-2 border-white/10 hover:border-brand-gold transition-all font-bold uppercase text-xs">SIM</button><button onClick={() => {setFormData({...formData, needsCounter: false}); setCurrentStep(prev => prev + 1);}} className="p-8 rounded-xl border-2 border-white/10 hover:border-brand-gold transition-all font-bold uppercase text-xs">NÃO</button></div></QuestionWrapper>;
      case 'cupType': return <QuestionWrapper title="Tipo de Copos?"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><button onClick={() => {setFormData({...formData, cupType: 'standard'}); setCurrentStep(prev => prev + 1);}} className="p-10 rounded-2xl border-2 border-white/10 hover:border-brand-gold hover:bg-white/5 transition-all group flex flex-col items-center gap-4"><Droplets className="w-12 h-12 text-gray-400 group-hover:text-brand-gold" /><p className="font-bold uppercase tracking-widest text-sm text-white">Descartáveis</p></button><button onClick={() => {setFormData({...formData, cupType: 'glass'}); setCurrentStep(prev => prev + 1);}} className="p-10 rounded-2xl border-2 border-white/10 hover:border-brand-gold hover:bg-white/5 transition-all group flex flex-col items-center gap-4"><Wine className="w-12 h-12 text-gray-400 group-hover:text-brand-gold" /><p className="font-bold uppercase tracking-widest text-sm text-white">Taças de Vidro</p></button></div></QuestionWrapper>;
      case 'glassQuantity': return <QuestionWrapper title="Quantidade de Taças?"><div className="relative"><Wine className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gold"/><input autoFocus type="number" placeholder="Ex: 200" value={formData.glassQuantity} onChange={e => setFormData({...formData, glassQuantity: e.target.value})} onKeyDown={e => e.key === 'Enter' && formData.glassQuantity && handleNext()} className="w-full bg-brand-graphite border border-white/10 rounded-xl p-5 pl-14 text-white focus:border-brand-gold focus:outline-none text-lg"/></div>{renderContinueButton(!formData.glassQuantity)}</QuestionWrapper>;
      case 'planType': return <QuestionWrapper title="Escolha o Plano:"><div className="grid grid-cols-1 gap-4">{PLAN_TYPES.map(p => (<button key={p.id} onClick={() => {setFormData({...formData, planType: p.id}); handleNext();}} className="flex items-center gap-4 p-6 rounded-xl border-2 border-white/10 hover:border-brand-gold transition-all"><p.icon className="w-8 h-8 text-brand-gold"/><span className="font-bold uppercase tracking-widest">{p.name}</span></button>))}</div></QuestionWrapper>;
      case 'caipiFlavors': return <QuestionWrapper title="Escolha 3 frutas (Caipi):" subtitle="Selecione exatamente 3"><div className="grid grid-cols-2 md:grid-cols-3 gap-3">{appData.caipiFlavors.map(f => (<button key={f} onClick={() => {const active = formData.caipiFlavors.includes(f); if (active) setFormData({...formData, caipiFlavors: formData.caipiFlavors.filter(x => x !== f)}); else if (formData.caipiFlavors.length < 3) setFormData({...formData, caipiFlavors: [...formData.caipiFlavors, f]});}} className={`p-4 rounded-lg border-2 font-bold uppercase text-[10px] transition-all ${formData.caipiFlavors.includes(f) ? 'bg-brand-gold border-brand-gold text-brand-richBlack' : 'bg-brand-graphite border-white/10 text-gray-400 hover:border-brand-gold/30'}`}>{f}</button>))}</div><button onClick={handleNext} disabled={formData.caipiFlavors.length !== 3} className="w-full mt-6 p-4 bg-brand-gold text-brand-richBlack font-bold rounded-xl disabled:opacity-30">Confirmar Frutas</button></QuestionWrapper>;
      case 'frozenFlavors': return <QuestionWrapper title="Escolha 2 Frozens:" subtitle="Selecione exatamente 2"><div className="grid grid-cols-2 md:grid-cols-3 gap-3">{appData.frozenFlavors.map(f => (<button key={f} onClick={() => {const active = formData.frozenFlavors.includes(f); if (active) setFormData({...formData, frozenFlavors: formData.frozenFlavors.filter(x => x !== f)}); else if (formData.frozenFlavors.length < 2) setFormData({...formData, frozenFlavors: [...formData.frozenFlavors, f]});}} className={`p-4 rounded-lg border-2 font-bold uppercase text-[10px] transition-all ${formData.frozenFlavors.includes(f) ? 'bg-brand-gold border-brand-gold text-brand-richBlack' : 'bg-brand-graphite border-white/10 text-gray-400 hover:border-brand-gold/30'}`}>{f}</button>))}</div><button onClick={handleNext} disabled={formData.frozenFlavors.length !== 2} className="w-full mt-6 p-4 bg-brand-gold text-brand-richBlack font-bold rounded-xl disabled:opacity-30">Confirmar Frozens</button></QuestionWrapper>;
      case 'specialDrinks': return <QuestionWrapper title="Drinks Especiais (Opcional):" subtitle="Selecione os que desejar"><div className="grid grid-cols-1 gap-3">{specialDrinksList.map(d => {const selected = formData.specialDrinks.find(s => s.id === d.id); return (<button key={d.id} onClick={() => selected ? setFormData({...formData, specialDrinks: formData.specialDrinks.filter(s => s.id !== d.id)}) : setFormData({...formData, specialDrinks: [...formData.specialDrinks, {id: d.id, name: d.name}]})} className={`p-5 rounded-xl border-2 flex justify-between items-center transition-all ${selected ? 'bg-brand-gold border-brand-gold text-brand-richBlack font-bold' : 'bg-brand-graphite border-white/10 text-white'}`}><span>{d.name}</span>{selected && <CheckCircle2 className="w-5 h-5"/>}</button>);})}</div><button onClick={handleNext} className="w-full mt-6 p-4 bg-brand-gold text-brand-richBlack font-bold rounded-xl">Ver Resumo</button></QuestionWrapper>;
      case 'labels': return (
        <QuestionWrapper title="Rótulos Premium?">
          <div className="space-y-6">
            {Object.entries(LABELS_CONFIG).map(([key, labels]) => (
              <div key={key} className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">{key}</label>
                <div className="grid grid-cols-2 gap-2">
                  {labels.map(l => {
                    const active = formData.labels[key as keyof typeof formData.labels].includes(l.name);
                    return (
                      <button 
                        key={l.id} 
                        onClick={() => toggleLabel(key, l.name)}
                        className={`p-4 rounded-xl border-2 text-[10px] font-bold uppercase transition-all ${active ? 'bg-brand-gold border-brand-gold text-brand-richBlack' : 'bg-brand-graphite border-white/10 text-gray-400'}`}
                      >
                        {l.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleNext} className="w-full mt-6 p-4 bg-brand-gold text-brand-richBlack font-bold rounded-xl uppercase tracking-widest">Finalizar Escolhas</button>
        </QuestionWrapper>
      );
      case 'summary': return (
        <div className="max-w-xl mx-auto bg-brand-graphite rounded-[40px] border border-brand-gold/30 overflow-hidden shadow-2xl animate-fade-in mb-12">
          <div className="bg-brand-gold p-10 text-brand-richBlack text-center"><h2 className="text-3xl font-cinzel font-bold uppercase">Estimativa Final</h2></div>
          <div className="p-10 space-y-8">
            <div className="text-center py-6 border-b border-white/5">
              <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold">Investimento Total</p>
              <h3 className="text-5xl font-cinzel font-bold text-white mt-2">R$ {totalBudget.toLocaleString('pt-BR')}</h3>
            </div>
            <div className="space-y-3 text-xs text-gray-400 font-medium">
               <p className="flex justify-between"><span>Plano Selecionado:</span> <span className="text-white uppercase">{PLAN_TYPES.find(p=>p.id===formData.planType)?.name}</span></p>
               <p className="flex justify-between"><span>Total de Convidados:</span> <span className="text-white font-bold">{formData.guests} Pessoas</span></p>
               <p className="flex justify-between"><span>Tipo de Serviço:</span> <span className="text-white font-bold">{formData.cupType === 'glass' ? 'Cristais (Vidro)' : 'Descartáveis High-End'}</span></p>
            </div>
            <button onClick={handleNext} disabled={isSubmitting} className="w-full py-6 bg-brand-gold text-brand-richBlack font-bold uppercase tracking-[0.3em] rounded-2xl hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-3">
              {isSubmitting ? <Loader2 className="animate-spin" /> : <>Solicitar no WhatsApp <Sparkles className="w-5 h-5"/></>}
            </button>
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
        <div className="flex-grow text-center font-cinzel font-bold text-brand-gold tracking-widest uppercase text-xs">BIRIBAR EVENT PLANNER</div>
      </header>
      <div className="h-1 bg-white/5"><div className="h-full bg-brand-gold transition-all duration-700" style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}/></div>
      <main className="flex-grow flex items-center justify-center p-6"><div className="w-full max-w-3xl">{renderQuestion()}</div></main>
    </div>
  );
};

export default QuotePage;
