import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>VLAN e Trunk 802.1Q</h2>
      <p>
        Le VLAN (Virtual LAN) permettono di segmentare logicamente una rete fisica in piu' reti separate.
        Il protocollo IEEE 802.1Q definisce come taggare i frame per trasportare piu' VLAN su un singolo collegamento trunk.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">VLAN:</strong> Rete logica che crea un dominio di broadcast separato. I dispositivi nella stessa VLAN comunicano direttamente, quelli in VLAN diverse necessitano di routing.</li>
        <li><strong style="color:#38bdf8;">Access Port:</strong> Porta assegnata a una sola VLAN. Il traffico viaggia senza tag 802.1Q.</li>
        <li><strong style="color:#38bdf8;">Trunk Port:</strong> Porta che trasporta traffico di piu' VLAN contemporaneamente, usando tag 802.1Q per identificarle.</li>
        <li><strong style="color:#38bdf8;">Native VLAN:</strong> VLAN il cui traffico viaggia senza tag sul trunk. Di default e' la VLAN 1, ma va cambiata per motivi di sicurezza.</li>
        <li><strong style="color:#38bdf8;">Inter-VLAN Routing:</strong> Per far comunicare VLAN diverse serve un router (router-on-a-stick) o uno switch Layer 3 con SVI.</li>
      </ul>
    </div>

    <!-- Q1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">1.</span> Qual e' il vantaggio principale delle VLAN?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'b',
          '',
          'Sbagliato. Le VLAN non aumentano la velocita\\' dei cavi. Il vantaggio principale e\\' la segmentazione: ogni VLAN e\\' un dominio di broadcast separato.')">
          <input type="radio" name="q1"> <span>Aumentano la velocita' dei collegamenti fisici</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'b',
          'Corretto! Ogni VLAN crea un dominio di broadcast separato. Questo migliora la sicurezza (i dispositivi in VLAN diverse non si vedono direttamente) e riduce il traffico broadcast, perche\\' i frame broadcast restano confinati nella VLAN.',
          '')">
          <input type="radio" name="q1"> <span>Ogni VLAN e' un dominio di broadcast separato, migliorando sicurezza e riducendo broadcast</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'b',
          '',
          'Sbagliato. Le VLAN non eliminano la necessita\\' di switch. Funzionano sugli switch per segmentare logicamente la rete.')">
          <input type="radio" name="q1"> <span>Eliminano la necessita' di switch nella rete</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">2.</span> Qual e' la differenza tra una porta Access e una porta Trunk?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'b',
          '',
          'Sbagliato. La velocita\\' non e\\' la differenza. La porta access trasporta una sola VLAN senza tag, la trunk trasporta piu\\' VLAN con tag 802.1Q.')">
          <input type="radio" name="q2"> <span>La porta access e' piu' veloce della trunk</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'b',
          'Corretto! La porta access e\\' assegnata a una sola VLAN e il traffico viaggia senza tag (il dispositivo connesso non sa di essere in una VLAN). La porta trunk trasporta il traffico di piu\\' VLAN contemporaneamente, aggiungendo un tag 802.1Q a ogni frame per identificare la VLAN di appartenenza.',
          '')">
          <input type="radio" name="q2"> <span>Access porta una sola VLAN senza tag, trunk porta piu' VLAN con tag 802.1Q</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'b',
          '',
          'Sbagliato. Le porte trunk si usano tra switch (o tra switch e router), non per collegare PC. I PC si collegano a porte access.')">
          <input type="radio" name="q2"> <span>La porta trunk si usa solo per collegare i PC</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(2, 'd', 'b',
          '',
          'Sbagliato. Access e trunk non sono sinonimi di half e full duplex. Sono modalita\\' di gestione delle VLAN sulla porta.')">
          <input type="radio" name="q2"> <span>Access e' half-duplex, trunk e' full-duplex</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">3.</span> Cos'e' la Native VLAN su un trunk?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'c',
          '',
          'Sbagliato. La Native VLAN non e\\' la VLAN piu\\' veloce. E\\' la VLAN il cui traffico viaggia senza tag sul trunk.')">
          <input type="radio" name="q3"> <span>La VLAN con la priorita' piu' alta</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'c',
          '',
          'Sbagliato. La Native VLAN non e\\' bloccata. Al contrario, il suo traffico e\\' l\\'unico che viaggia senza tag sul trunk, ed e\\' proprio questo che crea rischi di sicurezza.')">
          <input type="radio" name="q3"> <span>La VLAN che viene bloccata sul trunk</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'c',
          'Corretto! La Native VLAN e\\' quella il cui traffico viaggia senza tag 802.1Q sul collegamento trunk. Di default e\\' la VLAN 1. Per sicurezza va cambiata con una VLAN dedicata e inutilizzata, per evitare attacchi di VLAN hopping.',
          '')">
          <input type="radio" name="q3"> <span>VLAN il cui traffico viaggia senza tag, default VLAN 1, va cambiata per sicurezza</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">4.</span> Come fa 802.1Q a identificare la VLAN di appartenenza di un frame?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'b',
          '',
          'Sbagliato. L\\'indirizzo MAC identifica il dispositivo, non la VLAN. 802.1Q aggiunge un tag dedicato nel frame.')">
          <input type="radio" name="q4"> <span>Tramite l'indirizzo MAC di destinazione</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'b',
          'Corretto! 802.1Q inserisce un tag di 4 byte nell\\'header del frame Ethernet. Questo tag contiene un campo VID (VLAN Identifier) di 12 bit, che permette di identificare VLAN da 1 a 4094. Il tag include anche il campo PCP per la priorita\\' (QoS).',
          '')">
          <input type="radio" name="q4"> <span>Tag di 4 byte con campo VID di 12 bit, VLAN 1-4094</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'b',
          '',
          'Sbagliato. L\\'indirizzo IP e\\' a Layer 3 e non ha informazioni sulla VLAN. 802.1Q opera a Layer 2 con un tag dedicato nel frame Ethernet.')">
          <input type="radio" name="q4"> <span>Tramite l'indirizzo IP sorgente</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(4, 'd', 'b',
          '',
          'Sbagliato. Il numero di porta TCP/UDP identifica i servizi applicativi, non le VLAN. 802.1Q usa un tag dedicato nel frame Ethernet.')">
          <input type="radio" name="q4"> <span>Tramite il numero di porta TCP</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">5.</span> Qual e' il metodo piu' veloce per il routing inter-VLAN?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'c',
          '',
          'Sbagliato. Il router-on-a-stick funziona ma e\\' piu\\' lento: tutto il traffico passa per un\\'unica interfaccia fisica del router. Lo switch Layer 3 con SVI fa routing in hardware.')">
          <input type="radio" name="q5"> <span>Router-on-a-stick con subinterface</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'c',
          '',
          'Sbagliato. Un router esterno dedicato funziona ma aggiunge latenza. Lo switch Layer 3 integra il routing direttamente nell\\'hardware dello switch.')">
          <input type="radio" name="q5"> <span>Router esterno dedicato</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'c',
          'Corretto! Lo switch Layer 3 con SVI (Switch Virtual Interface) esegue il routing inter-VLAN direttamente in hardware (ASIC), senza dover inviare il traffico a un router esterno. E\\' il metodo piu\\' veloce e scalabile per reti aziendali.',
          '')">
          <input type="radio" name="q5"> <span>Switch Layer 3 con SVI - routing in hardware</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">6.</span> Un ufficio ha 30 dipendenti. I PC, i telefoni VoIP e il WiFi ospiti devono essere separati. Quale approccio e' corretto?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'b',
          '',
          'Sbagliato. Usare 3 switch separati fisicamente e\\' costoso e poco pratico. Le VLAN permettono di segmentare la rete sullo stesso switch.')">
          <input type="radio" name="q6"> <span>3 switch fisici separati, uno per tipo di dispositivo</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'b',
          'Corretto! Si creano 3 VLAN separate: una per i PC (es. VLAN 10), una per il VoIP (es. VLAN 20) e una per il WiFi ospiti (es. VLAN 30). Ogni VLAN e\\' un dominio di broadcast separato, garantendo isolamento e sicurezza senza hardware aggiuntivo.',
          '')">
          <input type="radio" name="q6"> <span>3 VLAN separate: PC, VoIP e WiFi ospiti</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'b',
          '',
          'Sbagliato. Un\\'unica VLAN non fornisce alcuna separazione. Il traffico VoIP, dei PC e degli ospiti sarebbe tutto nello stesso dominio di broadcast, creando rischi di sicurezza.')">
          <input type="radio" name="q6"> <span>Una singola VLAN per tutti i dispositivi</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6, 'd', 'b',
          '',
          'Sbagliato. Un firewall serve per filtrare il traffico tra reti, non per segmentare la LAN. Le VLAN sono la soluzione corretta per separare i tipi di traffico sulla stessa rete.')">
          <input type="radio" name="q6"> <span>Un firewall tra ogni gruppo di dispositivi</span>
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

  const html = wrapQuiz("VLAN e Trunk 802.1Q", body);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
