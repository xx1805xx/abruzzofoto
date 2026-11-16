# Collaudo applicativo e preparazione Aruba — Abruzzo Foto

**Data:** 16 novembre 2026. **Esito:** verifiche applicative eseguite con le correzioni sotto elencate. **Il via libera definitivo alla pubblicazione resta subordinato alla prova email e alla verifica del pacchetto sul server IIS dopo il caricamento.** Non è una certificazione di assenza di vulnerabilità o di conformità legale.

Versione applicativa verificata su GitHub: `2a494fa9b78702c3611e28178e71d62c0179de11` (CSS `v=7`, moduli JS `v=5`). Anteprima statica del pacchetto Aruba verificata separatamente per URL, privacy, cookie, pagina 404 e modulo stampe; gli ultimi interventi CSS sono stati verificati sulla versione pubblica. Browser utilizzati: Chrome nell'anteprima e Chrome collegato. Non sono state eseguite prove su Safari/Firefox o su un telefono fisico.

## Risultati

| Ambito | Verifiche ed esito osservato |
| --- | --- |
| Copertina | Cambio precedente/successivo e miniature funzionanti; comandi Play e pausa aggiornano lo stato. Controlli separati dal link preventivo. Il timer della presentazione e il rispetto del movimento ridotto sono stati esaminati nel codice; non è stata eseguita una misura temporale della riproduzione. |
| Portfolio | Cinque album: Ritratti 8 foto, Matrimoni 8, Danza 2, Sport 4, Macro 4. Conteggi e aperture verificati nell'interfaccia. |
| Galleria | Filtri delle cinque categorie, ritorno a Tutte e caricamento progressivo 9 → 18 → 26 verificati. Il pulsante di caricamento scompare alla fine. |
| Visualizzatore | Apertura, immagine successiva, freccia sinistra sulla tastiera e chiusura con Esc verificati; codice del gesto touch esaminato. Lo swipe su un dispositivo touch fisico non è stato provato. |
| Preventivi | Apertura, chiusura, servizio preselezionato e riapertura dopo una validazione fallita verificati. Email non valida e campi obbligatori mancanti bloccano l'interfaccia. Dopo compilazione e lettura privacy non risultano campi invalidi. Nessun invio reale è stato effettuato. |
| Moduli dei servizi | Verificate le cinque pagine, le immagini e i valori predefiniti del servizio. In totale sono presenti 6 moduli: home più cinque servizi. |
| Email alternativa | Costruzione del mailto verificata automaticamente: testo utente codificato nel corpo, senza poter aggiungere destinatari cc tramite il messaggio. L'apertura del programma email dipende dal dispositivo; nessun messaggio è stato spedito. |
| Privacy | Preferenze apribili e rifiuto funzionante. ID GA4 vuoto: nessuno script Analytics caricato, opzione statistiche disabilitata e stato dichiarato nell'interfaccia. |
| Mobile e tablet | Home/menu/modulo a 390 e 360 px; tutte le altre otto pagine a 360 px. Dopo la correzione della 404 nessun overflow orizzontale osservato. Home verificata anche a 768×1024, 1512×772 e 1920×740. Distanza positiva fra link preventivo e miniature della copertina. |
| Menu | Apertura, chiusura dopo scelta Servizi e chiusura con Esc verificate. |
| Risorse e SEO | 9 documenti, 181 riferimenti interni e 26 JPEG verificati: nessuna risorsa o ancora mancante. Controllati canonical, sitemap XML, JSON-LD, hash CSP, unicità degli ID e delle intestazioni principali. |
| Console | Nessun errore applicativo/avviso della pagina osservato. Sono esclusi gli errori delle estensioni del browser, estranei al codice del sito. |

## Test automatici

**14 test superati nel primo collaudo; 16 dopo l’aggiornamento del banner, nessun fallimento.**

- 9 test di consenso: nessuna proprietà configurata, blocco prima della scelta, rifiuto, caricamento singolo dopo consenso, esclusione di query e frammenti dai parametri, consenso scaduto/malformato, consenso valido, revoca, percorso cookie Aruba e rifiuto di percorsi non validi. Cookie estranei al progetto preservati.
- 5 test del modulo: normalizzazione dei caratteri di controllo e soggetto fisso, ripristino del pulsante al ritorno alla pagina, honeypot, endpoint modificato, servizio fuori elenco e codifica del mailto. Alcuni casi sono raggruppati nello stesso test.
- Verifica sintattica dei tre file JavaScript completata; controllo statico eseguito sia su `docs` sia sul pacchetto esportato.
- Integrità ZIP verificata. Il pacchetto contiene 51 file pubblici e nessuna cartella `.git`, `docs`, `tests` o `scripts`. Nei file testuali non sono stati rilevati i pattern cercati di chiavi private e token; non è una prova esaustiva di assenza di segreti.

Comandi:

```sh
node --check docs/app.js
node --check docs/privacy.js
node --check docs/contact.js
node --test tests/*.test.cjs
python scripts/check_site.py docs
python scripts/export_aruba.py --output build/aruba-public
python scripts/check_site.py build/aruba-public --base https://www.abruzzofoto.it/
```

## Difetti corretti

