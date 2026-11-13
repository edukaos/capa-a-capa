/* Capa a Capa · escenas 3D del módulo 4, parte 2 (lecciones 4.7 a 4.12). Los controles, mensajes y retos siguen en la página; acá solo se dibuja. */
import {register,THREE} from '../cac3d.js';
const num=(v,d)=>v.toFixed(d).replace('.',',');
function clear(g){while(g.children.length){const o=g.children.pop();o.traverse(x=>{if(x.geometry)x.geometry.dispose()})}}
function group(E){const g=new THREE.Group();E.scene.add(g);return g}

/* ---------- 4.7 ancho de línea ---------- */
register('l1',{span:9,view:{pos:[6,9.5,13],target:[1.2,.6,0],posP:[7,13,19],targetP:[1.2,1.2,0],min:6,max:40},build(E){
  const M=E.M;E.bed(18,10,{grid:1});
  const noz=E.nozzle(.38);const G=group(E);
  E.label('t1',[-2.4,0,4],'Líneas en corte · boquilla de 0,4 mm',E.CSS.soft);E.label('t2',[4.6,0,3.6],'Texto de 2,6 mm y rayas cada 0,6 mm',E.CSS.soft);
  function stroke(pts,lw){const c=new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(p[0],0,p[1])));const g=new THREE.TubeGeometry(c,Math.max(6,pts.length*3),lw/2,10,false);g.scale(1,.6/lw,1);g.translate(0,.3,0);G.add(E.mesh(g,M.fil))}
  function arc(cx,cz,r,a0,a1){const p=[];for(let i=0;i<=16;i++){const a=a0+(a1-a0)*i/16;p.push([cx+r*Math.cos(a),cz+r*Math.sin(a)])}return p}
  return {update(){clear(G);const lw=E.val('lw1'),cx=-2.4,pitch=lw*.94,lh=.2;
    for(let r=0;r<3;r++)for(let k=-6;k<7;k++){const x=cx+(k+(r%2?.5:0))*pitch;if(Math.abs(x-cx)>1.5)continue;G.add(E.bead(x,-2,x,2,r*lh,lw,lh,(k+r)%2?M.fil2:M.fil))}
    noz.position.set(cx,3*lh+.9,0);
    G.add(E.line([[cx-lw/2,0,2.4],[cx+lw/2,0,2.4]]));G.add(E.line([[cx-lw/2,0,2.2],[cx-lw/2,0,2.6]]));G.add(E.line([[cx+lw/2,0,2.2],[cx+lw/2,0,2.6]]));
    E.label('lw',[cx,0,2.95],num(lw,2)+' mm',E.CSS.ui);
    const tx=5,H=2.6,o=(p)=>p.map(q=>[q[0]+tx,q[1]]);
    stroke(o(arc(-1.9,-H/4,H/4,-Math.PI*.8,Math.PI/2)),lw);stroke(o(arc(-1.9,H/4,H/4,-Math.PI/2,Math.PI*.8)),lw);
    stroke(o([[-.2,H/2],[-.2,-H/2],[.5,-H/2]].concat(arc(.5,0,H/2,-Math.PI/2,Math.PI/2)).concat([[-.2,H/2]])),lw);
    for(let k=0;k<4;k++){const x=-2.4+k*.62;stroke(o([[x,H/2+.5],[x,H/2+.9],[x,H/2+1.3]]),lw)}
    stroke(o([[-.2,H/2+.9],[1.1,H/2+.9],[2.4,H/2+.9]]),lw);
    E.pill(lw<.38?'línea fina: poca unión':lw<=.46?'buen detalle y buena unión':lw<=.56?'el texto empieza a empastarse':'el texto se cierra',lw>=.4-1e-6&&lw<=.45+1e-6?E.CSS.pop:lw>.56?E.CSS.bad:E.CSS.ui);E.need()}};
}});

