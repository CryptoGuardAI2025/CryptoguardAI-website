
const I18N = {
  lang: localStorage.getItem('lang') || 'de',
  dict: {},
  async load() {
    try{
      const res = await fetch(`locales/${this.lang}/common.json`, {cache:'no-store'});
      this.dict = await res.json();
      document.querySelectorAll('[data-i18n]').forEach(el=>{
        const k = el.getAttribute('data-i18n'); if(this.dict[k]) el.innerHTML = this.dict[k];
      });
    }catch(e){ console.error('i18n failed', e); }
  },
  set(lang){ this.lang=lang; localStorage.setItem('lang', lang); this.load(); }
};
window.addEventListener('DOMContentLoaded',()=>{
  I18N.load();
  const de=document.getElementById('lang-de'), en=document.getElementById('lang-en');
  if(de&&en){
    (I18N.lang==='de'?de:en).classList.add('active');
    de.onclick=()=>{de.classList.add('active');en.classList.remove('active');I18N.set('de')};
    en.onclick=()=>{en.classList.add('active');de.classList.remove('active');I18N.set('en')};
  }
});
