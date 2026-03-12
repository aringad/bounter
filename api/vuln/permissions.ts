import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../_auth";
import { wrapQuiz } from "./_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>Permessi delle App: sai riconoscere quelli sospetti?</h2>
      <p>
        Quando installi un'app sul tuo smartphone, questa richiede dei <strong>permessi</strong> per accedere
        a funzionalita' del dispositivo: fotocamera, microfono, contatti, posizione GPS e molto altro.
        Alcune app hanno bisogno di certi permessi per funzionare correttamente (es. WhatsApp ha bisogno
        del microfono per le note vocali), ma altre app richiedono permessi <strong>eccessivi e ingiustificati</strong>
        per raccogliere dati personali, tracciare la tua posizione, leggere i tuoi messaggi o persino inviare
        SMS a pagamento a tua insaputa.
      </p>
      <p style="margin-top:0.5rem;">
        Imparare a valutare i permessi richiesti e' fondamentale per proteggere la tua privacy e la sicurezza
        del tuo dispositivo. In questo quiz vedrai 6 app con i permessi che richiedono: per ognuna, decidi
        se i permessi sono <strong>ragionevoli</strong> o <strong>sospetti</strong>.
      </p>
    </div>

    <!-- Q1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">1.</span> Che ne pensi dei permessi di questa app?</h3>
      <div style="background:#0f172a;border-radius:8px;padding:1rem;margin-bottom:0.75rem;">
        <div style="font-size:1.5rem;margin-bottom:0.4rem;">🔦 <strong>Torcia LED</strong></div>
        <div style="color:#94a3b8;font-size:0.82rem;margin-bottom:0.6rem;">Utilita' &mdash; Accendi il flash come torcia</div>
        <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">
          <span class="tag danger">📷 Camera</span>
          <span class="tag danger">👥 Contatti</span>
          <span class="tag danger">💬 SMS</span>
          <span class="tag danger">📍 Posizione</span>
        </div>
      </div>
      <div class="options">
        <label class="option" data-value="ok" onclick="QuizEngine.check(1,'ok','suspicious','','Una semplice torcia ha bisogno solo del flash della fotocamera. Richiedere accesso a Contatti, SMS e Posizione e\\u0027 un chiaro segnale di pericolo: l\\u0027app potrebbe inviare SMS a numeri premium (costosi), rubare la tua rubrica o tracciare i tuoi spostamenti per rivenderli a reti pubblicitarie.')">
          <input type="radio" name="q1"> Ragionevoli &mdash; servono per funzionare
        </label>
        <label class="option" data-value="suspicious" onclick="QuizEngine.check(1,'suspicious','suspicious','Esatto! Una torcia ha bisogno solo del flash. Contatti, SMS e Posizione sono permessi totalmente ingiustificati: l\\u0027app potrebbe inviare SMS premium a pagamento, rubare la rubrica o tracciare la tua posizione per scopi pubblicitari.','')">
          <input type="radio" name="q1"> Sospetti &mdash; chiede troppi permessi
        </label>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">2.</span> Che ne pensi dei permessi di questa app?</h3>
      <div style="background:#0f172a;border-radius:8px;padding:1rem;margin-bottom:0.75rem;">
        <div style="font-size:1.5rem;margin-bottom:0.4rem;">💬 <strong>WhatsApp</strong></div>
        <div style="color:#94a3b8;font-size:0.82rem;margin-bottom:0.6rem;">Messaggistica &mdash; Chat, chiamate e videochiamate</div>
        <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">
          <span class="tag safe">📷 Camera</span>
          <span class="tag safe">🎤 Microfono</span>
          <span class="tag safe">👥 Contatti</span>
          <span class="tag safe">📁 Archivio</span>
        </div>
      </div>
      <div class="options">
        <label class="option" data-value="ok" onclick="QuizEngine.check(2,'ok','ok','Corretto! WhatsApp ha bisogno della Camera per foto e videochiamate, del Microfono per note vocali e chiamate, dei Contatti per trovare i tuoi amici, e dell\\u0027Archivio per salvare e condividere file. Tutti permessi coerenti con le sue funzionalita\\u0027.','')">
          <input type="radio" name="q2"> Ragionevoli &mdash; servono per funzionare
        </label>
        <label class="option" data-value="suspicious" onclick="QuizEngine.check(2,'suspicious','ok','In realta\\u0027 questi permessi sono ragionevoli per un\\u0027app di messaggistica: Camera per foto/video, Microfono per note vocali e chiamate, Contatti per trovare amici, Archivio per condividere file. Sono tutti necessari per le funzionalita\\u0027 principali.','')">
          <input type="radio" name="q2"> Sospetti &mdash; chiede troppi permessi
        </label>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">3.</span> Che ne pensi dei permessi di questa app?</h3>
      <div style="background:#0f172a;border-radius:8px;padding:1rem;margin-bottom:0.75rem;">
        <div style="font-size:1.5rem;margin-bottom:0.4rem;">🧮 <strong>Calcolatrice Plus</strong></div>
        <div style="color:#94a3b8;font-size:0.82rem;margin-bottom:0.6rem;">Utilita' &mdash; Calcolatrice scientifica</div>
        <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">
          <span class="tag danger">📍 Posizione</span>
          <span class="tag danger">📞 Registro chiamate</span>
          <span class="tag danger">👥 Contatti</span>
        </div>
      </div>
      <div class="options">
        <label class="option" data-value="ok" onclick="QuizEngine.check(3,'ok','suspicious','','Una calcolatrice non ha alcun motivo per accedere alla tua Posizione, al Registro chiamate o ai Contatti. Questi permessi servono probabilmente a raccogliere i tuoi dati personali per rivenderli a broker di dati o reti pubblicitarie, costruendo un profilo dettagliato delle tue abitudini.')">
          <input type="radio" name="q3"> Ragionevoli &mdash; servono per funzionare
        </label>
        <label class="option" data-value="suspicious" onclick="QuizEngine.check(3,'suspicious','suspicious','Esatto! Una calcolatrice non ha bisogno di sapere dove sei, chi chiami o chi hai in rubrica. Questi permessi indicano che l\\u0027app raccoglie dati personali per rivenderli a broker di dati o network pubblicitari, costruendo un profilo delle tue abitudini senza il tuo consenso.','')">
          <input type="radio" name="q3"> Sospetti &mdash; chiede troppi permessi
        </label>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">4.</span> Che ne pensi dei permessi di questa app?</h3>
      <div style="background:#0f172a;border-radius:8px;padding:1rem;margin-bottom:0.75rem;">
        <div style="font-size:1.5rem;margin-bottom:0.4rem;">🗺️ <strong>Google Maps</strong></div>
        <div style="color:#94a3b8;font-size:0.82rem;margin-bottom:0.6rem;">Navigazione &mdash; Mappe, indicazioni e traffico</div>
        <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">
          <span class="tag safe">📍 Posizione</span>
          <span class="tag safe">📁 Archivio</span>
          <span class="tag safe">📷 Fotocamera</span>
        </div>
      </div>
      <div class="options">
        <label class="option" data-value="ok" onclick="QuizEngine.check(4,'ok','ok','Corretto! Google Maps ha bisogno della Posizione per la navigazione e il traffico in tempo reale, dell\\u0027Archivio per salvare mappe offline, e della Fotocamera per funzionalita\\u0027 come Street View e la scansione di codici QR. Permessi coerenti con un\\u0027app di navigazione.','')">
          <input type="radio" name="q4"> Ragionevoli &mdash; servono per funzionare
        </label>
        <label class="option" data-value="suspicious" onclick="QuizEngine.check(4,'suspicious','ok','In realta\\u0027 questi permessi sono normali per un\\u0027app di navigazione: Posizione per guidarti, Archivio per mappe offline, Fotocamera per Street View e scansione QR. Sono tutti necessari per le funzionalita\\u0027 principali dell\\u0027app.','')">
          <input type="radio" name="q4"> Sospetti &mdash; chiede troppi permessi
        </label>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">5.</span> Che ne pensi dei permessi di questa app?</h3>
      <div style="background:#0f172a;border-radius:8px;padding:1rem;margin-bottom:0.75rem;">
        <div style="font-size:1.5rem;margin-bottom:0.4rem;">🃏 <strong>Gioco Solitario</strong></div>
        <div style="color:#94a3b8;font-size:0.82rem;margin-bottom:0.6rem;">Giochi &mdash; Il classico solitario di carte</div>
        <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">
          <span class="tag danger">💬 SMS</span>
          <span class="tag danger">📞 Telefono</span>
          <span class="tag danger">👥 Contatti</span>
          <span class="tag danger">📍 Posizione</span>
        </div>
      </div>
      <div class="options">
        <label class="option" data-value="ok" onclick="QuizEngine.check(5,'ok','suspicious','','Un gioco di carte non ha alcuna ragione per leggere SMS, fare telefonate, accedere ai contatti o conoscere la tua posizione. L\\u0027app potrebbe inviare SMS a numeri premium facendoti pagare cifre elevate, rubare i contatti per spam, o tracciare la posizione per pubblicita\\u0027 invasiva.')">
          <input type="radio" name="q5"> Ragionevoli &mdash; servono per funzionare
        </label>
        <label class="option" data-value="suspicious" onclick="QuizEngine.check(5,'suspicious','suspicious','Esatto! Un solitario non ha bisogno di SMS, Telefono, Contatti ne\\u0027 Posizione. L\\u0027app potrebbe inviare SMS a numeri premium (costi nascosti in bolletta), sottrarre la rubrica per campagne di spam, o vendere i dati di geolocalizzazione a reti pubblicitarie.','')">
          <input type="radio" name="q5"> Sospetti &mdash; chiede troppi permessi
        </label>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">6.</span> Che ne pensi dei permessi di questa app?</h3>
      <div style="background:#0f172a;border-radius:8px;padding:1rem;margin-bottom:0.75rem;">
        <div style="font-size:1.5rem;margin-bottom:0.4rem;">📹 <strong>Zoom</strong></div>
        <div style="color:#94a3b8;font-size:0.82rem;margin-bottom:0.6rem;">Comunicazione &mdash; Videoconferenze e riunioni</div>
        <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">
          <span class="tag safe">📷 Camera</span>
          <span class="tag safe">🎤 Microfono</span>
          <span class="tag safe">📅 Calendario</span>
          <span class="tag safe">📁 Archivio</span>
        </div>
      </div>
      <div class="options">
        <label class="option" data-value="ok" onclick="QuizEngine.check(6,'ok','ok','Corretto! Zoom ha bisogno della Camera e del Microfono per le videochiamate, del Calendario per integrarsi con le riunioni programmate, e dell\\u0027Archivio per condividere file durante le call. Tutti permessi coerenti con un\\u0027app di videoconferenza.','')">
          <input type="radio" name="q6"> Ragionevoli &mdash; servono per funzionare
        </label>
        <label class="option" data-value="suspicious" onclick="QuizEngine.check(6,'suspicious','ok','In realta\\u0027 questi permessi sono normali per un\\u0027app di videoconferenza: Camera e Microfono per le videochiamate, Calendario per programmare e visualizzare riunioni, Archivio per condividere file. Tutto coerente con le funzionalita\\u0027 di Zoom.','')">
          <input type="radio" name="q6"> Sospetti &mdash; chiede troppi permessi
        </label>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Result -->
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

  const html = wrapQuiz("Permessi delle App", body);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
