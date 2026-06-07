// ===== CANVAS SETUP =====
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const fxCanvas = document.getElementById("fxCanvas");
const fx = fxCanvas.getContext("2d");

function resizeFx(){
  fxCanvas.width = window.innerWidth;
  fxCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeFx);
resizeFx();

// ===== GAME DATA =====
const symbols = ["🍒","🍋","🍇","🍎","🍉","🌳","7"];
const reels = 5;
const reelWidth = canvas.width / reels;
let spinning = false;

let currentBet = 300;
function selectBet(amount){ currentBet = amount; }

let balance = 1000;
document.getElementById("balance").innerText = balance;

// ===== PARTICLES =====
let particles = [];
function spawnParticles(x, y, color="gold"){
  for(let i=0;i<80;i++){
    particles.push({
      x,y,
      vx: (Math.random()-0.5)*6,
      vy: (Math.random()-0.5)*6,
      life: 100,
      color
    });
  }
}
function drawParticles(){
  fx.clearRect(0,0,fxCanvas.width,fxCanvas.height);
  for(let i=particles.length-1;i>=0;i--){
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.05;
    p.life--;
    fx.globalAlpha = p.life/100;
    fx.fillStyle = p.color;
    fx.fillRect(p.x,p.y,4,4);
    if(p.life <=0) particles.splice(i,1);
  }
  fx.globalAlpha = 1;
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ===== DRAW REELS =====
function draw(reelData){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let i=0;i<reels;i++){
    let x = i*reelWidth + reelWidth/2;
    let symbol = reelData[i];

    ctx.save();
    ctx.translate(x, canvas.height/2);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    let scale = 1 + Math.sin(Date.now()/200 + i)*0.1;
    ctx.scale(scale, scale);

    if(symbol==="🌳"){ ctx.shadowColor="gold"; ctx.shadowBlur=20; ctx.font="70px Arial"; }
    else if(symbol==="7"){ ctx.shadowColor="red"; ctx.shadowBlur=25; ctx.font="70px Arial"; }
    else{ ctx.font="70px Arial"; ctx.shadowBlur=0; }

    ctx.fillText(symbol,0,0);
    ctx.restore();
  }
}

// ===== SMART RNG =====
function smartSymbol(){
  let r = Math.random();
  if(r<0.02) return "7";
  if(r<0.07) return "🌳";
  return symbols[Math.floor(Math.random()*symbols.length)];
}

// ===== SPIN =====
async function spin(){
  if(spinning) return;
  spinning = true;

  if(currentBet > balance){ alert("رصيد غير كافي"); spinning=false; return; }

  balance -= currentBet;
  document.getElementById("balance").innerText = balance;

  let final = [];
  for(let i=0;i<reels;i++) final.push(smartSymbol());

  let frames = 25;
  for(let f=0; f<frames; f++){
    let temp = [];
    for(let i=0;i<reels;i++) temp.push(symbols[Math.floor(Math.random()*symbols.length)]);
    draw(temp);
    await new Promise(r=>setTimeout(r,80));
  }

  draw(final);

  let win = 0;
  let resultText = "";

  if(final.every(x=>"7"===x)){
    win = currentBet*100;
    resultText="🔥 JACKPOT!";
    spawnParticles(innerWidth/2, innerHeight/2, "red");
  }
  else if(final[2]==="🌳" && final[1]===final[3]){
    win = currentBet*20;
    resultText="🌳 TREE BONUS!";
    spawnParticles(innerWidth/2, innerHeight/2, "green");
  }
  else{
    let count={};
    final.forEach(s=>count[s]=(count[s]||0)+1);
    let max = Math.max(...Object.values(count));
    if(max>=3){ win=currentBet*5; resultText="✨ WIN!"; spawnParticles(innerWidth/2, innerHeight/2,"gold"); }
    else{ resultText="❌ خسرت"; }
  }

  balance += win;
  document.getElementById("balance").innerText = balance;
  document.getElementById("result").innerText = resultText;

  spinning=false;
}

document.getElementById("spin").onclick = spin;

// ===== INIT =====
function init(){
  let temp = [];
  for(let i=0;i<reels;i++) temp.push(symbols[Math.floor(Math.random()*symbols.length)]);
  draw(temp);
}
init();
