import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const html = wrapQuiz("Quiz: Strumenti AI nel Lavoro", `
    <div class="intro">
      <h2>Strumenti AI nel Lavoro</h2>
      <p>
        Gli strumenti di intelligenza artificiale stanno trasformando il modo di lavorare: dalla scrittura
        alla programmazione, dall\\'analisi dati alla traduzione. Ma sono assistenti, non sostituti.
      </p>
      <p style="margin-top:0.5rem">
        Capire i limiti dell\\'AI e\\u0027 fondamentale per usarla in modo efficace e responsabile.
        In questo quiz verificheremo la tua conoscenza pratica degli strumenti AI piu\\u0027 diffusi
        e delle best practice per integrarli nel lavoro quotidiano.
      </p>
    </div>

    <!-- Domanda 1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">Domanda 1.</span> Per quale compito l\\'AI e\\u0027 piu\\u0027 affidabile oggi?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'b',
          'Corretto!',
          'Sbagliato. La ricerca di fatti specifici e\\u0027 uno dei punti deboli dell\\u0027AI: puo\\u0027 generare informazioni plausibili ma false (allucinazioni). I compiti dove eccelle sono riassumere e tradurre testi, dove il contenuto di partenza e\\u0027 gia\\u0027 fornito.')">
          <input type="radio" name="q1" value="a"> a) Ricerca di fatti storici verificati
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'b',
          'Corretto! L\\u0027AI eccelle nel riassumere e tradurre testi perche\\u0027 lavora su contenuto gia\\u0027 fornito, senza dover &quot;inventare&quot; informazioni. E\\u0027 un compito di trasformazione, non di creazione di conoscenza.',
          'Sbagliato.')">
          <input type="radio" name="q1" value="b"> b) Riassumere e tradurre testi esistenti
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'b',
          'Corretto!',
          'Sbagliato. La consulenza legale richiede precisione assoluta e conoscenza aggiornata delle normative. L\\u0027AI puo\\u0027 commettere errori gravi in questo ambito. I compiti piu\\u0027 affidabili sono quelli di trasformazione del testo, come riassunti e traduzioni.')">
          <input type="radio" name="q1" value="c"> c) Fornire consulenza legale dettagliata
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1, 'd', 'b',
          'Corretto!',
          'Sbagliato. Le diagnosi mediche richiedono competenze specialistiche e responsabilita\\u0027 professionale. L\\u0027AI non e\\u0027 affidabile per questo. Eccelle invece nel riassumere e tradurre testi, dove lavora su contenuto fornito dall\\u0027utente.')">
          <input type="radio" name="q1" value="d"> d) Diagnosi mediche accurate
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">Domanda 2.</span> Devi scrivere un report tecnico. Come usi l\\'AI al meglio?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'b',
          'Corretto!',
          'Sbagliato. Copiare e incollare senza revisione e\\u0027 rischioso: l\\u0027AI puo\\u0027 generare informazioni imprecise, tono inappropriato o struttura inadeguata. L\\u0027approccio migliore e\\u0027 usare l\\u0027AI per una bozza iniziale e poi rivedere tutto con attenzione.')">
          <input type="radio" name="q2" value="a"> a) Copi e incolli direttamente l'output dell'AI
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'b',
          'Corretto! L\\u0027AI e\\u0027 eccellente per generare bozze iniziali, superare il blocco della pagina bianca e strutturare le idee. Ma il contenuto finale deve sempre essere rivisto, verificato e adattato da un essere umano con competenza nel dominio.',
          'Sbagliato.')">
          <input type="radio" name="q2" value="b"> b) Fai generare una bozza all'AI, poi la rivedi e verifichi personalmente
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'b',
          'Corretto!',
          'Sbagliato. Evitare completamente l\\u0027AI significa perdere un assistente utile. L\\u0027approccio migliore e\\u0027 usarla per generare una bozza iniziale e poi applicare la tua competenza per rivedere, correggere e migliorare il risultato.')">
          <input type="radio" name="q2" value="c"> c) Non usi l'AI: il report deve essere 100% tuo
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(2, 'd', 'b',
          'Corretto!',
          'Sbagliato. Delegare la revisione a un\\u0027altra AI non risolve il problema: anche la seconda AI puo\\u0027 avere gli stessi limiti. Serve sempre una revisione umana competente per garantire accuratezza e qualita\\u0027.')">
          <input type="radio" name="q2" value="d"> d) Fai scrivere il report all'AI e lo fai revisionare da un'altra AI
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">Domanda 3.</span> Cos\\'e\\u0027 GitHub Copilot?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'c',
          'Corretto!',
          'Sbagliato. GitHub Copilot non e\\u0027 un sistema di backup. E\\u0027 un assistente AI per la programmazione che suggerisce codice in tempo reale basandosi sul contesto del tuo progetto, i commenti e il codice gia\\u0027 scritto.')">
          <input type="radio" name="q3" value="a"> a) Un sistema di backup automatico per il codice
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'c',
          'Corretto!',
          'Sbagliato. GitHub Copilot non e\\u0027 un tool per la gestione dei repository. E\\u0027 un assistente AI integrato nell\\u0027editor che suggerisce completamenti di codice basandosi sul contesto, i commenti e i pattern del tuo progetto.')">
          <input type="radio" name="q3" value="b"> b) Un tool per gestire i repository GitHub
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'c',
          'Corretto! GitHub Copilot e\\u0027 un assistente AI per la programmazione che si integra direttamente nell\\u0027editor di codice. Analizza il contesto (codice esistente, commenti, nomi di funzioni) e suggerisce completamenti in tempo reale. E\\u0027 utile per velocizzare la scrittura, ma il codice suggerito va sempre verificato.',
          'Sbagliato.')">
          <input type="radio" name="q3" value="c"> c) Un assistente AI che suggerisce codice basandosi sul contesto del progetto
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(3, 'd', 'c',
          'Corretto!',
          'Sbagliato. GitHub Copilot non sostituisce i test: suggerisce codice, non lo verifica. E\\u0027 un assistente AI che propone completamenti basandosi sul contesto. Il codice suggerito va comunque testato e revisionato dallo sviluppatore.')">
          <input type="radio" name="q3" value="d"> d) Un programma che esegue i test al posto dello sviluppatore
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">Domanda 4.</span> Qual e\\u0027 il limite principale degli strumenti AI per l\\'analisi dati?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'b',
          'Corretto!',
          'Sbagliato. L\\u0027AI puo\\u0027 lavorare con grandi volumi di dati. Il problema principale e\\u0027 un altro: puo\\u0027 generare statistiche e correlazioni inventate (allucinazioni) che sembrano plausibili. Ogni output va verificato con competenza nel dominio.')">
          <input type="radio" name="q4" value="a"> a) Non possono elaborare grandi quantita' di dati
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'b',
          'Corretto! L\\u0027AI puo\\u0027 &quot;allucinare&quot; statistiche: generare numeri, percentuali e correlazioni che sembrano credibili ma sono completamente inventati. Non e\\u0027 un sostituto della competenza nel dominio. Ogni dato e ogni conclusione va verificata con le fonti originali.',
          'Sbagliato.')">
          <input type="radio" name="q4" value="b"> b) Possono inventare statistiche plausibili ma false, serve sempre verifica umana
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'b',
          'Corretto!',
          'Sbagliato. L\\u0027AI funziona con diversi tipi di dati. Il rischio principale e\\u0027 che puo\\u0027 generare statistiche e analisi che sembrano corrette ma sono inventate. Servono competenza nel dominio e verifica delle fonti.')">
          <input type="radio" name="q4" value="c"> c) Funzionano solo con dati numerici, non testuali
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(4, 'd', 'b',
          'Corretto!',
          'Sbagliato. L\\u0027AI e\\u0027 velocissima nell\\u0027elaborazione. Il vero problema e\\u0027 l\\u0027affidabilita\\u0027: puo\\u0027 generare statistiche inventate che sembrano credibili. Ogni output richiede verifica con competenza specifica nel dominio.')">
          <input type="radio" name="q4" value="d"> d) Sono troppo lente per analisi in tempo reale
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">Domanda 5.</span> Un collega dice "l\\'AI ha detto che..." come fonte autorevole in una riunione. E\\u0027 corretto?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'c',
          'Corretto!',
          'Sbagliato. L\\u0027AI non e\\u0027 una fonte autorevole indipendentemente dal modello. Non ha accesso a verita\\u0027 assolute: genera risposte probabilistiche basate sui dati di addestramento. Ogni informazione va sempre verificata con fonti primarie.')">
          <input type="radio" name="q5" value="a"> a) Si', se usa un modello AI avanzato come GPT-4
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'c',
          'Corretto!',
          'Sbagliato. L\\u0027AI non e\\u0027 una fonte autorevole in nessun caso. Non basta verificare &quot;ogni tanto&quot;: ogni affermazione basata sull\\u0027AI va verificata con fonti primarie prima di essere presentata come fatto.')">
          <input type="radio" name="q5" value="b"> b) Si', ma meglio verificare ogni tanto
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'c',
          'Corretto! L\\u0027AI non e\\u0027 una fonte: e\\u0027 uno strumento che genera testo probabilistico. Non &quot;sa&quot; le cose, produce risposte plausibili. Citare &quot;l\\u0027AI ha detto&quot; in una riunione ha lo stesso valore di &quot;l\\u0027ho letto su internet&quot;. Bisogna sempre risalire alle fonti primarie e verificabili.',
          'Sbagliato.')">
          <input type="radio" name="q5" value="c"> c) No, l'AI non e' una fonte: va sempre verificato con fonti primarie
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(5, 'd', 'c',
          'Corretto!',
          'Sbagliato. Il problema non e\\u0027 il contesto (riunione vs. email): l\\u0027AI non e\\u0027 mai una fonte autorevole. Le sue risposte vanno sempre verificate con fonti primarie, indipendentemente da dove vengono citate.')">
          <input type="radio" name="q5" value="d"> d) Dipende dal contesto: in riunione no, via email si'
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">Domanda 6.</span> Quale best practice per usare strumenti AI in azienda?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'b',
          'Corretto!',
          'Sbagliato. Dare accesso a tutti senza regole e\\u0027 rischioso: qualcuno potrebbe condividere dati sensibili con tool AI esterni. Servono linee guida chiare, verifica degli output e regole su quali dati si possono condividere.')">
          <input type="radio" name="q6" value="a"> a) Dare a tutti accesso libero senza restrizioni
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'b',
          'Corretto! Le best practice per l\\u0027AI in azienda includono: stabilire linee guida chiare sull\\u0027uso, verificare sempre gli output, non condividere dati sensibili o riservati con tool AI esterni, e usare l\\u0027AI come assistente, non come oracolo infallibile.',
          'Sbagliato.')">
          <input type="radio" name="q6" value="b"> b) Stabilire linee guida, verificare gli output e non condividere dati sensibili
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'b',
          'Corretto!',
          'Sbagliato. Vietare completamente l\\u0027AI significa perdere vantaggi competitivi importanti. L\\u0027approccio migliore e\\u0027 adottarla con linee guida chiare: verificare gli output, non condividere dati sensibili e usarla come assistente.')">
          <input type="radio" name="q6" value="c"> c) Vietare l'uso dell'AI per motivi di sicurezza
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6, 'd', 'b',
          'Corretto!',
          'Sbagliato. Fidarsi ciecamente dell\\u0027AI e\\u0027 pericoloso: puo\\u0027 generare errori, allucinazioni e informazioni obsolete. L\\u0027approccio corretto e\\u0027 stabilire linee guida, verificare sempre gli output e non condividere dati riservati.')">
          <input type="radio" name="q6" value="d"> d) Fidarsi completamente: l'AI e' piu' accurata degli umani
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Result Box -->
    <div class="result-box" id="result-box">
      <h2>Quiz Completato!</h2>
      <div class="big-score">0%</div>
      <div class="message"></div>
    </div>

    <!-- Score Bar -->
    <div class="score-bar">
      <div>
        <span class="score" id="score">0 / 6</span>
        <span class="progress" id="progress" style="margin-left:1rem">0 di 6 completate</span>
      </div>
    </div>

    <script>QuizEngine.init(6);</script>
  `);

  res.setHeader("Content-Type", "text/html");
  return res.send(html);
}
