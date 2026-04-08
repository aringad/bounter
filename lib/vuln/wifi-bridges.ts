import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";
import { wrapQuiz } from "../../api/vuln/_quiz-layout";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const body = `
    <div class="intro">
      <h2>Ponti Radio e Outdoor</h2>
      <p>
        Collegamenti radio punto-punto (PtP) e punto-multipunto (PtMP), zona di Fresnel,
        linea di vista, e considerazioni per installazioni outdoor. Fondamentale per collegare
        edifici o sedi remote senza cablaggio.
      </p>
      <ul style="margin-top:0.75rem;padding-left:1.25rem;color:#94a3b8;font-size:0.9rem;line-height:1.8;">
        <li><strong style="color:#38bdf8;">Punto-Punto (PtP):</strong> Due dispositivi con antenne direzionali, link dedicato tra due punti.</li>
        <li><strong style="color:#38bdf8;">Punto-Multipunto (PtMP):</strong> Una stazione base con antenna settoriale che serve piu' client.</li>
        <li><strong style="color:#38bdf8;">Zona di Fresnel:</strong> Area ellissoidale attorno al percorso radio che deve essere libera al 60% per un buon segnale.</li>
        <li><strong style="color:#38bdf8;">Line of Sight (LoS):</strong> Linea di vista diretta tra i due punti, essenziale per link a 5 GHz.</li>
        <li><strong style="color:#38bdf8;">Link Budget:</strong> Calcolo della potenza del segnale considerando TX, guadagno antenne, perdite e sensibilita' RX.</li>
      </ul>
    </div>

    <!-- Q1 -->
    <div class="question" id="q-1">
      <h3><span class="q-number">1.</span> Cos'e' la zona di Fresnel?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(1, 'a', 'c',
          '',
          'Sbagliato. La zona di Fresnel non e\\' l\\'area di copertura dell\\'antenna. E\\' l\\'area ellissoidale attorno al percorso radio che deve essere libera al 60% per una buona propagazione.')">
          <input type="radio" name="q1"> <span>L'area di copertura massima di un'antenna</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(1, 'b', 'c',
          '',
          'Sbagliato. La zona morta e\\' un concetto diverso. La zona di Fresnel e\\' l\\'area ellissoidale attorno al percorso radio che deve essere sgombra per evitare attenuazione del segnale.')">
          <input type="radio" name="q1"> <span>La zona morta dove il segnale non arriva</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(1, 'c', 'c',
          'Corretto! La zona di Fresnel e\\' l\\'area ellissoidale attorno alla linea diretta tra trasmettitore e ricevitore. Almeno il 60% di quest\\'area deve essere libera da ostacoli per garantire una buona propagazione del segnale senza attenuazione.',
          '')">
          <input type="radio" name="q1"> <span>Area ellissoidale attorno al percorso radio che deve essere libera al 60% per un buon segnale</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(1, 'd', 'c',
          '',
          'Sbagliato. Questo descrive una zona di interferenza generica. La zona di Fresnel e\\' l\\'area specifica attorno al percorso radio che deve essere sgombra al 60% per una buona propagazione.')">
          <input type="radio" name="q1"> <span>La zona di interferenza tra due access point vicini</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q2 -->
    <div class="question" id="q-2">
      <h3><span class="q-number">2.</span> Qual e' la differenza chiave tra PtP e PtMP?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(2, 'a', 'b',
          '',
          'Sbagliato. Entrambi possono operare su varie frequenze. La differenza e\\' nell\\'architettura: PtP usa due dispositivi con antenne direzionali, PtMP ha una base con antenna settoriale che serve piu\\' client.')">
          <input type="radio" name="q2"> <span>PtP usa 5 GHz, PtMP usa 2.4 GHz</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(2, 'b', 'b',
          'Corretto! PtP (punto-punto) usa due dispositivi con antenne direzionali per un link dedicato ad alte prestazioni. PtMP (punto-multipunto) usa una stazione base con antenna settoriale che serve piu\\' client simultaneamente, condividendo la banda.',
          '')">
          <input type="radio" name="q2"> <span>PtP = due dispositivi con antenne direzionali, link dedicato; PtMP = base con antenna settoriale, piu' client</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(2, 'c', 'b',
          '',
          'Sbagliato. Non e\\' una questione di distanza massima. La differenza e\\' architetturale: PtP collega due punti con link dedicato, PtMP collega una base a piu\\' client.')">
          <input type="radio" name="q2"> <span>PtP funziona solo fino a 1 km, PtMP fino a 10 km</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(2, 'd', 'b',
          '',
          'Sbagliato. Entrambi possono usare crittografia. La differenza e\\' nella topologia: PtP e\\' un link dedicato tra due punti, PtMP serve piu\\' client da una stazione base.')">
          <input type="radio" name="q2"> <span>PtP e' criptato, PtMP no</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q3 -->
    <div class="question" id="q-3">
      <h3><span class="q-number">3.</span> Quale frequenza e' piu' comunemente usata per i ponti radio outdoor?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(3, 'a', 'b',
          '',
          'Sbagliato. La 2.4 GHz ha piu\\' interferenza e meno banda disponibile. Per i ponti radio outdoor si usa tipicamente la 5.8 GHz per le migliori prestazioni.')">
          <input type="radio" name="q3"> <span>2.4 GHz</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(3, 'b', 'b',
          'Corretto! La 5.8 GHz e\\' la frequenza piu\\' usata per i ponti radio outdoor. E\\' una banda ISM libera (non serve licenza), offre buona portata con antenne direzionali, canali ampi e meno interferenza rispetto alla 2.4 GHz.',
          '')">
          <input type="radio" name="q3"> <span>5.8 GHz - banda ISM libera, buona portata</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(3, 'c', 'b',
          '',
          'Sbagliato. La 900 MHz si usa per link a lunghissima distanza con bassa banda, ma non e\\' la scelta piu\\' comune. La 5.8 GHz offre il miglior compromesso tra portata e throughput.')">
          <input type="radio" name="q3"> <span>900 MHz</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(3, 'd', 'b',
          '',
          'Sbagliato. La 60 GHz (WiGig) ha portata molto limitata e richiede linea di vista perfetta. Per i ponti radio outdoor si usa la 5.8 GHz come standard.')">
          <input type="radio" name="q3"> <span>60 GHz</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q4 -->
    <div class="question" id="q-4">
      <h3><span class="q-number">4.</span> Un ponte radio funziona bene in inverno ma peggiora in estate. Qual e' la causa probabile?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(4, 'a', 'c',
          '',
          'Sbagliato. Il calore non influisce significativamente sulle prestazioni radio a queste frequenze. La causa e\\' la vegetazione: alberi con foglie in estate attenuano il segnale di 3-20 dB.')">
          <input type="radio" name="q4"> <span>Il calore estivo degrada i componenti elettronici</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(4, 'b', 'c',
          '',
          'Sbagliato. L\\'umidita\\' puo\\' avere un effetto minore, ma la causa principale di degrado stagionale e\\' la vegetazione: le foglie sugli alberi attenuano il segnale di 3-20 dB.')">
          <input type="radio" name="q4"> <span>L'umidita' estiva assorbe il segnale radio</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(4, 'c', 'c',
          'Corretto! Alberi e vegetazione con foglie in estate possono attenuare il segnale di 3-20 dB, ostruendo la zona di Fresnel. In inverno, senza foglie, il segnale passa meglio. E\\' essenziale verificare la linea di vista anche nella stagione con piu\\' vegetazione.',
          '')">
          <input type="radio" name="q4"> <span>Alberi e vegetazione con foglie attenuano il segnale di 3-20 dB</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(4, 'd', 'c',
          '',
          'Sbagliato. Piu\\' utenti potrebbero saturare la banda, ma il pattern stagionale inverno/estate indica chiaramente un problema di propagazione legato alla vegetazione.')">
          <input type="radio" name="q4"> <span>Piu' utenti connessi in estate sovraccaricano il link</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q5 -->
    <div class="question" id="q-5">
      <h3><span class="q-number">5.</span> Quale tipo di antenna si usa per un ponte radio punto-punto?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(5, 'a', 'b',
          '',
          'Sbagliato. L\\'antenna omnidirezionale irradia in tutte le direzioni, sprecando energia. Per un PtP serve un\\'antenna direzionale che concentra il segnale verso il punto remoto.')">
          <input type="radio" name="q5"> <span>Antenna omnidirezionale</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(5, 'b', 'b',
          'Corretto! Per un link punto-punto si usa un\\'antenna direzionale (dish/parabolica) che concentra tutta l\\'energia radio in una direzione, massimizzando la portata e il guadagno verso il punto remoto.',
          '')">
          <input type="radio" name="q5"> <span>Antenna direzionale/parabolica - concentra il segnale in una direzione per massima portata</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(5, 'c', 'b',
          '',
          'Sbagliato. L\\'antenna settoriale copre un arco di 60-120 gradi ed e\\' usata per PtMP. Per un link PtP serve un\\'antenna direzionale/parabolica con fascio stretto.')">
          <input type="radio" name="q5"> <span>Antenna settoriale a 120 gradi</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(5, 'd', 'b',
          '',
          'Sbagliato. L\\'antenna patch e\\' semi-direzionale con guadagno moderato, usata per indoor o PtMP a breve distanza. Per un PtP outdoor serve un\\'antenna direzionale/parabolica.')">
          <input type="radio" name="q5"> <span>Antenna patch</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <!-- Q6 -->
    <div class="question" id="q-6">
      <h3><span class="q-number">6.</span> Per link oltre 10 km, quale fattore aggiuntivo va considerato?</h3>
      <div class="options">
        <div class="option" data-value="a" onclick="QuizEngine.check(6, 'a', 'b',
          '',
          'Sbagliato. La latenza non e\\' il problema principale a 10 km (il segnale viaggia alla velocita\\' della luce). Il fattore critico e\\' la curvatura terrestre che alza l\\'orizzonte effettivo.')">
          <input type="radio" name="q6"> <span>La latenza diventa troppo alta</span>
        </div>
        <div class="option" data-value="b" onclick="QuizEngine.check(6, 'b', 'b',
          'Corretto! A distanze superiori a 10 km, la curvatura terrestre diventa un fattore significativo: aggiunge circa 13 metri a 10 km, abbassando l\\'orizzonte effettivo. Le antenne devono essere montate abbastanza in alto da compensare questa curvatura.',
          '')">
          <input type="radio" name="q6"> <span>La curvatura terrestre - aggiunge ~13m a 10 km, abbassando l'orizzonte effettivo</span>
        </div>
        <div class="option" data-value="c" onclick="QuizEngine.check(6, 'c', 'b',
          '',
          'Sbagliato. La frequenza e\\' determinata dall\\'apparato, non dalla distanza. Il fattore critico oltre 10 km e\\' la curvatura terrestre che richiede antenne piu\\' alte.')">
          <input type="radio" name="q6"> <span>Bisogna cambiare frequenza da 5 GHz a 2.4 GHz</span>
        </div>
        <div class="option" data-value="d" onclick="QuizEngine.check(6, 'd', 'b',
          '',
          'Sbagliato. La licenza puo\\' essere necessaria per potenze elevate, ma il fattore fisico da considerare oltre 10 km e\\' la curvatura terrestre.')">
          <input type="radio" name="q6"> <span>Serve una licenza speciale per trasmettere</span>
        </div>
      </div>
      <div class="feedback"></div>
    </div>

    <div class="result-box" id="result-box">
      <h2>Quiz completato!</h2>
      <div class="big-score"></div>
      <div class="message"></div>
    </div>

    <div class="score-bar">
      <div><span class="score" id="score">0 / 6</span></div>
      <div class="progress" id="progress">0 di 6 completate</div>
    </div>

    <script>QuizEngine.init(6);</script>
  `;

  const html = wrapQuiz("Ponti Radio e Outdoor", body);
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
