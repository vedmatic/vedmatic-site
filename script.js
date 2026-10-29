(()=>{
const UPI='vedantlegacy11@fam',$=s=>document.querySelector(s),reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,fine=matchMedia('(pointer:fine)').matches;
const items=[['Blue V1',1,3/2],['VOX24',2,16/9],['Portrait Subject',3,2/3],['4K Texture',4,3/4],['Scenery Enhance',5,4/3]];
const alts=['Brooklyn Bridge skyline at blue hour','Glacier valley with hikers','Portrait of a woman in a forest clearing','Aerial coastline at sunset','Canal-side town at dusk'];
/* comparison sliders + gallery */
$('#sliders').innerHTML=items.map(([n,i,r],k)=>`<div class="cmp reveal"><h3>${n}</h3><div class="box" style="--r:${r}"><img src="before${i}.jpg" alt="${alts[k]}, before" loading="lazy"><img class="aft" src="after${i}.jpg" alt="${alts[k]}, after" loading="lazy"><span class="lbl b">Before</span><span class="lbl a">After</span><div class="bar"></div><input type="range" min="0" max="100" value="50" aria-label="${n}: drag to compare before and after"></div></div>`).join('');
document.querySelectorAll('.cmp input').forEach(el=>el.addEventListener('input',()=>el.parentNode.style.setProperty('--p',el.value)));
$('#strip').innerHTML=items.map(([n,i],k)=>`<figure><img src="after${i}.jpg" alt="${alts[k]}, graded with ${n}" loading="lazy"><figcaption class="glass">${n}</figcaption></figure>`).join('');
/* nav */
const b=$('#burger'),m=$('#menu');
b.onclick=()=>{const o=m.classList.toggle('open');b.setAttribute('aria-expanded',o)};
m.addEventListener('click',e=>{if(e.target.tagName==='A'){m.classList.remove('open');b.setAttribute('aria-expanded',false)}});
/* payment */
const dlg=$('#modal'),price=$('#price').dataset.price;
document.querySelectorAll('[data-price-text]').forEach(e=>e.textContent=price);
$('#upilink').href=`upi://pay?pa=${UPI}&pn=Vedmatic&am=${price}&cu=INR&tn=Urban%20Cinematic%20Pack`;
$('#buy').onclick=()=>{dlg.showModal();$('#copymsg').textContent=''};
$('#close').onclick=()=>dlg.close();
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
$('#copy').onclick=async()=>{const s=$('#copymsg');try{await navigator.clipboard.writeText(UPI);s.textContent='UPI ID copied.'}catch{const r=document.createRange();r.selectNode($('#upi'));getSelection().removeAllRanges();getSelection().addRange(r);s.textContent='Copy blocked. The UPI ID is selected, press Ctrl/Cmd+C.'}};
/* magnetic buttons + product tilt (desktop only) */
if(fine&&!reduce){
 document.querySelectorAll('.mag').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.2}px,${(e.clientY-r.top-r.height/2)*.3}px)`});el.addEventListener('pointerleave',()=>el.style.transform='')});
 const st=$('#stage'),t=$('#tilt');
 st.addEventListener('pointermove',e=>{const r=st.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;t.style.transform=`rotateY(${x*18}deg) rotateX(${-y*18}deg)`});
 st.addEventListener('pointerleave',()=>t.style.transform='');
}
/* hero ink: lightweight canvas approximation, not a physical fluid simulation */
const cv=$('#ink');
if(!reduce){const c=cv.getContext('2d'),small=innerWidth<820,N=small?3:5,bl=[],ptr={x:.5,y:.5};let w,h,vis=true,raf;
 const rs=()=>{w=cv.width=cv.clientWidth>>1;h=cv.height=cv.clientHeight>>1};rs();addEventListener('resize',rs);
 for(let i=0;i<N;i++)bl.push({x:Math.random(),y:Math.random(),a:Math.random()*6,s:.15+Math.random()*.2});
 cv.parentNode.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect();ptr.x=(e.clientX-r.left)/r.width;ptr.y=(e.clientY-r.top)/r.height});
 new IntersectionObserver(([e])=>{vis=e.isIntersecting;if(vis)loop()}).observe(cv);
 function loop(){cancelAnimationFrame(raf);if(!vis||document.hidden)return;c.clearRect(0,0,w,h);
  bl.forEach((o,i)=>{o.a+=.004;const tx=i===0?ptr.x:.5+Math.cos(o.a)*.35,ty=i===0?ptr.y:.5+Math.sin(o.a*.8)*.3;o.x+=(tx-o.x)*(i===0?.04:.01);o.y+=(ty-o.y)*(i===0?.04:.01);
   const R=Math.max(w,h)*(o.s+.1),g=c.createRadialGradient(o.x*w,o.y*h,0,o.x*w,o.y*h,R);g.addColorStop(0,i%2?'rgba(255,46,46,.35)':'rgba(120,20,30,.4)');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,w,h)});
  raf=requestAnimationFrame(loop)}
 document.addEventListener('visibilitychange',loop);loop();
}
/* GSAP motion (page works without it) */
if(window.gsap&&window.ScrollTrigger&&!reduce){
 gsap.registerPlugin(ScrollTrigger);
 gsap.from('.hero h1 i',{yPercent:110,duration:1.1,stagger:.08,ease:'power4.out',delay:.15});
 gsap.from('.kicker,.sub,.cta',{opacity:0,y:20,duration:.9,stagger:.15,delay:.8});
 gsap.from('.hero-img',{scale:1.2,duration:2.2,ease:'power2.out'});
 gsap.from('.nav',{yPercent:-100,duration:.8,delay:.5});
 gsap.to('.hero-img',{yPercent:12,ease:'none',scrollTrigger:{trigger:'.hero',scrub:true,start:'top top',end:'bottom top'}});
 const pc={v:0};gsap.to(pc,{v:+price,duration:1.6,ease:'power3.out',scrollTrigger:{trigger:'#price',start:'top 85%',once:true},onUpdate:()=>$('#price').textContent=Math.round(pc.v)});
 gsap.from('.tilt img',{clipPath:'inset(0 0 100% 0)',duration:1.2,stagger:.2,ease:'power3.out',scrollTrigger:{trigger:'#stage',start:'top 75%'}});
 document.querySelectorAll('.cmp .box').forEach(el=>gsap.from(el,{clipPath:'inset(0 50% 0 50%)',duration:1.1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 82%'}}));
 gsap.from('.strip figure',{x:120,opacity:0,duration:1,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:'#strip',start:'top 85%'}});
 gsap.from('.flow li',{scaleX:0,transformOrigin:'left',opacity:0,duration:.8,stagger:.15,scrollTrigger:{trigger:'.flow ol',start:'top 85%'}});
}
})();
