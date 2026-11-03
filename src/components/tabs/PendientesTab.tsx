import React, { useState } from 'react';
import { Pin, Plus, Check, Trash2, Edit2, Sparkles, CheckCircle2 } from 'lucide-react';
import { PendingItem } from '../../types';

interface PendientesTabProps {
  pendings: PendingItem[];
  onAddPending: (title: string) => void;
  onTogglePending: (id: string) => void;
  onUpdatePending: (id: string, title: string) => void;
  onDeletePending: (id: string) => void;
  onClearCompleted: () => void;
}

export const PendientesTab: React.FC<PendientesTabProps> = ({
  pendings,
  onAddPending,
  onTogglePending,
  onUpdatePending,
  onDeletePending,
  onClearCompleted,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const uncompletedCount = pendings.filter((p) => !p.done).length;
  const completedCount = pendings.length - uncompletedCount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddPending(newTitle.trim());
    setNewTitle('');
  };

  const startEdit = (item: PendingItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
  };

  const saveEdit = (id: string) => {
    if (!editTitle.trim()) return;
    onUpdatePending(id, editTitle.trim());
    setEditingId(null);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg">
              📌
            </div>
            <div>
              <h2 className="text-sm font-extrabold">Acciones Pendientes</h2>
              <p className="text-xs text-amber-100">
                Imprevistos y asuntos urgentes por resolver
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black">{uncompletedCount}</span>
            <span className="text-[10px] uppercase font-bold text-amber-100 block leading-none">
              Por hacer
            </span>
          </div>
        </div>
      </div>

      {/* Add Form */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            required
            placeholder="Ej: Comprar cartulina, Llamar al médico..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 px-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-xs active:scale-95 transition flex items-center gap-1 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Añadir</span>
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Lista de Pendientes ({pendings.length})
          </span>
          {completedCount > 0 && (
            <button
              onClick={onClearCompleted}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 active:scale-95 transition"
            >
              🧹 Limpiar realizadas ({completedCount})
            </button>
          )}
        </div>

        {pendings.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs space-y-1">
            <p className="text-2xl">🎉</p>
            <p className="font-semibold text-slate-600">No tienes acciones pendientes</p>
            <p className="text-[11px]">¡Todo al día! Añade tareas urgentes arriba.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {pendings.map((item) => {
              if (editingId === item.id) {
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl border-2 border-amber-400 bg-amber-50/50 space-y-2"
                  >
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-lg"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => saveEdit(item.id)}
                        className="px-3 py-1 text-xs font-bold bg-amber-600 text-white rounded-lg shadow-xs"
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
                      onChange={() => onTogglePending(item.id)}
                      className="w-5 h-5 rounded-md accent-emerald-600 cursor-pointer shrink-0"
                    />
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-bold truncate ${
                          item.done ? 'line-through text-slate-400' : 'text-slate-800'
                        }`}
                      >
                        {item.title}
                      </p>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {item.done ? '✓ Realizada' : '⏳ Pendiente'} • {item.createdAt}
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
                      onClick={() => onDeletePending(item.id)}
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
