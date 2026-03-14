import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>Anatomia del Segmento TCP</h2>
      <p>
        Il segmento TCP e' l'unita' di dati del protocollo TCP. L'header TCP contiene campi fondamentali
        per gestire la connessione, il controllo di flusso e l'affidabilita' della comunicazione.
        Conoscere la struttura dell'header e' essenziale per analizzare il traffico di rete.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">Porte (16 bit ciascuna):</strong> Source Port e Destination Port identificano i processi mittente e destinatario.</li>
        <li><strong style="color:#38bdf8;">Sequence/ACK Number (32 bit):</strong> Numerano i byte nel flusso dati per ordinamento e conferma ricezione.</li>
        <li><strong style="color:#38bdf8;">Flag:</strong> SYN (sincronizzazione), ACK (conferma), FIN (chiusura), RST (reset), PSH (push immediato), URG (dati urgenti).</li>
        <li><strong style="color:#38bdf8;">Window Size (16 bit):</strong> Controlla il flusso indicando quanti byte il ricevente puo' accettare.</li>
        <li><strong style="color:#38bdf8;">Checksum (16 bit):</strong> Verifica l'integrita' dei dati trasmessi rilevando errori di trasmissione.</li>
      </ul>
    </div>

    <!-- Q1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">1.</span> Quanti bit sono riservati per la porta sorgente e la porta destinazione ciascuna?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'b',
          '',
          'Sbagliato. Con 8 bit si avrebbero solo 256 porte possibili (0-255), insufficienti per i servizi moderni. Ogni porta e\\' rappresentata da 16 bit, permettendo 65536 valori distinti (0-65535).')">
          <input type="radio" name="q1"> <span>8 bit</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'b',
          'Corretto! Sia la porta sorgente che la porta destinazione occupano 16 bit ciascuna nell\\'header TCP. Con 16 bit si possono rappresentare valori da 0 a 65535, che corrisponde esattamente al range completo di porte di rete disponibili.',
          '')">
          <input type="radio" name="q1"> <span>16 bit</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'b',
          '',
          'Sbagliato. 32 bit sono usati per il Sequence Number e l\\'Acknowledgment Number, non per le porte. Le porte usano 16 bit ciascuna.')">
          <input type="radio" name="q1"> <span>32 bit</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1, 'd', 'b',
          '',
          'Sbagliato. 64 bit sarebbero eccessivi per un numero di porta. Le porte TCP usano 16 bit ciascuna, sufficienti per coprire il range 0-65535.')">
          <input type="radio" name="q1"> <span>64 bit</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">2.</span> Cosa controlla il campo Window Size nell'header TCP?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'b',
          '',
          'Sbagliato. La dimensione massima dei pacchetti e\\' determinata dall\\'MTU (Maximum Transmission Unit) a livello di rete e dal MSS (Maximum Segment Size) nelle opzioni TCP. Il Window Size controlla il flusso dei dati.')">
          <input type="radio" name="q2"> <span>La dimensione massima dei pacchetti</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'b',
          'Corretto! Il Window Size implementa il controllo di flusso (flow control) di TCP. Indica quanti byte il ricevente e\\' disposto ad accettare nel suo buffer prima di richiedere un acknowledgment, evitando di sovraccaricare il destinatario con piu\\' dati di quanti possa elaborare.',
          '')">
          <input type="radio" name="q2"> <span>Il controllo di flusso: quanti dati inviare prima di un ACK</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'b',
          '',
          'Sbagliato. Il numero di connessioni simultanee non e\\' gestito dal Window Size ma dal sistema operativo. Il Window Size controlla quanti byte possono essere inviati prima di ricevere un acknowledgment (flow control).')">
          <input type="radio" name="q2"> <span>Il numero massimo di connessioni simultanee</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(2, 'd', 'b',
          '',
          'Sbagliato. La crittografia non e\\' gestita dall\\'header TCP ma da protocolli come TLS/SSL a livello superiore. Il Window Size controlla il flusso dei dati tra mittente e ricevente.')">
          <input type="radio" name="q2"> <span>Il livello di crittografia della connessione</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">3.</span> Quale flag TCP indica la presenza di dati urgenti?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'c',
          '',
          'Sbagliato. PSH (Push) indica che i dati devono essere consegnati immediatamente all\\'applicazione senza bufferizzazione, ma non segnala dati urgenti. Il flag per i dati urgenti e\\' URG.')">
          <input type="radio" name="q3"> <span>PSH</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'c',
          '',
          'Sbagliato. SYN e\\' usato per sincronizzare i sequence number durante l\\'apertura della connessione (three-way handshake). Il flag per i dati urgenti e\\' URG.')">
          <input type="radio" name="q3"> <span>SYN</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'c',
          'Corretto! Il flag URG (Urgent) segnala che il segmento contiene dati urgenti che devono essere elaborati con priorita\\'. Quando URG e\\' attivo, il campo Urgent Pointer nell\\'header indica dove finiscono i dati urgenti all\\'interno del segmento.',
          '')">
          <input type="radio" name="q3"> <span>URG</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(3, 'd', 'c',
          '',
          'Sbagliato. RST (Reset) serve per interrompere forzatamente una connessione in modo anomalo, non per indicare dati urgenti. Il flag corretto e\\' URG.')">
          <input type="radio" name="q3"> <span>RST</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">4.</span> A cosa serve il flag PSH (Push)?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'a',
          'Corretto! Il flag PSH indica che i dati devono essere consegnati immediatamente all\\'applicazione destinataria senza attendere che il buffer si riempia. E\\' comunemente usato nelle sessioni interattive come SSH o Telnet, dove ogni carattere digitato deve arrivare subito al destinatario.',
          '')">
          <input type="radio" name="q4"> <span>Consegnare i dati immediatamente all'applicazione senza bufferizzare</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'a',
          '',
          'Sbagliato. La chiusura della connessione e\\' gestita dal flag FIN (chiusura normale) o RST (chiusura forzata), non da PSH. Il flag PSH forza la consegna immediata dei dati all\\'applicazione.')">
          <input type="radio" name="q4"> <span>Chiudere la connessione</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'a',
          '',
          'Sbagliato. La ritrasmissione e\\' gestita automaticamente da TCP quando non riceve un ACK entro il timeout, non dal flag PSH. PSH serve per consegnare i dati immediatamente all\\'applicazione.')">
          <input type="radio" name="q4"> <span>Ritrasmettere pacchetti persi</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(4, 'd', 'a',
          '',
          'Sbagliato. L\\'aumento della finestra di ricezione e\\' gestito dal campo Window Size stesso, non dal flag PSH. PSH forza lo stack TCP a consegnare subito i dati all\\'applicazione.')">
          <input type="radio" name="q4"> <span>Aumentare la dimensione della finestra</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">5.</span> Il campo checksum nell'header TCP garantisce cosa?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'b',
          '',
          'Sbagliato. La crittografia dei dati non e\\' compito del checksum TCP ma di protocolli come TLS/SSL. Il checksum verifica solo l\\'integrita\\' dei dati, cioe\\' che non siano stati corrotti durante il trasporto.')">
          <input type="radio" name="q5"> <span>La crittografia dei dati</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'b',
          'Corretto! Il checksum TCP verifica l\\'integrita\\' dei dati: il mittente calcola un valore di controllo sull\\'header e i dati, e il ricevente ricalcola lo stesso valore. Se i due non corrispondono, il segmento e\\' stato corrotto durante il trasporto e viene scartato.',
          '')">
          <input type="radio" name="q5"> <span>L'integrita' dei dati (che non siano stati corrotti)</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'b',
          '',
          'Sbagliato. La velocita\\' di trasmissione non e\\' influenzata dal checksum. Il checksum serve esclusivamente a verificare che i dati non siano stati corrotti durante il trasporto sulla rete.')">
          <input type="radio" name="q5"> <span>La velocita' di trasmissione</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(5, 'd', 'b',
          '',
          'Sbagliato. L\\'autenticazione del mittente non e\\' gestita dal checksum TCP. Il checksum verifica solo l\\'integrita\\' dei dati, non l\\'identita\\' di chi li ha inviati. Per l\\'autenticazione servono protocolli come TLS.')">
          <input type="radio" name="q5"> <span>L'autenticazione del mittente</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">6.</span> Qual e' la dimensione minima totale dell'header TCP (senza opzioni)?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'b',
          '',
          'Sbagliato. 8 byte e\\' la dimensione dell\\'header UDP, non TCP. L\\'header TCP minimo e\\' di 20 byte, poiche\\' contiene molti piu\\' campi: porte, sequence number, ack number, flag, window size, checksum e urgent pointer.')">
          <input type="radio" name="q6"> <span>8 byte</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'b',
          'Corretto! L\\'header TCP minimo e\\' di 20 byte (160 bit), composti da: porta sorgente (2 byte), porta destinazione (2 byte), sequence number (4 byte), ack number (4 byte), data offset + flag (2 byte), window size (2 byte), checksum (2 byte), urgent pointer (2 byte). Le opzioni TCP possono estendere l\\'header fino a 60 byte.',
          '')">
          <input type="radio" name="q6"> <span>20 byte</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'b',
          '',
          'Sbagliato. 32 byte supera la dimensione minima dell\\'header TCP. Senza opzioni, l\\'header TCP e\\' esattamente 20 byte. Con le opzioni puo\\' arrivare fino a un massimo di 60 byte.')">
          <input type="radio" name="q6"> <span>32 byte</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6, 'd', 'b',
          '',
          'Sbagliato. 64 byte e\\' molto di piu\\' dell\\'header TCP. La dimensione minima e\\' 20 byte senza opzioni, con un massimo di 60 byte quando tutte le opzioni sono incluse.')">
          <input type="radio" name="q6"> <span>64 byte</span>
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

  const html = wrapQuiz("Anatomia del Segmento TCP", body);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
