/* Capa a Capa · escenas 3D del módulo 3 (lecciones 3.1 a 3.7). */
import {register,THREE} from '../cac3d.js';
const rnd=(i,k)=>{const x=Math.sin(i*127.1+k*311.7)*43758.5453;return x-Math.floor(x)};
const MC={PLA:0xFF9E70,PETG:0x8FD3E8,ABS:0xE8E2D0,TPU:0xC7A6F2,Nylon:0xF1ECDD};
function clear(g){while(g.children.length){const o=g.children.pop();o.traverse(x=>{if(x.geometry)x.geometry.dispose()})}}
function group(E){const g=new THREE.Group();E.scene.add(g);return g}

/* Boquilla que deposita una línea de 64 tramos: grosor, cortes, grumos, burbujas e hilos según el caso */
function lineRig(E,opt){opt=opt||{};const N=64,X0=-19,SW=38/N,LH=1.5,DZ=2.4;E.bed(50,16,{grid:5});
  const geo=new THREE.BoxGeometry(SW*1.02,1,DZ),mat=new THREE.MeshStandardMaterial({roughness:.5}),inst=new THREE.InstancedMesh(geo,mat,N);inst.castShadow=inst.receiveShadow=true;E.scene.add(inst);
  const D=group(E),noz=E.nozzle(1.25),hot=new THREE.Color(0xFFF0B8),m4=new THREE.Matrix4(),col=new THREE.Color();let o={},base=new THREE.Color(0xFF9E70),popT=0;
  const popL={key:'pop'};
  return {noz,set(op){o=op;base=new THREE.Color(op.col||0xFF9E70);clear(D);const bm=new THREE.MeshStandardMaterial({color:base,roughness:.5});
      for(let i=0;i<N;i++){if(o.gap&&o.gap(i))continue;const th=LH*(o.thick?o.thick(i):1),x=X0+i*SW;
        if(o.blob){const b=o.blob(i);if(b>0){const s=E.mesh(new THREE.SphereGeometry(b,14,10),bm);s.position.set(x,th*.9,(rnd(i,8)-.5)*1.2);s.userData.i=i;D.add(s)}}
        if(o.bubble&&o.bubble(i)){const s=E.mesh(new THREE.SphereGeometry(.32,10,8),new THREE.MeshStandardMaterial({color:0x141B2B,roughness:.9}),false);s.position.set(x+SW/2,th*.55,DZ/2+.02);s.userData.i=i;D.add(s)}}
      if(o.strings>.05)for(let i=2;i<N;i+=3)if(rnd(i,3)<o.strings){const x=X0+i*SW,t=E.tube([[x,LH,0],[x+(rnd(i,4)-.5)*3,LH+2,0],[x+rnd(i,5)*4-2,LH+1.5+rnd(i,6)*3,(rnd(i,7)-.5)*2]],.07,bm,10);t.userData.i=i;D.add(t)}},
    tick(t){const p=Math.min(1,(t*.16)%1.3),n=Math.floor(p*N);
      for(let i=0;i<N;i++){const vis=i<n&&!(o.gap&&o.gap(i)),th=LH*(o.thick?o.thick(i):1);m4.makeScale(1,vis?Math.max(.01,th):.0001,1);m4.setPosition(X0+i*SW+SW/2,vis?th/2:-1,0);inst.setMatrixAt(i,m4);
        const ht=Math.max(0,1-(n-i)/9);col.copy(base).lerp(hot,ht*.8);inst.setColorAt(i,col)}
      inst.instanceMatrix.needsUpdate=true;if(inst.instanceColor)inst.instanceColor.needsUpdate=true;
      D.children.forEach(c=>{c.visible=c.userData.i<n});const th=LH*(o.thick?o.thick(n):1);noz.position.set(X0+p*38,th+.15,0);
      if(o.pop>.15&&p<1){const q=Math.floor(t*5);if(rnd(q,9)<o.pop*.8)E.label('pop',[noz.position.x+3,th+2+rnd(q,2)*2,0],'¡pop!',E.CSS.bad);else E.unlabel('pop')}else E.unlabel('pop');
      return true}};
}

