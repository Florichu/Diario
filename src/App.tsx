/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  ActivitiesByDate,
  DailyLogs,
  PendingItem,
  ShoppingItem,
  ResourceItem,
  AnimalOverride,
  TabType,
} from './types';
import { getLocalTodayStr, formatHumanDate, offsetDate } from './utils/date';
import { DAILY_ANIMALS, getAnimalIndexForDate } from './utils/animals';
import { saveFileToIDB, getFileFromIDB, deleteFileFromIDB } from './utils/db';
import { usePWAInstall } from './hooks/usePWAInstall';
import { useOnlineStatus } from './hooks/useOnlineStatus';

import { MobileTopBar } from './components/MobileTopBar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MoreMenuDrawer } from './components/MoreMenuDrawer';
import { MediaViewer } from './components/MediaViewer';

import { CumplirTab } from './components/tabs/CumplirTab';
import { EscolaresTab } from './components/tabs/EscolaresTab';
import { CotidianasTab } from './components/tabs/CotidianasTab';
import { PendientesTab } from './components/tabs/PendientesTab';
import { ComprasTab } from './components/tabs/ComprasTab';
import { RecursosTab } from './components/tabs/RecursosTab';
import { CalendarioTab } from './components/tabs/CalendarioTab';
import { GeminiTab } from './components/tabs/GeminiTab';
import { SincronizarTab } from './components/tabs/SincronizarTab';

const STORAGE_KEYS = {
  ACTIVITIES_BY_DATE: 'control_diario_activities_by_date_v2',
  LEGACY_ACTIVITIES: 'control_diario_activities_v1',
  LOGS: 'control_diario_logs_v1',
  PENDINGS: 'control_diario_pendings_v1',
  SHOPPING: 'control_diario_shopping_v1',
  RESOURCES: 'control_diario_resources_v1',
  GEMINI_KEY: 'control_diario_gemini_key_v1',
  ANIMAL_OVERRIDES: 'control_diario_animals_v1',
};

