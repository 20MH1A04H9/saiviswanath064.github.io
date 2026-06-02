/* =============================================
   VISWA // SOC ANALYST — HACKER WORLD JS
   ============================================= */

// ── CUSTOM CURSOR ──
(function () {
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.id  = 'cursor-dot';
  ring.id = 'cursor-ring';
  document.body.append(dot, ring);

  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animCursor() {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animCursor);
  }
  animCursor();

  document.querySelectorAll('a, button, .hex, .skill-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width  = '56px';
      ring.style.height = '56px';
      ring.style.borderColor = 'var(--green)';
      dot.style.opacity = '0';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width  = '36px';
      ring.style.height = '36px';
      ring.style.borderColor = 'rgba(0,255,136,0.5)';
      dot.style.opacity = '1';
    });
  });
})();


// ── MATRIX RAIN ──
(function () {
  const canvas = document.querySelector('.matrix');
  const ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const chars  = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ@#$%^&*(){}[]<>/\\';
  const size   = 13;
  let columns  = Math.floor(canvas.width / size);
  const drops  = Array(columns).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(13,17,23,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = size + 'px Share Tech Mono';

    for (let i = 0; i < drops.length; i++) {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      // Lead char is bright
      if (drops[i] * size < canvas.height * 0.2) {
        ctx.fillStyle = '#ffffff';
      } else {
        ctx.fillStyle = '#00ff88';
      }
      ctx.globalAlpha = Math.random() * 0.5 + 0.3;
      ctx.fillText(ch, i * size, drops[i] * size);
      ctx.globalAlpha = 1;

      if (drops[i] * size > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }
  setInterval(draw, 45);

  window.addEventListener('resize', () => {
    columns = Math.floor(canvas.width / size);
    drops.length = columns;
    drops.fill(1);
  });
})();


// ── PARTICLE NETWORK ──
(function () {
  const canvas = document.querySelector('.particles');
  const ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const N = 60;
  const particles = Array.from({ length: N }, () => ({
    x:  Math.random() * canvas.width,
    y:  Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r:  Math.random() * 1.5 + 0.5
  }));

  let mouse = { x: -9999, y: -9999 };
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      // Mouse repulsion
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        p.vx += dx / dist * 0.3;
        p.vy += dy / dist * 0.3;
      }
      // Speed limit
      const speed = Math.sqrt(p.vx**2 + p.vy**2);
      if (speed > 1.5) { p.vx *= 1.5/speed; p.vy *= 1.5/speed; }

      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,229,255,0.6)';
      ctx.fill();
    });

    // Connections
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,255,136,${(1 - dist/120) * 0.15})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();


