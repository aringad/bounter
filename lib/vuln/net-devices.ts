import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>Dispositivi di Rete</h2>
      <p>
        Una rete locale (LAN) e' composta da diversi dispositivi, ognuno con un ruolo specifico.
        Conoscerli e' fondamentale per progettare e gestire una rete efficiente.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">NIC (Network Interface Card):</strong> La scheda di rete che permette a un dispositivo di collegarsi alla rete (via cavo Ethernet o WiFi).</li>
        <li><strong style="color:#38bdf8;">Hub:</strong> Dispositivo Layer 1 che ripete il segnale a tutte le porte. Tutti i dispositivi ricevono tutti i pacchetti (dominio di collisione unico).</li>
        <li><strong style="color:#38bdf8;">Switch:</strong> Dispositivo Layer 2 che inoltra i frame solo alla porta corretta usando la tabella MAC. Supporta VLAN per segmentare la rete.</li>
        <li><strong style="color:#38bdf8;">Router:</strong> Dispositivo Layer 3 che collega reti diverse (es. LAN a Internet) e instrada i pacchetti tramite indirizzi IP.</li>
        <li><strong style="color:#38bdf8;">Access Point (AP):</strong> Estende la rete cablata offrendo connettivita' wireless (WiFi) ai dispositivi.</li>
      </ul>
    </div>

    <!-- Q1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">1.</span> Hai 24 PC distribuiti in 3 reparti che devono essere isolati tra loro. Quale dispositivo usi?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'b',
          '',
          'Sbagliato. L\\'hub invia i pacchetti a tutti e non supporta la segmentazione. Serve uno switch con VLAN per isolare i reparti.')">
          <input type="radio" name="q1"> <span>Hub</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'b',
          'Corretto! Lo switch con VLAN permette di creare segmenti logici separati sulla stessa infrastruttura fisica, isolando il traffico tra i 3 reparti senza bisogno di hardware aggiuntivo.',
          '')">
          <input type="radio" name="q1"> <span>Switch con VLAN</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'b',
          '',
          'Sbagliato. Il router collega reti diverse (es. LAN a Internet), ma per segmentare una singola LAN in reparti isolati serve uno switch con VLAN.')">
          <input type="radio" name="q1"> <span>Router</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">2.</span> Quale dispositivo opera a Layer 2 (Data Link) del modello OSI?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'b',
          '',
          'Sbagliato. L\\'hub opera a Layer 1 (fisico): si limita a ripetere il segnale elettrico senza interpretare i frame.')">
          <input type="radio" name="q2"> <span>Hub</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'b',
          'Corretto! Lo switch opera a Layer 2 e usa gli indirizzi MAC per inoltrare i frame solo alla porta di destinazione corretta, riducendo le collisioni e migliorando le prestazioni.',
          '')">
          <input type="radio" name="q2"> <span>Switch</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'b',
          '',
          'Sbagliato. Il router opera a Layer 3 (rete) e lavora con indirizzi IP, non con indirizzi MAC.')">
          <input type="radio" name="q2"> <span>Router</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(2, 'd', 'b',
          '',
          'Sbagliato. L\\'access point opera a Layer 2 per il WiFi, ma il dispositivo classico di Layer 2 per la rete cablata e\\' lo switch.')">
          <input type="radio" name="q2"> <span>Access Point</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">3.</span> Devi estendere la copertura di rete in un magazzino dove non arrivano cavi. Cosa installi?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'c',
          '',
          'Sbagliato. Lo switch richiede cavi Ethernet. Per dare connettivita\\' wireless al magazzino serve un access point.')">
          <input type="radio" name="q3"> <span>Un secondo switch</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'c',
          '',
          'Sbagliato. Il router collega reti diverse ma non fornisce copertura WiFi. Serve un access point per il wireless.')">
          <input type="radio" name="q3"> <span>Un router</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'c',
          'Corretto! L\\'access point si collega alla rete cablata e fornisce connettivita\\' WiFi ai dispositivi nel magazzino, estendendo la copertura senza bisogno di tirare cavi.',
          '')">
          <input type="radio" name="q3"> <span>Un access point</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">4.</span> Quale dispositivo serve per collegare la LAN aziendale a Internet?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'c',
          '',
          'Sbagliato. Lo switch gestisce il traffico locale (Layer 2) ma non sa instradare pacchetti verso reti esterne come Internet.')">
          <input type="radio" name="q4"> <span>Switch</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'c',
          '',
          'Sbagliato. L\\'hub ripete segnali a tutte le porte ma non puo\\' collegare reti diverse o instradare traffico verso Internet.')">
          <input type="radio" name="q4"> <span>Hub</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'c',
          'Corretto! Il router opera a Layer 3 e instrada i pacchetti tra reti diverse. E\\' il dispositivo che collega la LAN interna alla rete del provider Internet (WAN).',
          '')">
          <input type="radio" name="q4"> <span>Router</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(4, 'd', 'c',
          '',
          'Sbagliato. L\\'access point fornisce connettivita\\' WiFi ma non puo\\' instradare traffico verso Internet. Serve un router.')">
          <input type="radio" name="q4"> <span>Access Point</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">5.</span> In una rete, tutti i dispositivi ricevono tutti i pacchetti, causando congestione. Qual e' il problema?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'a',
          'Corretto! L\\'hub opera a Layer 1 e ripete ogni segnale su tutte le porte. Questo crea un unico dominio di collisione e broadcast: tutti ricevono tutto, causando congestione. Sostituirlo con uno switch risolve il problema.',
          '')">
          <input type="radio" name="q5"> <span>Si sta usando un hub (problema broadcast)</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'a',
          '',
          'Sbagliato. Lo switch inoltra i frame solo alla porta corretta grazie alla tabella MAC. Il dispositivo che invia tutto a tutti e\\' l\\'hub.')">
          <input type="radio" name="q5"> <span>Lo switch e' mal configurato</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'a',
          '',
          'Sbagliato. Il cavo di rete non influisce sulla distribuzione dei pacchetti. Il problema e\\' l\\'uso di un hub che ripete il segnale su tutte le porte.')">
          <input type="radio" name="q5"> <span>Il cavo di rete e' danneggiato</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">6.</span> Quale dispositivo usa una tabella MAC per inoltrare i frame?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'b',
          '',
          'Sbagliato. Il router usa una tabella di routing con indirizzi IP, non una tabella MAC.')">
          <input type="radio" name="q6"> <span>Router</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'b',
          'Corretto! Lo switch mantiene una tabella MAC (CAM table) che associa ogni indirizzo MAC alla porta fisica corrispondente. Quando riceve un frame, lo inoltra solo alla porta giusta.',
          '')">
          <input type="radio" name="q6"> <span>Switch</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'b',
          '',
          'Sbagliato. L\\'hub non ha intelligenza: ripete il segnale su tutte le porte senza leggere gli indirizzi MAC.')">
          <input type="radio" name="q6"> <span>Hub</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6, 'd', 'b',
          '',
          'Sbagliato. Il modem converte segnali tra la rete locale e la linea del provider, non usa tabelle MAC per l\\'inoltro.')">
          <input type="radio" name="q6"> <span>Modem</span>
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

  const html = wrapQuiz("Dispositivi di Rete", body);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
