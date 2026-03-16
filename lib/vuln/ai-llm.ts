import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>Cos'e' un LLM</h2>
      <p>
        Un <strong>Large Language Model (LLM)</strong> e' una rete neurale di grandi dimensioni addestrata su enormi
        quantita' di testo. Il suo funzionamento di base e' sorprendentemente semplice: dato un testo in input,
        il modello predice il <strong>token successivo</strong> piu' probabile. Ripetendo questo processo si genera
        testo coerente e articolato.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">Esempi:</strong> GPT (OpenAI), Claude (Anthropic), Gemini (Google) sono tutti LLM con miliardi di parametri.</li>
        <li><strong style="color:#38bdf8;">Token:</strong> Il testo viene suddiviso in unita' chiamate token (sub-word), non parole intere. Il modello lavora su questi frammenti.</li>
        <li><strong style="color:#38bdf8;">Probabilistico:</strong> Un LLM non "sa" le risposte: calcola probabilita' sul prossimo token, il che spiega perche' puo' generare risposte diverse ogni volta.</li>
        <li><strong style="color:#38bdf8;">Limiti:</strong> Gli LLM possono generare informazioni false ma plausibili (hallucination) e hanno una finestra di contesto limitata.</li>
      </ul>
    </div>

    <!-- Q1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">1.</span> Cosa sono i "token" nel contesto degli LLM?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'b',
          '',
          'Sbagliato. I token non corrispondono a parole intere. La tokenizzazione divide il testo in unita\\' sub-word: ad esempio, la parola \\'incredibile\\' potrebbe essere divisa in \\'incred\\' e \\'ibile\\'. Questo permette al modello di gestire parole mai viste combinando frammenti noti.')">
          <input type="radio" name="q1"> <span>Parole intere separate da spazi</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'b',
          'Corretto! I token sono unita\\' sub-word, cioe\\' frammenti di parole. Un algoritmo di tokenizzazione (come BPE) divide il testo in pezzi piu\\' piccoli delle parole. Questo approccio permette al modello di gestire parole rare o mai viste, combinando frammenti comuni.',
          '')">
          <input type="radio" name="q1"> <span>Unita' sub-word, frammenti di testo piu' piccoli delle parole</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'b',
          '',
          'Sbagliato. I singoli caratteri sarebbero troppo granulari e renderebbero le sequenze lunghissime. I token sono unita\\' sub-word: pezzi piu\\' grandi di un carattere ma spesso piu\\' piccoli di una parola intera.')">
          <input type="radio" name="q1"> <span>Singoli caratteri (lettere e simboli)</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1, 'd', 'b',
          '',
          'Sbagliato. I token non sono frasi intere. Sono unita\\' sub-word: frammenti di testo che tipicamente corrispondono a sillabe o parti di parole. Ogni parola puo\\' essere composta da uno o piu\\' token.')">
          <input type="radio" name="q1"> <span>Frasi intere o periodi</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">2.</span> Cosa significa il parametro "temperatura" in un LLM?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'b',
          '',
          'Sbagliato. La temperatura non ha nulla a che fare con l\\'hardware. E\\' un parametro di sampling che controlla quanto le risposte sono casuali e creative: temperatura bassa = risposte piu\\' prevedibili, temperatura alta = risposte piu\\' creative e varie.')">
          <input type="radio" name="q2"> <span>La temperatura fisica della GPU durante l'elaborazione</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'b',
          'Corretto! La temperatura controlla il grado di casualita\\' nella generazione del testo. Con temperatura bassa (es. 0.1), il modello sceglie quasi sempre il token piu\\' probabile, producendo risposte prevedibili e deterministiche. Con temperatura alta (es. 1.0), la distribuzione di probabilita\\' si appiattisce e il modello fa scelte piu\\' varie e creative.',
          '')">
          <input type="radio" name="q2"> <span>Controlla la casualita'/creativita' delle risposte generate</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'b',
          '',
          'Sbagliato. La temperatura non influenza la velocita\\' di risposta. E\\' un parametro che modifica la distribuzione di probabilita\\' dei token: temperatura alta = risposte piu\\' creative e casuali, temperatura bassa = risposte piu\\' conservative e prevedibili.')">
          <input type="radio" name="q2"> <span>La velocita' di elaborazione delle risposte</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(2, 'd', 'b',
          '',
          'Sbagliato. La temperatura non misura la precisione. E\\' un parametro di sampling che controlla quanto il modello esplora opzioni meno probabili: a temperatura 0 sceglie sempre il token piu\\' probabile, a temperatura alta considera anche token meno probabili, rendendo il testo piu\\' vario.')">
          <input type="radio" name="q2"> <span>Il livello di precisione delle risposte</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">3.</span> Cos'e' una "hallucination" di un LLM?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'c',
          '',
          'Sbagliato. Un bug nel codice sorgente e\\' un errore nel software del modello. L\\'hallucination e\\' diversa: e\\' quando il modello genera informazioni false ma plausibili e convincenti, come se \\'inventasse\\' fatti che non esistono.')">
          <input type="radio" name="q3"> <span>Un bug nel codice sorgente del modello</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'c',
          '',
          'Sbagliato. Un attacco informatico e\\' una cosa diversa. L\\'hallucination e\\' un comportamento intrinseco del modello: genera testo che suona corretto e plausibile ma contiene informazioni inventate o false, senza \\'sapere\\' che sta sbagliando.')">
          <input type="radio" name="q3"> <span>Un attacco informatico che manipola le risposte</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'c',
          'Corretto! L\\'hallucination e\\' quando un LLM genera informazioni plausibili ma false. Il modello non \\'capisce\\' se sta dicendo la verita\\': predice token probabili basandosi sui pattern appresi durante il training. Questo puo\\' produrre fatti inventati, citazioni inesistenti o dati falsi presentati con grande sicurezza.',
          '')">
          <input type="radio" name="q3"> <span>Informazioni plausibili ma false generate dal modello con sicurezza</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(3, 'd', 'c',
          '',
          'Sbagliato. L\\'hallucination non e\\' un messaggio di errore intenzionale. E\\' piu\\' subdola: il modello genera informazioni false ma le presenta come vere e plausibili, senza alcun avvertimento. Per questo e\\' importante verificare sempre le informazioni critiche.')">
          <input type="radio" name="q3"> <span>Un messaggio di errore quando il modello non sa la risposta</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">4.</span> Qual e' la differenza tra training e inference in un LLM?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'b',
          '',
          'Sbagliato. E\\' il contrario! Il training e\\' la fase piu\\' costosa: richiede enormi quantita\\' di dati, potenza di calcolo e settimane di elaborazione. L\\'inference (generazione delle risposte) e\\' relativamente veloce e meno costosa.')">
          <input type="radio" name="q4"> <span>Il training e' veloce, l'inference e' lenta e costosa</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'b',
          'Corretto! Il training e\\' la fase in cui il modello impara dai dati: analizza miliardi di testi e regola i suoi parametri (pesi) per predire meglio il token successivo. Richiede settimane di calcolo su migliaia di GPU. L\\'inference e\\' quando il modello gia\\' addestrato viene usato per generare risposte alle domande degli utenti.',
          '')">
          <input type="radio" name="q4"> <span>Training = apprendimento dai dati, Inference = generazione delle risposte</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'b',
          '',
          'Sbagliato. Non sono la stessa cosa. Il training e\\' la fase di apprendimento in cui il modello analizza enormi dataset e regola i suoi parametri. L\\'inference e\\' la fase operativa in cui il modello addestrato genera risposte per gli utenti.')">
          <input type="radio" name="q4"> <span>Sono la stessa cosa, solo nomi diversi</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(4, 'd', 'b',
          '',
          'Sbagliato. Training e inference non riguardano le dimensioni del modello. Il training e\\' il processo di apprendimento dai dati (durata: settimane), l\\'inference e\\' l\\'uso del modello addestrato per rispondere alle domande (durata: secondi).')">
          <input type="radio" name="q4"> <span>Training crea modelli piccoli, inference li ingrandisce</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">5.</span> Cos'e' la "context window" di un LLM?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'a',
          'Corretto! La context window e\\' il numero massimo di token che il modello puo\\' elaborare in un\\'unica interazione (input + output). Ad esempio, una context window di 128K token permette di analizzare documenti molto lunghi. I token che superano questo limite vengono semplicemente ignorati o troncati.',
          '')">
          <input type="radio" name="q5"> <span>Il numero massimo di token che il modello puo' elaborare contemporaneamente</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'a',
          '',
          'Sbagliato. La context window non e\\' l\\'interfaccia grafica. E\\' un concetto tecnico: indica quanti token il modello puo\\' \\'vedere\\' e processare in una singola interazione. Piu\\' grande e\\' la context window, piu\\' testo il modello puo\\' considerare.')">
          <input type="radio" name="q5"> <span>La finestra dell'interfaccia utente dove si scrive</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'a',
          '',
          'Sbagliato. La context window non riguarda la memoria del training. Indica il numero massimo di token che il modello puo\\' processare in un\\'unica conversazione (prompt + risposta). E\\' un limite architetturale del modello.')">
          <input type="radio" name="q5"> <span>La quantita' di dati usati durante il training</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(5, 'd', 'a',
          '',
          'Sbagliato. La context window non e\\' un intervallo temporale. E\\' il limite di token (unita\\' di testo) che il modello puo\\' elaborare in una singola richiesta. Modelli moderni hanno context window che vanno da 4K a oltre 1M token.')">
          <input type="radio" name="q5"> <span>Il tempo massimo per cui il modello puo' funzionare</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">6.</span> Perche' un LLM puo' dare risposte diverse alla stessa domanda?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'c',
          '',
          'Sbagliato. Il modello non impara dalla singola conversazione (a meno di fine-tuning esplicito). Le risposte variano perche\\' il processo di generazione e\\' probabilistico: il modello campiona tra i token piu\\' probabili, e il parametro temperatura influenza quanto questa scelta e\\' casuale.')">
          <input type="radio" name="q6"> <span>Perche' impara dalle conversazioni precedenti e cambia idea</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'c',
          '',
          'Sbagliato. Il modello non ha errori casuali nel codice. Le risposte diverse sono un comportamento intenzionale: il processo di generazione usa il campionamento probabilistico (sampling), e il parametro temperatura controlla quanta variabilita\\' viene introdotta nella scelta dei token.')">
          <input type="radio" name="q6"> <span>A causa di errori casuali nel software</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'c',
          'Corretto! Un LLM genera testo scegliendo il prossimo token da una distribuzione di probabilita\\'. Il campionamento probabilistico (sampling) fa si\\' che non venga sempre scelto il token piu\\' probabile. Il parametro temperatura amplifica o riduce questa variabilita\\': temperatura alta = piu\\' diversita\\', temperatura bassa = risposte piu\\' simili tra loro.',
          '')">
          <input type="radio" name="q6"> <span>Per il campionamento probabilistico e il parametro temperatura</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6, 'd', 'c',
          '',
          'Sbagliato. Il modello non accede a Internet in tempo reale (a meno di tool specifici). Le risposte variano per una ragione piu\\' fondamentale: il processo di generazione e\\' probabilistico. Ad ogni passo, il modello sceglie un token dalla distribuzione di probabilita\\', e la temperatura influenza quanto questa scelta e\\' casuale.')">
          <input type="radio" name="q6"> <span>Perche' cerca informazioni diverse su Internet ogni volta</span>
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

  const html = wrapQuiz("Cos\\'e\\' un LLM", body);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
