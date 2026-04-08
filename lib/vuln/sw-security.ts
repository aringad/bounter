import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>Sicurezza Switch</h2>
      <p>
        Gli switch managed offrono funzionalita' di sicurezza essenziali per proteggere la rete da accessi
        non autorizzati e attacchi. Port security, DHCP snooping, DAI e la gestione sicura sono pilastri
        fondamentali della sicurezza di rete a Layer 2.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">Port Security:</strong> Limita il numero e l'identita' dei MAC address ammessi su ogni porta, bloccando dispositivi non autorizzati.</li>
        <li><strong style="color:#38bdf8;">DHCP Snooping:</strong> Classifica le porte in trusted/untrusted e blocca risposte DHCP da porte non autorizzate, prevenendo server DHCP rogue.</li>
        <li><strong style="color:#38bdf8;">DAI (Dynamic ARP Inspection):</strong> Verifica i pacchetti ARP contro la tabella di binding DHCP snooping, prevenendo attacchi ARP spoofing.</li>
        <li><strong style="color:#38bdf8;">SSH vs Telnet:</strong> SSH cripta le comunicazioni di gestione, Telnet trasmette tutto in chiaro incluse le credenziali.</li>
        <li><strong style="color:#38bdf8;">QoS (Quality of Service):</strong> Prioritizza il traffico critico (es. VoIP) usando 802.1p PCP nel tag 802.1Q o DSCP nell'header IP.</li>
      </ul>
    </div>

    <!-- Q1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">1.</span> Cosa fa la funzionalita' port security su uno switch?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'b',
          '',
          'Sbagliato. La crittografia del traffico non e\\' una funzione della port security. Port security controlla quali e quanti MAC address possono usare una porta.')">
          <input type="radio" name="q1"> <span>Cripta tutto il traffico sulla porta</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'b',
          'Corretto! Port security limita quali e quanti MAC address sono ammessi su ogni porta dello switch. Se un dispositivo non autorizzato (MAC sconosciuto) si collega, la porta puo\\' bloccare il traffico o disattivarsi completamente, impedendo l\\'accesso alla rete.',
          '')">
          <input type="radio" name="q1"> <span>Limita quali e quanti MAC per porta, blocca dispositivi non autorizzati</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'b',
          '',
          'Sbagliato. La velocita\\' della porta si configura separatamente. Port security controlla l\\'accesso limitando i MAC address ammessi sulla porta.')">
          <input type="radio" name="q1"> <span>Aumenta la velocita' della porta</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">2.</span> Cosa succede quando la modalita' di violazione port security e' impostata su "shutdown"?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'c',
          '',
          'Sbagliato. In modalita\\' shutdown, la porta non rimane attiva. Viene completamente disabilitata (err-disabled) e richiede intervento manuale.')">
          <input type="radio" name="q2"> <span>Il frame viene scartato ma la porta resta attiva</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'c',
          '',
          'Sbagliato. La porta non si riattiva da sola dopo un minuto. In modalita\\' shutdown va in err-disabled e richiede che l\\'amministratore la riabiliti manualmente.')">
          <input type="radio" name="q2"> <span>La porta si disattiva per un minuto e poi si riattiva</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'c',
          'Corretto! In modalita\\' shutdown, la porta va in stato err-disabled: viene completamente disattivata e non puo\\' piu\\' trasmettere ne\\' ricevere traffico. L\\'amministratore deve intervenire manualmente con i comandi &amp;quot;shutdown&amp;quot; e &amp;quot;no shutdown&amp;quot; per riabilitarla.',
          '')">
          <input type="radio" name="q2"> <span>La porta va in err-disabled e serve riabilitazione manuale</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">3.</span> Cos'e' il DHCP snooping?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'b',
          '',
          'Sbagliato. DHCP snooping non e\\' un server DHCP. E\\' una funzione di sicurezza dello switch che controlla quali porte possono inviare risposte DHCP.')">
          <input type="radio" name="q3"> <span>Un server DHCP integrato nello switch</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'b',
          'Corretto! DHCP snooping classifica le porte dello switch in trusted (collegate al server DHCP legittimo) e untrusted (tutte le altre). Blocca le risposte DHCP (OFFER, ACK) provenienti da porte untrusted, impedendo a un attaccante di creare un server DHCP rogue che assegna configurazioni malevole.',
          '')">
          <input type="radio" name="q3"> <span>Classifica porte trusted/untrusted, blocca risposte DHCP da porte non autorizzate</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'b',
          '',
          'Sbagliato. Questa descrizione si avvicina di piu\\' a 802.1X (autenticazione). DHCP snooping controlla specificamente il traffico DHCP per prevenire server DHCP rogue.')">
          <input type="radio" name="q3"> <span>Un protocollo per autenticare gli utenti sulla rete</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(3, 'd', 'b',
          '',
          'Sbagliato. La crittografia DHCP non esiste. DHCP snooping e\\' una funzione di sicurezza che filtra il traffico DHCP sullo switch per prevenire server rogue.')">
          <input type="radio" name="q3"> <span>Un sistema di crittografia per il traffico DHCP</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">4.</span> Cosa previene DAI (Dynamic ARP Inspection)?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'c',
          '',
          'Sbagliato. Gli attacchi DNS sono gestiti da altre soluzioni (DNSSEC). DAI si concentra sulla verifica dei pacchetti ARP per prevenire l\\'ARP spoofing.')">
          <input type="radio" name="q4"> <span>Attacchi DNS spoofing</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'c',
          '',
          'Sbagliato. Il flooding della tabella MAC e\\' gestito dalla port security. DAI verifica i pacchetti ARP contro la tabella di binding DHCP snooping.')">
          <input type="radio" name="q4"> <span>MAC address table flooding</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'c',
          'Corretto! DAI previene l\\'ARP spoofing verificando che le risposte ARP corrispondano alle associazioni IP-MAC nella tabella di binding del DHCP snooping. Se un attaccante invia risposte ARP false per intercettare il traffico (man-in-the-middle), DAI le blocca.',
          '')">
          <input type="radio" name="q4"> <span>ARP spoofing - verifica le risposte ARP contro la tabella di binding DHCP snooping</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(4, 'd', 'c',
          '',
          'Sbagliato. I loop di rete sono gestiti da STP/RSTP. DAI e\\' una funzione di sicurezza che previene l\\'ARP spoofing verificando i pacchetti ARP.')">
          <input type="radio" name="q4"> <span>Loop di rete</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">5.</span> Perche' non bisogna mai usare Telnet per gestire uno switch in produzione?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'b',
          '',
          'Sbagliato. Telnet non e\\' piu\\' lento di SSH per la gestione. Il problema e\\' la sicurezza: Telnet trasmette tutto in chiaro, incluse le credenziali.')">
          <input type="radio" name="q5"> <span>Telnet e' troppo lento per la gestione</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'b',
          'Corretto! Telnet trasmette tutti i dati in chiaro, inclusi username e password. Chiunque intercetti il traffico (con un semplice sniffer) puo\\' leggere le credenziali di accesso allo switch. SSH cripta l\\'intera sessione, proteggendo le credenziali e i comandi.',
          '')">
          <input type="radio" name="q5"> <span>Le credenziali viaggiano in chiaro, bisogna usare SSH</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'b',
          '',
          'Sbagliato. Telnet non e\\' deprecato per motivi di compatibilita\\'. Il problema e\\' che trasmette le credenziali in chiaro. SSH e\\' l\\'alternativa sicura.')">
          <input type="radio" name="q5"> <span>Telnet non e' compatibile con gli switch moderni</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">6.</span> Come si prioritizza il traffico VoIP sullo switch con QoS?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'c',
          '',
          'Sbagliato. Dare piu\\' banda alla porta VoIP non garantisce priorita\\'. Il QoS usa campi specifici nei frame/pacchetti per classificare e prioritizzare il traffico.')">
          <input type="radio" name="q6"> <span>Assegnando piu' banda alla porta del telefono VoIP</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'c',
          '',
          'Sbagliato. Mettere il VoIP su una VLAN separata e\\' una best practice, ma non basta per garantire priorita\\'. Serve il QoS con marcatura 802.1p PCP o DSCP EF.')">
          <input type="radio" name="q6"> <span>Mettendo i telefoni VoIP in una VLAN separata senza QoS</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'c',
          'Corretto! Il QoS per VoIP usa il campo PCP (Priority Code Point) nel tag 802.1Q a Layer 2, oppure il campo DSCP (Differentiated Services Code Point) con marcatura EF (Expedited Forwarding) a Layer 3. Questo permette allo switch di dare priorita\\' ai pacchetti voce rispetto al traffico dati.',
          '')">
          <input type="radio" name="q6"> <span>802.1p PCP nel tag 802.1Q oppure DSCP con marcatura EF</span>
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

  const html = wrapQuiz("Sicurezza Switch", body);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
