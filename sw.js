// Offline cache for Trening. Bump VERSION when you redeploy changed files.
const VERSION = 'trening-v12';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png',
  './img/Barbell_Bench_Press_-_Medium_Grip-0.jpg',
  './img/Barbell_Bench_Press_-_Medium_Grip-1.jpg',
  './img/Barbell_Deadlift-0.jpg',
  './img/Barbell_Deadlift-1.jpg',
  './img/Barbell_Incline_Bench_Press_-_Medium_Grip-0.jpg',
  './img/Barbell_Incline_Bench_Press_-_Medium_Grip-1.jpg',
  './img/Butterfly-0.jpg',
  './img/Butterfly-1.jpg',
  './img/Cable_Crunch-0.jpg',
  './img/Cable_Crunch-1.jpg',
  './img/Cable_Rope_Overhead_Triceps_Extension-0.jpg',
  './img/Cable_Rope_Overhead_Triceps_Extension-1.jpg',
  './img/Dumbbell_Bicep_Curl-0.jpg',
  './img/Dumbbell_Bicep_Curl-1.jpg',
  './img/Face_Pull-0.jpg',
  './img/Face_Pull-1.jpg',
  './img/Hammer_Curls-0.jpg',
  './img/Hammer_Curls-1.jpg',
  './img/Hanging_Leg_Raise-0.jpg',
  './img/Hanging_Leg_Raise-1.jpg',
  './img/Leg_Extensions-0.jpg',
  './img/Leg_Extensions-1.jpg',
  './img/Leg_Press-0.jpg',
  './img/Leg_Press-1.jpg',
  './img/Dumbbell_Side_Bend-0.jpg',
  './img/Dumbbell_Side_Bend-1.jpg',
  './img/Hyperextensions_Back_Extensions-0.jpg',
  './img/Hyperextensions_Back_Extensions-1.jpg',
  './img/Dumbbell_Shrug-0.jpg',
  './img/Dumbbell_Shrug-1.jpg',
  './img/Incline_Dumbbell_Press-0.jpg',
  './img/Incline_Dumbbell_Press-1.jpg',
  './img/Lying_Leg_Curls-0.jpg',
  './img/Lying_Leg_Curls-1.jpg',
  './img/Plank-0.jpg',
  './img/Plank-1.jpg',
  './img/Reverse_Machine_Flyes-0.jpg',
  './img/Reverse_Machine_Flyes-1.jpg',
  './img/Romanian_Deadlift-0.jpg',
  './img/Romanian_Deadlift-1.jpg',
  './img/Seated_Cable_Rows-0.jpg',
  './img/Seated_Cable_Rows-1.jpg',
  './img/Seated_Dumbbell_Press-0.jpg',
  './img/Seated_Dumbbell_Press-1.jpg',
  './img/Side_Lateral_Raise-0.jpg',
  './img/Side_Lateral_Raise-1.jpg',
  './img/Split_Squat_with_Dumbbells-0.jpg',
  './img/Split_Squat_with_Dumbbells-1.jpg',
  './img/Standing_Calf_Raises-0.jpg',
  './img/Standing_Calf_Raises-1.jpg',
  './img/Triceps_Pushdown-0.jpg',
  './img/Triceps_Pushdown-1.jpg',
  './img/Underhand_Cable_Pulldowns-0.jpg',
  './img/Underhand_Cable_Pulldowns-1.jpg',
  './img/Wide-Grip_Lat_Pulldown-0.jpg',
  './img/Wide-Grip_Lat_Pulldown-1.jpg'];

// Install: download every file fresh from the server (bypass the browser's HTTP cache).
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION).then(c => Promise.all(ASSETS.map(u =>
      fetch(new Request(u, { cache: 'reload' })).then(r => { if (!r.ok) throw new Error(u); return c.put(u, r); })
    ))).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const fresh = req => fetch(req, { cache: 'no-cache' });
const timeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // The app page: newest version when online (3 s max), offline copy otherwise.
  if (req.mode === 'navigate') {
    e.respondWith(caches.open(VERSION).then(async cache => {
      try {
        const res = await timeout(fresh(req), 3000);
        if (res && res.ok) { cache.put('./index.html', res.clone()); cache.put('./', res.clone()); return res; }
      } catch (_) {}
      return (await cache.match(req, { ignoreSearch: true })) || (await cache.match('./index.html')) || new Response('Offline', { status: 503 });
    }));
    return;
  }
  // Pictures and other files: offline copy first, refreshed in the background.
  e.respondWith(caches.open(VERSION).then(async cache => {
    const cached = await cache.match(req, { ignoreSearch: true });
    const net = fresh(req).then(res => { if (res && res.ok) cache.put(req, res.clone()); return res; }).catch(() => null);
    return cached || (await net) || new Response('', { status: 504 });
  }));
});
