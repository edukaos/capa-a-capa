/* Capa a Capa · escenas 3D del módulo 4, parte 3 (lecciones 4.13 a 4.18). */
import {register,THREE} from '../cac3d.js';
const num=(v,d)=>v.toFixed(d==null?1:d).replace('.',',');
function clear(g){while(g.children.length){const o=g.children.pop();o.traverse(x=>{if(x.geometry)x.geometry.dispose()})}}
function group(E){const g=new THREE.Group();E.scene.add(g);return g}
const rnd=(i,k)=>{const x=Math.sin(i*127.1+k*311.7)*43758.5453;return x-Math.floor(x)};

/* ---------- 4.13 falda, ala y balsa (el empujón se calcula en la página) ---------- */
register('l1',{span:22,keep2d:true,view:{pos:[27,22,37],target:[0,7.5,0],posP:[32,28,46],targetP:[0,8.5,0],min:18,max:110},build(E){
  const M=E.M;E.bed(40,30,{grid:5});const H=group(E),T=new THREE.Group();E.scene.add(T);const tower=new THREE.Group();T.add(tower);
  const gray=[new THREE.MeshStandardMaterial({color:0x9AA6C2,roughness:.6}),new THREE.MeshStandardMaterial({color:0xB9C3DA,roughness:.6})];
  for(let i=0;i<16;i++){const m=E.mesh(new THREE.BoxGeometry(5,.9,5),i%2?M.fil2:M.fil);m.position.y=i*.95+.45;tower.add(m)}
  const noz=E.nozzle(.45);noz.visible=false;let MD=null,ry=0;
  return {update(){const m=E.chip('adh1','a')||'no';if(m===MD)return;MD=m;clear(H);ry=0;
      if(m==='falda')H.add(E.shell(14,14,2,.5,.3,M.fil2));
      if(m==='ala')for(let k=0;k<8;k++){const d=2*(2.5+(k+1)*.62);H.add(E.shell(d,d,d*.12,.62,.3,k%2?M.fil2:M.fil))}
      if(m==='balsa'){for(let i=0;i<3;i++){const s=E.mesh(new THREE.BoxGeometry(11.2,.5,11.2),gray[i%2]);s.position.y=i*.5+.25;H.add(s)}ry=1.5}
      E.pill(m==='no'?'base chiquita':m==='falda'?'la falda no toca la pieza':m==='ala'?'base agrandada':'tarima entera debajo',m==='ala'?E.CSS.pop:m==='balsa'?E.CSS.ui:E.CSS.ink)},
    tick(){const s=E.state('l1'),m=MD,holds=m==='ala'||m==='balsa',e=s.t0?(performance.now()-s.t0)/1000:-1;let tilt=0;
      if(e>=.5){const q=e-.5;tilt=holds?.09*Math.exp(-3*q)*Math.sin(q*14):Math.min(Math.PI/2,q*q*3.2)}
      // gira sobre el borde de la base, del lado contrario al empujón
      T.position.set(holds?0:2.5,ry,0);tower.position.set(holds?0:-2.5,0,0);T.rotation.z=-tilt;
      noz.visible=e>=0&&e<1.2;if(noz.visible)noz.position.set(-8+Math.min(1,e/.5)*6.2-(e>.5?(e-.5)*5:0),ry+9,0);
      return e>=0&&e<3}};
}});

