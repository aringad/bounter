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
    .option input[type="radio"] { margin-top: 2px; accent-color: #e09900; }
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
    .email-sim { background: #fff; color: #333; border-radius: 8px; padding: 1rem; margin: 0.5rem 0; font-size: 0.88rem; }
    .email-sim .from { color: #666; font-size: 0.8rem; }
    .email-sim .from strong { color: #333; }
    .email-sim .subject { font-weight: 600; margin: 0.3rem 0; }
    .email-sim .body { color: #555; line-height: 1.5; }
    .email-sim .link { color: #1a73e8; text-decoration: underline; }
    .tag { display: inline-block; padding: 0.1rem 0.4rem; border-radius: 3px; font-size: 0.7rem; font-weight: 600; }
    .tag.safe { background: #166534; color: #86efac; }
    .tag.danger { background: #991b1b; color: #fca5a5; }
  </style>
</head>
<body>
  <div class="quiz-header">
    <h1>${title}</h1>
    <div class="subtitle">Mediaform Security Lab</div>
  </div>
  <div class="container">${body}</div>
  <script>
    // Shared quiz logic
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
        q.classList.add(isCorrect ? 'correct' : 'wrong');
        const options = q.querySelectorAll('.option');
        options.forEach(o => {
          o.classList.add('disabled');
          const radio = o.querySelector('input[type="radio"]');
          if (o.dataset.value === selectedValue && radio) radio.checked = true;
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
</body>
</html>`;
}
