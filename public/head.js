// Runs in <head> before first paint: flags that JS is available, and settles the
// home page film straight to its final state for returning visitors this session
// and for anyone who prefers reduced motion.
(() => {
  const docEl = document.documentElement;
  docEl.classList.add('js');
  let filmSeen = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  try { filmSeen = filmSeen || !!sessionStorage.getItem('comet-film-seen'); } catch (e) { /* storage unavailable */ }
  if (filmSeen) docEl.classList.add('film-seen');
})();
