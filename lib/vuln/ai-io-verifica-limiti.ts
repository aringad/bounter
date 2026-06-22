import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { buildQuizPage, type QuizQuestion } from "../../api/vuln/_quiz-layout";

const intro = `
      <h2>Verifica e limiti dell'AI</h2>
      <p>
        L'AI e' un assistente, non un oracolo. Per usarla bene sul lavoro devi conoscere i suoi limiti:
        puo' <strong>inventare informazioni plausibili</strong> (hallucination), non conosce i fatti
        piu' recenti, e <strong>la responsabilita' dell'output resta tua</strong>. Sapere cosa verificare
        e cosa non condividere e' parte del mestiere.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">Hallucination:</strong> citazioni, numeri, nomi e norme vanno sempre verificati alla fonte.</li>
        <li><strong style="color:#38bdf8;">Attualita':</strong> senza ricerca attiva, il modello non conosce eventi recenti.</li>
        <li><strong style="color:#38bdf8;">Riservatezza:</strong> non incollare dati personali, segreti aziendali o credenziali.</li>
        <li><strong style="color:#38bdf8;">Responsabilita':</strong> l'output e' una bozza; la decisione e la firma restano umane.</li>
      </ul>`;

const questions: QuizQuestion[] = [
  {
    q: "L'AI ti cita una sentenza con numero e data precisi a sostegno di una tesi. Cosa fai prima di usarla?",
    options: [
      { text: "Verifico che la sentenza esista davvero e dica quello, su una fonte ufficiale", correct: true, feedback: "Corretto: i modelli possono inventare riferimenti plausibili ma falsi (hallucination). Citazioni e numeri vanno sempre controllati alla fonte." },
      { text: "La uso subito: se ha numero e data sara' vera", feedback: "Pericoloso: precisione apparente non significa veridicita'. Le hallucination sono spesso molto credibili." },
      { text: "Chiedo all'AI 'sei sicura?' e mi fido della conferma", feedback: "Il modello puo' confermare con sicurezza anche un'informazione falsa: serve una verifica esterna, non l'autoconferma." },
      { text: "La copio cambiando solo qualche parola", feedback: "Riformulare un dato non verificato non lo rende affidabile: prima va controllato." },
    ],
  },
  {
    q: "Ti serve sapere una notizia di mercato di questa settimana. Puoi fidarti di un LLM 'a memoria'?",
    options: [
      { text: "No: senza strumenti di ricerca attiva non conosce gli eventi piu' recenti", correct: true, feedback: "Esatto: il modello ha un limite temporale di conoscenza. Per dati aggiornati serve uno strumento che cerchi fonti in tempo reale, e comunque va verificato." },
      { text: "Si': i modelli sono sempre aggiornati al minuto", feedback: "Falso: la conoscenza 'interna' si ferma a una certa data. Per l'attualita' serve ricerca attiva e verifica." },
      { text: "Si', ma solo se chiedo in inglese", feedback: "La lingua non aggiorna la conoscenza del modello." },
      { text: "Si', basta chiedere 'che giorno e' oggi'", feedback: "Conoscere la data non equivale a conoscere le notizie recenti." },
    ],
  },
  {
    q: "Quale di questi contenuti NON dovresti incollare in uno strumento AI non approvato dall'azienda?",
    options: [
      { text: "Elenco di clienti con dati personali e fatturati", correct: true, feedback: "Corretto: dati personali e riservati non vanno in strumenti non approvati. Rischi data leakage e violazioni GDPR (vedi 'AI e Privacy')." },
      { text: "Un testo pubblico gia' presente sul sito aziendale", feedback: "Un contenuto gia' pubblico non aggiunge rischio: il problema sono i dati riservati o personali." },
      { text: "Una bozza di comunicato generico senza dati sensibili", feedback: "Senza dati personali o segreti, una bozza generica e' a basso rischio." },
      { text: "Una domanda di cultura generale", feedback: "Nessun dato sensibile in gioco: non e' questo il caso problematico." },
    ],
  },
  {
    q: "L'AI ha prodotto un report che userai per una decisione importante. Di chi e' la responsabilita' del contenuto?",
    options: [
      { text: "Tua: l'output e' una bozza che devi validare prima di farlo tuo", correct: true, feedback: "Esatto: l'AI assiste, ma la responsabilita' di accuratezza, conformita' e firma resta della persona che usa il risultato." },
      { text: "Del fornitore del modello, che garantisce ogni risposta", feedback: "I fornitori non garantiscono la correttezza dei contenuti generati: la validazione spetta a te." },
      { text: "Di nessuno, perche' l'ha scritto una macchina", feedback: "Usare l'output senza verificarlo non solleva dalla responsabilita': resta umana." },
      { text: "Del collega che ti ha consigliato lo strumento", feedback: "La responsabilita' e' di chi usa e firma il risultato, non di chi ha suggerito il tool." },
    ],
  },
  {
    q: "L'AI ti fornisce un'analisi con percentuali e totali. Qual e' l'errore tipico da intercettare?",
    options: [
      { text: "Numeri e calcoli plausibili ma sbagliati: vanno ricontrollati con strumenti esatti", correct: true, feedback: "Corretto: gli LLM possono produrre aritmetica errata con tono sicuro. Per i numeri usa o verifica con strumenti deterministici." },
      { text: "Il modello rifiuta sempre di lavorare con i numeri", feedback: "Non li rifiuta: il rischio e' che li sbagli sembrando affidabile." },
      { text: "I numeri sono sempre esatti, e' il testo a sbagliare", feedback: "Al contrario: proprio i calcoli sono un punto debole tipico, da verificare." },
      { text: "Le percentuali non si possono mai calcolare con l'AI", feedback: "Si possono stimare, ma vanno verificate: il punto e' il controllo, non il divieto." },
    ],
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);
  const html = buildQuizPage("Verifica e limiti dell'AI", intro, questions);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
