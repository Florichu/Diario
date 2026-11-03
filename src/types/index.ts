export interface Activity {
  id: string;
  title: string;
  category: 'escolar' | 'cotidiana';
  time?: string;
  url?: string;
  fileId?: string | null;
  fileName?: string;
  fileType?: string;
}

export interface PendingItem {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
}

export interface ShoppingItem {
  id: string;
  title: string;
  qty?: string;
  done: boolean;
  createdAt: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  type: 'file' | 'url';
  url?: string;
  fileId?: string;
  fileName?: string;
  fileType?: string;
  scope: 'general' | 'day';
  dateStr: string;
  createdAt: string;
}

export interface DailyAnimal {
  name: string;
  emoji: string;
  bg: string;
  photo: string;
  fact: string;
}

export interface AnimalOverride {
  index?: number;
  customFileId?: string;
  customName?: string;
}

export type TabType =
  | 'cumplir'
  | 'escolares'
  | 'cotidianas'
  | 'pendientes'
  | 'compras'
  | 'recursos'
  | 'calendario'
  | 'gemini'
  | 'sincronizar';

export interface DailyLogs {
  [dateStr: string]: {
    [activityId: string]: 'si' | 'no';
  };
}

export interface ActivitiesByDate {
  [dateStr: string]: Activity[];
}
