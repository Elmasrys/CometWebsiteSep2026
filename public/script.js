const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Navigation: mobile menu and dropdowns ----------
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const menus = [...document.querySelectorAll('.menu')];

const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const setMobileMenu = open => {
  nav.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.textContent = open ? 'Close' : 'Menu';
  document.body.style.overflow = open ? 'hidden' : '';
};
navToggle?.addEventListener('click', () => setMobileMenu(!nav.classList.contains('open')));

const setDropdown = (menu, open) => {
  menu.classList.toggle('open', open);
  menu.querySelector('button').setAttribute('aria-expanded', String(open));
};
menus.forEach(menu => menu.querySelector('button').addEventListener('click', () => {
  const open = !menu.classList.contains('open');
  menus.forEach(other => other !== menu && setDropdown(other, false));
  setDropdown(menu, open);
}));
// Following an in-page link (e.g. /about#people while on /about) closes the menus.
document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => {
  menus.forEach(menu => setDropdown(menu, false));
  if (nav?.classList.contains('open')) setMobileMenu(false);
}));
document.addEventListener('click', e => {
  menus.forEach(menu => !menu.contains(e.target) && setDropdown(menu, false));
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  const open = menus.find(menu => menu.classList.contains('open'));
  if (open) { setDropdown(open, false); open.querySelector('button').focus(); }
  if (nav?.classList.contains('open')) { setMobileMenu(false); navToggle.focus(); }
});
window.matchMedia('(min-width: 981px)').addEventListener('change', e => {
  if (e.matches && nav?.classList.contains('open')) setMobileMenu(false);
});

// ---------- Hero: restrained parallax on the image ----------
// Desktop only: on small screens the image simply sits in its frame.
const parallax = document.querySelector('[data-parallax]');
const wide = window.matchMedia('(min-width: 981px)');
if (parallax && !reducedMotion) {
  let ticking = false;
  const update = () => {
    const y = wide.matches ? Math.min(window.scrollY, window.innerHeight) : 0;
    parallax.style.transform = `translate3d(0, ${(y * 0.06).toFixed(1)}px, 0)`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
}

// ---------- Scroll reveal and diagram animation ----------
const revealables = document.querySelectorAll('.reveal, .reveal-image');
if ('IntersectionObserver' in window && !reducedMotion) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  revealables.forEach(el => {
    const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal') || c.classList.contains('reveal-image'));
    el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 4) * 80}ms`;
    io.observe(el);
  });
} else {
  revealables.forEach(el => el.classList.add('in'));
}

// ---------- Home markets: the featured photograph follows the market in focus ----------
// Every market stays visible and linked; the photograph only changes when one is supplied.
document.querySelectorAll('[data-market-index]').forEach(index => {
  const slides = [...index.querySelectorAll('[data-market-slide]')];
  if (slides.length < 2) return;
  const show = key => {
    // A market without its own photograph returns to the featured one.
    const target = slides.find(s => s.dataset.marketSlide === key) || slides[0];
    slides.forEach(s => s.classList.toggle('is-active', s === target));
  };
  index.querySelectorAll('[data-market]').forEach(item => {
    item.addEventListener('mouseenter', () => show(item.dataset.market));
    item.addEventListener('focusin', () => show(item.dataset.market));
  });
});

// ---------- Contact form ----------
const form = document.getElementById('contact-form');
if (form) {
  const params = new URLSearchParams(location.search);
  const select = form.elements.topic;
  const topic = params.get('topic');
  if (topic && [...select.options].some(o => o.value === topic)) select.value = topic;

  const status = form.querySelector('.form-status');
  const showError = message => {
    status.textContent = message;
    status.classList.add('error');
  };
  if (params.get('error') === '1') showError('Something went wrong sending your enquiry. Please try again.');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    status.classList.remove('error');
    status.textContent = 'Sending…';
    try {
      const data = Object.fromEntries(new FormData(form));
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'Something went wrong sending your enquiry. Please try again.');
      location.assign('/enquiry-received');
    } catch (err) {
      showError(err.message);
      button.disabled = false;
    }
  });
}
