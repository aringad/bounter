import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AMI BIOS Setup Utility</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{
    background:#0d1117;
    font-family:'Courier New',Courier,monospace;
    color:#e0e0e0;
    min-height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    padding:10px;
    user-select:none;
  }
  #bios-wrapper{
    width:100%;
    max-width:960px;
    background:#0a0f3a;
    border:2px solid #5c6bc0;
    border-radius:4px;
    overflow:hidden;
    box-shadow:0 0 40px rgba(26,35,126,0.6);
  }

  /* Title bar */
  #title-bar{
    background:#1a237e;
    text-align:center;
    padding:10px 0;
    font-size:16px;
    font-weight:bold;
    color:#fdd835;
    letter-spacing:2px;
    border-bottom:2px solid #5c6bc0;
  }

  /* Tab bar */
  #tab-bar{
    display:flex;
    background:#1a237e;
    border-bottom:2px solid #5c6bc0;
  }
  .tab{
    padding:8px 16px;
    cursor:pointer;
    color:#90caf9;
    font-size:13px;
    letter-spacing:1px;
    border-right:1px solid #303f9f;
    transition:background 0.15s;
  }
  .tab:hover{background:#283593;}
  .tab.active{
    background:#3949ab;
    color:#fdd835;
    font-weight:bold;
  }

  /* Main content area */
  #content-area{
    display:flex;
    min-height:380px;
  }

  /* Left: BIOS settings */
  #bios-panel{
    flex:1;
    padding:16px 20px;
    background:#0d1149;
    border-right:2px solid #5c6bc0;
  }

  /* Right: Task panel */
  #task-panel{
    width:240px;
    padding:14px 16px;
    background:#0a0e3a;
    font-size:12px;
  }
  #task-panel h3{
    color:#fdd835;
    font-size:14px;
    margin-bottom:12px;
    text-align:center;
    letter-spacing:1px;
    border-bottom:1px solid #5c6bc0;
    padding-bottom:8px;
  }
  .task-item{
    display:flex;
    align-items:flex-start;
    gap:8px;
    margin-bottom:10px;
    font-size:11.5px;
    line-height:1.4;
    color:#90caf9;
  }
  .task-check{
    flex-shrink:0;
    width:18px;
    height:18px;
    border:2px solid #5c6bc0;
    border-radius:3px;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:13px;
    margin-top:1px;
    transition:all 0.3s;
  }
  .task-check.done{
    background:#2e7d32;
    border-color:#4caf50;
    color:#fff;
  }
  .task-label.done{color:#4caf50;}
  #task-counter{
    text-align:center;
    margin-top:14px;
    padding-top:10px;
    border-top:1px solid #5c6bc0;
    color:#fdd835;
    font-size:13px;
    font-weight:bold;
  }

  /* Bottom bar */
  #bottom-bar{
    background:#1a237e;
    padding:8px 16px;
    font-size:11px;
    color:#90caf9;
    display:flex;
    gap:20px;
    flex-wrap:wrap;
    border-top:2px solid #5c6bc0;
    justify-content:center;
  }
  #bottom-bar span{color:#fdd835;}

  /* BIOS setting rows */
  .bios-row{
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:6px 10px;
    margin-bottom:2px;
    border-radius:2px;
  }
  .bios-row:hover{background:rgba(92,107,192,0.15);}
  .bios-label{color:#b0bec5;font-size:13px;}
  .bios-value{color:#e0e0e0;font-size:13px;}
  .bios-value.clickable{
    color:#4fc3f7;
    cursor:pointer;
    padding:2px 10px;
    border:1px solid #37474f;
    border-radius:2px;
    transition:all 0.15s;
  }
  .bios-value.clickable:hover{
    background:#1a237e;
    border-color:#4fc3f7;
    color:#fdd835;
  }
  .bios-value.highlight{color:#4caf50;border-color:#4caf50;}

  /* Section header */
  .section-header{
    color:#fdd835;
    font-size:13px;
    font-weight:bold;
    margin:12px 0 6px;
    padding-bottom:4px;
    border-bottom:1px dashed #5c6bc0;
    letter-spacing:1px;
  }
  .section-header:first-child{margin-top:0;}

  /* Boot order */
  .boot-entry{
    display:flex;
    align-items:center;
    gap:8px;
    padding:6px 10px;
    margin-bottom:3px;
    background:rgba(26,35,126,0.3);
    border-radius:2px;
    font-size:13px;
  }
  .boot-num{
    color:#fdd835;
    font-weight:bold;
    width:20px;
  }
  .boot-name{color:#e0e0e0;flex:1;}
  .boot-btn{
    background:#303f9f;
    color:#90caf9;
    border:1px solid #5c6bc0;
    padding:2px 8px;
    cursor:pointer;
    font-family:inherit;
    font-size:12px;
    border-radius:2px;
    transition:all 0.15s;
  }
  .boot-btn:hover{background:#3949ab;color:#fdd835;}
  .boot-btn:disabled{opacity:0.3;cursor:default;}

  /* Save & Exit items */
  .save-item{
    padding:8px 14px;
    margin-bottom:4px;
    color:#90caf9;
    cursor:pointer;
    border-radius:2px;
    font-size:13px;
    transition:background 0.15s;
  }
  .save-item:hover{background:#1a237e;color:#fdd835;}

  /* Password modal */
  #modal-overlay{
    display:none;
    position:fixed;
    top:0;left:0;right:0;bottom:0;
    background:rgba(0,0,0,0.7);
    z-index:100;
    justify-content:center;
    align-items:center;
  }
  #modal-overlay.show{display:flex;}
  #modal-box{
    background:#1a237e;
    border:2px solid #5c6bc0;
    padding:24px 30px;
    border-radius:4px;
    text-align:center;
    min-width:300px;
  }
  #modal-box h3{color:#fdd835;margin-bottom:14px;font-size:14px;}
  #modal-box input{
    background:#0d1149;
    border:1px solid #5c6bc0;
    color:#e0e0e0;
    padding:8px 12px;
    font-family:inherit;
    font-size:13px;
    width:100%;
    border-radius:2px;
    outline:none;
    margin-bottom:14px;
  }
  #modal-box input:focus{border-color:#4fc3f7;}
  .modal-btns{display:flex;gap:10px;justify-content:center;}
  .modal-btn{
    padding:6px 20px;
    font-family:inherit;
    font-size:12px;
    cursor:pointer;
    border-radius:2px;
    border:1px solid #5c6bc0;
    transition:all 0.15s;
  }
  .modal-btn.ok{background:#2e7d32;color:#fff;border-color:#4caf50;}
  .modal-btn.ok:hover{background:#388e3c;}
  .modal-btn.cancel{background:#303f9f;color:#90caf9;}
  .modal-btn.cancel:hover{background:#3949ab;color:#fdd835;}

  /* Date editor */
  #date-editor{
    display:none;
    position:fixed;
    top:0;left:0;right:0;bottom:0;
    background:rgba(0,0,0,0.7);
    z-index:100;
    justify-content:center;
    align-items:center;
  }
  #date-editor.show{display:flex;}
  #date-box{
    background:#1a237e;
    border:2px solid #5c6bc0;
    padding:24px 30px;
    border-radius:4px;
    text-align:center;
    min-width:320px;
  }
  #date-box h3{color:#fdd835;margin-bottom:14px;font-size:14px;}
  .date-fields{display:flex;gap:10px;justify-content:center;margin-bottom:14px;}
  .date-field{text-align:center;}
  .date-field label{display:block;color:#90caf9;font-size:11px;margin-bottom:4px;}
  .date-field input{
    background:#0d1149;
    border:1px solid #5c6bc0;
    color:#e0e0e0;
    padding:6px 4px;
    font-family:inherit;
    font-size:14px;
    width:70px;
    text-align:center;
    border-radius:2px;
    outline:none;
  }
  .date-field input:focus{border-color:#4fc3f7;}

  /* Completion overlay */
  #completion-overlay{
    display:none;
    position:fixed;
    top:0;left:0;right:0;bottom:0;
    background:rgba(0,0,0,0.85);
    z-index:200;
    justify-content:center;
    align-items:center;
  }
  #completion-overlay.show{display:flex;}
  #completion-box{
    background:#1a237e;
    border:3px solid #fdd835;
    padding:40px 50px;
    border-radius:8px;
    text-align:center;
    animation:popIn 0.4s ease;
  }
  @keyframes popIn{
    0%{transform:scale(0.5);opacity:0;}
    100%{transform:scale(1);opacity:1;}
  }
  #completion-box h2{color:#fdd835;font-size:22px;margin-bottom:10px;}
  #completion-box p{color:#4caf50;font-size:16px;margin-bottom:6px;}
  #completion-box .score{color:#fdd835;font-size:28px;margin:16px 0;}
  #completion-box .sub{color:#90caf9;font-size:13px;}
  #btn-quiz{
    margin-top:20px;padding:12px 32px;background:#fdd835;color:#0a0f3a;border:none;
    border-radius:6px;font-size:15px;font-weight:bold;cursor:pointer;font-family:inherit;
  }
  #btn-quiz:hover{background:#ffee58;}

  /* Post-sim quiz */
  #quiz-section{
    display:none;max-width:800px;margin:20px auto;padding:20px;
    font-family:-apple-system,BlinkMacSystemFont,sans-serif;
  }
  #quiz-section.show{display:block;}
  #quiz-section h2{color:#fdd835;text-align:center;margin-bottom:8px;font-size:20px;}
  #quiz-section .quiz-sub{color:#90caf9;text-align:center;margin-bottom:24px;font-size:14px;}
  .qq{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:16px;margin-bottom:16px;}
  .qq h3{color:#38bdf8;font-size:14px;margin-bottom:10px;}
  .qq .qopt{
    display:block;padding:10px 14px;margin:6px 0;background:#0f172a;border:1px solid #334155;
    border-radius:6px;cursor:pointer;color:#e2e8f0;font-size:13px;transition:border-color 0.2s;
  }
  .qq .qopt:hover{border-color:#64748b;}
  .qq .qopt.selected{border-color:#3b82f6;background:#1e3a5f;}
  .qq .qopt.correct{border-color:#22c55e;background:#14532d;}
  .qq .qopt.wrong{border-color:#ef4444;background:#450a0a;}
  .qq .qopt.disabled{pointer-events:none;opacity:0.7;}
  .qq .qopt.show-correct{border-color:#22c55e;background:#14532d;}
  .qq .qfb{margin-top:8px;padding:10px;border-radius:6px;font-size:12px;line-height:1.5;display:none;}
  .qq .qfb.show{display:block;}
  .qq .qfb.ok{background:#14532d;color:#86efac;}
  .qq .qfb.ko{background:#450a0a;color:#fca5a5;}
  #quiz-result{
    display:none;text-align:center;background:#1e293b;border:2px solid #fdd835;
    border-radius:8px;padding:24px;margin-top:16px;
  }
  #quiz-result.show{display:block;}
  #quiz-result h2{color:#fdd835;margin-bottom:4px;}
  #quiz-result .qr-score{color:#22c55e;font-size:28px;font-weight:bold;margin:8px 0;}
  #quiz-score-bar{
    position:fixed;bottom:0;left:0;right:0;background:#1e293b;border-top:1px solid #334155;
    padding:10px 20px;display:none;font-family:-apple-system,sans-serif;
    text-align:center;color:#94a3b8;font-size:13px;z-index:100;
  }
  #quiz-score-bar.show{display:block;}

  /* Confetti */
  .confetti{
    position:fixed;
    width:8px;height:8px;
    z-index:250;
    border-radius:1px;
    animation:confettiFall linear forwards;
  }
  @keyframes confettiFall{
    0%{opacity:1;transform:translateY(0) rotate(0deg);}
    100%{opacity:0;transform:translateY(100vh) rotate(720deg);}
  }
</style>
</head>
<body>

<div id="bios-wrapper">
  <div id="title-bar">AMI BIOS Setup Utility v2.65</div>

  <div id="tab-bar">
    <div class="tab active" data-tab="main" onclick="switchTab('main')">Main</div>
    <div class="tab" data-tab="advanced" onclick="switchTab('advanced')">Advanced</div>
    <div class="tab" data-tab="boot" onclick="switchTab('boot')">Boot</div>
    <div class="tab" data-tab="security" onclick="switchTab('security')">Security</div>
    <div class="tab" data-tab="saveexit" onclick="switchTab('saveexit')">Save &amp; Exit</div>
  </div>

  <div id="content-area">
    <div id="bios-panel"></div>

    <div id="task-panel">
      <h3>MISSIONI (5)</h3>
      <div class="task-item" id="task-1">
        <div class="task-check" id="check-1"></div>
        <div class="task-label" id="label-1">Imposta la data corrente</div>
      </div>
      <div class="task-item" id="task-2">
        <div class="task-check" id="check-2"></div>
        <div class="task-label" id="label-2">Cambia l'ordine di boot: USB prima di HDD</div>
      </div>
      <div class="task-item" id="task-3">
        <div class="task-check" id="check-3"></div>
        <div class="task-label" id="label-3">Abilita la virtualizzazione (Intel VT-x)</div>
      </div>
      <div class="task-item" id="task-4">
        <div class="task-check" id="check-4"></div>
        <div class="task-label" id="label-4">Abilita Secure Boot</div>
      </div>
      <div class="task-item" id="task-5">
        <div class="task-check" id="check-5"></div>
        <div class="task-label" id="label-5">Imposta una password supervisore</div>
      </div>
      <div id="task-counter">Completate: 0/5</div>
    </div>
  </div>

  <div id="bottom-bar">
    <div><span>\\u2190\\u2192</span> Seleziona Tab</div>
    <div><span>\\u2191\\u2193</span> Seleziona Voce</div>
    <div><span>Enter</span> Modifica</div>
    <div><span>+/-</span> Cambia Valore</div>
    <div><span>F10</span> Salva ed Esci</div>
  </div>
</div>

<!-- Password modal -->
<div id="modal-overlay">
  <div id="modal-box">
    <h3>Imposta Password Supervisore</h3>
    <input type="password" id="pw-input" placeholder="Inserisci password..." />
    <div class="modal-btns">
      <button class="modal-btn ok" onclick="confirmPassword()">Conferma</button>
      <button class="modal-btn cancel" onclick="closePasswordModal()">Annulla</button>
    </div>
  </div>
</div>

<!-- Date editor modal -->
<div id="date-editor">
  <div id="date-box">
    <h3>Imposta Data di Sistema</h3>
    <div class="date-fields">
      <div class="date-field">
        <label>Giorno</label>
        <input type="number" id="date-day" min="1" max="31" value="1" />
      </div>
      <div class="date-field">
        <label>Mese</label>
        <input type="number" id="date-month" min="1" max="12" value="1" />
      </div>
      <div class="date-field">
        <label>Anno</label>
        <input type="number" id="date-year" min="2000" max="2099" value="2020" />
      </div>
    </div>
    <div class="modal-btns">
      <button class="modal-btn ok" onclick="confirmDate()">Conferma</button>
      <button class="modal-btn cancel" onclick="closeDateEditor()">Annulla</button>
    </div>
  </div>
</div>

<!-- Completion overlay -->
<div id="completion-overlay">
  <div id="completion-box">
    <h2>CONFIGURAZIONE COMPLETATA!</h2>
    <p>Hai completato tutte le missioni del BIOS</p>
    <div class="score">5 / 5</div>
    <div class="sub">Tutte le impostazioni sono state configurate correttamente.</div>
    <button id="btn-quiz" onclick="startQuiz()">Verifica le tue conoscenze &rarr;</button>
  </div>
</div>

<!-- Post-simulation quiz -->
<div id="quiz-section">
  <h2>Verifica: cosa hai configurato?</h2>
  <p class="quiz-sub">Ora verifichiamo che tu abbia capito il significato delle operazioni appena eseguite nel BIOS.</p>

  <div class="qq" id="qq-1">
    <h3>1. Perche' e' importante abilitare Secure Boot nel BIOS?</h3>
    <div class="qopt" onclick="answerQ(1,'a')">a) Velocizza l'avvio del sistema operativo</div>
    <div class="qopt" onclick="answerQ(1,'b')">b) Impedisce l'esecuzione di bootloader e driver non firmati, proteggendo da rootkit e malware pre-boot</div>
    <div class="qopt" onclick="answerQ(1,'c')">c) Cripta l'intero disco rigido</div>
    <div class="qopt" onclick="answerQ(1,'d')">d) Blocca l'accesso a Internet durante l'avvio</div>
    <div class="qfb" id="fb-1"></div>
  </div>

  <div class="qq" id="qq-2">
    <h3>2. Cosa permette la virtualizzazione Intel VT-x una volta abilitata?</h3>
    <div class="qopt" onclick="answerQ(2,'a')">a) Aumenta la velocita' del processore del 50%</div>
    <div class="qopt" onclick="answerQ(2,'b')">b) Permette di eseguire macchine virtuali (VirtualBox, VMware, Hyper-V) con prestazioni hardware</div>
    <div class="qopt" onclick="answerQ(2,'c')">c) Abilita la connessione WiFi integrata</div>
    <div class="qopt" onclick="answerQ(2,'d')">d) Attiva il dual-boot automatico con Linux</div>
    <div class="qfb" id="fb-2"></div>
  </div>

  <div class="qq" id="qq-3">
    <h3>3. Quali rischi comporta NON impostare una password supervisore sul BIOS?</h3>
    <div class="qopt" onclick="answerQ(3,'a')">a) Il computer non si accende</div>
    <div class="qopt" onclick="answerQ(3,'b')">b) Chiunque abbia accesso fisico puo' modificare le impostazioni BIOS: cambiare boot order, disabilitare Secure Boot, avviare da USB e accedere ai dati</div>
    <div class="qopt" onclick="answerQ(3,'c')">c) Il sistema operativo si disinstalla automaticamente</div>
    <div class="qopt" onclick="answerQ(3,'d')">d) Nessun rischio, la password BIOS e' opzionale e inutile</div>
    <div class="qfb" id="fb-3"></div>
  </div>

  <div class="qq" id="qq-4">
    <h3>4. Perche' si cambia il boot order mettendo USB prima di HDD?</h3>
    <div class="qopt" onclick="answerQ(4,'a')">a) Per velocizzare l'avvio di Windows</div>
    <div class="qopt" onclick="answerQ(4,'b')">b) Per avviare il PC da una chiavetta USB (es. per installare un sistema operativo o avviare un tool di recovery)</div>
    <div class="qopt" onclick="answerQ(4,'c')">c) Per formattare automaticamente il disco</div>
    <div class="qfb" id="fb-4"></div>
  </div>

  <div class="qq" id="qq-5">
    <h3>5. Qual e' la differenza tra BIOS Legacy e UEFI?</h3>
    <div class="qopt" onclick="answerQ(5,'a')">a) Sono la stessa cosa con nomi diversi</div>
    <div class="qopt" onclick="answerQ(5,'b')">b) UEFI supporta dischi oltre 2 TB (GPT), avvio piu' rapido, Secure Boot e interfaccia grafica; il BIOS Legacy usa MBR ed e' limitato a 2 TB</div>
    <div class="qopt" onclick="answerQ(5,'c')">c) Il BIOS Legacy e' piu' moderno e sicuro di UEFI</div>
    <div class="qopt" onclick="answerQ(5,'d')">d) UEFI funziona solo su Mac, il BIOS solo su PC</div>
    <div class="qfb" id="fb-5"></div>
  </div>

  <div class="qq" id="qq-6">
    <h3>6. Un collega disabilita Secure Boot per installare un driver non firmato. Quale rischio introduce?</h3>
    <div class="qopt" onclick="answerQ(6,'a')">a) Il monitor non funzionera' piu'</div>
    <div class="qopt" onclick="answerQ(6,'b')">b) Il sistema diventa vulnerabile a bootkit e rootkit che possono caricarsi prima del sistema operativo, invisibili all'antivirus</div>
    <div class="qopt" onclick="answerQ(6,'c')">c) Il PC non si colleghera' piu' alla rete</div>
    <div class="qopt" onclick="answerQ(6,'d')">d) Nessun rischio, Secure Boot e' solo marketing</div>
    <div class="qfb" id="fb-6"></div>
  </div>

  <div id="quiz-result">
    <h2>Quiz Completato!</h2>
    <div class="qr-score" id="qr-score"></div>
    <p style="color:#90caf9;font-size:13px;">Ora sai non solo COME configurare il BIOS, ma PERCHE'.</p>
  </div>
