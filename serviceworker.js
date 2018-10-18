self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open('video-store').then(function (cache) {
            return cache.addAll([
                '/showbunny/style.css',
                '/showbunny/kittysan.js',
                '/showbunny/app.js',
                '/showbunny/bunnychan.js',
                '/showbunny/banner.png',
                '/showbunny/easter-bunny.jpg',
                '/showbunny/palceholder_wide.png',
                '/showbunny/placeholder.png',
                '/showbunny/card_tests/',
                '/showbunny/dialog_tests/'
            ]);
        })
    );
});

self.addEventListener('fetch', function (e) {
    console.log(e.request.url);
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        })
    );
});