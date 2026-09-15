import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json"}});
const clean=(v:string)=>String(v||"").replace(/<[^>]*>/g," ").replace(/\s+/g," ").trim();
const slug=(v:string)=>clean(v).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,70);
function findImage(value:any):{data:string;mime:string}|null{
  if(!value||typeof value!=="object") return null;
  if(typeof value.data==="string" && value.data.length>1000){
    const mime=String(value.mime_type||value.mimeType||"");
    if(mime.startsWith("image/")||value.type==="image"||value.type==="output_image") return {data:value.data,mime:mime||"image/png"};
  }
  for(const key of Object.keys(value)){const hit=findImage(value[key]);if(hit)return hit;}
  return null;
}
Deno.serve(async(req)=>{
  if(req.method==="OPTIONS") return new Response("ok",{headers:cors});
  if(req.method!=="POST") return json({error:"POST required"},405);
  const auth=req.headers.get("authorization")||"";
  const token=auth.startsWith("Bearer ")?auth.slice(7):"";
  const serviceRole=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||"";
  if(!token||!serviceRole||token!==serviceRole) return json({error:"Unauthorized"},401);
  const gemini=Deno.env.get("GEMINI_API_KEY")||"";
  if(!gemini) return json({error:"GEMINI_API_KEY is not configured in Supabase Secrets."},503);
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
  const prompt=`Create an original realistic editorial illustration for ALBA NEWS, a Honduran digital news outlet. Visually interpret the reported EVENT from the facts below. This must be a new artwork, not a reconstruction of a source photograph. Style: highly realistic digital editorial painting with subtle pencil-and-ink texture, documentary composition, natural light, believable environments and human proportions, serious newsroom tone, cinematic depth, restrained colors, 16:9 landscape. No readable text, captions, watermarks, newspaper layouts, logos, or copyrighted artwork. Do not imitate any photographer or existing image. Avoid exact photographic replication. If named people are involved, portray the situation as an editorial scene rather than copying a specific photograph. Category: ${clean(input.category||"Actualidad")}. Headline: ${title}. Summary: ${clean(input.summary||"")}. Source context: ${clean(input.source||"Fuente periodística")}.`;
  const r=await fetch("https://generativelanguage.googleapis.com/v1beta/interactions",{
    method:"POST",
    headers:{"x-goog-api-key":gemini,"Content-Type":"application/json"},
    body:JSON.stringify({model:"gemini-3.1-flash-image",input:prompt,response_format:{type:"image",mime_type:"image/webp",aspect_ratio:"16:9",image_size:"1K"}})
  });
  if(!r.ok){const t=await r.text();return json({error:"Gemini image generation failed",detail:t.slice(0,700)},502);}
  const data=await r.json();
  const image=findImage(data);
  if(!image) return json({error:"Gemini returned no image data"},502);
  const bytes=Uint8Array.from(atob(image.data),c=>c.charCodeAt(0));
  const upload=await fetch(`${base}/storage/v1/object/alba-illustrations/${path}`,{
    method:"POST",
    headers:{"Authorization":`Bearer ${serviceRole}`,"apikey":serviceRole,"Content-Type":image.mime,"x-upsert":"true"},
    body:bytes
  });
  if(!upload.ok){const t=await upload.text();return json({error:"Storage upload failed",detail:t.slice(0,700)},502);}
  const db=createClient(base,serviceRole);
  const row=await db.from("articles").select("metadata").eq("id",id).maybeSingle();
  const oldMeta=row.data?.metadata&&typeof row.data.metadata==="object"?row.data.metadata:{};
  const metadata={...oldMeta,alba_illustration_url:publicUrl,alba_illustration_provider:"Google Gemini",alba_illustration_model:"gemini-3.1-flash-image",alba_illustration_generated_at:new Date().toISOString()};
  await db.from("articles").update({metadata,updated_at:new Date().toISOString()}).eq("id",id);
  return json({ok:true,url:publicUrl,cached:false,provider:"Google Gemini",model:"gemini-3.1-flash-image"});
});
