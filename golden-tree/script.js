// ===== CANVAS SETUP =====
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const fxCanvas = document.getElementById("fxCanvas");
const fx = fxCanvas.getContext("2d");

fxCanvas.width = window.innerWidth;
fxCanvas.height = window.innerHeight;
window.addEventListener("resize", ()=>{
  fxCanvas.width = window.innerWidth;
  fxCanvas.height = window.innerHeight;
});

// ===== GAME DATA =====
const symbols = ["🍒","🍋","🍇","🍎","🍉","🌳","7"];
const reels = 5;
const reelWidth = canvas.width / reels;
let spinning = false;
let balance = 1000;
let selectedBet = 300;
document.getElementById("balance").innerText = balance;

// ===== BET SELECTION =====
function selectBet(amount){
  selectedBet = amount;
  document.querySelectorAll(".bet-btn").forEach(btn=>btn.classList.remove("active"));
  event.target.classList.add("active");
}

// ===== PARTICLES =====
let particles = [];
function spawnParticles(x,y,color="gold"){
  for(let i=0;i<50;i++){
    particles.push({
      x, y,
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
    fx.globalAlpha = p.life / 100;
    fx.fillStyle = p.color;
    fx.fillRect(p.x,p.y,3,3);
    if(p.life <= 0) particles.splice(i,1);
  }
  fx.globalAlpha = 1;
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ===== RNG =====
function smartSymbol(){
  let r = Math.random();
  if(r < 0.02) return "7";
  if(r < 0.07) return "🌳";
  return symbols[Math.floor(Math.random()*symbols.length)];
}

// ===== DRAW REELS =====
function draw(reelData){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let i=0;i<reels;i++){
    let x = i*reelWidth + reelWidth/2;
    let symbol = reelData[i];
    ctx.save();
    ctx.translate(x,canvas.height/2);
    ctx.textAlign="center";
    ctx.textBaseline="middle";
    ctx.font="70px Arial";
    ctx.fillText(symbol,0,0);
    ctx.restore();
  }
}

// ===== SPIN =====
async function spin(){
  if(spinning) return;
  spinning = true;

  let bet = selectedBet;
  if(bet > balance) return alert("رصيد غير كافي");
  balance -= bet;
  document.getElementById("balance").innerText = balance;

  let final=[];
  for(let i=0;i<reels;i++) final.push(smartSymbol());

  for(let f=0;f<25;f++){
    let temp=[];
    for(let i=0;i<reels;i++) temp.push(symbols[Math.floor(Math.random()*symbols.length)]);
    draw(temp);
    await new Promise(r=>setTimeout(r,80));
  }

  draw(final);

  let win=0;
  let resultText="❌ خسرت";

  if(final.every(x=>"7"===x)){
    win = bet*100;
    resultText = "🔥 JACKPOT!";
    spawnParticles(innerWidth/2,innerHeight/2,"red");
  } else if(final[2]==="🌳" && final[1]===final[3]){
    win = bet*20;
    resultText = "🌳 TREE BONUS!";
    spawnParticles(innerWidth/2,innerHeight/2,"green");
  } else{
    let count={};
    final.forEach(s=>count[s]=(count[s]||0)+1);
    let max=Math.max(...Object.values(count));
    if(max>=3){
      win = bet*5;
      resultText = "✨ WIN!";
      spawnParticles(innerWidth/2,innerHeight/2,"gold");
    }
  }

  balance += win;
  document.getElementById("balance").innerText = balance;
  document.getElementById("result").innerText = resultText;

  spinning=false;
}

document.getElementById("spin").onclick = spin;

// ===== INIT =====
selectBet(300);
