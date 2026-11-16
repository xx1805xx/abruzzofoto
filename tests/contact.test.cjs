const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const code=fs.readFileSync('docs/contact.js','utf8');
function setup(overrides={}){
 const listeners={},pageListeners={},events=[];
 const field=value=>({value,customValidity:'',listeners:{},setCustomValidity(v){this.customValidity=v;},addEventListener(n,f){this.listeners[n]=f;}});
 const data={name:field('  Collaudo\u0001  '),email:field('  collaudo@example.com  '),place:field('Alanno\r\n'),message:field('Riga uno\nRiga due'),service:field('Matrimonio'),date:field('2027-06-01'),_honey:field(''),_subject:field('Untrusted subject')};
 for(const [key,value] of Object.entries(overrides.fields??{}))data[key].value=value;
 const status={textContent:''},submit={disabled:false},fallback={addEventListener(n,f){listeners['fallback:'+n]=f;}};
 const form={action:overrides.action??'https://formsubmit.co/info@abruzzofoto.it',elements:{namedItem:n=>data[n]},reportValidity:()=>!data.service.customValidity,querySelector:s=>s==='[role="status"]'?status:s==='[type="submit"]'?submit:fallback,addEventListener(n,f){listeners[n]=f;}};
 const context={document:{querySelectorAll:()=>[form]},location:{href:''},FormData:class{get(n){return data[n]?.value;}},String,Set,encodeURIComponent,AbruzzoAnalytics:{event:name=>events.push(name)},addEventListener(n,f){pageListeners[n]=f;}};
 context.window=context;vm.createContext(context);vm.runInContext(code,context);
 return {context,data,status,submit,events,trigger(name){const e={prevented:false,preventDefault(){this.prevented=true;}};listeners[name](e);return e;},restore(){pageListeners.pageshow();}};
}
test('A valid quote keeps the fixed recipient, normalizes controls and prepares one POST',()=>{const app=setup();assert.equal(app.trigger('submit').prevented,false);assert.equal(app.data.name.value,'Collaudo');assert.equal(app.data.place.value,'Alanno');assert.equal(app.data.message.value,'Riga uno\nRiga due');assert.equal(app.data._subject.value,'Nuova richiesta di preventivo — Abruzzo Foto');assert.equal(app.submit.disabled,true);app.restore();assert.equal(app.submit.disabled,false);});
test('Honeypot blocks the POST and never emits a started event',()=>{const app=setup({fields:{_honey:'spam'}});assert.equal(app.trigger('submit').prevented,true);assert.equal(app.events.length,0);});
test('A changed recipient endpoint is rejected',()=>{const app=setup({action:'https://other.example/'});assert.equal(app.trigger('submit').prevented,true);assert.equal(app.submit.disabled,false);});
test('Only listed services are accepted',()=>{const app=setup({fields:{service:'Injected service'}});assert.equal(app.trigger('submit').prevented,true);assert.equal(app.events.length,0);});
test('Email fallback encodes user text as body, never as extra recipient headers',()=>{const app=setup({fields:{message:'Test &cc=other@example.com\n<script>alert(1)</script>'}});app.trigger('fallback:click');const url=new URL(app.context.location.href);assert.equal(url.protocol,'mailto:');assert.equal(url.pathname,'info@abruzzofoto.it');assert.equal(url.searchParams.get('cc'),null);assert.equal(url.searchParams.get('subject'),'Richiesta preventivo — Abruzzo Foto');assert.match(url.searchParams.get('body'),/&cc=other@example.com/);});