/* ---------- 4.8 paredes ---------- */
register('l2',{span:30,view:{pos:[0,46,46],target:[0,3,0],posP:[0,62,72],targetP:[0,5,0],min:30,max:150},build(E){
  const M=E.M;E.bed(74,34,{grid:10});const G=group(E),P=group(E);
  const W=16,HT=8,WP=.62,lm=[E.layered(E.COL.fil,.5),E.layered(E.COL.fil2,.5)];
  const base=E.mesh(new THREE.BoxGeometry(18,1.2,14),M.dark);base.position.set(15,.6,0);P.add(base);
  const piece=new THREE.Group();piece.position.set(15,1.2,0);P.add(piece);const body=E.slab(10,10,1.6,9,lm[0]);piece.add(body);
  const crack=E.mesh(new THREE.BoxGeometry(.25,4,.1),new THREE.MeshStandardMaterial({color:0x3A2418}),false);crack.position.set(-1,6,5.05);crack.rotation.z=.4;piece.add(crack);
  const plate=E.mesh(new THREE.BoxGeometry(16,2.2,12),M.steel);P.add(plate);const rod=E.mesh(new THREE.CylinderGeometry(1,1,30,16),M.steel);P.add(rod);
  E.label('a',[-15,0,10.5],'La pieza cortada, desde arriba',E.CSS.soft);E.label('b',[15,0,10.5],'La misma fuerza, apretando',E.CSS.soft);
  let n=2;
  return {update(){n=E.val('w2');clear(G);
    for(let k=0;k<n;k++){const w=W-2*k*WP;G.add(E.shell(w,w,Math.max(.4,2.2-k*WP),WP,HT,lm[k%2]))}
    G.add(E.slab(W-.02,W-.02,2.2,.8,M.fil2));
    const I=W/2-n*WP-.05,seg=[];for(let d=-24;d<24;d+=2.1){[[d-10,-10,d+10,10],[d-10,10,d+10,-10]].forEach(s=>{const c=E.clipSeg(s[0],s[1],s[2],s[3],-I,-I,I,I);if(c)seg.push(c)})}
    G.add(E.ribbons([[.8,HT,seg]],.35,M.fil2D));G.position.x=-15;
    E.label('c',[-15,0,-10.5],n+(n===1?' pared':' paredes')+' · cáscara de '+num(n*.45,2)+' mm',E.CSS.ui);
    E.pill(n===1?'se aplasta':n<=2?'se deforma':n===3?'cede un poco':'casi no se mueve',n>=4?E.CSS.pop:n===1?E.CSS.bad:E.CSS.ui)},
  tick(t){const sq=(1/n)*(.5+.5*Math.sin(t*1.8)),sy=1-.34*sq,sx=1+.2*sq;body.scale.set(sx,sy,sx);crack.visible=n===1&&sq>.6;crack.position.y=6*sy;
    const top=1.2+9*sy;plate.position.set(15,top+1.1,0);rod.position.set(15,top+2.2+15,0);return true}};
}});

