import React, { useState } from 'react';
import {
  FolderOpen,
  Plus,
  Play,
  FileText,
  ExternalLink,
  Trash2,
  Calendar,
  Layers,
  Paperclip,
  Check,
} from 'lucide-react';
import { ResourceItem } from '../../types';
import { extractYouTubeId, formatHumanDate, normalizeUrl } from '../../utils/date';

interface RecursosTabProps {
  selectedDate: string;
  resources: ResourceItem[];
  onAddFileResource: (title: string, file: File, scope: 'general' | 'day') => void;
  onAddUrlResource: (title: string, url: string, scope: 'general' | 'day') => void;
  onDeleteResource: (id: string) => void;
  onOpenMedia: (media: { url?: string; fileId?: string; fileName?: string; title: string }) => void;
}

export const RecursosTab: React.FC<RecursosTabProps> = ({
  selectedDate,
  resources,
  onAddFileResource,
  onAddUrlResource,
  onDeleteResource,
  onOpenMedia,
}) => {
  const [filter, setFilter] = useState<'all' | 'day' | 'general'>('all');
  const [activeTabSub, setActiveTabSub] = useState<'file' | 'url'>('file');

  // File Form state
  const [fileTitle, setFileTitle] = useState('');
  const [fileScope, setFileScope] = useState<'general' | 'day'>('general');
  const [fileObj, setFileObj] = useState<File | null>(null);

  // URL Form state
  const [urlTitle, setUrlTitle] = useState('');
  const [urlVal, setUrlVal] = useState('');
  const [urlScope, setUrlScope] = useState<'general' | 'day'>('general');

  const handleFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileTitle.trim() || !fileObj) return;
    onAddFileResource(fileTitle.trim(), fileObj, fileScope);
    setFileTitle('');
    setFileObj(null);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlTitle.trim() || !urlVal.trim()) return;
    onAddUrlResource(urlTitle.trim(), urlVal.trim(), urlScope);
    setUrlTitle('');
    setUrlVal('');
  };

  const filteredResources = resources.filter((r) => {
    if (filter === 'day') return r.scope === 'day' && r.dateStr === selectedDate;
    if (filter === 'general') return r.scope === 'general';
    return r.scope === 'general' || r.dateStr === selectedDate;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-700 text-white p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg">
            📚
          </div>
          <div>
            <h2 className="text-sm font-extrabold">Biblioteca y Multimedia</h2>
            <p className="text-xs text-amber-100">
              PDFs, apuntes Word (.docx), vídeos y enlaces de YouTube
            </p>
          </div>
        </div>
      </div>

      {/* Add Resources Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        {/* Toggle file or url */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTabSub('file')}
            className={`py-1.5 text-xs font-bold rounded-lg transition ${
              activeTabSub === 'file' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            📂 1. Subir Archivo Local
          </button>
          <button
            type="button"
            onClick={() => setActiveTabSub('url')}
            className={`py-1.5 text-xs font-bold rounded-lg transition ${
              activeTabSub === 'url' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            ▶️ 2. Vídeo YouTube / URL
          </button>
        </div>

        {activeTabSub === 'file' ? (
          <form onSubmit={handleFileSubmit} className="space-y-2.5">
            <input
              type="text"
              required
              placeholder="Título del documento (Ej: Tema 1 Derecho, Rutina.mp4)"
              value={fileTitle}
              onChange={(e) => setFileTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <label className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs cursor-pointer active:scale-95 transition">
                <Paperclip className="w-3.5 h-3.5 text-amber-700" />
                <span className="truncate max-w-[200px]">
                  {fileObj ? fileObj.name : 'Seleccionar PDF, Word DOCX o Vídeo'}
                </span>
                <input
                  type="file"
                  required
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,video/*,audio/*,image/*"
                  onChange={(e) => setFileObj(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>

              <select
                value={fileScope}
                onChange={(e) => setFileScope(e.target.value as any)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:outline-none"
              >
                <option value="general">📌 Biblioteca General</option>
                <option value="day">📅 Solo día seleccionado</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-xs active:scale-95 transition flex items-center justify-center gap-1"
            >
              <Check className="w-4 h-4" />
              <span>Guardar en el almacenamiento offline</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleUrlSubmit} className="space-y-2.5">
            <input
              type="text"
              required
              placeholder="Título del enlace (Ej: Clase explicativa YouTube)"
              value={urlTitle}
              onChange={(e) => setUrlTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                required
                placeholder="https://www.youtube.com/watch?v=... o enlace..."
                value={urlVal}
                onChange={(e) => setUrlVal(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
              />
              <select
                value={urlScope}
                onChange={(e) => setUrlScope(e.target.value as any)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:outline-none"
              >
                <option value="general">📌 Biblioteca General</option>
                <option value="day">📅 Solo día seleccionado</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-xs active:scale-95 transition flex items-center justify-center gap-1"
            >
              <Check className="w-4 h-4" />
              <span>Guardar Vídeo / Enlace</span>
            </button>
          </form>
        )}
      </div>

      {/* Filter and Resources List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Documentos Guardados ({filteredResources.length})
          </span>

          <div className="flex gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('day')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                filter === 'day'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              De este día
            </button>
            <button
              onClick={() => setFilter('general')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                filter === 'general'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              General
            </button>
          </div>
        </div>

        {filteredResources.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No hay recursos ni vídeos guardados con este filtro.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredResources.map((item) => {
              const ytId = extractYouTubeId(item.url);
              return (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white transition space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {item.title}
                        </span>
                        {item.scope === 'general' ? (
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-indigo-100 text-indigo-700">
                            📌 General
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-amber-100 text-amber-700">
                            📅 {item.dateStr}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Añadido: {item.createdAt}
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteResource(item.id)}
                      className="p-1.5 text-rose-400 hover:text-rose-600 rounded-lg active:scale-95"
                      title="Eliminar recurso"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Open Buttons */}
                  <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100">
                    {ytId && (
                      <button
                        onClick={() =>
                          onOpenMedia({
                            url: item.url,
                            title: item.title,
                          })
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-xs font-bold border border-red-200 active:scale-95 transition"
                      >
                        <Play className="w-3 h-3 fill-red-700" />
                        <span>Ver YouTube integrado</span>
                      </button>
                    )}

                    {item.url && !ytId && (
                      <a
                        href={normalizeUrl(item.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 hover:bg-sky-200 text-xs font-bold border border-sky-200 active:scale-95 transition"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Abrir enlace</span>
                      </a>
                    )}

                    {item.fileId && (
                      <button
                        onClick={() =>
                          onOpenMedia({
                            fileId: item.fileId!,
                            fileName: item.fileName,
                            title: item.title,
                          })
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 text-xs font-bold border border-amber-200 active:scale-95 transition"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Abrir {item.fileName || 'archivo'}</span>
                      </button>
                    )}
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
