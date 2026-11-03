import React from 'react';
import { X, ExternalLink, Download } from 'lucide-react';
import { extractYouTubeId, normalizeUrl } from '../utils/date';

interface MediaViewerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url?: string;
  fileBlobUrl?: string;
  fileName?: string;
  mimeType?: string;
}

export const MediaViewer: React.FC<MediaViewerProps> = ({
  isOpen,
  onClose,
  title,
  url,
  fileBlobUrl,
  fileName,
  mimeType = '',
}) => {
  if (!isOpen) return null;

  const ytId = extractYouTubeId(url);
  const isPdf = mimeType.includes('pdf') || (fileName && fileName.toLowerCase().endsWith('.pdf'));
  const isVideo = mimeType.startsWith('video/') || (fileName && /\.(mp4|webm|mov|mkv)$/i.test(fileName));
  const isAudio = mimeType.startsWith('audio/') || (fileName && /\.(mp3|wav|ogg|m4a)$/i.test(fileName));
  const isImage = mimeType.startsWith('image/') || (fileName && /\.(png|jpe?g|gif|webp|svg)$/i.test(fileName));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col w-full max-w-xl max-h-[92vh] bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800/90 border-b border-slate-700">
          <div className="flex items-center gap-2 truncate pr-2">
            <span className="text-xl">
              {ytId ? '▶️' : isPdf ? '📄' : isVideo ? '🎬' : '📎'}
            </span>
            <h3 className="text-sm font-bold text-white truncate">{title || fileName || 'Visor Multimedia'}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-slate-700 active:scale-95 transition"
            aria-label="Cerrar visor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto bg-slate-950 flex flex-col items-center justify-center min-h-[300px]">
          {ytId ? (
            <div className="w-full aspect-video">
              <iframe
                className="w-full h-full border-0"
                src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : isPdf && fileBlobUrl ? (
            <iframe
              src={fileBlobUrl}
              className="w-full h-[65vh] border-0 bg-white"
              title={fileName || 'Documento PDF'}
            />
          ) : isVideo && fileBlobUrl ? (
            <video
              src={fileBlobUrl}
              controls
              autoPlay
              playsInline
              className="max-w-full max-h-[65vh] object-contain"
            />
          ) : isAudio && fileBlobUrl ? (
            <div className="p-8 w-full flex flex-col items-center">
              <div className="text-4xl mb-4">🎵</div>
              <p className="text-white font-medium mb-4 text-center">{fileName}</p>
              <audio src={fileBlobUrl} controls autoPlay className="w-full max-w-md" />
            </div>
          ) : isImage && fileBlobUrl ? (
            <img
              src={fileBlobUrl}
              alt={fileName || 'Imagen'}
              className="max-w-full max-h-[65vh] object-contain p-2"
            />
          ) : url ? (
            <div className="p-8 text-center text-slate-300">
              <p className="mb-4 text-sm font-medium">Enlace externo o aplicación:</p>
              <a
                href={normalizeUrl(url)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 active:scale-95 transition shadow-lg shadow-indigo-600/30"
              >
                <ExternalLink className="w-4 h-4" />
                Abrir enlace en navegador
              </a>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-300">
              <p className="mb-4 text-sm font-medium">Documento preparado para abrir en tu dispositivo:</p>
              {fileBlobUrl && (
                <a
                  href={fileBlobUrl}
                  download={fileName || 'documento'}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 active:scale-95 transition shadow-lg shadow-blue-600/30"
                >
                  <Download className="w-4 h-4" />
                  Descargar / Abrir {fileName}
                </a>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-t border-slate-800 text-xs text-slate-400">
          <span className="truncate">{fileName || url || ''}</span>
          {fileBlobUrl && (
            <a
              href={fileBlobUrl}
              download={fileName || 'archivo'}
              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold px-2 py-1 rounded-lg"
            >
              <Download className="w-3.5 h-3.5" />
              Guardar archivo
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
