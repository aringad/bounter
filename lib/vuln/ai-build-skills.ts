import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { buildQuizPage, type QuizQuestion } from "../../api/vuln/_quiz-layout";

const intro = `
      <h2>Skills: procedure riutilizzabili per l'AI</h2>
      <p>
        Una <strong>Skill</strong> e' una procedura impacchettata — istruzioni, passaggi ed eventuali risorse — che
        l'AI puo' <strong>richiamare</strong> per svolgere un compito specifico in modo coerente. A differenza di un
        prompt scritto al volo, una Skill e' <strong>riutilizzabile, condivisibile e ripetibile</strong>: stesso
        compito, stesso risultato, per tutti.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">Procedura confezionata:</strong> incapsula "come si fa" un compito specifico.</li>
        <li><strong style="color:#38bdf8;">Riuso e coerenza:</strong> stessa procedura per tutti, tra sessioni e persone.</li>
        <li><strong style="color:#38bdf8;">Quando serve:</strong> processi standard ripetuti con regole precise.</li>
      </ul>`;

const questions: QuizQuestion[] = [
  {
    q: "Cos'e', in pratica, una 'Skill' per un sistema AI?",
    options: [
      { text: "Una procedura/istruzione impacchettata che l'AI puo' richiamare per un compito specifico", correct: true, feedback: "Esatto: la Skill confeziona 'come si fa' un compito, rendendolo ripetibile e coerente ogni volta che viene richiamato." },
      { text: "Un singolo messaggio scritto una volta e mai riusato", feedback: "Quello e' un prompt estemporaneo: la Skill nasce proprio per essere riutilizzata." },
      { text: "La velocita' di risposta del modello", feedback: "Non e' una metrica di velocita': e' una procedura riutilizzabile." },
      { text: "Un modello AI addestrato da zero", feedback: "Non si tratta di addestrare un modello: e' una procedura che il modello puo' applicare." },
    ],
  },
  {
    q: "Qual e' la differenza tra una Skill e un prompt scritto al volo?",
    options: [
      { text: "La Skill e' riutilizzabile, condivisibile e da' risultati coerenti; il prompt al volo va riscritto ogni volta", correct: true, feedback: "Corretto: la Skill standardizza una procedura, mentre un prompt improvvisato cambia di volta in volta e tra persone diverse." },
      { text: "La Skill funziona solo in inglese", feedback: "La lingua non e' la differenza: lo e' la riutilizzabilita' e la coerenza della procedura." },
      { text: "Il prompt al volo e' sempre piu' affidabile di una Skill", feedback: "Al contrario: la Skill garantisce maggiore coerenza proprio perche' standardizzata." },
      { text: "Non c'e' alcuna differenza", feedback: "C'e': la Skill e' una procedura confezionata e riusabile, il prompt al volo no." },
    ],
  },
  {
    q: "In quale caso conviene creare una Skill?",
    options: [
      { text: "Per un processo standard ripetuto con regole precise, es. formattare un report secondo linee guida aziendali", correct: true, feedback: "Esatto: quando una procedura e' definita e ricorre spesso, impacchettarla in una Skill garantisce coerenza e risparmio di tempo." },
      { text: "Per una richiesta unica che non si ripetera' mai", feedback: "Per un compito una tantum non vale la pena costruire una Skill: basta un prompt." },
      { text: "Solo per generare immagini artistiche casuali", feedback: "Le Skill servono a standardizzare procedure ripetibili, non a output casuali una tantum." },
      { text: "Mai: le Skill non hanno utilita' pratica", feedback: "Le Skill sono molto utili per standardizzare compiti ricorrenti e renderli coerenti." },
    ],
  },
  {
    q: "Qual e' un vantaggio chiave delle Skill in un team?",
    options: [
      { text: "Coerenza: persone e sessioni diverse ottengono lo stesso comportamento per lo stesso compito", correct: true, feedback: "Corretto: la Skill condivisa allinea tutti sulla stessa procedura, riducendo variabilita' ed errori." },
      { text: "Rende il modello fisicamente piu' veloce", feedback: "Non incide sulla velocita' hardware: incide su coerenza e riuso." },
      { text: "Elimina del tutto la necessita' di rivedere gli output", feedback: "La revisione resta utile: la Skill migliora la coerenza, non garantisce l'infallibilita'." },
      { text: "Impedisce ad altri di usare l'AI", feedback: "Le Skill abilitano e standardizzano l'uso, non lo bloccano." },
    ],
  },
  {
    q: "Come si relazionano Skill, Progetti e Agenti?",
    options: [
      { text: "Sono mattoni componibili: una Skill incapsula una procedura, un Progetto fornisce contesto stabile, un Agente orchestra piu' passi e strumenti", correct: true, feedback: "Esatto: si combinano. La Skill e' il 'come si fa' un compito; il Progetto e' il contesto; l'Agente coordina e agisce usando questi pezzi." },
      { text: "Sono tre nomi per la stessa identica cosa", feedback: "No: hanno ruoli distinti — procedura, contesto e orchestrazione — ma componibili tra loro." },
      { text: "Si escludono a vicenda e non vanno mai combinati", feedback: "Al contrario: sono pensati per lavorare insieme." },
      { text: "Solo l'Agente e' reale, gli altri due non esistono", feedback: "Tutti e tre sono concetti concreti e utili, con funzioni diverse." },
    ],
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);
  const html = buildQuizPage("Skills: procedure riutilizzabili per l'AI", intro, questions);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
