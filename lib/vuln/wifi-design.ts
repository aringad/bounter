import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>Progettazione e Roaming</h2>
      <p>
        Site survey, posizionamento degli AP, pianificazione della copertura, roaming con
        802.11r/k/v e controller WiFi. Una progettazione corretta e' la differenza tra una rete
        WiFi che funziona e una che genera continue lamentele dagli utenti.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">Site Survey:</strong> Analisi pre-installazione per determinare numero, posizione e configurazione ottimale degli AP.</li>
        <li><strong style="color:#38bdf8;">Overlap:</strong> Sovrapposizione del 15-20% tra AP adiacenti per garantire roaming senza interruzioni.</li>
        <li><strong style="color:#38bdf8;">802.11r/k/v:</strong> Protocolli per il roaming veloce, la selezione intelligente dell'AP e il bilanciamento del carico.</li>
        <li><strong style="color:#38bdf8;">Sticky Client:</strong> Problema comune: il client resta agganciato a un AP lontano invece di passare a uno piu' vicino.</li>
        <li><strong style="color:#38bdf8;">Controller WiFi:</strong> Gestione centralizzata degli AP per configurazione, aggiornamenti e ottimizzazione automatica.</li>
      </ul>
    </div>

    <!-- Q1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">1.</span> Cos'e' un site survey?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'b',
          '',
          'Sbagliato. Un test di velocita\\' verifica le prestazioni dopo l\\'installazione. Il site survey e\\' l\\'analisi pre-installazione per pianificare numero, posizione e configurazione degli AP.')">
          <input type="radio" name="q1"> <span>Un test di velocita' della rete WiFi esistente</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'b',
          'Corretto! Il site survey e\\' l\\'analisi pre-installazione che determina il numero ottimale di AP, la loro posizione e configurazione. Include la mappatura degli ostacoli, le fonti di interferenza e le esigenze di copertura. Evita zone morte e problemi post-installazione.',
          '')">
          <input type="radio" name="q1"> <span>Analisi pre-installazione per determinare numero, posizione e configurazione ottimale degli AP</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'b',
          '',
          'Sbagliato. L\\'inventario degli AP e\\' un\\'attivita\\' di gestione della rete. Il site survey e\\' l\\'analisi del sito prima dell\\'installazione per pianificare la copertura WiFi ottimale.')">
          <input type="radio" name="q1"> <span>Un inventario di tutti gli AP installati</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1, 'd', 'b',
          '',
          'Sbagliato. L\\'aggiornamento firmware e\\' manutenzione ordinaria. Il site survey e\\' l\\'analisi preliminare che pianifica dove e come installare gli AP per la miglior copertura.')">
          <input type="radio" name="q1"> <span>L'aggiornamento del firmware di tutti gli AP</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">2.</span> Quanta sovrapposizione (overlap) devono avere gli AP adiacenti per il roaming?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'b',
          '',
          'Sbagliato. Il 5% e\\' troppo poco: ci sarebbero zone morte tra gli AP dove il client perde la connessione durante il roaming. Serve il 15-20%.')">
          <input type="radio" name="q2"> <span>5% di sovrapposizione</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'b',
          'Corretto! Gli AP adiacenti devono avere un overlap del 15-20% della copertura. Troppo poco causa zone morte durante il roaming, troppo causa interferenza co-canale. Il 15-20% e\\' il compromesso ottimale.',
          '')">
          <input type="radio" name="q2"> <span>15-20% di sovrapposizione</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'b',
          '',
          'Sbagliato. Il 50% e\\' eccessivo: causa forte interferenza co-canale tra gli AP adiacenti, degradando le prestazioni. L\\'overlap ottimale e\\' 15-20%.')">
          <input type="radio" name="q2"> <span>50% di sovrapposizione</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(2, 'd', 'b',
          '',
          'Sbagliato. Nessuna sovrapposizione significa zone morte tra gli AP. Il client perderebbe la connessione spostandosi tra le aree di copertura. Serve il 15-20%.')">
          <input type="radio" name="q2"> <span>Nessuna sovrapposizione, gli AP devono essere separati</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">3.</span> Cos'e' il problema dello "sticky client"?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'c',
          '',
          'Sbagliato. Un client che si disconnette frequentemente ha un problema diverso (interferenza, driver). Lo sticky client resta agganciato troppo a lungo a un AP lontano.')">
          <input type="radio" name="q3"> <span>Un client che si disconnette continuamente dalla rete</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'c',
          '',
          'Sbagliato. Un AP sovraccarico e\\' un problema di capacita\\'. Lo sticky client e\\' un client che resta connesso a un AP lontano con segnale debole invece di passare a uno piu\\' vicino.')">
          <input type="radio" name="q3"> <span>Un AP che accetta troppi client contemporaneamente</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'c',
          'Corretto! Lo sticky client resta agganciato a un AP distante con segnale debole, invece di effettuare il roaming verso un AP piu\\' vicino con segnale migliore. I protocolli 802.11k/v aiutano a risolvere il problema suggerendo al client di spostarsi.',
          '')">
          <input type="radio" name="q3"> <span>Il client resta agganciato a un AP lontano con segnale debole invece di passare a uno piu' vicino</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(3, 'd', 'c',
          '',
          'Sbagliato. La riconnessione lenta dopo il sleep e\\' un problema di power management. Lo sticky client e\\' quello che resta su un AP lontano rifiutando il roaming.')">
          <input type="radio" name="q3"> <span>Un client che impiega troppo tempo a riconnettersi dopo lo sleep</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">4.</span> Cosa fa il protocollo 802.11r?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'b',
          '',
          'Sbagliato. L\\'aumento della velocita\\' di trasmissione dipende dallo standard WiFi (ac, ax). 802.11r riduce il tempo di autenticazione durante il roaming tra AP.')">
          <input type="radio" name="q4"> <span>Aumenta la velocita' di trasmissione del WiFi</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'b',
          'Corretto! 802.11r (Fast BSS Transition) pre-negozia le chiavi di sicurezza con gli AP vicini, riducendo il tempo di autenticazione durante il roaming da circa 200ms a meno di 50ms. Essenziale per applicazioni real-time come VoIP e videochiamata.',
          '')">
          <input type="radio" name="q4"> <span>Fast BSS Transition - riduce il tempo di autenticazione durante il roaming da 200ms a meno di 50ms</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'b',
          '',
          'Sbagliato. Stai descrivendo 802.11k (neighbor report) o 802.11v (BSS transition management). 802.11r riguarda specificatamente la velocita\\' di riautenticazione durante il roaming.')">
          <input type="radio" name="q4"> <span>Aiuta il client a scegliere l'AP migliore</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(4, 'd', 'b',
          '',
          'Sbagliato. La crittografia e\\' gestita da WPA2/WPA3. 802.11r si occupa di velocizzare il processo di riautenticazione durante il passaggio tra AP.')">
          <input type="radio" name="q4"> <span>Migliora la crittografia del traffico WiFi</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">5.</span> Quale materiale causa la maggiore attenuazione del segnale WiFi?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'c',
          '',
          'Sbagliato. Il legno causa un\\'attenuazione moderata di circa 3-5 dB. I muri in cemento armato o pietra causano attenuazioni molto superiori, fino a 25-35 dB.')">
          <input type="radio" name="q5"> <span>Legno - circa 3-5 dB di attenuazione</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'c',
          '',
          'Sbagliato. Il vetro causa un\\'attenuazione di circa 2-4 dB (normale) o 6-10 dB (vetro metallizzato). I muri in cemento armato o pietra sono molto peggio.')">
          <input type="radio" name="q5"> <span>Vetro - circa 2-4 dB di attenuazione</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'c',
          'Corretto! I muri in cemento armato (-15/-25 dB) e in pietra (-20/-35 dB) causano le attenuazioni piu\\' severe. L\\'armatura metallica nel cemento agisce come una gabbia di Faraday parziale, bloccando gran parte del segnale WiFi.',
          '')">
          <input type="radio" name="q5"> <span>Muri in cemento armato (-15/-25 dB) o pietra (-20/-35 dB)</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(5, 'd', 'c',
          '',
          'Sbagliato. Il cartongesso causa un\\'attenuazione minima di circa 1-3 dB. I materiali piu\\' attenuanti sono il cemento armato e la pietra.')">
          <input type="radio" name="q5"> <span>Cartongesso - circa 1-3 dB di attenuazione</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">6.</span> Qual e' la regola pratica per la densita' degli AP in un ufficio?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'c',
          '',
          'Sbagliato. 1 AP per piano e\\' insufficiente nella maggior parte dei casi. La regola pratica e\\' 1 AP per 20-25 utenti, montato a soffitto in posizione centrale.')">
          <input type="radio" name="q6"> <span>1 AP per piano dell'edificio</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'c',
          '',
          'Sbagliato. 1 AP per 100 utenti e\\' troppo poco: le prestazioni sarebbero pessime con troppi client sullo stesso AP. La regola e\\' 1 AP per 20-25 utenti.')">
          <input type="radio" name="q6"> <span>1 AP per 100 utenti</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'c',
          'Corretto! La regola pratica e\\' 1 AP per 20-25 utenti, montato a soffitto in posizione centrale per massimizzare la copertura. A soffitto il segnale si propaga meglio senza ostacoli come mobili e persone.',
          '')">
          <input type="radio" name="q6"> <span>1 AP per 20-25 utenti, montato a soffitto, in posizione centrale</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6, 'd', 'c',
          '',
          'Sbagliato. 1 AP per 5 utenti e\\' eccessivo nella maggior parte dei casi e causerebbe interferenza co-canale tra troppi AP vicini. La regola e\\' 1 AP per 20-25 utenti.')">
          <input type="radio" name="q6"> <span>1 AP per 5 utenti</span>
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

  const html = wrapQuiz("Progettazione e Roaming", body);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
