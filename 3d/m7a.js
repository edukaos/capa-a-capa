/* Capa a Capa · escenas 3D del módulo 7, parte 1 (lecciones 7.1 a 7.5). */
import {register,THREE} from '../cac3d.js';
const rnd=(i,k)=>{const x=Math.sin(i*127.1+k*311.7)*43758.5453;return x-Math.floor(x)};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),num=(v,d)=>v.toFixed(d==null?1:d).replace('.',',');
const eio=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
function clear(g){while(g.children.length){const o=g.children.pop();o.traverse(x=>{if(x.geometry)x.geometry.dispose()})}}
function group(E){const g=new THREE.Group();E.scene.add(g);return g}
function arrow(E,par,from,to,col){const d=new THREE.Vector3(to[0]-from[0],to[1]-from[1],to[2]-from[2]),l=d.length(),a=new THREE.ArrowHelper(d.normalize(),new THREE.Vector3(...from),l,col||0xFFB95E,l*.3,l*.2);a.line.material.linewidth=2;par.add(a);return a}
function weight(E,kg){const g=new THREE.Group(),s=.9+kg*.18,b=E.mesh(new THREE.BoxGeometry(s*1.4,s,s*1.4),E.M.steel);b.position.y=-s/2-2.4;g.add(b);
  const r=E.mesh(new THREE.CylinderGeometry(.08,.08,2.4,6),new THREE.MeshStandardMaterial({color:0xB9C2D8}));r.position.y=-1.2;g.add(r);return {g,h:s}}

/* ---------- 7.1 las cinco fuerzas ---------- */
const F1=['flex','trac','tors','corte','comp'];
register('l1',{span:24,view:{pos:[6,14,44],target:[0,0,0],posP:[8,20,62],targetP:[0,1,0],min:22,max:130},build(E){
  const L=30,Hh=4,D=6,geo=new THREE.BoxGeometry(L,Hh,D,60,6,6),base=geo.attributes.position.array.slice(),bar=E.mesh(geo,E.layered(E.COL.fil,.5));E.scene.add(bar);
  const A=group(E),sup=group(E);let K=null;
  return {tick(t){const s=E.state('l1'),k=F1[Math.min(s.i||0,4)],w=(1-Math.cos(t*2.2))/2;
      if(k!==K){K=k;clear(A);clear(sup);const AR=0xFFB95E;
        if(k==='trac'){arrow(E,A,[-L/2-1,0,0],[-L/2-9,0,0],AR);arrow(E,A,[L/2+1,0,0],[L/2+9,0,0],AR)}
        if(k==='comp'){arrow(E,A,[-L/2-9,0,0],[-L/2-1,0,0],AR);arrow(E,A,[L/2+9,0,0],[L/2+1,0,0],AR)}
        if(k==='flex'){[-1,1].forEach(s2=>{const p=E.mesh(new THREE.ConeGeometry(1.4,2.4,3),new THREE.MeshStandardMaterial({color:0x7E8BAE}));p.position.set(s2*(L/2-1),-Hh/2-1.2,0);sup.add(p)});arrow(E,A,[0,10,0],[0,Hh/2+1,0],AR)}
        if(k==='corte'){const wl=E.mesh(new THREE.BoxGeometry(2,12,D+4),new THREE.MeshStandardMaterial({color:0x4F5B7D}));wl.position.x=-L/2-1;sup.add(wl);arrow(E,A,[-3,9,0],[-3,Hh/2+1,0],AR);arrow(E,A,[3,-9,0],[3,-Hh/2-1,0],AR)}
        if(k==='tors'){[-1,1].forEach(s2=>{const tq=new THREE.Mesh(new THREE.TorusGeometry(4.4,.25,8,24,Math.PI*1.4),new THREE.MeshBasicMaterial({color:AR}));tq.rotation.y=Math.PI/2;tq.rotation.x=s2>0?0:Math.PI;tq.position.x=s2*(L/2+2);A.add(tq)})}}
      const p=bar.geometry.attributes.position;for(let i=0;i<p.count;i++){let x=base[i*3],y=base[i*3+1],z=base[i*3+2];const u=x/L+.5;
        if(k==='trac'){x*=1+.16*w;y*=1-.1*w;z*=1-.1*w}else if(k==='comp'){x*=1-.12*w;const b=1+.3*w*Math.sin(u*Math.PI);y*=b;z*=b}
        else if(k==='flex'){y-=w*Hh*.8*Math.sin(u*Math.PI)}else if(k==='corte'){const s3=clamp((u-.46)/.08,0,1);y-=w*Hh*.55*s3*s3*(3-2*s3)}
        else if(k==='tors'){const a=(u-.5)*w*1.2,c=Math.cos(a),sn=Math.sin(a);const ny=y*c-z*sn,nz=y*sn+z*c;y=ny;z=nz}p.setXYZ(i,x,y,z)}
      p.needsUpdate=true;bar.geometry.computeVertexNormals();E.pill('Caso '+(Math.min(s.i||0,4)+1)+' de 5 · ¿qué fuerza es?',E.CSS.ui);return true}};
}});

