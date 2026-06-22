import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { buildQuizPage, type QuizQuestion } from "../../api/vuln/_quiz-layout";

const intro = `
      <h2>Prompt per il lavoro d'ufficio</h2>
      <p>
        Un buon prompt e' la differenza tra una risposta inutile e una bozza pronta all'uso. Non serve
        essere tecnici: bastano poche abitudini — <strong>dare contesto</strong>, <strong>mostrare esempi</strong>,
        <strong>chiedere il formato giusto</strong> e <strong>iterare</strong> — applicate a email, verbali,
        sintesi e documenti.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">Contesto e ruolo:</strong> dì chi sei, a chi ti rivolgi e qual e' l'obiettivo.</li>
        <li><strong style="color:#38bdf8;">Esempi (few-shot):</strong> un esempio del risultato voluto guida meglio di mille spiegazioni.</li>
        <li><strong style="color:#38bdf8;">Formato:</strong> chiedi esplicitamente tabella, elenco, tono formale, lunghezza.</li>
        <li><strong style="color:#38bdf8;">Iterazione:</strong> la prima risposta e' una bozza da raffinare, non un oracolo.</li>
      </ul>`;

const questions: QuizQuestion[] = [
  {
    q: "Quale prompt produce probabilmente la email migliore?",
    options: [
      { text: "\"Scrivi un'email\"", feedback: "Troppo vago: senza destinatario, obiettivo e tono il modello tira a indovinare." },
      { text: "\"Sei l'ufficio acquisti. Scrivi un'email formale a un fornitore per sollecitare una consegna in ritardo, tono fermo ma cortese, max 120 parole\"", correct: true, feedback: "Esatto: ruolo, destinatario, obiettivo, tono e lunghezza danno al modello tutto il contesto per una bozza usabile." },
      { text: "\"Email fornitore ritardo grazie\"", feedback: "Telegrafico e ambiguo: mancano tono, obiettivo e vincoli. Il risultato sara' generico." },
      { text: "\"Scrivi la migliore email possibile, lo sai tu\"", feedback: "Delegare tutto senza contesto non funziona: il modello non conosce la tua situazione." },
    ],
  },
  {
    q: "Vuoi che le risposte seguano sempre lo stesso formato (es. un verbale strutturato). Tecnica piu' efficace?",
    options: [
      { text: "Fornire un esempio del formato desiderato (few-shot)", correct: true, feedback: "Corretto: mostrare uno o due esempi del risultato voluto e' il modo piu' affidabile per ottenere un formato coerente." },
      { text: "Scrivere il prompt tutto in maiuscolo per enfasi", feedback: "Il maiuscolo non migliora la qualita': conta il contenuto del prompt, non lo stile grafico." },
      { text: "Ripetere 'per favore' molte volte", feedback: "La cortesia non definisce il formato: serve un esempio concreto della struttura voluta." },
      { text: "Chiedere e sperare, senza specificare il formato", feedback: "Senza indicare la struttura otterrai formati diversi ogni volta." },
    ],
  },
  {
    q: "Devi far risolvere all'AI un problema in piu' passaggi (es. confrontare tre offerte e motivare la scelta). Cosa aiuta?",
    options: [
      { text: "Chiedere di ragionare passo per passo prima di concludere (chain-of-thought)", correct: true, feedback: "Esatto: invitare il modello a esplicitare i passaggi prima della conclusione migliora l'accuratezza nei compiti che richiedono ragionamento." },
      { text: "Chiedere solo la risposta finale, il piu' corta possibile", feedback: "Per problemi a piu' passaggi, forzare una risposta secca aumenta gli errori: meglio far esplicitare il ragionamento." },
      { text: "Vietare al modello di spiegare", feedback: "Togliere il ragionamento intermedio peggiora i compiti complessi." },
      { text: "Aumentare a caso la lunghezza richiesta", feedback: "Non e' la lunghezza in se', ma il ragionamento strutturato a fare la differenza." },
    ],
  },
  {
    q: "La prima risposta dell'AI e' quasi buona ma il tono e' troppo informale. Cosa fai?",
    options: [
      { text: "Continuo la conversazione chiedendo di rendere il tono piu' formale e accorciare", correct: true, feedback: "Corretto: l'AI lavora bene in modo iterativo. Raffinare la bozza con istruzioni mirate e' piu' rapido che ripartire da zero." },
      { text: "Butto tutto e ricomincio una chat nuova senza spiegare cosa non andava", feedback: "Sprechi il lavoro fatto: spesso basta un'istruzione di correzione nella stessa conversazione." },
      { text: "Pubblico la risposta cosi' com'e'", feedback: "L'output e' una bozza: va sempre validato e rifinito prima dell'uso." },
      { text: "Decido che l'AI non sa scrivere email", feedback: "Il problema e' solo il tono: una semplice istruzione di follow-up lo sistema." },
    ],
  },
  {
    q: "Perche' conviene dare contesto su destinatario e obiettivo nel prompt?",
    options: [
      { text: "Perche' il modello adatta contenuto, registro e dettaglio a chi legge e allo scopo", correct: true, feedback: "Esatto: lo stesso testo cambia molto se e' per un cliente, un collega o un dirigente. Il contesto guida le scelte del modello." },
      { text: "Perche' altrimenti il modello si rifiuta di rispondere", feedback: "Non e' una questione di rifiuto: senza contesto risponde comunque, ma in modo generico." },
      { text: "Perche' fa consumare meno energia", feedback: "Il motivo e' la qualita' e la pertinenza del risultato, non il consumo." },
      { text: "Non conviene, il contesto confonde il modello", feedback: "Al contrario: un contesto chiaro migliora la pertinenza della risposta." },
    ],
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);
  const html = buildQuizPage("Prompt per il lavoro d'ufficio", intro, questions);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
