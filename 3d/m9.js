/* Capa a Capa · escenas 3D del módulo 9 (multicolor y multimaterial). La 9.4, pintar el modelo, es un lienzo para dibujar y queda en 2D. */
import {register,THREE} from '../cac3d.js';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),nf=(v,d)=>v.toFixed(d||0).replace('.',','),eio=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
function idx(id){return [...document.querySelectorAll('#'+id+' button')].findIndex(b=>b.getAttribute('aria-pressed')==='true')}
function clear(g){while(g.children.length){const o=g.children.pop();o.traverse(x=>{if(x.geometry)x.geometry.dispose()})}}
const HEX={o:0xFF9E70,w:0xECEEF4,t:0x5FCDBE,k:0x3C4252,v:0xBEA0FF};
const mat=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.5},o||{}));
const MO=mat(HEX.o),MW=mat(HEX.w),MT=mat(HEX.t),MK=mat(HEX.k);
/* pila de purga: esferitas de colores amontonadas */
function pile(E,g,n,cols){clear(g);for(let i=0;i<n;i++){const a=i*2.399,r=Math.sqrt(i)*.55,y=.5+Math.max(0,2.2-r)*.7*(1+(i%3)*.1);const s=E.mesh(new THREE.SphereGeometry(.55+(i%4)*.08,10,8),cols[i%cols.length]);s.position.set(Math.cos(a)*r,Math.min(y,.5+i*.02),Math.sin(a)*r);g.add(s)}}

/* ---------- 9.1 cambio de color por capa ---------- */
const LET=[[[0,0,1.2,7],[3.8,0,1.2,7],[0,3,5,1.2]],[[0,0,5,1.2],[0,5.8,5,1.2],[0,0,1.2,7],[3.8,0,1.2,7]],[[0,0,1.2,7],[0,0,5,1.2]],[[0,0,1.2,7],[3.8,0,1.2,7],[0,5.8,5,1.2],[0,3,5,1.2]]];
register('l1',{span:22,view:{pos:[0,26,34],target:[0,2,0],posP:[0,34,50],targetP:[0,2,0],min:18,max:110},build(E){
  E.bed(40,22,{grid:5});const LH=.45,L=[];const G=new THREE.Group();E.scene.add(G);
  for(let k=1;k<=14;k++){const g=new THREE.Group(),y=(k-1)*LH;if(k<=6){const b=E.mesh(new THREE.BoxGeometry(28,LH*.98,12),MO);b.position.y=y+LH/2;g.add(b)}
    else LET.forEach((bars,li)=>bars.forEach(q=>{const b=E.mesh(new THREE.BoxGeometry(q[2],LH*.98,q[3]),MO);b.position.set(-12.5+li*6.6+q[0]+q[2]/2,y+LH/2,3.5-q[1]-q[3]/2);g.add(b)}));G.add(g);L.push(g)}
  const ring=E.mesh(new THREE.TorusGeometry(1.6,.5,10,24),MO);ring.rotation.x=Math.PI/2;ring.position.set(-15.5,LH*3,0);G.add(ring);
  const noz=E.nozzle(.5);let K=-1,T0=performance.now();
  return {tick(t){const k=E.val('k1');if(k!==K){K=k;L.forEach((g,i)=>g.children.forEach(m=>m.material=i+1>=K?MW:MO));T0=performance.now()}
      const el=(performance.now()-T0)/1000,cyc=8.5,p=Math.min(1,(el%cyc)/7),n=Math.floor(p*14)+1;L.forEach((g,i)=>g.visible=i<n||p>=1);ring.visible=n>2;
      noz.visible=p<1;noz.position.set(Math.sin(t*4)*12,Math.min(14,n)*.45+.05,Math.cos(t*3)*(n<=6?5:3));
      E.label('k',[16,(K-1)*.45,6],'cambio en la capa '+K,E.CSS.ui);
      E.pill(K===7?'base naranja, letras blancas':K<=6?'parte de la base sale blanca':'el arranque de las letras sale naranja',K===7?E.CSS.pop:E.CSS.ui);return true}};
}});

