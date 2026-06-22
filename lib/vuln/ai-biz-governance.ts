import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { buildQuizPage, type QuizQuestion } from "../../api/vuln/_quiz-layout";

const intro = `
      <h2>Governance: usare l'AI in azienda in sicurezza</h2>
      <p>
        Quando l'AI entra in azienda servono <strong>regole chiare</strong>: dove finiscono i dati, quali strumenti
        sono ammessi, chi e' responsabile. Senza governance nasce la <strong>Shadow AI</strong> (tool usati di nascosto)
        e crescono i rischi GDPR. Una buona policy, formazione e una lista di strumenti approvati abilitano l'AI
        senza esporre l'organizzazione.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">Shadow AI:</strong> dipendenti che usano strumenti non approvati con dati aziendali.</li>
        <li><strong style="color:#38bdf8;">Dati e DPA:</strong> sapere se i dati vengono conservati o usati per addestrare i modelli.</li>
        <li><strong style="color:#38bdf8;">Data residency:</strong> per il GDPR conta dove (UE) vengono trattati i dati.</li>
        <li><strong style="color:#38bdf8;">Policy e formazione:</strong> strumenti approvati, regole d'uso, persone formate e responsabili definiti.</li>
      </ul>`;

const questions: QuizQuestion[] = [
  {
    q: "Cos'e' la 'Shadow AI' e perche' e' un rischio?",
    options: [
      { text: "L'uso di strumenti AI non approvati, spesso con dati aziendali, fuori dal controllo dell'azienda", correct: true, feedback: "Esatto: la Shadow AI sfugge alle policy e puo' esporre dati riservati. Si contrasta con strumenti approvati, regole chiare e formazione." },
      { text: "Un modello AI che funziona solo di notte", feedback: "Non c'entra con gli orari: e' l'uso non governato di strumenti AI da parte del personale." },
      { text: "Una tecnica per rendere l'AI piu' veloce", feedback: "Non e' una tecnica di performance: e' un problema di governance e rischio." },
      { text: "Un tipo di attacco informatico esterno", feedback: "Nasce dall'interno (uso non approvato), non e' un attacco esterno." },
    ],
  },
  {
    q: "Prima di adottare uno strumento AI per dati aziendali, quale informazione e' essenziale conoscere?",
    options: [
      { text: "Se i dati inviati vengono conservati o usati per addestrare il modello, e con quali garanzie (DPA)", correct: true, feedback: "Corretto: sapere cosa accade ai dati (conservazione, training, sub-fornitori) e avere un accordo sul trattamento (DPA) e' essenziale per la conformita'." },
      { text: "Quanti follower ha il fornitore sui social", feedback: "La popolarita' non dice nulla sul trattamento dei dati." },
      { text: "Se l'interfaccia e' disponibile in modalita' scura", feedback: "Dettaglio estetico irrilevante per la governance dei dati." },
      { text: "Il nome del CEO del fornitore", feedback: "Non e' rilevante: contano le garanzie contrattuali sul trattamento dei dati." },
    ],
  },
  {
    q: "Per un'azienda soggetta a GDPR, perche' conta dove vengono trattati i dati?",
    options: [
      { text: "Perche' il GDPR richiede garanzie sul trasferimento dei dati e la residenza UE semplifica la conformita'", correct: true, feedback: "Esatto: trattare i dati in UE (o con garanzie adeguate) facilita la conformita' GDPR ed e' spesso un requisito per dati personali." },
      { text: "Perche' i modelli europei sono sempre piu' intelligenti", feedback: "Non e' una questione di intelligenza del modello, ma di regole sul trattamento e trasferimento dei dati personali." },
      { text: "Non conta affatto dove vengono trattati i dati", feedback: "Conta eccome: il luogo di trattamento e i trasferimenti sono centrali nel GDPR." },
      { text: "Perche' all'estero l'AI costa di piu'", feedback: "Il tema e' la conformita' al trattamento dei dati, non il prezzo." },
    ],
  },
  {
    q: "Qual e' un elemento fondamentale di una policy aziendale sull'uso dell'AI?",
    options: [
      { text: "Una lista di strumenti approvati e regole chiare su quali dati si possono inserire", correct: true, feedback: "Corretto: definire strumenti ammessi e cosa si puo'/non si puo' inserire orienta i dipendenti e riduce la Shadow AI e i data leak." },
      { text: "Vietare del tutto l'AI a chiunque, senza eccezioni", feedback: "Il divieto totale spesso spinge verso la Shadow AI: meglio abilitare in modo sicuro con strumenti approvati." },
      { text: "Lasciare ciascuno libero di usare qualsiasi strumento con qualsiasi dato", feedback: "L'assenza di regole e' proprio cio' che genera rischi e Shadow AI." },
      { text: "Una policy che nessuno legge ne' comunica", feedback: "Una policy senza comunicazione e formazione non protegge: va resa nota e compresa." },
    ],
  },
  {
    q: "Un collega vuole incollare in un chatbot pubblico un elenco di dipendenti con dati personali per 'farlo riordinare'. Cosa gli dici?",
    options: [
      { text: "Di non farlo: usa uno strumento approvato per dati personali, altrimenti e' un rischio GDPR e di data leak", correct: true, feedback: "Esatto: dati personali in strumenti non approvati violano le policy e il GDPR. Va usato uno strumento con garanzie adeguate." },
      { text: "Va bene, basta che cancelli la chat dopo", feedback: "Cancellare la chat non annulla l'invio dei dati a un servizio non approvato: il rischio resta." },
      { text: "Va bene se aggiunge 'riservato' all'inizio del messaggio", feedback: "Un'etichetta nel testo non offre alcuna protezione legale o tecnica." },
      { text: "Va bene se lo fa fuori dall'orario di lavoro", feedback: "L'orario non cambia nulla: il problema e' il trattamento di dati personali su uno strumento non approvato." },
    ],
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);
  const html = buildQuizPage("Governance: usare l'AI in azienda in sicurezza", intro, questions);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
