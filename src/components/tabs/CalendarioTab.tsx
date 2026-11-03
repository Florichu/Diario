import React, { useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RotateCcw,
} from 'lucide-react';
import { ActivitiesByDate, DailyLogs } from '../../types';
import { getLocalTodayStr } from '../../utils/date';

interface CalendarioTabProps {
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  activitiesByDate: ActivitiesByDate;
  dailyLogs: DailyLogs;
}

export const CalendarioTab: React.FC<CalendarioTabProps> = ({
  selectedDate,
  onSelectDate,
  activitiesByDate,
  dailyLogs,
}) => {
  const [viewDate, setViewDate] = useState(() => {
    const parts = selectedDate.split('-').map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2] || 1);
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const todayStr = getLocalTodayStr();

  const changeMonth = (offset: number) => {
    setViewDate(new Date(year, month + offset, 1));
  };

  const changeYear = (offset: number) => {
    setViewDate(new Date(year + offset, month, 1));
  };

  const resetToToday = () => {
    setViewDate(new Date());
  };

  // Month title
  const monthTitle = viewDate.toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });

  // Calculate calendar days
  const firstDay = new Date(year, month, 1).getDay();
  const startOffset = (firstDay + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const emptyCells = Array.from({ length: startOffset });
  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="space-y-4 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white p-4 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold capitalize">{monthTitle}</h2>
            <p className="text-xs text-indigo-100">
              Toca un día para ver o planificar sus tareas exclusivas
            </p>
          </div>
          <button
            onClick={resetToToday}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs active:scale-95 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Hoy</span>
          </button>
        </div>

        {/* Month/Year fast controls */}
        <div className="flex items-center justify-between gap-1 mt-3 pt-2 border-t border-white/20">
          <div className="flex gap-1">
            <button
              onClick={() => changeYear(-1)}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-bold"
              title="Año anterior"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => changeMonth(-1)}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-bold"
              title="Mes anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-xs font-black tracking-wide uppercase">{monthTitle}</span>

          <div className="flex gap-1">
            <button
              onClick={() => changeMonth(1)}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-bold"
              title="Mes siguiente"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => changeYear(1)}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-bold"
              title="Año siguiente"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-xs">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-black uppercase text-slate-400 mb-2">
          <span>Lun</span>
          <span>Mar</span>
          <span>Mié</span>
          <span>Jue</span>
          <span>Vie</span>
          <span className="text-indigo-600">Sáb</span>
          <span className="text-indigo-600">Dom</span>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {emptyCells.map((_, idx) => (
            <div key={`empty-${idx}`} className="h-16 rounded-xl bg-slate-50/50" />
          ))}

          {dayNumbers.map((d) => {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;
            const dayActs = activitiesByDate[dateStr] || [];
            const dayLog = dailyLogs[dateStr] || {};
            const total = dayActs.length;
            const yesCount = dayActs.filter((a) => dayLog[a.id] === 'si').length;
            const hasAnswered = dayActs.some((a) => dayLog[a.id]);

            let pct = 0;
            let badgeBg = 'bg-slate-100 text-slate-600';
            if (total > 0) {
              pct = Math.round((yesCount / total) * 100);
              if (hasAnswered) {
                if (pct >= 75) badgeBg = 'bg-emerald-100 text-emerald-800 font-extrabold';
                else if (pct >= 40) badgeBg = 'bg-amber-100 text-amber-800 font-extrabold';
                else badgeBg = 'bg-rose-100 text-rose-800 font-extrabold';
              } else {
                badgeBg = 'bg-blue-50 text-blue-700';
              }
            }

            return (
              <button
                key={dateStr}
                onClick={() => onSelectDate(dateStr)}
                className={`h-16 p-1 rounded-xl border flex flex-col justify-between text-left transition active:scale-95 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center leading-none ${
                      isToday
                        ? 'bg-indigo-600 text-white'
                        : isSelected
                        ? 'text-indigo-700 font-black'
                        : 'text-slate-700'
                    }`}
                  >
                    {d}
                  </span>
                </div>

                {total > 0 && (
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded-md text-center truncate block w-full ${badgeBg}`}
                  >
                    {hasAnswered ? `${pct}%` : `${total} tar.`}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
