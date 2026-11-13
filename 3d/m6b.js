/* Capa a Capa · escenas 3D del módulo 6, parte 2 (lecciones 6.6 a 6.9). La 6.10 (el diagnosticador) queda en 2D. */
import {register,THREE} from '../cac3d.js';
const rnd=(i,k)=>{const x=Math.sin(i*127.1+k*311.7)*43758.5453;return x-Math.floor(x)};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function clear(g){while(g.children.length){const o=g.children.pop();o.traverse(x=>{if(x.geometry)x.geometry.dispose()})}}
function group(E){const g=new THREE.Group();E.scene.add(g);return g}
const chk=id=>{const e=document.getElementById(id);return !!(e&&e.checked)};

/* ---------- 6.6 hilos y granitos ---------- */
register('l1',{span:24,view:{pos:[2,16,46],target:[2,8,0],posP:[3,22,64],targetP:[2,10,0],min:22,max:130},build(E){
  const M=E.M;E.bed(46,20,{grid:5});const H=16,G=group(E),S=group(E),noz=E.nozzle(.55);
  const box=E.slab(18,10,.6,H,E.layered(E.COL.fil,.6));box.position.x=-6;E.scene.add(box);const col=E.slab(3,3,.4,H,E.layered(E.COL.fil,.6));col.position.x=15;E.scene.add(col);
  const zitM=new THREE.MeshStandardMaterial({color:0xFFC9A8,roughness:.5});let st={s:0},key='';
  return {update(){const seam=E.chip('seam1','v')||'frente',T=E.val('t1'),wet=chk('wet1'),wipe=chk('wipe1'),k2=[seam,T,wet,wipe].join();if(k2===key)return;key=k2;
      const s=clamp((wet?.6:0)+clamp((T-215)/25,0,1)*.45,0,1),z=clamp(.55+(T>220?.25:0)+(wet?.2:0)-(wipe?.35:0),.2,1);st={s};clear(G);clear(S);const zr=.18+z*.32;
      for(let i=0;i<Math.round(H/.6);i++){const y=i*.6+.3;let x,zz=5.02;if(seam==='frente')x=-6-1.5+(rnd(i,1)-.5)*.3;else if(seam==='azar')x=-6-8.4+rnd(i,3)*16.8;else{x=-6+9.02;zz=5.02}
        const d=E.mesh(new THREE.SphereGeometry(zr*(seam==='esquina'?.55:(.7+.5*rnd(i,2))),10,8),zitM);d.position.set(x,y,zz);d.scale.z=.6;G.add(d)}
      for(let k=0;k<Math.round(s*11);k++){const y=2+rnd(k,1)*(H-3),zq=(rnd(k,2)-.5)*2.4;S.add(E.tube([[3,y,zq],[8.5,y-.8-rnd(k,3)*1.6,zq],[13.5,y+(rnd(k,4)-.5),zq]],.04,M.fil,12))}
      E.label('w',[-6,0,7],wet?'filamento húmedo':'filamento seco',wet?E.CSS.bad:E.CSS.pop);
      E.pill(seam==='esquina'?(s>0?'costura escondida · con hilos':'costura escondida, sin hilos'):seam==='frente'?'línea de granitos':'granitos por toda la cara',seam==='esquina'&&s===0?E.CSS.pop:E.CSS.ui)},
    tick(t){const ph=(t*.35)%1,x=ph<.7?-15+18*(ph/.7):3+(15-3)*((ph-.7)/.3);noz.position.set(x,H+.1,0);return true}};
}});

