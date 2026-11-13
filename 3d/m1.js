/* Capa a Capa · escenas 3D del módulo 1 (lecciones 1.1, 1.2 y 1.4). La 1.3 es una cuadrícula de coordenadas y queda en 2D. */
import {register,THREE,benchySpans,benchyIslands} from '../cac3d.js';
const KB=20/48;
function steps(h,top){const b=[0];let z=0;while(z<top-1e-6){z=Math.min(top,z+h);b.push(z)}return b}
/* posición de la boquilla mientras imprime el Benchy: capa c (0..n) con avance fr */
function headAt(c,lh){const i=Math.floor(c),fr=c-i,y=(i*lh+lh/2)/KB,sp=benchySpans(Math.min(47.9,y));if(!sp.length)return[0,i*lh];let tot=0;sp.forEach(q=>tot+=q[1]-q[0]);
  let rem=tot*fr,x=sp[0][0];const dir=i%2;for(let k=0;k<sp.length;k++){const q=sp[dir?sp.length-1-k:k],len=q[1]-q[0];if(rem<=len){x=dir?q[1]-rem:q[0]+rem;break}rem-=len;x=dir?q[0]:q[1]}
  return[(x-30)*KB,(i+1)*lh]}

/* ---------- 1.1 fabricar sumando: imprimir el Benchy contra tallarlo de un bloque ---------- */
register('l1',{span:46,keep2d:true,view:{pos:[0,52,118],target:[0,18,0],posP:[0,70,170],targetP:[0,20,0],min:50,max:260},build(E){
  const M=E.M,P=E.printer(36,42);P.g.position.x=-28;
  const B=E.benchy(steps(.5,20),KB,(i)=>i%2?M.fil2:M.fil);P.bed.add(B.g);
  // bloque de madera que se talla de arriba hacia abajo
  const T=E.bed(40,34,{grid:5});T.position.x=28;
  const wood=new THREE.MeshStandardMaterial({color:0xD2AC84,roughness:.75}),wood2=new THREE.MeshStandardMaterial({color:0xC49C72,roughness:.75});
  const W=E.benchy(steps(.5,20),KB,(i)=>i%2?wood2:wood);W.g.position.x=28;
  const blk=E.mesh(new THREE.BoxGeometry(25,1,13),wood);blk.position.x=28;E.scene.add(blk);
  const mill=new THREE.Group();E.scene.add(mill);const shank=E.mesh(new THREE.CylinderGeometry(.6,.6,14,16),M.steel);shank.position.y=8.6;mill.add(shank);
  const flute=E.mesh(new THREE.CylinderGeometry(.8,.8,3,12),new THREE.MeshStandardMaterial({color:0xC5CEE3,roughness:.3,metalness:.9}));flute.position.y=1.5;mill.add(flute);
  const chips=[];for(let k=0;k<90;k++){const a=Math.abs(Math.sin(k*91.7)*43758.5)%1,b=Math.abs(Math.sin(k*17.3)*9631.1)%1,c=E.mesh(new THREE.BoxGeometry(.7,.24,.4),k%2?wood:wood2);
    c.position.set(28+(a<.5?-1:1)*(13+b*4),.12+((k*7)%5)*.1,(b-.5)*16);c.rotation.y=a*6;E.scene.add(c);chips.push(c)}
  E.label('a',[-28,-6,22],'Sumando · impresión 3D',E.CSS.soft);E.label('b',[28,-1,19],'Tallando · mecanizado',E.CSS.soft);
  let P0=-1;
  return {update(){},tick(t){const p=E.val('p1')/100,n=40;if(p!==P0){P0=p;B.show(Math.floor(p*n));const zc=20*(1-p),i0=Math.ceil(zc/.5-1e-6);W.range(i0,n);
        blk.scale.y=Math.max(.001,zc);blk.position.y=zc/2;let rem=0;for(let i=i0;i<n;i++){let tot=0;benchySpans((i*.5+.25)/KB).forEach(q=>tot+=(q[1]-q[0])*KB);rem+=(25-tot)*.5}
        const nc=Math.round(rem/500*90);chips.forEach((c,k)=>{c.visible=k<nc});E.pill('Tallando se desperdicia el '+Math.round(rem/500*100)+' %',rem>0?E.CSS.ui:E.CSS.ink)}
      const zc=20*(1-p),c=p*n,hp=p<1?headAt(c,.5):[12,16];P.set(hp[0],0,hp[1]);
      mill.visible=p>0&&p<1;if(mill.visible){const sp=benchySpans(Math.min(47.9,(zc+.01)/KB));mill.position.set(28+((sp.length?sp[sp.length-1][1]:30)-30)*KB+1,zc,0);flute.rotation.y=t*20}
      return p>0&&p<1}};
}});