/* ---------- 3.1 el filamento: diámetro real ---------- */
register('l1',{span:26,view:{pos:[4,24,58],target:[0,9,0],posP:[4,32,80],targetP:[0,11,0],min:24,max:140},build(E){
  const M=E.M,R=lineRig(E),fil=new THREE.MeshStandardMaterial({color:0xFF9E70,roughness:.5});
  const spool=new THREE.Group();spool.position.set(-17,18,-3);E.scene.add(spool);const core=E.mesh(new THREE.CylinderGeometry(3.4,3.4,3,32),fil);core.rotation.x=Math.PI/2;spool.add(core);
  [-1.6,1.6].forEach(z=>{const f=E.mesh(new THREE.CylinderGeometry(4.4,4.4,.25,32),M.dark);f.rotation.x=Math.PI/2;f.position.z=z;spool.add(f)});
  const hub=E.mesh(new THREE.CylinderGeometry(1,1,3.6,16),new THREE.MeshStandardMaterial({color:0x5A698F}));hub.rotation.x=Math.PI/2;spool.add(hub);
  let feed=null;const cal=new THREE.Group();cal.position.set(21,13,-5);E.scene.add(cal);const cut=E.mesh(new THREE.CylinderGeometry(1,1,1.2,32),fil);cut.rotation.x=Math.PI/2;cal.add(cut);
  const jawA=E.mesh(new THREE.BoxGeometry(.5,5,1),M.steel),jawB=jawA.clone(),beam=E.mesh(new THREE.BoxGeometry(9,.55,1),M.steel);cal.add(jawA,jawB,beam);
  E.label('s',[-17,12.5,0],'Bobina',E.CSS.soft);
  return {update(){const d=E.val('dia1'),fl=Math.pow(d/1.75,2);R.set({thick:()=>fl,gap:i=>fl<.95&&rnd(i,1)<(.95-fl)*2.2,blob:i=>fl>1.05&&rnd(i,2)<(fl-1.05)*2?.7:0});
      const r=d/1.75*1.5;cut.scale.set(r,1,r);jawA.position.set(-r-.25,0,0);jawB.position.set(r+.25,0,0);beam.position.set(1.6,2.6,0);
      E.label('d',[21,8.6,-5],d.toFixed(2).replace('.',',')+' mm',Math.abs(d-1.75)<.03?E.CSS.pop:E.CSS.bad);E.pill(d<1.72?'línea flaca, con huecos':d>1.78?'línea gorda, con rebabas':'línea pareja',Math.abs(d-1.75)<.03?E.CSS.pop:E.CSS.bad)},
    tick(t){R.tick(t);spool.rotation.z=-t*.9;if(feed){E.scene.remove(feed);feed.geometry.dispose()}const n=R.noz.position;
      feed=E.tube([[-17+2.4,20.4,-3],[-8,23,-2],[n.x,20,0],[n.x,n.y+12,0]],.28,new THREE.MeshStandardMaterial({color:0xFF9E70,roughness:.5}),40);E.scene.add(feed);return true}};
}});

