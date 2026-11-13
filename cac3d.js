/* Capa a Capa · base 3D compartida (Three.js).
   Cada página registra sus escenas en 3d/<página>.js. Se carga recién al abrir una lección con 3D;
   si el navegador no puede mostrar 3D o falla la descarga, queda el simulador 2D de siempre.
   Un solo renderer por página: el lienzo se muda a la lección que está a la vista y solo dibuja cuando algo cambia. */
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
export {THREE};
export const MOB=matchMedia('(max-width:600px), (pointer:coarse)').matches;
export const COL={fil:0xFF9E70,fil2:0xEE8455,lip:0xFFB894,sup:0xC9D2E6,steel:0x8C98B4,dark:0x1D2333};
export const CSS={ui:'#FFB95E',pop:'#86D9B5',bad:'#FFB4AB',soft:'#B9C2D8',ink:'#E4E8F3',pri:'#A9C7FF'};
const DEFS={},LES={};
let R=null,ENV=null,cam,ctl,act=null,live=false,need=true,touched=false,last=0,M=null;

export function register(id,def){DEFS[id]=def}

/* ---------- materiales compartidos ---------- */
function stripes(){const c=document.createElement('canvas');c.width=4;c.height=32;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,32);
  g.addColorStop(0,'#555');g.addColorStop(.5,'#fff');g.addColorStop(1,'#555');x.fillStyle=g;x.fillRect(0,0,4,32);return c}
function noise(){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),d=x.createImageData(128,128);
  for(let i=0;i<d.data.length;i+=4){const v=110+Math.random()*60;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}x.putImageData(d,0,0);return c}
function layerTex(period){const t=new THREE.CanvasTexture(stripes());t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(1,1/period);return t}
function mats(){
  const nt=new THREE.CanvasTexture(noise());nt.wrapS=nt.wrapT=THREE.RepeatWrapping;nt.repeat.set(6,6);
  const S=(o)=>new THREE.MeshStandardMaterial(o);
  return {
    fil:S({color:COL.fil,roughness:.5}),fil2:S({color:COL.fil2,roughness:.55}),lip:S({color:COL.lip,roughness:.45}),
    filD:S({color:COL.fil,roughness:.5,side:THREE.DoubleSide}),fil2D:S({color:COL.fil2,roughness:.55,side:THREE.DoubleSide}),
    pei:S({color:0x232A3B,roughness:.78,metalness:.2,roughnessMap:nt,bumpMap:nt,bumpScale:.25}),
    alu:S({color:0x9AA6BF,roughness:.32,metalness:.85}),steel:S({color:COL.steel,roughness:.35,metalness:.9}),
    dark:S({color:COL.dark,roughness:.6,metalness:.3}),brass:S({color:0xD9A441,roughness:.3,metalness:.95}),
    hot:S({color:0xFFE3A3,emissive:0xFF9440,emissiveIntensity:.9,roughness:.4}),
    sup:S({color:COL.sup,roughness:.7,transparent:true,opacity:.85}),
    air:new THREE.LineBasicMaterial({color:0x86D9B5,transparent:true,opacity:.6}),
    line:new THREE.LineBasicMaterial({color:0x56627D,transparent:true,opacity:.35}),
    ui:new THREE.LineBasicMaterial({color:0xFFB95E}),uiDash:new THREE.LineDashedMaterial({color:0xFFB95E,dashSize:.8,gapSize:.6})}
}

/* ---------- ayudas de geometría ---------- */
function rrectPath(w,d,r,hole){const p=hole?new THREE.Path():new THREE.Shape(),a=w/2,b=d/2;r=Math.min(r,a,b);
  p.moveTo(-a+r,-b);p.lineTo(a-r,-b);p.quadraticCurveTo(a,-b,a,-b+r);p.lineTo(a,b-r);p.quadraticCurveTo(a,b,a-r,b);
  p.lineTo(-a+r,b);p.quadraticCurveTo(-a,b,-a,b-r);p.lineTo(-a,-b+r);p.quadraticCurveTo(-a,-b,-a+r,-b);return p}
function extrudeUp(shape,h,y){const g=new THREE.ExtrudeGeometry(shape,{depth:h,bevelEnabled:false,curveSegments:6});g.rotateX(-Math.PI/2);if(y)g.translate(0,y,0);return g}

