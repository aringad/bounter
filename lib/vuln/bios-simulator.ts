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
  </div>
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
</script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
