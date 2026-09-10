import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname=path.dirname(fileURLToPath(import.meta.url));
const STORE=path.join(__dirname,'data','store.json');
const app=express();
const PORT=process.env.PORT||3000;
const ADMIN_TOKEN=process.env.ALBA_ADMIN_TOKEN||'';

app.use(helmet());
app.use(cors({origin:process.env.ALBA_FRONTEND_ORIGIN||true}));
app.use(express.json({limit:'1mb'}));

const categories=[
 {id:'actualidad',name:'Actualidad',slug:'actualidad'},
 {id:'analisis',name:'Análisis',slug:'analisis'},
 {id:'economia',name:'Economía',slug:'economia'},
 {id:'tecnologia',name:'Tecnología',slug:'tecnologia'},
 {id:'ciencia',name:'Ciencia',slug:'ciencia'},
 {id:'sociedad',name:'Sociedad',slug:'sociedad'}
];

function loadStore(){
 try{return JSON.parse(fs.readFileSync(STORE,'utf8'));}
 catch{return {articles:[],sources:[]};}
}
function saveStore(store){fs.writeFileSync(STORE,JSON.stringify(store,null,2)+'\n','utf8');}
function admin(req,res,next){
 if(!ADMIN_TOKEN)return res.status(503).json({error:'Administración no configurada'});
 const token=(req.headers.authorization||'').replace(/^Bearer\s+/i,'');
 const a=Buffer.from(token);const b=Buffer.from(ADMIN_TOKEN);
 if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return res.status(401).json({error:'No autorizado'});
 next();
}
function slugify(value){return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');}

app.get('/api/health',(req,res)=>res.json({ok:true,name:'ALBA API',version:'0.2.0',storage:'json'}));
app.get('/api/articles',(req,res)=>{const s=loadStore();res.json(s.articles.filter(a=>a.status==='published'));});
app.get('/api/articles/:id',(req,res)=>{const a=loadStore().articles.find(x=>x.id===req.params.id&&x.status==='published');if(!a)return res.status(404).json({error:'Artículo no encontrado'});res.json(a);});
app.get('/api/categories',(req,res)=>res.json(categories));
app.get('/api/sources',(req,res)=>res.json(loadStore().sources));

app.post('/api/articles',admin,(req,res)=>{
 const {title,summary='',content='',categoryId,sourceIds=[]}=req.body||{};
 if(!title||!categoryId)return res.status(400).json({error:'title y categoryId son obligatorios'});
 if(!categories.some(c=>c.id===categoryId))return res.status(400).json({error:'Categoría no válida'});
 const s=loadStore();const now=new Date().toISOString();
 const article={id:crypto.randomUUID(),title,slug:slugify(title),summary,content,categoryId,sourceIds,status:'draft',createdAt:now,updatedAt:now,publishedAt:null};
 s.articles.push(article);saveStore(s);res.status(201).json(article);
});
app.patch('/api/articles/:id',admin,(req,res)=>{const s=loadStore();const a=s.articles.find(x=>x.id===req.params.id);if(!a)return res.status(404).json({error:'Artículo no encontrado'});Object.assign(a,req.body,{updatedAt:new Date().toISOString()});saveStore(s);res.json(a);});
app.post('/api/articles/:id/publish',admin,(req,res)=>{const s=loadStore();const a=s.articles.find(x=>x.id===req.params.id);if(!a)return res.status(404).json({error:'Artículo no encontrado'});a.status='published';a.publishedAt=new Date().toISOString();a.updatedAt=a.publishedAt;saveStore(s);res.json(a);});
app.post('/api/articles/:id/archive',admin,(req,res)=>{const s=loadStore();const a=s.articles.find(x=>x.id===req.params.id);if(!a)return res.status(404).json({error:'Artículo no encontrado'});a.status='archived';a.updatedAt=new Date().toISOString();saveStore(s);res.json(a);});
app.post('/api/sources',admin,(req,res)=>{const {name,url,description=null}=req.body||{};if(!name||!url)return res.status(400).json({error:'name y url son obligatorios'});const s=loadStore();const source={id:crypto.randomUUID(),name,url,description};s.sources.push(source);saveStore(s);res.status(201).json(source);});

app.use((req,res)=>res.status(404).json({error:'Ruta no encontrada'}));
app.listen(PORT,()=>console.log(`ALBA API escuchando en puerto ${PORT}`));