function makeCtx(L){
  const scene=new THREE.Scene();scene.environment=ENV;scene.environmentIntensity=.22;
  const span=L.def.span||45;
  scene.add(new THREE.HemisphereLight(0xC6D6FF,0x141A27,.55));
  const sun=new THREE.DirectionalLight(0xFFE3BF,2.4);sun.position.set(span*.9,span*1.8,span*.7);sun.castShadow=true;
  const ss=MOB?512:1024;sun.shadow.mapSize.set(ss,ss);sun.shadow.radius=4;sun.shadow.bias=-.0004;sun.shadow.normalBias=span/750;
  Object.assign(sun.shadow.camera,{left:-span,right:span,top:span,bottom:-span,near:span*.3,far:span*4.5});scene.add(sun);
  const rim=new THREE.DirectionalLight(0x7FA4FF,1.1);rim.position.set(-span*1.3,span*.7,-span*1.1);scene.add(rim);
  const box=L.box;
  const E={THREE,scene,MOB,COL,CSS,M,sec:L.sec,
    need(){need=true},
    val(id){return +document.getElementById(id).value},
    chip(id,attr){const b=document.querySelector('#'+id+' [aria-pressed="true"]');return b?b.dataset[attr]:null},
    layerTex,rrectPath,extrudeUp,
    /* material de filamento con líneas de capa (para piezas hechas con extrudeUp) */
    layered(color,period,extra){return new THREE.MeshStandardMaterial(Object.assign({color,roughness:.5,bumpMap:layerTex(period||.4),bumpScale:.6},extra||{}))},
    mesh(g,m,shadow){const o=new THREE.Mesh(g,m);if(shadow!==false){o.castShadow=true;o.receiveShadow=true}return o},
    /* cama: placa PEI sobre base de aluminio, con cuadrícula fina */
    bed(w,d,opt){opt=opt||{};const g=new THREE.Group(),pl=new THREE.Mesh(new THREE.BoxGeometry(w,1.2,d),M.pei);pl.position.y=-.6;pl.receiveShadow=true;g.add(pl);
      const al=new THREE.Mesh(new THREE.BoxGeometry(w+4,3,d+4),M.alu);al.position.y=-2.7;al.receiveShadow=true;g.add(al);
      if(opt.grid!==false){const st=opt.grid||10,p=[];for(let k=-Math.floor(w/2/st)*st;k<=w/2;k+=st)p.push(k,.02,-d/2,k,.02,d/2);for(let k=-Math.floor(d/2/st)*st;k<=d/2;k+=st)p.push(-w/2,.02,k,w/2,.02,k);
        const gg=new THREE.BufferGeometry();gg.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.add(new THREE.LineSegments(gg,M.line))}
      scene.add(g);return g},
    /* tubo de pared redondeada (paredes de una pieza) */
    shell(w,d,r,th,h,mat,y){const s=rrectPath(w,d,r);s.holes.push(rrectPath(w-2*th,d-2*th,Math.max(.2,r-th*.7),true));return E.mesh(extrudeUp(s,h,y||0),mat)},
    slab(w,d,r,h,mat,y){return E.mesh(extrudeUp(rrectPath(w,d,r),h,y||0),mat)},
    /* línea de plástico recta: cilindro aplanado de ancho w y alto h, de a hasta b (en el plano XZ, a la altura y) */
    bead(ax,az,bx,bz,y,w,h,mat){const l=Math.hypot(bx-ax,bz-az),g=new THREE.CylinderGeometry(.5,.5,l,14,1);g.rotateZ(Math.PI/2);g.scale(1,h,w);
      const o=E.mesh(g,mat);o.position.set((ax+bx)/2,y+h/2,(az+bz)/2);o.rotation.y=-Math.atan2(bz-az,bx-ax);return o},
    /* línea curva (puentes, hilos): tubo por una lista de puntos */
    tube(pts,r,mat,seg){const c=new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(p[0],p[1],p[2])));return E.mesh(new THREE.TubeGeometry(c,seg||Math.max(8,pts.length*6),r,8,false),mat)},
    /* tabiques de relleno o paredes finas: bandas [y0,y1,segmentos[[x0,z0,x1,z1]...]] -> malla; ends sirve para hacerla crecer por capas */
    ribbons(bands,th,mat){const pos=[],nor=[],ends=[],h=th/2;
      const quad=(a,b,c,e,n)=>{pos.push(...a,...b,...c,...a,...c,...e);for(let i=0;i<6;i++)nor.push(...n)};
      bands.forEach(bd=>{const y0=bd[0],y1=bd[1];bd[2].forEach(s=>{const dx=s[2]-s[0],dz=s[3]-s[1],l=Math.hypot(dx,dz);if(l<.03)return;const ux=-dz/l*h,uz=dx/l*h;
        quad([s[0]+ux,y0,s[1]+uz],[s[2]+ux,y0,s[3]+uz],[s[2]+ux,y1,s[3]+uz],[s[0]+ux,y1,s[1]+uz],[ux/h,0,uz/h]);
        quad([s[2]-ux,y0,s[3]-uz],[s[0]-ux,y0,s[1]-uz],[s[0]-ux,y1,s[1]-uz],[s[2]-ux,y1,s[3]-uz],[-ux/h,0,-uz/h]);
        quad([s[0]+ux,y1,s[1]+uz],[s[2]+ux,y1,s[3]+uz],[s[2]-ux,y1,s[3]-uz],[s[0]-ux,y1,s[1]-uz],[0,1,0])});ends.push(pos.length/3)});
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));
      const o=E.mesh(g,mat);o.userData.ends=ends;return o},
    /* hacer crecer una malla de ribbons de abajo hacia arriba (0..1) */
    grow(o,k){const e=o&&o.userData.ends;if(!e)return;if(k>=1){o.geometry.setDrawRange(0,Infinity);return}const i=Math.floor(k*e.length);o.geometry.setDrawRange(0,i?e[i-1]:0)},
    /* recortar un segmento a un rectángulo (Liang-Barsky) */
    clipSeg(a,b,c,d,X0,Z0,X1,Z1){let t0=0,t1=1;const dx=c-a,dy=d-b,p=[-dx,dx,-dy,dy],q=[a-X0,X1-a,b-Z0,Z1-b];
      for(let i=0;i<4;i++){if(p[i]===0){if(q[i]<0)return null}else{const r=q[i]/p[i];if(p[i]<0){if(r>t1)return null;if(r>t0)t0=r}else{if(r<t0)return null;if(r<t1)t1=r}}}
      return [a+t0*dx,b+t0*dy,a+t1*dx,b+t1*dy]},
    /* cabezal: bloque calefactor, boquilla de bronce y disipador; la punta queda en (0,0,0) */
    nozzle(s){s=s||1;const g=new THREE.Group();
      const tip=new THREE.Mesh(new THREE.CylinderGeometry(.9*s,.22*s,1.6*s,24),M.brass);tip.position.y=.8*s;g.add(tip);
      const hex=new THREE.Mesh(new THREE.CylinderGeometry(1.7*s,1.7*s,1.2*s,6),M.brass);hex.position.y=2.2*s;g.add(hex);
      const blk=new THREE.Mesh(new THREE.BoxGeometry(6*s,4*s,5*s),M.alu);blk.position.set(1.2*s,4.8*s,0);g.add(blk);
      const hs=new THREE.Mesh(new THREE.CylinderGeometry(.9*s,.9*s,3*s,16),M.steel);hs.position.y=8.3*s;g.add(hs);
      for(let i=0;i<6;i++){const f=new THREE.Mesh(new THREE.CylinderGeometry(3*s,3*s,.35*s,28),M.alu);f.position.y=(10+i*.9)*s;g.add(f)}
      g.traverse(o=>{if(o.isMesh)o.castShadow=true});scene.add(g);return g},
    /* ventilador con aspas que giran: devuelve {g,spin(dt,velocidad)} */
    fan(s){s=s||1;const g=new THREE.Group(),fr=new THREE.Mesh(new THREE.BoxGeometry(8*s,2*s,8*s),M.dark);g.add(fr);
      const hole=new THREE.Mesh(new THREE.CylinderGeometry(3.6*s,3.6*s,2.1*s,32),new THREE.MeshStandardMaterial({color:0x10141F,roughness:.9}));g.add(hole);
      const bl=new THREE.Group();for(let i=0;i<7;i++){const b=new THREE.Mesh(new THREE.BoxGeometry(3*s,.2*s,1.1*s),M.steel);b.position.x=1.8*s;b.rotation.x=.45;const p=new THREE.Group();p.add(b);p.rotation.y=i*Math.PI*2/7;bl.add(p)}
      const hub=new THREE.Mesh(new THREE.CylinderGeometry(1*s,1*s,.6*s,20),M.dark);bl.add(hub);bl.position.y=-.4*s;g.add(bl);
      g.traverse(o=>{if(o.isMesh)o.castShadow=true});scene.add(g);return {g,spin(dt,v){bl.rotation.y+=dt*v*30}}},
    /* línea punteada o arco (medidas) */
    line(pts,dashed){const g=new THREE.BufferGeometry().setFromPoints(pts.map(p=>new THREE.Vector3(p[0],p[1],p[2])));const l=new THREE.Line(g,dashed?M.uiDash:M.ui);if(dashed)l.computeLineDistances();scene.add(l);return l},
    /* etiquetas de texto ancladas a un punto 3D, el cartel de estado y el gráfico chico */
    label(key,p,text,tone){let o=L.labels[key];if(!o){const el=document.createElement('span');el.className='lab3';box.appendChild(el);o=L.labels[key]={el,v:new THREE.Vector3()}}
      o.v.set(p[0],p[1],p[2]);o.el.textContent=text;o.el.classList.toggle('s',tone===CSS.soft);o.el.style.color=tone||CSS.ink;o.el.hidden=false;need=true},
    unlabel(key){const o=L.labels[key];if(o)o.el.hidden=true},
    pill(text,tone){let el=box.querySelector('.pill3');if(!el){el=document.createElement('span');el.className='pill3';box.appendChild(el)}el.textContent=text;el.style.setProperty('--t',tone||CSS.ui)},
    title(text){let el=box.querySelector('.ttl3');if(!el){el=document.createElement('span');el.className='ttl3';box.appendChild(el)}el.textContent=text},
    chart(fn){let c=box.querySelector('.ch3');if(!c){c=document.createElement('canvas');c.className='ch3';c.setAttribute('aria-hidden','true');box.appendChild(c)}L.chartFn=fn;drawChart(L)},
    redraw(){drawChart(L)}};
  return E;
}
function drawChart(L){const c=L.box.querySelector('.ch3');if(!c||!L.chartFn)return;const r=c.getBoundingClientRect(),dp=Math.min(devicePixelRatio||1,2);if(r.width<10)return;
  if(c.width!==Math.round(r.width*dp)){c.width=Math.round(r.width*dp);c.height=Math.round(r.height*dp)}const x=c.getContext('2d');x.setTransform(dp,0,0,dp,0,0);x.clearRect(0,0,r.width,r.height);L.chartFn(x,r.width,r.height)}

