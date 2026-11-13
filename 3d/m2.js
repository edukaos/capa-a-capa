/* Capa a Capa · escenas 3D del módulo 2, parte 1 (lecciones 2.1 a 2.5). */
import {register,THREE} from '../cac3d.js';
const fmm=v=>v.toFixed(1).replace('.',',')+' mm';
function clear(g){while(g.children.length){const o=g.children.pop();o.traverse(x=>{if(x.geometry)x.geometry.dispose()})}}
function group(E){const g=new THREE.Group();E.scene.add(g);return g}
function arrow(E,from,dir,len,color){const a=new THREE.ArrowHelper(new THREE.Vector3(...dir).normalize(),new THREE.Vector3(...from),len,color,len*.28,len*.16);E.scene.add(a);return a}

/* ---------- 2.1 ejes X, Y y Z ---------- */
register('l1',{span:40,view:{pos:[58,52,88],target:[0,19,0],posP:[72,66,116],targetP:[0,21,0],min:40,max:220},build(E){
  const W=36,k=W/220,P=E.printer(W,46);const TG=[180,40,10];
  const ring=new THREE.Mesh(new THREE.TorusGeometry(1.6,.28,10,32),new THREE.MeshStandardMaterial({color:0xFFB95E,emissive:0xFFB95E,emissiveIntensity:.8}));
  ring.rotation.x=Math.PI/2;ring.position.set((TG[0]-110)*k,TG[2]*k,(TG[1]-110)*k);P.bed.add(ring);
  const pin=E.mesh(new THREE.CylinderGeometry(.12,.12,TG[2]*k,8),new THREE.MeshBasicMaterial({color:0xFFB95E}),false);pin.position.set(ring.position.x,TG[2]*k/2,ring.position.z);P.bed.add(pin);
  arrow(E,[-W/2-9,-3,W/2+6],[1,0,0],8,0xFFB95E);arrow(E,[-W/2-9,-3,W/2+6],[0,1,0],8,0xFF9E70);arrow(E,[-W/2-9,-3,W/2+6],[0,0,-1],8,0x86D9B5);
  E.label('x',[-W/2+1,-3,W/2+6],'X',E.CSS.ui);E.label('z',[-W/2-9,7.5,W/2+6],'Z','#FF9E70');E.label('y',[-W/2-9,-3,W/2-4],'Y',E.CSS.pop);
  E.label('t',[ring.position.x,TG[2]*k+2.6,ring.position.z],'punto a alcanzar',E.CSS.ui);
  const p={x:110,y:110,z:60};
  return {tick(){const tx=E.val('ax'),ty=E.val('ay'),tz=E.val('az');p.x+=(tx-p.x)*.2;p.y+=(ty-p.y)*.2;p.z+=(tz-p.z)*.2;
      P.set((p.x-110)*k,(p.y-110)*k,p.z*k);E.label('t',[ring.position.x+P.bed.position.x,TG[2]*k+2.6,ring.position.z+P.bed.position.z],'punto a alcanzar',E.CSS.ui);
      E.pill('X '+Math.round(p.x)+' · Y '+Math.round(p.y)+' · Z '+Math.round(p.z),E.CSS.ink);return Math.abs(tx-p.x)+Math.abs(ty-p.y)+Math.abs(tz-p.z)>.05}};
}});

