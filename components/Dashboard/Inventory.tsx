
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Package, Save, DollarSign, Edit2, X, Check } from 'lucide-react';
import { db, InventoryItem } from '../../db';

const UNITS = ['un', 'kg', 'l'] as const;

const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<InventoryItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id'>>({
    name: '',
    category: 'Insumo',
    unit: 'l',
    packageSize: 1,
    cost: 0
  });

  useEffect(() => {
    setItems(db.get().inventory);
  }, []);

  const startEditing = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleSaveEdit = () => {
    if (editForm && editingId) {
      const updatedItems = items.map(item => item.id === editingId ? editForm : item);
      setItems(updatedItems);
      db.updateInventoryItem(editingId, editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleAddItem = () => {
    if (!newItem.name) return alert('Por favor, insira o nome do insumo.');
    if (newItem.packageSize <= 0) return alert('O tamanho da embalagem deve ser maior que zero.');
    
    const item: InventoryItem = { ...newItem, id: 'inv-' + Date.now() };
    const updatedItems = [...items, item];
    setItems(updatedItems);
    db.addInventoryItem(item);
    setIsAdding(false);
    setNewItem({ name: '', category: 'Insumo', unit: 'l', packageSize: 1, cost: 0 });
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este insumo? Isso afetará o cálculo de custos de drinks.')) {
      const updatedItems = items.filter(item => item.id !== id);
      setItems(updatedItems);
      db.deleteInventoryItem(id);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-cinzel font-bold text-white">Tabela de Custos</h2>
          <p className="text-gray-500 mt-1">Configure o preço e tamanho das embalagens para cálculo de dose.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-3 bg-brand-gold text-brand-richBlack rounded-lg font-bold flex items-center gap-2 hover:bg-white transition-all shadow-xl"
        >
          <Plus className="w-5 h-5" /> Novo Insumo
        </button>
      </div>

      {isAdding && (
        <div className="bg-brand-graphite p-6 rounded-xl border border-brand-gold/30 grid grid-cols-1 md:grid-cols-5 gap-4 items-end animate-fade-in shadow-2xl">
          <div className="md:col-span-2 space-y-1">
            <label className="text-[10px] uppercase font-bold text-gray-500">Nome do Insumo</label>
            <input type="text" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full bg-brand-richBlack border border-white/10 rounded p-2 text-white text-sm focus:border-brand-gold outline-none" placeholder="Ex: Gin Tanqueray"/>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-gray-500">Unidade Base</label>
            <select value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value as any})} className="w-full bg-brand-richBlack border border-white/10 rounded p-2 text-white text-sm">
              {UNITS.map(u => <option key={u} value={u}>{u.toUpperCase()}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-gray-500">Tamanho da Emb. (L/Kg)</label>
            <input type="number" step="0.001" value={newItem.packageSize} onChange={e => setNewItem({...newItem, packageSize: Number(e.target.value)})} className="w-full bg-brand-richBlack border border-white/10 rounded p-2 text-white text-sm"/>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-gray-500">Custo da Emb. (R$)</label>
            <div className="flex gap-2">
              <input type="number" value={newItem.cost} onChange={e => setNewItem({...newItem, cost: Number(e.target.value)})} className="w-full bg-brand-richBlack border border-white/10 rounded p-2 text-white text-sm"/>
              <button onClick={handleAddItem} className="p-2 bg-brand-gold text-brand-richBlack rounded hover:bg-white transition-colors"><Save className="w-5 h-5"/></button>
              <button onClick={() => setIsAdding(false)} className="p-2 bg-white/5 text-gray-400 rounded hover:text-white transition-colors"><X className="w-5 h-5"/></button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-brand-graphite rounded-xl border border-white/5 overflow-hidden shadow-2xl">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-white/5 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
              <th className="px-6 py-4">Insumo</th>
              <th className="px-6 py-4">Unidade</th>
              <th className="px-6 py-4">Tamanho Emb.</th>
              <th className="px-6 py-4">Preço Emb.</th>
              <th className="px-6 py-4">Preço por L/Kg</th>
              <th className="px-6 py-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {items.map((item) => (
              <tr key={item.id} className={`transition-colors group ${editingId === item.id ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'}`}>
                {editingId === item.id && editForm ? (
                  <>
                    <td className="px-6 py-3"><input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-brand-richBlack border border-brand-gold rounded px-3 py-2 text-white text-xs"/></td>
                    <td className="px-6 py-3">
                      <select value={editForm.unit} onChange={e => setEditForm({...editForm, unit: e.target.value as any})} className="w-full bg-brand-richBlack border border-brand-gold rounded px-3 py-2 text-white text-xs">
                        {UNITS.map(u => <option key={u} value={u}>{u.toUpperCase()}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-3"><input type="number" step="0.001" value={editForm.packageSize} onChange={e => setEditForm({...editForm, packageSize: Number(e.target.value)})} className="w-full bg-brand-richBlack border border-brand-gold rounded px-3 py-2 text-white text-xs"/></td>
                    <td className="px-6 py-3"><input type="number" value={editForm.cost} onChange={e => setEditForm({...editForm, cost: Number(e.target.value)})} className="w-full bg-brand-richBlack border border-brand-gold rounded px-3 py-2 text-white text-xs"/></td>
                    <td className="px-6 py-3 text-gray-500 italic">-</td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={handleSaveEdit} className="p-2 bg-brand-gold text-brand-richBlack rounded-lg hover:bg-white"><Check className="w-4 h-4" /></button>
                        <button onClick={cancelEditing} className="p-2 bg-white/5 text-gray-400 rounded-lg hover:text-white"><X className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-brand-richBlack flex items-center justify-center text-brand-gold"><Package className="w-4 h-4" /></div>
                        <span className="text-white font-medium">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 uppercase text-[10px] tracking-widest text-gray-400">{item.unit}</td>
                    <td className="px-6 py-5 text-gray-300 font-mono">
                      {item.packageSize} {item.unit === 'un' ? 'un' : item.unit}
                    </td>
                    <td className="px-6 py-5 text-white font-bold">R$ {item.cost.toFixed(2)}</td>
                    <td className="px-6 py-5">
                      <span className="text-brand-gold font-bold">
                        R$ {(item.cost / item.packageSize).toFixed(2)}/{item.unit}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => startEditing(item)} className="text-gray-500 hover:text-brand-gold"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteItem(item.id)} className="text-gray-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