</div>
<div id="quiz-score-bar">
  <span id="q-score-text">0 / 6</span> &nbsp;|&nbsp; <span id="q-progress">0 di 6 completate</span>
</div>

<script>
(function(){
  // State
  var state = {
    currentTab: 'main',
    systemDate: { day: 1, month: 1, year: 2020 },
    bootOrder: [
      'SATA HDD: Samsung 860 EVO',
      'USB: Kingston DataTraveler',
      'CD-ROM: ATAPI DVD',
      'Network: Realtek PXE'
    ],
    vtxEnabled: false,
    secureBootEnabled: false,
    supervisorPassword: '',
    tasks: [false, false, false, false, false]
  };

  // Tab switching
  window.switchTab = function(tab) {
    state.currentTab = tab;
    var tabs = document.querySelectorAll('.tab');
    tabs.forEach(function(t){ t.classList.remove('active'); });
    document.querySelector('.tab[data-tab="'+tab+'"]').classList.add('active');
    renderPanel();
  };

  function renderPanel() {
    var panel = document.getElementById('bios-panel');
    var html = '';

    switch(state.currentTab) {
      case 'main':
        html = renderMain();
        break;
      case 'advanced':
        html = renderAdvanced();
        break;
      case 'boot':
        html = renderBoot();
        break;
      case 'security':
        html = renderSecurity();
        break;
      case 'saveexit':
        html = renderSaveExit();
        break;
    }
    panel.innerHTML = html;
  }

  function row(label, value, extra) {
    extra = extra || '';
    return '<div class="bios-row"><span class="bios-label">' + label + '</span><span class="bios-value' + extra + '">' + value + '</span></div>';
  }

  function renderMain() {
    var dateStr = pad(state.systemDate.day) + '/' + pad(state.systemDate.month) + '/' + state.systemDate.year;
    var dateClass = state.tasks[0] ? ' highlight' : '';
    return '<div class="section-header">Informazioni Sistema</div>' +
      row('Versione BIOS', 'AMI v2.65') +
      row('Processore', 'Intel Core i7-12700K') +
      row('Memoria Installata', '16384 MB DDR4') +
      '<div class="section-header">Data e Ora</div>' +
      '<div class="bios-row"><span class="bios-label">Data di Sistema</span><span class="bios-value clickable' + dateClass + '" onclick="openDateEditor()">' + dateStr + '</span></div>' +
      row('Ora di Sistema', '14:30:00');
  }

  function renderAdvanced() {
    var vtLabel = state.vtxEnabled ? 'Enabled' : 'Disabled';
    var vtClass = state.vtxEnabled ? ' highlight' : '';
    return '<div class="section-header">Configurazione CPU</div>' +
      '<div class="bios-row"><span class="bios-label">Intel Virtualization Technology</span><span class="bios-value clickable' + vtClass + '" onclick="toggleVTx()">[' + vtLabel + ']</span></div>' +
      row('Intel VT-d', '[Enabled]') +
      row('CPU C-States', '[Auto]') +
      '<div class="section-header">Configurazione Storage</div>' +
      row('SATA Mode', '[AHCI]') +
      '<div class="section-header">Configurazione Ventole</div>' +
      row('Fan Control', '[Auto]');
  }

  function renderBoot() {
    var html = '<div class="section-header">Modalita\\u0300 di Boot</div>' +
      row('Boot Mode', '[UEFI]') +
      '<div class="section-header">Ordine di Boot</div>';

    for (var i = 0; i < state.bootOrder.length; i++) {
      var upDisabled = i === 0 ? ' disabled' : '';
      var downDisabled = i === state.bootOrder.length - 1 ? ' disabled' : '';
      html += '<div class="boot-entry">' +
        '<span class="boot-num">' + (i+1) + '.</span>' +
        '<span class="boot-name">' + state.bootOrder[i] + '</span>' +
        '<button class="boot-btn" onclick="moveBootUp(' + i + ')"' + upDisabled + '>\\u25B2</button>' +
        '<button class="boot-btn" onclick="moveBootDown(' + i + ')"' + downDisabled + '>\\u25BC</button>' +
        '</div>';
    }
    return html;
  }

  function renderSecurity() {
    var pwLabel = state.supervisorPassword ? 'Impostata' : 'Non Impostata';
    var pwClass = state.tasks[4] ? ' highlight' : '';
    var sbLabel = state.secureBootEnabled ? 'Enabled' : 'Disabled';
    var sbClass = state.secureBootEnabled ? ' highlight' : '';
    return '<div class="section-header">Password</div>' +
      '<div class="bios-row"><span class="bios-label">Supervisor Password</span><span class="bios-value clickable' + pwClass + '" onclick="openPasswordModal()">[' + pwLabel + ']</span></div>' +
      row('User Password', '[Non Impostata]') +
      '<div class="section-header">Secure Boot</div>' +
      '<div class="bios-row"><span class="bios-label">Secure Boot</span><span class="bios-value clickable' + sbClass + '" onclick="toggleSecureBoot()">[' + sbLabel + ']</span></div>' +
      row('Secure Boot Mode', '[Standard]') +
      row('TPM State', '[Enabled]');
  }

  function renderSaveExit() {
    return '<div class="section-header">Salvataggio</div>' +
      '<div class="save-item" onclick="showSaveMsg()">Salva Modifiche e Riavvia</div>' +
      '<div class="save-item" onclick="showSaveMsg()">Scarta Modifiche e Riavvia</div>' +
      '<div class="save-item" onclick="showSaveMsg()">Salva Modifiche</div>' +
      '<div class="save-item" onclick="showSaveMsg()">Scarta Modifiche</div>';
  }

  window.showSaveMsg = function() {
    alert('Questa e\\u0300 una simulazione. Le modifiche non vengono realmente salvate.');
  };

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  // Date editor
  window.openDateEditor = function() {
    document.getElementById('date-day').value = state.systemDate.day;
    document.getElementById('date-month').value = state.systemDate.month;
    document.getElementById('date-year').value = state.systemDate.year;
    document.getElementById('date-editor').classList.add('show');
  };

  window.closeDateEditor = function() {
    document.getElementById('date-editor').classList.remove('show');
  };

  window.confirmDate = function() {
    var d = parseInt(document.getElementById('date-day').value) || 1;
    var m = parseInt(document.getElementById('date-month').value) || 1;
    var y = parseInt(document.getElementById('date-year').value) || 2020;
    if (d < 1) d = 1; if (d > 31) d = 31;
    if (m < 1) m = 1; if (m > 12) m = 12;
    if (y < 2000) y = 2000; if (y > 2099) y = 2099;
    state.systemDate = { day: d, month: m, year: y };
    closeDateEditor();
    if (y >= 2025) completeTask(0);
    renderPanel();
  };

  // VT-x toggle
  window.toggleVTx = function() {
    state.vtxEnabled = !state.vtxEnabled;
    if (state.vtxEnabled) completeTask(2);
    renderPanel();
  };

  // Secure Boot toggle
  window.toggleSecureBoot = function() {
    state.secureBootEnabled = !state.secureBootEnabled;
    if (state.secureBootEnabled) completeTask(3);
    renderPanel();
  };

  // Boot order
  window.moveBootUp = function(idx) {
    if (idx <= 0) return;
    var tmp = state.bootOrder[idx];
    state.bootOrder[idx] = state.bootOrder[idx-1];
    state.bootOrder[idx-1] = tmp;
    checkBootOrder();
    renderPanel();
  };

  window.moveBootDown = function(idx) {
    if (idx >= state.bootOrder.length - 1) return;
    var tmp = state.bootOrder[idx];
    state.bootOrder[idx] = state.bootOrder[idx+1];
    state.bootOrder[idx+1] = tmp;
    checkBootOrder();
    renderPanel();
  };

  function checkBootOrder() {
    if (state.bootOrder[0].indexOf('USB') === 0) {
      completeTask(1);
    }
  }

  // Password modal
  window.openPasswordModal = function() {
    document.getElementById('pw-input').value = '';
    document.getElementById('modal-overlay').classList.add('show');
    setTimeout(function(){ document.getElementById('pw-input').focus(); }, 100);
  };

  window.closePasswordModal = function() {
    document.getElementById('modal-overlay').classList.remove('show');
  };

  window.confirmPassword = function() {
    var pw = document.getElementById('pw-input').value.trim();
    if (pw.length > 0) {
      state.supervisorPassword = pw;
      completeTask(4);
    }
    closePasswordModal();
    renderPanel();
  };

  // Task management
  function completeTask(idx) {
    if (state.tasks[idx]) return;
    state.tasks[idx] = true;
    updateTaskPanel();
  }

  function updateTaskPanel() {
    var done = 0;
    for (var i = 0; i < 5; i++) {
      var check = document.getElementById('check-' + (i+1));
      var label = document.getElementById('label-' + (i+1));
      if (state.tasks[i]) {
        check.textContent = '\\u2713';
        check.classList.add('done');
        label.classList.add('done');
        done++;
      } else {
        check.textContent = '';
        check.classList.remove('done');
        label.classList.remove('done');
      }
    }
    document.getElementById('task-counter').textContent = 'Completate: ' + done + '/5';

    if (done === 5) {
      setTimeout(showCompletion, 500);
    }
  }

  function showCompletion() {
    document.getElementById('completion-overlay').classList.add('show');
    spawnConfetti();
  }

  function spawnConfetti() {
    var colors = ['#fdd835','#4caf50','#2196f3','#f44336','#9c27b0','#ff9800','#00bcd4'];
    for (var i = 0; i < 60; i++) {
      (function(delay){
        setTimeout(function(){
          var el = document.createElement('div');
          el.className = 'confetti';
          el.style.left = (Math.random() * 100) + 'vw';
          el.style.top = '-10px';
          el.style.background = colors[Math.floor(Math.random() * colors.length)];
          el.style.width = (6 + Math.random() * 6) + 'px';
          el.style.height = (6 + Math.random() * 6) + 'px';
          el.style.animationDuration = (2 + Math.random() * 2) + 's';
          el.style.animationDelay = '0s';
          document.body.appendChild(el);
          setTimeout(function(){ if(el.parentNode) el.parentNode.removeChild(el); }, 4500);
        }, delay);
      })(i * 50);
    }
  }

  // Handle Enter key in password input
  document.getElementById('pw-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') confirmPassword();
  });

  // Handle Enter key in date editor
  document.getElementById('date-year').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') confirmDate();
  });

  // Initial render
  renderPanel();
  updateTaskPanel();
})();

