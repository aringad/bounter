import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { buildQuizPage, type QuizQuestion } from "../../api/vuln/_quiz-layout";

const intro = `
      <h2>Build vs Buy: scegliere la soluzione AI</h2>
      <p>
        Davanti a un bisogno di AI le opzioni sono molte: usare un <strong>servizio SaaS</strong> pronto, adottare un
        <strong>modello open-source self-hosted</strong>, o costruire una soluzione su misura. La scelta dipende da
        <strong>tempi, controllo dei dati, costi a regime e quanto quella funzione e' davvero distintiva</strong>
        per l'azienda.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">SaaS:</strong> veloce da avviare, poca gestione, ma dipendi dal fornitore e dai suoi termini.</li>
        <li><strong style="color:#38bdf8;">Self-hosted / open-source:</strong> piu' controllo su dati e costi a scala, ma richiede competenze e infrastruttura.</li>
        <li><strong style="color:#38bdf8;">Build:</strong> ha senso solo se la funzione e' core e differenziante; altrimenti conviene comprare.</li>
        <li><strong style="color:#38bdf8;">Costi:</strong> valuta consumo (API a token) vs licenza vs gestione del self-hosting.</li>
      </ul>`;

const questions: QuizQuestion[] = [
  {
    q: "Una PMI vuole un assistente AI per le risposte ai clienti, in fretta e senza team tecnico interno. Scelta piu' sensata?",
    options: [
      { text: "Adottare un servizio SaaS gia' pronto, con garanzie adeguate sui dati", correct: true, feedback: "Esatto: senza competenze interne e con urgenza, il SaaS minimizza il time-to-value e la gestione. Verifica solo i termini sul trattamento dati." },
      { text: "Costruire un modello proprietario da zero", feedback: "Costruire da zero richiede team, tempi e budget enormi: ingiustificato per una funzione non distintiva in una PMI." },
      { text: "Self-hostare un modello senza avere chi lo gestisca", feedback: "Il self-hosting senza competenze interne diventa un costo nascosto e un rischio operativo." },
      { text: "Rinunciare all'AI perche' troppo complessa", feedback: "Proprio il SaaS esiste per rendere accessibile l'AI anche senza team tecnico." },
    ],
  },
  {
    q: "Un'azienda tratta dati molto sensibili e ha vincoli stringenti di residenza dei dati in UE. Cosa pesa di piu' nella scelta?",
    options: [
      { text: "Il controllo su dove e come vengono trattati i dati (self-hosting o fornitore con garanzie e region UE)", correct: true, feedback: "Corretto: con dati sensibili e vincoli di data residency, il controllo sul trattamento (region UE, self-hosting, DPA) diventa il criterio dominante." },
      { text: "Solo quale modello ha il punteggio piu' alto nei benchmark", feedback: "Le prestazioni contano, ma con dati sensibili la conformita' e il controllo dei dati vengono prima." },
      { text: "Il colore dell'interfaccia utente", feedback: "Irrilevante rispetto ai vincoli di trattamento dei dati." },
      { text: "La popolarita' del fornitore sui social", feedback: "La notorieta' non garantisce conformita' GDPR ne' data residency." },
    ],
  },
  {
    q: "Qual e' una differenza chiave tra un modello closed (SaaS) e uno open-source self-hosted?",
    options: [
      { text: "Il SaaS offre semplicita' e aggiornamenti gestiti; il self-hosted da' piu' controllo su dati e costi a scala", correct: true, feedback: "Esatto: e' il classico compromesso tra comodita'/velocita' (SaaS) e controllo/personalizzazione (self-hosted), ciascuno con i suoi costi." },
      { text: "Il modello open-source e' sempre piu' accurato di qualunque modello closed", feedback: "Non e' una regola: l'accuratezza varia per modello e compito, non per il solo fatto di essere open o closed." },
      { text: "Il SaaS non costa mai nulla", feedback: "Il SaaS ha costi (a consumo o a licenza): la differenza e' nel modello di costo e nella gestione, non nella gratuita'." },
      { text: "Il self-hosted non richiede alcuna competenza", feedback: "Al contrario: self-hostare richiede infrastruttura e competenze per deploy, sicurezza e aggiornamenti." },
    ],
  },
  {
    q: "Stai stimando i costi. Per un volume di richieste basso e variabile, quale modello di costo e' spesso piu' conveniente?",
    options: [
      { text: "Pagamento a consumo (API a token), che scala con l'uso reale", correct: true, feedback: "Corretto: con volumi bassi o variabili, pagare a consumo evita di sostenere costi fissi di infrastruttura sottoutilizzata." },
      { text: "Acquistare e gestire server dedicati always-on", feedback: "Per volumi bassi, l'infrastruttura always-on resta sottoutilizzata e costa piu' del necessario." },
      { text: "Una licenza enterprise massima a prescindere dall'uso", feedback: "Sovradimensionare la licenza per un volume basso e' spreco: meglio pagare in proporzione all'uso." },
      { text: "Non stimare i costi, tanto l'AI 'si ripaga da sola'", feedback: "Senza stima dei costi e ROI il progetto rischia di sfuggire di mano economicamente." },
    ],
  },
  {
    q: "Quando ha davvero senso costruire (build) una soluzione AI su misura invece di comprarla?",
    options: [
      { text: "Quando quella funzione e' core e differenziante per il business e nessun prodotto pronto la copre", correct: true, feedback: "Esatto: il build si giustifica per cio' che e' strategico e distintivo. Per esigenze comuni, comprare e' piu' rapido ed economico." },
      { text: "Sempre, perche' fatto in casa e' per definizione migliore", feedback: "'Fatto in casa' non e' automaticamente migliore: spesso e' piu' lento e costoso che adottare una soluzione esistente." },
      { text: "Mai, perche' costruire e' sempre impossibile", feedback: "Costruire e' possibile e a volte necessario, quando la funzione e' core e differenziante." },
      { text: "Solo se l'AD lo ha visto fare a un concorrente", feedback: "Imitare senza analisi di valore non e' un criterio: conta se la funzione e' strategica per te." },
    ],
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);
  const html = buildQuizPage("Build vs Buy: scegliere la soluzione AI", intro, questions);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
