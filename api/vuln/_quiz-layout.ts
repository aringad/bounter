export function wrapQuiz(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bounter - ${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', system-ui, sans-serif; background: #0f172a; color: #e2e8f0; min-height: 100vh; }
    .quiz-header { background: #1e293b; padding: 1rem 1.5rem; border-bottom: 1px solid #334155; }
    .quiz-header h1 { color: #e09900; font-size: 1.1rem; }
    .quiz-header .subtitle { color: #94a3b8; font-size: 0.8rem; margin-top: 0.2rem; }
    .container { max-width: 750px; margin: 1.5rem auto; padding: 0 1rem; }
    .intro { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 1.25rem; margin-bottom: 1.5rem; line-height: 1.6; }
    .intro h2 { color: #38bdf8; font-size: 1.1rem; margin-bottom: 0.5rem; }
    .intro p { color: #94a3b8; font-size: 0.9rem; }
    .question { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem; transition: border-color 0.3s; }
    .question.correct { border-color: #22c55e; }
    .question.wrong { border-color: #ef4444; }
    .question h3 { color: #e2e8f0; font-size: 0.95rem; margin-bottom: 0.75rem; line-height: 1.4; }
    .question .q-number { color: #e09900; font-weight: 700; }
    .options { display: flex; flex-direction: column; gap: 0.4rem; }
    .option { display: flex; align-items: flex-start; gap: 0.6rem; padding: 0.6rem 0.75rem; border: 1px solid #475569; border-radius: 6px; cursor: pointer; transition: all 0.2s; font-size: 0.88rem; line-height: 1.4; }
    .option:hover { border-color: #e09900; background: rgba(224,153,0,0.05); }
    .option.selected { border-color: #2ea3f2; background: rgba(46,163,242,0.15); }
    .option.correct-answer { border-color: #22c55e !important; background: rgba(34,197,94,0.15) !important; opacity: 1 !important; }
    .option.wrong-answer { border-color: #ef4444 !important; background: rgba(239,68,68,0.15) !important; opacity: 1 !important; }
    .option.disabled { pointer-events: none; opacity: 0.5; }
    .option input[type="radio"] { margin-top: 2px; accent-color: #e09900; pointer-events: none; flex-shrink: 0; }
    .feedback { margin-top: 0.75rem; padding: 0.75rem; border-radius: 6px; font-size: 0.85rem; line-height: 1.5; display: none; }
    .feedback.show { display: block; }
    .feedback.correct { background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.3); color: #86efac; }
    .feedback.wrong { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: #fca5a5; }
    .score-bar { position: sticky; bottom: 0; background: #1e293b; border-top: 1px solid #334155; padding: 0.75rem 1.5rem; display: flex; justify-content: space-between; align-items: center; }
    .score-bar .score { color: #e09900; font-weight: 700; font-size: 1rem; }
    .score-bar .progress { color: #94a3b8; font-size: 0.85rem; }
    .btn-check { background: #e09900; color: #1c1b3a; border: none; padding: 0.5rem 1.25rem; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.85rem; font-family: inherit; }
    .btn-check:hover { background: #f0a800; }
    .btn-check:disabled { background: #475569; color: #94a3b8; cursor: not-allowed; }
    .result-box { background: #1e293b; border: 2px solid #e09900; border-radius: 12px; padding: 2rem; text-align: center; margin: 2rem 0; display: none; }
    .result-box h2 { color: #e09900; font-size: 1.3rem; margin-bottom: 0.5rem; }
    .result-box .big-score { font-size: 2.5rem; font-weight: 700; color: #22c55e; margin: 0.5rem 0; }
    .result-box .message { color: #94a3b8; font-size: 0.9rem; }
    /* Email client simulation */
    .email-client { background: #fff; border-radius: 10px; overflow: hidden; margin: 0.75rem 0; box-shadow: 0 2px 12px rgba(0,0,0,0.3); }
    .email-toolbar { background: #f3f4f6; padding: 0.5rem 0.75rem; display: flex; gap: 0.75rem; border-bottom: 1px solid #e5e7eb; font-size: 0.72rem; color: #6b7280; }
    .email-toolbar span { cursor: default; display: flex; align-items: center; gap: 0.2rem; }
    .email-headers { padding: 0.75rem 1rem; border-bottom: 1px solid #e5e7eb; font-size: 0.82rem; }
    .email-headers .eh-row { display: flex; margin-bottom: 0.3rem; }
    .email-headers .eh-label { color: #6b7280; min-width: 60px; font-weight: 500; }
    .email-headers .eh-value { color: #1f2937; }
    .email-headers .eh-value.suspicious { color: #1f2937; }
    .email-body-content { padding: 1rem; color: #374151; line-height: 1.6; font-size: 0.88rem; }
    .email-body-content .link { color: #1a73e8; text-decoration: underline; word-break: break-all; }
    .email-body-content .link.suspicious-link { }
    .question.answered .suspicious-highlight { background: #fef2f2; border: 1px dashed #ef4444; border-radius: 3px; padding: 0 3px; }
    .question.answered .safe-highlight { background: #f0fdf4; border: 1px dashed #22c55e; border-radius: 3px; padding: 0 3px; }

    /* Legacy email-sim kept for social engineering */
    .email-sim { background: #fff; color: #333; border-radius: 8px; padding: 1rem; margin: 0.5rem 0; font-size: 0.88rem; }
    .email-sim .from { color: #666; font-size: 0.8rem; }
    .email-sim .from strong { color: #333; }
    .email-sim .subject { font-weight: 600; margin: 0.3rem 0; }
    .email-sim .body { color: #555; line-height: 1.5; }
    .email-sim .link { color: #1a73e8; text-decoration: underline; }

    /* URL anatomy coloring */
    .url-display { background: #0f172a; border: 1px solid #475569; border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 0.75rem; font-family: 'Courier New', monospace; font-size: 0.88rem; word-break: break-all; line-height: 1.6; }
    .url-proto { color: #94a3b8; }
    .url-subdomain { color: #a78bfa; }
    .url-domain { color: #38bdf8; font-weight: 700; }
    .url-tld { color: #22d3ee; }
    .url-path { color: #64748b; }
    .url-danger { color: #f87171; font-weight: 700; }
    .question.answered .url-danger-reveal { text-decoration: underline wavy #ef4444; background: rgba(239,68,68,0.15); border-radius: 2px; padding: 0 2px; }

    /* Phone call simulation */
    .phone-call { background: linear-gradient(135deg, #1a2332, #0f172a); border: 1px solid #334155; border-radius: 12px; padding: 1.25rem; margin: 0.75rem 0; }
    .phone-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid #334155; }
    .phone-icon { width: 36px; height: 36px; background: #22c55e; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
    .phone-caller { color: #e2e8f0; font-weight: 600; font-size: 0.9rem; }
    .phone-number { color: #64748b; font-size: 0.78rem; }
    .phone-transcript { color: #94a3b8; font-size: 0.88rem; line-height: 1.6; font-style: italic; }

    /* USB baiting */
    .usb-scenario { background: linear-gradient(135deg, #1e293b, #0f172a); border: 1px solid #334155; border-radius: 12px; padding: 1.5rem; margin: 0.75rem 0; text-align: center; }
    .usb-icon { font-size: 3rem; margin-bottom: 0.5rem; }
    .usb-label { display: inline-block; background: #fef9c3; color: #854d0e; padding: 0.3rem 0.8rem; border-radius: 4px; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.5rem; transform: rotate(-2deg); border: 1px dashed #ca8a04; }
    .usb-context { color: #94a3b8; font-size: 0.85rem; margin-top: 0.5rem; }

    /* WiFi network cards */
    .wifi-list { display: flex; flex-direction: column; gap: 0.5rem; margin: 0.75rem 0; }
    .wifi-card { background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 0.75rem 1rem; display: flex; align-items: center; gap: 0.75rem; }
    .wifi-signal { display: flex; align-items: flex-end; gap: 2px; height: 16px; }
    .wifi-signal .bar { width: 3px; background: #22c55e; border-radius: 1px; }
    .wifi-signal .bar:nth-child(1) { height: 4px; }
    .wifi-signal .bar:nth-child(2) { height: 8px; }
    .wifi-signal .bar:nth-child(3) { height: 12px; }
    .wifi-signal .bar:nth-child(4) { height: 16px; }
    .wifi-signal.weak .bar:nth-child(3), .wifi-signal.weak .bar:nth-child(4) { background: #334155; }
    .wifi-name { color: #e2e8f0; font-weight: 500; font-size: 0.88rem; flex: 1; }
    .wifi-lock { font-size: 0.75rem; }
    .wifi-open { color: #f59e0b; font-size: 0.68rem; font-weight: 500; }
    .wifi-secure { color: #22c55e; font-size: 0.68rem; font-weight: 500; }

    /* App permissions - risk meter */
    .app-card { background: #0f172a; border-radius: 10px; padding: 1.25rem; margin-bottom: 0.75rem; }
    .app-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
    .app-icon { font-size: 2rem; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); border-radius: 12px; }
    .app-info h4 { color: #e2e8f0; font-size: 1rem; }
    .app-info .app-cat { color: #64748b; font-size: 0.78rem; }
    .risk-meter { margin: 0.75rem 0 0.5rem; }
    .risk-meter-label { display: flex; justify-content: space-between; font-size: 0.72rem; margin-bottom: 0.25rem; }
    .risk-meter-label .low { color: #22c55e; }
    .risk-meter-label .high { color: #ef4444; }
    .risk-bar { height: 6px; background: #1e293b; border-radius: 3px; overflow: hidden; }
    .risk-fill { height: 100%; border-radius: 3px; transition: width 0.5s; }
    .risk-fill.safe { width: 20%; background: linear-gradient(90deg, #22c55e, #4ade80); }
    .risk-fill.danger { width: 85%; background: linear-gradient(90deg, #f59e0b, #ef4444); }
    .perm-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.5rem; }

    /* Ransomware popup */
    .ransomware-popup { background: #1a0000; border: 3px solid #dc2626; border-radius: 8px; padding: 1.5rem; margin: 0.75rem 0; text-align: center; animation: ransomPulse 2s ease-in-out infinite; }
    @keyframes ransomPulse { 0%, 100% { border-color: #dc2626; } 50% { border-color: #991b1b; } }
    .ransomware-popup .skull { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .ransomware-popup h4 { color: #ef4444; font-size: 1.1rem; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 1px; }
    .ransomware-popup p { color: #fca5a5; font-size: 0.88rem; line-height: 1.5; }
    .ransomware-popup .ransom-amount { color: #f59e0b; font-size: 1.3rem; font-weight: 700; margin: 0.5rem 0; }
    .ransomware-popup .timer { color: #ef4444; font-family: monospace; font-size: 1rem; margin-top: 0.5rem; }

    /* File extension highlight */
    .file-ext { font-family: monospace; font-size: 1rem; background: #1e293b; padding: 0.75rem 1rem; border-radius: 8px; margin: 0.5rem 0; display: inline-block; }
    .file-ext .safe-part { color: #94a3b8; }
    .file-ext .danger-part { color: #ef4444; font-weight: 700; background: rgba(239,68,68,0.15); padding: 0 3px; border-radius: 3px; animation: dangerBlink 1.5s ease-in-out infinite; }
    @keyframes dangerBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }

    /* Sender domain comparison */
    .domain-compare { display: flex; gap: 1rem; margin: 0.5rem 0; flex-wrap: wrap; }
    .domain-card { flex: 1; min-width: 200px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; padding: 0.75rem; font-family: monospace; font-size: 0.88rem; text-align: center; }
    .domain-card .dc-label { font-family: 'Inter', sans-serif; font-size: 0.7rem; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 0.5rem; }
    .domain-card.card-a .dc-label { color: #f59e0b; }
    .domain-card.card-b .dc-label { color: #38bdf8; }
    .domain-card .dc-email { color: #e2e8f0; word-break: break-all; }
    .tag { display: inline-block; padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.72rem; font-weight: 600; }
    .tag.safe { background: #166534; color: #86efac; }
    .tag.danger { background: #991b1b; color: #fca5a5; }
  </style>
</head>
<body>
  <div class="quiz-header">
    <h1>${title}</h1>
    <div class="subtitle">Mediaform Security Lab</div>
  </div>
  <script>
    // Shared quiz logic — must be defined BEFORE body so init() calls work
    window.QuizEngine = {
      answered: {},
      correct: 0,
      total: 0,
      init(total) {
        this.total = total;
        this.updateScore();
      },
      check(qId, selectedValue, correctValue, feedbackCorrect, feedbackWrong) {
        if (this.answered[qId]) return;
        this.answered[qId] = true;
        const q = document.getElementById('q-' + qId);
        const isCorrect = selectedValue === correctValue;
        if (isCorrect) this.correct++;
        q.classList.add('answered');
        q.classList.add(isCorrect ? 'correct' : 'wrong');
        const options = q.querySelectorAll('.option');
        options.forEach(o => {
          const radio = o.querySelector('input[type="radio"]');
          if (radio) radio.checked = false;
          o.classList.add('disabled');
          if (o.dataset.value === selectedValue) {
            if (radio) radio.checked = true;
            o.classList.add('selected');
          }
          if (o.dataset.value === correctValue) o.classList.add('correct-answer');
          else if (o.dataset.value === selectedValue && !isCorrect) o.classList.add('wrong-answer');
        });
        const fb = q.querySelector('.feedback');
        fb.className = 'feedback show ' + (isCorrect ? 'correct' : 'wrong');
        // Strip any existing Corretto!/Sbagliato! prefix and auto-add the correct one
        var msg = isCorrect ? feedbackCorrect : feedbackWrong;
        msg = msg.replace(/^(Corretto!|Sbagliato!)\s*/i, '');
        fb.textContent = (isCorrect ? 'Corretto! ' : 'Sbagliato! ') + msg;
        this.updateScore();
        if (Object.keys(this.answered).length === this.total) this.showResult();
      },
      updateScore() {
        const el = document.getElementById('score');
        if (el) el.textContent = this.correct + ' / ' + this.total;
        const prog = document.getElementById('progress');
        if (prog) prog.textContent = Object.keys(this.answered).length + ' di ' + this.total + ' completate';
      },
      showResult() {
        const box = document.getElementById('result-box');
        if (!box) return;
        box.style.display = 'block';
        const pct = Math.round(this.correct / this.total * 100);
        box.querySelector('.big-score').textContent = pct + '%';
        const msg = box.querySelector('.message');
        if (pct === 100) msg.textContent = 'Perfetto! Hai risposto correttamente a tutte le domande!';
        else if (pct >= 70) msg.textContent = 'Ottimo lavoro! Rivedi le risposte sbagliate per migliorare.';
        else if (pct >= 40) msg.textContent = 'Buon inizio! Rileggi le spiegazioni e riprova.';
        else msg.textContent = 'Continua a studiare, la sicurezza informatica si impara con la pratica!';
        box.scrollIntoView({ behavior: 'smooth' });
      }
    };
  </script>
  <div class="container">${body}</div>
</body>
</html>`;
}