// Quiz logic (global scope for onclick)
var qAnswers = {1:'b',2:'b',3:'b',4:'b',5:'b',6:'b'};
var qFeedback = {
  1: {ok:'Corretto! Secure Boot verifica la firma digitale di bootloader, kernel e driver prima di eseguirli. Questo impedisce a malware di tipo rootkit e bootkit di caricarsi prima del sistema operativo, dove sarebbero invisibili all\\'antivirus.',
      ko:'Sbagliato. Secure Boot non velocizza l\\'avvio e non cripta il disco. La sua funzione e\\' verificare che ogni componente software caricato all\\'avvio sia firmato digitalmente, bloccando bootloader e driver non autorizzati.'},
  2: {ok:'Corretto! Intel VT-x fornisce supporto hardware alla virtualizzazione, permettendo a hypervisor come VirtualBox, VMware e Hyper-V di eseguire macchine virtuali con prestazioni quasi native. Senza VT-x, la virtualizzazione e\\' molto piu\\' lenta o impossibile.',
      ko:'Sbagliato. VT-x non aumenta la velocita\\' del processore e non riguarda WiFi o dual-boot. E\\' una tecnologia che permette al processore di eseguire macchine virtuali in modo efficiente tramite un hypervisor.'},
  3: {ok:'Corretto! Senza password supervisore, chiunque abbia accesso fisico al PC puo\\' entrare nel BIOS e modificare qualsiasi impostazione: cambiare il boot order per avviare da USB, disabilitare Secure Boot, e potenzialmente accedere ai dati del disco. E\\' una delle prime misure di sicurezza fisica.',
      ko:'Sbagliato. La password BIOS e\\' tutt\\'altro che inutile. Protegge le impostazioni critiche del sistema: senza di essa un attaccante con accesso fisico puo\\' avviare il PC da USB, disabilitare Secure Boot e compromettere il sistema.'},
  4: {ok:'Corretto! Cambiare il boot order permette di avviare il PC da una chiavetta USB prima del disco interno. Questo e\\' necessario per installare un nuovo sistema operativo, avviare tool di recovery/diagnostica, o eseguire un live OS senza toccare il disco.',
      ko:'Sbagliato. Cambiare il boot order non velocizza Windows e non formatta il disco. Serve per scegliere da quale dispositivo il PC si avvia per primo — fondamentale per installazioni OS e recovery.'},
  5: {ok:'Corretto! UEFI e\\' il successore moderno del BIOS Legacy. Supporta dischi oltre 2 TB con GPT (il BIOS Legacy usa MBR, limitato a 2 TB), offre avvio piu\\' rapido, Secure Boot per la sicurezza, e spesso un\\'interfaccia grafica con supporto mouse. Il BIOS Legacy e\\' tecnologia anni \\'80.',
      ko:'Sbagliato. BIOS Legacy e UEFI sono molto diversi. UEFI e\\' lo standard moderno: supporta GPT (dischi oltre 2 TB), Secure Boot, avvio veloce e interfaccia grafica. Il BIOS Legacy usa MBR ed e\\' limitato.'},
  6: {ok:'Corretto! Disabilitare Secure Boot rimuove la verifica delle firme digitali all\\'avvio. Questo apre la porta a bootkit e rootkit: malware che si caricano prima del sistema operativo e dell\\'antivirus, rendendosi praticamente invisibili. E\\' un rischio serio in ambienti aziendali.',
      ko:'Sbagliato. Disabilitare Secure Boot e\\' un rischio concreto: senza la verifica delle firme, malware di tipo bootkit puo\\' inserirsi nel processo di avvio, caricandosi prima dell\\'antivirus e rimanendo invisibile al sistema operativo.'}
};
var qAnswered = {};
var qCorrect = 0;
var qTotal = 0;

function startQuiz() {
  document.getElementById('completion-overlay').classList.remove('show');
  document.getElementById('bios-wrapper').style.display = 'none';
  document.getElementById('quiz-section').classList.add('show');
  document.getElementById('quiz-score-bar').classList.add('show');
  window.scrollTo(0, 0);
}

function answerQ(n, val) {
  if (qAnswered[n]) return;
  qAnswered[n] = true;
  qTotal++;
  var correct = qAnswers[n];
  var isOk = val === correct;
  if (isOk) qCorrect++;

  var qq = document.getElementById('qq-' + n);
  var opts = qq.querySelectorAll('.qopt');
  opts.forEach(function(o) {
    o.classList.add('disabled');
    var ov = o.textContent.charAt(0);
    if (ov === val) o.classList.add(isOk ? 'correct' : 'wrong');
    if (ov === correct && !isOk) o.classList.add('show-correct');
  });

  var fb = document.getElementById('fb-' + n);
  fb.textContent = isOk ? qFeedback[n].ok : qFeedback[n].ko;
  fb.className = 'qfb show ' + (isOk ? 'ok' : 'ko');

  document.getElementById('q-score-text').textContent = qCorrect + ' / 6';
  document.getElementById('q-progress').textContent = qTotal + ' di 6 completate';

  if (qTotal === 6) {
    setTimeout(function() {
      var r = document.getElementById('quiz-result');
      r.classList.add('show');
      document.getElementById('qr-score').textContent = qCorrect + ' / 6';
    }, 600);
  }
}
</script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
