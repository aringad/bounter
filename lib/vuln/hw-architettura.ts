import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Architettura del Computer</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{background:#0f172a;font-family:'Segoe UI',system-ui,-apple-system,sans-serif;color:#e2e8f0;min-height:100vh;padding:20px;}
#wrap{max-width:840px;margin:0 auto;}
.header{background:#1e293b;border:1px solid #334155;border-radius:12px;padding:18px 22px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;}
.header h1{font-size:1.2rem;color:#f1f5f9;}
.header .badge{background:#f59e0b;color:#1c1b3a;padding:4px 14px;border-radius:20px;font-size:0.8rem;font-weight:700;}
.panel{background:#1e293b;border:1px solid #334155;border-radius:12px;padding:22px 24px;}
.panel h2{font-size:1.05rem;color:#fbbf24;margin-bottom:10px;}
.panel p{font-size:0.92rem;line-height:1.6;color:#cbd5e1;}
.panel p+p{margin-top:8px;}
.namebox{margin-top:18px;}
.namebox label{display:block;font-size:0.85rem;color:#94a3b8;margin-bottom:6px;}
.namebox input{width:100%;max-width:360px;padding:11px 14px;border-radius:9px;background:#0f172a;color:#e2e8f0;border:1px solid #475569;font-size:1rem;outline:none;}
.namebox input:focus{border-color:#f59e0b;}
.nameerr{color:#fca5a5;font-size:0.85rem;margin-top:8px;display:none;}
.btn{padding:12px 22px;border:none;border-radius:10px;font-size:0.95rem;font-weight:700;cursor:pointer;transition:all 0.2s;}
.btn-primary{background:#f59e0b;color:#1c1b3a;}
.btn-primary:hover{background:#fbbf24;transform:translateY(-1px);}
.btn-primary:disabled{background:#475569;color:#94a3b8;cursor:not-allowed;transform:none;}
.btn-ghost{background:#334155;color:#e2e8f0;}
.btn-ghost:hover{background:#475569;}
.progress{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;font-size:0.85rem;color:#94a3b8;}
.bar{height:6px;background:#334155;border-radius:3px;overflow:hidden;margin-bottom:16px;}
.bar > div{height:100%;background:#f59e0b;width:0;transition:width 0.3s;}
.card{background:#1e293b;border:1px solid #334155;border-radius:12px;padding:22px 24px;margin-bottom:14px;}
.sec-tag{display:inline-block;font-size:0.68rem;text-transform:uppercase;letter-spacing:1px;color:#fbbf24;background:#1a1505;border:1px solid #f59e0b55;padding:2px 9px;border-radius:5px;margin-bottom:12px;}
.q{font-size:1.08rem;color:#f1f5f9;line-height:1.5;margin-bottom:16px;}
.opt{display:block;width:100%;text-align:left;background:#0f172a;border:1px solid #334155;border-radius:9px;padding:13px 16px;margin-bottom:9px;color:#e2e8f0;font-size:0.95rem;cursor:pointer;transition:all 0.15s;}
.opt:hover{border-color:#64748b;}
.opt.sel{border-color:#f59e0b;background:#1a1505;}
.opt.correct{border-color:#22c55e;background:#04140a;}
.opt.wrong{border-color:#ef4444;background:#1a0808;}
.opt .mk{float:right;font-weight:700;}
.hint{font-size:0.8rem;color:#64748b;margin-bottom:12px;}
.pool,.seq{display:flex;flex-wrap:wrap;gap:8px;min-height:48px;padding:10px;border-radius:9px;border:1px dashed #475569;background:#0f172a;margin-bottom:10px;}
.seq{border-style:solid;border-color:#f59e0b55;}
.chip{background:#1e293b;border:1px solid #475569;border-radius:8px;padding:9px 13px;font-size:0.9rem;cursor:pointer;transition:all 0.15s;}
.chip:hover{border-color:#f59e0b;}
.chip .num{display:inline-block;background:#f59e0b;color:#1c1b3a;font-weight:700;border-radius:50%;width:20px;height:20px;text-align:center;line-height:20px;font-size:0.75rem;margin-right:7px;}
.lbl{font-size:0.78rem;color:#94a3b8;margin:4px 0;}
.matchrow{display:flex;gap:10px;align-items:center;margin-bottom:9px;flex-wrap:wrap;}
.matchrow .mtext{flex:1;min-width:200px;background:#0f172a;border:1px solid #334155;border-radius:9px;padding:11px 14px;font-size:0.92rem;}
.matchrow select{padding:11px 12px;border-radius:9px;background:#0f172a;color:#e2e8f0;border:1px solid #475569;font-size:0.9rem;min-width:170px;outline:none;cursor:pointer;}
.matchrow select:focus{border-color:#f59e0b;}
.matchrow.ok .mtext{border-color:#22c55e;}
.matchrow.no .mtext{border-color:#ef4444;}
.fb{padding:14px 16px;border-radius:10px;margin-bottom:14px;font-size:0.92rem;line-height:1.55;display:none;}
.fb.ok{background:#04140a;border:1px solid #22c55e;color:#bbf7d0;display:block;}
.fb.bad{background:#1a0808;border:1px solid #ef4444;color:#fecaca;display:block;}
.fb b{color:#fff;}
.controls{display:flex;gap:10px;}
.scorebar{margin-top:14px;background:#1e293b;border:1px solid #334155;border-radius:12px;padding:13px 20px;font-size:0.9rem;display:flex;justify-content:space-between;}
.scorebar b{color:#fbbf24;}
/* report */
.report{background:#fff;color:#1e293b;border-radius:12px;padding:34px 38px;max-width:720px;margin:0 auto;}
.report .rhead{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #f59e0b;padding-bottom:14px;margin-bottom:18px;flex-wrap:wrap;gap:8px;}
.report .rhead h2{font-size:1.3rem;color:#0f172a;}
.report .rhead .rsub{font-size:0.85rem;color:#64748b;}
.report .vote{font-size:2.6rem;font-weight:800;color:#f59e0b;text-align:right;line-height:1;}
.report .vote small{display:block;font-size:0.8rem;color:#64748b;font-weight:600;}
.report .meta{font-size:0.92rem;color:#334155;margin-bottom:18px;line-height:1.8;}
.report .meta b{color:#0f172a;}
.report table{width:100%;border-collapse:collapse;margin-bottom:18px;}
.report th,.report td{text-align:left;padding:9px 10px;border-bottom:1px solid #e2e8f0;font-size:0.9rem;}
.report th{color:#64748b;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.5px;}
.report td.r{text-align:right;font-weight:700;}
.report .esito{padding:12px 16px;border-radius:9px;font-weight:700;font-size:1rem;}
.report .esito.pass{background:#dcfce7;color:#166534;}
.report .esito.fail{background:#fee2e2;color:#991b1b;}
.report .foot{margin-top:18px;font-size:0.75rem;color:#94a3b8;text-align:center;}
.afterprint{text-align:center;margin-top:18px;display:flex;gap:10px;justify-content:center;}
.hidden{display:none!important;}
@media print{
  body{background:#fff;padding:0;}
  #wrap{max-width:100%;}
  .noprint{display:none!important;}
  .report{box-shadow:none;border-radius:0;max-width:100%;}
}
</style>
</head>
<body>
<div id="wrap">
  <div class="header noprint">
    <h1>Architettura del Computer</h1>
    <div class="badge">Modulo 1</div>
  </div>

  <!-- Name gate -->
  <div class="panel noprint" id="nameGate">
    <h2>Il modello di Von Neumann</h2>
    <p>Il computer si basa sul modello proposto da <b>John von Neumann (1945)</b>: tre componenti principali &mdash; <b>CPU</b>, <b>Memoria centrale (RAM)</b> e <b>Sistema di Input/Output</b> &mdash; collegate da cavi multipli detti <b>bus</b>, tutti ospitati sulla scheda madre.</p>
    <p>In questa esercitazione metti alla prova ci&ograve; che hai studiato su CPU (CU, ALU, registri), clock, bus e memoria cache. Ogni risposta viene <b>verificata</b> con una spiegazione. Al termine puoi <b>stampare o salvare in PDF</b> la scheda con il tuo punteggio.</p>
    <div class="namebox">
      <label for="nameInput">Inserisci nome e cognome per la scheda di valutazione:</label>
      <input type="text" id="nameInput" placeholder="Es. Mario Rossi" autocomplete="off">
      <div class="nameerr" id="nameErr">Inserisci il tuo nome per iniziare.</div>
    </div>
    <div style="margin-top:18px"><button class="btn btn-primary" onclick="startGame()">Inizia l'esercitazione &rarr;</button></div>
  </div>

  <!-- Game -->
  <div id="app" class="hidden">
    <div class="progress noprint"><span id="progTxt">Domanda 1</span><span id="scoreTxt">Punteggio: 0</span></div>
    <div class="bar noprint"><div id="barFill"></div></div>
    <div class="card noprint" id="card"></div>
    <div class="fb noprint" id="fb"></div>
    <div class="controls noprint" id="controls">
      <button class="btn btn-primary" id="btnCheck" onclick="verify()">Verifica</button>
      <button class="btn btn-primary hidden" id="btnNext" onclick="nextQ()">Avanti &rarr;</button>
    </div>
    <div class="scorebar noprint"><span>Risposte corrette: <b id="okNum">0</b> / <b id="totNum">0</b></span><span id="studTag"></span></div>
  </div>

  <!-- Final report -->
  <div id="final" class="hidden"></div>
</div>

<script>
var TITLE="Architettura del Computer - Modulo 1";
var PASS=60; // soglia sufficienza in %

var QUESTIONS=[
 {sec:"CPU e modello", type:"single",
  q:"Nel modello di Von Neumann, quali sono le tre componenti principali collegate dal bus?",
  opts:[{t:"CPU, Memoria centrale (RAM), Sistema di Input/Output",c:true},
        {t:"CPU, Hard disk, Monitor",c:false},
        {t:"ALU, Cache, Alimentatore",c:false},
        {t:"Scheda video, RAM, Tastiera",c:false}],
  explain:"Le tre componenti sono CPU, Memoria centrale e Sistema I/O, collegate dal bus sulla scheda madre. Alimentatore e memorie di massa sono esterni."},

 {sec:"CPU e modello", type:"match",
  q:"Abbina ogni parte interna della CPU alla sua funzione.",
  cats:["CU (Unità di Controllo)","ALU (Unità Aritmetico-Logica)","Registri interni"],
  pairs:[{item:"Preleva ed esegue le istruzioni, coordina le attività della CPU",cat:"CU (Unità di Controllo)"},
         {item:"Esegue operazioni aritmetiche e confronti logici",cat:"ALU (Unità Aritmetico-Logica)"},
         {item:"Memorie velocissime a cui CU e ALU accedono direttamente",cat:"Registri interni"}],
  explain:"La CPU è composta da Unità di Controllo (coordina), ALU (calcola) e registri interni (memoria velocissima)."},

 {sec:"CPU e modello", type:"multi",
  q:"Quali fattori influenzano la velocità di elaborazione della CPU? (seleziona tutti)",
  opts:[{t:"Numero di bit (32 o 64)",c:true},
        {t:"Frequenza di clock",c:true},
        {t:"Struttura interna",c:true},
        {t:"Numero di core",c:true},
        {t:"Velocità delle periferiche",c:true},
        {t:"Colore del case",c:false},
        {t:"Capacità dell'hard disk",c:false}],
  explain:"I cinque fattori delle slide: numero di bit, frequenza di clock, struttura interna, numero di core e velocità delle periferiche."},

 {sec:"CPU e modello", type:"single",
  q:"In quale unità di misura si esprime la frequenza di clock di una CPU?",
  opts:[{t:"GHz (miliardi di cicli al secondo)",c:true},
        {t:"GB (gigabyte)",c:false},
        {t:"Mbps (megabit al secondo)",c:false},
        {t:"dpi (dots per inch)",c:false}],
  explain:"Il clock si misura in gigahertz: es. una CPU a 3 GHz esegue 3 miliardi di cicli al secondo."},

 {sec:"Bus di sistema", type:"match",
  q:"Abbina ogni tipo di bus alla sua caratteristica.",
  cats:["Bus Dati (Data Bus)","Bus Indirizzi (Address Bus)","Bus di Controllo (Control Bus)"],
  pairs:[{item:"Trasporta istruzioni e dati, è bidirezionale",cat:"Bus Dati (Data Bus)"},
         {item:"Trasporta gli indirizzi delle locazioni di memoria, è monodirezionale",cat:"Bus Indirizzi (Address Bus)"},
         {item:"Invia segnali come BUSY, IRQ, lettura/scrittura I/O",cat:"Bus di Controllo (Control Bus)"}],
  explain:"Data Bus: bidirezionale (dati). Address Bus: monodirezionale (indirizzi). Control Bus: segnali di controllo."},

 {sec:"Bus di sistema", type:"single",
  q:"Con un Bus Indirizzi a 16 bit, quante locazioni di memoria si possono indirizzare?",
  opts:[{t:"2¹⁶ = 64 kB di locazioni",c:true},
        {t:"16 locazioni",c:false},
        {t:"160 kB di locazioni",c:false},
        {t:"2 × 16 = 32 locazioni",c:false}],
  explain:"Con 16 fili (bit) si indirizzano 2^16 = 65.536 locazioni, cioè 64 kB."},

 {sec:"Bus di sistema", type:"single",
  q:"A cosa serve il DMA (Direct Memory Access)?",
  opts:[{t:"Trasferire dati da/verso la memoria senza coinvolgere la CPU",c:true},
        {t:"Aumentare la frequenza di clock della CPU",c:false},
        {t:"Raffreddare il processore",c:false},
        {t:"Convertire la corrente alternata in continua",c:false}],
  explain:"Il DMA gestisce i trasferimenti che non richiedono elaborazione (es. RAM ↔ hard disk) liberando il microprocessore."},

 {sec:"Bus di sistema", type:"match",
  q:"Il chipset divide la gestione dei bus. Abbina ogni ponte alle periferiche che gestisce.",
  cats:["Northbridge","Southbridge"],
  pairs:[{item:"Periferiche veloci: RAM e scheda video (GPU)",cat:"Northbridge"},
         {item:"Periferiche lente: USB, SATA, audio, LAN, BIOS",cat:"Southbridge"}],
  explain:"Northbridge = dispositivi veloci (RAM, GPU). Southbridge = dispositivi lenti (USB, SATA, audio, rete). La CPU dialoga col chipset tramite il Front-Side Bus."},

 {sec:"Memoria Cache", type:"single",
  q:"Che cos'è la memoria cache?",
  opts:[{t:"Una memoria piccola e velocissima che conserva i dati che la CPU userà a breve, gestita dal microprocessore",c:true},
        {t:"Una memoria di massa permanente più grande dell'hard disk",c:false},
        {t:"La memoria dove si installa il sistema operativo",c:false},
        {t:"Un tipo di bus tra CPU e RAM",c:false}],
  explain:"È una memoria nascosta, più veloce e costosa della RAM ma meno capiente, gestita dal cache controller per rendere i dati subito disponibili."},

 {sec:"Memoria Cache", type:"order",
  q:"Ordina questi livelli di memoria dal più VELOCE al più lento.",
  items:["Cache L1","Cache L2","Cache L3","RAM"],
  explain:"Gerarchia: L1 (1-4 cicli) → L2 (8-15) → L3 (25-50, condivisa) → RAM (~100 cicli). Salendo aumenta velocità e costo, scendendo aumenta capacità."},

 {sec:"Memoria Cache", type:"single",
  q:"Cosa indica un «cache miss»?",
  opts:[{t:"Il dato NON è in cache e va caricato dalla RAM",c:true},
        {t:"Il dato è stato trovato in cache (trasferimento velocissimo)",c:false},
        {t:"La cache è piena e va spenta",c:false},
        {t:"Un errore di parità della RAM",c:false}],
  explain:"Cache hit = dato trovato in cache. Cache miss = dato assente, si avvia il caricamento dalla RAM. L'hit rate misura l'efficacia della cache."},

 {sec:"Memoria Cache", type:"single",
  q:"Quale strategia riporta SUBITO in RAM ogni modifica fatta in cache (dati sempre coerenti, ma più lenta)?",
  opts:[{t:"Write-through",c:true},
        {t:"Write-back",c:false},
        {t:"LRU (Least Recently Used)",c:false},
        {t:"Posizionamento libero",c:false}],
  explain:"Write-through: scrittura immediata anche in RAM (coerente ma lento). Write-back: scrittura differita (veloce) e libera la cache col criterio LRU."}
];

// ---- engine ----
var idx=0, answered=false, results=[], studentName="";

window.addEventListener('load',function(){
  var saved=localStorage.getItem('bounter_student_name');
  if(saved) document.getElementById('nameInput').value=saved;
  document.getElementById('nameInput').addEventListener('keydown',function(e){if(e.key==='Enter')startGame();});
});

function shuffle(a){var r=a.slice();for(var i=r.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=r[i];r[i]=r[j];r[j]=t;}return r;}

function startGame(){
  var n=document.getElementById('nameInput').value.trim();
  if(!n){document.getElementById('nameErr').style.display='block';return;}
  studentName=n;
  localStorage.setItem('bounter_student_name',n);
  document.getElementById('nameGate').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  document.getElementById('totNum').textContent=QUESTIONS.length;
  document.getElementById('studTag').textContent=studentName;
  render();
}

function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.innerHTML=txt;return e;}

function render(){
  answered=false;
  var qd=QUESTIONS[idx];
  document.getElementById('progTxt').textContent='Domanda '+(idx+1)+' di '+QUESTIONS.length;
  document.getElementById('barFill').style.width=Math.round(idx/QUESTIONS.length*100)+'%';
  var card=document.getElementById('card');
  card.innerHTML='';
  card.appendChild(el('div','sec-tag',qd.sec));
  card.appendChild(el('div','q',qd.q));

  if(qd.type==='single'||qd.type==='multi'){
    qd._opts=shuffle(qd.opts);
    qd._sel=[];
    if(qd.type==='multi') card.appendChild(el('div','hint','Più risposte corrette: selezionane tutte quelle giuste.'));
    qd._opts.forEach(function(o,i){
      var b=el('button','opt',o.t);
      b.onclick=function(){
        if(answered)return;
        if(qd.type==='single'){qd._sel=[i];Array.prototype.forEach.call(card.querySelectorAll('.opt'),function(x){x.classList.remove('sel');});b.classList.add('sel');}
        else{var p=qd._sel.indexOf(i);if(p>=0){qd._sel.splice(p,1);b.classList.remove('sel');}else{qd._sel.push(i);b.classList.add('sel');}}
      };
      card.appendChild(b);
    });
  } else if(qd.type==='order'){
    qd._pool=shuffle(qd.items); qd._seq=[];
    card.appendChild(el('div','lbl','Tua sequenza (clicca per rimuovere):'));
    var seq=el('div','seq');seq.id='seqArea';card.appendChild(seq);
    card.appendChild(el('div','lbl','Disponibili (clicca per aggiungere):'));
    var pool=el('div','pool');pool.id='poolArea';card.appendChild(pool);
    drawOrder(qd);
  } else if(qd.type==='match'){
    qd._choice={};
    var catOpts=shuffle(qd.cats);
    qd.pairs.forEach(function(p,i){
      var row=el('div','matchrow');row.dataset.i=i;
      row.appendChild(el('div','mtext',p.item));
      var sel=document.createElement('select');
      sel.appendChild(el('option',null,'-- scegli --'));
      catOpts.forEach(function(c){var o=el('option',null,c);o.value=c;sel.appendChild(o);});
      sel.onchange=function(){qd._choice[i]=sel.value;};
      row.appendChild(sel);
      card.appendChild(row);
    });
  }
  document.getElementById('fb').style.display='none';
  document.getElementById('btnCheck').classList.remove('hidden');
  document.getElementById('btnNext').classList.add('hidden');
}

function drawOrder(qd){
  var seq=document.getElementById('seqArea'), pool=document.getElementById('poolArea');
  seq.innerHTML='';pool.innerHTML='';
  qd._seq.forEach(function(it,i){
    var c=el('div','chip','<span class="num">'+(i+1)+'</span>'+it);
    c.onclick=function(){if(answered)return;qd._seq.splice(i,1);qd._pool.push(it);drawOrder(qd);};
    seq.appendChild(c);
  });
  qd._pool.forEach(function(it,i){
    var c=el('div','chip',it);
    c.onclick=function(){if(answered)return;qd._pool.splice(i,1);qd._seq.push(it);drawOrder(qd);};
    pool.appendChild(c);
  });
}

function verify(){
  if(answered)return;
  var qd=QUESTIONS[idx], correct=false, card=document.getElementById('card');
  if(qd.type==='single'||qd.type==='multi'){
    if(qd._sel.length===0)return;
    var sel=qd._sel.slice().sort();
    var right=[];qd._opts.forEach(function(o,i){if(o.c)right.push(i);});right.sort();
    correct=(sel.length===right.length)&&sel.every(function(v,k){return v===right[k];});
    Array.prototype.forEach.call(card.querySelectorAll('.opt'),function(b,i){
      b.classList.remove('sel');
      if(qd._opts[i].c){b.classList.add('correct');b.innerHTML+='<span class="mk">✓</span>';}
      else if(qd._sel.indexOf(i)>=0){b.classList.add('wrong');b.innerHTML+='<span class="mk">✗</span>';}
    });
  } else if(qd.type==='order'){
    if(qd._seq.length!==qd.items.length)return;
    correct=qd._seq.every(function(v,i){return v===qd.items[i];});
  } else if(qd.type==='match'){
    if(Object.keys(qd._choice).length<qd.pairs.length)return;
    correct=qd.pairs.every(function(p,i){return qd._choice[i]===p.cat;});
    Array.prototype.forEach.call(card.querySelectorAll('.matchrow'),function(row,i){
      row.classList.add(qd._choice[i]===qd.pairs[i].cat?'ok':'no');
      var s=row.querySelector('select');s.disabled=true;
    });
  }
  answered=true;
  results[idx]={correct:correct,sec:qd.sec};
  var fb=document.getElementById('fb');
  var extra='';
  if(!correct){
    if(qd.type==='order') extra='<br>Ordine corretto: <b>'+qd.items.join(' → ')+'</b>';
    if(qd.type==='match') extra='<br>'+qd.pairs.map(function(p){return p.item.split(',')[0]+' → <b>'+p.cat+'</b>';}).join('<br>');
  }
  fb.className='fb '+(correct?'ok':'bad');
  fb.innerHTML=(correct?'✅ <b>Corretto!</b> ':'❌ <b>Non corretto.</b> ')+qd.explain+extra;
  var ok=results.filter(function(r){return r.correct;}).length;
  document.getElementById('okNum').textContent=ok;
  document.getElementById('scoreTxt').textContent='Punteggio: '+ok;
  document.getElementById('btnCheck').classList.add('hidden');
  var bn=document.getElementById('btnNext');bn.classList.remove('hidden');
  bn.textContent=(idx===QUESTIONS.length-1)?'Vedi la scheda →':'Avanti →';
}

function nextQ(){if(idx===QUESTIONS.length-1){showFinal();}else{idx++;render();}}

function showFinal(){
  document.getElementById('app').classList.add('hidden');
  var ok=results.filter(function(r){return r.correct;}).length;
  var tot=QUESTIONS.length;
  var pct=Math.round(ok/tot*100);
  var passed=pct>=PASS;
  // per sezione
  var secs={};
  QUESTIONS.forEach(function(qd,i){
    if(!secs[qd.sec])secs[qd.sec]={ok:0,tot:0};
    secs[qd.sec].tot++;
    if(results[i]&&results[i].correct)secs[qd.sec].ok++;
  });
  var rows='';
  Object.keys(secs).forEach(function(s){
    rows+='<tr><td>'+s+'</td><td class="r">'+secs[s].ok+' / '+secs[s].tot+'</td></tr>';
  });
  var d=new Date();
  var dstr=d.toLocaleDateString('it-IT')+' '+d.toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'});
  var voto30=Math.round(ok/tot*30);
  var fin=document.getElementById('final');
  fin.classList.remove('hidden');
  fin.innerHTML=
   '<div class="report" id="report">'
   +'<div class="rhead"><div><h2>Scheda di valutazione</h2><div class="rsub">'+TITLE+'</div></div>'
   +'<div class="vote">'+voto30+'<small>/30</small></div></div>'
   +'<div class="meta"><b>Studente:</b> '+escapeHtml(studentName)+'<br><b>Data:</b> '+dstr+'<br><b>Risposte corrette:</b> '+ok+' su '+tot+' ('+pct+'%)</div>'
   +'<table><thead><tr><th>Sezione</th><th class="r">Punteggio</th></tr></thead><tbody>'+rows+'</tbody></table>'
   +'<div class="esito '+(passed?'pass':'fail')+'">'+(passed?'✅ PROVA SUPERATA':'❌ PROVA NON SUPERATA')+' &mdash; soglia di sufficienza '+PASS+'%</div>'
   +'<div class="foot">Laboratorio di Informatica &mdash; Corso Installatori e Manutentori di Rete</div>'
   +'</div>'
   +'<div class="afterprint noprint"><button class="btn btn-primary" onclick="window.print()">\u{1F5A8}️ Stampa / Salva PDF</button>'
   +'<button class="btn btn-ghost" onclick="restart()">Ricomincia</button></div>';
  window.scrollTo(0,0);
}

function escapeHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

function restart(){idx=0;results=[];document.getElementById('final').classList.add('hidden');document.getElementById('app').classList.remove('hidden');document.getElementById('okNum').textContent='0';document.getElementById('scoreTxt').textContent='Punteggio: 0';render();}
</script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
