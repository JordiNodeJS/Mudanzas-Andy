// Service Worker ultra-minimalista para Core Web Vitals
const CACHE_NAME = 'mudanzas-andy-v1';
const CRITICAL_ASSETS = [
  '/',
  '/camion/optimized/hero-fondo-mobile.avif',
  '/camion/optimized/hero-fondo.avif',
  '/js/move-reserva.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CRITICAL_ASSETS))
  );
});

self.addEventListener('fetch', event => {
  // Solo cachear requests críticos para performance
  if (event.request.url.includes('/camion/optimized/') || 
      event.request.url.includes('/js/')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});