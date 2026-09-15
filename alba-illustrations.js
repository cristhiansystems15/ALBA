/* ALBA NEWS — Ilustraciones editoriales originales
   Genera visuales vectoriales propios a partir del tema/título de la noticia.
   No reutiliza fotografías de terceros ni necesita servicios externos.
*/
(function(){
  'use strict';

  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clean=v=>String(v??'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
  const norm=v=>clean(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');

  const sceneFor=(article)=>{
    const text=norm(`${article?.category||''} ${article?.title||''} ${article?.summary||''}`);
    if(/seguridad|policia|policía|operativo|delito|crimen|violencia|captura|militar/.test(text)) return 'security';
    if(/economia|economía|export|empleo|inflacion|inflación|dolar|dólar|comercio|empresa|finanzas|precio|mercado/.test(text)) return 'economy';
    if(/salud|vacuna|hospital|medic|enfermed|virus|covid|clinica|clínica/.test(text)) return 'health';
    if(/deporte|futbol|fútbol|seleccion|selección|liga|partido|gol|jugador|olimp/.test(text)) return 'sports';
    if(/clima|lluvia|tormenta|huracan|huracán|temperatura|tiempo|calor|frio|frío|pronostico|pronóstico/.test(text)) return 'climate';
    if(/tecnologia|tecnología|internet|digital|ia|inteligencia artificial|software|celular|ciber|robot/.test(text)) return 'technology';
    if(/internacional|onu|guerra|conflicto|diplom|presidente|mundo|rusia|ucrania|eeuu|estados unidos|china/.test(text)) return 'world';
    if(/politica|política|congreso|diput|gobierno|eleccion|elección|ley|reforma|alcalde|presidencia/.test(text)) return 'politics';
    return 'news';
  };

  const palettes={
    politics:['#dbeafe','#0f3d67','#b91c1c'],security:['#d9e4ec','#17324d','#c2410c'],economy:['#f4ead1','#244d3b','#b7791f'],health:['#e4f2f0','#205c5a','#a83b52'],sports:['#e7eef8','#12365a','#d97706'],climate:['#dff1f7','#1d5c72','#e7a91b'],technology:['#e8e7f7','#30306b','#7c3aed'],world:['#e5edf5','#243b53','#b45309'],news:['#e8edf3','#23384d','#c62828']
  };

  const line=(x1,y1,x2,y2,w=4)=>`<path d="M${x1} ${y1} L${x2} ${y2}" stroke="#263746" stroke-width="${w}" stroke-linecap="round" fill="none"/>`;
  const rect=(x,y,w,h,fill,rx=0,stroke='#263746',sw=3)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
  const circle=(cx,cy,r,fill,stroke='#263746',sw=3)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;

  function drawing(type,a,b,c){
    let s='';
    if(type==='politics'){
      s+=rect(95,230,1010,285,'#f7f5ef',8); for(let x=160;x<1060;x+=150)s+=rect(x,275,55,220,'#e9e5da',4);
      s+=rect(60,500,1080,28,'#9b7a45',4); s+=rect(420,160,360,70,'#f7f5ef',5);
      s+=`<path d="M430 230 L775 230 L720 145 L485 145 Z" fill="#f7f5ef" stroke="#263746" stroke-width="4"/>`;
      s+=circle(600,185,30,'#d4b46a'); s+=line(560,185,640,185,3);
      s+=rect(548,55,104,75,'#f7f5ef',4); s+=line(600,130,600,160,4);
      s+=`<path d="M600 65 C555 38 520 45 495 65 C530 83 565 88 600 65" fill="#3b82b6" stroke="#263746" stroke-width="3"/><path d="M600 65 C645 38 680 45 705 65 C670 83 635 88 600 65" fill="#e8f1f7" stroke="#263746" stroke-width="3"/>`;
    } else if(type==='security'){
      s+=rect(0,380,1200,145,'#bfcbd2'); for(let x=0;x<1200;x+=130)s+=line(x,380,x+80,300,2);
      s+=rect(70,220,330,160,'#eef1f2',8); s+=rect(105,245,70,55,'#6b8392',3); s+=rect(190,245,70,55,'#6b8392',3); s+=rect(275,245,70,55,'#6b8392',3);
      s+=rect(690,330,350,110,'#f5f6f6',35); s+=circle(755,440,43,'#263746'); s+=circle(980,440,43,'#263746'); s+=rect(755,300,130,70,'#bfcbd2',12); s+=rect(885,300,105,70,'#bfcbd2',12);
      s+=circle(820,265,35,'#c7a68a'); s+=rect(785,300,72,105,'#244d70',12); s+=rect(802,325,38,45,'#f5f5f2',2);
      s+=rect(810,355,180,30,'#1b3144',4); s+=`<text x="830" y="377" font-size="17" font-family="Arial" font-weight="700" fill="#fff">ALBA • SEGURIDAD</text>`;
      s+=circle(910,245,30,'#24384b');
    } else if(type==='economy'){
      s+=line(110,480,1070,480,6); s+=line(150,480,150,150,5); s+=line(150,150,1060,150,2);
      s+=rect(250,370,110,110,'#b5c0c7',5); s+=rect(450,300,110,180,'#8ea4af',5); s+=rect(650,225,110,255,'#d0a94b',5); s+=rect(850,160,110,320,'#628a73',5);
      s+=`<path d="M170 390 C350 350 440 345 535 285 C650 215 740 235 835 175 C910 128 980 120 1050 75" fill="none" stroke="#b43b2f" stroke-width="12" stroke-linecap="round"/>`;
      s+=`<path d="M1050 75 L1012 94 L1029 117 Z" fill="#b43b2f" stroke="#263746" stroke-width="3"/>`;
      [320,500,680,860].forEach((x,i)=>{s+=circle(x,535,43,'#d6b45e');s+=circle(x+72,535,43,'#d6b45e');s+=line(x-35,535,x+35,535,2)});
    } else if(type==='health'){
      s+=rect(120,130,960,395,'#eef6f5',10); s+=rect(170,180,860,330,'#fff',6);
      s+=circle(600,280,82,'#c9a88f'); s+=`<path d="M520 270 Q600 180 680 270 L660 225 Q600 175 540 225 Z" fill="#4b3a35"/>`;
      s+=rect(510,355,180,125,'#dbe8ee',25); s+=rect(548,390,104,115,'#dbe8ee',12); s+=circle(600,410,20,'#6d9ab0');
      s+=circle(790,330,30,'#c9a88f'); s+=rect(760,360,60,120,'#eef2f4',15); s+=rect(805,350,105,20,'#d5e3e9',8); s+=line(850,370,850,465,4);
      s+=rect(855,235,35,115,'#dbe8ee',7); s+=circle(872,235,17,'#fff');
    } else if(type==='sports'){
      s+=rect(0,370,1200,155,'#88a477'); for(let x=0;x<1200;x+=120)s+=line(x,525,x+90,370,2);
      s+=circle(600,350,72,'#f5f4ed'); s+=circle(600,350,72,'none','#263746',4); s+=`<path d="M600 278 L625 315 L610 355 L570 355 L555 315 Z" fill="#263746"/>`;
      s+=circle(410,305,32,'#b88f78'); s+=rect(380,340,60,120,'#1d4f7a',18); s+=line(392,460,365,520,13);s+=line(428,460,460,520,13);s+=line(385,370,340,415,10);s+=line(435,370,475,410,10);
      s+=circle(790,300,32,'#b88f78'); s+=rect(760,335,60,125,'#c63d34',18); s+=line(770,455,735,520,13);s+=line(810,455,845,520,13);s+=line(765,370,720,415,10);s+=line(815,370,860,405,10);
    } else if(type==='climate'){
      s+=circle(940,150,75,'#e7ad2c'); s+=`<path d="M0 420 Q260 260 510 390 T1200 330 L1200 560 L0 560 Z" fill="#6b8d78" stroke="#355466" stroke-width="4"/>`;
      s+=`<path d="M0 470 Q250 410 480 480 T900 460 T1200 480 L1200 560 L0 560 Z" fill="#4c92ae" stroke="#263746" stroke-width="4"/>`;
      for(let x=110;x<800;x+=160){s+=line(x,260,x-25,205,4);s+=line(x,260,x+28,215,4)}
      s+=circle(350,210,35,'#f2f4f4');s+=circle(390,200,45,'#f2f4f4');s+=circle(435,215,32,'#f2f4f4');
      s+=line(350,245,350,285,3);s+=line(395,240,395,280,3);s+=line(440,245,440,285,3);
    } else if(type==='technology'){
      s+=rect(120,100,960,400,'#f7f7fb',18);s+=rect(205,150,790,300,'#1d2847',10);s+=circle(600,300,105,'#5367a4');s+=circle(600,300,48,'#d8e5f0');
      s+=line(495,300,360,300,5);s+=line(705,300,840,300,5);s+=line(600,195,600,110,5);s+=line(600,405,600,490,5);
      s+=circle(340,300,22,'#7c3aed');s+=circle(860,300,22,'#7c3aed');s+=circle(600,95,22,'#7c3aed');s+=circle(600,505,22,'#7c3aed');
      s+=`<text x="480" y="320" font-family="Arial" font-size="32" font-weight="700" fill="#fff">ALBA IA</text>`;
    } else if(type==='world'){
      s+=circle(600,330,190,'#6b9bb5'); s+=`<path d="M470 280 Q530 220 600 255 T735 260 Q690 320 730 365 Q650 400 600 375 Q540 420 485 360 Q515 325 470 280 Z" fill="#66856d" stroke="#263746" stroke-width="4"/>`;
      s+=rect(485,455,230,65,'#eef1f2',6); s+=line(530,455,530,405,3);s+=line(575,455,575,405,3);s+=line(620,455,620,405,3);s+=line(665,455,665,405,3);
      s+=circle(530,390,30,'#c8a28b');s+=circle(670,390,30,'#c8a28b');s+=rect(500,420,60,55,'#294a68',8);s+=rect(640,420,60,55,'#6f4051',8);
    } else {
      s+=rect(110,110,980,405,'#eef2f4',14);s+=rect(165,165,870,300,'#fbfaf7',8);s+=rect(220,225,290,180,'#d7e0e6',5);s+=rect(550,225,410,35,'#d7e0e6',4);s+=rect(550,285,330,28,'#e1e6e9',4);s+=rect(550,340,380,28,'#e1e6e9',4);
      s+=circle(365,315,50,'#8ea7b5');s+=circle(365,315,27,'#f5f5f2');s+=line(365,260,365,370,3);s+=line(310,315,420,315,3);
    }
    return s;
  }

  function svg(article){
    const type=sceneFor(article), [bg,ink,accent]=palettes[type];
    const title=clean(article?.title||'Actualidad');
    const category=clean(article?.category||'Actualidad').toUpperCase();
    const safeTitle=esc(title.length>74?title.slice(0,71)+'…':title);
    const drawingLayer=drawing(type,bg,ink,accent);
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675"><rect width="1200" height="675" fill="${bg}"/><rect x="0" y="0" width="1200" height="54" fill="${ink}"/><text x="48" y="35" font-family="Arial" font-size="22" font-weight="700" fill="#fff" letter-spacing="2">ALBA NEWS · ILUSTRACIÓN EDITORIAL</text><rect x="0" y="54" width="1200" height="545" fill="${bg}"/>${drawingLayer}<rect x="0" y="555" width="1200" height="120" fill="#07111f" opacity=".94"/><rect x="44" y="579" width="170" height="30" rx="15" fill="${accent}"/><text x="62" y="600" font-family="Arial" font-size="15" font-weight="700" fill="#fff">${esc(category)}</text><text x="44" y="646" font-family="Arial" font-size="26" font-weight="700" fill="#fff">${safeTitle}</text><text x="1030" y="600" text-anchor="end" font-family="Arial" font-size="13" fill="#d8dee7">BOCETO ORIGINAL ALBA</text></svg>`)}`;
  }

  function apply(root=document){
    root.querySelectorAll('.article-visual').forEach(el=>{
      if(el.dataset.albaIllustrated==='1') return;
      const article={title:el.dataset.title,category:el.dataset.category,summary:el.dataset.summary};
      el.src=svg(article);el.dataset.albaIllustrated='1';el.setAttribute('alt',`Ilustración editorial ALBA NEWS: ${article.title||article.category||'Actualidad'}`);el.removeAttribute('referrerpolicy');
    });
  }

  window.ALBA_ILLUSTRATIONS={svg,sceneFor,apply};
})();