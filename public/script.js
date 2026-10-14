const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Navigation: mobile menu and "What we do" dropdown ----------
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.menu');
const menuButton = menu?.querySelector('button');

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

const setDropdown = open => {
  menu.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
};
menuButton?.addEventListener('click', () => setDropdown(!menu.classList.contains('open')));
document.addEventListener('click', e => {
  if (menu && !menu.contains(e.target)) setDropdown(false);
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (menu?.classList.contains('open')) { setDropdown(false); menuButton.focus(); }
  if (nav?.classList.contains('open')) { setMobileMenu(false); navToggle.focus(); }
});
window.matchMedia('(min-width: 981px)').addEventListener('change', e => {
  if (e.matches && nav?.classList.contains('open')) setMobileMenu(false);
});

// ---------- Hero: restrained parallax on the image ----------
const parallax = document.querySelector('[data-parallax]');
if (parallax && !reducedMotion) {
  let ticking = false;
  const update = () => {
    const y = Math.min(window.scrollY, window.innerHeight);
    parallax.style.transform = `translate3d(0, ${(y * 0.06).toFixed(1)}px, 0)`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
}

// ---------- Scroll reveal and diagram animation ----------
const revealables = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reducedMotion) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  revealables.forEach(el => {
    const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 4) * 80}ms`;
    io.observe(el);
  });
} else {
  revealables.forEach(el => el.classList.add('in'));
}

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
