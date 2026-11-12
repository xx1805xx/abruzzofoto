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
let category='all',limit=6,currentIndex=0,previousFocus=null;
const gallery=document.getElementById('gallery'),more=document.getElementById('load-more'),status=document.getElementById('gallery-status');
const filtered=()=>category==='all'?photos:photos.filter(p=>p.category===category);
function renderGallery(){
 const list=filtered();gallery.replaceChildren();
 list.slice(0,limit).forEach((p,i)=>{
  const article=document.createElement('article');article.className='gallery-item';
  const button=document.createElement('button');button.className='gallery-image';button.setAttribute('aria-label','Ingrandisci: '+p.title);
  const img=document.createElement('img');img.src='assets/'+p.file;img.alt=p.alt;img.loading='lazy';img.width=800;img.height=900;button.append(img);
  button.addEventListener('click',()=>openLightbox(i));
  const caption=document.createElement('div');caption.className='gallery-caption';
  const title=document.createElement('h3');title.textContent=p.title;
  const type=document.createElement('span');type.textContent=p.category;caption.append(title,type);article.append(button,caption);gallery.append(article);
 });
 more.hidden=limit>=list.length;status.textContent=Math.min(limit,list.length)+' fotografie visualizzate su '+list.length;
}
function chooseCategory(value){category=value;limit=6;document.querySelectorAll('.filter').forEach(b=>{const active=b.dataset.filter===value;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});renderGallery();}
document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>chooseCategory(b.dataset.filter)));
more.addEventListener('click',()=>{const firstNew=limit;limit+=6;renderGallery();gallery.children[firstNew]?.querySelector('button').focus({preventScroll:true});});
document.querySelectorAll('[data-category]').forEach(b=>b.addEventListener('click',()=>{chooseCategory(b.dataset.category);document.getElementById('portfolio').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}));
const dialog=document.getElementById('lightbox'),lbImg=document.getElementById('lightbox-image');
function updateLightbox(){const list=filtered(),p=list[currentIndex];lbImg.src='assets/'+p.file;lbImg.alt=p.alt;document.getElementById('lightbox-title').textContent=p.category+' / '+p.title;document.getElementById('lightbox-count').textContent=String(currentIndex+1).padStart(2,'0')+' / '+String(list.length).padStart(2,'0');}
function openLightbox(i){currentIndex=i;previousFocus=document.activeElement;updateLightbox();dialog.showModal();document.body.classList.add('modal-open');}
function step(d){currentIndex=(currentIndex+d+filtered().length)%filtered().length;updateLightbox();}
document.querySelector('.lightbox-close').addEventListener('click',()=>dialog.close());
document.querySelector('.lightbox-next').addEventListener('click',()=>step(1));document.querySelector('.lightbox-prev').addEventListener('click',()=>step(-1));
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();step(1);}if(e.key==='ArrowLeft'){e.preventDefault();step(-1);}});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');previousFocus?.focus({preventScroll:true});});
const toggle=document.querySelector('.menu-toggle'),nav=document.getElementById('navigation');
function closeMenu(){toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Apri menu');nav.classList.remove('open');}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));toggle.setAttribute('aria-label',open?'Apri menu':'Chiudi menu');nav.classList.toggle('open',!open);});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus();}});
document.getElementById('contact-form').addEventListener('submit',e=>{e.preventDefault();const form=e.currentTarget;if(!form.reportValidity())return;const data=new FormData(form);const subject='Richiesta informazioni — '+data.get('service');const body='Nome: '+data.get('name')+'\nEmail: '+data.get('email')+'\nServizio: '+data.get('service')+'\n\n'+data.get('message');window.location.href='mailto:info@abruzzofoto.it?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);document.getElementById('form-status').textContent='Richiesta preparata. Completa l’invio nella tua app email, oppure scrivi a info@abruzzofoto.it.';});
renderGallery();
