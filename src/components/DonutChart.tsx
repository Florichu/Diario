import React from 'react';
import { Activity, DailyLogs } from '../types';

interface DonutChartProps {
  activities: Activity[];
  dailyLog: Record<string, 'si' | 'no'>;
  onMarkAllYes: () => void;
  onResetDay: () => void;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  activities,
  dailyLog,
  onMarkAllYes,
  onResetDay,
}) => {
  const total = activities.length;
  const yesList = activities.filter((a) => dailyLog[a.id] === 'si');
  const noList = activities.filter((a) => dailyLog[a.id] === 'no');
  const pendingCount = total - yesList.length - noList.length;

  const yesPct = total > 0 ? Math.round((yesList.length / total) * 100) : 0;
  const noPct = total > 0 ? Math.round((noList.length / total) * 100) : 0;
  const pendingPct = total > 0 ? Math.max(0, 100 - yesPct - noPct) : 0;

  // Escolares breakdown
  const escAll = activities.filter((a) => a.category === 'escolar');
  const escYes = escAll.filter((a) => dailyLog[a.id] === 'si').length;
  const escNo = escAll.filter((a) => dailyLog[a.id] === 'no').length;
  const escYesPct = escAll.length > 0 ? Math.round((escYes / escAll.length) * 100) : 0;

  // Cotidianas breakdown
  const cotAll = activities.filter((a) => a.category === 'cotidiana');
  const cotYes = cotAll.filter((a) => dailyLog[a.id] === 'si').length;
  const cotNo = cotAll.filter((a) => dailyLog[a.id] === 'no').length;
  const cotYesPct = cotAll.length > 0 ? Math.round((cotYes / cotAll.length) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
            <span>📊</span> Resumen y Gráfica del Día
          </h3>
          <p className="text-[11px] text-slate-500">Porcentaje de éxito según tus respuestas</p>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onMarkAllYes}
            className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] border border-emerald-200 active:scale-95 transition"
          >
            Todo SÍ
          </button>
          <button
            type="button"
            onClick={onResetDay}
            className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-[11px] active:scale-95 transition"
          >
            Reiniciar
          </button>
        </div>
      </div>

      {/* 4 Stat Boxes */}
      <div className="grid grid-cols-4 gap-1.5 my-3">
        <div className="bg-slate-50 p-2 rounded-xl text-center border border-slate-100">
          <span className="text-[10px] font-bold text-slate-500 block truncate">Total</span>
          <span className="text-base font-extrabold text-slate-800">{total}</span>
        </div>
        <div className="bg-emerald-50 p-2 rounded-xl text-center border border-emerald-200/60">
          <span className="text-[10px] font-bold text-emerald-700 block truncate">✓ SÍ</span>
          <div className="flex items-baseline justify-center gap-0.5">
            <span className="text-base font-extrabold text-emerald-800">{yesList.length}</span>
            <span className="text-[10px] font-semibold text-emerald-600">({yesPct}%)</span>
          </div>
        </div>
        <div className="bg-rose-50 p-2 rounded-xl text-center border border-rose-200/60">
          <span className="text-[10px] font-bold text-rose-700 block truncate">✕ NO</span>
          <div className="flex items-baseline justify-center gap-0.5">
            <span className="text-base font-extrabold text-rose-800">{noList.length}</span>
            <span className="text-[10px] font-semibold text-rose-600">({noPct}%)</span>
          </div>
        </div>
        <div className="bg-amber-50 p-2 rounded-xl text-center border border-amber-200/60">
          <span className="text-[10px] font-bold text-amber-700 block truncate">⏳ Pend.</span>
          <div className="flex items-baseline justify-center gap-0.5">
            <span className="text-base font-extrabold text-amber-800">{pendingCount}</span>
            <span className="text-[10px] font-semibold text-amber-600">({pendingPct}%)</span>
          </div>
        </div>
      </div>

      {/* Donut Chart & Category Bars */}
      <div className="flex flex-col sm:flex-row items-center gap-4 py-2">
        {/* SVG Donut */}
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="15.9155"
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="3.6"
            />
            {/* NO Segment */}
            <circle
              cx="18"
              cy="18"
              r="15.9155"
              fill="transparent"
              stroke="#f43f5e"
              strokeWidth="3.6"
              strokeDasharray={`${noPct} ${100 - noPct}`}
              strokeDashoffset={String(-yesPct)}
              className="transition-all duration-500 ease-out"
            />
            {/* YES Segment */}
            <circle
              cx="18"
              cy="18"
              r="15.9155"
              fill="transparent"
              stroke="#10b981"
              strokeWidth="3.6"
              strokeDasharray={`${yesPct} ${100 - yesPct}`}
              strokeDashoffset="0"
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-2xl font-black text-slate-800 leading-none">{yesPct}%</span>
            <span className="text-[9px] font-bold uppercase text-slate-400 mt-0.5">Cumplido</span>
          </div>
        </div>

        {/* Breakdown bars */}
        <div className="w-full flex-1 space-y-3">
          {/* Legend */}
          <div className="flex items-center justify-center sm:justify-start gap-3 text-xs font-bold text-slate-600 pb-1">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>SÍ {yesPct}%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>NO {noPct}%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span>Pend. {pendingPct}%</span>
            </div>
          </div>

          {/* Escolares Progress */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span className="text-blue-700 flex items-center gap-1">🎓 Escolares</span>
              <span>{escYesPct}% ({escYes}/{escAll.length})</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${escYesPct}%` }}
                className="bg-blue-600 h-full transition-all duration-400"
              />
              <div
                style={{ width: `${escAll.length > 0 ? (escNo / escAll.length) * 100 : 0}%` }}
                className="bg-rose-500 h-full transition-all duration-400"
              />
            </div>
          </div>

          {/* Cotidianas Progress */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span className="text-emerald-700 flex items-center gap-1">🏠 Cotidianas</span>
              <span>{cotYesPct}% ({cotYes}/{cotAll.length})</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${cotYesPct}%` }}
                className="bg-emerald-600 h-full transition-all duration-400"
              />
              <div
                style={{ width: `${cotAll.length > 0 ? (cotNo / cotAll.length) * 100 : 0}%` }}
                className="bg-rose-500 h-full transition-all duration-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Details list accordion / cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 text-xs">
        <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200/50">
          <span className="font-extrabold text-emerald-800 block mb-1">
            ✓ Cumplidas ({yesList.length})
          </span>
          <ul className="space-y-1 max-h-24 overflow-y-auto pr-1">
            {yesList.length > 0 ? (
              yesList.map((a) => (
                <li key={a.id} className="text-emerald-950 font-medium truncate">
                  • {a.title}
                </li>
              ))
            ) : (
              <li className="text-emerald-600/70 italic text-[11px]">Ninguna marcada con SÍ</li>
            )}
          </ul>
        </div>

        <div className="bg-rose-50/70 p-2.5 rounded-xl border border-rose-200/50">
          <span className="font-extrabold text-rose-800 block mb-1">
            ✕ Incumplidas ({noList.length})
          </span>
          <ul className="space-y-1 max-h-24 overflow-y-auto pr-1">
            {noList.length > 0 ? (
              noList.map((a) => (
                <li key={a.id} className="text-rose-950 font-medium truncate">
                  • {a.title}
                </li>
              ))
            ) : (
              <li className="text-rose-600/70 italic text-[11px]">Ninguna marcada con NO</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