/* ---------- 4.9 capas superiores e inferiores ---------- */
register('l3',{span:30,view:{pos:[38,46,50],target:[0,6,0],posP:[44,54,60],targetP:[0,8,0],min:28,max:150},build(E){
  const M=E.M,CUT=[new THREE.Plane(new THREE.Vector3(-1,0,-1).normalize(),6)],D=THREE.DoubleSide;
  const mk=(c,extra)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.5,clippingPlanes:CUT,side:D},extra||{}));
  const wallM=E.layered(E.COL.fil,.7,{clippingPlanes:CUT,side:D}),aM=mk(E.COL.fil),bM=mk(E.COL.fil2),inM=mk(E.COL.fil2,{transparent:true,opacity:.85});
  E.bed(60,60,{grid:10});const G=group(E);
  const W=30,LH=.7,FL=3*LH,IH=7,SPAN=5,TOP=FL+IH,U=LH/.8;
  // piso e relleno (fijos)
  E.scene.add(E.slab(W-.02,W-.02,2.5,FL,aM));
  const I=W/2-1.2,seg=[];for(let k=-I+SPAN/2;k<I;k+=SPAN){seg.push([k,-I,k,I],[-I,k,I,k])}
  E.scene.add(E.ribbons([[FL,TOP,seg]],.5,inM));
  function strip(i,c,alongX,w){const len=2*I,g=new THREE.PlaneGeometry(len,w,64,1);g.rotateX(-Math.PI/2);const p=g.attributes.position,a=1.9*U*Math.pow(.5,i);
    for(let v=0;v<p.count;v++){const x=p.getX(v),m=((x+I)%SPAN)/SPAN;p.setY(v,TOP+(i+1)*LH-a*(1-Math.cos(2*Math.PI*m))/2)}g.computeVertexNormals();
    const o=E.mesh(g,i%2?bM:aM);if(alongX)o.position.z=c;else{o.rotation.y=Math.PI/2;o.position.x=c}return o}
  return {update(){const n=E.val('t3');clear(G);
    G.add(E.shell(W,W,2.5,1.2,TOP+n*LH-FL,wallM,FL));
    for(let i=0;i<n;i++){const a=1.9*U*Math.pow(.5,i),pit=LH*1.25,gap=a>.9*U,w=gap?pit*.5:pit*1.02;for(let c=-I+pit/2;c<I;c+=pit)G.add(strip(i,c,i%2===0,w))}
    E.label('t',[-W/2,TOP+n*LH+1.6,-W/2],'techo · '+n+(n===1?' capa':' capas'),E.CSS.ui);E.label('r',[W/2-2,FL+IH/2,W/2-12],'relleno 15 %',E.CSS.soft);E.label('p',[W/2+2,FL/2,W/2-14],'piso · 3 capas',E.CSS.soft);
    E.pill(n<=2?'tapa con huecos':n<=4?'tapa ondulada':'tapa lisa',n>=5?E.CSS.pop:n<=2?E.CSS.bad:E.CSS.ui)}};
}});

