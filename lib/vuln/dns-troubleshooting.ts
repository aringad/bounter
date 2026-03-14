import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>Troubleshooting DNS</h2>
      <p>
        Il troubleshooting DNS richiede un approccio sistematico per identificare dove si trova il problema.
        La metodologia prevede diversi passaggi: prima verificare la <strong>connettivita' di rete</strong>
        di base (ping, accesso ad altri siti), poi controllare la <strong>configurazione DNS</strong> del
        dispositivo, quindi testare la <strong>risoluzione</strong> con strumenti come nslookup o dig,
        e infine verificare i <strong>record DNS</strong> specifici del dominio.
      </p>
      <p style="margin-top: 0.5rem;">
        Strumenti fondamentali per il troubleshooting sono: <strong>nslookup</strong> per query DNS rapide,
        <strong>dig</strong> per analisi dettagliate, <strong>ping</strong> per verificare la raggiungibilita',
        e <strong>ipconfig /flushdns</strong> (Windows) o <strong>dscacheutil -flushcache</strong> (macOS)
        per svuotare la cache DNS locale. Capire se il problema e' DNS o di altro tipo (firewall, HTTP, rete)
        e' il primo passo fondamentale per una diagnosi efficace.
      </p>
    </div>

    <!-- Domanda 1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">Q1.</span> Un sito web non si carica. Qual e' il primo passo da fare?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'c',
          'Corretto!',
          'Sbagliato. Cambiare server DNS e\\' un passaggio successivo. Il primo passo e\\' verificare la connettivita\\' di rete di base: se non hai connessione, nessun server DNS funzionera\\'.')">
          <input type="radio" name="q1"> <span>Cambiare il server DNS nelle impostazioni</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'c',
          'Corretto!',
          'Sbagliato. Svuotare la cache DNS puo\\' essere utile, ma prima devi verificare di avere connettivita\\' di rete. Se la rete non funziona, svuotare la cache non risolvera\\' nulla.')">
          <input type="radio" name="q1"> <span>Svuotare la cache DNS</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'c',
          'Corretto! Il primo passo nel troubleshooting e\\' sempre verificare la connettivita\\' di rete di base. Prova a raggiungere altri siti o a fare un ping verso un IP noto (es. 8.8.8.8). Se non hai connessione, il problema non e\\' DNS ma di rete.',
          'Sbagliato.')">
          <input type="radio" name="q1"> <span>Verificare di avere connettivita' di rete</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1, 'd', 'c',
          'Corretto!',
          'Sbagliato. Contattare il provider e\\' un\\'azione da fare dopo aver eseguito una diagnosi di base. Il primo passo e\\' verificare la connettivita\\' di rete per capire se il problema e\\' locale o esterno.')">
          <input type="radio" name="q1"> <span>Contattare il provider Internet</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">Q2.</span> <code>nslookup esempio.it</code> restituisce un indirizzo IP, ma il browser non carica il sito. Qual e' la causa piu' probabile?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'b',
          'Corretto!',
          'Sbagliato. Se nslookup restituisce un IP, il DNS funziona correttamente. Il problema e\\' a un livello diverso: potrebbe essere un blocco firewall, un problema HTTP/HTTPS sul server, o una porta chiusa.')">
          <input type="radio" name="q2"> <span>Il server DNS non funziona correttamente</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'b',
          'Corretto! Se nslookup risolve correttamente il dominio in un indirizzo IP, il DNS funziona. Il problema e\\' quindi a un altro livello: potrebbe essere un firewall che blocca la connessione, un problema con il server web (HTTP/HTTPS), una porta chiusa o un certificato SSL scaduto.',
          'Sbagliato.')">
          <input type="radio" name="q2"> <span>Un problema HTTP, firewall o di connessione al server, non DNS</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'b',
          'Corretto!',
          'Sbagliato. Se nslookup funziona, la cache DNS non e\\' il problema. La risoluzione avviene correttamente, quindi il problema e\\' a livello di connessione HTTP, firewall o server web.')">
          <input type="radio" name="q2"> <span>La cache DNS del browser e' corrotta</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(2, 'd', 'b',
          'Corretto!',
          'Sbagliato. Il record DNS non e\\' necessariamente sbagliato: nslookup ha restituito un IP. Il problema e\\' probabilmente a livello HTTP, firewall o server web, non di risoluzione DNS.')">
          <input type="radio" name="q2"> <span>Il record DNS punta a un indirizzo IP sbagliato</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">Q3.</span> nslookup funziona usando 8.8.8.8 come server DNS ma non con il DNS aziendale. Cosa indica questo?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'b',
          'Corretto!',
          'Sbagliato. Se la query funziona con 8.8.8.8, il dominio esiste e i record sono corretti. Il problema e\\' specifico del server DNS aziendale, che potrebbe essere mal configurato, sovraccarico o avere una policy di blocco.')">
          <input type="radio" name="q3"> <span>Il dominio non esiste nel DNS globale</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'b',
          'Corretto! Se la risoluzione funziona con un DNS pubblico (8.8.8.8) ma non con il server DNS aziendale, il problema e\\' nel server DNS dell\\'azienda. Potrebbe essere down, mal configurato, avere la cache corrotta, o bloccare il dominio tramite una policy di sicurezza.',
          'Sbagliato.')">
          <input type="radio" name="q3"> <span>Il server DNS aziendale ha un problema</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'b',
          'Corretto!',
          'Sbagliato. Non e\\' un problema di connessione Internet generale: la query verso 8.8.8.8 funziona, quindi la rete e\\' raggiungibile. Il problema e\\' specifico del server DNS aziendale.')">
          <input type="radio" name="q3"> <span>La connessione Internet non funziona</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(3, 'd', 'b',
          'Corretto!',
          'Sbagliato. Il browser non c\\'entra in questo scenario: stiamo usando nslookup dalla riga di comando. Il problema e\\' che il server DNS aziendale non riesce a risolvere il dominio, mentre un DNS pubblico ci riesce.')">
          <input type="radio" name="q3"> <span>Il browser sta bloccando la richiesta</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">Q4.</span> Cosa fa il comando <code>ipconfig /flushdns</code>?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'c',
          'Corretto!',
          'Sbagliato. Il comando non cambia le impostazioni DNS. ipconfig /flushdns cancella la cache DNS locale del sistema operativo, rimuovendo tutti i record memorizzati e forzando nuove query al server DNS.')">
          <input type="radio" name="q4"> <span>Cambia il server DNS nelle impostazioni di rete</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'c',
          'Corretto!',
          'Sbagliato. Il comando non resetta la connessione Internet. ipconfig /flushdns svuota specificamente la cache DNS locale, eliminando tutti i record DNS memorizzati dal sistema operativo.')">
          <input type="radio" name="q4"> <span>Resetta la connessione Internet</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'c',
          'Corretto! ipconfig /flushdns cancella tutti i record DNS memorizzati nella cache locale del sistema operativo Windows. Dopo il flush, le successive richieste DNS verranno inviate direttamente al server DNS configurato, ottenendo risposte aggiornate. Su macOS il comando equivalente e\\' dscacheutil -flushcache.',
          'Sbagliato.')">
          <input type="radio" name="q4"> <span>Cancella la cache DNS locale del sistema</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(4, 'd', 'c',
          'Corretto!',
          'Sbagliato. Il comando non mostra le statistiche DNS. ipconfig /flushdns serve a svuotare la cache DNS locale del sistema operativo, rimuovendo tutti i record DNS precedentemente memorizzati.')">
          <input type="radio" name="q4"> <span>Mostra le statistiche delle query DNS</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">Q5.</span> Un sito web funziona se accedi tramite indirizzo IP ma non usando il nome di dominio. Dov'e' il problema?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'b',
          'Corretto!',
          'Sbagliato. Se il sito funziona tramite IP, il server web e\\' attivo. Il problema e\\' nella risoluzione DNS: il nome di dominio non viene tradotto correttamente nell\\'indirizzo IP del server.')">
          <input type="radio" name="q5"> <span>Il server web non e' attivo</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'b',
          'Corretto! Se il sito funziona con l\\'indirizzo IP diretto ma non con il nome di dominio, il server web e\\' attivo e raggiungibile. Il problema e\\' esclusivamente nella risoluzione DNS: il nome di dominio non viene tradotto correttamente nell\\'indirizzo IP. Bisogna verificare la configurazione DNS, la cache locale e i record del dominio.',
          'Sbagliato.')">
          <input type="radio" name="q5"> <span>La risoluzione DNS</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'b',
          'Corretto!',
          'Sbagliato. Se riesci ad accedere tramite IP, il firewall non sta bloccando la connessione. Il problema e\\' nella risoluzione DNS: il dominio non viene tradotto nell\\'indirizzo IP corretto.')">
          <input type="radio" name="q5"> <span>Il firewall blocca la connessione</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(5, 'd', 'b',
          'Corretto!',
          'Sbagliato. Un certificato SSL scaduto mostrerebbe un errore specifico nel browser, non un mancato caricamento. Se il sito funziona con IP ma non con il dominio, il problema e\\' nella risoluzione DNS.')">
          <input type="radio" name="q5"> <span>Il certificato SSL e' scaduto</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">Q6.</span> Hai aggiunto un nuovo record DNS ma i client vedono ancora il vecchio indirizzo IP. Cosa dovresti controllare?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'c',
          'Corretto!',
          'Sbagliato. Riavviare i client non e\\' la soluzione. Il problema e\\' il TTL (Time To Live) dei record: i resolver e i client conservano il vecchio record in cache fino alla scadenza del TTL. Bisogna aspettare la propagazione o svuotare le cache.')">
          <input type="radio" name="q6"> <span>Se i client sono stati riavviati</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'c',
          'Corretto!',
          'Sbagliato. Il certificato SSL non influisce sulla risoluzione DNS. Il problema e\\' il TTL e la propagazione: i resolver mantengono in cache il vecchio record fino alla scadenza del TTL. Bisogna attendere la propagazione o svuotare le cache.')">
          <input type="radio" name="q6"> <span>Se il certificato SSL e' valido</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'c',
          'Corretto! Quando aggiungi o modifichi un record DNS, la propagazione non e\\' istantanea. I resolver e i client mantengono il vecchio record in cache per la durata del TTL (Time To Live) precedente. Bisogna attendere la scadenza del TTL, oppure svuotare manualmente la cache DNS dei client e dei resolver intermedi.',
          'Sbagliato.')">
          <input type="radio" name="q6"> <span>Il TTL del vecchio record e il tempo di propagazione della cache</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6, 'd', 'c',
          'Corretto!',
          'Sbagliato. La versione del browser non influisce sulla risoluzione DNS. Il problema e\\' che i resolver mantengono in cache il vecchio record fino alla scadenza del TTL. Bisogna controllare il TTL e attendere la propagazione.')">
          <input type="radio" name="q6"> <span>Se il browser e' aggiornato all'ultima versione</span>
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

  const html = wrapQuiz("Troubleshooting DNS", body);
  res.setHeader("Content-Type", "text/html");
  return res.status(200).send(html);
}
