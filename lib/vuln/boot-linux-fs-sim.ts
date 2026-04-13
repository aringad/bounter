import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Linux File System & Partizioni</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{
    background:#0f172a;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
    color:#e2e8f0;
    min-height:100vh;
    padding:16px;
  }
  .wrap{max-width:1100px;margin:0 auto;}
  h1{
    color:#60a5fa;
    font-size:22px;
    margin-bottom:6px;
    text-align:center;
  }
  .subtitle{
    text-align:center;
    color:#94a3b8;
    font-size:13px;
    margin-bottom:16px;
  }
  .progress-bar{
    height:6px;
    background:#1e293b;
    border-radius:3px;
    overflow:hidden;
    margin-bottom:18px;
  }
  .progress-fill{
    height:100%;
    background:linear-gradient(90deg,#3b82f6,#8b5cf6);
    width:0%;
    transition:width 0.4s;
  }
  .section{
    background:#1e293b;
    border:1px solid #334155;
    border-radius:10px;
    padding:18px;
    margin-bottom:16px;
  }
  .section h2{
    color:#fbbf24;
    font-size:16px;
    margin-bottom:12px;
    border-bottom:1px solid #334155;
    padding-bottom:8px;
  }
  /* File explorer */
  .explorer{
    display:grid;
    grid-template-columns:1fr 1.4fr;
    gap:14px;
    min-height:260px;
  }
  .tree{
    background:#0f172a;
    border:1px solid #334155;
    border-radius:6px;
    padding:10px;
    font-family:'Consolas','Monaco',monospace;
    font-size:13px;
    overflow-y:auto;
    max-height:340px;
  }
  .tree-root{
    color:#60a5fa;
    padding:4px;
    margin-bottom:4px;
    font-weight:bold;
  }
  .folder{
    cursor:pointer;
    padding:5px 8px;
    margin:2px 0 2px 16px;
    border-radius:4px;
    display:flex;
    align-items:center;
    gap:8px;
    transition:background 0.15s;
  }
  .folder:hover{background:#334155;}
  .folder.active{background:#3b82f6;color:#fff;}
  .folder-icon{font-size:14px;}
  .details{
    background:#0f172a;
    border:1px solid #334155;
    border-radius:6px;
    padding:14px;
    font-size:13px;
    line-height:1.6;
  }
  .details .empty{color:#64748b;font-style:italic;text-align:center;padding:40px 0;}
  .details h3{color:#fbbf24;margin-bottom:8px;font-size:15px;}
  .badge{
    display:inline-block;
    padding:2px 8px;
    border-radius:10px;
    font-size:11px;
    font-weight:bold;
    margin-left:6px;
  }
  .badge.root{background:#dc2626;color:#fff;}
  .badge.user{background:#16a34a;color:#fff;}
  .example{
    background:#1e293b;
    padding:6px 8px;
    border-radius:4px;
    font-family:'Consolas',monospace;
    font-size:12px;
    color:#86efac;
    margin-top:8px;
    display:block;
  }
  /* Match challenge */
  .match-area{
    margin-top:14px;
    padding-top:14px;
    border-top:1px solid #334155;
  }
  .match-area h3{color:#a78bfa;margin-bottom:10px;font-size:14px;}
  .match-list{display:flex;flex-direction:column;gap:8px;}
  .match-row{
    display:grid;
    grid-template-columns:1fr auto;
    gap:10px;
    align-items:center;
    background:#0f172a;
    padding:8px 10px;
    border-radius:6px;
    border:1px solid #334155;
  }
  .match-row.correct{border-color:#16a34a;background:#052e16;}
  .match-row.wrong{border-color:#dc2626;background:#3f0a0a;}
  .match-row select{
    background:#1e293b;
    color:#e2e8f0;
    border:1px solid #475569;
    padding:5px 8px;
    border-radius:4px;
    font-family:inherit;
    font-size:13px;
  }
  /* Partition planner */
  .scenario-box{
    background:#0f172a;
    border:1px solid #334155;
    border-radius:6px;
    padding:14px;
    margin-bottom:10px;
  }
  .scenario-title{
    color:#60a5fa;
    font-weight:bold;
    margin-bottom:10px;
    font-size:14px;
  }
  .opt{
    display:flex;
    align-items:flex-start;
    gap:10px;
    padding:8px;
    margin:5px 0;
    background:#1e293b;
    border-radius:5px;
    cursor:pointer;
    border:1px solid transparent;
  }
  .opt:hover{border-color:#475569;}
  .opt input{margin-top:3px;cursor:pointer;}
  .opt-text{flex:1;font-size:13px;}
  .opt-feedback{
    font-size:12px;
    margin-top:4px;
    display:none;
  }
  .opt.checked .opt-feedback{display:block;}
  .opt.right{border-color:#16a34a;background:#052e16;}
  .opt.wrong{border-color:#dc2626;background:#3f0a0a;}
  .opt.right .opt-feedback{color:#86efac;}
  .opt.wrong .opt-feedback{color:#fca5a5;}
  .scenario-result{
    margin-top:10px;
    padding:8px;
    border-radius:5px;
    font-size:13px;
    display:none;
  }
  .scenario-result.show{display:block;}
  .scenario-result.pass{background:#052e16;color:#86efac;border:1px solid #16a34a;}
  .scenario-result.fail{background:#3f0a0a;color:#fca5a5;border:1px solid #dc2626;}
  /* Buttons */
  .btn{
    background:linear-gradient(90deg,#3b82f6,#6366f1);
    color:#fff;
    border:none;
    padding:10px 20px;
    border-radius:6px;
    font-size:14px;
    font-weight:bold;
    cursor:pointer;
    margin-top:10px;
    transition:transform 0.1s;
  }
  .btn:hover{transform:translateY(-1px);}
  .btn:disabled{background:#334155;cursor:not-allowed;transform:none;}
  .btn-quiz{
    display:block;
    margin:20px auto 0;
    padding:14px 30px;
    font-size:16px;
    background:linear-gradient(90deg,#16a34a,#22c55e);
  }
  /* Quiz */
  .quiz-question{
    font-size:15px;
    color:#fbbf24;
    margin-bottom:14px;
    font-weight:600;
  }
  .quiz-counter{
    color:#94a3b8;
    font-size:12px;
    margin-bottom:8px;
  }
  .quiz-opt{
    display:block;
    background:#0f172a;
    border:1px solid #334155;
    border-radius:6px;
    padding:11px 14px;
    margin:7px 0;
    cursor:pointer;
    font-size:13px;
    transition:all 0.15s;
  }
  .quiz-opt:hover{background:#334155;border-color:#60a5fa;}
  .quiz-opt.selected{background:#1e3a8a;border-color:#60a5fa;}
  .quiz-opt.correct{background:#052e16;border-color:#16a34a;color:#86efac;}
  .quiz-opt.incorrect{background:#3f0a0a;border-color:#dc2626;color:#fca5a5;}
  .quiz-opt.disabled{cursor:not-allowed;pointer-events:none;}
  .quiz-feedback{
    margin-top:12px;
    padding:10px;
    border-radius:6px;
    font-size:13px;
    line-height:1.5;
    display:none;
  }
  .quiz-feedback.show{display:block;}
  .quiz-feedback.ok{background:#052e16;color:#86efac;border:1px solid #16a34a;}
  .quiz-feedback.bad{background:#3f0a0a;color:#fca5a5;border:1px solid #dc2626;}
  .final-score{
    text-align:center;
    padding:30px;
  }
  .final-score h2{color:#fbbf24;font-size:24px;margin-bottom:10px;border:none;}
  .final-score .score{font-size:48px;color:#60a5fa;font-weight:bold;margin:14px 0;}
  .hidden{display:none !important;}
  @media(max-width:720px){
    .explorer{grid-template-columns:1fr;}
  }
</style>
</head>
<body>
<div class="wrap">
  <h1>Linux File System, Partizioni & Ripristino</h1>
  <div class="subtitle">Simulatore interattivo + quiz finale</div>
  <div class="progress-bar"><div class="progress-fill" id="progress"></div></div>

  <!-- PART 1 -->
  <div id="part1">

    <!-- Section A -->
    <div class="section">
      <h2>Sezione A — Esplora il File System Linux</h2>
      <div class="explorer">
        <div class="tree" id="tree">
          <div class="tree-root">/ (root)</div>
        </div>
        <div class="details" id="details">
          <div class="empty">Clicca una cartella per vederne i dettagli</div>
        </div>
      </div>

      <div class="match-area">
        <h3>Mini sfida: associa la descrizione alla directory corretta</h3>
        <div class="match-list" id="matchList"></div>
        <button class="btn" id="checkMatch">Verifica associazioni</button>
      </div>
    </div>

    <!-- Section B -->
    <div class="section">
      <h2>Sezione B — Pianificatore di Partizioni</h2>
      <div id="scenarios"></div>
    </div>

    <button class="btn btn-quiz hidden" id="goQuiz">Continua col quiz &rarr;</button>
  </div>

  <!-- PART 2 -->
  <div id="part2" class="hidden">
    <div class="section">
      <h2>Quiz finale</h2>
      <div class="quiz-counter" id="qCounter"></div>
      <div class="quiz-question" id="qText"></div>
      <div id="qOptions"></div>
      <div class="quiz-feedback" id="qFeedback"></div>
      <button class="btn hidden" id="qNext">Prossima &rarr;</button>
    </div>
  </div>

  <div id="finalScreen" class="hidden">
    <div class="section final-score">
      <h2>Simulazione completata!</h2>
      <div class="score" id="finalScore"></div>
      <p id="finalMsg"></p>
      <button class="btn" onclick="location.reload()">Ricomincia</button>
    </div>
  </div>
</div>

<script>
// ===== DATA =====
const folders = [
  {name:'/bin', icon:'📁', desc:'Binari essenziali del sistema, accessibili a tutti gli utenti (comandi base come ls, cp, mv, cat).', root:true, examples:'ls, cp, mv, cat, bash'},
  {name:'/boot', icon:'⚙️', desc:'File necessari all\\'avvio del sistema operativo: kernel Linux, initrd, e configurazione del bootloader GRUB.', root:true, examples:'vmlinuz, initrd.img, grub/'},
  {name:'/dev', icon:'🔌', desc:'File dispositivo (device files): rappresentano hardware e periferiche. Es. dischi, terminali, partizioni.', root:true, examples:'/dev/sda, /dev/sda1, /dev/tty1, /dev/null'},
  {name:'/etc', icon:'🛠️', desc:'Configurazione del sistema: file di configurazione globali per tutti i programmi installati.', root:true, examples:'/etc/passwd, /etc/fstab, /etc/hostname'},
  {name:'/home', icon:'🏠', desc:'Home directory degli utenti: ogni utente ha la propria sottocartella con file personali e impostazioni.', root:false, examples:'/home/mario, /home/luca/Documenti'},
  {name:'/lib', icon:'📚', desc:'Librerie condivise essenziali per i binari in /bin e /sbin, oltre ai moduli del kernel.', root:true, examples:'libc.so, modules/'},
  {name:'/media', icon:'💿', desc:'Punto di montaggio automatico per supporti rimovibili (USB, CD/DVD).', root:false, examples:'/media/usb0, /media/cdrom'},
  {name:'/mnt', icon:'🔗', desc:'Punto di montaggio temporaneo per file system montati manualmente dall\\'amministratore.', root:true, examples:'/mnt/disk2, /mnt/backup'},
  {name:'/opt', icon:'📦', desc:'Software opzionale di terze parti installato fuori dai canali standard del package manager.', root:true, examples:'/opt/google/chrome'},
  {name:'/proc', icon:'🧠', desc:'File system virtuale che espone informazioni sui processi in esecuzione e sul kernel.', root:false, examples:'/proc/cpuinfo, /proc/meminfo, /proc/1/'},
  {name:'/root', icon:'👑', desc:'Home directory dell\\'utente root (l\\'amministratore di sistema).', root:true, examples:'/root/.bashrc'},
  {name:'/sbin', icon:'⚡', desc:'Binari essenziali del sistema riservati all\\'amministratore (system binaries).', root:true, examples:'fdisk, mkfs, reboot, shutdown'},
  {name:'/tmp', icon:'🗑️', desc:'File temporanei: contenuto cancellato a ogni riavvio. Scrivibile da tutti gli utenti.', root:false, examples:'/tmp/installer.log'},
  {name:'/usr', icon:'📂', desc:'Programmi e dati condivisi tra utenti, non essenziali per il boot (la maggior parte del software).', root:true, examples:'/usr/bin, /usr/share, /usr/lib'},
  {name:'/var', icon:'📊', desc:'Dati variabili (log, spool, cache, mail). Cresce nel tempo durante l\\'uso del sistema.', root:true, examples:'/var/log, /var/spool/cups, /var/cache'}
];

const matches = [
  {desc:'Configurazione del sistema', correct:'/etc'},
  {desc:'Home directory degli utenti', correct:'/home'},
  {desc:'File temporanei', correct:'/tmp'},
  {desc:'Dati variabili (log, spool, cache)', correct:'/var'},
  {desc:'Binari essenziali del sistema', correct:'/bin'}
];

const scenarios = [
  {
    title:'Scenario 1: PC moderno con UEFI, disco 500 GB, installo solo Ubuntu',
    options:[
      {label:'Partizione EFI', correct:true, fb:'Corretto: con UEFI serve sempre una partizione EFI System Partition (FAT32, ~500 MB).'},
      {label:'grub_bios', correct:false, fb:'Errato: grub_bios serve solo nel caso GPT + BIOS legacy, non con UEFI.'},
      {label:'Area di swap', correct:true, fb:'Corretto: lo swap è raccomandato per gestione memoria e ibernazione.'},
      {label:'File system "/"', correct:true, fb:'Corretto: la root del file system è sempre necessaria.'},
      {label:'Partizione MBR', correct:false, fb:'Errato: MBR è uno schema di partizionamento alternativo a GPT, non si usa con UEFI.'}
    ]
  },
  {
    title:'Scenario 2: PC vecchio con BIOS, disco 200 GB, schema MBR',
    options:[
      {label:'Partizione EFI', correct:false, fb:'Errato: EFI serve solo per firmware UEFI, non per BIOS legacy.'},
      {label:'grub_bios', correct:false, fb:'Errato: grub_bios serve nel caso GPT + BIOS, qui usiamo MBR + BIOS.'},
      {label:'Area di swap', correct:true, fb:'Corretto: lo swap è raccomandato.'},
      {label:'File system "/"', correct:true, fb:'Corretto: la root è obbligatoria.'},
      {label:'Struttura MBR', correct:true, fb:'Corretto: lo schema di partizionamento MBR è quello scelto.'}
    ]
  },
  {
    title:'Scenario 3: PC con firmware UEFI, voglio separare i dati utente in caso di reinstallazione',
    options:[
      {label:'Partizione /home separata', correct:true, fb:'Corretto: il punto chiave dello scenario! Mantiene i dati utente intatti in caso di reinstallazione o cambio distribuzione.'},
      {label:'File system "/"', correct:true, fb:'Corretto: la root ospita il sistema operativo e resta sempre necessaria.'},
      {label:'Area di swap', correct:true, fb:'Corretto: raccomandata in ogni installazione come memoria virtuale.'},
      {label:'Partizione EFI', correct:true, fb:'Corretto: su firmware UEFI la partizione EFI è obbligatoria per il boot.'}
    ]
  }
];

const quiz = [
  {
    q:'Come si eseguono comandi con privilegi di amministratore su Ubuntu?',
    options:[
      'Usando solo la password utente senza altro',
      'Anteponendo "sudo" al comando (privilegi root temporanei) oppure usando "su" per una shell root completa',
      'Disabilitando la sicurezza',
      'Non è possibile'
    ],
    correct:1,
    fb:'Risposta corretta: b. "sudo comando" eleva i privilegi solo per quel comando, "su" apre una shell come root.'
  },
  {
    q:'Come si chiama il primo disco SATA/SCSI in Linux?',
    options:['/dev/hda','C:\\\\','/mnt/disk0','/dev/sda'],
    correct:3,
    fb:'Risposta corretta: d. /dev/sda è il primo disco SATA/SCSI; /dev/hda era usato per i vecchi dischi PATA/IDE.'
  },
  {
    q:'Quale comando mostra le partizioni del disco in Linux?',
    options:['sudo fdisk -l','show disk','list partitions','dir /dev'],
    correct:0,
    fb:'Risposta corretta: a. "sudo fdisk -l" elenca tutti i dischi e le relative partizioni (richiede privilegi root).'
  },
  {
    q:'Qual è la differenza tra ripristino e reinstallazione di Ubuntu?',
    options:[
      'Sono la stessa cosa con nomi diversi',
      'Il ripristino cancella tutto, la reinstallazione no',
      'Il ripristino sostituisce i file di sistema mantenendo i file utente in /home; la reinstallazione è un\\'installazione completa da zero che sovrascrive tutto',
      'Solo il ripristino richiede backup'
    ],
    correct:2,
    fb:'Risposta corretta: c. Il ripristino preserva /home e le configurazioni utente; la reinstallazione parte da zero.'
  },
  {
    q:'Perché è utile avere /home su una partizione separata?',
    options:[
      'Perché i file utente restano intatti in caso di reinstallazione o cambio distribuzione del sistema operativo',
      'Perché è obbligatorio',
      'Perché velocizza il boot',
      'Perché Ubuntu non funziona senza'
    ],
    correct:0,
    fb:'Risposta corretta: a. Separare /home permette di reinstallare o cambiare distro senza perdere i dati personali.'
  },
  {
    q:'Gli aggiornamenti di Ubuntu (upgrade) possono saltare versioni intermedie?',
    options:[
      'Sì, sempre',
      'Sì, ma solo sui server',
      'Solo per versioni LTS',
      'No, bisogna aggiornare sequenzialmente ad ogni nuova release (es. da 20.10 a 21.04 e poi a 21.10, non si può saltare direttamente)'
    ],
    correct:3,
    fb:'Risposta corretta: d. Gli upgrade tra release consecutive (es. 23.10 → 24.04) vanno fatti uno alla volta tramite do-release-upgrade: non si può passare direttamente da 22.04 a 24.04 saltando la 23.10 o la 23.04 senza fare i passaggi intermedi.'
  }
];

// ===== STATE =====
let progress = 0;
let matchDone = false;
let scenariosDone = [false,false,false];
let currentScenario = 0;
let qIndex = 0;
let qScore = 0;

function updateProgress(){
  // 6 milestones: explorer click (1), match (1), 3 scenarios, then quiz contributes per question
  const total = 5 + quiz.length;
  let done = 0;
  if(progress >= 1) done++;
  if(matchDone) done++;
  done += scenariosDone.filter(Boolean).length;
  done += qIndex;
  document.getElementById('progress').style.width = Math.min(100,(done/total)*100)+'%';
}

// ===== TREE =====
const tree = document.getElementById('tree');
const details = document.getElementById('details');
folders.forEach(f=>{
  const el = document.createElement('div');
  el.className = 'folder';
  el.innerHTML = '<span class="folder-icon">'+f.icon+'</span><span>'+f.name+'</span>';
  el.onclick = ()=>{
    document.querySelectorAll('.folder').forEach(x=>x.classList.remove('active'));
    el.classList.add('active');
    showFolder(f);
    if(progress < 1){progress = 1; updateProgress();}
  };
  tree.appendChild(el);
});

function showFolder(f){
  const badge = f.root ? '<span class="badge root">root richiesto</span>' : '<span class="badge user">utente</span>';
  details.innerHTML = '<h3>'+f.name+' '+badge+'</h3><p>'+f.desc+'</p><span class="example">Esempi: '+f.examples+'</span>';
}

// ===== MATCH =====
const matchList = document.getElementById('matchList');
const dirOptions = ['','/etc','/home','/tmp','/var','/bin','/sbin','/dev','/boot','/usr','/opt'];
matches.forEach((m,i)=>{
  const row = document.createElement('div');
  row.className = 'match-row';
  row.id = 'match-'+i;
  let opts = dirOptions.map(o=>'<option value="'+o+'">'+(o||'-- scegli --')+'</option>').join('');
  row.innerHTML = '<span>'+m.desc+'</span><select id="sel-'+i+'">'+opts+'</select>';
  matchList.appendChild(row);
});

document.getElementById('checkMatch').onclick = ()=>{
  let allRight = true;
  matches.forEach((m,i)=>{
    const sel = document.getElementById('sel-'+i).value;
    const row = document.getElementById('match-'+i);
    row.classList.remove('correct','wrong');
    const valid = (m.correct === sel) || (m.desc.includes('Binari essenziali') && (sel === '/bin' || sel === '/sbin'));
    if(valid){row.classList.add('correct');}
    else {row.classList.add('wrong'); allRight = false;}
  });
  if(allRight){
    matchDone = true;
    document.getElementById('checkMatch').disabled = true;
    document.getElementById('checkMatch').textContent = 'Tutto corretto!';
    updateProgress();
    checkPart1Complete();
  }
};

// ===== SCENARIOS =====
const scenContainer = document.getElementById('scenarios');
function renderScenario(idx){
  scenContainer.innerHTML = '';
  const s = scenarios[idx];
  const box = document.createElement('div');
  box.className = 'scenario-box';
  let html = '<div class="scenario-title">'+s.title+'</div>';
  s.options.forEach((o,i)=>{
    html += '<label class="opt" data-i="'+i+'"><input type="checkbox" data-i="'+i+'"><div style="flex:1"><div class="opt-text">'+o.label+'</div><div class="opt-feedback">'+o.fb+'</div></div></label>';
  });
  html += '<button class="btn" id="checkScen">Verifica scenario '+(idx+1)+'/3</button>';
  html += '<div class="scenario-result" id="scenResult"></div>';
  box.innerHTML = html;
  scenContainer.appendChild(box);

  document.getElementById('checkScen').onclick = ()=>{
    let allRight = true;
    const opts = box.querySelectorAll('.opt');
    opts.forEach((el,i)=>{
      const cb = el.querySelector('input');
      const expected = s.options[i].correct;
      el.classList.add('checked');
      el.classList.remove('right','wrong');
      if(cb.checked === expected){el.classList.add('right');}
      else {el.classList.add('wrong'); allRight = false;}
    });
    const res = document.getElementById('scenResult');
    res.classList.add('show');
    if(allRight){
      res.classList.add('pass');
      res.classList.remove('fail');
      res.textContent = 'Scenario corretto!';
      scenariosDone[idx] = true;
      updateProgress();
      setTimeout(()=>{
        if(idx < 2){currentScenario++; renderScenario(currentScenario);}
        else {checkPart1Complete();}
      }, 1400);
    } else {
      res.classList.add('fail');
      res.classList.remove('pass');
      res.textContent = 'Alcune scelte non sono corrette. Leggi i feedback e riprova.';
    }
  };
}
renderScenario(0);

function checkPart1Complete(){
  if(matchDone && scenariosDone.every(Boolean)){
    document.getElementById('goQuiz').classList.remove('hidden');
  }
}

document.getElementById('goQuiz').onclick = ()=>{
  document.getElementById('part1').classList.add('hidden');
  document.getElementById('part2').classList.remove('hidden');
  renderQuestion();
};

// ===== QUIZ =====
function renderQuestion(){
  const q = quiz[qIndex];
  document.getElementById('qCounter').textContent = 'Domanda '+(qIndex+1)+' di '+quiz.length;
  document.getElementById('qText').textContent = q.q;
  const optsBox = document.getElementById('qOptions');
  optsBox.innerHTML = '';
  const letters = ['a','b','c','d'];
  q.options.forEach((opt,i)=>{
    const el = document.createElement('div');
    el.className = 'quiz-opt';
    el.innerHTML = '<b>'+letters[i]+')</b> '+opt;
    el.onclick = ()=>selectAnswer(i, el);
    optsBox.appendChild(el);
  });
  document.getElementById('qFeedback').classList.remove('show','ok','bad');
  document.getElementById('qFeedback').textContent = '';
  document.getElementById('qNext').classList.add('hidden');
}

function selectAnswer(i, el){
  const q = quiz[qIndex];
  const all = document.querySelectorAll('.quiz-opt');
  all.forEach(o=>o.classList.add('disabled'));
  const fb = document.getElementById('qFeedback');
  fb.classList.add('show');
  if(i === q.correct){
    el.classList.add('correct');
    fb.classList.add('ok');
    fb.textContent = 'Esatto! '+q.fb;
    qScore++;
  } else {
    el.classList.add('incorrect');
    all[q.correct].classList.add('correct');
    fb.classList.add('bad');
    fb.textContent = 'Sbagliato. '+q.fb;
  }
  document.getElementById('qNext').classList.remove('hidden');
  document.getElementById('qNext').textContent = (qIndex < quiz.length-1) ? 'Prossima →' : 'Vedi risultato finale';
}

document.getElementById('qNext').onclick = ()=>{
  qIndex++;
  updateProgress();
  if(qIndex < quiz.length){
    renderQuestion();
  } else {
    showFinal();
  }
};

function showFinal(){
  document.getElementById('part2').classList.add('hidden');
  const f = document.getElementById('finalScreen');
  f.classList.remove('hidden');
  document.getElementById('finalScore').textContent = qScore + ' / ' + quiz.length;
  let msg = '';
  if(qScore === quiz.length) msg = 'Perfetto! Padronanza completa di file system Linux e partizioni.';
  else if(qScore >= 4) msg = 'Buon lavoro! Ripassa i punti deboli e sei pronto.';
  else msg = 'Rivedi le slide su file system, partizioni e ripristino, poi riprova.';
  document.getElementById('finalMsg').textContent = msg;
  document.getElementById('progress').style.width = '100%';
}

updateProgress();
</script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
}
