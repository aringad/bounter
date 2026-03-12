import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>Come analizzare il mittente di un'email</h2>
      <p>
        Il mittente di un'email e' uno dei primi elementi da controllare per riconoscere un tentativo di phishing.
        Ecco le tecniche piu' comuni usate dai truffatori:
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">Controllo del dominio:</strong> Verifica sempre il dominio dopo la @ &mdash; e' il vero indicatore dell'identita' del mittente.</li>
        <li><strong style="color:#38bdf8;">Errori di battitura:</strong> Cerca lettere aggiunte, mancanti o sostituite (es. <code>microsoftt.com</code>, <code>gogle.com</code>).</li>
        <li><strong style="color:#38bdf8;">Sostituzione di caratteri:</strong> Lo zero (0) al posto della O, la elle (l) al posto della i (I), oppure "rn" che sembra "m".</li>
        <li><strong style="color:#38bdf8;">TLD sbagliato:</strong> Un dominio <code>.ru</code> o <code>.xyz</code> al posto di <code>.it</code> o <code>.com</code> e' sospetto.</li>
        <li><strong style="color:#38bdf8;">Sottodomini ingannevoli:</strong> <code>amazon.evil.com</code> NON e' amazon.com &mdash; il dominio reale e' <code>evil.com</code>.</li>
        <li><strong style="color:#38bdf8;">Domini simili ma diversi:</strong> <code>intesa-sanpaolo.com</code> non e' <code>intesasanpaolo.com</code>.</li>
      </ul>
    </div>

    <!-- Domanda 1: Zero al posto della O -->
    <div class="question" id="q-1">
      <h3><span class="q-number">Domanda 1.</span> Quale di questi indirizzi e' il mittente legittimo di Poste Italiane?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1,'a','b','Sbagliato! L\\'indirizzo p0steitaliane.it usa uno zero (0) al posto della lettera O. Questo e\\' un classico trucco di sostituzione di caratteri per ingannare l\\'utente.','Sbagliato! L\\'indirizzo p0steitaliane.it usa uno zero (0) al posto della lettera O.')">
          <input type="radio" name="q1"> supporto@p0steitaliane.it
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1,'b','b','Corretto! Questo e\\' il dominio ufficiale di Poste Italiane con la lettera O corretta. L\\'altro indirizzo usava uno zero (0) al posto della O.','Corretto! Questo e\\' il dominio autentico di Poste Italiane.')">
          <input type="radio" name="q1"> supporto@posteitaliane.it
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 2: Lettere extra -->
    <div class="question" id="q-2">
      <h3><span class="q-number">Domanda 2.</span> Quale di questi indirizzi e' il mittente legittimo di Intesa Sanpaolo?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2,'a','a','Corretto! Il dominio ufficiale e\\' intesasanpaolo.com. L\\'altro indirizzo ha una T in piu\\' (intesasanpaolto.com), un errore subdolo difficile da notare.','Corretto! Questo e\\' il dominio ufficiale della banca.')">
          <input type="radio" name="q2"> info@intesasanpaolo.com
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2,'b','a','Sbagliato! L\\'indirizzo intesasanpaolto.com contiene una T extra prima del .com. Questo tipo di errore e\\' chiamato typosquatting: registrare domini con piccoli errori di battitura.','Sbagliato! Nota la T extra in sanpaolto.')">
          <input type="radio" name="q2"> info@intesasanpaolto.com
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 3: TLD sbagliato -->
    <div class="question" id="q-3">
      <h3><span class="q-number">Domanda 3.</span> Quale di questi indirizzi e' il mittente legittimo dell'Agenzia delle Entrate?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3,'a','b','Sbagliato! Il dominio agenziaentrate.ru usa il TLD .ru (Russia) invece di .gov.it. L\\'Agenzia delle Entrate e\\' un ente governativo italiano e usa esclusivamente domini .gov.it.','Sbagliato! Il TLD .ru indica un dominio russo, non italiano.')">
          <input type="radio" name="q3"> noreply@agenziaentrate.ru
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3,'b','b','Corretto! L\\'Agenzia delle Entrate usa il dominio governativo .gov.it. Diffida sempre di email da enti pubblici italiani con TLD diversi da .it o .gov.it.','Corretto! Il TLD .gov.it conferma che si tratta di un ente governativo italiano.')">
          <input type="radio" name="q3"> noreply@agenziaentrate.gov.it
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 4: Sottodominio ingannevole -->
    <div class="question" id="q-4">
      <h3><span class="q-number">Domanda 4.</span> Quale di questi indirizzi e' il mittente legittimo di Amazon Italia?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4,'a','a','Corretto! Il dominio amazon.it e\\' quello ufficiale. L\\'altro indirizzo usa un trucco con sottodomini: amazon.servizio-clienti.com appartiene in realta\\' al dominio servizio-clienti.com, non ad Amazon.','Corretto! Questo e\\' il dominio ufficiale di Amazon Italia.')">
          <input type="radio" name="q4"> ordini@amazon.it
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4,'b','a','Sbagliato! L\\'indirizzo amazon.servizio-clienti.com sembra legittimo, ma il dominio reale e\\' servizio-clienti.com. Amazon e\\' solo un sottodominio usato per ingannare. Il dominio vero e\\' sempre l\\'ultima parte prima del TLD.','Sbagliato! Il dominio reale qui e\\' servizio-clienti.com, non amazon.')">
          <input type="radio" name="q4"> ordini@amazon.servizio-clienti.com
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 5: Attacco omografico (rn sembra m) -->
    <div class="question" id="q-5">
      <h3><span class="q-number">Domanda 5.</span> Quale di questi indirizzi e' il mittente legittimo di Aruba?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5,'a','b','Sbagliato! L\\'indirizzo usa arnuba.it con le lettere rn al posto della m. Questo e\\' un attacco omografico: in molti font, \\'rn\\' appare visivamente identico a \\'m\\'. Guarda con attenzione!','Sbagliato! Le lettere rn in arnuba simulano la lettera m.')">
          <input type="radio" name="q5"> assistenza@arnuba.it
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5,'b','b','Corretto! aruba.it e\\' il dominio ufficiale. L\\'altro indirizzo usava il trucco omografico \\'rn\\' che in certi font appare identico alla lettera \\'m\\'.','Corretto! Questo e\\' il dominio autentico di Aruba.')">
          <input type="radio" name="q5"> assistenza@aruba.it
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 6: Dominio simile ma diverso -->
    <div class="question" id="q-6">
      <h3><span class="q-number">Domanda 6.</span> Quale di questi indirizzi e' il mittente legittimo di UniCredit?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6,'a','b','Sbagliato! Il dominio unicredit-italia.com non e\\' quello ufficiale della banca. I truffatori aggiungono parole come \\'italia\\' o \\'sicurezza\\' per rendere il dominio piu\\' credibile. Il dominio autentico e\\' unicredit.it.','Sbagliato! Aggiungere -italia al dominio e\\' un trucco per sembrare piu\\' credibili.')">
          <input type="radio" name="q6"> sicurezza@unicredit-italia.com
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6,'b','b','Corretto! unicredit.it e\\' il dominio ufficiale della banca. Diffida sempre di domini che aggiungono parole extra come -italia, -sicurezza o -online al nome del brand.','Corretto! Questo e\\' il dominio ufficiale di UniCredit.')">
          <input type="radio" name="q6"> sicurezza@unicredit.it
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <div class="result-box" id="result-box">
      <h2>Risultato Finale</h2>
      <div class="big-score">0%</div>
      <div class="message"></div>
    </div>

    <div class="score-bar">
      <div class="progress" id="progress">0 di 6 completate</div>
      <div class="score">Punteggio: <span id="score">0 / 6</span></div>
    </div>

    <script>QuizEngine.init(6);</script>
  `;

  const html = wrapQuiz("Analisi del Mittente Email", body);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
