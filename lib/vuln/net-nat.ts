import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>NAT e PAT</h2>
      <p>
        Il NAT (Network Address Translation) permette ai dispositivi con indirizzi IP privati di accedere a Internet
        traducendo i loro indirizzi in uno o piu' indirizzi IP pubblici. E' una tecnologia fondamentale per la rete moderna.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">NAT Statico:</strong> Mappa un indirizzo IP privato a un indirizzo IP pubblico fisso, in modo permanente (relazione 1:1).</li>
        <li><strong style="color:#38bdf8;">NAT Dinamico:</strong> Assegna un indirizzo IP pubblico da un pool disponibile a un host privato quando necessario. La mappatura non e' fissa.</li>
        <li><strong style="color:#38bdf8;">PAT (Port Address Translation):</strong> Chiamato anche NAT Overload. Permette a molti dispositivi privati di condividere un singolo IP pubblico, distinguendoli tramite numeri di porta diversi.</li>
        <li><strong style="color:#38bdf8;">Port Forwarding:</strong> Regola NAT che inoltra il traffico in arrivo su una porta specifica dell'IP pubblico verso un server interno con IP privato.</li>
        <li><strong style="color:#38bdf8;">Indirizzi privati:</strong> Range riservati (RFC 1918) non instradabili su Internet: 10.0.0.0/8, 172.16.0.0/12 e 192.168.0.0/16.</li>
      </ul>
    </div>

    <!-- Q1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">1.</span> Qual e' la funzione principale del NAT?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'b',
          '',
          'Sbagliato. La crittografia del traffico e\\' compito di protocolli come TLS o IPsec. Il NAT traduce gli indirizzi IP privati in indirizzi pubblici per permettere l\\'accesso a Internet.')">
          <input type="radio" name="q1"> <span>Crittografare il traffico di rete</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'b',
          'Corretto! Il NAT traduce gli indirizzi IP privati (non instradabili su Internet) in indirizzi IP pubblici, permettendo ai dispositivi della rete locale di accedere a Internet. Il router NAT modifica gli header dei pacchetti in transito, sostituendo l\\'IP sorgente privato con quello pubblico.',
          '')">
          <input type="radio" name="q1"> <span>Tradurre indirizzi IP privati in pubblici</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'b',
          '',
          'Sbagliato. L\\'assegnazione automatica degli IP e\\' compito del DHCP. Il NAT traduce indirizzi IP privati in pubblici per permettere l\\'accesso a Internet.')">
          <input type="radio" name="q1"> <span>Assegnare indirizzi IP automaticamente</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1, 'd', 'b',
          '',
          'Sbagliato. Il filtraggio dei pacchetti e\\' compito del firewall. Il NAT si occupa di tradurre gli indirizzi IP privati in pubblici per l\\'accesso a Internet.')">
          <input type="radio" name="q1"> <span>Filtrare i pacchetti dannosi</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">2.</span> Qual e' la differenza tra NAT e PAT?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'c',
          '',
          'Sbagliato. Non e\\' una questione di velocita\\'. La differenza e\\' che il NAT traduce solo indirizzi IP, mentre il PAT (NAT Overload) usa anche i numeri di porta per permettere a piu\\' dispositivi di condividere un singolo IP pubblico.')">
          <input type="radio" name="q2"> <span>Il PAT e' piu' veloce del NAT</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'c',
          '',
          'Sbagliato. Entrambi operano sul router. La differenza e\\' che il NAT traduce solo indirizzi IP (mappatura 1:1 o da pool), mentre il PAT aggiunge la traduzione delle porte per condividere un singolo IP pubblico tra molti dispositivi.')">
          <input type="radio" name="q2"> <span>Il NAT opera sul router, il PAT sullo switch</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'c',
          'Corretto! Il NAT traduce solo gli indirizzi IP (un IP privato corrisponde a un IP pubblico). Il PAT (Port Address Translation), detto anche NAT Overload, aggiunge la traduzione delle porte: piu\\' dispositivi interni condividono lo stesso IP pubblico, ma ognuno usa un numero di porta sorgente diverso per distinguere le connessioni.',
          '')">
          <input type="radio" name="q2"> <span>Il NAT traduce solo IP, il PAT traduce anche le porte</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">3.</span> Quali sono i range di indirizzi IP privati definiti da RFC 1918?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'b',
          '',
          'Sbagliato. 8.8.8.0/24 e\\' un range pubblico (DNS di Google), non privato. I range privati RFC 1918 sono: 10.0.0.0/8, 172.16.0.0/12 (172.16.x.x - 172.31.x.x) e 192.168.0.0/16.')">
          <input type="radio" name="q3"> <span>8.8.8.0/24, 1.1.1.0/24, 192.168.0.0/16</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'b',
          'Corretto! I tre range privati RFC 1918 sono: 10.0.0.0/8 (10.0.0.0 - 10.255.255.255), 172.16.0.0/12 (172.16.0.0 - 172.31.255.255) e 192.168.0.0/16 (192.168.0.0 - 192.168.255.255). Questi indirizzi non vengono instradati su Internet e possono essere riutilizzati in qualsiasi rete privata.',
          '')">
          <input type="radio" name="q3"> <span>10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'b',
          '',
          'Sbagliato. 169.254.0.0/16 e\\' il range APIPA (link-local), non un range privato RFC 1918. I range privati corretti sono: 10.0.0.0/8, 172.16.0.0/12 e 192.168.0.0/16.')">
          <input type="radio" name="q3"> <span>169.254.0.0/16, 10.0.0.0/8, 192.168.0.0/16</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(3, 'd', 'b',
          '',
          'Sbagliato. 127.0.0.0/8 e\\' il range di loopback (localhost), non un range privato RFC 1918. I range privati corretti sono: 10.0.0.0/8, 172.16.0.0/12 e 192.168.0.0/16.')">
          <input type="radio" name="q3"> <span>127.0.0.0/8, 10.0.0.0/8, 192.168.0.0/16</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">4.</span> Perche' e' stato inventato il NAT?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'b',
          '',
          'Sbagliato. La velocita\\' non e\\' il motivo. Il NAT e\\' stato creato per risolvere il problema dell\\'esaurimento degli indirizzi IPv4: con soli 4,3 miliardi di indirizzi disponibili, il NAT permette a molte reti di riutilizzare gli stessi IP privati.')">
          <input type="radio" name="q4"> <span>Per aumentare la velocita' di Internet</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'b',
          'Corretto! Il NAT e\\' stato inventato per far fronte all\\'esaurimento degli indirizzi IPv4. Con soli circa 4,3 miliardi di indirizzi pubblici disponibili (insufficienti per tutti i dispositivi del mondo), il NAT permette a milioni di reti private di riutilizzare gli stessi range di IP interni, condividendo pochi indirizzi pubblici.',
          '')">
          <input type="radio" name="q4"> <span>Per l'esaurimento degli indirizzi IPv4</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'b',
          '',
          'Sbagliato. Sebbene il NAT offra un livello di protezione nascondendo gli IP interni, non e\\' stato inventato per sostituire i firewall. Il motivo principale e\\' l\\'esaurimento degli indirizzi IPv4.')">
          <input type="radio" name="q4"> <span>Per sostituire i firewall</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(4, 'd', 'b',
          '',
          'Sbagliato. Il supporto WiFi non c\\'entra con il NAT. Il NAT e\\' stato creato per risolvere la scarsita\\' di indirizzi IPv4, permettendo a piu\\' dispositivi di condividere pochi IP pubblici.')">
          <input type="radio" name="q4"> <span>Per supportare le reti WiFi</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">5.</span> Cos'e' il port forwarding?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'c',
          '',
          'Sbagliato. Il port forwarding non aumenta la velocita\\'. E\\' una regola NAT che inoltra il traffico in arrivo su una porta specifica dell\\'IP pubblico verso un server interno con IP privato.')">
          <input type="radio" name="q5"> <span>Una tecnica per velocizzare le porte dello switch</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'c',
          '',
          'Sbagliato. Il blocco delle porte e\\' compito del firewall. Il port forwarding e\\' una regola NAT che inoltra il traffico in arrivo su una porta dell\\'IP pubblico verso un server specifico nella rete interna.')">
          <input type="radio" name="q5"> <span>Il blocco di porte pericolose sul firewall</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'c',
          'Corretto! Il port forwarding e\\' una regola NAT configurata sul router che inoltra il traffico in arrivo su una porta specifica dell\\'IP pubblico verso un server interno con IP privato. Esempio: traffico sulla porta 80 dell\\'IP pubblico viene inoltrato al web server interno 192.168.1.10:80.',
          '')">
          <input type="radio" name="q5"> <span>Una regola NAT che inoltra traffico esterno a un server interno</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">6.</span> In un ufficio, 50 PC condividono un unico indirizzo IP pubblico per navigare su Internet. Quale tecnica viene usata?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'c',
          '',
          'Sbagliato. Il NAT statico mappa un IP privato a un IP pubblico in modo 1:1. Per 50 PC servirebbero 50 IP pubblici. La tecnica corretta e\\' il PAT (NAT Overload), che usa i numeri di porta per distinguere le connessioni.')">
          <input type="radio" name="q6"> <span>NAT statico</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'c',
          '',
          'Sbagliato. Il NAT dinamico assegna IP pubblici da un pool, ma serve comunque un IP pubblico per ogni connessione contemporanea. Per condividere un solo IP pubblico tra 50 PC serve il PAT.')">
          <input type="radio" name="q6"> <span>NAT dinamico</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'c',
          'Corretto! Il PAT (Port Address Translation), detto anche NAT Overload, permette a tutti i 50 PC di condividere un unico IP pubblico. Il router assegna un numero di porta sorgente diverso a ogni connessione, cosi\\' puo\\' distinguere il traffico di ritorno e inviarlo al PC giusto.',
          '')">
          <input type="radio" name="q6"> <span>PAT (NAT Overload)</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6, 'd', 'c',
          '',
          'Sbagliato. Il port forwarding serve per rendere raggiungibili server interni dall\\'esterno, non per condividere un IP pubblico tra piu\\' client. La tecnica corretta e\\' il PAT (NAT Overload).')">
          <input type="radio" name="q6"> <span>Port forwarding</span>
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

  const html = wrapQuiz("NAT e PAT", body);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