/* ---------- 2.2 cama móvil y CoreXY ---------- */
register('l2',{span:48,view:{pos:[0,52,104],target:[0,18,0],posP:[0,70,160],targetP:[0,20,0],min:50,max:260},build(E){
  const M=E.M,W=30,k=W/100*.9,SQ=[[-35,-35],[35,-35],[35,35],[-35,35]];
  const A=E.printer(W,40,{spool:false});A.g.position.x=-26;const B=E.corexy(W,42,{open:true});B.g.position.x=26;
  const mkTower=(par)=>{const t=new THREE.Group();for(let i=0;i<22;i++){const m=E.mesh(new THREE.BoxGeometry(2.4,.9,2.4),i%2?M.fil2:M.fil);m.position.y=i+.45;t.add(m)}par.add(t);return t};
  const tA=mkTower(A.bed),tB=mkTower(B.bed);tA.position.set(-8,0,8);tB.position.set(-8,0,8);
  const trace=(par)=>{const pts=SQ.concat([SQ[0]]).map(q=>new THREE.Vector3(q[0]*k,.05,q[1]*k));const ghost=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:0xFF9E70,transparent:true,opacity:.3}));par.add(ghost);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(18),3));const l=new THREE.Line(g,new THREE.LineBasicMaterial({color:0xFF9E70}));par.add(l);return l};
  const lA=trace(A.bed),lB=trace(B.bed);
  E.label('a',[-26,-7,24],'Cama móvil: la torre viaja con la cama',E.CSS.soft);E.label('b',[26,-7,24],'CoreXY: se mueve solo el cabezal',E.CSS.soft);
  let U=0;
  function draw(l,sg,px,py){const a=l.geometry.attributes.position;let n=0;const put=(x,y)=>{a.setXYZ(n++,x*k,.06,y*k)};put(SQ[0][0],SQ[0][1]);for(let i=1;i<=sg;i++)put(SQ[i][0],SQ[i][1]);put(px,py);l.geometry.setDrawRange(0,n);a.needsUpdate=true}
  return {update(){const a=E.val('acc');E.pill(a<=3?'aceleración baja':a<=6?'aceleración media':'aceleración alta: mirá la torre de la izquierda',a>6?E.CSS.bad:E.CSS.ui)},
    tick(t,dt){const a=E.val('acc'),sp=.28+.085*a;U+=dt*sp;const lap=U%4,sg=Math.floor(lap),fr=lap-sg,p0=SQ[sg],p1=SQ[(sg+1)%4],px=p0[0]+(p1[0]-p0[0])*fr,py=p0[1]+(p1[1]-p0[1])*fr,tau=fr/sp;
      const wob=(a/10)*Math.exp(-2.4*tau)*Math.cos(15*tau)*(sg%2?1:-1);
      A.set(px*k,py*k,22.3);tA.rotation.x=-wob*.35;draw(lA,sg,px,py);
      B.set(px*k,-py*k,22.3);draw(lB,sg,px,py);B.motors[0].children[0].rotation.y=(px+py)*.11;B.motors[1].children[0].rotation.y=(px-py)*.11;return true}};
}});

