const DB_NAME = 'StitchBoxDB';
const DB_VERSION = 1;
const STORE_LIBRARY = 'library';

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_LIBRARY)) {
        db.createObjectStore(STORE_LIBRARY, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

export const getAllLibraryItems = async () => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_LIBRARY, 'readonly');
      const store = tx.objectStore(STORE_LIBRARY);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('IndexedDB getAll error:', error);
    return [];
  }
};

export const saveLibraryItem = async (item) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_LIBRARY, 'readwrite');
      const store = tx.objectStore(STORE_LIBRARY);
      const request = store.put(item);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('IndexedDB save error:', error);
  }
};

export const deleteLibraryItem = async (id) => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_LIBRARY, 'readwrite');
      const store = tx.objectStore(STORE_LIBRARY);
      const request = store.delete(id);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('IndexedDB delete error:', error);
  }
};

export const getCustomBaseTags = () => {
  try {
    const stored = localStorage.getItem('STITCHBOX_CUSTOM_TAGS');
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

export const saveCustomBaseTag = (tag) => {
  try {
    const existing = getCustomBaseTags();
    if (!existing.includes(tag)) {
      const updated = [...existing, tag];
      localStorage.setItem('STITCHBOX_CUSTOM_TAGS', JSON.stringify(updated));
      return updated;
    }
    return existing;
  } catch (e) {
    return [];
  }
};
