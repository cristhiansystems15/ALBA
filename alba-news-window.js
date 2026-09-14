(()=>{
  const HN='America/Tegucigalpa';
  const cutoff=()=>{
    const now=new Date();
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone:HN,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
    const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));
    const today=new Date(`${p.year}-${p.month}-${p.day}T00:00:00-06:00`);
    return today.getTime()-86400000;
  };
  const parseDate=(text='')=>{
    const months={ene:0,enero:0,feb:1,febrero:1,mar:2,marzo:2,abr:3,abril:3,may:4,mayo:4,jun:5,junio:5,jul:6,julio:6,ago:7,agosto:7,sep:8,sept:8,septiembre:8,oct:9,octubre:9,nov:10,noviembre:10,dic:11,diciembre:11};
    const m=text.toLowerCase().match(/(\d{1,2})\s+(ene(?:ro)?|feb(?:rero)?|mar(?:zo)?|abr(?:il)?|may(?:o)?|jun(?:io)?|jul(?:io)?|ago(?:sto)?|sep(?:t|tiembre)?|oct(?:ubre)?|nov(?:iembre)?|dic(?:iembre)?)\s+(\d{4})(?:.*?(\d{1,2}):(\d{2})(?::(\d{2}))?)?/i);
    if(!m)return NaN;
    const d=new Date(Number(m[3]),months[m[2].toLowerCase()],Number(m[1]),Number(m[4]||0),Number(m[5]||0),Number(m[6]||0));
    return d.getTime();
  };
  const apply=()=>{
    const min=cutoff();
    document.querySelectorAll('#newsGrid .card').forEach(card=>{
      const t=card.querySelector('time');
      const old=!t||parseDate(t.textContent)<min;
      card.style.display=old?'none':'';
    });
    const featured=document.querySelector('#featuredNews .featured');
    if(featured){
      const t=featured.querySelector('.featured-meta');
      if(!t||parseDate(t.textContent)<min)featured.style.display='none';
      else featured.style.display='';
    }
    const visible=[...document.querySelectorAll('#newsGrid .card')].filter(x=>x.style.display!=='none').length;
    const lead=document.querySelector('#featuredNews .featured');
    const leadVisible=lead&&lead.style.display!=='none'?1:0;
    const count=document.getElementById('newsCount');
    if(count)count.textContent=`${visible+leadVisible} noticias de hoy y ayer`;
  };
  apply();
  new MutationObserver(apply).observe(document.body,{subtree:true,childList:true});
  setInterval(apply,60000);
})();