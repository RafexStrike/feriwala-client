
// @ts-nocheck  (physics code is plain JS on purpose; tighten the types later if you want)

"use client";

/**
 * Feriwala landing page — drop-in replacement for app/page.tsx
 *
 * Needs:  npm i matter-js  &&  npm i -D @types/matter-js
 *
 * Uses your existing CartSidebar + useAuth. Single file, CSS is scoped under .fw
 */

import Link from "next/link";

import { useRouter } from "next/navigation";

import { useEffect } from "react";

import Matter from "matter-js";

import { CartSidebar } from "@/components/shared/CartSidebar";

import { useAuth } from "@/lib/auth/AuthProvider";


const CSS = `@import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;700;800&family=Instrument+Serif:ital@0;1&display=swap");

.fw{--bg:#ede9e0;--ink:#171410;--muted:#6f675b;--line:rgba(23,20,16,.16);--surface:#f6f3ec;--o:#f58c4c;--c:#f46764;--b:#37aff5;--g:#8ed1a4;--y:#f6c453;
}

.fw *{box-sizing:border-box}

.fw{margin:0;background:var(--bg);color:var(--ink);font:16px/1.55 'Bricolage Grotesque',system-ui,sans-serif;overflow-x:clip;min-height:100vh}

.fw:after{content:"";position:fixed;inset:0;pointer-events:none;z-index:99;opacity:.07;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")}

.fw a{color:inherit;text-decoration:none}

.fw .serif{font-family:'Instrument Serif',Georgia,serif;font-weight:400}

.fw .motif{display:inline-flex;gap:5px;height:12px;width:40px}

.fw .motif i{flex:1;border-radius:9px}

.fw .motif i:nth-child(1){background:var(--o)}

.fw .motif i:nth-child(2){background:var(--c)}

.fw .motif i:nth-child(3){background:var(--b)}

.fw header{position:sticky;top:env(safe-area-inset-top,0px);z-index:50;display:flex;justify-content:space-between;align-items:center;padding:14px clamp(16px,4vw,48px);backdrop-filter:blur(14px);background:color-mix(in srgb,var(--bg) 72%,transparent);border-bottom:1px solid var(--line)}

.fw .logo{display:flex;align-items:center;gap:12px;font-size:1.7rem;letter-spacing:-.02em}

.fw nav{display:flex;gap:10px;align-items:center;font-size:.8rem}

.fw nav a{padding:9px 16px;border:1.5px solid var(--line);border-radius:99px;transition:.25s}

.fw nav a:hover{border-color:var(--ink);transform:translateY(-2px)}

.fw #cartPill{background:var(--ink);color:var(--bg);border-color:var(--ink);font-weight:700}

@media(max-width:560px){.fw nav a.hide{display:none}}

.fw #hero{position:relative;height:100svh;min-height:680px;overflow:hidden}

.fw #hc,.fw #cc{position:absolute;inset:0;width:100%;height:100%;z-index:2}

.fw .htext{position:absolute;inset:0;z-index:1;padding:clamp(36px,9vh,96px) clamp(18px,5vw,64px);pointer-events:none}

.fw .kick{font-size:.72rem;letter-spacing:.28em;text-transform:uppercase;color:var(--muted);margin:28px 0 34px}

.fw h1{font-size:clamp(3.6rem,12vw,11rem);line-height:1.02;letter-spacing:-.045em;margin:0}

.fw .ln{display:block;overflow:hidden;padding:.02em 0 .06em}

.fw .ln>span{display:inline-block;transform:translateY(112%);animation:up 1.1s cubic-bezier(.2,.8,.2,1) forwards;animation-delay:calc(var(--d)*.13s + .15s)}

@keyframes up{to{transform:none}}

.fw h1 em{background:linear-gradient(90deg,var(--o),var(--c),var(--b));-webkit-background-clip:text;background-clip:text;color:transparent;padding-right:.12em}

.fw .sub{max-width:30rem;color:var(--muted);margin:38px 0 40px;font-size:1.05rem}

.fw .btn{pointer-events:auto;position:relative;z-index:3;display:inline-block;padding:15px 26px;border-radius:99px;font-weight:700;font-size:.9rem;background:linear-gradient(90deg,var(--o),var(--c));color:#fff;box-shadow:0 16px 34px rgba(245,140,76,.3);transition:.3s}

.fw .btn+.btn{margin-left:14px}

.fw .btn:hover{transform:translateY(-3px) rotate(-1.5deg)}

.fw .btn.alt{background:none;color:var(--ink);box-shadow:none;border:1.5px solid var(--ink)}

.fw .strip{overflow:hidden;border-block:2px solid var(--ink);background:var(--ink);color:var(--bg);white-space:nowrap}

.fw .strip.l{background:var(--o);color:#171410;transform:rotate(-1.2deg);margin:-6px -20px 0;position:relative;z-index:4}

.fw .strip div{display:inline-block;animation:mq 32s linear infinite;padding:14px 0;font-size:1.5rem}

.fw .strip.r div{animation-direction:reverse;animation-duration:40s}

.fw .strip span{margin:0 22px}

.fw .strip em{color:var(--c);font-style:normal}

@keyframes mq{to{transform:translateX(-50%)}}

.fw section{position:relative}

.fw .wrap{max-width:1180px;margin:0 auto;padding:0 clamp(18px,4vw,32px)}

.fw #cats{padding:clamp(70px,10vw,130px) 0 0}

.fw .h2{font-size:clamp(3rem,8vw,7rem);line-height:1;letter-spacing:-.04em;margin:22px 0 34px}

.fw #cwrap{position:relative;height:min(80vh,680px);min-height:520px;margin-top:10px}

.fw #stmt{padding:clamp(80px,12vw,170px) 0}

.fw #stmt p{font-size:clamp(1.9rem,4.6vw,4rem);line-height:1.08;letter-spacing:-.03em;margin:0;max-width:20ch;max-width:min(1000px,100%)}

.fw #stmt .w{opacity:.15;transition:opacity .2s}

.fw .cards{display:grid;gap:18px;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));margin-top:60px}

.fw .card{border:2.5px solid var(--ink);border-radius:26px;padding:28px;background:var(--surface);box-shadow:7px 8px 0 var(--ink);transition:.3s;min-height:210px;display:flex;flex-direction:column;justify-content:space-between}

.fw .card:nth-child(1){--a:var(--o);transform:rotate(-1.5deg)}

.fw .card:nth-child(2){--a:var(--b);transform:rotate(1deg)}

.fw .card:nth-child(3){--a:var(--c);transform:rotate(-.6deg)}

.fw .card:hover{transform:rotate(0) translateY(-6px);box-shadow:11px 14px 0 var(--a)}

.fw .card .n{font-size:3.6rem;line-height:1;color:var(--a)}

.fw .card h3{font-size:1.9rem;margin:0 0 6px;line-height:1}

.fw .card p{margin:0;color:var(--muted)}

.fw #cta{padding:clamp(50px,8vw,100px) 0 40px}

.fw .box{position:relative;overflow:hidden;border:2.5px solid var(--ink);border-radius:40px;padding:clamp(28px,6vw,72px);background:var(--surface);box-shadow:10px 12px 0 var(--ink)}

.fw .box:before,.fw .box:after{content:"";position:absolute;width:300px;height:300px;border-radius:50%;filter:blur(70px);opacity:.3}

.fw .box:before{right:-70px;top:-70px;background:var(--b)}

.fw .box:after{left:-80px;bottom:-110px;background:var(--c)}

.fw .box>*{position:relative;z-index:1}

.fw footer{padding:30px 0 50px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;color:var(--muted);font-size:.8rem}

.fw #toast{position:fixed;left:50%;bottom:calc(24px + env(safe-area-inset-bottom,0px));transform:translate(-50%,160%);z-index:120;background:var(--ink);color:var(--bg);padding:13px 22px;border-radius:99px;font-weight:700;font-size:.85rem;transition:transform .5s cubic-bezier(.2,1.4,.4,1);white-space:nowrap;max-width:92vw}

.fw #toast.on{transform:translate(-50%,0)}

.fw #cur{position:fixed;left:0;top:0;width:34px;height:34px;margin:-17px 0 0 -17px;border:2px solid var(--ink);border-radius:50%;z-index:110;pointer-events:none;mix-blend-mode:difference;border-color:#fff;transition:width .25s,height .25s,margin .25s,background .25s}

.fw #cur.big{width:70px;height:70px;margin:-35px 0 0 -35px;background:#fff}

@media(hover:none){.fw #cur{display:none}}

.fw .rv{opacity:0;transform:translateY(34px);transition:opacity .9s,transform .9s cubic-bezier(.2,.8,.2,1)}

.fw .rv.in{opacity:1;transform:none}

@media(prefers-reduced-motion:reduce){.fw .strip div{animation:none}

.fw .ln>span{animation-duration:.01s}}`;


