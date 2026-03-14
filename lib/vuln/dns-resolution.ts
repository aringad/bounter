import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>Come funziona la risoluzione DNS</h2>
      <p>
        Il <strong>DNS (Domain Name System)</strong> e' il sistema che traduce i nomi di dominio
        (come www.esempio.it) in indirizzi IP. La risoluzione segue una gerarchia precisa:
        il browser contatta un <strong>resolver DNS locale</strong>, che a sua volta puo' interrogare
        i <strong>root server</strong> (.), i <strong>TLD server</strong> (.it, .com) e infine i
        <strong>server autoritativi</strong> del dominio specifico.
      </p>
      <p style="margin-top: 0.5rem;">
        Esistono due modalita' di risoluzione: nella <strong>ricorsiva</strong> il resolver si occupa
        dell'intera catena di query per conto del client; nella <strong>iterativa</strong> il resolver
        riceve riferimenti e deve contattare i server successivi autonomamente. Per velocizzare il processo,
        i risultati vengono salvati in <strong>cache</strong> per un tempo definito dal <strong>TTL (Time To Live)</strong>.
      </p>
    </div>

    <!-- Domanda 1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">Q1.</span> Qual e' il primo passo quando digiti www.esempio.it nel browser?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'b',
          'Corretto!',
          'Sbagliato. Il browser non contatta direttamente un root server: il primo passo e\\' chiedere al resolver DNS locale (configurato nel sistema operativo o nel router).')">
          <input type="radio" name="q1"> <span>Il browser contatta direttamente un root server</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'b',
          'Corretto! Il browser chiede prima al resolver DNS locale (del sistema operativo o del router/ISP), che si occupa di risolvere il nome per conto del client.',
          'Sbagliato.')">
          <input type="radio" name="q1"> <span>Il browser chiede al resolver DNS locale</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'b',
          'Corretto!',
          'Sbagliato. Il browser non contatta direttamente il server web: deve prima risolvere il nome di dominio in un indirizzo IP tramite il resolver DNS.')">
          <input type="radio" name="q1"> <span>Il browser contatta direttamente il server web di esempio.it</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1, 'd', 'b',
          'Corretto!',
          'Sbagliato. Il TLD server viene contattato dal resolver in un passaggio successivo, non direttamente dal browser.')">
          <input type="radio" name="q1"> <span>Il browser interroga il TLD server per .it</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">Q2.</span> Il resolver non ha la risposta in cache. Chi contatta prima?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'a',
          'Corretto! Quando il resolver non ha la risposta in cache, inizia dalla cima della gerarchia DNS contattando un root server, che lo indirizzera\\' verso il TLD server appropriato.',
          'Sbagliato.')">
          <input type="radio" name="q2"> <span>Un root server</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'a',
          'Corretto!',
          'Sbagliato. Il TLD server viene contattato dopo il root server. La gerarchia e\\': root server -> TLD server -> server autoritativo.')">
          <input type="radio" name="q2"> <span>Il TLD server per .it</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'a',
          'Corretto!',
          'Sbagliato. Il server autoritativo di esempio.it e\\' l\\'ultimo della catena. Il resolver deve prima passare per root server e TLD server.')">
          <input type="radio" name="q2"> <span>Il server autoritativo di esempio.it</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(2, 'd', 'a',
          'Corretto!',
          'Sbagliato. Google DNS (8.8.8.8) e\\' un resolver alternativo, non fa parte della catena di risoluzione gerarchica.')">
          <input type="radio" name="q2"> <span>Il DNS di Google (8.8.8.8)</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">Q3.</span> Cosa risponde il root server per una query su un dominio .it?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'b',
          'Corretto!',
          'Sbagliato. Il root server non conosce l\\'IP finale del dominio: conosce solo gli indirizzi dei TLD server e rimanda il resolver al server responsabile per .it.')">
          <input type="radio" name="q3"> <span>L'indirizzo IP finale del dominio richiesto</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'b',
          'Corretto! Il root server non risolve direttamente il dominio, ma indica al resolver l\\'indirizzo del TLD server responsabile per il dominio di primo livello .it.',
          'Sbagliato.')">
          <input type="radio" name="q3"> <span>L'indirizzo del TLD server per .it</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'b',
          'Corretto!',
          'Sbagliato. Il root server non restituisce un errore: risponde con un riferimento (referral) al TLD server appropriato.')">
          <input type="radio" name="q3"> <span>Un messaggio di errore NXDOMAIN</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">Q4.</span> Cosa significa TTL in un record DNS?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'c',
          'Corretto!',
          'Sbagliato. TTL non indica il tempo di risposta del server. Significa Time To Live e indica per quanto tempo un record DNS puo\\' restare nella cache prima di dover essere richiesto nuovamente.')">
          <input type="radio" name="q4"> <span>Il tempo massimo di risposta del server DNS</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'c',
          'Corretto!',
          'Sbagliato. TTL non riguarda la crittografia. Significa Time To Live e indica la durata di validita\\' di un record nella cache DNS.')">
          <input type="radio" name="q4"> <span>Il livello di crittografia della connessione DNS</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'c',
          'Corretto! TTL (Time To Live) indica per quanti secondi un record DNS puo\\' restare nella cache del resolver prima di essere considerato scaduto e dover essere richiesto di nuovo al server autoritativo.',
          'Sbagliato.')">
          <input type="radio" name="q4"> <span>Time To Live: quanto tempo il record resta in cache</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(4, 'd', 'c',
          'Corretto!',
          'Sbagliato. TTL non ha a che fare con il numero di hop. Significa Time To Live e specifica la durata della cache per un record DNS.')">
          <input type="radio" name="q4"> <span>Il numero massimo di hop nella rete</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">Q5.</span> Qual e' la differenza tra risoluzione ricorsiva e iterativa?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'a',
          'Corretto! Nella risoluzione ricorsiva il resolver si occupa di tutta la catena di query per conto del client. Nella iterativa, il resolver riceve solo dei riferimenti (referral) e deve contattare ogni server successivo autonomamente.',
          'Sbagliato.')">
          <input type="radio" name="q5"> <span>Ricorsiva: il resolver fa tutto il lavoro; Iterativa: il resolver riceve riferimenti e prosegue da solo</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'a',
          'Corretto!',
          'Sbagliato. La differenza non riguarda la velocita\\' ma il modello di delega: nella ricorsiva il resolver fa tutto per conto del client, nella iterativa riceve riferimenti passo dopo passo.')">
          <input type="radio" name="q5"> <span>Ricorsiva e\\' piu\\' veloce; Iterativa e\\' piu\\' lenta</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'a',
          'Corretto!',
          'Sbagliato. Entrambe le modalita\\' usano la stessa gerarchia DNS. La differenza e\\' nel modello di delega: ricorsiva = il resolver fa tutto; iterativa = il resolver riceve riferimenti.')">
          <input type="radio" name="q5"> <span>Ricorsiva usa un solo server; Iterativa ne usa molti</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(5, 'd', 'a',
          'Corretto!',
          'Sbagliato. Non c\\'e\\' differenza di sicurezza intrinseca. La distinzione e\\': ricorsiva = il resolver gestisce tutto; iterativa = il resolver segue i riferimenti passo dopo passo.')">
          <input type="radio" name="q5"> <span>Ricorsiva e\\' piu\\' sicura; Iterativa e\\' meno sicura</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">Q6.</span> A cosa serve la cache DNS?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'b',
          'Corretto!',
          'Sbagliato. La cache DNS non protegge da attacchi. Serve a velocizzare le risposte salvando temporaneamente i risultati delle query gia\\' effettuate.')">
          <input type="radio" name="q6"> <span>Proteggere il DNS da attacchi esterni</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'b',
          'Corretto! La cache DNS salva le risposte gia\\' ottenute per un tempo definito dal TTL. Quando lo stesso dominio viene richiesto di nuovo, il resolver puo\\' rispondere immediatamente senza ripetere l\\'intera catena di risoluzione.',
          'Sbagliato.')">
          <input type="radio" name="q6"> <span>Velocizzare le risposte evitando di ripetere l'intera risoluzione</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'b',
          'Corretto!',
          'Sbagliato. La cache DNS non cripta le query. Serve a memorizzare temporaneamente le risposte per evitare di ripetere la risoluzione completa.')">
          <input type="radio" name="q6"> <span>Criptare le query DNS per maggiore sicurezza</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6, 'd', 'b',
          'Corretto!',
          'Sbagliato. La cache non blocca domini: serve a salvare temporaneamente le risposte DNS gia\\' ottenute per velocizzare le query successive.')">
          <input type="radio" name="q6"> <span>Bloccare i domini pericolosi automaticamente</span>
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

  const html = wrapQuiz("Risoluzione DNS", body);
  res.setHeader("Content-Type", "text/html");
  return res.status(200).send(html);
}
