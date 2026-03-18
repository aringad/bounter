import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>Porte di Rete</h2>
      <p>
        Le porte di rete identificano i servizi in esecuzione su un host. Ogni connessione TCP/UDP e' definita
        dalla combinazione di indirizzo IP e numero di porta, formando un <strong>socket</strong> (es. 192.168.1.1:443).
        I numeri di porta vanno da 0 a 65535 e sono divisi in tre categorie gestite dalla IANA.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">Well-Known (0-1023):</strong> Porte riservate a servizi standard (HTTP=80, HTTPS=443, SSH=22, DNS=53, SMTP=25). Richiedono privilegi root/admin.</li>
        <li><strong style="color:#38bdf8;">Registered (1024-49151):</strong> Porte registrate per applicazioni specifiche (MySQL=3306, RDP=3389, PostgreSQL=5432).</li>
        <li><strong style="color:#38bdf8;">Dynamic/Ephemeral (49152-65535):</strong> Porte effimere assegnate dinamicamente dal sistema operativo per connessioni client temporanee.</li>
        <li><strong style="color:#38bdf8;">Sicurezza:</strong> Conoscere le porte standard aiuta a identificare servizi esposti, configurare firewall e individuare attivita' sospette.</li>
      </ul>
    </div>

    <!-- Q1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">1.</span> SSH (Secure Shell) utilizza quale porta di default?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'b',
          '',
          'Sbagliato. La porta 21 e\\' utilizzata da FTP (File Transfer Protocol) per il trasferimento file. SSH usa la porta 22 per connessioni remote sicure e crittografate.')">
          <input type="radio" name="q1"> <span>21</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'b',
          'Corretto! SSH utilizza la porta TCP 22. E\\' il protocollo standard per accesso remoto sicuro ai server, trasferimento file (SCP/SFTP) e tunneling crittografato, sostituendo il vecchio Telnet (porta 23) che trasmetteva tutto in chiaro.',
          '')">
          <input type="radio" name="q1"> <span>22</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'b',
          '',
          'Sbagliato. La porta 23 e\\' utilizzata da Telnet, il predecessore non sicuro di SSH. Le credenziali Telnet viaggiano in chiaro! SSH usa la porta 22 con crittografia.')">
          <input type="radio" name="q1"> <span>23</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1, 'd', 'b',
          '',
          'Sbagliato. La porta 80 e\\' utilizzata da HTTP (web non crittografato). SSH per l\\'accesso remoto sicuro usa la porta 22.')">
          <input type="radio" name="q1"> <span>80</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">2.</span> HTTPS utilizza quale porta di default?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'c',
          '',
          'Sbagliato. La porta 80 e\\' usata da HTTP (senza crittografia). HTTPS, la versione sicura con TLS/SSL, usa la porta 443.')">
          <input type="radio" name="q2"> <span>80</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'c',
          '',
          'Sbagliato. La porta 8080 e\\' spesso usata come porta alternativa per server web o proxy in sviluppo, ma non e\\' la porta standard di HTTPS. HTTPS usa la porta 443.')">
          <input type="radio" name="q2"> <span>8080</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'c',
          'Corretto! HTTPS usa la porta TCP 443. Quando visiti un sito con il lucchetto nel browser, la connessione e\\' crittografata con TLS/SSL sulla porta 443, proteggendo dati sensibili come password e carte di credito.',
          '')">
          <input type="radio" name="q2"> <span>443</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(2, 'd', 'c',
          '',
          'Sbagliato. La porta 22 e\\' usata da SSH per l\\'accesso remoto. HTTPS usa la porta 443.')">
          <input type="radio" name="q2"> <span>22</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">3.</span> Quale range di porte e' considerato "well-known" (porte note)?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'a',
          'Corretto! Le porte da 0 a 1023 sono le well-known ports, riservate a servizi standard e gestite dalla IANA. Su sistemi Unix/Linux, solo i processi con privilegi di root possono mettersi in ascolto su queste porte, aggiungendo un livello di sicurezza.',
          '')">
          <input type="radio" name="q3"> <span>0-1023</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'a',
          '',
          'Sbagliato. Il range 1024-49151 comprende le porte registrate (registered ports), assegnate a servizi specifici come MySQL (3306) e RDP (3389). Le well-known ports sono il range 0-1023.')">
          <input type="radio" name="q3"> <span>1024-49151</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'a',
          '',
          'Sbagliato. Il range 0-255 e\\' troppo ristretto e non corrisponde a nessuna categoria ufficiale. Le well-known ports comprendono tutto il range da 0 a 1023.')">
          <input type="radio" name="q3"> <span>0-255</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(3, 'd', 'a',
          '',
          'Sbagliato. Il range 49152-65535 comprende le porte dinamiche/effimere, usate temporaneamente dal sistema operativo per le connessioni client in uscita. Le well-known ports sono 0-1023.')">
          <input type="radio" name="q3"> <span>49152-65535</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">4.</span> SMTP (Simple Mail Transfer Protocol) per il relay tra server usa quale porta di default?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'b',
          '',
          'Sbagliato. La porta 110 e\\' usata da POP3, un protocollo per scaricare la posta dal server al client. SMTP, che serve per inviare la posta tra server, usa la porta 25.')">
          <input type="radio" name="q4"> <span>110</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'b',
          'Corretto! SMTP usa la porta TCP 25 per l\\'invio di email tra server di posta (relay). Nota: per l\\'invio da client a server si usano spesso le porte 587 (submission con autenticazione) o 465 (SMTPS con TLS implicito), ma la porta standard SMTP e\\' la 25.',
          '')">
          <input type="radio" name="q4"> <span>25</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'b',
          '',
          'Sbagliato. La porta 143 e\\' usata da IMAP, un protocollo per leggere e gestire la posta direttamente sul server. SMTP per l\\'invio usa la porta 25.')">
          <input type="radio" name="q4"> <span>143</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(4, 'd', 'b',
          '',
          'Sbagliato. La porta 53 e\\' usata da DNS (Domain Name System) per la risoluzione dei nomi di dominio. SMTP usa la porta 25.')">
          <input type="radio" name="q4"> <span>53</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">5.</span> RDP (Remote Desktop Protocol) usa quale porta di default?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'c',
          '',
          'Sbagliato. La porta 5900 e\\' usata da VNC (Virtual Network Computing), un altro protocollo di desktop remoto. RDP di Microsoft usa la porta 3389.')">
          <input type="radio" name="q5"> <span>5900</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'c',
          '',
          'Sbagliato. La porta 8443 e\\' spesso usata come porta HTTPS alternativa per interfacce di amministrazione. RDP usa la porta 3389.')">
          <input type="radio" name="q5"> <span>8443</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'c',
          'Corretto! RDP usa la porta TCP/UDP 3389. E\\' il protocollo di Microsoft per il controllo remoto del desktop di Windows. Questa porta e\\' spesso bersaglio di attacchi brute-force, quindi e\\' buona pratica limitarne l\\'accesso via firewall o usare una VPN.',
          '')">
          <input type="radio" name="q5"> <span>3389</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(5, 'd', 'c',
          '',
          'Sbagliato. La porta 1433 e\\' usata da Microsoft SQL Server per le connessioni al database. RDP usa la porta 3389.')">
          <input type="radio" name="q5"> <span>1433</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">6.</span> DNS (Domain Name System) usa quale porta e quale protocollo?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'c',
          '',
          'Sbagliato. DNS usa la porta 53, non la 80. La porta 80 e\\' riservata ad HTTP per il traffico web.')">
          <input type="radio" name="q6"> <span>Porta 80, solo TCP</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'c',
          '',
          'Sbagliato. La porta e\\' corretta (53), ma DNS non usa solo UDP. Le query standard usano UDP per velocita\\', ma i trasferimenti di zona (AXFR) e le risposte che superano i 512 byte usano TCP. DNS usa entrambi i protocolli.')">
          <input type="radio" name="q6"> <span>Porta 53, solo UDP</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'c',
          'Corretto! DNS usa la porta 53 con entrambi i protocolli. Le query di risoluzione nomi normali usano UDP per velocita\\' (domanda/risposta rapida), ma TCP e\\' usato per i trasferimenti di zona (AXFR) tra server DNS e per risposte che superano i 512 byte.',
          '')">
          <input type="radio" name="q6"> <span>Porta 53, sia TCP che UDP</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6, 'd', 'c',
          '',
          'Sbagliato. La porta e\\' corretta (53), ma DNS non usa solo TCP. La maggior parte delle query DNS usa UDP per velocita\\'. TCP e\\' usato solo per trasferimenti di zona e risposte di grandi dimensioni. DNS usa entrambi i protocolli.')">
          <input type="radio" name="q6"> <span>Porta 53, solo TCP</span>
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

  const html = wrapQuiz("Porte di Rete", body);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
