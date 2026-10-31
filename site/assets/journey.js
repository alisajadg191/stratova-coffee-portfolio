/* One shared scroll-driven bean cast. Native scroll; no pinned sections or animation library. */
(() => {
  const query = new URLSearchParams(location.search);
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => media.matches || query.get('motion') === 'reduce';
  const main = document.querySelector('main');
  const hero = document.querySelector('.hero-art');
  if (!main || !hero) return;
  const layer = document.createElement('div');
  layer.className = 'bean-journey';
  layer.setAttribute('aria-hidden', 'true');
  const actors = [0, 1, 2].map(i => {
    const el = document.createElement('div');
    el.className = 'journey-bean journey-bean-' + i;
    const img = document.createElement('img');
    img.src = '../../assets/bean.svg'; img.alt = ''; img.width = 100; img.height = 130;
    el.append(img); layer.append(el); return el;
  });
  const dust = Array.from({length: 9}, () => {
    const el = document.createElement('i'); el.className = 'coffee-ground'; layer.append(el); return el;
  });
  document.body.append(layer);
  let paths = [], geometry, raf = 0, alive = true;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a,b,p) => a + (b-a)*p;
  const ease = p => p*p*(3-2*p);
  const rect = el => { const r = el.getBoundingClientRect(); return {x:r.left,y:r.top+scrollY,w:r.width,h:r.height}; };
  function measure() {
    const W = innerWidth, H = innerHeight, mobile = W < 601;
    const coffee = document.querySelector('#coffee'), ritual = document.querySelector('#ritual');
    const brewing = document.querySelector('#brewing'), story = document.querySelector('#story');
    const cup = rect(document.querySelector('.final-cup'));
    const brew = rect(document.querySelector('.brew-grid>img'));
    const packs=[...document.querySelectorAll('.product .pack')].map(rect);
    const bag = mobile ? packs[0] : packs.at(-1);
    const a = rect(hero), scale = a.w/hero.offsetWidth;
    const origin = [...hero.querySelectorAll('.bean')].map(el => ({
      x:a.x+(el.offsetLeft+el.offsetWidth/2)*scale,
      y:a.y+(el.offsetTop+el.offsetHeight/2)*scale,
      size:el.offsetWidth*scale
    }));
    const unit = mobile ? 76 : clamp(W*.12,150,230);
    const maxScroll = document.documentElement.scrollHeight-H;
    const brewMouth = {x:brew.x+brew.w*.36,y:brew.y+brew.h*.34};
    const mug = {x:brew.x+brew.w*.77,y:brew.y+brew.h*.80};
    const cupBase = {x:cup.x+cup.w*.51,y:cup.y+cup.h*.91};
    const drop = brewMouth.y-H*.35;
    const ground = drop+H*.18;
    const storyLane = Math.min(story.offsetTop-H*.10,maxScroll-H*.36);
    const finish=mobile?Math.min(maxScroll-12,document.querySelector('.final').offsetTop-20):maxScroll-12;
    const final = Math.max(storyLane+60,finish);
    const nodes = [
      {s:0, x:origin[0].x,y:origin[0].y,size:origin[0].size,r:35,spread:0},
      {s:Math.max(120,coffee.offsetTop-H*.74),x:W*.59,y:coffee.offsetTop+H*.03,size:unit*1.15,r:-110,spread:1,arcX:-W*.08,arcY:-H*.08},
      {s:coffee.offsetTop-H*.16,x:W*.55,y:coffee.offsetTop+H*.10,size:unit,r:-300,spread:1,arcX:W*.12,arcY:-H*.14},
      {s:coffee.offsetTop+H*.24,x:Math.min(W-unit*.5,bag.x+bag.w),y:bag.y+bag.h*.74,size:unit*.86,r:-540,spread:.7,arcX:W*.10,arcY:-H*.10},
      {s:ritual.offsetTop-H*.58,x:Math.min(W-unit*.5,bag.x+bag.w),y:bag.y+bag.h*.74,size:unit*.86,r:-565,spread:.7},
      {s:ritual.offsetTop-H*.19,x:W*.91,y:ritual.offsetTop-H*.02,size:unit,r:-790,spread:.65,arcX:-W*.06,arcY:-H*.08},
      {s:brewing.offsetTop-H*.32,x:W*.80,y:brewing.offsetTop-H*.12,size:unit*1.05,r:-1020,spread:.8,arcX:W*.06,arcY:H*.04},
      {s:drop,x:brewMouth.x,y:brewMouth.y,size:unit*.48,r:-1330,spread:0,arcX:-W*.17,arcY:-H*.09},
      {s:ground,x:brewMouth.x+brew.w*.015,y:brewMouth.y+brew.h*.29,size:unit*.16,r:-1490,spread:0,opacity:.08},
      {s:Math.max(ground+80,story.offsetTop-H*.65),x:mug.x,y:mug.y-H*.06,size:unit*.62,r:-1650,spread:.3,arcX:W*.08,arcY:-H*.08},
      {s:storyLane,x:W*.88,y:story.offsetTop+story.offsetHeight*.74,size:unit*.84,r:-1850,spread:.6,arcX:W*.12,arcY:-H*.19},
      {s:final,x:cupBase.x,y:cupBase.y+12,size:unit*.66,r:-1990,spread:0,final:true,arcX:-W*.06,arcY:-H*.13}
    ];
    if(mobile){
      const checkpoints=packs.slice(1).map((pack,i)=>({s:pack.y+pack.h*.74-H*.60,x:W*.88,y:pack.y+pack.h*.74,size:unit*.86,r:-610-i*65,spread:.5,arcX:(i%2?-1:1)*W*.055,arcY:-H*.04}));
      nodes[4].x=W*.88;nodes[4].y=packs.at(-1).y+packs.at(-1).h*.74;nodes[4].r=-730;
      nodes.splice(4,0,...checkpoints);
    }
    // Short viewports and very long mobile catalogues still share the same ordered story.
    for(let i=1;i<nodes.length;i++) nodes[i].s=Math.max(nodes[i-1].s+1,nodes[i].s);
    paths=actors.map((_,i)=>nodes.map((n,j)=> {
      const offsets = mobile ? [-97,-27,42] : [-190,-58,105];
      const scatter = n.final ? offsets[i] : (i===1 ? -W*.074 : i===2 ? W*.042 : 0)*(n.spread||0);
      const depth = [1,.70,.48][i];
      return {...n,
        s:n.s+(j===0||n.final ? 0 : i*Math.min(90,H*.07)),
        x:j===0?origin[i].x:n.x+scatter,
        y:j===0?origin[i].y:n.y+(n.final ? [10,28,-9][i] : [0,H*.075,-H*.052][i]*(n.spread||0)),
        size:j===0?origin[i].size:n.size*depth,
        r:n.r+[0,-72,65][i]
      };
    }));
    geometry={W,H,drop,ground,brewMouth,brew,mobile};
    window.beanJourney.scrollStops={coffee:coffee.offsetTop-24,brew:brewing.offsetTop-H*.32,drop,ground,story:storyLane,final};
    layer.dataset.stops=JSON.stringify(window.beanJourney.scrollStops);
    update(scrollY);
  }
  function sample(path,s) {
    let index=0;
    while(index<path.length-2 && s>path[index+1].s) index++;
    const a=path[index], b=path[index+1];
    const p=clamp((s-a.s)/(b.s-a.s)), q=ease(p), arc=Math.sin(Math.PI*q);
    const result={
      x:lerp(a.x,b.x,q)+(b.arcX||0)*arc,
      y:lerp(a.y,b.y,q)+(b.arcY||0)*arc-s,
      size:lerp(a.size,b.size,q),r:lerp(a.r,b.r,q),opacity:lerp(a.opacity??1,b.opacity??1,q)
    };
    if(s>=path.at(-1).s){const end=path.at(-1);return {...result,x:end.x,y:end.y-s,size:end.size,r:end.r,opacity:1};}
    return result;
  }
  function update(s=scrollY) {
    if(!geometry || reduced()) { layer.hidden=true;document.documentElement.classList.remove('journey-ready');return; }
    layer.hidden=false; document.documentElement.classList.add('journey-ready');
    const values=paths.map(path=>sample(path,s));
    values.forEach((p,i)=>{
      const width=p.size,height=width*1.30;
      actors[i].style.transform=`translate3d(${p.x-50}px,${p.y-65}px,0) rotate(${p.r}deg) rotateY(${Math.sin(s*.003+i)*19}deg) scale(${width/100})`;
      actors[i].style.opacity=p.opacity;
      actors[i].dataset.size=width.toFixed(1);actors[i].dataset.x=p.x.toFixed(1);actors[i].dataset.y=p.y.toFixed(1);
    });
    const {drop,ground,brewMouth,brew,H}=geometry;
    const grinding=clamp((s-drop)/(ground-drop));
    const visible=Math.sin(grinding*Math.PI);
    dust.forEach((el,i)=>{
      const angle=i*2.4, radius=brew.w*.035*(.5+grinding);
      const x=brewMouth.x+Math.cos(angle)*radius;
      const y=brewMouth.y+brew.h*.13+grinding*brew.h*.16+Math.sin(angle)*18-s;
      el.style.transform=`translate3d(${x}px,${y}px,0) rotate(${i*48+s*.4}deg)`;
      el.style.opacity=visible*.85;
    });
    layer.dataset.scroll=Math.round(s);layer.dataset.phase=s<drop?'travelling':s<ground?'brewing':s<window.beanJourney.scrollStops.story?'pouring':'settling';
  }
  function schedule(){if(!raf && alive)raf=requestAnimationFrame(()=>{raf=0;update()});}
  function resize(){if(!alive)return;measure();}
  window.beanJourney={measure,update,scrollStops:{}};
  const sizeObserver=new ResizeObserver(resize);sizeObserver.observe(main);
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',resize,{passive:true});
  media.addEventListener('change',resize);
  document.fonts.ready.then(resize);
  addEventListener('load',resize,{once:true});
  addEventListener('pagehide',()=>{alive=false;cancelAnimationFrame(raf);raf=0;sizeObserver.disconnect();removeEventListener('scroll',schedule);removeEventListener('resize',resize);media.removeEventListener('change',resize)});
  addEventListener('pageshow',e=>{if(e.persisted){alive=true;sizeObserver.observe(main);addEventListener('scroll',schedule,{passive:true});addEventListener('resize',resize,{passive:true});media.addEventListener('change',resize);measure()}});
  measure();
})();
