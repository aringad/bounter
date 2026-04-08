import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>Modalita' Operative WiFi</h2>
      <p>
        Le diverse modalita' operative del WiFi: Access Point, client/station, repeater, extender,
        WDS, bridge e mesh. Ogni modalita' ha un caso d'uso specifico e compromessi diversi in
        termini di prestazioni, copertura e complessita'.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">Access Point (AP):</strong> Punto di accesso cablato alla rete, il metodo preferito per estendere la copertura WiFi.</li>
        <li><strong style="color:#38bdf8;">Repeater/Extender:</strong> Ripete il segnale WiFi per estendere la copertura, ma dimezza la banda disponibile.</li>
        <li><strong style="color:#38bdf8;">Client/Station:</strong> Si connette a un AP esistente come client WiFi, fornendo connettivita' Ethernet ai dispositivi cablati.</li>
        <li><strong style="color:#38bdf8;">Bridge:</strong> Collega due segmenti di rete separati tramite un link WiFi dedicato.</li>
        <li><strong style="color:#38bdf8;">Mesh:</strong> Rete di AP interconnessi con roaming seamless, backhaul dedicato e self-healing.</li>
      </ul>
    </div>

    <!-- Q1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">1.</span> Perche' un AP cablato e' sempre preferibile a un repeater?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'b',
          '',
          'Sbagliato. Il costo non e\\' il motivo principale. Il problema del repeater e\\' che dimezza la banda perche\\' usa la stessa radio per ricevere e ritrasmettere.')">
          <input type="radio" name="q1"> <span>L'AP cablato costa meno</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'b',
          'Corretto! L\\'AP cablato non ha perdita di banda perche\\' riceve i dati via cavo Ethernet. Il repeater invece usa la stessa radio per ricevere E ritrasmettere il segnale, dimezzando la banda disponibile per i client.',
          '')">
          <input type="radio" name="q1"> <span>Nessuna perdita di banda - il repeater dimezza la banda perche' la stessa radio riceve e ritrasmette</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'b',
          '',
          'Sbagliato. Entrambi possono avere la stessa potenza di trasmissione. Il vantaggio dell\\'AP cablato e\\' che non perde banda, a differenza del repeater.')">
          <input type="radio" name="q1"> <span>L'AP cablato ha un segnale piu' potente</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1, 'd', 'b',
          '',
          'Sbagliato. L\\'installazione puo\\' essere piu\\' complessa per l\\'AP cablato (serve tirare il cavo). Il vantaggio e\\' prestazionale: nessuna perdita di banda.')">
          <input type="radio" name="q1"> <span>L'AP cablato e' piu' facile da installare</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">2.</span> Qual e' la principale limitazione di un repeater WiFi?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'c',
          '',
          'Sbagliato. Il repeater puo\\' supportare molti client. Il problema e\\' che dimezza la banda: una sola radio deve ricevere E ritrasmettere sullo stesso canale.')">
          <input type="radio" name="q2"> <span>Supporta un massimo di 5 client</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'c',
          '',
          'Sbagliato. Il repeater funziona con qualsiasi standard WiFi compatibile. La limitazione principale e\\' il dimezzamento della banda disponibile.')">
          <input type="radio" name="q2"> <span>Funziona solo con WiFi 5 e superiori</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'c',
          'Corretto! Il repeater usa una singola radio che deve sia ricevere che ritrasmettere sullo stesso canale. Questo dimezza la banda disponibile per i client. Alcuni extender dual-band mitigano il problema usando una banda per il backhaul.',
          '')">
          <input type="radio" name="q2"> <span>Dimezza la banda - una sola radio deve ricevere E ritrasmettere sullo stesso canale</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(2, 'd', 'c',
          '',
          'Sbagliato. Il repeater non richiede configurazione complessa. Il suo limite e\\' il dimezzamento della banda a causa della singola radio che riceve e ritrasmette.')">
          <input type="radio" name="q2"> <span>Richiede una configurazione molto complessa</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">3.</span> Qual e' il vantaggio chiave del WiFi mesh rispetto ai repeater?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'b',
          '',
          'Sbagliato. Il mesh costa generalmente di piu\\' dei repeater. Il vantaggio e\\' il roaming seamless, il backhaul dedicato e la capacita\\' di self-healing.')">
          <input type="radio" name="q3"> <span>Costa meno dei repeater</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'b',
          'Corretto! Il mesh offre roaming seamless grazie ai protocolli 802.11r/k/v, una radio dedicata per il backhaul (senza dimezzare la banda), e self-healing: se un nodo cade, il traffico viene reindirizzato automaticamente attraverso altri nodi.',
          '')">
          <input type="radio" name="q3"> <span>Roaming seamless con 802.11r/k/v, backhaul dedicato, self-healing</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'b',
          '',
          'Sbagliato. Il mesh non ha necessariamente piu\\' portata. Il vantaggio e\\' il roaming seamless, il backhaul dedicato e l\\'auto-riparazione della rete.')">
          <input type="radio" name="q3"> <span>Ha una portata radio molto superiore</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(3, 'd', 'b',
          '',
          'Sbagliato. Anche i repeater possono usare la stessa SSID. Il mesh offre roaming seamless vero con 802.11r/k/v, backhaul dedicato e self-healing.')">
          <input type="radio" name="q3"> <span>Usa un SSID unico per tutta la rete</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">4.</span> Quando si usa la modalita' Client/Station?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'c',
          '',
          'Sbagliato. Per estendere la copertura si usa un repeater o un AP aggiuntivo. La modalita\\' Client/Station serve per collegare dispositivi Ethernet-only al WiFi.')">
          <input type="radio" name="q4"> <span>Per estendere la copertura WiFi in un'area</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'c',
          '',
          'Sbagliato. Per collegare due edifici si usa un bridge punto-punto. La modalita\\' Client/Station serve per dare connettivita\\' WiFi a dispositivi che hanno solo Ethernet.')">
          <input type="radio" name="q4"> <span>Per collegare due edifici via radio</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'c',
          'Corretto! La modalita\\' Client/Station trasforma un dispositivo WiFi in un &amp;quot;adattatore WiFi-Ethernet&amp;quot;. Si connette a un AP esistente e fornisce una porta Ethernet per collegare telecamere, stampanti, TV o altri dispositivi senza WiFi integrato.',
          '')">
          <input type="radio" name="q4"> <span>Per connettere dispositivi solo Ethernet (telecamere, stampanti, TV) al WiFi</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(4, 'd', 'c',
          '',
          'Sbagliato. Per creare una rete separata per ospiti si configura una SSID aggiuntiva sull\\'AP. La modalita\\' Client/Station collega dispositivi Ethernet-only al WiFi.')">
          <input type="radio" name="q4"> <span>Per creare una rete WiFi separata per gli ospiti</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">5.</span> Cosa fa un bridge wireless?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'b',
          '',
          'Sbagliato. Stai descrivendo un repeater. Il bridge connette due segmenti di rete separati, tipicamente in due edifici diversi, tramite un link WiFi dedicato.')">
          <input type="radio" name="q5"> <span>Ripete il segnale WiFi per estendere la copertura</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'b',
          'Corretto! Un bridge wireless collega due segmenti di rete separati tramite un link WiFi dedicato, tipicamente tra due edifici. Usa antenne direzionali punto-punto per massimizzare la portata e la stabilita\\' del collegamento.',
          '')">
          <input type="radio" name="q5"> <span>Collega due segmenti di rete separati - tipicamente due edifici - tramite link WiFi dedicato</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'b',
          '',
          'Sbagliato. Stai descrivendo un firewall o un router con ACL. Il bridge connette due reti fisicamente separate tramite un collegamento radio dedicato.')">
          <input type="radio" name="q5"> <span>Filtra il traffico tra due reti diverse</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(5, 'd', 'b',
          '',
          'Sbagliato. Stai descrivendo la modalita\\' Client/Station. Il bridge crea un collegamento punto-punto tra due segmenti di rete separati.')">
          <input type="radio" name="q5"> <span>Converte il segnale WiFi in Ethernet per un singolo dispositivo</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">6.</span> Cos'e' il PoE e perche' e' importante per gli AP?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'c',
          '',
          'Sbagliato. PoE non e\\' un protocollo di gestione. E\\' Power over Ethernet: alimenta l\\'AP attraverso il cavo di rete, eliminando la necessita\\' di un alimentatore separato.')">
          <input type="radio" name="q6"> <span>Un protocollo per gestire gli AP da remoto</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'c',
          '',
          'Sbagliato. PoE non riguarda le prestazioni WiFi. E\\' Power over Ethernet: porta l\\'alimentazione elettrica all\\'AP tramite il cavo Ethernet, senza bisogno di una presa di corrente dedicata.')">
          <input type="radio" name="q6"> <span>Una tecnologia per aumentare la velocita' del WiFi</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'c',
          'Corretto! Power over Ethernet alimenta l\\'AP direttamente attraverso il cavo Ethernet, eliminando la necessita\\' di un alimentatore separato e di una presa di corrente vicina. Fondamentale per installazioni a soffitto o in posizioni difficili da raggiungere.',
          '')">
          <input type="radio" name="q6"> <span>Power over Ethernet - alimenta l'AP tramite il cavo Ethernet, senza alimentatore separato</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6, 'd', 'c',
          '',
          'Sbagliato. PoE non riguarda la sicurezza. E\\' Power over Ethernet: fornisce alimentazione elettrica all\\'AP attraverso il cavo di rete.')">
          <input type="radio" name="q6"> <span>Un metodo di crittografia per proteggere il traffico degli AP</span>
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

  const html = wrapQuiz("Modalita' Operative WiFi", body);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
