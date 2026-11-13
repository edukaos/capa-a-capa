/* Capa a Capa · escenas 3D del módulo 8 (impresoras de nueva generación). */
import {register,THREE,benchySpans} from '../cac3d.js';
const KB=20/48,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),nf=(v,d)=>v.toFixed(d||0).replace('.',',');
function steps(h,top){const b=[0];let z=0;while(z<top-1e-6){z=Math.min(top,z+h);b.push(z)}return b}
function headAt(c,lh){const i=Math.floor(c),fr=c-i,y=(i*lh+lh/2)/KB,sp=benchySpans(Math.min(47.9,y));if(!sp.length)return[0,i*lh];let tot=0;sp.forEach(q=>tot+=q[1]-q[0]);
  let rem=tot*fr,x=sp[0][0];const dir=i%2;for(let k=0;k<sp.length;k++){const q=sp[dir?sp.length-1-k:k],len=q[1]-q[0];if(rem<=len){x=dir?q[1]-rem:q[0]+rem;break}rem-=len;x=dir?q[0]:q[1]}
  return[(x-30)*KB,(i+1)*lh]}
function fmin(m){m=Math.round(m);if(m<60)return m+' min';const h=Math.floor(m/60),r=m%60;return h+' h'+(r?' '+r+' min':'')}
function idx(id){return [...document.querySelectorAll('#'+id+' button')].findIndex(b=>b.getAttribute('aria-pressed')==='true')}
function kill(E,o){if(!o)return;E.scene.remove(o);o.traverse(x=>{if(x.geometry)x.geometry.dispose()})}

/* ---------- 8.1 la Ender 3 contra tu máquina ---------- */
register('l1',{span:60,view:{pos:[0,58,150],target:[0,22,0],posP:[0,80,230],targetP:[0,26,0],min:60,max:320},build(E){
  const M=E.M,mint=new THREE.MeshStandardMaterial({color:0x86D9B5,roughness:.4});
  const A=E.printer(36,42);A.g.position.x=-32;const BA=E.benchy(steps(.5,20),KB,i=>i%2?M.fil2:M.fil);A.bed.add(BA.g);
  let P=null,BB=null,key='',T0=performance.now(),extra=null;
  function caps(s){return{m:s[0]?5.6:1,v:s[1]?5.6:1.3,f:s[2]?5.6:1.6}}
  function build(s){if(P)kill(E,P.g);P=s[0]?E.corexy(36,46):E.printer(36,42);P.g.position.x=32;BB=E.benchy(steps(.5,20),KB,i=>i%2?M.fil2:M.fil);P.bed.add(BB.g);
    extra=new THREE.Group();P.head.add(extra);if(s[3]){const pr=E.mesh(new THREE.CylinderGeometry(.5,.5,3,12),mint);pr.position.set(3.4,1.6,0);extra.add(pr)}
    if(s[4]){const cam=E.mesh(new THREE.BoxGeometry(3,2.2,2),M.dark);cam.position.set(s[0]?-20:-20,s[0]?36:36,s[0]?20:0);P.g.add(cam);const ln=new THREE.Mesh(new THREE.CircleGeometry(.7,16),new THREE.MeshBasicMaterial({color:0x86D9B5}));ln.position.set(0,0,1.01);cam.add(ln)}}
  return {tick(t){const s=(E.state('l1').length?E.state('l1'):[0,0,0,0,0]),k=s.map(Number).join('');if(k!==key){key=k;build(s);T0=performance.now()}
      const c=caps(s),mn=Math.min(c.m,c.v,c.f),tm=105/mn,el=(performance.now()-T0)/1000,K=24;if(el>K+2.5)T0=performance.now();
      const pA=Math.min(1,el/K),pB=Math.min(1,el*(105/tm)/K),n=40;
      BA.show(Math.floor(pA*n));BB.show(Math.floor(pB*n));
      const hA=pA<1?headAt(pA*n,.5):[12,22];A.set(hA[0],Math.sin(t*3)*.4,hA[1]);
      const hB=pB<1?headAt(pB*n,.5):[12,22];if(s[0])P.set(hB[0],0,hB[1]);else P.set(hB[0],pB<1?Math.sin(t*6)*.6:0,hB[1]);
      E.label('a',[-32,-8,22],'Ender 3 · '+(pA>=1?'¡listo! '+fmin(105):fmin(105*pA)),pA>=1?E.CSS.pop:E.CSS.ink);
      E.label('b',[32,-8,22],'Tu máquina · '+(pB>=1?'¡listo! '+fmin(tm):fmin(tm*pB)),pB>=1?E.CSS.pop:E.CSS.ink);
      E.pill(tm<20?'mismo Benchy en '+fmin(tm)+' en vez de '+fmin(105):mn>=5.6?'':'frena: '+(c.m===mn?'la cama pesada':c.v===mn?'las vibraciones':'el hotend'),tm<20?E.CSS.pop:E.CSS.ui);return true}};
}});

