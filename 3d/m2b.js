/* Capa a Capa · escenas 3D del módulo 2, parte 2 (lecciones 2.6 a 2.9). La 2.10 (diagrama) y la 2.11 (gráfico) quedan en 2D. */
import {register,THREE} from '../cac3d.js';
function clear(g){while(g.children.length){const o=g.children.pop();o.traverse(x=>{if(x.geometry)x.geometry.dispose()})}}
function group(E){const g=new THREE.Group();E.scene.add(g);return g}

/* ---------- 2.6 extrusor Bowden y directo ---------- */
register('l1',{span:40,view:{pos:[0,34,78],target:[0,12,0],posP:[0,46,120],targetP:[0,14,0],min:40,max:220},build(E){
  const M=E.M,side=[];
  [[-20,false],[20,true]].forEach(([cx,direct])=>{const g=new THREE.Group();g.position.x=cx;E.scene.add(g);
    const bed=E.mesh(new THREE.BoxGeometry(30,1,14),M.pei);bed.position.y=-.5;g.add(bed);const post=E.mesh(new THREE.BoxGeometry(2.4,30,2.4),new THREE.MeshStandardMaterial({color:0x2A3142,roughness:.45,metalness:.6}));post.position.set(-16,14,-4);g.add(post);
    [-7,7].forEach(x=>{for(let k=0;k<7;k++)g.add(E.bead(x,-2.5,x,2.5,k,4,1,k%2?M.fil2:M.fil))});
    const head=new THREE.Group();g.add(head);const hb=E.mesh(new THREE.BoxGeometry(4,4,4),new THREE.MeshStandardMaterial({color:0x313C55,roughness:.5}));hb.position.y=3.2;head.add(hb);
    const nz=E.mesh(new THREE.ConeGeometry(.7,1.4,14),M.brass);nz.rotation.x=Math.PI;nz.position.y=.7;head.add(nz);
    const ext=new THREE.Group();const eb=E.mesh(new THREE.BoxGeometry(5,4,4),new THREE.MeshStandardMaterial({color:0x4E5D83,roughness:.5}));ext.add(eb);
    const gears=[-1,1].map(s=>{const gr=E.mesh(new THREE.CylinderGeometry(1.1,1.1,4.4,10),M.steel);gr.rotation.x=Math.PI/2;gr.position.x=s*1.1;ext.add(gr);return gr});
    if(direct){ext.position.y=7.6;head.add(ext)}else{ext.position.set(-16,26,-1.4);g.add(ext)}
    const strings=new THREE.Group();g.add(strings);let tube=null,fil=null;
    side.push({g,head,ext,gears,strings,direct,setTube(tpu){if(tube){g.remove(tube);tube.geometry.dispose()}if(fil){(direct?head:g).remove(fil);fil.geometry.dispose()}
      if(direct){fil=E.mesh(new THREE.CylinderGeometry(.35,.35,12,10),M.fil);fil.position.y=16;head.add(fil);return}
      const pts=[];for(let i=0;i<=24;i++){const u=i/24;pts.push(new THREE.Vector3(0,0,0))}tube={u:0}},
      path(hx){const p0=new THREE.Vector3(-16,24,-1.4),p3=new THREE.Vector3(hx,13.4,0),p1=new THREE.Vector3(-16,10,-1.4),p2=new THREE.Vector3(hx,26,0);return new THREE.CubicBezierCurve3(p0,p1,p2,p3)}})});
  const tubeM=new THREE.MeshStandardMaterial({color:0xE4E8F3,transparent:true,opacity:.28,roughness:.2,depthWrite:false});let TPU=null,bow={t:null,f:null};
  return {update(){const tpu=(E.chip('mat1','m')||'pla')==='tpu';TPU=tpu;side.forEach(s=>{clear(s.strings);const q=s.direct?(tpu?.2:0):(tpu?1:.4),n=Math.round(q*5);
        for(let k=0;k<n;k++){const y=7-(k+.6)*1.15,z=-2+k,pts=[];for(let i=0;i<=8;i++){const u=i/8;pts.push([-5+10*u,y-Math.sin(Math.PI*u)*(.5+(k%2)*.4),z])}s.strings.add(E.tube(pts,.05+q*.07,M.fil,16))}
        E.label('v'+(s.direct?1:0),[s.g.position.x,-2,9],s.direct?(tpu?'Responde bien, con algún hilo fino':'Corte limpio: responde al instante'):(tpu?'El flexible se arruga en el tubo: hilos':'Responde con retraso: necesita más retracción'),q===0?E.CSS.pop:q>=1?E.CSS.bad:E.CSS.ui);
        E.label('t'+(s.direct?1:0),[s.g.position.x,32,0],s.direct?'Directo · el motor va sobre el cabezal':'Bowden · el motor empuja de lejos',E.CSS.soft)});
      const d=side[1];if(d.fil){d.head.remove(d.fil);d.fil.geometry.dispose()}d.fil=E.mesh(new THREE.CylinderGeometry(.35,.35,10,10),M.fil);d.fil.position.y=14.6;d.head.add(d.fil)},
    tick(t){const ph=(t*.22)%1,trav=ph<.1||(ph>=.5&&ph<.6),xa=-7,xb=7,hx=ph<.1?xb+(xa-xb)*(ph/.1):ph<.5?xa:ph<.6?xa+(xb-xa)*((ph-.5)/.1):xb;
      side.forEach(s=>{s.head.position.set(hx,7.2,0);const ga=trav?-t*12:t*3;s.gears[0].rotation.y=ga;s.gears[1].rotation.y=-ga});
      const b=side[0],c=b.path(hx);if(bow.t){b.g.remove(bow.t);bow.t.geometry.dispose()}if(bow.f){b.g.remove(bow.f);bow.f.geometry.dispose()}
      bow.t=E.mesh(new THREE.TubeGeometry(c,40,.75,10,false),tubeM,false);b.g.add(bow.t);
      const pts=[];for(let i=0;i<=60;i++){const u=i/60,p=c.getPointAt(u),w=TPU?Math.sin(u*46+t*5)*.32*Math.sin(u*Math.PI):0;pts.push([p.x+w,p.y,p.z+w*.5])}bow.f=E.tube(pts,.3,M.fil,90);b.g.add(bow.f);return true}};
}});

