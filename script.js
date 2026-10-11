/* =====================================================
   PRANESH R V — PORTFOLIO SCRIPTS
   Vanilla JS only — no frameworks/dependencies
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- PRELOADER ---------------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hide'), 400);
  });

  /* ---------------- CUSTOM CURSOR ---------------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  function animateRing(){
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .skill-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.style.transform = 'translate(-50%,-50%) scale(1.6)');
    el.addEventListener('mouseleave', () => cursorRing.style.transform = 'translate(-50%,-50%) scale(1)');
  });

  /* ---------------- SCROLL PROGRESS BAR ---------------- */
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';
  }

  /* ---------------- NAVBAR SCROLL STATE + ACTIVE LINK ---------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id], main#home');
  const backToTop = document.getElementById('backToTop');

  function onScroll(){
    updateScrollProgress();

    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    if (window.scrollY > 500) backToTop.classList.add('show');
    else backToTop.classList.remove('show');

    let current = 'home';
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  backToTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

  /* ---------------- HAMBURGER MENU ---------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinksList = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinksList.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  navLinksList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinksList.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------- TYPING EFFECT ---------------- */
  const typedTextEl = document.getElementById('typedText');
  const phrases = ['Computer Science Student', 'Linux Learner', 'Web Developer', 'Problem Solver'];
  let phraseIndex = 0, charIndex = 0, isDeleting = false;

  function typeLoop(){
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting){
      charIndex++;
      typedTextEl.textContent = currentPhrase.substring(0, charIndex);
      if (charIndex === currentPhrase.length){
        isDeleting = true;
        setTimeout(typeLoop, 1500);
        return;
      }
    } else {
      charIndex--;
      typedTextEl.textContent = currentPhrase.substring(0, charIndex);
      if (charIndex === 0){
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }
    setTimeout(typeLoop, isDeleting ? 45 : 85);
  }
  typeLoop();

  /* ---------------- SCROLL REVEAL (IntersectionObserver) ---------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------- SKILL PROGRESS BARS + COUNTERS ---------------- */
  const skillsSection = document.getElementById('skills');
  let skillsAnimated = false;

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !skillsAnimated){
        skillsAnimated = true;
        document.querySelectorAll('.progress-fill').forEach(bar => {
          bar.style.width = bar.dataset.percent + '%';
        });
      }
    });
  }, { threshold: 0.3 });
  if (skillsSection) skillObserver.observe(skillsSection);

  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;
  const aboutSection = document.getElementById('about');

  function animateCounters(){
    statNumbers.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 60));
      const tick = () => {
        current += step;
        if (current >= target){
          el.textContent = target;
        } else {
          el.textContent = current;
          requestAnimationFrame(tick);
        }
      };
      tick();
    });
  }
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated){
        statsAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.4 });
  if (aboutSection) statsObserver.observe(aboutSection);

  /* ---------------- PROJECT FILTERING ---------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const categories = card.dataset.category.split(' ');
        const show = filter === 'all' || categories.includes(filter);
        card.classList.toggle('hidden-project', !show);
      });
    });
  });

  /* ---------------- BUTTON RIPPLE EFFECT ---------------- */
  document.querySelectorAll('.btn, .filter-btn, .btn-mini').forEach(btn => {
    btn.style.position = btn.style.position || 'relative';
    btn.style.overflow = 'hidden';
    btn.addEventListener('click', function(e){
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------------- CONTACT FORM (front-end only demo) ---------------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formStatus.textContent = 'Sending message...';
    setTimeout(() => {
      formStatus.textContent = "Thanks! Your message has been noted — I'll get back to you soon.";
      contactForm.reset();
    }, 900);
  });

  /* ---------------- PARTICLE BACKGROUND (canvas) ---------------- */
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height;

  function resizeCanvas(){
    width = canvas.width = window.innerWidth;
    height = canvas.height = document.documentElement.scrollHeight;
  }

  function createParticles(){
    const count = Math.min(90, Math.floor((window.innerWidth * window.innerHeight) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      hue: Math.random() > 0.5 ? '59,130,246' : '139,92,246',
      alpha: Math.random() * 0.5 + 0.2
    }));
  }

  function drawParticles(){
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.hue},${p.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${p.hue},0.8)`;
      ctx.fill();
    });
    requestAnimationFrame(drawParticles);
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion){
    resizeCanvas();
    createParticles();
    drawParticles();
    window.addEventListener('resize', () => { resizeCanvas(); createParticles(); });
  }

});
