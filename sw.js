const CACHE_VERSION = '1.3.0';
const CACHE_NAME = 'planning-v' + CACHE_VERSION; // Utilise la version ici

self.addEventListener('message', (event) => {
  if (event.data === 'getVersion') {
    // On répond directement à la page qui a posé la question
    if (event.ports && event.ports[0]) {
      event.ports[0].postMessage(CACHE_VERSION);
    }
  }
});

const ASSETS = [
  '/',
  '/index.html',
  '/planning.html',
  '/icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // Permet au SW de prendre le contrôle des pages ouvertes immédiatement
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
