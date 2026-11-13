/* Capa a Capa · escenas 3D del módulo 5, parte 1 (lecciones 5.1 a 5.5). */
import {register,THREE} from '../cac3d.js';
const rnd=(i,k)=>{const x=Math.sin(i*127.1+k*311.7)*43758.5453;return x-Math.floor(x)};
const num=(v,d)=>v.toFixed(d==null?2:d).replace('.',',');
function clear(g){while(g.children.length){const o=g.children.pop();o.traverse(x=>{if(x.geometry)x.geometry.dispose()})}}
function group(E){const g=new THREE.Group();E.scene.add(g);return g}

/* ---------- 5.1 por qué calibrar: la pila ---------- */
const ST1=['Revisión mecánica','Nivelación de cama','Offset Z','Temperatura','Extrusor','Flujo'];
register('l1',{span:26,view:{pos:[18,22,44],target:[0,8,0],posP:[22,28,62],targetP:[0,10,0],min:24,max:140},build(E){
  const M=E.M;E.bed(46,26,{grid:5});const blocks=[],ghosts=[],H=2.6;
  for(let i=0;i<6;i++){const w=30-i*2.4,m=E.slab(w,12-i*.6,1.2,H*.92,i%2?M.fil2:M.fil);m.visible=false;E.scene.add(m);blocks.push(m);
    const g=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w,H*.92,12-i*.6)),new THREE.LineDashedMaterial({color:0xB9C2D8,dashSize:.6,gapSize:.5,transparent:true,opacity:.45}));g.computeLineDistances();g.position.y=i*H+H*.46;E.scene.add(g);ghosts.push(g)}
  const bnc=e=>{const n=7.5625,d=2.75;if(e<1/d)return n*e*e;if(e<2/d)return n*(e-=1.5/d)*e+.75;if(e<2.5/d)return n*(e-=2.25/d)*e+.9375;return n*(e-=2.625/d)*e+.984375};
  return {tick(){const s=E.state('l1'),got=s.got||0,now=performance.now(),wb=s.wob?Math.max(0,1-(now-s.wob)/700):0;
      for(let i=0;i<6;i++){const on=i<got;blocks[i].visible=on;ghosts[i].visible=!on;if(!on){E.unlabel('b'+i);continue}let dy=0;if(i===got-1){const e=Math.min(1,(now-s.t0)/650);dy=(1-bnc(e))*24}
        const sh=wb*Math.sin((now-s.wob)/35)*(i+1)*.25;blocks[i].position.set(sh,i*H+dy,0);E.label('b'+i,[sh,i*H+dy+H*.5,6.2-i*.3],(i+1)+'. '+ST1[i],E.CSS.ink)}
      E.pill(got===6?'lista para calibrar lo demás':'cada calibración se apoya en la de abajo',got===6?E.CSS.pop:E.CSS.ui);return true}};
}});

