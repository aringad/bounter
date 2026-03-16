import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>Il panorama dei modelli AI</h2>
      <p>
        Il mercato dell\\'intelligenza artificiale generativa e\\' dominato da diversi attori principali:
        <strong>OpenAI</strong> (GPT-4, GPT-4o), <strong>Anthropic</strong> (Claude),
        <strong>Google</strong> (Gemini), <strong>Meta</strong> (Llama) e <strong>Mistral</strong>.
      </p>
      <p style="margin-top: 0.5rem;">
        Alcuni modelli sono <strong>closed-source</strong> e accessibili solo via API cloud (GPT, Claude, Gemini),
        mentre altri sono <strong>open-weight</strong> e scaricabili per l\\'esecuzione locale (Llama, Mistral).
        La scelta tra <strong>SaaS</strong> (Software as a Service) e <strong>self-hosted</strong> dipende
        da fattori come privacy dei dati, costi, compliance e facilita\\' di integrazione.
      </p>
    </div>

    <!-- Domanda 1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">Q1.</span> Qual e\\' la differenza principale tra un modello AI "closed-source" e uno "open-source"?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'b',
          'Corretto!',
          'Sbagliato. La velocita\\' non e\\' il fattore distintivo. La differenza chiave e\\' che i modelli closed-source (GPT, Claude) sono accessibili solo via API, mentre quelli open-weight (Llama, Mistral) hanno i pesi scaricabili e possono essere eseguiti localmente.')">
          <input type="radio" name="q1"> <span>I modelli closed-source sono piu\\' veloci</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'b',
          'Corretto! I modelli closed-source come GPT e Claude sono accessibili solo tramite API cloud, mentre quelli open-weight come Llama e Mistral hanno i pesi del modello scaricabili e possono essere eseguiti in locale o su infrastruttura propria.',
          'Sbagliato.')">
          <input type="radio" name="q1"> <span>I closed-source sono accessibili solo via API, gli open-weight hanno i pesi scaricabili</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'b',
          'Corretto!',
          'Sbagliato. Entrambi i tipi possono essere usati per scopi commerciali (con le rispettive licenze). La differenza e\\' che i closed-source sono accessibili solo via API, mentre gli open-weight possono essere scaricati e ospitati localmente.')">
          <input type="radio" name="q1"> <span>I modelli open-source non possono essere usati commercialmente</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1, 'd', 'b',
          'Corretto!',
          'Sbagliato. Anche i modelli closed-source vengono aggiornati regolarmente. La differenza fondamentale riguarda l\\'accessibilita\\': API cloud vs pesi scaricabili.')">
          <input type="radio" name="q1"> <span>Non c\\'e\\' differenza, cambia solo la frequenza degli aggiornamenti</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">Q2.</span> Quando conviene usare un modello AI self-hosted invece di un servizio SaaS?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'c',
          'Corretto!',
          'Sbagliato. Il SaaS e\\' generalmente piu\\' semplice da usare, ma non e\\' sempre la scelta migliore. Il self-hosted conviene quando servono privacy dei dati, compliance normativa o controllo dei costi su larga scala.')">
          <input type="radio" name="q2"> <span>Sempre, perche\\' il SaaS e\\' troppo costoso</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'c',
          'Corretto!',
          'Sbagliato. Il SaaS e\\' comodo ma non e\\' sempre la scelta giusta. Il self-hosted diventa preferibile quando ci sono requisiti di privacy, compliance o quando i volumi giustificano l\\'investimento infrastrutturale.')">
          <input type="radio" name="q2"> <span>Mai, il SaaS e\\' sempre la scelta migliore</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'c',
          'Corretto! Il self-hosted e\\' preferibile quando ci sono esigenze di privacy dei dati, requisiti di compliance normativa (es. GDPR), o quando i volumi di utilizzo sono cosi\\' alti da rendere il self-hosting piu\\' economico. Il SaaS resta vantaggioso per la facilita\\' d\\'uso e la rapidita\\' di integrazione.',
          'Sbagliato.')">
          <input type="radio" name="q2"> <span>Quando servono privacy dei dati, compliance normativa o controllo costi su larga scala</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(2, 'd', 'c',
          'Corretto!',
          'Sbagliato. La qualita\\' dipende dal modello specifico, non dal deployment. Il vantaggio del self-hosted riguarda privacy, compliance e controllo dei costi a volume.')">
          <input type="radio" name="q2"> <span>Solo quando si vuole un modello di qualita\\' superiore</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">Q3.</span> Cosa significa "fine-tuning" di un modello AI?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'b',
          'Corretto!',
          'Sbagliato. Il fine-tuning non crea un modello da zero. Si tratta di un addestramento aggiuntivo su dati specifici per specializzare un modello base gia\\' pre-addestrato.')">
          <input type="radio" name="q3"> <span>Creare un modello completamente nuovo da zero</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'b',
          'Corretto! Il fine-tuning consiste nell\\'addestrare ulteriormente un modello base gia\\' pre-addestrato utilizzando dati specifici del proprio dominio. Questo permette di specializzare il modello per un compito o settore particolare senza dover ripartire da zero.',
          'Sbagliato.')">
          <input type="radio" name="q3"> <span>Addestrare ulteriormente un modello base con dati specifici per specializzarlo</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'b',
          'Corretto!',
          'Sbagliato. Ridurre le dimensioni e\\' chiamato pruning o quantizzazione. Il fine-tuning e\\' un addestramento aggiuntivo su dati specifici per specializzare il modello.')">
          <input type="radio" name="q3"> <span>Ridurre le dimensioni del modello per velocizzarlo</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(3, 'd', 'b',
          'Corretto!',
          'Sbagliato. Aggiornare il software e\\' manutenzione ordinaria. Il fine-tuning e\\' un processo di addestramento aggiuntivo su dati specifici per adattare il modello a un dominio particolare.')">
          <input type="radio" name="q3"> <span>Aggiornare il software del modello all\\'ultima versione</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">Q4.</span> GPT-4, Claude e Gemini: cosa hanno in comune?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'c',
          'Corretto!',
          'Sbagliato. Sono sviluppati da aziende diverse (OpenAI, Anthropic, Google). Quello che hanno in comune e\\' che sono tutti LLM basati su architettura Transformer, accessibili via API cloud e con licenza commerciale.')">
          <input type="radio" name="q4"> <span>Sono tutti sviluppati dalla stessa azienda</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'c',
          'Corretto!',
          'Sbagliato. Nessuno dei tre e\\' open-source: sono tutti closed-source con accesso via API. Hanno in comune l\\'essere LLM basati su Transformer, accessibili via API cloud e con uso commerciale.')">
          <input type="radio" name="q4"> <span>Sono tutti open-source e gratuiti</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'c',
          'Corretto! GPT-4 (OpenAI), Claude (Anthropic) e Gemini (Google) sono tutti Large Language Model basati sull\\'architettura Transformer, accessibili tramite API cloud e offerti con licenze commerciali. Pur essendo di aziende diverse, condividono la stessa architettura di base.',
          'Sbagliato.')">
          <input type="radio" name="q4"> <span>Sono tutti LLM basati su Transformer, accessibili via API cloud e commerciali</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(4, 'd', 'c',
          'Corretto!',
          'Sbagliato. Possono elaborare testi di lunghezze variabili a seconda del modello. La caratteristica comune e\\' che sono LLM basati su Transformer, con accesso via API cloud e licenza commerciale.')">
          <input type="radio" name="q4"> <span>Possono elaborare solo testi di massimo 1000 parole</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">Q5.</span> Cos\\'e\\' un modello AI "multimodale"?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'b',
          'Corretto!',
          'Sbagliato. Parlare piu\\' lingue e\\' essere multilingue, non multimodale. Un modello multimodale e\\' in grado di elaborare diversi tipi di input: testo, immagini, audio e talvolta video.')">
          <input type="radio" name="q5"> <span>Un modello che parla piu\\' lingue</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'b',
          'Corretto! Un modello multimodale puo\\' elaborare e comprendere diversi tipi di input come testo, immagini e audio, non solo testo. Esempi: GPT-4o e Gemini possono analizzare immagini, trascrivere audio e generare risposte combinate.',
          'Sbagliato.')">
          <input type="radio" name="q5"> <span>Un modello che elabora testo, immagini e audio, non solo testo</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'b',
          'Corretto!',
          'Sbagliato. Avere piu\\' versioni non rende un modello multimodale. Multimodale significa poter elaborare diversi tipi di input: testo, immagini, audio.')">
          <input type="radio" name="q5"> <span>Un modello disponibile in piu\\' versioni</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(5, 'd', 'b',
          'Corretto!',
          'Sbagliato. Girare su piu\\' piattaforme non e\\' multimodalita\\'. Un modello multimodale elabora diversi tipi di input (testo, immagini, audio) in un unico sistema.')">
          <input type="radio" name="q5"> <span>Un modello che gira su piu\\' piattaforme contemporaneamente</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Domanda 6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">Q6.</span> Un\\'azienda deve analizzare documenti riservati con l\\'AI. Meglio un servizio SaaS o self-hosted?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'c',
          'Corretto!',
          'Sbagliato. Con il SaaS i dati vengono inviati a server esterni, il che puo\\' violare requisiti di riservatezza e compliance. Per documenti riservati e\\' preferibile il self-hosted per garantire la sovranita\\' dei dati.')">
          <input type="radio" name="q6"> <span>SaaS, perche\\' e\\' piu\\' facile da configurare</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'c',
          'Corretto!',
          'Sbagliato. Non e\\' vero che non si puo\\' usare l\\'AI: basta scegliere un approccio self-hosted. Ospitando il modello internamente, i dati riservati non escono dal perimetro aziendale.')">
          <input type="radio" name="q6"> <span>Nessuno dei due, i documenti riservati non possono essere elaborati dall\\'AI</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'c',
          'Corretto! Con un modello self-hosted i dati rimangono all\\'interno dell\\'infrastruttura aziendale, garantendo la sovranita\\' dei dati e il rispetto delle normative sulla privacy. I documenti riservati non vengono mai inviati a server esterni.',
          'Sbagliato.')">
          <input type="radio" name="q6"> <span>Self-hosted, per garantire la sovranita\\' dei dati</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6, 'd', 'c',
          'Corretto!',
          'Sbagliato. SaaS e self-hosted hanno differenze importanti in termini di privacy. Con il SaaS i dati viaggiano verso server esterni. Per documenti riservati, il self-hosted e\\' la scelta corretta.')">
          <input type="radio" name="q6"> <span>E\\' indifferente, la sicurezza e\\' la stessa</span>
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

  const html = wrapQuiz("Modelli e Servizi AI", body);
  res.setHeader("Content-Type", "text/html");
  return res.status(200).send(html);
}
