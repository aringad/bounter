import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>QR Code: comodi ma pericolosi?</h2>
      <p>
        Un <strong>QR Code</strong> (Quick Response Code) e' un'immagine quadrata fatta di puntini bianchi e neri
        che funziona come un <strong>codice a barre evoluto</strong>. Quando lo inquadri con la fotocamera del
        telefono, ti porta automaticamente a un sito web, un menu, un pagamento o un contatto.
      </p>
      <div class="qr-explainer">
        <div class="qr-visual">
          <div class="qr-fake">
            <div class="qr-corner tl"></div>
            <div class="qr-corner tr"></div>
            <div class="qr-corner bl"></div>
            <div class="qr-dots"></div>
          </div>
          <div class="qr-arrow">→</div>
          <div class="qr-result">
            <div class="qr-result-icon">🌐</div>
            <div class="qr-result-url">https://esempio.com/menu</div>
          </div>
        </div>
        <p style="text-align:center;color:#64748b;font-size:0.78rem;margin-top:0.5rem;">
          Il QR Code contiene un link nascosto &mdash; non puoi leggerlo a occhio!
        </p>
      </div>
      <p style="margin-top:0.75rem;">
        Il problema? <strong>Non puoi vedere dove porta un QR Code prima di inquadrarlo.</strong>
        I truffatori sfruttano questo per ingannarti con una tecnica chiamata <strong>quishing</strong>
        (QR + phishing). Ecco i trucchi piu' comuni:
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">Adesivo sopra adesivo:</strong> Un QR Code falso incollato sopra quello originale (es. al ristorante, al parchimetro).</li>
        <li><strong style="color:#38bdf8;">Finti pagamenti:</strong> QR Code che portano a pagine di pagamento false per rubare i dati della carta.</li>
        <li><strong style="color:#38bdf8;">Volantini e manifesti:</strong> QR Code su materiale stampato che promettono sconti o premi inesistenti.</li>
        <li><strong style="color:#38bdf8;">Email e messaggi:</strong> QR Code nelle email per aggirare i filtri anti-phishing (che non possono "leggere" le immagini).</li>
        <li><strong style="color:#38bdf8;">Come proteggersi:</strong> Controlla SEMPRE l'anteprima del link prima di aprirlo. Il telefono te la mostra!</li>
      </ul>
    </div>

    <!-- Q1: QR al parchimetro -->
    <div class="question" id="q-1">
      <h3><span class="q-number">1.</span> Sei al parchimetro e vedi questo QR Code per pagare. Cosa noti?</h3>
      <div class="qr-scenario">
        <div class="qr-location">
          <div class="qr-location-icon">🅿️</div>
          <div class="qr-location-name">Parchimetro Via Roma</div>
        </div>
        <div class="qr-sticker">
          <div class="qr-fake small">
            <div class="qr-corner tl"></div>
            <div class="qr-corner tr"></div>
            <div class="qr-corner bl"></div>
            <div class="qr-dots"></div>
          </div>
          <div class="qr-sticker-label">PAGA QUI<br>Scansiona il QR</div>
          <div class="qr-sticker-overlay">
            <span class="qr-overlay-tag">⚠️ Adesivo incollato sopra!</span>
          </div>
        </div>
        <div class="qr-preview">
          <span class="qr-preview-label">Anteprima link:</span>
          <span class="qr-preview-url danger">http://parchegg1o-roma.pay-now.xyz/carta</span>
        </div>
      </div>
      <div class="options">
        <label class="option" data-value="safe" onclick="QuizEngine.check(1,'safe','danger','','Il QR Code e\\' un adesivo incollato sopra quello originale! L\\'URL porta a parchegg1o-roma.pay-now.xyz (con il numero 1 al posto della i, dominio .xyz). E\\' una pagina falsa che ruba i dati della tua carta di credito. I parchimetri ufficiali usano app certificate o il sito del comune.')">
          <input type="radio" name="q1"> Tutto ok &mdash; pago subito con il QR
        </label>
        <label class="option" data-value="danger" onclick="QuizEngine.check(1,'danger','danger','Il QR e\\' un adesivo sovrapposto e l\\'URL contiene errori (parchegg1o con il numero 1) e un dominio .xyz sospetto. Un parchimetro legittimo usa l\\'app ufficiale del comune o un dominio istituzionale. Questa pagina ruberebbe i dati della tua carta.','')">
          <input type="radio" name="q1"> Sospetto &mdash; l'adesivo e il link non mi convincono
        </label>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q2: QR menu ristorante legittimo -->
    <div class="question" id="q-2">
      <h3><span class="q-number">2.</span> Al ristorante, il cameriere ti indica il QR stampato nel menu plastificato. Cosa fai?</h3>
      <div class="qr-scenario">
        <div class="qr-location">
          <div class="qr-location-icon">🍽️</div>
          <div class="qr-location-name">Trattoria Da Mario</div>
        </div>
        <div class="qr-sticker safe">
          <div class="qr-fake small">
            <div class="qr-corner tl"></div>
            <div class="qr-corner tr"></div>
            <div class="qr-corner bl"></div>
            <div class="qr-dots"></div>
          </div>
          <div class="qr-sticker-label">Menu del giorno</div>
        </div>
        <div class="qr-preview">
          <span class="qr-preview-label">Anteprima link:</span>
          <span class="qr-preview-url safe">https://trattoriadamario.it/menu</span>
        </div>
      </div>
      <div class="options">
        <label class="option" data-value="safe" onclick="QuizEngine.check(2,'safe','safe','Il QR e\\' stampato direttamente nel menu plastificato (non un adesivo), il cameriere lo conferma, e l\\'URL e\\' HTTPS con un dominio coerente con il nome del ristorante. Tutto regolare!','')">
          <input type="radio" name="q2"> Sicuro &mdash; e' stampato nel menu e il link e' coerente
        </label>
        <label class="option" data-value="danger" onclick="QuizEngine.check(2,'danger','safe','','In questo caso il QR e\\' legittimo: e\\' stampato nel menu (non incollato sopra), il cameriere lo indica, e l\\'URL usa HTTPS con il nome del ristorante. Non tutti i QR sono pericolosi, l\\'importante e\\' verificare il contesto e l\\'anteprima del link.')">
          <input type="radio" name="q2"> Sospetto &mdash; non mi fido dei QR Code
        </label>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q3: QR in email aziendale -->
    <div class="question" id="q-3">
      <h3><span class="q-number">3.</span> Ricevi questa email dal "reparto IT" con un QR Code. Cosa fai?</h3>
      <div class="qr-scenario">
        <div class="qr-email">
          <div class="email-toolbar">
            <span>↩️ Rispondi</span><span>↪️ Inoltra</span><span>🗑️ Elimina</span>
          </div>
          <div class="email-headers">
            <div class="eh-row"><span class="eh-label">Da:</span><span class="eh-value">it-support@azienda-aggiornamenti.com</span></div>
            <div class="eh-row"><span class="eh-label">Oggetto:</span><span class="eh-value">⚠️ URGENTE: Aggiorna la password entro oggi</span></div>
          </div>
          <div class="email-body-content" style="text-align:center;">
            <p>Il tuo account aziendale scade oggi. Scansiona il QR Code qui sotto per aggiornare la password:</p>
            <div class="qr-fake small" style="margin:0.75rem auto;">
              <div class="qr-corner tl"></div>
              <div class="qr-corner tr"></div>
              <div class="qr-corner bl"></div>
              <div class="qr-dots"></div>
            </div>
            <p style="font-size:0.78rem;color:#999;margin-top:0.5rem;">Reparto IT &mdash; Non rispondere a questa email</p>
          </div>
        </div>
      </div>
      <div class="options">
        <label class="option" data-value="safe" onclick="QuizEngine.check(3,'safe','danger','','E\\' quishing! Il mittente e\\' azienda-aggiornamenti.com (non il dominio aziendale vero), il tono e\\' urgente per farti agire senza pensare, e il QR Code in un\\'email serve ad aggirare i filtri anti-phishing. Il reparto IT non ti chiederebbe mai di cambiare password tramite QR Code in un\\'email.')">
          <input type="radio" name="q3"> Sicuro &mdash; scansiono e aggiorno la password
        </label>
        <label class="option" data-value="danger" onclick="QuizEngine.check(3,'danger','danger','Il mittente usa un dominio falso (azienda-aggiornamenti.com), il tono urgente e\\' un classico trucco di phishing, e il QR Code in email serve ad aggirare i filtri anti-spam che non possono analizzare le immagini. Contatta il tuo reparto IT direttamente per verificare.','')">
          <input type="radio" name="q3"> Sospetto &mdash; il reparto IT non manderebbe un QR cosi'
        </label>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q4: QR volantino premio -->
    <div class="question" id="q-4">
      <h3><span class="q-number">4.</span> Trovi questo volantino nella cassetta della posta. Cosa fai?</h3>
      <div class="qr-scenario">
        <div class="qr-flyer">
          <div class="qr-flyer-header">🎉 CONGRATULAZIONI! 🎉</div>
          <div class="qr-flyer-text">
            Il tuo indirizzo e' stato selezionato per ricevere un<br>
            <strong style="font-size:1.1rem;color:#f59e0b;">BUONO SPESA DA 500€</strong>
          </div>
          <div class="qr-fake small" style="margin:0.75rem auto;">
            <div class="qr-corner tl"></div>
            <div class="qr-corner tr"></div>
            <div class="qr-corner bl"></div>
            <div class="qr-dots"></div>
          </div>
          <div class="qr-flyer-cta">Scansiona il QR per ritirare il premio!</div>
          <div class="qr-flyer-fine">*Offerta valida 24 ore. Richiesti dati carta per verifica identita'.</div>
        </div>
      </div>
      <div class="options">
        <label class="option" data-value="safe" onclick="QuizEngine.check(4,'safe','danger','','E\\' una truffa classica! Nessuno regala 500 euro a caso. Il limite di 24 ore serve a crearti urgenza, e richiedere i dati della carta per verificare l\\'identita\\' e\\' un pretesto per rubarli. Non scansionare mai QR Code da volantini che promettono premi.')">
          <input type="radio" name="q4"> Scansiono &mdash; potrebbe essere un premio vero
        </label>
        <label class="option" data-value="danger" onclick="QuizEngine.check(4,'danger','danger','Nessuno regala 500 euro tramite volantino! Tutti i segnali di truffa sono presenti: premio non richiesto, urgenza artificiale (24 ore), e soprattutto la richiesta dei dati della carta di credito con la scusa della verifica identita\\'. Butta il volantino.','')">
          <input type="radio" name="q4"> Truffa &mdash; nessuno regala 500 euro cosi'
        </label>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q5: QR pagamento al bar legittimo -->
    <div class="question" id="q-5">
      <h3><span class="q-number">5.</span> Al bar, il proprietario ti mostra il QR per pagare con Satispay. Cosa fai?</h3>
      <div class="qr-scenario">
        <div class="qr-location">
          <div class="qr-location-icon">☕</div>
          <div class="qr-location-name">Bar Sport di Luigi</div>
        </div>
        <div class="qr-sticker safe">
          <div class="qr-fake small">
            <div class="qr-corner tl"></div>
            <div class="qr-corner tr"></div>
            <div class="qr-corner bl"></div>
            <div class="qr-dots"></div>
          </div>
          <div class="qr-sticker-label">Paga con Satispay</div>
        </div>
        <div class="qr-preview">
          <span class="qr-preview-label">L'app Satispay mostra:</span>
          <span class="qr-preview-url safe">Bar Sport di Luigi &mdash; €2,50</span>
        </div>
      </div>
      <div class="options">
        <label class="option" data-value="safe" onclick="QuizEngine.check(5,'safe','safe','Il pagamento avviene tramite l\\'app ufficiale Satispay (non un sito web), il proprietario e\\' presente, il nome del negozio corrisponde e l\\'importo e\\' quello giusto. I pagamenti QR tramite app certificate (Satispay, PayPal, ecc.) sono sicuri perche\\' l\\'app verifica il destinatario.','')">
          <input type="radio" name="q5"> Sicuro &mdash; l'app Satispay conferma nome e importo
        </label>
        <label class="option" data-value="danger" onclick="QuizEngine.check(5,'danger','safe','','Questo pagamento e\\' sicuro! L\\'app Satispay e\\' ufficiale, mostra il nome del bar e l\\'importo corretto, e il proprietario e\\' presente. A differenza di un QR che apre un sito web sconosciuto, le app di pagamento certificate verificano il destinatario per te.')">
          <input type="radio" name="q5"> Sospetto &mdash; non mi fido del QR per pagare
        </label>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q6: Come proteggersi -->
    <div class="question" id="q-6">
      <h3><span class="q-number">6.</span> Qual e' la regola piu' importante quando scansioni un QR Code?</h3>
      <div class="qr-scenario">
        <div class="qr-tips">
          <div class="qr-tip">
            <div class="qr-tip-icon">📱</div>
            <div class="qr-tip-text">Il telefono mostra un'anteprima del link prima di aprirlo</div>
          </div>
          <div class="qr-tip">
            <div class="qr-tip-icon">👀</div>
            <div class="qr-tip-text">Controlla il dominio nell'anteprima: e' quello che ti aspetti?</div>
          </div>
          <div class="qr-tip">
            <div class="qr-tip-icon">🔒</div>
            <div class="qr-tip-text">Il sito usa HTTPS? Il dominio e' ufficiale?</div>
          </div>
        </div>
      </div>
      <div class="options">
        <label class="option" data-value="scan" onclick="QuizEngine.check(6,'scan','preview','','Mai aprire un link da QR Code senza prima controllare l\\'anteprima! Il telefono ti mostra sempre il link prima di aprirlo: verifica che il dominio sia quello corretto e che usi HTTPS. Se l\\'URL sembra strano o non c\\'entra con il contesto, non aprirlo.')">
          <input type="radio" name="q6"> Scansionare e aprire subito il link
        </label>
        <label class="option" data-value="preview" onclick="QuizEngine.check(6,'preview','preview','Controllare sempre l\\'anteprima del link e\\' la difesa numero uno! Il telefono ti mostra il link prima di aprirlo: verifica che il dominio sia coerente con il contesto (es. il nome del ristorante, il sito del comune), che usi HTTPS e che non contenga errori sospetti.','')">
          <input type="radio" name="q6"> Controllare sempre l'anteprima del link prima di aprirlo
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

  const html = wrapQuiz("Truffe con QR Code", body);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
