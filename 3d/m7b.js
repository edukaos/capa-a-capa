/* Capa a Capa · escenas 3D del módulo 7, parte 2 (lecciones 7.6 a 7.9). */
import {register,THREE} from '../cac3d.js';
const rnd=(i,k)=>{const x=Math.sin(i*127.1+k*311.7)*43758.5453;return x-Math.floor(x)};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),num=(v,d)=>v.toFixed(d==null?1:d).replace('.',',');
const eio=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
function clear(g){while(g.children.length){const o=g.children.pop();o.traverse(x=>{if(x.geometry)x.geometry.dispose()})}}
function group(E){const g=new THREE.Group();E.scene.add(g);return g}
const since=s=>s&&s.t0>0?(performance.now()-s.t0)/1000:-1;

/* ---------- 7.6 tornillos: directo, tuerca cautiva o inserto ---------- */
register('l1',{span:16,view:{pos:[12,17,40],target:[0,7,0],posP:[14,22,56],targetP:[0,8,0],min:14,max:90},build(E){
  const M=E.M,CUT=[new THREE.Plane(new THREE.Vector3(0,0,-1),0)],DS=THREE.DoubleSide;E.bed(30,20,{grid:5});
  const fil=new THREE.MeshStandardMaterial({color:E.COL.fil,roughness:.5,clippingPlanes:CUT,side:DS}),lidM=new THREE.MeshStandardMaterial({color:0x9FC5FF,roughness:.45,clippingPlanes:CUT,side:DS}),
    brass=new THREE.MeshStandardMaterial({color:0xD9A441,roughness:.3,metalness:.95,clippingPlanes:CUT,side:DS}),steelC=new THREE.MeshStandardMaterial({color:0xB9C2D8,roughness:.3,metalness:.9,clippingPlanes:CUT,side:DS});
  const B=group(E);B.position.y=.04;const lid=new THREE.Group(),screw=new THREE.Group(),dust=new THREE.Group();E.scene.add(lid);E.scene.add(screw);E.scene.add(dust);
  const lathe=(pts,m)=>E.mesh(new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(p[0],p[1])),40),m,false);
  // tornillo: cabeza, caña y filete
  const hd=E.mesh(new THREE.CylinderGeometry(2,2,1.1,28),M.steel);hd.position.y=.55;screw.add(hd);const sl=E.mesh(new THREE.BoxGeometry(2.6,.3,.45),M.dark,false);sl.position.y=1.12;screw.add(sl);
  const sh=E.mesh(new THREE.CylinderGeometry(.75,.6,11,20),M.steel);sh.position.y=-5.5;screw.add(sh);
  for(let k=0;k<20;k++){const r=E.mesh(new THREE.TorusGeometry(.8,.16,6,20),M.steel,false);r.rotation.x=Math.PI/2+.12;r.position.y=-1.5-k*.48;screw.add(r)}
  for(let i=0;i<14;i++){const p=E.mesh(new THREE.SphereGeometry(.18,6,4),new THREE.MeshStandardMaterial({color:0xFFD2B8,roughness:.8}),false);dust.add(p)}
  let typ=null;
  function build(t){clear(B);lid.clear();typ=t;
    B.add(lathe([[1.6,10],[1.6,1],[0,1],[0,0],[7,0],[7,10]],fil));const top=E.mesh(new THREE.RingGeometry(t==='directo'?.62:1.6,7,40),fil);top.rotation.x=-Math.PI/2;top.position.y=10;B.add(top);
    if(t==='directo'){B.add(lathe([[.62,10],[.62,1.2],[1.6,1.2],[1.6,10]],fil))}
    if(t==='tuerca'){const n=E.mesh(new THREE.CylinderGeometry(1.9,1.9,1.6,6,1,true),steelC);n.position.y=4;B.add(n);const n2=E.mesh(new THREE.RingGeometry(.75,1.9,6),steelC);n2.rotation.x=-Math.PI/2;n2.position.y=4.8;B.add(n2);
      B.add(lathe([[.75,10],[.75,4.8],[1.6,4.8],[1.6,10]],fil));B.add(lathe([[.75,3.2],[.75,1.2],[1.6,1.2],[1.6,3.2]],fil))}
    if(t==='inserto'){B.add(lathe([[.75,10],[.75,5.5],[1.25,5.5],[1.25,10]],brass));for(let k=0;k<4;k++){const r=E.mesh(new THREE.TorusGeometry(1.32,.12,6,24),brass,false);r.rotation.x=Math.PI/2;r.position.y=6+k*1.1;B.add(r)}
      B.add(lathe([[1.25,10],[1.25,5.5],[1.6,5.5],[1.6,10]],fil));B.add(lathe([[.75,5.5],[.75,1.2],[1.6,1.2],[1.6,5.5]],fil))}
    lid.add(lathe([[2.2,1.6],[2.2,0],[9,0],[9,1.6]],lidM));const lt=E.mesh(new THREE.RingGeometry(2.2,9,40),lidM);lt.rotation.x=-Math.PI/2;lt.position.y=1.6;lid.add(lt);
    E.label('a',[-7,5,0],{directo:'rosca en el plástico',tuerca:'tuerca de metal',inserto:'inserto de bronce'}[t],E.CSS.soft)}
  return {tick(t){const s=E.state('l1'),k=s.typ||E.chip('typ1','v')||'directo';if(k!==typ)build(k);
      const e=since(s),run=e>=0,n=run?Math.min(10,Math.floor(e/.6)+1):0,f=run&&e<6?(e%.6)/.6:0,fail=k==='directo'&&run&&n>4,o=run&&!fail&&e<6?Math.sin(f*Math.PI):fail?0:0;
      const lift=o*4.5;lid.position.y=10+lift+(fail?.5:0);lid.rotation.z=fail?.05:0;screw.position.y=11.6+lift+(fail?.5:0);screw.rotation.y=run&&(e<6||fail)?(fail?t*12:o*12):0;
      dust.visible=fail;if(fail)dust.children.forEach((p,i)=>{const a=i*.45+t,r=1.2+rnd(i,1)*1.5,yy=10.1+((t*.6+rnd(i,2))%1)*.4;p.position.set(Math.cos(a)*r,yy,Math.sin(a)*r*.4+.6)});
      E.pill(!run?'Probá abrir y cerrar 10 veces':fail?'rosca gastada en la apertura 4':e<6?'apertura '+n+' de 10':'10 aperturas · rosca firme',!run?E.CSS.ui:fail?E.CSS.bad:e<6?E.CSS.ui:E.CSS.pop);return true}};
}});

