import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { buildQuizPage, type QuizQuestion } from "../../api/vuln/_quiz-layout";

const intro = `
      <h2>Progetti: contesto persistente per l'AI</h2>
      <p>
        Un <strong>Progetto</strong> (Claude Projects, i GPT personalizzati, i Gem di Gemini) e' un contenitore che
        unisce <strong>istruzioni fisse</strong> e <strong>file di conoscenza</strong> riutilizzabili in ogni
        conversazione. Serve quando un compito torna spesso con lo stesso contesto: invece di re-incollare tutto
        ogni volta, lo imposti una sola volta.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">Istruzioni persistenti:</strong> ruolo, tono e regole validi per tutte le chat del progetto.</li>
        <li><strong style="color:#38bdf8;">Knowledge files:</strong> documenti di riferimento (manuali, linee guida) sempre a disposizione.</li>
        <li><strong style="color:#38bdf8;">Riuso:</strong> ideale per compiti ricorrenti con lo stesso contesto.</li>
      </ul>`;

const questions: QuizQuestion[] = [
  {
    q: "Cos'e', in sostanza, un 'Progetto' AI (es. Claude Projects, GPT personalizzato, Gem)?",
    options: [
      { text: "Un contenitore con istruzioni fisse e documenti di conoscenza riutilizzabili in piu' conversazioni", correct: true, feedback: "Esatto: il Progetto conserva contesto e regole, cosi' ogni nuova chat parte gia' configurata senza re-incollare tutto." },
      { text: "Un singolo messaggio particolarmente lungo", feedback: "Non e' un messaggio: e' un contenitore di contesto e istruzioni che vale per molte conversazioni." },
      { text: "Un modello AI piu' potente degli altri", feedback: "Non e' un modello diverso: e' un modo di organizzare contesto e istruzioni attorno al modello." },
      { text: "Un foglio di calcolo collegato all'AI", feedback: "Un Progetto raccoglie istruzioni e documenti di riferimento, non e' un foglio di calcolo." },
    ],
  },
  {
    q: "Qual e' il vantaggio principale di usare un Progetto per un compito ricorrente?",
    options: [
      { text: "Non devi re-incollare contesto e regole ogni volta: sono gia' nel progetto", correct: true, feedback: "Corretto: il contesto persistente fa risparmiare tempo e garantisce coerenza tra le conversazioni." },
      { text: "Il modello diventa permanentemente piu' intelligente", feedback: "Il Progetto non cambia le capacita' del modello: organizza il contesto che gli fornisci." },
      { text: "Le risposte diventano sempre piu' lunghe", feedback: "Il vantaggio e' coerenza e riuso del contesto, non la lunghezza delle risposte." },
      { text: "Elimina la necessita' di verificare gli output", feedback: "La verifica resta sempre necessaria: il Progetto migliora il contesto, non l'affidabilita' assoluta." },
    ],
  },
  {
    q: "A cosa servono i 'file di conoscenza' (knowledge files) in un Progetto?",
    options: [
      { text: "A fornire documenti di riferimento che l'AI consulta in ogni conversazione del progetto", correct: true, feedback: "Esatto: linee guida, manuali o glossari caricati nel progetto restano disponibili come riferimento costante." },
      { text: "A salvare le password degli utenti", feedback: "Non sono un caveau di credenziali: servono come materiale di riferimento per il compito." },
      { text: "A velocizzare la connessione internet", feedback: "Non hanno alcun effetto sulla rete: sono documenti di contesto." },
      { text: "A rendere il modello open-source", feedback: "Caricare documenti non cambia la natura del modello." },
    ],
  },
  {
    q: "In quale situazione conviene creare un Progetto invece di una singola chat?",
    options: [
      { text: "Quando lo stesso tipo di compito, con lo stesso contesto, si ripete spesso", correct: true, feedback: "Corretto: la ripetitivita' con contesto stabile e' il caso ideale per un Progetto, che lo rende riutilizzabile e coerente." },
      { text: "Per una domanda secca, una tantum, senza contesto da riusare", feedback: "Per una domanda isolata basta una chat normale: il Progetto conviene quando c'e' contesto da riutilizzare." },
      { text: "Solo quando si lavora di notte", feedback: "L'orario non c'entra: conta la ricorrenza del compito e del contesto." },
      { text: "Mai: i Progetti non servono a nulla", feedback: "I Progetti sono molto utili proprio per i compiti ricorrenti con contesto condiviso." },
    ],
  },
  {
    q: "Qual e' la differenza tra un Progetto e una semplice chat?",
    options: [
      { text: "Il Progetto mantiene istruzioni e documenti tra le conversazioni; la chat parte da zero ogni volta", correct: true, feedback: "Esatto: la chat e' effimera, il Progetto e' persistente e riutilizzabile come 'spazio di lavoro' configurato." },
      { text: "La chat e' a pagamento, il Progetto e' gratis", feedback: "Non e' una differenza di prezzo: e' la persistenza del contesto a distinguerli." },
      { text: "Il Progetto funziona senza modello AI", feedback: "Il Progetto usa comunque un modello: aggiunge contesto e istruzioni attorno ad esso." },
      { text: "Non c'e' alcuna differenza", feedback: "C'e' eccome: il Progetto conserva contesto e regole, la chat no." },
    ],
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);
  const html = buildQuizPage("Progetti: contesto persistente per l'AI", intro, questions);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