/* ---------- renderer único ---------- */
function core(){
  const cv=document.createElement('canvas');cv.className='g3';cv.setAttribute('aria-hidden','true');
  R=new THREE.WebGLRenderer({canvas:cv,antialias:!MOB||devicePixelRatio<2,alpha:true,powerPreference:'low-power'});
  R.setPixelRatio(Math.min(devicePixelRatio||1,MOB?1.5:1.75));R.outputColorSpace=THREE.SRGBColorSpace;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.05;
  R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;R.localClippingEnabled=true;
  ENV=new THREE.PMREMGenerator(R).fromScene(new RoomEnvironment(),.04).texture;M=mats();
  cam=new THREE.PerspectiveCamera(32,1,.1,3000);
  ctl=new OrbitControls(cam,cv);ctl.enableDamping=true;ctl.dampingFactor=.08;ctl.enablePan=false;ctl.autoRotateSpeed=.9;
  ctl.addEventListener('change',()=>{need=true});
  ctl.addEventListener('start',()=>{ctl.autoRotate=false;if(act)act.spun=true;if(!touched){touched=true;document.querySelectorAll('.v3d .hint3').forEach(h=>h.classList.add('off'))}});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&act&&!act.sec.hidden){need=true;run()}});
  addEventListener('pagehide',()=>{live=false});
}
function mk(id){
  const def=DEFS[id],sec=document.getElementById(id),cv=def.cv?document.getElementById(def.cv):sec.querySelector('.sim canvas');
  const box=document.createElement('div');box.className='v3d';box.hidden=true;
  const r=cv.getBoundingClientRect();box.style.setProperty('--ar',r.width>10&&r.height>10?(r.width/r.height).toFixed(3):(def.ar||'5/2'));
  box.innerHTML='<span class="hint3'+(touched?' off':'')+'">Arrastrá para girar</span>';cv.parentNode.insertBefore(box,cv);
  const L={id,def,sec,cv,box,labels:{},spun:false,view:null};L.E=makeCtx(L);L.scene=L.E.scene;L.inst=def.build(L.E)||{};
  new ResizeObserver(()=>{if(act===L){size();drawChart(L)}}).observe(box);
  const upd=()=>{if(L.inst.update)L.inst.update();need=true;run()};
  const sim=sec.querySelector('.sim');sim.addEventListener('input',upd);sim.addEventListener('click',()=>setTimeout(upd,0));
  return L;
}
function size(){if(!act)return;const r=act.box.getBoundingClientRect();if(r.width<10)return;R.setSize(r.width,r.height,false);cam.aspect=r.width/r.height;
  const port=cam.aspect<1.5,v=act.def.view||{};cam.fov=port?(v.fovP||38):(v.fov||32);cam.updateProjectionMatrix();
  if(!act.view&&v.targetP&&port)ctl.target.fromArray(v.targetP);need=true}
