/* Capa a Capa · código común de las lecciones: nombres de los pasos, narración, confirmación de Reiniciar, puntaje del repaso y enlaces a una lección. */
(function(){ // nombres de lección debajo de cada paso
  var nv=document.getElementById('nav');if(!nv)return;var b=nv.querySelectorAll('button');
  nv.style.setProperty('--n',b.length);nv.style.setProperty('--lw',b.length>7?'104px':b.length>6?'128px':'150px');
  for(var i=0;i<b.length;i++){var a=b[i].getAttribute('aria-label')||'',k=a.indexOf(', ');b[i].setAttribute('data-t',k>0?a.slice(k+2):'Repaso')}
})();
(function(){
  // Narración: lee título, introducción y analogía de cada lección con la voz del navegador.
  // Arranca sola al cambiar de lección (después del primer toque) y se pausa o reanuda por oraciones.
  var SY=window.speechSynthesis;if(!SY||!window.SpeechSynthesisUtterance)return;
  if(!document.getElementById('nav'))return;var top=document.querySelector('.top'),secs=[].slice.call(document.querySelectorAll('section.lesson'));if(!top||!secs.length)return;
  var KEY='cac-narr',auto=true;try{auto=localStorage.getItem(KEY)!=='off'}catch(e){}
  var parts=[],idx=0,state='idle',token=0,cur=null,touched=false;
  var IC={play:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>',pause:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>'};
  var btn=document.createElement('button');btn.type='button';btn.className='narr';
  (top.querySelector('.prog')||top).appendChild(btn);
  function paint(){var t=state==='playing'?'Pausar':state==='paused'?'Reanudar':'Escuchar';
    btn.innerHTML=(state==='playing'?IC.pause:IC.play)+'<span>'+t+'</span>';btn.setAttribute('aria-label',t+' la narración de la lección');btn.classList.toggle('on',state==='playing')}
  function voice(){var v=[];try{v=SY.getVoices()||[]}catch(e){}var pr=['es-ar','es-419','es-mx','es-us','es-es','es'];
    for(var i=0;i<pr.length;i++)for(var j=0;j<v.length;j++)if(v[j].lang&&v[j].lang.replace('_','-').toLowerCase().indexOf(pr[i])===0)return v[j];return null}
  function textOf(sec){var hd=sec.querySelector('.lhead');if(!hd)return[];var h=hd.querySelector('h1'),ps=hd.querySelectorAll('p'),cr=sec.querySelector('.criollo p'),t=[];
    if(h){var c=h.cloneNode(true),en=c.querySelector('.en');if(en)c.removeChild(en);t.push(c.textContent.trim()+'.')}
    if(ps[1])t.push(ps[1].textContent);if(cr)t.push(cr.textContent);
    return (t.join(' ').match(/[^.!?…]+[.!?…]+|[^.!?…]+$/g)||[]).map(function(x){return x.trim()}).filter(Boolean)}
  function next(){if(state!=='playing')return;if(idx>=parts.length){state='idle';idx=0;paint();return}
    var my=++token,u=new SpeechSynthesisUtterance(parts[idx]),v=voice();u.lang=v?v.lang:'es-AR';if(v)u.voice=v;u.rate=.98;
    u.onend=function(){if(my!==token)return;idx++;next()};
    u.onerror=function(){if(my!==token)return;state='idle';idx=0;paint()};
    try{SY.speak(u)}catch(e){state='idle';paint()}}
  function halt(){token++;try{SY.cancel()}catch(e){}}
  function play(){halt();if(idx>=parts.length)idx=0;state='playing';paint();next()}
  function pause(){halt();state='paused';paint()}
  function load(sec){halt();cur=sec;parts=sec?textOf(sec):[];idx=0;state='idle';btn.hidden=!parts.length||btn.dataset.sinvoz==='1';paint()}
  function visible(){for(var i=0;i<secs.length;i++)if(!secs[i].hidden)return secs[i];return null}
  btn.addEventListener('click',function(){if(state==='playing'){pause();auto=false}else{play();auto=true}try{localStorage.setItem(KEY,auto?'on':'off')}catch(e){}});
  ['pointerdown','keydown'].forEach(function(ev){document.addEventListener(ev,function(){touched=true},true)});
  var pend=0;new MutationObserver(function(){clearTimeout(pend);pend=setTimeout(function(){var v=visible();if(v===cur)return;load(v);if(v&&auto&&touched)play()},60)})
    .observe(document.querySelector('.wrap')||document.body,{subtree:true,attributes:true,attributeFilter:['hidden']});
  window.addEventListener('pagehide',halt);try{SY.getVoices()}catch(e){}
  // los módulos que ya traían un botón propio de lectura lo ceden a este
  [].forEach.call(document.querySelectorAll('.listen'),function(b){b.hidden=true});
  load(visible());
  function checkVoices(){var v=[];try{v=SY.getVoices()||[]}catch(e){}if(v.length&&!voice()){halt();btn.hidden=true;btn.dataset.sinvoz='1'}}
  try{SY.addEventListener('voiceschanged',checkVoices)}catch(e){}setTimeout(checkVoices,1500);
})();

