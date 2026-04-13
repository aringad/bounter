import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>UEFI vs BIOS Boot Simulator</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{
    background:#0f172a;
    font-family:'Segoe UI',Tahoma,sans-serif;
    color:#e2e8f0;
    min-height:100vh;
    padding:20px;
  }
  .container{max-width:1200px;margin:0 auto;}
  h1{
    text-align:center;
    color:#5eead4;
    margin-bottom:8px;
    font-size:28px;
  }
  .subtitle{
    text-align:center;
    color:#94a3b8;
    margin-bottom:24px;
    font-size:14px;
  }
  .columns{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:20px;
  }
  @media (max-width:768px){
    .columns{grid-template-columns:1fr;}
  }
  .col{
    background:#1e293b;
    border:1px solid #334155;
    border-radius:10px;
    padding:18px;
  }
  .col h2{
    color:#38bdf8;
    margin-bottom:14px;
    font-size:20px;
    text-align:center;
    padding-bottom:10px;
    border-bottom:2px solid #334155;
  }
  .col.uefi h2{color:#5eead4;}
  .col.bios h2{color:#fbbf24;}
  .step{
    background:#0f172a;
    border:1px solid #475569;
    border-radius:8px;
    padding:10px 12px;
    margin-bottom:8px;
    display:flex;
    align-items:center;
    gap:10px;
    transition:all .2s;
  }
  .step.correct{
    border-color:#22c55e;
    background:#052e16;
  }
  .step.wrong{
    border-color:#ef4444;
    background:#450a0a;
  }
  .step .num{
    background:#334155;
    color:#e2e8f0;
    width:26px;height:26px;
    border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    font-weight:bold;
    font-size:13px;
    flex-shrink:0;
  }
  .step .text{
    flex:1;
    font-size:13px;
  }
  .step .ctrl{
    display:flex;flex-direction:column;gap:2px;
  }
  .step button{
    background:#475569;
    color:#fff;
    border:none;
    border-radius:4px;
    width:24px;height:18px;
    cursor:pointer;
    font-size:11px;
    line-height:1;
  }
  .step button:hover{background:#5eead4;color:#0f172a;}
  .step button:disabled{opacity:.3;cursor:not-allowed;}
  .actions{
    text-align:center;
    margin-top:24px;
  }
  .btn{
    background:#0ea5e9;
    color:#fff;
    border:none;
    padding:12px 28px;
    border-radius:8px;
    font-size:15px;
    cursor:pointer;
    font-weight:600;
    margin:0 6px;
    transition:all .2s;
  }
  .btn:hover{background:#0284c7;transform:translateY(-1px);}
  .btn.success{background:#22c55e;}
  .btn.success:hover{background:#16a34a;}
  .msg{
    margin-top:18px;
    padding:14px;
    border-radius:8px;
    text-align:center;
    font-weight:500;
    display:none;
  }
  .msg.show{display:block;}
  .msg.ok{background:#052e16;border:1px solid #22c55e;color:#86efac;}
  .msg.err{background:#450a0a;border:1px solid #ef4444;color:#fca5a5;}

  /* Quiz */
  #quiz{display:none;}
  .q-card{
    background:#1e293b;
    border:1px solid #334155;
    border-radius:10px;
    padding:24px;
    margin-bottom:20px;
  }
  .q-num{
    color:#5eead4;
    font-size:13px;
    font-weight:600;
    margin-bottom:8px;
    letter-spacing:1px;
  }
  .q-text{
    font-size:18px;
    margin-bottom:18px;
    line-height:1.5;
  }
  .opt{
    display:block;
    width:100%;
    background:#0f172a;
    border:1px solid #475569;
    color:#e2e8f0;
    padding:12px 16px;
    border-radius:8px;
    margin-bottom:8px;
    cursor:pointer;
    text-align:left;
    font-size:14px;
    transition:all .15s;
    font-family:inherit;
  }
  .opt:hover:not(:disabled){border-color:#5eead4;background:#1e293b;}
  .opt:disabled{cursor:default;}
  .opt.ok{border-color:#22c55e;background:#052e16;color:#86efac;}
  .opt.no{border-color:#ef4444;background:#450a0a;color:#fca5a5;}
  .feedback{
    margin-top:14px;
    padding:14px;
    border-radius:8px;
    font-size:14px;
    line-height:1.5;
    display:none;
  }
  .feedback.show{display:block;}
  .feedback.ok{background:#052e16;border:1px solid #22c55e;color:#bbf7d0;}
  .feedback.no{background:#450a0a;border:1px solid #ef4444;color:#fecaca;}
  .feedback .ico{font-weight:bold;margin-right:6px;}
  .next-btn{
    margin-top:14px;
    background:#5eead4;
    color:#0f172a;
    border:none;
    padding:10px 22px;
    border-radius:6px;
    font-weight:600;
    cursor:pointer;
    display:none;
  }
  .next-btn.show{display:inline-block;}
  .progress{
    position:fixed;
    bottom:0;left:0;right:0;
    height:6px;
    background:#1e293b;
    z-index:100;
  }
  .progress-bar{
    height:100%;
    background:linear-gradient(90deg,#5eead4,#38bdf8);
    width:0%;
    transition:width .3s;
  }
  #result{
    display:none;
    text-align:center;
    background:#1e293b;
    border:2px solid #5eead4;
    border-radius:12px;
    padding:32px;
  }
  #result h2{color:#5eead4;font-size:28px;margin-bottom:12px;}
  #result .score{font-size:48px;font-weight:bold;color:#fff;margin:16px 0;}
  #result .perf{font-size:16px;color:#cbd5e1;}
</style>
</head>
<body>
<div class="container">
  <h1>Sequenza di Boot: UEFI vs BIOS</h1>
  <p class="subtitle">Trascina o riordina i passi con le frecce, poi clicca "Verifica"</p>

  <div id="sim">
    <div class="columns">
      <div class="col uefi">
        <h2>UEFI Boot</h2>
        <div id="uefi-list"></div>
      </div>
      <div class="col bios">
        <h2>BIOS Boot (Legacy)</h2>
        <div id="bios-list"></div>
      </div>
    </div>
    <div class="actions">
      <button class="btn" onclick="verify()">Verifica</button>
      <button class="btn" onclick="reset()" style="background:#475569;">Mescola di nuovo</button>
    </div>
    <div id="msg" class="msg"></div>
    <div class="actions" id="continue-wrap" style="display:none;">
      <button class="btn success" onclick="startQuiz()">Continua col quiz &rarr;</button>
    </div>
  </div>

  <div id="quiz"></div>
  <div id="result">
    <h2>Quiz Completato!</h2>
    <div class="score" id="score-val"></div>
    <div class="perf" id="perf-msg"></div>
  </div>
</div>
<div class="progress"><div class="progress-bar" id="pbar"></div></div>

<script>
const UEFI = [
  "POST (Power-On Self Test)",
  "Avvio UEFI Firmware",
  "Ricerca info boot in NVRAM",
  "Avvio Boot Manager (bootmgfw.efi)",
  "Lettura file BCD",
  "Avvio Boot Loader (winload.efi)",
  "Caricamento kernel SO"
];
const BIOS = [
  "POST (Power-On Self Test)",
  "Ricerca dispositivo di boot",
  "Caricamento MBR in memoria",
  "Ricerca partizione attiva",
  "Avvio Boot Manager (bootmgr)",
  "Lettura file BCD",
  "Avvio Boot Loader (winload.exe)"
];

let uefiOrder = [];
let biosOrder = [];

function shuffle(arr){
  const a = [...arr];
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  // ensure not already correct
  if(a.every((v,i)=>v===arr[i])){[a[0],a[1]]=[a[1],a[0]];}
  return a;
}

function render(listId, order, prefix){
  const el = document.getElementById(listId);
  el.innerHTML = "";
  order.forEach((step, idx)=>{
    const div = document.createElement("div");
    div.className = "step";
    div.id = prefix+"-"+idx;
    div.innerHTML = \`
      <div class="num">\${idx+1}</div>
      <div class="text">\${step}</div>
      <div class="ctrl">
        <button onclick="move('\${prefix}',\${idx},-1)" \${idx===0?'disabled':''}>&uarr;</button>
        <button onclick="move('\${prefix}',\${idx},1)" \${idx===order.length-1?'disabled':''}>&darr;</button>
      </div>
    \`;
    el.appendChild(div);
  });
}

function move(prefix, idx, dir){
  const order = prefix==="uefi" ? uefiOrder : biosOrder;
  const newIdx = idx+dir;
  if(newIdx<0 || newIdx>=order.length) return;
  [order[idx], order[newIdx]] = [order[newIdx], order[idx]];
  render(prefix+"-list", order, prefix);
  document.getElementById("msg").classList.remove("show");
}

function verify(){
  let allOk = true;
  uefiOrder.forEach((v,i)=>{
    const el = document.getElementById("uefi-"+i);
    el.classList.remove("correct","wrong");
    if(v===UEFI[i]) el.classList.add("correct");
    else { el.classList.add("wrong"); allOk=false; }
  });
  biosOrder.forEach((v,i)=>{
    const el = document.getElementById("bios-"+i);
    el.classList.remove("correct","wrong");
    if(v===BIOS[i]) el.classList.add("correct");
    else { el.classList.add("wrong"); allOk=false; }
  });
  const msg = document.getElementById("msg");
  msg.classList.add("show");
  if(allOk){
    msg.className = "msg show ok";
    msg.textContent = "Perfetto! Entrambe le sequenze sono corrette.";
    document.getElementById("continue-wrap").style.display = "block";
  } else {
    msg.className = "msg show err";
    msg.textContent = "Alcuni passi non sono al posto giusto. Controlla quelli evidenziati in rosso.";
  }
}

function reset(){
  uefiOrder = shuffle(UEFI);
  biosOrder = shuffle(BIOS);
  render("uefi-list", uefiOrder, "uefi");
  render("bios-list", biosOrder, "bios");
  document.getElementById("msg").classList.remove("show");
  document.getElementById("continue-wrap").style.display = "none";
}

// Init
reset();

// QUIZ
const QUESTIONS = [
  {
    q: "Quale vantaggio principale offre UEFI rispetto al BIOS tradizionale?",
    opts: [
      "Consuma meno energia elettrica",
      "Permette il boot da dischi superiori a 2 TiB grazie a GPT, offre Secure Boot, interfaccia grafica e avvio più rapido",
      "Ha un prezzo inferiore",
      "Richiede meno RAM per funzionare"
    ],
    correct: 1,
    okFb: "Esatto. UEFI supera i limiti del BIOS legacy: gestisce dischi grandi tramite GPT, offre Secure Boot per integrità del firmware, una shell/UI moderna e tempi di avvio ridotti.",
    noFb: "Non è corretto. Il vero vantaggio di UEFI è tecnico: supporto a GPT (>2 TiB), Secure Boot, interfaccia grafica e boot più veloce — non legato a costi o consumi."
  },
  {
    q: "Qual è la differenza principale tra MBR e GPT?",
    opts: [
      "MBR supporta max 4 partizioni primarie e dischi fino a 2 TiB; GPT supporta fino a 128 partizioni e dischi fino a 8 ZiB con backup secondario",
      "MBR è più recente di GPT",
      "GPT funziona solo su Mac",
      "Non ci sono differenze sostanziali"
    ],
    correct: 0,
    okFb: "Corretto. MBR è limitato (4 partizioni primarie, 2 TiB); GPT è moderno, supporta fino a 128 partizioni, dischi enormi e mantiene una copia di backup della tabella in coda al disco.",
    noFb: "Errato. GPT (GUID Partition Table) è il successore di MBR: rimuove i limiti delle 4 partizioni primarie e dei 2 TiB, ed è multi-piattaforma."
  },
  {
    q: "Cos'è il BCD (Boot Configuration Data) in Windows?",
    opts: [
      "Un file di testo modificabile con Notepad",
      "Un tipo di processore",
      "Un archivio binario che contiene la configurazione di avvio, sostituisce il vecchio boot.ini dalla Vista in poi e si modifica con BCDEdit",
      "Il nome del bootloader Linux"
    ],
    correct: 2,
    okFb: "Esatto. Il BCD è un database binario (formato registry hive) introdotto con Windows Vista per sostituire boot.ini. Si edita con bcdedit.exe o tool grafici come EasyBCD.",
    noFb: "Non corretto. Il BCD è un archivio binario, non un file di testo: contiene le voci di boot di Windows e si modifica con il comando BCDEdit."
  },
  {
    q: "Perché GPT include un \\\"Protective MBR\\\"?",
    opts: [
      "Per criptare i dati",
      "Per garantire compatibilità con tool legacy basati su BIOS/MBR ed evitare che scrivano sul disco GPT pensando sia non partizionato",
      "Per velocizzare il boot",
      "Per contenere il sistema operativo"
    ],
    correct: 1,
    okFb: "Esatto. Il Protective MBR occupa il settore 0 e dichiara una singola partizione di tipo 0xEE che copre tutto il disco: i tool legacy lo vedono come 'usato' e non lo sovrascrivono.",
    noFb: "Errato. Il Protective MBR non cripta né accelera nulla: è un meccanismo di compatibilità per impedire che software che non conosce GPT corrompa la tabella delle partizioni."
  },
  {
    q: "A cosa serve Secure Boot?",
    opts: [
      "A velocizzare l'avvio del sistema",
      "A criptare l'intero disco",
      "A impedire l'esecuzione di bootloader e driver non firmati digitalmente, proteggendo da rootkit e malware pre-boot",
      "A connettersi a Internet durante il boot"
    ],
    correct: 2,
    okFb: "Corretto. Secure Boot verifica le firme digitali di firmware, bootloader e driver tramite chiavi memorizzate nella NVRAM (PK, KEK, db, dbx), bloccando codice non autorizzato.",
    noFb: "Non corretto. Per la cifratura del disco esiste BitLocker. Secure Boot serve a verificare l'autenticità del codice eseguito durante il boot, contro rootkit e bootkit."
  },
  {
    q: "In un sistema UEFI a 64 bit, quale versione di Windows posso installare in modalità UEFI?",
    opts: [
      "Solo versioni a 64 bit di Windows",
      "Qualsiasi versione, anche a 32 bit",
      "Solo Windows XP",
      "Solo Linux"
    ],
    correct: 0,
    okFb: "Esatto. UEFI x64 richiede un OS x64: il bootloader (bootmgfw.efi) deve avere la stessa architettura del firmware. Per installare Windows a 32 bit serve un firmware UEFI a 32 bit o modalità Legacy/CSM.",
    noFb: "Errato. La modalità UEFI x64 non avvia bootloader a 32 bit: l'architettura del firmware e dell'OS devono coincidere."
  }
];

let qIdx = 0;
let score = 0;

function startQuiz(){
  document.getElementById("sim").style.display = "none";
  document.getElementById("quiz").style.display = "block";
  qIdx = 0; score = 0;
  showQuestion();
}

function showQuestion(){
  const q = QUESTIONS[qIdx];
  const quiz = document.getElementById("quiz");
  quiz.innerHTML = \`
    <div class="q-card">
      <div class="q-num">DOMANDA \${qIdx+1} DI \${QUESTIONS.length}</div>
      <div class="q-text">\${q.q}</div>
      <div id="opts"></div>
      <div id="fb" class="feedback"></div>
      <button class="next-btn" id="next-btn" onclick="nextQ()">\${qIdx===QUESTIONS.length-1?'Vedi risultato':'Prossima domanda &rarr;'}</button>
    </div>
  \`;
  const opts = document.getElementById("opts");
  q.opts.forEach((o,i)=>{
    const b = document.createElement("button");
    b.className = "opt";
    b.textContent = String.fromCharCode(97+i)+") "+o;
    b.onclick = ()=>answer(i);
    opts.appendChild(b);
  });
  updateProgress();
}

function answer(i){
  const q = QUESTIONS[qIdx];
  const opts = document.querySelectorAll(".opt");
  opts.forEach((o,idx)=>{
    o.disabled = true;
    if(idx===q.correct) o.classList.add("ok");
    else if(idx===i) o.classList.add("no");
  });
  const fb = document.getElementById("fb");
  fb.classList.add("show");
  if(i===q.correct){
    score++;
    fb.className = "feedback show ok";
    fb.innerHTML = '<span class="ico">&#10004;</span>'+q.okFb;
  } else {
    fb.className = "feedback show no";
    fb.innerHTML = '<span class="ico">&#10006;</span>'+q.noFb;
  }
  document.getElementById("next-btn").classList.add("show");
}

function nextQ(){
  qIdx++;
  if(qIdx>=QUESTIONS.length){
    showResult();
  } else {
    showQuestion();
  }
}

function updateProgress(){
  const pct = (qIdx / QUESTIONS.length) * 100;
  document.getElementById("pbar").style.width = pct+"%";
}

function showResult(){
  document.getElementById("quiz").style.display = "none";
  document.getElementById("result").style.display = "block";
  document.getElementById("score-val").textContent = score+" / "+QUESTIONS.length;
  document.getElementById("pbar").style.width = "100%";
  let msg;
  if(score===QUESTIONS.length) msg = "Eccellente! Padroneggi UEFI, GPT e il processo di boot di Windows.";
  else if(score>=4) msg = "Buon risultato! Ripassa i punti dove hai sbagliato per consolidare.";
  else if(score>=2) msg = "Risultato sufficiente. Rivedi le slide su UEFI/GPT/BCD.";
  else msg = "Argomento da riprendere: torna alle slide su UEFI, GPT e Secure Boot.";
  document.getElementById("perf-msg").textContent = msg;
}
</script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
