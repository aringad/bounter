import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>Testa la forza della tua password</h2>
      <p>Digita una password per vederne la forza. Non usiamo password reali!</p>
      <input type="text" id="pw-input" placeholder="Scrivi una password di prova..." style="
        width: 100%;
        padding: 0.75rem 1rem;
        background: rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 8px;
        color: #e2e8f0;
        font-size: 1rem;
        font-family: 'Inter', system-ui, monospace;
        margin: 1rem 0 0.75rem 0;
        transition: border-color 0.2s;
        outline: none;
      " onfocus="this.style.borderColor='#e09900'" onblur="this.style.borderColor='rgba(255,255,255,0.15)'">

      <div id="strength-bar" style="
        width: 100%;
        height: 8px;
        background: rgba(255,255,255,0.08);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 0.75rem;
      ">
        <div id="strength-fill" style="
          width: 0%;
          height: 100%;
          border-radius: 4px;
          transition: width 0.3s, background 0.3s;
          background: #475569;
        "></div>
      </div>

      <div id="strength-label" style="
        font-weight: 600;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
        color: #64748b;
      ">Inserisci una password per iniziare</div>

      <div id="pw-details" style="
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.3rem 1.5rem;
        font-size: 0.82rem;
        color: #64748b;
      ">
        <span id="det-length">Lunghezza: -</span>
        <span id="det-upper">Maiuscole: -</span>
        <span id="det-lower">Minuscole: -</span>
        <span id="det-numbers">Numeri: -</span>
        <span id="det-special">Caratteri speciali: -</span>
        <span id="det-crack">Tempo di crack: -</span>
      </div>
    </div>

    <script>
    (function() {
      const commonPasswords = [
        'password', '123456', '123456789', 'qwerty', 'abc123',
        'password1', '12345678', '111111', 'iloveyou', '123123',
        'admin', 'letmein', 'welcome', 'monkey', 'dragon',
        'master', 'qwerty123', 'login', 'princess', 'football'
      ];

      function calcStrength(pw) {
        if (!pw) return { score: 0, label: 'Inserisci una password', color: '#64748b' };

        let score = 0;
        const len = pw.length;
        const hasUpper = /[A-Z]/.test(pw);
        const hasLower = /[a-z]/.test(pw);
        const hasNum = /[0-9]/.test(pw);
        const hasSpecial = /[^A-Za-z0-9]/.test(pw);
        const isCommon = commonPasswords.includes(pw.toLowerCase());

        // Length scoring
        if (len >= 4) score += 5;
        if (len >= 8) score += 10;
        if (len >= 12) score += 15;
        if (len >= 16) score += 10;
        if (len >= 20) score += 10;

        // Variety scoring
        if (hasUpper) score += 10;
        if (hasLower) score += 10;
        if (hasNum) score += 10;
        if (hasSpecial) score += 15;

        // Bonus for mixed types
        const types = [hasUpper, hasLower, hasNum, hasSpecial].filter(Boolean).length;
        if (types >= 3) score += 10;
        if (types === 4) score += 5;

        // Penalty for common passwords
        if (isCommon) score = Math.min(score, 5);

        // Penalty for repeated chars
        if (/^(.)\\1+$/.test(pw)) score = Math.min(score, 5);

        score = Math.min(score, 100);

        let label, color;
        if (isCommon) { label = 'Molto debole (password comune!)'; color = '#ef4444'; }
        else if (score < 20) { label = 'Molto debole'; color = '#ef4444'; }
        else if (score < 40) { label = 'Debole'; color = '#f97316'; }
        else if (score < 60) { label = 'Discreta'; color = '#eab308'; }
        else if (score < 80) { label = 'Buona'; color = '#22c55e'; }
        else { label = 'Ottima'; color = '#10b981'; }

        return { score, label, color };
      }

      function estimateCrackTime(pw) {
        if (!pw) return '-';
        const len = pw.length;
        let poolSize = 0;
        if (/[a-z]/.test(pw)) poolSize += 26;
        if (/[A-Z]/.test(pw)) poolSize += 26;
        if (/[0-9]/.test(pw)) poolSize += 10;
        if (/[^A-Za-z0-9]/.test(pw)) poolSize += 32;
        if (poolSize === 0) poolSize = 26;

        if (commonPasswords.includes(pw.toLowerCase())) return 'Meno di 1 secondo';

        // Assume 10 billion guesses per second (modern GPU)
        const combinations = Math.pow(poolSize, len);
        const seconds = combinations / 10e9;

        if (seconds < 1) return 'Meno di 1 secondo';
        if (seconds < 60) return Math.round(seconds) + ' secondi';
        if (seconds < 3600) return Math.round(seconds / 60) + ' minuti';
        if (seconds < 86400) return Math.round(seconds / 3600) + ' ore';
        if (seconds < 86400 * 365) return Math.round(seconds / 86400) + ' giorni';
        if (seconds < 86400 * 365 * 1000) return Math.round(seconds / (86400 * 365)) + ' anni';
        if (seconds < 86400 * 365 * 1e6) return Math.round(seconds / (86400 * 365 * 1000)) + ' mila anni';
        if (seconds < 86400 * 365 * 1e9) return Math.round(seconds / (86400 * 365 * 1e6)) + ' milioni di anni';
        return 'Miliardi di anni';
      }

      const input = document.getElementById('pw-input');
      input.addEventListener('input', function() {
        const pw = this.value;
        const result = calcStrength(pw);

        document.getElementById('strength-fill').style.width = result.score + '%';
        document.getElementById('strength-fill').style.background = result.color;
        document.getElementById('strength-label').textContent = result.label;
        document.getElementById('strength-label').style.color = result.color;

        const yes = function(v) { return v ? '\\u2705' : '\\u274c'; };
        document.getElementById('det-length').textContent = 'Lunghezza: ' + (pw.length || '-');
        document.getElementById('det-upper').textContent = 'Maiuscole: ' + yes(/[A-Z]/.test(pw));
        document.getElementById('det-lower').textContent = 'Minuscole: ' + yes(/[a-z]/.test(pw));
        document.getElementById('det-numbers').textContent = 'Numeri: ' + yes(/[0-9]/.test(pw));
        document.getElementById('det-special').textContent = 'Speciali: ' + yes(/[^A-Za-z0-9]/.test(pw));
        document.getElementById('det-crack').textContent = 'Tempo di crack: ' + estimateCrackTime(pw);

        if (!pw) {
          document.getElementById('strength-fill').style.width = '0%';
          document.getElementById('strength-label').textContent = 'Inserisci una password per iniziare';
          document.getElementById('strength-label').style.color = '#64748b';
          document.getElementById('det-length').textContent = 'Lunghezza: -';
          document.getElementById('det-upper').textContent = 'Maiuscole: -';
          document.getElementById('det-lower').textContent = 'Minuscole: -';
          document.getElementById('det-numbers').textContent = 'Numeri: -';
          document.getElementById('det-special').textContent = 'Speciali: -';
          document.getElementById('det-crack').textContent = 'Tempo di crack: -';
        }
      });
    })();
    </script>

    <!-- Quiz Section -->
    <div class="question" id="q-1">
      <h3><span class="q-number">Q1.</span> Quale tra queste password è la più sicura?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'c',
          'Corretto! Le passphrase lunghe sono molto sicure.',
          'Sbagliato. Anche se complessa, una password corta ha meno combinazioni di una passphrase lunga.')">
          <input type="radio" name="q1"> <span>P@ssw0rd!</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'c',
          'Corretto! Le passphrase lunghe sono molto sicure.',
          'Sbagliato. Questa password è comune e prevedibile nonostante abbia numeri.')">
          <input type="radio" name="q1"> <span>Admin123</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'c',
          'Corretto! Una passphrase lunga con parole casuali è molto più difficile da indovinare di una password corta e complessa. La lunghezza batte la complessità.',
          'Sbagliato.')">
          <input type="radio" name="q1"> <span>cavallo-batteria-graffetta-blu</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1, 'd', 'c',
          'Corretto! Le passphrase lunghe sono molto sicure.',
          'Sbagliato. Una password di sole 6 lettere è molto debole, anche con maiuscole.')">
          <input type="radio" name="q1"> <span>TiGrE7</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <div class="question" id="q-2">
      <h3><span class="q-number">Q2.</span> Perché non dovresti usare il nome del tuo animale domestico come password?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'b',
          'Corretto!',
          'Sbagliato. Le informazioni personali sono facilmente reperibili sui social media.')">
          <input type="radio" name="q2"> <span>Perché è troppo corta</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'b',
          'Corretto! Le informazioni personali (nomi di familiari, animali, date di nascita) sono facilmente reperibili sui social media e sono tra i primi tentativi negli attacchi mirati.',
          'Sbagliato.')">
          <input type="radio" name="q2"> <span>Perché è un'informazione personale facilmente reperibile online</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'b',
          'Corretto!',
          'Sbagliato. Il problema non è tecnico ma di prevedibilità: le info personali si trovano facilmente.')">
          <input type="radio" name="q2"> <span>Perché contiene solo lettere</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <div class="question" id="q-3">
      <h3><span class="q-number">Q3.</span> Cosa succede se usi la stessa password per tutti i tuoi account?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'a',
          'Corretto! Se un sito viene compromesso e la tua password viene rubata, gli attaccanti proveranno quella stessa password su tutti gli altri servizi (credential stuffing). Una password diversa per ogni account limita il danno.',
          'Sbagliato.')">
          <input type="radio" name="q3"> <span>Se un sito viene compromesso, tutti i tuoi account sono a rischio</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'a',
          'Corretto!',
          'Sbagliato. Riutilizzare le password è molto pericoloso: un data breach compromette tutti i tuoi account.')">
          <input type="radio" name="q3"> <span>Nessun problema, è più comodo</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'a',
          'Corretto!',
          'Sbagliato. Il rischio è molto reale: se un sito subisce un data breach, tutte le credenziali riutilizzate sono compromesse.')">
          <input type="radio" name="q3"> <span>La password diventa più facile da ricordare e quindi più sicura</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <div class="question" id="q-4">
      <h3><span class="q-number">Q4.</span> Cos'è l'autenticazione a due fattori (2FA)?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'c',
          'Corretto!',
          'Sbagliato. Due password sono comunque un solo fattore (qualcosa che sai). Il 2FA richiede due fattori diversi.')">
          <input type="radio" name="q4"> <span>Usare due password diverse</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'c',
          'Corretto!',
          'Sbagliato. Il 2FA non riguarda la lunghezza ma l\\'aggiunta di un secondo fattore di verifica.')">
          <input type="radio" name="q4"> <span>Una password che deve essere lunga il doppio</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'c',
          'Corretto! Il 2FA aggiunge un secondo livello di sicurezza: oltre alla password (qualcosa che sai), serve un codice dal telefono (qualcosa che hai) o un\\'impronta (qualcosa che sei). Anche se la password viene rubata, l\\'attaccante non può accedere senza il secondo fattore.',
          'Sbagliato.')">
          <input type="radio" name="q4"> <span>Un secondo livello di verifica oltre alla password (es. codice dal telefono)</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <div class="question" id="q-5">
      <h3><span class="q-number">Q5.</span> Qual è il modo migliore per gestire tante password diverse?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'c',
          'Corretto!',
          'Sbagliato. Scriverle su carta o in un file non protetto è rischioso. Un password manager cifra tutto e genera password forti automaticamente.')">
          <input type="radio" name="q5"> <span>Scriverle su un foglio vicino al computer</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'c',
          'Corretto!',
          'Sbagliato. Salvarle nel browser è meglio di niente, ma un password manager dedicato offre più sicurezza e funzionalità.')">
          <input type="radio" name="q5"> <span>Salvarle tutte nel browser</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'c',
          'Corretto! Un password manager (come Bitwarden, 1Password, KeePass) genera e memorizza password uniche e complesse per ogni account, protette da una singola master password. È il metodo più sicuro e pratico.',
          'Sbagliato.')">
          <input type="radio" name="q5"> <span>Usare un password manager (es. Bitwarden, 1Password)</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(5, 'd', 'c',
          'Corretto!',
          'Sbagliato. Usare la stessa password ovunque è la scelta peggiore: un singolo breach compromette tutto.')">
          <input type="radio" name="q5"> <span>Usare la stessa password per tutto, così la ricordi</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <div class="question" id="q-6">
      <h3><span class="q-number">Q6.</span> Quale di queste è una parola del dizionario e quindi vulnerabile a un attacco dictionary?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'a',
          'Corretto! \\'sunshine\\' è una parola inglese comune e appare in quasi tutti i dizionari usati negli attacchi. Un attacco dictionary prova milioni di parole reali in pochi secondi. Usa combinazioni casuali o passphrase con più parole.',
          'Sbagliato.')">
          <input type="radio" name="q6"> <span>sunshine</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'a',
          'Corretto!',
          'Sbagliato. \\'xK9!mP2z\\' è una stringa casuale che non si trova in nessun dizionario. \\'sunshine\\' invece è una parola comune e vulnerabile.')">
          <input type="radio" name="q6"> <span>xK9!mP2z</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'a',
          'Corretto!',
          'Sbagliato. Una passphrase lunga con più parole casuali è sicura. \\'sunshine\\' da sola è una singola parola del dizionario.')">
          <input type="radio" name="q6"> <span>treno-viola-rana-42</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <div id="result-box" class="result-box">
      <h2>Risultato</h2>
      <div class="big-score"></div>
      <div class="message"></div>
    </div>

    <div class="score-bar">
      <div>
        <span class="score" id="score">0 / 6</span>
        <span class="progress" id="progress" style="margin-left: 1rem;">0 di 6 completate</span>
      </div>
    </div>

    <script>QuizEngine.init(6);</script>
  `;

  const html = wrapQuiz("Password Security", body);
  res.setHeader("Content-Type", "text/html");
  return res.status(200).send(html);
}