/* ---------- 3.2 los cuatro básicos: banco de pruebas ---------- */
const RES={PLA:{calor:'bad',golpe:'bad',flexion:'bad',intemperie:'warn'},PETG:{calor:'ok',golpe:'ok',flexion:'ok',intemperie:'ok'},ABS:{calor:'ok',golpe:'ok',flexion:'ok',intemperie:'warn'},TPU:{calor:'ok',golpe:'ok',flexion:'ok',intemperie:'ok'}};
register('l2',{span:30,view:{pos:[4,18,56],target:[2,4,0],posP:[4,26,80],targetP:[2,6,0],min:28,max:160},build(E){
  const M=E.M,L=30,X0=-14,TH=2.4;
  const clamp=E.mesh(new THREE.BoxGeometry(6,22,10),new THREE.MeshStandardMaterial({color:0x3A4766,roughness:.6}));clamp.position.set(X0-3,0,0);E.scene.add(clamp);
  const jaw=E.mesh(new THREE.BoxGeometry(2.4,6,6),new THREE.MeshStandardMaterial({color:0x55648A,roughness:.5}));jaw.position.set(X0+.6,0,0);E.scene.add(jaw);
  const B=group(E),sun=E.mesh(new THREE.SphereGeometry(3,24,16),new THREE.MeshStandardMaterial({color:0xFFB95E,emissive:0xFFB95E,emissiveIntensity:1}),false);sun.position.set(20,16,-6);E.scene.add(sun);
  const glow=new THREE.PointLight(0xFFB95E,0,80);glow.position.copy(sun.position);E.scene.add(glow);
  const ham=new THREE.Group();ham.position.set(X0+L*.62,TH+1,0);E.scene.add(ham);const hh=E.mesh(new THREE.BoxGeometry(6,3,3),new THREE.MeshStandardMaterial({color:0xC9D2E6,roughness:.3,metalness:.8}));hh.position.y=1.5;ham.add(hh);
  const hs=E.mesh(new THREE.CylinderGeometry(.5,.5,14,10),new THREE.MeshStandardMaterial({color:0x8E9BBB,roughness:.6}));hs.position.y=10;ham.add(hs);
  const push=E.mesh(new THREE.ConeGeometry(1.2,2.4,16),new THREE.MeshStandardMaterial({color:0xFFB95E,roughness:.5}));push.rotation.x=Math.PI;E.scene.add(push);
  const rain=[];for(let k=0;k<20;k++){const l=E.line([[0,0,0],[-.6,-2,0]]);l.material=new THREE.LineBasicMaterial({color:0x8FD3E8,transparent:true,opacity:.7});rain.push(l)}
  let m='PLA',ts='calor',t0=0;const col=new THREE.Color();
  function bar(defl,brk,colr,cracks){clear(B);const mk=(a,b,dy,rot)=>{const pts=[];for(let u=a;u<=b+.001;u+=.04)pts.push(new THREE.Vector3(X0+L*u,-(defl*u*u)+dy,0));const g=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),24,TH/2,12,false);g.scale(1,1,1.6);
      const o=E.mesh(g,new THREE.MeshStandardMaterial({color:colr,roughness:.5}));if(rot){const pv=new THREE.Vector3(X0+L*a,dy,0);o.position.copy(pv);o.geometry.translate(-pv.x,-pv.y,0);o.rotation.z=-rot}B.add(o)};
    if(brk>0){mk(0,.5,0,0);mk(.52,1,-brk*brk*14,brk*1.1)}else mk(0,1,0,0);
    if(cracks)for(let k=0;k<5;k++){const x=X0+L*(.2+k*.16),c=E.mesh(new THREE.BoxGeometry(.18,TH*.9,.05),new THREE.MeshStandardMaterial({color:0x141B2B}),false);c.position.set(x,-defl*Math.pow((x-X0)/L,2),TH*.8+.02);c.rotation.z=.3;B.add(c)}}
  return {update(){const nm=E.chip('mat2','m')||'PLA',nt=E.chip('tst2','t')||'calor';if(nm!==m||nt!==ts||!t0){t0=performance.now()}m=nm;ts=nt;const r=RES[m][ts];
      E.label('b',[X0+4,8,0],'Barra de '+m,E.CSS.soft);E.pill(r==='ok'?'Aprobado':r==='bad'?'No aprobado':'Aprobado a medias',r==='ok'?E.CSS.pop:r==='bad'?E.CSS.bad:E.CSS.ui)},
    tick(t){const p=Math.min(1,(performance.now()-t0)/3600);let defl=0,brk=0,cracks=false;col.setHex(MC[m]);
      sun.visible=ts==='calor'||ts==='intemperie';glow.intensity=ts==='calor'?p*80:0;ham.visible=ts==='golpe';push.visible=false;rain.forEach(l=>{l.visible=ts==='intemperie'});E.unlabel('c');
      if(ts==='calor'){defl=m==='PLA'?L*.36*Math.min(1,p*1.3):m==='TPU'?L*.05*p:L*.012*p;E.label('c',[20,10.5,-6],Math.round(25+45*Math.min(1,p*1.4))+' °C',E.CSS.ui)}
      else if(ts==='golpe'){const hit=p>.3;if(hit){const q=(p-.3)/.7;if(m==='PLA')brk=q;else defl=(m==='TPU'?L*.2:L*.05)*Math.exp(-4*q)*Math.sin(q*26)}ham.rotation.z=p<.3?1.2-p/.3*1.2:-(Math.min(.6,(p-.3)*3))*0}
      else if(ts==='flexion'){const pu=p<.55?Math.sin(p/.55*Math.PI/2):Math.max(0,1-(p-.55)/.25),mx={PLA:.07,PETG:.16,ABS:.1,TPU:.55}[m];if(m==='PLA'&&p>.4)brk=(p-.4)/.6;else defl=L*mx*pu;push.visible=p<.8&&!brk;push.position.set(X0+L*.96,-defl*.92+TH+1.6,0)}
      else{if(m==='PLA')col.lerp(new THREE.Color(0xB9B0A8),p*.75);if(m==='ABS')col.lerp(new THREE.Color(0xE0C56A),p*.8);cracks=m==='PLA'&&p>.5;rain.forEach((l,k)=>{l.position.set(X0+rnd(k,1)*L*1.1,22-((t*1.4+rnd(k,2))%1)*20,(rnd(k,3)-.5)*8)});E.label('c',[20,10.5,-6],'mes '+Math.max(1,Math.ceil(p*6))+' de 6',E.CSS.ui)}
      bar(defl,brk,col,cracks);return true}};
}});