/* ---------- 9.2 cómo funciona un AMS ---------- */
register('l2',{span:30,view:{pos:[4,32,74],target:[0,12,0],posP:[6,42,100],targetP:[0,13,0],min:30,max:160},build(E){
  const M=E.M;E.bed(30,22,{grid:5}).position.x=12;
  const box=E.mesh(new THREE.BoxGeometry(22,8,10),mat(0x2A3142,{metalness:.4}));box.position.set(-18,4,0);E.scene.add(box);
  [HEX.o,HEX.w,HEX.t,HEX.k].forEach((c,i)=>{const s=E.mesh(new THREE.CylinderGeometry(3.4,3.4,3.6,28),mat(c));s.rotation.x=Math.PI/2;s.position.set(-26+i*5.4,10.4,0);E.scene.add(s)});
  const lid=new THREE.Mesh(new THREE.BoxGeometry(22,.4,10),new THREE.MeshStandardMaterial({color:0xA9C7FF,transparent:true,opacity:.12}));lid.position.set(-18,14.4,0);E.scene.add(lid);
  const curve=new THREE.CatmullRomCurve3([[-23.4,8,0],[-20,16,0],[-8,26,0],[6,26,0],[12,19,0],[12,13.5,0]].map(p=>new THREE.Vector3(...p)));
  const tube=new THREE.Mesh(new THREE.TubeGeometry(curve,60,.75,10),new THREE.MeshStandardMaterial({color:0xE9F0FF,transparent:true,opacity:.22,depthWrite:false}));E.scene.add(tube);
  const N=44,SEG=[];for(let i=0;i<N;i++){const a=curve.getPoint(i/N),b=curve.getPoint((i+1)/N),d=b.clone().sub(a),m=E.mesh(new THREE.CylinderGeometry(.38,.38,d.length()*1.02,8),MO,false);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());E.scene.add(m);SEG.push(m)}
  const noz=E.nozzle(.6);noz.position.set(12,.6,0);const blade=E.mesh(new THREE.BoxGeometry(2.4,.25,1.6),M.steel);blade.position.set(13.6,15.2,0);E.scene.add(blade);
  const line=new THREE.Group();E.scene.add(line);const PG=new THREE.Group();PG.position.set(24,0,7);E.scene.add(PG);let stg=-1,T=0;
  const LBL=['imprimiendo en naranja','filamento cortado','naranja de vuelta en la caja','blanco cargado: adentro queda naranja','purgando hasta que salga blanco limpio','imprimiendo en blanco'];
  return {tick(t){const s=document.querySelectorAll('#q2 button:disabled').length;if(s!==stg){stg=s;T=performance.now();pile(E,PG,s>=4?14:0,[MO,MW,MW]);clear(line);
        const col=s>=5?MW:MO;for(let i=0;i<(s===0||s>=5?7:0);i++){const b=E.bead(4+i*2.2,-6,6.2+i*2.2,-6,0,1,.4,col);line.add(b)}}
      const f=eio(clamp((performance.now()-T)/1100,0,1));
      SEG.forEach((m,i)=>{const u=i/N;let vis=true,c=MO;if(s===1)vis=i<N-3||i===N-1;else if(s===2)vis=u<(1-.88*f);else if(s>=3){c=MW;vis=u<f||s>3;if(s===3&&i===N-1)c=MO}m.visible=vis;m.material=c});
      blade.position.x=s===1?13.6-f*1.6:13.6;const busy=s===0||s>=5;noz.position.set(busy?12+Math.sin(t*2)*6:s===4?20:12,.6,busy?-6:s===4?6:0);
      E.label('s',[-18,18,0],'AMS: cuatro rollos',E.CSS.soft);E.pill('Paso '+Math.min(5,s)+' de 5 · '+LBL[Math.min(5,s)],s>=5?E.CSS.pop:E.CSS.ui);return true}};
}});

