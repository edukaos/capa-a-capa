/* Capa a Capa · escenas 3D del módulo 4, parte 1 (lecciones 4.1 y 4.3 a 4.6). */
import {register,THREE,benchyIslands} from '../cac3d.js';
const num=(v,d)=>v.toFixed(d==null?1:d).replace('.',',');
function clear(g){while(g.children.length){const o=g.children.pop();o.traverse(x=>{if(x.geometry)x.geometry.dispose()})}}
function group(E){const g=new THREE.Group();E.scene.add(g);return g}
const KB=20/48;
function steps(h,top){const b=[0];let z=0;while(z<top-1e-6){z=Math.min(top,z+h);b.push(z)}return b}

/* ---------- 4.1 qué hace el laminador: Benchy cortado a una altura ---------- */
register('l1',{span:40,view:{pos:[66,50,72],target:[0,20,0],posP:[78,64,92],targetP:[0,22,0],min:50,max:220},build(E){
  const M=E.M;E.bed(96,56,{grid:10});const b=steps(.5,48),B=E.benchy(b,1,(i)=>i%2?M.fil2:M.fil);
  const ghostM=new THREE.MeshStandardMaterial({color:0xB9C2D8,transparent:true,opacity:.12,depthWrite:false,roughness:.6});
  const G=E.benchy(steps(2,48),1,()=>ghostM);G.meshes.forEach(o=>{o.castShadow=false;o.receiveShadow=false});
  const plane=new THREE.Mesh(new THREE.PlaneGeometry(76,44),new THREE.MeshBasicMaterial({color:0xFFB95E,transparent:true,opacity:.1,side:THREE.DoubleSide,depthWrite:false}));plane.rotation.x=-Math.PI/2;E.scene.add(plane);
  const S=group(E),dots=[];let isl=[];
  return {update(){const y=E.val('cut1');B.show(Math.floor(y/.5));plane.position.y=y+.02;clear(S);dots.length=0;
      isl=benchyIslands(y,1).map(p=>p.map(q=>new THREE.Vector3(q[0],y+.1,q[1])));
      isl.forEach(pts=>{const c=new THREE.CatmullRomCurve3(pts,true,'centripetal');S.add(E.mesh(new THREE.TubeGeometry(c,120,.45,6,true),new THREE.MeshStandardMaterial({color:0xFFB95E,emissive:0x8A5200,emissiveIntensity:.6,roughness:.4}),false));
        let x0=Infinity,x1=-Infinity;pts.forEach(p=>{x0=Math.min(x0,p.x);x1=Math.max(x1,p.x)});const hp=[];
        for(let x=Math.ceil(x0/2.2)*2.2;x<x1-.5;x+=2.2){let zm=0;pts.forEach(p=>{if(Math.abs(p.x-x)<1.4)zm=Math.max(zm,Math.abs(p.z))});zm-=.9;if(zm>.4)hp.push(x,y+.06,-zm,x,y+.06,zm)}
        const hg=new THREE.BufferGeometry();hg.setAttribute('position',new THREE.Float32BufferAttribute(hp,3));S.add(new THREE.LineSegments(hg,new THREE.LineBasicMaterial({color:0xFF9E70,transparent:true,opacity:.75})));
        const d=new THREE.Mesh(new THREE.SphereGeometry(.9,16,12),new THREE.MeshBasicMaterial({color:0xFFE3A3}));d.userData.c=c;S.add(d);dots.push(d)});
      E.label('c',[-34,y,0],'capa '+Math.max(1,Math.round(y/.2))+' de 240',E.CSS.ui);
      E.pill(isl.length===1?'1 isla':isl.length+' islas',isl.length>1?E.CSS.pop:E.CSS.ink)},
    tick(t){dots.forEach((d,i)=>{d.position.copy(d.userData.c.getPointAt((t*.12+i*.37)%1))});return dots.length>0}};
}});

