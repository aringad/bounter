import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>STP e Ridondanza</h2>
      <p>
        In reti con collegamenti ridondanti, i loop di rete causano broadcast storm devastanti.
        STP (Spanning Tree Protocol) e RSTP prevengono i loop bloccando i percorsi ridondanti,
        mentre EtherChannel/LAG aggrega piu' link fisici in uno logico per aumentare banda e affidabilita'.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">Broadcast Storm:</strong> I frame broadcast si moltiplicano all'infinito nei loop, saturando la rete in pochi secondi.</li>
        <li><strong style="color:#38bdf8;">STP (802.1D):</strong> Elegge un Root Bridge e blocca le porte ridondanti per eliminare i loop. Convergenza lenta (30-50 sec).</li>
        <li><strong style="color:#38bdf8;">RSTP (802.1w):</strong> Evoluzione di STP con convergenza rapida (1-2 secondi) grazie a meccanismi di proposal/agreement.</li>
        <li><strong style="color:#38bdf8;">Root Bridge:</strong> Lo switch con il Bridge ID piu' basso (priorita' + MAC) diventa il centro dell'albero spanning tree.</li>
        <li><strong style="color:#38bdf8;">EtherChannel/LAG:</strong> Combina piu' link fisici in un unico link logico, sommando la banda e fornendo ridondanza automatica.</li>
      </ul>
    </div>

    <!-- Q1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">1.</span> Due switch sono collegati da due cavi senza STP attivo. Cosa succede?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'b',
          '',
          'Sbagliato. Il traffico non si bilancia automaticamente senza un protocollo di aggregazione. Senza STP, i frame broadcast iniziano a girare in loop all\\'infinito.')">
          <input type="radio" name="q1"> <span>Il traffico si bilancia automaticamente sui due cavi</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'b',
          'Corretto! Senza STP, si crea un loop di rete: i frame broadcast vengono inoltrati all\\'infinito tra i due switch, moltiplicandosi esponenzialmente. In pochi secondi si verifica una broadcast storm che satura completamente la rete, rendendola inutilizzabile.',
          '')">
          <input type="radio" name="q1"> <span>Broadcast storm: i frame girano all'infinito, la rete muore in pochi secondi</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'b',
          '',
          'Sbagliato. Gli switch non disabilitano automaticamente un cavo senza STP. Il risultato e\\' un loop catastrofico con broadcast storm.')">
          <input type="radio" name="q1"> <span>Uno dei due cavi viene disabilitato automaticamente</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">2.</span> Cos'e' il Root Bridge in STP?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'c',
          '',
          'Sbagliato. Il Root Bridge non e\\' lo switch con piu\\' porte. E\\' quello con il Bridge ID piu\\' basso (priorita\\' + MAC address).')">
          <input type="radio" name="q2"> <span>Lo switch con il maggior numero di porte</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'c',
          '',
          'Sbagliato. Il Root Bridge non e\\' il primo switch acceso. Viene eletto in base al Bridge ID piu\\' basso (combinazione di priorita\\' e MAC address).')">
          <input type="radio" name="q2"> <span>Il primo switch acceso nella rete</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'c',
          'Corretto! Il Root Bridge e\\' lo switch con il Bridge ID piu\\' basso, composto da priorita\\' (default 32768) e MAC address. Diventa il centro dello spanning tree: tutti gli altri switch calcolano il percorso migliore verso il Root Bridge e bloccano le porte ridondanti.',
          '')">
          <input type="radio" name="q2"> <span>Lo switch con il Bridge ID piu' basso (priorita' + MAC), centro dello spanning tree</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(2, 'd', 'c',
          '',
          'Sbagliato. Il Root Bridge non e\\' scelto dall\\'amministratore (anche se l\\'admin puo\\' influenzare l\\'elezione cambiando la priorita\\'). Viene eletto automaticamente tramite lo scambio di BPDU.')">
          <input type="radio" name="q2"> <span>Lo switch scelto manualmente dall'amministratore</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">3.</span> Quale differenza c'e' tra STP e RSTP in termini di convergenza?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'b',
          '',
          'Sbagliato. I tempi sono invertiti. STP classico e\\' lento (30-50 sec), RSTP e\\' molto piu\\' veloce (1-2 sec).')">
          <input type="radio" name="q3"> <span>STP converge in 1-2 secondi, RSTP in 30-50 secondi</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'b',
          'Corretto! STP classico (802.1D) richiede 30-50 secondi per convergere, passando attraverso gli stati listening e learning (15 sec ciascuno). RSTP (802.1w) converge in 1-2 secondi grazie ai meccanismi di proposal/agreement che eliminano i timer fissi.',
          '')">
          <input type="radio" name="q3"> <span>STP 30-50 secondi, RSTP 1-2 secondi</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'b',
          '',
          'Sbagliato. RSTP e\\' significativamente piu\\' veloce di STP. STP richiede 30-50 secondi, RSTP solo 1-2 secondi.')">
          <input type="radio" name="q3"> <span>Non c'e' differenza, convergono alla stessa velocita'</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">4.</span> Cosa fa una porta in stato BLOCKING in STP?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'c',
          '',
          'Sbagliato. Una porta in blocking non e\\' disattivata. Riceve e processa i BPDU per mantenere la topologia STP aggiornata.')">
          <input type="radio" name="q4"> <span>E' completamente disattivata, non riceve nulla</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'c',
          '',
          'Sbagliato. Una porta in blocking non inoltra traffico utente in nessuna direzione. Il suo scopo e\\' prevenire i loop bloccando un percorso ridondante.')">
          <input type="radio" name="q4"> <span>Inoltra traffico solo in una direzione</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'c',
          'Corretto! Una porta in stato blocking riceve e processa i BPDU (Bridge Protocol Data Unit) per monitorare la topologia, ma non inoltra traffico utente (dati). Se il percorso principale cade, la porta puo\\' passare a forwarding per ripristinare la connettivita\\'.',
          '')">
          <input type="radio" name="q4"> <span>Riceve BPDU ma non inoltra traffico utente</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(4, 'd', 'c',
          '',
          'Sbagliato. Una porta in blocking non inoltra traffico utente di nessun tipo. Solo i BPDU vengono processati per mantenere la topologia STP.')">
          <input type="radio" name="q4"> <span>Inoltra solo traffico broadcast</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">5.</span> Cos'e' EtherChannel/LAG?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'b',
          '',
          'Sbagliato. Questa descrizione si riferisce al trunk 802.1Q, non a EtherChannel. EtherChannel aggrega piu\\' link fisici in uno logico per aumentare banda e ridondanza.')">
          <input type="radio" name="q5"> <span>Un protocollo per trasportare piu' VLAN su un cavo</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'b',
          'Corretto! EtherChannel (o LAG - Link Aggregation Group) combina piu\\' link fisici (es. 2, 4 o 8 cavi) in un unico link logico. La banda viene sommata (es. 4x 1 Gbps = 4 Gbps logici) e se un link fisico cade, il traffico continua sugli altri senza interruzione.',
          '')">
          <input type="radio" name="q5"> <span>Combina piu' link fisici in uno logico, banda sommata e ridondanza automatica</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'b',
          '',
          'Sbagliato. Questo descrive STP, non EtherChannel. EtherChannel aggrega link per aumentare la banda, STP blocca i percorsi ridondanti per prevenire loop.')">
          <input type="radio" name="q5"> <span>Un metodo per bloccare le porte ridondanti</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">6.</span> Quale standard aperto viene usato per l'aggregazione dei link?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'b',
          '',
          'Sbagliato. PAgP (Port Aggregation Protocol) e\\' proprietario Cisco e funziona solo tra dispositivi Cisco. Lo standard aperto e\\' LACP 802.3ad.')">
          <input type="radio" name="q6"> <span>PAgP (Cisco)</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'b',
          'Corretto! LACP (Link Aggregation Control Protocol), definito nello standard IEEE 802.3ad, e\\' lo standard aperto per l\\'aggregazione dei link. Funziona con apparati di qualsiasi vendor, a differenza di PAgP che e\\' proprietario Cisco.',
          '')">
          <input type="radio" name="q6"> <span>LACP 802.3ad (standard aperto, non proprietario Cisco)</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'b',
          '',
          'Sbagliato. STP 802.1D previene i loop, non aggrega i link. Lo standard per l\\'aggregazione e\\' LACP 802.3ad.')">
          <input type="radio" name="q6"> <span>STP 802.1D</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6, 'd', 'b',
          '',
          'Sbagliato. 802.1Q e\\' lo standard per il tagging delle VLAN sui trunk, non per l\\'aggregazione dei link. Lo standard corretto e\\' LACP 802.3ad.')">
          <input type="radio" name="q6"> <span>802.1Q</span>
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

  const html = wrapQuiz("STP e Ridondanza", body);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