/* ---------- 7.7 snap fit: brazo en voladizo ---------- */
register('l2',{span:20,view:{pos:[6,10,40],target:[4,3,0],posP:[8,14,56],targetP:[4,4,0],min:20,max:110},build(E){
  const D=6,fA=new THREE.MeshStandardMaterial({color:E.COL.fil,roughness:.5}),fB=new THREE.MeshStandardMaterial({color:E.COL.fil2,roughness:.5}),mint=new THREE.MeshStandardMaterial({color:0x86D9B5,roughness:.45});
  const base=E.mesh(new THREE.BoxGeometry(6,10,D+4),new THREE.MeshStandardMaterial({color:0x4F5B7D,roughness:.6}));base.position.set(-11,0,0);E.scene.add(base);
  const arm=new THREE.Group(),tipG=new THREE.Group();arm.position.set(-8,0,0);E.scene.add(arm);const mate=new THREE.Group();E.scene.add(mate);
  const mb=E.mesh(new THREE.BoxGeometry(8,4,D+4),mint);mb.position.set(4,6.2,0);mate.add(mb);const step=E.mesh(new THREE.BoxGeometry(3,2,D+4),mint);step.position.set(1.5,3.2,0);mate.add(step);
  let key='',Ls=8,ts=2.5,slices=[],K=1;
  function build(L,t,ori,rad){arm.clear();slices=[];Ls=L*1.1;ts=t*.9;K=Ls;
    const n=ori==='cruzadas'?Math.round(Ls/.8):Math.max(3,Math.round(ts/.4));for(let i=0;i<n;i++){let g;if(ori==='cruzadas'){const w=Ls/n;g=new THREE.BoxGeometry(w*.96,ts,D);g.translate(w*(i+.5),0,0)}else{const h=ts/n;g=new THREE.BoxGeometry(Ls,h*.94,D);g.translate(Ls/2,-ts/2+h*(i+.5),0)}
      const m=E.mesh(g,i%2?fA:fB);m.userData.base=g.attributes.position.array.slice();arm.add(m);slices.push(m)}
    const hk=new THREE.Shape();hk.moveTo(0,0);hk.lineTo(0,2.4);hk.lineTo(2.2,0);hk.lineTo(0,0);const hg=new THREE.ExtrudeGeometry(hk,{depth:D,bevelEnabled:false});hg.translate(-1.2,ts/2,-D/2);tipG.clear();tipG.add(E.mesh(hg,fA));tipG.position.set(Ls,0,0);arm.add(tipG);
    if(rad){const f=new THREE.Shape();f.moveTo(0,0);f.lineTo(1.6,0);f.quadraticCurveTo(0,0,0,1.6);f.lineTo(0,0);[1,-1].forEach(sy=>{const g=new THREE.ExtrudeGeometry(f,{depth:D,bevelEnabled:false});g.translate(0,0,-D/2);const m=E.mesh(g,fA);m.scale.y=sy;m.position.y=sy*ts/2;arm.add(m)})}
    E.label('l',[-8+Ls/2,-ts/2-2.4,D/2],'brazo '+L+' mm · '+num(t,2).replace(/0$/,'')+' mm',E.CSS.soft)}
  function bend(dy,brk){const cut=brk?.6:99;slices.forEach(m=>{const b=m.userData.base,p=m.geometry.attributes.position;for(let i=0;i<p.count;i++){const x=b[i*3],u=clamp(x/Ls,0,1);p.setY(i,b[i*3+1]+(x>cut?0:dy*u*u*(3-2*u)/2*1.0))}p.needsUpdate=true;m.geometry.computeVertexNormals()});tipG.position.y=dy}
  return {tick(t){const s=E.state('l2'),L=s.L||8,th=s.t||2.5,ori=s.ori||'cruzadas',rad=!!s.rad,k2=[L,th,ori,rad].join();if(k2!==key){key=k2;build(L,th,ori,rad)}
      const e=since(s),r=e>=0?s.res:null,tip=-8+Ls;let mx=tip+14,dy=0,brk=false,fall=0;
      if(e>=0){const p=clamp(e/1.6,0,1);mx=tip+14-p*14.5;const over=mx-tip;if(over<1.2&&over>-1.5)dy=-2*clamp((1.2-over)/1.2,0,1);
        if(r==='rompe'&&over<.6){brk=true;fall=clamp((e-1.1)/.8,0,1)}if(r==='ok'&&over<-1.2)dy=0;if(r==='suelto'&&e>1.8){mx=tip-.3+clamp((e-1.8)/.4,0,1)*6;dy=0}}
      mate.position.x=mx;
      if(brk){bend(0,false);arm.rotation.z=0;tipG.position.y=0;arm.position.y=-fall*6;arm.rotation.z=-fall*.6}else{arm.position.y=0;arm.rotation.z=0;bend(dy,false)}
      const res=r&&e>2?r:null;if(res)E.label('r',[tip,8,0],{ok:'¡clic! trabado',rompe:'se quebró en la base',suelto:'no retiene'}[res],res==='ok'?E.CSS.pop:E.CSS.bad);else E.unlabel('r');
      const strain=th/(L*L)*100*(rad?.75:1)*(ori==='cruzadas'?2.2:1);E.pill('esfuerzo '+Math.round(strain*100)+' % del límite',strain>1?E.CSS.bad:strain*(ori==='cruzadas'?1/2.2:1)/(rad?.75:1)<.4?E.CSS.ui:E.CSS.pop);return true}};
}});

