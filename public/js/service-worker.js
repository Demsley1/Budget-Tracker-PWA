const CACHE_NAME = 'budget-tracker-cache-v1';
const DATA_CACHE_NAME = 'budget-data-cache-v1';

const FILES_TO_CACHE = [
    '../index.html',
    '../css/style.css',
    '../js/idb.js',
    '../js/index.js',
    '../icons/icon-72x72.png',
    '../icons/icon-96x96.png',
    '../icons/icon-128x128.png',
    '../icons/icon-144x144.png',
    '../icons/icon-152x152.png',
    '../icons/icon-192x192.png',
    '../icons/icon-384x384.png',
    '../icons/icon-512x512.png'
];

// Install the service worker
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("success");
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// listen to activate event and clear cache storage if already populated
self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then( keyList => {
            return Promise.all(
                keyList.map(key => {
                    if(key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log('removing old cache data', key);
                        return caches.delete(key);
                    }
                })
            )
        })
    )

    self.clients.claim();
}) 
