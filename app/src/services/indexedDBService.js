const DB_NAME = 'imageProcessorDB';
const DB_VERSION = 1;
const STORE_NAME = 'images';

// Initialize the database
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('Error opening IndexedDB:', event.target.error);
      reject(event.target.error);
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object store for images if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        
        // Create indexes for faster querying
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('date', 'date', { unique: false });
      }
    };
  });
};

// Save an image to the database
const saveImage = async (imageData, name = null) => {
  try {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      // Create image object to store
      const image = {
        name: name || `Image_${new Date().toISOString()}`,
        date: new Date().toISOString(),
        imageBlob: imageData
      };
      
      const request = store.add(image);
      
      request.onsuccess = (event) => {
        resolve(event.target.result); // Returns the ID of the saved image
      };
      
      request.onerror = (event) => {
        console.error('Error saving image:', event.target.error);
        reject(event.target.error);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error in saveImage:', error);
    throw error;
  }
};

// Get all images from the database
const getAllImages = async () => {
  try {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
      
      request.onerror = (event) => {
        console.error('Error getting images:', event.target.error);
        reject(event.target.error);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error in getAllImages:', error);
    throw error;
  }
};

// Get an image by ID
const getImageById = async (id) => {
  try {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);
      
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
      
      request.onerror = (event) => {
        console.error('Error getting image:', event.target.error);
        reject(event.target.error);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error in getImageById:', error);
    throw error;
  }
};

// Delete an image by ID
const deleteImage = async (id) => {
  try {
    const db = await initDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);
      
      request.onsuccess = () => {
        resolve(true);
      };
      
      request.onerror = (event) => {
        console.error('Error deleting image:', event.target.error);
        reject(event.target.error);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error in deleteImage:', error);
    throw error;
  }
};

// Convert blob to URL for display
const blobToURL = (blob) => {
  return URL.createObjectURL(blob);
};

// Export the functions
export {
  initDB,
  saveImage,
  getAllImages,
  getImageById,
  deleteImage,
  blobToURL
};