/* ---------- 1.2 del archivo a la pieza: cuatro etapas ---------- */
const GC=['G28            ; ir al origen','M140 S60       ; cama a 60 °C','M104 S210      ; boquilla a 210 °C','G1 Z0.2 F600   ; bajar a la capa 1','G1 X60 Y40 E0.67','G1 X60 Y60 E1.33','G1 X40 Y60 E2.00','G1 X40 Y40 E2.66','G1 Z0.4        ; subir a la capa 2'];
register('l2',{span:30,sel:'#c2',view:{pos:[34,26,40],target:[0,9,0],posP:[42,34,56],targetP:[0,10,0],min:30,max:180},build(E){
  const M=E.M,S=[new THREE.Group(),new THREE.Group(),new THREE.Group(),new THREE.Group()];S.forEach(g=>E.scene.add(g));
  const mint=new THREE.MeshStandardMaterial({color:0x86D9B5,roughness:.55,flatShading:true}),ghost=new THREE.MeshStandardMaterial({color:0x86D9B5,transparent:true,opacity:.18,depthWrite:false});
  // 0 · modelo: el barquito sobre la grilla de un programa de diseño
  const grid=new THREE.GridHelper(40,20,0x56627D,0x3A455C);S[0].add(grid);const m0=E.benchy(steps(2,20),KB,()=>mint);S[0].add(m0.g);
  // 1 · laminador: modelo transparente y capas que van apareciendo
  const g1=E.benchy(steps(1,20),KB,()=>ghost);g1.meshes.forEach(o=>{o.castShadow=false});S[1].add(g1.g);const l1=E.benchy(steps(1,20),KB,(i)=>i%2?M.fil2:M.fil);S[1].add(l1.g);
  const pl=new THREE.Mesh(new THREE.PlaneGeometry(34,22),new THREE.MeshBasicMaterial({color:0xFFB95E,transparent:true,opacity:.12,side:THREE.DoubleSide,depthWrite:false}));pl.rotation.x=-Math.PI/2;S[1].add(pl);
  // 2 · G-code: recorridos que se dibujan, con las órdenes al costado
  const lines=[];for(let z=.4;z<20;z+=.8){benchyIslands(z/KB,KB).forEach(p=>{const pts=p.map(q=>new THREE.Vector3(q[0],z,q[1]));pts.push(pts[0].clone());const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0xFF9E70}));S[2].add(l);lines.push(l)})}
  // 3 · impresora
  const P=E.printer(36,42);S[3].add(P.g);const b3=E.benchy(steps(1,20),KB,(i)=>i%2?M.fil2:M.fil);P.bed.add(b3.g);
  const bed=E.bed(44,30,{grid:5});
  let st=-1,cv=null;
  function code(c,w,h){if(st!==2)return;const t=(performance.now()%9000)/9000,n=Math.min(GC.length,Math.floor(t*(GC.length+3))+1),fs=w<240?10:12;c.font='500 '+fs+'px "DM Mono",ui-monospace,monospace';c.textAlign='left';
    for(let i=0;i<n;i++){const ln=GC[i],ci=ln.indexOf(';'),cd=ci<0?ln:ln.slice(0,ci),sp=cd.indexOf(' '),cmd=sp<0?cd:cd.slice(0,sp),y=14+fs+i*fs*1.45;
      if(i===n-1){c.fillStyle='rgba(255,185,94,.14)';c.fillRect(0,y-fs,w,fs*1.4)}c.fillStyle=E.CSS.ui;c.fillText(cmd,10,y);c.fillStyle=E.CSS.ink;c.fillText(cd.slice(cmd.length),10+c.measureText(cmd).width,y);
      if(ci>=0&&w>240){c.fillStyle=E.CSS.soft;c.fillText(ln.slice(ci),10+c.measureText(cd).width,y)}}}
  return {update(){const bs=[...document.querySelectorAll('#st2 button')],i=Math.max(0,bs.findIndex(b=>b.getAttribute('aria-pressed')==='true'));if(i===st)return;st=i;
      S.forEach((g,k)=>{g.visible=k===i});bed.visible=i!==0&&i!==3;cv=E.chart(code);cv.style.display=i===2?'':'none';cv.style.width=E.MOB?'190px':'330px';cv.style.height=E.MOB?'150px':'190px';E.redraw();
      E.pill(['el qué: la forma','el cómo: capas y recorridos','la receta: órdenes, una por línea','las manos: sigue la receta'][i],E.CSS.ui)},
    tick(){const t=(performance.now()%9000)/9000;
      if(st===0)m0.g.rotation.y+=.004;
      if(st===1){const zc=Math.max(.5,t*20);l1.show(Math.ceil(zc));pl.position.y=zc;E.label('c',[-17,zc,0],'capa '+Math.max(1,Math.ceil(zc))+' de 20',E.CSS.ui)}else E.unlabel('c');
      if(st===2){const k=Math.floor(t*lines.length);lines.forEach((l,j)=>{l.visible=j<=k});E.redraw()}
      if(st===3){const c=t*20;b3.show(Math.floor(c));const hp=headAt(c,1);P.set(hp[0],0,hp[1])}
      return true}};
}});