/* ---------- 4.3 tipos de archivo: el mismo barquito según lo que guarda cada formato ---------- */
register('l3',{span:34,view:{pos:[70,48,78],target:[0,20,0],posP:[88,62,100],targetP:[0,22,0],min:45,max:200},build(E){
  const M=E.M;E.bed(84,50,{grid:10});const G=group(E),cache={};let F=null,gc=null,noz=null;
  const mint=new THREE.MeshStandardMaterial({color:0x86D9B5,roughness:.6,flatShading:true}),mint2=new THREE.MeshStandardMaterial({color:0x6CC7A0,roughness:.6,flatShading:true});
  const steel=new THREE.MeshStandardMaterial({color:0xAEB9D4,roughness:.25,metalness:.85}),red=new THREE.MeshStandardMaterial({color:0xE57C7C,roughness:.55}),cream=new THREE.MeshStandardMaterial({color:0xF4E3B1,roughness:.55});
  function make(f){if(f==='stl'){const B=E.benchy(steps(3,48),1,(i)=>i%2?mint2:mint);B.meshes.forEach(o=>{const w=new THREE.LineSegments(new THREE.WireframeGeometry(o.geometry),new THREE.LineBasicMaterial({color:0x0B3324,transparent:true,opacity:.35}));B.g.add(w)});return B}
    if(f==='3mf')return E.benchy(steps(1,48),1,(i)=>i%2?M.fil2:M.fil);
    if(f==='step')return E.benchy(steps(.5,48),1,()=>steel);
    if(f==='obj')return E.benchy(steps(2,48),1,(i,z0)=>z0<15?red:cream);
    // G-code: solo recorridos, como líneas que se van dibujando
    const g=new THREE.Group(),lines=[];for(let z=.4;z<48;z+=1.2){benchyIslands(z,1).forEach(p=>{const pts=p.map(q=>new THREE.Vector3(q[0],z,q[1]));pts.push(pts[0].clone());
      const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:z%2.4<1.2?0xFF9E70:0xFFB95E}));g.add(l);lines.push(l)})}
    E.scene.add(g);return {g,lines,show(){},dispose(){E.scene.remove(g)}}}
  noz=E.nozzle(1.2);noz.visible=false;
  return {update(){const f=E.chip('fmt3','f')||'stl';if(f===F)return;F=f;for(const k in cache)cache[k].g.visible=false;(cache[f]||(cache[f]=make(f))).g.visible=true;clear(G);
      ['a','b','c','h'].forEach(k=>E.unlabel(k));noz.visible=f==='gcode';gc=f==='gcode'?cache[f]:null;
      if(f==='stl')E.pill('triángulos, sin medidas',E.CSS.ink);
      else if(f==='3mf'){E.pill('60 × 31 × 48 mm',E.CSS.pop);E.label('a',[0,52,0],'PLA · capa 0,20 · relleno 15 %',E.CSS.ui);E.label('b',[0,-1,24],'posición en la cama guardada',E.CSS.ui)}
      else if(f==='step'){E.pill('medidas exactas, editable',E.CSS.ui);G.add(E.line([[-30,0,20],[30,0,20]]));G.add(E.line([[-30,0,18.5],[-30,0,21.5]]));G.add(E.line([[30,0,18.5],[30,0,21.5]]));
        G.add(E.line([[34,0,0],[34,48,0]]));G.add(E.line([[32.5,48,0],[35.5,48,0]]));G.add(E.line([[32.5,0,0],[35.5,0,0]]));E.label('a',[0,0,23],'60 mm',E.CSS.ui);E.label('h',[38,24,0],'48 mm',E.CSS.ui)}
      else if(f==='obj')E.pill('con color o textura',E.CSS.ink);
      else E.pill('instrucciones, no una forma',E.CSS.ui)},
    tick(t){if(!gc)return false;const n=gc.lines.length,k=(t*.09)%1,c=Math.floor(k*n);gc.lines.forEach((l,i)=>{l.visible=i<=c});
      const l=gc.lines[Math.min(n-1,c)],p=l.geometry.attributes.position,j=Math.floor(((t*1.4)%1)*(p.count-1));noz.position.set(p.getX(j),p.getY(j)+.3,p.getZ(j));return true}};
}});

