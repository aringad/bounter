import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const title = "Riconoscere il Phishing";

  const body = `
    <div class="intro">
      <h2>Cos'e' il Phishing?</h2>
      <p>
        Il <strong>phishing</strong> e' una tecnica di ingegneria sociale utilizzata dai criminali informatici per ingannare
        le vittime e indurle a rivelare informazioni sensibili come password, numeri di carte di credito o dati bancari.
        Gli attaccanti inviano email, SMS o messaggi che imitano comunicazioni ufficiali di banche, enti pubblici o aziende
        note, cercando di creare un senso di <strong>urgenza</strong> o <strong>paura</strong> per spingere la vittima ad agire
        senza riflettere.
      </p>
      <p style="margin-top: 0.5rem;">
        In questo quiz ti mostreremo <strong>6 email simulate</strong>. Il tuo compito e' determinare se ciascuna
        e' un tentativo di phishing oppure una comunicazione legittima. Presta attenzione ai dettagli: indirizzo del mittente,
        tono del messaggio, link sospetti e richieste insolite.
      </p>
    </div>

    <!-- Domanda 1: PHISHING - Intesa Sanpaolo falsa -->
    <div class="question" id="q-1">
      <h3><span class="q-number">Domanda 1.</span> Questa email e' legittima o phishing?</h3>
      <div class="email-client">
        <div class="email-toolbar">
          <span>&#9993; Rispondi</span>
          <span>&#8618; Inoltra</span>
          <span>&#128465; Elimina</span>
          <span>&#9873; Spam</span>
        </div>
        <div class="email-headers">
          <div class="eh-row"><span class="eh-label">Da:</span> <span class="eh-value"><span class="suspicious-highlight">sicurezza@intesasanpa0lo.it</span></span></div>
          <div class="eh-row"><span class="eh-label">A:</span> <span class="eh-value">mario.rossi@email.it</span></div>
          <div class="eh-row"><span class="eh-label">Oggetto:</span> <span class="eh-value">[URGENTE] Verifica immediata del tuo conto corrente</span></div>
        </div>
        <div class="email-body-content">
          <p>Gentile Cliente,</p>
          <p>Abbiamo rilevato un accesso sospetto al tuo conto corrente da un dispositivo non riconosciuto.
          Per la tua sicurezza, il conto e' stato temporaneamente limitato.</p>
          <p><strong>Devi verificare la tua identita' entro 24 ore</strong> o il conto verra' permanentemente bloccato.</p>
          <p>Clicca qui per procedere alla verifica: <span class="suspicious-highlight">https://intesasanpa0lo-verifica.com/sicurezza</span></p>
          <p>Cordiali saluti,<br>Servizio Sicurezza Intesa Sanpaolo</p>
        </div>
      </div>
      <div class="options">
        <div class="option" data-value="legit" onclick="QuizEngine.check(1,'legit','phishing','Corretto! Questa email e\\u0027 legittima.','Attenzione! Questa e\\u0027 un\\u0027email di phishing. Il dominio del mittente contiene uno zero al posto della lettera O (sanpa0lo invece di sanpaolo). Inoltre il link porta a un sito esterno (intesasanpa0lo-verifica.com) che non e\\u0027 il dominio ufficiale di Intesa Sanpaolo. Il tono di estrema urgenza e la minaccia di blocco permanente sono tattiche classiche di phishing.')">
          <input type="radio" name="q1"> Legittima
        </div>
        <div class="option" data-value="phishing" onclick="QuizEngine.check(1,'phishing','phishing','Esatto! Il dominio del mittente contiene uno zero al posto della lettera O (sanpa0lo invece di sanpaolo). Il link porta a un sito esterno non ufficiale e il tono di estrema urgenza con minaccia di blocco permanente sono tattiche classiche di phishing.','Questa email era in realta\\u0027 legittima.')">
          <input type="radio" name="q1"> Phishing
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 2: LEGITTIMA - Amazon conferma ordine -->
    <div class="question" id="q-2">
      <h3><span class="q-number">Domanda 2.</span> Questa email e' legittima o phishing?</h3>
      <div class="email-client">
        <div class="email-toolbar">
          <span>&#9993; Rispondi</span>
          <span>&#8618; Inoltra</span>
          <span>&#128465; Elimina</span>
          <span>&#9873; Spam</span>
        </div>
        <div class="email-headers">
          <div class="eh-row"><span class="eh-label">Da:</span> <span class="eh-value"><span class="safe-highlight">conferma-ordine@amazon.it</span></span></div>
          <div class="eh-row"><span class="eh-label">A:</span> <span class="eh-value">mario.rossi@email.it</span></div>
          <div class="eh-row"><span class="eh-label">Oggetto:</span> <span class="eh-value">Conferma ordine #403-2847561-9384721</span></div>
        </div>
        <div class="email-body-content">
          <p>Ciao Mario,</p>
          <p>Grazie per il tuo ordine! Ecco un riepilogo:</p>
          <p><strong>Ordine #403-2847561-9384721</strong><br>
          Articolo: Logitech MX Master 3S - Mouse Wireless<br>
          Quantita': 1<br>
          Totale: EUR 89,99<br>
          Consegna prevista: 15-17 marzo</p>
          <p>Puoi controllare lo stato del tuo ordine accedendo al tuo account su <span class="safe-highlight">amazon.it</span>.</p>
          <p>Grazie per aver scelto Amazon.it</p>
        </div>
      </div>
      <div class="options">
        <div class="option" data-value="legit" onclick="QuizEngine.check(2,'legit','legit','Corretto! Questa e\\u0027 una conferma d\\u0027ordine legittima di Amazon. Il mittente usa il dominio ufficiale amazon.it, l\\u0027email contiene dettagli specifici dell\\u0027ordine, si rivolge al cliente per nome e non richiede azioni urgenti ne\\u0027 dati sensibili. Il link rimanda semplicemente al sito ufficiale.','In realta\\u0027 questa email era legittima. Il dominio amazon.it e\\u0027 autentico, l\\u0027email contiene dettagli specifici dell\\u0027ordine, usa il nome del cliente e non richiede azioni urgenti o dati personali.')">
          <input type="radio" name="q2"> Legittima
        </div>
        <div class="option" data-value="phishing" onclick="QuizEngine.check(2,'phishing','legit','Corretto! Questa e\\u0027 una conferma d\\u0027ordine legittima di Amazon.','In realta\\u0027 questa email era legittima. Il dominio amazon.it e\\u0027 autentico, l\\u0027email contiene dettagli specifici dell\\u0027ordine, usa il nome del cliente e non chiede azioni urgenti o dati personali.')">
          <input type="radio" name="q2"> Phishing
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 3: PHISHING - INPS falsa -->
    <div class="question" id="q-3">
      <h3><span class="q-number">Domanda 3.</span> Questa email e' legittima o phishing?</h3>
      <div class="email-client">
        <div class="email-toolbar">
          <span>&#9993; Rispondi</span>
          <span>&#8618; Inoltra</span>
          <span>&#128465; Elimina</span>
          <span>&#9873; Spam</span>
        </div>
        <div class="email-headers">
          <div class="eh-row"><span class="eh-label">Da:</span> <span class="eh-value"><span class="suspicious-highlight">rimborsi@inps-gov.org</span></span></div>
          <div class="eh-row"><span class="eh-label">A:</span> <span class="eh-value">mario.rossi@email.it</span></div>
          <div class="eh-row"><span class="eh-label">Oggetto:</span> <span class="eh-value">Rimborso fiscale di 480,00 EUR in tuo favore</span></div>
        </div>
        <div class="email-body-content">
          <p>Gentile Contribuente,</p>
          <p>A seguito della revisione annuale della tua posizione fiscale, l'INPS ha stabilito che hai diritto
          ad un rimborso di <strong>EUR 480,00</strong>.</p>
          <p>Per ricevere il rimborso sul tuo conto corrente, e' necessario confermare i tuoi dati bancari
          entro 48 ore tramite il seguente portale sicuro:</p>
          <p><span class="suspicious-highlight">https://inps-gov-rimborsi.org/conferma-dati</span></p>
          <p>ATTENZIONE: trascorso il termine il rimborso sara' annullato.</p>
          <p>Distinti saluti,<br>INPS - Istituto Nazionale della Previdenza Sociale</p>
        </div>
      </div>
      <div class="options">
        <div class="option" data-value="legit" onclick="QuizEngine.check(3,'legit','phishing','Corretto! Questa email e\\u0027 legittima.','Attenzione! Questa e\\u0027 un\\u0027email di phishing. Il dominio inps-gov.org non e\\u0027 il dominio ufficiale dell\\u0027INPS che e\\u0027 inps.it. L\\u0027INPS non invia mai email per richiedere dati bancari e non offre rimborsi tramite link. Il saluto generico Gentile Contribuente e la scadenza di 48 ore sono segnali di phishing.')">
          <input type="radio" name="q3"> Legittima
        </div>
        <div class="option" data-value="phishing" onclick="QuizEngine.check(3,'phishing','phishing','Esatto! Il dominio inps-gov.org non e\\u0027 quello ufficiale dell\\u0027INPS (che e\\u0027 inps.it). L\\u0027INPS non richiede mai dati bancari via email e non offre rimborsi tramite link. Il saluto generico e la scadenza di 48 ore sono classici segnali di phishing.','Questa email era in realta\\u0027 legittima.')">
          <input type="radio" name="q3"> Phishing
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 4: PHISHING - Poste Italiane falsa -->
    <div class="question" id="q-4">
      <h3><span class="q-number">Domanda 4.</span> Questa email e' legittima o phishing?</h3>
      <div class="email-client">
        <div class="email-toolbar">
          <span>&#9993; Rispondi</span>
          <span>&#8618; Inoltra</span>
          <span>&#128465; Elimina</span>
          <span>&#9873; Spam</span>
        </div>
        <div class="email-headers">
          <div class="eh-row"><span class="eh-label">Da:</span> <span class="eh-value"><span class="suspicious-highlight">servizio.clienti@poste-italiane-sicurezza.com</span></span></div>
          <div class="eh-row"><span class="eh-label">A:</span> <span class="eh-value">mario.rossi@email.it</span></div>
          <div class="eh-row"><span class="eh-label">Oggetto:</span> <span class="eh-value">La tua carta PostePay e' stata sospesa</span></div>
        </div>
        <div class="email-body-content">
          <p>Gentile utente,</p>
          <p>La informiamo che la sua carta PostePay e' stata temporaneamnte sospesa per motivi di sicuezza.
          Abbiamo rilevato transazioni anomale sul suo conto.</p>
          <p>Per riattivare la carta, la preghiamo di aggiornare i suoi dati personali
          cliccando sul link sottostante:</p>
          <p><span class="suspicious-highlight">https://poste-italiane-sicurezza.com/postepay/riattiva</span></p>
          <p>Se non procede entro 12 ore, la carta verra' definitivamente bloccata.</p>
          <p>Cordiali Saluti,<br>Poste Italiane S.p.A.</p>
        </div>
      </div>
      <div class="options">
        <div class="option" data-value="legit" onclick="QuizEngine.check(4,'legit','phishing','Corretto! Questa email e\\u0027 legittima.','Attenzione! Questa e\\u0027 phishing. Ci sono diversi segnali: il dominio poste-italiane-sicurezza.com non e\\u0027 quello ufficiale (poste.it). Il testo contiene errori di battitura (temporaneamnte, sicuezza). Il saluto generico gentile utente, la richiesta di dati personali tramite link e la minaccia di blocco entro 12 ore sono tutte tecniche di phishing.')">
          <input type="radio" name="q4"> Legittima
        </div>
        <div class="option" data-value="phishing" onclick="QuizEngine.check(4,'phishing','phishing','Esatto! Il dominio poste-italiane-sicurezza.com non e\\u0027 quello ufficiale di Poste Italiane (poste.it). Nota anche gli errori di battitura nel testo (temporaneamnte, sicuezza), il saluto generico e la minaccia di blocco entro 12 ore. Poste Italiane non chiede mai dati personali via email.','Questa email era in realta\\u0027 legittima.')">
          <input type="radio" name="q4"> Phishing
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 5: LEGITTIMA - Banca reale -->
    <div class="question" id="q-5">
      <h3><span class="q-number">Domanda 5.</span> Questa email e' legittima o phishing?</h3>
      <div class="email-client">
        <div class="email-toolbar">
          <span>&#9993; Rispondi</span>
          <span>&#8618; Inoltra</span>
          <span>&#128465; Elimina</span>
          <span>&#9873; Spam</span>
        </div>
        <div class="email-headers">
          <div class="eh-row"><span class="eh-label">Da:</span> <span class="eh-value"><span class="safe-highlight">noreply@unicredit.it</span></span></div>
          <div class="eh-row"><span class="eh-label">A:</span> <span class="eh-value">mario.rossi@email.it</span></div>
          <div class="eh-row"><span class="eh-label">Oggetto:</span> <span class="eh-value">Estratto conto mensile disponibile</span></div>
        </div>
        <div class="email-body-content">
          <p>Gentile Mario Rossi,</p>
          <p>La informiamo che l'estratto conto del mese di febbraio 2026 e' ora disponibile
          nella sezione Documenti della sua area riservata.</p>
          <p>Per consultarlo, acceda alla sua area personale su <span class="safe-highlight">unicredit.it</span>
          tramite l'app Mobile Banking o il sito web.</p>
          <p>Per qualsiasi necessita' puo' contattare il suo consulente di riferimento
          o chiamare il numero verde 800.57.57.57.</p>
          <p>Cordiali saluti,<br>UniCredit S.p.A.</p>
          <p style="font-size: 0.75rem; color: #999; margin-top: 0.5rem;">Questa e' un'email automatica, la preghiamo di non rispondere a questo indirizzo.</p>
        </div>
      </div>
      <div class="options">
        <div class="option" data-value="legit" onclick="QuizEngine.check(5,'legit','legit','Corretto! Questa e\\u0027 un\\u0027email legittima di UniCredit. Il dominio unicredit.it e\\u0027 autentico, il cliente viene chiamato per nome e cognome, non vengono richiesti dati sensibili, non c\\u0027e\\u0027 urgenza artificiale e viene fornito un numero verde di riferimento per assistenza.','In realta\\u0027 questa email era legittima. Il dominio unicredit.it e\\u0027 autentico, il cliente viene identificato per nome, non si richiedono dati sensibili e viene fornito un numero verde ufficiale. L\\u0027email invita semplicemente a consultare un documento gia\\u0027 disponibile nell\\u0027area riservata.')">
          <input type="radio" name="q5"> Legittima
        </div>
        <div class="option" data-value="phishing" onclick="QuizEngine.check(5,'phishing','legit','Corretto! Questa e\\u0027 un\\u0027email legittima di UniCredit.','In realta\\u0027 questa email era legittima. Il dominio unicredit.it e\\u0027 autentico, il cliente viene identificato per nome, non si richiedono dati sensibili e viene fornito un numero verde ufficiale. L\\u0027email invita semplicemente a consultare un documento gia\\u0027 disponibile nell\\u0027area riservata.')">
          <input type="radio" name="q5"> Phishing
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 6: PHISHING - Agenzia Entrate falsa -->
    <div class="question" id="q-6">
      <h3><span class="q-number">Domanda 6.</span> Questa email e' legittima o phishing?</h3>
      <div class="email-client">
        <div class="email-toolbar">
          <span>&#9993; Rispondi</span>
          <span>&#8618; Inoltra</span>
          <span>&#128465; Elimina</span>
          <span>&#9873; Spam</span>
        </div>
        <div class="email-headers">
          <div class="eh-row"><span class="eh-label">Da:</span> <span class="eh-value"><span class="suspicious-highlight">notifiche@agenziaentrate-gov.it</span></span></div>
          <div class="eh-row"><span class="eh-label">A:</span> <span class="eh-value">mario.rossi@email.it</span></div>
          <div class="eh-row"><span class="eh-label">Oggetto:</span> <span class="eh-value">Avviso di irregolarita' fiscale - Azione immediata richiesta</span></div>
        </div>
        <div class="email-body-content">
          <p>Egregio contribuente,</p>
          <p>Dall'analisi della sua ultima dichiarazione dei redditi sono emerse delle
          <strong>gravi irregolarita'</strong> che richiedono una verifica immediata.</p>
          <p>La invitiamo a scaricare il documento allegato con i dettagli delle anomalie riscontrate
          e a regolarizzare la sua posizione entro 5 giorni lavorativi per evitare sanzioni
          fino a EUR 25.000.</p>
          <p>Scarichi il documento di notifica: <span class="suspicious-highlight">https://agenziaentrate-gov.it/documenti/notifica-385729.pdf.exe</span></p>
          <p>In caso di mancata risposta, si procedera' d'ufficio.</p>
          <p>L'Agenzia delle Entrate</p>
        </div>
      </div>
      <div class="options">
        <div class="option" data-value="legit" onclick="QuizEngine.check(6,'legit','phishing','Corretto! Questa email e\\u0027 legittima.','Attenzione! Questa e\\u0027 un\\u0027email di phishing molto pericolosa. Il dominio agenziaentrate-gov.it non e\\u0027 quello ufficiale (agenziaentrate.gov.it, con il punto prima di gov). Il file da scaricare ha estensione .pdf.exe, una tecnica usata per mascherare un eseguibile come un PDF. L\\u0027Agenzia delle Entrate non invia notifiche fiscali via email e non minaccia sanzioni con scadenze cosi\\u0027 brevi.')">
          <input type="radio" name="q6"> Legittima
        </div>
        <div class="option" data-value="phishing" onclick="QuizEngine.check(6,'phishing','phishing','Esatto! Il dominio agenziaentrate-gov.it non e\\u0027 quello ufficiale (agenziaentrate.gov.it, con il punto prima di gov). Il file .pdf.exe e\\u0027 un eseguibile mascherato da PDF, estremamente pericoloso. L\\u0027Agenzia delle Entrate non invia notifiche fiscali via email e non minaccia sanzioni con scadenze cosi\\u0027 brevi.','Questa email era in realta\\u0027 legittima.')">
          <input type="radio" name="q6"> Phishing
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <div id="result-box" class="result-box">
      <h2>Risultato</h2>
      <div class="big-score"></div>
      <div class="message"></div>
    </div>

    <script>QuizEngine.init(6)</script>

    <div class="score-bar">
      <span class="progress" id="progress">0 di 6 completate</span>
      <span class="score" id="score">0 / 6</span>
    </div>
  `;

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(wrapQuiz(title, body));
}
