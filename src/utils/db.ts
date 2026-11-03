// IndexedDB storage for offline media & documents (PDF, DOCX, videos, animal photos)
const IDB_NAME = 'ControlDiarioFilesDB';
const IDB_STORE = 'files';

export interface StoredFileRecord {
  id: string;
  blob: Blob;
  fileName: string;
  mimeType: string;
}

export function openFilesDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported'));
    }
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveFileToIDB(id: string, fileBlob: Blob, fileName: string, mimeType: string): Promise<void> {
  const db = await openFilesDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).put({ id, blob: fileBlob, fileName, mimeType });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getFileFromIDB(id: string): Promise<StoredFileRecord | null> {
  try {
    const db = await openFilesDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Error reading from IndexedDB:', err);
    return null;
  }
}

export async function deleteFileFromIDB(id: string): Promise<void> {
  if (!id) return;
  try {
    const db = await openFilesDB();
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).delete(id);
  } catch (e) {
    console.error('Error deleting from IndexedDB:', e);
  }
}
