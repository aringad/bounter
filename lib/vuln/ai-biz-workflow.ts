import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { buildQuizPage, type QuizQuestion } from "../../api/vuln/_quiz-layout";

const intro = `
      <h2>Impostare un workflow con l'AI</h2>
      <p>
        Portare l'AI in azienda non significa "comprare un chatbot", ma <strong>ridisegnare un processo</strong>.
        Si parte dal problema, si scompone il flusso, si inserisce l'AI dove crea valore (volumi alti, attivita'
        ripetitive) tenendo <strong>l'umano nei punti di decisione</strong>, e si misura prima di scalare.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">Prima il problema:</strong> obiettivo e criteri di successo, poi lo strumento.</li>
        <li><strong style="color:#38bdf8;">Human-in-the-loop:</strong> l'AI propone, la persona approva nei passaggi critici.</li>
        <li><strong style="color:#38bdf8;">Pilota e KPI:</strong> si testa su piccola scala con metriche, poi si estende.</li>
        <li><strong style="color:#38bdf8;">Dati collegati:</strong> meglio integrare le fonti (tool/MCP) che copia-incollare a mano.</li>
      </ul>`;

const questions: QuizQuestion[] = [
  {
    q: "Vuoi introdurre l'AI per gestire le richieste di assistenza. Qual e' il primo passo corretto?",
    options: [
      { text: "Definire il problema, l'obiettivo e i criteri di successo da raggiungere", correct: true, feedback: "Esatto: si parte sempre dal problema e dalle metriche di successo. Lo strumento si sceglie dopo, in funzione dell'obiettivo." },
      { text: "Scegliere subito il modello AI piu' famoso e adattarci il processo", feedback: "Partire dallo strumento e' un errore classico: rischi di forzare un processo attorno a una tecnologia senza sapere cosa vuoi ottenere." },
      { text: "Licenziare parte del team di supporto per risparmiare subito", feedback: "Decisione prematura e rischiosa: prima si valuta dove l'AI aiuta davvero, con un pilota misurato." },
      { text: "Comprare il maggior numero di licenze possibile", feedback: "Spendere prima di aver definito obiettivo e processo porta a spreco e progetti falliti." },
    ],
  },
  {
    q: "In un processo, dove conviene inserire l'AI per avere il massimo beneficio col minor rischio?",
    options: [
      { text: "Nei passaggi ad alto volume e ripetitivi, con revisione umana sugli output", correct: true, feedback: "Corretto: l'AI rende sui volumi e sulla ripetitivita', mentre l'umano valida i risultati (human-in-the-loop) nei punti che contano." },
      { text: "Nella decisione finale legalmente vincolante, senza controllo umano", feedback: "Le decisioni con responsabilita' legale o impatto critico vanno mantenute sotto controllo umano." },
      { text: "Ovunque contemporaneamente, dal primo giorno", feedback: "Inserirla ovunque subito impedisce di misurare e correggere: meglio iniziare mirato e con un pilota." },
      { text: "Solo nelle attivita' rare e una tantum", feedback: "Sulle attivita' rare il ritorno e' basso: il valore sta nei volumi e nella ripetitivita'." },
    ],
  },
  {
    q: "Prima di estendere l'AI a tutta l'azienda, qual e' l'approccio prudente?",
    options: [
      { text: "Fare un pilota su un caso limitato, con KPI di qualita', e poi scalare", correct: true, feedback: "Esatto: un pilota misurato riduce il rischio, mostra il valore reale e permette di correggere prima dell'adozione su larga scala." },
      { text: "Attivarla per tutti i reparti nello stesso giorno", feedback: "Il rollout totale senza pilota amplifica gli errori e rende difficile capire cosa funziona." },
      { text: "Non misurare nulla, tanto 'si vede' se funziona", feedback: "Senza KPI non puoi dimostrare il valore ne' giustificare l'investimento." },
      { text: "Affidarsi solo all'entusiasmo del fornitore", feedback: "Le promesse del fornitore non sostituiscono dati tuoi: serve un pilota con metriche." },
    ],
  },
  {
    q: "Il workflow AI deve usare dati che vivono nel gestionale aziendale. Soluzione migliore?",
    options: [
      { text: "Integrare le fonti tramite strumenti/connettori (es. MCP, API) cosi' l'AI accede ai dati in modo controllato", correct: true, feedback: "Corretto: collegare le fonti tramite tool/API/MCP rende il flusso affidabile e tracciabile, evitando errori e fughe da copia-incolla manuale." },
      { text: "Esportare tutto in un file e incollarlo a mano nel chatbot ogni volta", feedback: "Il copia-incolla manuale e' lento, soggetto a errori e a rischi di data leakage: meglio un'integrazione controllata." },
      { text: "Chiedere all'AI di indovinare i dati del gestionale", feedback: "Senza accesso reale ai dati il modello inventa: serve un collegamento alle fonti." },
      { text: "Stampare i dati e leggerli all'AI a voce", feedback: "Approccio non scalabile ne' affidabile: i dati vanno integrati in modo strutturato." },
    ],
  },
  {
    q: "Come mantieni la qualita' di un processo AI nel tempo?",
    options: [
      { text: "Definisco KPI, controllo a campione gli output e raccolgo feedback per migliorare prompt e regole", correct: true, feedback: "Esatto: monitoraggio continuo, controlli a campione e iterazione mantengono la qualita' ed evitano il degrado nel tempo." },
      { text: "Lo lascio andare da solo: una volta impostato non va piu' toccato", feedback: "I processi cambiano (dati, esigenze, modelli): senza monitoraggio la qualita' puo' degradare senza accorgersene." },
      { text: "Misuro solo il costo, mai la qualita'", feedback: "Il costo da solo non basta: senza misurare la qualita' rischi output scadenti a basso prezzo." },
      { text: "Chiedo agli utenti di arrangiarsi", feedback: "Ignorare il feedback degli utenti fa perdere il segnale piu' utile per migliorare." },
    ],
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);
  const html = buildQuizPage("Impostare un workflow con l'AI", intro, questions);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
