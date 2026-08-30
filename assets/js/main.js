/**
 * Interactive Scripts for MSD-99 Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Interactive Neural Network Canvas Background
  initParticleCanvas();

  // 2. Navigation Scroll & Active Link Tracking
  initNavbar();

  // 3. Project Filter Tabs
  initProjectFilters();

  // 4. Back to Top Button
  initBackToTop();

  // 5. Scroll Reveal Animations
  initScrollReveal();
});

/* ==========================================================================
   1. Neural Particle Canvas Background
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 15), 85);
  const maxDistance = 140;

  const mouse = { x: null, y: null, radius: 160 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 1.8 + 1;
      this.color = Math.random() > 0.4 ? '#38bdf8' : '#818cf8';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse repulsion/interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2.5;
          this.y -= (dy / dist) * force * 2.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = 1 - dist / maxDistance;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha * 0.25})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. Navigation Bar
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          links.forEach((l) => l.classList.remove('active'));
          navLink.classList.add('active');
        }
      }
    });
  });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });

    links.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
      });
    });
  }
}

/* ==========================================================================
   3. Project Filter Tabs
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   5. Scroll Reveal Observer
   ========================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.section, .hero-content, .hero-visual, .seq-card, .research-card, .project-card, .cert-card, .contact-card');
  
  elements.forEach((el) => el.classList.add('reveal-on-scroll'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   6. Interactive IDE Card Tabs & Live Simulation Execution
   ========================================================================== */
function initIdeCard() {
  const tabs = document.querySelectorAll('.ide-tab');
  const panes = document.querySelectorAll('.tab-pane');
  const runBtn = document.getElementById('run-sim-btn');
  const consoleEl = document.getElementById('sim-console');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      panes.forEach((p) => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  if (runBtn && consoleEl) {
    runBtn.addEventListener('click', () => {
      consoleEl.classList.toggle('active');
      if (consoleEl.classList.contains('active')) {
        runBtn.innerHTML = '<i class="fa-solid fa-rotate"></i> Running...';
        runBtn.style.background = 'rgba(56, 189, 248, 0.2)';
        runBtn.style.color = '#38bdf8';
        
        setTimeout(() => {
          runBtn.innerHTML = '<i class="fa-solid fa-check"></i> Executed';
          runBtn.style.background = 'rgba(16, 185, 129, 0.2)';
          runBtn.style.color = '#34d399';
        }, 600);
      } else {
        runBtn.innerHTML = '<i class="fa-solid fa-play"></i> Run Agent';
        runBtn.style.background = 'rgba(16, 185, 129, 0.15)';
        runBtn.style.color = '#34d399';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initIdeCard();
});
