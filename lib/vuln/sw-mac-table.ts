import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>Switch e MAC Table</h2>
      <p>
        Lo switch e' il cuore di ogni LAN moderna. Opera a Layer 2 e usa la tabella MAC (CAM table)
        per inoltrare i frame in modo intelligente. Capire come funziona il processo di learning,
        forwarding e flooding e' essenziale per gestire reti efficienti.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">MAC Address Table (CAM Table):</strong> Tabella che associa ogni indirizzo MAC alla porta fisica dello switch, costruita dinamicamente osservando il traffico.</li>
        <li><strong style="color:#38bdf8;">Learning:</strong> Quando lo switch riceve un frame, registra il MAC sorgente e la porta di ingresso nella tabella MAC.</li>
        <li><strong style="color:#38bdf8;">Forwarding:</strong> Se il MAC di destinazione e' in tabella, il frame viene inoltrato solo alla porta corretta.</li>
        <li><strong style="color:#38bdf8;">Flooding:</strong> Se il MAC di destinazione e' sconosciuto, il frame viene inviato a tutte le porte tranne quella sorgente.</li>
        <li><strong style="color:#38bdf8;">Dominio di collisione:</strong> Ogni porta dello switch crea un dominio di collisione separato, a differenza dell'hub.</li>
      </ul>
    </div>

    <!-- Q1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">1.</span> Uno switch riceve un frame con un MAC di destinazione che non e' nella sua tabella MAC. Cosa fa?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'b',
          '',
          'Sbagliato. Lo switch non scarta mai un frame con destinazione sconosciuta. Lo inoltra a tutte le porte (flooding) per assicurarsi che raggiunga il destinatario.')">
          <input type="radio" name="q1"> <span>Scarta il frame</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'b',
          'Corretto! Quando il MAC di destinazione non e\\' in tabella, lo switch esegue il flooding: invia il frame a tutte le porte tranne quella da cui l\\'ha ricevuto. Quando il destinatario risponde, lo switch impara il suo MAC e la porta.',
          '')">
          <input type="radio" name="q1"> <span>Flooding: invia il frame a tutte le porte tranne quella sorgente</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'b',
          '',
          'Sbagliato. Lo switch non invia richieste ARP in questo caso. Il flooding e\\' il meccanismo usato per frame con MAC di destinazione sconosciuto.')">
          <input type="radio" name="q1"> <span>Invia una richiesta ARP per trovare il destinatario</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1, 'd', 'b',
          '',
          'Sbagliato. Lo switch non lo invia al router. Esegue il flooding a tutte le porte locali per trovare il destinatario nella LAN.')">
          <input type="radio" name="q1"> <span>Lo invia al router</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">2.</span> Cos'e' la tabella MAC (CAM table) di uno switch?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'c',
          '',
          'Sbagliato. La tabella di routing e\\' usata dai router e contiene indirizzi IP. La tabella MAC mappa indirizzi MAC a porte fisiche.')">
          <input type="radio" name="q2"> <span>Una tabella di routing con indirizzi IP</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'c',
          '',
          'Sbagliato. Le regole del firewall filtrano il traffico. La tabella MAC serve per inoltrare i frame alla porta corretta in base al MAC di destinazione.')">
          <input type="radio" name="q2"> <span>Un elenco di regole del firewall</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'c',
          'Corretto! La tabella MAC (Content Addressable Memory) associa ogni indirizzo MAC alla porta fisica dello switch. Viene costruita dinamicamente: lo switch impara i MAC sorgente dei frame ricevuti e li associa alla porta di ingresso.',
          '')">
          <input type="radio" name="q2"> <span>Tabella che mappa indirizzi MAC a porte fisiche, costruita dinamicamente</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(2, 'd', 'c',
          '',
          'Sbagliato. Le VLAN sono configurate manualmente. La tabella MAC viene costruita automaticamente osservando il traffico in ingresso.')">
          <input type="radio" name="q2"> <span>Una lista di VLAN configurate sullo switch</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">3.</span> Qual e' la differenza chiave tra un hub e uno switch?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'b',
          '',
          'Sbagliato. Entrambi possono avere molte porte. La differenza e\\' nel modo in cui gestiscono i frame: lo switch li inoltra in modo intelligente, l\\'hub li ripete a tutti.')">
          <input type="radio" name="q3"> <span>Lo switch ha piu' porte dell'hub</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'b',
          'Corretto! Lo switch usa la tabella MAC per inoltrare i frame solo alla porta di destinazione corretta. L\\'hub invece ripete il segnale su tutte le porte, creando un unico dominio di collisione e sprecando banda.',
          '')">
          <input type="radio" name="q3"> <span>Lo switch invia i frame solo alla porta corretta usando la tabella MAC, l'hub ripete a tutti</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'b',
          '',
          'Sbagliato. Sia hub che switch operano in una LAN. La differenza e\\' che lo switch inoltra i frame in modo intelligente alla porta corretta, l\\'hub li ripete su tutte le porte.')">
          <input type="radio" name="q3"> <span>L'hub funziona solo in reti WAN</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">4.</span> Quanti domini di collisione crea uno switch con 24 porte?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'c',
          '',
          'Sbagliato. Un solo dominio di collisione e\\' quello che crea un hub. Lo switch separa ogni porta in un dominio di collisione indipendente.')">
          <input type="radio" name="q4"> <span>1 - tutto lo switch e' un unico dominio</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'c',
          '',
          'Sbagliato. Il numero di domini non dipende dalle VLAN ma dalle porte. Ogni porta dello switch e\\' un dominio di collisione separato.')">
          <input type="radio" name="q4"> <span>Dipende dal numero di VLAN</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'c',
          'Corretto! Ogni porta dello switch crea un dominio di collisione separato. Con 24 porte, ci sono 24 domini di collisione indipendenti. Questo e\\' un vantaggio enorme rispetto all\\'hub, che crea un unico dominio di collisione per tutte le porte.',
          '')">
          <input type="radio" name="q4"> <span>24 - uno per ogni porta</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(4, 'd', 'c',
          '',
          'Sbagliato. Non sono 2 (uno per ingresso e uno per uscita). Ogni singola porta dello switch e\\' un dominio di collisione separato, quindi 24.')">
          <input type="radio" name="q4"> <span>2 - uno per ogni direzione del traffico</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">5.</span> Cosa limita i domini di broadcast in una rete?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'c',
          '',
          'Sbagliato. Gli switch separano i domini di collisione, ma non i domini di broadcast. Il traffico broadcast attraversa tutte le porte dello switch.')">
          <input type="radio" name="q5"> <span>Gli switch da soli</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'c',
          '',
          'Sbagliato. I cavi non influiscono sui domini di broadcast. Servono VLAN o router per separare il traffico broadcast.')">
          <input type="radio" name="q5"> <span>Il tipo di cavo utilizzato</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'c',
          'Corretto! Le VLAN e i router sono gli unici strumenti che limitano i domini di broadcast. Ogni VLAN e\\' un dominio di broadcast separato, e il traffico tra VLAN deve passare attraverso un router o uno switch Layer 3.',
          '')">
          <input type="radio" name="q5"> <span>Le VLAN o i router, non gli switch da soli</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(5, 'd', 'c',
          '',
          'Sbagliato. Il numero di porte non influisce sui domini di broadcast. Senza VLAN, tutti i dispositivi sullo switch sono nello stesso dominio di broadcast.')">
          <input type="radio" name="q5"> <span>Il numero di porte dello switch</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">6.</span> Quale tipo di switch supporta VLAN, STP, port security e CLI completa?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'c',
          '',
          'Sbagliato. Lo switch unmanaged non ha alcuna configurazione: funziona plug-and-play ma non supporta VLAN, STP o port security.')">
          <input type="radio" name="q6"> <span>Switch Unmanaged</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'c',
          '',
          'Sbagliato. L\\'hub non e\\' uno switch e non supporta nessuna funzionalita\\' avanzata. E\\' un semplice ripetitore di segnale Layer 1.')">
          <input type="radio" name="q6"> <span>Hub</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'c',
          'Corretto! Lo switch Managed Layer 2 offre configurazione completa tramite CLI (e spesso anche GUI). Supporta VLAN, STP, port security, SNMP e molte altre funzionalita\\' avanzate per la gestione della rete.',
          '')">
          <input type="radio" name="q6"> <span>Switch Managed Layer 2</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6, 'd', 'c',
          '',
          'Sbagliato. Lo switch smart/web-managed offre alcune funzionalita\\' base (VLAN, QoS) tramite interfaccia web, ma non ha CLI completa e ha funzionalita\\' STP e port security limitate.')">
          <input type="radio" name="q6"> <span>Switch Smart/Web-managed</span>
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

  const html = wrapQuiz("Switch e MAC Table", body);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
