import React from 'react';
import {
  FolderOpen,
  CalendarDays,
  Sparkles,
  RefreshCw,
  Download,
  Upload,
  X,
  ShieldCheck,
} from 'lucide-react';
import { TabType } from '../types';

interface MoreMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  recursosCount: number;
  onExportBackup: () => void;
  onImportBackup: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MoreMenuDrawer: React.FC<MoreMenuDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  recursosCount,
  onExportBackup,
  onImportBackup,
}) => {
  if (!isOpen) return null;

  const moreItems = [
    {
      id: 'recursos' as TabType,
      label: 'Archivos y Vídeos',
      desc: 'Biblioteca PDF, Word DOCX, vídeos locales y enlaces YouTube',
      icon: FolderOpen,
      iconBg: 'bg-amber-100 text-amber-700',
      badge: recursosCount,
    },
    {
      id: 'calendario' as TabType,
      label: 'Calendario Mensual',
      desc: 'Visualiza días con cumplimiento y programa actividades futuras',
      icon: CalendarDays,
      iconBg: 'bg-indigo-100 text-indigo-700',
    },
    {
      id: 'gemini' as TabType,
      label: 'Asistente Gemini IA',
      desc: 'Tutor personal, análisis de rendimiento y generador inteligente',
      icon: Sparkles,
      iconBg: 'bg-purple-100 text-purple-700',
    },
    {
      id: 'sincronizar' as TabType,
      label: 'Sincronizar Dispositivos',
      desc: 'Pasa tus datos al instante por código, WhatsApp o archivo',
      icon: RefreshCw,
      iconBg: 'bg-sky-100 text-sky-700',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-md mx-auto bg-white rounded-t-3xl shadow-2xl p-4 max-h-[85vh] overflow-y-auto pb-safe animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-3" />

        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
              📂
            </div>
            <h2 className="text-base font-extrabold text-slate-900">Más Secciones y Herramientas</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="space-y-2">
          {moreItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left border transition active:scale-[0.98] ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 shadow-xs'
                    : 'border-slate-100 bg-slate-50/80 hover:bg-slate-100/80'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 truncate">{item.label}</span>
                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Backup Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Copia de Seguridad Offline</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onExportBackup}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs active:scale-95 transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Descargar .json</span>
            </button>
            <label className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs cursor-pointer active:scale-95 transition">
              <Upload className="w-3.5 h-3.5 text-indigo-600" />
              <span>Restaurar .json</span>
              <input
                type="file"
                accept=".json"
                onChange={onImportBackup}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
