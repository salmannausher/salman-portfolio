const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Split section headings into word-mask spans ── */
document.querySelectorAll('.split').forEach(h=>{
  let wi=0;
  [...h.childNodes].forEach(node=>{
    if(node.nodeType!==Node.TEXT_NODE)return;
    const frag=document.createDocumentFragment();
    node.textContent.split(/\s+/).filter(Boolean).forEach(word=>{
      const outer=document.createElement('span');outer.className='w';
      const inner=document.createElement('span');inner.textContent=word;
      inner.style.transitionDelay=(wi++*70)+'ms';
      outer.appendChild(inner);
      frag.appendChild(outer);
      frag.appendChild(document.createTextNode(' '));
    });
    h.replaceChild(frag,node);
  });
});

/* ── Stagger: promote children of [data-stagger] to individual reveals ── */
document.querySelectorAll('[data-stagger]').forEach(c=>{
  [...c.children].forEach((el,i)=>{el.classList.add('fu');el.style.transitionDelay=(i*90)+'ms';});
});

/* ── Reveal on scroll ── */
const obs=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('vis');obs.unobserve(e.target);}
}),{threshold:.07});
document.querySelectorAll('.fu,.split').forEach(el=>obs.observe(el));

/* ── Count-up numbers ── */
function countUp(el){
  const to=parseFloat(el.dataset.to),dec=+(el.dataset.dec||0),comma=el.dataset.fmt==='comma';
  const D=1700,t0=performance.now();
  (function tick(t){
    let p=Math.min((t-t0)/D,1);p=1-Math.pow(1-p,4);
    let v=(to*p).toFixed(dec);
    if(comma)v=Number(v).toLocaleString('en-US');
    el.textContent=v;
    if(p<1)requestAnimationFrame(tick);
  })(t0);
}
if(!RM){
  const cObs=new IntersectionObserver(entries=>entries.forEach(e=>{
    if(e.isIntersecting){countUp(e.target);cObs.unobserve(e.target);}
  }),{threshold:.5});
  document.querySelectorAll('.cnt').forEach(el=>cObs.observe(el));
}

/* ── Spotlight glow follows cursor on cards ── */
document.querySelectorAll('.spot').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    card.style.setProperty('--mx',(e.clientX-r.left)+'px');
    card.style.setProperty('--my',(e.clientY-r.top)+'px');
  });
});

/* ── Magnetic buttons ── */
if(!RM&&matchMedia('(hover:hover) and (pointer:fine)').matches){
  document.querySelectorAll('.btn').forEach(b=>{
    b.addEventListener('mousemove',e=>{
      const r=b.getBoundingClientRect();
      b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.16}px,${(e.clientY-r.top-r.height/2)*.3}px)`;
    });
    b.addEventListener('mouseleave',()=>{b.style.transform='';});
  });
}

/* ── Custom cursor ── */
if(!RM&&matchMedia('(hover:hover) and (pointer:fine)').matches){
  document.body.classList.add('has-cursor');
  const dot=document.getElementById('curDot'),ring=document.getElementById('curRing');
  let mx=-100,my=-100,rx=-100,ry=-100,shown=false;
  document.addEventListener('mousemove',e=>{
    mx=e.clientX;my=e.clientY;
    if(!shown){shown=true;dot.style.opacity=1;ring.style.opacity=1;rx=mx;ry=my;}
    dot.style.left=mx+'px';dot.style.top=my+'px';
  });
  (function follow(){
    rx+=(mx-rx)*.16;ry+=(my-ry)*.16;
    ring.style.left=rx+'px';ring.style.top=ry+'px';
    requestAnimationFrame(follow);
  })();
  document.addEventListener('mouseover',e=>{
    ring.classList.toggle('hov',!!e.target.closest('a,button,.blog-card'));
  });
}
