# Caricare Abruzzo Foto dal Mac

Il computer può essere un Mac. La voce **Hosting Windows** nel pannello indica il server Aruba su cui il dominio è ospitato: non serve un computer Windows.

## Punto esatto nel pannello

1. Apri `https://admin.aruba.it` e seleziona il dominio **abruzzofoto.it**.
2. Nel menu a sinistra apri **Hosting Windows → File Manager**.
3. Nel File Manager seleziona **abruzzofoto.it**, la cartella principale. Il percorso hosting verificato nel pannello era `/`. Per il nuovo sito non entrare nelle cartelle `_` o `public`.
4. Premi **Carica File** nella barra in alto.
5. Nella finestra **Carica File - abruzzofoto.it**, premi **Seleziona file da caricare** e scegli dal Mac il nuovo archivio **ABRUZZOFOTO_ARUBA_AGGIORNATO.zip**.
6. Attendi che il trasferimento finisca e che il nome dell'archivio compaia nell'elenco. A questo punto il file è stato trasferito, ma il sito non è ancora pubblicato: l'archivio deve essere estratto e i file devono trovarsi nella radice, con `index.html` accanto alla cartella `assets`.

Il pacchetto ZIP preparato nella sessione contiene direttamente 51 file pubblici, senza cartella `docs` contenitrice. Include la nuova versione del banner e una configurazione IIS integrata con la sezione preesistente letta sul server. I file precedenti che possono essere sostituiti (`index.html`, `Matrimoni.html`, `web.config`) sono stati copiati prima del caricamento; nessun file del sito Aruba è stato sostituito in questa sessione.

Prima di estrarre o sostituire file, verificare il completamento dell'upload e la possibilità di ripristino dei file precedenti. Non usare i pulsanti **Svuota la cartella** o **Elimina** sul contenuto esistente. Non caricare backup, credenziali, fotografie riservate o l'intero repository nella cartella pubblica.

## Stato di questa sessione

- Banner aggiornato pubblicato su GitHub: appare al primo accesso, presenta **Accetta**, **Rifiuta**, **Preferenze** e ricorda la scelta. Sono stati superati 16 test automatici.
- Analytics non è collegato a un account: non viene caricato alcun tag e non viene mostrata una casella disabilitata come se fosse funzionante. Quando viene collegato un ID reale, viene richiesta una nuova scelta prima del caricamento del tag.
- La richiesta di prova autorizzata è stata inoltrata a FormSubmit dal sito GitHub. Il servizio ha mostrato **Check Your Email** e ha dichiarato di aver inviato a `info@abruzzofoto.it` una mail con il collegamento **Activate Form**. La ricezione nella casella e la consegna di una successiva richiesta non sono ancora confermate.
- L'importazione dell'archivio tramite URL non ha caricato file: il File Manager ha mostrato «Non sono stati specificati file da caricare».
- Il trasferimento automatico dal browser non è stato completato: il controllo del download non riusciva a verificare l'origine dell'operazione e il collegamento alla scheda ha poi perso il controllo. È stato riaperto il File Manager per la selezione manuale del file dal Mac. Il dominio conserva ancora il sito precedente.

## Passaggi dopo il trasferimento

Estrarre il pacchetto nella posizione corretta, verificare l'eventuale conferma di sostituzione solo per i file previsti, quindi collaudare le pagine e i codici HTTP. Certificato DV e redirect HTTPS risultavano già attivi. Vanno verificati sul server gli header del nuovo `web.config`, le risorse, i redirect delle pagine iWeb e l'errore 404.

Aprire la casella `info@abruzzofoto.it`, cercare il messaggio FormSubmit anche nello spam e usare **Activate Form**. Il link di attivazione non va pubblicato o incollato nel repository. Dopo l'attivazione serve una sola nuova richiesta di prova per confermare la consegna reale.

Il pacchetto mirato della sessione ha SHA-256 `aab8e596f35b3cb891ff148be185aa742cfe01a046ee6423f7bcc5f8725860e8` e dimensione 1.873.078 byte. La copia generica su branch `aruba-pubblicazione` contiene invece il `web.config` generato e richiede l'integrazione delle eventuali impostazioni preesistenti. L'area riservata e i permessi dei clienti saranno trattati dopo la pubblicazione del sito.