/* ---------- 3.3 temperatura de boquilla ---------- */
const NZ={PLA:[190,220],PETG:[225,250],ABS:[230,260],TPU:[210,240]};
register('l3',{span:26,view:{pos:[4,18,44],target:[0,4,0],posP:[4,26,64],targetP:[0,6,0],min:24,max:140},build(E){
  const R=lineRig(E);let q={T:175,R:[190,220],m:'PLA'};
  E.chart((c,w,h)=>{const x0=12,x1=w-12,y=40,X=T=>x0+(T-170)/120*(x1-x0);c.font='700 11px "DM Sans",system-ui,sans-serif';c.fillStyle=E.CSS.pop;c.textAlign='center';c.fillText('ventana del '+q.m,(X(q.R[0])+X(q.R[1]))/2,24);
    c.fillStyle='rgba(169,180,204,.25)';c.fillRect(x0,y,x1-x0,8);c.fillStyle='rgba(134,217,181,.85)';c.fillRect(X(q.R[0]),y,X(q.R[1])-X(q.R[0]),8);c.fillStyle=E.CSS.ink;c.fillRect(X(q.T)-2,y-6,4,20);
    c.fillStyle=E.CSS.soft;c.font='500 11px "DM Mono",monospace';c.textAlign='left';c.fillText('170°',x0,y+30);c.textAlign='right';c.fillText('290°',x1,y+30);c.textAlign='center';c.fillStyle=E.CSS.ink;c.fillText(q.T+'°',X(q.T),y+30)});
  return {update(){const m=E.chip('mat3','m')||'PLA',T=E.val('tn3'),Rg=NZ[m],cold=Math.min(1,Math.max(0,(Rg[0]-T)/30)),hot=Math.min(1,Math.max(0,(T-Rg[1])/30));q={T,R:Rg,m};
      R.set({col:MC[m],thick:i=>1-cold*.55*rnd(i,1)+hot*.25*rnd(i,5),gap:i=>rnd(i,2)<cold*.55,blob:i=>rnd(i,3)<hot*.3?.5+rnd(i,4)*.6:0,strings:hot*.9});E.redraw();
      E.pill(cold>0?'fría: cordón cortado':hot>0?'caliente de más: chorrea':'cordón parejo',cold>0||hot>0?E.CSS.bad:E.CSS.pop)},tick:t=>R.tick(t)};
}});

