/* ============================================
   MAISON NOIR v3 - Interactions
   ============================================ */

(function() {
  'use strict';

  // ---- LOADER ----
  var loader = document.getElementById('loader');
  var hero = document.querySelector('.hero');

  window.addEventListener('load', function() {
    setTimeout(function() {
      loader.classList.add('done');
      setTimeout(function() {
        hero.classList.add('loaded');
        revealHero();
      }, 300);
    }, 1800);
  });

  function revealHero() {
    var heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.classList.add('revealed');
    }
  }

  // ---- CUSTOM CURSOR ----
  var cursor = document.getElementById('cursor');
  var cursorTrail = document.getElementById('cursor-trail');
  var mouseX = 0, mouseY = 0;
  var cursorX = 0, cursorY = 0;
  var trailX = 0, trailY = 0;

  if (cursor && cursorTrail && window.innerWidth > 768) {
    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';

      trailX += (mouseX - trailX) * 0.08;
      trailY += (mouseY - trailY) * 0.08;
      cursorTrail.style.left = trailX + 'px';
      cursorTrail.style.top = trailY + 'px';

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    var hoverTargets = document.querySelectorAll('a, button, .collection-item, .editorial-img-wrap');
    hoverTargets.forEach(function(el) {
      el.addEventListener('mouseenter', function() { cursor.classList.add('hovering'); });
      el.addEventListener('mouseleave', function() { cursor.classList.remove('hovering'); });
    });
  }

  // ---- MENU TOGGLE ----
  var menuBtn = document.getElementById('menuBtn');
  var fullMenu = document.getElementById('fullMenu');

  if (menuBtn && fullMenu) {
    menuBtn.addEventListener('click', function() {
      menuBtn.classList.toggle('active');
      fullMenu.classList.toggle('open');
      document.body.style.overflow = fullMenu.classList.contains('open') ? 'hidden' : '';
    });

    fullMenu.querySelectorAll('.menu-link').forEach(function(link) {
      link.addEventListener('click', function() {
        menuBtn.classList.remove('active');
        fullMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- SCROLL REVEAL ----
  var revealElements = document.querySelectorAll('.scroll-reveal');

  var revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(function(el) { revealObserver.observe(el); });

  // ---- PARALLAX ON COLLECTION ITEMS ----
  var collectionItems = document.querySelectorAll('.collection-item');

  function parallaxScroll() {
    collectionItems.forEach(function(item) {
      var speed = parseFloat(item.dataset.speed) || 1;
      var rect = item.getBoundingClientRect();
      var center = rect.top + rect.height / 2;
      var viewCenter = window.innerHeight / 2;
      var offset = (center - viewCenter) * (speed - 1) * 0.3;
      item.style.transform = 'translateY(' + offset + 'px)';
    });
    requestAnimationFrame(parallaxScroll);
  }

  if (window.innerWidth > 768) {
    parallaxScroll();
  }

  // ---- NAV ON SCROLL ----
  var nav = document.getElementById('nav');
  var lastScroll = 0;

  window.addEventListener('scroll', function() {
    var currentScroll = window.scrollY;

    if (currentScroll > 100) {
      nav.style.padding = '1rem 3rem';
    } else {
      nav.style.padding = '1.5rem 3rem';
    }

    if (currentScroll > lastScroll && currentScroll > 500) {
      nav.style.transform = 'translateY(-100%)';
    } else {
      nav.style.transform = 'translateY(0)';
    }

    nav.style.transition = 'transform 0.4s ease, padding 0.3s ease';
    lastScroll = currentScroll;
  });

  // ---- SMOOTH ANCHOR SCROLL ----
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- IMAGE LAZY LOAD WITH FADE ----
  var images = document.querySelectorAll('.item-img-wrap img, .editorial-img-wrap img, .editorial-wide img');

  var imageObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var img = entry.target;
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.8s ease';

        if (img.complete) {
          img.style.opacity = '1';
        } else {
          img.addEventListener('load', function() {
            img.style.opacity = '1';
          });
        }
        imageObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '200px'
  });

  images.forEach(function(img) {
    img.style.opacity = '0';
    imageObserver.observe(img);
  });

  // ---- COLLECTION ITEM STAGGER ----
  var gridObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry, i) {
      if (entry.isIntersecting) {
        setTimeout(function() {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 120);
        gridObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  collectionItems.forEach(function(item) {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    gridObserver.observe(item);
  });

  // ---- NEWSLETTER FORM ----
  var form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var input = form.querySelector('.contact-input');
      var btn = form.querySelector('.contact-btn');

      if (input.value.indexOf('@') !== -1) {
        btn.textContent = 'Welcome';
        btn.style.background = 'var(--accent)';
        btn.style.borderColor = 'var(--accent)';
        input.value = '';

        setTimeout(function() {
          btn.textContent = 'Join';
          btn.style.background = '';
          btn.style.borderColor = '';
        }, 3000);
      }
    });
  }

  // ---- HERO IMAGE PARALLAX ----
  var heroImg = document.querySelector('.hero-bg img');

  if (heroImg && window.innerWidth > 768) {
    window.addEventListener('scroll', function() {
      var scrollY = window.scrollY;
      var heroHeight = hero.offsetHeight;

      if (scrollY < heroHeight) {
        var progress = scrollY / heroHeight;
        heroImg.style.transform = 'scale(' + (1 + progress * 0.1) + ') translateY(' + (scrollY * 0.3) + 'px)';
      }
    });
  }

})();