/* ---------- 7.2 esquinas: viva, chaflán o radio ---------- */
const K2={viva:3,chaflan:1.8,radio:1.3},LIM2=9;
register('l2',{span:22,view:{pos:[18,8,42],target:[4,4,0],posP:[22,12,58],targetP:[5,5,0],min:22,max:120},build(E){
  const D=8,T=3,Hw=22,Aw=18,X0=-6,Y0=-8,wall=E.mesh(new THREE.BoxGeometry(2,28,16),new THREE.MeshStandardMaterial({color:0x3A4566,roughness:.7}));wall.position.set(X0-1,Y0+11,0);E.scene.add(wall);
  const G=group(E),arm=new THREE.Group(),glowM=new THREE.MeshBasicMaterial({color:0xFF5A46,transparent:true,opacity:0,depthWrite:false}),glow=new THREE.Mesh(new THREE.SphereGeometry(1,20,14),glowM);E.scene.add(glow);
  const ix=X0+T,iy=Y0+Hw-6;let cor=null,W=null,kgL=-1;const fil=E.layered(E.COL.fil,.5,{side:THREE.DoubleSide});
  function build(c){clear(G);arm.clear();const r=c==='viva'?0:T*1.1,v=new THREE.Shape();v.moveTo(X0,Y0);v.lineTo(ix,Y0);v.lineTo(ix,iy-r);if(c==='chaflan')v.lineTo(ix+r,iy);else if(c==='radio')v.quadraticCurveTo(ix,iy,ix+r,iy);v.lineTo(ix+r,iy+T);v.lineTo(X0,iy+T);v.lineTo(X0,Y0);
    const vg=new THREE.ExtrudeGeometry(v,{depth:D,bevelEnabled:false});vg.translate(0,0,-D/2);G.add(E.mesh(vg,fil));
    const a=new THREE.Shape();a.moveTo(ix+r,iy);a.lineTo(ix+Aw,iy);a.lineTo(ix+Aw,iy+T);a.lineTo(ix+r,iy+T);a.lineTo(ix+r,iy);const ag=new THREE.ExtrudeGeometry(a,{depth:D,bevelEnabled:false});ag.translate(-ix,-iy,-D/2);arm.add(E.mesh(ag,fil));arm.position.set(ix,iy,0);G.add(arm);
    W=weight(E,2);W.g.position.set(Aw-1.5,0,0);arm.add(W.g)}
  return {tick(){const s=E.state('l2'),c=s.cor||'viva';if(c!==cor){cor=c;build(c);kgL=-1}if(s.kg!==kgL){kgL=s.kg;arm.remove(W.g);W=weight(E,s.kg);W.g.position.set(Aw-1.5,0,0);arm.add(W.g);E.label('k',[ix+Aw-1.5,iy-5-W.h,D/2],s.kg+' kg',E.CSS.ink)}
      const st=s.kg*K2[c],hot=clamp(st/LIM2,0,1.2),fall=s.brk?eio(clamp((performance.now()-s.bt)/700,0,1)):0;arm.rotation.z=-fall*.3;glow.visible=!fall;glow.position.set(ix+.4,iy+.4,D/2+.1);glow.scale.setScalar(1.2+hot*2.2);glowM.opacity=.55*Math.min(1,hot);
      E.label('l',[ix,iy+T,D/2],'(la fuerza se junta acá)',E.CSS.soft);E.pill(fall?'fisura en la esquina':hot>.7?'esquina al límite':'aguanta',fall?E.CSS.bad:hot>.7?E.CSS.ui:E.CSS.pop);return true}};
}});