/* ---------- 4.4 orientación: un gancho impreso de tres formas y probado con carga ---------- */
/* La prueba de carga corre en la página (el 2D sigue oculto); acá se lee su estado. */
register('l4',{span:34,keep2d:true,view:{pos:[6,30,62],target:[2,8,0],posP:[8,40,84],targetP:[2,10,0],min:34,max:180},build(E){
  const M=E.M;E.bed(80,30,{grid:10});const P=group(E),U=group(E);
  const RECT=[[0,0,3,16],[3,4,9,3],[9,7,3,4]],DZ=6,TH=.55,supM=E.M.sup;
  const wall=E.mesh(new THREE.BoxGeometry(2.4,26,14),new THREE.MeshStandardMaterial({color:0x3A4766,roughness:.8}));wall.position.set(14-1.2,13,0);E.scene.add(wall);
  // capas: cortes horizontales en la orientación de impresión; rot lleva del uso a la impresión
  const ROT={parado:new THREE.Euler(0,0,0),placa:new THREE.Euler(0,0,Math.PI/2),acostado:new THREE.Euler(-Math.PI/2,0,0)};
  function hook(o){const g=new THREE.Group(),q=new THREE.Quaternion().setFromEuler(ROT[o]),parts=[new THREE.Group(),new THREE.Group(),new THREE.Group()];
    // en la orientación de impresión, la altura es el eje Y: se corta cada rectángulo en láminas de TH
    RECT.forEach((r,ri)=>{const bx=new THREE.Box3(new THREE.Vector3(r[0],r[1],0),new THREE.Vector3(r[0]+r[2],r[1]+r[3],DZ)),pb=bx.clone().applyMatrix4(new THREE.Matrix4().makeRotationFromQuaternion(q));
      let li=0;for(let y=Math.floor(pb.min.y/TH)*TH;y<pb.max.y-1e-4;y+=TH,li++){const y0=Math.max(y,pb.min.y),y1=Math.min(y+TH,pb.max.y);if(y1-y0<.05)continue;
        const sz=new THREE.Vector3(pb.max.x-pb.min.x,y1-y0,pb.max.z-pb.min.z),m=E.mesh(new THREE.BoxGeometry(sz.x,sz.y*.96,sz.z),(Math.round(y/TH))%2?M.fil2:M.fil);
        m.position.set((pb.min.x+pb.max.x)/2,(y0+y1)/2,(pb.min.z+pb.max.z)/2);m.position.applyQuaternion(q.clone().invert());m.quaternion.copy(q.clone().invert());parts[ri].add(m)}});
    parts.forEach(p=>g.add(p));g.userData.parts=parts;return g}
  let O=null,use=null,load=null,rope=null;
  return {update(){const o=E.chip('ori4','o')||'parado';if(o===O)return;O=o;clear(P);clear(U);
      // impresión, sobre la cama
      const h=hook(o),pr=new THREE.Group();pr.add(h);h.quaternion.setFromEuler(ROT[o]);P.add(pr);const bb=new THREE.Box3().setFromObject(pr);pr.position.set(-18-(bb.min.x+bb.max.x)/2,-bb.min.y,-(bb.min.z+bb.max.z)/2);
      const sup=(x0,y0,x1,y1,z0,z1)=>{const m=E.mesh(new THREE.BoxGeometry(x1-x0,y1-y0,z1-z0),supM);m.position.set((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);P.add(m)};
      const b2=new THREE.Box3().setFromObject(pr);
      if(o==='parado'){const ox=pr.position.x;sup(ox+3.1,0,ox+12,4,b2.min.z,b2.max.z);sup(ox+9.1,0,ox+12,7,b2.min.z+.2,b2.max.z-.2)}
      if(o==='placa'){const ox=pr.position.x;sup(ox-11+.1,3,ox-7,9,b2.min.z,b2.max.z)}
      E.label('p',[-18,-1,12],'Así se imprime',E.CSS.soft);E.label('u',[8,-1,12],'Así se usa',E.CSS.soft);
      // en uso, colgado de la pared
      use=hook(o);use.rotation.y=Math.PI;use.position.set(14-2.4,4,DZ/2);U.add(use);
      rope=E.line([[0,0,0],[0,-4,0]]);U.add(rope);load=E.mesh(new THREE.BoxGeometry(1,1,1),E.M.steel);U.add(load);
      const dir=o==='parado'?'capas horizontales':o==='placa'?'capas verticales: cruzan el brazo':'capas de frente: ninguna cruza el brazo';
      E.pill(dir,o==='placa'?E.CSS.bad:o==='acostado'?E.CSS.pop:E.CSS.ink)},
    tick(){if(!use)return false;const s=E.state('l4'),f=s.brk>0?Math.min(1.6,s.brk):0,dy=f*f*9,p=use.userData.parts;
      p[1].position.set(0,0,0);p[1].rotation.set(0,0,0);p[2].position.set(0,0,0);p[2].rotation.set(0,0,0);
      if(f&&O==='placa'){p[1].position.y=-dy;p[1].rotation.z=-f*.5;p[2].position.y=-dy;p[2].rotation.z=-f*.6}
      if(f&&O==='parado'){p[2].position.set(f*2,-dy,0);p[2].rotation.z=-f*.6}
      const lx=14-2.4-7.5,ly=4+7-(f&&O==='placa'?dy:0),sz=1.6+(s.load||0)/100*2.4;rope.position.set(lx,ly,DZ/2);load.scale.set(sz,sz,sz);load.position.set(lx,ly-4-sz/2,DZ/2);
      E.label('w',[lx,ly-4-sz/2,DZ/2+sz/2+.3],Math.round(s.load||0)+' %',E.CSS.ink);return true}};
}});

/* ---------- 4.5 altura de capa: Benchy de 20 mm con capas de la altura elegida ---------- */
register('l5',{span:16,view:{pos:[25,15,30],target:[2,8.5,0],posP:[32,20,40],targetP:[2,9.5,0],min:12,max:90},build(E){
  const M=E.M;E.bed(40,24,{grid:5});let B=null,H=-1;
  return {update(){const h=E.val('h5');if(h===H)return;H=h;if(B)B.dispose();B=E.benchy(steps(h,20),KB,(i)=>i%2?M.fil2:M.fil);
      const n=Math.ceil(20/h-1e-6);E.label('h',[-14,20,0],num(h,2)+' mm · '+n+' capas',E.CSS.ui);E.label('p',[12.5,4,7],'la proa: acá se ve el escalón',E.CSS.soft);
      E.pill(h<=.121?'escalón casi invisible':h<=.22?'escalón suave':'escalón marcado',h<=.121?E.CSS.pop:h<=.22?E.CSS.ui:E.CSS.bad)}};
}});

/* ---------- 4.6 altura de capa variable ---------- */
register('l6',{span:16,view:{pos:[25,15,30],target:[2,8.5,0],posP:[32,20,40],targetP:[2,9.5,0],min:12,max:90},build(E){
  const M=E.M;E.bed(40,24,{grid:5});let B=null,MD=null;
  const g1=new THREE.MeshStandardMaterial({color:0xF2C56B,roughness:.5}),g2=new THREE.MeshStandardMaterial({color:0xE8B25A,roughness:.5});
  return {update(){const m=E.chip('mode6','m')||'gruesa';if(m===MD)return;MD=m;if(B)B.dispose();
      const b=[0];let z=0;while(z<20-1e-6){const hh=m==='fina'?.1:m==='gruesa'?.28:(z<8.2-1e-6?.1:.28);z=Math.min(20,z+hh);b.push(z)}
      B=E.benchy(b,KB,(i,z0,z1)=>z1-z0<.2?(i%2?M.fil2:M.fil):(i%2?g2:g1));
      E.label('a',[-14,4,0],'naranja: capa fina 0,10',E.CSS.ui);E.label('b',[-14,14,0],'amarillo: capa gruesa 0,28',E.CSS.soft);
      E.pill(m==='var'?'fina en la proa, gruesa en la cabina':m==='fina'?'todo fino: lento':'todo grueso: proa escalonada',m==='var'?E.CSS.pop:E.CSS.ui)}};
}});
