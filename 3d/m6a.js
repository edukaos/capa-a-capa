/* Capa a Capa · escenas 3D del módulo 6, parte 1 (lecciones 6.2 a 6.5). La 6.1 (libreta de pruebas) queda en 2D. */
import {register,THREE} from '../cac3d.js';
const rnd=(i,k)=>{const x=Math.sin(i*127.1+k*311.7)*43758.5453;return x-Math.floor(x)};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function clear(g){while(g.children.length){const o=g.children.pop();o.traverse(x=>{if(x.geometry)x.geometry.dispose()})}}
function group(E){const g=new THREE.Group();E.scene.add(g);return g}
const chk=id=>{const e=document.getElementById(id);return !!(e&&e.checked)};

/* ---------- 6.2 la base: warping y pata de elefante ---------- */
register('l2',{span:30,view:{pos:[10,22,50],target:[0,4,0],posP:[12,30,70],targetP:[0,6,0],min:26,max:150},build(E){
  const M=E.M,heatM=new THREE.MeshStandardMaterial({color:0x9AA6C2,roughness:.4,metalness:.6,emissive:0xFF4A1D,emissiveIntensity:0}),bed=E.mesh(new THREE.BoxGeometry(58,2,24),heatM);bed.position.y=-1;E.scene.add(bed);
  const geo=new THREE.BoxGeometry(40,9,10,40,14,6),base=geo.attributes.position.array.slice(),piece=E.mesh(geo,E.layered(E.COL.fil,.64));E.scene.add(piece);
  const brim=E.mesh(new THREE.BoxGeometry(48,.3,16),M.fil2);brim.position.y=.15;E.scene.add(brim);const noz=E.nozzle(.6);
  const air=[];for(let k=0;k<5;k++){const pts=[];for(let i=0;i<=10;i++)pts.push([i*.9,Math.sin(i*.6)*.4,0]);const l=E.line(pts);l.material=new THREE.LineBasicMaterial({color:0xA9C8FF,transparent:true,opacity:.6});air.push(l)}
  let T={w:.9,f:.6},w=.9,f=.6,bedT=45;
  return {update(){bedT=+(E.chip('bed2','v')||45);const oz=E.chip('oz2','v')||'bajo',br=chk('brim2'),ai=chk('air2');
      T={w:clamp((bedT===45?.55:bedT===60?.12:0)+(ai?.5:0)-(br?.3:0),0,1),f:clamp((bedT===75?.55:0)+(oz==='bajo'?.6:0),0,1)};
      brim.visible=br;air.forEach(l=>{l.visible=ai});heatM.color.setHex(bedT===45?0x7E95C8:bedT===60?0x9AA6C2:0xD9947A);heatM.emissiveIntensity=bedT===75?.35:0;
      E.label('b',[26,-1.4,13],'Cama '+bedT+' °C',E.CSS.ui);if(ai)E.label('a',[-28,10,4],'aire frío',E.CSS.pri);else E.unlabel('a')},
    tick(t){w+=(T.w-w)*.05;f+=(T.f-f)*.05;const lift=Math.max(0,w-.15)*9*.65,ef=Math.max(0,f-.25)*.64*2.4,p=piece.geometry.attributes.position;
      for(let i=0;i<p.count;i++){let x=base[i*3],y=base[i*3+1],z=base[i*3+2];const u=x/20,h=y+4.5;y=h+lift*Math.pow(Math.abs(u),3);const fl=h<1.9?ef*(1-h/1.9):0;x+=Math.sign(x)*fl;z+=Math.sign(z)*fl*.6;p.setXYZ(i,x,y,z)}
      p.needsUpdate=true;piece.geometry.computeVertexNormals();const hx=Math.sin(t*.9)*20;noz.position.set(hx,9+lift*Math.pow(Math.abs(hx/20),3)+.1,0);
      air.forEach((l,k)=>{const ph=(t*.8+k*.21)%1;l.position.set(-32+ph*16,1.5+k*1.8,6-k);l.material.opacity=Math.sin(ph*Math.PI)*.7});
      const ok=w<=.2&&f<.3;E.pill(ok?'base plana':(w>.2?'esquinas levantadas':'')+(w>.2&&f>=.3?' · ':'')+(f>=.3?'pata de elefante':''),ok?E.CSS.pop:(w>.6||f>.6)?E.CSS.bad:E.CSS.ui);return true}};
}});

