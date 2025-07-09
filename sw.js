const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
  '/pwa-testing/',
  '/pwa-testing/index.html',
  '/pwa-testing/manifest.json',
  '/pwa-testing/sw.js',
  '/pwa-testing/icons/oleander.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker meng-cache aset:', urlsToCache);
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Gagal meng-cache aset:', error);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
      .catch(error => {
        console.error('Fetch gagal:', error);
      })
  );
});