import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { buildQuizPage, type QuizQuestion } from "../../api/vuln/_quiz-layout";

const intro = `
      <h2>Tipi di prompt applicati agli scenari</h2>
      <p>
        Non esiste "il" prompt giusto: esistono <strong>tecniche</strong> da scegliere in base al compito.
        Saperle riconoscere ti fa capire <strong>quando</strong> usare un esempio, quando chiedere un ragionamento
        passo-passo, quando definire un ruolo e quando imporre un formato. Questa sfida abbina la tecnica allo scenario.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">Zero-shot vs few-shot:</strong> chiedere senza o con esempi del risultato voluto.</li>
        <li><strong style="color:#38bdf8;">Chain-of-thought:</strong> far ragionare il modello passo per passo nei problemi complessi.</li>
        <li><strong style="color:#38bdf8;">Role / system prompt:</strong> definire ruolo, tono e vincoli.</li>
        <li><strong style="color:#38bdf8;">Structured output:</strong> imporre un formato preciso (tabella, JSON, elenco).</li>
      </ul>`;

const questions: QuizQuestion[] = [
  {
    q: "Cosa significa 'few-shot' prompting?",
    options: [
      { text: "Fornire alcuni esempi del risultato desiderato per guidare il modello", correct: true, feedback: "Esatto: con il few-shot mostri uno o piu' esempi del formato/stile voluto, e il modello li imita. Senza esempi si parla di zero-shot." },
      { text: "Fare al modello pochissime domande in totale", feedback: "Non riguarda il numero di domande: riguarda il fornire alcuni esempi all'interno del prompt." },
      { text: "Usare prompt molto corti per risparmiare", feedback: "La lunghezza non e' il punto: 'few-shot' indica la presenza di esempi guida." },
      { text: "Dare al modello una sola parola", feedback: "Few-shot significa fornire esempi, non ridurre il prompt a una parola." },
    ],
  },
  {
    q: "Per un problema che richiede ragionamento in piu' passaggi, quale tecnica aiuta?",
    options: [
      { text: "Chain-of-thought: chiedere al modello di ragionare passo per passo prima di concludere", correct: true, feedback: "Corretto: esplicitare i passaggi migliora l'accuratezza sui compiti che richiedono ragionamento, riducendo gli errori da 'risposta affrettata'." },
      { text: "Imporre la risposta in una sola parola", feedback: "Forzare risposte secche su problemi complessi aumenta gli errori: serve far ragionare il modello." },
      { text: "Scrivere il prompt tutto in maiuscolo", feedback: "Lo stile grafico non incide: serve invitare il modello al ragionamento passo-passo." },
      { text: "Ripetere la domanda dieci volte", feedback: "La ripetizione non aggiunge ragionamento: meglio chiedere esplicitamente i passaggi." },
    ],
  },
  {
    q: "Vuoi che il modello scriva con un tono e un punto di vista specifici (es. 'esperto legale prudente'). Quale tecnica usi?",
    options: [
      { text: "Role / system prompt: assegnare un ruolo e dei vincoli di tono", correct: true, feedback: "Esatto: definire il ruolo orienta registro, priorita' e stile delle risposte verso quello che ti serve." },
      { text: "Few-shot con esempi di matematica", feedback: "Esempi di matematica non definiscono un ruolo o un tono: per quello serve il role prompting." },
      { text: "Chain-of-thought per forzare il tono", feedback: "Il chain-of-thought serve al ragionamento, non a impostare ruolo e tono." },
      { text: "Aumentare la 'temperatura' al massimo", feedback: "Alzare la temperatura aumenta la casualita', non definisce un ruolo o un tono coerente." },
    ],
  },
  {
    q: "Ti serve l'output in un formato preciso e prevedibile (es. una tabella o un JSON). Cosa fai?",
    options: [
      { text: "Chiedo esplicitamente il formato (structured output), magari con un esempio della struttura", correct: true, feedback: "Corretto: specificare il formato — e mostrarne un esempio — e' il modo affidabile per ottenere output strutturati e riusabili." },
      { text: "Lascio decidere al modello e spero che indovini il formato", feedback: "Senza indicare il formato otterrai strutture diverse ogni volta: poco affidabile per un uso automatizzato." },
      { text: "Scrivo il prompt in una lingua a caso", feedback: "La lingua non determina il formato: va richiesto esplicitamente." },
      { text: "Vieto al modello di rispondere", feedback: "Cosi' non ottieni nulla: per un formato preciso lo si richiede chiaramente." },
    ],
  },
  {
    q: "Qual e' l'idea di fondo nello scegliere la tecnica di prompting?",
    options: [
      { text: "Abbinare la tecnica al compito: esempi per il formato, ragionamento per i problemi, ruolo per il tono, formato per output strutturati", correct: true, feedback: "Esatto: non c'e' una tecnica 'migliore' in assoluto; la competenza sta nello scegliere quella adatta allo scenario." },
      { text: "Usare sempre e solo la stessa tecnica per ogni cosa", feedback: "Un approccio unico per tutto e' subottimale: ogni compito ha la tecnica piu' adatta." },
      { text: "Scrivere il prompt piu' lungo possibile a prescindere", feedback: "La lunghezza non e' qualita': conta la tecnica giusta per l'obiettivo." },
      { text: "Evitare di dare contesto per non confondere il modello", feedback: "Il contesto, quando pertinente, migliora la risposta: l'arte e' calibrare la tecnica, non eliminarla." },
    ],
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);
  const html = buildQuizPage("Tipi di prompt applicati agli scenari", intro, questions);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
