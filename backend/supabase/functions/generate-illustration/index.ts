import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json"}});

function publishableKeys(){
  try{return JSON.parse(Deno.env.get("SUPABASE_PUBLISHABLE_KEYS")||"{}");}catch{return {};}
}
function secretKey(){
  try{return JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS")||"{}")["default"]||"";}catch{return "";}
}
function clean(v:string){return String(v||"").replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim();}
function slug(v:string){return clean(v).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,70);}

Deno.serve(async(req)=>{
  if(req.method==="OPTIONS") return new Response("ok",{headers:cors});
  if(req.method!=="POST") return json({error:"POST required"},405);

  const clientKey=req.headers.get("apikey")||"";
  const keys=publishableKeys();
  if(!Object.values(keys).includes(clientKey)) return json({error:"Unauthorized"},401);

  const openai=Deno.env.get("OPENAI_API_KEY")||"";
  if(!openai) return json({error:"OPENAI_API_KEY is not configured in Supabase Secrets."},503);
  const adminKey=secretKey();
  if(!adminKey) return json({error:"Supabase secret key is not configured."},503);

  let input:{id?:string;title?:string;summary?:string;category?:string;source?:string};
  try{input=await req.json();}catch{return json({error:"Invalid JSON"},400);}
  const id=clean(input.id||"");
  const title=clean(input.title||"");
  if(!id||!title) return json({error:"id and title are required"},400);

  const base=Deno.env.get("SUPABASE_URL")!;
  const path=`${id}-${slug(title).slice(0,45)||"noticia"}.webp`;
  const publicUrl=`${base}/storage/v1/object/public/alba-illustrations/${path}`;

  const existing=await fetch(publicUrl,{method:"HEAD"});
  if(existing.ok) return json({ok:true,url:publicUrl,cached:true});

  const prompt=`Create an original realistic editorial news illustration for ALBA NEWS, a Honduran digital news outlet. Depict the EVENT described by the headline and summary, not a literal reproduction of any source photograph. Use a documentary/editorial sketch aesthetic: realistic human proportions, natural lighting, believable environment, subtle painterly pencil-and-ink texture, restrained newsroom color palette, cinematic composition, serious journalistic tone. Do not imitate a named photographer, newspaper, or existing image. Do not reproduce logos or copyrighted artwork. Do not put readable text, captions, watermarks, or fake quotes inside the image. If real people are mentioned, represent the situation generically unless a clearly recognizable public figure is essential to the event. The image must be an original visual interpretation based only on these facts. Category: ${clean(input.category||"Actualidad")}. Headline: ${title}. Summary: ${clean(input.summary||"")}. Source: ${clean(input.source||"Fuente periodística")}.`;

  const r=await fetch("https://api.openai.com/v1/images/generations",{
    method:"POST",
    headers:{"Authorization":`Bearer ${openai}`,"Content-Type":"application/json"},
    body:JSON.stringify({model:"gpt-image-2",prompt,size:"1536x1024",quality:"medium",output_format:"webp"})
  });
  if(!r.ok){const t=await r.text();return json({error:"Image generation failed",detail:t.slice(0,500)},502);}
  const data=await r.json();
  const b64=data?.data?.[0]?.b64_json;
  if(!b64) return json({error:"Image API returned no image"},502);

  const bytes=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));
  const upload=await fetch(`${base}/storage/v1/object/alba-illustrations/${path}`,{
    method:"POST",
    headers:{"Authorization":`Bearer ${adminKey}`,"apikey":adminKey,"Content-Type":"image/webp","x-upsert":"true"},
    body:bytes
  });
  if(!upload.ok){const t=await upload.text();return json({error:"Storage upload failed",detail:t.slice(0,500)},502);}
  return json({ok:true,url:publicUrl,cached:false});
});
