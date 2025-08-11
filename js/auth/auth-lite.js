
// Lite Auth – statisch funktionsfähig
const KEY='cgai_users', SESS='cgai_session';
const R = k => JSON.parse(localStorage.getItem(k)||'{}');
const W = (k,v)=>localStorage.setItem(k,JSON.stringify(v));
const setS = e=>localStorage.setItem(SESS,e||''), getS=()=>localStorage.getItem(SESS)||'';
function ui(){const who=document.getElementById('whoami'); if(who) who.textContent=getS()?`Angemeldet als: ${getS()}`:'Niemand eingeloggt';}
document.addEventListener('DOMContentLoaded',()=>{
  ui();
  const reg=document.getElementById('reg'); if(reg) reg.onsubmit=(e)=>{e.preventDefault();const email=document.getElementById('reg-email').value.trim().toLowerCase(), pass=document.getElementById('reg-pass').value;const u=R(KEY); if(u[email]) return document.getElementById('reg-msg').textContent='E-Mail existiert bereits.'; u[email]={pass}; W(KEY,u); document.getElementById('reg-msg').textContent='Registriert. Jetzt einloggen.';};
  const log=document.getElementById('login'); if(log) log.onsubmit=(e)=>{e.preventDefault();const email=document.getElementById('log-email').value.trim().toLowerCase(), pass=document.getElementById('log-pass').value;const u=R(KEY); if(!u[email]||u[email].pass!==pass) return document.getElementById('log-msg').textContent='Falsche Daten.'; setS(email); document.getElementById('log-msg').textContent='Erfolgreich eingeloggt.'; ui();};
  const out=document.getElementById('logout'); if(out) out.onclick=()=>{ setS(''); ui(); };
  const reset=document.getElementById('reset'); if(reset) reset.onclick=()=>{ alert('Demo-Reset. In der finalen Version per E-Mail (Firebase).'); };
});
