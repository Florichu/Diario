import React, { useState } from 'react';
import { RefreshCw, Copy, Share2, Download, Upload, ShieldCheck, AlertTriangle } from 'lucide-react';
import { ActivitiesByDate, DailyLogs, PendingItem, ShoppingItem, ResourceItem } from '../../types';

interface SincronizarTabProps {
  activitiesByDate: ActivitiesByDate;
  dailyLogs: DailyLogs;
  pendings: PendingItem[];
  shoppingList: ShoppingItem[];
  resources: ResourceItem[];
  onApplySyncCode: (rawCode: string, mode: 'merge' | 'replace') => boolean;
  onExportBackup: () => void;
  onImportBackup: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onShowToast: (msg: string, isError?: boolean) => void;
}

export const SincronizarTab: React.FC<SincronizarTabProps> = ({
  activitiesByDate,
  dailyLogs,
  pendings,
  shoppingList,
  resources,
  onApplySyncCode,
  onExportBackup,
  onImportBackup,
  onShowToast,
}) => {
  const [inputCode, setInputCode] = useState('');

  // Generate Base64 sync code
  const getGeneratedCode = () => {
    try {
      const payload = {
        activitiesByDate,
        dailyLogs,
        pendingActions: pendings,
        shoppingList,
        resourcesList: resources,
        updatedAt: new Date().toISOString(),
      };
      return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
    } catch {
      return '';
    }
  };

  const handleCopyCode = () => {
    const code = getGeneratedCode();
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code).then(() => {
        onShowToast('Código copiado. Envíatelo a tu otro móvil');
      });
    } else {
      onShowToast('Copia manual lista');
    }
  };

  const handleShareDirect = async () => {
    const code = getGeneratedCode();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Sincronización Control Diario',
          text: code,
        });
      } catch (e) {
        // User cancelled
      }
    } else {
      handleCopyCode();
    }
  };

  const handleApply = (mode: 'merge' | 'replace') => {
    if (!inputCode.trim()) {
      onShowToast('Pega primero el código en el recuadro', true);
      return;
    }
    const success = onApplySyncCode(inputCode.trim(), mode);
    if (success) {
      setInputCode('');
    }
  };

  const syncCode = getGeneratedCode();

  return (
    <div className="space-y-4 pb-20">
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-600 to-teal-700 text-white p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg">
            🔄
          </div>
          <div>
            <h2 className="text-sm font-extrabold">Sincronizar Dispositivos</h2>
            <p className="text-xs text-sky-100">
              Pasa tus datos al instante de tu móvil al PC, tablet o viceversa
            </p>
          </div>
        </div>
      </div>

      {/* 1. Enviar desde este móvil */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
            ⚡
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-900">
              1. Enviar desde este móvil
            </h3>
            <p className="text-[11px] text-slate-500">
              Copia o comparte tu código a través de WhatsApp, Telegram o Correo.
            </p>
          </div>
        </div>

        <textarea
          readOnly
          value={syncCode}
          rows={3}
          className="w-full p-2.5 text-[11px] font-mono rounded-xl border border-slate-200 bg-slate-50 text-slate-600 resize-none focus:outline-none"
        />

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleCopyCode}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow-xs active:scale-95 transition"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copiar Código</span>
          </button>
          <button
            onClick={handleShareDirect}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs active:scale-95 transition"
          >
            <Share2 className="w-3.5 h-3.5 text-sky-600" />
            <span>Compartir</span>
          </button>
        </div>
      </div>

      {/* 2. Recibir en este móvil */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
            📥
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-900">
              2. Recibir código de otro aparato
            </h3>
            <p className="text-[11px] text-slate-500">
              Pega aquí el código que enviaste desde tu otro dispositivo.
            </p>
          </div>
        </div>

        <textarea
          placeholder="Pega aquí el código de sincronización..."
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          rows={3}
          className="w-full p-2.5 text-[11px] font-mono rounded-xl border border-slate-300 bg-white text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => handleApply('merge')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-xs active:scale-95 transition"
            title="Combina los datos de ambos dispositivos sin borrar nada"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>🔄 Fusionar Datos (Recomendado)</span>
          </button>
          <button
            onClick={() => handleApply('replace')}
            className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 active:scale-95 transition"
            title="Sustituye todo lo actual por el código pegado"
          >
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            <span>Sobrescribir todo</span>
          </button>
        </div>
      </div>

      {/* 3. Copia en Archivo Google Drive / iCloud */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <div>
            <h3 className="text-xs font-extrabold text-slate-900">
              Copia en Archivo (.json)
            </h3>
            <p className="text-[11px] text-slate-500">
              Guarda el archivo en tu carpeta de Google Drive, iCloud o WhatsApp para restaurarlo cuando quieras.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={onExportBackup}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs active:scale-95 transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Exportar .json</span>
          </button>

          <label className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs cursor-pointer active:scale-95 transition border border-indigo-200">
            <Upload className="w-3.5 h-3.5 text-indigo-600" />
            <span>Importar .json</span>
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
  );
};