/* ---------- 4.14 retracción ---------- */
register('l2',{span:26,view:{pos:[10,22,44],target:[0,7,0],posP:[12,30,60],targetP:[0,9,0],min:24,max:140},build(E){
  const M=E.M,DZ=8;E.bed(46,22,{grid:5});const S=group(E);
  [-9,9].forEach(x=>{for(let k=0;k<8;k++)E.scene.add(E.bead(x,-DZ/2,x,DZ/2,k,4.4,1,k%2?M.fil2:M.fil))});
  const head=new THREE.Group();E.scene.add(head);const noz=E.nozzle(.5);head.add(noz);noz.position.y=0;
  const filM=new THREE.MeshStandardMaterial({color:E.COL.fil,roughness:.45}),fil=E.mesh(new THREE.CylinderGeometry(.45,.45,10,12),filM);head.add(fil);
  const tube=E.mesh(new THREE.CylinderGeometry(.9,.9,10,16,1,true),new THREE.MeshStandardMaterial({color:0xE4E8F3,transparent:true,opacity:.25,roughness:.2,side:THREE.DoubleSide}),false);tube.position.y=14;head.add(tube);
  const blob=E.mesh(new THREE.SphereGeometry(1.1,16,12),E.M.hot,false);blob.position.y=5.5;head.add(blob);
  let st={d:1,need:5,q:.8,ex:false};
  return {update(){clear(S);const d=E.val('ret2'),sy=E.chip('sys2','s')||'bowden',need=sy==='bowden'?5:1,q=Math.max(0,Math.min(1,1-d/need)),ex=sy==='directo'&&d>=3.5;st={d,need,q,ex};
      const n=Math.round(q*6);for(let k=0;k<n;k++){const y=8-(k+.6)*1.2+.4,z=-DZ/2+1+k*(DZ-2)/6,pts=[];for(let i=0;i<=10;i++){const t=i/10;pts.push([-6.8+13.6*t,y-Math.sin(Math.PI*t)*(.6+k%2*.5),z])}S.add(E.tube(pts,.06+q*.08,M.fil,24))}
      blob.visible=ex;E.label('r',[0,22,0],(sy==='bowden'?'Bowden':'Directo')+' · referencia '+need+' mm',E.CSS.soft);
      E.pill(ex?'riesgo de atasco':n===0?'sin hilos':n<=2?'algún hilo':'muchos hilos',ex?E.CSS.bad:n===0?E.CSS.pop:n<=2?E.CSS.ui:E.CSS.bad)},
    tick(t){const ph=(t*.25)%1,trav=ph<.1||(ph>=.5&&ph<.6),xa=-9,xb=9,hx=ph<.1?xb+(xa-xb)*(ph/.1):ph<.5?xa:ph<.6?xa+(xb-xa)*((ph-.5)/.1):xb;
      head.position.set(hx,8.2,0);const back=trav?st.d*.55:0;fil.position.y=10.5+back;return true}};
}});

/* ---------- 4.15 velocidad y aceleración ---------- */
register('l3',{span:22,view:{pos:[26,30,34],target:[0,4,0],posP:[32,38,46],targetP:[0,6,0],min:20,max:120},build(E){
  const M=E.M,L=20,HW=6;E.bed(40,40,{grid:5});const W=group(E);const noz=E.nozzle(.45);let p=null;
  const ph=()=>{const v=E.val('v3'),a=E.val('a3'),vm=Math.sqrt(a*L),reach=v<=vm,ts=reach?L/v+v/a:2*Math.sqrt(L/a);return{v,a,vp:reach?v:vm,reach,ts,t4:4*ts,amp:a/10000}};
  const P=[[-10,-10],[10,-10],[10,10],[-10,10]];
  function edge(i,d){const a=P[i],b=P[(i+1)%4],ux=(b[0]-a[0])/L,uz=(b[1]-a[1])/L,off=p.amp*.9*Math.exp(-d/(L*.2))*Math.sin(d/(L*.035));return[a[0]+ux*d+uz*off,a[1]+uz*d-ux*off]}
  function chart(c,w,h){if(!p)return;const x0=12,x1=w-12,y0=h-14,y1=26,VM=320,X=v=>x0+(x1-x0)*v,Y=v=>y0-(y0-y1)*v/VM;
    c.font='700 11px "DM Sans",system-ui,sans-serif';c.fillStyle=E.CSS.pop;c.textAlign='left';c.fillText(w<170?'real':'velocidad real',x0,15);c.fillStyle=E.CSS.ui;c.textAlign='right';c.fillText('pedida',x1,15);
    c.strokeStyle=E.CSS.ui;c.setLineDash([4,4]);c.lineWidth=1.4;c.beginPath();c.moveTo(x0,Y(p.v));c.lineTo(x1,Y(p.v));c.stroke();c.setLineDash([]);
    const da=p.vp*p.vp/(2*p.a)/20;c.strokeStyle=E.CSS.pop;c.lineWidth=2.4;c.beginPath();c.moveTo(X(0),Y(0));for(let k=1;k<=20;k++){const xx=da*k/20;c.lineTo(X(xx),Y(Math.sqrt(2*p.a*xx*20)))}c.lineTo(X(1-da),Y(p.vp));for(let k=1;k<=20;k++){const xx=da*(1-k/20);c.lineTo(X(1-xx),Y(Math.sqrt(2*p.a*xx*20)))}c.stroke()}
  E.chart(chart);
  return {update(){p=ph();clear(W);const seg=[];for(let i=0;i<4;i++){let q=edge(i,0);for(let d=.5;d<=L+.01;d+=.5){const r=edge(i,d);seg.push([q[0],q[1],r[0],r[1]]);q=r}}
      const bands=[];for(let y=0;y<HW-.01;y+=.4)bands.push([y,y+.4,seg]);W.add(E.ribbons(bands,.9,M.fil));
      E.label('a',[0,0,13],'cubo de 20 mm',E.CSS.soft);E.pill(p.a>6000?'ondas marcadas':p.a>3000?'ondas suaves':'pared limpia',p.a>6000?E.CSS.bad:p.a>3000?E.CSS.ui:E.CSS.pop);E.redraw()},
    tick(t){if(!p)return false;const per=Math.max(1.2,p.t4*2.2),uu=((t/per)%1)*4,ei=Math.floor(uu),fr=uu-ei,sm=fr*fr*(3-2*fr),ef=fr+(sm-fr)*(1-p.amp),q=edge(ei,ef*L);noz.position.set(q[0],HW+.1,q[1]);return true}};
}});