(function(){ // en el celular, Reiniciar es solo un ícono: la pregunta de confirmación se muestra como globo
  var r=document.querySelector('.rstm');if(!r)return;
  new MutationObserver(function(){if(r.classList.contains('armed'))r.setAttribute('data-ask',r.textContent.trim());else r.removeAttribute('data-ask')}).observe(r,{attributes:true,attributeFilter:['class']});
})();
(function(){
  // Guarda el mejor puntaje del repaso de esta parte (para Mi avance) y abre la lección que pide el enlace: #l3, #repaso.
  var K=document.documentElement.getAttribute('data-cac'),sc=document.getElementById('score');
  if(K&&sc&&window.MutationObserver){var save=function(){if(sc.hidden)return;var m=(sc.textContent||'').match(/^(\d+) de (\d+)/);if(!m)return;
    try{var R=JSON.parse(localStorage.getItem('cac-rep')||'{}')||{},ok=+m[1],t=+m[2];if(!R[K]||ok>R[K].ok){R[K]={ok:ok,t:t};localStorage.setItem('cac-rep',JSON.stringify(R))}}catch(e){}};
    new MutationObserver(save).observe(sc,{attributes:true,childList:true,characterData:true,subtree:true})}
  var h='';try{h=location.hash.slice(1)}catch(e){}
  if(/^(l\d+|repaso)$/.test(h)){var b=document.querySelector('#nav button[data-l="'+h+'"]');if(b)setTimeout(function(){b.click();window.scrollTo(0,0)},0)}
})();
(function(){
  // Simuladores en 3D: la base (cac3d.js) y Three.js se descargan recién cuando se abre una lección que los usa.
  // Si el navegador no puede mostrar 3D, o no hay conexión la primera vez, queda el simulador 2D.
  var H=document.documentElement,pg=H.getAttribute('data-d3');if(!pg)return;
  var ids=(H.getAttribute('data-d3-l')||'').split(' '),go=false;
  function check(){if(go)return;for(var i=0;i<ids.length;i++){var s=document.getElementById(ids[i]);if(s&&!s.hidden){go=true;start();return}}}
  function start(){var t=document.createElement('canvas');if(!(t.getContext('webgl2')||t.getContext('webgl')))return;
    import('./cac3d.js').then(function(m){return m.boot(pg)}).catch(function(e){console.warn('3D no disponible, sigue el 2D:',e)})}
  if(window.MutationObserver)new MutationObserver(check).observe(document.querySelector('.wrap')||document.body,{subtree:true,attributes:true,attributeFilter:['hidden']});
  check();
})();

/* simulador: junta paso, reto, controles y mensajes en un panel aparte del visual, y mide la barra fija de arriba */
(function(){
  var VIS=/^(CANVAS)$/,VC=['vs','gwrap','v3d','tag','sello','cv-ghost'];
  function lay(){[].forEach.call(document.querySelectorAll('.sim'),function(s){var p=s.querySelector(':scope>.spanel');if(!p){p=document.createElement('div');p.className='spanel';s.appendChild(p)}
    [].slice.call(s.children).forEach(function(e){if(e===p||VIS.test(e.tagName))return;for(var i=0;i<VC.length;i++)if(e.classList.contains(VC[i]))return;p.appendChild(e)});[].forEach.call(s.querySelectorAll(':scope>.gwrap>.gside'),function(g){p.appendChild(g)});})}
  function stk(){var t=document.querySelector('.top'),h=0;if(t&&getComputedStyle(t).position==='sticky')h=Math.round(t.getBoundingClientRect().height);document.documentElement.style.setProperty('--stk',h+'px')}
  function go(){lay();stk();new MutationObserver(function(ms){var need=false;ms.forEach(function(m){if(m.target.classList&&m.target.classList.contains('sim'))need=true});if(need)lay()}).observe(document.body,{childList:true,subtree:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
  addEventListener('resize',stk);
})();