/* ---------- 8.2 CoreXY: la velocidad de la caja contra la real ---------- */
function profile(P,v,a){const vj=8,segs=[];let T=0,L=0;for(let i=1;i<P.length;i++){const dx=P[i][0]-P[i-1][0],dy=P[i][1]-P[i-1][1],len=Math.hypot(dx,dy)*1.6;if(len<.01)continue;
    const d1=(v*v-vj*vj)/(2*a);let t,vp;if(2*d1<=len){vp=v;t=2*(v-vj)/a+(len-2*d1)/v}else{vp=Math.sqrt(vj*vj+a*len);t=2*(vp-vj)/a}segs.push({i,len,t,vp,t0:T});T+=t;L+=len}
  return{segs,T,L,avg:L/T,vj}}
function spAt(sg,tt,a,vj){const tu=(sg.vp-vj)/a;if(tt<tu)return vj+a*tt;if(tt>sg.t-tu)return vj+a*(sg.t-tt);return sg.vp}
function segAt(pr,tt){let sg=pr.segs[0];for(const q of pr.segs)if(q.t0<=tt)sg=q;return sg}
register('l2',{span:34,view:{pos:[0,96,34],target:[0,22,0],posP:[0,100,70],targetP:[0,22,0],min:30,max:200},build(E){
  const P=E.corexy(40,40),PATH=E.state('l2'),SC=.55;P.set(0,0,.4);
  const pts=[],pts2=[];PATH.forEach((p,i)=>{(i<=34?pts:pts2).push(new THREE.Vector3(p[0]*SC,.15,p[1]*SC))});pts2.unshift(pts[pts.length-1]);
  [[pts,0xFF9E70],[pts2,0xFFB95E]].forEach(q=>{const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(q[0]),new THREE.LineBasicMaterial({color:q[1]}));P.bed.add(l)});
  const glow=new THREE.Mesh(new THREE.SphereGeometry(.7,16,12),new THREE.MeshBasicMaterial({color:0xFFB95E}));P.bed.add(glow);
  let key='',pr=null,T0=performance.now();
  E.chart((c,w,h)=>{if(!pr)return;const v=E.val('v2'),a=E.val('a2'),gx=34,gy=24,gw=w-44,gh=h-40,vmax=620;c.font='700 11px "DM Sans",system-ui';c.fillStyle=E.CSS.soft;c.textAlign='left';c.fillText('Velocidad en la capa',10,15);
    c.strokeStyle='rgba(185,194,216,.15)';c.lineWidth=1;c.font='500 10px "DM Mono",monospace';c.textAlign='right';[0,300,600].forEach(vv=>{const y=gy+gh-vv/vmax*gh;c.beginPath();c.moveTo(gx,y);c.lineTo(gx+gw,y);c.stroke();c.fillText(vv,gx-4,y+3)});
    c.beginPath();const N=120;for(let j=0;j<=N;j++){const ts=pr.T*j/N,sg=segAt(pr,ts),vv=spAt(sg,ts-sg.t0,a,pr.vj),x=gx+gw*j/N,y=gy+gh-vv/vmax*gh;j?c.lineTo(x,y):c.moveTo(x,y)}
    c.lineTo(gx+gw,gy+gh);c.lineTo(gx,gy+gh);c.closePath();c.fillStyle='rgba(255,185,94,.35)';c.fill();
    c.setLineDash([5,4]);c.strokeStyle=E.CSS.soft;let y=gy+gh-v/vmax*gh;c.beginPath();c.moveTo(gx,y);c.lineTo(gx+gw,y);c.stroke();c.setLineDash([]);
    y=gy+gh-pr.avg/vmax*gh;c.strokeStyle=E.CSS.pop;c.lineWidth=2;c.beginPath();c.moveTo(gx,y);c.lineTo(gx+gw,y);c.stroke();c.fillStyle=E.CSS.pop;c.textAlign='left';c.fillText('real '+Math.round(pr.avg),gx+4,y-4);
    const el=(performance.now()-T0)/1000,dur=3.2+pr.T*1.6,x=gx+gw*((el%dur)/dur);c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=1;c.beginPath();c.moveTo(x,gy);c.lineTo(x,gy+gh);c.stroke()});
  return {tick(){const v=E.val('v2'),a=E.val('a2'),k=v+'|'+a;if(k!==key){key=k;pr=profile(PATH,v,a);T0=performance.now()}
      const el=(performance.now()-T0)/1000,dur=3.2+pr.T*1.6,tt=(el%dur)/dur*pr.T,sg=segAt(pr,tt),fr=Math.min(1,(tt-sg.t0)/sg.t),q0=PATH[sg.i-1],q1=PATH[sg.i],
        x=(q0[0]+(q1[0]-q0[0])*fr)*SC,y=(q0[1]+(q1[1]-q0[1])*fr)*SC,sp=spAt(sg,tt-sg.t0,a,pr.vj);
      P.set(x,y,.4);glow.position.set(x,.5,y);glow.material.color.setHSL(.08+.3*sp/620,.9,.6);E.redraw();
      E.pill('caja '+v+' mm/s · real '+Math.round(pr.avg)+' mm/s',pr.avg>=150?E.CSS.pop:E.CSS.ui);return true}};
}});

