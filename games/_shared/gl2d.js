// Tiny 2D renderer on WebGL: rects, circles, pointer/touch input, simple HUD.
window.GL2D=function(opts){
  opts=opts||{};const fg=opts.fg||'#fff';
  const css=document.createElement('style');
  css.textContent='html,body{margin:0;height:100%;overflow:hidden;overscroll-behavior:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent}'+
   '.hud{position:fixed;font:700 20px/1.3 ui-monospace,Menlo,Consolas,monospace;color:'+fg+';pointer-events:none;text-shadow:none}';
  document.head.appendChild(css);
  const c=document.createElement('canvas');
  c.style.cssText='position:fixed;inset:0;width:100%;height:100%;display:block;touch-action:none';
  document.body.appendChild(c);
  const gl=c.getContext('webgl',{antialias:true});
  const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))console.error(gl.getShaderInfoLog(o));return o};
  const p=gl.createProgram();
  gl.attachShader(p,sh(gl.VERTEX_SHADER,'attribute vec2 a;uniform vec2 pos,size,res;varying vec2 v;void main(){v=a;vec2 w=pos+a*size;gl_Position=vec4(w.x/res.x*2.-1.,1.-w.y/res.y*2.,0.,1.);}'));
  gl.attachShader(p,sh(gl.FRAGMENT_SHADER,'precision mediump float;uniform vec4 col;uniform float circ;varying vec2 v;void main(){float al=col.a;if(circ>.5)al*=1.-smoothstep(.46,.5,length(v));gl_FragColor=vec4(col.rgb,al);}'));
  gl.linkProgram(p);gl.useProgram(p);
  gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-.5,-.5,.5,-.5,-.5,.5,.5,.5]),gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
  gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
  const U={};['pos','size','res','col','circ'].forEach(n=>U[n]=gl.getUniformLocation(p,n));
  const cache={};
  const rgb=h=>cache[h]||(cache[h]=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255));
  const g={W:1,H:1,ptr:{x:0,y:0,down:false,type:'mouse'},onDown:null,onUp:null};
  const draw=(x,y,w,h,col,a,circ)=>{const k=rgb(col);gl.uniform2f(U.pos,x,y);gl.uniform2f(U.size,w,h);
    gl.uniform4f(U.col,k[0],k[1],k[2],a==null?1:a);gl.uniform1f(U.circ,circ);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)};
  g.rect=(x,y,w,h,col,a)=>draw(x+w/2,y+h/2,w,h,col,a,0);
  g.circle=(x,y,r,col,a)=>draw(x,y,r*2,r*2,col,a,1);
  g.clear=col=>{const k=rgb(col);gl.clearColor(k[0],k[1],k[2],1);gl.clear(gl.COLOR_BUFFER_BIT)};
  const sc=document.createElement('div');sc.className='hud';sc.style.cssText+='top:14px;left:18px';document.body.appendChild(sc);
  const mg=document.createElement('div');mg.className='hud';mg.style.cssText+='inset:0;display:flex;align-items:center;justify-content:center;text-align:center;font-size:22px';document.body.appendChild(mg);
  g.score=t=>{sc.textContent=t};
  g.msg=h=>{mg.style.display=h?'flex':'none';if(h)mg.innerHTML='<div>'+h+'</div>'};
  const upd=e=>{const r=c.getBoundingClientRect();g.ptr.x=e.clientX-r.left;g.ptr.y=e.clientY-r.top;g.ptr.type=e.pointerType};
  c.addEventListener('pointerdown',e=>{e.preventDefault();try{c.setPointerCapture(e.pointerId)}catch(_){}upd(e);g.ptr.down=true;g.onDown&&g.onDown()});
  c.addEventListener('pointermove',e=>{e.preventDefault();upd(e)});
  const up=e=>{g.ptr.down=false;g.onUp&&g.onUp()};
  c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up);
  c.addEventListener('contextmenu',e=>e.preventDefault());
  g.ptr.x=0;g.ptr.y=0;
  g.loop=fn=>{let last=performance.now();
    const f=t=>{const dpr=Math.min(devicePixelRatio||1,3),w=c.clientWidth,h=c.clientHeight;
      if(c.width!==Math.round(w*dpr)||c.height!==Math.round(h*dpr)){c.width=Math.round(w*dpr);c.height=Math.round(h*dpr)}
      g.W=w;g.H=h;gl.viewport(0,0,c.width,c.height);gl.uniform2f(U.res,w,h);
      const dt=Math.min((t-last)/1000,.05);last=t;fn(dt);requestAnimationFrame(f)};
    requestAnimationFrame(f)};
  return g;
};
