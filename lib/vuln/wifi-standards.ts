import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>Standard 802.11</h2>
      <p>
        L'evoluzione del WiFi dagli standard 802.11b fino a 802.11ax (WiFi 6) e 802.11be (WiFi 7).
        Bande di frequenza (2.4 GHz, 5 GHz, 6 GHz), canali, e tecnologie chiave come MIMO, MU-MIMO e OFDMA.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">802.11b/g:</strong> Standard a 2.4 GHz, velocita' fino a 11/54 Mbps. Ancora usati per compatibilita' legacy.</li>
        <li><strong style="color:#38bdf8;">802.11n (WiFi 4):</strong> Primo standard con MIMO e dual-band (2.4/5 GHz), fino a 600 Mbps.</li>
        <li><strong style="color:#38bdf8;">802.11ac (WiFi 5):</strong> Solo 5 GHz, MU-MIMO in downlink, fino a 6.9 Gbps teorici.</li>
        <li><strong style="color:#38bdf8;">802.11ax (WiFi 6/6E):</strong> OFDMA, MU-MIMO bidirezionale, banda 6 GHz con WiFi 6E.</li>
        <li><strong style="color:#38bdf8;">802.11be (WiFi 7):</strong> Multi-Link Operation, canali da 320 MHz, fino a 46 Gbps teorici.</li>
      </ul>
    </div>

    <!-- Q1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">1.</span> Quale standard WiFi ha introdotto il MIMO (antenne multiple, stream multipli)?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'b',
          '',
          'Sbagliato. 802.11g operava con una singola antenna e un singolo stream. Il MIMO e\\' stato introdotto con 802.11n (WiFi 4).')">
          <input type="radio" name="q1"> <span>802.11g</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'b',
          'Corretto! 802.11n (WiFi 4) ha introdotto il MIMO, permettendo l\\'uso di piu\\' antenne per trasmettere e ricevere stream multipli simultaneamente, aumentando drasticamente il throughput.',
          '')">
          <input type="radio" name="q1"> <span>802.11n / WiFi 4</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'b',
          '',
          'Sbagliato. 802.11ac (WiFi 5) ha migliorato il MIMO con MU-MIMO, ma il MIMO base e\\' stato introdotto con 802.11n (WiFi 4).')">
          <input type="radio" name="q1"> <span>802.11ac / WiFi 5</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1, 'd', 'b',
          '',
          'Sbagliato. 802.11ax (WiFi 6) ha aggiunto MU-MIMO bidirezionale e OFDMA, ma il MIMO e\\' nato con 802.11n (WiFi 4).')">
          <input type="radio" name="q1"> <span>802.11ax / WiFi 6</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">2.</span> Quanti canali non sovrapposti esistono nella banda 2.4 GHz?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'b',
          '',
          'Sbagliato. Ci sono 11-14 canali totali, ma solo 3 non si sovrappongono. Usare canali sovrapposti causa interferenza co-canale.')">
          <input type="radio" name="q2"> <span>11 canali</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'b',
          'Corretto! Solo 3 canali non sovrapposti: 1, 6 e 11. Ogni canale occupa circa 22 MHz, e la banda 2.4 GHz ha solo ~70 MHz utilizzabili. Questo e\\' il motivo per cui la 2.4 GHz e\\' molto congestionata.',
          '')">
          <input type="radio" name="q2"> <span>3 - canali 1, 6, 11</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'b',
          '',
          'Sbagliato. 6 canali non sovrapposti e\\' impossibile a 2.4 GHz. Lo spettro e\\' troppo stretto. Solo i canali 1, 6 e 11 non si sovrappongono.')">
          <input type="radio" name="q2"> <span>6 canali</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(2, 'd', 'b',
          '',
          'Sbagliato. 14 e\\' il numero massimo di canali totali (in Giappone), ma la maggior parte si sovrappone. Solo 3 (1, 6, 11) non interferiscono tra loro.')">
          <input type="radio" name="q2"> <span>14 canali</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">3.</span> Qual e' il principale vantaggio della banda 5 GHz rispetto alla 2.4 GHz?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'c',
          '',
          'Sbagliato. La 5 GHz ha una portata inferiore rispetto alla 2.4 GHz perche\\' le frequenze piu\\' alte vengono attenuate di piu\\' dagli ostacoli.')">
          <input type="radio" name="q3"> <span>Portata maggiore attraverso i muri</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'c',
          '',
          'Sbagliato. I dispositivi IoT spesso usano solo 2.4 GHz per il minor consumo energetico e la maggiore portata. La 5 GHz non e\\' migliore per IoT.')">
          <input type="radio" name="q3"> <span>Migliore compatibilita' con dispositivi IoT</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'c',
          'Corretto! La 5 GHz offre meno interferenza, molti piu\\' canali non sovrapposti (25+) e velocita\\' superiore a breve distanza. Lo svantaggio e\\' la minor penetrazione attraverso muri e ostacoli.',
          '')">
          <input type="radio" name="q3"> <span>Meno interferenza, piu' canali disponibili, velocita' superiore a corto raggio</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(3, 'd', 'c',
          '',
          'Sbagliato. La 5 GHz consuma energia comparabile alla 2.4 GHz. Il vantaggio e\\' la maggiore disponibilita\\' di canali e meno interferenza.')">
          <input type="radio" name="q3"> <span>Minor consumo energetico</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">4.</span> Cos'e' l'OFDMA introdotto con WiFi 6?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'b',
          '',
          'Sbagliato. OFDMA non riguarda la crittografia. E\\' una tecnologia di accesso al canale che divide la banda in Resource Units per trasmissioni simultanee.')">
          <input type="radio" name="q4"> <span>Un nuovo protocollo di crittografia per WiFi</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'b',
          'Corretto! OFDMA (Orthogonal Frequency-Division Multiple Access) divide il canale in sottounita\\' chiamate Resource Units (RU). Piu\\' client possono trasmettere simultaneamente, ciascuno usando la propria RU, riducendo la latenza e migliorando l\\'efficienza.',
          '')">
          <input type="radio" name="q4"> <span>Divide il canale in Resource Units permettendo a piu' client di trasmettere simultaneamente</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'b',
          '',
          'Sbagliato. Stai descrivendo il beamforming, non OFDMA. OFDMA divide il canale in Resource Units per consentire trasmissioni simultanee di piu\\' client.')">
          <input type="radio" name="q4"> <span>Una tecnica per concentrare il segnale verso un singolo client</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(4, 'd', 'b',
          '',
          'Sbagliato. Il channel bonding unisce canali adiacenti per aumentare la banda. OFDMA invece divide un singolo canale in Resource Units per piu\\' client.')">
          <input type="radio" name="q4"> <span>Un metodo per unire piu' canali in uno solo</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">5.</span> Qual e' il principale vantaggio della banda 6 GHz (WiFi 6E)?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'c',
          '',
          'Sbagliato. La 6 GHz ha una portata ancora inferiore alla 5 GHz. Il suo vantaggio e\\' lo spettro completamente pulito, senza interferenze legacy.')">
          <input type="radio" name="q5"> <span>Portata superiore rispetto alla 5 GHz</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'c',
          '',
          'Sbagliato. La 6 GHz e\\' accessibile solo ai dispositivi WiFi 6E e successivi. Il suo vantaggio e\\' proprio l\\'assenza di dispositivi legacy che causano interferenza.')">
          <input type="radio" name="q5"> <span>Compatibilita' con tutti i dispositivi WiFi esistenti</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'c',
          'Corretto! La banda 6 GHz e\\' completamente nuova e pulita: nessun dispositivo legacy, nessuna interferenza da microonde o Bluetooth. Solo dispositivi WiFi 6E e WiFi 7 possono usarla, garantendo prestazioni ottimali.',
          '')">
          <input type="radio" name="q5"> <span>Spettro completamente vuoto, nessuna interferenza legacy, solo dispositivi WiFi 6E/7</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(5, 'd', 'c',
          '',
          'Sbagliato. Il consumo energetico non e\\' il vantaggio della 6 GHz. Il vantaggio e\\' lo spettro pulito e l\\'enorme quantita\\' di canali disponibili senza interferenze.')">
          <input type="radio" name="q5"> <span>Minor consumo energetico rispetto alle altre bande</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">6.</span> Cos'e' il MU-MIMO?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'b',
          '',
          'Sbagliato. Stai descrivendo il MIMO tradizionale (SU-MIMO) che serve un client alla volta. MU-MIMO permette di comunicare con piu\\' client simultaneamente.')">
          <input type="radio" name="q6"> <span>Piu' antenne che trasmettono allo stesso client per aumentare la velocita'</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'b',
          'Corretto! MU-MIMO (Multi-User MIMO) permette all\\'AP di comunicare con piu\\' client contemporaneamente su stream separati, invece di servirli uno alla volta. WiFi 5 lo supporta solo in downlink, WiFi 6 lo estende anche in uplink.',
          '')">
          <input type="radio" name="q6"> <span>L'AP comunica con piu' client simultaneamente su stream separati, invece di uno alla volta</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'b',
          '',
          'Sbagliato. Stai descrivendo il channel bonding o il load balancing tra bande. MU-MIMO permette all\\'AP di servire piu\\' client contemporaneamente sugli stessi canali.')">
          <input type="radio" name="q6"> <span>Un metodo per usare 2.4 e 5 GHz contemporaneamente</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6, 'd', 'b',
          '',
          'Sbagliato. Stai descrivendo il mesh networking. MU-MIMO e\\' una tecnologia radio che permette all\\'AP di comunicare con piu\\' client contemporaneamente.')">
          <input type="radio" name="q6"> <span>Connessione tra piu' access point per estendere la copertura</span>
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

  const html = wrapQuiz("Standard 802.11", body);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
