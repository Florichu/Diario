import React from 'react';
import { Clock, Play, FileText, ExternalLink, Trash2, Edit2 } from 'lucide-react';
import { Activity } from '../types';
import { extractYouTubeId, normalizeUrl } from '../utils/date';

interface TaskItemProps {
  activity: Activity;
  status?: 'si' | 'no';
  onStatusChange: (status: 'si' | 'no') => void;
  onDelete: () => void;
  onEdit?: () => void;
  onOpenMedia: (media: { url?: string; fileId?: string; fileName?: string; title: string }) => void;
  showStatusButtons?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  activity,
  status,
  onStatusChange,
  onDelete,
  onEdit,
  onOpenMedia,
  showStatusButtons = true,
}) => {
  const isYes = status === 'si';
  const isNo = status === 'no';
  const ytId = extractYouTubeId(activity.url);

  return (
    <div
      className={`p-3 rounded-2xl border transition-all duration-200 ${
        isYes
          ? 'bg-emerald-50/80 border-emerald-300 shadow-xs'
          : isNo
          ? 'bg-rose-50/80 border-rose-300 shadow-xs'
          : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-sm font-bold tracking-tight ${
                isYes ? 'text-emerald-950 line-through' : isNo ? 'text-rose-950' : 'text-slate-800'
              }`}
            >
              {activity.title}
            </span>
            {activity.time && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                <Clock className="w-2.5 h-2.5" />
                {activity.time}
              </span>
            )}
          </div>

          {/* Attachments pills */}
          {(activity.url || activity.fileId) && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {ytId && (
                <button
                  type="button"
                  onClick={() =>
                    onOpenMedia({
                      url: activity.url,
                      title: activity.title,
                    })
                  }
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-[10px] font-bold border border-red-200 active:scale-95 transition"
                >
                  <Play className="w-2.5 h-2.5 fill-red-700" />
                  <span>Ver YouTube</span>
                </button>
              )}

              {activity.url && !ytId && (
                <a
                  href={normalizeUrl(activity.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-sky-100 text-sky-800 hover:bg-sky-200 text-[10px] font-bold border border-sky-200 active:scale-95 transition"
                >
                  <ExternalLink className="w-2.5 h-2.5" />
                  <span>Abrir Enlace</span>
                </a>
              )}

              {activity.fileId && (
                <button
                  type="button"
                  onClick={() =>
                    onOpenMedia({
                      fileId: activity.fileId!,
                      fileName: activity.fileName,
                      title: activity.title,
                    })
                  }
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 text-[10px] font-bold border border-amber-200 active:scale-95 transition"
                >
                  <FileText className="w-2.5 h-2.5" />
                  <span className="truncate max-w-[120px]">{activity.fileName || 'Documento'}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0 pt-0.5">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:scale-95 transition"
              title="Editar actividad"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 active:scale-95 transition"
            title="Eliminar actividad"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SÍ / NO Big Buttons for Mobile Touch ergonomics */}
      {showStatusButtons && (
        <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-slate-100/80">
          <button
            type="button"
            onClick={() => onStatusChange('si')}
            className={`py-1.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1 transition active:scale-95 ${
              isYes
                ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30 ring-2 ring-emerald-500'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-emerald-50/50'
            }`}
          >
            <span>✓</span> SÍ
          </button>
          <button
            type="button"
            onClick={() => onStatusChange('no')}
            className={`py-1.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1 transition active:scale-95 ${
              isNo
                ? 'bg-rose-600 text-white shadow-xs shadow-rose-600/30 ring-2 ring-rose-500'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-rose-50/50'
            }`}
          >
            <span>✕</span> NO
          </button>
        </div>
      )}
    </div>
  );
};
