document.addEventListener('DOMContentLoaded',()=>{
  const $=id=>document.getElementById(id);
  const renderClock=()=>{
    const now=new Date();
    const time=new Intl.DateTimeFormat('es-HN',{timeZone:'America/Tegucigalpa',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(now);
    const date=new Intl.DateTimeFormat('es-HN',{timeZone:'America/Tegucigalpa',weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(now);
    if($('liveClock')) $('liveClock').textContent=time;
    if($('liveDate')) $('liveDate').textContent=date;
  };
  const renderCalendar=()=>{
    const box=$('miniCalendar'); if(!box)return;
    const now=new Date(), y=now.getFullYear(), m=now.getMonth(), today=now.getDate();
    const first=(new Date(y,m,1).getDay()+6)%7, days=new Date(y,m+1,0).getDate();
    const month=new Intl.DateTimeFormat('es-HN',{month:'long',year:'numeric'}).format(now);
    let html=`<div class="mini-calendar-title">${month}</div><div class="mini-calendar-week">${['L','M','X','J','V','S','D'].map(x=>`<span>${x}</span>`).join('')}</div><div class="mini-calendar-days">`;
    for(let i=0;i<first;i++)html+='<span class="empty-day"></span>';
    for(let d=1;d<=days;d++)html+=`<span class="calendar-day ${d===today?'today':''}">${d}</span>`;
    box.innerHTML=html+'</div>';
  };
  const loadRates=async()=>{
    try{
      const r=await fetch('https://open.er-api.com/v6/latest/USD',{cache:'no-store'});
      if(!r.ok)throw new Error('exchange');
      const data=await r.json();
      const usdHnl=Number(data?.rates?.HNL), usdEur=Number(data?.rates?.EUR);
      if(!usdHnl||!usdEur)throw new Error('rates');
      const eurHnl=usdHnl/usdEur;
      $('usdRate').textContent=`L ${usdHnl.toFixed(4)}`;
      $('eurRate').textContent=`L ${eurHnl.toFixed(4)}`;
      const ref=data.time_last_update_utc?new Date(data.time_last_update_utc):null;
      const label=ref&&!Number.isNaN(ref.getTime())?`Referencia · ${ref.toLocaleDateString('es-HN')}`:'Tipo de referencia';
      $('usdDate').textContent=label; $('eurDate').textContent=label;
    }catch(e){
      if($('usdRate'))$('usdRate').textContent='No disponible';
      if($('eurRate'))$('eurRate').textContent='No disponible';
      if($('usdDate'))$('usdDate').textContent='Reintento automático';
      if($('eurDate'))$('eurDate').textContent='Reintento automático';
    }
  };
  $('calendarToday')?.addEventListener('click',renderCalendar);
  renderClock(); renderCalendar(); loadRates();
  setInterval(renderClock,1000);
  setInterval(renderCalendar,60000);
  setInterval(loadRates,1800000);
});
