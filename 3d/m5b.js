/* Capa a Capa · escenas 3D del módulo 5, parte 2 (lecciones 5.6 a 5.9). La 5.10 (la etiqueta de la bobina) queda en 2D. */
import {register,THREE} from '../cac3d.js';
const rnd=(i,k)=>{const x=Math.sin(i*127.1+k*311.7)*43758.5453;return x-Math.floor(x)};
const num=(v,d)=>v.toFixed(d==null?1:d).replace('.',',');
function clear(g){while(g.children.length){const o=g.children.pop();o.traverse(x=>{if(x.geometry)x.geometry.dispose()})}}
function group(E){const g=new THREE.Group();E.scene.add(g);return g}
/* tabiques con ancho propio por tramo: [x0,z0,x1,z1,ancho] */
function walls(E,segs,y0,y1,mat){const pos=[],nor=[];const q=(a,b,c,e,n)=>{pos.push(...a,...b,...c,...a,...c,...e);for(let i=0;i<6;i++)nor.push(...n)};
  segs.forEach(s=>{const dx=s[2]-s[0],dz=s[3]-s[1],l=Math.hypot(dx,dz);if(l<.01)return;const h=s[4]/2,ux=-dz/l*h,uz=dx/l*h;
    q([s[0]+ux,y0,s[1]+uz],[s[2]+ux,y0,s[3]+uz],[s[2]+ux,y1,s[3]+uz],[s[0]+ux,y1,s[1]+uz],[ux/h,0,uz/h]);q([s[2]-ux,y0,s[3]-uz],[s[0]-ux,y0,s[1]-uz],[s[0]-ux,y1,s[1]-uz],[s[2]-ux,y1,s[3]-uz],[-ux/h,0,-uz/h]);
    q([s[0]+ux,y1,s[1]+uz],[s[2]+ux,y1,s[3]+uz],[s[2]-ux,y1,s[3]-uz],[s[0]-ux,y1,s[1]-uz],[0,1,0])});
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));return E.mesh(g,mat)}

/* ---------- 5.6 pasos del extrusor (el avance se calcula en la página) ---------- */
register('l1',{span:24,keep2d:true,view:{pos:[22,25,64],target:[-2,18.5,0],posP:[24,24,72],targetP:[0,17,0],min:22,max:130},build(E){
  const M=E.M,EY=8,K=.18;
  const body=E.mesh(new THREE.BoxGeometry(9,6,6),new THREE.MeshStandardMaterial({color:0x4E5D83,roughness:.5}));body.position.y=EY;E.scene.add(body);
  const gears=[-1,1].map(s=>{const g=new THREE.Group();g.position.set(s*1.75,EY,3.05);const d=E.mesh(new THREE.CylinderGeometry(1.4,1.4,.6,12),M.steel);d.rotation.x=Math.PI/2;g.add(d);
    for(let i=0;i<11;i++){const t=E.mesh(new THREE.BoxGeometry(.35,.5,.62),M.steel);const a=i*Math.PI*2/11;t.position.set(Math.cos(a)*1.5,Math.sin(a)*1.5,0);t.rotation.z=a;g.add(t)}E.scene.add(g);return g});
  const st=E.layerTex(.6);st.repeat.set(1,8);const fil=E.mesh(new THREE.CylinderGeometry(.5,.5,40,14),new THREE.MeshStandardMaterial({color:0xFF9E70,roughness:.45,bumpMap:st,bumpScale:1.2}));fil.position.y=EY+12;E.scene.add(fil);
  const tube=E.mesh(new THREE.CylinderGeometry(.9,.9,EY-3,14,1,true),new THREE.MeshStandardMaterial({color:0xE4E8F3,transparent:true,opacity:.25,depthWrite:false,side:THREE.DoubleSide}),false);tube.position.y=(EY-3)/2+2;E.scene.add(tube);
  const noz=E.nozzle(.35);noz.position.y=0;E.bed(20,12,{grid:5});
  const mark=E.mesh(new THREE.CylinderGeometry(.62,.62,.5,14),new THREE.MeshStandardMaterial({color:0xFFB95E,emissive:0xFFB95E,emissiveIntensity:.6}),false);E.scene.add(mark);
  const rp=[],RX=-3.2;for(let mm=0;mm<=120;mm+=10){const y=EY+3+mm*K;rp.push(RX,y,0,RX-(mm%50?.6:1.2),y,0)}rp.push(RX,EY+3,0,RX,EY+3+120*K,0);
  const rg=new THREE.BufferGeometry();rg.setAttribute('position',new THREE.Float32BufferAttribute(rp,3));E.scene.add(new THREE.LineSegments(rg,new THREE.LineBasicMaterial({color:0xB9C2D8})));
  [0,50,100,120].forEach(m=>E.label('r'+m,[RX-2.4,EY+3+m*K,0],String(m),E.CSS.soft));
  let s={};
  E.chart((c,w,h)=>{const x0=12,x1=w-12,rh=(h-24)/4.4,X=s.res?s.res.X:(s.mv||0),col=s.run?E.CSS.ink:s.res?(s.res.ok?E.CSS.pop:X>100?E.CSS.bad:E.CSS.ui):E.CSS.soft;
    c.textAlign='left';c.font='700 12px "DM Sans",system-ui';c.fillStyle=E.CSS.soft;c.fillText('La cuenta',x0,18);
    [[w<200?'Pasos/mm':'Pasos por mm',num(s.v||93,2),E.CSS.ink],['Pedido','100 mm',E.CSS.ink],['Avanzó',num(X)+' mm',col]].forEach((r,i)=>{const y=18+rh*(i+1);c.font=(w<200?'500 10px':'500 12px')+' "DM Sans",system-ui';c.fillStyle=E.CSS.soft;c.textAlign='left';c.fillText(r[0],x0,y);c.font=(w<200?'700 11px':'700 15px')+' "DM Mono",monospace';c.fillStyle=r[2];c.textAlign='right';c.fillText(r[1],x1,y)});
    const y=18+rh*4;c.textAlign='left';c.font='500 12px "DM Mono",monospace';if(s.res&&!s.res.ok){c.fillStyle=E.CSS.soft;c.fillText(num(s.v,2)+'×100/'+num(s.res.X),x0,y);c.textAlign='right';c.fillStyle=E.CSS.ui;c.font='700 14px "DM Mono",monospace';c.fillText('= '+num(s.res.nv,2),x1,y)}else if(s.res){c.fillStyle=E.CSS.pop;c.fillText('Valor correcto: guardalo',x0,y)}}).style.cssText='width:'+(E.MOB?150:220)+'px;height:'+(E.MOB?110:150)+'px';
  let key='';
  return {tick(t){s=E.state('l1');const mv=s.mv||0;gears[0].rotation.z=mv*.32;gears[1].rotation.z=-mv*.32;st.offset.y=-mv*.05;
      const my=EY+3+(120-mv)*K;mark.visible=my>EY+3.1;mark.position.y=my;if(mark.visible)E.label('m',[2.6,my,0],'marca · quedan '+num(120-mv)+' mm',E.CSS.ui);else E.unlabel('m');
      const k2=[s.run,Math.round(mv*10),s.res&&s.res.X,s.v].join();if(k2!==key){key=k2;E.redraw()}
      E.pill(s.run?'empujando 100 mm…':s.res?(s.res.ok?'calibrado':'avanzó '+num(s.res.X)+' mm'):'pedí 100 mm',s.res?(s.res.ok?E.CSS.pop:E.CSS.ui):E.CSS.ink);return !!s.run||true}};
}});

