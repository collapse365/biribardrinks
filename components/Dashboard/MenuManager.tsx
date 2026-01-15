
import React, { useState, useEffect } from 'react';
import { Wine, Plus, Trash2, Edit3, ChevronRight, Eye, EyeOff, X, LayoutGrid, Image as ImageIcon, Check, Utensils, GlassWater, IceCream, Upload, ShieldCheck, ShieldAlert, Droplets } from 'lucide-react';
import { db, Drink, InventoryItem, DrinkIngredient, DrinkCategory } from '../../db';

const MenuManager: React.FC = () => {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [caipiFlavors, setCaipiFlavors] = useState<string[]>([]);
  const [frozenFlavors, setFrozenFlavors] = useState<string[]>([]);
  const [editingDrink, setEditingDrink] = useState<Drink | null>(null);

  // States para adição de sabores inline
  const [addingCaipi, setAddingCaipi] = useState(false);
  const [addingFrozen, setAddingFrozen] = useState(false);
  const [newFlavorText, setNewFlavorText] = useState('');

  useEffect(() => {
    const data = db.get();
    setDrinks(data.drinks || []);
    setInventory(data.inventory || []);
    setCaipiFlavors(data.caipiFlavors || []);
    setFrozenFlavors(data.frozenFlavors || []);
  }, []);

  const handleSaveDrink = () => {
    if (editingDrink) {
      let newDrinks;
      const exists = drinks.find(d => d.id === editingDrink.id);
      if (exists) {
        newDrinks = drinks.map(d => d.id === editingDrink.id ? editingDrink : d);
      } else {
        newDrinks = [...drinks, editingDrink];
      }
      setDrinks(newDrinks);
      db.updateDrinks(newDrinks);
      setEditingDrink(null);
    }
  };

  const handleDeleteDrink = (id: string) => {
    if (confirm('Excluir este drink permanentemente?')) {
      const newDrinks = drinks.filter(d => d.id !== id);
      setDrinks(newDrinks);
      db.deleteDrink(id);
    }
  };

  const toggleSpecial = (id: string) => {
    const newDrinks = drinks.map(d => d.id === id ? { ...d, isSpecial: !d.isSpecial } : d);
    setDrinks(newDrinks);
    db.updateDrinks(newDrinks);
  };

  const calculateDrinkCost = (ingredients: DrinkIngredient[]) => {
    return ingredients.reduce((total, ing) => {
      const item = inventory.find(i => i.id === ing.inventoryItemId);
      if (!item || !item.packageSize) return total;
      const unitPrice = item.cost / item.packageSize;
      return total + (unitPrice * ing.amount);
    }, 0);
  };

  const handleAddFlavor = (listName: 'caipi' | 'frozen') => {
    if (!newFlavorText.trim()) return;

    const newList = listName === 'caipi' 
      ? [...caipiFlavors, newFlavorText.trim()] 
      : [...frozenFlavors, newFlavorText.trim()];

    if (listName === 'caipi') {
      setCaipiFlavors(newList);
      setAddingCaipi(false);
    } else {
      setFrozenFlavors(newList);
      setAddingFrozen(false);
    }

    db.updateQuoteConfig({ [listName === 'caipi' ? 'caipiFlavors' : 'frozenFlavors']: newList });
    setNewFlavorText('');
  };

  const removeFlavor = (listName: 'caipi' | 'frozen', index: number) => {
    const list = listName === 'caipi' ? caipiFlavors : frozenFlavors;
    const newList = list.filter((_, i) => i !== index);
    if (listName === 'caipi') setCaipiFlavors(newList); else setFrozenFlavors(newList);
    db.updateQuoteConfig({ [listName === 'caipi' ? 'caipiFlavors' : 'frozenFlavors']: newList });
  };

  const addIngredientToDrink = () => {
    if (editingDrink && inventory.length > 0) {
      const firstItem = inventory[0];
      const newIngredient: DrinkIngredient = { inventoryItemId: firstItem.id, amount: 0 };
      setEditingDrink({
        ...editingDrink,
        ingredients: [...editingDrink.ingredients, newIngredient]
      });
    }
  };

  const removeIngredientFromDrink = (index: number) => {
    if (editingDrink) {
      const newIngredients = editingDrink.ingredients.filter((_, i) => i !== index);
      setEditingDrink({ ...editingDrink, ingredients: newIngredients });
    }
  };

  const updateIngredientInDrink = (index: number, updates: Partial<DrinkIngredient>) => {
    if (editingDrink) {
      const newIngredients = editingDrink.ingredients.map((ing, i) => i === index ? { ...ing, ...updates } : ing);
      setEditingDrink({ ...editingDrink, ingredients: newIngredients });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingDrink) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingDrink({ ...editingDrink, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (editingDrink) {
    return (
      <div className="bg-brand-graphite p-8 rounded-2xl border border-brand-gold/20 space-y-8 max-w-5xl mx-auto shadow-2xl animate-fade-in">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-brand-gold" /> {editingDrink.name || 'Novo Drink'}
          </h3>
          <button onClick={() => setEditingDrink(null)} className="text-gray-500 hover:text-white uppercase text-[10px] font-bold">Cancelar</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2 lg:col-span-1">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Nome do Drink</label>
            <input type="text" value={editingDrink.name} onChange={e => setEditingDrink({...editingDrink, name: e.target.value})} className="w-full bg-brand-richBlack border border-white/10 rounded-xl p-4 text-white outline-none focus:border-brand-gold"/>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Categoria</label>
            <select value={editingDrink.category} onChange={e => setEditingDrink({...editingDrink, category: e.target.value as DrinkCategory})} className="w-full bg-brand-richBlack border border-white/10 rounded-xl p-4 text-white">
              <option value="Drink Especial">Drink Especial</option>
              <option value="Caipi Frutas">Caipi Frutas</option>
              <option value="Frozen">Frozen</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Opções</label>
            <div 
              onClick={() => setEditingDrink({...editingDrink, canBeNonAlcoholic: !editingDrink.canBeNonAlcoholic})}
              className="flex items-center gap-3 bg-brand-richBlack border border-white/10 rounded-xl p-4 cursor-pointer hover:border-brand-gold/50 transition-all group"
            >
              <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${editingDrink.canBeNonAlcoholic ? 'bg-brand-gold border-brand-gold shadow-[0_0_10px_rgba(250,204,21,0.3)]' : 'border-white/20'}`}>
                {editingDrink.canBeNonAlcoholic && <Check className="w-4 h-4 text-brand-richBlack stroke-[3px]" />}
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">Disponível Sem Álcool?</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Imagem (URL ou Upload)</label>
          <div className="flex gap-4">
            <div className="relative flex-grow">
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                placeholder="https://sua-imagem.com/drink.jpg"
                value={editingDrink.image || ''} 
                onChange={e => setEditingDrink({...editingDrink, image: e.target.value})}
                className="w-full bg-brand-richBlack border border-white/10 rounded-xl p-4 pl-12 text-white outline-none focus:border-brand-gold"
              />
            </div>
            <label className="cursor-pointer px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
              <Upload className="w-4 h-4" /> Upload
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>
          {editingDrink.image && (
            <div className="mt-4 relative w-32 h-32 rounded-xl overflow-hidden border border-brand-gold/20">
              <img src={editingDrink.image} className="w-full h-full object-cover" />
              <button 
                onClick={() => setEditingDrink({...editingDrink, image: ''})} 
                className="absolute top-1 right-1 bg-brand-richBlack/80 p-1 rounded-full text-red-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs uppercase font-bold text-gray-500 tracking-[0.2em]">Receita (Dose em L ou Kg)</h4>
            <button onClick={addIngredientToDrink} className="text-brand-gold text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><Plus className="w-3 h-3" /> Adicionar Dose</button>
          </div>
          <div className="space-y-3">
            {editingDrink.ingredients.map((ing, idx) => {
              const item = inventory.find(i => i.id === ing.inventoryItemId);
              return (
                <div key={idx} className="flex gap-4 items-center">
                  <select value={ing.inventoryItemId} onChange={e => updateIngredientInDrink(idx, { inventoryItemId: e.target.value })} className="flex-grow bg-brand-richBlack border border-white/5 rounded-xl p-4 text-white text-sm">
                    {inventory.map(i => <option key={i.id} value={i.id}>{i.name} (Emb. {i.packageSize}{i.unit})</option>)}
                  </select>
                  <div className="w-40 relative">
                    <input type="number" step="0.001" value={ing.amount} onChange={e => updateIngredientInDrink(idx, { amount: Number(e.target.value) })} className="w-full bg-brand-richBlack border border-white/5 rounded-xl p-4 text-white text-sm pr-12"/>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-gray-500 font-bold uppercase">{item?.unit}</span>
                  </div>
                  <button onClick={() => removeIngredientFromDrink(idx)} className="p-4 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-5 h-5" /></button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Custo de Produção / Dose</p>
            <p className="text-4xl font-cinzel font-bold text-brand-gold">R$ {calculateDrinkCost(editingDrink.ingredients).toFixed(2)}</p>
          </div>
          <button onClick={handleSaveDrink} className="w-full md:w-auto px-12 py-5 bg-brand-gold text-brand-richBlack font-bold uppercase tracking-widest rounded-2xl shadow-xl hover:scale-105 transition-all">Salvar Drink</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      <div>
        <h2 className="text-3xl font-cinzel font-bold text-white">Cardápio & Bar</h2>
        <p className="text-gray-500 mt-1">Gestão unificada de receitas, frutas de caipirinha e sabores frozen.</p>
      </div>

      {/* Seção 1: Drinks Especiais */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 pb-2 border-b border-white/5">
          <Wine className="w-5 h-5 text-brand-gold" />
          <h3 className="text-xl font-cinzel font-bold text-white uppercase tracking-widest">Drinks & Especiais</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {drinks.map(drink => (
            <div key={drink.id} className="bg-brand-graphite rounded-3xl border border-white/5 overflow-hidden hover:border-brand-gold/30 transition-all group flex flex-col shadow-2xl">
              <div className="h-48 relative overflow-hidden bg-brand-richBlack">
                {drink.image ? <img src={drink.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" /> : <div className="w-full h-full flex items-center justify-center opacity-20"><Wine className="w-16 h-16" /></div>}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button onClick={() => toggleSpecial(drink.id)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest backdrop-blur-md transition-all ${drink.isSpecial ? 'bg-brand-gold text-brand-richBlack' : 'bg-brand-richBlack/60 text-gray-400 border border-white/10'}`}>
                    {drink.isSpecial ? <><Eye className="w-3 h-3" /> No Site</> : <><EyeOff className="w-3 h-3" /> Oculto</>}
                  </button>
                  {drink.canBeNonAlcoholic && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-blue-500/20 text-blue-400 border border-blue-500/30 backdrop-blur-md">
                      <Droplets className="w-3 h-3" /> Zero Alc
                    </div>
                  )}
                </div>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-2xl font-cinzel font-bold text-white group-hover:text-brand-gold transition-colors">{drink.name}</h4>
                    <p className="text-[9px] uppercase font-bold text-gray-600 tracking-widest mt-1">{drink.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingDrink(drink)} className="text-gray-500 hover:text-white"><Edit3 className="w-5 h-5" /></button>
                    <button onClick={() => handleDeleteDrink(drink.id)} className="text-gray-500 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </div>
                <div className="space-y-1.5 border-y border-white/5 py-4">
                  {drink.ingredients.map((ing, i) => {
                    const item = inventory.find(inv => inv.id === ing.inventoryItemId);
                    return <div key={i} className="flex justify-between text-[11px]"><span className="text-gray-400">• {item?.name}</span><span className="text-gray-500">{ing.amount}{item?.unit}</span></div>;
                  })}
                </div>
                <div className="pt-2">
                  <p className="text-[9px] uppercase text-gray-500 font-bold mb-1">Custo Dose</p>
                  <p className="text-3xl font-cinzel font-bold text-brand-gold">R$ {calculateDrinkCost(drink.ingredients).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => setEditingDrink({ id: 'd-'+Date.now(), name: '', category: 'Drink Especial', ingredients: [], isSpecial: false, canBeNonAlcoholic: false })} className="h-[480px] bg-brand-richBlack border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-gray-600 hover:border-brand-gold/30 hover:text-brand-gold transition-all gap-4 group">
            <Plus className="w-10 h-10 group-hover:scale-125 transition-transform" />
            <span className="font-bold uppercase tracking-widest text-xs">Novo Drink</span>
          </button>
        </div>
      </section>

      {/* Seção 2: Caipirinhas e Frozens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Frutas Caipirinha */}
        <section className="bg-brand-graphite p-8 rounded-3xl border border-white/5 space-y-6 flex flex-col shadow-2xl">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <GlassWater className="w-5 h-5 text-brand-gold" />
              <h3 className="text-sm font-cinzel font-bold text-white uppercase tracking-widest">Frutas Caipirinha</h3>
            </div>
            {!addingCaipi ? (
              <button 
                onClick={() => { setAddingCaipi(true); setAddingFrozen(false); setNewFlavorText(''); }} 
                className="text-brand-gold text-[10px] font-bold hover:text-white transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Adicionar
              </button>
            ) : (
              <button onClick={() => setAddingCaipi(false)} className="text-gray-500 text-[10px] font-bold hover:text-white transition-colors">Cancelar</button>
            )}
          </div>

          {addingCaipi && (
            <div className="flex gap-2 animate-fade-in">
              <input 
                autoFocus
                type="text" 
                placeholder="Nome do sabor..."
                value={newFlavorText}
                onChange={(e) => setNewFlavorText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddFlavor('caipi')}
                className="flex-grow bg-brand-richBlack border border-brand-gold/50 rounded-lg px-4 py-2 text-xs text-white outline-none focus:border-brand-gold"
              />
              <button 
                onClick={() => handleAddFlavor('caipi')}
                className="p-2 bg-brand-gold text-brand-richBlack rounded-lg hover:bg-white transition-all"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {caipiFlavors.map((f, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-brand-richBlack rounded-xl border border-white/5 text-xs group">
                <span className="text-gray-300 font-medium">{f}</span>
                <button onClick={() => removeFlavor('caipi', i)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/10 rounded-md">
                  <X className="w-3.5 h-3.5 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Sabores Frozen */}
        <section className="bg-brand-graphite p-8 rounded-3xl border border-white/5 space-y-6 flex flex-col shadow-2xl">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <IceCream className="w-5 h-5 text-brand-gold" />
              <h3 className="text-sm font-cinzel font-bold text-white uppercase tracking-widest">Sabores Frozen</h3>
            </div>
            {!addingFrozen ? (
              <button 
                onClick={() => { setAddingFrozen(true); setAddingCaipi(false); setNewFlavorText(''); }} 
                className="text-brand-gold text-[10px] font-bold hover:text-white transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Adicionar
              </button>
            ) : (
              <button onClick={() => setAddingFrozen(false)} className="text-gray-500 text-[10px] font-bold hover:text-white transition-colors">Cancelar</button>
            )}
          </div>

          {addingFrozen && (
            <div className="flex gap-2 animate-fade-in">
              <input 
                autoFocus
                type="text" 
                placeholder="Nome do sabor..."
                value={newFlavorText}
                onChange={(e) => setNewFlavorText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddFlavor('frozen')}
                className="flex-grow bg-brand-richBlack border border-brand-gold/50 rounded-lg px-4 py-2 text-xs text-white outline-none focus:border-brand-gold"
              />
              <button 
                onClick={() => handleAddFlavor('frozen')}
                className="p-2 bg-brand-gold text-brand-richBlack rounded-lg hover:bg-white transition-all"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {frozenFlavors.map((f, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-brand-richBlack rounded-xl border border-white/5 text-xs group">
                <span className="text-gray-300 font-medium">{f}</span>
                <button onClick={() => removeFlavor('frozen', i)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/10 rounded-md">
                  <X className="w-3.5 h-3.5 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MenuManager;