/* ---------- 8.3 input shaping: ondas en la pared ---------- */
register('l3',{span:24,keep2d:true,view:{pos:[10,16,46],target:[0,9,0],posP:[12,22,64],targetP:[0,10,0],min:22,max:130},build(E){
  const fil=E.layered(E.COL.fil,.4),lt=E.layered(0xFFC7A6,.4);E.bed(44,20,{grid:5});
  const wall=E.mesh(new THREE.BoxGeometry(36,16,2.4),fil);wall.position.set(0,8,0);E.scene.add(wall);const R=new THREE.Group();E.scene.add(R);
  [-12,0,12].forEach(x=>{const l=E.mesh(new THREE.BoxGeometry(3.4,7,1.2),lt);l.position.set(x,8,1.8);E.scene.add(l)});
  const noz=E.nozzle(.55);let amp0=-1;
  function ripple(){const s=E.state('l3'),a=E.val('a3'),amp=Math.max(0,(a-1500)/18500);return s.on?amp*.06:amp}
  E.chart((c,w,h)=>{const s=E.state('l3'),gx=10,gy=22,gw=w-20,gh=h-36,mp=s.meas===1?Math.min(1,(performance.now()-s.measT)/2200):s.meas===2?1:0;
    c.font='700 11px "DM Sans",system-ui';c.fillStyle=E.CSS.soft;c.textAlign='left';c.fillText('Cómo vibra la máquina',gx,14);
    if(!mp){c.font='500 10px "DM Sans",system-ui';c.fillText('sin medir',gx,gy+gh/2);return}
    const f=hz=>1/(1+Math.pow((hz-47)/6,2))*.9+.06,sh=hz=>s.on?f(hz)*(1-.94*Math.exp(-Math.pow((hz-47)/9,2))):f(hz);
    const draw=(fn,col,lw)=>{c.beginPath();for(let j=0;j<=100*mp;j++){const hz=10+j*1.1,x=gx+gw*j/100,y=gy+gh-fn(hz)*gh;j?c.lineTo(x,y):c.moveTo(x,y)}c.strokeStyle=col;c.lineWidth=lw;c.stroke()};
    if(s.on)draw(f,'rgba(255,180,171,.4)',1);draw(sh,s.on?E.CSS.pop:'#FFB4AB',2);if(mp>=1){c.fillStyle=E.CSS.soft;c.font='500 10px "DM Mono",monospace';c.fillText('47 Hz',gx+gw*(37/110)-12,gy+8)}});
  return {tick(t){const s=E.state('l3'),amp=ripple();if(Math.abs(amp-amp0)>.002){amp0=amp;while(R.children.length){const o=R.children.pop();o.geometry.dispose()}
        [-12,0,12].forEach(x0=>{for(let k=1;k<=7;k++){const al=amp*Math.exp(-k*.38)*(k%2?1:.65);if(al<.02)continue;const r=E.mesh(new THREE.BoxGeometry(.5,7,al*1.1),fil);r.position.set(x0+1.7+k*1.15,8,1.2+al*.55);R.add(r)}})}
      const meas=s.meas===1;noz.position.set(meas?Math.sin(t*60)*.5:-12+((t*6)%24),16.3,0);E.redraw();
      E.pill(meas?'midiendo la vibración…':amp>.12?'ondas al lado de cada letra':s.on&&E.val('a3')>=10000?'pared lisa a alta aceleración':amp>.02?'ondas leves':'pared lisa',meas?E.CSS.ui:amp>.12?E.CSS.bad:E.CSS.pop);return true}};
}});

