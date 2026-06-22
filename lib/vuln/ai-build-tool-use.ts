import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { buildQuizPage, type QuizQuestion } from "../../api/vuln/_quiz-layout";

const intro = `
      <h2>Tool use: quando l'AI usa gli strumenti</h2>
      <p>
        Con il <strong>tool use</strong> (o <em>function calling</em>) il modello non si limita a generare testo:
        puo' <strong>chiamare funzioni e strumenti esterni</strong> — una calcolatrice, una ricerca, una query a un
        database, un'API — e usare il risultato nella risposta. Cosi' supera i suoi limiti: matematica esatta,
        dati aggiornati, azioni concrete.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">Come funziona:</strong> il modello produce una richiesta strutturata, l'app esegue lo strumento e restituisce il risultato.</li>
        <li><strong style="color:#38bdf8;">Perche':</strong> per calcoli esatti, dati in tempo reale o azioni che il solo testo non puo' garantire.</li>
        <li><strong style="color:#38bdf8;">Esempi:</strong> meteo, calcolatrice, lookup su database, invio di una richiesta API.</li>
      </ul>`;

const questions: QuizQuestion[] = [
  {
    q: "Cosa permette il 'tool use' (function calling) a un modello AI?",
    options: [
      { text: "Chiamare funzioni o strumenti esterni e usarne il risultato nella risposta", correct: true, feedback: "Esatto: il modello puo' delegare a uno strumento (calcolo, ricerca, API) e integrare il risultato, andando oltre la sola generazione di testo." },
      { text: "Aumentare la dimensione del carattere del testo", feedback: "Niente a che vedere con l'aspetto: riguarda la capacita' di invocare strumenti esterni." },
      { text: "Rendere il modello open-source", feedback: "Il tool use non cambia la natura del modello: gli da' la possibilita' di usare strumenti." },
      { text: "Cancellare i dati di addestramento", feedback: "Non riguarda i dati di training: riguarda l'uso di strumenti a runtime." },
    ],
  },
  {
    q: "Perche' il tool use e' utile per calcoli o dati aggiornati?",
    options: [
      { text: "Perche' delega a strumenti affidabili cio' che il modello da solo potrebbe sbagliare o non sapere", correct: true, feedback: "Corretto: una calcolatrice da' aritmetica esatta e una ricerca da' dati attuali, superando i limiti del modello 'a memoria'." },
      { text: "Perche' il modello smette di generare testo per sempre", feedback: "Il modello continua a generare testo: semplicemente integra i risultati degli strumenti quando serve." },
      { text: "Perche' gli strumenti rendono il modello piu' lento e basta", feedback: "Il punto e' l'accuratezza e l'attualita', non un rallentamento fine a se stesso." },
      { text: "Perche' elimina la necessita' di qualsiasi modello AI", feedback: "Serve comunque il modello: decide quando e quale strumento chiamare." },
    ],
  },
  {
    q: "Come avviene tipicamente una chiamata a strumento?",
    options: [
      { text: "Il modello produce una richiesta strutturata, l'applicazione esegue lo strumento e restituisce il risultato al modello", correct: true, feedback: "Esatto: il modello non esegue direttamente il codice; formula la richiesta, l'app la esegue e gli ritorna l'esito da usare nella risposta." },
      { text: "Il modello esegue fisicamente lui stesso ogni programma sul tuo PC", feedback: "Non e' il modello a eseguire: produce una richiesta che l'applicazione esegue in modo controllato." },
      { text: "Lo strumento riscrive da solo il modello AI", feedback: "Gli strumenti non modificano il modello: gli forniscono risultati." },
      { text: "Non serve alcuna applicazione intorno al modello", feedback: "Serve un'app/orchestratore che esegua davvero gli strumenti richiesti dal modello." },
    ],
  },
  {
    q: "Quale e' un buon esempio di tool use?",
    options: [
      { text: "Chiedere il meteo di domani e lasciare che il modello interroghi un'API meteo invece di indovinare", correct: true, feedback: "Corretto: per dati che il modello non puo' conoscere 'a memoria', chiamare uno strumento dedicato e' la soluzione affidabile." },
      { text: "Chiedere al modello di inventare un numero a caso senza alcuno strumento", feedback: "Inventare non e' tool use: il tool use serve proprio a sostituire l'invenzione con un dato reale." },
      { text: "Chiedere una definizione di una parola comune", feedback: "Per una definizione generica il modello risponde da solo: non e' un caso che richieda strumenti." },
      { text: "Chiedere di salutare l'utente", feedback: "Un saluto e' pura generazione di testo: nessuno strumento necessario." },
    ],
  },
  {
    q: "Qual e' la differenza tra 'generare testo' e 'compiere azioni' con il tool use?",
    options: [
      { text: "Generare testo produce parole; col tool use il modello puo' innescare operazioni reali tramite strumenti", correct: true, feedback: "Esatto: il tool use collega il linguaggio all'azione — leggere dati, calcolare, chiamare un'API — non solo descrivere a parole." },
      { text: "Non c'e' differenza: e' sempre solo testo", feedback: "C'e' differenza: col tool use il modello attiva strumenti che compiono operazioni reali." },
      { text: "Compiere azioni significa solo scrivere in grassetto", feedback: "Il grassetto e' formattazione: le azioni sono operazioni reali eseguite dagli strumenti." },
      { text: "Generare testo richiede internet, le azioni no", feedback: "La distinzione e' tra produrre parole e attivare strumenti, non la connessione di rete." },
    ],
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);
  const html = buildQuizPage("Tool use: quando l'AI usa gli strumenti", intro, questions);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