export default function App() {
  const [selectedDate, setSelectedDate] = useState<string>(getLocalTodayStr);
  const [activeTab, setActiveTab] = useState<TabType>('cumplir');
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Core data states
  const [activitiesByDate, setActivitiesByDate] = useState<ActivitiesByDate>({});
  const [dailyLogs, setDailyLogs] = useState<DailyLogs>({});
  const [pendings, setPendings] = useState<PendingItem[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [animalOverrides, setAnimalOverrides] = useState<Record<string, AnimalOverride>>({});
  const [userApiKey, setUserApiKey] = useState<string>('');

  // Media viewer state
  const [viewerState, setViewerState] = useState<{
    isOpen: boolean;
    title: string;
    url?: string;
    fileBlobUrl?: string;
    fileName?: string;
    mimeType?: string;
  }>({ isOpen: false, title: '' });

  // Custom animal photo state for selected date
  const [customAnimalBlobUrl, setCustomAnimalBlobUrl] = useState<string | undefined>(undefined);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; isError?: boolean } | null>(null);

  // PWA and Online status
  const { isInstallable, install } = usePWAInstall();
  const isOnline = useOnlineStatus();

  const showToast = useCallback((message: string, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 2800);
  }, []);

  // Load Initial Data from localStorage
  useEffect(() => {
    try {
      const savedByDate = localStorage.getItem(STORAGE_KEYS.ACTIVITIES_BY_DATE);
      const savedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);
      const savedPendings = localStorage.getItem(STORAGE_KEYS.PENDINGS);
      const savedShopping = localStorage.getItem(STORAGE_KEYS.SHOPPING);
      const savedResources = localStorage.getItem(STORAGE_KEYS.RESOURCES);
      const savedAnimals = localStorage.getItem(STORAGE_KEYS.ANIMAL_OVERRIDES);
      const savedKey = localStorage.getItem(STORAGE_KEYS.GEMINI_KEY) || '';

      setUserApiKey(savedKey);
      if (savedLogs) setDailyLogs(JSON.parse(savedLogs));
      if (savedPendings) setPendings(JSON.parse(savedPendings));
      if (savedShopping) setShoppingList(JSON.parse(savedShopping));
      if (savedResources) setResources(JSON.parse(savedResources));
      if (savedAnimals) setAnimalOverrides(JSON.parse(savedAnimals));

      if (savedByDate) {
        setActivitiesByDate(JSON.parse(savedByDate));
      } else {
        const legacyActs = localStorage.getItem(STORAGE_KEYS.LEGACY_ACTIVITIES);
        if (legacyActs) {
          const parsed = JSON.parse(legacyActs);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const today = getLocalTodayStr();
            const initMap: ActivitiesByDate = { [today]: parsed };
            setActivitiesByDate(initMap);
            localStorage.setItem(STORAGE_KEYS.ACTIVITIES_BY_DATE, JSON.stringify(initMap));
          }
        }
      }
    } catch (e) {
      console.error('Failed to parse localStorage data:', e);
    }
  }, []);

  // Sync state to localStorage
  const updateActivities = (newActs: ActivitiesByDate) => {
    setActivitiesByDate(newActs);
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES_BY_DATE, JSON.stringify(newActs));
  };

  const updateLogs = (newLogs: DailyLogs) => {
    setDailyLogs(newLogs);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(newLogs));
  };

  const updatePendings = (newPend: PendingItem[]) => {
    setPendings(newPend);
    localStorage.setItem(STORAGE_KEYS.PENDINGS, JSON.stringify(newPend));
  };

  const updateShopping = (newShop: ShoppingItem[]) => {
    setShoppingList(newShop);
    localStorage.setItem(STORAGE_KEYS.SHOPPING, JSON.stringify(newShop));
  };

  const updateResources = (newRes: ResourceItem[]) => {
    setResources(newRes);
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(newRes));
  };

  const updateAnimalOverrides = (newOverrides: Record<string, AnimalOverride>) => {
    setAnimalOverrides(newOverrides);
    localStorage.setItem(STORAGE_KEYS.ANIMAL_OVERRIDES, JSON.stringify(newOverrides));
  };

  const updateApiKey = (key: string) => {
    setUserApiKey(key);
    localStorage.setItem(STORAGE_KEYS.GEMINI_KEY, key);
  };

  // Current day's activities
  const dayActivities = activitiesByDate[selectedDate] || [];
  const currentDayLog = dailyLogs[selectedDate] || {};

  // Compute animal for the day
  const animalIdx = getAnimalIndexForDate(selectedDate, animalOverrides);
  const currentAnimal = DAILY_ANIMALS[animalIdx];
  const currentAnimalOverride = animalOverrides[selectedDate];

  // Load custom animal photo if stored
  useEffect(() => {
    let active = true;
    if (currentAnimalOverride?.customFileId) {
      getFileFromIDB(currentAnimalOverride.customFileId).then((rec) => {
        if (active && rec?.blob) {
          const url = URL.createObjectURL(rec.blob);
          setCustomAnimalBlobUrl(url);
        }
      });
    } else {
      setCustomAnimalBlobUrl(undefined);
    }
    return () => {
      active = false;
    };
  }, [selectedDate, currentAnimalOverride?.customFileId]);

  // Animal actions
  const handleCycleAnimal = () => {
    const nextIdx = (animalIdx + 1) % DAILY_ANIMALS.length;
    const newOverrides = {
      ...animalOverrides,
      [selectedDate]: { index: nextIdx },
    };
    updateAnimalOverrides(newOverrides);
    showToast(`Animal cambiado: ${DAILY_ANIMALS[nextIdx].name}`);
  };

  const handleUploadCustomAnimalPhoto = async (file: File) => {
    const fileId = `animal-photo-${selectedDate}`;
    try {
      await saveFileToIDB(fileId, file, file.name, file.type || 'image/jpeg');
      const newOverrides = {
        ...animalOverrides,
        [selectedDate]: {
          index: animalIdx,
          customFileId: fileId,
          customName: file.name.replace(/\.[^/.]+$/, ''),
        },
      };
      updateAnimalOverrides(newOverrides);
      showToast('¡Foto de animal guardada para este día!');
    } catch {
      showToast('No se pudo guardar la foto', true);
    }
  };

  // Activity Status & CRUD
  const handleStatusChange = (activityId: string, status: 'si' | 'no') => {
    const currentStatus = currentDayLog[activityId];
    const newDayLog = { ...currentDayLog };
    if (currentStatus === status) {
      delete newDayLog[activityId];
    } else {
      newDayLog[activityId] = status;
    }
    const newDailyLogs = { ...dailyLogs, [selectedDate]: newDayLog };
    updateLogs(newDailyLogs);
  };

  const handleMarkAllYes = () => {
    if (dayActivities.length === 0) {
      showToast('No hay actividades en este día', true);
      return;
    }
    const newDayLog: Record<string, 'si' | 'no'> = {};
    dayActivities.forEach((a) => {
      newDayLog[a.id] = 'si';
    });
    updateLogs({ ...dailyLogs, [selectedDate]: newDayLog });
    showToast('Todas marcadas con SÍ');
  };

  const handleResetDay = () => {
    const newDailyLogs = { ...dailyLogs };
    delete newDailyLogs[selectedDate];
    updateLogs(newDailyLogs);
    showToast('Respuestas del día reiniciadas');
  };

  const handleAddActivity = async (
    category: 'escolar' | 'cotidiana',
    title: string,
    time?: string,
    url?: string,
    file?: File
  ) => {
    let fileId: string | null = null;
    let fileName = '';
    let fileType = '';

    if (file) {
      fileId = `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      fileName = file.name;
      fileType = file.type || '';
      try {
        await saveFileToIDB(fileId, file, fileName, fileType);
      } catch (err) {
        console.error('File save error:', err);
      }
    }

    const newActivity: Activity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      title,
      category,
      time: time || '',
      url: url || '',
      fileId,
      fileName,
      fileType,
    };

    const updatedDay = [...dayActivities, newActivity];
    updateActivities({ ...activitiesByDate, [selectedDate]: updatedDay });
    showToast(`Añadida al día ${selectedDate}`);
  };

  const handleUpdateActivity = (
    id: string,
    title: string,
    time?: string,
    url?: string
  ) => {
    const updatedDay = dayActivities.map((act) =>
      act.id === id ? { ...act, title, time, url } : act
    );
    updateActivities({ ...activitiesByDate, [selectedDate]: updatedDay });
    showToast('Actividad actualizada');
  };

  const handleDeleteActivity = async (id: string) => {
    const target = dayActivities.find((a) => a.id === id);
    if (target?.fileId) {
      await deleteFileFromIDB(target.fileId);
    }
    const updatedDay = dayActivities.filter((a) => a.id !== id);
    const newActs = { ...activitiesByDate, [selectedDate]: updatedDay };
    updateActivities(newActs);

    if (currentDayLog[id]) {
      const newDayLog = { ...currentDayLog };
      delete newDayLog[id];
      updateLogs({ ...dailyLogs, [selectedDate]: newDayLog });
    }
    showToast('Actividad eliminada de este día');
  };

  // Copy tasks from yesterday
  const handleCopyFromYesterday = () => {
    const yesterday = offsetDate(selectedDate, -1);
    const prevActs = activitiesByDate[yesterday] || [];
    if (prevActs.length === 0) {
      showToast(`No hay actividades registradas ayer (${yesterday})`, true);
      return;
    }

    const currentTitles = new Set(dayActivities.map((a) => `${a.category}:${a.title.toLowerCase()}`));
    let count = 0;
    const newActs = [...dayActivities];

    prevActs.forEach((act, idx) => {
      const key = `${act.category}:${act.title.toLowerCase()}`;
      if (!currentTitles.has(key)) {
        newActs.push({
          ...act,
          id: `act-${Date.now()}-${idx}`,
        });
        count++;
      }
    });

    if (count === 0) {
      showToast('Las tareas de ayer ya están en este día');
      return;
    }

    updateActivities({ ...activitiesByDate, [selectedDate]: newActs });
    showToast(`Se copiaron ${count} tareas del día anterior`);
  };

  // Media Viewer Helper
  const handleOpenMedia = async (media: {
    url?: string;
    fileId?: string;
    fileName?: string;
    title: string;
  }) => {
    if (media.fileId) {
      try {
        const record = await getFileFromIDB(media.fileId);
        if (!record?.blob) {
          showToast('El archivo solo existe en el dispositivo donde se subió', true);
          return;
        }
        const blobUrl = URL.createObjectURL(record.blob);
        setViewerState({
          isOpen: true,
          title: media.title || record.fileName,
          fileBlobUrl: blobUrl,
          fileName: record.fileName,
          mimeType: record.mimeType,
        });
      } catch {
        showToast('No se pudo abrir el archivo', true);
      }
    } else if (media.url) {
      setViewerState({
        isOpen: true,
        title: media.title,
        url: media.url,
      });
    }
  };

  // Pendientes CRUD
  const handleAddPending = (title: string) => {
    const newItem: PendingItem = {
      id: `pend-${Date.now()}`,
      title,
      done: false,
      createdAt: formatHumanDate(getLocalTodayStr()),
    };
    updatePendings([newItem, ...pendings]);
    showToast('Acción pendiente añadida');
  };

  const handleTogglePending = (id: string) => {
    const updated = pendings.map((p) => (p.id === id ? { ...p, done: !p.done } : p));
    updatePendings(updated);
  };

  const handleUpdatePending = (id: string, title: string) => {
    const updated = pendings.map((p) => (p.id === id ? { ...p, title } : p));
    updatePendings(updated);
    showToast('Pendiente actualizado');
  };

  const handleDeletePending = (id: string) => {
    updatePendings(pendings.filter((p) => p.id !== id));
    showToast('Pendiente eliminado');
  };

  const handleClearCompletedPendings = () => {
    const remaining = pendings.filter((p) => !p.done);
    updatePendings(remaining);
    showToast('Acciones realizadas limpiadas');
  };

  // Compras CRUD
  const handleAddShopping = (title: string, qty?: string) => {
    const newItem: ShoppingItem = {
      id: `shop-${Date.now()}`,
      title,
      qty,
      done: false,
      createdAt: formatHumanDate(getLocalTodayStr()),
    };
    updateShopping([newItem, ...shoppingList]);
    showToast('Artículo añadido a la lista');
  };

  const handleToggleShopping = (id: string) => {
    const updated = shoppingList.map((s) => (s.id === id ? { ...s, done: !s.done } : s));
    updateShopping(updated);
  };

  const handleUpdateShopping = (id: string, title: string, qty?: string) => {
    const updated = shoppingList.map((s) => (s.id === id ? { ...s, title, qty } : s));
    updateShopping(updated);
    showToast('Artículo actualizado');
  };

  const handleDeleteShopping = (id: string) => {
    updateShopping(shoppingList.filter((s) => s.id !== id));
    showToast('Artículo eliminado');
  };

  const handleClearCompletedShopping = () => {
    const remaining = shoppingList.filter((s) => !s.done);
    updateShopping(remaining);
    showToast('Artículos comprados limpiados');
  };

  // Recursos CRUD
  const handleAddFileResource = async (title: string, file: File, scope: 'general' | 'day') => {
    const fileId = `res-file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    try {
      await saveFileToIDB(fileId, file, file.name, file.type || 'application/octet-stream');
      const newRes: ResourceItem = {
        id: `res-${Date.now()}`,
        title,
        type: 'file',
        fileId,
        fileName: file.name,
        fileType: file.type || '',
        scope,
        dateStr: selectedDate,
        createdAt: formatHumanDate(getLocalTodayStr()),
      };
      updateResources([newRes, ...resources]);
      showToast('Documento guardado en biblioteca');
    } catch {
      showToast('Error al guardar el archivo', true);
    }
  };

  const handleAddUrlResource = (title: string, url: string, scope: 'general' | 'day') => {
    const newRes: ResourceItem = {
      id: `res-${Date.now()}`,
      title,
      type: 'url',
      url,
      scope,
      dateStr: selectedDate,
      createdAt: formatHumanDate(getLocalTodayStr()),
    };
    updateResources([newRes, ...resources]);
    showToast('Enlace guardado');
  };

  const handleDeleteResource = async (id: string) => {
    const target = resources.find((r) => r.id === id);
    if (target?.fileId) {
      await deleteFileFromIDB(target.fileId);
    }
    updateResources(resources.filter((r) => r.id !== id));
    showToast('Recurso eliminado');
  };

  // Sync Code Apply
  const handleApplySyncCode = (rawCode: string, mode: 'merge' | 'replace'): boolean => {
    try {
      const decoded = decodeURIComponent(escape(atob(rawCode)));
      const incoming = JSON.parse(decoded);
      if (typeof incoming.dailyLogs !== 'object') {
        throw new Error('Formato inválido');
      }

      const incomingByDate = incoming.activitiesByDate || {};

      if (mode === 'replace') {
        updateActivities(incomingByDate);
        updateLogs(incoming.dailyLogs || {});
        updatePendings(Array.isArray(incoming.pendingActions) ? incoming.pendingActions : []);
        updateShopping(Array.isArray(incoming.shoppingList) ? incoming.shoppingList : []);
        updateResources(Array.isArray(incoming.resourcesList) ? incoming.resourcesList : []);
      } else {
        // Merge activities by date
        const mergedActs: ActivitiesByDate = { ...activitiesByDate };
        Object.keys(incomingByDate).forEach((dateKey) => {
          if (!mergedActs[dateKey]) {
            mergedActs[dateKey] = incomingByDate[dateKey];
          } else {
            const existingIds = new Set(mergedActs[dateKey].map((a) => a.id));
            incomingByDate[dateKey].forEach((incAct: Activity) => {
              if (!existingIds.has(incAct.id)) {
                mergedActs[dateKey].push(incAct);
              }
            });
          }
        });
        updateActivities(mergedActs);

        // Merge daily logs
        const mergedLogs: DailyLogs = { ...dailyLogs };
        Object.keys(incoming.dailyLogs || {}).forEach((dateKey) => {
          mergedLogs[dateKey] = {
            ...(mergedLogs[dateKey] || {}),
            ...incoming.dailyLogs[dateKey],
          };
        });
        updateLogs(mergedLogs);

        // Merge pendings
        if (Array.isArray(incoming.pendingActions)) {
          const map = new Map(pendings.map((p) => [p.id, p]));
          incoming.pendingActions.forEach((p: PendingItem) => {
            if (!map.has(p.id)) pendings.push(p);
            else if (p.done) map.get(p.id)!.done = true;
          });
          updatePendings([...pendings]);
        }

        // Merge shopping
        if (Array.isArray(incoming.shoppingList)) {
          const map = new Map(shoppingList.map((s) => [s.id, s]));
          incoming.shoppingList.forEach((s: ShoppingItem) => {
            if (!map.has(s.id)) shoppingList.push(s);
            else if (s.done) map.get(s.id)!.done = true;
          });
          updateShopping([...shoppingList]);
        }

        // Merge resources
        if (Array.isArray(incoming.resourcesList)) {
          const map = new Map(resources.map((r) => [r.id, r]));
          incoming.resourcesList.forEach((r: ResourceItem) => {
            if (!map.has(r.id)) resources.push(r);
          });
          updateResources([...resources]);
        }
      }

      showToast(mode === 'merge' ? '¡Datos fusionados con éxito!' : '¡Datos reemplazados!');
      setActiveTab('cumplir');
      return true;
    } catch {
      showToast('El código de sincronización no es válido', true);
      return false;
    }
  };

  // Backup file export & import
  const handleExportBackup = () => {
    const data = {
      activitiesByDate,
      dailyLogs,
      pendingActions: pendings,
      shoppingList,
      resourcesList: resources,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `copia_control_diario_${selectedDate}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Copia de seguridad descargada (.json)');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (typeof parsed.dailyLogs === 'object') {
          updateActivities(parsed.activitiesByDate || {});
          updateLogs(parsed.dailyLogs || {});
          updatePendings(Array.isArray(parsed.pendingActions) ? parsed.pendingActions : []);
          updateShopping(Array.isArray(parsed.shoppingList) ? parsed.shoppingList : []);
          updateResources(Array.isArray(parsed.resourcesList) ? parsed.resourcesList : []);
          showToast('¡Copia de seguridad restaurada!');
          setIsMoreOpen(false);
          setActiveTab('cumplir');
        } else {
          showToast('Archivo de copia no válido', true);
        }
      } catch {
        showToast('Error al leer el archivo JSON', true);
      }
    };
    reader.readAsText(file);
  };

  const isToday = selectedDate === getLocalTodayStr();
  const isMoreActive = ['recursos', 'calendario', 'gemini', 'sincronizar'].includes(activeTab);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none text-slate-800">
      {/* Mobile Top Bar */}
      <MobileTopBar
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        isOnline={isOnline}
        isInstallable={isInstallable}
        onInstallClick={install}
        animal={currentAnimal}
        animalPhotoUrl={customAnimalBlobUrl || currentAnimal.photo}
        onOpenAnimalModal={() => setActiveTab('cumplir')}
      />

      {/* Main View Container (Mobile ergonomic width) */}
      <main className="flex-1 w-full max-w-md mx-auto px-3 pt-3">
        {activeTab === 'cumplir' && (
          <CumplirTab
            selectedDate={selectedDate}
            isToday={isToday}
            activities={dayActivities}
            dailyLog={currentDayLog}
            animal={currentAnimal}
            animalPhotoUrl={customAnimalBlobUrl}
            animalOverride={currentAnimalOverride}
            onCycleAnimal={handleCycleAnimal}
            onUploadCustomPhoto={handleUploadCustomAnimalPhoto}
            onStatusChange={handleStatusChange}
            onDeleteActivity={handleDeleteActivity}
            onQuickAdd={(cat, title, time, url, file) =>
              handleAddActivity(cat, title, time, url, file)
            }
            onCopyFromYesterday={handleCopyFromYesterday}
            onMarkAllYes={handleMarkAllYes}
            onResetDay={handleResetDay}
            onOpenMedia={handleOpenMedia}
          />
        )}

        {activeTab === 'escolares' && (
          <EscolaresTab
            selectedDate={selectedDate}
            activities={dayActivities}
            onAddActivity={(title, time, url, file) =>
              handleAddActivity('escolar', title, time, url, file)
            }
            onUpdateActivity={handleUpdateActivity}
            onDeleteActivity={handleDeleteActivity}
            onOpenMedia={handleOpenMedia}
          />
        )}

        {activeTab === 'cotidianas' && (
          <CotidianasTab
            selectedDate={selectedDate}
            activities={dayActivities}
            onAddActivity={(title, time, url, file) =>
              handleAddActivity('cotidiana', title, time, url, file)
            }
            onUpdateActivity={handleUpdateActivity}
            onDeleteActivity={handleDeleteActivity}
            onOpenMedia={handleOpenMedia}
          />
        )}

        {activeTab === 'pendientes' && (
          <PendientesTab
            pendings={pendings}
            onAddPending={handleAddPending}
            onTogglePending={handleTogglePending}
            onUpdatePending={handleUpdatePending}
            onDeletePending={handleDeletePending}
            onClearCompleted={handleClearCompletedPendings}
          />
        )}

        {activeTab === 'compras' && (
          <ComprasTab
            shoppingList={shoppingList}
            onAddShopping={handleAddShopping}
            onToggleShopping={handleToggleShopping}
            onUpdateShopping={handleUpdateShopping}
            onDeleteShopping={handleDeleteShopping}
            onClearCompleted={handleClearCompletedShopping}
          />
        )}

        {activeTab === 'recursos' && (
          <RecursosTab
            selectedDate={selectedDate}
            resources={resources}
            onAddFileResource={handleAddFileResource}
            onAddUrlResource={handleAddUrlResource}
            onDeleteResource={handleDeleteResource}
            onOpenMedia={handleOpenMedia}
          />
        )}

        {activeTab === 'calendario' && (
          <CalendarioTab
            selectedDate={selectedDate}
            onSelectDate={(newDate) => {
              setSelectedDate(newDate);
              setActiveTab('cumplir');
              showToast(`Día ${newDate} abierto`);
            }}
            activitiesByDate={activitiesByDate}
            dailyLogs={dailyLogs}
          />
        )}

        {activeTab === 'gemini' && (
          <GeminiTab
            selectedDate={selectedDate}
            activities={dayActivities}
            dailyLog={currentDayLog}
            pendings={pendings}
            onAddSuggestedActivity={(title, category, time) =>
              handleAddActivity(category, title, time)
            }
            onAddSuggestedPending={handleAddPending}
            userApiKey={userApiKey}
            onSaveApiKey={updateApiKey}
            onShowToast={showToast}
          />
        )}

        {activeTab === 'sincronizar' && (
          <SincronizarTab
            activitiesByDate={activitiesByDate}
            dailyLogs={dailyLogs}
            pendings={pendings}
            shoppingList={shoppingList}
            resources={resources}
            onApplySyncCode={handleApplySyncCode}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Media Viewer Modal */}
      <MediaViewer
        isOpen={viewerState.isOpen}
        onClose={() => setViewerState({ isOpen: false, title: '' })}
        title={viewerState.title}
        url={viewerState.url}
        fileBlobUrl={viewerState.fileBlobUrl}
        fileName={viewerState.fileName}
        mimeType={viewerState.mimeType}
      />

      {/* More Menu Drawer */}
      <MoreMenuDrawer
        isOpen={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsMoreOpen(false);
        }}
        recursosCount={resources.length}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setIsMoreOpen(false);
        }}
        escolaresCount={dayActivities.filter((a) => a.category === 'escolar').length}
        cotidianasCount={dayActivities.filter((a) => a.category === 'cotidiana').length}
        pendientesCount={pendings.filter((p) => !p.done).length}
        comprasCount={shoppingList.filter((s) => !s.done).length}
        onOpenMore={() => setIsMoreOpen(true)}
        isMoreActive={isMoreActive}
      />

      {/* Toast Feedback */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-[90vw] animate-fade-in pointer-events-none">
          <div
            className={`px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold text-white ${
              toast.isError ? 'bg-rose-600' : 'bg-slate-900/95 backdrop-blur-md'
            }`}
          >
            <span>{toast.isError ? '⚠️' : '✓'}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