/* ---------- 5.7 flujo ---------- */
register('l2',{span:18,view:{pos:[6,18,40],target:[0,5,0],posP:[8,24,56],targetP:[0,6,0],min:16,max:100},build(E){
  const M=E.M;E.bed(42,22,{grid:5});const C=group(E),T=group(E),K=4.4;
  const jaw=[0,1].map(()=>{const j=E.mesh(new THREE.BoxGeometry(1,6,2),new THREE.MeshStandardMaterial({color:0xC9D2E6,roughness:.3,metalness:.85}));E.scene.add(j);return j});
  const beam=E.mesh(new THREE.BoxGeometry(14,1,1.6),new THREE.MeshStandardMaterial({color:0xC9D2E6,roughness:.3,metalness:.85}));E.scene.add(beam);
  let F=-1,jx=0,mx=0,cur=0;
  return {update(){const f=E.val('fl2');if(f===F)return;F=f;const me=.45*f/100*1.04,e=me/.45-1;clear(C);clear(T);
      // cubo de una sola pared
      const segs=[],P=[[-6,-6],[6,-6],[6,6],[-6,6]];for(let s=0;s<4;s++){const a=P[s],b=P[(s+1)%4];for(let u=0;u<1;u+=.1){const i=s*10+Math.round(u*10);segs.push([a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,a[0]+(b[0]-a[0])*(u+.1),a[1]+(b[1]-a[1])*(u+.1),me*K*(1+(e>0?(rnd(i,1)-.5)*e*2.4:(rnd(i,3)-.5)*-e*1.2))])}}
      for(let L=0;L<9;L++){const hh=e<0?Math.max(.55,1+e*2.5):1,y=L*.9;C.add(walls(E,segs.map(q=>[q[0],q[1],q[2],q[3],q[4]*(1+(rnd(L,q[0]*7)-.5)*Math.abs(e)*1.5)]),y,y+.9*hh,L%2?M.fil2:M.fil))}
      C.position.x=-9;mx=me*K/2*(1+Math.abs(e)*1.2);
      // cara de arriba: líneas con huecos o crestas
      const lw=Math.max(.35,1+e*2.4)*.9,pitch=.9,mat=new THREE.MeshStandardMaterial({color:0xFF9E70,roughness:.5});for(let k=0;k<11;k++){const z=-5+k*pitch;T.add(E.bead(-5,z,5,z,0,lw,.45,mat));if(e>.0125&&k)T.add(E.bead(-5,z-pitch/2,5,z-pitch/2,.42,.18,.14,new THREE.MeshStandardMaterial({color:0xFFC9A8,roughness:.5})))}
      T.position.x=10;const mr=Math.round(me*100)/100;E.label('t',[10,0,7],'la cara de arriba',E.CSS.soft);E.label('w',[-9,0,8.4],'pared de un cubo · esperado 0,45 mm',E.CSS.soft);
      E.label('c',[-9,12.6,6],num(mr,2)+' mm',mr===.45?E.CSS.pop:E.CSS.ui);E.pill(mr===.45?'pared justa, superficie lisa':mr>.45?'pared gruesa, superficie con crestas':'pared fina, superficie con huecos',mr===.45?E.CSS.pop:Math.abs(e)>.06?E.CSS.bad:E.CSS.ui)},
    tick(){cur+=(mx-cur)*.12;jaw[0].position.set(-9-.6-cur,7,6);jaw[1].position.set(-9+.6+cur,7,6);jaw[0].position.x=-9-cur-.5;jaw[1].position.x=-9+cur+.5;beam.position.set(-9+4,10.4,6);return Math.abs(mx-cur)>.001}};
}});

