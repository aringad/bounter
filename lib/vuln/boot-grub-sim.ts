import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GRUB Config Simulator</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{
    background:#0d1117;
    font-family:'Courier New',Courier,monospace;
    color:#e0e0e0;
    min-height:100vh;
    padding:20px;
  }
  h1{
    text-align:center;
    color:#fdd835;
    margin-bottom:20px;
    letter-spacing:2px;
  }
  #app{
    max-width:1400px;
    margin:0 auto;
    display:grid;
    grid-template-columns:1fr 1fr 280px;
    gap:15px;
  }
  @media(max-width:1100px){
    #app{grid-template-columns:1fr;}
  }
  .panel{
    background:#161b22;
    border:1px solid #30363d;
    border-radius:6px;
    overflow:hidden;
  }
  .panel-header{
    background:#21262d;
    padding:8px 12px;
    font-size:12px;
    color:#8b949e;
    border-bottom:1px solid #30363d;
    display:flex;
    justify-content:space-between;
    align-items:center;
  }
  .panel-body{
    padding:14px;
  }

  /* Editor */
  .editor{
    background:#0d1117;
    color:#c9d1d9;
    font-size:13px;
    line-height:1.7;
    min-height:380px;
  }
  .editor .line{
    display:flex;
    align-items:center;
    gap:8px;
    flex-wrap:wrap;
    padding:2px 0;
  }
  .ed-comment{color:#6a9955;}
  .ed-key{color:#9cdcfe;}
  .ed-eq{color:#d4d4d4;}
  .ed-str{color:#ce9178;}
  .editor select,.editor input{
    background:#1e1e1e;
    color:#ce9178;
    border:1px solid #30363d;
    padding:3px 6px;
    font-family:inherit;
    font-size:12px;
    border-radius:3px;
  }
  .editor input[type=number]{width:70px;}
  .editor input[type=text]{width:240px;}

  /* GRUB preview */
  .grub-screen{
    background:#000;
    color:#fff;
    font-family:'Courier New',monospace;
    min-height:380px;
    padding:18px;
    border:2px solid #333;
    position:relative;
  }
  .grub-screen.bg-set{
    background:linear-gradient(135deg,#1a3a5c 0%,#0a1a2c 100%);
  }
  .grub-title{
    text-align:center;
    color:#bbb;
    border-bottom:1px solid #555;
    padding-bottom:8px;
    margin-bottom:14px;
    font-size:13px;
  }
  .grub-entry{
    padding:6px 14px;
    color:#ddd;
    font-size:14px;
  }
  .grub-entry.selected{
    background:#bdb000;
    color:#000;
    font-weight:bold;
  }
  .grub-footer{
    position:absolute;
    bottom:14px;
    left:18px;
    right:18px;
    color:#aaa;
    font-size:12px;
    border-top:1px solid #444;
    padding-top:8px;
  }
  .grub-hidden-msg{
    text-align:center;
    color:#fdd835;
    margin-top:40px;
    font-size:14px;
  }

  /* Tasks */
  .task{
    display:flex;
    gap:8px;
    align-items:flex-start;
    padding:8px;
    margin-bottom:6px;
    background:#0d1117;
    border:1px solid #30363d;
    border-radius:4px;
    font-size:12px;
    transition:all .25s;
  }
  .task.done{
    border-color:#3fb950;
    background:#0d2818;
  }
  .task .check{
    width:18px;
    height:18px;
    border:1px solid #555;
    border-radius:3px;
    flex-shrink:0;
    display:flex;
    align-items:center;
    justify-content:center;
    font-weight:bold;
    color:#fff;
  }
  .task.done .check{
    background:#3fb950;
    border-color:#3fb950;
  }

  button.action{
    background:#238636;
    color:#fff;
    border:none;
    padding:8px 14px;
    border-radius:4px;
    cursor:pointer;
    font-family:inherit;
    font-size:13px;
    margin-top:10px;
    width:100%;
  }
  button.action:hover{background:#2ea043;}

  #terminal-out{
    background:#000;
    color:#0f0;
    padding:10px;
    margin-top:10px;
    font-size:11px;
    border-radius:3px;
    min-height:60px;
    display:none;
    white-space:pre-wrap;
  }

  #completion{
    display:none;
    text-align:center;
    background:#0d2818;
    border:2px solid #3fb950;
    padding:20px;
    border-radius:6px;
    margin-top:20px;
  }
  #completion h2{color:#3fb950;margin-bottom:10px;}
  #continue-btn{
    background:#fdd835;
    color:#000;
    padding:12px 24px;
    border:none;
    border-radius:4px;
    cursor:pointer;
    font-weight:bold;
    font-size:14px;
    margin-top:10px;
  }

  /* Quiz */
  #quiz{
    display:none;
    max-width:800px;
    margin:30px auto;
    background:#161b22;
    padding:30px;
    border-radius:8px;
    border:1px solid #30363d;
  }
  #quiz h2{color:#fdd835;margin-bottom:20px;text-align:center;}
  .question{
    background:#0d1117;
    padding:18px;
    margin-bottom:16px;
    border-radius:6px;
    border:1px solid #30363d;
  }
  .question h3{color:#79c0ff;margin-bottom:12px;font-size:15px;}
  .option{
    display:block;
    padding:10px 14px;
    margin:6px 0;
    background:#161b22;
    border:1px solid #30363d;
    border-radius:4px;
    cursor:pointer;
    font-size:13px;
    transition:all .15s;
  }
  .option:hover{border-color:#58a6ff;}
  .option.correct{background:#0d2818;border-color:#3fb950;color:#3fb950;}
  .option.wrong{background:#3a1414;border-color:#f85149;color:#f85149;}
  .feedback{
    margin-top:12px;
    padding:12px;
    border-radius:4px;
    font-size:13px;
    display:none;
    line-height:1.5;
  }
  .feedback.ok{background:#0d2818;border:1px solid #3fb950;color:#aff5b4;}
  .feedback.ko{background:#3a1414;border:1px solid #f85149;color:#ffb4b4;}
  #score{
    text-align:center;
    margin-top:20px;
    padding:20px;
    background:#0d1117;
    border-radius:6px;
    color:#fdd835;
    font-size:18px;
    display:none;
  }
</style>
</head>
<body>

<h1>GRUB Config Simulator</h1>

<div id="app">
  <!-- Editor -->
  <div class="panel">
    <div class="panel-header"><span>nano /etc/default/grub</span><span>—— GNU nano 6.2</span></div>
    <div class="panel-body editor">
      <div class="line"><span class="ed-comment"># If you change this file, run 'update-grub' afterwards</span></div>
      <div class="line"><span class="ed-comment"># to update /boot/grub/grub.cfg.</span></div>
      <div class="line">&nbsp;</div>
      <div class="line">
        <span class="ed-key">GRUB_DEFAULT</span><span class="ed-eq">=</span>
        <select id="grub_default">
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="saved">"saved"</option>
        </select>
        <span class="ed-comment"># 0=Ubuntu, 1=Windows, 2=Ubuntu Adv</span>
      </div>
      <div class="line">
        <span class="ed-key">GRUB_TIMEOUT</span><span class="ed-eq">=</span>
        <input type="number" id="grub_timeout" value="10" min="0" max="30">
      </div>
      <div class="line">
        <span class="ed-key">GRUB_TIMEOUT_STYLE</span><span class="ed-eq">=</span>
        <select id="grub_timeout_style">
          <option value="hidden">"hidden"</option>
          <option value="menu" selected>"menu"</option>
          <option value="countdown">"countdown"</option>
        </select>
      </div>
      <div class="line">
        <span class="ed-key">GRUB_BACKGROUND</span><span class="ed-eq">=</span>
        <input type="text" id="grub_background" value="" placeholder='"/path/to/image"'>
      </div>
      <div class="line">&nbsp;</div>
      <div class="line"><span class="ed-comment"># GRUB_DISABLE_OS_PROBER=false</span></div>
      <div class="line"><span class="ed-comment"># GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"</span></div>
    </div>
  </div>

  <!-- GRUB preview -->
  <div class="panel">
    <div class="panel-header"><span>GRUB Boot Menu (live preview)</span></div>
    <div id="grub-screen" class="grub-screen">
      <div id="grub-content">
        <div class="grub-title">GNU GRUB  version 2.06</div>
        <div id="entries">
          <div class="grub-entry" data-idx="0">Ubuntu</div>
          <div class="grub-entry" data-idx="2">Advanced options for Ubuntu</div>
          <div class="grub-entry" data-idx="1">Windows Boot Manager (on /dev/sda1)</div>
        </div>
        <div class="grub-footer" id="grub-footer">
          Use the &uarr; and &darr; keys to select which entry is highlighted.<br>
          <span id="countdown-text">The highlighted entry will be executed automatically in 10s.</span>
        </div>
      </div>
      <div class="grub-hidden-msg" id="hidden-msg" style="display:none;">
        Booting Ubuntu...<br><br>
        <span style="font-size:12px;color:#aaa;">(Press SHIFT to access GRUB menu)</span>
      </div>
    </div>
  </div>

  <!-- Tasks -->
  <div class="panel">
    <div class="panel-header"><span>Task da completare</span></div>
    <div class="panel-body">
      <div class="task" id="task-1"><div class="check"></div><div>Imposta Windows come SO di default</div></div>
      <div class="task" id="task-2"><div class="check"></div><div>Riduci il timeout a 5 secondi</div></div>
      <div class="task" id="task-3"><div class="check"></div><div>Cambia lo stile del timeout a "countdown"</div></div>
      <div class="task" id="task-4"><div class="check"></div><div>Aggiungi un'immagine di sfondo<br><code style="color:#ce9178;font-size:11px;">/home/user/bg.png</code></div></div>
      <div class="task" id="task-5"><div class="check"></div><div>Esegui <code style="color:#ce9178;">sudo update-grub</code></div></div>

      <button class="action" id="run-update">$ sudo update-grub</button>
      <pre id="terminal-out"></pre>
    </div>
  </div>
</div>

<div id="completion">
  <h2>Configurazione completata!</h2>
  <p>Hai modificato con successo la configurazione di GRUB.</p>
  <button id="continue-btn">Continua col quiz &rarr;</button>
</div>

<!-- QUIZ -->
<div id="quiz">
  <h2>Quiz: GRUB &amp; Boot Linux/Windows</h2>
  <div id="questions"></div>
  <div id="score"></div>
</div>

<script>
const state = {
  default: '0',
  timeout: 10,
  style: 'menu',
  background: '',
  updated: false
};

const tasks = {1:false,2:false,3:false,4:false,5:false};

function $(id){return document.getElementById(id);}

function render(){
  // entries highlight
  const idx = state.default === 'saved' ? '0' : state.default;
  document.querySelectorAll('.grub-entry').forEach(e=>{
    e.classList.toggle('selected', e.dataset.idx === idx);
  });

  // background
  $('grub-screen').classList.toggle('bg-set', !!state.background);

  // timeout style
  const hidden = state.style === 'hidden';
  $('grub-content').style.display = hidden ? 'none' : 'block';
  $('hidden-msg').style.display = hidden ? 'block' : 'none';

  // countdown text
  if(state.style === 'countdown'){
    $('countdown-text').innerHTML = 'Auto boot in <span style="color:#fdd835;font-weight:bold;">'+state.timeout+'</span> seconds...';
  } else {
    $('countdown-text').innerHTML = 'The highlighted entry will be executed automatically in '+state.timeout+'s.';
  }

  // tasks
  tasks[1] = state.default === '1';
  tasks[2] = state.timeout === 5;
  tasks[3] = state.style === 'countdown';
  tasks[4] = state.background.trim() === '/home/user/bg.png';
  tasks[5] = state.updated;

  for(let i=1;i<=5;i++){
    const t = $('task-'+i);
    t.classList.toggle('done', tasks[i]);
    t.querySelector('.check').textContent = tasks[i] ? '\\u2713' : '';
  }

  if(Object.values(tasks).every(v=>v)){
    $('completion').style.display = 'block';
  }
}

$('grub_default').addEventListener('change',e=>{state.default=e.target.value;render();});
$('grub_timeout').addEventListener('input',e=>{state.timeout=parseInt(e.target.value)||0;render();});
$('grub_timeout_style').addEventListener('change',e=>{state.style=e.target.value;render();});
$('grub_background').addEventListener('input',e=>{state.background=e.target.value;render();});

$('run-update').addEventListener('click',()=>{
  const out = $('terminal-out');
  out.style.display = 'block';
  out.textContent = '';
  const lines = [
    "Sourcing file '/etc/default/grub'",
    "Sourcing file '/etc/default/grub.d/init-select.cfg'",
    'Generating grub configuration file ...',
    'Found linux image: /boot/vmlinuz-6.2.0-39-generic',
    'Found initrd image: /boot/initrd.img-6.2.0-39-generic',
    'Found Windows Boot Manager on /dev/sda1@/efi/Microsoft/Boot/bootmgfw.efi',
    'Adding boot menu entry for UEFI Firmware Settings ...',
    'done'
  ];
  let i = 0;
  const iv = setInterval(()=>{
    out.textContent += lines[i] + '\\n';
    i++;
    if(i>=lines.length){
      clearInterval(iv);
      state.updated = true;
      render();
    }
  },220);
});

$('continue-btn').addEventListener('click',()=>{
  $('quiz').style.display = 'block';
  $('quiz').scrollIntoView({behavior:'smooth'});
});

// Quiz data
const questions = [
  {
    q: 'Quale boot loader è predefinito in Ubuntu moderne?',
    options: ['LILO','NTLDR','Windows Boot Manager','GRUB2'],
    correct: 3,
    fb: 'Corretto! GRUB2 (GRand Unified Bootloader v2) è il boot loader standard nelle distribuzioni Linux moderne, incluse Ubuntu, Debian e Fedora. Sostituisce il vecchio GRUB Legacy e supporta UEFI, partizioni GPT e configurazione modulare.'
  },
  {
    q: 'Dopo aver modificato /etc/default/grub, quale comando bisogna eseguire per applicare le modifiche?',
    options: ['sudo reboot','sudo update-grub','sudo apt update','sudo grub-install'],
    correct: 1,
    fb: 'Corretto! sudo update-grub rigenera /boot/grub/grub.cfg leggendo /etc/default/grub e gli script in /etc/grub.d/. Senza questo comando le modifiche non hanno effetto. grub-install serve invece a installare il bootloader nel MBR/EFI.'
  },
  {
    q: 'Qual è la differenza tra clean install e upgrade di Windows?',
    options: [
      'Clean install installa da zero senza mantenere SO/programmi precedenti; upgrade mantiene impostazioni, file e applicazioni aggiornando la versione esistente',
      'Sono la stessa cosa',
      'Clean install richiede connessione Internet, upgrade no',
      'Upgrade cancella tutti i dati'
    ],
    correct: 0,
    fb: 'Corretto! Clean install (installazione pulita) formatta la partizione e installa Windows da zero — ideale per partire con un sistema senza residui. Upgrade preserva file utente, impostazioni e applicazioni compatibili passando da una versione all\\'altra (es. Win10 → Win11).'
  },
  {
    q: 'Perché in un sistema multi-boot è raccomandato installare prima Windows e poi Linux?',
    options: [
      'Perché Linux è più difficile da installare',
      'Perché Windows non supporta Linux',
      'Perché Linux con GRUB riconosce e include Windows nel menu boot, mentre Windows installato dopo sovrascrive GRUB',
      'Per questioni di licenza'
    ],
    correct: 2,
    fb: 'Corretto! L\\'installer Windows sovrascrive il bootloader esistente con il proprio (Windows Boot Manager), rendendo Linux non avviabile. GRUB invece, tramite os-prober, rileva automaticamente le installazioni Windows esistenti e le aggiunge al menu di boot.'
  },
  {
    q: 'Cosa contiene il file /boot/grub/grub.cfg?',
    options: [
      'Le password degli utenti',
      'I driver della scheda video',
      'I log di sistema',
      'La configurazione finale del menu GRUB, generata automaticamente da update-grub — non va modificato a mano'
    ],
    correct: 3,
    fb: 'Corretto! /boot/grub/grub.cfg è il file effettivamente letto da GRUB al boot, ma viene rigenerato automaticamente. Per modifiche persistenti si edita /etc/default/grub e gli script in /etc/grub.d/, poi si esegue update-grub.'
  },
  {
    q: 'Quale percorso di boot del kernel Linux è più semplice e diretto?',
    options: [
      'Percorso diretto: il primary boot loader localizza il kernel, lo carica in memoria e lo esegue senza passare per il boot sector della partizione',
      'Percorso di chainloading: BIOS → MBR → boot sector della partizione → kernel',
      'Entrambi i percorsi sono identici',
      'Il kernel si carica da solo senza boot loader'
    ],
    correct: 0,
    fb: 'Corretto! Nel percorso diretto GRUB localizza e carica direttamente il kernel, saltando il boot sector della partizione. È più semplice del chainloading, dove il BIOS passa prima per il MBR e poi per il boot sector della partizione attiva prima di arrivare al kernel.'
  }
];

const qContainer = $('questions');
const answered = new Array(questions.length).fill(false);
let score = 0;

questions.forEach((q,qi)=>{
  const div = document.createElement('div');
  div.className = 'question';
  div.innerHTML = '<h3>Domanda '+(qi+1)+': '+q.q+'</h3>';
  const optsWrap = document.createElement('div');
  q.options.forEach((opt,oi)=>{
    const btn = document.createElement('div');
    btn.className = 'option';
    btn.textContent = String.fromCharCode(97+oi)+') '+opt;
    btn.addEventListener('click',()=>{
      if(answered[qi]) return;
      answered[qi] = true;
      const fb = div.querySelector('.feedback');
      if(oi === q.correct){
        btn.classList.add('correct');
        fb.className = 'feedback ok';
        fb.textContent = q.fb;
        score++;
      } else {
        btn.classList.add('wrong');
        optsWrap.children[q.correct].classList.add('correct');
        fb.className = 'feedback ko';
        fb.textContent = 'Sbagliato. La risposta corretta è "'+String.fromCharCode(97+q.correct)+'". '+q.fb;
      }
      fb.style.display = 'block';
      if(answered.every(a=>a)){
        const s = $('score');
        s.style.display = 'block';
        s.innerHTML = 'Punteggio finale: <strong>'+score+' / '+questions.length+'</strong>';
      }
    });
    optsWrap.appendChild(btn);
  });
  div.appendChild(optsWrap);
  const fb = document.createElement('div');
  fb.className = 'feedback';
  div.appendChild(fb);
  qContainer.appendChild(div);
});

render();
</script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
}