/* ---------- 6.3 huecos y clics: del rollo a la boquilla (el cold pull se calcula en la página) ---------- */
register('l3',{span:34,keep2d:true,view:{pos:[6,28,76],target:[2,14,0],posP:[8,36,104],targetP:[2,16,0],min:30,max:180},build(E){
  const M=E.M,CUT=[new THREE.Plane(new THREE.Vector3(0,0,-1),0)];E.bed(70,22,{grid:5});
  const spool=new THREE.Group();spool.position.set(-26,22,0);E.scene.add(spool);const sc=E.mesh(new THREE.CylinderGeometry(4.6,4.6,3.6,32),M.fil2);sc.rotation.x=Math.PI/2;spool.add(sc);
  [-2,2].forEach(z=>{const fl=E.mesh(new THREE.CylinderGeometry(5.6,5.6,.3,32),new THREE.MeshStandardMaterial({color:0x3A4766}));fl.rotation.x=Math.PI/2;fl.position.z=z;spool.add(fl)});
  const ext=new THREE.Group();ext.position.set(-10,24,0);E.scene.add(ext);const eb=E.mesh(new THREE.BoxGeometry(7,6,5),new THREE.MeshStandardMaterial({color:0x4E5D83,roughness:.5}));ext.add(eb);
  const gears=[-1,1].map(s=>{const g=E.mesh(new THREE.CylinderGeometry(1.4,1.4,5.2,11),M.steel);g.rotation.x=Math.PI/2;g.position.y=s*1.5;ext.add(g);return g});
  const filM=new THREE.MeshStandardMaterial({color:0xFF9E70,roughness:.5});E.scene.add(E.tube([[-26,26.4,0],[-18,29,0],[-13,24,0],[-10,24,0]],.3,filM,24));
  const hot=new THREE.Group();hot.position.set(12,10,0);E.scene.add(hot);E.scene.add(E.tube([[-6.5,24,0],[6,24,0],[12,20,0],[12,16.5,0]],.85,new THREE.MeshStandardMaterial({color:0xE4E8F3,transparent:true,opacity:.3,depthWrite:false}),30));
  const blk=E.mesh(new THREE.BoxGeometry(6,4,5),M.alu);blk.position.y=3.6;hot.add(blk);const hs=E.mesh(new THREE.CylinderGeometry(2.4,2.4,4,20),M.alu);hs.position.y=7.2;hot.add(hs);
  const nz=E.mesh(new THREE.ConeGeometry(1.2,2,16),M.brass);nz.rotation.x=Math.PI;nz.position.y=1;hot.add(nz);
  // la boquilla por dentro, grande y en corte
  const Z=new THREE.Group();Z.position.set(28,10,0);E.scene.add(Z);const brass=new THREE.MeshStandardMaterial({color:0xD9A441,roughness:.3,metalness:.95,clippingPlanes:CUT,side:THREE.DoubleSide});
  Z.add(E.mesh(new THREE.LatheGeometry([[1,0],[3,0],[5.5,5],[5.5,12],[1.9,12],[1.9,5],[.35,.6],[.35,0]].map(p=>new THREE.Vector2(p[0],p[1])),40),brass));
  const res=E.mesh(new THREE.SphereGeometry(1.1,16,10),new THREE.MeshStandardMaterial({color:0x5A3A2A,roughness:.8}));res.scale.set(1,.7,.15);res.position.set(0,4.6,.05);Z.add(res);
  const plug=new THREE.Group();Z.add(plug);const pf=E.mesh(new THREE.CylinderGeometry(1.8,1.8,10,16),new THREE.MeshStandardMaterial({color:0xFF9E70,roughness:.5,clippingPlanes:CUT,side:THREE.DoubleSide}));pf.position.y=10;plug.add(pf);
  const ptip=E.mesh(new THREE.ConeGeometry(1.8,4.4,16),pf.material);ptip.rotation.x=Math.PI;ptip.position.y=2.8;plug.add(ptip);const pdirt=res.clone();pdirt.position.set(0,3.6,.05);plug.add(pdirt);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(5,.3,10,40),new THREE.MeshBasicMaterial({color:0xFFB95E,transparent:true}));E.scene.add(ring);
  const W=group(E);let fixedK=null;
  E.label('z',[28,-1,6],'La boquilla por dentro',E.CSS.soft);E.label('s',[-26,15.5,0],'Bobina',E.CSS.soft);E.label('e',[-10,19.6,4],'Engranaje',E.CSS.soft);E.label('p',[3,26.6,0],'Tubo PTFE',E.CSS.soft);
  const CPS=['Calentar la boquilla','Empujar filamento a mano','Dejar enfriar: blando, no líquido','Tirar firme y de una','Sale con la forma de la punta y la suciedad'],POS={bobina:[-26,22,5],engranaje:[-10,24,4],ptfe:[6,24,2],temp:[12,13.6,3],boquilla:[12,11,3]};
  return {tick(t){const s=E.state('l3'),ok=!!s.fixed,jerk=ok?t*30:(Math.floor(t*2.2)+Math.min(1,(t*2.2%1)*3))*12;gears[0].rotation.y=jerk*.06;gears[1].rotation.y=-jerk*.06;spool.rotation.z=-jerk*.01;
      if(!ok&&Math.sin(t*9)>.75)E.label('c',[-10,29,0],'clic',E.CSS.bad);else E.unlabel('c');
      if(fixedK!==ok){fixedK=ok;clear(W);for(let i=0;i<6;i++)for(let k=0;k<12;k++){const gap=!ok&&rnd(i,k)<.3,thin=!ok&&rnd(k,i)<.45;if(gap)continue;W.add(E.bead(-2+k*2,-3,-.2+k*2,-3,i*.9,thin?.5:1,thin?.5:.85,i%2?M.fil2:M.fil))}W.position.set(-4,0,0)}
      const a=s.hl&&POS[s.hl]?Math.max(0,1-(performance.now()-s.hlt)/2500):0;ring.visible=a>0;if(a>0){ring.position.fromArray(POS[s.hl]);ring.material.opacity=a;ring.lookAt(E.scene.position.clone().set(POS[s.hl][0],POS[s.hl][1],60))}
      const cp=s.cp==null?-1:s.cp,e2=cp>=0?(performance.now()-s.t0)/1600:0,pull=cp>=3?Math.min(1,(e2-3)/.6):0;plug.visible=cp>=1||ok;plug.position.y=pull*9;res.visible=!ok&&cp<3;
      pf.material.color.setHex(cp>=2?0xE3B89A:0xFF9E70);
      if(cp>=0)E.label('cp',[28,25,0],(Math.min(4,cp)+1)+'. '+CPS[Math.min(4,cp)],cp>=4?E.CSS.pop:E.CSS.ui);else E.unlabel('cp');
      E.pill(ok?'pared pareja':'huecos y capas finas',ok?E.CSS.pop:E.CSS.bad);return true}};
}});