/* ---------- 1.4 FDM y resina, lado a lado ---------- */
register('l4',{span:44,sel:'.vs',ar:'2/1',view:{pos:[0,44,104],target:[0,17,0],posP:[0,58,150],targetP:[0,20,0],min:50,max:260},build(E){
  const M=E.M,P=E.printer(36,42);P.g.position.x=-26;const bf=E.benchy(steps(1,20),KB,(i)=>i%2?M.fil2:M.fil);P.bed.add(bf.g);
  // impresora de resina: base con pantalla, batea, columna y plataforma que sube
  const R=new THREE.Group();R.position.x=26;E.scene.add(R);
  const base=E.mesh(new THREE.BoxGeometry(30,8,24),new THREE.MeshStandardMaterial({color:0x2F3A57,roughness:.5}));base.position.y=-4;R.add(base);
  const lcdM=new THREE.MeshStandardMaterial({color:0x6F5BB5,emissive:0xB9A2FF,emissiveIntensity:0,roughness:.3}),lcd=E.mesh(new THREE.BoxGeometry(22,.3,14),lcdM,false);lcd.position.y=.15;R.add(lcd);
  const vat=E.mesh(new THREE.BoxGeometry(26,5,17),new THREE.MeshStandardMaterial({color:0x86D9B5,transparent:true,opacity:.28,roughness:.1,depthWrite:false}),false);vat.position.y=2.8;R.add(vat);
  const col=E.mesh(new THREE.BoxGeometry(2.4,46,2.4),M.alu);col.position.set(14,21,-6);R.add(col);
  const arm=new THREE.Group();R.add(arm);const ab=E.mesh(new THREE.BoxGeometry(18,1.6,3),new THREE.MeshStandardMaterial({color:0x48567A,roughness:.5}));ab.position.set(6,3,-6);arm.add(ab);
  const plat=E.mesh(new THREE.BoxGeometry(24,1.6,15),M.alu);plat.position.y=.8;arm.add(plat);
  const resin=new THREE.MeshStandardMaterial({color:0x86D9B5,roughness:.35}),resin2=new THREE.MeshStandardMaterial({color:0x6CC7A0,roughness:.35});
  const hang=new THREE.Group();hang.rotation.x=Math.PI;arm.add(hang);const br=E.benchy(steps(1,20),KB,(i)=>i%2?resin2:resin);hang.add(br.g);
  const uv=new THREE.PointLight(0xB9A2FF,0,60);uv.position.set(0,2,0);R.add(uv);
  E.label('a',[-26,-6,22],'FDM · filamento',E.CSS.soft);E.label('b',[26,-9,14],'Resina · luz',E.CSS.soft);
  return {tick(){const t=(performance.now()%9000)/9000,c=t*20;bf.show(Math.floor(c));const hp=headAt(c,1);P.set(hp[0],0,hp[1]);
      const n=Math.floor(c),fr=c-n,flash=Math.max(0,1-fr*2.2),lift=n+Math.sin(Math.min(1,fr*1.4)*Math.PI)*1.4;br.show(n);arm.position.y=.6+lift;
      hang.position.y=0;lcdM.emissiveIntensity=flash*1.4;uv.intensity=flash*60;return true}};
}});