/* ---------- 5.2 nivelar la cama: cuatro perillas ---------- */
const N2=['Adelante, izquierda','Adelante, derecha','Atrás, derecha','Atrás, izquierda'],C2=[[-13,13],[13,13],[13,-13],[-13,-13]];
const st2=g=>g>.13?['suelto','el papel pasa sin tocar','soft']:g>=.07?['roza','leve resistencia: así','ok']:['trabado',g<=0?'la boquilla toca la cama':'el papel no pasa','bad'];
register('l2',{span:28,view:{pos:[0,24,60],target:[0,-2,0],posP:[0,34,84],targetP:[0,-1,0],min:26,max:150},build(E){
  const M=E.M,W=36,EX=14;
  const carriage=E.mesh(new THREE.BoxGeometry(W+6,1.6,W+6),M.alu);carriage.position.y=-9;E.scene.add(carriage);
  const geo=new THREE.PlaneGeometry(W,W,16,16);geo.rotateX(-Math.PI/2);const base=geo.attributes.position.array.slice();
  const plate=E.mesh(geo,new THREE.MeshStandardMaterial({color:0x232A3B,roughness:.75,metalness:.25,side:THREE.DoubleSide}));E.scene.add(plate);
  const knobs=C2.map(c=>{const g=new THREE.Group();g.position.set(c[0],-6,c[1]);const k=E.mesh(new THREE.CylinderGeometry(2.2,2.2,2,24),new THREE.MeshStandardMaterial({color:0xFFB95E,roughness:.5}));g.add(k);
    for(let i=0;i<8;i++){const r=E.mesh(new THREE.BoxGeometry(.4,2.05,.6),new THREE.MeshStandardMaterial({color:0xE09A3C}));const a=i*Math.PI/4;r.position.set(Math.cos(a)*2.2,0,Math.sin(a)*2.2);r.rotation.y=-a;g.add(r)}
    const sp=E.tube(Array.from({length:30},(_,i)=>[Math.cos(i*.9)*1.1,1+i*.12,Math.sin(i*.9)*1.1]),.12,M.steel,90);g.add(sp);E.scene.add(g);return g});
  const L=group(E),noz=E.nozzle(.7);
  let G=[.3,.1,.2,0];
  function hAt(x,z,g){const u=(x+W/2)/W,v=(W/2-z)/W,h=c=>-g[c]*EX;return (h(0)*(1-u)+h(1)*u)*(1-v)+(h(3)*(1-u)+h(2)*u)*v}
  function apply(){const g=E.state('l2');if(Array.isArray(g))G=g.slice();const p=plate.geometry.attributes.position;for(let i=0;i<p.count;i++){p.setY(i,hAt(base[i*3],base[i*3+2],G))}p.needsUpdate=true;plate.geometry.computeVertexNormals();
    clear(L);C2.forEach((c,i)=>{const s=st2(G[i]),gap=G[i],w=gap>.13?.7:gap>=.07?1.25:1.9,h=gap>.13?.7:gap>=.07?.5:.25,mat=new THREE.MeshStandardMaterial({color:0xFF9E70,roughness:.5,transparent:s[2]==='bad',opacity:s[2]==='bad'?.55:1});
      for(let k=0;k<4;k++){const z=c[1]-3+k*2,x0=c[0]-4,x1=c[0]+4,y=hAt(c[0],z,G);if(s[0]==='suelto'){for(let x=x0;x<x1;x+=1.6)L.add(E.bead(x,z,x+1,z,y+.05,w,h,mat))}else L.add(E.bead(x0,z,x1,z,y+.02,w,h,mat))}
      knobs[i].rotation.y=G[i]*12;knobs[i].children[0].position.y=0;E.label('k'+i,[c[0],hAt(c[0],c[1],G)+3.2,c[1]+(c[1]>0?3.4:-3.4)],s[0],s[2]==='ok'?E.CSS.pop:s[2]==='bad'?E.CSS.bad:E.CSS.soft)});
    const ok=G.filter(g=>g>=.07&&g<=.13).length;E.pill(ok+' de 4 esquinas rozan el papel',ok===4?E.CSS.pop:E.CSS.ui)}
  E.label('n',[0,-11,W/2+4],'adelante',E.CSS.soft);
  let last='';
  return {update(){},tick(t){const g=E.state('l2'),key=Array.isArray(g)?g.join(','):'';if(key!==last){last=key;apply()}
      const ph=(t*.12)%1,ci=Math.floor(ph*4),c=C2[ci];noz.position.set(c[0]*.9,hAt(c[0],c[1],G)+1.2+Math.max(0,G[ci])*EX*0,c[1]*.9);return true}};
}});