/* ---------- 6.4 movimiento: torre de prueba ---------- */
register('l4',{span:22,view:{pos:[12,22,56],target:[0,12,0],posP:[14,28,74],targetP:[0,14,0],min:22,max:130},build(E){
  const M=E.M;E.bed(40,22,{grid:5});const G=group(E),noz=E.nozzle(.55);let key='',sh=0,top=22;
  return {update(){const belt=E.chip('belt4','v')||'floja',rod=E.chip('rod4','v')||'torcida',acc=E.val('acc4'),k2=belt+rod+acc;if(k2===key)return;key=k2;clear(G);
      const nl=44,lh=.5,shiftAt=Math.round(nl*.55),W=16,D=10,ra=clamp((acc-2500)/2500,0,1),band=rod==='torcida';sh=belt==='floja'?W*.09:0;
      const dk=new THREE.MeshStandardMaterial({color:0xC97A55,roughness:.55});
      for(let i=0;i<nl;i++){const sn=Math.sin(i/nl*Math.PI*2*6),dx=(i>=shiftAt?sh:0)+(band?sn*.25:0),bd=band&&sn>.82,m=E.mesh(new THREE.BoxGeometry(W,lh*.98,D),bd?dk:(i%2?M.fil2:M.fil));m.position.set(dx,i*lh+lh/2,0);G.add(m)}
      const q=new THREE.Group();q.position.set(-3.5,6.4,D/2+.2);G.add(q);const tq=E.mesh(new THREE.TorusGeometry(2,.5,10,32),M.lip);q.add(tq);const tl=E.mesh(new THREE.BoxGeometry(.9,2,.9),M.lip);tl.position.set(1.4,-1.8,0);tl.rotation.z=.7;q.add(tl);
      if(ra>0)for(let k=1;k<=4;k++){const g2=q.clone();g2.traverse(o=>{if(o.isMesh){o.material=new THREE.MeshStandardMaterial({color:0xEE8455,transparent:true,opacity:ra*.45/k});o.castShadow=false}});g2.position.x+=k*1.3;g2.position.z-=.05;G.add(g2)}
      top=nl*lh;['s','b','o'].forEach(k=>E.unlabel(k));if(sh)E.label('s',[W/2+sh+3,shiftAt*lh,0],'capas corridas',E.CSS.bad);if(band)E.label('b',[-W/2-4,top*.75,0],'bandas',E.CSS.ui);if(ra>0)E.label('o',[3,10,D/2],'ondas',ra>.5?E.CSS.bad:E.CSS.ui);
      const ok=!sh&&!band&&ra===0;E.pill(ok?'torre limpia':'revisá la torre',ok?E.CSS.pop:E.CSS.ui)},
    tick(t){noz.position.set(sh+Math.sin(t*1.4)*8,top+.1,0);return true}};
}});

