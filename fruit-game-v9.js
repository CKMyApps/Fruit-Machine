'use strict';
const SYMBOLS=["cherry","banana","bitten apple","grapes"];
function payout(reels){const c=[0,0,0,0];for(const r of reels)c[r]++;return (c[0]===3?50:c[0]===2?5:0)+(c[1]===2?25:0)+(c[2]===2?10:0);}
if(typeof module!=='undefined')module.exports={payout};
if(typeof document!=='undefined'){
const $=id=>document.getElementById(id), key='ckmyapps.fruitmachine.save.v1', soundKey='ckmyapps.fruitmachine.sound.v1';
const read=k=>{try{return localStorage.getItem(k)}catch{return null}}, write=(k,v)=>{try{localStorage.setItem(k,v);return true}catch{return false}};
let state={balance:100,win:0,reels:[0,1,2]},busy=false,sound=read(soundKey)!=='off',audio;
const reels=[...document.querySelectorAll('.reel')];
const table='<div class="payrow"><span><img class="fruit" src="fruit-0.svg" alt="cherry"><img class="fruit" src="fruit-0.svg" alt="cherry"><img class="fruit" src="fruit-0.svg" alt="cherry"></span><strong>€50</strong></div><div class="payrow"><span>Exactly two bananas</span><strong>€25</strong></div><div class="payrow"><span>Exactly two bitten apples</span><strong>€10</strong></div><div class="payrow"><span>Exactly two cherries</span><strong>€5</strong></div>';
$('table').innerHTML=table;document.querySelector('.payouts').innerHTML=table;
function saved(){try{const s=JSON.parse(read(key));return s&&Number.isSafeInteger(s.balance)&&s.balance>=0&&Number.isSafeInteger(s.win)&&s.win>=0&&Array.isArray(s.reels)&&s.reels.length===3&&s.reels.every(n=>Number.isInteger(n)&&n>=0&&n<4)?s:null}catch{return null}}
function tone(freq=440,d=.075){if(!sound)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume().catch(()=>{});const o=audio.createOscillator(),g=audio.createGain(),t=audio.currentTime;o.type='triangle';o.frequency.value=freq;g.gain.setValueAtTime(.045,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(audio.destination);o.start(t);o.stop(t+d)}catch{}}
function show(id){if(busy)return;document.querySelectorAll('.screen').forEach(e=>e.hidden=e.id!==id);$('load').disabled=!saved();tone(330);}
const artwork=["<path d=\"M30 53Q35 24 64 10Q65 35 74 57\" fill=\"none\" stroke=\"#568344\" stroke-width=\"6\"/><path d=\"M63 12Q36 1 25 20Q46 29 63 12\" fill=\"#71a849\"/><circle cx=\"28\" cy=\"70\" r=\"22\" fill=\"#d83942\" stroke=\"#8d2630\" stroke-width=\"3\"/><circle cx=\"73\" cy=\"72\" r=\"21\" fill=\"#c82738\" stroke=\"#8d2630\" stroke-width=\"3\"/><path d=\"M18 61l4-4m42 6 4-4\" stroke=\"#ff9b9b\" stroke-width=\"6\" stroke-linecap=\"round\"/>","<path d=\"M10 56Q55 77 74 16L83 8 91 13Q98 72 58 86Q28 97 10 64Z\" fill=\"#ffd34b\" stroke=\"#a66b23\" stroke-width=\"3\"/><path d=\"M16 64Q60 91 85 23\" fill=\"none\" stroke=\"#e3a526\" stroke-width=\"6\"/><path d=\"M78 17 83 8 91 13\" stroke=\"#704025\" stroke-width=\"5\" fill=\"none\"/>","<defs><clipPath id=\"rainbowApple\"><path d=\"M51 27C42 27 35 21 25 24C8 28 0 44 5 64C9 83 22 98 31 98C39 98 43 93 51 94C59 93 64 98 72 98C81 98 91 84 95 73C74 65 75 44 92 34C83 23 70 21 59 25Z\"/><path d=\"M49 24C46 13 56 2 70 1C70 13 62 24 49 24Z\"/></clipPath></defs><g clip-path=\"url(#rainbowApple)\"><path fill=\"#79bd20\" d=\"M0 0H100V36H0Z\"/><path fill=\"#ffca25\" d=\"M0 36H100V49H0Z\"/><path fill=\"#ff671c\" d=\"M0 49H100V62H0Z\"/><path fill=\"#da123b\" d=\"M0 62H100V75H0Z\"/><path fill=\"#ad1ba2\" d=\"M0 75H100V88H0Z\"/><path fill=\"#00a5d3\" d=\"M0 88H100V100H0Z\"/></g>","<path d=\"M51 28V10Q66 3 76 15\" fill=\"none\" stroke=\"#568344\" stroke-width=\"6\"/><g fill=\"#8155b5\" stroke=\"#55357e\" stroke-width=\"3\"><circle cx=\"31\" cy=\"35\" r=\"17\"/><circle cx=\"67\" cy=\"35\" r=\"17\"/><circle cx=\"42\" cy=\"57\" r=\"17\"/><circle cx=\"68\" cy=\"60\" r=\"15\"/><circle cx=\"51\" cy=\"81\" r=\"15\"/></g>"];
const artReady=true;
const strips=reels.map((r,i)=>{
 const strip=document.createElement('div');strip.className='reel-strip';
 strip.setAttribute('aria-hidden','true');
 for(let j=0;j<24;j++){
  const cell=document.createElement('div');cell.className='reel-cell';
  const uid='apple-'+i+'-'+j;
  cell.innerHTML='<svg class="fruit" viewBox="0 0 100 100" aria-hidden="true">'+artwork[j%4].replaceAll('rainbowApple',uid)+'</svg>';
  strip.appendChild(cell);
 }
 r.replaceChildren(strip);return strip;
});
function position(i,n){strips[i].style.transform='translate3d(0,'+(-110*n)+'px,0)'}
function drawReel(i,n){position(i,n);reels[i].dataset.symbol=n;reels[i].setAttribute('aria-label',SYMBOLS[n]);}
function animateReel(r,i,result,duration,reduced,done){
 const start=Number(r.dataset.symbol)||0;
 const distance=(8+i*4)+(result-start+4)%4;
 const end=start+distance;
 let finished=false;
 const finish=()=>{if(finished)return;finished=true;drawReel(i,result);done()};
 if(reduced){setTimeout(finish,duration);return}
 const began=performance.now();
 function frame(now){if(finished)return;const t=Math.min(1,Math.max(0,(now-began)/duration));const eased=1-Math.pow(1-t,2);position(i,start+(end-start)*eased);if(t<1)requestAnimationFrame(frame);else finish()}
 requestAnimationFrame(frame);setTimeout(finish,duration+200);
}
function render(){ $('balance').textContent='€'+state.balance;$('win').textContent='€'+state.win;state.reels.forEach((n,i)=>drawReel(i,n));$('spin').disabled=busy||!artReady||state.balance<10;$('save').disabled=busy;document.querySelector('#game [data-go="home"]').disabled=busy;}
function persist(){return write(key,JSON.stringify(state))}
function start(s){state=s;render();show('game');$('message').textContent=state.balance<10?'Not enough virtual funds. Start a new game.':'Ready to spin.';}
$('new').onclick=()=>{if(saved()&&!confirm('Start a new game and replace your saved progress?'))return;start({balance:100,win:0,reels:[0,1,2]});persist()};$('load').onclick=()=>{const s=saved();if(s)start(s)};
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>show(b.dataset.go));$('save').onclick=()=>{$('message').textContent=persist()?'Game saved on this device.':'Storage unavailable. Game not saved.';tone()};
function soundLabel(){$('sound').textContent='SOUND: '+(sound?'ON':'OFF')};soundLabel();$('sound').onclick=()=>{sound=!sound;write(soundKey,sound?'on':'off');soundLabel();tone()};
function random(){return Math.floor(Math.random()*4)}
$('spin').onclick=()=>{if(busy||!artReady||state.balance<10)return;busy=true;const result=[random(),random(),random()];const win=payout(result);state.balance+=win-10;state.win=win;state.reels=result;persist();$('balance').textContent='€'+(state.balance-win);$('win').textContent='€0';$('message').textContent='Spinning…';$('spin').disabled=$('save').disabled=document.querySelector('#game [data-go="home"]').disabled=true;tone(180,.2);const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;reels.forEach((r,i)=>{animateReel(r,i,result[i],reduced?100+i*60:650+i*350,reduced,()=>{tone(330+i*100);if(i===2){busy=false;render();$('message').textContent=(win?`WIN: €${win}.`:'No win this spin.')+(state.balance<10?' Game over.':'');if(win){tone(660,.18);setTimeout(()=>tone(880,.2),150)}}})})};
render();show('home');if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).catch(()=>{});
}
