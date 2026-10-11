
const current=location.pathname.split('/').pop()||'index.html';
document.querySelectorAll('[data-nav]').forEach(a=>{if(a.getAttribute('href')===current)a.classList.add('active')});
const intro=document.querySelector('.intro-film');
if(intro){
 const skip=document.querySelector('.film-skip');
 const enter=document.querySelector('.film-enter');
 const lines=[...document.querySelectorAll('.film-line')];
 const sub=document.querySelector('.film-sub');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const finish=()=>intro.classList.add('hidden');
 skip?.addEventListener('click',finish); enter?.addEventListener('click',finish);
 if(sessionStorage.getItem('comet-intro-seen')) finish();
 else if(reduced){lines.forEach(x=>x.classList.add('show'));sub?.classList.add('show');enter?.classList.add('show')}
 else{
   let i=0;
   const next=()=>{
     lines.forEach(x=>x.classList.remove('show'));
     if(i<lines.length){lines[i].classList.add('show');i++;setTimeout(next,1500)}
     else{setTimeout(()=>{sub?.classList.add('show');enter?.classList.add('show');sessionStorage.setItem('comet-intro-seen','1')},700)}
   };
   setTimeout(next,500);
 }
}
