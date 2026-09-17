(()=>{
  const HN='America/Tegucigalpa';
  const cutoff=()=>{
    const now=new Date();
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone:HN,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
    const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));
    return new Date(`${p.year}-${p.month}-${p.day}T00:00:00-06:00`).getTime()-86400000;
  };
  const parseDate=(text='')=>{const d=Date.parse(text);return Number.isNaN(d)?NaN:d};
  const apply=()=>{
    const min=cutoff();
    document.querySelectorAll('#newsGrid .card').forEach(card=>{const t=card.querySelector('time');const d=t?parseDate(t.dateTime||t.textContent):NaN;card.style.display=Number.isNaN(d)||d>=min?'':'none'});
    const featured=document.querySelector('#featuredNews .featured');
    if(featured){const t=featured.querySelector('.featured-meta');const d=t?parseDate(t.dateTime||t.textContent):NaN;featured.style.display=Number.isNaN(d)||d>=min?'':'none'}
    const visible=[...document.querySelectorAll('#newsGrid .card')].filter(x=>x.style.display!=='none').length;
    const lead=document.querySelector('#featuredNews .featured');
    const leadVisible=lead&&lead.style.display!=='none'?1:0;
    const count=document.getElementById('newsCount');if(count)count.textContent=`${visible+leadVisible} noticias de hoy y ayer`;
  };
  apply();new MutationObserver(apply).observe(document.body,{subtree:true,childList:true});setInterval(apply,60000);
})();