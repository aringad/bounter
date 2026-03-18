import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>Regole Firewall</h2>
      <p>
        Un firewall controlla il traffico di rete in base a regole predefinite, decidendo quali pacchetti
        possono passare (ALLOW) e quali devono essere bloccati (DENY). Comprendere come funzionano le regole
        firewall e' fondamentale per la sicurezza di qualsiasi infrastruttura di rete.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">Stateless:</strong> Esamina ogni pacchetto singolarmente, senza contesto sulla connessione. Semplice ma meno intelligente.</li>
        <li><strong style="color:#38bdf8;">Stateful:</strong> Traccia lo stato delle connessioni attive. Se permette una connessione in uscita, accetta automaticamente le risposte in ingresso.</li>
        <li><strong style="color:#38bdf8;">Ordine delle regole:</strong> Le regole vengono valutate dall'alto verso il basso: la prima regola che corrisponde viene applicata (first-match wins).</li>
        <li><strong style="color:#38bdf8;">Default Deny:</strong> Best practice: bloccare tutto per default e permettere esplicitamente solo il traffico necessario (whitelist approach).</li>
      </ul>
    </div>

    <!-- Q1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">1.</span> Per bloccare tutti gli accessi SSH in ingresso, quale regola serve?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'b',
          '',
          'Sbagliato. La porta 80 e\\' usata da HTTP (traffico web), non da SSH. Per bloccare SSH serve una regola DENY sul traffico inbound alla porta TCP 22.')">
          <input type="radio" name="q1"> <span>DENY inbound TCP porta 80</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'b',
          'Corretto! SSH opera sulla porta TCP 22. Per bloccare tutti gli accessi SSH in ingresso serve una regola DENY per il traffico inbound (in ingresso) sulla porta TCP 22. Questo impedisce a chiunque dall\\'esterno di connettersi via SSH al sistema.',
          '')">
          <input type="radio" name="q1"> <span>DENY inbound TCP porta 22</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'b',
          '',
          'Sbagliato. Una regola ALLOW permette il traffico, non lo blocca. Inoltre outbound si riferisce al traffico in uscita, non a quello in ingresso. Serve DENY inbound TCP porta 22.')">
          <input type="radio" name="q1"> <span>ALLOW outbound TCP porta 22</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1, 'd', 'b',
          '',
          'Sbagliato. La porta 443 e\\' usata da HTTPS per il traffico web sicuro, non da SSH. Bloccare la porta 443 impedirebbe la navigazione web. Per SSH serve DENY inbound TCP porta 22.')">
          <input type="radio" name="q1"> <span>DENY inbound TCP porta 443</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">2.</span> Cos'e' un firewall stateful?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'b',
          '',
          'Sbagliato. Un firewall che esamina ogni pacchetto singolarmente senza tenere traccia delle connessioni e\\' un firewall stateless (packet filter). Il firewall stateful e\\' piu\\' avanzato perche\\' traccia lo stato delle connessioni attive.')">
          <input type="radio" name="q2"> <span>Un firewall che esamina ogni pacchetto singolarmente senza contesto</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'b',
          'Corretto! Un firewall stateful mantiene una tabella delle connessioni attive (state table). Quando permette una connessione in uscita, traccia il suo stato e accetta automaticamente i pacchetti di risposta in ingresso senza bisogno di regole inbound esplicite. Questo e\\' piu\\' sicuro e pratico rispetto a un firewall stateless.',
          '')">
          <input type="radio" name="q2"> <span>Traccia lo stato delle connessioni e accetta automaticamente il traffico di ritorno</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'b',
          '',
          'Sbagliato. Un firewall stateful non cripta il traffico: la crittografia e\\' compito di VPN e protocolli come TLS/SSL. Il firewall stateful traccia le connessioni attive per gestire intelligentemente il traffico di ritorno.')">
          <input type="radio" name="q2"> <span>Un firewall che cripta tutto il traffico in transito</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(2, 'd', 'b',
          '',
          'Sbagliato. L\\'ispezione del contenuto a livello applicativo e\\' compito di un firewall di livello 7 (WAF - Web Application Firewall). Un firewall stateful opera a livello di trasporto tracciando lo stato delle connessioni.')">
          <input type="radio" name="q2"> <span>Un firewall che analizza il contenuto dei pacchetti a livello applicativo</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">3.</span> Regole in ordine: 1) ALLOW TCP porta 80, 2) DENY ALL. Il traffico web puo' passare?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'a',
          'Corretto! I firewall applicano la prima regola che corrisponde al traffico (first-match wins). Il traffico sulla porta 80 corrisponde alla regola 1 (ALLOW), quindi viene permesso prima che la regola 2 (DENY ALL) venga mai valutata. L\\'ordine delle regole e\\' fondamentale nella configurazione di un firewall!',
          '')">
          <input type="radio" name="q3"> <span>Si', la prima regola corrispondente vince</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'a',
          '',
          'Sbagliato. La regola DENY ALL non sovrascrive le regole precedenti. I firewall applicano il principio first-match: la prima regola che corrisponde al traffico viene applicata, e le successive vengono ignorate per quel pacchetto. La porta 80 matcha la regola 1.')">
          <input type="radio" name="q3"> <span>No, DENY ALL blocca tutto indipendentemente dall'ordine</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'a',
          '',
          'Sbagliato. Non c\\'e\\' conflitto: il firewall applica semplicemente la prima regola corrispondente in ordine sequenziale. Per la porta 80, la regola 1 (ALLOW) viene trovata per prima e il traffico e\\' permesso.')">
          <input type="radio" name="q3"> <span>Genera un errore di conflitto tra le regole</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">4.</span> Per permettere solo traffico HTTPS in uscita, quale porta e direzione?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'c',
          '',
          'Sbagliato. La porta 80 e\\' per HTTP non crittografato, non HTTPS. Inoltre inbound e\\' il traffico in ingresso, non in uscita. Per HTTPS in uscita serve ALLOW outbound TCP porta 443.')">
          <input type="radio" name="q4"> <span>ALLOW inbound TCP porta 80</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'c',
          '',
          'Sbagliato. HTTPS usa TCP, non UDP. La direzione outbound e\\' corretta, ma il protocollo di trasporto deve essere TCP. Serve ALLOW outbound TCP porta 443.')">
          <input type="radio" name="q4"> <span>ALLOW outbound UDP porta 443</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'c',
          'Corretto! HTTPS usa TCP sulla porta 443. Outbound indica il traffico in uscita dal sistema verso l\\'esterno. Questa regola permette al sistema di navigare su siti HTTPS ma non consente connessioni HTTP (porta 80) ne\\' altri protocolli non autorizzati.',
          '')">
          <input type="radio" name="q4"> <span>ALLOW outbound TCP porta 443</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(4, 'd', 'c',
          '',
          'Sbagliato. La porta 8443 e\\' una porta alternativa non standard talvolta usata per HTTPS. La porta standard HTTPS e\\' la 443. Serve ALLOW outbound TCP porta 443.')">
          <input type="radio" name="q4"> <span>ALLOW outbound TCP porta 8443</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">5.</span> Cos'e' la policy "default deny"?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'c',
          '',
          'Sbagliato. Permettere tutto e poi bloccare specifici servizi e\\' l\\'approccio opposto: si chiama default allow (o blacklist). E\\' meno sicuro perche\\' un servizio dimenticato resta esposto. Default deny blocca tutto per default.')">
          <input type="radio" name="q5"> <span>Permettere tutto il traffico e bloccare solo servizi specifici</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'c',
          '',
          'Sbagliato. La policy default deny non riguarda la registrazione del traffico (logging), ma la decisione di base su cosa fare con il traffico. Default deny significa bloccare tutto cio\\' che non e\\' esplicitamente permesso da una regola.')">
          <input type="radio" name="q5"> <span>Registrare tutto il traffico negato in un log</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'c',
          'Corretto! La policy default deny (o whitelist approach) blocca tutto il traffico per default. Solo il traffico esplicitamente permesso dalle regole ALLOW puo\\' passare. Questo e\\' l\\'approccio piu\\' sicuro: se dimentichi di aggiungere una regola, il traffico viene bloccato anziche\\' permesso, riducendo la superficie di attacco.',
          '')">
          <input type="radio" name="q5"> <span>Bloccare tutto il traffico non esplicitamente permesso</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(5, 'd', 'c',
          '',
          'Sbagliato. Negare solo il traffico da IP sconosciuti e\\' una regola specifica e parziale, non una policy generale. Default deny blocca TUTTO il traffico che non corrisponde a una regola ALLOW esplicita, indipendentemente dall\\'IP di origine.')">
          <input type="radio" name="q5"> <span>Negare l'accesso solo da indirizzi IP sconosciuti</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">6.</span> Un web server deve essere pubblico (HTTPS) ma l'accesso SSH limitato all'IP dell'ufficio. Con policy default deny, quante regole ALLOW servono come minimo?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'b',
          '',
          'Sbagliato. Una sola regola non basta perche\\' i due servizi hanno requisiti di accesso diversi: HTTPS deve essere raggiungibile da qualsiasi IP, mentre SSH solo dall\\'IP dell\\'ufficio. Servono almeno 2 regole ALLOW distinte.')">
          <input type="radio" name="q6"> <span>1</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'b',
          'Corretto! Servono almeno 2 regole ALLOW: 1) ALLOW inbound TCP porta 443 da qualsiasi IP (per rendere il web server accessibile al pubblico), 2) ALLOW inbound TCP porta 22 solo dall\\'IP dell\\'ufficio (per l\\'amministrazione SSH). Con una policy default deny, tutto il resto viene bloccato automaticamente senza regole aggiuntive.',
          '')">
          <input type="radio" name="q6"> <span>2</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'b',
          '',
          'Sbagliato. 3 regole sono piu\\' del minimo necessario. Bastano 2 regole ALLOW: una per HTTPS (porta 443 da any) e una per SSH (porta 22 dall\\'IP ufficio). La regola DENY ALL fa parte della policy di default e non conta come regola aggiuntiva.')">
          <input type="radio" name="q6"> <span>3</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6, 'd', 'b',
          '',
          'Sbagliato. 4 regole sono eccessive per questo scenario. Bastano 2 regole ALLOW: una per HTTPS da qualsiasi IP e una per SSH dall\\'IP dell\\'ufficio. Il principio e\\' sempre: minimo privilegio necessario.')">
          <input type="radio" name="q6"> <span>4</span>
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

  const html = wrapQuiz("Regole Firewall", body);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
