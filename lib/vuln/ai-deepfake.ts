import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>Deepfake e Contenuti Generati dall'AI</h2>
      <p>
        L'intelligenza artificiale e' oggi in grado di generare <strong>video, audio e immagini
        estremamente realistici</strong> che possono essere indistinguibili dai contenuti autentici.
        Questi contenuti sintetici, noti come deepfake, creano nuovi rischi significativi per
        <strong>frodi, truffe e disinformazione</strong>. Un video puo' mostrare una persona dire
        cose che non ha mai detto, una voce puo' essere clonata con pochi secondi di campione audio,
        e immagini completamente false possono sembrare fotografie reali.
        In questo quiz imparerai a riconoscere e difenderti da queste minacce.
      </p>
    </div>

    <!-- Domanda 1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">Domanda 1.</span> Cos'e' un deepfake?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1,'a','b','Corretto! Un deepfake e\\' un contenuto multimediale sintetico generato dall\\'AI che puo\\' riprodurre in modo realistico il volto, la voce o i movimenti di una persona reale. Viene usato sia per scopi creativi che, purtroppo, per frodi e disinformazione.','Sbagliato! Un deepfake non e\\' un semplice fotomontaggio. E\\' un contenuto sintetico generato dall\\'intelligenza artificiale (video, audio o immagini) che appare autentico e puo\\' ingannare anche osservatori attenti.')">
          <input type="radio" name="q1"> Un virus informatico che ruba dati personali
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1,'b','b','Corretto! Un deepfake e\\' un contenuto multimediale sintetico generato dall\\'AI che puo\\' riprodurre in modo realistico il volto, la voce o i movimenti di una persona reale. Viene usato sia per scopi creativi che, purtroppo, per frodi e disinformazione.','Sbagliato! Un deepfake non e\\' un semplice fotomontaggio. E\\' un contenuto sintetico generato dall\\'intelligenza artificiale (video, audio o immagini) che appare autentico e puo\\' ingannare anche osservatori attenti.')">
          <input type="radio" name="q1"> Un contenuto sintetico (video, audio o immagine) generato dall'AI che appare reale
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1,'c','b','Corretto! Un deepfake e\\' un contenuto multimediale sintetico generato dall\\'AI che puo\\' riprodurre in modo realistico il volto, la voce o i movimenti di una persona reale. Viene usato sia per scopi creativi che, purtroppo, per frodi e disinformazione.','Sbagliato! Un deepfake non e\\' un semplice fotomontaggio. E\\' un contenuto sintetico generato dall\\'intelligenza artificiale (video, audio o immagini) che appare autentico e puo\\' ingannare anche osservatori attenti.')">
          <input type="radio" name="q1"> Un account social falso creato per fare spam
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1,'d','b','Corretto! Un deepfake e\\' un contenuto multimediale sintetico generato dall\\'AI che puo\\' riprodurre in modo realistico il volto, la voce o i movimenti di una persona reale. Viene usato sia per scopi creativi che, purtroppo, per frodi e disinformazione.','Sbagliato! Un deepfake non e\\' un semplice fotomontaggio. E\\' un contenuto sintetico generato dall\\'intelligenza artificiale (video, audio o immagini) che appare autentico e puo\\' ingannare anche osservatori attenti.')">
          <input type="radio" name="q1"> Un tipo di crittografia avanzata
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">Domanda 2.</span> Ricevi una videochiamata dal CEO della tua azienda che ti chiede di effettuare un bonifico urgente di 50.000&euro;. Come ti comporti?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2,'a','c','Corretto! Mai fidarsi di una sola forma di comunicazione per richieste finanziarie importanti. I deepfake video sono oggi cosi\\' realistici che possono ingannare chiunque. Richiama sempre su un numero noto e verificato, seguendo le procedure aziendali di approvazione.','Sbagliato! Anche se il video sembra reale, i deepfake in tempo reale sono oggi possibili. Non fidarti mai di una videochiamata come unica verifica per bonifici urgenti. Richiama sempre il CEO su un numero che conosci gia\\' e segui le procedure di approvazione standard.')">
          <input type="radio" name="q2"> Eseguo il bonifico: ho visto il suo volto in video, e' sicuramente lui
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2,'b','c','Corretto! Mai fidarsi di una sola forma di comunicazione per richieste finanziarie importanti. I deepfake video sono oggi cosi\\' realistici che possono ingannare chiunque. Richiama sempre su un numero noto e verificato, seguendo le procedure aziendali di approvazione.','Sbagliato! Anche se il video sembra reale, i deepfake in tempo reale sono oggi possibili. Non fidarti mai di una videochiamata come unica verifica per bonifici urgenti. Richiama sempre il CEO su un numero che conosci gia\\' e segui le procedure di approvazione standard.')">
          <input type="radio" name="q2"> Chiedo conferma via email al CEO prima di procedere
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2,'c','c','Corretto! Mai fidarsi di una sola forma di comunicazione per richieste finanziarie importanti. I deepfake video sono oggi cosi\\' realistici che possono ingannare chiunque. Richiama sempre su un numero noto e verificato, seguendo le procedure aziendali di approvazione.','Sbagliato! Anche se il video sembra reale, i deepfake in tempo reale sono oggi possibili. Non fidarti mai di una videochiamata come unica verifica per bonifici urgenti. Richiama sempre il CEO su un numero che conosci gia\\' e segui le procedure di approvazione standard.')">
          <input type="radio" name="q2"> Richiamo il CEO su un numero che conosco gia' e seguo la procedura di approvazione standard
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(2,'d','c','Corretto! Mai fidarsi di una sola forma di comunicazione per richieste finanziarie importanti. I deepfake video sono oggi cosi\\' realistici che possono ingannare chiunque. Richiama sempre su un numero noto e verificato, seguendo le procedure aziendali di approvazione.','Sbagliato! Anche se il video sembra reale, i deepfake in tempo reale sono oggi possibili. Non fidarti mai di una videochiamata come unica verifica per bonifici urgenti. Richiama sempre il CEO su un numero che conosci gia\\' e segui le procedure di approvazione standard.')">
          <input type="radio" name="q2"> Chiedo al CEO in video di mostrarmi un documento di identita'
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">Domanda 3.</span> Quale tecnologia permette di clonare una voce umana con pochi secondi di campione audio?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3,'a','b','Corretto! I sistemi di voice cloning basati su AI text-to-speech possono replicare una voce umana con soli 3-10 secondi di campione audio. Questo rende possibile creare messaggi vocali falsi estremamente convincenti, usati per truffe telefoniche e frodi aziendali.','Sbagliato! La risposta corretta e\\' il voice cloning basato su AI text-to-speech. Questa tecnologia puo\\' replicare una voce con pochi secondi di campione, rendendo possibili truffe telefoniche molto convincenti. La blockchain e la VPN hanno scopi completamente diversi.')">
          <input type="radio" name="q3"> Blockchain vocale
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3,'b','b','Corretto! I sistemi di voice cloning basati su AI text-to-speech possono replicare una voce umana con soli 3-10 secondi di campione audio. Questo rende possibile creare messaggi vocali falsi estremamente convincenti, usati per truffe telefoniche e frodi aziendali.','Sbagliato! La risposta corretta e\\' il voice cloning basato su AI text-to-speech. Questa tecnologia puo\\' replicare una voce con pochi secondi di campione, rendendo possibili truffe telefoniche molto convincenti. La blockchain e la VPN hanno scopi completamente diversi.')">
          <input type="radio" name="q3"> Voice cloning tramite AI text-to-speech
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3,'c','b','Corretto! I sistemi di voice cloning basati su AI text-to-speech possono replicare una voce umana con soli 3-10 secondi di campione audio. Questo rende possibile creare messaggi vocali falsi estremamente convincenti, usati per truffe telefoniche e frodi aziendali.','Sbagliato! La risposta corretta e\\' il voice cloning basato su AI text-to-speech. Questa tecnologia puo\\' replicare una voce con pochi secondi di campione, rendendo possibili truffe telefoniche molto convincenti. La blockchain e la VPN hanno scopi completamente diversi.')">
          <input type="radio" name="q3"> VPN con modulazione audio
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">Domanda 4.</span> Quali sono i segnali tipici che possono rivelare un'immagine generata dall'AI?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4,'a','a','Corretto! Le immagini generate dall\\'AI spesso presentano artefatti rivelatori: mani con un numero sbagliato di dita, testo illeggibile o sgrammaticato, illuminazione incoerente tra gli elementi, e pelle troppo liscia e perfetta. Questi dettagli sono i primi da controllare quando si sospetta un\\'immagine falsa.','Sbagliato! Le immagini AI non hanno necessariamente bassa risoluzione o watermark. I segnali reali sono: mani con dita anomale, testo illeggibile, illuminazione incoerente tra gli elementi della scena, e pelle troppo liscia e perfetta. Cerca sempre questi artefatti.')">
          <input type="radio" name="q4"> Mani con dita anomale, testo illeggibile, illuminazione incoerente, pelle troppo perfetta
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4,'b','a','Corretto! Le immagini generate dall\\'AI spesso presentano artefatti rivelatori: mani con un numero sbagliato di dita, testo illeggibile o sgrammaticato, illuminazione incoerente tra gli elementi, e pelle troppo liscia e perfetta. Questi dettagli sono i primi da controllare quando si sospetta un\\'immagine falsa.','Sbagliato! Le immagini AI non hanno necessariamente bassa risoluzione o watermark. I segnali reali sono: mani con dita anomale, testo illeggibile, illuminazione incoerente tra gli elementi della scena, e pelle troppo liscia e perfetta. Cerca sempre questi artefatti.')">
          <input type="radio" name="q4"> L'immagine ha sempre una bassa risoluzione e colori sbiaditi
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4,'c','a','Corretto! Le immagini generate dall\\'AI spesso presentano artefatti rivelatori: mani con un numero sbagliato di dita, testo illeggibile o sgrammaticato, illuminazione incoerente tra gli elementi, e pelle troppo liscia e perfetta. Questi dettagli sono i primi da controllare quando si sospetta un\\'immagine falsa.','Sbagliato! Le immagini AI non hanno necessariamente bassa risoluzione o watermark. I segnali reali sono: mani con dita anomale, testo illeggibile, illuminazione incoerente tra gli elementi della scena, e pelle troppo liscia e perfetta. Cerca sempre questi artefatti.')">
          <input type="radio" name="q4"> C'e' sempre un watermark visibile che dice "AI Generated"
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">Domanda 5.</span> Cos'e' una "CEO fraud" potenziata dall'AI?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5,'a','b','Corretto! La CEO fraud potenziata dall\\'AI combina il social engineering tradizionale con deepfake video e audio per impersonare dirigenti aziendali in modo estremamente convincente. L\\'attaccante puo\\' creare videochiamate o messaggi vocali falsi per autorizzare bonifici, ottenere dati sensibili o impartire ordini fraudolenti.','Sbagliato! La CEO fraud potenziata dall\\'AI non e\\' un semplice furto di account. E\\' un attacco di social engineering in cui l\\'attaccante usa deepfake video o vocali per impersonare un dirigente e convincere i dipendenti a eseguire azioni dannose come bonifici non autorizzati.')">
          <input type="radio" name="q5"> Un attacco hacker che ruba l'account email del CEO
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5,'b','b','Corretto! La CEO fraud potenziata dall\\'AI combina il social engineering tradizionale con deepfake video e audio per impersonare dirigenti aziendali in modo estremamente convincente. L\\'attaccante puo\\' creare videochiamate o messaggi vocali falsi per autorizzare bonifici, ottenere dati sensibili o impartire ordini fraudolenti.','Sbagliato! La CEO fraud potenziata dall\\'AI non e\\' un semplice furto di account. E\\' un attacco di social engineering in cui l\\'attaccante usa deepfake video o vocali per impersonare un dirigente e convincere i dipendenti a eseguire azioni dannose come bonifici non autorizzati.')">
          <input type="radio" name="q5"> Un attacco di social engineering che usa deepfake video e vocali per impersonare dirigenti aziendali
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5,'c','b','Corretto! La CEO fraud potenziata dall\\'AI combina il social engineering tradizionale con deepfake video e audio per impersonare dirigenti aziendali in modo estremamente convincente. L\\'attaccante puo\\' creare videochiamate o messaggi vocali falsi per autorizzare bonifici, ottenere dati sensibili o impartire ordini fraudolenti.','Sbagliato! La CEO fraud potenziata dall\\'AI non e\\' un semplice furto di account. E\\' un attacco di social engineering in cui l\\'attaccante usa deepfake video o vocali per impersonare un dirigente e convincere i dipendenti a eseguire azioni dannose come bonifici non autorizzati.')">
          <input type="radio" name="q5"> Un software che sostituisce automaticamente il CEO con un'AI
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">Domanda 6.</span> Quale misura protegge meglio un'azienda dai deepfake?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6,'a','c','Corretto! La difesa piu\\' efficace contro i deepfake e\\' organizzativa: procedure di verifica su piu\\' canali (telefono, email, di persona), conferma multilivello per operazioni sensibili, e la regola di non affidarsi mai a un singolo canale di comunicazione. La tecnologia da sola non basta.','Sbagliato! Vietare le videochiamate o usare solo antivirus non e\\' praticabile ne\\' efficace. La difesa migliore e\\' avere procedure di verifica su piu\\' canali: conferme telefoniche su numeri noti, approvazioni multilivello, e la regola di non fidarsi mai di un singolo canale di comunicazione.')">
          <input type="radio" name="q6"> Vietare completamente le videochiamate in azienda
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6,'b','c','Corretto! La difesa piu\\' efficace contro i deepfake e\\' organizzativa: procedure di verifica su piu\\' canali (telefono, email, di persona), conferma multilivello per operazioni sensibili, e la regola di non affidarsi mai a un singolo canale di comunicazione. La tecnologia da sola non basta.','Sbagliato! Vietare le videochiamate o usare solo antivirus non e\\' praticabile ne\\' efficace. La difesa migliore e\\' avere procedure di verifica su piu\\' canali: conferme telefoniche su numeri noti, approvazioni multilivello, e la regola di non fidarsi mai di un singolo canale di comunicazione.')">
          <input type="radio" name="q6"> Installare un antivirus aggiornato su tutti i dispositivi
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6,'c','c','Corretto! La difesa piu\\' efficace contro i deepfake e\\' organizzativa: procedure di verifica su piu\\' canali (telefono, email, di persona), conferma multilivello per operazioni sensibili, e la regola di non affidarsi mai a un singolo canale di comunicazione. La tecnologia da sola non basta.','Sbagliato! Vietare le videochiamate o usare solo antivirus non e\\' praticabile ne\\' efficace. La difesa migliore e\\' avere procedure di verifica su piu\\' canali: conferme telefoniche su numeri noti, approvazioni multilivello, e la regola di non fidarsi mai di un singolo canale di comunicazione.')">
          <input type="radio" name="q6"> Procedure di verifica multi-canale e conferma multilivello per operazioni sensibili
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6,'d','c','Corretto! La difesa piu\\' efficace contro i deepfake e\\' organizzativa: procedure di verifica su piu\\' canali (telefono, email, di persona), conferma multilivello per operazioni sensibili, e la regola di non affidarsi mai a un singolo canale di comunicazione. La tecnologia da sola non basta.','Sbagliato! Vietare le videochiamate o usare solo antivirus non e\\' praticabile ne\\' efficace. La difesa migliore e\\' avere procedure di verifica su piu\\' canali: conferme telefoniche su numeri noti, approvazioni multilivello, e la regola di non fidarsi mai di un singolo canale di comunicazione.')">
          <input type="radio" name="q6"> Usare solo comunicazioni scritte via chat aziendale
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Result box -->
    <div class="result-box" id="result-box">
      <h2>Quiz completato!</h2>
      <div class="big-score">0%</div>
      <div class="message"></div>
    </div>

    <div class="score-bar">
      <div class="progress" id="progress">0 di 6 completate</div>
      <div class="score">Punteggio: <span id="score">0 / 6</span></div>
    </div>

    <script>QuizEngine.init(6);</script>
  `;

  const html = wrapQuiz("Deepfake e Contenuti Generati", body);
  res.setHeader("Content-Type", "text/html");
  return res.status(200).send(html);
}
