import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isAuthenticated, sendLoginPage } from "../../api/_auth";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthenticated(req)) return sendLoginPage(res);

  const html = `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Assembla il PC</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{background:#0f172a;font-family:'Segoe UI',system-ui,-apple-system,sans-serif;color:#e2e8f0;min-height:100vh;padding:20px;}
#wrap{max-width:1080px;margin:0 auto;}
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
.btn-boot{background:#22c55e;color:#04140a;}
.btn-boot:hover{background:#16a34a;}
.btn-boot:disabled{background:#475569;color:#94a3b8;cursor:not-allowed;}
.layout{display:grid;grid-template-columns:330px 1fr;gap:16px;}
@media(max-width:860px){.layout{grid-template-columns:1fr;}}
.bin{background:#1e293b;border:1px solid #334155;border-radius:12px;padding:16px 18px;max-height:640px;overflow-y:auto;}
.bin h3{font-size:0.95rem;color:#fbbf24;margin:14px 0 8px;}
.bin h3:first-child{margin-top:0;}
.part{background:#0f172a;border:1px solid #334155;border-radius:9px;padding:10px 12px;margin-bottom:7px;cursor:pointer;transition:all 0.15s;}
.part:hover{border-color:#64748b;}
.part.sel{border-color:#f59e0b;background:#1a1505;}
.part .pname{font-size:0.9rem;font-weight:600;color:#f1f5f9;}
.part .pspec{font-size:0.76rem;color:#94a3b8;margin-top:2px;}
.right{display:flex;flex-direction:column;gap:16px;}
.case{background:#141d2e;border:2px solid #334155;border-radius:14px;padding:18px;position:relative;}
.case-label{position:absolute;top:8px;right:14px;font-size:0.7rem;color:#64748b;text-transform:uppercase;letter-spacing:1px;}
.mobo{background:#0c1424;border:2px solid #2b3b57;border-radius:10px;padding:16px;display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.mobo-label{grid-column:1/-1;font-size:0.7rem;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:-2px;}
.slot{background:#0f172a;border:2px dashed #475569;border-radius:9px;padding:12px;min-height:74px;transition:all 0.2s;}
.slot.full{border-style:solid;}
.slot.ok{border-color:#22c55e;background:#04140a;}
.slot.warn{border-color:#f59e0b;background:#1a1505;}
.slot.bad{border-color:#ef4444;background:#1a0808;}
.slot .sname{font-size:0.68rem;text-transform:uppercase;letter-spacing:0.8px;color:#94a3b8;}
.slot .scontent{font-size:0.9rem;font-weight:600;color:#f1f5f9;margin-top:6px;}
.slot .sempty{font-size:0.82rem;color:#64748b;margin-top:6px;font-style:italic;}
.slot .smk{float:right;font-size:1rem;}
.slot.wide{grid-column:1/-1;}
.psu{margin-top:12px;background:#0c1424;border:2px solid #2b3b57;border-radius:9px;padding:12px;}
.power{margin-top:10px;}
.power .ptxt{font-size:0.8rem;color:#94a3b8;margin-bottom:5px;display:flex;justify-content:space-between;}
.power .pbar{height:10px;background:#0f172a;border-radius:5px;overflow:hidden;border:1px solid #334155;}
.power .pfill{height:100%;width:0;background:#22c55e;transition:width 0.3s,background 0.3s;}
.diag{background:#1e293b;border:1px solid #334155;border-radius:12px;padding:16px 18px;}
.diag h3{font-size:0.95rem;color:#fbbf24;margin-bottom:10px;}
.diag .ditem{display:flex;gap:9px;align-items:flex-start;padding:7px 0;border-bottom:1px solid #334155;font-size:0.86rem;line-height:1.45;}
.diag .ditem:last-child{border-bottom:none;}
.diag .dmk{flex-shrink:0;}
.diag .dempty{font-size:0.85rem;color:#64748b;font-style:italic;}
.actions{display:flex;gap:10px;align-items:center;flex-wrap:wrap;}
.boot-screen{background:#000;border:1px solid #334155;border-radius:12px;padding:30px;font-family:'Courier New',monospace;color:#22c55e;font-size:0.9rem;line-height:1.7;}
.boot-screen.fail{color:#fca5a5;}
.boot-screen .bline{opacity:0;animation:fade 0.3s forwards;}
@keyframes fade{to{opacity:1;}}
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
@media print{body{background:#fff;padding:0;}#wrap{max-width:100%;}.noprint{display:none!important;}.report{box-shadow:none;border-radius:0;max-width:100%;}}
</style>
</head>
<body>
<div id="wrap">
  <div class="header noprint">
    <h1>Assembla il PC</h1>
    <div class="badge">Modulo 4 &middot; Laboratorio</div>
  </div>

  <div class="panel noprint" id="nameGate">
    <h2>Monta un PC desktop compatibile</h2>
    <p>Scegli i componenti dal magazzino e montali sulla scheda madre. Il banco controlla in tempo reale la <b>compatibilità</b>: socket della CPU, tipo di RAM, dual channel, form factor nel case e potenza dell'alimentatore (consumi <b>+30%</b>). Verde = compatibile, rosso = errore.</p>
    <p>Quando tutto è a posto premi <b>Accendi il PC</b>: se la build è corretta parte il POST e il BIOS riconosce i componenti. Al termine puoi <b>stampare o salvare in PDF</b> la scheda con l'esito. Ricorda: nella realtà si lavora sempre con protezione antistatica (ESD)!</p>
    <div class="namebox">
      <label for="nameInput">Inserisci nome e cognome per la scheda di valutazione:</label>
      <input type="text" id="nameInput" placeholder="Es. Mario Rossi" autocomplete="off">
      <div class="nameerr" id="nameErr">Inserisci il tuo nome per iniziare.</div>
    </div>
    <div style="margin-top:18px"><button class="btn btn-primary" onclick="startGame()">Inizia l'assemblaggio &rarr;</button></div>
  </div>

  <div id="app" class="hidden">
    <div class="layout">
      <div class="bin noprint" id="bin"></div>
      <div class="right noprint">
        <div class="case">
          <span class="case-label" id="caseLabel">Case</span>
          <div class="mobo">
            <div class="mobo-label" id="moboLabel">Scheda madre</div>
            <div class="slot wide" id="slot-mobo" onclick="focusCat('mobo')"></div>
            <div class="slot" id="slot-cpu" onclick="focusCat('cpu')"></div>
            <div class="slot" id="slot-ram" onclick="focusCat('ram')"></div>
            <div class="slot" id="slot-gpu" onclick="focusCat('gpu')"></div>
            <div class="slot" id="slot-disk" onclick="focusCat('disk')"></div>
          </div>
          <div class="psu">
            <div class="slot" id="slot-psu" onclick="focusCat('psu')" style="border:none;background:none;padding:0;min-height:auto"></div>
            <div class="power">
              <div class="ptxt"><span>Potenza richiesta (consumi +30%)</span><span id="powTxt">&mdash;</span></div>
              <div class="pbar"><div class="pfill" id="powFill"></div></div>
            </div>
          </div>
        </div>

        <div class="diag">
          <h3>Diagnostica compatibilità</h3>
          <div id="diagList"><div class="dempty">Scegli i componenti dal magazzino a sinistra: le verifiche compaiono qui.</div></div>
        </div>

        <div class="actions">
          <button class="btn btn-boot" id="btnBoot" onclick="bootPc()" disabled>&#9889; Accendi il PC</button>
          <button class="btn btn-ghost" onclick="resetBuild()">Azzera build</button>
          <span id="hintTxt" style="font-size:0.82rem;color:#94a3b8"></span>
        </div>

        <div id="bootArea"></div>
      </div>
    </div>
  </div>

  <div id="final" class="hidden"></div>
</div>

<script>
var TITLE="Assembla il PC - Modulo 4";
var PASS=60;

var CATLABEL={cpu:"CPU (Processore)",mobo:"Scheda madre",ram:"Memoria RAM",gpu:"Scheda video",disk:"Disco",psu:"Alimentatore (PSU)",cs:"Case"};
var SLOTNAME={mobo:"Scheda madre",cpu:"Socket CPU",ram:"Slot RAM",gpu:"Slot PCIe x16",disk:"SATA / M.2",psu:"Alimentatore (PSU)"};

var CATALOG={
  cpu:[
    {id:"cpu1",name:"Intel Core i5",spec:"Socket LGA 1700 &middot; 125 W",socket:"LGA 1700",tdp:125},
    {id:"cpu2",name:"AMD Ryzen 5",spec:"Socket AM4 (PGA) &middot; 95 W",socket:"AM4",tdp:95},
    {id:"cpu3",name:"Intel Core i3",spec:"Socket LGA 1700 &middot; 65 W",socket:"LGA 1700",tdp:65}
  ],
  mobo:[
    {id:"mb1",name:"Scheda madre ATX Intel Z790",spec:"Socket LGA 1700 &middot; DDR5 &middot; ATX",socket:"LGA 1700",ramType:"DDR5",form:"ATX"},
    {id:"mb2",name:"Scheda madre microATX AMD B550",spec:"Socket AM4 &middot; DDR4 &middot; microATX",socket:"AM4",ramType:"DDR4",form:"microATX"},
    {id:"mb3",name:"Scheda madre ATX Intel B760",spec:"Socket LGA 1700 &middot; DDR4 &middot; ATX",socket:"LGA 1700",ramType:"DDR4",form:"ATX"}
  ],
  ram:[
    {id:"ram1",name:"2 x 8 GB DDR5 (identici)",spec:"DDR5 &middot; dual channel",type:"DDR5",dual:true},
    {id:"ram2",name:"2 x 8 GB DDR4 (identici)",spec:"DDR4 &middot; dual channel",type:"DDR4",dual:true},
    {id:"ram3",name:"1 x 16 GB DDR4",spec:"DDR4 &middot; modulo singolo",type:"DDR4",dual:false}
  ],
  gpu:[
    {id:"gpu1",name:"Scheda video dedicata",spec:"GPU dedicata &middot; 220 W",tdp:220},
    {id:"gpu0",name:"Grafica integrata",spec:"Nessuna scheda &middot; 0 W",tdp:0}
  ],
  disk:[
    {id:"d1",name:"SSD NVMe 1 TB",spec:"Interfaccia M.2 PCIe"},
    {id:"d2",name:"Hard disk 2 TB",spec:"Interfaccia SATA"}
  ],
  psu:[
    {id:"psu1",name:"Alimentatore 400 W",spec:"400 W",watt:400},
    {id:"psu2",name:"Alimentatore 550 W",spec:"550 W",watt:550},
    {id:"psu3",name:"Alimentatore 750 W",spec:"750 W",watt:750}
  ],
  cs:[
    {id:"c1",name:"Case Mid Tower",spec:"Supporta ATX e microATX",supports:["ATX","microATX"]},
    {id:"c2",name:"Case Mini",spec:"Supporta solo microATX",supports:["microATX"]}
  ]
};
var BIN_ORDER=["cpu","mobo","ram","gpu","disk","psu","cs"];
var REQUIRED=["cpu","mobo","ram","gpu","disk","psu","cs"];

var sel={}, studentName="", booted=false, lastVerdict=null;

window.addEventListener('load',function(){
  var saved=localStorage.getItem('bounter_student_name');
  if(saved) document.getElementById('nameInput').value=saved;
  document.getElementById('nameInput').addEventListener('keydown',function(e){if(e.key==='Enter')startGame();});
});

function startGame(){
  var n=document.getElementById('nameInput').value.trim();
  if(!n){document.getElementById('nameErr').style.display='block';return;}
  studentName=n;
  localStorage.setItem('bounter_student_name',n);
  document.getElementById('nameGate').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  buildBin();
  repaint();
}

function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.innerHTML=txt;return e;}

function buildBin(){
  var bin=document.getElementById('bin');
  bin.innerHTML='';
  BIN_ORDER.forEach(function(cat){
    bin.appendChild(el('h3',null,CATLABEL[cat]));
    CATALOG[cat].forEach(function(p){
      var card=el('div','part'+((sel[cat]&&sel[cat].id===p.id)?' sel':''));
      card.id='part-'+p.id;
      card.innerHTML='<div class="pname">'+p.name+'</div><div class="pspec">'+p.spec+'</div>';
      card.onclick=function(){ if(booted) return; sel[cat]=p; buildBin(); repaint(); };
      bin.appendChild(card);
    });
  });
}

function focusCat(slotCat){
  var cat = slotCat;
  // map slot ids to bin categories (slot uses same keys)
  var first=CATALOG[cat] && CATALOG[cat][0];
  var node=first && document.getElementById('part-'+first.id);
  if(node) node.scrollIntoView({behavior:'smooth',block:'center'});
}

function computeChecks(){
  var c=[];
  if(sel.cpu&&sel.mobo){
    var ok=sel.cpu.socket===sel.mobo.socket;
    c.push({status:ok?'ok':'bad',slots:['cpu','mobo'],
      msg: ok? "Socket compatibile: la CPU "+sel.cpu.socket+" entra nel socket della scheda madre."
             : "Socket INCOMPATIBILE: la CPU «"+sel.cpu.socket+"» non entra nel socket «"+sel.mobo.socket+"» della scheda madre."});
  }
  if(sel.ram&&sel.mobo){
    var ok2=sel.ram.type===sel.mobo.ramType;
    c.push({status:ok2?'ok':'bad',slots:['ram','mobo'],
      msg: ok2? "RAM "+sel.ram.type+" compatibile con la scheda madre."
              : "RAM INCOMPATIBILE: i moduli "+sel.ram.type+" non entrano in una scheda madre "+sel.mobo.ramType+"."});
  }
  if(sel.ram){
    c.push({status:sel.ram.dual?'ok':'warn',slots:['ram'],
      msg: sel.ram.dual? "Dual channel attivo: due moduli identici migliorano le prestazioni."
                       : "Modulo singolo: il PC parte ma senza dual channel. Per attivarlo servono due moduli identici (stessa capacità, velocità e tecnologia)."});
  }
  if(sel.mobo&&sel.cs){
    var ok3=sel.cs.supports.indexOf(sel.mobo.form)>=0;
    c.push({status:ok3?'ok':'bad',slots:['mobo'],
      msg: ok3? "Form factor OK: una scheda "+sel.mobo.form+" entra in questo case."
              : "Form factor INCOMPATIBILE: una scheda "+sel.mobo.form+" non entra in questo case (supporta "+sel.cs.supports.join("/")+")."});
  }
  if(sel.cpu&&sel.gpu&&sel.psu){
    var need=Math.round((sel.cpu.tdp+sel.gpu.tdp+100)*1.3);
    var ok4=sel.psu.watt>=need;
    c.push({status:ok4?'ok':'bad',slots:['psu'],
      msg: ok4? "Alimentatore sufficiente: servono circa "+need+" W (consumi +30%) e ne hai "+sel.psu.watt+" W."
              : "Alimentatore INSUFFICIENTE: servono circa "+need+" W (consumi +30%) ma ne hai solo "+sel.psu.watt+" W."});
  }
  return c;
}

function slotStatus(cat,checks){
  if(!sel[cat]) return 'empty';
  var rank={ok:1,warn:2,bad:3}, worst=0;
  checks.forEach(function(ch){ if(ch.slots.indexOf(cat)>=0 && rank[ch.status]>worst) worst=rank[ch.status]; });
  return worst===3?'bad':worst===2?'warn':'ok';
}

function paintSlot(cat){
  var slot=document.getElementById('slot-'+cat);
  if(!slot) return;
  var checks=computeChecks();
  var st=slotStatus(cat,checks);
  slot.className='slot'+(cat==='mobo'?' wide':'')+(sel[cat]?(' full '+st):'');
  if(cat==='psu') slot.className='slot'+(sel[cat]?(' full '+st):'');
  var mk = st==='ok'?'<span class="smk">&#9989;</span>':st==='warn'?'<span class="smk">&#9888;&#65039;</span>':st==='bad'?'<span class="smk">&#10060;</span>':'';
  var inner='<div class="sname">'+SLOTNAME[cat]+mk+'</div>';
  inner+= sel[cat]? '<div class="scontent">'+sel[cat].name+'</div>' : '<div class="sempty">vuoto &mdash; clicca per scegliere</div>';
  slot.innerHTML=inner;
}

function repaint(){
  ['mobo','cpu','ram','gpu','disk','psu'].forEach(paintSlot);
  document.getElementById('caseLabel').textContent = sel.cs? sel.cs.name : 'Case (non scelto)';
  document.getElementById('moboLabel').textContent = sel.mobo? sel.mobo.name : 'Scheda madre';

  var checks=computeChecks();
  // power bar
  var pf=document.getElementById('powFill'), pt=document.getElementById('powTxt');
  if(sel.cpu&&sel.gpu){
    var need=Math.round((sel.cpu.tdp+sel.gpu.tdp+100)*1.3);
    var have=sel.psu?sel.psu.watt:0;
    var pctv=have?Math.min(100,Math.round(need/have*100)):100;
    pf.style.width=pctv+'%';
    pf.style.background=(have&&have>=need)?'#22c55e':'#ef4444';
    pt.textContent=need+' W / '+(have?have+' W':'PSU?');
  } else { pf.style.width='0'; pt.innerHTML='&mdash;'; }

  // diagnostics
  var dl=document.getElementById('diagList');
  if(!checks.length){ dl.innerHTML='<div class="dempty">Scegli i componenti dal magazzino a sinistra: le verifiche compaiono qui.</div>'; }
  else{
    dl.innerHTML=checks.map(function(ch){
      var mk=ch.status==='ok'?'&#9989;':ch.status==='warn'?'&#9888;&#65039;':'&#10060;';
      return '<div class="ditem"><span class="dmk">'+mk+'</span><span>'+ch.msg+'</span></div>';
    }).join('');
  }

  // boot button enable
  var allSel=REQUIRED.every(function(c){return !!sel[c];});
  var btn=document.getElementById('btnBoot');
  btn.disabled=!allSel||booted;
  var missing=REQUIRED.filter(function(c){return !sel[c];}).length;
  document.getElementById('hintTxt').textContent = allSel? '' : 'Mancano ancora '+missing+' componenti.';
}

function bootPc(){
  if(booted) return;
  var checks=computeChecks();
  var bad=checks.filter(function(c){return c.status==='bad';});
  booted=true;
  document.getElementById('btnBoot').disabled=true;
  var area=document.getElementById('bootArea');
  var lines, fail=bad.length>0;
  if(!fail){
    lines=["Accensione... le ventole girano, i LED si accendono.",
      "POST (Power-On Self-Test) in corso...",
      "CPU "+sel.cpu.name+" rilevata ("+sel.cpu.socket+").",
      "RAM "+sel.ram.type+" rilevata"+(sel.ram.dual?" - Dual Channel attivo.":" - canale singolo."),
      "Scheda video: "+sel.gpu.name+".",
      "Disco: "+sel.disk.name+" rilevato.",
      "Alimentatore "+sel.psu.watt+" W: tensioni 3.3V / 5V / 12V OK.",
      "BIOS/UEFI: tutti i componenti riconosciuti. Sistema pronto al boot. &#9989;"];
  } else {
    lines=["Accensione... le ventole partono ma il POST si blocca.",
      "ERRORE: la configurazione non e' compatibile.",""];
    bad.forEach(function(b){ lines.push("&#10060; "+b.msg); });
    lines.push("","Il PC NON completa l'avvio. Correggi i componenti in rosso e riprova.");
  }
  area.innerHTML='<div class="boot-screen'+(fail?' fail':'')+'" id="bootScreen"></div>';
  var bs=document.getElementById('bootScreen');
  lines.forEach(function(l,i){
    var d=el('div','bline', l===''?'&nbsp;':l);
    d.style.animationDelay=(i*0.28)+'s';
    bs.appendChild(d);
  });
  lastVerdict={fail:fail, checks:checks};
  setTimeout(showFinal, lines.length*280+500);
}

function showFinal(){
  var checks=lastVerdict.checks;
  var score=0, max=checks.length;
  checks.forEach(function(c){ score += c.status==='ok'?1 : c.status==='warn'?0.5 : 0; });
  var pct = max? Math.round(score/max*100):0;
  var booted_ok = !lastVerdict.fail;
  var passed = booted_ok && pct>=PASS;
  var voto30 = Math.round(pct/100*30);

  document.getElementById('app').classList.add('hidden');
  var rows = BIN_ORDER.map(function(cat){
    return '<tr><td>'+CATLABEL[cat]+'</td><td class="r">'+(sel[cat]?sel[cat].name:'&mdash;')+'</td></tr>';
  }).join('');
  var d=new Date();
  var dstr=d.toLocaleDateString('it-IT')+' '+d.toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'});
  var esitoTxt = booted_ok? '&#9989; IL PC SI AVVIA' : '&#10060; IL PC NON SI AVVIA';
  var fin=document.getElementById('final');
  fin.classList.remove('hidden');
  fin.innerHTML=
   '<div class="report" id="report">'
   +'<div class="rhead"><div><h2>Scheda di valutazione</h2><div class="rsub">'+TITLE+'</div></div>'
   +'<div class="vote">'+voto30+'<small>/30</small></div></div>'
   +'<div class="meta"><b>Studente:</b> '+escapeHtml(studentName)+'<br><b>Data:</b> '+dstr+'<br><b>Compatibilità:</b> '+Math.round(score)+' / '+max+' verifiche superate ('+pct+'%)</div>'
   +'<table><thead><tr><th>Componente</th><th class="r">Scelta</th></tr></thead><tbody>'+rows+'</tbody></table>'
   +'<div class="esito '+(passed?'pass':'fail')+'">'+esitoTxt+(passed?' &mdash; build compatibile':' &mdash; build da correggere')+'</div>'
   +'<div class="foot">Laboratorio di Informatica &mdash; Corso Installatori e Manutentori di Rete</div>'
   +'</div>'
   +'<div class="afterprint noprint"><button class="btn btn-primary" onclick="window.print()">\u{1F5A8}\u{FE0F} Stampa / Salva PDF</button>'
   +'<button class="btn btn-ghost" onclick="resetBuild()">Nuova build</button></div>';
  window.scrollTo(0,0);
}

function escapeHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

function resetBuild(){
  sel={}; booted=false; lastVerdict=null;
  document.getElementById('final').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  document.getElementById('bootArea').innerHTML='';
  buildBin();
  repaint();
}
</script>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html");
  res.status(200).send(html);
}
