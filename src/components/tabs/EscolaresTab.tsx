import React, { useState } from 'react';
import { GraduationCap, Plus, Clock, Link as LinkIcon, Paperclip, Check, Edit2, Trash2 } from 'lucide-react';
import { Activity } from '../../types';
import { formatHumanDate } from '../../utils/date';
import { TaskItem } from '../TaskItem';

interface EscolaresTabProps {
  selectedDate: string;
  activities: Activity[];
  onAddActivity: (title: string, time?: string, url?: string, file?: File) => void;
  onUpdateActivity: (id: string, title: string, time?: string, url?: string) => void;
  onDeleteActivity: (id: string) => void;
  onOpenMedia: (media: { url?: string; fileId?: string; fileName?: string; title: string }) => void;
}

export const EscolaresTab: React.FC<EscolaresTabProps> = ({
  selectedDate,
  activities,
  onAddActivity,
  onUpdateActivity,
  onDeleteActivity,
  onOpenMedia,
}) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editUrl, setEditUrl] = useState('');

  const escolares = activities.filter((a) => a.category === 'escolar');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddActivity(title.trim(), time, url.trim(), file || undefined);
    setTitle('');
    setTime('');
    setUrl('');
    setFile(null);
  };

  const startEdit = (act: Activity) => {
    setEditingId(act.id);
    setEditTitle(act.title);
    setEditTime(act.time || '');
    setEditUrl(act.url || '');
  };

  const saveEdit = (id: string) => {
    if (!editTitle.trim()) return;
    onUpdateActivity(id, editTitle.trim(), editTime, editUrl.trim());
    setEditingId(null);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg">
            🎓
          </div>
          <div>
            <h2 className="text-sm font-extrabold">Actividades Escolares</h2>
            <p className="text-xs text-blue-100">
              Exclusivas del <span className="underline font-semibold">{formatHumanDate(selectedDate)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Add Form */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2.5">
          + Añadir Tarea Escolar a esta Fecha
        </h3>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Ej: Estudiar Tema 3, Hacer resumen..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="px-2.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              title="Hora sugerida (opcional)"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="🔗 URL YouTube, web o app (opcional)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
            <label className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer active:scale-95 transition">
              <Paperclip className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate max-w-[140px]">
                {file ? file.name : 'Subir PDF / Vídeo'}
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,video/*,image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-xs active:scale-95 transition flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Guardar en esta fecha</span>
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Listado ({escolares.length})
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">{selectedDate}</span>
        </div>

        {escolares.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No tienes actividades escolares anotadas para este día.
          </div>
        ) : (
          <div className="space-y-2">
            {escolares.map((act) => {
              if (editingId === act.id) {
                return (
                  <div
                    key={act.id}
                    className="p-3 rounded-2xl border-2 border-blue-400 bg-blue-50/50 space-y-2"
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
                      />
                      <input
                        type="time"
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        className="px-2 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="URL"
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-lg"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => saveEdit(act.id)}
                        className="px-3 py-1 text-xs font-bold bg-blue-600 text-white rounded-lg shadow-xs"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <TaskItem
                  key={act.id}
                  activity={act}
                  showStatusButtons={false}
                  onStatusChange={() => {}}
                  onDelete={() => onDeleteActivity(act.id)}
                  onEdit={() => startEdit(act)}
                  onOpenMedia={onOpenMedia}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
