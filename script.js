const PRESETS = [
  { name:'Sprint',       swim:750,  bike:20,  run:5 },
  { name:'Olímpico',     swim:1500, bike:40,  run:10 },
  { name:'Meio Ironman', swim:1900, bike:90,  run:21.1 },
  { name:'Ironman',      swim:3800, bike:180, run:42.2 }
];
let activeIdx = 0;

function parseMS(str){
  if(!str) return 0;
  const parts = str.split(':').map(Number);
  if(parts.length===2) return parts[0]*60+parts[1];
  return Number(str)||0;
}
function fmtHMS(totalSec){
  totalSec = Math.round(totalSec);
  const h = Math.floor(totalSec/3600);
  const m = Math.floor((totalSec%3600)/60);
  const s = totalSec%60;
  const mm = String(m).padStart(2,'0');
  const ss = String(s).padStart(2,'0');
  return h>0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}

function renderPresets(){
  const el = document.getElementById('presets');
  el.innerHTML = '';
  PRESETS.forEach((p,i)=>{
    const btn = document.createElement('button');
    btn.className = 'preset-btn' + (i===activeIdx ? ' active' : '');
    btn.innerHTML = `${p.name}<span class="preset-dist">${p.swim>=1000 ? (p.swim/1000)+'km' : p.swim+'m'} · ${p.bike}km · ${p.run}km</span>`;
    btn.addEventListener('click', ()=>{ activeIdx=i; renderPresets(); calculate(); });
    el.appendChild(btn);
  });
  const p = PRESETS[activeIdx];
  document.getElementById('distRow').innerHTML =
    `<span>Natação: <b>${p.swim} m</b></span><span>Bike: <b>${p.bike} km</b></span><span>Corrida: <b>${p.run} km</b></span>`;
}

function calculate(){
  const p = PRESETS[activeIdx];
  const swimSecPer100 = parseMS(document.getElementById('swimPace').value);
  const t1Sec = parseMS(document.getElementById('t1').value);
  const bikeSpeed = Number(document.getElementById('bikeSpeed').value) || 0;
  const t2Sec = parseMS(document.getElementById('t2').value);
  const runSecPerKm = parseMS(document.getElementById('runPace').value);

  const swimSec = (p.swim/100) * swimSecPer100;
  const bikeSec = bikeSpeed>0 ? (p.bike/bikeSpeed)*3600 : 0;
  const runSec = p.run * runSecPerKm;

  const legs = [
    ['Natação', swimSec],
    ['T1', t1Sec],
    ['Bike', bikeSec],
    ['T2', t2Sec],
    ['Corrida', runSec]
  ];

  let cum = 0;
  const tbody = document.getElementById('resultsBody');
  tbody.innerHTML = '';
  legs.forEach(([name,sec])=>{
    cum += sec;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${name}</td><td>${fmtHMS(sec)}</td><td>${fmtHMS(cum)}</td>`;
    tbody.appendChild(tr);
  });
  const trTotal = document.createElement('tr');
  trTotal.className = 'total';
  trTotal.innerHTML = `<td>Total</td><td></td><td>${fmtHMS(cum)}</td>`;
  tbody.appendChild(trTotal);
}

document.querySelectorAll('input').forEach(inp=> inp.addEventListener('input', calculate));
renderPresets();
calculate();
