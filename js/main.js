/* ========================================
   MAISON NOIR — Main JavaScript
   GSAP ScrollTrigger + Lenis Smooth Scroll
   ======================================== */

(function() {
  'use strict';

  // ====== LENIS SMOOTH SCROLL ======
  let lenis;
  function initLenis() {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // ====== CUSTOM CURSOR ======
  function initCursor() {
    const cursor = document.getElementById('cursor');
    if (!cursor || window.matchMedia('(pointer: coarse)').matches) return;

    const dot = cursor.querySelector('.cursor-dot');
    const ring = cursor.querySelector('.cursor-ring');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      // Dot follows instantly
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      dot.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

      // Ring follows with lag
      ringX += (mouseX - ringX) * 0.08;
      ringY += (mouseY - ringY) * 0.08;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover states
    const hoverElements = document.querySelectorAll('a, button, .fc-card, .bento-item');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
  }

  // ====== PRELOADER ======
  function initPreloader() {
    return new Promise((resolve) => {
      const preloader = document.getElementById('preloader');
      const counter = document.getElementById('preloader-num');
      if (!preloader) { resolve(); return; }

      let count = 0;
      const interval = setInterval(() => {
        count += Math.floor(Math.random() * 8) + 2;
        if (count >= 100) {
          count = 100;
          clearInterval(interval);
          counter.textContent = count;
          
          setTimeout(() => {
            gsap.to(preloader, {
              yPercent: -100,
              duration: 1,
              ease: 'power4.inOut',
              onComplete: () => {
                preloader.style.display = 'none';
                resolve();
              }
            });
          }, 300);
        }
        counter.textContent = count;
      }, 40);
    });
  }

  // ====== HERO ANIMATIONS ======
  function initHero() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Title words reveal
    tl.to('.hero-title-word', {
      y: 0,
      duration: 1.2,
      stagger: 0.15,
    })
    .to('.hero-eyebrow', {
      opacity: 1,
      y: 0,
      duration: 0.8,
    }, '-=0.6')
    .to('.hero-subtitle', {
      opacity: 1,
      y: 0,
      duration: 0.8,
    }, '-=0.5')
    .to('.hero-ctas', {
      opacity: 1,
      y: 0,
      duration: 0.8,
    }, '-=0.4');

    // Parallax on hero image
    gsap.to('.hero-bg-img', {
      yPercent: 20,
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

  // ====== SCROLL ANIMATIONS ======
  function initScrollAnimations() {
    // Section labels fade in
    gsap.utils.toArray('.section-label').forEach(label => {
      gsap.from(label, {
        opacity: 0,
        x: -30,
        duration: 0.8,
        scrollTrigger: {
          trigger: label,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      });
    });

    // Section titles
    gsap.utils.toArray('.section-title').forEach(title => {
      gsap.from(title, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      });
    });

    // Editorial heading lines
    gsap.utils.toArray('.line-reveal').forEach(line => {
      gsap.from(line, {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: line,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      });
    });

    // Editorial description
    gsap.from('.editorial-desc', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.editorial-desc',
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });

    // Editorial image parallax
    const editorialImg = document.querySelector('.editorial-img-wrap[data-speed]');
    if (editorialImg) {
      gsap.to(editorialImg.querySelector('img'), {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: editorialImg,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
    }

    // Image break parallax
    const imageBreakInner = document.querySelector('.image-break-inner');
    if (imageBreakInner) {
      gsap.to(imageBreakInner, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: '.image-break',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
    }

    // Quote text reveal
    gsap.from('.quote-text', {
      opacity: 0,
      y: 40,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.image-break-text',
        start: 'top 75%',
        toggleActions: 'play none none none',
      }
    });

    gsap.from('.quote-author', {
      opacity: 0,
      duration: 0.8,
      delay: 0.3,
      scrollTrigger: {
        trigger: '.image-break-text',
        start: 'top 75%',
        toggleActions: 'play none none none',
      }
    });

    // Bento items
    gsap.utils.toArray('.bento-item').forEach((item, i) => {
      gsap.from(item, {
        opacity: 0,
        y: 60,
        scale: 0.95,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      });
    });

    // Press logos
    gsap.utils.toArray('.press-logo').forEach((logo, i) => {
      gsap.from(logo, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: i * 0.1,
        scrollTrigger: {
          trigger: '.press-logos',
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      });
    });

    // Press quote
    gsap.from('.press-quote p', {
      opacity: 0,
      y: 30,
      duration: 1,
      scrollTrigger: {
        trigger: '.press-quote',
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });

    // Newsletter
    gsap.from('.newsletter-heading', {
      opacity: 0,
      y: 40,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.newsletter',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });

    gsap.from('.newsletter-form', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: 0.2,
      scrollTrigger: {
        trigger: '.newsletter',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });

    // Footer columns
    gsap.utils.toArray('.footer-col').forEach((col, i) => {
      gsap.from(col, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        delay: i * 0.1,
        scrollTrigger: {
          trigger: '.footer-top',
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      });
    });
  }

  // ====== FEATURED COLLECTION HORIZONTAL SCROLL ======
  function initHorizontalScroll() {
    const track = document.querySelector('.fc-track');
    const progressBar = document.querySelector('.fc-progress-bar');
    if (!track) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    // Mouse drag
    track.addEventListener('mousedown', (e) => {
      isDown = true;
      track.style.cursor = 'grabbing';
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.parentElement.scrollLeft;
    });
    track.addEventListener('mouseleave', () => { isDown = false; track.style.cursor = 'grab'; });
    track.addEventListener('mouseup', () => { isDown = false; track.style.cursor = 'grab'; });
    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      track.parentElement.scrollLeft = scrollLeft - walk;
    });

    // Scroll-driven horizontal movement with GSAP
    const cards = track.querySelectorAll('.fc-card');
    if (cards.length > 0) {
      // Stagger card entrance
      gsap.from(cards, {
        opacity: 0,
        y: 60,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.featured-collection',
          start: 'top 75%',
          toggleActions: 'play none none none',
        }
      });
    }

    // Update progress bar on scroll
    const scrollWrap = document.querySelector('.fc-scroll-wrap');
    if (scrollWrap) {
      scrollWrap.addEventListener('scroll', () => {
        const scrollPercent = scrollWrap.scrollLeft / (scrollWrap.scrollWidth - scrollWrap.clientWidth);
        if (progressBar) {
          progressBar.style.width = `${Math.max(5, scrollPercent * 100)}%`;
        }
      });

      // Make fc-scroll-wrap actually scrollable horizontally
      scrollWrap.style.overflowX = 'auto';
      scrollWrap.style.scrollbarWidth = 'none';
      scrollWrap.style.msOverflowStyle = 'none';
    }
  }

  // ====== NAVIGATION ======
  function initNav() {
    const nav = document.getElementById('nav');
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    // Scroll state
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const current = window.scrollY;
      if (current > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }

      // Hide/show on scroll direction
      if (current > lastScroll && current > 200) {
        nav.style.transform = 'translateY(-100%)';
      } else {
        nav.style.transform = 'translateY(0)';
      }
      lastScroll = current;
    });

    // Mobile menu toggle
    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        if (lenis) {
          mobileMenu.classList.contains('open') ? lenis.stop() : lenis.start();
        }
      });
    }
  }

  // ====== SEARCH OVERLAY ======
  function initSearch() {
    const searchBtn = document.querySelector('.nav-search-btn');
    const overlay = document.getElementById('searchOverlay');
    const closeBtn = document.getElementById('searchClose');
    const input = overlay ? overlay.querySelector('.search-input') : null;

    if (!searchBtn || !overlay) return;

    searchBtn.addEventListener('click', () => {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
      setTimeout(() => { if (input) input.focus(); }, 300);
    });

    function closeSearch() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    }

    if (closeBtn) closeBtn.addEventListener('click', closeSearch);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeSearch();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeSearch();
    });
  }

  // ====== CART DRAWER ======
  function initCart() {
    const cartBtn = document.querySelector('.nav-cart-btn');
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    const closeBtn = document.getElementById('cartClose');
    const continueBtn = drawer ? drawer.querySelector('.cart-continue') : null;
    const cartCountEl = document.querySelector('.cart-count');
    const cartItemCountEl = drawer ? drawer.querySelector('.cart-item-count') : null;
    const cartItemsEl = drawer ? drawer.querySelector('.cart-items') : null;
    const cartEmptyEl = drawer ? drawer.querySelector('.cart-empty') : null;
    const subtotalEl = drawer ? drawer.querySelector('.cart-subtotal-price') : null;

    let cart = [];

    function openCart() {
      if (drawer) drawer.classList.add('open');
      if (overlay) overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
    }

    function closeCart() {
      if (drawer) drawer.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    }

    function updateCartUI() {
      const count = cart.length;
      if (cartCountEl) {
        cartCountEl.textContent = count;
        cartCountEl.classList.toggle('visible', count > 0);
      }
      if (cartItemCountEl) {
        cartItemCountEl.textContent = `${count} Item${count !== 1 ? 's' : ''}`;
      }
      if (cartEmptyEl) cartEmptyEl.style.display = count > 0 ? 'none' : 'block';

      const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
      if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString()}.00`;

      if (cartItemsEl) {
        cartItemsEl.innerHTML = cart.map((item, i) => `
          <div class="cart-item">
            <div class="cart-item-img">
              <div style="width:100%;height:100%;background:var(--charcoal);display:flex;align-items:center;justify-content:center;font-size:0.5rem;color:var(--muted);text-transform:uppercase;letter-spacing:0.1em;">MN</div>
            </div>
            <div class="cart-item-details">
              <span class="cart-item-name">${item.name}</span>
              <span class="cart-item-meta">One Size</span>
              <span class="cart-item-price">$${item.price.toLocaleString()}.00</span>
            </div>
            <button class="cart-item-remove" data-index="${i}">Remove</button>
          </div>
        `).join('');

        // Remove buttons
        cartItemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.index);
            cart.splice(idx, 1);
            updateCartUI();
          });
        });
      }
    }

    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (closeBtn) closeBtn.addEventListener('click', closeCart);
    if (overlay) overlay.addEventListener('click', closeCart);
    if (continueBtn) continueBtn.addEventListener('click', closeCart);

    // Quick add buttons
    document.querySelectorAll('.fc-quick-add').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const name = btn.dataset.name;
        const price = parseInt(btn.dataset.price);
        cart.push({ name, price });
        updateCartUI();
        openCart();

        // Button feedback
        const orig = btn.textContent;
        btn.textContent = 'Added!';
        btn.style.background = 'var(--accent)';
        btn.style.color = 'var(--black)';
        btn.style.borderColor = 'var(--accent)';
        setTimeout(() => {
          btn.textContent = orig;
          btn.style.background = '';
          btn.style.color = '';
          btn.style.borderColor = '';
        }, 1200);
      });
    });

    updateCartUI();
  }

  // ====== NEWSLETTER FORM ======
  function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      const btn = form.querySelector('.newsletter-submit');
      if (input && input.value) {
        input.value = '';
        input.placeholder = 'Welcome to the Inner Circle';
        if (btn) {
          btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
          setTimeout(() => {
            btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
            input.placeholder = 'Your email address';
          }, 3000);
        }
      }
    });
  }

  // ====== MAGNETIC BUTTONS (luxury micro-interaction) ======
  function initMagneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    document.querySelectorAll('.btn-primary, .bento-arrow, .social-link').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => { btn.style.transition = ''; }, 500);
      });
    });
  }

  // ====== INIT EVERYTHING ======
  async function init() {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Start preloader
    await initPreloader();

    // Init Lenis smooth scroll
    initLenis();

    // Init all modules
    initCursor();
    initHero();
    initScrollAnimations();
    initHorizontalScroll();
    initNav();
    initSearch();
    initCart();
    initNewsletter();
    initMagneticButtons();

    // Refresh ScrollTrigger after everything loaded
    ScrollTrigger.refresh();
  }

  // Wait for DOM + scripts
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Small delay to ensure GSAP/Lenis are loaded (deferred scripts)
      setTimeout(init, 100);
    });
  } else {
    setTimeout(init, 100);
  }

})();