/* ---------- 2.3 motor paso a paso (los pasos se calculan en la página) ---------- */
register('l3',{span:34,keep2d:true,view:{pos:[0,24,58],target:[0,4,0],posP:[0,34,84],targetP:[0,6,0],min:30,max:180},build(E){
  const M=E.M,XM=-24,XI=24,R=2.2,X0=-16,X1=20,SC=(X1-X0)/60;
  const base=E.mesh(new THREE.BoxGeometry(62,1.4,14),new THREE.MeshStandardMaterial({color:0x232A3B,roughness:.7}));base.position.y=-1.5;E.scene.add(base);
  const rail=E.mesh(new THREE.BoxGeometry(50,1.2,2),M.alu);rail.position.set(0,5,-3);E.scene.add(rail);
  const mot=E.mesh(new THREE.BoxGeometry(8.4,8.4,8.4),M.dark);mot.position.set(XM,3.4,-6);E.scene.add(mot);
  const cap=E.mesh(new THREE.BoxGeometry(8.6,1.4,8.6),M.alu);cap.position.set(XM,7.4,-6);E.scene.add(cap);
  const pul=[XM,XI].map(x=>{const p=new THREE.Group();p.position.set(x,5,0);const c=E.mesh(new THREE.CylinderGeometry(R,R,2.4,24),M.steel);c.rotation.x=Math.PI/2;p.add(c);
    const mk=E.mesh(new THREE.BoxGeometry(.4,R*1.6,2.6),M.dark);p.add(mk);E.scene.add(p);return p});
  const beltM=new THREE.MeshStandardMaterial({color:0x141B2B,roughness:.8});[R,-R].forEach(y=>{const b=E.mesh(new THREE.BoxGeometry(XI-XM,.5,2),beltM);b.position.set(0,5+y,0);E.scene.add(b)});
  const teeth=[];for(let i=0;i<24;i++){const t=E.mesh(new THREE.BoxGeometry(.3,.6,2.1),new THREE.MeshStandardMaterial({color:0x8E9BBB}),false);E.scene.add(t);teeth.push(t)}
  const car=E.mesh(new THREE.BoxGeometry(5,4,5),new THREE.MeshStandardMaterial({color:0x86D9B5,roughness:.5}));E.scene.add(car);
  const ghost=E.mesh(new THREE.BoxGeometry(5.2,4.2,5.2),new THREE.MeshBasicMaterial({color:0xFFB95E,transparent:true,opacity:.25,depthWrite:false}),false);E.scene.add(ghost);
  // regla
  const rp=[];for(let mm=0;mm<=60;mm+=5){const x=X0+mm*SC;rp.push(x,-.7,6,x,-.7,6+(mm%10?.8:1.6))}rp.push(X0,-.7,6,X1,-.7,6);
  const rg=new THREE.BufferGeometry();rg.setAttribute('position',new THREE.Float32BufferAttribute(rp,3));E.scene.add(new THREE.LineSegments(rg,new THREE.LineBasicMaterial({color:0xB9C2D8})));
  for(let mm=0;mm<=60;mm+=20)E.label('r'+mm,[X0+mm*SC,-.7,9.4],mm+' mm',E.CSS.soft);
  E.label('m',[XM,-1,6],'1 paso = 1,8°',E.CSS.soft);
  return {tick(){const s=E.state('l3'),d=s.d||0,dc=s.dc||0,ang=d*Math.PI/100;pul.forEach(p=>{p.rotation.z=-ang});
      const xr=X0+d*.2*SC,xc=X0+dc*.2*SC;car.position.set(xr,5+R+2.2,0);ghost.visible=Math.abs(dc-d)>1;ghost.position.set(xc,5+R+2.2,0);
      if(ghost.visible)E.label('g',[xc,12,0],'cree que está acá',E.CSS.ui);else E.unlabel('g');
      const off=(d*.2*SC)%2;teeth.forEach((t,i)=>{const top=i<12,x=XM+((i%12)*4+(top?off:-off)+48)%48;t.position.set(x,5+(top?R+.35:-R-.35),0)});
      E.pill('Pasos enviados: '+(s.cmd||0)+' · el carro está en '+fmm((s.real||0)*.2),s.cmd!==s.real?E.CSS.bad:E.CSS.ui);return true}};
}});