/* ---------- 8.4 nivelación automática: mapa de la cama ---------- */
function zf(x,y){return .16*Math.sin(x*2.6+.4)*Math.cos(y*2.1-.3)+.11*(x*x-.25)+.07*Math.sin(x*6.4+y*5.1)*Math.exp(-((x-.6)*(x-.6)+(y-.35)*(y-.35))*6)}
function interp(m,n,x,y){const fx=x*(n-1),fy=y*(n-1),i=Math.min(n-2,Math.floor(fx)),j=Math.min(n-2,Math.floor(fy)),u=fx-i,v=fy-j;return m[j][i]*(1-u)*(1-v)+m[j][i+1]*u*(1-v)+m[j+1][i]*(1-u)*v+m[j+1][i+1]*u*v}
function colR(r){const a=Math.abs(r);if(a<=.04)return[134,217,181];const k=Math.min(1,(a-.04)/.14),A=r<0?[255,190,150]:[255,215,140],B=r<0?[255,120,110]:[255,170,70];return A.map((v,i)=>v+(B[i]-v)*k)}
register('l4',{span:26,keep2d:true,view:{pos:[0,40,54],target:[0,0,2],posP:[0,56,76],targetP:[0,0,2],min:24,max:130},build(E){
  const L=36,N=48,EX=10,g=new THREE.PlaneGeometry(L,L,N,N);g.rotateX(-Math.PI/2);const pos=g.attributes.position,col=new Float32Array(pos.count*3);g.setAttribute('color',new THREE.BufferAttribute(col,3));
  for(let i=0;i<pos.count;i++){const u=pos.getX(i)/L+.5,v=pos.getZ(i)/L+.5;pos.setY(i,zf(u,v)*EX)}g.computeVertexNormals();
  const surf=E.mesh(g,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.6,metalness:.1}));E.scene.add(surf);
  const base=E.mesh(new THREE.BoxGeometry(L+4,2,L+4),E.M.alu);base.position.y=-4;E.scene.add(base);
  const P=new THREE.Group();E.scene.add(P);const noz=E.nozzle(.45);let key='';
  const ptAt=(q,n)=>{const gi=q%n,gj=Math.floor(q/n),u=(gj%2?n-1-gi:gi)/(n-1),v=gj/(n-1);return[u,v]};
  return {tick(){const s=E.state('l4'),n=s.grid||3,tot=n*n,shown=s.state===1?Math.min(tot,Math.floor((performance.now()-s.t0)/(2400/tot))):s.state===2?tot:0,k=[s.state,n,shown,!!s.mesh].join();
      if(k!==key){key=k;const m=s.state===2&&s.mesh;let ok=0;for(let i=0;i<pos.count;i++){const u=pos.getX(i)/L+.5,v=pos.getZ(i)/L+.5,r=zf(u,v)-(m?interp(m,n,u,v):0),c=colR(r);if(Math.abs(r)<=.04)ok++;col[i*3]=c[0]/255;col[i*3+1]=c[1]/255;col[i*3+2]=c[2]/255}
        g.attributes.color.needsUpdate=true;while(P.children.length){const o=P.children.pop();o.geometry.dispose()}
        for(let q=0;q<shown;q++){const [u,v]=ptAt(q,n),d=E.mesh(new THREE.SphereGeometry(.55,12,8),new THREE.MeshStandardMaterial({color:0xE4E8F3}));d.position.set((u-.5)*L,zf(u,v)*EX+.3,(v-.5)*L);P.add(d)}
        E.pill(s.state===1?'midiendo '+shown+' de '+tot+' puntos':s.state===2?'pareja en el '+Math.round(ok/pos.count*100)+' % de la cama':'sin medir: la cama no es plana',s.state===2&&ok/pos.count>=.9?E.CSS.pop:E.CSS.ui)}
      if(s.state===1&&shown<tot){const [u,v]=ptAt(shown,n),dz=(performance.now()-s.t0)%(2400/tot)/(2400/tot);noz.visible=true;noz.position.set((u-.5)*L,zf(u,v)*EX+.6+Math.abs(Math.sin(dz*Math.PI))*2,(v-.5)*L)}else noz.visible=false;
      E.label('a',[-L/2,1,L/2+2],'verde: primera capa pareja',E.CSS.soft);return s.state===1}};
}});