/* ---------- 7.3 nervaduras y cartabones ---------- */
register('l3',{span:22,view:{pos:[20,6,40],target:[4,2,0],posP:[24,10,56],targetP:[5,3,0],min:22,max:120},build(E){
  const D=8,T=2.4,X0=-8,Y0=-10,Aw=20,ay=6,wall=E.mesh(new THREE.BoxGeometry(2,26,16),new THREE.MeshStandardMaterial({color:0x3A4566,roughness:.7}));wall.position.set(X0-1,0,0);E.scene.add(wall);
  const fil=E.layered(E.COL.fil,.5),fil2=new THREE.MeshStandardMaterial({color:E.COL.fil2,roughness:.55,side:THREE.DoubleSide});E.scene.add((()=>{const m=E.mesh(new THREE.BoxGeometry(T,22,D),fil);m.position.set(X0+T/2,Y0+11,0);return m})());
  const geo=new THREE.BoxGeometry(Aw,T,D,30,2,2),base=geo.attributes.position.array.slice(),arm=E.mesh(geo,fil);arm.position.set(X0+T+Aw/2,ay,0);E.scene.add(arm);
  const R=group(E);let W=weight(E,5);E.scene.add(W.g);let d=1,key='',mode='no';
  E.chart((c,w,h)=>{const x0=w/2-40,y0=26,sw=80,sh=44,wal=E.chip('wal3','v')||2,inf=E.chip('inf3','v')||20;c.font='700 11px "DM Sans",system-ui';c.fillStyle=E.CSS.soft;c.textAlign='center';c.fillText('corte del brazo',w/2,16);
    c.fillStyle=inf==100?'#EE8455':'#141B2B';c.fillRect(x0,y0,sw,sh);if(inf==20){c.save();c.beginPath();c.rect(x0,y0,sw,sh);c.clip();c.strokeStyle='rgba(238,132,85,.7)';c.lineWidth=1;for(let k=-sh;k<sw;k+=9){c.beginPath();c.moveTo(x0+k,y0+sh);c.lineTo(x0+k+sh,y0);c.stroke()}c.restore()}
    const wt=wal*2.2;c.strokeStyle='#FF9E70';c.lineWidth=wt;c.strokeRect(x0+wt/2,y0+wt/2,sw-wt,sh-wt);if(mode!=='no'){c.fillStyle='#FF9E70';c.fillRect(w/2-4,y0+sh,8,sh*.5)}});
  return {update(){const rib=E.chip('rib3','v')||'no',wal=+(E.chip('wal3','v')||2),inf=+(E.chip('inf3','v')||20),k2=[rib,wal,inf].join();if(k2===key)return;key=k2;mode=rib;
      const Rr=(wal===5?1.6:1)*(inf===100?1.25:1)*(rib==='nerv'?2.2:rib==='cart'?2.8:1),g=12*(wal===5?1.35:1)*(inf===100?2.6:1)+(rib==='nerv'?1.5:rib==='cart'?2.5:0);d=2.4/Rr;clear(R);
      if(rib==='cart'){const s=new THREE.Shape();s.moveTo(0,0);s.lineTo(Aw*.62,0);s.lineTo(0,-12);s.lineTo(0,0);const gg=new THREE.ExtrudeGeometry(s,{depth:2,bevelEnabled:false});gg.translate(X0+T,ay-T/2,-1);R.add(E.mesh(gg,fil2))}
      if(rib==='nerv'){const s=new THREE.Shape();s.moveTo(0,0);s.lineTo(Aw*.85,0);s.lineTo(0,-T*1.8);s.lineTo(0,0);const gg=new THREE.ExtrudeGeometry(s,{depth:2,bevelEnabled:false});gg.translate(X0+T,ay-T/2,-1);R.add(E.mesh(gg,fil2))}
      E.label('d',[X0+12,ay+5,D/2+1],'se dobla '+num(d)+' mm',d<1?E.CSS.pop:E.CSS.bad);E.label('g',[X0+12,ay+7.5,D/2+1],'plástico: '+Math.round(g)+' g',g<25?E.CSS.pop:E.CSS.bad);E.redraw();
      E.pill(d<1&&g<25?'firme y liviano':d>=1?'se dobla demasiado':'firme, pero pesado',d<1&&g<25?E.CSS.pop:E.CSS.ui)},
    tick(t){const b=d*1.8*(.9+.1*Math.sin(t*3)),p=arm.geometry.attributes.position;for(let i=0;i<p.count;i++){const x=base[i*3],u=x/Aw+.5;p.setY(i,base[i*3+1]-b*u*u)}p.needsUpdate=true;arm.geometry.computeVertexNormals();
      R.children.forEach(o=>{o.rotation.z=0});W.g.position.set(X0+T+Aw-1.5,ay-T/2-b,0);return true}};
}});

