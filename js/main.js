/* ============================================
   MAISON NOIR v3 - Full Interactions
   ============================================ */
(function() {
  'use strict';

  // ---- LOADER ----
  var loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', function() {
      setTimeout(function() {
        loader.classList.add('done');
        var heroContent = document.querySelector('.hero-content');
        if (heroContent) {
          setTimeout(function() { heroContent.classList.add('revealed'); }, 300);
        }
      }, 1800);
    });
  }

  // ---- CUSTOM CURSOR ----
  var cursor = document.getElementById('cursor');
  var cursorTrail = document.getElementById('cursor-trail');
  var mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0, trailX = 0, trailY = 0;

  if (cursor && cursorTrail && window.innerWidth > 768) {
    document.addEventListener('mousemove', function(e) { mouseX = e.clientX; mouseY = e.clientY; });
    (function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      trailX += (mouseX - trailX) * 0.08;
      trailY += (mouseY - trailY) * 0.08;
      cursorTrail.style.left = trailX + 'px';
      cursorTrail.style.top = trailY + 'px';
      requestAnimationFrame(animateCursor);
    })();
    document.querySelectorAll('a, button, .collection-item, .product-card, .lookbook-item, .editorial-img-wrap, .journal-card, .journal-article, .craft-card').forEach(function(el) {
      el.addEventListener('mouseenter', function() { cursor.classList.add('hovering'); });
      el.addEventListener('mouseleave', function() { cursor.classList.remove('hovering'); });
    });
  }

  // ---- PAGE TRANSITIONS ----
  var pageTransition = document.getElementById('pageTransition');
  document.querySelectorAll('.page-link').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (!href || href === '#' || href.startsWith('#')) return;
      e.preventDefault();
      if (pageTransition) {
        pageTransition.classList.add('active');
        setTimeout(function() { window.location.href = href; }, 500);
      } else {
        window.location.href = href;
      }
    });
  });

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
  if (revealElements.length) {
    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealElements.forEach(function(el) { revealObserver.observe(el); });
  }

  // ---- NAV SCROLL BEHAVIOR ----
  var nav = document.getElementById('nav');
  var lastScroll = 0;
  if (nav) {
    window.addEventListener('scroll', function() {
      var s = window.scrollY;
      nav.style.padding = s > 100 ? '1rem 3rem' : '1.5rem 3rem';
      if (window.innerWidth <= 768) nav.style.padding = s > 100 ? '0.8rem 1.5rem' : '1rem 1.5rem';
      nav.style.transform = (s > lastScroll && s > 500) ? 'translateY(-100%)' : 'translateY(0)';
      nav.style.transition = 'transform 0.4s ease, padding 0.3s ease';
      lastScroll = s;
    });
  }

  // ---- PARALLAX (HOME COLLECTION ITEMS) ----
  var collectionItems = document.querySelectorAll('.collection .collection-item');
  if (collectionItems.length && window.innerWidth > 768) {
    (function parallax() {
      collectionItems.forEach(function(item) {
        var speed = parseFloat(item.dataset.speed) || 1;
        var rect = item.getBoundingClientRect();
        var offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * (speed - 1) * 0.3;
        item.style.transform = 'translateY(' + offset + 'px)';
      });
      requestAnimationFrame(parallax);
    })();
  }

  // ---- HERO IMAGE PARALLAX ----
  var heroImg = document.querySelector('.hero-bg img');
  var hero = document.querySelector('.hero');
  if (heroImg && hero && window.innerWidth > 768) {
    window.addEventListener('scroll', function() {
      var s = window.scrollY;
      if (s < hero.offsetHeight) {
        heroImg.style.transform = 'scale(' + (1.05 + s * 0.0001) + ') translateY(' + (s * 0.3) + 'px)';
      }
    });
  }

  // ---- COLLECTION STAGGER ----
  var gridItems = document.querySelectorAll('.collection .collection-item');
  if (gridItems.length) {
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
    }, { threshold: 0.1 });
    gridItems.forEach(function(item) {
      item.style.opacity = '0';
      item.style.transform = 'translateY(30px)';
      item.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      gridObserver.observe(item);
    });
  }

  // ---- NEWSLETTER FORM ----
  document.querySelectorAll('.contact-form').forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var input = form.querySelector('.contact-input');
      var btn = form.querySelector('.contact-btn');
      if (input && input.value.indexOf('@') !== -1) {
        var orig = btn.textContent;
        btn.textContent = 'Welcome';
        btn.style.background = 'var(--accent)';
        btn.style.borderColor = 'var(--accent)';
        input.value = '';
        setTimeout(function() { btn.textContent = orig; btn.style.background = ''; btn.style.borderColor = ''; }, 3000);
      }
    });
  });

  // ============================================
  // COLLECTION PAGE - FILTER & SORT
  // ============================================
  var filterTabs = document.querySelectorAll('.filter-tab');
  var productCards = document.querySelectorAll('.product-card');
  var productCount = document.getElementById('productCount');
  var sortSelect = document.getElementById('sortSelect');

  if (filterTabs.length && productCards.length) {
    filterTabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        filterTabs.forEach(function(t) { t.classList.remove('active'); });
        tab.classList.add('active');
        var filter = tab.dataset.filter;
        var count = 0;
        productCards.forEach(function(card) {
          var cat = card.dataset.category;
          if (filter === 'all' || cat === filter) {
            card.classList.remove('hidden');
            card.style.display = '';
            count++;
          } else {
            card.classList.add('hidden');
            setTimeout(function() { card.style.display = 'none'; }, 400);
          }
        });
        if (productCount) productCount.textContent = count;
      });
    });

    if (sortSelect) {
      sortSelect.addEventListener('change', function() {
        var grid = document.querySelector('.products-grid-inner');
        if (!grid) return;
        var cards = Array.from(grid.querySelectorAll('.product-card:not(.hidden)'));
        var val = sortSelect.value;
        cards.sort(function(a, b) {
          if (val === 'price-asc') return parseInt(a.dataset.price) - parseInt(b.dataset.price);
          if (val === 'price-desc') return parseInt(b.dataset.price) - parseInt(a.dataset.price);
          if (val === 'newest') return b.dataset.date.localeCompare(a.dataset.date);
          return 0;
        });
        cards.forEach(function(card) { grid.appendChild(card); });
      });
    }
  }

  // ---- QUICK VIEW MODAL ----
  var qvModal = document.getElementById('quickViewModal');
  if (qvModal) {
    var qvImage = document.getElementById('qvImage');
    var qvName = document.getElementById('qvName');
    var qvPrice = document.getElementById('qvPrice');
    var qvCategory = document.getElementById('qvCategory');
    var qvLink = document.getElementById('qvLink');

    document.querySelectorAll('.quick-view-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var card = btn.closest('.product-card');
        if (!card) return;
        var img = card.querySelector('.product-card-img img');
        var name = card.querySelector('.product-card-name');
        var price = card.querySelector('.product-card-price');
        var cat = card.querySelector('.product-card-category');
        var link = card.querySelector('a');
        if (qvImage && img) qvImage.src = img.src;
        if (qvName && name) qvName.textContent = name.textContent;
        if (qvPrice && price) qvPrice.innerHTML = price.innerHTML;
        if (qvCategory && cat) qvCategory.textContent = cat.textContent;
        if (qvLink && link) qvLink.href = link.href;
        qvModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    qvModal.querySelector('.quick-view-close').addEventListener('click', closeQV);
    qvModal.querySelector('.quick-view-overlay').addEventListener('click', closeQV);
    function closeQV() {
      qvModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // ============================================
  // PRODUCT PAGE - GALLERY
  // ============================================
  var gallerySlides = document.getElementById('gallerySlides');
  if (gallerySlides) {
    var slides = gallerySlides.querySelectorAll('.gallery-slide');
    var thumbs = document.querySelectorAll('#galleryThumbs .thumb');
    var slideNum = document.getElementById('slideNum');
    var prevBtn = document.querySelector('.gallery-prev');
    var nextBtn = document.querySelector('.gallery-next');
    var currentSlide = 0;

    function showSlide(idx) {
      slides.forEach(function(s) { s.classList.remove('active'); });
      thumbs.forEach(function(t) { t.classList.remove('active'); });
      currentSlide = idx;
      slides[idx].classList.add('active');
      if (thumbs[idx]) thumbs[idx].classList.add('active');
      if (slideNum) slideNum.textContent = String(idx + 1).padStart(2, '0');
    }

    if (prevBtn) prevBtn.addEventListener('click', function() { showSlide((currentSlide - 1 + slides.length) % slides.length); });
    if (nextBtn) nextBtn.addEventListener('click', function() { showSlide((currentSlide + 1) % slides.length); });
    thumbs.forEach(function(thumb) {
      thumb.addEventListener('click', function() { showSlide(parseInt(thumb.dataset.index)); });
    });

    // Click main image to open lightbox
    slides.forEach(function(slide) {
      slide.addEventListener('click', function() { openProductLightbox(currentSlide); });
    });
  }

  // ---- PRODUCT LIGHTBOX ----
  var lightbox = document.getElementById('lightbox');
  if (lightbox && gallerySlides) {
    var lbImg = document.getElementById('lightboxImg');
    var lbNum = document.getElementById('lbNum');
    var lbSlides = gallerySlides.querySelectorAll('.gallery-slide img');
    var lbIdx = 0;

    function openProductLightbox(idx) {
      lbIdx = idx;
      lbImg.src = lbSlides[idx].src;
      if (lbNum) lbNum.textContent = String(idx + 1).padStart(2, '0');
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLB);
    lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLB);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', function() {
      lbIdx = (lbIdx - 1 + lbSlides.length) % lbSlides.length;
      lbImg.src = lbSlides[lbIdx].src;
      if (lbNum) lbNum.textContent = String(lbIdx + 1).padStart(2, '0');
    });
    lightbox.querySelector('.lightbox-next').addEventListener('click', function() {
      lbIdx = (lbIdx + 1) % lbSlides.length;
      lbImg.src = lbSlides[lbIdx].src;
      if (lbNum) lbNum.textContent = String(lbIdx + 1).padStart(2, '0');
    });
    function closeLB() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // ---- LOOKBOOK LIGHTBOX ----
  var lookbookLB = document.getElementById('lookbookLightbox');
  var lookbookItems = document.querySelectorAll('.lookbook-item[data-lightbox]');
  if (lookbookLB && lookbookItems.length) {
    var lbLookImg = document.getElementById('lookbookLightboxImg');
    var lbLookNum = document.getElementById('lbLookNum');
    var lbLookTotal = document.getElementById('lbLookTotal');
    var lookIdx = 0;
    var lookImgs = Array.from(lookbookItems).map(function(item) { return item.querySelector('img').src; });
    if (lbLookTotal) lbLookTotal.textContent = String(lookImgs.length).padStart(2, '0');

    lookbookItems.forEach(function(item, i) {
      item.addEventListener('click', function() {
        lookIdx = i;
        lbLookImg.src = lookImgs[i];
        if (lbLookNum) lbLookNum.textContent = String(i + 1).padStart(2, '0');
        lookbookLB.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    lookbookLB.querySelector('.lightbox-close').addEventListener('click', closeLookLB);
    lookbookLB.querySelector('.lightbox-overlay').addEventListener('click', closeLookLB);
    lookbookLB.querySelector('.lightbox-prev').addEventListener('click', function() {
      lookIdx = (lookIdx - 1 + lookImgs.length) % lookImgs.length;
      lbLookImg.src = lookImgs[lookIdx];
      if (lbLookNum) lbLookNum.textContent = String(lookIdx + 1).padStart(2, '0');
    });
    lookbookLB.querySelector('.lightbox-next').addEventListener('click', function() {
      lookIdx = (lookIdx + 1) % lookImgs.length;
      lbLookImg.src = lookImgs[lookIdx];
      if (lbLookNum) lbLookNum.textContent = String(lookIdx + 1).padStart(2, '0');
    });
    function closeLookLB() {
      lookbookLB.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // ---- SIZE SELECTOR ----
  document.querySelectorAll('.size-options').forEach(function(group) {
    group.querySelectorAll('.size-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        group.querySelectorAll('.size-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
      });
    });
  });

  // ---- SIZE GUIDE MODAL ----
  var sizeGuideModal = document.getElementById('sizeGuideModal');
  var sizeGuideLink = document.getElementById('sizeGuideLink');
  if (sizeGuideModal && sizeGuideLink) {
    sizeGuideLink.addEventListener('click', function(e) {
      e.preventDefault();
      sizeGuideModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    sizeGuideModal.querySelector('.size-guide-close').addEventListener('click', closeSG);
    sizeGuideModal.querySelector('.size-guide-overlay').addEventListener('click', closeSG);
    function closeSG() {
      sizeGuideModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // ---- ADD TO BAG ----
  var addToBag = document.getElementById('addToBag');
  if (addToBag) {
    addToBag.addEventListener('click', function() {
      var span = addToBag.querySelector('span');
      var orig = span.textContent;
      span.textContent = 'Added to Bag';
      addToBag.style.background = 'var(--accent)';
      addToBag.style.borderColor = 'var(--accent)';
      setTimeout(function() {
        span.textContent = orig;
        addToBag.style.background = '';
        addToBag.style.borderColor = '';
      }, 2500);
    });
  }

  // ---- ACCORDIONS ----
  document.querySelectorAll('.accordion-header').forEach(function(header) {
    header.addEventListener('click', function() {
      var accordion = header.parentElement;
      var wasOpen = accordion.classList.contains('open');
      // Close all siblings
      accordion.parentElement.querySelectorAll('.accordion').forEach(function(a) { a.classList.remove('open'); });
      if (!wasOpen) accordion.classList.add('open');
    });
  });

  // ---- CONTACT FORM VALIDATION ----
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var valid = true;
      contactForm.querySelectorAll('[required]').forEach(function(field) {
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        } else {
          field.classList.remove('error');
        }
      });
      var emailField = contactForm.querySelector('#email');
      if (emailField && emailField.value.indexOf('@') === -1) {
        emailField.classList.add('error');
        valid = false;
      }
      if (valid) {
        var success = document.getElementById('formSuccess');
        if (success) success.classList.add('show');
        var submitBtn = document.getElementById('contactSubmit');
        if (submitBtn) {
          submitBtn.querySelector('span').textContent = 'Sent';
          submitBtn.style.background = 'var(--accent)';
          submitBtn.style.borderColor = 'var(--accent)';
        }
        contactForm.reset();
        setTimeout(function() {
          if (success) success.classList.remove('show');
          if (submitBtn) {
            submitBtn.querySelector('span').textContent = 'Send Message';
            submitBtn.style.background = '';
            submitBtn.style.borderColor = '';
          }
        }, 4000);
      }
    });
    // Remove error on focus
    contactForm.querySelectorAll('[required]').forEach(function(field) {
      field.addEventListener('focus', function() { field.classList.remove('error'); });
    });
  }

  // ---- KEYBOARD SHORTCUTS ----
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      // Close any open modal/lightbox
      document.querySelectorAll('.lightbox.open, .quick-view-modal.open, .size-guide-modal.open, .full-menu.open').forEach(function(el) {
        el.classList.remove('open');
      });
      if (menuBtn) menuBtn.classList.remove('active');
      document.body.style.overflow = '';
    }
    // Arrow keys for galleries/lightboxes
    if (e.key === 'ArrowLeft') {
      var activePrev = document.querySelector('.lightbox.open .lightbox-prev');
      if (activePrev) activePrev.click();
      else if (prevBtn && gallerySlides) prevBtn.click();
    }
    if (e.key === 'ArrowRight') {
      var activeNext = document.querySelector('.lightbox.open .lightbox-next');
      if (activeNext) activeNext.click();
      else if (nextBtn && gallerySlides) nextBtn.click();
    }
  });

  // ---- IMAGE LAZY LOAD WITH FADE ----
  var lazyImages = document.querySelectorAll('.item-img-wrap img, .editorial-img-wrap img, .editorial-wide img, .lookbook-item img, .lookbook-bts-item img, .craft-card-img img, .journal-card-img img, .journal-article-img img, .journal-featured-img img');
  if (lazyImages.length) {
    var imgObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          img.style.opacity = '0';
          img.style.transition = 'opacity 0.8s ease';
          if (img.complete) { img.style.opacity = '1'; }
          else { img.addEventListener('load', function() { img.style.opacity = '1'; }); }
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });
    lazyImages.forEach(function(img) { img.style.opacity = '0'; imgObserver.observe(img); });
  }

})();