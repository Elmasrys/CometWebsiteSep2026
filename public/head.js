// Runs in <head> before first paint: flags that JS is available, and skips the
// opening film for visitors who have already seen it this session.
document.documentElement.classList.add('js');
try {
  if (sessionStorage.getItem('comet-intro-seen')) document.documentElement.classList.add('intro-seen');
} catch (e) { /* storage unavailable: the film simply plays */ }
