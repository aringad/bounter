import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>Analisi Connessioni (netstat)</h2>
      <p>
        I comandi <code style="color:#38bdf8;">netstat</code> e <code style="color:#38bdf8;">ss</code> permettono
        di analizzare le connessioni di rete attive su un sistema. Saper leggere il loro output e comprendere
        gli stati delle connessioni TCP e' essenziale per il troubleshooting di rete e l'individuazione di attivita' sospette.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">LISTEN:</strong> Il processo e' in attesa di connessioni in ingresso su quella porta.</li>
        <li><strong style="color:#38bdf8;">ESTABLISHED:</strong> La connessione e' attiva e i dati possono essere scambiati in entrambe le direzioni.</li>
        <li><strong style="color:#38bdf8;">TIME_WAIT:</strong> La connessione e' stata chiusa ma il socket attende (circa 2 minuti) per gestire pacchetti ritardatari.</li>
        <li><strong style="color:#38bdf8;">CLOSE_WAIT:</strong> Il lato remoto ha chiuso la connessione (FIN ricevuto), ma l'applicazione locale deve ancora chiuderla.</li>
        <li><strong style="color:#38bdf8;">SYN_SENT:</strong> Il SYN e' stato inviato, in attesa del SYN-ACK. Molti SYN_SENT possono indicare problemi di rete o attacchi.</li>
      </ul>
    </div>

    <!-- Q1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">1.</span> Cosa significa lo stato LISTEN in una connessione TCP?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'b',
          '',
          'Sbagliato. Una connessione gia\\' stabilita e attiva sarebbe in stato ESTABLISHED, non LISTEN. Lo stato LISTEN indica che un processo e\\' in attesa di nuove connessioni in ingresso su quella porta.')">
          <input type="radio" name="q1"> <span>La connessione e' gia' stabilita e attiva</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'b',
          'Corretto! Lo stato LISTEN indica che un processo (come un web server, SSH daemon o database) ha aperto un socket ed e\\' in attesa di connessioni in ingresso su quella porta. E\\' lo stato normale per qualsiasi servizio di rete prima che i client si connettano.',
          '')">
          <input type="radio" name="q1"> <span>Un processo e' in attesa di connessioni in ingresso</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'b',
          '',
          'Sbagliato. Una connessione in fase di chiusura mostrerebbe stati come FIN_WAIT_1, FIN_WAIT_2, CLOSE_WAIT o TIME_WAIT. LISTEN indica che il server e\\' pronto ad accettare nuove connessioni.')">
          <input type="radio" name="q1"> <span>La connessione si sta chiudendo</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1, 'd', 'b',
          '',
          'Sbagliato. Un errore di connessione non produce lo stato LISTEN. LISTEN e\\' uno stato perfettamente normale che indica un servizio in ascolto e pronto a ricevere connessioni.')">
          <input type="radio" name="q1"> <span>C'e' un errore di connessione</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">2.</span> Vedi molte connessioni ESTABLISHED verso la porta 443. Cosa sta succedendo?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'a',
          'Corretto! La porta 443 e\\' HTTPS. Connessioni ESTABLISHED verso questa porta sono perfettamente normali: indicano che il sistema sta comunicando con server web tramite connessioni HTTPS sicure e crittografate (navigazione web, chiamate API, aggiornamenti software, ecc.).',
          '')">
          <input type="radio" name="q2"> <span>Normali connessioni HTTPS (navigazione web sicura)</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'a',
          '',
          'Sbagliato. Connessioni ESTABLISHED sulla porta 443 sono normali connessioni HTTPS. Un attacco DDoS mostrerebbe pattern diversi, come migliaia di connessioni SYN_SENT o connessioni da IP anomali. Il traffico HTTPS e\\' attivita\\' quotidiana.')">
          <input type="radio" name="q2"> <span>Un attacco DDoS in corso</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'a',
          '',
          'Sbagliato. La porta 443 e\\' HTTPS, non SSH (che usa la porta 22). Connessioni ESTABLISHED sulla porta 443 sono normali connessioni web sicure con crittografia TLS.')">
          <input type="radio" name="q2"> <span>Qualcuno sta tentando accesso SSH</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(2, 'd', 'a',
          '',
          'Sbagliato. Un errore DNS si manifesterebbe con problemi di risoluzione nomi sulla porta 53, non con connessioni ESTABLISHED sulla porta 443. Queste sono normali connessioni HTTPS.')">
          <input type="radio" name="q2"> <span>Un errore DNS</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">3.</span> Molte connessioni sono in stato SYN_SENT. Quale potrebbe essere il problema?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'b',
          '',
          'Sbagliato. Se tutto funzionasse correttamente, le connessioni passerebbero rapidamente da SYN_SENT a ESTABLISHED dopo il three-way handshake. Molte connessioni bloccate in SYN_SENT indicano che i SYN-ACK non arrivano.')">
          <input type="radio" name="q3"> <span>Tutto funziona correttamente</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'b',
          'Corretto! Molte connessioni in SYN_SENT significano che il sistema ha inviato pacchetti SYN ma non riceve risposte SYN-ACK. Questo puo\\' indicare: problemi di rete (firewall che blocca, server irraggiungibile, routing errato), oppure un SYN flood in uscita (possibile malware sul sistema). In ogni caso, e\\' una situazione anomala che richiede investigazione.',
          '')">
          <input type="radio" name="q3"> <span>Problema di rete o possibile SYN flood</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'b',
          '',
          'Sbagliato. L\\'esaurimento delle porte sarebbe improbabile dato che il sistema ha oltre 16000 porte effimere disponibili. SYN_SENT indica che il three-way handshake non si completa: il SYN e\\' stato inviato ma il SYN-ACK non arriva.')">
          <input type="radio" name="q3"> <span>Le porte di rete sono esaurite</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(3, 'd', 'b',
          '',
          'Sbagliato. Un aggiornamento DNS non causerebbe connessioni SYN_SENT. Lo stato SYN_SENT indica che il client non riceve risposta ai suoi SYN, suggerendo problemi di rete o un possibile attacco SYN flood in uscita.')">
          <input type="radio" name="q3"> <span>Il server DNS si sta aggiornando</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">4.</span> Le connessioni in CLOSE_WAIT continuano ad accumularsi. Qual e' il problema?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'b',
          '',
          'Sbagliato. La rete funziona correttamente: il lato remoto ha gia\\' chiuso la sua parte della connessione con successo inviando il FIN. Il problema e\\' locale: l\\'applicazione non chiama close() sui socket per completare la chiusura.')">
          <input type="radio" name="q4"> <span>La rete e' congestionata</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'b',
          'Corretto! CLOSE_WAIT significa che il lato remoto ha chiuso la connessione (ha inviato FIN e noi abbiamo risposto con ACK), ma l\\'applicazione locale non ha ancora chiuso il suo lato chiamando close() sul socket. Se si accumulano, l\\'applicazione ha un bug: non chiude i socket correttamente (resource leak). Questo puo\\' portare all\\'esaurimento dei file descriptor e al blocco del servizio.',
          '')">
          <input type="radio" name="q4"> <span>L'applicazione non chiude le connessioni correttamente</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'b',
          '',
          'Sbagliato. Il firewall non e\\' la causa dello stato CLOSE_WAIT. Questo stato indica che il FIN dal lato remoto e\\' gia\\' arrivato con successo, ma l\\'applicazione locale non sta chiudendo il suo lato della connessione. E\\' un problema applicativo.')">
          <input type="radio" name="q4"> <span>Il firewall blocca i pacchetti FIN</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(4, 'd', 'b',
          '',
          'Sbagliato. CLOSE_WAIT che si accumula non e\\' un comportamento normale. Indica un bug nell\\'applicazione che non chiude le connessioni dopo che il lato remoto le ha terminate. Nel tempo, questo porta all\\'esaurimento delle risorse di sistema.')">
          <input type="radio" name="q4"> <span>E' un comportamento normale del sistema operativo</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">5.</span> Nel comando <code>netstat -tlnp</code>, cosa mostra il flag <code>-l</code>?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'b',
          '',
          'Sbagliato. Tutte le connessioni (incluse ESTABLISHED, TIME_WAIT, SYN_SENT, ecc.) si vedono senza il flag -l oppure con il flag -a (all). Il flag -l filtra l\\'output mostrando solo i socket in stato LISTEN.')">
          <input type="radio" name="q5"> <span>Tutte le connessioni attive</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'b',
          'Corretto! Il flag -l (listening) mostra solo i socket in stato LISTEN, cioe\\' i servizi in attesa di connessioni in ingresso. Nel comando completo netstat -tlnp: -t filtra solo TCP, -l solo socket in ascolto, -n mostra numeri (senza risolvere nomi DNS), -p mostra il PID del processo. E\\' il modo piu\\' rapido per vedere quali servizi sono esposti sul sistema.',
          '')">
          <input type="radio" name="q5"> <span>Solo i socket in ascolto (LISTEN)</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'b',
          '',
          'Sbagliato. Il log delle connessioni recenti non e\\' una funzione standard di netstat. Il flag -l sta per listening e filtra l\\'output mostrando solo i socket in stato LISTEN.')">
          <input type="radio" name="q5"> <span>Il log delle connessioni recenti</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(5, 'd', 'b',
          '',
          'Sbagliato. Le statistiche di latenza non sono mostrate dal flag -l di netstat. Il flag -l (listening) filtra l\\'output per mostrare solo i socket in stato LISTEN, cioe\\' i servizi in ascolto.')">
          <input type="radio" name="q5"> <span>Le statistiche di latenza</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">6.</span> Vedi una connessione ESTABLISHED verso un IP sconosciuto sulla porta 4444. Devi preoccuparti?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'b',
          '',
          'Sbagliato. La porta 4444 non e\\' una porta standard per nessun servizio legittimo. E\\' invece notoriamente la porta di default usata da tool di penetration testing come Metasploit per le reverse shell. Una connessione ESTABLISHED verso un IP sconosciuto su questa porta richiede investigazione immediata.')">
          <input type="radio" name="q6"> <span>No, e' probabilmente traffico normale</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'b',
          'Corretto! Una connessione ESTABLISHED verso un IP sconosciuto sulla porta 4444 e\\' estremamente sospetta. La porta 4444 e\\' la porta di default usata da reverse shell e tool di attacco come Metasploit. Potrebbe indicare che il sistema e\\' compromesso e un attaccante ha accesso remoto. Azione immediata: identificare il processo con netstat -p o lsof, verificare l\\'IP di destinazione, e isolare il sistema dalla rete se confermata la compromissione.',
          '')">
          <input type="radio" name="q6"> <span>Si', potrebbe essere una reverse shell o backdoor</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'b',
          '',
          'Sbagliato. La porta 4444 non e\\' usata da DNS (che usa la porta 53). Una connessione attiva verso un IP sconosciuto sulla porta 4444 e\\' un forte indicatore di compromissione e va investigata immediatamente.')">
          <input type="radio" name="q6"> <span>E' una connessione DNS</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6, 'd', 'b',
          '',
          'Sbagliato. Non bisogna aspettare: la porta 4444 e\\' un indicatore classico di compromissione (reverse shell Metasploit). Ignorare questo segnale o aspettare potrebbe permettere a un attaccante di mantenere l\\'accesso al sistema, esfiltrare dati o espandere l\\'attacco.')">
          <input type="radio" name="q6"> <span>Solo se dura piu' di un'ora</span>
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

  const html = wrapQuiz("Analisi Connessioni (netstat)", body);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
