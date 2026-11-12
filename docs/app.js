'use strict';
const photos = [
 {file:'couple-full-1.jpg',category:'Matrimoni',title:'Il giorno del sì',alt:'Ritratto degli sposi in bianco e nero'},
 {file:'woman-full-1.jpg',category:'Ritratti',title:'Uno sguardo, una storia',alt:'Ritratto femminile in bianco e nero con calice rosso'},
 {file:'dance-full-1.jpg',category:'Danza',title:'Il gesto e la luce',alt:'Ballerina in scena con le braccia alzate'},
 {file:'macro-full-0.jpg',category:'Macro',title:'Un piccolo mondo',alt:'Insetto tra gli steli verdi, fotografia macro'},
 {file:'sport-full-2.jpg',category:'Sport',title:'Dentro l’azione',alt:'Motociclista durante un salto su un percorso sterrato'},
 {file:'wedding-full-0.jpg',category:'Matrimoni',title:'Insieme, un istante',alt:'Composizione fotografica degli sposi, dall’album Massimo e Angela'},
 {file:'dance-full-0.jpg',category:'Danza',title:'Emozioni in scena',alt:'Corpo di ballo sul palcoscenico illuminato'},
 {file:'portrait-full-0.jpg',category:'Ritratti',title:'Oltre il ritratto',alt:'Ritratto maschile dal book fotografico'},
 {file:'macro-full-1.jpg',category:'Macro',title:'La bellezza dei dettagli',alt:'Fiore di borragine e foglie osservati da vicino'},
 {file:'sport-full-0.jpg',category:'Sport',title:'La forza del gesto',alt:'Allenamento atletico in bianco e nero'},
 {file:'woman-full-3.jpg',category:'Ritratti',title:'Esserci, semplicemente',alt:'Ritratto femminile seduto su una poltrona bianca'},
 {file:'couple-full-0.jpg',category:'Matrimoni',title:'Una nuova pagina',alt:'Copertina dell’album di matrimonio Alessandro e Morena'},
 {file:'macro-full-2.jpg',category:'Macro',title:'La natura, da vicino',alt:'Piccolo fiore giallo tra steli verdi'},
 {file:'portrait-full-1.jpg',category:'Ritratti',title:'Un’altra prospettiva',alt:'Ritratto maschile con occhiali scuri'},
 {file:'sport-full-1.jpg',category:'Sport',title:'Questione di equilibrio',alt:'Atleta durante un esercizio alla sbarra'},
 {file:'wedding-full-1.jpg',category:'Matrimoni',title:'Prima del grande giorno',alt:'Composizione dell’album di matrimonio con preparativi e paesaggio'},
 {file:'woman-full-0.jpg',category:'Ritratti',title:'Un dettaglio rosso',alt:'Ritratto femminile con un calice'},
 {file:'macro-full-3.jpg',category:'Macro',title:'La luce nelle piccole cose',alt:'Spiga verde fotografata su fondo sfocato'},
 {file:'sport-full-3.jpg',category:'Sport',title:'Polvere e movimento',alt:'Motociclista in azione su un tracciato sterrato'},
 {file:'wedding-full-2.jpg',category:'Matrimoni',title:'Frammenti di una storia',alt:'Selezione di immagini dell’album di matrimonio'},
 {file:'portrait-full-2.jpg',category:'Ritratti',title:'Espressioni',alt:'Ritratto maschile in posa dal book'},
 {file:'woman-full-2.jpg',category:'Ritratti',title:'Tra luci e ombre',alt:'Ritratto femminile in una composizione di luci e ombre'},
 {file:'couple-full-2.jpg',category:'Matrimoni',title:'I preparativi',alt:'Composizione con lo sposo e dettagli del matrimonio'},
 {file:'portrait-full-3.jpg',category:'Ritratti',title:'Carattere, in un’immagine',alt:'Ritratto maschile in posa'},
 {file:'wedding-full-3.jpg',category:'Matrimoni',title:'Attimi da ricordare',alt:'Fotografie dei preparativi dello sposo'},
 {file:'couple-full-3.jpg',category:'Matrimoni',title:'Dettagli di un giorno speciale',alt:'Ritratti dello sposo nell’album di matrimonio'}
];
const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
const pad=n=>String(n).padStart(2,'0');
const categories={
 Ritratti:{label:'BOOK & RITRATTI',cover:'woman-full-3.jpg',alt:'Ritratto femminile su una poltrona bianca',description:'Volti, espressioni e personalità. Una selezione di immagini dai book fotografici di Abruzzo Foto.',service:'Book e ritratti'},
 Matrimoni:{label:'MATRIMONI',cover:'couple-full-1.jpg',alt:'Ritratto degli sposi in bianco e nero',description:'Gli sguardi, i preparativi e i momenti condivisi. Immagini e composizioni dagli album di matrimonio.',service:'Matrimonio'},
 Danza:{label:'DANZA',cover:'dance-full-1.jpg',alt:'Ballerina in scena con le braccia alzate',description:'Il gesto, il movimento e la luce del palcoscenico. Due scatti dal nostro archivio dedicato alla danza.',service:'Danza e sport'},
 Sport:{label:'SPORT',cover:'sport-full-2.jpg',alt:'Motociclista durante un salto su sterrato',description:'L’energia di un’azione, la forza di un gesto. Una selezione dedicata alla fotografia sportiva.',service:'Danza e sport'},
 Macro:{label:'MACRO',cover:'macro-full-1.jpg',alt:'Fiore di borragine osservato da vicino',description:'Fermarsi, avvicinarsi, guardare. Un piccolo mondo di forme e dettagli che spesso passano inosservati.',service:'Altro progetto'}
};
const scrollToSection=id=>document.getElementById(id).scrollIntoView({behavior:reducedMotion.matches?'auto':'smooth'});
const album=$('#album-dialog'),lightbox=$('#lightbox'),quote=$('#quote-dialog');
function syncBodyLock(){document.body.classList.toggle('modal-open',[album,lightbox,quote].some(dialog=>dialog.open));}
let currentCategory='Ritratti',albumCategory='Ritratti',albumReturnFocus=null,lightboxReturnFocus=null,quoteReturnFocus=null;
let currentView='stories',galleryCategory='all',galleryLimit=9,lightboxItems=[],lightboxIndex=0;
const galleryItems=()=>galleryCategory==='all'?photos:photos.filter(p=>p.category===galleryCategory);
function photoCard(photo,index,collection){
 const article=document.createElement('article');article.className='photo-card';
 const button=document.createElement('button');button.className='photo-button';button.setAttribute('aria-label','Ingrandisci: '+photo.title);button.setAttribute('aria-haspopup','dialog');
 const image=document.createElement('img');image.src='assets/'+photo.file;image.alt=photo.alt;image.loading='lazy';image.decoding='async';
 button.append(image);button.addEventListener('click',()=>openLightbox(collection,index));
 const caption=document.createElement('div');caption.className='photo-card-caption';
 const title=document.createElement('span');title.textContent='[ '+pad(index+1)+' ] '+photo.title;
 const category=document.createElement('span');category.textContent=photo.category.toUpperCase();caption.append(title,category);article.append(button,caption);return article;
}
function setPreview(category){
 if(!categories[category])return;currentCategory=category;
 $$('.story-row').forEach(row=>row.classList.toggle('active',row.dataset.story===category));
 const meta=categories[category],img=$('#story-preview-image');img.src='assets/'+meta.cover;img.alt=meta.alt;
 $('#preview-label').textContent=meta.label;$('#story-preview').setAttribute('aria-label','Apri la raccolta '+category);
 if(!reducedMotion.matches)img.animate([{opacity:.4,transform:'scale(1.035)'},{opacity:1,transform:'scale(1)'}],{duration:500,easing:'ease-out'});
}
$$('.story-row').forEach(row=>{
 const category=row.dataset.story;row.setAttribute('aria-label','Apri la raccolta '+category);row.setAttribute('aria-haspopup','dialog');
 row.querySelector('.story-count').textContent=pad(photos.filter(p=>p.category===category).length)+' SCATTI';
 row.addEventListener('pointerenter',()=>{if(finePointer.matches)setPreview(category);});row.addEventListener('focus',()=>setPreview(category));row.addEventListener('click',()=>openAlbum(category));
});
$('#story-preview').addEventListener('click',()=>openAlbum(currentCategory));
function openAlbum(category){
 const meta=categories[category];if(!meta)return;albumCategory=category;albumReturnFocus=document.activeElement;
 const list=photos.filter(p=>p.category===category);$('#album-eyebrow').textContent='ABRUZZO FOTO / '+pad(list.length)+' FOTOGRAFIE';$('#album-title').textContent=category.toUpperCase();$('#album-description').textContent=meta.description;
 $('#album-grid').replaceChildren(...list.map((photo,i)=>photoCard(photo,i,list)));album.showModal();album.scrollTop=0;syncBodyLock();hideCursor();
}
$('[data-close-album]').addEventListener('click',()=>album.close());
album.addEventListener('close',()=>{syncBodyLock();if(!quote.open&&!lightbox.open&&albumReturnFocus?.isConnected)albumReturnFocus.focus({preventScroll:true});});
function renderGallery(){
 const list=galleryItems();$('#gallery').replaceChildren(...list.slice(0,galleryLimit).map((photo,i)=>photoCard(photo,i,list)));
 $('#load-more').hidden=galleryLimit>=list.length;$('#gallery-status').textContent=pad(Math.min(galleryLimit,list.length))+' / '+pad(list.length)+' FOTOGRAFIE';
}
function selectFilter(category){galleryCategory=category;galleryLimit=9;$$('[data-filter]').forEach(button=>{const selected=button.dataset.filter===category;button.classList.toggle('active',selected);button.setAttribute('aria-pressed',String(selected));});renderGallery();}
function setView(view){
 currentView=view;$('#work-index').hidden=view!=='stories';$('#gallery-view').hidden=view!=='gallery';
 $$('[data-view]').forEach(button=>{const selected=button.dataset.view===view;button.classList.toggle('active',selected);button.setAttribute('aria-pressed',String(selected));});
 if(view==='gallery')renderGallery();hideCursor();
}
$$('[data-view]').forEach(button=>button.addEventListener('click',()=>setView(button.dataset.view)));
$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>selectFilter(button.dataset.filter)));
$('#load-more').addEventListener('click',()=>{const previousLimit=galleryLimit;galleryLimit+=9;renderGallery();$('#gallery').children[previousLimit]?.querySelector('button').focus({preventScroll:true});});
$('[data-open-gallery]').addEventListener('click',()=>{selectFilter('all');setView('gallery');scrollToSection('lavori');});
function openLightbox(items,index){lightboxReturnFocus=document.activeElement;lightboxItems=items;lightboxIndex=index;updateLightbox();lightbox.showModal();syncBodyLock();hideCursor();}
function updateLightbox(){const p=lightboxItems[lightboxIndex];if(!p)return;$('#lightbox-image').src='assets/'+p.file;$('#lightbox-image').alt=p.alt;$('#lightbox-image').draggable=false;$('#lightbox-title').textContent=p.category.toUpperCase()+' / '+p.title;$('#lightbox-count').textContent=pad(lightboxIndex+1)+' / '+pad(lightboxItems.length);}
function changeLightbox(direction){lightboxIndex=(lightboxIndex+direction+lightboxItems.length)%lightboxItems.length;updateLightbox();}
$('#close-lightbox').addEventListener('click',()=>lightbox.close());$('#lightbox-prev').addEventListener('click',()=>changeLightbox(-1));$('#lightbox-next').addEventListener('click',()=>changeLightbox(1));
lightbox.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();changeLightbox(1);}else if(event.key==='ArrowLeft'){event.preventDefault();changeLightbox(-1);}});
lightbox.addEventListener('close',()=>{syncBodyLock();if(lightboxReturnFocus?.isConnected)lightboxReturnFocus.focus({preventScroll:true});});
let swipeStart=null;
$('#lightbox-stage').addEventListener('pointerdown',event=>{if(event.pointerType==='touch')swipeStart={x:event.clientX,y:event.clientY};},{passive:true});
$('#lightbox-stage').addEventListener('pointerup',event=>{if(!swipeStart)return;const dx=event.clientX-swipeStart.x,dy=event.clientY-swipeStart.y;swipeStart=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.4)changeLightbox(dx<0?1:-1);},{passive:true});
$('#lightbox-stage').addEventListener('pointercancel',()=>{swipeStart=null;});
const menuToggle=$('.menu-toggle'),navigation=$('#navigation');
function closeMenu(){menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Apri menu');navigation.classList.remove('open');document.body.classList.remove('menu-open');}
menuToggle.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')==='true';menuToggle.setAttribute('aria-expanded',String(!open));menuToggle.setAttribute('aria-label',open?'Apri menu':'Chiudi menu');navigation.classList.toggle('open',!open);document.body.classList.toggle('menu-open',!open);});
navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&navigation.classList.contains('open')){closeMenu();menuToggle.focus();}});
matchMedia('(min-width: 601px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
function openQuote(service='',returnFocus=document.activeElement){quoteReturnFocus=returnFocus;closeMenu();const select=$('#contact-form').elements.service;if(service&&[...select.options].some(option=>option.value===service))select.value=service;$('#form-status').textContent='';quote.showModal();quote.scrollTop=0;syncBodyLock();hideCursor();}
$$('[data-quote]').forEach(button=>button.addEventListener('click',()=>openQuote(button.dataset.quote)));
$('#close-quote').addEventListener('click',()=>quote.close());quote.addEventListener('close',()=>{syncBodyLock();if(quoteReturnFocus?.isConnected)quoteReturnFocus.focus({preventScroll:true});});
quote.addEventListener('click',event=>{if(event.target!==quote)return;const box=quote.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)quote.close();});
$('#album-quote').addEventListener('click',()=>{const service=categories[albumCategory].service,returnFocus=albumReturnFocus;album.close();openQuote(service,returnFocus);});
$('#contact-form').addEventListener('submit',event=>{
 event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const data=new FormData(form),date=data.get('date');
 const body='Nome: '+data.get('name')+'\nEmail: '+data.get('email')+'\nProgetto: '+data.get('service')+(date?'\nData: '+date:'')+'\n\n'+data.get('message');
 const href='mailto:info@abruzzofoto.it?subject='+encodeURIComponent('Informazioni — '+data.get('service'))+'&body='+encodeURIComponent(body);
 window.location.href=href;$('#form-status').textContent='Email preparata. Completa l’invio nella tua app email. In alternativa puoi scrivere direttamente a info@abruzzofoto.it.';
});
const heroSlides=[{category:'DANZA',caption:'Il gesto e la luce.'},{category:'RITRATTI',caption:'La tua personalità, in un’immagine.'},{category:'MACRO',caption:'La bellezza delle piccole cose.'}];
let heroIndex=0,playing=false,heroTimer=null;
function scheduleHero(){clearTimeout(heroTimer);if(playing&&!document.hidden&&!reducedMotion.matches)heroTimer=setTimeout(()=>{setHero(heroIndex+1);},6000);}
function setHero(index){
 heroIndex=(index+heroSlides.length)%heroSlides.length;
 $$('.hero-image').forEach((image,i)=>{image.classList.toggle('active',i===heroIndex);image.setAttribute('aria-hidden',String(i!==heroIndex));});
 $$('.slide-thumb').forEach((button,i)=>{button.classList.toggle('active',i===heroIndex);button.setAttribute('aria-current',String(i===heroIndex));});
 $('#hero-category').textContent=pad(heroIndex+1)+' / '+heroSlides[heroIndex].category;$('#hero-caption').textContent=heroSlides[heroIndex].caption;$('#slide-progress').style.transform='translateX('+(heroIndex*100)+'%)';scheduleHero();
}
function togglePlay(){playing=!playing;$('#hero-play').setAttribute('aria-pressed',String(playing));$('#hero-play').setAttribute('aria-label',playing?'Metti in pausa la presentazione':'Avvia presentazione');$('#play-label').textContent=playing?'Pausa':'Play';$('.play-symbol').textContent=playing?'Ⅱ':'▷';scheduleHero();}
$$('[data-slide]').forEach(button=>button.addEventListener('click',()=>setHero(Number(button.dataset.slide))));$('#hero-prev').addEventListener('click',()=>setHero(heroIndex-1));$('#hero-next').addEventListener('click',()=>setHero(heroIndex+1));$('#hero-play').addEventListener('click',togglePlay);
document.addEventListener('visibilitychange',scheduleHero);reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches&&playing)togglePlay();});
let heroPointerFrame=null;
$('.hero').addEventListener('pointermove',event=>{if(!finePointer.matches||reducedMotion.matches)return;cancelAnimationFrame(heroPointerFrame);heroPointerFrame=requestAnimationFrame(()=>{const box=$('.hero').getBoundingClientRect();$('#hero-stage').style.setProperty('--pointer-x',((event.clientX-box.left)/box.width-.5)*-9+'px');$('#hero-stage').style.setProperty('--pointer-y',((event.clientY-box.top)/box.height-.5)*-7+'px');});},{passive:true});
$('.hero').addEventListener('pointerleave',()=>{cancelAnimationFrame(heroPointerFrame);$('#hero-stage').style.setProperty('--pointer-x','0px');$('#hero-stage').style.setProperty('--pointer-y','0px');});
const photoCursor=$('#photo-cursor');
function hideCursor(){photoCursor.classList.remove('visible');}
document.addEventListener('pointermove',event=>{if(!finePointer.matches||reducedMotion.matches)return;const target=event.target instanceof Element?event.target.closest('.photo-button,.story-preview'):null;if(!target||lightbox.open||quote.open){hideCursor();return;}photoCursor.style.left=event.clientX+'px';photoCursor.style.top=event.clientY+'px';photoCursor.classList.add('visible');},{passive:true});
document.addEventListener('pointerleave',hideCursor);document.addEventListener('scroll',hideCursor,{passive:true,capture:true});
if('IntersectionObserver' in window&&!reducedMotion.matches){
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});},{threshold:.08,rootMargin:'0px 0px -20px 0px'});
 $$('.reveal').forEach(element=>observer.observe(element));document.documentElement.classList.add('js-reveal');
}
setHero(0);renderGallery();
