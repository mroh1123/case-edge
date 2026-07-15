/* CaseEdge service worker — precache the shell, then stale-while-revalidate:
   serve from cache instantly (works offline), refresh in the background. */
const CACHE = "caseedge-v7";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./assets/css/styles.css",
  "./assets/js/app.js",
  "./assets/js/engine/drill.js",
  "./assets/js/engine/coach.js",
  "./assets/js/engine/sync.js",
  "./assets/js/engine/progress.js",
  "./assets/js/data/foundations.js",
  "./assets/js/data/frameworks.js",
  "./assets/js/data/sizing.js",
  "./assets/js/data/math.js",
  "./assets/js/data/exhibits.js",
  "./assets/js/data/behavioral.js",
  "./assets/js/data/tracks/palantir.js",
  "./assets/js/data/tracks/amazon.js",
  "./assets/js/data/tracks/mbb.js",
  "./assets/js/data/tracks/tier2-boozallen.js",
  "./assets/js/data/tracks/techpm.js",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(e.request).then(cached => {
        const fetched = fetch(e.request)
          .then(res => { if (res && res.ok) cache.put(e.request, res.clone()); return res; })
          .catch(() => cached);
        return cached || fetched;
      })
    )
  );
});
