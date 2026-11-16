# Abruzzo Foto — Dentro l'istante

Portfolio fotografico statico, in italiano. Sito: https://xx1805xx.github.io/abruzzofoto/

## Pubblicazione
GitHub Pages: branch `main`, cartella `/docs`. Nessuna installazione o compilazione richiesta.

## Esperienza
Copertina a pieno schermo con cambio fotografia, controlli e presentazione opzionale. Indice delle raccolte con anteprima interattiva, vista galleria con filtri, album dedicati e visualizzatore con tastiera e swipe. Richieste di preventivo tramite FormSubmit, con alternativa tramite app email. Menu mobile, animazioni di ingresso e rispetto delle preferenze di movimento ridotto.

Le 26 fotografie provengono dal sito originale abruzzofoto.it; i diritti restano ai rispettivi titolari. Il modulo trasmette le richieste a FormSubmit quando l’utente sceglie l’invio diretto. I caratteri sono serviti localmente, con alternative di sistema e licenze OFL conservate.

## Direzione visiva
Implementazione originale per GitHub Pages, con riferimenti di composizione ai portfolio fotografici Jett e Stillness. Non include codice né componenti commerciali di quei template.

Progetto autonomo, separato da Formaclub.

## Preventivi, privacy e SEO

Il modulo può inviare la richiesta a `info@abruzzofoto.it` tramite FormSubmit, con verifica antispam del provider; al primo utilizzo il destinatario deve attivare l'indirizzo dall'email ricevuta. È disponibile anche la preparazione di una bozza nell'app email. La consegna reale va verificata dopo l'attivazione.

`docs/site-config.js` contiene l'ID pubblico GA4: attualmente vuoto, quindi nessuna statistica è attiva. Per abilitare le misurazioni completare la proprietà Google, inserire l'ID effettivo `G-...`, verificare le impostazioni del flusso e aggiornare la versione del consenso se cambiano le finalità. Il codice carica il tag solo dopo consenso; i cookie sono limitati al progetto e non vengono inviati nomi o messaggi del modulo.

Le pagine dei servizi hanno URL, titoli, descrizioni, canonical e JSON-LD propri. `docs/sitemap.xml` include home e cinque servizi. L'indicizzazione e il posizionamento restano decisioni di Google. Non è stato modificato il robots.txt del dominio condiviso.

Font serviti localmente, preferenze privacy revocabili e informativa in `docs/privacy.html`. Il gestore deve confermare i propri dati legali e le condizioni dei fornitori prima di considerare completata la configurazione privacy.

Risultati e limiti dei controlli in [SECURITY_REVIEW.md](SECURITY_REVIEW.md). Test del consenso: `node --test tests/privacy.test.cjs`.

## Aruba Windows

Il dominio dispone di Hosting Windows Basic. La versione GitHub rimane in `docs`; il pacchetto per il dominio si genera con `python scripts/export_aruba.py --output build/aruba-public`. Istruzioni e verifiche di HTTPS/TLS in [deployment/ARUBA_WINDOWS.md](deployment/ARUBA_WINDOWS.md). Controllo completo delle risorse: `python scripts/check_site.py docs`. Test del modulo e del consenso: `node --test tests/*.test.cjs`.

Rapporto aggiornato: [deployment/COLLAUDO_FINALE.md](deployment/COLLAUDO_FINALE.md). Il collaudo applicativo non sostituisce la prova di consegna email e la verifica delle direttive IIS sul server dopo il caricamento.

## Banner all’ingresso

Il banner compare al primo accesso e offre Accetta, Rifiuta e Preferenze. La scelta è ricordata per 180 giorni. Se Analytics non è configurato, l’interfaccia dichiara che sono usati solo cookie tecnici e nasconde il controllo delle statistiche; non simula un tracciamento inesistente. Quando viene inserito un ID reale, viene richiesta una nuova scelta prima di caricare il tag. Test automatici aggiornati: 16 superati. Il caricamento dal Mac avviene nel File Manager: la voce Hosting Windows identifica il server Aruba, non il sistema operativo del computer.

Percorso verificato dal Mac: [deployment/CARICAMENTO_DA_MAC.md](deployment/CARICAMENTO_DA_MAC.md). Il primo invio di prova ha richiesto l’attivazione FormSubmit via email; la consegna finale non è ancora attestata.