/* ---------- 7.8 bisagras ---------- */
register('l3',{span:18,view:{pos:[30,17,-12],target:[0,4,-2],posP:[38,24,-16],targetP:[0,5,-2],min:20,max:110},build(E){
  const M=E.M,W=16,Dp=12,H=5;E.bed(40,30,{grid:5});const box=group(E),lid=new THREE.Group(),hinge=group(E);E.scene.add(lid);let key='',mat=null;
  function build(typ,m){clear(box);lid.clear();clear(hinge);mat=m==='PETG'?new THREE.MeshPhysicalMaterial({color:0x8FC9E8,roughness:.25,transmission:.0,clearcoat:.6}):new THREE.MeshStandardMaterial({color:E.COL.fil,roughness:.5});
    box.add(E.shell(W,Dp,1.2,1,H,mat,0));const fl=E.slab(W,Dp,1.2,.8,mat,0);box.add(fl);
    const lp=E.mesh(new THREE.BoxGeometry(W,1,Dp),mat);lp.position.set(0,.5,Dp/2);lid.add(lp);lid.position.set(0,H,-Dp/2);
    if(typ==='viva'){const st=E.mesh(new THREE.BoxGeometry(W*.8,.3,1.2),mat);st.position.set(0,H+.15,-Dp/2-.3);hinge.add(st)}
    else{for(let k=0;k<5;k++){const kn=E.mesh(new THREE.CylinderGeometry(.9,.9,W/5-.3,20),mat);kn.rotation.z=Math.PI/2;kn.position.set(-W/2+W/10+k*W/5,H+.5,-Dp/2-.6);(k%2?lid:hinge).add(kn);if(k%2){kn.position.set(-W/2+W/10+k*W/5,.5,-.6)}}
      if(typ==='pasador'){const pin=E.mesh(new THREE.CylinderGeometry(.35,.35,W+1.4,16),M.steel);pin.rotation.z=Math.PI/2;pin.position.set(0,H+.5,-Dp/2-.6);hinge.add(pin)}}
    E.label('h',[0,H+2,-Dp/2-2],{viva:'franja fina',pieza:'impresa en una pieza',pasador:'pasador de metal'}[typ],E.CSS.soft)}
  return {tick(t){const s=E.state('l3'),typ=s.typ||'viva',m=s.mat||'PLA',k2=typ+m;if(k2!==key){key=k2;build(typ,m)}
      const e=since(s),r=e>=0?s.res:null,run=e>=0&&e<4.2;let n=run?Math.min(50,Math.floor(e/4*50)+1):0,a=0;
      if(r==='soldada'){a=run?.03*Math.sin(t*40):0;n=0}else if(r==='rota'){const eb=8/50*4;if(e<eb){a=Math.sin((e/.5)*Math.PI)**2*1.9;n=Math.min(8,n)}else{a=-.2;n=8}}else if(run)a=Math.sin((e/.5)*Math.PI)**2*1.9;
      if(r==='rota'&&e>=8/50*4){lid.rotation.x=0;lid.position.set(1.2,H+.2,-Dp/2+.8);lid.rotation.z=.12;hinge.visible=true}else{lid.position.set(0,H,-Dp/2);lid.rotation.set(-a,0,0)}
      if(r==='soldada')lid.position.x=a*10;
      const done=e>=4.2;E.pill(e<0?'Probá 50 aperturas':r==='soldada'?'bisagra soldada: no gira':r==='rota'&&e>=.64?'se quebró a las 8 aperturas':done?'50 aperturas sin problemas':'apertura '+n+' de 50',e<0?E.CSS.ui:r==='ok'&&done?E.CSS.pop:r==='ok'||!r?E.CSS.ui:E.CSS.bad);return true}};
}});