/* ---------- 6.7 voladizos y puentes ---------- */
register('l2',{span:30,view:{pos:[2,20,58],target:[0,9,0],posP:[3,28,82],targetP:[0,11,0],min:28,max:160},build(E){
  const M=E.M,DZ=10;E.bed(64,22,{grid:5});const G=group(E),noz=E.nozzle(.55),fan=E.fan(.7);let F=30,pt=14;
  return {update(){const fan2=E.val('fan2'),T=E.val('tmp2'),ang=+(E.chip('ang2','v')||60),sup=chk('sup2');F=fan2;clear(G);
      const sag=clamp((.8-fan2/100)+(T-205)/40,0,1),d=sup?0:clamp((ang-45)/30*.6+(.8-fan2/100)*.8+(T-205)/50,0,1),nl=14,lh=1,ox=-8,tg=Math.tan(ang*Math.PI/180)*.9;
      for(let i=0;i<nl;i++){const xl=ox-i*tg,dr=d*Math.pow(i/nl,1.4)*lh*5,w=(ox+3)-xl,m=E.mesh(new THREE.BoxGeometry(w,lh*.96,DZ),i%2?M.fil2:M.fil);m.position.set((ox+3+xl)/2,i*lh+lh/2,0);G.add(m);
        if(dr>.2){const c=E.tube([[xl+.4,i*lh+lh/2,-DZ/2],[xl-.3,i*lh+lh/2-dr*.4,-DZ/2],[xl-.3,i*lh-dr,-DZ/2]],.45,i%2?M.fil2:M.fil,10);G.add(c);const c2=c.clone();c2.position.z=DZ;G.add(c2)}}
      if(sup)for(let x=ox-nl*tg+.4;x<ox;x+=.9){const h=Math.max(0,(ox-x)/tg*lh);if(h>.3){const s=E.mesh(new THREE.BoxGeometry(.16,h,DZ-1),M.sup);s.position.set(x,h/2,0);G.add(s)}}
      const p1=10,p2=26,pw=3;pt=nl*lh*.7;for(let i=0;i<Math.round(pt+3);i++){[p1,p2].forEach(x=>{const b=E.mesh(new THREE.BoxGeometry(pw,lh*.96,DZ),i%2?M.fil2:M.fil);b.position.set(x,i*lh+lh/2,0);G.add(b)})}
      const sg=sag*pt*.55;for(let k=0;k<3;k++)for(let z=-DZ/2+1;z<=DZ/2-1;z+=2){const pts=[];for(let i=0;i<=12;i++){const u=i/12;pts.push([p1+pw/2+(p2-p1-pw)*u,pt+3+(k+.5)*lh*.9-4*sg*(1-k*.25)*u*(1-u),z])}G.add(E.tube(pts,.45,k%2?M.fil2:M.fil,24))}
      E.label('a',[ox-nl*tg*.6,nl*lh+2,0],ang+'°'+(sup?' con soporte':''),d>.32?E.CSS.bad:E.CSS.pop);E.label('b',[(p1+p2)/2,pt+8,0],sag>.15?'puente colgando':'puente derecho',sag>.15?E.CSS.bad:E.CSS.pop);
      E.pill(T+' °C · ventilador '+fan2+' %',E.CSS.ink)},
    tick(t,dt){const hx=10+16*((Math.sin(t*.9)+1)/2);noz.position.set(hx,pt+6.2,0);fan.g.position.set(hx+5,pt+10,0);fan.g.rotation.z=Math.PI/2.4;fan.spin(dt,F/100);return true}};
}});

