import React, { useState } from 'react';
import {
  GraduationCap,
  Home,
  Plus,
  Copy,
  PieChart,
  Link as LinkIcon,
  Paperclip,
  Check,
  Sparkles,
} from 'lucide-react';
import { Activity, DailyAnimal, AnimalOverride } from '../../types';
import { AnimalHeroCard } from '../AnimalHeroCard';
import { DonutChart } from '../DonutChart';
import { TaskItem } from '../TaskItem';

interface CumplirTabProps {
  selectedDate: string;
  isToday: boolean;
  activities: Activity[];
  dailyLog: Record<string, 'si' | 'no'>;
  animal: DailyAnimal;
  animalPhotoUrl?: string;
  animalOverride?: AnimalOverride;
  onCycleAnimal: () => void;
  onUploadCustomPhoto: (file: File) => void;
  onStatusChange: (id: string, status: 'si' | 'no') => void;
  onDeleteActivity: (id: string) => void;
  onQuickAdd: (cat: 'escolar' | 'cotidiana', title: string, time?: string, url?: string, file?: File) => void;
  onCopyFromYesterday: () => void;
  onMarkAllYes: () => void;
  onResetDay: () => void;
  onOpenMedia: (media: { url?: string; fileId?: string; fileName?: string; title: string }) => void;
}

export const CumplirTab: React.FC<CumplirTabProps> = ({
  selectedDate,
  isToday,
  activities,
  dailyLog,
  animal,
  animalPhotoUrl,
  animalOverride,
  onCycleAnimal,
  onUploadCustomPhoto,
  onStatusChange,
  onDeleteActivity,
  onQuickAdd,
  onCopyFromYesterday,
  onMarkAllYes,
  onResetDay,
  onOpenMedia,
}) => {
  // Quick add states
  const [activeFormCat, setActiveFormCat] = useState<'escolar' | 'cotidiana' | null>(null);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickTime, setQuickTime] = useState('');
  const [quickUrl, setQuickUrl] = useState('');
  const [quickFile, setQuickFile] = useState<File | null>(null);
  const [showUrlField, setShowUrlField] = useState(false);

  const escolares = activities.filter((a) => a.category === 'escolar');
  const cotidianas = activities.filter((a) => a.category === 'cotidiana');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim() || !activeFormCat) return;
    onQuickAdd(activeFormCat, quickTitle.trim(), quickTime, quickUrl.trim(), quickFile || undefined);
    setQuickTitle('');
    setQuickTime('');
    setQuickUrl('');
    setQuickFile(null);
    setShowUrlField(false);
    setActiveFormCat(null);
  };

  const scrollToStats = () => {
    document.getElementById('stats-chart-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Animal del día hero banner */}
      <AnimalHeroCard
        animal={animal}
        photoUrl={animalPhotoUrl}
        override={animalOverride}
        selectedDate={selectedDate}
        onCycleAnimal={onCycleAnimal}
        onUploadCustomPhoto={onUploadCustomPhoto}
        isToday={isToday}
      />

      {/* Quick Day Actions Toolbar */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onCopyFromYesterday}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-xs active:scale-95 transition"
        >
          <Copy className="w-3.5 h-3.5 text-indigo-600" />
          <span>Copiar tareas de ayer</span>
        </button>

        <button
          type="button"
          onClick={scrollToStats}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-700 hover:bg-indigo-100 font-bold text-xs shadow-xs active:scale-95 transition"
        >
          <PieChart className="w-3.5 h-3.5 text-indigo-600" />
          <span>Ver Gráfica y Total</span>
        </button>
      </div>

      {/* Quick Add Bottom Sheet / Card */}
      {activeFormCat ? (
        <form
          onSubmit={handleFormSubmit}
          className="p-3.5 rounded-2xl bg-white border-2 border-indigo-500 shadow-md animate-fade-in space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-indigo-700 flex items-center gap-1">
              {activeFormCat === 'escolar' ? '🎓 Nueva Escolar' : '🏠 Nueva Cotidiana'}
            </span>
            <button
              type="button"
              onClick={() => setActiveFormCat(null)}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Cancelar
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              required
              autoFocus
              placeholder={activeFormCat === 'escolar' ? 'Ej: Repasar matemáticas...' : 'Ej: Rutina de estiramientos...'}
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
            <input
              type="time"
              value={quickTime}
              onChange={(e) => setQuickTime(e.target.value)}
              className="px-2 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          {/* Optional Attachments toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowUrlField(!showUrlField)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition ${
                showUrlField || quickUrl
                  ? 'bg-sky-50 text-sky-700 border-sky-300'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <LinkIcon className="w-3 h-3" />
              <span>URL / YouTube</span>
            </button>

            <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 cursor-pointer active:scale-95 transition">
              <Paperclip className="w-3 h-3 text-slate-500" />
              <span className="truncate max-w-[120px]">
                {quickFile ? quickFile.name : 'Adjuntar PDF / Vídeo'}
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,video/*,image/*"
                onChange={(e) => setQuickFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>

          {showUrlField && (
            <input
              type="text"
              placeholder="Pegar enlace (https://youtube.com/... o web)"
              value={quickUrl}
              onChange={(e) => setQuickUrl(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          )}

          <button
            type="submit"
            className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-xs active:scale-95 transition flex items-center justify-center gap-1"
          >
            <Check className="w-4 h-4" />
            <span>Guardar en este día</span>
          </button>
        </form>
      ) : null}

      {/* ESCOLARES SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 leading-none">
                Escolares de este día
              </h3>
              <span className="text-[10px] text-slate-400 font-medium">
                {escolares.length} actividades
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveFormCat('escolar')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs border border-blue-200 active:scale-95 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir</span>
          </button>
        </div>

        {escolares.length === 0 ? (
          <div className="text-center py-4 bg-slate-50/60 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
            No hay escolares para esta fecha.{' '}
            <button
              onClick={() => setActiveFormCat('escolar')}
              className="text-blue-600 font-bold hover:underline"
            >
              Añade una rápida
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {escolares.map((act) => (
              <TaskItem
                key={act.id}
                activity={act}
                status={dailyLog[act.id]}
                onStatusChange={(st) => onStatusChange(act.id, st)}
                onDelete={() => onDeleteActivity(act.id)}
                onOpenMedia={onOpenMedia}
              />
            ))}
          </div>
        )}
      </div>

      {/* COTIDIANAS SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-slate-900 leading-none">
                Cotidianas de este día
              </h3>
              <span className="text-[10px] text-slate-400 font-medium">
                {cotidianas.length} actividades
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveFormCat('cotidiana')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs border border-emerald-200 active:scale-95 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir</span>
          </button>
        </div>

        {cotidianas.length === 0 ? (
          <div className="text-center py-4 bg-slate-50/60 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
            No hay cotidianas para esta fecha.{' '}
            <button
              onClick={() => setActiveFormCat('cotidiana')}
              className="text-emerald-700 font-bold hover:underline"
            >
              Añade una rápida
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {cotidianas.map((act) => (
              <TaskItem
                key={act.id}
                activity={act}
                status={dailyLog[act.id]}
                onStatusChange={(st) => onStatusChange(act.id, st)}
                onDelete={() => onDeleteActivity(act.id)}
                onOpenMedia={onOpenMedia}
              />
            ))}
          </div>
        )}
      </div>

      {/* STATS SECTION */}
      <div id="stats-chart-section">
        <DonutChart
          activities={activities}
          dailyLog={dailyLog}
          onMarkAllYes={onMarkAllYes}
          onResetDay={onResetDay}
        />
      </div>
    </div>
  );
};
