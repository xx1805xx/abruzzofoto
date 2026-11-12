'use strict';
(() => {
 const services=new Set(['Matrimonio','Book e ritratti','Danza e sport','Stampe e gadget','Altro progetto']);
 const recipient='info@abruzzofoto.it';
 function normalized(value,multiline=false){return String(value||'').replace(multiline?/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g:/[\u0000-\u001F\u007F]/g,'').trim();}
 for(const form of document.querySelectorAll('form[data-quote-form]')){
  const status=form.querySelector('[role="status"]');
  function validate(){
   for(const name of ['name','email','place','message']){const input=form.elements.namedItem(name);if(input)input.value=normalized(input.value,name==='message');}
   const service=form.elements.namedItem('service');service.setCustomValidity(services.has(service.value)?'':'Scegli un servizio dall’elenco.');
   if(!form.reportValidity())return false;
   if(form.elements.namedItem('_honey').value){status.textContent='Non è stato possibile elaborare la richiesta. Contattaci via email.';return false;}
   return true;
  }
  form.elements.namedItem('service').addEventListener('change',()=>form.elements.namedItem('service').setCustomValidity(''));
  form.addEventListener('submit',event=>{
   if(!validate()){event.preventDefault();return;}
   if(form.action!=='https://formsubmit.co/'+recipient){event.preventDefault();status.textContent='Invio non disponibile. Usa il collegamento email.';return;}
   form.elements.namedItem('_subject').value='Nuova richiesta di preventivo — Abruzzo Foto';
   form.querySelector('[type="submit"]').disabled=true;
   status.textContent='Prosegui sul servizio di invio per completare l’eventuale verifica antispam.';
   window.AbruzzoAnalytics?.event('quote_request_started');
  });
  form.querySelector('[data-email-fallback]')?.addEventListener('click',()=>{
   if(!validate())return;const data=new FormData(form);
   const body='Nome: '+data.get('name')+'\nEmail: '+data.get('email')+'\nServizio: '+data.get('service')+(data.get('date')?'\nData: '+data.get('date'):'')+(data.get('place')?'\nLuogo: '+data.get('place'):'')+'\n\n'+data.get('message');
   location.href='mailto:'+recipient+'?subject='+encodeURIComponent('Richiesta preventivo — Abruzzo Foto')+'&body='+encodeURIComponent(body);
   status.textContent='Bozza preparata. Completa l’invio nella tua app email.';window.AbruzzoAnalytics?.event('quote_email_draft');
  });
  window.addEventListener('pageshow',()=>{form.querySelector('[type="submit"]').disabled=false;});
 }
})();
