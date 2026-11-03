import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '20mb' }));

// Helper to get Gemini client
function getGenAI(customKey?: string) {
  const apiKey = customKey?.trim() || process.env.GEMINI_API_KEY || '';
  if (!apiKey) {
    throw new Error('No GEMINI_API_KEY found. Configure it in secrets or enter in the settings.');
  }
  return new GoogleGenAI({ apiKey });
}

async function generateWithFallback(ai: GoogleGenAI, config: any) {
  const models = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];
  let lastError: any = null;
  for (const model of models) {
    try {
      return await ai.models.generateContent({
        ...config,
        model,
      });
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${model} failed, trying next fallback:`, err?.message || err);
    }
  }
  throw lastError;
}

// 1. Analyze Day
app.post('/api/gemini/analyze', async (req, res) => {
  try {
    const { dateStr, cumplidas, incumplidas, sinMarcar, pendientes, customKey } = req.body;
    const ai = getGenAI(customKey);

    const prompt = `Fecha seleccionada: ${dateStr}.
Actividades cumplidas (SÍ): ${cumplidas?.join(', ') || 'Ninguna'}.
Actividades incumplidas (NO): ${incumplidas?.join(', ') || 'Ninguna'}.
Sin responder aún: ${sinMarcar?.join(', ') || 'Ninguna'}.
Acciones pendientes urgentes: ${pendientes?.join(', ') || 'Ninguna'}.
Dame un resumen motivador en español, evalúa mi porcentaje de éxito de este día y dame 3 consejos breves para organizar lo que me falta con enfoque móvil ágil.`;

    const response = await generateWithFallback(ai, {
      contents: prompt,
      config: {
        systemInstruction: 'Eres un entrenador de hábitos y tutor escolar cercano, claro y motivador. Responde en español con viñetas claras y emojis motivadores.',
      },
    });

    res.json({ reply: response.text || 'Sin respuesta.' });
  } catch (error: any) {
    console.error('Gemini analyze error:', error);
    res.status(500).json({ error: error.message || 'Error en Gemini API' });
  }
});

// 2. Suggest Tasks
app.post('/api/gemini/suggest-tasks', async (req, res) => {
  try {
    const { goal, customKey } = req.body;
    if (!goal) return res.status(400).json({ error: 'Falta el objetivo' });

    const ai = getGenAI(customKey);

    const response = await generateWithFallback(ai, {
      contents: `Convierte este objetivo en entre 2 y 4 actividades concretas: "${goal}". Asigna category como "escolar" o "cotidiana" o "pendiente", y una hora sugerida en formato HH:MM si aplica.`,
      config: {
        systemInstruction: 'Eres un planificador de tareas escolares y cotidianas. Devuelve siempre un JSON válido.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              category: { type: Type.STRING },
              time: { type: Type.STRING },
            },
            required: ['title', 'category'],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    res.json({ tasks: parsed });
  } catch (error: any) {
    console.error('Gemini suggest error:', error);
    res.status(500).json({ error: error.message || 'Error en generación de tareas' });
  }
});

// 3. Free Question Chat
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { question, customKey } = req.body;
    if (!question) return res.status(400).json({ error: 'Falta la pregunta' });

    const ai = getGenAI(customKey);

    const response = await generateWithFallback(ai, {
      contents: question,
      config: {
        systemInstruction: 'Eres un asistente educativo y de organización personal integrado en una app móvil de Control Diario. Responde en español de forma clara, didáctica, concisa y agradable.',
      },
    });

    res.json({ reply: response.text || 'Sin respuesta.' });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    res.status(500).json({ error: error.message || 'Error en Gemini API' });
  }
});

// Start dev or production server
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Mobile Control Diario server running on http://localhost:${port}`);
  });
}

startServer();