/* ---------- 7.9 perfiles: flexión y torsión ---------- */
const PR4={macizo:{n:'macizo',flex:1,tors:1,g:20},u:{n:'en U',flex:1.5,tors:.25,g:10},tubo:{n:'tubular',flex:1.4,tors:1.6,g:10},i:{n:'en I',flex:2,tors:.3,g:10}},REQ4=['flex','tors'];
function profShape(p,a,b,t){const s=new THREE.Shape();const R=(x0,y0,x1,y1,ph)=>{const q=ph||s;q.moveTo(x0,y0);q.lineTo(x1,y0);q.lineTo(x1,y1);q.lineTo(x0,y1);q.lineTo(x0,y0)};
  if(p==='macizo')R(-a/2,-b/2,a/2,b/2);else if(p==='tubo'){R(-a/2,-b/2,a/2,b/2);const h=new THREE.Path();h.moveTo(-a/2+t,-b/2+t);h.lineTo(-a/2+t,b/2-t);h.lineTo(a/2-t,b/2-t);h.lineTo(a/2-t,-b/2+t);h.lineTo(-a/2+t,-b/2+t);s.holes.push(h)}
  else if(p==='u'){s.moveTo(-a/2,b/2);s.lineTo(-a/2,-b/2);s.lineTo(a/2,-b/2);s.lineTo(a/2,b/2);s.lineTo(a/2-t,b/2);s.lineTo(a/2-t,-b/2+t);s.lineTo(-a/2+t,-b/2+t);s.lineTo(-a/2+t,b/2);s.lineTo(-a/2,b/2)}
  else{s.moveTo(-a/2,-b/2);s.lineTo(a/2,-b/2);s.lineTo(a/2,-b/2+t);s.lineTo(t/2,-b/2+t);s.lineTo(t/2,b/2-t);s.lineTo(a/2,b/2-t);s.lineTo(a/2,b/2);s.lineTo(-a/2,b/2);s.lineTo(-a/2,b/2-t);s.lineTo(-t/2,b/2-t);s.lineTo(-t/2,-b/2+t);s.lineTo(-a/2,-b/2+t);s.lineTo(-a/2,-b/2)}
  return s}
