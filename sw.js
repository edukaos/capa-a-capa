/* Capa a Capa · modo sin conexión.
   Las páginas se piden primero a internet (así siempre llega la última versión) y, si no hay conexión, salen de la copia guardada.
   El resto (imágenes, estilo, tipografías) sale de la copia y se actualiza en segundo plano.
   Al cambiar archivos, subí el número de VERSION para renovar la copia. */
var VERSION='cac-v7';
var ARCHIVOS=['./','index.html','avance.html','modulos.js','tema.css','comun.js','registro-sw.js','manifest.webmanifest',
  'capa-a-capa-glosario.html','capa-a-capa-modulo-1.html','capa-a-capa-modulo-2.html','capa-a-capa-modulo-2b.html','capa-a-capa-modulo-3.html',
  'capa-a-capa-modulo-4a.html','capa-a-capa-modulo-4b.html','capa-a-capa-modulo-4c.html','capa-a-capa-modulo-5a.html','capa-a-capa-modulo-5b.html',
  'capa-a-capa-modulo-6a.html','capa-a-capa-modulo-6b.html','capa-a-capa-modulo-7a.html','capa-a-capa-modulo-7b.html',
  'capa-a-capa-modulo-8.html','capa-a-capa-modulo-9.html',
  'img/m1.webp','img/m2.webp','img/m3.webp','img/m4.webp','img/m5.webp','img/m6.webp','img/m7.webp','img/m8.webp','img/m9.webp','img/m10.webp',
  'img/icono.svg','img/icono-192.png','img/icono-512.png','img/icono-180.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(VERSION).then(function(c){return c.addAll(ARCHIVOS)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==VERSION}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET')return;
  var pagina=r.mode==='navigate'||(r.headers.get('accept')||'').indexOf('text/html')>=0;
  if(pagina){e.respondWith(fetch(r).then(function(res){var cp=res.clone();caches.open(VERSION).then(function(c){c.put(r,cp)});return res})
    .catch(function(){return caches.match(r,{ignoreSearch:true}).then(function(m){return m||caches.match('index.html')})}));return}
  e.respondWith(caches.match(r).then(function(m){var red=fetch(r).then(function(res){if(res&&(res.ok||res.type==='opaque')){var cp=res.clone();caches.open(VERSION).then(function(c){c.put(r,cp)})}return res}).catch(function(){return m});return m||red}));
});