/* ---------- 4.10 relleno ---------- */
register('l4',{span:45,view:{pos:[50,62,64],target:[0,4,0],targetP:[0,7,0],min:44,max:160},build(E){
  const W=40,HH=16,WALL=1,FLOOR=1.2,IN=W/2-WALL-.06,TH=.45,MOB=E.MOB;
  const CUT=[new THREE.Plane(new THREE.Vector3(-1,0,-1).normalize(),9)],D=THREE.DoubleSide;
  E.bed(84,84,{grid:10});
  E.scene.add(E.shell(W,W,3,WALL,HH,E.layered(E.COL.fil,.4,{clippingPlanes:CUT,side:D})));
  E.scene.add(E.slab(W-2*WALL+.02,W-2*WALL+.02,2.3,FLOOR,new THREE.MeshStandardMaterial({color:E.COL.fil,roughness:.55,clippingPlanes:CUT,side:D})));
  const lip=E.shell(W,W,3,WALL,.25,new THREE.MeshStandardMaterial({color:E.COL.lip,roughness:.45,clippingPlanes:CUT}),HH);E.scene.add(lip);
  const infM=new THREE.MeshStandardMaterial({color:E.COL.fil2,roughness:.55,side:D,clippingPlanes:CUT}),solidM=E.layered(E.COL.fil2,.4,{clippingPlanes:CUT,side:D});
  const clip=(a,b,c,d)=>E.clipSeg(a,b,c,d,-IN,-IN,IN,IN);
  const diag=(sp,dir)=>{const s=[];for(let k=-60;k<=60;k+=sp){const L=clip(k-40,-40*dir,k+40,40*dir);if(L)s.push(L)}return s};
  function gyroid(per,z){const N=MOB?44:60,st=2*IN/N,w=2*Math.PI/per,Z=z*w,sz=Math.sin(Z),cz=Math.cos(Z),f=[],out=[];
    for(let j=0;j<=N;j++)for(let i=0;i<=N;i++){const X=(-IN+i*st)*w,Y=(-IN+j*st)*w;f.push(Math.sin(X)*Math.cos(Y)+Math.sin(Y)*cz+sz*Math.cos(X))}
    const g=(i,j)=>f[j*(N+1)+i],lp=(a,b)=>a/(a-b);
    for(let j=0;j<N;j++)for(let i=0;i<N;i++){const a=g(i,j),b=g(i+1,j),c=g(i+1,j+1),d=g(i,j+1),x=-IN+i*st,y=-IN+j*st,e=[];
      if((a>0)!==(b>0))e.push([x+st*lp(a,b),y]);if((b>0)!==(c>0))e.push([x+st,y+st*lp(b,c)]);if((c>0)!==(d>0))e.push([x+st*(1-lp(c,d)),y+st]);if((d>0)!==(a>0))e.push([x,y+st*(1-lp(d,a))]);
      if(e.length>=2)out.push([e[0][0],e[0][1],e[1][0],e[1][1]]);if(e.length===4)out.push([e[2][0],e[2][1],e[3][0],e[3][1]])}return out}
  function honey(R){const s=[],hx=R*Math.sqrt(3);for(let row=-1;row*R*1.5<2*IN+R*2;row++)for(let col=-1;col*hx<2*IN+hx*2;col++){const cx=-IN+col*hx+(row%2?hx/2:0),cy=-IN+row*R*1.5;
    for(let k=0;k<3;k++){const a0=Math.PI/6+k*Math.PI/3,a1=a0+Math.PI/3,L=clip(cx+R*Math.cos(a0),cy+R*Math.sin(a0),cx+R*Math.cos(a1),cy+R*Math.sin(a1));if(L)s.push(L)}}return s}
  function bands(p,d){const out=[],Y0=FLOOR,Y1=HH;
    if(p==='lineas'){const sp=TH/d*1.05;let n=0;for(let y=Y0;y<Y1-.01;y+=.8,n++)out.push([y,Math.min(Y1,y+.8),diag(sp,n%2?1:-1)])}
    else if(p==='grilla'){const s=diag(2*TH/d,1).concat(diag(2*TH/d,-1));for(let y=Y0;y<Y1-.01;y+=2.4)out.push([y,Math.min(Y1,y+2.4),s])}
    else if(p==='giroide'){const per=Math.max(2.2,2.1/d),b=MOB?.9:.7;for(let y=Y0;y<Y1-.01;y+=b)out.push([y,Math.min(Y1,y+b),gyroid(per,y+b/2)])}
    else{const s=honey(Math.max(1.1,1.75*TH/d));for(let y=Y0;y<Y1-.01;y+=2.4)out.push([y,Math.min(Y1,y+2.4),s])}return out}
  const res=d=>d===0?18:30+70*(1-Math.exp(-3.2*d));
  let inf=null,P=null,D2=-1,grow=1,g0=0;
  function chart(c,w,h){const x0=12,x1=w-12,y0=h-14,y1=26,X=v=>x0+(x1-x0)*v,Y=v=>y0-(y0-y1)*v/100,d=D2;
    c.font='700 11px "DM Sans",system-ui,sans-serif';c.fillStyle=E.CSS.pop;c.textAlign='left';c.fillText('resistencia',x0,15);c.fillStyle=E.CSS.soft;c.textAlign='right';c.fillText(w<170?'peso':'peso y tiempo',x1,15);
    c.strokeStyle='rgba(185,194,216,.18)';c.lineWidth=1;c.beginPath();c.moveTo(x0,y0);c.lineTo(x1,y0);c.stroke();
    c.strokeStyle='rgba(185,194,216,.75)';c.setLineDash([4,4]);c.lineWidth=1.6;c.beginPath();c.moveTo(X(0),Y(25));c.lineTo(X(1),Y(100));c.stroke();c.setLineDash([]);
    c.strokeStyle=E.CSS.pop;c.lineWidth=2.4;c.beginPath();for(let k=0;k<=40;k++){const v=k/40;k?c.lineTo(X(v),Y(res(v))):c.moveTo(X(v),Y(res(v)))}c.stroke();
    c.strokeStyle=E.CSS.ui;c.lineWidth=1.4;c.beginPath();c.moveTo(X(d),y0);c.lineTo(X(d),y1-6);c.stroke();
    c.fillStyle=E.CSS.pop;c.beginPath();c.arc(X(d),Y(res(d)),4.5,0,7);c.fill();c.fillStyle=E.CSS.soft;c.beginPath();c.arc(X(d),Y(25+75*d),3.5,0,7);c.fill()}
  E.chart(chart);
  return {update(){const d=E.val('d4')/100,p=E.chip('pat4','p')||'grilla';if(d===D2&&p===P)return;const pc=p!==P;P=p;D2=d;
      if(inf){E.scene.remove(inf);inf.geometry.dispose();inf=null}
      if(d>=.999){const g=new THREE.BoxGeometry(2*IN,HH-FLOOR,2*IN);g.translate(0,(HH+FLOOR)/2,0);inf=E.mesh(g,solidM)}else if(d>0){inf=E.ribbons(bands(p,d),TH,infM)}
      if(inf)E.scene.add(inf);if(pc){grow=0;g0=performance.now()}E.grow(inf,grow);E.redraw()},
    enter(){grow=0;g0=performance.now();E.grow(inf,0)},
    tick(){if(grow<1){grow=Math.min(1,(performance.now()-g0)/1600);E.grow(inf,grow);return true}return false}};
}});