/* ---------- 5.3 malla de nivelación (la medición se calcula en la página) ---------- */
const NP=5,zb=(u,v)=>-.16+.64*((u-.5)*(u-.5)+(v-.5)*(v-.5));
register('l3',{span:28,keep2d:true,view:{pos:[22,36,46],target:[0,0,0],posP:[28,48,64],targetP:[0,1,0],min:26,max:150},build(E){
  const M=E.M,W=36,EX=26;const geo=new THREE.PlaneGeometry(W,W,24,24);geo.rotateX(-Math.PI/2);const base=geo.attributes.position.array.slice(),cols=new Float32Array(base.length);
  geo.setAttribute('color',new THREE.BufferAttribute(cols,3));const bedM=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.7,metalness:.2,side:THREE.DoubleSide}),bed=E.mesh(geo,bedM);E.scene.add(bed);
  const car=E.mesh(new THREE.BoxGeometry(W+4,1.4,W+4),M.alu);car.position.y=-6;E.scene.add(car);
  const pts=[];for(let i=0;i<NP*NP;i++){const s=new THREE.Mesh(new THREE.SphereGeometry(.55,12,8),new THREE.MeshStandardMaterial({color:0x56627D}));E.scene.add(s);pts.push(s)}
  const probe=new THREE.Group();E.scene.add(probe);const pb=E.mesh(new THREE.BoxGeometry(3,5,3),new THREE.MeshStandardMaterial({color:0x313C55,roughness:.5}));pb.position.y=4;probe.add(pb);
  const pin=E.mesh(new THREE.CylinderGeometry(.25,.25,1.6,8),new THREE.MeshStandardMaterial({color:0xFFB95E,emissive:0xFFB95E,emissiveIntensity:.6}));pin.position.y=.8;probe.add(pin);
  const LN=group(E);const heat=z=>{const a=new THREE.Color(0x6D8FD6),b=new THREE.Color(0x86D9B5),d=new THREE.Color(0xFF9E70),k=(z+.16)/.32;return k<.5?a.lerp(b,k*2):b.lerp(d,(k-.5)*2)};
  let key='';
  return {tick(t){const s=E.state('l3'),n=s.n||0,meas=n>=NP*NP,loose=document.getElementById('loose3').checked,use=document.getElementById('use3').checked&&meas,jit=loose?Math.sin(t*7)*.07+Math.sin(t*3.1)*.04:0;
      const p=geo.attributes.position,gray=new THREE.Color(0x2E3850);
      for(let i=0;i<p.count;i++){const x=base[i*3],z=base[i*3+2],u=(x+W/2)/W,v=(z+W/2)/W,zz=zb(u,v)+jit*(u-.5)*2;p.setY(i,zz*EX);const c=meas?heat(zb(u,v)):gray;cols[i*3]=c.r;cols[i*3+1]=c.g;cols[i*3+2]=c.b}
      p.needsUpdate=true;geo.attributes.color.needsUpdate=true;geo.computeVertexNormals();
      for(let i=0;i<NP;i++)for(let j=0;j<NP;j++){const idx=i*NP+(i%2?NP-1-j:j),u=(j+.5)/NP,v=(i+.5)/NP,o=pts[i*NP+j];o.position.set(-W/2+u*W,zb(u,v)*EX+.6,-W/2+v*W);o.material.color.setHex(idx<n?0xFFB95E:0x56627D)}
      probe.visible=!!s.run;if(s.run){const pi=Math.min(NP*NP-1,n),ii=Math.floor(pi/NP),jj=ii%2?NP-1-pi%NP:pi%NP,u=(jj+.5)/NP,v=(ii+.5)/NP;probe.position.set(-W/2+u*W,zb(u,v)*EX+.4+Math.abs(Math.sin(t*14))*1.4,-W/2+v*W)}
      const k2=[use,loose,Math.round(jit*40)].join();if(k2!==key){key=k2;clear(LN);const mat=new THREE.MeshStandardMaterial({color:0xFF9E70,roughness:.5});
        for(let k=0;k<40;k++){const u=(k+.5)/40,bz=zb(u,.5)+jit*(u-.5)*2,nz=use?zb(u,.5):-.06,gp=.1+(nz-bz),x0=-W/2+k/40*W,x1=x0+W/40;if(gp>.17)continue;const h=Math.max(.15,Math.min(1.2,gp*8)),w=Math.max(.8,Math.min(2.6,.9*.1/Math.max(.02,gp)*1.1));
          LN.add(E.bead(x0,0,x1+.05,0,bz*EX,w,h,gp<.04?new THREE.MeshStandardMaterial({color:0xFF9E70,transparent:true,opacity:.55}):mat))}}
      E.pill(loose?'la cama se mueve':use?'primera capa pareja':meas?'pareja solo en una zona':'medí la cama',loose?E.CSS.bad:use?E.CSS.pop:E.CSS.ui);
      E.label('m',[-W/2,-1,W/2+3],meas?'mapa medido · alturas exageradas':'cama sin medir',E.CSS.soft);return true}};
}});

/* ---------- 5.4 offset Z ---------- */
register('l4',{span:7,view:{pos:[4,10,17],target:[0,1,0],posP:[5,13,23],targetP:[0,1.3,0],min:6,max:40},build(E){
  const M=E.M,K=4;E.bed(16,10,{grid:1});const L=group(E),noz=E.nozzle(.5);let O=null;
  return {update(){},tick(t){const s=E.state('l4'),o=s.o==null?.12:s.o;if(o!==O){O=o;clear(L);const g=Math.max(.02,.2+o),h=g*K*.9,w=Math.min(3.2,.45*.2/g*K*1.15),low=o<-.02,pitch=.45*K;
        const mat=new THREE.MeshStandardMaterial({color:0xFF9E70,roughness:.5,transparent:low,opacity:low?Math.max(.45,1+o*6):1});
        for(let k=0;k<5;k++){const z=-3.6+k*pitch;L.add(E.bead(-6,z,6,z,0,w,h,mat));if(o<-.06)for(let r=0;r<3;r++)L.add(E.bead(-6,z-w*.3+r*w*.3,6,z-w*.3+r*w*.3,h*.98,.06,.02,new THREE.MeshStandardMaterial({color:0x3A2418})))}
        const st=o>.06?'alto':o>.02?'algo alto':o>=-.02?'justo':o>=-.06?'algo bajo':'bajo';E.label('o',[-6.5,0,5.2],'capa real '+num(g)+' mm',st==='justo'?E.CSS.pop:E.CSS.ui);
        E.pill({alto:'líneas redondas y separadas',  'algo alto':'líneas que apenas se tocan',justo:'líneas aplastadas justas',  'algo bajo':'líneas finas y anchas','bajo':'transparente y raspada'}[st],st==='justo'?E.CSS.pop:st==='alto'||st==='bajo'?E.CSS.bad:E.CSS.ui)}
      noz.position.set(Math.sin(t*.8)*5,Math.max(.02,.2+O)*K,-3.6+((Math.floor(t*.8/Math.PI))%5+5)%5*.45*K);return true}};
}});