/* ---------- 7.4 diseñar sin soportes ---------- */
register('l4',{span:26,view:{pos:[2,14,52],target:[0,8,0],posP:[3,20,74],targetP:[0,10,0],min:24,max:140},build(E){
  const M=E.M,D=8,CL=[new THREE.Plane(new THREE.Vector3(0,-1,0),0)];E.bed(60,20,{grid:5});const A=group(E),B=group(E),SG=group(E);let key='',top=0;
  const A1=E.layered(E.COL.fil,.6,{clippingPlanes:CL}),sagM=new THREE.MeshStandardMaterial({color:0xFF9E70,roughness:.5,clippingPlanes:CL});
  function build(hol,led){clear(A);clear(B);clear(SG);const bw=18,bh=16,R=4.4,hx=-14,hy=bh*.55;const s=new THREE.Shape();s.moveTo(hx-bw/2,0);s.lineTo(hx+bw/2,0);s.lineTo(hx+bw/2,bh);s.lineTo(hx-bw/2,bh);s.lineTo(hx-bw/2,0);
    const p=new THREE.Path();if(hol==='lagrima'){p.moveTo(hx,hy+R*1.414);for(let k=0;k<=36;k++){const a=Math.PI*3/4+k/36*Math.PI*1.5;p.lineTo(hx+Math.cos(a)*R,hy+Math.sin(a)*R)}p.lineTo(hx,hy+R*1.414)}else if(hol==='plano'){const a=Math.acos(.75);p.absarc(hx,hy,R,Math.PI/2+a,Math.PI/2-a+Math.PI*2,false);p.closePath()}else p.absarc(hx,hy,R,0,Math.PI*2,true);s.holes.push(p);
    const g=new THREE.ExtrudeGeometry(s,{depth:D,bevelEnabled:false,curveSegments:24});g.translate(0,0,-D/2);A.add(E.mesh(g,A1));
    if(hol==='redondo')for(let k=0;k<4;k++){const yy=hy+R*.62+k*.5,xx=Math.sqrt(Math.max(0,R*R-(yy-hy)*(yy-hy)));for(let z=-D/2+1;z<D/2;z+=2)SG.add(E.tube([[hx-xx,yy,z],[hx,yy-1.4+k*.2,z],[hx+xx,yy,z]],.3,sagM,12))}
    const cx=8,cw=5,ch=16,ly=ch*.55,lw=10,t2=new THREE.Shape();t2.moveTo(cx,0);t2.lineTo(cx+cw,0);if(led==='chaflan'){t2.lineTo(cx+cw,ly-lw);t2.lineTo(cx+cw+lw,ly)}else t2.lineTo(cx+cw,ly),t2.lineTo(cx+cw+lw,ly);t2.lineTo(cx+cw+lw,ch);t2.lineTo(cx,ch);t2.lineTo(cx,0);
    const g2=new THREE.ExtrudeGeometry(t2,{depth:D,bevelEnabled:false});g2.translate(0,0,-D/2);B.add(E.mesh(g2,A1));
    if(led==='recto')for(let k=0;k<4;k++)for(let z=-D/2+1;z<D/2;z+=2){const sx=cx+cw+lw*(k+.5)/4;SG.add(E.tube([[sx-1.2,ly,z],[sx,ly-1.6-rnd(k,z+4)*1.6,z],[sx+1.2,ly,z]],.28,sagM,10))}
    top=Math.max(bh,ch);E.label('a',[-14,-1,D/2+2],'agujero horizontal',E.CSS.soft);E.label('b',[13,-1,D/2+2],'saliente',E.CSS.soft);
    E.pill(hol==='redondo'?'techo del agujero caído':led==='recto'?'el saliente se cae':'cero soportes',hol!=='redondo'&&led!=='recto'?E.CSS.pop:E.CSS.bad)}
  const noz=E.nozzle(.5);
  return {update(){const hol=E.chip('hol4','v')||'redondo',led=E.chip('led4','v')||'recto',k2=hol+led;if(k2!==key){key=k2;build(hol,led)}},
    tick(t){const pr=clamp((t%7)/5.5,0,1),y=pr*(top+.2);CL[0].constant=y;noz.position.set(-14+Math.sin(t*5)*9,y+.1,0);noz.visible=pr<1;return true}};
}});