/* ---------- 2.7 el hotend por dentro (el calor se calcula en la página) ---------- */
register('l2',{span:20,keep2d:true,view:{pos:[28,9,36],target:[1,6,0],posP:[34,12,48],targetP:[1,7,0],min:16,max:90},build(E){
  const M=E.M,CUT=[new THREE.Plane(new THREE.Vector3(0,0,-1),0)],D=THREE.DoubleSide;
  const heat=T=>{const a=new THREE.Color(0x6D8FD6),b=new THREE.Color(0xF2C56B),d=new THREE.Color(0xFF6A3D);return T<110?a.lerp(b,Math.max(0,(T-25)/85)):b.lerp(d,Math.min(1,(T-110)/100))};
  const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.45,metalness:.4,clippingPlanes:CUT,side:D});
  const fins=[];for(let k=0;k<7;k++){const m=mat(0x6D8FD6),f=E.mesh(new THREE.CylinderGeometry(4.6,4.6,1.1,32),m);f.position.y=17-k*1.7;E.scene.add(f);fins.push(f)}
  const core=E.mesh(new THREE.CylinderGeometry(1.7,1.7,12,24),mat(0x6D8FD6));core.position.y=12.5;E.scene.add(core);
  const brk=E.mesh(new THREE.CylinderGeometry(.95,.95,3,16),mat(0xF2C56B));brk.position.y=5;E.scene.add(brk);
  const blkM=mat(0xFF6A3D);blkM.emissive=new THREE.Color(0xFF4A1D);blkM.emissiveIntensity=.35;const blk=E.mesh(new THREE.BoxGeometry(8.4,5,6),blkM);blk.position.y=1;E.scene.add(blk);
  const noz=E.mesh(new THREE.CylinderGeometry(2,.6,3.4,24),new THREE.MeshStandardMaterial({color:0xD9A441,roughness:.3,metalness:.95,clippingPlanes:CUT,side:D}));noz.position.y=-3.2;E.scene.add(noz);
  const chan=E.mesh(new THREE.CylinderGeometry(.6,.6,26,12),new THREE.MeshStandardMaterial({color:0x141B2B,roughness:.9}));chan.position.y=7;chan.scale.z=.01;chan.position.z=.02;E.scene.add(chan);
  const filM=new THREE.MeshStandardMaterial({color:0xFF9E70,roughness:.45}),fil=E.mesh(new THREE.BoxGeometry(.84,1,.1),filM,false);E.scene.add(fil);
  const molM=new THREE.MeshStandardMaterial({color:0xFFE9B8,emissive:0xFF9440,emissiveIntensity:.5,roughness:.4}),mol=E.mesh(new THREE.BoxGeometry(.84,1,.1),molM,false);E.scene.add(mol);
  const blob=E.mesh(new THREE.SphereGeometry(1,16,10),molM,false);blob.scale.set(.8,1.5,.1);E.scene.add(blob);
  const drip=E.mesh(new THREE.CylinderGeometry(.3,.3,2.4,10),molM,false);drip.position.y=-6.1;E.scene.add(drip);
  const bed=E.mesh(new THREE.BoxGeometry(18,1,8),M.pei);bed.position.y=-8;E.scene.add(bed);
  const fan=E.fan(1.05);fan.g.position.set(9.6,13,0);fan.g.rotation.z=Math.PI/2;
  const air=[];for(let k=0;k<6;k++){const l=E.line([[0,0,0],[-1.6,0,0]]);l.material=E.M.air.clone();air.push(l)}
  E.label('a',[-6,13,0],'Disipador',E.CSS.ink);E.label('b',[-3,5,0],'Heatbreak',E.CSS.ink);E.label('c',[-6.5,1,0],'Bloque calentador',E.CSS.ink);E.label('d',[-3,-3.5,0],'Boquilla',E.CSS.ink);
  return {tick(t,dt){const s=E.state('l2'),hc=s.hc||0,jam=hc>.78,fanOn=document.getElementById('fan2').checked,Ths=40+hc*135;
      fins.forEach((f,k)=>f.material.color.copy(heat(30+(Ths-30)*(.45+.55*(6-k)/6))));core.material.color.copy(heat(30+(Ths-30)*.8));brk.material.color.copy(heat((Ths+205)/2));
      const my=19.5-hc*10.5,yb=20-my*.9;fil.scale.y=26-yb;fil.position.set(0,(26+yb)/2,.06);mol.scale.y=Math.max(.1,yb+5.2);mol.position.set(0,(yb-5.2)/2,.06);
      blob.visible=hc>.3&&my<15;blob.position.set(0,Math.min(20-14.2*.9,yb-1.4),.06);blob.scale.set(.6+.35*hc,1.5,.1);
      drip.visible=!jam;fan.spin(dt,fanOn?1:0);air.forEach((l,k)=>{l.visible=fanOn;const o=(t*8+k*1.5)%7;l.position.set(5-o,10+k*1.6,0)});
      E.label('z',[10,19,0],'Zona fría '+Math.round(Ths)+' °C',Ths>110?E.CSS.bad:E.CSS.pri);E.label('h',[13,.5,0],'Zona caliente 210 °C',E.CSS.bad);
      E.pill(jam?'ATASCO':hc>.45?'el calor está subiendo':'flujo normal',jam?E.CSS.bad:hc>.45?E.CSS.ui:E.CSS.pop);return true}};
}});