const MARQUEE_1 = ["Built by students", "For students", "Campus essentials", "Study gear", "Campus life", "Desk setups", "Everyday gadgets"];

const MARQUEE_2 = ["Student-first curation", "Made with care", "Built for campus life", "Community-driven", "By students, for students"];

const STATEMENT =
  "We believe students deserve better tools for campus life. Every product here is chosen with care, thinking about the things students actually need, use and love. Built by students, for students.";


export default function HomePage() {

  const router = useRouter();

  const { isAuthenticated, isAdmin } = useAuth();


  useEffect(() => {


    const {Engine,Bodies,Body,Composite,Mouse,MouseConstraint,Events,Query}=Matter;

        let dead=false;const off:(()=>void)[]=[];

        const on=(t:any,n:string,f:any,o?:any)=>{t.addEventListener(n,f,o);off.push(()=>t.removeEventListener(n,f,o))};

    const $=s=>document.querySelector(s),dpr=Math.min(devicePixelRatio||1,2),rand=(a,b)=>a+Math.random()*(b-a);

    const INK='#171410';

    const toast=(m)=>{const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(t.h);t.h=setTimeout(()=>t.classList.remove('on'),2600)};


    /* ---------- marquees ---------- */

    const mk=(id,words)=>{const h=words.map(w=>`<span class="serif">${w}</span><span><em>✦</em></span>`).join('');$(id).innerHTML=h+h+h+h};

    mk('#m1',MARQUEE_1);

    mk('#m2',MARQUEE_2);

    /* strip contents repeat 4x; animate half -> make it loop cleanly */

    document.querySelectorAll('.fw .strip div').forEach(d=>d.style.animationDuration='36s');


    /* ---------- physics world factory ---------- */

    function makeWorld(canvas){

      const ctx=canvas.getContext('2d'),engine=Engine.create({gravity:{y:1.15}});

      const w={canvas,ctx,engine,W:0,H:0,walls:[],parts:[],vis:false};

      const mouse=Mouse.create(canvas);mouse.pixelRatio=dpr;

      ['mousewheel','DOMMouseScroll','wheel'].forEach(n=>mouse.element.removeEventListener(n,mouse.mousewheel));

      const mc=MouseConstraint.create(engine,{mouse,constraint:{stiffness:.2,render:{visible:false}}});

      Composite.add(engine.world,mc);w.mc=mc;w.mouse=mouse;

      /* touch: only capture when finger lands on a body, so the page still scrolls */

      let tch=false;

      canvas.addEventListener('touchstart',e=>{const t=e.touches[0],r=canvas.getBoundingClientRect();

        tch=Query.point(Composite.allBodies(engine.world).filter(b=>!b.isStatic),{x:t.clientX-r.left,y:t.clientY-r.top}).length>0;

        if(!tch)e.stopImmediatePropagation()},{capture:true,passive:true});

      ['touchmove','touchend'].forEach(n=>canvas.addEventListener(n,e=>{if(!tch)e.stopImmediatePropagation();if(n==='touchend')tch=false},{capture:true,passive:true}));

      function size(){const r=canvas.getBoundingClientRect();w.W=r.width;w.H=r.height;canvas.width=r.width*dpr;canvas.height=r.height*dpr;

        Composite.remove(engine.world,w.walls);const t=80,o={isStatic:true};

        w.walls=[Bodies.rectangle(w.W/2,w.H+t/2,w.W+600,t,o),Bodies.rectangle(-t/2,w.H/2-600,t,w.H*3,o),Bodies.rectangle(w.W+t/2,w.H/2-600,t,w.H*3,o)];

        Composite.add(engine.world,w.walls);w.onsize&&w.onsize()}

      on(window,'resize',size);size();

      w.burst=(x,y,n,cols)=>{for(let i=0;i<n;i++)w.parts.push({x,y,vx:rand(-6,6),vy:rand(-9,-1),s:rand(5,11),r:rand(0,6),c:cols[i%cols.length],life:rand(40,75)})};

      w.float=(t,x,y)=>w.parts.push({t,x,y,vx:0,vy:-1.3,life:55,c:INK});

      {const o=new IntersectionObserver(e=>{w.vis=e[0].isIntersecting;if(w.vis&&w.onshow){w.onshow();w.onshow=null}},{threshold:.2});o.observe(canvas);off.push(()=>o.disconnect())}

      off.push(()=>Engine.clear(engine));

      (function frame(){if(dead)return;requestAnimationFrame(frame);if(!w.vis)return;

        Engine.update(engine,1000/60);w.tick&&w.tick();

        ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w.W,w.H);w.pre&&w.pre(ctx);

        for(const b of Composite.allBodies(engine.world))b.plugin.draw&&b.plugin.draw(ctx,b);

        for(let i=w.parts.length-1;i>=0;i--){const p=w.parts[i];p.x+=p.vx;p.y+=p.vy;p.life--;if(p.t){ctx.globalAlpha=Math.min(1,p.life/25);ctx.fillStyle=p.c;ctx.font="400 34px 'Instrument Serif',Georgia,serif";ctx.textAlign='center';ctx.fillText(p.t,p.x,p.y)}

          else{p.vy+=.35;p.r+=.2;ctx.globalAlpha=Math.min(1,p.life/20);ctx.fillStyle=p.c;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.fillRect(-p.s/2,-p.s/2,p.s,p.s*.6);ctx.restore()}

          ctx.globalAlpha=1;if(p.life<=0)w.parts.splice(i,1)}

      })();

      return w;

    }


    /* ---------- product bodies ---------- */

    const KINDS={keyboard:{w:150,h:58,c:'#f58c4c'},mouse:{w:58,h:88,c:'#f46764'},earbuds:{r:36,c:'#37aff5'},power:{w:112,h:64,c:'#f6c453'},hub:{w:136,h:42,c:'#8ed1a4'},gadget:{w:76,h:76,c:'#b79ae0'},monitor:{w:170,h:126,c:'#6b98b5'},laptop:{w:164,h:104,c:'#f46764'},headphones:{w:104,h:96,c:'#f58c4c'},speaker:{w:64,h:100,c:'#37aff5'}};

    const KN=Object.keys(KINDS);

    function drawItem(ctx,b){

      const k=b.plugin.k,s=KINDS[k],w=s.r?s.r*2:s.w,h=s.r?s.r*2:s.h,rad=s.r?s.r:k==='mouse'||k==='speaker'?w/2:14,K='#171410',W='#fff';

      ctx.save();ctx.translate(b.position.x,b.position.y);ctx.rotate(b.angle);ctx.lineWidth=3;ctx.strokeStyle=K;

      const blk=(f,x,y,ww,hh,r)=>{ctx.fillStyle=K;ctx.beginPath();ctx.roundRect(x+5,y+7,ww,hh,r);ctx.fill();ctx.fillStyle=f;ctx.beginPath();ctx.roundRect(x,y,ww,hh,r);ctx.fill();ctx.stroke()};

      const dot=(x,y,r,f)=>{ctx.fillStyle=f;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill();ctx.stroke()};

      if(k==='monitor'){blk(s.c,-w/2,-h/2,w,h-26,12);ctx.fillStyle=K;ctx.beginPath();ctx.roundRect(-w/2+10,-h/2+10,w-20,h-46,6);ctx.fill();ctx.fillStyle='#f58c4c';ctx.fillRect(-w/2+22,-h/2+24,50,6);ctx.fillStyle='#37aff5';ctx.fillRect(-w/2+22,-h/2+38,80,6);ctx.fillStyle=K;ctx.fillRect(-7,h/2-28,14,16);blk(K,-32,h/2-14,64,14,6)}

      else if(k==='laptop'){blk(s.c,-w/2+16,-h/2,w-32,h-20,10);ctx.fillStyle=K;ctx.beginPath();ctx.roundRect(-w/2+26,-h/2+10,w-52,h-40,5);ctx.fill();ctx.fillStyle='#f6c453';ctx.fillRect(-w/2+36,-h/2+22,36,6);blk('#e6dfd0',-w/2,h/2-18,w,18,9)}

      else if(k==='headphones'){ctx.strokeStyle=K;ctx.lineWidth=13;ctx.beginPath();ctx.arc(0,4,w*.35,Math.PI,0);ctx.stroke();ctx.lineWidth=3;blk(s.c,-w/2,h/2-52,26,52,12);blk(s.c,w/2-26,h/2-52,26,52,12)}

      else{blk(s.c,-w/2,-h/2,w,h,rad);ctx.fillStyle=W;ctx.lineWidth=2;

      if(k==='keyboard'){for(let r=0;r<3;r++)for(let c=0;c<9;c++){ctx.beginPath();ctx.roundRect(-w/2+13+c*14,-h/2+11+r*14,10,10,3);ctx.fill()}}

      if(k==='mouse'){ctx.beginPath();ctx.moveTo(-w/2,-h/6);ctx.lineTo(w/2,-h/6);ctx.moveTo(0,-h/2);ctx.lineTo(0,-h/6);ctx.stroke();ctx.beginPath();ctx.roundRect(-4,-h/2+10,8,16,4);ctx.fill();ctx.stroke()}

      if(k==='earbuds'){dot(0,0,s.r*.5,W);dot(0,0,5,K)}

      if(k==='power'){for(let i=0;i<4;i++)dot(-w/2+20+i*14,0,4.5,W);ctx.fillStyle=K;ctx.fillRect(w/2-22,-6,10,12)}

      if(k==='hub'){ctx.fillStyle=K;for(let i=0;i<4;i++){ctx.beginPath();ctx.roundRect(-w/2+14+i*28,-6,20,12,3);ctx.fill()}}

      if(k==='gadget'){ctx.fillStyle=K;ctx.beginPath();ctx.roundRect(-26,-27,52,36,7);ctx.fill();dot(-9,-12,4,W);dot(9,-12,4,W);dot(0,16,5,W)}

      if(k==='speaker'){dot(0,-h/4+2,9,W);dot(0,h/5,17,K);dot(0,h/5,7,W)}}

      ctx.restore();

    }

    function spawn(w,x,y,k){const s=KINDS[k],o={restitution:.5,friction:.3,frictionAir:.004,plugin:{k,draw:drawItem}};

      const b=s.r?Bodies.circle(x,y,s.r,o):Bodies.rectangle(x,y,s.w,s.h,{...o,chamfer:{radius:k==='mouse'?s.w/2-1:12}});

      Body.setAngle(b,rand(-.7,.7));Body.setVelocity(b,{x:rand(-2,2),y:3});Composite.add(w.engine.world,b);return b}


    /* ---------- HERO PLAYGROUND ---------- */

    const hero=makeWorld($('#hc'));let deck=[];

    const pick=()=>{if(!deck.length)deck=[...KN].sort(()=>Math.random()-.5);return deck.pop()};

    hero.onshow=()=>{for(let i=0;i<12;i++)setTimeout(()=>!dead&&spawn(hero,rand(90,Math.max(180,hero.W-90)),-90,pick()),500+i*200)};


    /* ---------- CATEGORY PILE ---------- */

    const CATS=[['Keyboards','keyboards','#6b98b5'],['Mice','mice','#f46764'],['Audio','audio','#f58c4c'],['Cleaning Tools','cleaning-tools','#8ed1a4'],['Desk Accessories','desk-accessories','#37aff5'],['Hubs','hubs','#f6c453'],['Gadgets','gadgets','#b79ae0']];

    const cats=makeWorld($('#cc'));

    function drawPill(ctx,b){const p=b.plugin,hov=b===cats.hover;ctx.save();ctx.translate(b.position.x,b.position.y);ctx.rotate(b.angle);

      const w=p.w,h=p.h;ctx.lineWidth=3;ctx.strokeStyle='#171410';ctx.fillStyle='#171410';ctx.beginPath();ctx.roundRect(-w/2+5,-h/2+7,w,h,h/2);ctx.fill();

      ctx.fillStyle=p.c;ctx.beginPath();ctx.roundRect(-w/2,-h/2,w,h,h/2);ctx.fill();ctx.stroke();

      ctx.fillStyle='#171410';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=(hov?'italic ':'')+"400 "+p.f+"px 'Instrument Serif',Georgia,serif";ctx.fillText(p.n,0,2);ctx.restore()}

    cats.onshow=()=>{const ctx=cats.ctx;CATS.forEach((c,i)=>setTimeout(()=>{if(dead)return;

      const f=cats.W<600?30:44;ctx.font="400 "+f+"px 'Instrument Serif',Georgia,serif";const w=ctx.measureText(c[0]).width+f*1.3,h=f*1.7;

      const b=Bodies.rectangle(rand(w/2+20,cats.W-w/2-20),-80,w,h,{restitution:.35,friction:.3,chamfer:{radius:h/2-1},plugin:{n:c[0],slug:c[1],c:c[2],w,h,f,draw:drawPill}});

      Body.setAngle(b,rand(-.8,.8));Composite.add(cats.engine.world,b)},i*260))};

    let dn=null;

    Events.on(cats.mc,'startdrag',e=>{dn={t:performance.now(),x:cats.mouse.position.x,y:cats.mouse.position.y}});

    Events.on(cats.mc,'enddrag',e=>{const m=cats.mouse.position;if(dn&&performance.now()-dn.t<320&&Math.hypot(m.x-dn.x,m.y-dn.y)<9){router.push('/products/'+e.body.plugin.slug)}dn=null});

    cats.tick=()=>{cats.hover=Query.point(Composite.allBodies(cats.engine.world).filter(b=>b.plugin.slug),cats.mouse.position)[0]||null};


    /* ---------- scroll lit statement words ---------- */

    const sp=$('#sp');sp.innerHTML=sp.textContent.split(' ').map(w=>`<span class="w">${w}</span>`).join(' ');

    const words=[...sp.querySelectorAll('.w')];

    function lit(){const r=sp.getBoundingClientRect(),p=Math.min(1,Math.max(0,(innerHeight*.85-r.top)/(r.height+innerHeight*.25)));

      words.forEach((e,i)=>e.style.opacity=Math.max(.15,Math.min(1,p*words.length*1.25-i)))}

    on(window,'scroll',lit,{passive:true});lit();


    /* ---------- reveal + cursor ---------- */

    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});

    document.querySelectorAll('.fw .rv').forEach(e=>io.observe(e));off.push(()=>io.disconnect());

    const cur=$('#cur');let cx=0,cy=0,tx=0,ty=0;

    on(window,'pointermove',e=>{tx=e.clientX;ty=e.clientY;cur.classList.toggle('big',!!e.target.closest('canvas'))});

    (function c(){if(dead)return;cx+=(tx-cx)*.2;cy+=(ty-cy)*.2;cur.style.transform=`translate(${cx}px,${cy}px)`;requestAnimationFrame(c)})();


    return () => {

      dead = true;

      off.forEach((f) => f());

    };

    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, []);


  return (

    <div className="fw">

      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div id="cur" />

      <div id="toast" />


      <header>

        <Link href="/" className="logo serif">

          <span className="motif"><i /><i /><i /></span>Feriwala

        </Link>

        <nav>

          <Link href="/products" className="hide">Products</Link>

          {isAdmin && <Link href="/admin" className="hide">Admin</Link>}

          {isAuthenticated ? <Link href="/orders" className="hide">Orders</Link> : <Link href="/login" className="hide">Log in</Link>}

          <CartSidebar />

        </nav>

      </header>


      <section id="hero">

        <div className="htext">

          <div className="motif" style={{ width: 44 }}><i /><i /><i /></div>

          <p className="kick">Built by students, for students</p>

          <h1 className="serif">

            <span className="ln"><span style={{ "--d": 0 } as React.CSSProperties}>Everything for</span></span>

            <span className="ln"><span style={{ "--d": 1 } as React.CSSProperties}>your campus</span></span>

            <span className="ln"><span style={{ "--d": 2 } as React.CSSProperties}><em>journey.</em></span></span>

          </h1>

          <p className="sub">From laptops and keyboards to audio, desk gear and everyday gadgets, we bring together the things students actually need for campus life. Chosen with care, built with love.</p>

          <Link className="btn" href="/products">Explore products</Link>

        </div>

        <canvas id="hc" />

      </section>


      <div className="strip l"><div id="m1" /></div>


      <section id="cats">

        <div className="wrap rv">

          <p className="kick">Made for campus life</p>

          <h2 className="h2 serif">Find what you need.<br /><em style={{ color: "var(--c)" }}>Make it yours.</em></h2>

        </div>

        <div id="cwrap"><canvas id="cc" /></div>

      </section>


      <div className="strip r"><div id="m2" /></div>


      <section id="stmt">

        <div className="wrap">

          <p className="kick">Why Feriwala</p>

          <p className="serif" id="sp">{STATEMENT}</p>

          <div className="cards">

            {[

              ["01", "Student-first", "Every product is selected with the everyday needs of campus students in mind."],

              ["02", "Built with care", "We choose useful, quality products that make studying, working and campus life a little better."],

              ["03", "By students, for students", "Created from a student perspective, with the care and understanding that only students can bring."],

            ].map(([n, t, d]) => (

              <div className="card rv" key={n}>

                <span className="n serif">{n}</span>

                <div><h3 className="serif">{t}</h3><p>{d}</p></div>

              </div>

            ))}

          </div>

        </div>

      </section>


      <section id="cta">

        <div className="wrap">

          <div className="box rv">

            <p className="kick">For your next semester</p>

            <h2 className="h2 serif" style={{ maxWidth: "11ch" }}>Find something you'll <em style={{ color: "var(--o)" }}>love</em> using.</h2>

            <p className="sub">Browse our collection and discover products chosen to make campus life a little easier, more comfortable and more yours.</p>

            <Link className="btn" href="/products">Explore products</Link>

            <a className="btn alt" href="#hero">Back to top</a>

          </div>

          <footer>

            <span className="serif" style={{ fontSize: "1.4rem", color: "var(--ink)" }}>Feriwala</span>

            <span>Built by students · For students · Made with care</span>

          </footer>

        </div>

      </section>

    </div>

  );

}