register('l4',{span:26,view:{pos:[30,12,32],target:[0,0,0],posP:[38,18,48],targetP:[0,1,0],min:22,max:130},build(E){
  const L=36,fil=new THREE.MeshStandardMaterial({color:E.COL.fil,roughness:.5,side:THREE.DoubleSide}),sup=group(E),AR=group(E);let beam=null,base=null,key='';
  function build(p,ld){if(beam){E.scene.remove(beam);beam.geometry.dispose()}clear(sup);clear(AR);
    const g=new THREE.ExtrudeGeometry(profShape(p,5,6,1.1),{depth:L,bevelEnabled:false,steps:40});g.rotateY(Math.PI/2);g.translate(-L/2,0,0);beam=E.mesh(g,fil);E.scene.add(beam);base=g.attributes.position.array.slice();
    const sm=new THREE.MeshStandardMaterial({color:0x4F5B7D,roughness:.6});
    if(ld==='flex'){[-1,1].forEach(sx=>{const c=E.mesh(new THREE.ConeGeometry(1.8,3,3),sm);c.position.set(sx*(L/2-1.5),-4.6,0);sup.add(c)});const w=E.mesh(new THREE.BoxGeometry(5,3,5),E.M.steel);w.position.set(0,5,0);sup.add(w);w.name='w'}
    else{const wl=E.mesh(new THREE.BoxGeometry(2,14,12),sm);wl.position.set(-L/2-1,0,0);sup.add(wl);const tq=new THREE.Mesh(new THREE.TorusGeometry(6,.3,8,28,Math.PI*1.3),new THREE.MeshBasicMaterial({color:0xFFB95E}));tq.rotation.y=Math.PI/2;tq.position.x=L/2+2;AR.add(tq);
      const hd=new THREE.Mesh(new THREE.ConeGeometry(.9,2,12),new THREE.MeshBasicMaterial({color:0xFFB95E}));hd.position.set(L/2+2,6*Math.sin(Math.PI*1.3),6*Math.cos(Math.PI*1.3));hd.rotation.x=Math.PI*1.3+Math.PI/2;AR.add(hd)}
    const q=PR4[p];E.label('n',[0,-6.5,4],'perfil '+q.n+' · '+q.g+' g',E.CSS.ink);E.label('k',[0,-8.6,4],(ld==='flex'?'flexión':'torsión')+' ×'+num(q[ld],1)+' vs macizo',q[ld]>=1.4?E.CSS.pop:q[ld]<1?E.CSS.bad:E.CSS.soft)}
  return {tick(t){const s=E.state('l4'),i=Math.min(s.i||0,1),p=s.p||'macizo',ld=REQ4[i],k2=p+ld;if(k2!==key){key=k2;build(p,ld)}
      const w=(1-Math.cos(t*2))/2,q=PR4[p][ld],pos=beam.geometry.attributes.position;
      for(let j=0;j<pos.count;j++){let x=base[j*3],y=base[j*3+1],z=base[j*3+2];const u=x/L+.5;
        if(ld==='flex')y-=w*4/q*Math.sin(u*Math.PI);else{const a=u*w*.9/q,c=Math.cos(a),sn=Math.sin(a),ny=y*c-z*sn,nz=y*sn+z*c;y=ny;z=nz}pos.setXYZ(j,x,y,z)}
      pos.needsUpdate=true;beam.geometry.computeVertexNormals();const wt=sup.getObjectByName('w');if(wt)wt.position.y=4.5-w*4/q;
      E.pill(s.i>=2?'¡Los dos pedidos resueltos!':'Pedido '+(i+1)+' de 2 · '+(ld==='flex'?'que se doble poco':'que no se tuerza'),s.i>=2?E.CSS.pop:E.CSS.ui);return true}};
}});