/* ---------- 2.8 boquillas ---------- */
register('l3',{span:9,view:{pos:[3,13,19],target:[0.5,1,0],posP:[4,18,27],targetP:[0.5,1.5,0],min:6,max:50},build(E){
  const M=E.M,CUT=[new THREE.Plane(new THREE.Vector3(0,0,-1),0)];E.bed(26,12,{grid:1});
  const nz=new THREE.Group();nz.position.set(-7,3.2,0);E.scene.add(nz);const G=group(E);let D=-1,t0=0;
  const brass=new THREE.MeshStandardMaterial({color:0xD9A441,roughness:.3,metalness:.95,clippingPlanes:CUT,side:THREE.DoubleSide});
  E.label('a',[-7,0,3],'Boquilla · en corte',E.CSS.soft);E.label('b',[0.5,0,3.2],'Peine · dientes cada 1,2 mm',E.CSS.soft);E.label('c',[7.5,0,3.2],'Espiral · paso 1,1 mm',E.CSS.soft);
  function build(d){clear(nz);const prof=[[.001,0],[d/2,0],[d/2,.35],[1.25,1.6],[1.25,2.6],[0.001,2.6]].map(p=>new THREE.Vector2(p[0],p[1]));
    const outer=[[d/2+.02,0],[1.1,0],[3.4*.5,1.6],[1.7,3.2],[d/2+.02,3.2]].map(p=>new THREE.Vector2(p[0],p[1]));nz.add(E.mesh(new THREE.LatheGeometry(outer,40),brass));
    const melt=E.mesh(new THREE.LatheGeometry(prof,40),new THREE.MeshStandardMaterial({color:0xFFE9B8,emissive:0xFF9440,emissiveIntensity:.5,clippingPlanes:CUT,side:THREE.DoubleSide}),false);nz.add(melt);
    const str=E.mesh(new THREE.CylinderGeometry(d/2,d/2,1.6,16),M.fil);str.position.y=-.8;nz.add(str)}
  function comb(d,p){const ox=-3.1,lw=d,h=.6,s=[];s.push([ox-.4,0,ox+7.6,0]);const nf=Math.ceil(p*7);for(let k=0;k<nf;k++){const fr=Math.min(1,p*7-k),x=ox+k*1.2;s.push([x,0,x,-6*fr])}
    s.forEach(q=>{const l=Math.hypot(q[2]-q[0],q[3]-q[1]);if(l<.05)return;G.add(E.bead(q[0],q[1]+3,q[2],q[3]+3,0,lw,h,M.fil))})}
  function spiral(d,p){const tm=2*Math.PI*4.2*p,pts=[];for(let th=0;th<=tm;th+=.12){const r=1.1/(2*Math.PI)*th;pts.push([7.5+Math.cos(th)*r,.3,Math.sin(th)*r])}if(pts.length<3)return;
    const c=new THREE.CatmullRomCurve3(pts.map(q=>new THREE.Vector3(...q)));const g=new THREE.TubeGeometry(c,Math.max(16,pts.length*2),d/2,10,false);g.scale(1,.6/d,1);g.translate(0,.3-.3*.6/d,0);G.add(E.mesh(g,M.fil))}
  return {update(){const d=+(E.chip('noz3','d')||.4);if(d!==D){D=d;t0=performance.now();build(d)}
      E.pill(String(d).replace('.',',')+' mm · '+(d<=.2?'detalle fino, muy lento':d<=.4?'el equilibrio de siempre':d<=.6?'más rápido, menos detalle':'rapidísimo: los dientes se tocan'),d>=.8?E.CSS.bad:d===.4?E.CSS.pop:E.CSS.ui)},
    tick(){const p=Math.min(1,(performance.now()-t0)/2600);clear(G);comb(D,p);spiral(D,p);return p<1}};
}});