/* ---------- 4.11 voladizos y soportes ---------- */
register('l5',{span:30,view:{pos:[16,20,46],target:[4,8,0],posP:[18,26,62],targetP:[6,10,0],min:24,max:140},build(E){
  const M=E.M,DZ=14,LW=4.4,U=1;E.bed(56,26,{grid:10});const G=group(E);let strands=[];
  return {update(){clear(G);strands=[];const a=E.val('a5'),S=E.chip('sup5','s')||'no',f=Math.tan(a*Math.PI/180)*.444,q=S!=='no'?'sup':f<.5?'ok':f<.85?'cae':'falla',
      off=Math.tan(a*Math.PI/180),n=Math.max(3,Math.min(12,Math.floor(24/Math.max(.01,off)))),xc=-10;
    for(let i=0;i<6;i++)G.add(E.bead(xc+LW/2,-DZ/2,xc+LW/2,DZ/2,i*U,LW,U,i%2?M.fil2:M.fil));
    const top=6*U,pts=[];for(let i=0;i<n;i++){const sag=q==='cae'?(f-.5)*i*i*.05*U:0;pts.push([xc+(i+1)*off*U,top+i*U-sag])}
    if(S!=='no'&&a>0){const lx=pts[n-1][0]+LW;
      if(S==='normal'){for(let x=xc+LW+.5;x<lx;x+=.9){let y=top;for(let i=0;i<n;i++)if(pts[i][0]+LW>=x){y=pts[i][1];break}if(y>.3){const b=E.mesh(new THREE.BoxGeometry(.18,y-.15,DZ-1),M.sup);b.position.set(x,(y-.15)/2,0);G.add(b)}}}
      else{[-DZ/4,DZ/4].forEach(z=>{const tx=Math.min(30,(xc+LW+lx)/2+2);const tr=E.mesh(new THREE.CylinderGeometry(.55,.8,3,12),M.sup);tr.position.set(tx,1.5,z);G.add(tr);
        [.25,.5,.75,1].forEach(qq=>{const ix=Math.max(0,Math.min(n-1,Math.round(qq*n)-1)),p=pts[ix];G.add(E.tube([[tx,3,z],[tx,(p[1]+3)/2,z],[p[0]+LW*.55,p[1]-.1,z]],.28,M.sup,20))})})}}
    for(let i=0;i<n;i++){const p=pts[i];if(q==='falla'&&i>2){for(let z=-DZ/2+1.5;z<DZ/2;z+=3){const s=new THREE.Group();s.position.set(pts[2][0]+LW*.9,pts[2][1],z);
        const dx=(2+i*.9),dy=-pts[2][1]+.3;s.add(E.tube([[0,0,0],[dx*.5,dy*.3,0],[dx*.8,dy*.7,0],[dx+(i%3),dy,0]],.18,i%2?M.fil2:M.fil,16));s.userData.ph=i+z;G.add(s);strands.push(s)}}
      else G.add(E.bead(p[0]+LW/2,-DZ/2,p[0]+LW/2,DZ/2,p[1],LW,U,i%2?M.fil2:M.fil))}
    const z=DZ/2+.6,R=3.6;G.add(E.line([[xc,top,z],[xc,top+7,z]],true));const arc=[];for(let k=0;k<=20;k++){const an=a*Math.PI/180*k/20;arc.push([xc+R*Math.sin(an),top+R*Math.cos(an),z])}G.add(E.line(arc));
    E.label('a',[xc-1.6,top+8.2,z],a+'°',E.CSS.ui);
    E.pill(q==='sup'?'sale bien, con soportes':q==='ok'?'sale sola':q==='cae'?'el borde se cae':'no se sostiene',q==='falla'?E.CSS.bad:q==='cae'?E.CSS.ui:E.CSS.pop)},
  tick(t){if(!strands.length)return false;strands.forEach(s=>{s.rotation.z=Math.sin(t*2+s.userData.ph)*.05});return true}};
}});

