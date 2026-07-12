/* NeuroSpazio — service worker
   Rende l'app installabile e utilizzabile offline:
   cache-first per la shell, aggiornamento in background. */

const CACHE = "neurospazio-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/storage.js",
  "./js/data.js",
  "./js/games.js",
  "./js/tools.js",
  "./js/app.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit =>
      hit ||
      fetch(e.request).then(resp => {
        // aggiorna la cache con le risorse nuove della stessa origine
        if (resp.ok && new URL(e.request.url).origin === location.origin) {
          const copia = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, copia));
        }
        return resp;
      }).catch(() => caches.match("./index.html"))
    )
  );
});
