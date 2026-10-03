import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Detect if device is low-power (mobile or prefers-reduced-motion)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.innerWidth < 768;

export function initGSAPAnimations() {
  // ─── 0. Intro Screen ──────────────────────────────────────────────────────
  const introEl = document.getElementById('intro');
  const heroTL = gsap.timeline({
    paused: true,
    defaults: { ease: 'power3.out', duration: 1.2 }
  });

  heroTL
    .from('.nav-logo', { opacity: 0, y: -30, duration: 1 })
    .from('.nav-links li', { opacity: 0, y: -20, stagger: 0.08, duration: 0.6 }, '-=0.8')
    .from('.hero-badge',     { opacity: 0, scale: 0.8, duration: 0.6 }, '-=0.4')
    .from('.hero-title',     { opacity: 0, y: 40, duration: 1 }, '-=0.5')
    .from('.hero-subtitle',  { opacity: 0, y: 20, duration: 0.8 }, '-=0.7')
    .from('.hero-cta-group', { opacity: 0, y: 20, duration: 0.6 }, '-=0.6')
    .from('.hero-3d-stage',  { opacity: 0, scale: 0.85, duration: 1.2 }, '-=0.8')
    .from('.stat-box',       { opacity: 0, y: 20, stagger: 0.1, duration: 0.7, ease: 'back.out(1.4)' }, '-=0.8');

  if (introEl) {
    const introTL = gsap.timeline({ defaults: { ease: 'power3.out' } });
    introTL
      .from('.intro-top-text', { opacity: 0, y: 20, duration: 0.8 })
      .fromTo('.intro-logo',
        { opacity: 0, scale: 2.4, filter: 'blur(10px)' },
        { opacity: 1, scale: 1,   filter: 'blur(0px)', duration: 1.6, ease: 'power2.out' },
        '-=0.4'
      )
      .from('.intro-tagline', { opacity: 0, y: 16, duration: 0.8 }, '-=0.8')
      .to('#intro', {
        opacity: 0, duration: 0.8, delay: 0.6, ease: 'power2.inOut',
        onComplete: () => { introEl.style.display = 'none'; heroTL.play(); }
      });
  } else {
    heroTL.play();
  }

  // ─── 1. Layered Panel Scrolling ────────────────────────────────────────────
  // Only run on non-mobile to avoid complexity on small screens
  if (!isMobile) {
    const panels = gsap.utils.toArray('.panel');
    panels.forEach((panel, i) => {
      gsap.set(panel, { zIndex: i + 10, position: 'relative' });

      if (i !== panels.length - 1) {
        const isTall = () => panel.offsetHeight > window.innerHeight;

        ScrollTrigger.create({
          trigger: panel,
          start: () => isTall() ? 'bottom bottom' : 'top top',
          pin: true,
          pinSpacing: false,
        });

        if (!prefersReducedMotion) {
          gsap.to(panel, {
            scale: 0.92,
            opacity: 0,
            filter: 'blur(8px)',
            scrollTrigger: {
              trigger: panel,
              start: () => isTall() ? 'bottom bottom' : 'top top',
              end: () => '+=' + window.innerHeight,
              scrub: true
            }
          });
        }
      }
    });
  }

  // ─── 2. Section Content Reveals ────────────────────────────────────────────
  if (!prefersReducedMotion) {
    // Products
    gsap.from('.product-card', {
      scrollTrigger: { trigger: '#shop', start: 'top 65%', end: 'top 20%', scrub: 1 },
      opacity: 0, y: 80, scale: 0.9, stagger: 0.08
    });

    // Comparison
    gsap.from('.comparison-container', {
      scrollTrigger: { trigger: '#comparison', start: 'top 70%', end: 'center center', scrub: 1 },
      opacity: 0, scale: 0.85
    });

    // Process cards (now using inline div selector)
    gsap.from('#process .process-grid > div', {
      scrollTrigger: { trigger: '#process', start: 'top 75%', toggleActions: 'play none none reverse' },
      opacity: 0, y: 60, stagger: 0.15, duration: 1, ease: 'power2.out'
    });

    // Quiz banner
    gsap.from('#quiz-banner .container', {
      scrollTrigger: { trigger: '#quiz-banner', start: 'top 75%', toggleActions: 'play none none reverse' },
      opacity: 0, y: 40, duration: 1, ease: 'power3.out'
    });

    // FAQ
    gsap.from('.faq-item', {
      scrollTrigger: { trigger: '#faq', start: 'top 70%', toggleActions: 'play none none reverse' },
      opacity: 0, x: -40, stagger: 0.12, duration: 0.7, ease: 'power3.out'
    });

    // Reviews section heading
    gsap.from('#reviews .section-head', {
      scrollTrigger: { trigger: '#reviews', start: 'top 70%', toggleActions: 'play none none reverse' },
      opacity: 0, y: 30, duration: 0.8
    });
  }

  // ─── 3. Number Counters ────────────────────────────────────────────────────
  document.querySelectorAll('.counter-val').forEach((el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.floor(this.targets()[0].val).toLocaleString() + suffix;
          }
        });
      }
    });
  });

  // ─── 4. Tilt Effect (desktop only) ────────────────────────────────────────
  if (!isMobile) {
    document.querySelectorAll('.tilt-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(card, {
          rotateX: (-y / rect.height) * 14,
          rotateY: (x / rect.width) * 14,
          transformPerspective: 1000,
          ease: 'power1.out',
          duration: 0.3
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, ease: 'power2.out', duration: 0.5 });
      });
    });
  }
}
