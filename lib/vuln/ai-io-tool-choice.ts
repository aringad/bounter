import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { buildQuizPage, type QuizQuestion } from "../../api/vuln/_quiz-layout";

const intro = `
      <h2>Quale strumento per quale compito</h2>
      <p>
        Saper usare l'AI sul lavoro significa soprattutto <strong>scegliere lo strumento e l'approccio giusti</strong>
        per ogni compito — e riconoscere quando l'AI <strong>non</strong> serve. Questa sfida ti mette davanti a
        situazioni d'ufficio reali: per ognuna devi capire qual e' la soluzione piu' sensata.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">Documenti tuoi:</strong> per lavorare su file specifici servono strumenti che li leggano come fonte (es. NotebookLM o un assistente con caricamento documenti).</li>
        <li><strong style="color:#38bdf8;">Ripetitivita':</strong> un compito che torna ogni settimana si risolve salvando il contesto (Progetto/Skill/prompt riutilizzabile), non riscrivendo tutto ogni volta.</li>
        <li><strong style="color:#38bdf8;">Dati sensibili:</strong> usa solo strumenti aziendali approvati; mai incollare dati personali o riservati in servizi pubblici.</li>
      </ul>`;

const questions: QuizQuestion[] = [
  {
    q: "Devi riassumere un PDF tecnico di 80 pagine e poi fargli domande puntuali sul contenuto. Qual e' l'approccio migliore?",
    options: [
      { text: "Uno strumento che carichi il documento come fonte (es. NotebookLM o un assistente con upload file)", correct: true, feedback: "E' lo scenario ideale per un assistente ancorato ai documenti: risponde basandosi sul PDF, spesso con citazioni, riducendo il rischio di risposte inventate." },
      { text: "Chiedere a un chatbot generico cosa pensa di solito ci sia in un PDF del genere", feedback: "Senza il documento il modello tira a indovinare sul contenuto. Devi fornirgli il testo come fonte, altrimenti risponde su generiche aspettative." },
      { text: "Incollare le 80 pagine, una alla volta, sperando che le ricordi tutte", feedback: "Inefficiente e poco affidabile: meglio caricare il file in uno strumento pensato per usarlo come fonte e interrogarlo." },
      { text: "Tradurre il PDF in inglese e poi leggerlo a mano", feedback: "La traduzione non risolve il problema del riassunto e delle domande mirate." },
    ],
  },
  {
    q: "Ogni lunedi' devi produrre lo stesso tipo di report, con la stessa struttura e lo stesso tono. Come imposti il lavoro?",
    options: [
      { text: "Creo un Progetto / Skill / prompt salvato con le istruzioni e il formato, da riusare ogni settimana", correct: true, feedback: "Esatto: quando il contesto si ripete, lo si impacchetta una volta (Progetto, Skill o prompt salvato) per avere coerenza e risparmiare tempo." },
      { text: "Riscrivo da zero il prompt ogni lunedi'", feedback: "Spreco di tempo e risultati incoerenti. Un compito ricorrente va standardizzato in un contesto riutilizzabile." },
      { text: "Chiedo a un collega di rifarlo a mano ogni volta", feedback: "Proprio i compiti ripetitivi e ben definiti sono quelli dove conviene impostare un flusso riutilizzabile con l'AI." },
      { text: "Cambio strumento AI ogni settimana per provarli tutti", feedback: "La coerenza del risultato conta piu' della novita': serve un contesto stabile e riutilizzabile." },
    ],
  },
  {
    q: "Devi analizzare un foglio con dati anagrafici di clienti reali. Cosa fai?",
    options: [
      { text: "Uso solo uno strumento aziendale approvato, con garanzie sul trattamento dei dati", correct: true, feedback: "Corretto: i dati personali vanno trattati solo in strumenti approvati dall'azienda, con DPA e garanzie GDPR (vedi anche la sfida 'AI e Privacy')." },
      { text: "Incollo tutto in un chatbot pubblico gratuito per fare prima", feedback: "Mai incollare dati personali o riservati in servizi pubblici: rischi data leakage e violazioni GDPR." },
      { text: "Li carico su un servizio a caso purche' risponda in italiano", feedback: "La lingua non c'entra: conta dove finiscono i dati e con quali garanzie. Usa solo strumenti approvati." },
      { text: "Pubblico un estratto su un forum per chiedere aiuto", feedback: "Esporre dati di clienti all'esterno e' una violazione grave. Va evitato in modo assoluto." },
    ],
  },
  {
    q: "In quale di questi casi NON ha senso usare l'AI generativa?",
    options: [
      { text: "Sommare una colonna di numeri e ottenere un totale esatto e verificabile", correct: true, feedback: "Giusto: per calcoli esatti usa strumenti deterministici (foglio di calcolo). Un LLM puo' sbagliare l'aritmetica perche' genera testo probabile, non calcola con certezza." },
      { text: "Scrivere una prima bozza di email da rivedere", feedback: "Qui l'AI e' utile: produce una bozza che poi un umano rifinisce." },
      { text: "Riformulare un paragrafo in tono piu' formale", feedback: "Compito linguistico tipico, adatto all'AI." },
      { text: "Suggerire una scaletta per una presentazione", feedback: "Brainstorming e strutturazione sono usi appropriati dell'AI." },
    ],
  },
  {
    q: "Devi scrivere una formula complessa in un foglio di calcolo ma non ricordi la sintassi. Approccio migliore?",
    options: [
      { text: "Descrivo all'AI l'obiettivo e i dati, mi faccio dare la formula, poi la verifico sul foglio", correct: true, feedback: "Ottimo: l'AI e' brava a tradurre l'intento in sintassi; tu mantieni la verifica del risultato sui dati reali." },
      { text: "Chiedo all'AI il totale finale e lo scrivo a mano senza la formula", feedback: "Cosi' perdi la verificabilita' e il ricalcolo automatico: meglio farti dare la formula e applicarla." },
      { text: "Aspetto che qualcuno passi a dirmela", feedback: "E' esattamente un caso dove l'AI fa risparmiare tempo, descrivendo l'obiettivo." },
      { text: "Provo formule a caso finche' una non da' un numero", feedback: "Inefficiente e rischioso: descrivi l'obiettivo all'AI e verifica il risultato." },
    ],
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);
  const html = buildQuizPage("Quale strumento per quale compito", intro, questions);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
