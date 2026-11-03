import React, { useState } from 'react';
import { Sparkles, Send, Key, Eye, EyeOff, Check, Plus, Clock, AlertCircle } from 'lucide-react';
import { Activity, PendingItem } from '../../types';

interface GeminiTabProps {
  selectedDate: string;
  activities: Activity[];
  dailyLog: Record<string, 'si' | 'no'>;
  pendings: PendingItem[];
  onAddSuggestedActivity: (title: string, category: 'escolar' | 'cotidiana', time?: string) => void;
  onAddSuggestedPending: (title: string) => void;
  userApiKey: string;
  onSaveApiKey: (key: string) => void;
  onShowToast: (msg: string, isError?: boolean) => void;
}

export const GeminiTab: React.FC<GeminiTabProps> = ({
  selectedDate,
  activities,
  dailyLog,
  pendings,
  onAddSuggestedActivity,
  onAddSuggestedPending,
  userApiKey,
  onSaveApiKey,
  onShowToast,
}) => {
  const [apiKey, setApiKey] = useState(userApiKey);
  const [showKey, setShowKey] = useState(false);

  // States for actions
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const [goal, setGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedTasks, setSuggestedTasks] = useState<Array<{ title: string; category: string; time?: string }>>([]);

  const [chatPrompt, setChatPrompt] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const [chatResult, setChatResult] = useState<string | null>(null);

  const handleKeySave = (val: string) => {
    setApiKey(val);
    onSaveApiKey(val);
  };

  // Helper to call backend or direct
  const callServerGemini = async (endpoint: string, body: any) => {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, customKey: apiKey }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Error ${res.status}`);
    }
    return res.json();
  };

  // 1. Analyze Day
  const handleAnalyzeDay = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    const cumplidas = activities.filter((a) => dailyLog[a.id] === 'si').map((a) => a.title);
    const incumplidas = activities.filter((a) => dailyLog[a.id] === 'no').map((a) => a.title);
    const sinMarcar = activities.filter((a) => !dailyLog[a.id]).map((a) => a.title);
    const pendUrgent = pendings.filter((p) => !p.done).map((p) => p.title);

    try {
      const data = await callServerGemini('/api/gemini/analyze', {
        dateStr: selectedDate,
        cumplidas,
        incumplidas,
        sinMarcar,
        pendientes: pendUrgent,
      });
      setAnalysisResult(data.reply);
      onShowToast('¡Análisis completado por Gemini!');
    } catch (err: any) {
      setAnalysisResult(
        `⚠️ No se pudo conectar con el servicio de IA (${err.message || 'Error de conexión'}). Comprueba tu conexión a internet o ingresa tu clave API personal arriba si ejecutas la app descargada.`
      );
      onShowToast('Error al conectar con Gemini', true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 2. Suggest Tasks
  const handleSuggestTasks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setIsGenerating(true);
    setSuggestedTasks([]);

    try {
      const data = await callServerGemini('/api/gemini/suggest-tasks', { goal: goal.trim() });
      if (Array.isArray(data.tasks)) {
        setSuggestedTasks(data.tasks);
        onShowToast(`Gemini generó ${data.tasks.length} actividades`);
      }
    } catch (err: any) {
      onShowToast('Error al generar tareas con Gemini', true);
    } finally {
      setIsGenerating(false);
    }
  };

  // 3. Free Chat
  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatPrompt.trim()) return;

    setIsChatting(true);
    setChatResult(null);

    try {
      const data = await callServerGemini('/api/gemini/chat', { question: chatPrompt.trim() });
      setChatResult(data.reply);
      setChatPrompt('');
    } catch (err: any) {
      setChatResult(`⚠️ Error: ${err.message || 'No se pudo contactar con Gemini.'}`);
    } finally {
      setIsChatting(false);
    }
  };

  const handleAddGeneratedTask = (t: { title: string; category: string; time?: string }) => {
    const cat = (t.category || '').toLowerCase();
    if (cat.includes('pendiente')) {
      onAddSuggestedPending(t.title);
      onShowToast('Añadida a Acciones Pendientes');
    } else {
      const finalCat = cat.includes('escolar') ? 'escolar' : 'cotidiana';
      onAddSuggestedActivity(t.title, finalCat, t.time);
      onShowToast(`Añadida como ${finalCat} al día ${selectedDate}`);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-indigo-800 text-white p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg">
            ✨
          </div>
          <div>
            <h2 className="text-sm font-extrabold">Tu Entrenador Gemini IA</h2>
            <p className="text-xs text-purple-100">
              Análisis de rendimiento, generador inteligente y tutor escolar
            </p>
          </div>
        </div>
      </div>

      {/* API Key Optional Configuration */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Key className="w-3.5 h-3.5 text-purple-600" />
            <span>Clave Gemini API (Opcional)</span>
          </div>
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="text-[11px] font-bold text-indigo-600 flex items-center gap-0.5"
          >
            {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            <span>{showKey ? 'Ocultar' : 'Mostrar'}</span>
          </button>
        </div>
        <p className="text-[11px] text-slate-500 mb-2 leading-tight">
          En la vista previa funciona automáticamente con la clave del servidor. Si usas la app descargada en tu móvil, puedes ingresar aquí tu clave gratuita de Google AI Studio.
        </p>
        <input
          type={showKey ? 'text' : 'password'}
          placeholder="AIzaSy... (opcional)"
          value={apiKey}
          onChange={(e) => handleKeySave(e.target.value)}
          className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* 1. Daily Performance Analysis */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          <div>
            <h3 className="text-xs font-extrabold text-slate-900">
              Analizar mi Rendimiento de Hoy
            </h3>
            <p className="text-[11px] text-slate-500">
              Gemini evaluará tus aciertos, pendientes y te dará un plan motivacional.
            </p>
          </div>
        </div>

        <button
          onClick={handleAnalyzeDay}
          disabled={isAnalyzing}
          className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-extrabold text-xs shadow-xs active:scale-95 transition flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isAnalyzing ? 'Analizando con Gemini...' : 'Analizar mi día'}</span>
        </button>

        {analysisResult && (
          <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-slate-800 leading-relaxed whitespace-pre-line animate-fade-in">
            {analysisResult}
          </div>
        )}
      </div>

      {/* 2. Suggest Tasks from Goal */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🪄</span>
          <div>
            <h3 className="text-xs font-extrabold text-slate-900">
              Crear Actividades con IA
            </h3>
            <p className="text-[11px] text-slate-500">
              Dile tu meta o examen y Gemini la dividirá en pasos con horario.
            </p>
          </div>
        </div>

        <form onSubmit={handleSuggestTasks} className="flex gap-2">
          <input
            type="text"
            required
            placeholder="Ej: Tengo examen de física y debo ordenar mi mesa..."
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
          />
          <button
            type="submit"
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-extrabold text-xs shadow-xs active:scale-95 transition shrink-0"
          >
            {isGenerating ? 'Generando...' : 'Crear'}
          </button>
        </form>

        {suggestedTasks.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-100 animate-fade-in">
            <span className="text-[11px] font-bold text-slate-600 block">
              Actividades propuestas para el {selectedDate}:
            </span>
            {suggestedTasks.map((t, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 gap-2"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{t.title}</p>
                  <span className="text-[10px] text-slate-500">
                    {t.category} {t.time ? `• 🕒 ${t.time}` : ''}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddGeneratedTask(t)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-extrabold border border-emerald-200 active:scale-95 transition shrink-0 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Añadir</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Free Question Chat */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">💬</span>
          <div>
            <h3 className="text-xs font-extrabold text-slate-900">
              Pregunta lo que sea a Gemini
            </h3>
            <p className="text-[11px] text-slate-500">
              Dudas de clase, resúmenes, fórmulas o consejos de estudio.
            </p>
          </div>
        </div>

        <form onSubmit={handleChat} className="flex gap-2">
          <input
            type="text"
            required
            placeholder="Ej: Explícame el teorema de Pitágoras con un ejemplo..."
            value={chatPrompt}
            onChange={(e) => setChatPrompt(e.target.value)}
            className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
          />
          <button
            type="submit"
            disabled={isChatting}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-extrabold text-xs shadow-xs active:scale-95 transition flex items-center gap-1 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Enviar</span>
          </button>
        </form>

        {chatResult && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-line animate-fade-in">
            {chatResult}
          </div>
        )}
      </div>
    </div>
  );
};