/* ---------- 4.16 ventilador de capa ---------- */
register('l4',{span:20,view:{pos:[8,16,36],target:[3,7,0],posP:[10,22,48],targetP:[3,9,0],min:18,max:110},build(E){
  const M=E.M;E.bed(36,22,{grid:5});const T=group(E),fan=E.fan(.9);fan.g.position.set(13,13,0);fan.g.rotation.z=Math.PI/2;
  const abs=[new THREE.MeshStandardMaterial({color:0xE8E2D0,roughness:.5}),new THREE.MeshStandardMaterial({color:0xD3CCB6,roughness:.5})];
  const hotM=(base,m)=>{const c=new THREE.Color(base.color).lerp(new THREE.Color(0xFFF0B8),m*.5);return new THREE.MeshStandardMaterial({color:c,roughness:.4})};
  const air=[];for(let k=0;k<6;k++){const l=E.line([[0,0,0],[-1.6,-.4,0]]);l.material=E.M.air.clone();air.push(l)}
  const noz=E.nozzle(.4);let s={fa:.1,melt:1,crack:0},top=16,MAT='PLA';
  return {update(){const fa=E.val('fan4')/100,mt=E.chip('mat4','m')||'PLA';MAT=mt;s={fa,melt:mt==='PLA'?Math.max(0,1-fa/.8):Math.max(0,.25-fa),crack:mt==='ABS'?Math.max(0,(fa-.2)/.8):0};clear(T);
      const A=mt==='PLA'?[M.fil,M.fil2]:abs;let gap=0;const n=16;
      for(let i=0;i<n;i++){const ww=10-i*.58,m=i>7?s.melt*(i-7)/8:0,cr=(i===4||i===8||i===11)?s.crack*.55:0;gap+=cr;const y=i+gap-m*i*.16,xo=cr?(i%2?1:-1)*s.crack*.5:0;
        if(m>.05){const o=E.mesh(new THREE.SphereGeometry(.5,20,10),hotM(A[i%2],m));o.scale.set(ww+m*3.6,1.1+m,ww*.6+m*3.6);o.position.set(Math.sin(i*2.1)*m,y+.5,0);T.add(o)}
        else{const o=E.mesh(new THREE.BoxGeometry(ww,.92,ww*.6),A[i%2]);o.position.set(xo,y+.5,0);T.add(o)}}
      top=n+gap-(s.melt*1.6);air.forEach(l=>{l.visible=fa>0;l.material.opacity=.25+.5*fa});
      E.pill(mt==='PLA'?(s.melt>.6?'punta derretida':s.melt>0?'punta redondeada':'punta nítida'):(s.crack>.5?'capas separadas':s.crack>0?'grietas finas':'capas bien unidas'),(s.melt>.6||s.crack>.5)?E.CSS.bad:(s.melt>0||s.crack>0)?E.CSS.ui:E.CSS.pop)},
    tick(t,dt){fan.spin(dt,s.fa);noz.position.set(Math.sin(t*3)*.4,top+.6,0);air.forEach((l,k)=>{const o=(t*14*s.fa+k*1.9)%6;l.position.set(10.5-o,11.2+k*.7,0)});return true}};
}});