/* ---------- 4.12 puentes ---------- */
register('l6',{span:42,view:{pos:[0,30,82],target:[0,11,0],posP:[0,44,118],targetP:[0,13,0],min:30,max:200},build(E){
  const M=E.M,DZ=12,U=1.2,HP=9*U;E.bed(90,26,{grid:10});const G=group(E);
  const fan=E.fan(1.1);fan.g.position.set(0,HP+10,0);
  const air=[];for(let k=0;k<7;k++){const l=E.line([[ (k-3)*1.7,0,0],[(k-3)*1.7,-2,0]]);l.material=E.M.air.clone();air.push(l)}
  let fa=.2,hang=[];
  return {update(){clear(G);hang=[];const L=E.val('len6'),f=E.val('fan6')/100,sg=Math.pow(L/60,2)*(1-.85*f)*10,xa=-L/2,xb=L/2;fa=f;
    for(let i=0;i<9;i++){G.add(E.bead(xa-2,-DZ/2,xa-2,DZ/2,i*U,4,U,i%2?M.fil2:M.fil));G.add(E.bead(xb+2,-DZ/2,xb+2,DZ/2,i*U,4,U,i%2?M.fil2:M.fil))}
    for(let k=0;k<4;k++){const s2=sg*1.15*(1-k*.2),y=HP+(k+.5)*U*.8;for(let z=-DZ/2+1;z<=DZ/2-1+.01;z+=2){const pts=[[xa-3.6,y,z],[xa,y,z]];for(let i=1;i<10;i++){const t=i/10;pts.push([xa+(xb-xa)*t,y-4*s2*t*(1-t),z])}pts.push([xb,y,z],[xb+3.6,y,z]);G.add(E.tube(pts,.42,k%2?M.fil2:M.fil,48))}}
    if(sg>3){for(let k=0;k<5;k++){const x=xa+(xb-xa)*(.25+k*.125),s=new THREE.Group();s.position.set(x,HP-sg*1.15*.8,(k-2)*2.2);s.add(E.tube([[0,0,0],[.6,-1.2-(k%2),0],[1,-2.4-(k%3),0]],.16,M.fil,10));s.userData.ph=k;G.add(s);hang.push(s)}}
    const z=DZ/2+1,y=HP*.55;G.add(E.line([[xa,y,z],[xb,y,z]]));G.add(E.line([[xa,y-.8,z],[xa,y+.8,z]]));G.add(E.line([[xb,y-.8,z],[xb,y+.8,z]]));
    E.label('l',[0,y+1.8,z],L+' mm en el aire',E.CSS.ui);
    air.forEach(l=>{l.visible=f>0;l.material.opacity=.25+.5*f});
    E.pill(sg<.8?'cruza derecho':sg<3?'hace panza':'cuelga',sg<.8?E.CSS.pop:sg<3?E.CSS.ui:E.CSS.bad)},
  tick(t,dt){fan.spin(dt,fa);air.forEach((l,k)=>{const o=((t*9*fa+k*1.7)%5);l.position.y=HP+8.6-o*.7});hang.forEach(s=>{s.rotation.z=Math.sin(t*2+s.userData.ph)*.08});return true}};
}});