/* ---------- 3.4 cama y contracción ---------- */
const BD={PLA:[45,65],PETG:[65,85],ABS:[90,110],TPU:[35,60]},KC={PLA:.15,PETG:.3,ABS:1,TPU:.1};
register('l4',{span:26,view:{pos:[14,20,42],target:[0,4,0],posP:[18,26,58],targetP:[0,5,0],min:22,max:130},build(E){
  const heaterM=new THREE.MeshStandardMaterial({color:0x9AA7C4,roughness:.4,metalness:.7,emissive:0xFF4A1D,emissiveIntensity:0}),heater=E.mesh(new THREE.BoxGeometry(34,2.2,20),heaterM);heater.position.y=-1.1;E.scene.add(heater);
  const geo=new THREE.BoxGeometry(22,7,12,28,7,8),base=geo.attributes.position.array.slice(),pm=new THREE.MeshStandardMaterial({color:0xFF9E70,roughness:.5}),piece=E.mesh(geo,pm);E.scene.add(piece);
  const enc=E.mesh(new THREE.BoxGeometry(38,17,24),new THREE.MeshStandardMaterial({color:0x86D9B5,transparent:true,opacity:.09,depthWrite:false,side:THREE.DoubleSide}),false);enc.position.y=7.2;E.scene.add(enc);
  const encE=new THREE.LineSegments(new THREE.EdgesGeometry(enc.geometry),new THREE.LineBasicMaterial({color:0x86D9B5,transparent:true,opacity:.6}));encE.position.copy(enc.position);E.scene.add(encE);
  const air=[];for(let k=0;k<7;k++){const l=E.line([[0,0,0],[2.4,0,0]]);l.material=new THREE.LineBasicMaterial({color:0x8FD3E8,transparent:true,opacity:.6});air.push(l)}
  let q={lift:0,foot:0},lift=0,foot=0;
  return {update(){const m=E.chip('mat4','m')||'PLA',T=E.val('tb4'),en=document.getElementById('enc4').checked,Rg=BD[m],K=KC[m],cold=T<Rg[0]?Math.min(1,(Rg[0]-T)/30+.35):0,lf=Math.min(1,K*.55*(en?0:1)+cold*(.45+K*.5));
      q={lift:lf<.2?0:lf,foot:T>Rg[1]+10?1:0,cold,en};pm.color.setHex(MC[m]);heaterM.emissiveIntensity=Math.max(0,(T-25)/100)*.75;enc.visible=encE.visible=en;air.forEach(l=>{l.visible=!en});
      E.label('t',[16,-1,10],T+' °C',E.CSS.ui);E.label('e',[0,12,-11],en?'aire quieto y tibio':'corriente de aire',en?E.CSS.pop:E.CSS.pri);
      E.pill(q.cold>0||q.lift>0?'esquinas levantadas':q.foot?'base ensanchada':'plana',q.cold>0||q.lift>0?E.CSS.bad:q.foot?E.CSS.ui:E.CSS.pop)},
    tick(t){lift+=(q.lift-lift)*.08;foot+=(q.foot-foot)*.08;const p=piece.geometry.attributes.position;
      for(let i=0;i<p.count;i++){let x=base[i*3],y=base[i*3+1],z=base[i*3+2];const b=(3.5-y)/7,ax=Math.abs(x)/11,az=Math.abs(z)/6;y+=3.5+lift*5.5*Math.pow(Math.max(ax,az),2)*Math.pow(b,1.4);const fl=1+foot*.1*Math.pow(b,3);p.setXYZ(i,x*fl,y,z*fl)}
      p.needsUpdate=true;piece.geometry.computeVertexNormals();air.forEach((l,k)=>{l.position.set(-24+((t*14+k*7)%48),2+k*1.5,8-k)});return true}};
}});

