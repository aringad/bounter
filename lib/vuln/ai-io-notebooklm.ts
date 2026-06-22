import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { buildQuizPage, type QuizQuestion } from "../../api/vuln/_quiz-layout";

const intro = `
      <h2>NotebookLM: l'AI ancorata ai tuoi documenti</h2>
      <p>
        <strong>NotebookLM</strong> (Google) e' un assistente che lavora <strong>solo sulle fonti che carichi tu</strong>:
        PDF, documenti, appunti, pagine web. A differenza di un chatbot generico, risponde basandosi su quel materiale e
        <strong>cita i passaggi</strong> da cui prende le informazioni — utilissimo per studiare manuali, verbali o
        documentazione aziendale senza inventare.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">Fonti tue:</strong> carichi i documenti e l'assistente risponde a partire da quelli.</li>
        <li><strong style="color:#38bdf8;">Citazioni:</strong> indica da quale fonte arriva ogni affermazione, cosi' puoi verificare.</li>
        <li><strong style="color:#38bdf8;">Audio Overview:</strong> genera un riassunto in forma di dialogo audio (tipo podcast) sulle tue fonti.</li>
        <li><strong style="color:#38bdf8;">Limite:</strong> sa rispondere solo su cio' che carichi; resta da verificare e attento ai dati riservati.</li>
      </ul>`;

const questions: QuizQuestion[] = [
  {
    q: "Qual e' la caratteristica che distingue NotebookLM da un chatbot generico?",
    options: [
      { text: "Risponde basandosi sulle fonti che carichi tu, con citazioni ai passaggi", correct: true, feedback: "Esatto: e' 'grounded' sui tuoi documenti. Questo riduce le hallucination e ti permette di verificare ogni affermazione risalendo alla fonte." },
      { text: "Genera immagini fotorealistiche dai tuoi documenti", feedback: "Non e' uno strumento di generazione immagini: il suo scopo e' lavorare sulle fonti testuali che carichi." },
      { text: "Funziona senza che tu fornisca alcun materiale", feedback: "Al contrario: il suo punto di forza e' proprio lavorare sulle fonti che carichi tu." },
      { text: "Sostituisce completamente la verifica umana", feedback: "Riduce gli errori grazie alle citazioni, ma la verifica resta comunque consigliata." },
    ],
  },
  {
    q: "In quale situazione NotebookLM e' la scelta piu' indicata?",
    options: [
      { text: "Devi studiare e interrogare un insieme di manuali e verbali aziendali", correct: true, feedback: "Corretto: e' il caso d'uso ideale — sintetizzare e interrogare un corpus di documenti tuoi, con risposte tracciabili alle fonti." },
      { text: "Devi scrivere da zero codice per un'app, senza documenti di riferimento", feedback: "Senza fonti da analizzare, conviene un assistente di coding generico: NotebookLM brilla quando hai documenti da interrogare." },
      { text: "Devi generare un logo per un cliente", feedback: "E' un compito di generazione grafica, fuori dallo scopo di NotebookLM." },
      { text: "Vuoi chiacchierare di attualita' del giorno", feedback: "Per l'attualita' serve ricerca in tempo reale; NotebookLM lavora sulle fonti che gli dai." },
    ],
  },
  {
    q: "Cos'e' la funzione 'Audio Overview' di NotebookLM?",
    options: [
      { text: "Un riassunto in forma di dialogo audio (tipo podcast) generato dalle tue fonti", correct: true, feedback: "Esatto: trasforma i documenti caricati in una conversazione audio riassuntiva, utile per ripassare 'a orecchio'." },
      { text: "Un servizio di trascrizione di riunioni dal vivo", feedback: "Non trascrive riunioni in tempo reale: genera un audio riassuntivo a partire dalle fonti caricate." },
      { text: "Un correttore di pronuncia per le lingue straniere", feedback: "Non c'entra con la pronuncia: e' un riassunto audio dei tuoi documenti." },
      { text: "Una sveglia che ti legge le notifiche", feedback: "Niente a che fare: e' un riassunto vocale delle fonti che hai caricato." },
    ],
  },
  {
    q: "Stai per caricare in NotebookLM documenti con dati riservati di clienti. Cosa consideri prima?",
    options: [
      { text: "Se lo strumento e' approvato dall'azienda e i termini di servizio sono compatibili con quei dati", correct: true, feedback: "Corretto: anche uno strumento utile va usato nel rispetto delle policy aziendali e del GDPR. I dati riservati richiedono strumenti e accordi adeguati." },
      { text: "Niente: i dati su NotebookLM sono sempre fuori da ogni regola", feedback: "I dati personali e riservati sono soggetti a GDPR e policy aziendali, anche dentro NotebookLM." },
      { text: "Solo il colore dell'interfaccia", feedback: "L'aspetto e' irrilevante: conta la conformita' al trattamento dei dati." },
      { text: "Se i documenti sono in PDF o in Word", feedback: "Il formato non e' il punto: il punto e' la riservatezza dei dati e le regole d'uso." },
    ],
  },
  {
    q: "NotebookLM ti da' una risposta senza citare alcuna fonte tra quelle caricate. Come la interpreti?",
    options: [
      { text: "Con cautela: senza riferimento alle fonti va verificata, potrebbe non basarsi sui documenti", correct: true, feedback: "Esatto: il valore dello strumento sta nelle risposte ancorate e citate. Un'affermazione senza fonte va trattata come da verificare." },
      { text: "Come la piu' affidabile, perche' e' sintetica", feedback: "La sinteticita' non garantisce affidabilita': senza citazione manca la tracciabilita' alla fonte." },
      { text: "Come una citazione testuale certa di un documento", feedback: "Senza riferimento esplicito non puoi assumere che provenga dalle tue fonti." },
      { text: "Ignorando il problema, tanto e' un'AI dedicata", feedback: "Anche uno strumento dedicato puo' generalizzare: l'assenza di fonte e' un segnale da verificare." },
    ],
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);
  const html = buildQuizPage("NotebookLM: l'AI ancorata ai tuoi documenti", intro, questions);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
