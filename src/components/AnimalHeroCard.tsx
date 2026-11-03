import React, { useState } from 'react';
import { RefreshCw, Camera, Sparkles, X } from 'lucide-react';
import { DailyAnimal, AnimalOverride } from '../types';
import { createOfflineAnimalSvg } from '../utils/animals';

interface AnimalHeroCardProps {
  animal: DailyAnimal;
  photoUrl?: string;
  override?: AnimalOverride;
  selectedDate: string;
  onCycleAnimal: () => void;
  onUploadCustomPhoto: (file: File) => void;
  isToday: boolean;
}

export const AnimalHeroCard: React.FC<AnimalHeroCardProps> = ({
  animal,
  photoUrl,
  override,
  onCycleAnimal,
  onUploadCustomPhoto,
  isToday,
}) => {
  const [showFullModal, setShowFullModal] = useState(false);
  const fallbackSvg = createOfflineAnimalSvg(animal.emoji, animal.bg);
  const [imgSrc, setImgSrc] = useState(photoUrl || animal.photo);

  // Sync if photo changes
  React.useEffect(() => {
    setImgSrc(photoUrl || animal.photo);
  }, [photoUrl, animal.photo]);

  const displayName = override?.customName || animal.name;

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white p-3.5 shadow-md shadow-indigo-600/20">
        {/* Subtle background glow */}
        <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          {/* Photo Thumbnail */}
          <div
            onClick={() => setShowFullModal(true)}
            className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-white/10 ring-2 ring-white/30 shadow-md cursor-pointer relative group flex items-center justify-center"
            title="Pulsa para ampliar foto"
          >
            <img
              src={imgSrc}
              alt={displayName}
              onError={() => setImgSrc(fallbackSvg)}
              className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition" />
            <span className="absolute bottom-0.5 right-0.5 text-xs drop-shadow-sm select-none">
              {animal.emoji}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-extrabold text-amber-300">
              <Sparkles className="w-3 h-3" />
              <span>Animal del día {isToday ? 'de hoy' : ''}</span>
            </div>
            <h3 className="text-sm font-extrabold text-white truncate leading-tight mt-0.5">
              {animal.emoji} {displayName}
            </h3>
            <p className="text-[11px] text-indigo-100 line-clamp-2 leading-tight mt-1 opacity-90">
              {animal.fact}
            </p>

            {/* Quick buttons */}
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={onCycleAnimal}
                className="inline-flex items-center gap-1 px-2 py-0.8 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold border border-white/20 active:scale-95 transition"
                title="Ver otro animal para este día"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                Cambiar
              </button>
              <label
                className="inline-flex items-center gap-1 px-2 py-0.8 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold border border-white/20 cursor-pointer active:scale-95 transition"
                title="Poner tu propia foto para este día"
              >
                <Camera className="w-2.5 h-2.5" />
                Subir foto
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onUploadCustomPhoto(f);
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Animal Fullscreen Preview Modal */}
      {showFullModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setShowFullModal(false)}
        >
          <div
            className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden p-4 text-white shadow-2xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{animal.emoji}</span>
                <h4 className="font-bold text-base">{displayName}</h4>
              </div>
              <button
                onClick={() => setShowFullModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-slate-950 mb-3 border border-slate-800 flex items-center justify-center">
              <img
                src={imgSrc}
                alt={displayName}
                onError={() => setImgSrc(fallbackSvg)}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
              💡 {animal.fact}
            </p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  onCycleAnimal();
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Cambiar Animal
              </button>
              <label className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700 transition active:scale-95">
                <Camera className="w-3.5 h-3.5" />
                Subir Foto
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      onUploadCustomPhoto(f);
                      setShowFullModal(false);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
