import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { buildQuizPage, type QuizQuestion } from "../../api/vuln/_quiz-layout";

const intro = `
      <h2>Metti insieme i pezzi</h2>
      <p>
        Questa e' la sfida di sintesi: niente nuove nozioni, solo <strong>scelte</strong>. Per ogni scenario di
        lavoro devi capire <strong>quale strumento o approccio</strong> e' quello giusto tra opzioni vicine —
        Progetto, Agente, MCP, Skill, Tool use, NotebookLM — e quando invece conta la <strong>governance</strong>
        dei dati. E' qui che si vede chi ha davvero inquadrato <em>quando</em> e <em>come</em> usare l'AI.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">Progetto:</strong> contesto e documenti stabili, riusati tra le conversazioni.</li>
        <li><strong style="color:#38bdf8;">Skill:</strong> una procedura ripetibile e condivisibile, uguale per tutti.</li>
        <li><strong style="color:#38bdf8;">Agente:</strong> orchestrazione autonoma di piu' passi e strumenti.</li>
        <li><strong style="color:#38bdf8;">Tool use / MCP:</strong> accesso a dati e sistemi reali, non "a memoria".</li>
      </ul>`;

const questions: QuizQuestion[] = [
  {
    q: "Ogni settimana lavori sullo stesso insieme di documenti di riferimento e vuoi che le tue chat partano gia' con quel contesto. Cosa usi?",
    options: [
      { text: "Un Progetto, con istruzioni fisse e file di conoscenza riutilizzabili", correct: true, feedback: "Esatto: contesto stabile e ricorrente = Progetto. Eviti di re-incollare tutto e ottieni coerenza tra le conversazioni." },
      { text: "Riscrivo il contesto da zero in ogni nuova chat", feedback: "Spreco di tempo e incoerenza: il caso del contesto ricorrente e' esattamente cio' per cui esistono i Progetti." },
      { text: "Un agente autonomo che decide tutto da solo", feedback: "Qui non serve autonomia multi-step: serve solo conservare contesto e documenti, cioe' un Progetto." },
      { text: "Tool use verso un'API esterna", feedback: "Il tool use serve ad accedere a dati/azioni esterne, non a conservare il contesto delle tue conversazioni." },
    ],
  },
  {
    q: "L'AI deve rispondere usando dati che cambiano in tempo reale dentro il gestionale aziendale. Approccio corretto?",
    options: [
      { text: "Collegare il gestionale via tool use / MCP, cosi' l'AI legge i dati reali e aggiornati", correct: true, feedback: "Corretto: per dati reali e aggiornati serve un accesso a strumenti/fonti (tool use, MCP). 'A memoria' il modello non li conosce." },
      { text: "Affidarsi alle conoscenze interne del modello", feedback: "Il modello non conosce i tuoi dati gestionali ne' gli aggiornamenti recenti: li inventerebbe. Serve un collegamento alla fonte." },
      { text: "Caricare i dati come file di conoscenza in un Progetto una volta sola", feedback: "I knowledge file sono statici: per dati che cambiano in tempo reale serve un accesso vivo via tool use/MCP." },
      { text: "Aumentare la temperatura del modello", feedback: "La temperatura regola la creativita', non da' accesso a dati esterni." },
    ],
  },
  {
    q: "Ti serve un flusso autonomo che cerca informazioni, le elabora, aggiorna un file e ripete su piu' passaggi. Cosa scegli?",
    options: [
      { text: "Un Agente, che pianifica ed esegue i passi usando gli strumenti necessari", correct: true, feedback: "Esatto: compito multi-step con uso di strumenti e autonomia = Agente (con permessi e supervisione adeguati)." },
      { text: "Un singolo prompt in una chat normale", feedback: "Un singolo prompt non orchestra piu' passi autonomi: questo e' il terreno degli agenti." },
      { text: "Un Progetto con buone istruzioni", feedback: "Il Progetto fornisce contesto, ma non esegue da solo una sequenza di azioni: serve un agente." },
      { text: "Una Skill statica senza esecuzione", feedback: "La Skill incapsula una procedura, ma l'orchestrazione autonoma multi-step e' compito dell'agente (che puo' anche usare Skill)." },
    ],
  },
  {
    q: "Vuoi che tutto il team produca un certo report sempre con la stessa identica procedura e regole. Cosa imposti?",
    options: [
      { text: "Una Skill: una procedura impacchettata, condivisibile e ripetibile allo stesso modo da tutti", correct: true, feedback: "Corretto: procedura standard, ripetibile e condivisa = Skill. Garantisce coerenza tra persone e sessioni." },
      { text: "Lascio che ognuno scriva il prompt come preferisce", feedback: "Cosi' ottieni risultati incoerenti: serve standardizzare la procedura in una Skill." },
      { text: "Un agente che decide ogni volta una procedura diversa", feedback: "Qui vuoi proprio l'opposto della variabilita': una procedura fissa e ripetibile, cioe' una Skill." },
      { text: "NotebookLM con i report passati", feedback: "NotebookLM serve a interrogare fonti, non a imporre una procedura standard di produzione al team." },
    ],
  },
  {
    q: "Devi studiare a fondo e interrogare un insieme di tuoi PDF (manuali, verbali), con risposte tracciabili alle fonti. Strumento migliore?",
    options: [
      { text: "NotebookLM, che risponde basandosi sulle fonti caricate e cita i passaggi", correct: true, feedback: "Esatto: corpus di documenti tuoi da interrogare con citazioni = NotebookLM. Riduce le hallucination e rende verificabile la risposta." },
      { text: "Un chatbot generico senza caricare i documenti", feedback: "Senza le tue fonti il modello generalizza e puo' inventare: serve uno strumento ancorato ai documenti." },
      { text: "Un agente che naviga internet a caso", feedback: "Non ti serve esplorare il web: ti serve interrogare i TUOI documenti, con citazioni." },
      { text: "Una Skill di formattazione", feedback: "La Skill standardizza una procedura, non e' lo strumento per studiare e interrogare un corpus di fonti." },
    ],
  },
  {
    q: "Per un'analisi devi usare un elenco di clienti con dati personali reali. Qual e' la scelta corretta a prescindere dallo strumento tecnico?",
    options: [
      { text: "Usare solo uno strumento aziendale approvato, con garanzie sul trattamento dei dati", correct: true, feedback: "Corretto: la governance viene prima della tecnica. Dati personali solo in strumenti approvati (DPA, GDPR, data residency); mai in tool pubblici non autorizzati." },
      { text: "Incollarli nel primo chatbot pubblico gratuito disponibile", feedback: "E' proprio cio' da non fare: rischi data leakage e violazioni GDPR. La scelta tecnica non annulla l'obbligo di proteggere i dati." },
      { text: "Va bene qualsiasi strumento, purche' potente", feedback: "La potenza non c'entra: con dati personali conta dove finiscono i dati e con quali garanzie." },
      { text: "Basta cancellare la chat dopo l'uso", feedback: "Cancellare la chat non annulla l'invio dei dati a un servizio non approvato: il rischio resta." },
    ],
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);
  const html = buildQuizPage("Metti insieme i pezzi", intro, questions);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
