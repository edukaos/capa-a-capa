/* Registra el modo sin conexión solo en el sitio publicado (GitHub Pages) o en pruebas locales. */
(function(){if(!('serviceWorker' in navigator))return;var h=location.hostname;
  if(!/github\.io$/.test(h)&&h!=='localhost')return;
  window.addEventListener('load',function(){navigator.serviceWorker.register('sw.js').catch(function(){})});
})();
