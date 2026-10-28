import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { webcrypto } from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
if (!globalThis.crypto) globalThis.crypto = webcrypto;
const root=fileURLToPath(new URL('../', import.meta.url)).replace(/\/$/, '');
const load=async (rel,tag='')=>import('data:text/javascript;base64,'+Buffer.from(await fs.readFile(root+'/'+rel,'utf8')+'\n// '+tag).toString('base64'));
const {onRequest}=await load('functions/_middleware.js');
const env={AGENTS_CASE_PASSWORD:'dummy-agents-password',AGENTS_COOKIE_SECRET:'dummy-agents-secret',PRESENTATION_PASSWORD:'dummy-presentation-password',PRESENTATION_COOKIE_SECRET:'dummy-presentation-secret'};
const results=[];
async function test(name,fn){try{await fn();results.push({name,pass:true});}catch(e){results.push({name,pass:false,error:e.message});}}
function request(body,ip='198.51.100.1',headers={}){return new Request('https://audit.invalid/api/login',{method:'POST',headers:{'Content-Type':'application/json','CF-Connecting-IP':ip,...headers},body});}
async function route(path,cookie=''){
 let next=false;
 const res=await onRequest({request:new Request('https://audit.invalid'+path,{headers:{Cookie:cookie}}),env,next:()=>{next=true;return new Response('dummy-static');}});
 return {res,next};
}
const cookies={};
for(const area of ['agents','presentation']){
 const {onRequestPost:login}=await load('functions/api/'+area+'-login.js');
 const password=env[area==='agents'?'AGENTS_CASE_PASSWORD':'PRESENTATION_PASSWORD'];
 await test(area+' valid login retains secure cookie',async()=>{
  const res=await login({request:request(JSON.stringify({password})),env});
  assert.equal(res.status,200);const cookie=res.headers.get('set-cookie');
  for(const flag of ['HttpOnly','Secure','SameSite=Lax'])assert.ok(cookie.includes(flag));
  assert.equal(res.headers.get('cache-control'),'no-store');cookies[area]=cookie.split(';')[0];
 });
 for(const [body,status] of [['null',400],['[]',400],['{}',400],['{"password":123}',400],['{"password":false}',400],['{',400],[JSON.stringify({password:'x'.repeat(1100)}),400],['x'.repeat(3000),413]]){
  await test(area+' rejects malformed/large body '+body.slice(0,28),async()=>{const res=await login({request:request(body,'198.51.100.'+(results.length+2)),env});assert.equal(res.status,status);});
 }
 await test(area+' rejects non-JSON',async()=>{const res=await login({request:request('{}','203.0.113.1',{'Content-Type':'text/plain'}),env});assert.equal(res.status,415);});
 await test(area+' rejects cross-origin',async()=>{const res=await login({request:request('{}','203.0.113.1',{'Origin':'https://evil.invalid'}),env});assert.equal(res.status,403);});
 await test(area+' throttles repeated guesses',async()=>{
  const codes=[];
  for(let i=0;i<12;i++)codes.push((await login({request:request('{"password":"wrong"}','203.0.113.9'),env})).status);
  assert.deepEqual(codes.slice(0,10),Array(10).fill(401));assert.deepEqual(codes.slice(10),[429,429]);
 });
 await test(area+' limits requests without an IP header',async()=>{
  const fresh=(await load('functions/api/'+area+'-login.js','no-ip')).onRequestPost;
  const codes=[];for(let i=0;i<11;i++)codes.push((await fresh({request:new Request('https://audit.invalid/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:'{"password":"wrong"}'}),env})).status);
  assert.equal(codes[10],429);
 });
 await test(area+' limiter recovers after time window',async()=>{
  const realNow=Date.now;let now=realNow();Date.now=()=>now;
  try{
   const fresh=(await load('functions/api/'+area+'-login.js','expiry')).onRequestPost;
   for(let i=0;i<11;i++)await fresh({request:request('{"password":"wrong"}'),env});
   now+=61000;
   assert.equal((await fresh({request:request('{"password":"wrong"}'),env})).status,401);
  }finally{Date.now=realNow;}
 });
}
const files=execFileSync('git',['-C',root,'ls-files','-z'],{encoding:'utf8'}).split('\0');
const paths=[...new Set(['/agents','/agents/','/agents.html','/agents-content.txt','/agents-content.txt/','/agents.html/',...files.filter(x=>x.startsWith('case-study-presentation/')||x.startsWith('portfolio images/agents/')).map(x=>'/'+x.split('/').map(encodeURIComponent).join('/'))])];
for(const path of paths){
 const area=path.startsWith('/case-study-presentation/')?'presentation':'agents';
 await test('anonymous blocks '+path,async()=>{const {res,next}=await route(path);assert.equal(res.status,302);assert.equal(next,false);assert.equal(res.headers.get('cache-control'),'private, no-store');});
 await test('authorized serves '+path,async()=>{const {res,next}=await route(path,cookies[area]);assert.equal(res.status,200);assert.equal(next,true);assert.equal(res.headers.get('cache-control'),'private, no-store');});
}
for(const path of ['/index.html','/agents-locked','/presentation-locked','/content-loader.js','/portfolio%20images/Main-images/Pointfive%20main.png'])await test('public accessible '+path,async()=>assert.equal((await route(path)).next,true));
// Assets used by the public login pages must stay reachable without a cookie.
for(const page of ['presentation-locked.html','agents-locked.html']){
 const html=await fs.readFile(root+'/'+page,'utf8');
 for(const [,ref] of html.matchAll(/(?:\bsrc|<link\b[^>]*\bhref)="([^"#:]+)"/g)){
  const path=ref.startsWith('/')?ref:'/'+ref;
  await test(page+' public asset '+path,async()=>assert.equal((await route(path)).next,true));
 }
}
for(const path of ['/%61gents-content.txt','/case-study-presentation%2fConcept-01.html','/portfolio%20images/%61gents/IMG.png','//case-study-presentation//Concept-01.html'])await test('encoded private path blocked '+path,async()=>assert.equal((await route(path)).next,false));
for(const path of ['/%2561gents-content.txt','/case-study-presentation%252fConcept-01.html','/bad%ZZ'])await test('ambiguous path rejected '+path,async()=>assert.equal((await route(path)).res.status,400));
await test('cross-area cookie rejected',async()=>assert.equal((await route('/agents',cookies.presentation)).res.status,302));
await test('forged signature rejected',async()=>assert.equal((await route('/agents','agents_auth=bad.bad')).res.status,302));
await test('cookie after another cookie works',async()=>assert.equal((await route('/agents','theme=light; '+cookies.agents)).res.status,200));
async function signed(area,payload){const body=Buffer.from(JSON.stringify(payload)).toString('base64url');const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(env[area==='agents'?'AGENTS_COOKIE_SECRET':'PRESENTATION_COOKIE_SECRET']),{name:'HMAC',hash:'SHA-256'},false,['sign']);return (area==='agents'?'agents_auth=':'pres_auth=')+body+'.'+Buffer.from(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(body))).toString('base64url');}
for(const payload of [{area:'agents'},{area:'agents',iat:Date.now()+86400000},{area:'agents',iat:Date.now()-604800001},{area:'wrong',iat:Date.now()}])await test('invalid signed claims rejected '+JSON.stringify(payload),async()=>assert.equal((await route('/agents',await signed('agents',payload))).res.status,302));
await test('trailing cookie component rejected',async()=>assert.equal((await route('/agents',cookies.agents+'.junk')).res.status,302));
// Exercise the actual loader with a minimal DOM sink; no injected HTML executes.
async function renderLoader(text){const nodes=new Map();const node=k=>{if(!nodes.has(k))nodes.set(k,{innerHTML:'',textContent:''});return nodes.get(k);};const document={body:{dataset:{content:'dummy.txt'}},querySelector:node,querySelectorAll:()=>[]};await vm.runInNewContext(await fs.readFile(root+'/content-loader.js','utf8'),{document,location:{href:'https://audit.invalid/agents'},URL,fetch:async()=>({ok:true,text:async()=>text})});return nodes;}
await test('HTML from draft escaped',async()=>{const nodes=await renderLoader('Lede: <img src=x onerror=alert(1)>');assert.ok(nodes.get('.lede').innerHTML.startsWith('&lt;img'));});
await test('dangerous link scheme removed',async()=>{const nodes=await renderLoader('Lede: [[click|javascript:alert(1)|secret-deck]]');assert.equal(nodes.get('.lede').innerHTML,'click');});
await test('safe emphasis and secret-deck link preserved',async()=>{const nodes=await renderLoader('Lede: **bold** [[==autonomous agents==|case-study-presentation/agents-deck.html|secret-deck]]');assert.equal(nodes.get('.lede').innerHTML,'<strong>bold</strong> <a href="case-study-presentation/agents-deck.html" class="secret-deck"><mark>autonomous agents</mark></a>');});
await test('attribute injection escaped and malicious class removed',async()=>{const nodes=await renderLoader('Lede: [[click|https://example.invalid/?x="onclick="bad|x"onclick="bad]]');const html=nodes.get('.lede').innerHTML;assert.ok(html.includes('&quot;'));assert.ok(!html.includes(' class='));});
await test('italic title raw HTML escaped',async()=>{const nodes=await renderLoader('Title: title\nTitle italic: <img onerror=bad>');assert.ok(nodes.get('.hero h1').innerHTML.includes('&lt;img'));});
async function renderAbout(text) {
 const quote={innerHTML:''};const links=Array.from({length:5},()=>({href:'',textContent:''}));
 const contact={querySelectorAll:()=>links};
 const document={querySelector:()=>quote,querySelectorAll:(sel)=>sel==='.about-quote'?[quote]:sel==='.about-contact-list, .panel-contact-list'?[contact]:[]};
 await vm.runInNewContext(await fs.readFile(root+'/about-content-loader.js','utf8'),{document,location:{href:'https://audit.invalid/'},URL,setTimeout,fetch:async()=>({ok:true,text:async()=>text})});
 return {quote,links};
}
await test('about draft HTML escaped, emphasis preserved',async()=>{const {quote}=await renderAbout('Quote: <img src=x onerror=bad> ==light== **strong**');assert.ok(quote.innerHTML.startsWith('&lt;img'));assert.ok(quote.innerHTML.includes('<span class="about-hi">light</span>'));assert.ok(quote.innerHTML.includes('<strong>strong</strong>'));});
await test('about unsafe contact URLs rejected',async()=>{const {links}=await renderAbout('LinkedIn: javascript:alert(1)\nWhatsApp: data:text/html,test\nCV: javascript:alert(1)');assert.ok(links.slice(2).every(a=>a.href===''));});
await test('about safe contact URLs retained',async()=>{const {links}=await renderAbout('LinkedIn: https://linkedin.com/in/example\nWhatsApp: https://wa.me/123\nCV: cv.pdf');assert.equal(links[2].href,'https://linkedin.com/in/example');assert.equal(links[4].href,'cv.pdf');});
console.log(JSON.stringify({total:results.length,passed:results.filter(r=>r.pass).length,failed:results.filter(r=>!r.pass).length,results},null,2));
if(results.some(r=>!r.pass))process.exitCode=1;
