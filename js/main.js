/* ========================================
   MAISON NOIR v2
   Lenis + GSAP. Only purposeful motion.
   ======================================== */

(function() {
  'use strict';

  // ---- LOADER ----
  const loader = document.getElementById('loader');
  const counter = document.getElementById('loaderCounter');
  let count = 0;

  function runLoader() {
    if (!loader || !counter) return Promise.resolve();
    return new Promise(resolve => {
      const interval = setInterval(() => {
        count += Math.floor(Math.random() * 8) + 2;
        if (count >= 100) {
          count = 100;
          counter.textContent = count;
          clearInterval(interval);
          setTimeout(() => {
            loader.classList.add('is-done');
            setTimeout(resolve, 600);
          }, 300);
          return;
        }
        counter.textContent = count;
      }, 40);
    });
  }

  // ---- LENIS SMOOTH SCROLL ----
  let lenis;

  function initLenis() {
    if (typeof Lenis === 'undefined') return;
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // ---- HERO ENTRANCE ----
  function initHero() {
    const title = document.querySelector('.hero-title');
    const sub = document.querySelector('.hero-sub');
    const img = document.querySelector('.hero-img');
    if (!title) return;

    const tl = gsap.timeline({ delay: 0.1 });

    tl.to(title, {
      clipPath: 'inset(0 0 0% 0)',
      duration: 1.2,
      ease: 'power3.out',
    })
    .to(sub, {
      opacity: 0.6,
      duration: 0.8,
      ease: 'power2.out',
    }, '-=0.5');

    // Parallax on hero image
    if (img) {
      gsap.to(img, {
        yPercent: 12,
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
    }
  }

  // ---- SCROLL REVEALS ----
  function initReveals() {
    // Fade up elements
    const fadeEls = document.querySelectorAll(
      '.intro-text, .editorial-text .label, .editorial-text h2, .editorial-text p, ' +
      '.collection-header .label, .collection-header h2, .product, ' +
      '.quote p, .newsletter-inner > *, .footer-top'
    );

    fadeEls.forEach((el, i) => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        }
      });
    });

    // Image reveals with clip-path
    const images = document.querySelectorAll('.img-wrap');
    images.forEach(wrap => {
      gsap.from(wrap, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: wrap,
          start: 'top 85%',
          once: true,
        }
      });

      // Subtle parallax on editorial images
      const img = wrap.querySelector('img');
      if (img) {
        gsap.to(img, {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        });
      }
    });

    // Product stagger per row
    const products = document.querySelectorAll('.product');
    if (products.length) {
      gsap.from(products, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: '.collection-grid',
          start: 'top 80%',
          once: true,
        }
      });
    }
  }

  // ---- LOOKBOOK DRAG SCROLL ----
  function initLookbook() {
    const track = document.querySelector('.lookbook-track');
    if (!track) return;

    let isDown = false;
    let startX, scrollStart;

    track.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX;
      scrollStart = track.scrollLeft || 0;
      track.style.cursor = 'grabbing';
    });

    window.addEventListener('mouseup', () => {
      isDown = false;
      if (track) track.style.cursor = 'grab';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const dx = e.pageX - startX;
      // Use GSAP horizontal scroll instead of scrollLeft for Lenis compat
      gsap.to(track, {
        x: dx,
        duration: 0,
        overwrite: true,
      });
    });

    // Horizontal scroll-triggered movement
    const items = track.querySelectorAll('.lookbook-item');
    if (items.length) {
      const totalScroll = track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: () => -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: '.lookbook',
          start: 'top top',
          end: () => '+=' + totalScroll,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });
    }
  }

  // ---- NEWSLETTER FORM ----
  function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (input) {
        input.value = '';
        input.placeholder = 'Thank you';
        setTimeout(() => {
          input.placeholder = 'Email address';
        }, 2000);
      }
    });
  }

  // ---- INIT ----
  async function init() {
    gsap.registerPlugin(ScrollTrigger);
    await runLoader();
    initLenis();
    initHero();
    initReveals();
    initLookbook();
    initNewsletter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();