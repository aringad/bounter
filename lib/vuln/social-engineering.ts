import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>Social Engineering: l'arte della manipolazione</h2>
      <p>
        Il social engineering (ingegneria sociale) e' una tecnica di attacco che sfrutta la
        <strong>manipolazione psicologica delle persone</strong> anziche' le vulnerabilita' tecniche dei sistemi.
        Gli attaccanti fanno leva su fiducia, urgenza, autorita' e curiosita' per indurre le vittime a
        rivelare informazioni riservate, concedere accessi o compiere azioni dannose.
        In questo quiz affronterai 6 scenari realistici per imparare a riconoscere queste tecniche.
      </p>
    </div>

    <!-- Domanda 1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">Scenario 1.</span> Ricevi una telefonata:</h3>
      <div style="background:#1a2332;border:1px solid #334155;border-radius:6px;padding:1rem;margin:0.5rem 0;font-size:0.88rem;color:#94a3b8;line-height:1.6;font-style:italic;">
        "Buongiorno, sono del supporto tecnico Microsoft. Abbiamo rilevato che il suo computer ha un virus
        molto pericoloso. Per risolvere il problema ho bisogno che mi conceda l'accesso remoto al suo PC.
        Puo' scaricare questo software di controllo remoto?"
      </div>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1,'a','b','Corretto! Questa e\\' una tecnica di pretexting: l\\'attaccante finge un\\'identita\\' autorevole (supporto Microsoft) per ottenere accesso. Microsoft non chiama mai gli utenti in modo proattivo. Riaggancia sempre e, se hai dubbi, contatta direttamente il supporto ufficiale.','Sbagliato! Non dare mai accesso remoto a sconosciuti che ti chiamano. Microsoft non contatta mai gli utenti telefonicamente per problemi tecnici. Questa tecnica si chiama pretexting.')">
          <input type="radio" name="q1"> Concedo l'accesso remoto per risolvere il problema il prima possibile
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1,'b','b','Corretto! Questa e\\' una tecnica di pretexting: l\\'attaccante finge un\\'identita\\' autorevole (supporto Microsoft) per ottenere accesso. Microsoft non chiama mai gli utenti in modo proattivo. Riaggancia sempre e, se hai dubbi, contatta direttamente il supporto ufficiale.','Sbagliato! Non dare mai accesso remoto a sconosciuti che ti chiamano. Microsoft non contatta mai gli utenti telefonicamente per problemi tecnici. Questa tecnica si chiama pretexting.')">
          <input type="radio" name="q1"> Riaggancio immediatamente: Microsoft non chiama mai gli utenti in questo modo
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1,'c','b','Corretto! Questa e\\' una tecnica di pretexting: l\\'attaccante finge un\\'identita\\' autorevole (supporto Microsoft) per ottenere accesso. Microsoft non chiama mai gli utenti in modo proattivo. Riaggancia sempre e, se hai dubbi, contatta direttamente il supporto ufficiale.','Sbagliato! Non dare mai accesso remoto a sconosciuti che ti chiamano. Microsoft non contatta mai gli utenti telefonicamente per problemi tecnici. Questa tecnica si chiama pretexting.')">
          <input type="radio" name="q1"> Chiedo un numero di matricola per verificare la sua identita'
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">Scenario 2.</span> Ricevi questa email dal tuo "capo":</h3>
      <div class="email-sim">
        <div class="from">Da: <strong>Mario Rossi (CEO)</strong> &lt;m.r0ssi@gmail.com&gt;</div>
        <div class="subject">URGENTE - Ho bisogno di un favore</div>
        <div class="body">
          Ciao, sono in riunione e non posso parlare. Ho bisogno che tu compri 5 buoni regalo Amazon
          da 100&euro; ciascuno e mi mandi i codici via email il prima possibile. Ti rimborso domani.
          Non dirlo a nessuno, e' una sorpresa per il team. Grazie!
        </div>
      </div>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2,'a','c','Corretto! Questa e\\' una truffa BEC (Business Email Compromise) che sfrutta l\\'autorita\\' del capo e l\\'urgenza. L\\'indirizzo email e\\' falso (nota: r0ssi con lo zero). Verifica sempre di persona richieste insolite di denaro, anche se sembrano provenire da superiori.','Sbagliato! Questa e\\' una classica truffa BEC (Business Email Compromise). L\\'attaccante impersona un superiore e sfrutta urgenza e autorita\\'. Nota l\\'indirizzo email falso (r0ssi con lo zero). Mai acquistare buoni regalo su richiesta via email.')">
          <input type="radio" name="q2"> Compro i buoni regalo: il capo ha fretta e non posso farlo aspettare
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2,'b','c','Corretto! Questa e\\' una truffa BEC (Business Email Compromise) che sfrutta l\\'autorita\\' del capo e l\\'urgenza. L\\'indirizzo email e\\' falso (nota: r0ssi con lo zero). Verifica sempre di persona richieste insolite di denaro, anche se sembrano provenire da superiori.','Sbagliato! Questa e\\' una classica truffa BEC (Business Email Compromise). L\\'attaccante impersona un superiore e sfrutta urgenza e autorita\\'. Nota l\\'indirizzo email falso (r0ssi con lo zero). Mai acquistare buoni regalo su richiesta via email.')">
          <input type="radio" name="q2"> Rispondo all'email chiedendo conferma
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2,'c','c','Corretto! Questa e\\' una truffa BEC (Business Email Compromise) che sfrutta l\\'autorita\\' del capo e l\\'urgenza. L\\'indirizzo email e\\' falso (nota: r0ssi con lo zero). Verifica sempre di persona richieste insolite di denaro, anche se sembrano provenire da superiori.','Sbagliato! Questa e\\' una classica truffa BEC (Business Email Compromise). L\\'attaccante impersona un superiore e sfrutta urgenza e autorita\\'. Nota l\\'indirizzo email falso (r0ssi con lo zero). Mai acquistare buoni regalo su richiesta via email.')">
          <input type="radio" name="q2"> Chiamo il capo direttamente al telefono per verificare la richiesta e segnalo l'email sospetta all'IT
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(2,'d','c','Corretto! Questa e\\' una truffa BEC (Business Email Compromise) che sfrutta l\\'autorita\\' del capo e l\\'urgenza. L\\'indirizzo email e\\' falso (nota: r0ssi con lo zero). Verifica sempre di persona richieste insolite di denaro, anche se sembrano provenire da superiori.','Sbagliato! Questa e\\' una classica truffa BEC (Business Email Compromise). L\\'attaccante impersona un superiore e sfrutta urgenza e autorita\\'. Nota l\\'indirizzo email falso (r0ssi con lo zero). Mai acquistare buoni regalo su richiesta via email.')">
          <input type="radio" name="q2"> Ignoro l'email e basta
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">Scenario 3.</span> Trovi una chiavetta USB nel parcheggio dell'ufficio con un'etichetta "Stipendi Q4 2025". Cosa fai?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3,'a','c','Corretto! Questa tecnica si chiama baiting (adescamento). Le chiavette USB abbandonate possono contenere malware che si esegue automaticamente quando inserite nel computer. Consegnala sempre al reparto IT senza inserirla in nessun dispositivo.','Sbagliato! Questa tecnica si chiama baiting (adescamento): le chiavette USB abbandonate sono spesso trappole che contengono malware. L\\'etichetta allettante (&quot;Stipendi&quot;) serve ad aumentare la curiosita\\'. Non inserirla mai: consegnala all\\'IT.')">
          <input type="radio" name="q3"> La inserisco nel mio PC per vedere se contiene informazioni importanti da restituire
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3,'b','c','Corretto! Questa tecnica si chiama baiting (adescamento). Le chiavette USB abbandonate possono contenere malware che si esegue automaticamente quando inserite nel computer. Consegnala sempre al reparto IT senza inserirla in nessun dispositivo.','Sbagliato! Questa tecnica si chiama baiting (adescamento): le chiavette USB abbandonate sono spesso trappole che contengono malware. L\\'etichetta allettante (&quot;Stipendi&quot;) serve ad aumentare la curiosita\\'. Non inserirla mai: consegnala all\\'IT.')">
          <input type="radio" name="q3"> La inserisco nel PC di un collega per non rischiare il mio
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3,'c','c','Corretto! Questa tecnica si chiama baiting (adescamento). Le chiavette USB abbandonate possono contenere malware che si esegue automaticamente quando inserite nel computer. Consegnala sempre al reparto IT senza inserirla in nessun dispositivo.','Sbagliato! Questa tecnica si chiama baiting (adescamento): le chiavette USB abbandonate sono spesso trappole che contengono malware. L\\'etichetta allettante (&quot;Stipendi&quot;) serve ad aumentare la curiosita\\'. Non inserirla mai: consegnala all\\'IT.')">
          <input type="radio" name="q3"> Non la tocco e la segnalo al reparto IT o alla sicurezza
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">Scenario 4.</span> Stai entrando in ufficio con il tuo badge. Una persona dietro di te dice:</h3>
      <div style="background:#1a2332;border:1px solid #334155;border-radius:6px;padding:1rem;margin:0.5rem 0;font-size:0.88rem;color:#94a3b8;line-height:1.6;font-style:italic;">
        "Scusi, puo' tenermi la porta? Ho dimenticato il badge a casa e sono gia' in ritardo per una riunione
        importante con il direttore. Lavoro al terzo piano, sono Marco del marketing."
      </div>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4,'a','b','Corretto! Questa tecnica si chiama tailgating (o piggybacking): qualcuno approfitta del tuo accesso per entrare senza autorizzazione. Anche se sembra scortese, non tenere mai la porta. Indirizza la persona alla reception o alla sicurezza per il rilascio di un badge temporaneo.','Sbagliato! Questa tecnica si chiama tailgating: approfittare dell\\'accesso di un\\'altra persona per superare i controlli fisici. Non tenere mai la porta aperta, anche se la persona sembra simpatica o credibile. Indirizzala alla reception.')">
          <input type="radio" name="q4"> Tengo la porta aperta: sembra una persona gentile e ha fretta
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4,'b','b','Corretto! Questa tecnica si chiama tailgating (o piggybacking): qualcuno approfitta del tuo accesso per entrare senza autorizzazione. Anche se sembra scortese, non tenere mai la porta. Indirizza la persona alla reception o alla sicurezza per il rilascio di un badge temporaneo.','Sbagliato! Questa tecnica si chiama tailgating: approfittare dell\\'accesso di un\\'altra persona per superare i controlli fisici. Non tenere mai la porta aperta, anche se la persona sembra simpatica o credibile. Indirizzala alla reception.')">
          <input type="radio" name="q4"> Mi scuso ma non posso farlo entrare: lo indirizzo alla reception per un badge temporaneo
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4,'c','b','Corretto! Questa tecnica si chiama tailgating (o piggybacking): qualcuno approfitta del tuo accesso per entrare senza autorizzazione. Anche se sembra scortese, non tenere mai la porta. Indirizza la persona alla reception o alla sicurezza per il rilascio di un badge temporaneo.','Sbagliato! Questa tecnica si chiama tailgating: approfittare dell\\'accesso di un\\'altra persona per superare i controlli fisici. Non tenere mai la porta aperta, anche se la persona sembra simpatica o credibile. Indirizzala alla reception.')">
          <input type="radio" name="q4"> Lo faccio entrare ma gli chiedo di registrarsi dopo
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">Scenario 5.</span> Ricevi un messaggio su LinkedIn:</h3>
      <div class="email-sim">
        <div class="from">Da: <strong>Premio LinkedIn Awards</strong></div>
        <div class="subject">Complimenti! Ha vinto un premio!</div>
        <div class="body">
          Gentile utente, il suo profilo e' stato selezionato per il premio "Top Professional 2025"!
          Per riscuotere il suo premio di 5.000&euro;, <span class="link">clicchi qui</span> e inserisca
          i dati della sua carta per ricevere il bonifico. Offerta valida solo per 24 ore!
        </div>
      </div>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5,'a','b','Corretto! Questo e\\' un classico attacco di phishing che sfrutta la lusingheria e l\\'urgenza (&quot;solo 24 ore&quot;). LinkedIn non assegna premi in denaro tramite messaggi privati. Non cliccare mai link sospetti e non inserire dati bancari. Segnala il profilo e blocca il mittente.','Sbagliato! Questo e\\' phishing: nessun premio legittimo richiede dati bancari via messaggio. L\\'attaccante sfrutta lusingheria e urgenza. Non cliccare link sospetti, non inserire dati personali. Segnala il profilo a LinkedIn.')">
          <input type="radio" name="q5"> Clicco il link: potrebbe essere un'opportunita' vera
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5,'b','b','Corretto! Questo e\\' un classico attacco di phishing che sfrutta la lusingheria e l\\'urgenza (&quot;solo 24 ore&quot;). LinkedIn non assegna premi in denaro tramite messaggi privati. Non cliccare mai link sospetti e non inserire dati bancari. Segnala il profilo e blocca il mittente.','Sbagliato! Questo e\\' phishing: nessun premio legittimo richiede dati bancari via messaggio. L\\'attaccante sfrutta lusingheria e urgenza. Non cliccare link sospetti, non inserire dati personali. Segnala il profilo a LinkedIn.')">
          <input type="radio" name="q5"> Ignoro il messaggio, segnalo il profilo come spam e lo blocco
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5,'c','b','Corretto! Questo e\\' un classico attacco di phishing che sfrutta la lusingheria e l\\'urgenza (&quot;solo 24 ore&quot;). LinkedIn non assegna premi in denaro tramite messaggi privati. Non cliccare mai link sospetti e non inserire dati bancari. Segnala il profilo e blocca il mittente.','Sbagliato! Questo e\\' phishing: nessun premio legittimo richiede dati bancari via messaggio. L\\'attaccante sfrutta lusingheria e urgenza. Non cliccare link sospetti, non inserire dati personali. Segnala il profilo a LinkedIn.')">
          <input type="radio" name="q5"> Rispondo chiedendo maggiori informazioni sul premio
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">Scenario 6.</span> Ricevi una telefonata:</h3>
      <div style="background:#1a2332;border:1px solid #334155;border-radius:6px;padding:1rem;margin:0.5rem 0;font-size:0.88rem;color:#94a3b8;line-height:1.6;font-style:italic;">
        "Buongiorno, la chiamo dalla sua banca. Abbiamo rilevato un accesso sospetto sul suo conto.
        Per bloccare l'operazione fraudolenta ho bisogno di verificare la sua identita'. Mi puo' comunicare
        il suo PIN e il codice OTP che ha appena ricevuto via SMS?"
      </div>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6,'a','c','Corretto! Questa e\\' una tecnica di vishing (voice phishing) combinata con pretexting. Nessuna banca chiedera\\' mai PIN o OTP per telefono. Questi codici servono esclusivamente a te per autorizzare operazioni. Riaggancia e chiama il numero ufficiale della tua banca.','Sbagliato! Questa e\\' vishing (voice phishing). Le banche non chiedono MAI PIN o codici OTP al telefono. Se comunichi l\\'OTP, l\\'attaccante puo\\' autorizzare transazioni a tuo nome. Riaggancia sempre e chiama la banca al numero ufficiale.')">
          <input type="radio" name="q6"> Comunico il PIN e l'OTP: la banca deve verificare la mia identita' per proteggermi
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6,'b','c','Corretto! Questa e\\' una tecnica di vishing (voice phishing) combinata con pretexting. Nessuna banca chiedera\\' mai PIN o OTP per telefono. Questi codici servono esclusivamente a te per autorizzare operazioni. Riaggancia e chiama il numero ufficiale della tua banca.','Sbagliato! Questa e\\' vishing (voice phishing). Le banche non chiedono MAI PIN o codici OTP al telefono. Se comunichi l\\'OTP, l\\'attaccante puo\\' autorizzare transazioni a tuo nome. Riaggancia sempre e chiama la banca al numero ufficiale.')">
          <input type="radio" name="q6"> Do solo il PIN ma non l'OTP
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6,'c','c','Corretto! Questa e\\' una tecnica di vishing (voice phishing) combinata con pretexting. Nessuna banca chiedera\\' mai PIN o OTP per telefono. Questi codici servono esclusivamente a te per autorizzare operazioni. Riaggancia e chiama il numero ufficiale della tua banca.','Sbagliato! Questa e\\' vishing (voice phishing). Le banche non chiedono MAI PIN o codici OTP al telefono. Se comunichi l\\'OTP, l\\'attaccante puo\\' autorizzare transazioni a tuo nome. Riaggancia sempre e chiama la banca al numero ufficiale.')">
          <input type="radio" name="q6"> Riaggancio senza dare nessun dato e chiamo la banca al numero ufficiale sul sito o sulla carta
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6,'d','c','Corretto! Questa e\\' una tecnica di vishing (voice phishing) combinata con pretexting. Nessuna banca chiedera\\' mai PIN o OTP per telefono. Questi codici servono esclusivamente a te per autorizzare operazioni. Riaggancia e chiama il numero ufficiale della tua banca.','Sbagliato! Questa e\\' vishing (voice phishing). Le banche non chiedono MAI PIN o codici OTP al telefono. Se comunichi l\\'OTP, l\\'attaccante puo\\' autorizzare transazioni a tuo nome. Riaggancia sempre e chiama la banca al numero ufficiale.')">
          <input type="radio" name="q6"> Chiedo di richiamarmi piu' tardi per avere tempo di pensarci
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

  const html = wrapQuiz("Social Engineering Quiz", body);
  res.setHeader("Content-Type", "text/html");
  return res.status(200).send(html);
}