/* ---------- 3.5 humedad ---------- */
const RT={PLA:.006,PETG:.012,TPU:.025,Nylon:.04};
register('l5',{span:26,view:{pos:[4,18,44],target:[0,4,0],posP:[4,26,64],targetP:[0,6,0],min:24,max:140},build(E){
  const R=lineRig(E);let wet=0,tw=0,m='PLA',dry=0;
  const dryer=new THREE.Group();dryer.position.set(16,0,-5);E.scene.add(dryer);const db=E.mesh(new THREE.BoxGeometry(10,9,9),new THREE.MeshStandardMaterial({color:0x313C55,roughness:.5}));db.position.y=4.5;dryer.add(db);
  const dl=E.mesh(new THREE.BoxGeometry(6,1.4,.2),new THREE.MeshStandardMaterial({color:0xFFB95E,emissive:0xFFB95E,emissiveIntensity:0}),false);dl.position.set(0,6.8,4.6);dryer.add(dl);
  document.getElementById('dry5').addEventListener('click',()=>{dry=performance.now()});
  function apply(){R.set({col:MC[m],thick:i=>1+(rnd(i,1)-.5)*wet*.9,bubble:i=>rnd(i,2)<wet*.55,strings:wet*.85,pop:wet})}
  return {update(){m=E.chip('mat5','m')||'PLA';tw=Math.min(1,E.val('day5')*RT[m]);apply()},
    tick(t){const before=Math.round(wet*20);wet+=(tw-wet)*.05;if(Math.round(wet*20)!==before)apply();R.tick(t);
      const dr=dry>0&&performance.now()-dry<2600;dl.material.emissiveIntensity=dr?1:0;if(dr)E.label('d',[16,11,-5],'Secando: calor suave durante horas',E.CSS.ui);else E.unlabel('d');
      E.pill('Filamento de '+m+' · humedad '+(wet<.08?'nada':wet<.3?'poca':wet<.65?'bastante':'mucha'),wet<.3?E.CSS.pop:wet<.65?E.CSS.ui:E.CSS.bad);return true}};
}});

/* ---------- 3.6 refrigeración según el material ---------- */
register('l6',{span:26,view:{pos:[6,20,46],target:[0,7,0],posP:[8,28,66],targetP:[0,9,0],min:24,max:140},build(E){
  E.bed(50,18,{grid:5});const G=group(E),noz=E.nozzle(1.1),fan=E.fan(.7);
  const air=[];for(let k=0;k<6;k++){const l=E.line([[0,0,0],[-1.2,-.8,0]]);l.material=E.M.air.clone();air.push(l)}
  let q={fn:.1,sag:1,crack:0},m='PLA',P=-1;const xa=-11,xb=11,nl=8,DZ=6;
  function build(pr){clear(G);const col=MC[m],A=new THREE.MeshStandardMaterial({color:col,roughness:.5}),B=new THREE.MeshStandardMaterial({color:new THREE.Color(col).multiplyScalar(.88),roughness:.5});
    [xa,xb].forEach((x,si)=>{for(let k=0;k<nl;k++){const gp=q.crack*(k%2?.55:.2),lean=(si?1:-1)*q.crack*k*.12;G.add(E.bead(x+lean,-DZ/2,x+lean,DZ/2,k+gp*k*.35,4.8,1-gp*.5,k%2?B:A))}});
    const ty=nl+q.crack*.8,sg=q.sag*3.2;for(let k=0;k<3;k++){const done=k<2||pr>=1,x1=done?xb+2.4:xa-2.4+pr*(xb-xa+4.8);if(x1-(xa-2.4)<.3)continue;
      for(let z=-DZ/2+.8;z<=DZ/2-.8;z+=1.6){const pts=[];for(let i=0;i<=12;i++){const u=i/12,x=xa-2.4+(x1-(xa-2.4))*u,f=Math.min(1,(x1-xa)/(xb-xa)),dip=sg*(1+k*.15)*f;pts.push([x,ty+k*.9+.45-dip*4*u*(1-u),z])}G.add(E.tube(pts,.42,k%2?B:A,24))}}
    return ty}
  return {update(){m=E.chip('mat6','m')||'PLA';const fn=E.val('fan6')/100;q={fn,sag:m==='PLA'?Math.max(0,1-fn/.5):m==='PETG'?Math.max(0,1-fn/.25):Math.max(0,.45-fn),crack:m==='ABS'?Math.max(0,(fn-.4)/.6):m==='PETG'?Math.max(0,(fn-.7)/.3)*.5:0};P=-1;
      air.forEach(l=>{l.material.opacity=.15+fn*.6;l.visible=fn>.05});
      E.pill(q.sag>.1?'puente caído':q.crack>.05?(m==='ABS'?'capas separadas':'capas que pegan peor'):'bien',q.sag>.1||(q.crack>.05&&m==='ABS')?E.CSS.bad:q.crack>.05?E.CSS.ui:E.CSS.pop)},
    tick(t,dt){const p=(t*.3)%1.4,pr=Math.min(1,p),key=Math.round(pr*24);let ty=nl;if(key!==P){P=key;ty=build(pr)}else ty=nl+q.crack*.8;
      const hx=xa-2.4+pr*(xb-xa+4.8);noz.position.set(hx,ty+2*.9+.9,0);fan.g.position.set(hx+5,ty+6,0);fan.g.rotation.z=Math.PI/2.6;fan.spin(dt,q.fn);
      air.forEach((l,k)=>{const o=(t*6+k*.6)%3;l.position.set(hx+2.4-o,ty+4.4-o*.6,(k-2.5)*.8)});return true}};
}});