/* ---------- 9.3 la purga y el desperdicio ---------- */
register('l3',{span:28,view:{pos:[0,40,52],target:[0,3,0],posP:[0,54,76],targetP:[0,4,0],min:30,max:160},build(E){
  E.bed(56,40,{grid:5});const P=new THREE.Group(),TW=new THREE.Group(),PG=new THREE.Group();E.scene.add(P);E.scene.add(TW);E.scene.add(PG);TW.position.set(20,0,-12);PG.position.set(-22,0,-12);let key='',r=null;
  const calc=()=>{const nc=Math.max(0,idx('col3')),fl=document.querySelector('#fl3 button').getAttribute('aria-pressed')==='true',n=E.val('n3'),colors=nc+2,ch=14*(colors-1);return{colors,n,fl,pieces:8*n,waste:ch*.45*(fl?.6:1)+2.5}};
  E.chart((c,w,h)=>{if(!r)return;const mx=Math.max(r.pieces,r.waste,1),bw=w-118;c.font='700 11px "DM Sans",system-ui';
    [['piezas',r.pieces,E.CSS.pop],['purga',r.waste,r.waste>r.pieces/2?E.CSS.bad:E.CSS.ui]].forEach((q,i)=>{const y=12+i*22;c.fillStyle=E.CSS.soft;c.textAlign='left';c.fillText(q[0],8,y+10);c.fillStyle='rgba(255,255,255,.08)';c.fillRect(56,y,bw,12);c.fillStyle=q[2];c.fillRect(56,y,bw*q[1]/mx,12);c.fillStyle=E.CSS.ink;c.fillText(nf(q[1],1)+' g',60+bw,y+10)})});
  return {tick(){r=calc();const k=[r.colors,r.n,r.fl].join();if(k!==key){key=k;clear(P);clear(TW);const cols=[MO,MW,MT,MK].slice(0,r.colors);
        for(let i=0;i<r.n;i++){const x=-15+(i%4)*10,z=(i<4?0:9);cols.forEach((m,j)=>{const b=E.mesh(new THREE.BoxGeometry(8,.9,4),m);b.position.set(x,.45+j*.9,z);P.add(b)})}
        for(let j=0;j<14;j++){const b=E.mesh(new THREE.CylinderGeometry(2.4,2.4,.9,20),cols[j%cols.length]);b.position.y=.45+j*.9;TW.add(b)}
        pile(E,PG,Math.round(clamp(r.waste*1.4,4,110)),cols);E.redraw();
        E.label('t',[20,14,-12],'torre de purga',E.CSS.soft);E.label('p',[-22,6,-12],'filamento purgado',E.CSS.soft)}
      E.pill(r.colors<3?'dos colores: poca purga':r.waste<r.pieces/2?'bien aprovechado':'se tira más de lo que se imprime',r.colors>=3&&r.waste<r.pieces/2?E.CSS.pop:E.CSS.ui);return false}};
}});

/* ---------- 9.5 multicabezal ---------- */
register('l5',{span:30,view:{pos:[0,36,74],target:[0,15,0],posP:[0,46,100],targetP:[0,16,0],min:30,max:170},build(E){
  const M=E.M;E.bed(40,24,{grid:5});const blk=mat(0x2A3142,{metalness:.5});const fr=E.mesh(new THREE.BoxGeometry(48,1.6,1.6),blk);fr.position.set(0,24,-8);E.scene.add(fr);
  const R=new THREE.Group(),PG=new THREE.Group(),FIG=new THREE.Group();E.scene.add(R);E.scene.add(PG);E.scene.add(FIG);PG.position.set(-16,0,6);let key='',heads=[],r=null;
  const calc=()=>{const si=Math.max(0,idx('s5')),nc=Math.max(0,idx('c5c')),colors=nc+2,h=[1,2,5][si],ch=120*(colors-1);let sw=h>=colors?0:h===1?ch:Math.round(ch*(colors-h)/(colors-1));const q=ch-sw;return{si,colors,h,waste:sw*.45+q*.02,time:sw+q*.12}};
  return {tick(t){r=calc();const cols=[MO,MW,MT,MK].slice(0,r.colors),k=[r.si,r.colors].join();
      if(k!==key){key=k;clear(R);heads=[];for(let i=0;i<r.h;i++){const g=new THREE.Group(),b=E.mesh(new THREE.BoxGeometry(4,5,4),mat(0x313C55,{metalness:.3}));b.position.y=3;g.add(b);
          const tag=E.mesh(new THREE.BoxGeometry(4.1,1.2,4.1),r.h===1?MK:cols[i%cols.length]);tag.position.y=4.6;g.add(tag);const nz=new THREE.Mesh(new THREE.CylinderGeometry(.5,.12,1,12),M.brass);nz.position.y=.5;g.add(nz);g.userData.park=[-20+i*(40/Math.max(1,r.h-1||1))*(r.h>1?1:0)+(r.h===1?0:0),19,-6];R.add(g);heads.push(g)}
        if(r.h===1){const ams=E.mesh(new THREE.BoxGeometry(16,5,7),blk);ams.position.set(0,30,-8);R.add(ams);cols.forEach((m,i)=>{const s=E.mesh(new THREE.CylinderGeometry(2,2,2.4,20),m);s.rotation.x=Math.PI/2;s.position.set(-5.4+i*3.6,33.4,-8);R.add(s)})}
        pile(E,PG,Math.round(clamp(r.waste*.9,2,120)),cols);clear(FIG);cols.forEach((m,j)=>{const b=E.mesh(new THREE.CylinderGeometry(3.2-j*.4,3.4-j*.4,2.4,24),m);b.position.set(10,1.2+j*2.4,4);FIG.add(b)});
        E.label('p',[-16,7,6],'purga: '+nf(r.waste,1)+' g',r.waste>45?E.CSS.bad:E.CSS.soft)}
      const act=Math.floor(t/1.4)%r.colors,ph=(t/1.4)%1;heads.forEach((g,i)=>{const mine=r.h===1?i===0:i===act%r.h;if(mine){g.position.set(10+Math.sin(t*3)*2.4*(ph<.8?1:0),r.colors*2.4+.2,4)}else{const x=r.h>1?-20+i*40/(r.h-1):0;g.position.set(x,19,-6)}});
      E.pill('purga '+nf(r.waste,1)+' g · '+(r.time<60?Math.round(r.time)+' min':Math.floor(r.time/60)+' h '+Math.round(r.time%60)+' min')+' en cambios',r.colors===4&&r.waste<10?E.CSS.pop:r.waste>45?E.CSS.bad:E.CSS.ui);return true}};
}});