/* ---------- 5.8 avance de presión ---------- */
register('l3',{span:18,view:{pos:[10,22,26],target:[0,0,0],posP:[12,30,36],targetP:[0,1,0],min:16,max:100},build(E){
  const M=E.M;E.bed(34,30,{grid:5});const G=group(E),noz=E.nozzle(.5),PAI=.04;let pa=-1,eK=0;
  function curves(p){const N=160,v=[],f=[];for(let i=0;i<N;i++){const t=i/(N-1);v.push(t<.06?0:t<.24?(t-.06)/.18:t<.62?1:t<.8?1-(t-.62)/.18:0)}
    if(p<=PAI){const tau=.09*(1-p/PAI),dt=1/(N-1);let y=0;for(let i=0;i<N;i++){y+=tau>1e-4?(v[i]-y)*Math.min(1,dt/tau):(v[i]-y);f.push(y)}}
    else{const q=Math.min(1,(p-PAI)/.06);for(let i=0;i<N;i++){const t=i/(N-1);f.push(Math.max(0,v[i]-q*(.55*Math.exp(-Math.pow((t-.72)/.045,2))+.45*Math.exp(-Math.pow((t-.17)/.045,2)))))}}return{v,f}}
  let cu=curves(0);
  E.chart((c,w,h)=>{const N=cu.v.length,x0=10,x1=w-10,y1=h-12,y0=26,X=i=>x0+(x1-x0)*i/(N-1),Y=v=>y1-(y1-y0)*v/1.15;c.font='700 11px "DM Sans",system-ui';c.textAlign='left';c.fillStyle=E.CSS.pop;c.fillText('velocidad',x0,15);c.textAlign='right';c.fillStyle='#FF9E70';c.fillText('plástico',x1,15);
    for(let i=1;i<N;i++){const dv=cu.f[i]-cu.v[i];if(Math.abs(dv)>.02){c.fillStyle=dv>0?'rgba(255,185,94,.45)':'rgba(255,180,171,.4)';c.fillRect(X(i-1),Math.min(Y(cu.f[i]),Y(cu.v[i])),X(i)-X(i-1)+.5,Math.abs(Y(cu.f[i])-Y(cu.v[i])))}}
    c.strokeStyle='#FF9E70';c.lineWidth=2.4;c.beginPath();cu.f.forEach((v,i)=>i?c.lineTo(X(i),Y(v)):c.moveTo(X(i),Y(v)));c.stroke();c.strokeStyle=E.CSS.pop;c.setLineDash([5,4]);c.lineWidth=1.6;c.beginPath();cu.v.forEach((v,i)=>i?c.lineTo(X(i),Y(v)):c.moveTo(X(i),Y(v)));c.stroke();c.setLineDash([])});
  return {update(){const p=Math.round(E.val('pa3')*1000)/1000;if(p===pa)return;pa=p;cu=curves(p);eK=p<=PAI?1-p/PAI:-Math.min(1,(p-PAI)/.06);clear(G);
      const lw=.9;for(let lp=0;lp<3;lp++){const o=lp*lw*1.12,Ls=20-2*o,a0=-Ls/2,P=[[a0,a0],[a0+Ls,a0],[a0+Ls,a0+Ls],[a0,a0+Ls]],segs=[];
        for(let sd=0;sd<4;sd++){const a=P[sd],b=P[(sd+1)%4];for(let sp=0;sp<Ls;sp+=.25){const da=Ls-sp,ds=sp;let wf=eK>=0?1+.7*eK*Math.exp(-da/(lw*1.4))-.35*eK*Math.exp(-ds/(lw*1.6)):1-.9*-eK*(Math.exp(-da/(lw*1.1))+.8*Math.exp(-ds/(lw*1.1)));if(wf<.28)continue;
          const u0=sp/Ls,u1=Math.min(Ls,sp+.27)/Ls;segs.push([a[0]+(b[0]-a[0])*u0,a[1]+(b[1]-a[1])*u0,a[0]+(b[0]-a[0])*u1,a[1]+(b[1]-a[1])*u1,lw*wf])}}
        for(let L=0;L<3;L++)G.add(walls(E,segs,L*.6,L*.6+.58,lp%2?M.fil2:M.fil))}
      const s=pa<.035-1e-9?'bajo':pa>.05+1e-9?'alto':'justo';E.redraw();E.pill(s==='bajo'?'esquinas abultadas':s==='alto'?'huecos en las esquinas':'esquinas limpias',s==='justo'?E.CSS.pop:pa>.075?E.CSS.bad:E.CSS.ui)},
    tick(t){const per=(t*.18)%1*4,si=Math.floor(per),fr=per-si,ee=fr<.5?2*fr*fr:1-Math.pow(-2*fr+2,2)/2,Q=[[-10,-10],[10,-10],[10,10],[-10,10]],a=Q[si],b=Q[(si+1)%4];noz.position.set(a[0]+(b[0]-a[0])*ee,1.9,a[1]+(b[1]-a[1])*ee);return true}};
}});

