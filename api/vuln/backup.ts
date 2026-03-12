import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../_auth";
import { wrapQuiz } from "./_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const title = "Backup, Aggiornamenti e Ransomware";

  const body = `
    <div class="intro">
      <h2>Perche' backup e aggiornamenti sono fondamentali?</h2>
      <p>
        I <strong>backup regolari</strong> e gli <strong>aggiornamenti di sicurezza</strong> sono le due difese piu' importanti
        contro la perdita di dati e gli attacchi informatici. Un backup aggiornato ti permette di ripristinare i tuoi file
        in caso di guasto hardware, errore umano o attacco ransomware. Gli aggiornamenti del sistema operativo e dei software
        correggono vulnerabilita' note che gli attaccanti sfruttano attivamente.
      </p>
      <p style="margin-top: 0.5rem;">
        Il <strong>ransomware</strong> e' una delle minacce piu' diffuse oggi: un malware che cripta tutti i tuoi file
        e chiede un riscatto (spesso in criptovaluta) per restituirteli. Senza un backup adeguato, le vittime si trovano
        costrette a pagare senza garanzia di recupero. Questo quiz ti aiutera' a verificare le tue conoscenze su come
        proteggerti efficacemente.
      </p>
    </div>

    <!-- Domanda 1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">Domanda 1.</span> Cos'e' la regola 3-2-1 dei backup?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1,'a','b','Corretto!','Sbagliato. La regola 3-2-1 e\\u0027 una best practice per i backup: conserva 3 copie dei tuoi dati, su 2 tipi di supporto diversi (ad esempio disco esterno e cloud), con 1 copia conservata off-site, cioe\\u0027 in un luogo fisicamente separato. Questo protegge da guasti hardware, furti e disastri naturali.')">
          <input type="radio" name="q1"> a) 3 password, 2 email, 1 telefono
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1,'b','b','Esatto! La regola 3-2-1 prevede 3 copie dei dati, su 2 supporti diversi (es. disco esterno e cloud), con 1 copia off-site. E\\u0027 una delle strategie piu\\u0027 efficaci per proteggere i propri dati da qualsiasi tipo di incidente.','Sbagliato.')">
          <input type="radio" name="q1"> b) 3 copie dei dati, su 2 supporti diversi, 1 off-site
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1,'c','b','Corretto!','Sbagliato. La regola 3-2-1 e\\u0027 una best practice per i backup: conserva 3 copie dei tuoi dati, su 2 tipi di supporto diversi (ad esempio disco esterno e cloud), con 1 copia conservata off-site, cioe\\u0027 in un luogo fisicamente separato. Questo protegge da guasti hardware, furti e disastri naturali.')">
          <input type="radio" name="q1"> c) Backup ogni 3 giorni, 2 verifiche, 1 restore
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1,'d','b','Corretto!','Sbagliato. La regola 3-2-1 e\\u0027 una best practice per i backup: conserva 3 copie dei tuoi dati, su 2 tipi di supporto diversi (ad esempio disco esterno e cloud), con 1 copia conservata off-site, cioe\\u0027 in un luogo fisicamente separato. Questo protegge da guasti hardware, furti e disastri naturali.')">
          <input type="radio" name="q1"> d) 3 utenti, 2 admin, 1 root
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">Domanda 2.</span> Il tuo PC mostra: "I tuoi file sono stati criptati. Paga 500\u20ac in Bitcoin per riaverli." Cosa fai?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2,'a','c','Corretto!','Sbagliato. Non bisogna mai pagare il riscatto: non c\\u0027e\\u0027 garanzia che i file vengano restituiti e si finanziano i criminali. La procedura corretta e\\u0027 disconnettere immediatamente il PC dalla rete per evitare che il ransomware si diffonda ad altri dispositivi, non pagare, e ripristinare i dati dal backup. Se non hai un backup, contatta un esperto di sicurezza.')">
          <input type="radio" name="q2"> a) Pago subito
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2,'b','c','Corretto!','Sbagliato. Spegnere il PC e portarlo a riparare non e\\u0027 la prima cosa da fare. La priorita\\u0027 e\\u0027 disconnettere il PC dalla rete per impedire al ransomware di propagarsi. Poi non pagare il riscatto e ripristinare i dati dal backup. Portare il PC in assistenza puo\\u0027 essere utile, ma solo dopo aver isolato la macchina dalla rete.')">
          <input type="radio" name="q2"> b) Spengo il PC e lo porto a riparare
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2,'c','c','Esatto! La prima cosa da fare e\\u0027 disconnettere il PC dalla rete per evitare la propagazione del ransomware. Non pagare mai il riscatto: non c\\u0027e\\u0027 garanzia di recupero e si finanziano i criminali. Se hai un backup aggiornato, puoi ripristinare i tuoi dati in sicurezza.','Sbagliato.')">
          <input type="radio" name="q2"> c) Disconnetto dalla rete, non pago, e ripristino dal backup
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(2,'d','c','Corretto!','Sbagliato. Ignorare un ransomware non lo fara\\u0027 sparire: i file restano criptati. La procedura corretta e\\u0027 disconnettere il PC dalla rete, non pagare il riscatto e ripristinare i dati dal backup. Agire tempestivamente e\\u0027 fondamentale per limitare i danni.')">
          <input type="radio" name="q2"> d) Ignoro il messaggio
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">Domanda 3.</span> Quando dovresti aggiornare il sistema operativo?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3,'a','c','Corretto!','Sbagliato. Gli aggiornamenti di sicurezza correggono vulnerabilita\\u0027 che gli hacker possono sfruttare per attaccare il tuo PC. Rimandare o evitare gli aggiornamenti ti espone a rischi concreti. E\\u0027 importante installarli il prima possibile dopo il rilascio, specialmente quelli contrassegnati come critici o di sicurezza.')">
          <input type="radio" name="q3"> a) Mai, gli aggiornamenti rallentano il PC
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3,'b','c','Corretto!','Sbagliato. Gli aggiornamenti non servono solo per nuove funzioni: quelli di sicurezza sono i piu\\u0027 importanti perche\\u0027 chiudono falle che i criminali informatici sfruttano attivamente. Vanno installati il prima possibile dopo il rilascio per ridurre la finestra di esposizione agli attacchi.')">
          <input type="radio" name="q3"> b) Solo quando ci sono nuove funzioni
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3,'c','c','Esatto! Gli aggiornamenti di sicurezza vanno installati il prima possibile perche\\u0027 correggono vulnerabilita\\u0027 note. Ogni giorno di ritardo e\\u0027 un giorno in cui il tuo sistema e\\u0027 esposto ad attacchi che sfruttano quelle falle. Molti attacchi ransomware riescono proprio perche\\u0027 i sistemi non erano aggiornati.','Sbagliato.')">
          <input type="radio" name="q3"> c) Il prima possibile dopo il rilascio degli aggiornamenti di sicurezza
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(3,'d','c','Corretto!','Sbagliato. Una volta all\\u0027anno e\\u0027 troppo poco. Le vulnerabilita\\u0027 di sicurezza vengono scoperte e corrette continuamente. Gli aggiornamenti di sicurezza vanno installati il prima possibile dopo il rilascio per evitare che gli attaccanti sfruttino le falle note.')">
          <input type="radio" name="q3"> d) Una volta all'anno
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">Domanda 4.</span> Quale di questi NON e' un buon metodo di backup?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4,'a','c','Corretto!','Sbagliato. Un hard disk esterno a casa e\\u0027 un metodo di backup valido. La risposta corretta e\\u0027 la copia sullo stesso disco del PC: se il disco si guasta, perdi sia i dati originali che il backup. Un buon backup deve essere su un supporto fisicamente separato dal dispositivo principale.')">
          <input type="radio" name="q4"> a) Hard disk esterno a casa
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4,'b','c','Corretto!','Sbagliato. I servizi cloud come Google Drive o iCloud sono ottimi per il backup perche\\u0027 i dati sono conservati in data center remoti e protetti. La risposta corretta e\\u0027 la copia sullo stesso disco del PC: se il disco si guasta o viene colpito da ransomware, perdi tutto.')">
          <input type="radio" name="q4"> b) Servizio cloud (Google Drive, iCloud)
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4,'c','c','Esatto! Copiare i file sullo stesso disco del PC non e\\u0027 un vero backup. Se il disco si guasta, viene rubato il PC o un ransomware cripta tutto il disco, perdi sia i dati originali che la copia. Un backup efficace deve trovarsi su un supporto separato e, idealmente, in un luogo diverso.','Sbagliato.')">
          <input type="radio" name="q4"> c) Copia sullo stesso disco del PC
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(4,'d','c','Corretto!','Sbagliato. Un NAS (Network Attached Storage) in ufficio e\\u0027 un buon metodo di backup, specialmente se configurato con ridondanza (RAID). La risposta corretta e\\u0027 la copia sullo stesso disco del PC, che non offre alcuna protezione in caso di guasto del disco o attacco ransomware.')">
          <input type="radio" name="q4"> d) NAS in ufficio
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">Domanda 5.</span> Cosa fa un ransomware?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5,'a','b','Corretto!','Sbagliato. Rubare le password e\\u0027 tipico di altri malware come i keylogger o gli infostealer. Il ransomware cripta i file della vittima rendendoli inaccessibili e poi chiede un riscatto (ransom in inglese) per fornire la chiave di decrittazione. E\\u0027 una delle minacce informatiche piu\\u0027 devastanti per aziende e privati.')">
          <input type="radio" name="q5"> a) Ruba le password
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5,'b','b','Esatto! Il ransomware (da ransom = riscatto) cripta i file della vittima con algoritmi di crittografia forte, rendendoli completamente inaccessibili. Poi mostra un messaggio che chiede il pagamento di un riscatto, solitamente in Bitcoin o altra criptovaluta, per ottenere la chiave di decrittazione.','Sbagliato.')">
          <input type="radio" name="q5"> b) Cripta i file e chiede un riscatto
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5,'c','b','Corretto!','Sbagliato. Cancellare tutto il disco e\\u0027 tipico di un wiper, non di un ransomware. Il ransomware cripta i file e chiede un riscatto per restituirli. L\\u0027obiettivo dei criminali e\\u0027 guadagnare denaro, quindi devono lasciare la possibilita\\u0027 (almeno teorica) di recuperare i dati dopo il pagamento.')">
          <input type="radio" name="q5"> c) Cancella tutto il disco
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(5,'d','b','Corretto!','Sbagliato. Spiare la webcam e\\u0027 tipico di uno spyware o RAT (Remote Access Trojan), non di un ransomware. Il ransomware cripta i file della vittima e chiede un riscatto in denaro (spesso criptovaluta) per fornire la chiave per decriptarli.')">
          <input type="radio" name="q5"> d) Spia la webcam
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">Domanda 6.</span> Scenario: ricevi un'email con allegato "Fattura_2024.pdf.exe". Cosa fai?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6,'a','c','Corretto!','Sbagliato. Non aprire mai un file con doppia estensione come .pdf.exe! L\\u0027estensione reale e\\u0027 .exe, cioe\\u0027 un programma eseguibile, non un documento PDF. I criminali usano questa tecnica per mascherare malware (spesso ransomware) da documenti innocui. Windows di default nasconde le estensioni conosciute, quindi il file potrebbe apparire come Fattura_2024.pdf.')">
          <input type="radio" name="q6"> a) Apro il file, e' una fattura
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6,'b','c','Corretto!','Sbagliato. Anche se scansionare con l\\u0027antivirus e\\u0027 meglio che aprirlo direttamente, la risposta migliore e\\u0027 non aprirlo affatto. L\\u0027estensione .exe dopo .pdf e\\u0027 un chiaro segnale di pericolo: si tratta di un programma eseguibile mascherato da documento. Nessuna fattura legittima avrebbe mai l\\u0027estensione .exe.')">
          <input type="radio" name="q6"> b) Lo apro dopo averlo scansionato con l'antivirus
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6,'c','c','Esatto! Un file con doppia estensione come .pdf.exe e\\u0027 quasi certamente un malware. L\\u0027estensione reale e\\u0027 .exe (un programma eseguibile), mentre .pdf serve solo a ingannare l\\u0027utente. Nessun documento legittimo ha l\\u0027estensione .exe. Segnala l\\u0027email al reparto IT e cancellala.','Sbagliato.')">
          <input type="radio" name="q6"> c) Non lo apro - l'estensione .exe e' sospetta
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6,'d','c','Corretto!','Sbagliato. Inoltrare un allegato sospetto ai colleghi e\\u0027 pericoloso: potresti diffondere il malware! Un file .pdf.exe e\\u0027 un programma eseguibile mascherato da documento PDF. La cosa giusta da fare e\\u0027 non aprirlo, non inoltrarlo, e segnalarlo al reparto IT o cancellare l\\u0027email.')">
          <input type="radio" name="q6"> d) Lo inoltro ai colleghi per verificare
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <div id="result-box" class="result-box">
      <h2>Risultato</h2>
      <div class="big-score"></div>
      <div class="message"></div>
    </div>

    <script>QuizEngine.init(6)</script>

    <div class="score-bar">
      <span class="progress" id="progress">0 di 6 completate</span>
      <span class="score" id="score">0 / 6</span>
    </div>
  `;

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(wrapQuiz(title, body));
}