function place(L){const r=L.box.getBoundingClientRect(),v=new THREE.Vector3();for(const k in L.labels){const o=L.labels[k];if(o.el.hidden)continue;v.copy(o.v).project(cam);
  if(v.z>1){o.el.style.opacity=0;continue}o.el.style.opacity=1;o.el.style.transform='translate('+((v.x+1)/2*r.width).toFixed(1)+'px,'+((1-v.y)/2*r.height).toFixed(1)+'px) translate(-50%,-50%)'}}
function enter(id){
  let L=LES[id];
  if(!L){try{L=LES[id]=mk(id)}catch(e){console.warn('3D: no se pudo armar '+id,e);delete DEFS[id];return false}}
  if(act&&act!==L)act.view={p:cam.position.clone(),t:ctl.target.clone()};
  L.box.hidden=false;L.cv.hidden=true;L.box.prepend(R.domElement);act=L;
  const v=L.def.view||{};ctl.minDistance=v.min||20;ctl.maxDistance=v.max||200;ctl.maxPolarAngle=v.maxPolar||1.45;ctl.minPolarAngle=v.minPolar||0;
  const rb=L.box.getBoundingClientRect(),port=rb.height>0&&rb.width/rb.height<1.5;
  if(L.view){cam.position.copy(L.view.p);ctl.target.copy(L.view.t)}else{cam.position.fromArray((port&&v.posP)||v.pos||[50,50,60]);ctl.target.fromArray((port&&v.targetP)||v.target||[0,5,0])}
  size();ctl.autoRotate=!L.spun&&v.spin!==false;ctl.update();
  try{if(L.inst.update)L.inst.update();if(L.inst.enter)L.inst.enter()}catch(e){console.warn(e)}
  drawChart(L);need=true;run();return true}
function frame(now){if(!live)return;if(!act||act.sec.hidden||act.box.hidden||document.hidden){live=false;return}
  const t=now/1000,dt=Math.min(.05,Math.max(0,t-last));last=t;
  if(act.inst.tick&&act.inst.tick(t,dt))need=true;if(ctl.update())need=true;
  if(need){R.render(act.scene,cam);place(act);need=false}requestAnimationFrame(frame)}
function run(){if(!live){live=true;last=performance.now()/1000;requestAnimationFrame(frame)}}

/* La página llama a CAC3D.take(lección) desde su bucle de dibujo: si la lección tiene escena 3D, la toma. */
export async function boot(page){
  await import('./3d/'+page+'.js');core();
  window.CAC3D={take(id){return !!DEFS[id]&&enter(id)}};
  const vis=Object.keys(DEFS).find(k=>{const s=document.getElementById(k);return s&&!s.hidden});
  if(vis){if(window.CAC3Dstop)window.CAC3Dstop();if(!enter(vis)&&window.CAC3Dagain)window.CAC3Dagain()}
}