/* ---------- 3.7 materiales especiales: desgaste de la boquilla ---------- */
register('l7',{span:9,view:{pos:[3,13,19],target:[0.5,1.5,0],posP:[4,18,27],targetP:[0.5,2,0],min:6,max:50},build(E){
  const M=E.M,CUT=[new THREE.Plane(new THREE.Vector3(0,0,-1),0)];E.bed(26,12,{grid:1});
  const nz=new THREE.Group();nz.position.set(-6,3.2,0);E.scene.add(nz);const G=group(E),grit=group(E);let w=0,W=0,f=1,n=1,KEY='';
  for(let k=0;k<26;k++){const s=new THREE.Mesh(new THREE.SphereGeometry(.07,6,4),new THREE.MeshStandardMaterial({color:0x2F3A57}));s.userData.k=k;grit.add(s)}
  E.label('a',[-6,0,3],'Boquilla · en corte',E.CSS.soft);E.label('b',[3.5,0,3.4],'Lo que imprime · dientes cada 1,2 mm',E.CSS.soft);
  function build(){clear(nz);clear(G);const d=.4*(1+w*.9),sk=w*.35,steel=n<.5,mat=new THREE.MeshStandardMaterial({color:steel?0xC9D2E6:0xD9A441,roughness:.3,metalness:.95,clippingPlanes:CUT,side:THREE.DoubleSide});
    const outer=[[d/2+.02,0],[1.2,0],[1.7,1.6],[1.7,3.2],[d/2+.02,3.2]].map(p=>new THREE.Vector2(p[0],p[1]));nz.add(E.mesh(new THREE.LatheGeometry(outer,40),mat));
    const melt=E.mesh(new THREE.LatheGeometry([[.001,0],[d/2,0],[d/2,.35],[1.25,1.6],[1.25,3.2],[.001,3.2]].map(p=>new THREE.Vector2(p[0],p[1])),40),new THREE.MeshStandardMaterial({color:0xFFE9B8,emissive:0xFF9440,emissiveIntensity:.5,clippingPlanes:CUT,side:THREE.DoubleSide}),false);melt.position.x=sk*.3;nz.add(melt);
    const str=E.mesh(new THREE.CylinderGeometry(d/2+sk*.15,d/2+sk*.15,1.6,16),M.fil);str.position.set(sk*.3,-.8,0);nz.add(str);
    const ox=0;G.add(E.bead(ox-.4,3,ox+7.6,3,0,d,.6,M.fil));for(let k=0;k<7;k++){const x=ox+k*1.2;G.add(E.bead(x,3,x+rnd(k,5)*w*.3,-3,0,d,.6,M.fil))}
    E.label('d',[-6,-1.2,2.4],d.toFixed(2).replace('.',',')+' mm',w>.3?E.CSS.bad:E.CSS.ink)}
  return {update(){f=+(E.chip('fil7','f')||1);n=+(E.chip('noz7','n')||1);W=Math.min(1,f*n*E.val('kg7')/3);grit.visible=f>.1;
      E.pill(W<.05?'como nueva':W<.3?'algo gastada':W<.65?'gastada: se pierde detalle':'arruinada: hay que cambiarla',W<.05?E.CSS.pop:W<.3?E.CSS.ui:E.CSS.bad)},
    tick(t){w+=(W-w)*.1;const key=w.toFixed(2)+n;if(key!==KEY){KEY=key;build()}
      grit.children.forEach(s=>{const k=s.userData.k,py=(t*1.1+rnd(k,1))%1;s.position.set(-6-1+rnd(k,2)*2*(1-py*.6)+py*.6,3.2+3.2-py*3.2,-.05)});return true}};
}});