/* ---------- 5.5 torre de temperatura ---------- */
const TW={PLA:{hi:230,ideal:207.5},PETG:{hi:260,ideal:237.5}};
register('l5',{span:22,view:{pos:[16,22,44],target:[0,11,0],posP:[20,28,62],targetP:[0,13,0],min:22,max:140},build(E){
  E.bed(40,22,{grid:5});const G=group(E),FH=2.4,W=22,DZ=8;let key='';
  return {update(){const m=E.chip('mat5','m')||'PLA',pb=document.querySelector('#tmp5 [aria-pressed="true"]'),sel=pb?+pb.dataset.t:null,k2=m+sel;if(k2===key)return;key=k2;clear(G);
      const col=m==='PLA'?0xFF9E70:0x8FD3E8,col2=m==='PLA'?0xEE8455:0x6FBCD6,A=new THREE.MeshStandardMaterial({color:col,roughness:.5}),B=new THREE.MeshStandardMaterial({color:col2,roughness:.5});
      for(let i=0;i<9;i++){const T=TW[m].hi-5*i,d=T-TW[m].ideal,str=Math.max(0,Math.min(1,(d-4)/16)),droop=Math.max(0,Math.min(1,(d-2)/18)),cold=Math.max(0,Math.min(1,(-d-4)/14)),y0=i*FH,mt=i%2?B:A;
        const sl=E.mesh(new THREE.BoxGeometry(W,FH*.32,DZ),mt);sl.position.set(0,y0+FH*.16,0);G.add(sl);
        if(cold>0)for(let k=0;k<Math.round(cold*7);k++){const h=E.mesh(new THREE.BoxGeometry(1,.25,.1),new THREE.MeshStandardMaterial({color:0x141B2B}),false);h.position.set(-W/2+rnd(i,k+30)*W,y0+FH*.16,DZ/2+.05);G.add(h)}
        const top=y0+FH,py=y0+FH*.32;[-W/2+1,-W/2+8].forEach(x=>{const c=E.mesh(new THREE.BoxGeometry(1.6,FH-FH*.32-.3,DZ*.6),A);c.position.set(x,(py+top-.3)/2,0);G.add(c)});
        const dr=droop*1.4;G.add(E.tube([[-W/2+1,top-.25,0],[-W/2+4.5,top-.25-2*dr,0],[-W/2+8,top-.25,0]],.3,mt,16));
        const cone=E.mesh(new THREE.ConeGeometry(1.5,FH-FH*.32,16),A);cone.position.set(4,(py+top)/2,0);G.add(cone);const col2m=E.mesh(new THREE.CylinderGeometry(.8,.8,FH-FH*.32,12),A);col2m.position.set(9,(py+top)/2,0);G.add(col2m);
        for(let k=0;k<Math.round(str*7);k++){const yy=py+(k+.5)*(top-py)/7;G.add(E.tube([[4.3,yy,0],[6.5,yy+(rnd(i,k)-.3)*.8,.4],[8.3,yy+(rnd(k,i)-.5)*.4,0]],.04,A,8))}
        E.label('t'+i,[-W/2-3,y0+FH*.5,DZ/2],T+' °C',sel===T?E.CSS.ui:E.CSS.soft);
        if(sel===T){const e=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(W+1.2,FH,DZ+1.2)),new THREE.LineBasicMaterial({color:0xFFB95E}));e.position.y=y0+FH/2;G.add(e)}}
      E.pill(sel==null?'tocá un piso':'piso de '+sel+' °C',sel==null?E.CSS.ink:E.CSS.ui)}};
}});
