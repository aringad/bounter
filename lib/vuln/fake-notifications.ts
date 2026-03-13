import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>Notifiche del Browser: vere o fasulle?</h2>
      <p>
        Hai presente quelle notifiche che compaiono in basso a destra sullo schermo, anche quando
        il browser e' chiuso? Molte sono <strong>notifiche push legittime</strong> di siti a cui
        ti sei iscritto, ma altre sono <strong>truffe mascherate</strong> da avvisi di sistema.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">Finti antivirus:</strong> "Il tuo PC e' infetto da 3 virus!" &mdash; nessun sito web puo' fare una scansione del tuo computer.</li>
        <li><strong style="color:#38bdf8;">Premi inesistenti:</strong> "Congratulazioni! Hai vinto un iPhone 16!" &mdash; se non hai partecipato a nulla, e' una truffa.</li>
        <li><strong style="color:#38bdf8;">Aggiornamenti falsi:</strong> "Aggiorna Chrome subito!" &mdash; Chrome si aggiorna da solo, non tramite notifiche di siti web.</li>
        <li><strong style="color:#38bdf8;">Il trucco del consenso:</strong> I truffatori ti chiedono "Consenti notifiche?" con pretesti ingannevoli, poi ti bombardano di avvisi fasulli.</li>
        <li><strong style="color:#38bdf8;">Come proteggersi:</strong> Vai in Impostazioni &gt; Privacy &gt; Notifiche e rimuovi i siti sconosciuti.</li>
      </ul>
    </div>

    <!-- Q1: Finto antivirus -->
    <div class="question" id="q-1">
      <h3><span class="q-number">1.</span> Ricevi questa notifica sul desktop. E' legittima?</h3>
      <div class="notif-desktop">
        <div class="notif-card notif-danger">
          <div class="notif-chrome-bar">
            <img class="notif-chrome-icon" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%23ea4335'/%3E%3Ccircle cx='12' cy='12' r='4.5' fill='%23fff'/%3E%3Cpath d='M12 7.5A4.5 4.5 0 0 1 16.5 12H24l-6-10.4A12 12 0 0 0 12 0v7.5z' fill='%2334a853'/%3E%3Cpath d='M7.5 12A4.5 4.5 0 0 0 12 16.5L6 26.9A12 12 0 0 1 0 12h7.5z' fill='%23fbbc05'/%3E%3Cpath d='M16.5 12A4.5 4.5 0 0 1 12 16.5l6 10.4A12 12 0 0 0 24 12h-7.5z' fill='%234285f4'/%3E%3C/svg%3E" alt="">
            <span class="notif-source">security-alerts247.com</span>
            <span class="notif-time">Adesso</span>
            <span class="notif-close">&times;</span>
          </div>
          <div class="notif-body">
            <div class="notif-icon-big">⚠️</div>
            <div class="notif-text">
              <div class="notif-title">ATTENZIONE: Il tuo PC e' infetto!</div>
              <div class="notif-desc">Rilevati 3 virus. Clicca qui per avviare la scansione gratuita e rimuoverli immediatamente.</div>
            </div>
          </div>
        </div>
      </div>
      <div class="options">
        <label class="option" data-value="legit" onclick="QuizEngine.check(1,'legit','fake','','I siti web non possono scansionare il tuo computer. Questa notifica viene da security-alerts247.com, un sito truffa. Gli antivirus veri (Windows Defender, Norton, ecc.) mostrano avvisi tramite l\\'applicazione installata, non tramite notifiche del browser.')">
          <input type="radio" name="q1"> Legittima &mdash; devo scansionare subito il PC
        </label>
        <label class="option" data-value="fake" onclick="QuizEngine.check(1,'fake','fake','Nessun sito web puo\\' scansionare il tuo computer! Questa notifica e\\' una truffa di security-alerts247.com. Un antivirus reale ti avviserebbe dall\\'app installata, mai da una notifica del browser. Vai nelle impostazioni e blocca questo sito.','')">
          <input type="radio" name="q1"> Fasulla &mdash; nessun sito puo' scansionare il mio PC
        </label>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q2: Notifica Gmail legittima -->
    <div class="question" id="q-2">
      <h3><span class="q-number">2.</span> Ricevi questa notifica. E' legittima?</h3>
      <div class="notif-desktop">
        <div class="notif-card notif-safe">
          <div class="notif-chrome-bar">
            <img class="notif-chrome-icon" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M20 4H4l8 7z' fill='%23ea4335'/%3E%3Cpath d='M24 6v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6l12 9z' fill='%23c5221f'/%3E%3Cpath d='M0 6l12 9L24 6v-.5A1.5 1.5 0 0 0 22.5 4H1.5A1.5 1.5 0 0 0 0 5.5z' fill='%23ea4335'/%3E%3C/svg%3E" alt="">
            <span class="notif-source">mail.google.com</span>
            <span class="notif-time">2 min fa</span>
            <span class="notif-close">&times;</span>
          </div>
          <div class="notif-body">
            <div class="notif-icon-big">✉️</div>
            <div class="notif-text">
              <div class="notif-title">Marco Bianchi</div>
              <div class="notif-desc">Riunione spostata alle 15:00 &mdash; ci vediamo in sala B invece che in sala A.</div>
            </div>
          </div>
        </div>
      </div>
      <div class="options">
        <label class="option" data-value="legit" onclick="QuizEngine.check(2,'legit','legit','Questa e\\' una notifica legittima di Gmail (mail.google.com). Mostra un\\'anteprima di un\\'email reale con mittente, oggetto e contenuto plausibile. Nessuna urgenza fasulla, nessun link sospetto.','')">
          <input type="radio" name="q2"> Legittima &mdash; e' una notifica email normale
        </label>
        <label class="option" data-value="fake" onclick="QuizEngine.check(2,'fake','legit','','Questa e\\' una notifica legittima! Proviene da mail.google.com (il dominio ufficiale di Gmail), mostra un\\'anteprima di email con contenuto ordinario. Nessun segno di truffa.')">
          <input type="radio" name="q2"> Fasulla &mdash; potrebbe essere un trucco
        </label>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q3: Finto premio -->
    <div class="question" id="q-3">
      <h3><span class="q-number">3.</span> Questa notifica appare mentre navighi. E' legittima?</h3>
      <div class="notif-desktop">
        <div class="notif-card notif-danger">
          <div class="notif-chrome-bar">
            <img class="notif-chrome-icon" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%23ea4335'/%3E%3Ccircle cx='12' cy='12' r='4.5' fill='%23fff'/%3E%3Cpath d='M12 7.5A4.5 4.5 0 0 1 16.5 12H24l-6-10.4A12 12 0 0 0 12 0v7.5z' fill='%2334a853'/%3E%3Cpath d='M7.5 12A4.5 4.5 0 0 0 12 16.5L6 26.9A12 12 0 0 1 0 12h7.5z' fill='%23fbbc05'/%3E%3Cpath d='M16.5 12A4.5 4.5 0 0 1 12 16.5l6 10.4A12 12 0 0 0 24 12h-7.5z' fill='%234285f4'/%3E%3C/svg%3E" alt="">
            <span class="notif-source">premi-online.click</span>
            <span class="notif-time">Adesso</span>
            <span class="notif-close">&times;</span>
          </div>
          <div class="notif-body">
            <div class="notif-icon-big">🎁</div>
            <div class="notif-text">
              <div class="notif-title">Congratulazioni! Hai vinto!</div>
              <div class="notif-desc">Sei stato selezionato per vincere un iPhone 16 Pro. Clicca qui entro 5 minuti per ritirare il premio!</div>
            </div>
          </div>
        </div>
      </div>
      <div class="options">
        <label class="option" data-value="legit" onclick="QuizEngine.check(3,'legit','fake','','Questa e\\' una classica truffa! Proviene da premi-online.click (dominio .click sospetto). Nessuno regala iPhone a caso. Il conto alla rovescia di 5 minuti serve a farti agire d\\'impulso senza pensare. Non cliccare mai su notifiche del genere.')">
          <input type="radio" name="q3"> Legittima &mdash; potrei aver vinto qualcosa
        </label>
        <label class="option" data-value="fake" onclick="QuizEngine.check(3,'fake','fake','Nessuno regala iPhone tramite notifiche del browser! Il sito premi-online.click e\\' palesemente fasullo. Il trucco del timer (5 minuti) serve a crearti ansia e farti cliccare senza riflettere. Blocca subito le notifiche da questo sito.','')">
          <input type="radio" name="q3"> Fasulla &mdash; nessuno regala iPhone cosi'
        </label>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q4: Notifica calendario legittima -->
    <div class="question" id="q-4">
      <h3><span class="q-number">4.</span> Ricevi questa notifica. E' legittima?</h3>
      <div class="notif-desktop">
        <div class="notif-card notif-safe">
          <div class="notif-chrome-bar">
            <img class="notif-chrome-icon" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' rx='4' fill='%234285f4'/%3E%3Ctext x='12' y='17' text-anchor='middle' font-size='14' font-weight='bold' fill='white'%3E13%3C/text%3E%3C/svg%3E" alt="">
            <span class="notif-source">calendar.google.com</span>
            <span class="notif-time">5 min fa</span>
            <span class="notif-close">&times;</span>
          </div>
          <div class="notif-body">
            <div class="notif-icon-big">📅</div>
            <div class="notif-text">
              <div class="notif-title">Promemoria: Call con il team</div>
              <div class="notif-desc">Tra 15 minuti &mdash; Link Meet incluso nell'evento</div>
            </div>
          </div>
        </div>
      </div>
      <div class="options">
        <label class="option" data-value="legit" onclick="QuizEngine.check(4,'legit','legit','Questa e\\' una notifica legittima di Google Calendar (calendar.google.com). E\\' un semplice promemoria per un evento con contenuto ordinario. Niente urgenze false, niente link esterni sospetti.','')">
          <input type="radio" name="q4"> Legittima &mdash; e' il mio promemoria di calendario
        </label>
        <label class="option" data-value="fake" onclick="QuizEngine.check(4,'fake','legit','','Questa e\\' legittima! Il dominio calendar.google.com e\\' autentico. Il contenuto e\\' un normale promemoria senza allarmi fasulli ne\\' link sospetti. Google Calendar invia notifiche cosi\\' per gli eventi programmati.')">
          <input type="radio" name="q4"> Fasulla &mdash; potrebbe essere un trucco
        </label>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q5: Finto aggiornamento Chrome -->
    <div class="question" id="q-5">
      <h3><span class="q-number">5.</span> Questa notifica ti chiede di aggiornare. E' legittima?</h3>
      <div class="notif-desktop">
        <div class="notif-card notif-danger">
          <div class="notif-chrome-bar">
            <img class="notif-chrome-icon" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%23ea4335'/%3E%3Ccircle cx='12' cy='12' r='4.5' fill='%23fff'/%3E%3Cpath d='M12 7.5A4.5 4.5 0 0 1 16.5 12H24l-6-10.4A12 12 0 0 0 12 0v7.5z' fill='%2334a853'/%3E%3Cpath d='M7.5 12A4.5 4.5 0 0 0 12 16.5L6 26.9A12 12 0 0 1 0 12h7.5z' fill='%23fbbc05'/%3E%3Cpath d='M16.5 12A4.5 4.5 0 0 1 12 16.5l6 10.4A12 12 0 0 0 24 12h-7.5z' fill='%234285f4'/%3E%3C/svg%3E" alt="">
            <span class="notif-source">update-chrome-now.xyz</span>
            <span class="notif-time">Adesso</span>
            <span class="notif-close">&times;</span>
          </div>
          <div class="notif-body">
            <div class="notif-icon-big">🔄</div>
            <div class="notif-text">
              <div class="notif-title">Aggiornamento Critico Disponibile</div>
              <div class="notif-desc">La tua versione di Chrome non e' sicura. Aggiorna subito per proteggere i tuoi dati personali!</div>
            </div>
          </div>
        </div>
      </div>
      <div class="options">
        <label class="option" data-value="legit" onclick="QuizEngine.check(5,'legit','fake','','Chrome si aggiorna automaticamente senza bisogno di notifiche da siti web! Il dominio update-chrome-now.xyz e\\' palesemente falso (TLD .xyz, nome allarmista). Cliccando scaricheresti quasi certamente malware. Gli aggiornamenti veri si trovano in Chrome &gt; Impostazioni &gt; Informazioni su Chrome.')">
          <input type="radio" name="q5"> Legittima &mdash; meglio aggiornare subito
        </label>
        <label class="option" data-value="fake" onclick="QuizEngine.check(5,'fake','fake','Chrome si aggiorna automaticamente in background, mai tramite notifiche di siti web! Il dominio update-chrome-now.xyz e\\' un chiaro segnale di truffa. Cliccando scaricheresti malware. Per aggiornare Chrome vai in menu &gt; Guida &gt; Informazioni su Google Chrome.','')">
          <input type="radio" name="q5"> Fasulla &mdash; Chrome si aggiorna da solo
        </label>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q6: Richiesta consenso notifiche -->
    <div class="question" id="q-6">
      <h3><span class="q-number">6.</span> Visiti un sito e appare questo popup. Cosa fai?</h3>
      <div class="notif-desktop">
        <div class="notif-consent">
          <div class="consent-overlay">
            <div class="consent-page-bg">
              <div class="consent-page-text">Per continuare a leggere l'articolo,<br>clicca "Consenti" nella finestra sopra ▲</div>
            </div>
            <div class="consent-popup">
              <div class="consent-bar">
                <div class="consent-lock">🔒</div>
                <span class="consent-url">notizie-gratis.click</span> vuole
              </div>
              <div class="consent-msg">Mostrare le notifiche</div>
              <div class="consent-buttons">
                <span class="consent-btn consent-block">Blocca</span>
                <span class="consent-btn consent-allow">Consenti</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="options">
        <label class="option" data-value="allow" onclick="QuizEngine.check(6,'allow','block','','MAI consentire notifiche a siti sconosciuti! Il trucco classico e\\' bloccare il contenuto della pagina finche\\' non clicchi Consenti. Una volta dato il permesso, il sito ti bombardera\\' di notifiche fasulle (virus, premi, ecc.) anche a browser chiuso. Clicca sempre BLOCCA e chiudi la pagina.')">
          <input type="radio" name="q6"> Clicco "Consenti" per leggere l'articolo
        </label>
        <label class="option" data-value="block" onclick="QuizEngine.check(6,'block','block','Un sito legittimo non ti obbliga a consentire le notifiche per leggere un articolo! E\\' un trucco per ottenere il permesso e poi bombardarti di notifiche fasulle. Clicca sempre Blocca e chiudi la pagina. Se hai gia\\' consentito per errore: Chrome &gt; Impostazioni &gt; Privacy &gt; Notifiche &gt; rimuovi il sito.','')">
          <input type="radio" name="q6"> Clicco "Blocca" e chiudo la pagina
        </label>
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

  const html = wrapQuiz("Notifiche Fasulle del Browser", body);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
