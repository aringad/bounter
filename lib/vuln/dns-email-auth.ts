import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>SPF, DKIM e DMARC</h2>
      <p>
        L'autenticazione email si basa su tre protocolli complementari che lavorano insieme per prevenire
        lo spoofing e il phishing. <strong>SPF (Sender Policy Framework)</strong> specifica quali server
        sono autorizzati a inviare email per conto di un dominio, pubblicando un elenco di IP autorizzati
        in un record DNS TXT. <strong>DKIM (DomainKeys Identified Mail)</strong> aggiunge una firma
        crittografica all'email per garantire che il messaggio non sia stato modificato durante il transito.
      </p>
      <p style="margin-top: 0.5rem;">
        <strong>DMARC (Domain-based Message Authentication, Reporting and Conformance)</strong> unisce
        SPF e DKIM definendo una policy che indica ai server riceventi come trattare le email che
        non superano i controlli: <code>none</code> (solo monitoraggio), <code>quarantine</code>
        (metti in spam) o <code>reject</code> (rifiuta). Usare tutti e tre insieme offre la protezione
        piu' completa contro l'invio di email fraudolente a nome del proprio dominio.
      </p>
    </div>

    <!-- Domanda 1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">Q1.</span> Cosa verifica il protocollo SPF?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'b',
          'Corretto!',
          'Sbagliato. SPF non verifica il contenuto dell\\'email. Verifica se il server che ha inviato l\\'email e\\' autorizzato a farlo per conto del dominio del mittente, controllando un elenco di IP pubblicato nel DNS.')">
          <input type="radio" name="q1"> <span>Che il contenuto dell'email non sia stato modificato</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'b',
          'Corretto! SPF (Sender Policy Framework) verifica che il server che invia l\\'email sia nell\\'elenco dei server autorizzati per quel dominio. Questo elenco e\\' pubblicato come record TXT nel DNS del dominio mittente.',
          'Sbagliato.')">
          <input type="radio" name="q1"> <span>Quali server sono autorizzati a inviare email per un dominio</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'b',
          'Corretto!',
          'Sbagliato. SPF non verifica l\\'identita\\' del destinatario. Il suo scopo e\\' controllare se il server mittente e\\' autorizzato a inviare email per conto del dominio indicato nell\\'indirizzo del mittente.')">
          <input type="radio" name="q1"> <span>L'identita' del destinatario dell'email</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1, 'd', 'b',
          'Corretto!',
          'Sbagliato. SPF non si occupa della crittografia della connessione (quello e\\' TLS/SSL). SPF verifica se il server che invia l\\'email e\\' autorizzato dal dominio mittente attraverso un record DNS.')">
          <input type="radio" name="q1"> <span>Che la connessione email sia crittografata</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">Q2.</span> Cosa verifica una firma DKIM?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'a',
          'Corretto! DKIM (DomainKeys Identified Mail) aggiunge una firma crittografica all\\'email. Il server ricevente usa la chiave pubblica pubblicata nel DNS del dominio mittente per verificare che il messaggio non sia stato alterato durante il transito.',
          'Sbagliato.')">
          <input type="radio" name="q2"> <span>Che l'email non sia stata modificata durante il transito</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'a',
          'Corretto!',
          'Sbagliato. DKIM non verifica l\\'indirizzo IP del mittente (quello e\\' compito di SPF). DKIM usa una firma crittografica per garantire l\\'integrita\\' del messaggio: che non sia stato modificato tra l\\'invio e la ricezione.')">
          <input type="radio" name="q2"> <span>Che l'indirizzo IP del mittente sia autorizzato</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'a',
          'Corretto!',
          'Sbagliato. DKIM non controlla se l\\'email contiene spam. Verifica l\\'integrita\\' del messaggio tramite una firma crittografica, assicurando che il contenuto non sia stato alterato durante il transito.')">
          <input type="radio" name="q2"> <span>Che l'email non contenga spam</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(2, 'd', 'a',
          'Corretto!',
          'Sbagliato. DKIM non verifica che il destinatario esista. Il suo scopo e\\' garantire, tramite firma crittografica, che il contenuto dell\\'email non sia stato modificato durante il transito.')">
          <input type="radio" name="q2"> <span>Che il destinatario esista nel server di posta</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">Q3.</span> Un dominio ha il record <code>v=DMARC1; p=reject</code>. Cosa succede alle email che non superano i controlli SPF e DKIM?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'c',
          'Corretto!',
          'Sbagliato. Con p=reject le email non vengono consegnate normalmente. La policy reject indica al server ricevente di rifiutare completamente le email che non superano i controlli di autenticazione.')">
          <input type="radio" name="q3"> <span>Vengono consegnate normalmente</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'c',
          'Corretto!',
          'Sbagliato. La policy p=quarantine mette le email nello spam. Ma con p=reject, il server ricevente deve rifiutare completamente le email non autenticate, senza consegnarle ne\\' allo spam ne\\' alla casella principale.')">
          <input type="radio" name="q3"> <span>Vengono messe nella cartella spam</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'c',
          'Corretto! La policy p=reject e\\' la piu\\' restrittiva: indica al server ricevente di rifiutare completamente le email che non superano i controlli SPF e DKIM. L\\'email non viene consegnata e il mittente riceve un messaggio di errore.',
          'Sbagliato.')">
          <input type="radio" name="q3"> <span>Vengono rifiutate e non consegnate</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(3, 'd', 'c',
          'Corretto!',
          'Sbagliato. La policy p=none serve solo per il monitoraggio. Con p=reject, le email che non superano l\\'autenticazione vengono rifiutate dal server ricevente, non solo monitorate.')">
          <input type="radio" name="q3"> <span>Vengono solo registrate in un report</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">Q4.</span> Dove vengono memorizzati i record SPF?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'b',
          'Corretto!',
          'Sbagliato. I record SPF non sono memorizzati nell\\'header dell\\'email. Sono pubblicati come record DNS TXT nel DNS del dominio mittente, dove i server riceventi possono consultarli per verificare l\\'autorizzazione.')">
          <input type="radio" name="q4"> <span>Nell'header dell'email</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'b',
          'Corretto! I record SPF vengono pubblicati come record DNS di tipo TXT nel DNS del dominio mittente. Contengono l\\'elenco degli indirizzi IP e dei server autorizzati a inviare email per conto di quel dominio.',
          'Sbagliato.')">
          <input type="radio" name="q4"> <span>In un record DNS di tipo TXT</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'b',
          'Corretto!',
          'Sbagliato. I record SPF non sono nel certificato SSL del server. Sono pubblicati nel DNS del dominio come record TXT, accessibili a qualsiasi server che debba verificare l\\'autorizzazione all\\'invio di email.')">
          <input type="radio" name="q4"> <span>Nel certificato SSL del server di posta</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(4, 'd', 'b',
          'Corretto!',
          'Sbagliato. I record SPF non sono configurati nel client di posta. Sono pubblicati come record DNS TXT nel sistema DNS del dominio, consultabili dai server riceventi durante la verifica dell\\'email.')">
          <input type="radio" name="q4"> <span>Nella configurazione del client di posta</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">Q5.</span> Un'email passa il controllo SPF ma fallisce DKIM. La policy DMARC e' <code>p=quarantine</code>. Cosa succede?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'b',
          'Corretto!',
          'Sbagliato. Con DMARC, perche\\' l\\'email superi il controllo, deve passare almeno uno tra SPF e DKIM con allineamento del dominio. Se l\\'allineamento DKIM fallisce e quello SPF non e\\' allineato, la policy p=quarantine manda l\\'email nello spam.')">
          <input type="radio" name="q5"> <span>Viene consegnata normalmente perche' SPF e' passato</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'b',
          'Corretto! DMARC richiede che almeno SPF o DKIM passino con allineamento del dominio. Se il DKIM fallisce e l\\'allineamento SPF non e\\' valido, la policy p=quarantine indica al server ricevente di trattare l\\'email come sospetta e metterla nella cartella spam.',
          'Sbagliato.')">
          <input type="radio" name="q5"> <span>Viene messa nella cartella spam</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'b',
          'Corretto!',
          'Sbagliato. L\\'email non viene rifiutata: la policy e\\' quarantine (spam), non reject. Con p=quarantine, le email che non superano la verifica DMARC vengono messe nello spam, non rifiutate completamente.')">
          <input type="radio" name="q5"> <span>Viene rifiutata completamente</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">Q6.</span> Perche' e' importante usare SPF, DKIM e DMARC insieme?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'b',
          'Corretto!',
          'Sbagliato. Non basta un solo protocollo. SPF verifica il server mittente ma non il contenuto; DKIM verifica l\\'integrita\\' ma non il server; DMARC coordina entrambi e definisce la policy. Ognuno copre un vettore d\\'attacco diverso.')">
          <input type="radio" name="q6"> <span>Basta uno solo, gli altri sono ridondanti</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'b',
          'Corretto! Ogni protocollo copre un aspetto diverso: SPF verifica che il server mittente sia autorizzato, DKIM garantisce che il messaggio non sia stato alterato, e DMARC coordina entrambi definendo come trattare i fallimenti. Insieme offrono una protezione completa contro lo spoofing email.',
          'Sbagliato.')">
          <input type="radio" name="q6"> <span>Ognuno copre un vettore d'attacco diverso e insieme offrono protezione completa</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'b',
          'Corretto!',
          'Sbagliato. L\\'uso combinato non e\\' legato alla velocita\\'. Il motivo e\\' che ciascun protocollo copre un aspetto diverso della sicurezza email: SPF il server, DKIM l\\'integrita\\', DMARC la policy. Insieme coprono tutti i vettori d\\'attacco.')">
          <input type="radio" name="q6"> <span>Servono per velocizzare la consegna delle email</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6, 'd', 'b',
          'Corretto!',
          'Sbagliato. Non e\\' un obbligo legale ma una best practice di sicurezza. Il motivo tecnico e\\' che ogni protocollo protegge da un tipo di attacco diverso: SPF verifica il server, DKIM l\\'integrita\\' del messaggio, DMARC definisce la policy.')">
          <input type="radio" name="q6"> <span>Sono obbligatori per legge in tutti i paesi</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <div id="result-box" class="result-box">
      <h2>Risultato</h2>
      <div class="big-score"></div>
      <div class="message"></div>
    </div>

    <div class="score-bar">
      <div>
        <span class="score" id="score">0 / 6</span>
        <span class="progress" id="progress" style="margin-left: 1rem;">0 di 6 completate</span>
      </div>
    </div>

    <script>QuizEngine.init(6);</script>
  `;

  const html = wrapQuiz("SPF, DKIM e DMARC", body);
  res.setHeader("Content-Type", "text/html");
  return res.status(200).send(html);
}