/* ---------- 6.5 capas y techo ---------- */
register('l5',{span:30,view:{pos:[38,40,50],target:[0,6,0],posP:[44,50,62],targetP:[0,8,0],min:28,max:150},build(E){
  const M=E.M,CUT=[new THREE.Plane(new THREE.Vector3(-1,0,-1).normalize(),5)],D=THREE.DoubleSide;E.bed(60,60,{grid:10});
  const mk=c=>new THREE.MeshStandardMaterial({color:c,roughness:.5,clippingPlanes:CUT,side:D}),A=mk(E.COL.fil),B=mk(E.COL.fil2),crackM=mk(0x141B2B);
  const W=30,LH=.7,NL=12,I=W/2-1.4;const G=group(E),noz=E.nozzle(.6),fan=E.fan(.8);let key='',topY=NL*LH,F=100;
  const seg=[];for(let k=-I+2.5;k<I;k+=5)seg.push([k,-I,k,I],[-I,k,I,k]);E.scene.add(E.ribbons([[0,NL*LH,seg]],.45,B));
  return {update(){const T=E.val('t5');F=E.val('f5');const K=E.val('k5'),k2=[T,F,K].join();if(k2===key)return;key=k2;clear(G);
      const cr=Math.max(0,(205-T)/20)+Math.max(0,(F-80)/40),pl=(K<4?(4-K)*.3:0)+(F<40?(40-F)/60:0),ho=K<=2?.8:K===3?.3:0;
      for(let i=0;i<NL;i++){const crack=cr>0&&rnd(i,3)<cr*.45&&i>1;G.add(E.shell(W,W,2.4,1.4,LH*(crack?.62:.96),i%2?B:A,i*LH));if(crack)G.add(E.shell(W+.2,W+.2,2.4,1.6,LH*.3,crackM,i*LH+LH*.64))}
      for(let i=0;i<K;i++){const y=NL*LH+i*LH,last=i===K-1;for(let c=-I+.4;c<I;c+=.85){if(last&&ho>0&&rnd(Math.floor((c+I)/2.2),i+K)<ho*.5)continue;const g=new THREE.PlaneGeometry(2*I,.8,40,1);g.rotateX(-Math.PI/2);const p=g.attributes.position;
          for(let v=0;v<p.count;v++){const x=p.getX(v),u=(((x+I)%5)+5)%5/5;p.setY(v,y+LH-pl*LH*1.4*Math.sin(u*Math.PI)*(last?-1:-.6)+(i===0&&ho>0?Math.sin(u*Math.PI)*LH*.6:0))}g.computeVertexNormals();const o=E.mesh(g,i%2?A:B);if(i%2){o.rotation.y=Math.PI/2;o.position.x=c}else o.position.z=c;G.add(o)}}
      topY=NL*LH+K*LH+pl*LH*1.4;['c'].forEach(k=>E.unlabel(k));if(cr>0)E.label('c',[W/2,NL*LH*.5,W/2-6],'grietas entre capas',cr>.6?E.CSS.bad:E.CSS.ui);
      E.label('t',[-W/2,2,W/2+3],T+' °C · ventilador '+F+' %',E.CSS.soft);E.pill(ho>0?'techo con huecos':pl>0?'techo inflado':'techo cerrado',ho>0||pl>0?(ho>.6?E.CSS.bad:E.CSS.ui):E.CSS.pop)},
    tick(t,dt){const px=Math.sin(t*1.1)*12;noz.position.set(px,topY+.1,0);fan.g.position.set(px+7,topY+5,0);fan.g.rotation.z=Math.PI/2.4;fan.spin(dt,F/100);return true}};
}});
