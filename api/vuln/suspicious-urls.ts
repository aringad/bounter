import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../_auth";
import { wrapQuiz } from "./_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>Analisi URL: riconosci i link sospetti</h2>
      <p>
        Ogni URL e' composto da diverse parti: il <strong>protocollo</strong> (https://),
        il <strong>dominio</strong> (es. www.google.com), eventuali <strong>sottodomini</strong>,
        il <strong>percorso</strong> (es. /account) e i <strong>parametri</strong>.
      </p>
      <p style="margin-top:0.5rem">
        I truffatori usano diversi trucchi per mascherare i link malevoli:
        sottodomini ingannevoli (es. <code>google.com.sito-malevolo.ru</code>),
        caratteri simili (<code>rn</code> al posto di <code>m</code>),
        URL abbreviati che nascondono la destinazione reale,
        indirizzi IP al posto di nomi di dominio, e domini che sembrano legittimi
        ma non appartengono all'azienda reale.
      </p>
      <p style="margin-top:0.5rem">
        Per ogni URL mostrato, indica se e' <strong>sicuro</strong> o <strong>sospetto</strong>.
      </p>
    </div>

    <!-- Question 1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">Q1.</span> Questo URL e' sicuro o sospetto?</h3>
      <div style="background:#0f172a;border:1px solid #475569;border-radius:6px;padding:0.75rem 1rem;margin-bottom:0.75rem;font-family:monospace;font-size:0.85rem;color:#38bdf8;word-break:break-all;">
        https://www.google.com.login-verify.ru/account
      </div>
      <div class="options">
        <div class="option" data-value="safe" onclick="QuizEngine.check(1,'safe','suspicious','Corretto! Questo URL e\\' sicuro.','Sbagliato! Il dominio reale e\\' login-verify.ru, non google.com. La parte \\'google.com\\' e\\' solo un sottodominio usato per ingannare. Controlla sempre il dominio principale (quello subito prima del suffisso come .ru, .com, .it).')">
          <input type="radio" name="q1"> Sicuro
        </div>
        <div class="option" data-value="suspicious" onclick="QuizEngine.check(1,'suspicious','suspicious','Corretto! Il dominio reale e\\' login-verify.ru, non google.com. La parte \\'google.com\\' e\\' solo un sottodominio usato per ingannare. Controlla sempre il dominio principale prima del suffisso nazionale (.ru, .com, .it).','Sbagliato! Questo URL e\\' sospetto.')">
          <input type="radio" name="q1"> Sospetto
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Question 2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">Q2.</span> Questo URL e' sicuro o sospetto?</h3>
      <div style="background:#0f172a;border:1px solid #475569;border-radius:6px;padding:0.75rem 1rem;margin-bottom:0.75rem;font-family:monospace;font-size:0.85rem;color:#38bdf8;word-break:break-all;">
        https://www.amazon.it/orders
      </div>
      <div class="options">
        <div class="option" data-value="safe" onclick="QuizEngine.check(2,'safe','safe','Corretto! Questo e\\' il vero sito Amazon Italia. Il dominio amazon.it e\\' legittimo, usa HTTPS, e il percorso /orders e\\' una pagina standard del sito.','Sbagliato! Questo URL e\\' sicuro.')">
          <input type="radio" name="q2"> Sicuro
        </div>
        <div class="option" data-value="suspicious" onclick="QuizEngine.check(2,'suspicious','safe','Sbagliato! Questo e\\' il vero sito Amazon Italia. Il dominio amazon.it e\\' legittimo, usa HTTPS, e il percorso /orders e\\' una pagina standard del sito.','Corretto! Questo URL e\\' sospetto.')">
          <input type="radio" name="q2"> Sospetto
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Question 3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">Q3.</span> Questo URL e' sicuro o sospetto?</h3>
      <div style="background:#0f172a;border:1px solid #475569;border-radius:6px;padding:0.75rem 1rem;margin-bottom:0.75rem;font-family:monospace;font-size:0.85rem;color:#38bdf8;word-break:break-all;">
        https://bit.ly/3xKf9a2
      </div>
      <div class="options">
        <div class="option" data-value="safe" onclick="QuizEngine.check(3,'safe','suspicious','Sbagliato! Gli URL abbreviati (bit.ly, tinyurl, ecc.) nascondono la destinazione reale. Non puoi sapere dove ti porteranno. Non cliccare mai su link abbreviati ricevuti via email o messaggi sospetti. Usa un servizio di anteprima come unshorten.me per verificarli.','Corretto! Questo URL e\\' sicuro.')">
          <input type="radio" name="q3"> Sicuro
        </div>
        <div class="option" data-value="suspicious" onclick="QuizEngine.check(3,'suspicious','suspicious','Corretto! Gli URL abbreviati (bit.ly, tinyurl, ecc.) nascondono la destinazione reale. Non puoi sapere dove ti porteranno. Non cliccare mai su link abbreviati ricevuti via email o messaggi sospetti. Usa un servizio di anteprima come unshorten.me per verificarli.','Sbagliato! Questo URL e\\' sospetto.')">
          <input type="radio" name="q3"> Sospetto
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Question 4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">Q4.</span> Questo URL e' sicuro o sospetto?</h3>
      <div style="background:#0f172a;border:1px solid #475569;border-radius:6px;padding:0.75rem 1rem;margin-bottom:0.75rem;font-family:monospace;font-size:0.85rem;color:#38bdf8;word-break:break-all;">
        https://www.arnazon.it/
      </div>
      <div class="options">
        <div class="option" data-value="safe" onclick="QuizEngine.check(4,'safe','suspicious','Sbagliato! Guarda bene: non e\\' \\'amazon\\' ma \\'arnazon\\'. Le lettere \\'rn\\' insieme sembrano una \\'m\\'. Questo trucco si chiama typosquatting o attacco omografico. Controlla sempre lettera per lettera i domini sospetti.','Corretto! Questo URL e\\' sicuro.')">
          <input type="radio" name="q4"> Sicuro
        </div>
        <div class="option" data-value="suspicious" onclick="QuizEngine.check(4,'suspicious','suspicious','Corretto! Non e\\' \\'amazon\\' ma \\'arnazon\\'. Le lettere \\'rn\\' insieme sembrano una \\'m\\'. Questo trucco si chiama typosquatting o attacco omografico. Controlla sempre lettera per lettera i domini sospetti.','Sbagliato! Questo URL e\\' sospetto.')">
          <input type="radio" name="q4"> Sospetto
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Question 5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">Q5.</span> Questo URL e' sicuro o sospetto?</h3>
      <div style="background:#0f172a;border:1px solid #475569;border-radius:6px;padding:0.75rem 1rem;margin-bottom:0.75rem;font-family:monospace;font-size:0.85rem;color:#38bdf8;word-break:break-all;">
        https://secure-banking.com/intesasanpaolo/login
      </div>
      <div class="options">
        <div class="option" data-value="safe" onclick="QuizEngine.check(5,'safe','suspicious','Sbagliato! Il dominio reale e\\' secure-banking.com, che non e\\' il sito ufficiale di Intesa Sanpaolo (intesasanpaolo.com). Il percorso /intesasanpaolo/login e\\' solo un tentativo di sembrare legittimo. Verifica sempre che il dominio corrisponda esattamente al sito ufficiale della banca.','Corretto! Questo URL e\\' sicuro.')">
          <input type="radio" name="q5"> Sicuro
        </div>
        <div class="option" data-value="suspicious" onclick="QuizEngine.check(5,'suspicious','suspicious','Corretto! Il dominio reale e\\' secure-banking.com, che non e\\' il sito ufficiale di Intesa Sanpaolo (intesasanpaolo.com). Il percorso /intesasanpaolo/login e\\' solo un tentativo di sembrare legittimo. Verifica sempre che il dominio corrisponda esattamente al sito ufficiale della banca.','Sbagliato! Questo URL e\\' sospetto.')">
          <input type="radio" name="q5"> Sospetto
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Question 6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">Q6.</span> Questo URL e' sicuro o sospetto?</h3>
      <div style="background:#0f172a;border:1px solid #475569;border-radius:6px;padding:0.75rem 1rem;margin-bottom:0.75rem;font-family:monospace;font-size:0.85rem;color:#38bdf8;word-break:break-all;">
        https://www.paypal.com/signin
      </div>
      <div class="options">
        <div class="option" data-value="safe" onclick="QuizEngine.check(6,'safe','safe','Corretto! Questo e\\' il vero sito PayPal. Il dominio paypal.com e\\' legittimo, usa HTTPS, e /signin e\\' la pagina di accesso ufficiale.','Sbagliato! Questo URL e\\' sicuro.')">
          <input type="radio" name="q6"> Sicuro
        </div>
        <div class="option" data-value="suspicious" onclick="QuizEngine.check(6,'suspicious','safe','Sbagliato! Questo e\\' il vero sito PayPal. Il dominio paypal.com e\\' legittimo, usa HTTPS, e /signin e\\' la pagina di accesso ufficiale.','Corretto! Questo URL e\\' sospetto.')">
          <input type="radio" name="q6"> Sospetto
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Question 7 -->
    <div class="question" id="q-7">
      <h3><span class="q-number">Q7.</span> Questo URL e' sicuro o sospetto?</h3>
      <div style="background:#0f172a;border:1px solid #475569;border-radius:6px;padding:0.75rem 1rem;margin-bottom:0.75rem;font-family:monospace;font-size:0.85rem;color:#38bdf8;word-break:break-all;">
        http://192.168.1.1/admin
      </div>
      <div class="options">
        <div class="option" data-value="safe" onclick="QuizEngine.check(7,'safe','suspicious','Sbagliato! Un URL con un indirizzo IP al posto del nome di dominio e\\' sospetto. I siti legittimi usano nomi di dominio registrati, non indirizzi IP. Inoltre, usa HTTP senza crittografia. Anche se 192.168.x.x e\\' un IP di rete locale, in un link ricevuto via email e\\' un segnale di allarme.','Corretto! Questo URL e\\' sicuro.')">
          <input type="radio" name="q7"> Sicuro
        </div>
        <div class="option" data-value="suspicious" onclick="QuizEngine.check(7,'suspicious','suspicious','Corretto! Un URL con un indirizzo IP al posto del nome di dominio e\\' sospetto. I siti legittimi usano nomi di dominio registrati, non indirizzi IP. Inoltre, usa HTTP senza crittografia. Anche se 192.168.x.x e\\' un IP di rete locale, in un link ricevuto via email e\\' un segnale di allarme.','Sbagliato! Questo URL e\\' sospetto.')">
          <input type="radio" name="q7"> Sospetto
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Question 8 -->
    <div class="question" id="q-8">
      <h3><span class="q-number">Q8.</span> Questo URL e' sicuro o sospetto?</h3>
      <div style="background:#0f172a;border:1px solid #475569;border-radius:6px;padding:0.75rem 1rem;margin-bottom:0.75rem;font-family:monospace;font-size:0.85rem;color:#38bdf8;word-break:break-all;">
        https://login.microsoftonline.com/
      </div>
      <div class="options">
        <div class="option" data-value="safe" onclick="QuizEngine.check(8,'safe','safe','Corretto! login.microsoftonline.com e\\' il dominio ufficiale di Microsoft per l\\'autenticazione di Office 365 e Azure AD. Il sottodominio \\'login\\' e\\' parte legittima del dominio microsoftonline.com di proprieta\\' di Microsoft.','Sbagliato! Questo URL e\\' sicuro.')">
          <input type="radio" name="q8"> Sicuro
        </div>
        <div class="option" data-value="suspicious" onclick="QuizEngine.check(8,'suspicious','safe','Sbagliato! login.microsoftonline.com e\\' il dominio ufficiale di Microsoft per l\\'autenticazione di Office 365 e Azure AD. Il sottodominio \\'login\\' e\\' parte legittima del dominio microsoftonline.com di proprieta\\' di Microsoft.','Corretto! Questo URL e\\' sospetto.')">
          <input type="radio" name="q8"> Sospetto
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Result Box -->
    <div class="result-box" id="result-box">
      <h2>Quiz Completato!</h2>
      <div class="big-score"></div>
      <div class="message"></div>
    </div>

    <!-- Score Bar -->
    <div class="score-bar">
      <div><span class="score" id="score">0 / 8</span></div>
      <div class="progress" id="progress">0 di 8 completate</div>
    </div>

    <script>QuizEngine.init(8);</script>
  `;

  const html = wrapQuiz("Analisi URL Sospetti", body);
  res.setHeader("Content-Type", "text/html");
  return res.status(200).send(html);
}
