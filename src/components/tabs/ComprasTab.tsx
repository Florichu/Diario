import React, { useState } from 'react';
import { ShoppingCart, Plus, Trash2, Edit2, Check } from 'lucide-react';
import { ShoppingItem } from '../../types';

interface ComprasTabProps {
  shoppingList: ShoppingItem[];
  onAddShopping: (title: string, qty?: string) => void;
  onToggleShopping: (id: string) => void;
  onUpdateShopping: (id: string, title: string, qty?: string) => void;
  onDeleteShopping: (id: string) => void;
  onClearCompleted: () => void;
}

export const ComprasTab: React.FC<ComprasTabProps> = ({
  shoppingList,
  onAddShopping,
  onToggleShopping,
  onUpdateShopping,
  onDeleteShopping,
  onClearCompleted,
}) => {
  const [title, setTitle] = useState('');
  const [qty, setQty] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editQty, setEditQty] = useState('');

  const uncompletedCount = shoppingList.filter((s) => !s.done).length;
  const completedCount = shoppingList.length - uncompletedCount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddShopping(title.trim(), qty.trim());
    setTitle('');
    setQty('');
  };

  const startEdit = (item: ShoppingItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditQty(item.qty || '');
  };

  const saveEdit = (id: string) => {
    if (!editTitle.trim()) return;
    onUpdateShopping(id, editTitle.trim(), editQty.trim());
    setEditingId(null);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white p-4 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg">
              🛒
            </div>
            <div>
              <h2 className="text-sm font-extrabold">Lista de Compras</h2>
              <p className="text-xs text-emerald-100">
                Materiales, alimentos o artículos necesarios
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black">{uncompletedCount}</span>
            <span className="text-[10px] uppercase font-bold text-emerald-100 block leading-none">
              Por comprar
            </span>
          </div>
        </div>
      </div>

      {/* Add Form */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            required
            placeholder="Ej: Leche, Cuadernos, Pan, Detergente..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Cantidad / Nota (ej: 2L, pack)"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="w-32 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs active:scale-95 transition flex items-center justify-center gap-1 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir</span>
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Artículos ({shoppingList.length})
          </span>
          {completedCount > 0 && (
            <button
              onClick={onClearCompleted}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 active:scale-95 transition"
            >
              🧹 Limpiar comprados ({completedCount})
            </button>
          )}
        </div>

        {shoppingList.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs space-y-1">
            <p className="text-2xl">🛒</p>
            <p className="font-semibold text-slate-600">Tu lista de compras está vacía</p>
            <p className="text-[11px]">Añade artículos arriba para no olvidar nada.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {shoppingList.map((item) => {
              if (editingId === item.id) {
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl border-2 border-emerald-400 bg-emerald-50/50 space-y-2"
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
                      />
                      <input
                        type="text"
                        value={editQty}
                        onChange={(e) => setEditQty(e.target.value)}
                        placeholder="Cantidad"
                        className="w-28 px-2 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-lg"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => saveEdit(item.id)}
                        className="px-3 py-1 text-xs font-bold bg-emerald-600 text-white rounded-lg shadow-xs"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    item.done
                      ? 'bg-emerald-50/60 border-emerald-200/80 text-slate-400'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <label className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => onToggleShopping(item.id)}
                      className="w-5 h-5 rounded-md accent-emerald-600 cursor-pointer shrink-0"
                    />
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-bold truncate ${
                          item.done ? 'line-through text-slate-400' : 'text-slate-800'
                        }`}
                      >
                        {item.title}
                        {item.qty && (
                          <span className="ml-1.5 px-1.5 py-0.2 rounded-md bg-slate-100 text-indigo-700 font-extrabold text-[10px]">
                            {item.qty}
                          </span>
                        )}
                      </p>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {item.done ? '✓ Comprado' : '🛒 Pendiente'}
                      </span>
                    </div>
                  </label>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button
                      onClick={() => startEdit(item)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg active:scale-95"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteShopping(item.id)}
                      className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg active:scale-95"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