/* ---------- 8.5 hotend de alto flujo ---------- */
register('l5',{span:24,view:{pos:[8,14,40],target:[0,5,0],posP:[10,20,58],targetP:[0,6,0],min:22,max:130},build(E){
  E.bed(46,16,{grid:5});const noz=E.nozzle(1);const melt=new THREE.Mesh(new THREE.CylinderGeometry(.75,.75,1,16),new THREE.MeshBasicMaterial({color:0xFF7A3D,transparent:true,opacity:.85}));E.scene.add(melt);
  const solid=new THREE.Mesh(new THREE.CylinderGeometry(.7,.7,1,16),new THREE.MeshStandardMaterial({color:0xFFD2B8,roughness:.5}));E.scene.add(solid);
  const LN=new THREE.Group();E.scene.add(LN);const fil=new THREE.MeshStandardMaterial({color:E.COL.fil,roughness:.5});let key='',beads=[],X=-20,last=performance.now();
  const S=()=>({v:E.val('v5'),hi:Math.max(0,idx('h5')),li:Math.max(0,idx('lh5'))});
  E.chart((c,w,h)=>{const s=S(),d=.45*[.12,.2,.28][s.li]*s.v,cap=[15,35][s.hi],mx=60,bw=w-110;c.font='700 11px "DM Sans",system-ui';c.textAlign='left';
    [['pedís',d,d>cap?E.CSS.bad:E.CSS.ui],['funde',cap,E.CSS.pop]].forEach((r,i)=>{const y=12+i*22;c.fillStyle=E.CSS.soft;c.fillText(r[0],8,y+10);c.fillStyle='rgba(255,255,255,.08)';c.fillRect(52,y,bw,12);c.fillStyle=r[2];c.fillRect(52,y,bw*Math.min(1,r[1]/mx),12);c.fillStyle=E.CSS.ink;c.fillText(nf(r[1],1)+' mm³/s',56+bw*Math.min(1,r[1]/mx)+4>w-50?w-58:56+bw*Math.min(1,r[1]/mx),y+10)})});
  return {tick(t){const s=S(),lh=[.12,.2,.28][s.li],d=.45*lh*s.v,cap=[15,35][s.hi],under=d>cap,k=[s.v,s.hi,s.li].join();
      if(k!==key){key=k;while(LN.children.length){const o=LN.children.pop();o.geometry.dispose()}beads=[];const r=under?cap/d:1;
        for(let i=0;i<46;i++){const x0=-21+i,gap=under&&((i*7)%5<(1-r)*6);const b=E.bead(x0,0,x0+1.02,0,0,(1.4)*(under?.45+.5*r:1),lh*4*(under?.7:1),fil);b.visible=false;b.userData.gap=gap;LN.add(b);beads.push(b)}E.redraw();
        E.pill(under?'subextrusión: línea flaca y con huecos':'funde todo: línea llena',under?E.CSS.bad:E.CSS.pop)}
      const now=performance.now(),dt=Math.min(.1,(now-last)/1000);last=now;X+=dt*s.v/22;if(X>24){X=-21;beads.forEach(b=>b.visible=false)}
      beads.forEach((b,i)=>{if(-21+i+1<X)b.visible=!b.userData.gap});noz.position.set(Math.min(X,23),lh*4+.05,0);
      const zone=[.5,1][s.hi];melt.scale.y=3*zone;melt.position.set(noz.position.x,noz.position.y+1.8+1.5*zone,0);solid.scale.y=under?3:1.2;solid.position.set(noz.position.x,noz.position.y+1.8+3*zone+(under?-1.2:0)+solid.scale.y/2,0);
      solid.material.color.set(under?0xFFE3D2:0xFFD2B8);E.label('m',[noz.position.x-3,7,3],under?'no llega a fundirse':'zona de fusión',under?E.CSS.bad:E.CSS.soft);return true}};
}});

