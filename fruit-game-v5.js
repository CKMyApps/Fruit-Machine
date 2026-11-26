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
function drawReel(i,n){reels[i].innerHTML='<img class="fruit" src="fruit-'+n+'.svg" alt="'+SYMBOLS[n]+'">';reels[i].dataset.symbol=n;}
function render(){ $('balance').textContent='€'+state.balance;$('win').textContent='€'+state.win;state.reels.forEach((n,i)=>drawReel(i,n));$('spin').disabled=busy||state.balance<10;$('save').disabled=busy;document.querySelector('#game [data-go="home"]').disabled=busy;}
function persist(){return write(key,JSON.stringify(state))}
function start(s){state=s;render();show('game');$('message').textContent=state.balance<10?'Not enough virtual funds. Start a new game.':'Ready to spin.';}
$('new').onclick=()=>{if(saved()&&!confirm('Start a new game and replace your saved progress?'))return;start({balance:100,win:0,reels:[0,1,2]});persist()};$('load').onclick=()=>{const s=saved();if(s)start(s)};
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>show(b.dataset.go));$('save').onclick=()=>{$('message').textContent=persist()?'Game saved on this device.':'Storage unavailable. Game not saved.';tone()};
function soundLabel(){$('sound').textContent='SOUND: '+(sound?'ON':'OFF')};soundLabel();$('sound').onclick=()=>{sound=!sound;write(soundKey,sound?'on':'off');soundLabel();tone()};
function random(){return Math.floor(Math.random()*4)}
$('spin').onclick=()=>{if(busy||state.balance<10)return;busy=true;const result=[random(),random(),random()];const win=payout(result);state.balance+=win-10;state.win=win;state.reels=result;persist();$('balance').textContent='€'+(state.balance-win);$('win').textContent='€0';$('message').textContent='Spinning…';$('spin').disabled=$('save').disabled=document.querySelector('#game [data-go="home"]').disabled=true;tone(180,.2);const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;reels.forEach((r,i)=>{r.classList.add('rolling');const timer=setInterval(()=>{drawReel(i,random());if(i===0)tone(100+Math.random()*90,.035)},85);setTimeout(()=>{clearInterval(timer);r.classList.remove('rolling');drawReel(i,result[i]);tone(330+i*100);if(i===2){busy=false;render();$('message').textContent=(win?`WIN: €${win}.`:'No win this spin.')+(state.balance<10?' Game over.':'');if(win){tone(660,.18);setTimeout(()=>tone(880,.2),150)}}},reduced?100+i*60:650+i*350)})};
show('home');if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).catch(()=>{});
}
