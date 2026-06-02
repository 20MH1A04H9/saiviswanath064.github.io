// ── MATRIX BG ──
(function(){
  const c=document.querySelector('.matrix-bg'),ctx=c.getContext('2d');
  function r(){c.width=innerWidth;c.height=innerHeight}r();
  window.addEventListener('resize',r);
  const ch='01アイウエオカキクケコ@#$%&',sz=13;
  let cols=Math.floor(c.width/sz),drops=Array(cols).fill(1);
  setInterval(()=>{
    ctx.fillStyle='rgba(10,14,20,0.05)';ctx.fillRect(0,0,c.width,c.height);
    ctx.fillStyle='#00e676';ctx.font=sz+'px Share Tech Mono';
    drops.forEach((d,i)=>{
      ctx.globalAlpha=Math.random()*0.4+0.2;
      ctx.fillText(ch[Math.floor(Math.random()*ch.length)],i*sz,d*sz);
      ctx.globalAlpha=1;
      if(d*sz>c.height&&Math.random()>0.975)drops[i]=0;
      drops[i]++;
    });
  },50);
})();

// ── RADAR MINI ──
(function(){
  const c=document.getElementById('radar-mini');if(!c)return;
  c.width=c.height=200;const ctx=c.getContext('2d'),cx=100,cy=100,R=90;
  let a=0;
  const blips=Array.from({length:5},()=>({
    d:Math.random()*0.85+0.1,a:Math.random()*Math.PI*2,s:Math.random()*2+1
  }));
  function draw(){
    ctx.clearRect(0,0,200,200);
    [0.3,0.6,1].forEach(f=>{
      ctx.beginPath();ctx.arc(cx,cy,R*f,0,Math.PI*2);
      ctx.strokeStyle='rgba(0,230,118,0.15)';ctx.lineWidth=1;ctx.stroke();
    });
    ctx.strokeStyle='rgba(0,230,118,0.1)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(cx-R,cy);ctx.lineTo(cx+R,cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,cy-R);ctx.lineTo(cx,cy+R);ctx.stroke();
    // sweep
    ctx.save();ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.clip();
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,R,a-Math.PI*0.5,a);ctx.closePath();
    const g=ctx.createLinearGradient(cx,cy,cx+Math.cos(a)*R,cy+Math.sin(a)*R);
    g.addColorStop(0,'rgba(0,230,118,0.2)');g.addColorStop(1,'rgba(0,230,118,0)');
    ctx.fillStyle=g;ctx.fill();ctx.restore();
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*R,cy+Math.sin(a)*R);
    ctx.strokeStyle='rgba(0,230,118,0.8)';ctx.lineWidth=1.5;ctx.stroke();
    blips.forEach(b=>{
      let diff=a-b.a;while(diff<0)diff+=Math.PI*2;
      if(diff<Math.PI*0.5){
        const alpha=1-diff/(Math.PI*0.5);
        const bx=cx+Math.cos(b.a)*b.d*R,by=cy+Math.sin(b.a)*b.d*R;
        ctx.beginPath();ctx.arc(bx,by,b.s,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,23,68,${alpha})`;
        ctx.shadowColor='#ff1744';ctx.shadowBlur=6;ctx.fill();ctx.shadowBlur=0;
      }
    });
    a+=0.03;requestAnimationFrame(draw);
  }
  draw();
})();

// ── TYPING ROLE ──
(function(){
  const roles=['SOC Analyst','Wazuh SIEM Admin','Threat Hunter','OpenSearch Engineer','Security Automation Dev'];
  let i=0;const el=document.getElementById('typed-role');if(!el)return;
  function type(txt,cb){let j=0;function t(){if(j<=txt.length){el.textContent=txt.slice(0,j++);setTimeout(t,60)}else setTimeout(cb,1800)}t();}
  function erase(cb){let t=el.textContent;function e(){if(t.length>0){t=t.slice(0,-1);el.textContent=t;setTimeout(e,35)}else cb();}e();}
  function cycle(){type(roles[i%roles.length],()=>erase(()=>{i++;cycle();}));}
  cycle();
})();

// ── COUNTERS ──
(function(){
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting)return;
      const el=e.target,target=+el.dataset.target,dur=1800,start=performance.now();
      function step(now){
        const p=Math.min((now-start)/dur,1),ease=1-Math.pow(1-p,3);
        el.textContent=Math.floor(ease*target);
        if(p<1)requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  },{threshold:0.5});
  document.querySelectorAll('.stat-n').forEach(n=>obs.observe(n));
})();

// ── SKILL BARS ──
(function(){
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting)return;
      const fill=e.target.querySelector('.skill-fill');
      if(fill){setTimeout(()=>{fill.style.width=fill.dataset.w+'%'},200);}
      obs.unobserve(e.target);
    });
  },{threshold:0.3});
  document.querySelectorAll('.skill-row').forEach(r=>obs.observe(r));
})();

// ── SCROLL REVEAL ──
(function(){
  const obs=new IntersectionObserver(entries=>{
    entries.forEach((e,i)=>{
      if(e.isIntersecting){
        setTimeout(()=>e.target.classList.add('visible'),i*60);
        obs.unobserve(e.target);
      }
    });
  },{threshold:0.12});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
})();

// ── NAV SCROLL ──
(function(){
  const nav=document.getElementById('nav');
  window.addEventListener('scroll',()=>{
    nav.style.padding=scrollY>60?'10px 60px':'16px 60px';
  });
})();

// ── NAV ACTIVE ──
(function(){
  const links=document.querySelectorAll('.nav-links a');
  const secs=document.querySelectorAll('section[id]');
  window.addEventListener('scroll',()=>{
    let cur='';
    secs.forEach(s=>{if(scrollY>=s.offsetTop-140)cur=s.id;});
    links.forEach(l=>{
      l.style.color=l.getAttribute('href')==='#'+cur?'var(--white)':'';
    });
  });
})();
