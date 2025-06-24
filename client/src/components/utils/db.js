// utils/db.js

export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('DiseaseDB', 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('diseases')) {
        db.createObjectStore('diseases', { keyPath: '_id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveDiseasesToDB = async (diseases) => {
  const db = await openDB();
  const tx = db.transaction('diseases', 'readwrite');
  const store = tx.objectStore('diseases');
  diseases.forEach((disease) => store.put(disease));
  return tx.complete;
};

export const getDiseasesFromDB = async () => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('diseases', 'readonly');
    const store = tx.objectStore('diseases');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