1. Il codice dei cookie ignorava `sitePath` e utilizzava sempre il percorso GitHub: ora legge un percorso configurato e validato, con test specifico per `/` su Aruba.
2. Una validazione del servizio fallita poteva lasciare il campo bloccato dopo la riapertura del preventivo con un servizio preselezionato: lo stato viene azzerato correttamente.
3. La pagina 404 usava risorse relative, inadatte agli URL inesistenti profondi: ora ha percorsi dalla radice del progetto, adattati alla radice del dominio nell'esportazione.
4. Il titolo della 404 usciva dallo schermo a 360 px: dimensione corretta e ricontrollata sul sito pubblico.
5. Il link preventivo della copertina sfiorava le miniature sul desktop: aggiunta una separazione stabile e adattata la dimensione del titolo sugli schermi ampi e bassi.
6. I vecchi collegamenti PhotoSì e Facebook hanno restituito 404 nelle richieste di controllo. Rimossi dai punti di navigazione e dai dati strutturati; per le stampe ora si raggiunge il modulo dedicato. Nessun nuovo profilo social è stato inventato. L'informativa FormSubmit è risultata consultabile tramite la fonte web ufficiale, anche se un client HTTP del collaudo riceveva 403.

## Aruba e HTTPS/TLS

Il pannello del dominio **abruzzofoto.it** ha mostrato:

- servizio **Hosting Windows Basic**, percorso `/`;
- certificato **DV installato**, scadenza **25 maggio 2027**;
- redirect HTTPS **Attivo**.

Il dominio pubblico attuale ha risposto **301 da HTTP a HTTPS** e **200 in HTTPS**. Non sono stati sostituiti certificati, modificati DNS o caricati file sul dominio Aruba. Il sito presente sul dominio è ancora quello precedente.

Aruba documenta il supporto a TLS 1.2 e TLS 1.3. Non è stata convalidata dal runtime la negoziazione diretta con il server origin: la risoluzione DNS diretta non era disponibile e il client HTTP passava da un proxy. Non si dichiara quindi una misura indipendente di versioni, cifrari, catena o data di rinnovo del certificato pubblico. La cifratura non si aggiunge ai file HTML e non sostituisce i controlli applicativi.

Il pacchetto Windows include `web.config` con MIME di font/SVG, header CSP con `frame-ancestors 'none'`, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, pagina iniziale, blocco elenco cartelle, mapping della 404 e reindirizzamenti dei vecchi URL principali. **È stato controllato come XML; l'effettiva accettazione delle direttive da parte dell'IIS condiviso Aruba deve essere provata sul server.**

## Consegna

Archivio: `abruzzofoto-aruba-windows.zip`, **1.873.148 byte**, 51 file.

SHA-256: `a9861e484ecad35b81eb41790ff4405c9fb5317be3d255469513769e5f8e61e6`.

Il contenuto va estratto e caricato nella radice del dominio mantenendo `assets/`, dopo backup fuori dall'area pubblica. Non caricare lo ZIP stesso o la cartella contenitrice. Procedura completa: [ARUBA_WINDOWS.md](ARUBA_WINDOWS.md).

## Verifiche che impediscono un “tutto certificato”

- **Consegna email:** serve un invio autorizzato di prova a `info@abruzzofoto.it`, completare l'eventuale CAPTCHA, confermare l'eventuale attivazione FormSubmit nella casella e attestare la ricezione. Test preparabile con nome “Collaudo tecnico Abruzzo Foto”, servizio “Altro progetto” e messaggio “Test tecnico del modulo preventivi. Non è una richiesta commerciale. Verificare la ricezione.” Nessuna comunicazione di prova è stata spedita.
- **Hosting:** dopo il caricamento verificare header effettivi, assenza di errori 500/500.19, redirect, codici HTTP 404 e risorse dei percorsi profondi. Non sono stati eseguiti penetration test sull'infrastruttura Aruba/GitHub o sui fornitori del modulo.
- **Analytics:** resta disattivato finché non sono completati l'account, l'ID reale e le impostazioni della proprietà. I test del consenso usano un tag simulato, non un account Google attivo.
- **Informativa:** dati giuridici completi del titolare e condizioni dei fornitori da confermare prima dell'uso professionale. Non sono stati inventati partita IVA, sede o accordi contrattuali.
- **Area riservata:** non implementata in questa versione. Le fotografie del portfolio sono pubbliche. Una futura area clienti deve controllare autorizzazione e accesso ai file lato server.

Riferimenti: [Aruba — installazione certificato](https://guide.aruba.it/hosting-e-domini/certificato-ssl/gestione/installare), [Aruba — caratteristiche hosting/TLS](https://guide.aruba.it/hosting-e-domini/gestione-domini/acquisto-e-rinnovo/acquisto-registrazione/hosting-domini-caratteristiche-e-utilizzo), [Aruba — Windows e web.config](https://guide.aruba.it/hosting-e-domini/hosting/hosting-windows/pubblicazione-gestione-sito-windows/utilizzare-cms-con-windows), [OWASP TLS](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html).

## Aggiornamento banner, prova email e caricamento dal Mac

Il banner ora compare al primo accesso anche in assenza di un ID Analytics, con Accetta, Rifiuta e Preferenze. La scelta resta memorizzata per 180 giorni; i controlli delle statistiche non configurate sono nascosti e il motivo è esplicitato. L’invio autorizzato di prova ha raggiunto FormSubmit, che ha mostrato “Check Your Email” richiedendo la conferma della casella tramite “Activate Form”. Non è ancora attestata la consegna di una richiesta dopo l’attivazione. La versione nuova non è stata caricata sul dominio Aruba: nessun file esistente è stato sostituito. Procedura concreta e stato del trasferimento in [CARICAMENTO_DA_MAC.md](CARICAMENTO_DA_MAC.md). Il pacchetto aggiornato e integrato per questo dominio sostituisce quello della prima consegna: 51 file, 1.873.078 byte, SHA-256 aab8e596f35b3cb891ff148be185aa742cfe01a046ee6423f7bcc5f8725860e8.
