const CACHE_NAME = 'planning-v2'; // Le changement ici déclenche la mise à jour
const ASSETS = [
  '/',
  '/index.html',
  '/planning.html',
  '/icon.png'
];

// 1. Installation : on crée le nouveau cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  // Force le nouveau SW à prendre le contrôle immédiatement
  self.skipWaiting();
});

// 2. Activation : ON SUPPRIME LES ANCIENS CACHES (Important !)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Suppression de l\'ancien cache :', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. Stratégie : Réseau d'abord, sinon Cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
