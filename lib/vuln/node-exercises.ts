import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Esercizi Node.js</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{
    background:#0f172a;
    font-family:'Segoe UI',system-ui,-apple-system,sans-serif;
    color:#e2e8f0;
    min-height:100vh;
    padding:20px;
  }
  .container{
    max-width:860px;
    margin:0 auto;
  }
  .header{
    text-align:center;
    margin-bottom:24px;
    padding:20px 0;
    border-bottom:2px solid #22c55e33;
  }
  .header h1{
    font-size:28px;
    color:#22c55e;
    margin-bottom:8px;
    display:flex;
    align-items:center;
    justify-content:center;
    gap:10px;
  }
  .header h1 .node-icon{
    display:inline-block;
    background:#22c55e;
    color:#0f172a;
    font-weight:900;
    font-size:14px;
    padding:4px 8px;
    border-radius:4px;
  }
  .header .subtitle{
    color:#94a3b8;
    font-size:14px;
  }
  .notice{
    background:#1e293b;
    border-left:4px solid #f59e0b;
    padding:12px 16px;
    margin-bottom:24px;
    border-radius:0 8px 8px 0;
    font-size:13px;
    color:#fbbf24;
    line-height:1.5;
  }
  .progress-bar{
    display:flex;
    gap:6px;
    margin-bottom:24px;
    flex-wrap:wrap;
  }
  .progress-dot{
    width:40px;
    height:6px;
    border-radius:3px;
    background:#334155;
    transition:background 0.3s;
    cursor:pointer;
  }
  .progress-dot.completed{
    background:#22c55e;
  }
  .progress-dot.active{
    background:#22c55e88;
    box-shadow:0 0 8px #22c55e44;
  }
  .exercise-card{
    background:#1e293b;
    border-radius:12px;
    padding:24px;
    margin-bottom:20px;
    border:1px solid #334155;
  }
  .exercise-num{
    display:inline-block;
    background:#22c55e22;
    color:#22c55e;
    font-size:12px;
    font-weight:700;
    padding:4px 10px;
    border-radius:12px;
    margin-bottom:12px;
    text-transform:uppercase;
    letter-spacing:0.5px;
  }
  .exercise-title{
    font-size:20px;
    font-weight:700;
    color:#f1f5f9;
    margin-bottom:8px;
  }
  .exercise-desc{
    color:#94a3b8;
    font-size:14px;
    line-height:1.6;
    margin-bottom:20px;
  }
  .editor-wrapper{
    position:relative;
    margin-bottom:16px;
  }
  .editor{
    width:100%;
    min-height:200px;
    background:#0f172a;
    color:#e2e8f0;
    border:1px solid #334155;
    border-radius:8px;
    padding:16px;
    font-family:'Fira Code','Cascadia Code','JetBrains Mono','Consolas',monospace;
    font-size:14px;
    line-height:1.7;
    resize:vertical;
    outline:none;
    tab-size:2;
    white-space:pre;
    overflow-wrap:normal;
    overflow-x:auto;
  }
  .editor:focus{
    border-color:#22c55e66;
    box-shadow:0 0 0 2px #22c55e22;
  }
  .btn-row{
    display:flex;
    gap:10px;
    flex-wrap:wrap;
    margin-bottom:16px;
  }
  .btn{
    padding:10px 24px;
    border:none;
    border-radius:8px;
    font-size:14px;
    font-weight:600;
    cursor:pointer;
    transition:all 0.2s;
  }
  .btn-verify{
    background:#22c55e;
    color:#0f172a;
  }
  .btn-verify:hover{
    background:#16a34a;
    transform:translateY(-1px);
  }
  .btn-reset{
    background:#334155;
    color:#94a3b8;
  }
  .btn-reset:hover{
    background:#475569;
    color:#e2e8f0;
  }
  .btn-next{
    background:#22c55e;
    color:#0f172a;
    display:none;
  }
  .btn-next:hover{
    background:#16a34a;
    transform:translateY(-1px);
  }
  .btn-next.visible{
    display:inline-block;
  }
  .btn-solution{
    background:transparent;
    color:#64748b;
    border:1px solid #334155;
    font-size:13px;
  }
  .btn-solution:hover{
    color:#94a3b8;
    border-color:#475569;
  }
  .checks{
    list-style:none;
    margin-top:16px;
  }
  .checks li{
    padding:8px 12px;
    font-size:13px;
    border-radius:6px;
    margin-bottom:4px;
    display:flex;
    align-items:center;
    gap:8px;
    background:#0f172a;
  }
  .checks li.pass{
    color:#4ade80;
  }
  .checks li.fail{
    color:#f87171;
  }
  .check-icon{
    font-size:16px;
    flex-shrink:0;
  }
  .all-done{
    display:none;
    text-align:center;
    padding:40px 20px;
    background:#1e293b;
    border-radius:12px;
    border:1px solid #22c55e44;
  }
  .all-done.visible{
    display:block;
  }
  .all-done h2{
    color:#22c55e;
    font-size:24px;
    margin-bottom:12px;
  }
  .all-done p{
    color:#94a3b8;
    font-size:15px;
  }
  .score-badge{
    display:inline-block;
    background:#22c55e22;
    color:#22c55e;
    font-size:14px;
    font-weight:600;
    padding:6px 16px;
    border-radius:20px;
    margin-left:auto;
  }
  .header-row{
    display:flex;
    align-items:center;
    justify-content:space-between;
    margin-bottom:12px;
    flex-wrap:wrap;
    gap:8px;
  }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1><span class="node-icon">N</span> Esercizi Node.js</h1>
    <p class="subtitle">Pratica di programmazione server-side con Node.js</p>
  </div>

  <div class="notice">
    Nota: il codice viene validato sulla struttura e i pattern, non eseguito &mdash; Node.js non gira nel browser. Ogni esercizio verifica che il tuo codice contenga gli elementi richiesti.
  </div>

  <div class="progress-bar" id="progressBar"></div>

  <div id="exerciseArea"></div>

  <div class="all-done" id="allDone">
    <h2>Tutti gli esercizi completati!</h2>
    <p>Hai dimostrato di conoscere i fondamenti di Node.js: moduli, server HTTP, Express, file system e async/await.</p>
  </div>
