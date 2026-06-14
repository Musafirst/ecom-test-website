/* ============================================================
   JAMM TRADE SHOPIFY THEME JS
   Hero slider, mobile menu, add-to-cart, gallery, quantity
   ============================================================ */

(function () {
  'use strict';

  var publicStorefrontUrl = (
    window.JammTrade && window.JammTrade.publicStorefrontUrl
      ? window.JammTrade.publicStorefrontUrl
      : 'https://www.jammtrade.com'
  ).replace(/\/+$/, '');

  function escapeHtml(value) {
    var replacements = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return String(value || '').replace(/[&<>"']/g, function (character) {
      return replacements[character];
    });
  }

  function publicProductUrl(product) {
    var handle = product.handle || '';
    if (!handle && product.url) {
      handle = product.url.split('/products/')[1] || '';
      handle = handle.split(/[/?#]/)[0];
    }
    return publicStorefrontUrl + '/shop/product/' + encodeURIComponent(handle);
  }

  /* ---- Scrolled header ------------------------------------ */
  var header = document.getElementById('SiteHeader');
  if (header) {
    var headerInner = header.querySelector('.header-inner');
    function onScroll() {
      if (headerInner) {
        headerInner.classList.toggle('is-scrolled', window.scrollY > 48);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Mobile menu ---------------------------------------- */
  var menuToggle  = document.getElementById('MobileMenuToggle');
  var menuClose   = document.getElementById('MobileMenuClose');
  var mobileMenu  = document.getElementById('MobileMenu');
  var menuOverlay = document.getElementById('MobileMenuOverlay');

  var _menuScrollY = 0;

  function openMenu() {
    if (!mobileMenu) return;
    _menuScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + _menuScrollY + 'px';
    document.body.style.width = '100%';
    mobileMenu.removeAttribute('hidden');
    menuOverlay && menuOverlay.removeAttribute('hidden');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    if (!mobileMenu) return;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, _menuScrollY);
    mobileMenu.setAttribute('hidden', '');
    menuOverlay && menuOverlay.setAttribute('hidden', '');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  }

  if (menuToggle) menuToggle.addEventListener('click', openMenu);
  if (menuClose)  menuClose.addEventListener('click', closeMenu);
  if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---- Services dropdown ---------------------------------- */
  var servicesMenu = document.querySelector('[data-services-menu]');
  if (servicesMenu) {
    var servicesToggle = servicesMenu.querySelector('[data-services-toggle]');
    var servicesPanel = servicesMenu.querySelector('[data-services-panel]');
    var closeServicesTimer = null;

    function openServices() {
      if (!servicesPanel || !servicesToggle) return;
      clearTimeout(closeServicesTimer);
      servicesPanel.removeAttribute('hidden');
      servicesMenu.classList.add('is-open');
      servicesToggle.setAttribute('aria-expanded', 'true');
    }

    function closeServices() {
      if (!servicesPanel || !servicesToggle) return;
      servicesPanel.setAttribute('hidden', '');
      servicesMenu.classList.remove('is-open');
      servicesToggle.setAttribute('aria-expanded', 'false');
    }

    servicesMenu.addEventListener('mouseenter', openServices);
    servicesMenu.addEventListener('mouseleave', function () {
      closeServicesTimer = setTimeout(closeServices, 120);
    });
    if (servicesToggle) {
      servicesToggle.addEventListener('click', function (e) {
        e.preventDefault();
        if (servicesPanel && servicesPanel.hasAttribute('hidden')) openServices();
        else closeServices();
      });
    }
    document.addEventListener('click', function (e) {
      if (!servicesMenu.contains(e.target)) closeServices();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeServices();
    });
  }

  var mobileServicesToggle = document.querySelector('[data-mobile-services-toggle]');
  var mobileServicesPanel = document.querySelector('[data-mobile-services-panel]');
  if (mobileServicesToggle && mobileServicesPanel) {
    mobileServicesToggle.addEventListener('click', function () {
      var wrapper = mobileServicesToggle.closest('.mobile-services');
      var isOpen = !mobileServicesPanel.hasAttribute('hidden');
      if (isOpen) {
        mobileServicesPanel.setAttribute('hidden', '');
        mobileServicesToggle.setAttribute('aria-expanded', 'false');
        wrapper && wrapper.classList.remove('is-open');
      } else {
        mobileServicesPanel.removeAttribute('hidden');
        mobileServicesToggle.setAttribute('aria-expanded', 'true');
        wrapper && wrapper.classList.add('is-open');
      }
    });
  }

  /* ---- Hero Slideshow ------------------------------------- */
  var slider = document.getElementById('HeroSlider');
  if (slider) {
    var slides    = Array.from(slider.querySelectorAll('.hero-slide'));
    var dots      = Array.from(slider.querySelectorAll('.hero-dot'));
    var current   = 0;
    var autoTimer = null;
    var SPEED     = parseInt(slider.dataset.speed || '6000', 10);

    function attemptVideoPlayback(video) {
      if (!video) return;

      video.defaultMuted = true;
      video.muted = true;
      video.playsInline = true;

      var playPromise = video.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise
          .then(function () {
            video.classList.remove('is-autoplay-blocked');
          })
          .catch(function () {
            video.classList.add('is-autoplay-blocked');
          });
      }
    }

    function retryBlockedVideos() {
      slides.forEach(function (slide) {
        var video = slide.querySelector('video.is-autoplay-blocked');
        if (video && slide.classList.contains('is-active')) {
          attemptVideoPlayback(video);
        }
      });
    }

    function goTo(index) {
      slides[current].classList.remove('is-active');
      var currentVideo = slides[current].querySelector('video');
      if (currentVideo) currentVideo.pause();
      dots[current] && dots[current].classList.remove('is-active');
      dots[current] && dots[current].setAttribute('aria-selected', 'false');

      current = (index + slides.length) % slides.length;

      slides[current].classList.add('is-active');
      var nextVideo = slides[current].querySelector('video');
      attemptVideoPlayback(nextVideo);
      dots[current] && dots[current].classList.add('is-active');
      dots[current] && dots[current].setAttribute('aria-selected', 'true');
    }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(function () { goTo(current + 1); }, SPEED);
    }

    function stopAuto() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goTo(i);
        stopAuto();
        startAuto();
      });
    });

    // Touch / swipe support
    var touchStartX = 0;
    slider.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchend', function (e) {
      var delta = e.changedTouches[0].clientX - touchStartX;
      var threshold = Math.max(40, window.innerWidth * 0.15);
      if (Math.abs(delta) > threshold) {
        goTo(delta < 0 ? current + 1 : current - 1);
        stopAuto();
        startAuto();
      }
    }, { passive: true });

    slides.forEach(function (slide) {
      var video = slide.querySelector('video');
      if (!video) return;

      video.addEventListener('playing', function () {
        video.classList.remove('is-autoplay-blocked');
      });
      video.addEventListener('error', function () {
        video.classList.add('is-autoplay-blocked');
      });
    });

    attemptVideoPlayback(slides[current] && slides[current].querySelector('video'));
    window.addEventListener('pointerdown', retryBlockedVideos, { once: true, passive: true });
    window.addEventListener('touchstart', retryBlockedVideos, { once: true, passive: true });
    window.addEventListener('click', retryBlockedVideos, { once: true });

    if (slides.length > 1) startAuto();
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

    var original = btn.textContent;
    btn.textContent = 'Adding…';
    btn.disabled = true;

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: variantId, quantity: 1 }),
    })
      .then(function (r) { return r.json(); })
      .then(function () {
        btn.textContent = 'Added ✓';
        updateCartCount();
        setTimeout(function () {
          btn.textContent = original;
          btn.disabled = false;
        }, 1800);
      })
      .catch(function () {
        btn.textContent = 'Error';
        btn.disabled = false;
        setTimeout(function () { btn.textContent = original; }, 2000);
      });
  });

  /* ---- Cart count ----------------------------------------- */
  function updateCartCount() {
    fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        var badges = document.querySelectorAll('[data-cart-count]');
        badges.forEach(function (el) {
          var count = cart.item_count;
          el.textContent = count > 9 ? '9+' : count;
          el.style.display = count > 0 ? 'flex' : 'none';
        });
      });
  }

  /* ---- Product page gallery ------------------------------- */
  var galleryMain = document.getElementById('ProductGalleryMain');
  if (galleryMain) {
    var galleryImgs  = Array.from(galleryMain.querySelectorAll('[data-gallery-img]'));
    var thumbBtns    = Array.from(document.querySelectorAll('.product-gallery__thumb'));

    thumbBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.dataset.thumb, 10);
        galleryImgs.forEach(function (img, i) {
          img.classList.toggle('is-active', i === idx);
        });
        thumbBtns.forEach(function (b, i) {
          b.classList.toggle('is-active', i === idx);
        });
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

    // Cart page: update line item via API
    var line = btn.dataset.line;
    if (line && btn.dataset.action) {
      var action = btn.dataset.action;
      var newQty = action === 'increase'
        ? (parseInt(input.value, 10) + 1)
        : Math.max(0, parseInt(input.value, 10) - 1);
      input.value = newQty;
      updateCartLine(parseInt(line, 10), newQty);
    } else {
      input.value = Math.max(1, val);
    }
  });

  function updateCartLine(line, quantity) {
    var updates = {};
    updates[line] = quantity;
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ line: line, quantity: quantity }),
    })
      .then(function () {
        if (quantity === 0) location.reload();
        else updateCartCount();
      });
  }

  /* ---- Cart remove buttons -------------------------------- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.cart-item__remove');
    if (!btn) return;
    var line = parseInt(btn.dataset.line, 10);
    updateCartLine(line, 0);
  });

  /* ---- Variant selector ----------------------------------- */
  var variantBtns = document.querySelectorAll('.variant-btn');
  variantBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var option = btn.dataset.option;
      var siblings = document.querySelectorAll('.variant-btn[data-option="' + option + '"]');
      siblings.forEach(function (b) { b.classList.remove('is-selected'); });
      btn.classList.add('is-selected');
      updateSelectedVariant();
    });
  });

  function updateSelectedVariant() {
    // Build selected options object
    var selectedOptions = {};
    document.querySelectorAll('.variant-btn.is-selected').forEach(function (btn) {
      selectedOptions[btn.dataset.option] = btn.dataset.value;
    });

    // Shopify variant matching via meta (works with standard product.variants JSON)
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

        var submitBtns = document.querySelectorAll('#ProductForm [type="submit"]');
        submitBtns.forEach(function (submitBtn) {
          submitBtn.disabled = !match.available;
        });

        var addBtn = document.querySelector('#ProductForm [name="add"]:not([data-buy-now])');
        if (addBtn) addBtn.textContent = match.available ? 'Add to Cart' : 'Sold Out';
      }
    } catch (err) {
      console.warn('Variant matching error:', err);
    }
  }

  /* ---- Search drawer -------------------------------------- */
  var searchToggle  = document.getElementById('SearchToggle');
  var searchClose   = document.getElementById('SearchClose');
  var searchDrawer  = document.getElementById('SearchDrawer');
  var searchOverlay = document.getElementById('SearchOverlay');
  var searchInput   = document.getElementById('SearchInput');
  var searchResults = document.getElementById('SearchResults');
  var searchTimer   = null;

  function openSearch() {
    if (!searchDrawer) return;
    searchDrawer.classList.add('is-open');
    searchOverlay && searchOverlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    if (searchToggle) searchToggle.setAttribute('aria-expanded', 'true');
    setTimeout(function () { searchInput && searchInput.focus(); }, 60);
  }

  function closeSearch() {
    if (!searchDrawer) return;
    searchDrawer.classList.remove('is-open');
    searchOverlay && searchOverlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
    if (searchToggle) searchToggle.setAttribute('aria-expanded', 'false');
  }

  if (searchToggle)  searchToggle.addEventListener('click', openSearch);
  if (searchClose)   searchClose.addEventListener('click', closeSearch);
  if (searchOverlay) searchOverlay.addEventListener('click', closeSearch);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSearch();
  });

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

  function renderResults(products, q) {
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

  /* ---- Animate-in on scroll ------------------------------- */
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '-60px', threshold: 0.1 });

    document.querySelectorAll('.animate-in').forEach(function (el) {
      observer.observe(el);
    });
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
        if (key === 'consent_accepted') {
          payload[key] = true;
        } else if (payload[key]) {
          payload[key] = Array.isArray(payload[key])
            ? payload[key].concat(value)
            : [payload[key], value];
        } else {
          payload[key] = value;
        }
      });

      if (message) {
        message.textContent = '';
        message.classList.remove('service-form__message--error', 'service-form__message--success');
      }
      if (submit) {
        submit.disabled = true;
        submit.textContent = 'Submitting...';
      }

      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          if (!result.ok) {
            throw new Error(result.data && result.data.error ? result.data.error : 'Something went wrong. Please try again.');
          }

          form.reset();
          if (message) {
            message.textContent = 'Thank you. We received your request and will contact you shortly.';
            message.classList.add('service-form__message--success');
          }
        })
        .catch(function (err) {
          if (message) {
            message.textContent = err.message || 'Something went wrong. Please try again.';
            message.classList.add('service-form__message--error');
          }
        })
        .finally(function () {
          if (submit) {
            submit.disabled = false;
            submit.textContent = originalText;
          }
        });
    });
  });

})();