/* ---------- 6.8 soportes y encastres (la prueba arranca en la página) ---------- */
register('l3',{span:28,view:{pos:[2,20,52],target:[0,7,0],posP:[3,28,74],targetP:[0,9,0],min:26,max:150},build(E){
  const M=E.M,DZ=10;E.bed(64,22,{grid:5});const A=group(E),S=group(E),B=group(E);
  const shelfCol=E.slab(3.4,DZ,.3,12,E.layered(E.COL.fil,.6));shelfCol.position.x=-24;A.add(shelfCol);const shelf=E.mesh(new THREE.BoxGeometry(18,3,DZ),M.fil);shelf.position.set(-16.6,13.5,0);A.add(shelf);
  const dmg=group(E);const peg=new THREE.Group();E.scene.add(peg);const pm=new THREE.MeshStandardMaterial({color:0x86D9B5,roughness:.5});
  let st={},gp=-1,tol=-1;
  function build(){clear(S);clear(B);clear(peg);clear(dmg);const gap=+(E.chip('gap3','v')||.1),o=+(E.chip('tol3','v')||0);gp=gap;tol=o;const g=gap/.2*.6;
    for(let x=-20.4;x<-8;x+=.9){const s=E.mesh(new THREE.BoxGeometry(.18,12-g,DZ-1),M.sup);s.position.set(x,(12-g)/2,0);S.add(s)}const top=E.mesh(new THREE.BoxGeometry(12.4,.3,DZ-1),M.sup);top.position.set(-14.2,12-g-.15,0);S.add(top);
    if(gap===.35)for(let k=0;k<12;k++){const d=E.mesh(new THREE.SphereGeometry(.7,10,8),M.fil2);d.scale.set(1,.6+rnd(k,3),1);d.position.set(-21+k*1.1,12-.2,(rnd(k,4)-.5)*7);dmg.add(d)}
    const hw=4,blkM=E.layered(E.COL.fil,.6);[-1,1].forEach(sd=>{const b=E.mesh(new THREE.BoxGeometry(8,7,DZ),blkM);b.position.set(14+sd*(hw/2+4),3.5,0);B.add(b)});const fl=E.mesh(new THREE.BoxGeometry(hw,1,DZ),blkM);fl.position.set(14,.5,0);B.add(fl);
    const pw=hw-(o*hw*.35)+(o===0?hw*.06:0),body=E.mesh(new THREE.BoxGeometry(pw,8,pw),pm);body.position.y=4;peg.add(body);const head=E.mesh(new THREE.BoxGeometry(pw*1.8,1.4,pw*1.8),pm);head.position.y=8.7;peg.add(head)}
  E.label('a',[-16,0,7.4],'Soporte bajo un estante',E.CSS.soft);E.label('b',[14,0,7.4],'Perno y agujero',E.CSS.soft);
  return {update(){build()},
    tick(t){st=E.state('l3');if(+(E.chip('gap3','v')||.1)!==gp||+(E.chip('tol3','v')||0)!==tol)build();const e=st.t0==null||st.t0<0?0:clamp((performance.now()-st.t0)/2000,0,1),ee=e<.5?2*e*e:1-Math.pow(-2*e+2,2)/2;
      S.position.y=-ee*(gp===.1?4:14);S.visible=!(e>=1&&gp!==.1);S.rotation.z=gp===.1&&e<1?Math.sin(e*30)*.02:0;dmg.visible=gp===.35;
      const ent=tol!==0,py=16-(ent?15:7.6)*ee;peg.position.set(14+(tol===0&&e>.6&&e<1?Math.sin(t*40)*.15:0),py,0);peg.rotation.z=tol===.5&&e>=1?Math.sin(t*5)*.06:0;
      if(e>=1){E.label('r1',[-16,17,0],gp===.1?'soporte soldado':gp===.35?'cara de abajo caída':'sale limpio',gp===.2?E.CSS.pop:E.CSS.bad);E.label('r2',[14,18.5,0],tol===0?'no entra':tol===.5?'baila':'entra justo',tol===.2?E.CSS.pop:E.CSS.bad)}else{E.unlabel('r1');E.unlabel('r2')}
      E.pill('Soporte '+String(gp).replace('.',',')+' mm · juego '+String(tol).replace('.',',')+' mm',E.CSS.ink);return true}};
}});

