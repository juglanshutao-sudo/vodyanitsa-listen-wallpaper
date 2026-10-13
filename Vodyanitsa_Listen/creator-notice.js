'use strict';
(()=>{
 const root=document.getElementById('creator-notice'),letter=document.getElementById('vn-letter'),count=document.getElementById('vn-count'),bar=document.getElementById('vn-progress');
 let ticker=0,fadeTimer=0,started=false;
 function dismiss(){clearInterval(ticker);clearTimeout(fadeTimer);letter.classList.add('is-hidden');root.setAttribute('inert','');fadeTimer=setTimeout(()=>{root.hidden=true;},350);}
 function start(enabled){if(started)return;started=true;if(!enabled){root.hidden=true;return;}root.hidden=false;root.removeAttribute('inert');letter.classList.remove('is-hidden');const end=performance.now()+5000;count.textContent='5s';bar.style.transform='scaleX(1)';ticker=setInterval(()=>{const left=Math.max(0,end-performance.now());count.textContent=Math.ceil(left/1000)+'s';bar.style.transform='scaleX('+(left/5000)+')';if(left<=0)dismiss();},40);}
 document.getElementById('vn-dismiss').addEventListener('click',dismiss);
 document.getElementById('vn-settings-link').addEventListener('click',()=>{dismiss();window.setWallpaperSettingsOpen(true);const input=document.querySelector('[data-option="showNotice"]');input.scrollIntoView?.({block:'nearest'});input.focus();});
 document.getElementById('gear').addEventListener('click',dismiss);
 window.creatorNotice={start,dismiss,visible:()=>!root.hidden&&!letter.classList.contains('is-hidden')};
})();