/* ---------- 4.17 costura ---------- */
register('l5',{span:22,view:{pos:[0,16,44],target:[0,7,0],posP:[0,22,60],targetP:[0,9,0],min:22,max:130},build(E){
  const M=E.M,n=18,lh=.85;E.bed(46,26,{grid:5});const S=group(E);
  const cyl=new THREE.Group();cyl.position.x=-10;E.scene.add(cyl);for(let i=0;i<n;i++){const m=E.mesh(new THREE.CylinderGeometry(6.5,6.5,lh*.95,48),i%2?M.fil2:M.fil);m.position.y=i*lh+lh/2;cyl.add(m)}
  const cub=new THREE.Group();cub.position.x=10;cub.rotation.y=Math.PI/4;E.scene.add(cub);for(let i=0;i<n;i++){const m=E.mesh(new THREE.BoxGeometry(10,lh*.95,10),i%2?M.fil2:M.fil);m.position.y=i*lh+lh/2;cub.add(m)}
  const dotM=new THREE.MeshStandardMaterial({color:0x9A4E2E,roughness:.6}),dotG=new THREE.SphereGeometry(.42,10,8);
  E.label('a',[-10,0,9],'Cilindro',E.CSS.soft);E.label('b',[10,0,9],'Cubo',E.CSS.soft);
  return {update(){const se=E.chip('seam5','s')||'alineada';clear(S);
      for(let i=0;i<n;i++){const th=se==='aleatoria'?rnd(i,7)*Math.PI*2:se==='atras'?Math.PI:.45,d=new THREE.Mesh(dotG,dotM);d.scale.set(.8,1,.8);d.position.set(-10+6.5*Math.sin(th),i*lh+lh/2,6.5*Math.cos(th));S.add(d)}
      for(let i=0;i<n;i++){const s=se==='aleatoria'?rnd(i,11)*4:se==='atras'?3:se==='esquina'?1:.5,f=Math.floor(s),fr=s-f,c=[[-5,5],[5,5],[5,-5],[-5,-5]],a=c[f%4],b=c[(f+1)%4];
        const lx=a[0]+(b[0]-a[0])*fr,lz=a[1]+(b[1]-a[1])*fr,v=new THREE.Vector3(lx*1.04,0,lz*1.04).applyAxisAngle(new THREE.Vector3(0,1,0),Math.PI/4),d=new THREE.Mesh(dotG,dotM);d.position.set(10+v.x,i*lh+lh/2,v.z);if(se==='esquina')d.scale.setScalar(.6);S.add(d)}
      E.pill(se==='alineada'?'raya vertical al frente':se==='aleatoria'?'puntitos repartidos':se==='atras'?'escondida atrás':'en la arista del cubo',se==='atras'?E.CSS.pop:E.CSS.ui)}};
}});

/* ---------- 4.18 vista previa ---------- */
register('l6',{span:22,view:{pos:[14,20,40],target:[0,7,0],posP:[16,26,54],targetP:[0,9,0],min:22,max:130},build(E){
  const M=E.M,DZ=8;E.bed(44,24,{grid:5});const S=group(E);
  const VC=[{model:[[-2,0,4,10],[-9,10,18,3]],print:[[-2,0,4,10],[-9,10,18,3]]},{model:[[-7,3,14,10]],print:[[-7,3,14,10]]},{model:[[-9,0,13,8],[6,0,.9,13]],print:[[-9,0,13,8]]}];
  const cur=new THREE.MeshStandardMaterial({color:0xFFB95E,emissive:0x8A5200,emissiveIntensity:.5,roughness:.4}),dash=new THREE.LineDashedMaterial({color:0xE4E8F3,dashSize:.6,gapSize:.5,transparent:true,opacity:.7});
  const plane=new THREE.Mesh(new THREE.PlaneGeometry(34,14),new THREE.MeshBasicMaterial({color:0xFFB95E,transparent:true,opacity:.08,side:THREE.DoubleSide,depthWrite:false}));plane.rotation.x=-Math.PI/2;E.scene.add(plane);
  return {update(){const k=E.val('lay6'),D=VC[+(E.chip('case6','c')||0)];clear(S);
      for(let i=0;i<k;i++)D.print.forEach(r=>{if(i>=r[1]&&i<r[1]+r[3]){const m=E.mesh(new THREE.BoxGeometry(r[2],.92,DZ),i===k-1?cur:(i%2?M.fil2:M.fil));m.position.set(r[0]+r[2]/2,i+.5,0);S.add(m)}});
      D.model.forEach(r=>{const g=new THREE.EdgesGeometry(new THREE.BoxGeometry(r[2],r[3],DZ+.3)),l=new THREE.LineSegments(g,dash);l.computeLineDistances();l.position.set(r[0]+r[2]/2,r[1]+r[3]/2,0);S.add(l)});
      plane.position.y=k+.02;E.label('k',[-17,k,0],'capa '+k,E.CSS.ui);E.label('a',[0,-1,8],'naranja: lo que se imprime · punteado: el modelo',E.CSS.soft);E.pill('capa '+k+' de 14',E.CSS.ui)}};
}});
