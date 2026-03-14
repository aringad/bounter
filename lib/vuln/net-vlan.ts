import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>VLAN e Segmentazione</h2>
      <p>
        Le VLAN (Virtual LAN) permettono di segmentare logicamente una rete fisica in piu' reti virtuali separate.
        Questo migliora sicurezza, prestazioni e gestione della rete senza richiedere hardware aggiuntivo.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">VLAN:</strong> Una rete logica creata su uno switch che isola il traffico tra gruppi di porte, come se fossero su switch fisici separati.</li>
        <li><strong style="color:#38bdf8;">Access Port:</strong> Porta dello switch assegnata a una singola VLAN. Connette dispositivi finali (PC, stampanti) senza tagging.</li>
        <li><strong style="color:#38bdf8;">Trunk Port:</strong> Porta che trasporta traffico di piu' VLAN contemporaneamente, aggiungendo un tag 802.1Q ai frame per identificare la VLAN di appartenenza.</li>
        <li><strong style="color:#38bdf8;">802.1Q:</strong> Lo standard IEEE che definisce come aggiungere un tag di 4 byte ai frame Ethernet per identificare la VLAN di appartenenza.</li>
        <li><strong style="color:#38bdf8;">Native VLAN:</strong> La VLAN predefinita su un trunk che trasporta frame senza tag. Per sicurezza, va cambiata rispetto alla VLAN 1 di default.</li>
      </ul>
    </div>

    <!-- Q1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">1.</span> Cos'e' una VLAN?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'b',
          '',
          'Sbagliato. Una VLAN non e\\' una rete WiFi separata. E\\' una segmentazione logica a livello di switch che permette di isolare il traffico tra gruppi di porte, indipendentemente dalla connessione fisica.')">
          <input type="radio" name="q1"> <span>Una rete WiFi separata</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'b',
          'Corretto! Una VLAN e\\' una segmentazione logica su uno switch che permette di creare reti virtuali separate sulla stessa infrastruttura fisica. I dispositivi in VLAN diverse non possono comunicare direttamente, come se fossero su switch fisici separati.',
          '')">
          <input type="radio" name="q1"> <span>Una segmentazione logica su uno switch</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'b',
          '',
          'Sbagliato. Una VPN (Virtual Private Network) e\\' un tunnel crittografato attraverso Internet. Una VLAN e\\' una segmentazione logica a livello di switch per isolare il traffico locale.')">
          <input type="radio" name="q1"> <span>Una connessione VPN</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1, 'd', 'b',
          '',
          'Sbagliato. Una sottorete IP e\\' un concetto di Layer 3, mentre una VLAN opera a Layer 2 creando segmenti logici sullo switch. Spesso una VLAN corrisponde a una sottorete, ma sono concetti diversi.')">
          <input type="radio" name="q1"> <span>Una sottorete IP</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">2.</span> Qual e' la differenza tra una porta access e una porta trunk?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'b',
          '',
          'Sbagliato. La velocita\\' non c\\'entra. La differenza sta nel numero di VLAN: la porta access appartiene a una sola VLAN, mentre il trunk trasporta traffico di piu\\' VLAN usando tag 802.1Q.')">
          <input type="radio" name="q2"> <span>La porta access e' piu' veloce del trunk</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'b',
          'Corretto! La porta access appartiene a una singola VLAN e connette dispositivi finali (PC, stampanti). La porta trunk trasporta traffico di piu\\' VLAN contemporaneamente, aggiungendo tag 802.1Q ai frame per identificare la VLAN di appartenenza. I trunk collegano tipicamente switch tra loro.',
          '')">
          <input type="radio" name="q2"> <span>La access porta una sola VLAN, il trunk ne porta piu' di una</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'b',
          '',
          'Sbagliato. Entrambe le porte possono usare cavi Ethernet standard. La differenza e\\' logica: la access appartiene a una VLAN, il trunk trasporta piu\\' VLAN con tag 802.1Q.')">
          <input type="radio" name="q2"> <span>La access usa WiFi, il trunk usa cavo</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">3.</span> Quale protocollo aggiunge tag VLAN ai frame Ethernet?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'b',
          '',
          'Sbagliato. STP (Spanning Tree Protocol) previene i loop nella rete, non gestisce il tagging VLAN. Il protocollo per i tag VLAN e\\' 802.1Q.')">
          <input type="radio" name="q3"> <span>STP (802.1D)</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'b',
          'Corretto! IEEE 802.1Q e\\' lo standard che definisce il VLAN tagging. Aggiunge un campo di 4 byte nell\\'header Ethernet che contiene il VLAN ID (numero da 1 a 4094), permettendo ai trunk di trasportare traffico di piu\\' VLAN sullo stesso collegamento fisico.',
          '')">
          <input type="radio" name="q3"> <span>802.1Q</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'b',
          '',
          'Sbagliato. ARP (Address Resolution Protocol) risolve indirizzi IP in indirizzi MAC, non gestisce il tagging VLAN. Il protocollo corretto e\\' 802.1Q.')">
          <input type="radio" name="q3"> <span>ARP</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(3, 'd', 'b',
          '',
          'Sbagliato. ICMP e\\' usato per messaggi di diagnostica (es. ping). Il protocollo per il VLAN tagging e\\' IEEE 802.1Q.')">
          <input type="radio" name="q3"> <span>ICMP</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">4.</span> Due VLAN su uno switch devono comunicare tra loro. Quale dispositivo serve?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'c',
          '',
          'Sbagliato. Un hub ripete il segnale a tutte le porte e non comprende le VLAN. Per la comunicazione tra VLAN serve un router o uno switch Layer 3 che instradi il traffico tra le sottoreti.')">
          <input type="radio" name="q4"> <span>Un hub</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'c',
          '',
          'Sbagliato. Un secondo switch Layer 2 non risolve il problema: le VLAN restano isolate anche attraverso piu\\' switch. Serve un router o uno switch Layer 3 per instradare il traffico tra VLAN diverse.')">
          <input type="radio" name="q4"> <span>Un secondo switch Layer 2</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'c',
          'Corretto! Le VLAN isolano il traffico a Layer 2, quindi per comunicare tra VLAN diverse serve un dispositivo Layer 3: un router (inter-VLAN routing) o uno switch Layer 3 che possa instradare i pacchetti tra le sottoreti associate alle VLAN.',
          '')">
          <input type="radio" name="q4"> <span>Un router o uno switch Layer 3</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(4, 'd', 'c',
          '',
          'Sbagliato. Un access point fornisce connettivita\\' WiFi ma non puo\\' instradare traffico tra VLAN. Serve un router o uno switch Layer 3.')">
          <input type="radio" name="q4"> <span>Un access point</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">5.</span> Cos'e' la native VLAN su un trunk?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'b',
          '',
          'Sbagliato. La VLAN piu\\' veloce non esiste come concetto. La native VLAN e\\' la VLAN i cui frame viaggiano senza tag 802.1Q sul trunk, di default e\\' la VLAN 1.')">
          <input type="radio" name="q5"> <span>La VLAN con la velocita' piu' alta</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'b',
          'Corretto! La native VLAN e\\' la VLAN predefinita sul trunk i cui frame viaggiano senza tag 802.1Q. Di default e\\' la VLAN 1. Per motivi di sicurezza, e\\' buona pratica cambiare la native VLAN a un valore diverso da 1 per prevenire attacchi di VLAN hopping.',
          '')">
          <input type="radio" name="q5"> <span>La VLAN i cui frame viaggiano senza tag sul trunk</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'b',
          '',
          'Sbagliato. La native VLAN non e\\' una VLAN di gestione riservata. E\\' la VLAN i cui frame non ricevono tag 802.1Q sul trunk, di default la VLAN 1.')">
          <input type="radio" name="q5"> <span>La VLAN riservata alla gestione dello switch</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">6.</span> Quali sono i principali vantaggi dell'uso delle VLAN?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'c',
          '',
          'Sbagliato. Le VLAN non aumentano la velocita\\' fisica dei cavi. I vantaggi principali sono sicurezza (isolamento del traffico), prestazioni (riduzione del dominio di broadcast) e gestione flessibile della rete.')">
          <input type="radio" name="q6"> <span>Aumentare la velocita' dei cavi di rete</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'c',
          '',
          'Sbagliato. Le VLAN non eliminano la necessita\\' di switch. Al contrario, richiedono switch che le supportino. I vantaggi sono sicurezza, riduzione del broadcast e gestione flessibile.')">
          <input type="radio" name="q6"> <span>Eliminare la necessita' di switch</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'c',
          'Corretto! Le VLAN offrono tre vantaggi chiave: sicurezza (il traffico tra reparti e\\' isolato), prestazioni (il dominio di broadcast e\\' ridotto, diminuendo il traffico inutile) e gestione flessibile (si possono riorganizzare i gruppi senza spostare fisicamente i cavi).',
          '')">
          <input type="radio" name="q6"> <span>Sicurezza, prestazioni e gestione flessibile</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6, 'd', 'c',
          '',
          'Sbagliato. Le VLAN non crittografano il traffico. Per la crittografia servono protocolli come TLS o IPsec. Le VLAN isolano il traffico logicamente ma non lo proteggono con crittografia.')">
          <input type="radio" name="q6"> <span>Crittografare automaticamente il traffico</span>
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

  const html = wrapQuiz("VLAN e Segmentazione", body);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
