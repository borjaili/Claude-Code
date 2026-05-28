/* ============================================================
   PediCalc — Service Worker
   Estratégia:
     - Pré-cacheia o "app shell" no install
     - Network-first para o HTML (sempre tenta versão fresca)
     - Cache-first para CSS/JS/Fontes/Imagens
============================================================ */

const VERSION = 'v2.0.0';
const SHELL   = `pedicalc-shell-${VERSION}`;
const RUNTIME = `pedicalc-runtime-${VERSION}`;

const APP_SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  'assets/css/styles.css',
  'assets/css/print.css',
  'assets/js/db.js',
  'assets/js/templates.js',
  'assets/js/protocols.js',
  'assets/js/calculators.js',
  'assets/js/scores.js',
  'assets/js/helpers.js',
  'assets/js/theme.js',
  'assets/js/search.js',
  'assets/js/favorites.js',
  'assets/js/clipboard.js',
  'assets/js/pwa.js',
  'assets/js/app.js',
  'assets/icons/icon.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(SHELL).then(c => c.addAll(APP_SHELL.map(u => new Request(u, { cache: 'reload' }))))
          .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== SHELL && k !== RUNTIME).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Network-first para o documento HTML
  if (req.mode === 'navigate' || req.destination === 'document') {
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(RUNTIME).then(c => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then(r => r || caches.match('index.html')))
    );
    return;
  }

  // Cache-first para assets estáticos
  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        // Só cacheia respostas OK do mesmo origin ou CDNs conhecidos
        if (res && res.status === 200 && (url.origin === self.location.origin
            || url.host.endsWith('cdnjs.cloudflare.com')
            || url.host.endsWith('fonts.googleapis.com')
            || url.host.endsWith('fonts.gstatic.com'))) {
          const copy = res.clone();
          caches.open(RUNTIME).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
    })
  );
});
