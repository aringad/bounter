import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>Attacchi DNS</h2>
      <p>
        Il sistema DNS e' un bersaglio frequente per diversi tipi di attacchi. Il <strong>cache poisoning</strong>
        consiste nell'iniettare record falsi nella cache di un resolver, reindirizzando gli utenti verso siti malevoli.
        Il <strong>DNS hijacking</strong> modifica le impostazioni DNS del dispositivo o del router per dirottare
        le query verso un server controllato dall'attaccante. Il <strong>typosquatting</strong> registra domini
        con nomi simili a quelli legittimi (es. gooogle.com) per ingannare chi commette errori di digitazione.
      </p>
      <p style="margin-top: 0.5rem;">
        Il <strong>DNS tunneling</strong> sfrutta le query DNS per trasportare dati nascosti, aggirando firewall
        e filtri di rete per esfiltrare informazioni. Il <strong>DNS amplification</strong> e' un attacco DDoS
        che sfrutta server DNS aperti: l'attaccante invia piccole query con IP sorgente falsificato (spoofato),
        e il server risponde con risposte molto piu' grandi dirette alla vittima. La difesa principale contro
        il cache poisoning e' <strong>DNSSEC</strong>, che aggiunge firme crittografiche ai record DNS.
      </p>
    </div>

    <!-- Domanda 1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">Q1.</span> Cos'e' il DNS cache poisoning?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'b',
          'Corretto!',
          'Sbagliato. Cancellare la cache DNS non e\\' un attacco. Il cache poisoning consiste nell\\'iniettare record DNS falsi nella cache di un resolver, facendo si\\' che le query successive restituiscano indirizzi IP malevoli.')">
          <input type="radio" name="q1"> <span>Cancellare la cache DNS di un server</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'b',
          'Corretto! Il DNS cache poisoning consiste nell\\'iniettare record falsi nella cache di un resolver DNS. Quando un utente richiede quel dominio, il resolver restituisce l\\'indirizzo IP malevolo dalla cache invece di quello legittimo, reindirizzando il traffico verso un server controllato dall\\'attaccante.',
          'Sbagliato.')">
          <input type="radio" name="q1"> <span>Iniettare record falsi nella cache di un resolver DNS</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'b',
          'Corretto!',
          'Sbagliato. Sovraccaricare un server DNS e\\' un attacco DDoS, non cache poisoning. Il cache poisoning consiste nell\\'iniettare record DNS falsi nella cache di un resolver per reindirizzare il traffico verso siti malevoli.')">
          <input type="radio" name="q1"> <span>Sovraccaricare un server DNS con troppe richieste</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1, 'd', 'b',
          'Corretto!',
          'Sbagliato. Rubare le credenziali di accesso al server DNS e\\' un tipo diverso di attacco. Il cache poisoning inietta record falsi nella cache del resolver senza necessita\\' di accesso al server stesso.')">
          <input type="radio" name="q1"> <span>Rubare le credenziali di accesso a un server DNS</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">Q2.</span> Digiti gooogle.com (con tre 'o') e finisci su una pagina di phishing. Di che attacco si tratta?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'c',
          'Corretto!',
          'Sbagliato. Il DNS hijacking modifica le impostazioni DNS del dispositivo. In questo caso il dominio e\\' diverso da quello legittimo (gooogle vs google): si tratta di typosquatting, cioe\\' la registrazione di domini con nomi simili per ingannare chi sbaglia a digitare.')">
          <input type="radio" name="q2"> <span>DNS hijacking</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'c',
          'Corretto!',
          'Sbagliato. Il cache poisoning inietta record falsi nella cache DNS. Qui il problema e\\' che hai digitato un dominio sbagliato (gooogle.com): si tratta di typosquatting, un attacco che sfrutta gli errori di battitura degli utenti.')">
          <input type="radio" name="q2"> <span>Cache poisoning</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'c',
          'Corretto! Il typosquatting consiste nel registrare domini con nomi molto simili a quelli legittimi (come gooogle.com invece di google.com) per intercettare gli utenti che commettono errori di digitazione e reindirizzarli verso pagine di phishing o malware.',
          'Sbagliato.')">
          <input type="radio" name="q2"> <span>Typosquatting</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(2, 'd', 'c',
          'Corretto!',
          'Sbagliato. Il DNS tunneling serve per esfiltrare dati attraverso le query DNS. In questo caso hai semplicemente digitato un dominio sbagliato: si tratta di typosquatting, un attacco che sfrutta errori di battitura.')">
          <input type="radio" name="q2"> <span>DNS tunneling</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">Q3.</span> Cos'e' il DNS tunneling?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'a',
          'Corretto! Il DNS tunneling codifica dati all\\'interno delle query e delle risposte DNS per trasferire informazioni in modo nascosto. Viene spesso usato per esfiltrare dati sensibili aggirando firewall e sistemi di monitoraggio, poiche\\' il traffico DNS e\\' raramente bloccato o ispezionato.',
          'Sbagliato.')">
          <input type="radio" name="q3"> <span>Codificare dati nelle query DNS per esfiltrare informazioni</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'a',
          'Corretto!',
          'Sbagliato. Creare un tunnel VPN attraverso il DNS non e\\' la definizione corretta. Il DNS tunneling consiste nel codificare dati arbitrari nelle query e risposte DNS per trasferire informazioni in modo nascosto, eludendo i controlli di rete.')">
          <input type="radio" name="q3"> <span>Creare un tunnel VPN attraverso il protocollo DNS</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'a',
          'Corretto!',
          'Sbagliato. Intercettare query DNS in transito e\\' un attacco man-in-the-middle, non tunneling. Il DNS tunneling codifica dati all\\'interno delle query DNS stesse per trasferire informazioni in modo nascosto attraverso il protocollo DNS.')">
          <input type="radio" name="q3"> <span>Intercettare le query DNS in transito sulla rete</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(3, 'd', 'a',
          'Corretto!',
          'Sbagliato. Reindirizzare le query verso un server diverso e\\' DNS hijacking. Il DNS tunneling codifica dati nelle query DNS per trasportare informazioni nascoste, tipicamente per esfiltrare dati aggirando i firewall.')">
          <input type="radio" name="q3"> <span>Reindirizzare le query DNS verso un server diverso</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">Q4.</span> Come funziona un attacco DNS amplification?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'b',
          'Corretto!',
          'Sbagliato. Il DNS amplification non modifica i record DNS. Sfrutta server DNS aperti: l\\'attaccante invia piccole query con l\\'IP sorgente spoofato della vittima, e i server rispondono con risposte molto piu\\' grandi dirette alla vittima, amplificando il traffico.')">
          <input type="radio" name="q4"> <span>Modificando i record DNS per amplificare il segnale di rete</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'b',
          'Corretto! Nell\\'attacco DNS amplification, l\\'attaccante invia piccole query DNS a server aperti con l\\'indirizzo IP sorgente falsificato (spoofato) della vittima. I server rispondono con risposte molto piu\\' grandi (fino a 70 volte) dirette alla vittima, creando un potente attacco DDoS con poco sforzo da parte dell\\'attaccante.',
          'Sbagliato.')">
          <input type="radio" name="q4"> <span>Inviando piccole query con IP sorgente spoofato; il server risponde alla vittima con risposte molto piu' grandi</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'b',
          'Corretto!',
          'Sbagliato. L\\'attacco non moltiplica le query dei client. Sfrutta l\\'amplificazione: piccole query DNS generano risposte molto piu\\' grandi, e con l\\'IP sorgente spoofato, queste risposte vengono inviate alla vittima.')">
          <input type="radio" name="q4"> <span>Moltiplicando le query DNS dei client per sovraccaricare il resolver</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">Q5.</span> Cos'e' il DNS hijacking?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'b',
          'Corretto!',
          'Sbagliato. Bloccare le query DNS e\\' un attacco di tipo denial of service. Il DNS hijacking consiste nel reindirizzare le query DNS verso un server malevolo, modificando le impostazioni DNS del dispositivo, del router o del provider.')">
          <input type="radio" name="q5"> <span>Bloccare tutte le query DNS di un utente</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'b',
          'Corretto! Il DNS hijacking consiste nel dirottare le query DNS verso un server controllato dall\\'attaccante. Puo\\' avvenire modificando le impostazioni DNS del dispositivo (tramite malware), del router (accedendo alla configurazione) o a livello di ISP. L\\'utente viene cosi\\' reindirizzato verso siti malevoli senza accorgersene.',
          'Sbagliato.')">
          <input type="radio" name="q5"> <span>Reindirizzare le query DNS verso un server malevolo</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'b',
          'Corretto!',
          'Sbagliato. Cancellare i record DNS di un dominio e\\' un tipo diverso di attacco. Il DNS hijacking reindirizza le query DNS verso un server controllato dall\\'attaccante, modificando la configurazione DNS del dispositivo o del router.')">
          <input type="radio" name="q5"> <span>Cancellare i record DNS di un dominio</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(5, 'd', 'b',
          'Corretto!',
          'Sbagliato. Criptare le query DNS e\\' una misura di sicurezza (DNS over HTTPS/TLS), non un attacco. Il DNS hijacking consiste nel reindirizzare le query DNS verso un server controllato dall\\'attaccante.')">
          <input type="radio" name="q5"> <span>Criptare le query DNS per impedirne la lettura</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">Q6.</span> Quale difesa aiuta a prevenire il cache poisoning?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'b',
          'Corretto!',
          'Sbagliato. Un firewall puo\\' filtrare traffico di rete ma non protegge specificamente dal cache poisoning DNS. La difesa principale e\\' DNSSEC, che aggiunge firme crittografiche ai record DNS per garantirne l\\'autenticita\\'.')">
          <input type="radio" name="q6"> <span>Un firewall tradizionale</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'b',
          'Corretto! DNSSEC (Domain Name System Security Extensions) aggiunge firme crittografiche ai record DNS, permettendo ai resolver di verificare che le risposte provengano dal server autoritativo legittimo e non siano state manipolate. Questo rende inefficace il cache poisoning perche\\' i record falsi non avrebbero firme valide.',
          'Sbagliato.')">
          <input type="radio" name="q6"> <span>DNSSEC</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'b',
          'Corretto!',
          'Sbagliato. Un antivirus protegge da malware sul dispositivo locale, non dal cache poisoning che avviene a livello di resolver DNS. La difesa specifica e\\' DNSSEC, che firma crittograficamente i record DNS.')">
          <input type="radio" name="q6"> <span>Un antivirus aggiornato</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6, 'd', 'b',
          'Corretto!',
          'Sbagliato. Cambiare password non protegge dal cache poisoning, che e\\' un attacco al protocollo DNS. La difesa corretta e\\' DNSSEC, che aggiunge firme crittografiche ai record per verificarne l\\'autenticita\\'.')">
          <input type="radio" name="q6"> <span>Cambiare frequentemente le password</span>
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

  const html = wrapQuiz("Attacchi DNS", body);
  res.setHeader("Content-Type", "text/html");
  return res.status(200).send(html);
}
