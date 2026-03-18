import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>Cablaggio Strutturato</h2>
      <p>
        Il cablaggio e' la spina dorsale di ogni rete. Scegliere il cavo giusto dipende dalla
        velocita' richiesta, dalla distanza e dall'ambiente di installazione.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">Cat5e:</strong> Fino a 1 Gbps, distanza max 100m. Standard base per le reti moderne.</li>
        <li><strong style="color:#38bdf8;">Cat6:</strong> Fino a 1 Gbps (10 Gbps fino a 55m). Migliore schermatura contro le interferenze.</li>
        <li><strong style="color:#38bdf8;">Cat6a:</strong> Fino a 10 Gbps su 100m. Ideale per reti ad alte prestazioni.</li>
        <li><strong style="color:#38bdf8;">Cat7/Cat8:</strong> 10-25-40 Gbps, schermatura avanzata. Usati in data center.</li>
        <li><strong style="color:#38bdf8;">Fibra ottica monomodale:</strong> Lunghe distanze (fino a decine di km), ideale per collegamenti tra edifici.</li>
        <li><strong style="color:#38bdf8;">Fibra ottica multimodale:</strong> Distanze medie (fino a ~550m a 10 Gbps), piu' economica della monomodale.</li>
        <li><strong style="color:#38bdf8;">Connettore RJ45:</strong> Il connettore standard per il cablaggio Ethernet in rame (8 pin).</li>
        <li><strong style="color:#38bdf8;">Distanza max rame:</strong> Tutti i cavi in rame Ethernet hanno un limite di 100 metri per tratta.</li>
      </ul>
    </div>

    <!-- Q1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">1.</span> Devi cablare un ufficio open space: distanza massima 50m, velocita' Gigabit. Quale cavo scegli?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'b',
          '',
          'Sbagliato. Il Cat5e supporta Gigabit ma ha una schermatura inferiore. Il Cat6 offre migliori prestazioni e margine per il futuro a un costo ragionevole.')">
          <input type="radio" name="q1"> <span>Cat5e</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'b',
          'Corretto! Il Cat6 supporta Gigabit Ethernet fino a 100m ed e\\' la scelta ottimale per un ufficio: buone prestazioni, schermatura adeguata e costo ragionevole. Per 50m non serve Cat6a.',
          '')">
          <input type="radio" name="q1"> <span>Cat6</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'b',
          '',
          'Sbagliato. Il Cat6a supporta 10 Gbps ed e\\' sovradimensionato per un semplice Gigabit a 50m. Il Cat6 e\\' la scelta piu\\' equilibrata.')">
          <input type="radio" name="q1"> <span>Cat6a</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1, 'd', 'b',
          '',
          'Sbagliato. La fibra ottica e\\' eccessiva per un ufficio open space a 50m. Il cavo in rame Cat6 e\\' piu\\' pratico e conveniente.')">
          <input type="radio" name="q1"> <span>Fibra ottica</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">2.</span> Devi collegare due edifici distanti 500 metri. Quale mezzo di trasmissione usi?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'c',
          '',
          'Sbagliato. Il Cat6 ha una distanza massima di 100 metri. A 500m il segnale si degraderebbe completamente.')">
          <input type="radio" name="q2"> <span>Cat6</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'c',
          '',
          'Sbagliato. Anche il Cat6a ha il limite di 100 metri per i cavi in rame. A 500m serve la fibra ottica.')">
          <input type="radio" name="q2"> <span>Cat6a</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'c',
          'Corretto! La fibra ottica e\\' l\\'unica soluzione per distanze superiori a 100m. A 500m si puo\\' usare fibra multimodale o monomodale, entrambe ampiamente entro i loro limiti di distanza.',
          '')">
          <input type="radio" name="q2"> <span>Fibra ottica</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">3.</span> Qual e' la distanza massima per un singolo tratto di cavo in rame Cat6 <em>a 10 Gbps</em>?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'a',
          'Corretto! Il Cat6 supporta 10 Gbps solo fino a 55 metri. Oltre questa distanza la velocita\\' scende a 1 Gbps (fino a 100m). Per 10 Gbps su distanze maggiori serve il Cat6a, che regge 10 Gbps fino a 100m.',
          '')">
          <input type="radio" name="q3"> <span>55 metri</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'a',
          '',
          'Sbagliato. 100 metri e\\' il limite del Cat6 per Gigabit (1 Gbps). A 10 Gbps il Cat6 arriva solo a 55 metri. Per 10 Gbps a 100m serve il Cat6a.')">
          <input type="radio" name="q3"> <span>100 metri</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'a',
          '',
          'Sbagliato. 200 metri supera il limite di qualsiasi cavo in rame Ethernet. Il Cat6 a 10 Gbps arriva a soli 55 metri.')">
          <input type="radio" name="q3"> <span>200 metri</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(3, 'd', 'a',
          '',
          'Sbagliato. 500 metri e\\' raggiungibile solo con la fibra ottica. Il Cat6 a 10 Gbps si ferma a 55 metri.')">
          <input type="radio" name="q3"> <span>500 metri</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">4.</span> In un ambiente industriale con forti interferenze elettromagnetiche (EMI), quale cavo e' la scelta migliore?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'b',
          '',
          'Sbagliato. Il Cat5e non e\\' schermato (UTP) ed e\\' molto sensibile alle interferenze elettromagnetiche. Serve almeno un cavo schermato.')">
          <input type="radio" name="q4"> <span>Cat5e UTP</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'b',
          'Corretto! Il Cat6 schermato (STP/FTP) e\\' la scelta piu\\' pratica in ambienti con EMI: la schermatura protegge il segnale dalle interferenze mantenendo costi e complessita\\' ragionevoli. La fibra ottica sarebbe immune al 100% ma e\\' piu\\' costosa e complessa da installare.',
          '')">
          <input type="radio" name="q4"> <span>Cat6 schermato (STP)</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'b',
          '',
          'La fibra ottica e\\' immune alle EMI, ma e\\' una soluzione sovradimensionata e costosa per la maggior parte degli ambienti industriali. Un cavo Cat6 schermato (STP) offre una protezione adeguata a costi inferiori.')">
          <input type="radio" name="q4"> <span>Fibra ottica</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">5.</span> Devi supportare 10 Gigabit su una distanza di 30 metri. Qual e' il cavo minimo richiesto?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'b',
          '',
          'Sbagliato. Il Cat5e supporta al massimo 1 Gbps. Per 10 Gigabit serve almeno Cat6a.')">
          <input type="radio" name="q5"> <span>Cat5e</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'b',
          'Corretto! Il Cat6a supporta 10 Gbps fino a 100 metri. E\\' il cavo minimo che garantisce 10 Gigabit a 30m. Il Cat6 supporta 10G solo fino a 55m ma con meno margine di sicurezza.',
          '')">
          <input type="radio" name="q5"> <span>Cat6a</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'b',
          '',
          'Sbagliato. Il Cat7 supporta 10G ma e\\' sovradimensionato (e piu\\' costoso) per 30m. Il Cat6a e\\' sufficiente e piu\\' economico.')">
          <input type="radio" name="q5"> <span>Cat7</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(5, 'd', 'b',
          '',
          'Sbagliato. La fibra funzionerebbe ma e\\' eccessiva per 30m. Il Cat6a e\\' sufficiente e molto piu\\' pratico a questa distanza.')">
          <input type="radio" name="q5"> <span>Fibra ottica</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">6.</span> Quale connettore si usa per il cablaggio Ethernet in rame?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'a',
          'Corretto! L\\'RJ45 e\\' il connettore standard per Ethernet in rame. Ha 8 pin e si usa con tutti i cavi Cat5e, Cat6, Cat6a. E\\' il connettore che trovi su switch, PC e prese a muro.',
          '')">
          <input type="radio" name="q6"> <span>RJ45</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'a',
          '',
          'Sbagliato. L\\'RJ11 ha solo 4-6 pin ed e\\' usato per le linee telefoniche, non per Ethernet. Il connettore Ethernet e\\' l\\'RJ45.')">
          <input type="radio" name="q6"> <span>RJ11</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'a',
          '',
          'Sbagliato. L\\'SC e\\' un connettore per fibra ottica, non per cavi in rame. Il connettore Ethernet in rame e\\' l\\'RJ45.')">
          <input type="radio" name="q6"> <span>SC (fibra)</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6, 'd', 'a',
          '',
          'Sbagliato. L\\'USB e\\' un connettore per periferiche (tastiera, mouse, storage), non per il cablaggio di rete Ethernet.')">
          <input type="radio" name="q6"> <span>USB</span>
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

  const html = wrapQuiz("Cablaggio Strutturato", body);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