</div>

<script>
(function(){
  var exercises = [
    {
      title: "Importa il modulo fs e leggi un file",
      desc: "Scrivi il codice per importare il modulo fs di Node.js e leggere il contenuto di un file 'data.txt' in modo sincrono, salvandolo in una variabile 'contenuto'.",
      starter: "// Importa il modulo fs\\n\\n// Leggi il file 'data.txt' in modo sincrono\\n",
      solution: "const fs = require('fs');\\nconst contenuto = fs.readFileSync('data.txt', 'utf-8');",
      checks: [
        { label: "Importazione modulo fs", test: function(c){ return /require\\s*\\(\\s*['\"]fs['\"]\\s*\\)/.test(c) || /import\\s+.*from\\s+['\"]fs['\"]/.test(c); } },
        { label: "Uso di readFileSync", test: function(c){ return /readFileSync/.test(c); } },
        { label: "Riferimento al file 'data.txt'", test: function(c){ return /data\\.txt/.test(c); } },
        { label: "Assegnazione a una variabile", test: function(c){ return /(const|let|var)\\s+\\w+\\s*=.*readFileSync/.test(c); } }
      ]
    },
    {
      title: "Crea un server HTTP base",
      desc: "Crea un server HTTP che risponde 'Ciao dal server!' su porta 3000.",
      starter: "const http = require('http');\\n\\n// Crea il server\\n\\n// Metti in ascolto sulla porta 3000\\n",
      solution: "const http = require('http');\\n\\nconst server = http.createServer(function(req, res) {\\n  res.end('Ciao dal server!');\\n});\\n\\nserver.listen(3000);",
      checks: [
        { label: "Uso di createServer", test: function(c){ return /createServer/.test(c); } },
        { label: "Risposta con testo 'Ciao'", test: function(c){ return /Ciao/.test(c) && /(res\\.end|res\\.write)/.test(c); } },
        { label: "Ascolto sulla porta 3000", test: function(c){ return /\\.listen\\s*\\(\\s*3000/.test(c); } }
      ]
    },
    {
      title: "Esporta una funzione da un modulo",
      desc: "Crea un modulo che esporta una funzione 'somma' che accetta due parametri e ritorna la loro somma.",
      starter: "// Definisci la funzione somma\\n\\n// Esporta il modulo\\n",
      solution: "function somma(a, b) {\\n  return a + b;\\n}\\n\\nmodule.exports = somma;",
      checks: [
        { label: "Definizione della funzione somma", test: function(c){ return /function\\s+somma/.test(c) || /(const|let|var)\\s+somma\\s*=/.test(c); } },
        { label: "La funzione accetta parametri", test: function(c){ return /somma\\s*[=:]?\\s*[\\(]?\\s*function\\s*\\(\\s*\\w+\\s*,\\s*\\w+/.test(c) || /function\\s+somma\\s*\\(\\s*\\w+\\s*,\\s*\\w+/.test(c) || /somma\\s*=\\s*\\(\\s*\\w+\\s*,\\s*\\w+/.test(c); } },
        { label: "Return della somma", test: function(c){ return /return/.test(c); } },
        { label: "Esportazione del modulo", test: function(c){ return /module\\.exports/.test(c) || /export\\s+(default|function|const)/.test(c); } }
      ]
    },
    {
      title: "Scrivi un endpoint Express GET",
      desc: "Usando Express, crea un'app con una route GET su '/api/utenti' che risponde con un JSON array di utenti.",
      starter: "const express = require('express');\\nconst app = express();\\n\\n// Crea la route GET /api/utenti\\n\\napp.listen(3000);\\n",
      solution: "const express = require('express');\\nconst app = express();\\n\\napp.get('/api/utenti', function(req, res) {\\n  res.json([{ nome: 'Mario' }, { nome: 'Luigi' }]);\\n});\\n\\napp.listen(3000);",
      checks: [
        { label: "Uso di app.get()", test: function(c){ return /app\\.get\\s*\\(/.test(c); } },
        { label: "Route /api/utenti", test: function(c){ return /\\/api\\/utenti/.test(c); } },
        { label: "Risposta con res.json() o res.send()", test: function(c){ return /res\\.json\\s*\\(/.test(c) || /res\\.send\\s*\\(/.test(c); } },
        { label: "Array nella risposta", test: function(c){ return /\\[/.test(c) && (/(res\\.json|res\\.send)/.test(c)); } }
      ]
    },
    {
      title: "Leggi un file JSON e parsalo",
      desc: "Leggi il file 'config.json' e parsalo in un oggetto JavaScript. Stampa il valore della chiave 'porta'.",
      starter: "const fs = require('fs');\\n\\n// Leggi e parsa config.json\\n\\n// Stampa il valore di 'porta'\\n",
      solution: "const fs = require('fs');\\n\\nconst data = fs.readFileSync('config.json', 'utf-8');\\nconst config = JSON.parse(data);\\nconsole.log(config.porta);",
      checks: [
        { label: "Lettura del file (readFileSync o readFile)", test: function(c){ return /readFileSync/.test(c) || /readFile/.test(c); } },
        { label: "Parsing JSON con JSON.parse()", test: function(c){ return /JSON\\.parse/.test(c); } },
        { label: "Uso di console.log()", test: function(c){ return /console\\.log/.test(c); } },
        { label: "Riferimento alla chiave 'porta'", test: function(c){ return /porta/.test(c) && /console\\.log/.test(c); } }
      ]
    },
    {
      title: "Funzione asincrona con async/await",
      desc: "Scrivi una funzione asincrona 'caricaDati' che usa await per leggere un file e ritorna il contenuto parsato come JSON.",
      starter: "const fs = require('fs').promises;\\n\\n// Scrivi la funzione asincrona caricaDati\\n",
      solution: "const fs = require('fs').promises;\\n\\nasync function caricaDati() {\\n  const data = await fs.readFile('dati.json', 'utf-8');\\n  return JSON.parse(data);\\n}",
      checks: [
        { label: "Uso della keyword async", test: function(c){ return /async/.test(c); } },
        { label: "Uso di await", test: function(c){ return /await/.test(c); } },
        { label: "Lettura file (readFile)", test: function(c){ return /readFile/.test(c); } },
        { label: "Parsing con JSON.parse()", test: function(c){ return /JSON\\.parse/.test(c); } },
        { label: "Return del risultato", test: function(c){ return /return/.test(c); } }
      ]
    }
  ];

  var completed = [];
  var currentEx = 0;

  function renderProgress(){
    var bar = document.getElementById("progressBar");
    bar.innerHTML = "";
    for(var i = 0; i < exercises.length; i++){
      var dot = document.createElement("div");
      dot.className = "progress-dot";
      if(completed.indexOf(i) !== -1) dot.className += " completed";
      if(i === currentEx && completed.indexOf(i) === -1) dot.className += " active";
      dot.setAttribute("data-idx", i);
      dot.addEventListener("click", function(){
        var idx = parseInt(this.getAttribute("data-idx"));
        currentEx = idx;
        renderExercise();
      });
      bar.appendChild(dot);
    }
  }

  function renderExercise(){
    var area = document.getElementById("exerciseArea");
    var done = document.getElementById("allDone");

    if(completed.length === exercises.length){
      area.innerHTML = "";
      done.className = "all-done visible";
      renderProgress();
      return;
    }

    done.className = "all-done";
    var ex = exercises[currentEx];
    var starterCode = ex.starter.replace(/\\\\n/g, "\\n");

    var h = '<div class="exercise-card">';
    h += '<div class="header-row">';
    h += '<span class="exercise-num">Esercizio ' + (currentEx + 1) + ' / ' + exercises.length + '</span>';
    h += '<span class="score-badge">' + completed.length + ' / ' + exercises.length + ' completati</span>';
    h += '</div>';
    h += '<h2 class="exercise-title">' + ex.title + '</h2>';
    h += '<p class="exercise-desc">' + ex.desc + '</p>';
    h += '<div class="editor-wrapper">';
    h += '<textarea class="editor" id="codeEditor" spellcheck="false">' + starterCode + '</textarea>';
    h += '</div>';
    h += '<div class="btn-row">';
    h += '<button class="btn btn-verify" id="btnVerify">Verifica</button>';
    h += '<button class="btn btn-reset" id="btnReset">Reset</button>';
    h += '<button class="btn btn-solution" id="btnSolution">Mostra soluzione</button>';
    h += '<button class="btn btn-next" id="btnNext">Prossimo \\u2192</button>';
    h += '</div>';
    h += '<ul class="checks" id="checksList"></ul>';
    h += '</div>';

    area.innerHTML = h;
    renderProgress();

    document.getElementById("btnVerify").addEventListener("click", function(){
      verify();
    });
    document.getElementById("btnReset").addEventListener("click", function(){
      document.getElementById("codeEditor").value = starterCode;
      document.getElementById("checksList").innerHTML = "";
      document.getElementById("btnNext").className = "btn btn-next";
    });
    document.getElementById("btnSolution").addEventListener("click", function(){
      document.getElementById("codeEditor").value = ex.solution.replace(/\\\\n/g, "\\n");
    });
    document.getElementById("btnNext").addEventListener("click", function(){
      currentEx = (currentEx + 1) % exercises.length;
      while(completed.indexOf(currentEx) !== -1 && completed.length < exercises.length){
        currentEx = (currentEx + 1) % exercises.length;
      }
      renderExercise();
    });

    // Handle Tab in textarea
    document.getElementById("codeEditor").addEventListener("keydown", function(e){
      if(e.key === "Tab"){
        e.preventDefault();
        var s = this.selectionStart;
        var end = this.selectionEnd;
        this.value = this.value.substring(0, s) + "  " + this.value.substring(end);
        this.selectionStart = this.selectionEnd = s + 2;
      }
    });
  }

  function verify(){
    var ex = exercises[currentEx];
    var code = document.getElementById("codeEditor").value;
    var list = document.getElementById("checksList");
    list.innerHTML = "";
    var allPass = true;
    for(var i = 0; i < ex.checks.length; i++){
      var ch = ex.checks[i];
      var pass = ch.test(code);
      if(!pass) allPass = false;
      var li = document.createElement("li");
      li.className = pass ? "pass" : "fail";
      var icon = pass ? "\\u2705" : "\\u274c";
      li.innerHTML = '<span class="check-icon">' + icon + '</span> ' + ch.label;
      list.appendChild(li);
    }
    if(allPass){
      if(completed.indexOf(currentEx) === -1) completed.push(currentEx);
      document.getElementById("btnNext").className = "btn btn-next visible";
      renderProgress();
    }
  }

  renderExercise();
})();
</script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