/* ---------- 2.4 correa y husillo ---------- */
register('l4',{span:36,sel:'.vs',ar:'2/1',view:{pos:[0,26,70],target:[0,10,0],posP:[0,36,104],targetP:[0,12,0],min:36,max:200},build(E){
  const M=E.M;
  // correa (izquierda)
  const L=new THREE.Group();L.position.x=-18;E.scene.add(L);const X1=-13,X2=13,R=1.6,Y=18;
  [X1,X2].forEach(x=>{const p=E.mesh(new THREE.CylinderGeometry(R,R,2,20),M.steel);p.rotation.x=Math.PI/2;p.position.set(x,Y,0);L.add(p)});
  const beltM=new THREE.MeshStandardMaterial({color:0x141B2B,roughness:.8});let belts=[];const car=E.mesh(new THREE.BoxGeometry(4.6,3,3.6),new THREE.MeshStandardMaterial({color:0xFFB95E,roughness:.5}));L.add(car);
  const WG=new THREE.Group();L.add(WG);const bedL=E.mesh(new THREE.BoxGeometry(30,.8,14),M.pei);bedL.position.y=-.4;L.add(bedL);
  // husillo (derecha)
  const Rg=new THREE.Group();Rg.position.x=18;E.scene.add(Rg);const mot=E.mesh(new THREE.BoxGeometry(5,5,5),M.dark);mot.position.set(-6,2.5,0);Rg.add(mot);
  const st=E.layerTex(.25);st.repeat.set(1,4);const screw=E.mesh(new THREE.CylinderGeometry(.7,.7,30,16),new THREE.MeshStandardMaterial({color:0xC9D2E6,roughness:.3,metalness:.9,bumpMap:st,bumpScale:1}));screw.position.set(-6,20,0);Rg.add(screw);
  const nut=E.mesh(new THREE.CylinderGeometry(1.8,1.8,2.2,6),M.brass);Rg.add(nut);const arm=E.mesh(new THREE.BoxGeometry(12,1.2,1.6),new THREE.MeshStandardMaterial({color:0x5E6C93,roughness:.5}));Rg.add(arm);
  const tip=E.mesh(new THREE.ConeGeometry(.7,1.4,12),M.brass);tip.rotation.x=Math.PI;Rg.add(tip);const WR=new THREE.Group();Rg.add(WR);
  const bedR=E.mesh(new THREE.BoxGeometry(12,.8,10),M.pei);bedR.position.set(6,-.4,0);Rg.add(bedR);
  E.label('a',[-18,-2,9],'Correa · ejes X e Y',E.CSS.soft);E.label('b',[18,-2,8],'Husillo · eje Z',E.CSS.soft);
  let T=22,tn=2,TN=-1,BENT=null,loose=0,tight=0;
  function walls(){clear(WG);const seg=[],x0=-10,x1=8,z0=-5,z1=5;for(let x=x0;x<x1;x+=.5)seg.push([x,z0,x+.5,z0]);let q=[x1,z0];for(let d=.3;d<=z1-z0;d+=.3){const z=z0+d,x=x1+loose*1.6*Math.exp(-d/4)*Math.sin(d/1.1);seg.push([q[0],q[1],x,z]);q=[x,z]}
    const b=[];for(let y=0;y<3;y+=.4)b.push([y,y+.4,seg]);WG.add(E.ribbons(b,.7,M.fil));if(T<12){const g2=E.ribbons([[3,4.2,seg]],.7,M.fil2);g2.position.x=-1.8;WG.add(g2)}}
  return {update(){T=E.val('ten');loose=Math.max(0,(45-T)/45);tight=Math.max(0,(T-65)/35);walls();
      const st=T<12?0:T<45?1:T<=65?2:T<=85?3:4;E.pill(['correa muy floja: capa corrida','floja: ondas tras la esquina','tensión justa','tirante','muy tirante: desgasta'][st],st===2?E.CSS.pop:st===0||st===4?E.CSS.bad:E.CSS.ui)},
    tick(t){const ph=(t*.42)%1,half=ph<.5,tri=half?ph*2:2-ph*2,tau=(half?ph:ph-.5)/.42,pos=X1+3+tri*(X2-X1-6)+loose*1.4*Math.exp(-4*tau)*Math.sin(26*tau)*(half?1:-1),sag=loose*1.8,vib=tight*.12*Math.sin(t*90);
      belts.forEach(b=>{L.remove(b);b.geometry.dispose()});belts=[[1,.8],[-1,1.3]].map(q=>{const y=Y+q[0]*R,pts=[];for(let i=0;i<=16;i++){const u=i/16;pts.push([X1+(X2-X1)*u,y-(sag*q[1]+vib*q[0])*Math.sin(Math.PI*u),0])}return E.tube(pts,.25,beltM,32)});belts.forEach(b=>L.add(b));
      car.position.set(pos,Y+R+1.2-sag*.8*(1-Math.pow((pos)/((X2-X1)/2),2)),0);
      tn+=(E.val('turns')-tn)*.12;const bent=document.getElementById('bent')?document.getElementById('bent').checked:false,mm=tn*8,pm=.3,yn=5+mm*pm,off=(yy)=>bent?.45*Math.sin(yy/3.8+tn*Math.PI*2):0;
      screw.rotation.y=tn*Math.PI*2;st.offset.y=-tn*2;nut.position.set(-6+off(yn),yn,0);arm.position.set(0+off(yn),yn,0);tip.position.set(5.5+off(yn),yn-1.4,0);
      if(Math.abs(mm-TN)>.2||bent!==BENT){TN=mm;BENT=bent;clear(WR);const n=Math.floor(mm*pm/.5);for(let i=0;i<n;i++){const z=i*.5,o=bent?.35*Math.sin(z/pm/8*Math.PI*2):0,b=E.mesh(new THREE.BoxGeometry(4,.46,3),i%2?M.fil2:M.fil);b.position.set(8+o,z+.25,0);WR.add(b)}
        E.label('mm',[0,yn+2.4,0],fmm(mm),E.CSS.ui);E.label('w',[8,Math.max(2,n*.5)+2,0],bent?'bandas cada 8 mm':'pared pareja',bent?E.CSS.bad:E.CSS.soft)}
      return true}};
}});

