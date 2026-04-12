import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Configuratore VM Interattivo</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{
  background:#0f172a;
  font-family:'Segoe UI',system-ui,-apple-system,sans-serif;
  color:#e2e8f0;
  min-height:100vh;
  display:flex;
  justify-content:center;
  align-items:flex-start;
  padding:20px;
}
#app{
  width:100%;
  max-width:700px;
  margin:0 auto;
}
.header{
  background:#1e293b;
  border-radius:12px;
  padding:20px 24px;
  margin-bottom:16px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  border:1px solid #334155;
}
.header h1{
  font-size:1.25rem;
  font-weight:700;
  color:#f1f5f9;
}
.header .badge{
  background:#3b82f6;
  color:#fff;
  padding:4px 14px;
  border-radius:20px;
  font-size:0.85rem;
  font-weight:600;
}
.scenario-card{
  background:#1e293b;
  border-radius:12px;
  padding:24px;
  margin-bottom:16px;
  border:1px solid #334155;
}
.scenario-card .label{
  font-size:0.75rem;
  text-transform:uppercase;
  letter-spacing:1px;
  color:#94a3b8;
  margin-bottom:8px;
}
.scenario-card .desc{
  font-size:1.1rem;
  color:#f1f5f9;
  line-height:1.5;
}
.config-panel{
  background:#1e293b;
  border-radius:12px;
  padding:24px;
  margin-bottom:16px;
  border:1px solid #334155;
}
.config-row{
  margin-bottom:20px;
}
.config-row:last-child{
  margin-bottom:0;
}
.config-row label{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:8px;
  font-size:0.9rem;
  color:#cbd5e1;
  font-weight:500;
}
.config-row label .val{
  background:#0f172a;
  padding:2px 10px;
  border-radius:6px;
  font-weight:700;
  color:#3b82f6;
  font-size:0.95rem;
  min-width:50px;
  text-align:center;
}
input[type=range]{
  -webkit-appearance:none;
  appearance:none;
  width:100%;
  height:8px;
  border-radius:4px;
  background:#334155;
  outline:none;
  cursor:pointer;
}
input[type=range]::-webkit-slider-thumb{
  -webkit-appearance:none;
  appearance:none;
  width:22px;
  height:22px;
  border-radius:50%;
  background:#3b82f6;
  cursor:pointer;
  border:3px solid #1e293b;
  box-shadow:0 0 0 2px #3b82f6;
  transition:transform 0.15s;
}
input[type=range]::-webkit-slider-thumb:hover{
  transform:scale(1.15);
}
input[type=range]::-moz-range-thumb{
  width:22px;
  height:22px;
  border-radius:50%;
  background:#3b82f6;
  cursor:pointer;
  border:3px solid #1e293b;
  box-shadow:0 0 0 2px #3b82f6;
}
select{
  width:100%;
  padding:10px 14px;
  border-radius:8px;
  background:#0f172a;
  color:#e2e8f0;
  border:1px solid #475569;
  font-size:0.95rem;
  cursor:pointer;
  outline:none;
  transition:border-color 0.2s;
}
select:focus{
  border-color:#3b82f6;
}
.btn{
  display:block;
  width:100%;
  padding:14px;
  border:none;
  border-radius:10px;
  font-size:1rem;
  font-weight:700;
  cursor:pointer;
  transition:all 0.2s;
  margin-bottom:8px;
}
.btn-primary{
  background:#3b82f6;
  color:#fff;
}
.btn-primary:hover{
  background:#2563eb;
  transform:translateY(-1px);
}
.btn-primary:disabled{
  background:#475569;
  cursor:not-allowed;
  transform:none;
}
.btn-next{
  background:#10b981;
  color:#fff;
}
.btn-next:hover{
  background:#059669;
  transform:translateY(-1px);
}
.feedback-area{
  background:#1e293b;
  border-radius:12px;
  padding:20px 24px;
  margin-bottom:16px;
  border:1px solid #334155;
  display:none;
}
.feedback-item{
  display:flex;
  align-items:flex-start;
  gap:10px;
  padding:10px 0;
  border-bottom:1px solid #334155;
}
.feedback-item:last-child{
  border-bottom:none;
}
.feedback-icon{
  font-size:1.2rem;
  flex-shrink:0;
  margin-top:2px;
}
.feedback-ok .feedback-icon{color:#10b981;}
.feedback-warn .feedback-icon{color:#f59e0b;}
.feedback-bad .feedback-icon{color:#ef4444;}
.feedback-text{
  font-size:0.9rem;
  line-height:1.5;
}
.feedback-text strong{
  color:#f1f5f9;
}
.score-bar{
  background:#1e293b;
  border-radius:12px;
  padding:16px 24px;
  border:1px solid #334155;
  display:flex;
  justify-content:space-between;
  align-items:center;
}
.score-bar .score-text{
  font-size:0.95rem;
  color:#94a3b8;
}
.score-bar .score-text span{
  color:#3b82f6;
  font-weight:700;
}
.dots{
  display:flex;
  gap:8px;
}
.dot{
  width:12px;
  height:12px;
  border-radius:50%;
  background:#334155;
  transition:background 0.3s;
}
.dot.pass{background:#10b981;}
.dot.fail{background:#ef4444;}
.dot.current{background:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,0.3);}
.final-screen{
  background:#1e293b;
  border-radius:12px;
  padding:40px 24px;
  text-align:center;
  border:1px solid #334155;
}
.final-screen .big-score{
  font-size:3.5rem;
  font-weight:800;
  color:#3b82f6;
  margin-bottom:8px;
}
.final-screen .subtitle{
  font-size:1.1rem;
  color:#94a3b8;
  margin-bottom:24px;
}
.final-screen .message{
  font-size:1rem;
  color:#cbd5e1;
  line-height:1.6;
  margin-bottom:24px;
}
.summary-list{
  text-align:left;
  margin:0 auto 24px;
  max-width:500px;
}
.summary-item{
  display:flex;
  align-items:center;
  gap:10px;
  padding:8px 0;
  border-bottom:1px solid #334155;
  font-size:0.9rem;
}
.summary-item:last-child{border-bottom:none;}
.btn-restart{
  background:#3b82f6;
  color:#fff;
  display:inline-block;
  width:auto;
  padding:12px 32px;
}
.btn-restart:hover{
  background:#2563eb;
}
.hidden{display:none!important;}
</style>
</head>
<body>
<div id="app">
  <div class="header">
    <h1>Configuratore VM</h1>
    <div class="badge" id="scenarioCounter">Scenario 1 di 5</div>
  </div>

  <div id="gameArea">
    <div class="scenario-card">
      <div class="label">Scenario</div>
      <div class="desc" id="scenarioDesc"></div>
    </div>

    <div class="config-panel" id="configPanel">
      <div class="config-row">
        <label>CPU Cores <span class="val" id="cpuVal">2</span></label>
        <input type="range" id="cpuSlider" min="1" max="16" value="2" step="1">
      </div>
      <div class="config-row">
        <label>RAM (GB) <span class="val" id="ramVal">4</span></label>
        <input type="range" id="ramSlider" min="1" max="64" value="4" step="1">
      </div>
      <div class="config-row">
        <label>Disco (GB) <span class="val" id="diskVal">40</span></label>
        <input type="range" id="diskSlider" min="10" max="500" value="40" step="5">
      </div>
      <div class="config-row">
        <label>Tipo disco</label>
        <select id="diskType">
          <option value="HDD">HDD</option>
          <option value="SSD">SSD</option>
        </select>
      </div>
      <div class="config-row">
        <label>Rete</label>
        <select id="netType">
          <option value="NAT">NAT</option>
          <option value="Bridged">Bridged</option>
          <option value="Host-only">Host-only</option>
        </select>
      </div>
    </div>

    <button class="btn btn-primary" id="btnSubmit" onclick="submitConfig()">Crea VM</button>
    <button class="btn btn-next hidden" id="btnNext" onclick="nextScenario()">Prossimo scenario &rarr;</button>

    <div class="feedback-area" id="feedbackArea"></div>
  </div>

  <div id="finalScreen" class="final-screen hidden"></div>

  <div class="score-bar" id="scoreBar">
    <div class="score-text">Punteggio: <span id="scoreNum">0</span>/5 scenari completati</div>
    <div class="dots" id="dots">
      <div class="dot current"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  </div>
</div>

<script>
const scenarios = [
  {
    desc: "Desktop Ubuntu leggero per navigazione web e documenti di testo",
    check: {
      cpu: (v) => {
        if(v>=1&&v<=2) return {s:'ok',m:'CPU: OK - '+v+' core sono sufficienti per un desktop leggero con navigazione e documenti.'};
        if(v>=3&&v<=4) return {s:'warn',m:'CPU: Accettabile - '+v+' core funzionano, ma sono pi\\u00f9 del necessario per un uso leggero. 2 core bastano.'};
        return {s:'bad',m:'CPU: Eccessivo! '+v+' core sono troppi per un semplice desktop Ubuntu leggero. 1-2 core sono sufficienti.'};
      },
      ram: (v) => {
        if(v<2) return {s:'bad',m:'RAM: Insufficiente! '+v+' GB non basta per Ubuntu con browser e documenti. Servono almeno 2 GB.'};
        if(v>=2&&v<=4) return {s:'ok',m:'RAM: OK - '+v+' GB sono ideali per un desktop Ubuntu leggero.'};
        if(v>=5&&v<=8) return {s:'warn',m:'RAM: Accettabile - '+v+' GB funzionano ma sono pi\\u00f9 del necessario. 2-4 GB bastano.'};
        return {s:'bad',m:'RAM: Eccessivo! '+v+' GB sono troppi per un desktop leggero. 2-4 GB sono sufficienti.'};
      },
      disk: (v) => {
        if(v<20) return {s:'bad',m:'Disco: Insufficiente! '+v+' GB sono troppo pochi. Ubuntu + applicazioni richiedono almeno 20-25 GB.'};
        if(v>=20&&v<=50) return {s:'ok',m:'Disco: OK - '+v+' GB sono adeguati per Ubuntu desktop con documenti.'};
        if(v>=51&&v<=100) return {s:'warn',m:'Disco: Accettabile - '+v+' GB vanno bene ma sono generosi per un uso leggero.'};
        return {s:'bad',m:'Disco: Eccessivo! '+v+' GB sono troppi per un desktop leggero. 25-50 GB sono sufficienti.'};
      },
      diskType: (v) => {
        if(v==='SSD') return {s:'ok',m:'Tipo disco: OK - SSD garantisce reattivit\\u00e0 ottimale per il desktop.'};
        return {s:'warn',m:'Tipo disco: Accettabile - HDD funziona per un uso leggero, ma SSD migliora notevolmente l\\u2019esperienza utente.'};
      },
      net: (v) => {
        if(v==='NAT') return {s:'ok',m:'Rete: OK - NAT \\u00e8 la scelta pi\\u00f9 semplice e sicura per un desktop con accesso a internet.'};
        if(v==='Bridged') return {s:'warn',m:'Rete: Accettabile - Bridged funziona ma NAT \\u00e8 pi\\u00f9 semplice per un desktop personale.'};
        return {s:'bad',m:'Rete: Errato! Host-only non fornisce accesso a internet. Per navigare serve NAT o Bridged.'};
      }
    }
  },
  {
    desc: "Windows 11 per ufficio con Microsoft Office e browser multipli",
    check: {
      cpu: (v) => {
        if(v<2) return {s:'bad',m:'CPU: Insufficiente! 1 core \\u00e8 troppo poco per Windows 11. Microsoft richiede almeno 2 core.'};
        if(v>=2&&v<=4) return {s:'ok',m:'CPU: OK - '+v+' core sono ideali per Windows 11 con Office e browser.'};
        if(v>=5&&v<=6) return {s:'warn',m:'CPU: Accettabile - '+v+' core funzionano ma sono pi\\u00f9 del necessario per uso ufficio.'};
        return {s:'bad',m:'CPU: Eccessivo! '+v+' core sono troppi per un uso da ufficio. 2-4 core bastano.'};
      },
      ram: (v) => {
        if(v<4) return {s:'bad',m:'RAM: Insufficiente! '+v+' GB sono troppo pochi. Windows 11 richiede almeno 4 GB, consigliati 8 GB per un uso fluido con Office.'};
        if(v>=4&&v<=8) return {s:'ok',m:'RAM: OK - '+v+' GB sono adeguati per Windows 11 con Office e browser.'};
        if(v>=9&&v<=16) return {s:'warn',m:'RAM: Accettabile - '+v+' GB vanno bene ma sono pi\\u00f9 del necessario per uso ufficio.'};
        return {s:'bad',m:'RAM: Eccessivo! '+v+' GB sono troppi per un semplice uso da ufficio.'};
      },
      disk: (v) => {
        if(v<40) return {s:'bad',m:'Disco: Insufficiente! '+v+' GB sono troppo pochi. Windows 11 da solo occupa circa 30 GB, pi\\u00f9 Office servono almeno 60 GB.'};
        if(v>=40&&v<=100) return {s:'ok',m:'Disco: OK - '+v+' GB sono adeguati per Windows 11 con Office e documenti.'};
        if(v>=101&&v<=150) return {s:'warn',m:'Disco: Accettabile - '+v+' GB sono generosi ma ragionevoli.'};
        return {s:'bad',m:'Disco: Eccessivo! '+v+' GB sono troppi per uso ufficio. 60-100 GB sono sufficienti.'};
      },
      diskType: (v) => {
        if(v==='SSD') return {s:'ok',m:'Tipo disco: OK - SSD \\u00e8 fortemente consigliato per Windows 11, che \\u00e8 molto lento su HDD.'};
        return {s:'bad',m:'Tipo disco: Sconsigliato! Windows 11 su HDD \\u00e8 estremamente lento. SSD \\u00e8 praticamente obbligatorio.'};
      },
      net: (v) => {
        if(v==='NAT'||v==='Bridged') return {s:'ok',m:'Rete: OK - '+v+' \\u00e8 una scelta valida per un PC da ufficio con accesso a internet.'};
        return {s:'bad',m:'Rete: Errato! Host-only non fornisce accesso a internet. Per un ufficio serve NAT o Bridged.'};
      }
    }
  },
  {
    desc: "Server web Linux con Apache, PHP e MySQL per 50 utenti contemporanei",
    check: {
      cpu: (v) => {
        if(v<2) return {s:'bad',m:'CPU: Insufficiente! 1 core non basta per gestire Apache + PHP + MySQL con 50 utenti. Servono almeno 2-4 core.'};
        if(v>=2&&v<=4) return {s:'ok',m:'CPU: OK - '+v+' core sono adeguati per un web server con 50 utenti.'};
        if(v>=5&&v<=8) return {s:'warn',m:'CPU: Accettabile - '+v+' core funzionano, leggermente sovradimensionato per 50 utenti.'};
        return {s:'bad',m:'CPU: Eccessivo! '+v+' core sono troppi per 50 utenti. 2-4 core sono sufficienti.'};
      },
      ram: (v) => {
        if(v<4) return {s:'bad',m:'RAM: Insufficiente! '+v+' GB sono troppo pochi per Apache + PHP + MySQL. Ogni connessione occupa memoria.'};
        if(v>=4&&v<=16) return {s:'ok',m:'RAM: OK - '+v+' GB sono adeguati per il web stack con 50 utenti.'};
        if(v>=17&&v<=32) return {s:'warn',m:'RAM: Accettabile - '+v+' GB sono pi\\u00f9 del necessario per 50 utenti, ma possono servire per caching.'};
        return {s:'bad',m:'RAM: Eccessivo! '+v+' GB sono troppi per questo carico. 8-16 GB bastano.'};
      },
      disk: (v) => {
        if(v<50) return {s:'bad',m:'Disco: Insufficiente! '+v+' GB sono troppo pochi. SO + web server + database + log richiedono almeno 50 GB.'};
        if(v>=50&&v<=200) return {s:'ok',m:'Disco: OK - '+v+' GB sono adeguati per un web server con database.'};
        if(v>=201&&v<=300) return {s:'warn',m:'Disco: Accettabile - '+v+' GB sono generosi ma ragionevoli per crescita futura.'};
        return {s:'bad',m:'Disco: Eccessivo! '+v+' GB sono troppi per questo scenario. 50-200 GB bastano.'};
      },
      diskType: (v) => {
        if(v==='SSD') return {s:'ok',m:'Tipo disco: OK - SSD \\u00e8 essenziale per le performance del database MySQL e la reattivit\\u00e0 del server.'};
        return {s:'bad',m:'Tipo disco: Errato! HDD penalizza gravemente le query MySQL e i tempi di risposta del server. SSD \\u00e8 necessario.'};
      },
      net: (v) => {
        if(v==='Bridged') return {s:'ok',m:'Rete: OK - Bridged \\u00e8 necessario perch\\u00e9 il server deve essere raggiungibile dagli utenti sulla rete.'};
        if(v==='NAT') return {s:'bad',m:'Rete: Errato! Con NAT il server non \\u00e8 raggiungibile dall\\u2019esterno. Serve Bridged per un server web.'};
        return {s:'bad',m:'Rete: Errato! Host-only limita l\\u2019accesso alla sola macchina host. Serve Bridged per un server web.'};
      }
    }
  },
  {
    desc: "Database server PostgreSQL dedicato con 100 GB di dati e query intensive",
    check: {
      cpu: (v) => {
        if(v<4) return {s:'bad',m:'CPU: Insufficiente! '+v+' core sono pochi per query intensive su PostgreSQL. Servono almeno 4 core per parallelizzare le query.'};
        if(v>=4&&v<=8) return {s:'ok',m:'CPU: OK - '+v+' core sono adeguati per PostgreSQL con query intensive.'};
        if(v>=9&&v<=12) return {s:'warn',m:'CPU: Accettabile - '+v+' core sono generosi ma possono aiutare con query parallele.'};
        return {s:'bad',m:'CPU: Eccessivo! '+v+' core sono troppi. 4-8 core sono sufficienti per questo carico.'};
      },
      ram: (v) => {
        if(v<8) return {s:'bad',m:'RAM: Insufficiente! '+v+' GB sono troppo pochi per un DB server. PostgreSQL usa la RAM per cache e buffer delle query. Servono almeno 16 GB.'};
        if(v>=8&&v<=15) return {s:'warn',m:'RAM: Accettabile - '+v+' GB possono funzionare ma 16-32 GB sono consigliati per 100 GB di dati e query intensive.'};
        if(v>=16&&v<=32) return {s:'ok',m:'RAM: OK - '+v+' GB sono ideali. PostgreSQL sfruttar\\u00e0 la RAM per shared_buffers e cache del sistema operativo.'};
        if(v>=33&&v<=48) return {s:'warn',m:'RAM: Accettabile - '+v+' GB sono generosi ma possono migliorare le performance di caching.'};
        return {s:'bad',m:'RAM: Eccessivo! '+v+' GB sono troppi per questo scenario. 16-32 GB sono il range ideale.'};
      },
      disk: (v) => {
        if(v<200) return {s:'bad',m:'Disco: Insufficiente! Con 100 GB di dati servono almeno 200 GB per SO, WAL, backup e spazio di crescita.'};
        if(v>=200&&v<=500) return {s:'ok',m:'Disco: OK - '+v+' GB sono adeguati per 100 GB di dati pi\\u00f9 indici, WAL e spazio di crescita.'};
        return {s:'ok',m:'Disco: OK - '+v+' GB offrono ampio spazio.'};
      },
      diskType: (v) => {
        if(v==='SSD') return {s:'ok',m:'Tipo disco: OK - SSD \\u00e8 assolutamente essenziale per un database. HDD uccide le performance delle query I/O intensive.'};
        return {s:'bad',m:'Tipo disco: Errato! HDD \\u00e8 inaccettabile per un database server. Le operazioni I/O random su HDD sono 100x pi\\u00f9 lente che su SSD.'};
      },
      net: (v) => {
        if(v==='Bridged') return {s:'ok',m:'Rete: OK - Bridged permette alle applicazioni sulla rete di connettersi al database.'};
        if(v==='NAT') return {s:'bad',m:'Rete: Errato! Con NAT il database non \\u00e8 raggiungibile dalle applicazioni. Serve Bridged.'};
        return {s:'bad',m:'Rete: Parzialmente errato. Host-only limita l\\u2019accesso. Per un DB server in rete serve Bridged.'};
      }
    }
  },
  {
    desc: "Ambiente di test completamente isolato per analisi di malware e reverse engineering",
    check: {
      cpu: (v) => {
        if(v>=1&&v<=2) return {s:'ok',m:'CPU: OK - '+v+' core sono sufficienti per analisi malware. Non servono molte risorse.'};
        if(v>=3&&v<=4) return {s:'warn',m:'CPU: Accettabile - '+v+' core funzionano, ma 2 core bastano per l\\u2019analisi.'};
        return {s:'bad',m:'CPU: Eccessivo! '+v+' core sono troppi per un ambiente di test malware. 2 core bastano.'};
      },
      ram: (v) => {
        if(v<4) return {s:'bad',m:'RAM: Insufficiente! '+v+' GB sono troppo pochi. Servono almeno 4 GB per eseguire il malware e gli strumenti di analisi.'};
        if(v>=4&&v<=8) return {s:'ok',m:'RAM: OK - '+v+' GB sono adeguati per eseguire malware e tool di analisi come debugger e disassembler.'};
        if(v>=9&&v<=16) return {s:'warn',m:'RAM: Accettabile - '+v+' GB funzionano ma sono pi\\u00f9 del necessario per analisi malware.'};
        return {s:'bad',m:'RAM: Eccessivo! '+v+' GB sono troppi per un ambiente di test. 4-8 GB bastano.'};
      },
      disk: (v) => {
        if(v<30) return {s:'bad',m:'Disco: Insufficiente! '+v+' GB sono troppo pochi. Servono almeno 30 GB per SO + tool + campioni malware.'};
        if(v>=30&&v<=60) return {s:'ok',m:'Disco: OK - '+v+' GB sono adeguati per l\\u2019ambiente di analisi.'};
        if(v>=61&&v<=100) return {s:'warn',m:'Disco: Accettabile - '+v+' GB sono generosi per un ambiente di test.'};
        return {s:'bad',m:'Disco: Eccessivo! '+v+' GB sono troppi per un ambiente di test isolato. 30-60 GB bastano.'};
      },
      diskType: (v) => {
        if(v==='SSD') return {s:'ok',m:'Tipo disco: OK - SSD \\u00e8 una buona scelta per velocizzare l\\u2019analisi.'};
        return {s:'ok',m:'Tipo disco: OK - Per un ambiente di test il tipo di disco non \\u00e8 critico. Entrambi vanno bene.'};
      },
      net: (v) => {
        if(v==='Host-only') return {s:'ok',m:'Rete: OK - Host-only \\u00e8 ESSENZIALE! La VM \\u00e8 isolata dalla rete, il malware non pu\\u00f2 propagarsi o comunicare con server C&C.'};
        if(v==='NAT') return {s:'bad',m:'Rete: PERICOLOSO! NAT consente al malware di accedere a internet: potrebbe scaricare payload aggiuntivi, esfiltrare dati o contattare server C&C. Serve Host-only!'};
        return {s:'bad',m:'Rete: PERICOLOSO! Bridged espone la rete locale al malware, che potrebbe propagarsi ad altri computer. Serve Host-only per isolamento totale!'};
      }
    }
  }
];

let current = 0;
let score = 0;
let results = [];
let submitted = false;

function init() {
  loadScenario(0);
}

function loadScenario(idx) {
  submitted = false;
  document.getElementById('scenarioCounter').textContent = 'Scenario '+(idx+1)+' di 5';
  document.getElementById('scenarioDesc').textContent = scenarios[idx].desc;
  document.getElementById('cpuSlider').value = 2;
  document.getElementById('ramSlider').value = 4;
  document.getElementById('diskSlider').value = 40;
  document.getElementById('diskType').value = 'SSD';
  document.getElementById('netType').value = 'NAT';
  updateSliderDisplays();
  document.getElementById('feedbackArea').style.display = 'none';
  document.getElementById('feedbackArea').innerHTML = '';
  document.getElementById('btnSubmit').classList.remove('hidden');
  document.getElementById('btnSubmit').disabled = false;
  document.getElementById('btnNext').classList.add('hidden');
  document.getElementById('configPanel').style.opacity = '1';
  document.getElementById('configPanel').style.pointerEvents = 'auto';
  updateDots();
}

function updateSliderDisplays() {
  document.getElementById('cpuVal').textContent = document.getElementById('cpuSlider').value;
  document.getElementById('ramVal').textContent = document.getElementById('ramSlider').value;
  document.getElementById('diskVal').textContent = document.getElementById('diskSlider').value;
}

document.getElementById('cpuSlider').addEventListener('input', updateSliderDisplays);
document.getElementById('ramSlider').addEventListener('input', updateSliderDisplays);
document.getElementById('diskSlider').addEventListener('input', updateSliderDisplays);

function submitConfig() {
  if(submitted) return;
  submitted = true;
  const sc = scenarios[current];
  const cpu = parseInt(document.getElementById('cpuSlider').value);
  const ram = parseInt(document.getElementById('ramSlider').value);
  const disk = parseInt(document.getElementById('diskSlider').value);
  const dt = document.getElementById('diskType').value;
  const nt = document.getElementById('netType').value;

  const checks = [
    sc.check.cpu(cpu),
    sc.check.ram(ram),
    sc.check.disk(disk),
    sc.check.diskType(dt),
    sc.check.net(nt)
  ];

  const allOk = checks.every(c => c.s === 'ok' || c.s === 'warn');
  const noBad = checks.every(c => c.s !== 'bad');
  const passed = noBad;

  if(passed) score++;
  results.push(passed);

  const fb = document.getElementById('feedbackArea');
  fb.innerHTML = checks.map(c => {
    const cls = c.s === 'ok' ? 'feedback-ok' : c.s === 'warn' ? 'feedback-warn' : 'feedback-bad';
    const icon = c.s === 'ok' ? '\\u2705' : c.s === 'warn' ? '\\u26a0\\ufe0f' : '\\u274c';
    return '<div class="feedback-item '+cls+'"><span class="feedback-icon">'+icon+'</span><div class="feedback-text">'+c.m+'</div></div>';
  }).join('');
  fb.style.display = 'block';

  document.getElementById('btnSubmit').classList.add('hidden');
  document.getElementById('configPanel').style.opacity = '0.5';
  document.getElementById('configPanel').style.pointerEvents = 'none';
  document.getElementById('scoreNum').textContent = score;

  updateDots();

  if(current < 4) {
    document.getElementById('btnNext').classList.remove('hidden');
  } else {
    const btnFinal = document.createElement('button');
    btnFinal.className = 'btn btn-next';
    btnFinal.textContent = 'Vedi risultato finale';
    btnFinal.onclick = showFinal;
    document.getElementById('btnNext').classList.add('hidden');
    fb.appendChild(btnFinal);
  }
}

function nextScenario() {
  current++;
  loadScenario(current);
}

function updateDots() {
  const dots = document.querySelectorAll('.dot');
  dots.forEach((d, i) => {
    d.className = 'dot';
    if(i < results.length) {
      d.classList.add(results[i] ? 'pass' : 'fail');
    } else if(i === current) {
      d.classList.add('current');
    }
  });
}

function showFinal() {
  document.getElementById('gameArea').classList.add('hidden');
  document.getElementById('scoreBar').classList.add('hidden');
  const fs = document.getElementById('finalScreen');
  fs.classList.remove('hidden');

  let msg = '';
  if(score === 5) msg = 'Eccellente! Hai configurato tutte le VM in modo ottimale. Ottima comprensione delle risorse necessarie per ogni scenario.';
  else if(score >= 4) msg = 'Molto bene! Hai dimostrato una buona comprensione della configurazione delle VM. Rivedi lo scenario sbagliato per migliorare.';
  else if(score >= 3) msg = 'Discreto. Conosci le basi ma alcuni scenari richiedono pi\\u00f9 attenzione alle esigenze specifiche del workload.';
  else if(score >= 2) msg = 'Sufficiente. Rivedi i concetti di dimensionamento delle risorse e le modalit\\u00e0 di rete delle VM.';
  else msg = 'Da rivedere. Ti consiglio di approfondire i requisiti di sistema dei vari OS e workload, e le differenze tra le modalit\\u00e0 di rete.';

  const summaryItems = scenarios.map((sc, i) => {
    const icon = results[i] ? '\\u2705' : '\\u274c';
    const short = sc.desc.length > 60 ? sc.desc.substring(0,57)+'...' : sc.desc;
    return '<div class="summary-item"><span>'+icon+'</span><span>'+short+'</span></div>';
  }).join('');

  fs.innerHTML = '<div class="big-score">'+score+'/5</div>'
    +'<div class="subtitle">Scenari completati correttamente</div>'
    +'<div class="message">'+msg+'</div>'
    +'<div class="summary-list">'+summaryItems+'</div>'
    +'<button class="btn btn-restart" onclick="restart()">Ricomincia</button>';
}

function restart() {
  current = 0;
  score = 0;
  results = [];
  document.getElementById('scoreNum').textContent = '0';
  document.getElementById('gameArea').classList.remove('hidden');
  document.getElementById('scoreBar').classList.remove('hidden');
  document.getElementById('finalScreen').classList.add('hidden');
  loadScenario(0);
}

init();
</script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
