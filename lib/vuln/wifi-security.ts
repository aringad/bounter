import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>Sicurezza WiFi</h2>
      <p>
        L'evoluzione della sicurezza WiFi da WEP a WPA3, le differenze tra modalita' Personal (PSK)
        ed Enterprise (802.1X/RADIUS), e le vulnerabilita' di ogni protocollo. Fondamentale per
        proteggere le reti wireless da accessi non autorizzati.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">WEP:</strong> Primo tentativo di sicurezza WiFi, completamente compromesso. Non usare mai.</li>
        <li><strong style="color:#38bdf8;">WPA/WPA2:</strong> WPA con TKIP come soluzione temporanea, WPA2 con AES-CCMP come standard solido.</li>
        <li><strong style="color:#38bdf8;">WPA3:</strong> SAE sostituisce il 4-way handshake, elimina attacchi dizionario offline, aggiunge forward secrecy.</li>
        <li><strong style="color:#38bdf8;">Personal (PSK):</strong> Password condivisa, semplice ma problematica con molti utenti.</li>
        <li><strong style="color:#38bdf8;">Enterprise (802.1X):</strong> Credenziali individuali via RADIUS, audit log, revoca singolo utente.</li>
      </ul>
    </div>

    <!-- Q1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">1.</span> Perche' il WEP e' completamente compromesso?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'b',
          '',
          'Sbagliato. La lunghezza della password non e\\' il problema. WEP usa RC4 con IV deboli che permettono di recuperare la chiave in pochi minuti analizzando il traffico.')">
          <input type="radio" name="q1"> <span>Usa password troppo corte</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'b',
          'Corretto! WEP usa l\\'algoritmo RC4 con Initialization Vector (IV) deboli di soli 24 bit. Dopo aver catturato abbastanza pacchetti, la chiave e\\' recuperabile in pochi minuti con strumenti come aircrack-ng. Non usare mai WEP.',
          '')">
          <input type="radio" name="q1"> <span>Usa RC4 con IV deboli - la chiave e' recuperabile in minuti con aircrack-ng</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'b',
          '',
          'Sbagliato. WEP usa crittografia (RC4), ma l\\'implementazione e\\' difettosa. Gli IV deboli permettono di recuperare la chiave analizzando il traffico catturato.')">
          <input type="radio" name="q1"> <span>Non usa nessuna crittografia</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1, 'd', 'b',
          '',
          'Sbagliato. Il brute force non e\\' necessario con WEP. La debolezza degli IV nell\\'implementazione RC4 permette di derivare la chiave matematicamente, senza provare tutte le combinazioni.')">
          <input type="radio" name="q1"> <span>La password puo' essere trovata con brute force</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">2.</span> Quale crittografia usa WPA2?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'c',
          '',
          'Sbagliato. RC4 era usato da WEP (e da TKIP in WPA come soluzione temporanea). WPA2 usa AES-CCMP, molto piu\\' sicuro.')">
          <input type="radio" name="q2"> <span>RC4</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'c',
          '',
          'Sbagliato. TKIP era la crittografia di WPA (soluzione ponte tra WEP e WPA2). WPA2 usa AES-CCMP come standard di crittografia.')">
          <input type="radio" name="q2"> <span>TKIP</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'c',
          'Corretto! WPA2 usa AES-CCMP (Advanced Encryption Standard - Counter Mode with CBC-MAC Protocol). E\\' una crittografia solida che ha sostituito il debole TKIP di WPA. AES e\\' considerato sicuro e usato anche in ambito governativo.',
          '')">
          <input type="radio" name="q2"> <span>AES-CCMP - crittografia solida, ha sostituito TKIP di WPA</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(2, 'd', 'c',
          '',
          'Sbagliato. DES e\\' un algoritmo di crittografia obsoleto e debole, non usato nel WiFi. WPA2 usa AES-CCMP.')">
          <input type="radio" name="q2"> <span>DES</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">3.</span> Qual e' il miglioramento principale di WPA3 rispetto a WPA2?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'b',
          '',
          'Sbagliato. WPA3 non aumenta la velocita\\' del WiFi. Il miglioramento e\\' nella sicurezza: SAE elimina gli attacchi dizionario offline e aggiunge forward secrecy.')">
          <input type="radio" name="q3"> <span>Velocita' di connessione piu' alta</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'b',
          'Corretto! WPA3 introduce SAE (Simultaneous Authentication of Equals) che sostituisce il 4-way handshake di WPA2. SAE elimina gli attacchi dizionario offline (non si puo\\' catturare l\\'handshake per crackarlo) e aggiunge forward secrecy (se la chiave viene compromessa, il traffico passato resta protetto).',
          '')">
          <input type="radio" name="q3"> <span>SAE sostituisce il 4-way handshake, elimina attacchi dizionario offline, aggiunge forward secrecy</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'b',
          '',
          'Sbagliato. WPA2 gia\\' supporta la modalita\\' Enterprise. Il miglioramento chiave di WPA3 e\\' SAE che rende impossibili gli attacchi dizionario offline.')">
          <input type="radio" name="q3"> <span>Supporto per autenticazione Enterprise</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(3, 'd', 'b',
          '',
          'Sbagliato. WPA3 non riguarda la portata del segnale. Il miglioramento e\\' l\\'uso di SAE per eliminare la vulnerabilita\\' del 4-way handshake agli attacchi offline.')">
          <input type="radio" name="q3"> <span>Portata del segnale migliorata</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">4.</span> Quando conviene usare WPA Enterprise invece di PSK?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'c',
          '',
          'Sbagliato. La velocita\\' non e\\' il criterio. Enterprise conviene con 20+ utenti per avere credenziali individuali via RADIUS, audit log e revoca del singolo utente.')">
          <input type="radio" name="q4"> <span>Quando serve una connessione piu' veloce</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'c',
          '',
          'Sbagliato. Il tipo di rete non determina la scelta. Enterprise conviene con molti utenti (20+) per gestire credenziali individuali, audit e revoca senza cambiare la password a tutti.')">
          <input type="radio" name="q4"> <span>Solo in reti con piu' di 100 dispositivi</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'c',
          'Corretto! Con 20+ utenti, PSK diventa ingestibile: se un dipendente lascia l\\'azienda, bisogna cambiare la password su tutti i dispositivi. Enterprise (802.1X/RADIUS) offre credenziali individuali, audit log dettagliati e la possibilita\\' di revocare un singolo utente.',
          '')">
          <input type="radio" name="q4"> <span>Con 20+ utenti - credenziali individuali via RADIUS, audit log, revoca singolo utente</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(4, 'd', 'c',
          '',
          'Sbagliato. PSK e Enterprise usano la stessa crittografia (AES). Il vantaggio di Enterprise e\\' nella gestione delle credenziali: individuali, tracciabili e revocabili.')">
          <input type="radio" name="q4"> <span>Quando si vuole una crittografia piu' forte</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">5.</span> Un'azienda usa WPA2-PSK. Un dipendente lascia l'azienda. Qual e' il problema di sicurezza?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'c',
          '',
          'Sbagliato. La rete non diventa piu\\' lenta. Il problema e\\' che l\\'ex dipendente conosce ancora la password condivisa e puo\\' accedere alla rete.')">
          <input type="radio" name="q5"> <span>La rete diventa piu' lenta</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'c',
          '',
          'Sbagliato. Il certificato e\\' usato in Enterprise, non in PSK. Il problema e\\' che con PSK tutti condividono la stessa password, e l\\'ex dipendente la conosce ancora.')">
          <input type="radio" name="q5"> <span>Il certificato del dipendente deve essere revocato</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'c',
          'Corretto! Con PSK tutti condividono la stessa password. L\\'ex dipendente la conosce ancora e puo\\' accedere alla rete. L\\'unica soluzione e\\' cambiare la password su TUTTI i dispositivi aziendali - un incubo operativo. Con Enterprise, basta disabilitare le sue credenziali.',
          '')">
          <input type="radio" name="q5"> <span>Bisogna cambiare la password su TUTTI i dispositivi - l'ex dipendente conosce la chiave condivisa</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(5, 'd', 'c',
          '',
          'Sbagliato. Non e\\' necessario reinstallare nulla. Il problema e\\' che la password PSK e\\' condivisa: l\\'ex dipendente la conosce e puo\\' ancora connettersi alla rete.')">
          <input type="radio" name="q5"> <span>Bisogna reinstallare il software su tutti gli AP</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">6.</span> Quale infrastruttura richiede WPA2/3 Enterprise?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'b',
          '',
          'Sbagliato. Un controller WiFi gestisce gli AP ma non e\\' necessario per Enterprise. Servono un server RADIUS, un certificato TLS e la configurazione dei profili client.')">
          <input type="radio" name="q6"> <span>Solo un controller WiFi</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'b',
          'Corretto! WPA2/3 Enterprise richiede: un server RADIUS (come FreeRADIUS o NPS) per l\\'autenticazione 802.1X, un certificato TLS per proteggere le credenziali durante l\\'autenticazione, e la configurazione dei profili client su ogni dispositivo.',
          '')">
          <input type="radio" name="q6"> <span>Server RADIUS + certificato TLS + configurazione profili client</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'b',
          '',
          'Sbagliato. AP speciali non sono necessari: la maggior parte degli AP supporta Enterprise. Servono un server RADIUS, un certificato TLS e la configurazione dei profili.')">
          <input type="radio" name="q6"> <span>AP speciali con supporto Enterprise</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6, 'd', 'b',
          '',
          'Sbagliato. Un server DNS dedicato non e\\' necessario per Enterprise. L\\'infrastruttura richiesta e\\' server RADIUS, certificato TLS e configurazione profili client.')">
          <input type="radio" name="q6"> <span>Un server DNS dedicato e un firewall</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <div class="result-box" id="result-box">
      <h2>Quiz completato!</h2>
      <div class="big-score"></div>
      <div class="message"></div>
    </div>

    <div class="score-bar">
      <div><span class="score" id="score">0 / 6</span></div>
      <div class="progress" id="progress">0 di 6 completate</div>
    </div>

    <script>QuizEngine.init(6);</script>
  `;

  const html = wrapQuiz("Sicurezza WiFi", body);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
