import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const feeds = [
  { name: "BBC Mundo", url: "https://feeds.bbci.co.uk/mundo/rss.xml", category: "Internacional" },
  { name: "BBC News World", url: "https://feeds.bbci.co.uk/news/world/rss.xml", category: "Internacional" },
  { name: "DW Español", url: "https://rss.dw.com/rdf/rss-es-all", category: "Internacional" },
  { name: "Google News Honduras", url: "https://news.google.com/rss/search?q=Honduras&hl=es-419&gl=HN&ceid=HN:es-419", category: "Honduras" }
];
const clean=(x:string)=>x.replace(/<!\[CDATA\[|\]\]>/g,"").replace(/<[^>]*>/g," ").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/\s+/g," ").trim();
const tag=(x:string,t:string)=>{const m=x.match(new RegExp(`<${t}(?:\\s[^>]*)?>([\\s\\S]*?)</${t}>`,"i"));return m?clean(m[1]):""};
const slugify=(x:string)=>x.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,100);
Deno.serve(async(req)=>{
 if(req.method!=="POST") return Response.json({error:"POST required"},{status:405});
 const db=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
 const result={ok:true,sources:0,scanned:0,inserted:0,skipped:0,errors:[] as string[]};
 for(const f of feeds){try{
  const src=await db.from("sources").select("id").eq("name",f.name).maybeSingle(); if(src.error) throw new Error(`source lookup: ${src.error.message}`); if(!src.data?.id) throw new Error("source not found"); const sourceId=src.data.id; result.sources++;
  const cat=await db.from("categories").select("id").eq("name",f.category).maybeSingle(); if(cat.error) throw new Error(`category lookup: ${cat.error.message}`);
  const response=await fetch(f.url,{headers:{"User-Agent":"ALBA-NewsBot/2.0","Accept":"application/rss+xml, application/xml, text/xml"}}); if(!response.ok) throw new Error(`RSS HTTP ${response.status}`);
  const xml=await response.text(); const items=xml.match(/<item[\s\S]*?<\/item>/gi)||[];
  for(const item of items.slice(0,30)){const title=tag(item,"title"),url=tag(item,"link")||tag(item,"guid"),summary=tag(item,"description"),pd=tag(item,"pubDate"); if(!title||!url) continue; result.scanned++; const canonicalUrl=url.trim();
   const existing=await db.from("articles").select("id").eq("canonical_url",canonicalUrl).maybeSingle(); if(existing.error){result.errors.push(`${f.name}: duplicate check: ${existing.error.message}`);continue;} if(existing.data){result.skipped++;continue;}
   let slug=slugify(title)||`noticia-${crypto.randomUUID().slice(0,8)}`; const slugCheck=await db.from("articles").select("id").eq("slug",slug).maybeSingle(); if(slugCheck.error){result.errors.push(`${f.name}: slug check: ${slugCheck.error.message}`);continue;} if(slugCheck.data) slug=`${slug}-${crypto.randomUUID().slice(0,8)}`;
   const published=pd&&!Number.isNaN(Date.parse(pd))?new Date(pd).toISOString():new Date().toISOString();
   const article=await db.from("articles").insert({source_id:sourceId,title,slug,summary:summary.slice(0,1200),content:summary,category_id:cat.data?.id??null,canonical_url:canonicalUrl,status:"published",verification_status:"unverified",published_at:published,fetched_at:new Date().toISOString(),updated_at:new Date().toISOString(),metadata:{ingested_by:"ingest-news",source:f.name}}).select("id").single();
   if(article.error||!article.data){result.errors.push(`${f.name}: article insert: ${article.error?.message??"no id"}`);continue;}
   const link=await db.from("article_sources").insert({article_id:article.data.id,source_id:sourceId,source_url:canonicalUrl,is_primary:true}); if(link.error) result.errors.push(`${f.name}: article_sources: ${link.error.message}`); else result.inserted++;
  }
  await db.from("sources").update({last_fetched_at:new Date().toISOString(),updated_at:new Date().toISOString()}).eq("id",sourceId);
 }catch(err){result.ok=false;result.errors.push(`${f.name}: ${err instanceof Error?err.message:String(err)}`)}}
 return Response.json(result);
});
