import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>I principali tipi di record DNS</h2>
      <p>
        Ogni dominio ha una serie di <strong>record DNS</strong> che ne definiscono il comportamento.
        I piu' importanti sono: <strong>A</strong> (mappa a IPv4), <strong>AAAA</strong> (mappa a IPv6),
        <strong>CNAME</strong> (alias verso un altro dominio), <strong>MX</strong> (server di posta),
        <strong>TXT</strong> (testo libero, usato per SPF/DKIM/DMARC), <strong>NS</strong> (nameserver autoritativi)
        e <strong>PTR</strong> (risoluzione inversa, da IP a nome).
      </p>
      <p style="margin-top: 0.5rem;">
        Esempio: il record <code>A esempio.it 93.184.216.34</code> dice che il dominio esempio.it
        corrisponde all'IP 93.184.216.34. Il record <code>MX esempio.it mail.esempio.it</code> indica
        che le email vanno consegnate al server mail.esempio.it.
      </p>
    </div>

    <!-- Domanda 1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">Q1.</span> Quale record mappa un dominio a un indirizzo IPv4?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'a',
          'Corretto! Il record A (Address) e\\' il tipo piu\\' comune e mappa un nome di dominio a un indirizzo IPv4 (es. 93.184.216.34).',
          'Sbagliato.')">
          <input type="radio" name="q1"> <span>A</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'a',
          'Corretto!',
          'Sbagliato. AAAA mappa a IPv6 (128 bit). Per IPv4 (32 bit) serve il record A.')">
          <input type="radio" name="q1"> <span>AAAA</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'a',
          'Corretto!',
          'Sbagliato. CNAME crea un alias verso un altro dominio. Per mappare un dominio a un IPv4 serve il record A.')">
          <input type="radio" name="q1"> <span>CNAME</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1, 'd', 'a',
          'Corretto!',
          'Sbagliato. MX indica il server di posta. Per mappare un dominio a un indirizzo IPv4 serve il record A.')">
          <input type="radio" name="q1"> <span>MX</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">Q2.</span> Vuoi che mail@tuodominio.it funzioni. Quale record configuri?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'c',
          'Corretto!',
          'Sbagliato. Il record A mappa a un IP. Per gestire la posta elettronica serve il record MX (Mail Exchange), che indica quale server riceve le email.')">
          <input type="radio" name="q2"> <span>A</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'c',
          'Corretto!',
          'Sbagliato. CNAME crea alias tra domini. Per la posta elettronica serve il record MX, che specifica il server di posta per il dominio.')">
          <input type="radio" name="q2"> <span>CNAME</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'c',
          'Corretto! Il record MX (Mail Exchange) indica ai server di posta di Internet quale server deve ricevere le email destinate al tuo dominio.',
          'Sbagliato.')">
          <input type="radio" name="q2"> <span>MX</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(2, 'd', 'c',
          'Corretto!',
          'Sbagliato. Il record TXT contiene testo libero (usato per SPF/DKIM). Per la posta serve il record MX.')">
          <input type="radio" name="q2"> <span>TXT</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">Q3.</span> Quale record crea un alias per un altro dominio?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'b',
          'Corretto!',
          'Sbagliato. Il record A mappa direttamente a un IP. Per creare un alias (es. www.esempio.it -> esempio.it) serve il record CNAME.')">
          <input type="radio" name="q3"> <span>A</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'b',
          'Corretto! CNAME (Canonical Name) crea un alias: permette di far puntare un dominio verso un altro dominio. Ad esempio, www.esempio.it CNAME esempio.it fa si\\' che www.esempio.it punti allo stesso server di esempio.it.',
          'Sbagliato.')">
          <input type="radio" name="q3"> <span>CNAME</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'b',
          'Corretto!',
          'Sbagliato. NS indica i nameserver autoritativi. Per creare un alias verso un altro dominio serve il record CNAME.')">
          <input type="radio" name="q3"> <span>NS</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(3, 'd', 'b',
          'Corretto!',
          'Sbagliato. PTR serve per la risoluzione inversa (da IP a nome). Per creare un alias serve il record CNAME.')">
          <input type="radio" name="q3"> <span>PTR</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">Q4.</span> Quale record mappa un dominio a un indirizzo IPv6?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'b',
          'Corretto!',
          'Sbagliato. Il record A mappa a IPv4 (32 bit). Per IPv6 (128 bit) serve il record AAAA.')">
          <input type="radio" name="q4"> <span>A</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'b',
          'Corretto! Il record AAAA (chiamato anche quad-A) mappa un nome di dominio a un indirizzo IPv6, come ad esempio 2001:0db8:85a3::8a2e:0370:7334.',
          'Sbagliato.')">
          <input type="radio" name="q4"> <span>AAAA</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'b',
          'Corretto!',
          'Sbagliato. Il record A6 non e\\' lo standard attuale. Per IPv6 si usa il record AAAA.')">
          <input type="radio" name="q4"> <span>A6</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(4, 'd', 'b',
          'Corretto!',
          'Sbagliato. Il record SRV specifica servizi disponibili. Per mappare a IPv6 serve il record AAAA.')">
          <input type="radio" name="q4"> <span>SRV</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">Q5.</span> Dove si configurano SPF, DKIM e DMARC?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'c',
          'Corretto!',
          'Sbagliato. I record MX gestiscono la posta. SPF, DKIM e DMARC vengono configurati nei record TXT, che possono contenere testo libero.')">
          <input type="radio" name="q5"> <span>Record MX</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'c',
          'Corretto!',
          'Sbagliato. I record A mappano a IP. SPF, DKIM e DMARC si configurano nei record TXT del dominio.')">
          <input type="radio" name="q5"> <span>Record A</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'c',
          'Corretto! SPF, DKIM e DMARC sono tutti configurati come record TXT nel DNS del dominio. Il record TXT permette di inserire testo libero, ideale per queste policy di autenticazione email.',
          'Sbagliato.')">
          <input type="radio" name="q5"> <span>Record TXT</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(5, 'd', 'c',
          'Corretto!',
          'Sbagliato. I record CNAME creano alias. SPF, DKIM e DMARC si configurano nei record TXT.')">
          <input type="radio" name="q5"> <span>Record CNAME</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">Q6.</span> Quale record serve per la risoluzione inversa (da IP a nome di dominio)?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'c',
          'Corretto!',
          'Sbagliato. Il record A fa la risoluzione diretta (nome -> IP). Per la risoluzione inversa (IP -> nome) serve il record PTR.')">
          <input type="radio" name="q6"> <span>A</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'c',
          'Corretto!',
          'Sbagliato. NS indica i nameserver. Per la risoluzione inversa (IP -> nome) serve il record PTR (Pointer).')">
          <input type="radio" name="q6"> <span>NS</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'c',
          'Corretto! Il record PTR (Pointer) permette la risoluzione inversa: dato un indirizzo IP, restituisce il nome di dominio associato. Viene usato spesso per la verifica dei server di posta.',
          'Sbagliato.')">
          <input type="radio" name="q6"> <span>PTR</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6, 'd', 'c',
          'Corretto!',
          'Sbagliato. SOA contiene informazioni sulla zona DNS. Per la risoluzione inversa serve il record PTR.')">
          <input type="radio" name="q6"> <span>SOA</span>
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

  const html = wrapQuiz("Record DNS", body);
  res.setHeader("Content-Type", "text/html");
  return res.status(200).send(html);
}
