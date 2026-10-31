const frame=document.querySelector('iframe'),capture=document.querySelector('#capture'),screen=document.querySelector('.screen'),status=document.querySelector('#status');
let guided=false,run=0,previousScrollBehaviour='';
function size(){const width=screen.clientWidth,base=capture.classList.contains('mobile')?390:1440;screen.style.setProperty('--scale',width/base);screen.style.setProperty('--screen-height',(capture.classList.contains('mobile')?844:960)*width/base+'px')}
new ResizeObserver(size).observe(screen);
function stop(){cancelAnimationFrame(run);run=0;guided=false;document.querySelector('.closing').classList.remove('show');try{frame.contentDocument.documentElement.style.scrollBehavior=previousScrollBehaviour}catch{}status.textContent='Stopped. Browse freely.'}
document.querySelector('#stop').onclick=stop;
for(const mode of ['desktop','mobile'])document.querySelector('#'+mode).onclick=()=>{stop();capture.classList.toggle('mobile',mode==='mobile');size();requestAnimationFrame(()=>requestAnimationFrame(()=>frame.contentWindow.scrollTo(0,0)))};
function watch(){try{const d=frame.contentDocument;if(!d)return;for(const event of ['pointerdown','wheel','keydown','touchstart'])d.addEventListener(event,()=>{if(guided)stop()},{passive:true})}catch{stop()}}
frame.addEventListener('load',watch);
document.querySelector('#play').onclick=()=>{
 stop();const w=frame.contentWindow,d=frame.contentDocument;if(!d||!w.beanJourney)return;
 guided=true;status.textContent='Playing the 20-second bean journey. Interact inside the website to stop.';
 previousScrollBehaviour=d.documentElement.style.scrollBehavior;d.documentElement.style.scrollBehavior='auto';d.querySelector('dialog').close();w.scrollTo(0,0);w.beanJourney.measure();
 d.querySelectorAll('.hero,.hero *, .journey-bean img').forEach(el=>el.getAnimations().forEach(a=>{a.cancel();a.play()}));
 const stops=w.beanJourney.scrollStops;
 const timeline=[[0,0],[2.3,0],[5.8,stops.coffee],[8,stops.coffee],[10,stops.brew],[12.3,stops.drop],[13.4,stops.ground],[15,stops.story],[17,stops.final]];
 const start=performance.now();const smooth=p=>{p=Math.max(0,Math.min(1,p));return p*p*(3-2*p)};
 function tick(now){if(!guided)return;const t=(now-start)/1000;let k=0;while(k<timeline.length-2&&t>timeline[k+1][0])k++;const [ta,ya]=timeline[k],[tb,yb]=timeline[k+1];const y=ya+(yb-ya)*smooth((t-ta)/(tb-ta));w.scrollTo(0,y);w.beanJourney.update(y);
 const dialog=d.querySelector('dialog');if(t>=6.7&&t<8){if(!dialog.open)d.querySelector('[data-product="0"]').click()}else if(dialog.open)dialog.close();
 d.querySelector('.product .pack img').style.transform=t>=5.9&&t<6.7?'rotate(-5deg) translateY(-9px)':'';
 document.querySelector('.closing').classList.toggle('show',t>=17.5);
 if(t>=20){guided=false;run=0;d.documentElement.style.scrollBehavior=previousScrollBehaviour;status.textContent='Finished. Replay or stop to browse.';return}run=requestAnimationFrame(tick)}
 run=requestAnimationFrame(tick);
};size();