/* ---------- 2.9 cama y superficies ---------- */
register('l4',{span:24,view:{pos:[16,18,36],target:[0,3,0],posP:[20,24,50],targetP:[0,4,0],min:20,max:120},build(E){
  const M=E.M,RNG={PLA:[50,65],PETG:[65,85],ABS:[90,110],TPU:[40,60]};
  const heaterM=new THREE.MeshStandardMaterial({color:0x7C8AAE,roughness:.4,metalness:.7,emissive:0xFF4A1D,emissiveIntensity:0}),heater=E.mesh(new THREE.BoxGeometry(34,2.2,20),heaterM);heater.position.y=-1.1-.9;E.scene.add(heater);
  const glass=new THREE.MeshPhysicalMaterial({color:0xBEE1FF,roughness:.05,metalness:0,transmission:.6,transparent:true,opacity:.55,thickness:.8}),pei=new THREE.MeshStandardMaterial({color:0xD9A441,roughness:.35,metalness:.3});
  const tex=E.layerTex(.5);tex.repeat.set(30,30);const peiT=new THREE.MeshStandardMaterial({color:0xE8BB62,roughness:.75,metalness:.2,bumpMap:tex,bumpScale:2});
  const surf=E.mesh(new THREE.BoxGeometry(32,.9,18),glass);surf.position.y=-.45;E.scene.add(surf);
  const glue=E.mesh(new THREE.BoxGeometry(22,.06,12),new THREE.MeshStandardMaterial({color:0xFFFFFF,transparent:true,opacity:.45,roughness:.9}),false);glue.position.y=.03;E.scene.add(glue);
  const geo=new THREE.BoxGeometry(18,6,10,24,6,6),base=geo.attributes.position.array.slice();geo.translate(0,0,0);
  const absM=[new THREE.MeshStandardMaterial({color:0xFF9E70,roughness:.5})],piece=E.mesh(geo,absM[0]);E.scene.add(piece);
  const tear=E.mesh(new THREE.BoxGeometry(6,.35,4),pei);tear.visible=false;E.scene.add(tear);const hole=E.mesh(new THREE.BoxGeometry(6,.05,4),new THREE.MeshStandardMaterial({color:0x141B2B}),false);hole.position.y=.01;hole.visible=false;E.scene.add(hole);
  const waves=[];for(let k=0;k<7;k++){const pts=[];for(let i=0;i<=8;i++)pts.push([Math.sin(i*.8)*.4,i*.6,0]);const l=E.line(pts);l.material=new THREE.LineBasicMaterial({color:0xFFB38A,transparent:true,opacity:0});l.position.set(-14+k*4.6,7,-6);waves.push(l)}
  let st='bien',lift=0,foot=0,rip=0,hk=0,mat='PLA',sur='vidrio';
  function state(){const T=E.val('tb4'),ad=document.getElementById('adh4').checked,R=RNG[mat],g=sur==='vidrio'?(ad?'bien':'floja'):sur==='liso'?((mat==='PETG'||mat==='TPU')?(ad?'bien':'demasiado'):'bien'):'bien';if(T<R[0])return'fria';if(T>R[1]+8)return'pata';return g}
  return {update(){mat=E.chip('mat4','m')||'PLA';sur=E.chip('sur4','s')||'vidrio';st=state();const T=E.val('tb4');hk=Math.max(0,(T-25)/95);
      surf.material=sur==='vidrio'?glass:sur==='liso'?pei:peiT;glue.visible=document.getElementById('adh4').checked;
      piece.material.color.setHex(mat==='ABS'?0xE8E2D0:mat==='PETG'?0x7FB8E6:mat==='TPU'?0x86D9B5:0xFF9E70);heaterM.emissiveIntensity=hk*.7;waves.forEach(l=>{l.material.opacity=hk*.5});
      E.label('m',[0,7.4,0],mat,E.CSS.ink);E.label('t',[16,-1,10],T+' °C',E.CSS.ui);E.label('s',[-14,-1,10],sur==='vidrio'?'Vidrio':sur==='liso'?'PEI liso':'PEI texturado',E.CSS.soft);
      E.pill({fria:'esquinas levantadas',floja:'agarre flojo',bien:'bien pegada',demasiado:'pegada de más',pata:'base ensanchada'}[st],st==='bien'?E.CSS.pop:st==='floja'||st==='pata'?E.CSS.ui:E.CSS.bad)},
    tick(t){lift+=((st==='fria'?1:st==='floja'?.55:0)-lift)*.08;foot+=((st==='pata'?1:0)-foot)*.08;rip+=((st==='demasiado'?1:0)-rip)*.08;
      const up=rip*(.5+.5*Math.sin(t*1.6))*1.4,p=piece.geometry.attributes.position;
      for(let i=0;i<p.count;i++){let x=base[i*3],y=base[i*3+1],z=base[i*3+2];const b=(3-y)/6,ax=Math.abs(x)/9,az=Math.abs(z)/5;
        y+=3+up+lift*3*Math.pow(Math.max(ax,az),2)*Math.pow(b,1.5);const fl=1+foot*.12*Math.pow(b,3);x*=fl;z*=fl;p.setXYZ(i,x,y,z)}
      p.needsUpdate=true;piece.geometry.computeVertexNormals();tear.visible=hole.visible=rip>.05;tear.position.set(-1,up-.1,0);tear.scale.x=Math.max(.01,rip);hole.scale.x=Math.max(.01,rip);
      waves.forEach((l,k)=>{l.position.y=7+((t*2+k*.7)%3)});return true}};
}});
