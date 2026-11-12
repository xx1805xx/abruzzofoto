const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const code=fs.readFileSync('docs/privacy.js','utf8');
function setup(id='',initial={}){
 const elements=new Map(),cookies=new Map(Object.entries(initial)),writes=[],scripts=[],reloads=[];
 class Element{
  constructor(){this.listeners={};this.open=false;this.hidden=false;this.checked=false;this.disabled=false;this.dataset={};this.classList={add(){},remove(){}};}
  addEventListener(name,fn){(this.listeners[name]??=[]).push(fn);}
  click(){for(const fn of this.listeners.click??[])fn({});}
  showModal(){this.open=true;}
  close(){this.open=false;for(const fn of this.listeners.close??[])fn({});}
 }
 const byId=id=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id);};
 const selectors={'[data-cookie-settings]':[new Element()],'[data-consent-reject]':[new Element()],'[data-consent-accept]':[new Element()],'[data-close-cookies]':[new Element()]};
 const document={title:'Abruzzo Foto',referrer:'https://ref.example/search?q=private',head:{append(script){scripts.push(script);}},body:{classList:{add(){},remove(){}}},getElementById:byId,querySelectorAll:s=>selectors[s]??[],querySelector:s=>(selectors[s]??[])[0],createElement:()=>new Element()};
 Object.defineProperty(document,'cookie',{get:()=>[...cookies].map(([k,v])=>k+'='+v).join('; '),set:value=>{writes.push(value);const [kv]=value.split(';'),at=kv.indexOf('='),key=kv.slice(0,at);if(/Max-Age=0(?:;|$)/.test(value))cookies.delete(key);else cookies.set(key,kv.slice(at+1));}});
 const context={ABRUZZO_CONFIG:{analyticsMeasurementId:id,consentVersion:'test'},document,location:{protocol:'https:',href:'https://xx1805xx.github.io/abruzzofoto/?email=private#private',reload(){reloads.push(true);}},URL,Date,Number,JSON,Object,encodeURIComponent,decodeURIComponent};context.window=context;vm.createContext(context);vm.runInContext(code,context);
 return {context,elements,cookies,writes,scripts,reloads,click:s=>selectors[s][0].click()};
}
test('Without a configured property no analytics resources are requested',()=>{const app=setup();app.click('[data-consent-accept]');assert.equal(app.scripts.length,0);assert.equal(app.context.AbruzzoPrivacy.getState().analytics,false);});
test('Before consent, a configured property makes no analytics request',()=>{const app=setup('G-TEST123456');assert.equal(app.scripts.length,0);assert.equal(app.elements.get('cookie-banner').hidden,false);});
test('Refusing optional cookies preserves unrelated project cookies',()=>{const app=setup('G-TEST123456',{formaclub_session:'unrelated'});app.click('[data-consent-reject]');assert.equal(app.scripts.length,0);assert.equal(app.cookies.get('formaclub_session'),'unrelated');assert.match(app.writes.at(-1),/Path=\/abruzzofoto\/; SameSite=Lax; Secure/);});
test('Only explicit consent loads Analytics, once, without URL query data',()=>{const app=setup('G-TEST123456');app.click('[data-consent-accept]');app.click('[data-consent-accept]');assert.equal(app.scripts.length,1);assert.equal(app.scripts[0].src,'https://www.googletagmanager.com/gtag/js?id=G-TEST123456');assert.doesNotMatch(JSON.stringify(app.context.dataLayer),/email=private|q=private|#private/);});
test('Expired or malformed consent never enables tracking',()=>{for(const value of ['broken',encodeURIComponent(JSON.stringify({version:'test:G-TEST123456',analytics:true,savedAt:Date.now()-181*86400000}))]){const app=setup('G-TEST123456',{af_consent_v1:value});assert.equal(app.scripts.length,0);assert.equal(app.elements.get('cookie-banner').hidden,false);}});
test('Valid saved consent loads the configured property',()=>{const saved=encodeURIComponent(JSON.stringify({version:'test:G-TEST123456',analytics:true,savedAt:Date.now()}));const app=setup('G-TEST123456',{af_consent_v1:saved});assert.equal(app.scripts.length,1);});
test('Revocation disables tracking, removes project analytics cookies and reloads',()=>{const app=setup('G-TEST123456',{af_ga:'analytics',formaclub_session:'unrelated'});app.click('[data-consent-accept]');app.click('[data-consent-reject]');assert.equal(app.context['ga-disable-G-TEST123456'],true);assert.equal(app.cookies.has('af_ga'),false);assert.equal(app.cookies.get('formaclub_session'),'unrelated');assert.equal(app.reloads.length,1);});
