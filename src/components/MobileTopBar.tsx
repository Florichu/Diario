import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2, Download, WifiOff } from 'lucide-react';
import { formatHumanDate, formatShortDate, getLocalTodayStr, offsetDate } from '../utils/date';
import { DailyAnimal } from '../types';

interface MobileTopBarProps {
  selectedDate: string;
  onDateChange: (newDate: string) => void;
  isOnline: boolean;
  isInstallable: boolean;
  onInstallClick: () => void;
  animal: DailyAnimal;
  animalPhotoUrl?: string;
  onOpenAnimalModal: () => void;
}

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  selectedDate,
  onDateChange,
  isOnline,
  isInstallable,
  onInstallClick,
  animal,
  animalPhotoUrl,
  onOpenAnimalModal,
}) => {
  const isToday = selectedDate === getLocalTodayStr();
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handlePrevDay = () => onDateChange(offsetDate(selectedDate, -1));
  const handleNextDay = () => onDateChange(offsetDate(selectedDate, 1));
  const handleGoToday = () => onDateChange(getLocalTodayStr());

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs pt-safe">
      <div className="max-w-md mx-auto px-3 py-2.5 flex flex-col gap-2">
        {/* Top row: Brand & Status & Animal avatar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-sm shadow-sm shadow-indigo-500/30">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-slate-900 tracking-tight leading-none">
                Control Diario
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  100% Offline
                </span>
                {!isOnline && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    <WifiOff className="w-2.5 h-2.5" /> Sin Red
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {isInstallable && (
              <button
                onClick={onInstallClick}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-xs border border-indigo-200 active:scale-95 transition"
                title="Instalar App en el Móvil"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Instalar</span>
              </button>
            )}

            {/* Animal thumbnail */}
            <button
              onClick={onOpenAnimalModal}
              className="relative w-8 h-8 rounded-full ring-2 ring-indigo-500/20 overflow-hidden bg-slate-100 flex items-center justify-center active:scale-95 transition shadow-xs"
              title={`Animal del día: ${animal.name}. Pulsa para ver`}
            >
              {animalPhotoUrl ? (
                <img
                  src={animalPhotoUrl}
                  alt={animal.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to emoji
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
              ) : null}
              <span className="text-base leading-none select-none">{animal.emoji}</span>
            </button>
          </div>
        </div>

        {/* Bottom row: Day Switcher Bar */}
        <div className="flex items-center justify-between bg-slate-100/90 rounded-xl p-1 border border-slate-200/80">
          <button
            onClick={handlePrevDay}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-700 shadow-xs active:bg-slate-200 active:scale-95 transition"
            aria-label="Día anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Date Picker Trigger */}
          <div className="relative flex-1 px-2 text-center">
            <button
              onClick={() => dateInputRef.current?.showPicker?.() || dateInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-1.5 py-1 text-xs font-bold text-slate-800 hover:text-indigo-600 transition"
            >
              <CalendarIcon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="truncate capitalize">{formatShortDate(selectedDate)}</span>
              {isToday && (
                <span className="px-1.5 py-0.2 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-extrabold shrink-0">
                  Hoy
                </span>
              )}
            </button>
            <input
              ref={dateInputRef}
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && onDateChange(e.target.value)}
              className="absolute inset-0 opacity-0 pointer-events-none w-full h-full cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-1">
            {!isToday && (
              <button
                onClick={handleGoToday}
                className="px-2 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-xs active:scale-95 transition"
              >
                Hoy
              </button>
            )}
            <button
              onClick={handleNextDay}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-slate-700 shadow-xs active:bg-slate-200 active:scale-95 transition"
              aria-label="Día siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
