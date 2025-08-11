
const MAP = {
  btc:'bitcoin', xbt:'bitcoin', eth:'ethereum', xrp:'ripple', ada:'cardano', ltc:'litecoin',
  doge:'dogecoin', shib:'shiba-inu', shiba:'shiba-inu', shibainu:'shiba-inu',
  sol:'solana', bnb:'binancecoin', matic:'matic-network', dot:'polkadot', trx:'tron',
  link:'chainlink', xlm:'stellar', xmr:'monero', uni:'uniswap', avax:'avalanche-2',
  near:'near', apt:'aptos', hbar:'hedera', vet:'vechain', arb:'arbitrum'
};
const KNOWN = new Set(Object.values(MAP));
function norm(input){
  const t = (input||'').trim().toLowerCase();
  if(MAP[t]) return MAP[t];
  if(KNOWN.has(t)) return t;
  return t;
}
function fmt(n){return n.toLocaleString(undefined,{maximumFractionDigits:2});}

async function livePrice(id){
  const r = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`);
  const j = await r.json(); return j?.[id]?.usd ?? null;
}
async function oneYearCAGR(id){
  const r = await fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=365`);
  if(!r.ok) return null;
  const j = await r.json(); const p = j.prices;
  if(!p || p.length<2) return null;
  const first = p[0][1], last = p[p.length-1][1];
  return (last/first) - 1;
}
async function forecast(ev){
  ev.preventDefault();
  const input = document.getElementById('coin-input').value;
  const id = norm(input);
  const out = document.getElementById('forecast-out'); out.innerHTML='⏳ Lade...';
  try{
    const now = await livePrice(id);
    if(!now){ out.textContent = 'Coin nicht gefunden oder API-Limit. Versuche z. B. btc, eth, xrp, ada, ltc, doge, sol, bnb, matic, dot.'; return; }
    const g = await oneYearCAGR(id);
    if(g===null){ out.textContent = 'Zu wenig Daten für die Prognose.'; return; }
    const damp = 0.35; // konservativ
    const next = now * (1 + g * damp);
    out.innerHTML = `Aktuell: <b>$${fmt(now)}</b><br>1‑Jahres‑Prognose (konservativ): <b>$${fmt(next)}</b> (${(g*damp*100).toFixed(1)}%)`;
  }catch(e){ out.textContent='Fehler. Bitte später erneut.'; }
}