// ── RADAR ──
(function () {
  const canvas = document.getElementById('radar');
  if (!canvas) return;
  const ctx   = canvas.getContext('2d');
  canvas.width = canvas.height = 200;
  const cx = 100, cy = 100, r = 88;
  let angle = 0;

  const threats = Array.from({ length: 6 }, () => ({
    dist: Math.random() * 0.9 + 0.1,
    ang:  Math.random() * Math.PI * 2,
    size: Math.random() * 3 + 1,
    life: Math.random()
  }));

  function draw() {
    ctx.clearRect(0, 0, 200, 200);

    // Background
    ctx.fillStyle = 'rgba(13,17,23,0.8)';
    ctx.beginPath(); ctx.arc(cx, cy, r+2, 0, Math.PI*2); ctx.fill();

    // Rings
    [0.25, 0.5, 0.75, 1].forEach(f => {
      ctx.beginPath();
      ctx.arc(cx, cy, r*f, 0, Math.PI*2);
      ctx.strokeStyle = 'rgba(0,255,136,0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Cross-hairs
    ctx.strokeStyle = 'rgba(0,255,136,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx-r, cy); ctx.lineTo(cx+r, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy-r); ctx.lineTo(cx, cy+r); ctx.stroke();

    // Sweep
    const grad = ctx.createConicalGradient
      ? ctx.createConicalGradient(cx, cy, angle - Math.PI*0.6, angle)
      : null;

    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.clip();

    // Sweep fill (manual)
    const sw = ctx.createLinearGradient(cx, cy, cx + Math.cos(angle)*r, cy + Math.sin(angle)*r);
    sw.addColorStop(0, 'rgba(0,255,136,0.25)');
    sw.addColorStop(1, 'rgba(0,255,136,0)');

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, angle - Math.PI * 0.6, angle);
    ctx.closePath();
    ctx.fillStyle = sw;
    ctx.fill();
    ctx.restore();

    // Sweep line
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle)*r, cy + Math.sin(angle)*r);
    ctx.strokeStyle = 'rgba(0,255,136,0.9)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Threats
    threats.forEach(t => {
      const tx = cx + Math.cos(t.ang) * t.dist * r;
      const ty = cy + Math.sin(t.ang) * t.dist * r;

      // Show blip after sweep passes
      let diff = angle - t.ang;
      while (diff < 0) diff += Math.PI * 2;
      if (diff < Math.PI * 0.6) {
        const alpha = 1 - diff / (Math.PI * 0.6);
        ctx.beginPath();
        ctx.arc(tx, ty, t.size, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,34,68,${alpha})`;
        ctx.shadowColor = '#ff2244';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    // Border
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(0,255,136,0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    angle += 0.025;
    requestAnimationFrame(draw);
  }
  draw();
})();


// ── TERMINAL TYPING ──
(function () {
  const lines = [
    { el: 'cmd1',  text: 'whoami',             delay: 800,  speed: 80 },
    { el: 'out2',  text: 'SOC Analyst // Security Engineer', delay: 1400, speed: 30, show: 'line2' },
    { el: 'out3',  text: '[+] Wazuh SIEM: ONLINE | OpenSearch: SECURE', delay: 2200, speed: 25, show: 'line3' },
    { el: 'out4',  text: '[+] Threats Monitored: 24/7 | Status: ACTIVE', delay: 3200, speed: 25, show: 'line4' },
    { el: 'cmd5',  text: 'cat mission.txt',     delay: 4200, speed: 60, show: 'line5' },
  ];

  function typeText(elId, text, speed, cb) {
    const el = document.getElementById(elId);
    if (!el) return;
    let i = 0;
    function next() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i++);
        setTimeout(next, speed + Math.random() * 30);
      } else if (cb) cb();
    }
    next();
  }

  lines.forEach(l => {
    setTimeout(() => {
      if (l.show) {
        const el = document.getElementById(l.show);
        if (el) el.classList.remove('hidden');
      }
      typeText(l.el, l.text, l.speed);
    }, l.delay);
  });
})();


// ── ROTATING TAG ──
(function () {
  const tags = [
    'Wazuh SIEM Administrator',
    'OpenSearch DLS Engineer',
    'Threat Hunter',
    'SOC Tier 2 Analyst',
    'Security Automation Dev',
    'OTel Pipeline Builder',
  ];
  let idx = 0;
  const el = document.getElementById('rotating-tag');
  if (!el) return;

  function typeTag(text, cb) {
    let i = 0;
    function type() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i++);
        setTimeout(type, 55);
      } else setTimeout(cb, 1800);
    }
    type();
  }
  function eraseTag(cb) {
    let text = el.textContent;
    function erase() {
      if (text.length > 0) {
        text = text.slice(0, -1);
        el.textContent = text;
        setTimeout(erase, 30);
      } else cb();
    }
    erase();
  }
  function cycle() {
    typeTag(tags[idx % tags.length], () => {
      eraseTag(() => { idx++; cycle(); });
    });
  }
  setTimeout(cycle, 2000);
})();


// ── COUNTER ANIMATION ──
(function () {
  const nums = document.querySelectorAll('.stat-num');
  function animCount(el) {
    const target = parseInt(el.dataset.target);
    const dur    = 2000;
    const start  = performance.now();
    function step(now) {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.floor(ease * target).toString().padStart(el.dataset.target.length, '0');
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animCount(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.5 });

  nums.forEach(n => obs.observe(n));
})();


// ── SKILL BARS ──
(function () {
  const cards = document.querySelectorAll('.skill-card');
  const obs   = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        const fill = e.target.querySelector('.skill-fill');
        if (fill) {
          setTimeout(() => { fill.style.width = fill.dataset.width + '%'; }, 400);
        }
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  cards.forEach((c, i) => {
    c.style.transitionDelay = i * 0.1 + 's';
    obs.observe(c);
  });
})();


// ── SCROLL REVEAL ──
(function () {
  const els = document.querySelectorAll('.about-card, .focus-card, .project-card, .contact-btn');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.15 });

  els.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`;
    obs.observe(el);
  });
})();


// ── NAV ACTIVE + SCROLL SHRINK ──
(function () {
  const nav     = document.querySelector('.nav');
  const links   = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.style.padding = '10px 40px';
      nav.style.boxShadow = '0 4px 30px rgba(0,0,0,0.5)';
    } else {
      nav.style.padding = '16px 40px';
      nav.style.boxShadow = 'none';
    }

    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(l => {
      l.style.color = l.getAttribute('href') === `#${current}` ? 'var(--green)' : '';
    });
  });
})();


// ── HEX GRID RANDOM PULSE ──
(function () {
  const hexes = document.querySelectorAll('.hex');
  setInterval(() => {
    const h = hexes[Math.floor(Math.random() * hexes.length)];
    h.style.boxShadow = '0 0 20px rgba(0,255,136,0.4)';
    h.style.borderColor = 'var(--green)';
    h.style.color = 'var(--green)';
    setTimeout(() => {
      if (!h.classList.contains('active')) {
        h.style.boxShadow = '';
        h.style.borderColor = '';
        h.style.color = '';
      }
    }, 600);
  }, 400);
})();


// ── GLITCH ON HOVER ──
document.querySelectorAll('.project-name, .skill-name').forEach(el => {
  el.addEventListener('mouseenter', () => {
    el.style.animation = 'glitch1 0.3s steps(1) 3';
    setTimeout(() => { el.style.animation = ''; }, 900);
  });
});


// ── KONAMI CODE EASTER EGG ──
(function () {
  const code = [38,38,40,40,37,39,37,39,66,65];
  let pos = 0;
  document.addEventListener('keydown', e => {
    if (e.keyCode === code[pos]) {
      pos++;
      if (pos === code.length) {
        pos = 0;
        // Flash the page green
        const flash = document.createElement('div');
        flash.style.cssText = 'position:fixed;inset:0;background:rgba(0,255,136,0.1);z-index:9998;pointer-events:none;animation:flashOut 1s ease forwards;';
        document.body.appendChild(flash);
        const style = document.createElement('style');
        style.textContent = '@keyframes flashOut{to{opacity:0}}';
        document.head.appendChild(style);
        setTimeout(() => flash.remove(), 1000);

        const msg = document.createElement('div');
        msg.textContent = '// ACCESS GRANTED — WELCOME, HACKER';
        msg.style.cssText = `
          position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
          font-family:'Share Tech Mono',monospace;font-size:1.5rem;
          color:var(--green);text-shadow:0 0 30px var(--green);
          z-index:9999;pointer-events:none;
          animation:fadeUp 0.5s ease,flashOut 0.8s ease 2s forwards;
        `;
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 3000);
      }
    } else { pos = 0; }
  });
})();
