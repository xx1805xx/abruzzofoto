# Verifica tecnica — Abruzzo Foto

Data: 12 novembre 2026. Ambito: codice del repository `xx1805xx/abruzzofoto`, pagine statiche pubblicate e prova del sito in anteprima. Il controllo non comprende l'infrastruttura interna di GitHub, Google o FormSubmit e non costituisce una certificazione di assenza di vulnerabilità.

## Controlli eseguiti e risultati

- Esaminati HTML, JavaScript, CSS, dipendenze e destinazioni dei dati. Non sono presenti un database, un backend applicativo eseguibile, password, chiavi SMTP o chiavi API private nel frontend. Gli ID di verifica e di misurazione, quando configurati, sono identificativi pubblici e non credenziali.
- Non sono usati `eval`, `document.write`, `innerHTML` o attributi di esecuzione inline. I contenuti dinamici del portfolio sono creati con nodi DOM e `textContent`. Un marcatore HTML inserito nel campo nome rimane testo del campo e non viene interpretato come HTML.
- Aggiunta una Content Security Policy via meta, immediatamente dopo la codifica della pagina: script e font locali; eventuale Google tag consentito solo dal dominio previsto; oggetti e frame disabilitati; `base-uri 'none'`; invio form limitato all'endpoint HTTPS di FormSubmit. L'unico blocco inline è JSON-LD statico, autorizzato con hash SHA-256.
- Controllati su 9 documenti canonical, hash JSON-LD, endpoint POST e collegamenti locali. Sitemap XML valida. Verifica sintattica dei tre moduli JavaScript e del portfolio completata.
- Font spostati sul sito, con licenze OFL conservate: niente collegamento automatico a Google Fonts o preconnessione a domini Google al caricamento.
- Il modulo usa validazione HTML, limiti di lunghezza, elenco chiuso dei servizi, normalizzazione dei caratteri di controllo nei campi e honeypot. Email non valida e campi obbligatori mancanti bloccano l'invio nell'interfaccia. L'antispam effettivo e la validazione lato server dipendono da FormSubmit; i controlli client non sono una barriera contro chi chiama direttamente il provider.
- Le richieste e i campi del modulo non vengono salvati in localStorage e non vengono trasmessi ad Analytics. Query e frammenti degli URL sono rimossi dai parametri di misurazione manuali. Nessun `user_id` è impostato.
- Superati 7 test automatici del consenso: caricamento bloccato prima della scelta, rifiuto, configurazione assente, consensi scaduti o malformati, consenso valido, caricamento singolo e revoca. I cookie di altri progetti non vengono cancellati; le preferenze e i cookie di questo progetto hanno percorso `/abruzzofoto/` e nomi dedicati.
- Nell'anteprima non sono stati osservati errori applicativi o violazioni CSP della pagina. Sono esclusi dal risultato i messaggi delle estensioni del browser.
- La risposta HTTPS pubblica osservata include `Strict-Transport-Security: max-age=31556952`.

## Attivazioni e limiti ancora presenti

1. **Invio email:** endpoint configurato per `info@abruzzofoto.it`. La prima richiesta al provider richiede la conferma dell'indirizzo da parte del destinatario. Non è stata attestata una consegna end-to-end a una casella email e non sono state inviate richieste personali di prova. Rimane disponibile la bozza tramite app email.
2. **Statistiche:** nessun ID di misurazione è stato inventato. Finché `analyticsMeasurementId` è vuoto in `docs/site-config.js`, Analytics è disattivato e non viene caricato. La proprietà Google deve essere completata e le condizioni devono essere accettate dal titolare. Anche dopo l'attivazione, il tag viene caricato solo con consenso esplicito.
3. **Header lato server:** GitHub Pages non viene configurato da questo repository con header di sicurezza personalizzati. La CSP via meta non può applicare `frame-ancestors`; manca quindi una protezione completa dall'incorporamento del sito in frame esterni. Per quel controllo serve un hosting o proxy che consenta header HTTP personalizzati. Non sono stati aggiunti header fittizi o un frame-buster presentato come equivalente.
4. **Dati legali:** l'informativa usa il nome pubblico Abruzzo Foto e i contatti del sito. Il gestore deve confermare identità giuridica completa, informazioni commerciali applicabili e configurazione contrattuale dei fornitori. Non è una verifica legale di conformità GDPR.
5. **SEO:** metadata, contenuti dedicati e sitemap favoriscono la scoperta delle pagine, ma non garantiscono indicizzazione, tempi o posizionamento. Il `robots.txt` del dominio radice non è stato modificato, per non influire sugli altri progetti GitHub Pages.

## Ripetere i controlli

`node --check docs/app.js`

`node --check docs/privacy.js`

`node --check docs/contact.js`

`node --test tests/privacy.test.cjs`

## Riferimenti tecnici

- OWASP CSP Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html
- MDN frame-ancestors: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors
- Google consent mode: https://support.google.com/analytics/answer/14009635
- FormSubmit: https://formsubmit.co/
- Google Search Central: https://developers.google.com/search/docs/fundamentals/seo-starter-guide

## Aggiornamento 16 novembre 2026

Correzioni, ulteriori test, verifica del certificato Aruba e limiti del collaudo finale sono descritti in [deployment/COLLAUDO_FINALE.md](deployment/COLLAUDO_FINALE.md). Le statistiche restano disattivate e la consegna end-to-end delle email non è ancora attestata.
