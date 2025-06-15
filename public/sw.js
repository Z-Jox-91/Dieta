// Service Worker per Diet Bilanciamo
// Gestisce cache offline, notifiche push e sincronizzazione

const CACHE_NAME = 'diet-bilanciamo-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Installazione del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercettazione delle richieste di rete
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Restituisce la risorsa dalla cache se disponibile
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Gestione delle notifiche push
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Promemoria: È ora di registrare il tuo pasto!',
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Apri App',
        icon: '/pwa-192x192.png'
      },
      {
        action: 'close',
        title: 'Chiudi',
        icon: '/pwa-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Diet Bilanciamo', options)
  );
});

// Gestione dei click sulle notifiche
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Sincronizzazione in background
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Implementa la logica di sincronizzazione dei dati
  return new Promise((resolve) => {
    // Simula sincronizzazione
    setTimeout(() => {
      console.log('Background sync completed');
      resolve();
    }, 1000);
  });
}