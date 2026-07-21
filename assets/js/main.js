/* ==========================================================
   REGAIN MEDIA / animation engine
   Lenis smooth scroll + GSAP ScrollTrigger
   ========================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';
  var hasST = typeof window.ScrollTrigger !== 'undefined';

  if (hasGsap && hasST) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Lenis smooth scroll ---------- */
  var lenis = null;
  if (!reduceMotion && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    if (hasGsap) {
      lenis.on('scroll', function () { if (hasST) ScrollTrigger.update(); });
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
    }
  }

  /* ---------- anchor navigation ---------- */
  document.querySelectorAll('[data-scrollto]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(link.getAttribute('data-scrollto'));
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
      else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------- custom cursor ---------- */
  var dot = document.getElementById('cursorDot');
  var ring = document.getElementById('cursorRing');
  if (dot && ring && window.matchMedia('(hover: hover)').matches && !reduceMotion && hasGsap) {
    var mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
    gsap.ticker.add(function () {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      gsap.set(dot, { x: mx, y: my });
      gsap.set(ring, { x: rx, y: ry });
    });
    document.querySelectorAll('a, button, .panel').forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('is-hover'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('is-hover'); });
    });
  } else if (dot && ring) {
    dot.style.display = 'none';
    ring.style.display = 'none';
  }

  /* ---------- entrance: curtain + hero ---------- */
  var curtain = document.getElementById('curtain');
  if (hasGsap && curtain) {
    var intro = gsap.timeline();
    intro
      .from('#curtainText', { yPercent: 120, duration: 0.7, ease: 'power4.out' })
      .to('#curtainText', { yPercent: -120, duration: 0.55, ease: 'power4.in', delay: 0.35 })
      .to(curtain, {
        yPercent: -100, duration: 0.8, ease: 'power4.inOut',
        onComplete: function () { curtain.style.display = 'none'; }
      }, '-=0.15')
      .from('[data-hero-row]', { yPercent: 115, duration: 1.05, ease: 'power4.out', stagger: 0.09 }, '-=0.45')
      .from('[data-hero-tag]', { opacity: 0, x: -24, duration: 0.6, ease: 'power2.out' }, '-=0.7')
      .from('[data-hero-foot]', { opacity: 0, y: 24, duration: 0.7, ease: 'power2.out' }, '-=0.5')
      .from('.nav', { opacity: 0, duration: 0.6 }, '-=0.5');
    if (reduceMotion) { intro.progress(1); }
  } else if (curtain) {
    curtain.style.display = 'none';
  }

  if (!hasGsap) {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.style.opacity = 1; el.style.transform = 'none';
    });
    return;
  }

  /* ---------- scroll progress ---------- */
  var fill = document.getElementById('progressFill');
  if (fill && hasST) {
    gsap.to(fill, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 }
    });
  }

  /* ---------- hero beam parallax ---------- */
  gsap.to('[data-beam]', {
    yPercent: 24, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });

  /* ---------- generic reveals ---------- */
  gsap.utils.toArray('.reveal').forEach(function (el) {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%', once: true }
    });
  });

  /* ---------- race bars ---------- */
  var raceYou = document.querySelector('[data-race-you]');
  var raceThem = document.querySelector('[data-race-them]');
  if (raceYou && raceThem) {
    ScrollTrigger.create({
      trigger: raceYou, start: 'top 80%', once: true,
      onEnter: function () {
        gsap.to(raceYou, { width: '18%', duration: 1.1, ease: 'power3.inOut' });
        gsap.to(raceThem, { width: '96%', duration: 3.2, ease: 'power1.inOut', delay: 0.3 });
        var youT = { v: 0 }, themT = { v: 0 };
        gsap.to(youT, {
          v: 3, duration: 1.1, ease: 'power3.inOut',
          onUpdate: function () {
            document.querySelector('[data-race-time-you]').textContent = Math.round(youT.v) + ' min';
          }
        });
        gsap.to(themT, {
          v: 27, duration: 3.2, ease: 'power1.inOut', delay: 0.3,
          onUpdate: function () {
            document.querySelector('[data-race-time-them]').textContent = Math.round(themT.v) + ' hrs';
          }
        });
      }
    });
  }

  /* ---------- chat simulation ---------- */
  var chatFeed = document.getElementById('chatFeed');
  if (chatFeed) {
    var script = [
      { who: 'sys', text: 'New lead / form fill 9:47 PM' },
      { who: 'lead', text: 'Hi, storm knocked a bunch of shingles off my roof today. Do you guys do repairs?' },
      { who: 'agent', text: 'We do. Sorry about the roof. Quick couple of questions so I can get the right person out to you. Is water getting inside right now?' },
      { who: 'lead', text: 'Not yet but there’s a soft spot in the ceiling upstairs' },
      { who: 'agent', text: 'Got it, we’ll treat that as urgent. Roughly how old is the roof, and are you planning to go through insurance?' },
      { who: 'lead', text: 'Maybe 15 years? And yeah, probably insurance' },
      { who: 'agent', text: 'Perfect. We can have an inspector out tomorrow morning and walk you through the claim. Does 9:30 AM work?' },
      { who: 'lead', text: '9:30 works' },
      { who: 'sys', text: 'Qualified &middot; booked &middot; routed to sales in 4 min' }
    ];

    function buildMsg(item) {
      var div = document.createElement('div');
      div.className = 'msg ' + item.who;
      div.innerHTML = item.text;
      chatFeed.appendChild(div);
      return div;
    }

    ScrollTrigger.create({
      trigger: '[data-chat]', start: 'top 70%', once: true,
      onEnter: function () {
        var delay = 0.2;
        script.forEach(function (item) {
          var el = buildMsg(item);
          gsap.set(el, { opacity: 0, y: 14, scale: 0.96 });
          gsap.to(el, {
            opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.4)', delay: delay
          });
          delay += item.who === 'sys' ? 0.9 : 1.15;
        });
      }
    });
  }

  /* ---------- services stack scaling ---------- */
  gsap.utils.toArray('.panel').forEach(function (panel, i, arr) {
    if (i === arr.length - 1) return;
    gsap.to(panel, {
      scale: 0.94, opacity: 0.55, ease: 'none',
      scrollTrigger: {
        trigger: panel, start: 'top 90px', end: 'top -40%', scrub: true
      }
    });
  });

  /* ---------- count-ups ---------- */
  gsap.utils.toArray('[data-count]').forEach(function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: function () {
        gsap.to(obj, {
          v: target, duration: 1.6, ease: 'power2.out',
          onUpdate: function () { el.textContent = Math.round(obj.v); }
        });
      }
    });
  });

  /* ---------- magnetic buttons ---------- */
  if (window.matchMedia('(hover: hover)').matches && !reduceMotion) {
    document.querySelectorAll('.magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.18;
        var y = (e.clientY - r.top - r.height / 2) * 0.3;
        gsap.to(el, { x: x, y: y, duration: 0.4, ease: 'power2.out' });
      });
      el.addEventListener('mouseleave', function () {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  /* ---------- contact form: Formspree with graceful fallback ---------- */
  var form = document.getElementById('contactForm');
  if (form) {
    var submitBtn = document.getElementById('contactSubmit');
    var note = document.getElementById('formNote');
    var noteDefault = note ? note.textContent : '';
    var endpoint = form.getAttribute('action');
    var notConfigured = !endpoint || endpoint.indexOf('YOUR_FORM_ID') !== -1;

    function mailtoFallback() {
      window.location.href = 'mailto:hello@regain.media?subject=' +
        encodeURIComponent('Strategy call request from ' + (form.company.value || 'a roofing company')) +
        '&body=' + encodeURIComponent(
          'Name: ' + form.name.value + '\nCompany: ' + form.company.value +
          '\nEmail: ' + form.email.value + '\n\n' + form.message.value
        );
    }

    function setNote(text, isError) {
      if (!note) return;
      note.textContent = text;
      note.style.color = isError ? '#ff6b2c' : '';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (notConfigured) {
        setNote('Form backend not connected yet, opening your email client instead.');
        mailtoFallback();
        return;
      }

      if (submitBtn) submitBtn.setAttribute('disabled', 'true');
      setNote('Sending...');

      fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            setNote('Sent. We reply within one business day.');
          } else {
            setNote('Something went wrong. Emailing you directly instead.', true);
            mailtoFallback();
          }
        })
        .catch(function () {
          setNote('Could not reach the form backend. Emailing you directly instead.', true);
          mailtoFallback();
        })
        .finally(function () {
          if (submitBtn) submitBtn.removeAttribute('disabled');
          setTimeout(function () { setNote(noteDefault); }, 6000);
        });
    });
  }
})();
