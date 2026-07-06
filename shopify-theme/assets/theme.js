/* ============================================================
   JAMM TRADE SHOPIFY THEME JS (redesign)
   Hero carousel, hotspots, mobile drawer, footer accordion,
   scroll reveals, add-to-cart, gallery, quantity, search
   ============================================================ */

(function () {
  'use strict';

  var publicStorefrontUrl = (
    window.JammTrade && window.JammTrade.publicStorefrontUrl
      ? window.JammTrade.publicStorefrontUrl
      : 'https://www.jammtrade.com'
  ).replace(/\/+$/, '');

  function escapeHtml(value) {
    var replacements = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(value || '').replace(/[&<>"']/g, function (c) { return replacements[c]; });
  }

  function publicProductUrl(product) {
    var handle = product.handle || '';
    if (!handle && product.url) {
      handle = product.url.split('/products/')[1] || '';
      handle = handle.split(/[/?#]/)[0];
    }
    return publicStorefrontUrl + '/shop/product/' + encodeURIComponent(handle);
  }

  function updateCartCount() {
    fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        document.querySelectorAll('[data-cart-count]').forEach(function (el) {
          var count = cart.item_count;
          el.textContent = count > 9 ? '9+' : count;
          el.style.display = count > 0 ? 'flex' : 'none';
        });
      });
  }

  /* ---- Mobile drawer -------------------------------------- */
  var menuToggle = document.getElementById('MobileMenuToggle');
  var menuClose = document.getElementById('MobileDrawerClose');
  var mobileDrawer = document.getElementById('MobileDrawer');
  function openMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.setAttribute('hidden', '');
    document.body.style.overflow = '';
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  }
  if (menuToggle) menuToggle.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  if (mobileDrawer) mobileDrawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---- Hero carousel + shared video + hotspots ------------ */
  (function () {
    var stage = document.querySelector('.hero__stage');
    if (!stage) return;
    var slides = Array.from(document.querySelectorAll('.slide'));
    var dots = Array.from(document.querySelectorAll('.hero__dots .dot'));
    var videos = Array.from(document.querySelectorAll('.hero__video'));
    var index = 0;
    var timer = null;
    var HOLD = 6000;
    var HOLD_ECO = 9000;

    function schedule(ms) { clearTimeout(timer); timer = setTimeout(function () { show(index + 1); }, ms); }
    function show(n) {
      index = (n + slides.length) % slides.length;
      document.querySelectorAll('.hotspot.is-open').forEach(function (h) { h.classList.remove('is-open'); });
      var mutedCaption = document.querySelector('.eco-caption.is-muted');
      if (mutedCaption) mutedCaption.classList.remove('is-muted');
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === index); });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === index); });
      videos.forEach(function (video, i) {
        var active = i === index && !slides[index].classList.contains('slide--eco');
        video.classList.toggle('is-active', active);
        video.muted = true;
        if (active) video.play().catch(function () {});
        else video.pause();
      });
      schedule(slides[index].classList.contains('slide--eco') ? HOLD_ECO : HOLD);
    }
    function next() { show(index + 1); }
    function prev() { show(index - 1); }

    dots.forEach(function (d, i) { d.addEventListener('click', function () { show(i); }); });
    var nextBtn = document.querySelector('.hero__arrow--next');
    var prevBtn = document.querySelector('.hero__arrow--prev');
    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);

    stage.addEventListener('mouseenter', function () { clearTimeout(timer); });
    stage.addEventListener('mouseleave', function () { schedule(slides[index].classList.contains('slide--eco') ? HOLD_ECO : HOLD); });

    var sx = 0, sy = 0, swiping = false;
    stage.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; swiping = true; }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (!swiping) return;
      swiping = false;
      var dx = e.changedTouches[0].clientX - sx;
      var dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 46 && Math.abs(dx) > Math.abs(dy)) { dx < 0 ? next() : prev(); }
    }, { passive: true });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    });

    if (slides.length) show(0);

    document.addEventListener('visibilitychange', function () { if (!document.hidden) show(index); });

    // Touch flow: first tap reveals the point's name, second tap (ring or
    // revealed label — CSS re-enables its pointer events when open) navigates.
    // The caption fades while a name is revealed so they never overlap.
    var hotspots = Array.from(document.querySelectorAll('.hotspot'));
    var ecoCaption = document.querySelector('.eco-caption');
    hotspots.forEach(function (h) {
      h.addEventListener('click', function (e) {
        if (window.matchMedia('(hover: none)').matches && !h.classList.contains('is-open')) {
          e.preventDefault();
          hotspots.forEach(function (o) { if (o !== h) o.classList.remove('is-open'); });
          h.classList.add('is-open');
          if (ecoCaption) ecoCaption.classList.add('is-muted');
          clearTimeout(timer); // hold the slide while exploring
        }
      });
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.hotspot')) {
        hotspots.forEach(function (h) { h.classList.remove('is-open'); });
        if (ecoCaption) ecoCaption.classList.remove('is-muted');
      }
    });
  })();

  /* ---- Footer accordion (mobile) -------------------------- */
  document.querySelectorAll('.fcol__head').forEach(function (head) {
    head.addEventListener('click', function () {
      if (window.matchMedia('(min-width:900px)').matches) return;
      head.closest('.fcol').classList.toggle('is-open');
    });
  });

  /* ---- Reveal on scroll ----------------------------------- */
  document.body.classList.add('reveal-on');
  function revealAll() { document.querySelectorAll('.reveal:not(.is-in)').forEach(function (el) { el.classList.add('is-in'); }); }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
    setTimeout(revealAll, 4000);
  } else {
    revealAll();
  }

  /* ---- Product form checkout routing ---------------------- */
  var productForm = document.getElementById('ProductForm');
  if (productForm) {
    productForm.addEventListener('submit', function (e) {
      var returnTo = productForm.querySelector('[name="return_to"]');
      if (!returnTo) return;
      returnTo.value = e.submitter && e.submitter.matches('[data-buy-now]') ? '/checkout' : '';
    });
  }

  /* ---- Add-to-cart ---------------------------------------- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-product-id]');
    if (!btn) return;
    var variantId = btn.dataset.productId;
    if (!variantId) return;

    var labelEl = btn.querySelector('span') || btn;
    var original = labelEl.textContent;
    labelEl.textContent = 'Adding…';
    btn.disabled = true;

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity: 1 }),
    })
      .then(function (r) { return r.json(); })
      .then(function () {
        labelEl.textContent = 'Added ✓';
        updateCartCount();
        setTimeout(function () { labelEl.textContent = original; btn.disabled = false; }, 1600);
      })
      .catch(function () {
        labelEl.textContent = 'Error';
        btn.disabled = false;
        setTimeout(function () { labelEl.textContent = original; }, 2000);
      });
  });

  /* ---- Product page gallery ------------------------------- */
  var galleryMain = document.getElementById('ProductGalleryMain');
  if (galleryMain) {
    var galleryImgs = Array.from(galleryMain.querySelectorAll('[data-gallery-img]'));
    var thumbBtns = Array.from(document.querySelectorAll('.product-gallery__thumb'));
    thumbBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.dataset.thumb, 10);
        galleryImgs.forEach(function (img, i) { img.classList.toggle('is-active', i === idx); });
        thumbBtns.forEach(function (b, i) { b.classList.toggle('is-active', i === idx); });
      });
    });
  }

  /* ---- Quantity selectors --------------------------------- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.qty-btn');
    if (!btn) return;
    var input = btn.closest('.qty-selector').querySelector('.qty-input');
    if (!input) return;
    var delta = parseInt(btn.dataset.qty || '0', 10);
    var val = Math.max(0, parseInt(input.value || '1', 10) + delta);
    var line = btn.dataset.line;
    if (line && btn.dataset.action) {
      var newQty = btn.dataset.action === 'increase'
        ? (parseInt(input.value, 10) + 1)
        : Math.max(0, parseInt(input.value, 10) - 1);
      input.value = newQty;
      updateCartLine(parseInt(line, 10), newQty);
    } else {
      input.value = Math.max(1, val);
    }
  });

  function updateCartLine(line, quantity) {
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ line: line, quantity: quantity }),
    }).then(function () {
      if (quantity === 0) location.reload();
      else updateCartCount();
    });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.cart-item__remove');
    if (!btn) return;
    updateCartLine(parseInt(btn.dataset.line, 10), 0);
  });

  /* ---- Variant selector ----------------------------------- */
  document.querySelectorAll('.variant-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var option = btn.dataset.option;
      document.querySelectorAll('.variant-btn[data-option="' + option + '"]').forEach(function (b) { b.classList.remove('is-selected'); });
      btn.classList.add('is-selected');
      updateSelectedVariant();
    });
  });

  function updateSelectedVariant() {
    var selectedOptions = {};
    document.querySelectorAll('.variant-btn.is-selected').forEach(function (btn) {
      selectedOptions[btn.dataset.option] = btn.dataset.value;
    });
    var variantDataEl = document.getElementById('ProductVariantsData');
    if (!variantDataEl) return;
    try {
      var variants = JSON.parse(variantDataEl.textContent);
      var match = variants.find(function (v) {
        return v.options.every(function (opt, i) {
          var optionName = v.option_names ? v.option_names[i] : 'Option ' + (i + 1);
          return selectedOptions[optionName] === opt;
        });
      });
      if (match) {
        var idInput = document.querySelector('#ProductForm [name="id"]');
        if (idInput) idInput.value = match.id;
        document.querySelectorAll('#ProductForm [type="submit"]').forEach(function (b) { b.disabled = !match.available; });
        var addBtn = document.querySelector('#ProductForm [name="add"]:not([data-buy-now])');
        if (addBtn) addBtn.textContent = match.available ? 'Add to Cart' : 'Sold Out';
      }
    } catch (err) { /* noop */ }
  }

  /* ---- Search drawer (other templates) -------------------- */
  var searchToggle = document.getElementById('SearchToggle');
  var searchClose = document.getElementById('SearchClose');
  var searchDrawer = document.getElementById('SearchDrawer');
  var searchOverlay = document.getElementById('SearchOverlay');
  var searchInput = document.getElementById('SearchInput');
  var searchResults = document.getElementById('SearchResults');
  var searchTimer = null;

  function openSearch() {
    if (!searchDrawer) return;
    searchDrawer.classList.add('is-open');
    if (searchOverlay) searchOverlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    if (searchToggle) searchToggle.setAttribute('aria-expanded', 'true');
    setTimeout(function () { if (searchInput) searchInput.focus(); }, 60);
  }
  function closeSearch() {
    if (!searchDrawer) return;
    searchDrawer.classList.remove('is-open');
    if (searchOverlay) searchOverlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
    if (searchToggle) searchToggle.setAttribute('aria-expanded', 'false');
  }
  if (searchToggle) searchToggle.addEventListener('click', openSearch);
  if (searchClose) searchClose.addEventListener('click', closeSearch);
  if (searchOverlay) searchOverlay.addEventListener('click', closeSearch);

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      clearTimeout(searchTimer);
      var q = searchInput.value.trim();
      if (!q) { searchResults.innerHTML = ''; return; }
      searchTimer = setTimeout(function () { fetchSearchResults(q); }, 260);
    });
  }
  function fetchSearchResults(q) {
    fetch('/search/suggest.json?q=' + encodeURIComponent(q) + '&resources[type]=product&resources[limit]=5')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var products = (data.resources && data.resources.results && data.resources.results.products) || [];
        renderResults(products, q);
      })
      .catch(function () { searchResults.innerHTML = ''; });
  }
  function renderResults(products) {
    if (!products.length) {
      searchResults.innerHTML = '<li class="search-result-item search-result-item--none">No products found</li>';
      return;
    }
    var html = products.map(function (p) {
      var imgSrc = p.featured_image && p.featured_image.url ? p.featured_image.url : '';
      var imgTag = imgSrc
        ? '<img src="' + escapeHtml(imgSrc) + '" alt="" class="search-result-item__img" width="48" height="48" loading="lazy">'
        : '<div class="search-result-item__img"></div>';
      var price = p.price ? ('$' + (p.price / 100).toFixed(2)) : '';
      return '<li><a href="' + escapeHtml(publicProductUrl(p)) + '" class="search-result-item">'
        + imgTag
        + '<span class="search-result-item__title">' + escapeHtml(p.title) + '</span>'
        + '<span class="search-result-item__price">' + escapeHtml(price) + '</span>'
        + '</a></li>';
    }).join('');
    html += '<li><a href="' + escapeHtml(publicStorefrontUrl + '/shop') + '" class="search-result-item search-result-item--all">Browse all products &rarr;</a></li>';
    searchResults.innerHTML = html;
  }

  /* ---- Jamm service forms --------------------------------- */
  document.querySelectorAll('[data-jamm-api-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var endpoint = form.dataset.jammApiEndpoint;
      var message = form.querySelector('.service-form__message');
      var submit = form.querySelector('[type="submit"]');
      if (!endpoint) return;
      var originalText = submit ? submit.textContent : '';
      var formData = new FormData(form);
      var payload = {};
      formData.forEach(function (value, key) {
        if (key === 'consent_accepted') { payload[key] = true; }
        else if (payload[key]) { payload[key] = Array.isArray(payload[key]) ? payload[key].concat(value) : [payload[key], value]; }
        else { payload[key] = value; }
      });
      if (message) { message.textContent = ''; message.classList.remove('service-form__message--error', 'service-form__message--success'); }
      if (submit) { submit.disabled = true; submit.textContent = 'Submitting...'; }
      fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
        .then(function (result) {
          if (!result.ok) { throw new Error(result.data && result.data.error ? result.data.error : 'Something went wrong. Please try again.'); }
          form.reset();
          if (message) { message.textContent = 'Thank you. We received your request and will contact you shortly.'; message.classList.add('service-form__message--success'); }
        })
        .catch(function (err) {
          if (message) { message.textContent = err.message || 'Something went wrong. Please try again.'; message.classList.add('service-form__message--error'); }
        })
        .finally(function () { if (submit) { submit.disabled = false; submit.textContent = originalText; } });
    });
  });

  updateCartCount();
})();
