# Pubblicazione di Abruzzo Foto su Aruba Windows

Questa procedura riguarda il dominio **www.abruzzofoto.it** e il servizio **Hosting Windows Basic**, verificati nel pannello il 16 novembre 2026. Non usare una configurazione .htaccess per Linux.

## Pacchetto

Generare in una cartella nuova e vuota:

```sh
python scripts/export_aruba.py --output build/aruba-public
python scripts/check_site.py build/aruba-public --base https://www.abruzzofoto.it/
```

Il risultato `build/aruba-public.zip` contiene direttamente i file pubblici del sito: `index.html`, pagine, JavaScript, CSS, cartella `assets`, `robots.txt`, sitemap e `web.config`. Nessuna installazione di Node/PHP/database è richiesta dal portfolio. Per eseguire il controllo delle immagini sul computer di sviluppo serve Pillow; il server non ne ha bisogno.

Il generatore adatta tutti gli URL a HTTPS sul dominio, il ritorno del modulo, il percorso dei cookie alla radice, l'informativa hosting, gli hash CSP dei dati strutturati e rimuove la verifica Search Console della precedente proprietà GitHub. Il sito GitHub resta autonomo.

## Prima di sostituire il sito

1. Scaricare e conservare **fuori dalla cartella pubblica** una copia di tutti i file attuali, incluso l'eventuale `web.config`. Non lasciare ZIP di backup o file di configurazione rinominati sul sito.
2. Verificare nel pannello che il dominio selezionato sia `abruzzofoto.it` e l'hosting sia Windows. Il percorso mostrato era `/`.
3. Se è già presente un `web.config`, farne il backup e integrare le impostazioni utili: non sovrascrivere configurazioni di applicazioni ancora utilizzate. Il nuovo file imposta `index.html` come pagina iniziale, disabilita l'elenco delle cartelle, definisce MIME per font/SVG, header di sicurezza, vecchi URL iWeb e pagina 404.
4. Caricare **il contenuto** del pacchetto nella radice del sito, mantenendo la struttura di `assets/`. Usare File Manager o FTPS. Non caricare la cartella `docs` contenitrice, l'intero repository, test, script di sviluppo o il file ZIP stesso.
5. Non cancellare altri contenuti già presenti finché non sono stati censiti e salvati. Le regole coprono i vecchi percorsi principali; eventuali album profondi ancora collegati da altri siti vanno mappati separatamente.

## HTTPS e TLS

Nel pannello osservato il certificato DV era **Installato**, scadenza **25/05/2027**; il redirect HTTPS era **Attivo**. La richiesta HTTP pubblica ha restituito 301 verso `https://www.abruzzofoto.it/`; la richiesta HTTPS ha risposto 200. Non è stato necessario installare o sostituire certificati.

Aruba documenta il supporto a TLS 1.2 e TLS 1.3. Il certificato e i protocolli TLS sono gestiti dal server/provider, non dai file HTML. Non sono state caricate chiavi private nel repository o nel pacchetto. Non è stato possibile misurare direttamente versioni/cifrari e catena del server origin dal runtime di collaudo: la connessione diretta non risolveva il nome e le richieste HTTP passavano da un proxy. Questo limite non viene presentato come verifica crittografica completa.

Guide ufficiali: https://guide.aruba.it/hosting-e-domini/certificato-ssl/gestione/installare e https://guide.aruba.it/hosting-e-domini/gestione-domini/acquisto-e-rinnovo/acquisto-registrazione/hosting-domini-caratteristiche-e-utilizzo

## Verifica sul server dopo il caricamento

La validità XML del `web.config` è stata controllata; l'effettiva applicazione delle direttive deve essere verificata su IIS Aruba. Un'anteprima statica non può convalidare le sezioni consentite dalla configurazione condivisa del provider.

- Aprire home, tutte le pagine dei servizi, privacy, gallerie e moduli anche da telefono.
- Provare HTTP e HTTPS, con e senza www: destinazione finale unica, HTTPS, senza cicli o avvisi del browser.
- Verificare font, immagini e header CSP/X-Content-Type-Options/X-Frame-Options. Aprire una pagina inesistente anche con percorso profondo: deve restituire HTTP 404 e mostrare pagina e risorse correttamente.
- Provare `/_/Home.html`, `/_/Matrimoni.html`, `/_/Book.html`, `/_/Sport.html` e gli altri percorsi mappati: devono restituire 301 verso le nuove pagine. Non reindirizzare indistintamente tutte le pagine mancanti alla home.
- In caso di errore 500/500.19 dopo il caricamento del `web.config`, ripristinare la copia precedente e verificare la direttiva nel log/assistenza Aruba. Non dichiarare riuscito il collaudo server finché l'errore non è risolto.
- Inviare una richiesta di preventivo di prova, completare l'eventuale CAPTCHA, confermare l'attivazione FormSubmit dalla casella `info@abruzzofoto.it` e controllare ricezione, spam e indirizzo del visitatore per la risposta. L'attivazione e la consegna end-to-end non sono state confermate nel collaudo locale.
- Verificare i dati completi del titolare nell'informativa e le condizioni dei fornitori. Analytics resta disattivato: nessun ID reale è stato fornito. Prima di attivarlo completare l'account e ricollaudare il consenso con il tag reale, anche sulle pagine dei servizi.
- Aggiungere/verificare il dominio Aruba in Search Console e inviare `https://www.abruzzofoto.it/sitemap.xml`. La verifica della proprietà GitHub non verifica il nuovo dominio. Evitare copie pubbliche con canonical in conflitto.

## Ambito

Questa versione non contiene un'area clienti autenticata né file riservati. Non caricare fotografie private nel repository pubblico o nella cartella `assets` confidando in un link nascosto. L'area riservata richiede un progetto di controllo accessi distinto.