/* ---------- 7.5 holguras: eje y agujero en corte ---------- */
const SEG5=[['no',0,.1,'#FFB4AB'],['firme',.1,.2,'#FFB95E'],['deslizante',.2,.4,'#86D9B5'],['libre',.4,.6,'#9FC5FF'],['baila',.6,.8,'#FFB4AB']],CN5={no:'no entra',firme:'muy firme',deslizante:'deslizante',libre:'libre',baila:'baila',traba:'engancha en el borde'};
register('l5',{span:20,view:{pos:[12,20,46],target:[0,8,0],posP:[14,24,62],targetP:[0,9,0],min:18,max:110},build(E){
  const M=E.M,CUT=[new THREE.Plane(new THREE.Vector3(0,0,-1),0)],D=THREE.DoubleSide;E.bed(36,22,{grid:5});const B=group(E),shaft=new THREE.Group();B.position.y=.04;E.scene.add(shaft);
  const fil=new THREE.MeshStandardMaterial({color:0xFF9E70,roughness:.5,clippingPlanes:CUT,side:D}),mint=new THREE.MeshStandardMaterial({color:0x86D9B5,roughness:.45});let key='',HOLE=3,sw=3;
  E.chart((c,w,h)=>{const s=E.state('l5'),x0=10,x1=w-10,y=h-30,X=v=>x0+(x1-x0)*v/.8;SEG5.forEach(q=>{c.globalAlpha=.4;c.fillStyle=q[3];c.fillRect(X(q[1])+1,y,X(q[2])-X(q[1])-2,10);c.globalAlpha=1;
      if(w>200){c.fillStyle=E.CSS.soft;c.font='600 10px "DM Sans",system-ui';c.textAlign='center';c.fillText(CN5[q[0]],(X(q[1])+X(q[2]))/2,y-6)}});
    c.fillStyle=E.CSS.ink;const xv=X(s.cl||0);c.beginPath();c.moveTo(xv,y+12);c.lineTo(xv-6,y+20);c.lineTo(xv+6,y+20);c.closePath();c.fill();c.font='700 11px "DM Sans",system-ui';c.textAlign='left';c.fillStyle=E.CSS.soft;c.fillText('holgura '+num(s.cl||0,2)+' mm',x0,16)});
  function build(cl,ch){clear(B);clear(shaft);const BH=10,BW=24;const gap=cl*1.6+(cl===0?-.15:0);sw=HOLE*2-gap*2;
    const prof=[[HOLE+(ch?1.2:0),BH],[HOLE,BH-(ch?1.2:0)],[HOLE,0],[BW/2,0],[BW/2,BH]].map(p=>new THREE.Vector2(p[0],p[1]));B.add(E.mesh(new THREE.LatheGeometry(prof,48),fil,false));
    const cap=E.mesh(new THREE.RingGeometry(HOLE+(ch?1.2:0),BW/2,48),fil,false);cap.rotation.x=-Math.PI/2;cap.position.y=BH;B.add(cap);
    const sb=E.mesh(new THREE.CylinderGeometry(sw/2,sw/2,14,32),mint);sb.position.y=7;shaft.add(sb);const hd=E.mesh(new THREE.CylinderGeometry(sw*.9,sw*.9,1.4,32),mint);hd.position.y=14.4;shaft.add(hd);
    for(let k=0;k<3;k++){const m=E.mesh(new THREE.BoxGeometry(.3,12,.3),new THREE.MeshStandardMaterial({color:0x2F6F5B}),false);const a=k*2.1;m.position.set(Math.cos(a)*sw/2,7,Math.sin(a)*sw/2);shaft.add(m)}}
  return {tick(t){const s=E.state('l5'),cl=s.cl||0,ch=!!(document.getElementById('ch5')||{}).checked,k2=cl+'|'+ch;if(k2!==key){key=k2;build(cl,ch);E.redraw()}
      const go=s.t0!=null&&s.t0>0,e=go?clamp((performance.now()-s.t0)/1500,0,1):0,r=go?s.res:null,blocked=r==='no'||r==='traba',end=blocked?10.25:.4,y=12+(end-12)*eio(e);
      shaft.position.set(blocked&&e>=1&&performance.now()-s.t0<2300?Math.sin(t*60)*.12:0,y,0);shaft.rotation.z=r==='baila'&&e>=1?Math.sin(t*6)*.05:0;shaft.rotation.y=(r==='libre'||r==='baila')&&e>=1?t*2.5:0;
      if(e>=1&&r)E.label('r',[0,17,0],CN5[r],blocked||r==='baila'?E.CSS.bad:E.CSS.pop);else E.unlabel('r');
      E.pill(s.i>=3?'¡Los tres ajustes resueltos!':'Pedido '+((s.i||0)+1)+' de 3',s.i>=3?E.CSS.pop:E.CSS.ui);return true}};
}});
