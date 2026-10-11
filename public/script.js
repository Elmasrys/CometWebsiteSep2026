const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Current page in the nav ----------
let current = location.pathname.split('/').pop() || 'index.html';
if (!current.includes('.')) current += '.html';
document.querySelectorAll('.nav a[href]').forEach(a => {
  if (a.getAttribute('href') !== current) return;
  a.setAttribute('aria-current', 'page');
  if (a.hasAttribute('data-nav')) a.classList.add('active');
  if (a.closest('.dropdown')) a.closest('.menu').querySelector('button').classList.add('active');
});

// ---------- Navigation: scrolled state, mobile menu, dropdown ----------
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.menu');
const menuButton = menu?.querySelector('button');

const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 24);
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

// ---------- Opening film (home page) ----------
const intro = document.querySelector('.intro-film');
if (intro && !root.classList.contains('intro-seen')) {
  const lines = [...intro.querySelectorAll('.film-line')];
  const end = intro.querySelector('.film-end');
  const enter = intro.querySelector('.film-enter');
  const skip = intro.querySelector('.film-skip');
  const timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));

  const finish = () => {
    timers.forEach(clearTimeout);
    intro.classList.add('hidden');
    try { sessionStorage.setItem('comet-intro-seen', '1'); } catch (e) { /* ignore */ }
    document.getElementById('main')?.focus({ preventScroll: true });
  };
  const resolve = () => {
    lines.forEach(l => l.classList.remove('show'));
    intro.classList.add('lit', 'resolved');
    end.classList.add('show');
    intro.focus({ preventScroll: true });
  };

  skip.addEventListener('click', finish);
  enter.addEventListener('click', finish);
  intro.addEventListener('keydown', e => { if (e.key === 'Escape') finish(); });
  intro.setAttribute('tabindex', '-1');
  intro.focus({ preventScroll: true });

  if (reducedMotion) {
    resolve();
  } else {
    let i = 0;
    const next = () => {
      lines.forEach(l => l.classList.remove('show'));
      if (i === 5) intro.classList.add('lit'); // the eclipse ignites on "AI is changing the fundamentals"
      if (i < lines.length) { lines[i++].classList.add('show'); later(next, 1700); }
      else later(resolve, 600);
    };
    later(next, 700);
  }
}
document.getElementById('main')?.setAttribute('tabindex', '-1');

// ---------- Scroll reveal ----------
const revealables = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reducedMotion) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  revealables.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 90}ms`;
    io.observe(el);
  });
} else {
  revealables.forEach(el => el.classList.add('in'));
}

// ---------- Contact form ----------
const form = document.getElementById('contact-form');
if (form) {
  const params = new URLSearchParams(location.search);
  const topic = params.get('topic');
  const select = form.elements.topic;
  if (topic && [...select.options].some(o => o.value === topic)) select.value = topic;

  const status = form.querySelector('.form-status');
  const showSent = () => {
    const done = document.createElement('div');
    done.className = 'form-sent';
    done.setAttribute('role', 'status');
    done.innerHTML = '<div class="eyebrow">Thank you</div><h2>Your enquiry has been sent.</h2><p>We will be in touch shortly.</p>';
    form.replaceWith(done);
  };
  if (params.get('sent') === '1') showSent();
  if (params.get('error') === '1') {
    status.textContent = 'Something went wrong sending your enquiry. Please try again.';
    status.classList.add('error');
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    status.classList.remove('error');
    status.textContent = 'Sending…';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong sending your enquiry. Please try again.');
      showSent();
    } catch (err) {
      status.textContent = err.message;
      status.classList.add('error');
      button.disabled = false;
    }
  });
}