/* ---------- 5.9 torre de retracción ---------- */
const TR4={bowden:{a:2,s:.5,c:5,nm:'Bowden'},directo:{a:.2,s:.2,c:1,nm:'directa'}};
register('l4',{span:22,view:{pos:[10,20,46],target:[0,10,0],posP:[12,26,64],targetP:[0,12,0],min:22,max:140},build(E){
  const M=E.M;E.bed(36,18,{grid:5});const G=group(E),S=group(E),noz=E.nozzle(.5),FH=2.2,XA=-8,XB=8;let key='',hang=[];
  return {update(){const e=E.chip('ex4','e')||'bowden',pb=document.querySelector('#rt4 [aria-pressed="true"]'),sel=pb?+pb.dataset.v:null,k2=e+sel;if(k2===key)return;key=k2;clear(G);hang=[];const o=TR4[e];
      for(let i=0;i<9;i++){const v=Math.round((o.a+o.s*i)*10)/10,s=v>=o.c-1e-9?0:Math.min(1,(o.c-v)/(o.c-o.a)+.15),y0=i*FH,mt=i%2?M.fil2:M.fil;
        [XA,XB].forEach(x=>{const b=E.mesh(new THREE.BoxGeometry(4.4,FH*.96,4.4),mt);b.position.set(x,y0+FH/2,0);G.add(b)});
        for(let k=0;k<Math.round(s*8);k++){const yy=y0+(k+.6)*FH/(Math.round(s*8)+.4),z=(rnd(i,k)-.5)*3,tb=E.tube([[XA+2.2,yy,z],[0,yy-.6-rnd(i,k)*1.2,z],[XB-2.2,yy+(rnd(k,i)-.5)*.6,z]],.05,M.fil,12);G.add(tb);hang.push(tb)}
        if(s>.45)for(let k=0;k<3;k++){const bl=E.mesh(new THREE.SphereGeometry(.3+s*.25,10,8),M.fil);bl.position.set(k%2?XB-2.3:XA+2.3,y0+FH*rnd(i,k+9),(rnd(k,i)-.5)*3);G.add(bl)}
        E.label('v'+i,[XA-4.6,y0+FH/2,0],num(v)+' mm',sel!=null&&Math.abs(sel-v)<1e-9?E.CSS.ui:E.CSS.soft);
        if(sel!=null&&Math.abs(sel-v)<1e-9){const ed=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(XB-XA+6,FH,6)),new THREE.LineBasicMaterial({color:0xFFB95E}));ed.position.y=y0+FH/2;G.add(ed)}}
      E.pill('Torre, extrusión '+o.nm+(sel==null?' · tocá un piso':''),E.CSS.ui)},
    tick(t){const ph=(Math.sin(t*1.3)+1)/2,e=ph<.5?2*ph*ph:1-Math.pow(-2*ph+2,2)/2;noz.position.set(XA+(XB-XA)*e,9*FH+.2,0);hang.forEach((h,k)=>{h.rotation.x=Math.sin(t*1.6+k)*.03});return true}};
}});
