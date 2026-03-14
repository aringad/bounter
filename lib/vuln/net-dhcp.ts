import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>DHCP: il protocollo DORA</h2>
      <p>
        Il DHCP (Dynamic Host Configuration Protocol) assegna automaticamente indirizzi IP e parametri di rete ai dispositivi.
        Il processo si chiama DORA, dalle quattro fasi che lo compongono.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">Discover:</strong> Il client invia un messaggio broadcast per cercare un server DHCP nella rete.</li>
        <li><strong style="color:#38bdf8;">Offer:</strong> Il server DHCP risponde offrendo un indirizzo IP disponibile e i parametri di configurazione.</li>
        <li><strong style="color:#38bdf8;">Request:</strong> Il client accetta l\\'offerta e richiede formalmente l\\'indirizzo IP proposto.</li>
        <li><strong style="color:#38bdf8;">Acknowledge:</strong> Il server conferma l\\'assegnazione e il client puo\\' usare l\\'indirizzo IP per il periodo di lease.</li>
        <li><strong style="color:#38bdf8;">Lease Time:</strong> Il tempo per cui l\\'indirizzo IP e\\' valido. Alla scadenza, il client deve rinnovarlo o ottenerne uno nuovo.</li>
      </ul>
    </div>

    <!-- Q1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">1.</span> Qual e' l'ordine corretto delle fasi del protocollo DHCP?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'c',
          '',
          'Sbagliato. L\\'ordine Request, Offer, Discover, Acknowledge non e\\' corretto. Il client deve prima scoprire il server (Discover), ricevere un\\'offerta (Offer), richiederla (Request) e infine ottenere conferma (Acknowledge): DORA.')">
          <input type="radio" name="q1"> <span>Request, Offer, Discover, Acknowledge</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'c',
          '',
          'Sbagliato. Offer non puo\\' essere la prima fase: il server non sa che c\\'e\\' un client finche\\' non riceve il Discover. L\\'ordine corretto e\\' Discover, Offer, Request, Acknowledge (DORA).')">
          <input type="radio" name="q1"> <span>Offer, Discover, Acknowledge, Request</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'c',
          'Corretto! L\\'acronimo DORA descrive le 4 fasi nell\\'ordine: Discover (il client cerca un server), Offer (il server propone un IP), Request (il client accetta l\\'offerta) e Acknowledge (il server conferma l\\'assegnazione).',
          '')">
          <input type="radio" name="q1"> <span>Discover, Offer, Request, Acknowledge</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1, 'd', 'c',
          '',
          'Sbagliato. L\\'Acknowledge non puo\\' precedere il Request. Il server deve prima ricevere la richiesta formale dal client. L\\'ordine corretto e\\' DORA: Discover, Offer, Request, Acknowledge.')">
          <input type="radio" name="q1"> <span>Discover, Acknowledge, Request, Offer</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">2.</span> Quale protocollo di trasporto e quali porte usa il DHCP?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'b',
          '',
          'Sbagliato. TCP e\\' orientato alla connessione e richiederebbe un handshake prima dello scambio dati. Il DHCP usa UDP perche\\' il client non ha ancora un IP e non puo\\' stabilire una connessione TCP. Le porte corrette sono UDP 67 (server) e 68 (client).')">
          <input type="radio" name="q2"> <span>TCP porte 80/443</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'b',
          'Corretto! Il DHCP usa UDP perche\\' il client non ha ancora un indirizzo IP e non puo\\' stabilire una connessione TCP. La porta 67 e\\' usata dal server DHCP per ricevere le richieste, e la porta 68 dal client per ricevere le risposte.',
          '')">
          <input type="radio" name="q2"> <span>UDP porte 67/68</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'b',
          '',
          'Sbagliato. Le porte 53 sono usate dal DNS, non dal DHCP. Il DHCP utilizza UDP sulle porte 67 (server) e 68 (client).')">
          <input type="radio" name="q2"> <span>UDP porte 53/53</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(2, 'd', 'b',
          '',
          'Sbagliato. Le porte 20/21 sono usate dall\\'FTP. Il DHCP usa UDP sulle porte 67 (server) e 68 (client).')">
          <input type="radio" name="q2"> <span>TCP porte 20/21</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">3.</span> Cosa succede quando scade il lease time di un indirizzo DHCP?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'b',
          '',
          'Sbagliato. L\\'indirizzo non viene mantenuto per sempre. Alla scadenza del lease, il client deve rinnovarlo. In genere il client tenta il rinnovo al 50% della durata del lease e, se fallisce, riprova all\\'87.5%.')">
          <input type="radio" name="q3"> <span>L\\'indirizzo resta assegnato per sempre</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'b',
          'Corretto! Alla scadenza del lease, il client deve rinnovare l\\'indirizzo IP con il server DHCP. Normalmente il client tenta il rinnovo al 50% della durata del lease (T1) e, se fallisce, riprova all\\'87.5% (T2). Se non riesce a rinnovare, perde l\\'indirizzo e deve ricominciare il processo DORA.',
          '')">
          <input type="radio" name="q3"> <span>Il client deve rinnovare l\\'indirizzo con il server</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'b',
          '',
          'Sbagliato. Il computer non si spegne. Semplicemente il client deve rinnovare il lease con il server DHCP. Se non riesce, perde l\\'indirizzo e la connettivita\\' di rete.')">
          <input type="radio" name="q3"> <span>Il computer si spegne automaticamente</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">4.</span> Quali informazioni fornisce tipicamente un server DHCP al client?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'c',
          '',
          'Sbagliato. Il DHCP non fornisce nome utente e password. Fornisce parametri di rete: indirizzo IP, subnet mask, default gateway e server DNS.')">
          <input type="radio" name="q4"> <span>Nome utente e password</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'c',
          '',
          'Sbagliato. L\\'indirizzo MAC e\\' gia\\' assegnato alla scheda di rete dal produttore. Il DHCP fornisce indirizzo IP, subnet mask, default gateway e server DNS.')">
          <input type="radio" name="q4"> <span>Solo l\\'indirizzo MAC</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'c',
          'Corretto! Il server DHCP fornisce al client tutti i parametri necessari per comunicare in rete: indirizzo IP, subnet mask (per identificare la sottorete), default gateway (per raggiungere altre reti) e server DNS (per risolvere i nomi di dominio in indirizzi IP).',
          '')">
          <input type="radio" name="q4"> <span>IP, subnet mask, default gateway e DNS</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(4, 'd', 'c',
          '',
          'Sbagliato. Solo l\\'indirizzo IP non basta. Senza subnet mask il client non sa quale parte e\\' rete e quale host, senza gateway non raggiunge altre reti. Il DHCP fornisce IP, subnet mask, gateway e DNS.')">
          <input type="radio" name="q4"> <span>Solo l\\'indirizzo IP</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">5.</span> Cos'e' un DHCP relay agent?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'b',
          '',
          'Sbagliato. Un server DNS risolve nomi di dominio, non inoltra richieste DHCP. Il relay agent e\\' un dispositivo (spesso un router) che inoltra le richieste DHCP broadcast verso un server DHCP in un\\'altra sottorete.')">
          <input type="radio" name="q5"> <span>Un server DNS che supporta il DHCP</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'b',
          'Corretto! Il DHCP relay agent (spesso configurato su un router) inoltra le richieste DHCP broadcast dei client verso un server DHCP che si trova in un\\'altra sottorete. Senza relay, servirebbe un server DHCP per ogni sottorete, perche\\' i broadcast non attraversano i router.',
          '')">
          <input type="radio" name="q5"> <span>Un dispositivo che inoltra richieste DHCP tra sottoreti diverse</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'b',
          '',
          'Sbagliato. Un DHCP di backup e\\' un concetto diverso (failover). Il relay agent inoltra le richieste DHCP dai client di una sottorete verso un server DHCP in un\\'altra sottorete.')">
          <input type="radio" name="q5"> <span>Un server DHCP di backup</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">6.</span> Un client ha ottenuto l'indirizzo 169.254.x.x. Cosa e' successo?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'c',
          '',
          'Sbagliato. 169.254.x.x non e\\' un indirizzo assegnato dal DHCP. E\\' un indirizzo APIPA (Automatic Private IP Addressing) che il client si auto-assegna quando non riceve risposta da un server DHCP.')">
          <input type="radio" name="q6"> <span>Il server DHCP ha assegnato un IP valido</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'c',
          '',
          'Sbagliato. Il client non e\\' connesso a una VPN. L\\'indirizzo 169.254.x.x (APIPA) indica che il client non ha ricevuto risposta dal server DHCP e si e\\' auto-assegnato un indirizzo link-local.')">
          <input type="radio" name="q6"> <span>Il client e' connesso tramite VPN</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'c',
          'Corretto! L\\'indirizzo 169.254.x.x e\\' un indirizzo APIPA (Automatic Private IP Addressing). Quando il client non riceve risposta da nessun server DHCP, si auto-assegna un indirizzo in questo range per comunicare almeno sulla rete locale. Indica un problema: server DHCP spento, irraggiungibile o esaurito.',
          '')">
          <input type="radio" name="q6"> <span>Nessun server DHCP ha risposto (APIPA)</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6, 'd', 'c',
          '',
          'Sbagliato. 169.254.x.x non e\\' un indirizzo pubblico e non indica un attacco. E\\' un indirizzo APIPA auto-assegnato dal client quando non riceve risposta da un server DHCP.')">
          <input type="radio" name="q6"> <span>La rete e' sotto attacco</span>
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

  const html = wrapQuiz("DHCP: il protocollo DORA", body);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
