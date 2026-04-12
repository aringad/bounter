import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>Three-Way Handshake</h2>
      <p>
        Il TCP stabilisce una connessione affidabile attraverso il <strong>three-way handshake</strong>,
        un processo in tre passaggi che garantisce che entrambi i lati siano pronti a comunicare.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">1. SYN:</strong> Il client invia un pacchetto SYN con un sequence number iniziale (es. seq=100) per richiedere una connessione.</li>
        <li><strong style="color:#38bdf8;">2. SYN-ACK:</strong> Il server risponde con SYN-ACK, confermando la ricezione (ack=101) e proponendo il proprio sequence number.</li>
        <li><strong style="color:#38bdf8;">3. ACK:</strong> Il client conferma con un ACK. La connessione e' ora ESTABLISHED e i dati possono fluire.</li>
        <li><strong style="color:#38bdf8;">Chiusura:</strong> La connessione si chiude con un four-way handshake: FIN → ACK → FIN → ACK, dove ciascun lato chiude la propria direzione.</li>
      </ul>
    </div>

    <!-- Q1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">1.</span> Chi inizia il three-way handshake?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'c',
          '',
          'Sbagliato. Il server non inizia la connessione: resta in ascolto (LISTEN) e risponde al SYN del client con un SYN-ACK.')">
          <input type="radio" name="q1"> <span>Il server con un pacchetto SYN-ACK</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'c',
          '',
          'Sbagliato. L\\'ACK e\\' il terzo passaggio, non il primo. Il handshake inizia sempre con un SYN dal client.')">
          <input type="radio" name="q1"> <span>Il client con un pacchetto ACK</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'c',
          'Corretto! Il client avvia la connessione inviando un pacchetto SYN al server con il proprio sequence number iniziale.',
          '')">
          <input type="radio" name="q1"> <span>Il client con un pacchetto SYN</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1, 'd', 'c',
          '',
          'Sbagliato. Il router instrada i pacchetti ma non partecipa al three-way handshake. La connessione e\\' tra client e server.')">
          <input type="radio" name="q1"> <span>Il router</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">2.</span> Cosa risponde il server al SYN del client?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'd',
          '',
          'Sbagliato. Un semplice ACK non basta: il server deve anche proporre il proprio sequence number. Per questo invia un SYN-ACK.')">
          <input type="radio" name="q2"> <span>ACK (solo conferma)</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'd',
          '',
          'Sbagliato. Il RST resetta la connessione. Per accettare una nuova connessione, il server risponde con SYN-ACK.')">
          <input type="radio" name="q2"> <span>RST (reset)</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'd',
          '',
          'Sbagliato. Il FIN serve per chiudere una connessione, non per stabilirla. Il server risponde con SYN-ACK.')">
          <input type="radio" name="q2"> <span>FIN (chiusura)</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(2, 'd', 'd',
          'Corretto! Il server risponde con SYN-ACK: conferma la ricezione del SYN del client (ACK) e contemporaneamente propone il proprio sequence number (SYN).',
          '')">
          <input type="radio" name="q2"> <span>SYN-ACK (conferma e propone il suo sequence number)</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">3.</span> Il client invia SYN con seq=100. Il server risponde con SYN-ACK ack=??</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'a',
          'Corretto! L\\'acknowledgment number e\\' sempre il sequence number ricevuto + 1. Il server conferma di aver ricevuto il SYN (seq=100) rispondendo con ack=101, indicando che si aspetta il byte 101 come prossimo.',
          '')">
          <input type="radio" name="q3"> <span>101</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'a',
          '',
          'Sbagliato. L\\'acknowledgment number non e\\' uguale al sequence number ricevuto. Il server risponde con ack = seq del client + 1, cioe\\' 101.')">
          <input type="radio" name="q3"> <span>100</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'a',
          '',
          'Sbagliato. L\\'ack non e\\' il doppio del seq. La regola e\\' semplice: ack = seq + 1, quindi 101.')">
          <input type="radio" name="q3"> <span>200</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(3, 'd', 'a',
          '',
          'Sbagliato. L\\'ack non parte da 0. Il server risponde con ack = seq del client + 1 = 101.')">
          <input type="radio" name="q3"> <span>0</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">4.</span> Dopo il three-way handshake, la connessione e' in stato?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'b',
          '',
          'Sbagliato. SYN_SENT e\\' lo stato del client dopo aver inviato il SYN, prima di ricevere il SYN-ACK. Dopo il handshake completo lo stato e\\' ESTABLISHED.')">
          <input type="radio" name="q4"> <span>SYN_SENT</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'b',
          'Corretto! Dopo il completamento del three-way handshake (SYN → SYN-ACK → ACK), entrambi i lati entrano nello stato ESTABLISHED e possono scambiarsi dati.',
          '')">
          <input type="radio" name="q4"> <span>ESTABLISHED</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'b',
          '',
          'Sbagliato. LISTEN e\\' lo stato iniziale del server in attesa di connessioni. Dopo il handshake completo lo stato diventa ESTABLISHED.')">
          <input type="radio" name="q4"> <span>LISTEN</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(4, 'd', 'b',
          '',
          'Sbagliato. TIME_WAIT e\\' lo stato dopo la chiusura della connessione, non dopo l\\'apertura. Lo stato corretto e\\' ESTABLISHED.')">
          <input type="radio" name="q4"> <span>TIME_WAIT</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">5.</span> Come si chiude una connessione TCP?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'd',
          '',
          'Sbagliato. La connessione non scade da sola. Deve essere chiusa esplicitamente con un four-way handshake (FIN → ACK → FIN → ACK).')">
          <input type="radio" name="q5"> <span>La connessione scade automaticamente dopo un timeout</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'd',
          '',
          'Sbagliato. Il RST chiude la connessione in modo forzato (anomalo). La chiusura normale usa un four-way handshake con FIN e ACK.')">
          <input type="radio" name="q5"> <span>Un singolo pacchetto RST</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'd',
          '',
          'Sbagliato. Un singolo FIN chiude solo una direzione. Servono due FIN e due ACK (four-way handshake) per chiudere entrambe le direzioni.')">
          <input type="radio" name="q5"> <span>Un singolo pacchetto FIN</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(5, 'd', 'd',
          'Corretto! La chiusura TCP e\\' un four-way handshake: il primo lato invia FIN, l\\'altro conferma con ACK, poi invia il suo FIN, e il primo conferma con ACK. Ogni direzione viene chiusa separatamente.',
          '')">
          <input type="radio" name="q5"> <span>Four-way: FIN → ACK → FIN → ACK</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">6.</span> Cosa succede se il server non risponde al SYN?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'a',
          'Corretto! Il client ritrasmette il SYN diverse volte (SYN retransmission) con intervalli crescenti (backoff esponenziale). Se non riceve risposta entro un certo tempo, la connessione va in timeout e fallisce.',
          '')">
          <input type="radio" name="q6"> <span>Il client riprova (SYN retransmission) e poi va in timeout</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'a',
          '',
          'Sbagliato. La connessione non si stabilisce immediatamente senza risposta. Il client riprova piu\\' volte prima di arrendersi.')">
          <input type="radio" name="q6"> <span>La connessione si stabilisce comunque</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'a',
          '',
          'Sbagliato. Il client non passa a UDP automaticamente. Riprova con SYN e, se non riceve risposta, va in timeout.')">
          <input type="radio" name="q6"> <span>Il client passa automaticamente a UDP</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6, 'd', 'a',
          '',
          'Sbagliato. Il client non invia un RST in questo caso. Riprova il SYN diverse volte e poi va in timeout.')">
          <input type="radio" name="q6"> <span>Il client invia un RST</span>
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

  const html = wrapQuiz("Three-Way Handshake", body);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
