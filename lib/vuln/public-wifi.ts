import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const html = wrapQuiz("Quiz: Sicurezza Wi-Fi Pubblico", `
    <div class="intro">
      <h2>I rischi del Wi-Fi pubblico</h2>
      <p>
        Le reti Wi-Fi pubbliche (bar, aeroporti, hotel, biblioteche) sono comode ma estremamente rischiose.
        Ecco le principali minacce:
      </p>
      <p style="margin-top:0.5rem">
        <strong style="color:#ef4444">Man-in-the-Middle (MitM):</strong> un attaccante si posiziona tra te e il punto di accesso,
        intercettando e potenzialmente modificando tutto il traffico. Puo' leggere credenziali, email e dati personali.
      </p>
      <p style="margin-top:0.5rem">
        <strong style="color:#ef4444">Evil Twin:</strong> l'attaccante crea un hotspot con un nome identico o simile alla rete legittima.
        Il tuo dispositivo si connette alla rete malevola pensando sia quella autentica.
      </p>
      <p style="margin-top:0.5rem">
        <strong style="color:#ef4444">Packet Sniffing:</strong> sulle reti aperte (senza crittografia), chiunque sulla stessa rete
        puo' catturare i pacchetti in transito e analizzarli per estrarre informazioni sensibili.
      </p>
    </div>

    <!-- Domanda 1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">Domanda 1.</span> Sei al bar "Bar Roma". Vedi queste reti Wi-Fi disponibili: "Bar_Roma_Free", "BarRoma_WiFi", "Free_WiFi_Roma". Qual e' la scelta piu' sicura?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'b',
          'Corretto! Dovresti sempre chiedere al personale quale sia la rete ufficiale.',
          'Sbagliato. Non puoi sapere quale rete sia legittima solo dal nome. Un attaccante puo\\u0027 creare reti con nomi molto simili (Evil Twin). Chiedi sempre al personale del locale!')">
          <input type="radio" name="q1" value="a"> a) Connettiti a "Bar_Roma_Free" perche' ha il nome del bar
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'b',
          'Corretto! Chiedere al barista e\\u0027 l\\u0027unico modo per verificare quale sia la rete ufficiale e proteggersi da attacchi Evil Twin.',
          'Sbagliato.')">
          <input type="radio" name="q1" value="b"> b) Chiedi al barista qual e' la rete ufficiale del locale
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'b',
          'Corretto!',
          'Sbagliato. La potenza del segnale non indica la legittimita\\u0027 della rete. Un attaccante puo\\u0027 usare un\\u0027antenna potente per attirarti sulla sua rete malevola.')">
          <input type="radio" name="q1" value="c"> c) Connettiti a quella con il segnale piu' forte
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1, 'd', 'b',
          'Corretto!',
          'Sbagliato. Avere &quot;Roma&quot; nel nome non garantisce nulla. Chiunque puo\\u0027 creare una rete con qualsiasi nome. Verifica sempre con il personale!')">
          <input type="radio" name="q1" value="d"> d) Qualsiasi rete con "Roma" nel nome va bene
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">Domanda 2.</span> Sei connesso al Wi-Fi dell'hotel. Quale di queste attivita' dovresti evitare?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'b',
          'Corretto!',
          'Sbagliato. Navigare su siti di notizie e\\u0027 relativamente sicuro. L\\u0027attivita\\u0027 da evitare assolutamente e\\u0027 accedere all\\u0027home banking: le credenziali bancarie sono il bersaglio piu\\u0027 prezioso per un attaccante su rete pubblica.')">
          <input type="radio" name="q2" value="a"> a) Leggere le notizie
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'b',
          'Corretto! L\\u0027home banking su Wi-Fi pubblico e\\u0027 molto rischioso. Un attaccante con un attacco MitM potrebbe intercettare le tue credenziali bancarie. Usa sempre la rete mobile (4G/5G) per operazioni sensibili.',
          'Sbagliato.')">
          <input type="radio" name="q2" value="b"> b) Accedere all'home banking
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'b',
          'Corretto!',
          'Sbagliato. Controllare il meteo e\\u0027 innocuo. L\\u0027attivita\\u0027 pericolosa su Wi-Fi pubblico e\\u0027 l\\u0027home banking, dove credenziali e dati finanziari possono essere intercettati.')">
          <input type="radio" name="q2" value="c"> c) Controllare il meteo
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(2, 'd', 'b',
          'Corretto!',
          'Sbagliato. Leggere Wikipedia non espone dati sensibili. L\\u0027home banking invece mette a rischio le tue credenziali bancarie su una rete non sicura.')">
          <input type="radio" name="q2" value="d"> d) Leggere Wikipedia
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">Domanda 3.</span> Cosa fa una VPN quando sei connesso a un Wi-Fi pubblico?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'a',
          'Corretto! Una VPN crea un tunnel crittografato tra il tuo dispositivo e il server VPN. Anche se qualcuno intercetta il traffico sulla rete pubblica, vedra\\u0027 solo dati cifrati e illeggibili.',
          'Sbagliato.')">
          <input type="radio" name="q3" value="a"> a) Cripta tutto il tuo traffico in un tunnel sicuro
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'a',
          'Corretto!',
          'Sbagliato. La VPN non velocizza la connessione, anzi spesso la rallenta leggermente. Il suo scopo e\\u0027 crittografare il traffico, rendendolo illeggibile a chi intercetta i dati sulla rete pubblica.')">
          <input type="radio" name="q3" value="b"> b) Rende la connessione piu' veloce
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'a',
          'Corretto!',
          'Sbagliato. La VPN non blocca i virus: per quello serve un antivirus. La VPN cripta il traffico di rete, proteggendo i tuoi dati dall\\u0027intercettazione su reti pubbliche.')">
          <input type="radio" name="q3" value="c"> c) Blocca tutti i virus e malware
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(3, 'd', 'a',
          'Corretto!',
          'Sbagliato. La VPN non nasconde il dispositivo dalla rete: sei comunque connesso. Quello che fa e\\u0027 crittografare il tuo traffico, impedendo a chiunque sulla rete di leggere i tuoi dati.')">
          <input type="radio" name="q3" value="d"> d) Rende il tuo dispositivo invisibile sulla rete
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">Domanda 4.</span> Ti connetti al Wi-Fi dell'aeroporto e appare una pagina di login che chiede la tua email per accedere. Qual e' il rischio?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'b',
          'Corretto!',
          'Sbagliato. I captive portal sono normali, ma non sono &quot;totalmente sicuri&quot;. Un attaccante puo\\u0027 creare un Evil Twin con un captive portal finto per raccogliere email e credenziali. Verifica sempre di essere sulla rete ufficiale.')">
          <input type="radio" name="q4" value="a"> a) E' un captive portal normale, totalmente sicuro
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'b',
          'Corretto! Anche se i captive portal sono comuni e spesso legittimi, un attaccante puo\\u0027 facilmente creare una rete Evil Twin con una pagina di login identica. Questa pagina falsa raccoglie le email (e a volte le password) degli utenti ignari. Non inserire mai credenziali importanti in queste pagine.',
          'Sbagliato.')">
          <input type="radio" name="q4" value="b"> b) Potrebbe essere una pagina falsa per raccogliere credenziali
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'b',
          'Corretto!',
          'Sbagliato. Un captive portal non significa che il dispositivo e\\u0027 infetto. Il vero rischio e\\u0027 che potrebbe essere una pagina falsa creata da un attaccante per raccogliere le tue credenziali tramite un attacco Evil Twin.')">
          <input type="radio" name="q4" value="c"> c) Il tuo dispositivo e' stato infettato
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(4, 'd', 'b',
          'Corretto!',
          'Sbagliato. L\\u0027aeroporto non ti sta &quot;hackerando&quot;. Il rischio reale e\\u0027 che un attaccante possa aver creato una rete con lo stesso nome (Evil Twin) con un captive portal falso per rubare le tue credenziali.')">
          <input type="radio" name="q4" value="d"> d) L'aeroporto ti sta hackerando
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">Domanda 5.</span> Cos'e' un attacco "Evil Twin"?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'c',
          'Corretto!',
          'Sbagliato. Un Evil Twin non e\\u0027 un virus. E\\u0027 una tecnica in cui l\\u0027attaccante crea un access point Wi-Fi con lo stesso nome di una rete legittima. I dispositivi si connettono automaticamente pensando sia la rete vera.')">
          <input type="radio" name="q5" value="a"> a) Un virus che clona i tuoi file
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'c',
          'Corretto!',
          'Sbagliato. Non si tratta di duplicare il tuo account. L\\u0027Evil Twin e\\u0027 un access point Wi-Fi falso creato dall\\u0027attaccante con lo stesso nome della rete legittima, per intercettare il traffico degli utenti.')">
          <input type="radio" name="q5" value="b"> b) Un attacco che duplica il tuo account social
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'c',
          'Corretto! Nell\\u0027attacco Evil Twin, l\\u0027attaccante crea un hotspot Wi-Fi con lo stesso nome (SSID) della rete legittima. I dispositivi si connettono alla rete malevola pensando sia quella autentica. L\\u0027attaccante puo\\u0027 cosi\\u0027 intercettare tutto il traffico, incluse credenziali e dati personali.',
          'Sbagliato.')">
          <input type="radio" name="q5" value="c"> c) Un access point Wi-Fi falso con lo stesso nome di una rete legittima
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(5, 'd', 'c',
          'Corretto!',
          'Sbagliato. L\\u0027Evil Twin non e\\u0027 un attacco via email (quello e\\u0027 il phishing). E\\u0027 un access point Wi-Fi malevolo creato con lo stesso nome di una rete legittima per ingannare gli utenti e intercettare il loro traffico.')">
          <input type="radio" name="q5" value="d"> d) Un attacco che invia email duplicate
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">Domanda 6.</span> Quale di queste misure ti protegge meglio quando usi un Wi-Fi pubblico?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'a',
          'Corretto! HTTPS cripta la comunicazione tra il tuo browser e il sito web. Anche se qualcuno intercetta il traffico, non potra\\u0027 leggere i dati scambiati. Controlla sempre il lucchetto nella barra degli indirizzi, specialmente su Wi-Fi pubblico.',
          'Sbagliato.')">
          <input type="radio" name="q6" value="a"> a) Usare solo siti HTTPS (con il lucchetto)
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'a',
          'Corretto!',
          'Sbagliato. Disattivare il Bluetooth e\\u0027 una buona pratica di sicurezza, ma non protegge il traffico Wi-Fi. La protezione piu\\u0027 efficace e\\u0027 usare siti HTTPS, che crittografano i dati tra browser e server.')">
          <input type="radio" name="q6" value="b"> b) Disattivare il Bluetooth
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'a',
          'Corretto!',
          'Sbagliato. La modalita\\u0027 aereo disattiva completamente la connessione, quindi non puoi navigare affatto. La protezione migliore durante la navigazione e\\u0027 usare HTTPS, che cripta i dati scambiati con i siti web.')">
          <input type="radio" name="q6" value="c"> c) Usare la modalita' aereo
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6, 'd', 'a',
          'Corretto!',
          'Sbagliato. Cambiare la password dopo e\\u0027 una misura reattiva, non preventiva. La protezione migliore e\\u0027 usare HTTPS durante la navigazione, che cripta i dati in transito impedendo l\\u0027intercettazione.')">
          <input type="radio" name="q6" value="d"> d) Cambiare la password dopo aver usato il Wi-Fi
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Result Box -->
    <div class="result-box" id="result-box">
      <h2>Quiz Completato!</h2>
      <div class="big-score">0%</div>
      <div class="message"></div>
    </div>

    <!-- Score Bar -->
    <div class="score-bar">
      <div>
        <span class="score" id="score">0 / 6</span>
        <span class="progress" id="progress" style="margin-left:1rem">0 di 6 completate</span>
      </div>
    </div>

    <script>QuizEngine.init(6);</script>
  `);

  res.setHeader("Content-Type", "text/html");
  return res.send(html);
}
