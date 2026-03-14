import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>Leggere un output dig</h2>
      <p>
        Il comando <strong>dig</strong> (Domain Information Groper) e' uno degli strumenti piu' potenti
        per interrogare i server DNS dalla riga di comando. L'output di dig e' suddiviso in diverse sezioni:
        l'<strong>HEADER</strong> contiene i flag e lo status code della risposta, la <strong>QUESTION SECTION</strong>
        mostra la query effettuata, l'<strong>ANSWER SECTION</strong> contiene i record risolti,
        l'<strong>AUTHORITY SECTION</strong> elenca i nameserver autoritativi e l'<strong>ADDITIONAL SECTION</strong>
        fornisce informazioni aggiuntive come gli indirizzi IP dei nameserver.
      </p>
      <p style="margin-top: 0.5rem;">
        Gli status code principali sono: <strong>NOERROR</strong> (query riuscita),
        <strong>NXDOMAIN</strong> (il dominio non esiste) e <strong>SERVFAIL</strong>
        (il server DNS non e' riuscito a completare la query). Capire l'output di dig
        e' fondamentale per diagnosticare problemi DNS e verificare la configurazione dei record.
      </p>
    </div>

    <!-- Domanda 1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">Q1.</span> Nella ANSWER section vedi <code>esempio.it. 3600 IN A 93.184.216.34</code>. Cosa rappresenta il valore 3600?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'a',
          'Corretto! Il valore 3600 e\\' il TTL (Time To Live) espresso in secondi. Indica che il record puo\\' restare nella cache del resolver per 3600 secondi (1 ora) prima di dover essere richiesto nuovamente al server autoritativo.',
          'Sbagliato.')">
          <input type="radio" name="q1"> <span>Il TTL (Time To Live) in secondi</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'a',
          'Corretto!',
          'Sbagliato. 3600 non e\\' la porta. E\\' il TTL (Time To Live) in secondi, cioe\\' il tempo per cui il record puo\\' restare nella cache prima di scadere.')">
          <input type="radio" name="q1"> <span>La porta del server DNS</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'a',
          'Corretto!',
          'Sbagliato. 3600 non indica la dimensione della risposta. Rappresenta il TTL (Time To Live) in secondi: il tempo di validita\\' del record nella cache DNS.')">
          <input type="radio" name="q1"> <span>La dimensione della risposta in byte</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1, 'd', 'a',
          'Corretto!',
          'Sbagliato. 3600 non e\\' la priorita\\' del record. E\\' il TTL (Time To Live) in secondi, che indica per quanto tempo la risposta puo\\' essere conservata in cache.')">
          <input type="radio" name="q1"> <span>La priorita' del record</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">Q2.</span> Lo status della risposta dig e' NXDOMAIN. Cosa significa?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'b',
          'Corretto!',
          'Sbagliato. NXDOMAIN non indica un problema di rete. Significa Non-Existent Domain: il dominio richiesto non esiste nel sistema DNS.')">
          <input type="radio" name="q2"> <span>Il server DNS non e' raggiungibile</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'b',
          'Corretto! NXDOMAIN (Non-Existent Domain) significa che il dominio richiesto non esiste. Il server autoritativo ha confermato che non c\\'e\\' nessun record per quel nome di dominio nel DNS.',
          'Sbagliato.')">
          <input type="radio" name="q2"> <span>Il dominio non esiste</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'b',
          'Corretto!',
          'Sbagliato. NXDOMAIN non indica un record scaduto. Significa che il dominio non esiste affatto nel sistema DNS, come confermato dal server autoritativo.')">
          <input type="radio" name="q2"> <span>Il record DNS e' scaduto</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(2, 'd', 'b',
          'Corretto!',
          'Sbagliato. NXDOMAIN non indica una query riuscita (quello sarebbe NOERROR). Significa Non-Existent Domain: il dominio richiesto non esiste.')">
          <input type="radio" name="q2"> <span>La query e' stata completata con successo</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">Q3.</span> Quale sezione dell'output dig mostra i nameserver del dominio?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'c',
          'Corretto!',
          'Sbagliato. La ANSWER section contiene i record risolti (A, AAAA, CNAME, ecc.), non i nameserver. I nameserver autoritativi del dominio si trovano nell\\'AUTHORITY section.')">
          <input type="radio" name="q3"> <span>ANSWER section</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'c',
          'Corretto!',
          'Sbagliato. L\\'ADDITIONAL section contiene informazioni supplementari come gli indirizzi IP dei nameserver (record A/AAAA). I nameserver stessi sono elencati nell\\'AUTHORITY section.')">
          <input type="radio" name="q3"> <span>ADDITIONAL section</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'c',
          'Corretto! L\\'AUTHORITY section contiene i record NS (Name Server) che indicano quali server DNS sono autoritativi per il dominio. Questi sono i server che hanno l\\'informazione definitiva sui record del dominio.',
          'Sbagliato.')">
          <input type="radio" name="q3"> <span>AUTHORITY section</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(3, 'd', 'c',
          'Corretto!',
          'Sbagliato. L\\'HEADER non contiene record DNS specifici ma informazioni generali sulla risposta (status, flag, contatori). I nameserver si trovano nell\\'AUTHORITY section.')">
          <input type="radio" name="q3"> <span>HEADER section</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">Q4.</span> Nell'output vedi <code>Query time: 45 msec</code>. Cosa indica questo valore?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'a',
          'Corretto! Il Query time indica il tempo impiegato dal server DNS per restituire la risposta, espresso in millisecondi. Un valore basso (come 45 msec) indica una risposta rapida, mentre valori alti possono segnalare problemi di rete o di configurazione DNS.',
          'Sbagliato.')">
          <input type="radio" name="q4"> <span>Il tempo impiegato per ricevere la risposta DNS</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'a',
          'Corretto!',
          'Sbagliato. Il Query time non indica il TTL residuo. Rappresenta il tempo in millisecondi che il server DNS ha impiegato per restituire la risposta alla query.')">
          <input type="radio" name="q4"> <span>Il TTL residuo del record</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'a',
          'Corretto!',
          'Sbagliato. Il Query time non indica il tempo di connessione al sito web. E\\' il tempo in millisecondi per ricevere la risposta dal server DNS, non per caricare il sito.')">
          <input type="radio" name="q4"> <span>Il tempo di connessione al sito web</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">Q5.</span> Nell'output vedi <code>flags: qr rd ra</code>. Cosa significa il flag <code>rd</code>?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'b',
          'Corretto!',
          'Sbagliato. Il flag rd non indica che la risposta e\\' definitiva (quello sarebbe il flag aa - Authoritative Answer). rd sta per Recursion Desired, cioe\\' il client ha chiesto al server di eseguire una query ricorsiva.')">
          <input type="radio" name="q5"> <span>Response Definitive: la risposta e' definitiva</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'b',
          'Corretto! Il flag rd (Recursion Desired) indica che il client ha richiesto al server DNS di eseguire la risoluzione ricorsiva, cioe\\' di occuparsi dell\\'intera catena di query anziche\\' restituire solo un riferimento.',
          'Sbagliato.')">
          <input type="radio" name="q5"> <span>Recursion Desired: il client ha richiesto la ricorsione</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'b',
          'Corretto!',
          'Sbagliato. Il flag rd non indica il reindirizzamento DNS. Sta per Recursion Desired e significa che il client ha chiesto al server di effettuare una risoluzione ricorsiva per suo conto.')">
          <input type="radio" name="q5"> <span>Redirect Domain: il dominio e' stato reindirizzato</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(5, 'd', 'b',
          'Corretto!',
          'Sbagliato. Il flag rd non riguarda i dati della risposta. Sta per Recursion Desired, indicando che il client ha richiesto una query ricorsiva al server DNS.')">
          <input type="radio" name="q5"> <span>Response Data: la risposta contiene dati</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">Q6.</span> La ANSWER section e' vuota ma lo status e' NOERROR. Cosa potrebbe significare?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'c',
          'Corretto!',
          'Sbagliato. Se il dominio non esistesse, lo status sarebbe NXDOMAIN, non NOERROR. Una ANSWER vuota con NOERROR significa che il dominio esiste ma non ha record del tipo richiesto.')">
          <input type="radio" name="q6"> <span>Il dominio non esiste</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'c',
          'Corretto!',
          'Sbagliato. Un errore del server DNS produrrebbe uno status SERVFAIL, non NOERROR. La ANSWER vuota con NOERROR indica che il dominio esiste ma non ha il tipo di record richiesto.')">
          <input type="radio" name="q6"> <span>Il server DNS ha avuto un errore interno</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'c',
          'Corretto! NOERROR con ANSWER vuota significa che il dominio esiste (altrimenti sarebbe NXDOMAIN) ma non ha record del tipo richiesto. Ad esempio, potresti aver cercato un record AAAA (IPv6) per un dominio che ha solo un record A (IPv4).',
          'Sbagliato.')">
          <input type="radio" name="q6"> <span>Il dominio esiste ma non ha record del tipo richiesto</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6, 'd', 'c',
          'Corretto!',
          'Sbagliato. La cache non influisce sullo status code. NOERROR con ANSWER vuota indica che il dominio esiste ma non possiede record del tipo specifico che e\\' stato richiesto nella query.')">
          <input type="radio" name="q6"> <span>La risposta e' stata bloccata dalla cache</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <div id="result-box" class="result-box">
      <h2>Risultato</h2>
      <div class="big-score"></div>
      <div class="message"></div>
    </div>

    <div class="score-bar">
      <div>
        <span class="score" id="score">0 / 6</span>
        <span class="progress" id="progress" style="margin-left: 1rem;">0 di 6 completate</span>
      </div>
    </div>

    <script>QuizEngine.init(6);</script>
  `;

  const html = wrapQuiz("Leggere un output dig", body);
  res.setHeader("Content-Type", "text/html");
  return res.status(200).send(html);
}