/* ---------- 6.9 heat creep y fugas (la prueba arranca en la página) ---------- */
register('l4',{span:22,view:{pos:[24,10,40],target:[2,8,0],posP:[30,14,54],targetP:[2,9,0],min:20,max:110},build(E){
  const M=E.M,CUT=[new THREE.Plane(new THREE.Vector3(0,0,-1),0)],D=THREE.DoubleSide,mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.45,metalness:.5,clippingPlanes:CUT,side:D});
  for(let k=0;k<7;k++){const f=E.mesh(new THREE.CylinderGeometry(4.6,4.6,1,32),mat(0x93A1C4));f.position.y=17.5-k*1.6;E.scene.add(f)}
  const core=E.mesh(new THREE.CylinderGeometry(1.6,1.6,11,20),mat(0x66749A));core.position.y=13;E.scene.add(core);const brk=E.mesh(new THREE.CylinderGeometry(.9,.9,3,16),mat(0xB7C1D9));brk.position.y=6;E.scene.add(brk);
  const blk=E.mesh(new THREE.BoxGeometry(9,4.6,6),mat(0xC9D2E6));blk.position.y=2.2;E.scene.add(blk);const heater=E.mesh(new THREE.CylinderGeometry(.8,.8,6.2,16),new THREE.MeshStandardMaterial({color:0xFF8A5C,emissive:0xFF5A2A,emissiveIntensity:.8}));heater.rotation.x=Math.PI/2;heater.position.set(-2.4,2.2,0);E.scene.add(heater);
  const noz=E.mesh(new THREE.CylinderGeometry(2,.5,3,20),new THREE.MeshStandardMaterial({color:0xD9A441,roughness:.3,metalness:.95,clippingPlanes:CUT,side:D}));noz.position.y=-1.5;E.scene.add(noz);
  const fil=E.mesh(new THREE.BoxGeometry(.9,30,.1),new THREE.MeshStandardMaterial({color:0xFF9E70,roughness:.5}),false);fil.position.set(0,15,.06);E.scene.add(fil);
  const softM=new THREE.MeshStandardMaterial({color:0xFF6E46,emissive:0xFF5A2A,emissiveIntensity:.5,transparent:true,opacity:.9}),soft=E.mesh(new THREE.BoxGeometry(1,1,.12),softM,false);E.scene.add(soft);
  const clog=E.mesh(new THREE.SphereGeometry(1.4,16,10),new THREE.MeshStandardMaterial({color:0xC96E4D,roughness:.6}),false);clog.scale.set(1,.6,.2);E.scene.add(clog);
  const leak=E.mesh(new THREE.SphereGeometry(1,20,12),new THREE.MeshStandardMaterial({color:0x7A4A30,roughness:.7}));leak.position.set(.6,.4,0);E.scene.add(leak);
  const fan=E.fan(1.05);fan.g.position.set(9.4,14,0);fan.g.rotation.z=Math.PI/2;
  const enc=E.mesh(new THREE.BoxGeometry(34,30,18),new THREE.MeshStandardMaterial({color:0xFFB38A,transparent:true,opacity:.06,depthWrite:false,side:THREE.BackSide}),false);enc.position.set(2,8,0);E.scene.add(enc);
  const encE=new THREE.LineSegments(new THREE.EdgesGeometry(enc.geometry),new THREE.LineDashedMaterial({color:0xFFB38A,dashSize:1,gapSize:.8,transparent:true,opacity:.5}));encE.computeLineDistances();encE.position.copy(enc.position);E.scene.add(encE);
  E.label('a',[-6.5,17.5,0],'disipador frío',E.CSS.soft);E.label('b',[-3,6,0],'heatbreak',E.CSS.soft);E.label('c',[-6.5,2.2,0],'bloque caliente',E.CSS.soft);
  return {tick(t,dt){const s=E.state('l4'),fanOn=(E.chip('fan4','v')||'parado')==='gira',cl=(E.chip('enc4','v')||'cerrado')==='cerrado',ret=E.val('ret4'),tight=chk('tight4');
      const r=(fanOn?0:.7)+(cl?.3:0)+clamp((ret-2)/4,0,1)*.45,e=s.t0==null||s.t0<0?0:clamp((performance.now()-s.t0)/5000,0,1),clogE=s.clog?s.clog/120:2,stopped=s.ran&&e>=clogE,el=stopped?clogE:e;
      const softTop=4.6+(s.ran?el:0)*r*13;soft.scale.y=softTop+3;soft.position.set(0,(softTop-3)/2,.08);clog.visible=stopped;clog.position.set(0,softTop+.6,.1);
      const lk=!tight&&s.ran?clamp(el*1.2,0,1):0;leak.visible=lk>.02;leak.scale.set(5.6*lk+.4,1.6*lk+.3,3.8*lk+.3);fan.spin(dt,fanOn?1:0);enc.visible=encE.visible=cl;
      if(stopped)E.label('k',[6,softTop+.6,0],'atasco',E.CSS.bad);else E.unlabel('k');if(lk>.3)E.label('l',[7,-1,3],'fuga por la rosca',E.CSS.bad);else E.unlabel('l');
      E.pill((s.ran?Math.round(el*120):0)+' de 120 min',stopped?E.CSS.bad:e>=1?E.CSS.pop:E.CSS.ui);return true}};
}});
