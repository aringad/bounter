import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>AI e Privacy: opportunita' e rischi</h2>
      <p>
        L\\'intelligenza artificiale porta enormi vantaggi in termini di produttivita', ma introduce anche
        <strong>rischi significativi per la privacy</strong>. Il GDPR si applica ogni volta che dati personali
        vengono trattati da sistemi di AI, sia interni che esterni. Le aziende devono dotarsi di policy chiare
        per governare l\\'uso degli strumenti AI e proteggere i dati di clienti e dipendenti.
        In questo quiz affronterai 6 domande per capire come usare l\\'AI in modo sicuro e conforme.
      </p>
    </div>

    <!-- Domanda 1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">Domanda 1.</span> Cos\\'e\\' la "shadow AI"?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1,'a','b','Corretto! La shadow AI e\\' l\\'uso non autorizzato di strumenti AI da parte dei dipendenti, spesso con dati aziendali sensibili. E\\' un rischio crescente perche\\' i tool AI sono facilmente accessibili e i dipendenti li usano per velocizzare il lavoro senza passare dall\\'IT o dalla compliance.','Sbagliato! La shadow AI non riguarda l\\'AI malevola. Si riferisce ai dipendenti che usano strumenti AI non approvati dall\\'azienda, caricando potenzialmente dati riservati su piattaforme esterne senza controllo.')">
          <input type="radio" name="q1"> Un tipo di intelligenza artificiale usata dagli hacker per attaccare le aziende
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1,'b','b','Corretto! La shadow AI e\\' l\\'uso non autorizzato di strumenti AI da parte dei dipendenti, spesso con dati aziendali sensibili. E\\' un rischio crescente perche\\' i tool AI sono facilmente accessibili e i dipendenti li usano per velocizzare il lavoro senza passare dall\\'IT o dalla compliance.','Sbagliato! La shadow AI non riguarda l\\'AI malevola. Si riferisce ai dipendenti che usano strumenti AI non approvati dall\\'azienda, caricando potenzialmente dati riservati su piattaforme esterne senza controllo.')">
          <input type="radio" name="q1"> L'uso non autorizzato di strumenti AI da parte dei dipendenti con dati aziendali
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1,'c','b','Corretto! La shadow AI e\\' l\\'uso non autorizzato di strumenti AI da parte dei dipendenti, spesso con dati aziendali sensibili. E\\' un rischio crescente perche\\' i tool AI sono facilmente accessibili e i dipendenti li usano per velocizzare il lavoro senza passare dall\\'IT o dalla compliance.','Sbagliato! La shadow AI non riguarda l\\'AI malevola. Si riferisce ai dipendenti che usano strumenti AI non approvati dall\\'azienda, caricando potenzialmente dati riservati su piattaforme esterne senza controllo.')">
          <input type="radio" name="q1"> Un modello AI che opera nel dark web
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1,'d','b','Corretto! La shadow AI e\\' l\\'uso non autorizzato di strumenti AI da parte dei dipendenti, spesso con dati aziendali sensibili. E\\' un rischio crescente perche\\' i tool AI sono facilmente accessibili e i dipendenti li usano per velocizzare il lavoro senza passare dall\\'IT o dalla compliance.','Sbagliato! La shadow AI non riguarda l\\'AI malevola. Si riferisce ai dipendenti che usano strumenti AI non approvati dall\\'azienda, caricando potenzialmente dati riservati su piattaforme esterne senza controllo.')">
          <input type="radio" name="q1"> Un algoritmo che nasconde i bias nei risultati
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">Domanda 2.</span> Un dipendente incolla una lista di clienti con nomi, email e importi fatturati in ChatGPT per generare un report. Qual e' il rischio principale?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2,'a','c','Corretto! Incollare dati personali in un tool AI esterno comporta data leakage: i dati escono dal perimetro aziendale, possono essere usati per il training del modello e l\\'azienda viola il GDPR (art. 5 e 28) perche\\' trasferisce dati personali a un responsabile del trattamento senza base giuridica ne\\' DPA.','Sbagliato! Il rischio principale non e\\' solo la qualita\\' del report. Incollare dati personali in ChatGPT significa trasferirli a un soggetto terzo (OpenAI) senza autorizzazione. Questo comporta data leakage, possibile uso dei dati per il training e violazione del GDPR.')">
          <input type="radio" name="q2"> Il report potrebbe contenere errori di calcolo
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2,'b','c','Corretto! Incollare dati personali in un tool AI esterno comporta data leakage: i dati escono dal perimetro aziendale, possono essere usati per il training del modello e l\\'azienda viola il GDPR (art. 5 e 28) perche\\' trasferisce dati personali a un responsabile del trattamento senza base giuridica ne\\' DPA.','Sbagliato! Il rischio principale non e\\' solo la qualita\\' del report. Incollare dati personali in ChatGPT significa trasferirli a un soggetto terzo (OpenAI) senza autorizzazione. Questo comporta data leakage, possibile uso dei dati per il training e violazione del GDPR.')">
          <input type="radio" name="q2"> ChatGPT potrebbe non capire il formato dei dati
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2,'c','c','Corretto! Incollare dati personali in un tool AI esterno comporta data leakage: i dati escono dal perimetro aziendale, possono essere usati per il training del modello e l\\'azienda viola il GDPR (art. 5 e 28) perche\\' trasferisce dati personali a un responsabile del trattamento senza base giuridica ne\\' DPA.','Sbagliato! Il rischio principale non e\\' solo la qualita\\' del report. Incollare dati personali in ChatGPT significa trasferirli a un soggetto terzo (OpenAI) senza autorizzazione. Questo comporta data leakage, possibile uso dei dati per il training e violazione del GDPR.')">
          <input type="radio" name="q2"> Data leakage, possibile violazione GDPR e dati potenzialmente usati per il training del modello
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">Domanda 3.</span> Cosa prevede il GDPR riguardo alle decisioni automatizzate che producono effetti significativi sulle persone?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3,'a','b','Corretto! L\\'art. 22 del GDPR stabilisce che l\\'interessato ha il diritto di non essere sottoposto a decisioni basate unicamente sul trattamento automatizzato che producano effetti giuridici o significativi. Deve essere garantito il diritto a una spiegazione comprensibile e alla revisione umana della decisione.','Sbagliato! Il GDPR non vieta l\\'uso dell\\'AI, ma l\\'art. 22 richiede che le decisioni automatizzate con effetti significativi prevedano il diritto alla spiegazione e alla revisione umana. Non basta informare: l\\'interessato deve poter contestare la decisione.')">
          <input type="radio" name="q3"> Le decisioni automatizzate sono sempre vietate dal GDPR
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3,'b','b','Corretto! L\\'art. 22 del GDPR stabilisce che l\\'interessato ha il diritto di non essere sottoposto a decisioni basate unicamente sul trattamento automatizzato che producano effetti giuridici o significativi. Deve essere garantito il diritto a una spiegazione comprensibile e alla revisione umana della decisione.','Sbagliato! Il GDPR non vieta l\\'uso dell\\'AI, ma l\\'art. 22 richiede che le decisioni automatizzate con effetti significativi prevedano il diritto alla spiegazione e alla revisione umana. Non basta informare: l\\'interessato deve poter contestare la decisione.')">
          <input type="radio" name="q3"> L'interessato ha diritto a una spiegazione e alla revisione umana della decisione
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3,'c','b','Corretto! L\\'art. 22 del GDPR stabilisce che l\\'interessato ha il diritto di non essere sottoposto a decisioni basate unicamente sul trattamento automatizzato che producano effetti giuridici o significativi. Deve essere garantito il diritto a una spiegazione comprensibile e alla revisione umana della decisione.','Sbagliato! Il GDPR non vieta l\\'uso dell\\'AI, ma l\\'art. 22 richiede che le decisioni automatizzate con effetti significativi prevedano il diritto alla spiegazione e alla revisione umana. Non basta informare: l\\'interessato deve poter contestare la decisione.')">
          <input type="radio" name="q3"> Basta informare l'utente che viene usata l'AI, senza ulteriori obblighi
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(3,'d','b','Corretto! L\\'art. 22 del GDPR stabilisce che l\\'interessato ha il diritto di non essere sottoposto a decisioni basate unicamente sul trattamento automatizzato che producano effetti giuridici o significativi. Deve essere garantito il diritto a una spiegazione comprensibile e alla revisione umana della decisione.','Sbagliato! Il GDPR non vieta l\\'uso dell\\'AI, ma l\\'art. 22 richiede che le decisioni automatizzate con effetti significativi prevedano il diritto alla spiegazione e alla revisione umana. Non basta informare: l\\'interessato deve poter contestare la decisione.')">
          <input type="radio" name="q3"> Il GDPR non si applica alle decisioni prese dall'intelligenza artificiale
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">Domanda 4.</span> Cos\\'e\\' una "AI policy" aziendale?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4,'a','c','Corretto! Una AI policy aziendale definisce regole chiare su quali strumenti AI possono essere usati, con quali dati, e le procedure di approvazione. Include indicazioni su classificazione dei dati, strumenti approvati, divieti specifici e responsabilita\\'. E\\' fondamentale per prevenire la shadow AI e garantire la compliance GDPR.','Sbagliato! Una AI policy non e\\' un software ma un documento di governance. Stabilisce le regole aziendali sull\\'uso degli strumenti AI: quali tool sono approvati, quali dati possono essere condivisi, chi deve approvare l\\'uso e le responsabilita\\' in caso di violazione.')">
          <input type="radio" name="q4"> Un software che monitora automaticamente l'uso dell'AI in azienda
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4,'b','c','Corretto! Una AI policy aziendale definisce regole chiare su quali strumenti AI possono essere usati, con quali dati, e le procedure di approvazione. Include indicazioni su classificazione dei dati, strumenti approvati, divieti specifici e responsabilita\\'. E\\' fondamentale per prevenire la shadow AI e garantire la compliance GDPR.','Sbagliato! Una AI policy non e\\' un software ma un documento di governance. Stabilisce le regole aziendali sull\\'uso degli strumenti AI: quali tool sono approvati, quali dati possono essere condivisi, chi deve approvare l\\'uso e le responsabilita\\' in caso di violazione.')">
          <input type="radio" name="q4"> Un contratto con il fornitore di AI per garantire la sicurezza dei dati
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4,'c','c','Corretto! Una AI policy aziendale definisce regole chiare su quali strumenti AI possono essere usati, con quali dati, e le procedure di approvazione. Include indicazioni su classificazione dei dati, strumenti approvati, divieti specifici e responsabilita\\'. E\\' fondamentale per prevenire la shadow AI e garantire la compliance GDPR.','Sbagliato! Una AI policy non e\\' un software ma un documento di governance. Stabilisce le regole aziendali sull\\'uso degli strumenti AI: quali tool sono approvati, quali dati possono essere condivisi, chi deve approvare l\\'uso e le responsabilita\\' in caso di violazione.')">
          <input type="radio" name="q4"> Un documento che definisce regole su quali strumenti AI usare, con quali dati e con quali approvazioni
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">Domanda 5.</span> Un fornitore AI dichiara: "I dati non vengono usati per il training del modello". Basta come garanzia per la privacy?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5,'a','b','Corretto! Una dichiarazione verbale o di marketing non e\\' sufficiente. Serve un DPA (Data Processing Agreement) conforme all\\'art. 28 del GDPR, che specifichi finalita\\', durata, misure di sicurezza, luogo di conservazione dei dati (data residency), crittografia e certificazioni (es. SOC 2, ISO 27001). Bisogna anche verificare se i dati vengono trasferiti extra-UE.','Sbagliato! Una semplice dichiarazione non basta. Servono garanzie contrattuali concrete: un DPA conforme al GDPR, verifica della data residency (dove sono conservati i dati), crittografia, certificazioni di sicurezza e clausole sul trasferimento extra-UE.')">
          <input type="radio" name="q5"> Si', se il fornitore lo dichiara possiamo fidarci
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5,'b','b','Corretto! Una dichiarazione verbale o di marketing non e\\' sufficiente. Serve un DPA (Data Processing Agreement) conforme all\\'art. 28 del GDPR, che specifichi finalita\\', durata, misure di sicurezza, luogo di conservazione dei dati (data residency), crittografia e certificazioni (es. SOC 2, ISO 27001). Bisogna anche verificare se i dati vengono trasferiti extra-UE.','Sbagliato! Una semplice dichiarazione non basta. Servono garanzie contrattuali concrete: un DPA conforme al GDPR, verifica della data residency (dove sono conservati i dati), crittografia, certificazioni di sicurezza e clausole sul trasferimento extra-UE.')">
          <input type="radio" name="q5"> No, servono DPA, verifica della data residency, crittografia e certificazioni
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5,'c','b','Corretto! Una dichiarazione verbale o di marketing non e\\' sufficiente. Serve un DPA (Data Processing Agreement) conforme all\\'art. 28 del GDPR, che specifichi finalita\\', durata, misure di sicurezza, luogo di conservazione dei dati (data residency), crittografia e certificazioni (es. SOC 2, ISO 27001). Bisogna anche verificare se i dati vengono trasferiti extra-UE.','Sbagliato! Una semplice dichiarazione non basta. Servono garanzie contrattuali concrete: un DPA conforme al GDPR, verifica della data residency (dove sono conservati i dati), crittografia, certificazioni di sicurezza e clausole sul trasferimento extra-UE.')">
          <input type="radio" name="q5"> Basta chiedere conferma via email per avere una prova scritta
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">Domanda 6.</span> Quale approccio protegge meglio i dati personali quando si utilizzano strumenti di AI?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6,'a','c','Corretto! L\\'approccio migliore e\\' anonimizzare o pseudonimizzare i dati prima di inviarli a strumenti AI esterni, e usare modelli on-premise (installati localmente) per i dati piu\\' sensibili. Cosi\\' i dati personali non escono mai dal perimetro aziendale, rispettando il principio di minimizzazione del GDPR (art. 5.1.c).','Sbagliato! Usare una VPN o la versione a pagamento non protegge i dati personali dal trattamento da parte del fornitore AI. L\\'approccio corretto e\\' anonimizzare i dati prima dell\\'invio e usare modelli on-premise per i dati sensibili, applicando il principio di minimizzazione del GDPR.')">
          <input type="radio" name="q6"> Usare sempre una VPN quando si accede a strumenti AI
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6,'b','c','Corretto! L\\'approccio migliore e\\' anonimizzare o pseudonimizzare i dati prima di inviarli a strumenti AI esterni, e usare modelli on-premise (installati localmente) per i dati piu\\' sensibili. Cosi\\' i dati personali non escono mai dal perimetro aziendale, rispettando il principio di minimizzazione del GDPR (art. 5.1.c).','Sbagliato! Usare una VPN o la versione a pagamento non protegge i dati personali dal trattamento da parte del fornitore AI. L\\'approccio corretto e\\' anonimizzare i dati prima dell\\'invio e usare modelli on-premise per i dati sensibili, applicando il principio di minimizzazione del GDPR.')">
          <input type="radio" name="q6"> Usare la versione a pagamento dello strumento AI, che offre piu' privacy
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6,'c','c','Corretto! L\\'approccio migliore e\\' anonimizzare o pseudonimizzare i dati prima di inviarli a strumenti AI esterni, e usare modelli on-premise (installati localmente) per i dati piu\\' sensibili. Cosi\\' i dati personali non escono mai dal perimetro aziendale, rispettando il principio di minimizzazione del GDPR (art. 5.1.c).','Sbagliato! Usare una VPN o la versione a pagamento non protegge i dati personali dal trattamento da parte del fornitore AI. L\\'approccio corretto e\\' anonimizzare i dati prima dell\\'invio e usare modelli on-premise per i dati sensibili, applicando il principio di minimizzazione del GDPR.')">
          <input type="radio" name="q6"> Anonimizzare/pseudonimizzare i dati prima dell'invio e usare modelli on-premise per i dati sensibili
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6,'d','c','Corretto! L\\'approccio migliore e\\' anonimizzare o pseudonimizzare i dati prima di inviarli a strumenti AI esterni, e usare modelli on-premise (installati localmente) per i dati piu\\' sensibili. Cosi\\' i dati personali non escono mai dal perimetro aziendale, rispettando il principio di minimizzazione del GDPR (art. 5.1.c).','Sbagliato! Usare una VPN o la versione a pagamento non protegge i dati personali dal trattamento da parte del fornitore AI. L\\'approccio corretto e\\' anonimizzare i dati prima dell\\'invio e usare modelli on-premise per i dati sensibili, applicando il principio di minimizzazione del GDPR.')">
          <input type="radio" name="q6"> Chiedere ai dipendenti di non usare mai strumenti AI
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

  const html = wrapQuiz("AI e Privacy", body);
  res.setHeader("Content-Type", "text/html");
  return res.status(200).send(html);
}
