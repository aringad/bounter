import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { buildQuizPage, type QuizQuestion } from "../../api/vuln/_quiz-layout";

const intro = `
      <h2>MCP: collegare l'AI a strumenti e dati</h2>
      <p>
        Il <strong>Model Context Protocol (MCP)</strong> e' uno <strong>standard aperto</strong> per collegare i
        modelli AI a strumenti e fonti dati esterne (file, database, API, gestionali) in modo uniforme. L'idea:
        invece di costruire un'integrazione su misura per ogni app, esponi le tue risorse tramite un
        <strong>server MCP</strong> riutilizzabile da piu' client AI.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">Standard aperto:</strong> un modo comune per esporre dati e strumenti all'AI.</li>
        <li><strong style="color:#38bdf8;">Analogia:</strong> e' come una "porta USB-C" per le integrazioni AI — un connettore unico.</li>
        <li><strong style="color:#38bdf8;">Riuso:</strong> lo stesso server MCP serve piu' applicazioni, evitando integrazioni custom ripetute.</li>
      </ul>`;

const questions: QuizQuestion[] = [
  {
    q: "Cos'e' il Model Context Protocol (MCP)?",
    options: [
      { text: "Uno standard aperto per collegare i modelli AI a strumenti e fonti dati esterne", correct: true, feedback: "Esatto: MCP definisce un modo comune e riutilizzabile per dare ai modelli accesso a dati e strumenti, senza integrazioni custom per ogni caso." },
      { text: "Un nuovo modello linguistico piu' potente di GPT", feedback: "Non e' un modello: e' un protocollo di integrazione tra modelli e risorse esterne." },
      { text: "Un linguaggio di programmazione per il web", feedback: "Non e' un linguaggio: e' uno standard per collegare l'AI a strumenti e dati." },
      { text: "Un formato di immagine generata dall'AI", feedback: "Niente a che vedere con le immagini: riguarda l'accesso a strumenti e dati." },
    ],
  },
  {
    q: "Quale analogia descrive bene l'MCP?",
    options: [
      { text: "Una 'porta USB-C' per l'AI: un connettore standard per collegare strumenti e dati", correct: true, feedback: "Corretto: come l'USB-C standardizza il collegamento di tanti dispositivi, MCP standardizza il collegamento dell'AI a fonti e strumenti." },
      { text: "Un antivirus che protegge il modello", feedback: "MCP non e' uno strumento di sicurezza: e' uno standard di integrazione." },
      { text: "Una batteria che alimenta i data center", feedback: "Non riguarda l'alimentazione: riguarda il collegamento a strumenti e dati." },
      { text: "Un tasto per spegnere l'AI", feedback: "Non e' un interruttore: e' un protocollo per dare accesso a risorse esterne." },
    ],
  },
  {
    q: "Qual e' il vantaggio pratico di esporre i propri dati tramite un server MCP?",
    options: [
      { text: "Lo stesso server puo' essere riusato da piu' applicazioni AI, evitando integrazioni custom ripetute", correct: true, feedback: "Esatto: standardizzare il collegamento riduce il lavoro di integrazione e rende i tuoi dati/strumenti disponibili a piu' client in modo uniforme." },
      { text: "I dati diventano automaticamente pubblici per tutti", feedback: "Falso e pericoloso: MCP non rende pubblici i dati; gli accessi restano sotto controllo." },
      { text: "Il modello non ha piu' bisogno di alcun controllo sugli accessi", feedback: "Al contrario: collegando dati reali servono permessi e controlli adeguati." },
      { text: "Le risposte diventano sempre piu' lunghe", feedback: "Il beneficio e' l'integrazione standard e il riuso, non la lunghezza delle risposte." },
    ],
  },
  {
    q: "In quale situazione ha senso usare MCP?",
    options: [
      { text: "Quando vuoi che l'AI possa leggere o agire su sistemi reali, es. il gestionale aziendale", correct: true, feedback: "Corretto: MCP serve proprio a dare al modello accesso controllato a dati e strumenti reali, in modo standardizzato e riutilizzabile." },
      { text: "Quando vuoi solo fare due chiacchiere generiche con un chatbot", feedback: "Per una conversazione generica senza accesso a sistemi esterni non serve MCP." },
      { text: "Quando vuoi cambiare il colore dell'interfaccia", feedback: "Nessun legame con l'aspetto: MCP riguarda l'accesso a strumenti e dati." },
      { text: "Quando vuoi disattivare internet", feedback: "Non c'entra con la connettivita' di rete: e' un protocollo di integrazione AI-strumenti." },
    ],
  },
  {
    q: "MCP e agenti: che relazione c'e'?",
    options: [
      { text: "MCP fornisce agli agenti un modo standard per accedere agli strumenti che usano per agire", correct: true, feedback: "Esatto: gli agenti hanno bisogno di strumenti; MCP standardizza come quegli strumenti e dati vengono esposti e raggiunti." },
      { text: "Sono la stessa identica cosa con due nomi diversi", feedback: "No: l'agente e' chi pianifica e agisce; MCP e' lo standard con cui si collega agli strumenti." },
      { text: "MCP serve a rendere gli agenti piu' lenti", feedback: "Non e' un freno: facilita e standardizza l'accesso agli strumenti." },
      { text: "Non possono mai essere usati insieme", feedback: "Al contrario: si combinano molto bene, MCP alimenta gli strumenti dell'agente." },
    ],
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);
  const html = buildQuizPage("MCP: collegare l'AI a strumenti e dati", intro, questions);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