/* ---------- 2.5 finales de carrera y homing (el homing se calcula en la página) ---------- */
register('l5',{span:30,keep2d:true,view:{pos:[2,22,52],target:[2,6,0],posP:[4,30,76],targetP:[2,8,0],min:28,max:160},build(E){
  const M=E.M,X0=-14,X1=24,SC=(X1-X0)/60;
  const rail=E.mesh(new THREE.BoxGeometry(48,1.6,3),M.alu);rail.position.set(4,4,0);E.scene.add(rail);
  const stop=E.mesh(new THREE.BoxGeometry(2,8,6),M.dark);stop.position.set(X0-6.5,4,0);E.scene.add(stop);
  const base=E.mesh(new THREE.BoxGeometry(56,1,12),new THREE.MeshStandardMaterial({color:0x232A3B,roughness:.7}));base.position.set(4,-.5,0);E.scene.add(base);
  const sw=new THREE.Group();sw.position.set(X0-4.6,9,0);E.scene.add(sw);const body=E.mesh(new THREE.BoxGeometry(3,2.2,2),new THREE.MeshStandardMaterial({color:0x3F6B66,roughness:.5}));sw.add(body);
  const lev=new THREE.Group();lev.position.set(-1.3,-1.1,0);sw.add(lev);const lb=E.mesh(new THREE.BoxGeometry(3.6,.25,1.2),M.steel);lb.position.x=1.8;lev.add(lb);
  const led=E.mesh(new THREE.SphereGeometry(.35,12,8),new THREE.MeshStandardMaterial({color:0x1A2133,emissive:0x000000}),false);led.position.set(.6,1.2,0);sw.add(led);
  const cable=E.tube([[X0-5,10.2,0],[X0-5,13,0],[X0,13,-1],[X0+3,16,-2]],.22,new THREE.MeshStandardMaterial({color:0xB9C2D8,roughness:.6}),24);E.scene.add(cable);
  const cut=E.tube([[X0+3.4,16.6,-2],[X0+5,18,-2.5]],.22,new THREE.MeshStandardMaterial({color:0xFFB4AB,roughness:.6}),8);E.scene.add(cut);
  const carM=new THREE.MeshStandardMaterial({color:0x86D9B5,roughness:.5}),car=E.mesh(new THREE.BoxGeometry(5,4,5),carM);E.scene.add(car);
  const rp=[];for(let mm=0;mm<=60;mm+=5){const x=X0+mm*SC;rp.push(x,0,4.5,x,0,4.5+(mm%10?.6:1.2))}rp.push(X0,0,4.5,X1,0,4.5);
  const rg=new THREE.BufferGeometry();rg.setAttribute('position',new THREE.Float32BufferAttribute(rp,3));const ruler=new THREE.LineSegments(rg,new THREE.LineBasicMaterial({color:0xB9C2D8}));E.scene.add(ruler);
  return {tick(t){const s=E.state('l5'),x=s.x==null?34:s.x,cutC=document.getElementById('cable5').checked,grind=s.st==='grind',pressed=x<=.25,jit=grind?Math.sin(t*45)*.25:0;
      car.position.set(X0+x*SC+2.5+jit,4+2.8,0);carM.color.setHex(grind?0xFFB4AB:0x86D9B5);lev.rotation.z=pressed?.25:-.25;
      led.material.emissive.setHex(pressed&&!cutC?0xFFB95E:0x000000);cable.visible=true;cut.visible=cutC;cable.material.color.setHex(cutC?0xFFB4AB:0xB9C2D8);
      ruler.visible=!!s.known;if(s.known)for(let mm=0;mm<=60;mm+=20)E.label('r'+mm,[X0+mm*SC,0,7.2],String(mm),E.CSS.soft);else for(let mm=0;mm<=60;mm+=20)E.unlabel('r'+mm);
      E.label('s',[X0-4.6,12,0],cutC?'sensor sin cable':'final de carrera',cutC?E.CSS.bad:E.CSS.soft);
      if(grind)E.label('g',[X0+x*SC+9,9,0],'TRAC TRAC TRAC',E.CSS.bad);else E.unlabel('g');
      E.pill(s.known?'X = '+fmm(Math.max(0,x)):'X = ?',s.known?E.CSS.pop:E.CSS.ink);return true}};
}});
