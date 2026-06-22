import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { buildQuizPage, type QuizQuestion } from "../../api/vuln/_quiz-layout";

const intro = `
      <h2>Casi d'uso dell'AI per reparto</h2>
      <p>
        L'AI non serve "in generale": serve a <strong>compiti concreti</strong>, diversi reparto per reparto.
        Vendite, supporto, HR, amministrazione e marketing hanno opportunita' specifiche — quasi sempre con
        <strong>l'umano che valida</strong> prima dell'uso, soprattutto dove ci sono decisioni sulle persone
        o sui clienti.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">Supporto:</strong> bozze di risposta e smistamento delle richieste, con revisione.</li>
        <li><strong style="color:#38bdf8;">Amministrazione:</strong> estrazione dati da documenti e fatture.</li>
        <li><strong style="color:#38bdf8;">HR:</strong> bozze di annunci e sintesi, con attenzione a bias e decisione umana.</li>
        <li><strong style="color:#38bdf8;">Marketing:</strong> bozze di contenuti, sempre con verifica di fatti e brand.</li>
      </ul>`;

const questions: QuizQuestion[] = [
  {
    q: "Un caso d'uso solido dell'AI nel customer support e':",
    options: [
      { text: "Generare bozze di risposta e smistare i ticket, lasciando all'operatore l'invio finale", correct: true, feedback: "Esatto: l'AI velocizza bozze e triage sui grandi volumi, mentre l'operatore verifica e approva, mantenendo qualita' e responsabilita'." },
      { text: "Rispondere in autonomia totale a tutti i clienti senza alcun controllo", feedback: "L'autonomia totale senza supervisione rischia errori e tono inappropriato verso i clienti: serve revisione umana." },
      { text: "Cancellare i ticket che l'AI non capisce", feedback: "Eliminare cio' che il modello non comprende fa perdere richieste reali dei clienti." },
      { text: "Sostituire il numero di telefono con un QR code", feedback: "Non e' un uso dell'AI ne' un caso di supporto: e' un cambio di canale scollegato dal tema." },
    ],
  },
  {
    q: "In amministrazione, dove l'AI da' un beneficio tipico?",
    options: [
      { text: "Estrarre e organizzare dati da fatture e documenti, con controllo dei risultati", correct: true, feedback: "Corretto: l'estrazione di dati da documenti e' un classico, ad alto volume e ripetitivo. I numeri estratti vanno comunque verificati." },
      { text: "Decidere da sola quali fatture pagare e quali no", feedback: "Le decisioni di pagamento hanno impatto e responsabilita': vanno mantenute sotto controllo umano." },
      { text: "Inventare gli importi quando un documento e' illeggibile", feedback: "Mai far 'inventare' numeri: un dato dubbio va segnalato e verificato, non stimato a caso." },
      { text: "Eliminare l'obbligo di conservare i documenti", feedback: "L'AI non cambia gli obblighi di conservazione: e' un tema normativo, non di strumento." },
    ],
  },
  {
    q: "L'HR vuole usare l'AI per lo screening dei curricula. Qual e' l'avvertenza piu' importante?",
    options: [
      { text: "Attenzione ai bias: la decisione sulle persone deve restare umana e motivata", correct: true, feedback: "Esatto: lo screening tocca le persone e puo' amplificare bias. L'AI puo' assistere (sintesi, ordinamento), ma la decisione resta umana e giustificabile." },
      { text: "Nessuna: ci si puo' fidare ciecamente del punteggio dell'AI", feedback: "Affidarsi ciecamente e' rischioso: bias e errori possono produrre discriminazioni e scelte ingiuste." },
      { text: "Va bene scartare candidati senza poter spiegare il perche'", feedback: "Le decisioni sulle persone devono essere spiegabili e motivate, non delegate a una scatola nera." },
      { text: "L'unica cosa che conta e' la velocita'", feedback: "La velocita' non puo' venire prima di equita', conformita' e responsabilita' nelle decisioni sulle persone." },
    ],
  },
  {
    q: "Nel marketing l'AI produce velocemente una bozza di articolo con alcune statistiche. Cosa NON deve mancare?",
    options: [
      { text: "La verifica dei fatti e delle statistiche, e l'allineamento al tono del brand", correct: true, feedback: "Corretto: l'AI accelera la stesura, ma fatti e numeri vanno verificati (rischio hallucination) e il testo va allineato a voce e valori del brand." },
      { text: "Pubblicare subito, prima dei concorrenti, senza rileggere", feedback: "Pubblicare senza verifica espone a errori fattuali e danni di reputazione." },
      { text: "Inserire piu' statistiche possibile, vere o no", feedback: "Numeri non verificati minano la credibilita': la quantita' non vale piu' dell'accuratezza." },
      { text: "Affidare al modello anche la decisione sul budget pubblicitario", feedback: "Le decisioni di spesa restano scelte gestionali umane, non un compito da delegare alla bozza." },
    ],
  },
  {
    q: "Qual e' il filo conduttore corretto tra i casi d'uso AI nei vari reparti?",
    options: [
      { text: "L'AI assiste su compiti ripetitivi o ad alto volume, ma l'umano valida dove ci sono decisioni e responsabilita'", correct: true, feedback: "Esatto: il pattern vincente e' AI come acceleratore + human-in-the-loop sulle decisioni. Vale per supporto, HR, amministrazione e marketing." },
      { text: "L'AI deve sostituire integralmente ogni reparto", feedback: "L'obiettivo realistico e' potenziare le persone, non sostituirle ovunque: le decisioni critiche restano umane." },
      { text: "Ogni reparto deve usare un modello AI diverso per legge", feedback: "Non esiste un obbligo del genere: la scelta dipende dai casi d'uso e dalla governance, non da una legge sui modelli." },
      { text: "L'AI va usata solo se elimina completamente il lavoro umano", feedback: "Il valore c'e' anche quando l'AI affianca le persone: non serve eliminare il lavoro umano per giustificarla." },
    ],
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);
  const html = buildQuizPage("Casi d'uso dell'AI per reparto", intro, questions);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