/* ---------- 8.6 cámara y detección de fallas ---------- */
register('l6',{span:30,keep2d:true,view:{pos:[22,30,70],target:[0,12,0],posP:[28,40,100],targetP:[0,14,0],min:30,max:180},build(E){
  const P=E.corexy(36,40,{open:true}),M=E.M,fil=E.layered(E.COL.fil,.5),spM=new THREE.MeshStandardMaterial({color:0xFFB38A,roughness:.5});
  const cam=E.mesh(new THREE.BoxGeometry(3.2,2.4,2.2),M.dark);cam.position.set(-20,30,22);P.g.add(cam);const lens=new THREE.Mesh(new THREE.CircleGeometry(.8,16),new THREE.MeshBasicMaterial({color:0x86D9B5}));lens.position.z=1.12;cam.add(lens);
  const part=new THREE.Group();P.bed.add(part);let partM=null,PH=-1;const SP=new THREE.Group();P.bed.add(SP);const spag=[];
  for(let i=0;i<70;i++){const a=i*2.399,r=1+(i*37%17)/17*7,x=4+Math.cos(a)*r,z=Math.sin(a)*r*.7,y=.3+Math.abs(Math.sin(a*1.7))*r*.4;
    const tb=E.tube([[x,y,z],[x+2*Math.sin(i),y+1.2,z+1.5*Math.cos(i)],[x+Math.sin(i*1.3)*3,y+.4,z-Math.cos(i)*2]],.18,spM,10);tb.visible=false;SP.add(tb);spag.push(tb)}
  const DUR=11,FAIL=.38;
  return {tick(t){const s=E.state('l6'),el=s.t0?(performance.now()-s.t0)/1000:0,p=Math.min(1,el/DUR),failed=p>FAIL,det=s.ai&&failed&&el>FAIL*DUR+1.2,stopP=s.ai?Math.min(p,FAIL+1.2/DUR):p;
      const h=Math.min(stopP,FAIL)*20;if(Math.abs(h-PH)>.05){PH=h;if(partM){part.remove(partM);partM.geometry.dispose()}if(h>.05){partM=E.mesh(new THREE.BoxGeometry(10,h,8),fil);partM.position.y=h/2;part.add(partM)}}
      if(failed){part.position.set(-9,0,4);part.rotation.set(0,.4,Math.PI/2*.92)}else{part.position.set(0,0,0);part.rotation.set(0,0,0)}
      const kk=failed?(stopP-FAIL)/(1-FAIL):0;spag.forEach((o,i)=>o.visible=failed&&i<6+kk*64);
      const hz=failed?FAIL*20+(stopP-FAIL)*6:h,hx=failed?(det?4:4+Math.sin(t*5)*6):Math.sin(t*7)*5;P.set(hx,failed?0:Math.cos(t*7)*4,hz+.2);
      lens.material.color.set(s.ai?(det?0xFFB95E:0x86D9B5):0x5A6480);
      E.label('c',[-20,34,22],s.ai?'cámara mirando':'cámara sin detección',s.ai?E.CSS.pop:E.CSS.soft);
      if(det)E.label('n',[0,46,0],'📱 Aviso: se detectó una falla, impresora en pausa',E.CSS.ui);else E.unlabel('n');
      E.pill(det?'en pausa: atajada a tiempo':failed&&p>=1?'terminó: nido de plástico':failed?'¡se despegó la pieza!':p>=1?'terminó':'imprimiendo',det?E.CSS.pop:failed?E.CSS.bad:E.CSS.ui);return true}};
}});
