import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>Subnetting IPv4</h2>
      <p>
        Il subnetting e' la tecnica di suddividere una rete IP in sottoreti piu' piccole.
        Ogni sottorete ha un indirizzo di rete, un indirizzo di broadcast e un intervallo di indirizzi host utilizzabili.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">Subnet Mask:</strong> Una maschera a 32 bit che separa la parte di rete dalla parte host di un indirizzo IP (es. 255.255.255.0).</li>
        <li><strong style="color:#38bdf8;">Notazione CIDR:</strong> Indica quanti bit sono dedicati alla rete. Es. /24 significa che i primi 24 bit identificano la rete.</li>
        <li><strong style="color:#38bdf8;">Indirizzo di rete:</strong> Il primo indirizzo della sottorete, con tutti i bit host a 0. Identifica la sottorete stessa.</li>
        <li><strong style="color:#38bdf8;">Indirizzo di broadcast:</strong> L\\'ultimo indirizzo della sottorete, con tutti i bit host a 1. Usato per inviare pacchetti a tutti gli host della sottorete.</li>
        <li><strong style="color:#38bdf8;">Host utilizzabili:</strong> Tutti gli indirizzi tra il network address e il broadcast address. Formula: 2^(bit host) - 2.</li>
      </ul>
    </div>

    <!-- Q1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">1.</span> Data la rete 192.168.1.0/24, qual e' la subnet mask?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'a',
          'Corretto! /24 significa che i primi 24 bit (3 ottetti) sono dedicati alla rete, quindi la maschera e\\' 255.255.255.0. Ogni ottetto a 1 vale 255, l\\'ultimo ottetto a 0 e\\' riservato agli host.',
          '')">
          <input type="radio" name="q1"> <span>255.255.255.0</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'a',
          '',
          'Sbagliato. 255.255.0.0 corrisponde a /16, non a /24. Con /24 i primi 3 ottetti sono tutti a 1, quindi la maschera corretta e\\' 255.255.255.0.')">
          <input type="radio" name="q1"> <span>255.255.0.0</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'a',
          '',
          'Sbagliato. 255.0.0.0 corrisponde a /8, non a /24. Con /24 i primi 24 bit sono dedicati alla rete, quindi la maschera corretta e\\' 255.255.255.0.')">
          <input type="radio" name="q1"> <span>255.0.0.0</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1, 'd', 'a',
          '',
          'Sbagliato. 255.255.255.128 corrisponde a /25, non a /24. Con /24 l\\'ultimo ottetto e\\' interamente dedicato agli host, quindi la maschera corretta e\\' 255.255.255.0.')">
          <input type="radio" name="q1"> <span>255.255.255.128</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">2.</span> Quanti indirizzi host utilizzabili ha la rete 10.0.0.0/8?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'c',
          '',
          'Sbagliato. 256 sarebbe il numero totale di indirizzi in un /24, non in un /8. Con /8 si hanno 24 bit per gli host: 2^24 - 2 = 16.777.214 indirizzi utilizzabili.')">
          <input type="radio" name="q2"> <span>256</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'c',
          '',
          'Sbagliato. 65.534 sarebbe il numero di host in un /16 (2^16 - 2). Con /8 si hanno 24 bit host: 2^24 - 2 = 16.777.214 indirizzi utilizzabili.')">
          <input type="radio" name="q2"> <span>65.534</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'c',
          'Corretto! Con /8, i bit dedicati agli host sono 32 - 8 = 24. Il numero di host utilizzabili e\\' 2^24 - 2 = 16.777.214. Si sottraggono 2 perche\\' il primo indirizzo e\\' il network address e l\\'ultimo e\\' il broadcast.',
          '')">
          <input type="radio" name="q2"> <span>16.777.214</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(2, 'd', 'c',
          '',
          'Sbagliato. 16.777.216 e\\' il numero totale di indirizzi (2^24), ma bisogna sottrarre 2 (network e broadcast). Gli host utilizzabili sono 16.777.214.')">
          <input type="radio" name="q2"> <span>16.777.216</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">3.</span> Qual e' l'indirizzo di broadcast della rete 192.168.10.0/24?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'c',
          '',
          'Sbagliato. 192.168.10.0 e\\' l\\'indirizzo di rete (network address), non il broadcast. L\\'indirizzo di broadcast si ottiene impostando tutti i bit host a 1: 192.168.10.255.')">
          <input type="radio" name="q3"> <span>192.168.10.0</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'c',
          '',
          'Sbagliato. 192.168.10.1 e\\' il primo indirizzo host utilizzabile, non il broadcast. L\\'indirizzo di broadcast e\\' l\\'ultimo della sottorete: 192.168.10.255.')">
          <input type="radio" name="q3"> <span>192.168.10.1</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'c',
          'Corretto! In una rete /24, l\\'indirizzo di broadcast si ottiene impostando tutti i bit host (gli ultimi 8 bit) a 1, ottenendo 192.168.10.255. Questo indirizzo viene usato per inviare pacchetti a tutti gli host della sottorete.',
          '')">
          <input type="radio" name="q3"> <span>192.168.10.255</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(3, 'd', 'c',
          '',
          'Sbagliato. 192.168.10.254 e\\' l\\'ultimo indirizzo host utilizzabile, non il broadcast. L\\'indirizzo di broadcast e\\' 192.168.10.255, dove tutti i bit host sono a 1.')">
          <input type="radio" name="q3"> <span>192.168.10.254</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">4.</span> L'host 172.16.5.130 ha subnet mask /25. Qual e' il suo indirizzo di rete?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'b',
          '',
          'Sbagliato. 172.16.5.0 sarebbe il network address se la maschera fosse /24. Con /25 il primo bit dell\\'ultimo ottetto fa parte della rete: 130 in binario e\\' 10000010, quindi il network address e\\' 172.16.5.128.')">
          <input type="radio" name="q4"> <span>172.16.5.0</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'b',
          'Corretto! Con /25 la subnet mask e\\' 255.255.255.128. L\\'ultimo ottetto si divide: il primo bit identifica la sottorete. 130 in binario e\\' 10000010: il bit di sottorete e\\' 1, quindi il network address e\\' 172.16.5.128 (intervallo 128-255).',
          '')">
          <input type="radio" name="q4"> <span>172.16.5.128</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'b',
          '',
          'Sbagliato. 172.16.5.64 sarebbe un network address valido per una /26, non per una /25. Con /25 le due sottoreti sono .0-.127 e .128-.255. L\\'host 130 appartiene alla seconda: 172.16.5.128.')">
          <input type="radio" name="q4"> <span>172.16.5.64</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(4, 'd', 'b',
          '',
          'Sbagliato. 172.16.5.192 sarebbe un network address per una /26, non per una /25. Con /25 le sottoreti sono .0-.127 e .128-.255. L\\'indirizzo 130 cade nella seconda: 172.16.5.128.')">
          <input type="radio" name="q4"> <span>172.16.5.192</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">5.</span> Una sottorete /28 quanti host utilizzabili ha?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'b',
          '',
          'Sbagliato. 16 e\\' il numero totale di indirizzi in una /28 (2^4 = 16), ma bisogna sottrarre 2 per network e broadcast. Gli host utilizzabili sono 14.')">
          <input type="radio" name="q5"> <span>16</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'b',
          'Corretto! Con /28 restano 32 - 28 = 4 bit per gli host. Il numero di host utilizzabili e\\' 2^4 - 2 = 14. Si sottraggono sempre 2 per l\\'indirizzo di rete e quello di broadcast.',
          '')">
          <input type="radio" name="q5"> <span>14</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'b',
          '',
          'Sbagliato. 30 sarebbe il numero di host in una /27 (2^5 - 2). Con /28 si hanno solo 4 bit host: 2^4 - 2 = 14 host utilizzabili.')">
          <input type="radio" name="q5"> <span>30</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(5, 'd', 'b',
          '',
          'Sbagliato. 8 non corrisponde a nessun calcolo di subnetting standard. Con /28 si hanno 4 bit host e gli host utilizzabili sono 2^4 - 2 = 14.')">
          <input type="radio" name="q5"> <span>8</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">6.</span> Cosa significa la notazione CIDR /16?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'b',
          '',
          'Sbagliato. La notazione CIDR indica i bit di rete, non il numero di host. /16 significa che i primi 16 bit dell\\'indirizzo identificano la rete.')">
          <input type="radio" name="q6"> <span>La rete ha 16 host</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'b',
          'Corretto! La notazione CIDR /16 indica che i primi 16 bit dell\\'indirizzo IP (i primi 2 ottetti) sono dedicati alla parte di rete. I restanti 16 bit sono per gli host, permettendo fino a 65.534 host utilizzabili (2^16 - 2).',
          '')">
          <input type="radio" name="q6"> <span>I primi 16 bit sono dedicati alla rete</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'b',
          '',
          'Sbagliato. /16 non indica 16 sottoreti. Il numero dopo lo slash indica quanti bit sono riservati alla parte di rete dell\\'indirizzo IP. /16 significa che i primi 16 bit identificano la rete.')">
          <input type="radio" name="q6"> <span>La rete e' divisa in 16 sottoreti</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6, 'd', 'b',
          '',
          'Sbagliato. I bit host in un /16 sono 32 - 16 = 16, non 16 bit di rete usati per gli host. /16 significa che i primi 16 bit sono la parte di rete e i restanti 16 sono per gli host.')">
          <input type="radio" name="q6"> <span>Ci sono 16 bit riservati agli host</span>
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

  const html = wrapQuiz("Subnetting IPv4", body);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
