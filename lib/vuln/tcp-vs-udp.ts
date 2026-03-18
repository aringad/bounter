import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>TCP vs UDP</h2>
      <p>
        TCP e UDP sono i due principali protocolli di trasporto della suite TCP/IP.
        <strong>TCP</strong> (Transmission Control Protocol) e' orientato alla connessione: garantisce
        consegna affidabile e ordinata dei dati tramite handshake, acknowledgment e ritrasmissione.
        <strong>UDP</strong> (User Datagram Protocol) e' senza connessione: non offre garanzie di consegna
        ne' di ordine, ma e' veloce e con basso overhead, ideale per applicazioni real-time.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">TCP:</strong> Affidabile, ordinato, con controllo di flusso e congestione. Header minimo di 20 byte. Usato per web, email, file transfer.</li>
        <li><strong style="color:#38bdf8;">UDP:</strong> Veloce, senza connessione, nessuna garanzia di consegna. Header di soli 8 byte. Usato per streaming, VoIP, gaming, DNS.</li>
        <li><strong style="color:#38bdf8;">Connessione:</strong> TCP richiede il three-way handshake prima di scambiare dati. UDP invia subito senza setup.</li>
        <li><strong style="color:#38bdf8;">Scelta:</strong> TCP quando serve affidabilita', UDP quando serve velocita' e la perdita di qualche pacchetto e' accettabile.</li>
      </ul>
    </div>

    <!-- Q1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">1.</span> Quale protocollo e' orientato alla connessione?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'a',
          'Corretto! TCP e\\' orientato alla connessione: prima di scambiare dati, stabilisce una connessione con il three-way handshake (SYN, SYN-ACK, ACK), garantendo che entrambi i lati siano pronti a comunicare.',
          '')">
          <input type="radio" name="q1"> <span>TCP</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'a',
          '',
          'Sbagliato. UDP e\\' senza connessione (connectionless): invia i datagrammi senza stabilire una connessione preliminare. Il protocollo orientato alla connessione e\\' TCP.')">
          <input type="radio" name="q1"> <span>UDP</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'a',
          '',
          'Sbagliato. ICMP e\\' un protocollo di servizio usato da ping e traceroute, non un protocollo di trasporto orientato alla connessione. La risposta corretta e\\' TCP.')">
          <input type="radio" name="q1"> <span>ICMP</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1, 'd', 'a',
          '',
          'Sbagliato. Solo TCP e\\' orientato alla connessione. UDP invia pacchetti senza stabilire una connessione e senza garanzie di consegna.')">
          <input type="radio" name="q1"> <span>Entrambi TCP e UDP</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">2.</span> Lo streaming video in tempo reale utilizza tipicamente quale protocollo?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'b',
          '',
          'Sbagliato. TCP garantisce la consegna di ogni pacchetto, ma questo causa ritardi per le ritrasmissioni. Nello streaming live, un frame perso e\\' preferibile a un ritardo: per questo si usa UDP.')">
          <input type="radio" name="q2"> <span>TCP</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'b',
          'Corretto! Lo streaming video in tempo reale usa UDP perche\\' la velocita\\' e\\' piu\\' importante della consegna perfetta. Un frame perso causa un breve artefatto visivo, ma ritrasmettere quel frame in ritardo sarebbe inutile e causerebbe buffering e lag.',
          '')">
          <input type="radio" name="q2"> <span>UDP</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'b',
          '',
          'Sbagliato. HTTP e\\' un protocollo applicativo che si appoggia su TCP. Lo streaming video real-time preferisce UDP per la sua bassa latenza e tolleranza alla perdita di pacchetti.')">
          <input type="radio" name="q2"> <span>HTTP</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">3.</span> Quale protocollo garantisce l'ordine di consegna dei dati?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'a',
          'Corretto! TCP usa i sequence number per riordinare i segmenti e consegnarli all\\'applicazione nell\\'ordine corretto, anche se i pacchetti arrivano in ordine diverso sulla rete.',
          '')">
          <input type="radio" name="q3"> <span>TCP</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'a',
          '',
          'Sbagliato. UDP non garantisce l\\'ordine: i datagrammi possono arrivare in qualsiasi sequenza e l\\'applicazione deve gestire il riordino se necessario. E\\' TCP che garantisce l\\'ordine tramite i sequence number.')">
          <input type="radio" name="q3"> <span>UDP</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'a',
          '',
          'Sbagliato. IP (Internet Protocol) e\\' il protocollo di rete che instrada i pacchetti, ma non garantisce ordine ne\\' consegna. E\\' TCP, al livello di trasporto, che garantisce l\\'ordine.')">
          <input type="radio" name="q3"> <span>IP</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(3, 'd', 'a',
          '',
          'Sbagliato. TCP garantisce eccome l\\'ordine di consegna! E\\' una delle sue caratteristiche fondamentali, implementata tramite i sequence number nell\\'header.')">
          <input type="radio" name="q3"> <span>Nessuno dei due</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">4.</span> Perche' UDP e' preferito per il VoIP (Voice over IP)?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'b',
          '',
          'Sbagliato. UDP non e\\' piu\\' sicuro di TCP. La scelta di UDP per il VoIP e\\' legata alla bassa latenza: ritrasmettere un pacchetto vocale in ritardo non ha senso in una conversazione in tempo reale.')">
          <input type="radio" name="q4"> <span>Perche' e' piu' sicuro di TCP</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'b',
          'Corretto! UDP ha una latenza molto bassa perche\\' non richiede handshake ne\\' ritrasmissioni. Nel VoIP, ritrasmettere un pacchetto vocale perso sarebbe inutile: arriverebbe troppo tardi per la conversazione. Meglio perdere qualche millisecondo di audio che avere ritardi e interruzioni.',
          '')">
          <input type="radio" name="q4"> <span>Ha latenza inferiore e la ritrasmissione non serve in tempo reale</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'b',
          '',
          'Sbagliato. UDP non garantisce la consegna dei pacchetti, e\\' proprio l\\'opposto! La ragione per cui e\\' usato nel VoIP e\\' la bassa latenza: in una chiamata vocale, la velocita\\' conta piu\\' della perfezione.')">
          <input type="radio" name="q4"> <span>Perche' garantisce la consegna di ogni pacchetto vocale</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(4, 'd', 'b',
          '',
          'Sbagliato. UDP non cripta i dati (la crittografia e\\' gestita da protocolli come SRTP). UDP e\\' scelto per il VoIP per la sua bassa latenza e l\\'assenza di ritrasmissioni inutili nel contesto real-time.')">
          <input type="radio" name="q4"> <span>Perche' cripta automaticamente i dati vocali</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">5.</span> HTTPS tradizionale (HTTP/1.1 e HTTP/2) utilizza quale protocollo di trasporto?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'a',
          'Corretto! HTTPS (HTTP Secure) si appoggia su TCP porta 443. TCP garantisce che tutti i dati della pagina web arrivino completi e nell\\'ordine corretto, requisito fondamentale per il trasferimento di contenuti web e la negoziazione TLS.',
          '')">
          <input type="radio" name="q5"> <span>TCP</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'a',
          '',
          'Sbagliato. HTTPS richiede una connessione affidabile e ordinata per la negoziazione TLS e il trasferimento dati integro. Per questo usa TCP, non UDP.')">
          <input type="radio" name="q5"> <span>UDP</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'a',
          '',
          'Sbagliato. HTTPS tradizionale non usa entrambi contemporaneamente. Si appoggia su TCP per la sua affidabilita\\'. (Nota: HTTP/3 usa QUIC su UDP, ma HTTPS standard usa TCP.)')">
          <input type="radio" name="q5"> <span>Entrambi TCP e UDP</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">6.</span> Quale protocollo ha un overhead (sovraccarico) inferiore?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'b',
          '',
          'Sbagliato. TCP ha un header minimo di 20 byte e include meccanismi come acknowledgment, controllo di flusso, ritrasmissione e gestione della congestione che aggiungono overhead significativo. UDP ha un header di soli 8 byte.')">
          <input type="radio" name="q6"> <span>TCP</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'b',
          'Corretto! UDP ha un overhead molto inferiore rispetto a TCP. L\\'header UDP e\\' di soli 8 byte (porta sorgente, porta destinazione, lunghezza, checksum) contro i 20+ byte di TCP. Inoltre, UDP non ha handshake, acknowledgment ne\\' ritrasmissioni, riducendo drasticamente il traffico di controllo.',
          '')">
          <input type="radio" name="q6"> <span>UDP</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'b',
          '',
          'Sbagliato. L\\'overhead non e\\' uguale: TCP ha un header di 20+ byte con molti campi di controllo e meccanismi aggiuntivi, mentre UDP ha un header di soli 8 byte. UDP ha un overhead significativamente inferiore.')">
          <input type="radio" name="q6"> <span>Hanno lo stesso overhead</span>
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

  const html = wrapQuiz("TCP vs UDP", body);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
