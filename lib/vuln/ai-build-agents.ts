import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { buildQuizPage, type QuizQuestion } from "../../api/vuln/_quiz-layout";

const intro = `
      <h2>Agenti AI: dal rispondere all'agire</h2>
      <p>
        Un <strong>agente</strong> non si limita a rispondere: <strong>pianifica ed esegue piu' passi</strong>,
        usando strumenti (ricerca, file, API) per raggiungere un obiettivo. E' la differenza tra un assistente che
        ti dice come fare e uno che <strong>lo fa</strong> — il che porta autonomia, ma anche bisogno di
        <strong>supervisione, permessi e limiti</strong>.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">Multi-step:</strong> scompone un obiettivo in azioni e le esegue in sequenza.</li>
        <li><strong style="color:#38bdf8;">Usa strumenti:</strong> cerca, legge, scrive, chiama API per agire sul mondo reale.</li>
        <li><strong style="color:#38bdf8;">Autonomia controllata:</strong> piu' potere richiede permessi chiari e supervisione umana.</li>
      </ul>`;

const questions: QuizQuestion[] = [
  {
    q: "Cosa distingue un 'agente' AI da un chatbot tradizionale?",
    options: [
      { text: "L'agente pianifica ed esegue piu' passi usando strumenti, non si limita a rispondere", correct: true, feedback: "Esatto: l'agente agisce — scompone l'obiettivo, chiama strumenti e porta a termine un compito multi-step, oltre a conversare." },
      { text: "L'agente usa font piu' grandi nelle risposte", feedback: "Nessuna differenza estetica: la distinzione e' la capacita' di pianificare ed eseguire azioni." },
      { text: "L'agente risponde solo a domande di una parola", feedback: "Al contrario: l'agente affronta compiti complessi e articolati, non risposte minime." },
      { text: "Non c'e' alcuna differenza reale", feedback: "C'e' una differenza sostanziale: l'agente compie azioni multi-step con strumenti, il chatbot risponde e basta." },
    ],
  },
  {
    q: "In quale scenario un agente e' davvero appropriato?",
    options: [
      { text: "Un compito multi-step: cercare informazioni, elaborarle e produrre un risultato in autonomia", correct: true, feedback: "Corretto: gli agenti danno il meglio su flussi che richiedono piu' passaggi e l'uso di strumenti, non su una singola risposta." },
      { text: "Rispondere a una sola domanda diretta e semplice", feedback: "Per una domanda secca basta un normale assistente: l'agente sarebbe sovradimensionato." },
      { text: "Definire 'oggi che giorno e'", feedback: "Compito banale e a passo singolo: non serve un agente." },
      { text: "Tradurre una frase breve", feedback: "Una traduzione singola e' un compito immediato, non un flusso multi-step da agente." },
    ],
  },
  {
    q: "Quale rischio va gestito quando si da' autonomia a un agente?",
    options: [
      { text: "Che esegua azioni indesiderate: servono permessi, limiti e supervisione umana", correct: true, feedback: "Esatto: piu' autonomia significa piu' impatto possibile degli errori. Permessi chiari, vincoli e human-in-the-loop sono essenziali." },
      { text: "Che diventi troppo educato nelle risposte", feedback: "La cortesia non e' il rischio: lo e' l'esecuzione autonoma di azioni potenzialmente dannose." },
      { text: "Che consumi troppa carta", feedback: "Non e' pertinente: il rischio riguarda azioni reali su sistemi e dati." },
      { text: "Nessuno: un agente e' sempre sicuro per definizione", feedback: "Falso: proprio la capacita' di agire richiede controlli e limiti." },
    ],
  },
  {
    q: "Un agente, per compiere le sue azioni, tipicamente:",
    options: [
      { text: "Usa strumenti esterni (ricerca, file, API) decidendo quali servono per ogni passo", correct: true, feedback: "Corretto: l'agente combina ragionamento e uso di strumenti per leggere, scrivere e agire verso l'obiettivo." },
      { text: "Lavora sempre senza accedere a nulla di esterno", feedback: "Al contrario: l'uso di strumenti esterni e' cio' che gli permette di agire sul mondo reale." },
      { text: "Chiede a un altro umano di fare ogni singola operazione", feedback: "Se delegasse tutto all'umano non sarebbe un agente: il punto e' che esegue lui i passi, con supervisione." },
      { text: "Genera solo immagini", feedback: "Non e' limitato alle immagini: usa gli strumenti necessari al compito." },
    ],
  },
  {
    q: "Quando usare un agente sarebbe ECCESSIVO?",
    options: [
      { text: "Per un compito semplice, a passo singolo, che un assistente risolve con una risposta", correct: true, feedback: "Esatto: introdurre un agente dove basta una risposta aggiunge complessita' e rischi senza benefici. Scegli lo strumento in base al compito." },
      { text: "Per orchestrare piu' passaggi e strumenti diversi verso un obiettivo", feedback: "Questo e' proprio il caso giusto per un agente, non un eccesso." },
      { text: "Per un flusso che richiede ricerca, analisi e azione combinate", feedback: "Flusso multi-step: caso ideale per un agente, non sproporzionato." },
      { text: "Per automatizzare un processo ripetitivo e articolato", feedback: "Anche questo e' un buon uso dell'agente, non un eccesso." },
    ],
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);
  const html = buildQuizPage("Agenti AI: dal rispondere all'agire", intro, questions);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
