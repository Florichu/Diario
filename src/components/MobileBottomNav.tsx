import React from 'react';
import {
  CheckSquare,
  GraduationCap,
  Home,
  Pin,
  ShoppingCart,
  MoreHorizontal,
} from 'lucide-react';
import { TabType } from '../types';

interface MobileBottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  escolaresCount: number;
  cotidianasCount: number;
  pendientesCount: number;
  comprasCount: number;
  onOpenMore: () => void;
  isMoreActive: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  escolaresCount,
  cotidianasCount,
  pendientesCount,
  comprasCount,
  onOpenMore,
  isMoreActive,
}) => {
  const tabs = [
    {
      id: 'cumplir' as TabType,
      label: 'Cumplir',
      icon: CheckSquare,
      badge: 0,
      badgeColor: '',
    },
    {
      id: 'escolares' as TabType,
      label: 'Escolares',
      icon: GraduationCap,
      badge: escolaresCount,
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      id: 'cotidianas' as TabType,
      label: 'Cotidianas',
      icon: Home,
      badge: cotidianasCount,
      badgeColor: 'bg-emerald-600 text-white',
    },
    {
      id: 'pendientes' as TabType,
      label: 'Pendientes',
      icon: Pin,
      badge: pendientesCount,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'compras' as TabType,
      label: 'Compras',
      icon: ShoppingCart,
      badge: comprasCount,
      badgeColor: 'bg-green-600 text-white',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-6 h-14 items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id && !isMoreActive;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center h-full py-1 active:scale-95 transition ${
                isActive ? 'text-indigo-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-indigo-600' : ''}`} />
                {tab.badge > 0 && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-extrabold flex items-center justify-center ${tab.badgeColor} shadow-xs ring-1 ring-white`}
                  >
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full px-0.5">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-indigo-600" />
              )}
            </button>
          );
        })}

        {/* More tab button */}
        <button
          onClick={onOpenMore}
          className={`relative flex flex-col items-center justify-center h-full py-1 active:scale-95 transition ${
            isMoreActive ? 'text-indigo-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <MoreHorizontal className={`w-5 h-5 transition-transform ${isMoreActive ? 'scale-110 text-indigo-600' : ''}`} />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-full px-0.5">
            Más
          </span>
          {isMoreActive && (
            <span className="absolute bottom-1 w-6 h-0.5 rounded-full bg-indigo-600" />
          )}
        </button>
      </div>
    </nav>
  );
};