/* ---------- 9.6 multimaterial ---------- */
const MAT6=[mat(HEX.o),new THREE.MeshPhysicalMaterial({color:0x9FC5FF,roughness:.2,transparent:true,opacity:.85,clearcoat:.6}),mat(0xF4F1E6,{roughness:.8}),mat(HEX.v,{roughness:.7})],NAME6=['PLA','PETG','PVA','TPU'],OK6=[1,2,3];
register('l6',{span:22,view:{pos:[14,18,38],target:[0,5,0],posP:[18,24,54],targetP:[0,6,0],min:20,max:120},build(E){
  E.bed(36,24,{grid:5});const G=new THREE.Group();E.scene.add(G);let key='',sup=null,water=null,grip=null,PT=0;
  const ghost=new THREE.MeshStandardMaterial({color:0xFF9E70,roughness:.4,transparent:true,opacity:.35,depthWrite:false});
  return {tick(t){const ci=Math.max(0,idx('k6')),pk=idx('o6'),k=ci+'|'+pk;if(k!==key){key=k;PT=performance.now();clear(G);sup=water=grip=null;const sm=pk>=0?MAT6[pk].clone():mat(0x6E7896);
        if(ci===0){const col=E.mesh(new THREE.BoxGeometry(4,10,8),MAT6[0]);col.position.set(-8,5,0);G.add(col);const sh=E.mesh(new THREE.BoxGeometry(16,2,8),MAT6[0]);sh.position.set(2,11,0);G.add(sh);
          sup=new THREE.Group();const tw=E.mesh(new THREE.BoxGeometry(12,9.4,6),mat(HEX.o,{roughness:.8}));tw.position.y=4.7;sup.add(tw);const it=E.mesh(new THREE.BoxGeometry(12.2,.6,6.2),sm);it.position.y=9.7;sup.add(it);sup.position.set(3,0,0);G.add(sup)}
        if(ci===1){const blk=E.mesh(new THREE.BoxGeometry(20,10,10),ghost,false);blk.position.y=5;G.add(blk);const c=new THREE.CatmullRomCurve3([[-10,3,0],[-3,4,0],[0,7,0],[4,4,0],[10,3,0]].map(p=>new THREE.Vector3(...p)));
          sup=E.mesh(new THREE.TubeGeometry(c,40,1.6,12),sm);G.add(sup);water=new THREE.Mesh(new THREE.BoxGeometry(26,13,14),new THREE.MeshStandardMaterial({color:0x5FA8FF,transparent:true,opacity:.18,depthWrite:false}));water.position.y=6.5;water.visible=pk===2;G.add(water)}
        if(ci===2){const h=E.mesh(new THREE.CylinderGeometry(1.6,1.6,18,24),MAT6[0]);h.rotation.z=Math.PI/2;h.position.y=4;G.add(h);grip=E.mesh(new THREE.CylinderGeometry(2.6,2.6,9,28),sm);grip.rotation.z=Math.PI/2;grip.position.y=4;G.add(grip)}
        E.label('m',[0,-1,9],pk>=0?'segundo material: '+NAME6[pk]:'elegí el segundo material',pk>=0?(pk===OK6[ci]?E.CSS.pop:E.CSS.bad):E.CSS.soft)}
      const f=pk>=0?clamp((performance.now()-PT)/1600,0,1):0,ok=pk===OK6[ci];
      if(ci===0&&sup){if(ok)sup.position.set(3+eio(f)*14,0,eio(f)*4);else sup.position.set(3+(pk>=0&&f<1?Math.sin(t*40)*.15:0),0,0)}
      if(ci===1&&sup){if(ok){sup.material.transparent=true;sup.material.opacity=1-f;sup.visible=f<1}}
      if(ci===2&&grip){const sq=ok?1-.18*Math.max(0,Math.sin(t*3)):1;grip.scale.set(1,1,sq);grip.position.y=4-(1-sq)*1.2}
      E.pill(pk<0?'Pedido: '+['soporte fácil de sacar','canales internos','agarre blando'][ci]:ok?'¡funciona!':'no es el indicado',pk<0?E.CSS.ui:ok?E.CSS.pop:E.CSS.bad);return true}};
}});
