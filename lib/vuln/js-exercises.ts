import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Esercizi JavaScript</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{
    background:#0f172a;
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
    color:#e2e8f0;
    min-height:100vh;
    display:flex;
    justify-content:center;
    padding:20px;
  }
  #app{
    width:100%;
    max-width:800px;
  }
  .header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:16px 0;
    border-bottom:1px solid #334155;
    margin-bottom:24px;
  }
  .header h1{
    font-size:1.4rem;
    color:#38bdf8;
    font-family:'Courier New',monospace;
  }
  .header .counter{
    font-size:0.9rem;
    color:#94a3b8;
  }
  .exercise-title{
    font-size:1.1rem;
    color:#f1f5f9;
    margin-bottom:16px;
    line-height:1.5;
    padding:12px 16px;
    background:#1e293b;
    border-left:3px solid #38bdf8;
    border-radius:0 6px 6px 0;
  }
  .editor-wrap{
    position:relative;
    margin-bottom:16px;
  }
  .line-numbers{
    position:absolute;
    left:0;top:0;bottom:0;
    width:40px;
    background:#0f172a;
    border-right:1px solid #334155;
    padding:14px 8px 14px 0;
    text-align:right;
    font-family:'Courier New',monospace;
    font-size:14px;
    line-height:1.5;
    color:#475569;
    pointer-events:none;
    overflow:hidden;
    border-radius:6px 0 0 6px;
    z-index:2;
  }
  .code-editor{
    width:100%;
    min-height:200px;
    background:#1e293b;
    color:#e2e8f0;
    border:1px solid #334155;
    border-radius:6px;
    padding:12px 16px 12px 52px;
    font-family:'Courier New',monospace;
    font-size:14px;
    line-height:1.5;
    resize:vertical;
    outline:none;
    tab-size:2;
    white-space:pre;
    overflow-wrap:normal;
    overflow-x:auto;
  }
  .code-editor:focus{
    border-color:#38bdf8;
    box-shadow:0 0 0 2px rgba(56,189,248,0.2);
  }
  .btn-row{
    display:flex;
    gap:10px;
    margin-bottom:16px;
    flex-wrap:wrap;
  }
  .btn{
    padding:10px 24px;
    border:none;
    border-radius:6px;
    font-size:0.95rem;
    font-weight:600;
    cursor:pointer;
    transition:all 0.2s;
  }
  .btn-run{
    background:#2563eb;
    color:#fff;
  }
  .btn-run:hover{background:#1d4ed8;}
  .btn-hint{
    background:transparent;
    color:#f59e0b;
    border:1px solid #f59e0b;
  }
  .btn-hint:hover{background:rgba(245,158,11,0.1);}
  .btn-next{
    background:#10b981;
    color:#fff;
    display:none;
  }
  .btn-next:hover{background:#059669;}
  .btn-reset{
    background:transparent;
    color:#94a3b8;
    border:1px solid #475569;
    margin-left:auto;
  }
  .btn-reset:hover{background:rgba(148,163,184,0.1);}
  .output{
    background:#0f172a;
    border:1px solid #334155;
    border-radius:6px;
    padding:16px;
    margin-bottom:16px;
    min-height:60px;
    font-family:'Courier New',monospace;
    font-size:13px;
    line-height:1.6;
    display:none;
  }
  .test-line{
    padding:4px 0;
  }
  .test-pass{color:#4ade80;}
  .test-fail{color:#f87171;}
  .test-error{color:#fb923c;}
  .feedback{
    padding:12px 16px;
    border-radius:6px;
    margin-bottom:16px;
    font-weight:600;
    display:none;
  }
  .feedback-ok{
    background:rgba(16,185,129,0.15);
    border:1px solid #10b981;
    color:#4ade80;
  }
  .feedback-err{
    background:rgba(239,68,68,0.15);
    border:1px solid #ef4444;
    color:#f87171;
  }
  .hint-box{
    padding:12px 16px;
    background:rgba(245,158,11,0.1);
    border:1px solid #f59e0b;
    border-radius:6px;
    color:#fbbf24;
    margin-bottom:16px;
    display:none;
    font-size:0.9rem;
  }
  .progress-bar-wrap{
    background:#1e293b;
    border-radius:20px;
    height:8px;
    margin-top:8px;
    overflow:hidden;
  }
  .progress-bar{
    height:100%;
    background:linear-gradient(90deg,#2563eb,#38bdf8);
    border-radius:20px;
    transition:width 0.4s ease;
    width:0%;
  }
  .footer{
    text-align:center;
    padding:16px 0;
    border-top:1px solid #334155;
    margin-top:8px;
  }
  .footer span{color:#94a3b8;font-size:0.9rem;}
  .complete-msg{
    text-align:center;
    padding:40px 20px;
    display:none;
  }
  .complete-msg h2{
    color:#4ade80;
    font-size:1.8rem;
    margin-bottom:12px;
  }
  .complete-msg p{
    color:#94a3b8;
    font-size:1.1rem;
  }
</style>
</head>
<body>
<div id="app">
  <div class="header">
    <h1>&gt;_ Esercizi JavaScript</h1>
    <span class="counter" id="counterLabel">Esercizio 1 di 6</span>
  </div>

  <div id="exerciseArea">
    <div class="exercise-title" id="exTitle"></div>
    <div class="editor-wrap">
      <div class="line-numbers" id="lineNums">1</div>
      <textarea class="code-editor" id="codeEditor" spellcheck="false"></textarea>
    </div>
    <div class="btn-row">
      <button class="btn btn-run" id="btnRun" onclick="runCode()">Esegui</button>
      <button class="btn btn-hint" id="btnHint" onclick="showHint()">Suggerimento</button>
      <button class="btn btn-next" id="btnNext" onclick="nextExercise()">Prossimo &rarr;</button>
      <button class="btn btn-reset" id="btnReset" onclick="resetCode()">Reset</button>
    </div>
    <div class="hint-box" id="hintBox"></div>
    <div class="feedback" id="feedback"></div>
    <div class="output" id="output"></div>
  </div>

  <div class="complete-msg" id="completeMsg">
    <h2>Tutti gli esercizi completati!</h2>
    <p>Hai completato tutti e 6 gli esercizi JavaScript. Ottimo lavoro!</p>
  </div>

  <div class="footer">
    <span>Completati: <strong id="doneCount">0</strong>/6</span>
    <div class="progress-bar-wrap">
      <div class="progress-bar" id="progressBar"></div>
    </div>
  </div>
</div>

<script>
var exercises = [
  {
    title: "Scrivi una funzione che ritorna il doppio di un numero.",
    starter: "function doppio(n) {\\n  // scrivi qui\\n}",
    tests: [
      {call: "doppio(5)", expected: 10},
      {call: "doppio(0)", expected: 0},
      {call: "doppio(-3)", expected: -6}
    ],
    hint: "La funzione deve ritornare n * 2",
    deepEqual: false
  },
  {
    title: "Scrivi una funzione che conta le vocali in una stringa.",
    starter: "function contaVocali(str) {\\n  // scrivi qui\\n}",
    tests: [
      {call: 'contaVocali("ciao")', expected: 3},
      {call: 'contaVocali("xyz")', expected: 0},
      {call: 'contaVocali("aeiou")', expected: 5}
    ],
    hint: "Usa un ciclo for e controlla se ogni carattere e' una vocale (a, e, i, o, u)",
    deepEqual: false
  },
  {
    title: "Filtra un array tenendo solo i numeri pari.",
    starter: "function soloPari(arr) {\\n  // scrivi qui\\n}",
    tests: [
      {call: "soloPari([1,2,3,4,5,6])", expected: [2,4,6]},
      {call: "soloPari([1,3,5])", expected: []},
      {call: "soloPari([0,2,4])", expected: [0,2,4]}
    ],
    hint: "Usa il metodo .filter() con n % 2 === 0",
    deepEqual: true
  },
  {
    title: "Scrivi una funzione che inverte una stringa.",
    starter: "function inverti(str) {\\n  // scrivi qui\\n}",
    tests: [
      {call: 'inverti("ciao")', expected: "oaic"},
      {call: 'inverti("abc")', expected: "cba"},
      {call: 'inverti("")', expected: ""}
    ],
    hint: "Usa .split('').reverse().join('') oppure un ciclo",
    deepEqual: false
  },
  {
    title: "Scrivi una funzione che trova il massimo in un array.",
    starter: "function massimo(arr) {\\n  // scrivi qui\\n}",
    tests: [
      {call: "massimo([3,1,4,1,5,9])", expected: 9},
      {call: "massimo([-1,-5,-2])", expected: -1},
      {call: "massimo([42])", expected: 42}
    ],
    hint: "Usa Math.max(...arr) oppure un ciclo con una variabile max",
    deepEqual: false
  },
  {
    title: "Scrivi una funzione che conta le occorrenze di ogni parola in una stringa.",
    starter: "function contaParole(str) {\\n  // scrivi qui\\n}",
    tests: [
      {call: 'contaParole("ciao mondo ciao")', expected: {ciao:2, mondo:1}},
      {call: 'contaParole("a b a b a")', expected: {a:3, b:2}},
      {call: 'contaParole("solo")', expected: {solo:1}}
    ],
    hint: "Usa .split(' ') e un oggetto per contare le occorrenze di ogni parola",
    deepEqual: true
  }
];

var current = 0;
var completed = [];

function deepEq(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!deepEq(a[i], b[i])) return false;
    }
    return true;
  }
  if (typeof a === "object" && a !== null && b !== null) {
    var ka = Object.keys(a).sort();
    var kb = Object.keys(b).sort();
    if (ka.length !== kb.length) return false;
    for (var j = 0; j < ka.length; j++) {
      if (ka[j] !== kb[j]) return false;
      if (!deepEq(a[ka[j]], b[kb[j]])) return false;
    }
    return true;
  }
  return false;
}

function formatVal(v) {
  if (typeof v === "string") return '"' + v + '"';
  if (Array.isArray(v) || (typeof v === "object" && v !== null)) return JSON.stringify(v);
  return String(v);
}

function loadExercise(idx) {
  var ex = exercises[idx];
  document.getElementById("exTitle").textContent = ex.title;
  document.getElementById("codeEditor").value = ex.starter;
  document.getElementById("counterLabel").textContent = "Esercizio " + (idx + 1) + " di 6";
  document.getElementById("output").style.display = "none";
  document.getElementById("output").innerHTML = "";
  document.getElementById("feedback").style.display = "none";
  document.getElementById("hintBox").style.display = "none";
  document.getElementById("btnNext").style.display = "none";
  updateLines();
}

function updateLines() {
  var ta = document.getElementById("codeEditor");
  var lines = ta.value.split("\\n").length;
  var nums = "";
  for (var i = 1; i <= lines; i++) {
    nums += i + "\\n";
  }
  document.getElementById("lineNums").textContent = nums;
}

document.addEventListener("DOMContentLoaded", function() {
  loadExercise(0);
  var ta = document.getElementById("codeEditor");
  ta.addEventListener("input", updateLines);
  ta.addEventListener("scroll", function() {
    document.getElementById("lineNums").style.transform = "translateY(-" + ta.scrollTop + "px)";
  });
  ta.addEventListener("keydown", function(e) {
    if (e.key === "Tab") {
      e.preventDefault();
      var s = ta.selectionStart;
      var end = ta.selectionEnd;
      ta.value = ta.value.substring(0, s) + "  " + ta.value.substring(end);
      ta.selectionStart = ta.selectionEnd = s + 2;
      updateLines();
    }
  });
});

function runCode() {
  var ex = exercises[current];
  var code = document.getElementById("codeEditor").value;
  var outEl = document.getElementById("output");
  var fbEl = document.getElementById("feedback");
  outEl.style.display = "block";
  outEl.innerHTML = "";
  fbEl.style.display = "none";

  var allPass = true;
  var html = "";

  for (var t = 0; t < ex.tests.length; t++) {
    var test = ex.tests[t];
    try {
      var result = eval(code + ";\\n" + test.call);
      var pass = ex.deepEqual ? deepEq(result, test.expected) : (result === test.expected);
      if (pass) {
        html += '<div class="test-line test-pass">&#10004; ' + test.call + ' &rarr; ' + formatVal(result) + '</div>';
      } else {
        allPass = false;
        html += '<div class="test-line test-fail">&#10008; ' + test.call + ' &rarr; atteso: ' + formatVal(test.expected) + ', ottenuto: ' + formatVal(result) + '</div>';
      }
    } catch(err) {
      allPass = false;
      html += '<div class="test-line test-error">&#9888; ' + test.call + ' &rarr; Errore: ' + err.message + '</div>';
    }
  }

  outEl.innerHTML = html;

  if (allPass) {
    fbEl.className = "feedback feedback-ok";
    fbEl.textContent = "Corretto! Tutti i test superati.";
    fbEl.style.display = "block";
    if (completed.indexOf(current) === -1) {
      completed.push(current);
    }
    updateProgress();
    if (current < exercises.length - 1) {
      document.getElementById("btnNext").style.display = "inline-block";
    } else {
      checkAllDone();
    }
  } else {
    fbEl.className = "feedback feedback-err";
    fbEl.textContent = "Errore: alcuni test non sono passati. Riprova!";
    fbEl.style.display = "block";
  }
}

function showHint() {
  var hb = document.getElementById("hintBox");
  hb.textContent = exercises[current].hint;
  hb.style.display = "block";
}

function resetCode() {
  document.getElementById("codeEditor").value = exercises[current].starter;
  document.getElementById("output").style.display = "none";
  document.getElementById("feedback").style.display = "none";
  document.getElementById("hintBox").style.display = "none";
  document.getElementById("btnNext").style.display = "none";
  updateLines();
}

function nextExercise() {
  if (current < exercises.length - 1) {
    current++;
    loadExercise(current);
  }
}

function updateProgress() {
  document.getElementById("doneCount").textContent = completed.length;
  document.getElementById("progressBar").style.width = ((completed.length / exercises.length) * 100) + "%";
}

function checkAllDone() {
  if (completed.length === exercises.length) {
    document.getElementById("exerciseArea").style.display = "none";
    document.getElementById("completeMsg").style.display = "block";
  }
}
</script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
