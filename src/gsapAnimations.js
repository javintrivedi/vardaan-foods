import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initGSAPAnimations() {
  // 0. Intro Screen Entrance (Plays on load)
  const introTL = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.5 } });

  const introEl = document.getElementById('intro');
  if (introEl) {
    introTL
      .from('.intro-top-text', { opacity: 0, y: 20, duration: 1 })
      .from('.intro-massive-text', { opacity: 0, scale: 1.1, filter: 'blur(10px)', duration: 1.8, ease: 'power2.out' }, '-=0.5')
      .from('.intro-bottom-text', { opacity: 0, y: -20, duration: 1 }, '-=1.2')
      .to('#intro', { opacity: 0, duration: 1, delay: 1, ease: 'power2.inOut', onComplete: () => {
        introEl.style.display = 'none';
        heroTL.play();
      }});
  }

  // 1. Hero Entrance Timeline (Plays after intro)
  const heroTL = gsap.timeline({ 
    paused: true,
    defaults: { ease: 'elastic.out(1, 0.7)', duration: 1.5 } 
  });

  heroTL
    .from('.nav-logo', { opacity: 0, y: -40, duration: 1.2 })
    .from('.nav-links li', { opacity: 0, y: -30, stagger: 0.1, duration: 0.8 }, '-=1.0');

  if (!introEl) {
    heroTL.play();
  }

  heroTL
    .from('.hero-badge', { opacity: 0, scale: 0, rotation: -10, duration: 0.8 })
    .from('.hero-title', { opacity: 0, y: 50, scale: 0.9, duration: 1.2 }, '-=0.6')
    .from('.hero-subtitle', { opacity: 0, y: 30, duration: 1, ease: 'power3.out' }, '-=0.8')
    .from('.hero-cta-group', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, '-=0.8')
    .from('.hero-3d-stage', { opacity: 0, scale: 0.5, rotationY: 45, duration: 1.8 }, '-=1.2')
    .from('.stat-box', { opacity: 0, y: 30, scale: 0.8, stagger: 0.15, duration: 1, ease: 'back.out(1.7)' }, '-=1.0');

  // 2. Layered Scrolling / Pinning (The magic overlapping effect)
  const panels = gsap.utils.toArray('.panel');
  
  panels.forEach((panel, i) => {
    // Explicitly set z-index so subsequent panels scroll OVER previous pinned ones
    gsap.set(panel, { zIndex: i + 10, position: 'relative' });

    // We pin every panel except the last one so they stack over each other
    if (i !== panels.length - 1) {
      const isTall = () => panel.offsetHeight > window.innerHeight;
      
      ScrollTrigger.create({
        trigger: panel,
        start: () => isTall() ? 'bottom bottom' : 'top top',
        pin: true,
        pinSpacing: false, // This makes the next panel scroll OVER the pinned one
      });
      
      // As the next panel scrolls up, scale down and fade out the current pinned panel
      gsap.to(panel, {
        scale: 0.9,
        opacity: 0,
        filter: 'blur(10px)',
        scrollTrigger: {
          trigger: panel,
          start: () => isTall() ? 'bottom bottom' : 'top top',
          end: () => "+=" + window.innerHeight,
          scrub: true
        }
      });
    }
  });

  // 3. Crazy Content Reveals per Panel
  // Shop section products floating up in a wave
  gsap.from('.product-card', {
    scrollTrigger: {
      trigger: '#shop',
      start: 'top 60%',
      end: 'top 20%',
      scrub: 1
    },
    opacity: 0,
    y: 150,
    rotation: 5,
    scale: 0.8,
    stagger: 0.1,
    ease: 'power2.out'
  });

  // Comparison section sliding panels
  gsap.from('.comparison-container', {
    scrollTrigger: {
      trigger: '#comparison',
      start: 'top 70%',
      end: 'center center',
      scrub: 1
    },
    opacity: 0,
    scale: 0.8,
    rotationX: 15,
    transformPerspective: 1000,
  });

  // Process steps staggering with elastic bounce
  gsap.from('.process-card', {
    scrollTrigger: {
      trigger: '#process',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 100,
    rotation: -5,
    stagger: 0.2,
    duration: 1.2,
    ease: 'elastic.out(1, 0.5)'
  });

  // Quiz Banner elegant fade-in
  gsap.from('#quiz-banner .container', {
    scrollTrigger: {
      trigger: '#quiz-banner',
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 40,
    duration: 1.2,
    ease: 'power3.out'
  });

  // FAQ cascading drop
  gsap.from('.faq-item', {
    scrollTrigger: {
      trigger: '#faq',
      start: 'top 70%',
      toggleActions: 'play none none reverse'
    },
    opacity: 0,
    x: -50,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power3.out'
  });

  // 4. Animated Number Counters
  const counterElements = document.querySelectorAll('.counter-val');
  counterElements.forEach((el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';

    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(
          { val: 0 },
          {
            val: target,
            duration: 2.5,
            ease: 'power3.out',
            onUpdate: function () {
              const current = Math.floor(this.targets()[0].val);
              el.textContent = current.toLocaleString() + suffix;
            }
          }
        );
      },
      once: true
    });
  });

  // 5. Interactive 3D Card Tilt Effect (retained for extra polish)
  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height) * 20;
      const rotateY = (x / rect.width) * 20;

      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        ease: 'power1.out',
        duration: 0.3
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        ease: 'power2.out',
        duration: 0.5
      });
    });
  });
}
