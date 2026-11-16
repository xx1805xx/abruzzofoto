'use strict';
(() => {
 const config=window.ABRUZZO_CONFIG||{};
 const id=typeof config.analyticsMeasurementId==='string'?config.analyticsMeasurementId.trim():'';
 const configured=/^G-[A-Z0-9]{5,20}$/.test(id);
 const path=typeof config.sitePath==='string'&&/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(config.sitePath)?config.sitePath:'/abruzzofoto/';
 const key='af_consent_v1';
 const version=String(config.consentVersion||'v1')+':'+id;
 const ttl=180*24*60*60*1000;
 const banner=document.getElementById('cookie-banner'),dialog=document.getElementById('cookie-dialog'),choice=document.getElementById('analytics-choice');
 let loaded=false,granted=false;
 function readConsent(){
  try{
   const raw=document.cookie.split('; ').find(item=>item.startsWith(key+'='));
   if(!raw)return null;
   const record=JSON.parse(decodeURIComponent(raw.slice(key.length+1)));
   const age=Date.now()-record.savedAt;
   if(record.version!==version||typeof record.analytics!=='boolean'||!Number.isFinite(record.savedAt)||age<0||age>ttl)return null;
   return record;
  }catch{return null;}
 }
 function writeConsent(analytics){
  const record={version,analytics:configured&&analytics===true,savedAt:Date.now()};
  document.cookie=key+'='+encodeURIComponent(JSON.stringify(record))+'; Max-Age=15552000; Path='+path+'; SameSite=Lax'+(location.protocol==='https:'?'; Secure':'');
  return record;
 }
 function deleteAnalyticsCookies(){
  for(const entry of document.cookie.split(';')){
   const name=entry.trim().split('=')[0];
   if(name.startsWith('af_')&&name!==key)document.cookie=name+'=; Max-Age=0; Path='+path+'; SameSite=Lax'+(location.protocol==='https:'?'; Secure':'');
  }
 }
 function cleanUrl(value,fallback){
  try{const url=new URL(value);return ['http:','https:'].includes(url.protocol)?url.origin+url.pathname:fallback;}catch{return fallback;}
 }
 function enableAnalytics(){
  if(!configured||!granted||loaded)return;
  loaded=true;window['ga-disable-'+id]=false;
  window.dataLayer=window.dataLayer||[];
  window.gtag=function(){window.dataLayer.push(arguments);};
  window.gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  window.gtag('consent','update',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  window.gtag('js',new Date());
  window.gtag('config',id,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,cookie_prefix:'af',cookie_path:path,cookie_domain:'none',cookie_expires:5184000,cookie_update:false,cookie_flags:'SameSite=Lax;Secure',page_location:cleanUrl(location.href,''),page_referrer:cleanUrl(document.referrer,'')});
  window.gtag('event','page_view',{page_title:document.title,page_location:cleanUrl(location.href,''),page_referrer:cleanUrl(document.referrer,'')});
  const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(id);script.dataset.abruzzoAnalytics='true';document.head.append(script);
 }
 function apply(analytics){
  const wasLoaded=loaded;granted=configured&&analytics===true;
  if(!granted){if(configured)window['ga-disable-'+id]=true;deleteAnalyticsCookies();}
  writeConsent(granted);if(banner)banner.hidden=true;
  if(dialog?.open)dialog.close();
  if(granted)enableAnalytics();
  else if(wasLoaded)location.reload();
 }
 function openPreferences(){
  if(!dialog)return;const record=readConsent();choice.checked=configured&&record?.analytics===true;choice.disabled=!configured;
  document.getElementById('analytics-availability').textContent=configured?'Le statistiche sono facoltative e si attivano solo con il tuo consenso.':'Le statistiche non sono attive in questo momento. Nessun servizio di analytics viene caricato.';
  if(!dialog.open)dialog.showModal();document.body.classList.add('privacy-open');
 }
 document.querySelectorAll('[data-cookie-settings]').forEach(button=>button.addEventListener('click',openPreferences));
 document.querySelectorAll('[data-consent-reject]').forEach(button=>button.addEventListener('click',()=>apply(false)));
 document.querySelectorAll('[data-consent-accept]').forEach(button=>button.addEventListener('click',()=>apply(true)));
 document.querySelector('[data-close-cookies]')?.addEventListener('click',()=>dialog.close());
 document.getElementById('save-cookie-preferences')?.addEventListener('click',()=>apply(choice.checked));
 dialog?.addEventListener('close',()=>document.body.classList.remove('privacy-open'));
 const record=readConsent();granted=configured&&record?.analytics===true;
 if(banner)banner.hidden=!configured||record!==null;
 if(granted)enableAnalytics();
 const state=document.getElementById('privacy-analytics-state');if(state)state.textContent=configured?'Stato del sito: statistiche disponibili solo dopo consenso.':'Stato del sito: nessuna proprietà Analytics attiva; nessun tracciamento statistico viene caricato.';
 window.AbruzzoPrivacy=Object.freeze({open:openPreferences,getState:()=>Object.freeze({configured,analytics:granted})});
 window.AbruzzoAnalytics=Object.freeze({event:name=>{if(!granted||!loaded||!['quote_request_started','quote_email_draft'].includes(name))return;window.gtag('event',name);}});
})();
