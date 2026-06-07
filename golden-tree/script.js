const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const fxCanvas = document.getElementById("fxCanvas");
const fx = fxCanvas.getContext("2d");

fxCanvas.width = window.innerWidth;
fxCanvas.height = window.innerHeight;

// 🎰 الرموز
const symbols = ["🍒","🍋","🍇","🍎","🍉","🌳","7"];

let balance = 1000;
document.getElementById("balance").innerText = balance;

// 🎧 الأصوات
const spinSound = document.getElementById("spinSound");
const tickSound = document.getElementById("tickSound");
const winSound = document.getElementById("winSound");
const boomSound = document.getElementById("boomSound");

// 🎆 particles
let particles = [];

function spawnParticles(x,y){
  for(let i=0;i<50;i++){
    particles.push({
      x,y,
      vx:(Math.random()-0.5)*6,
      vy:(Math.random()-0.5)*6,
      life:100
    });
  }
}

function drawParticles(){
  fx.clearRect(0,0,fxCanvas.width,fxCanvas.height);

  particles.forEach((p,i)=>{
    p.x += p.vx;
    p.y += p.vy;
    p.life--;

    fx.fillStyle="gold";
    fx.fillRect(p.x,p.y,3,3);

    if(p.life<=0) particles.splice(i,1);
  });

  requestAnimationFrame(drawParticles);
}
drawParticles();

// 🎰 إعدادات اللعبة
const reels = 5;
const reelWidth = canvas.width / reels;
let spinning = false;

// 🧠 RNG ذكي
function smartSymbol(){
  let r = Math.random();
  if(r < 0.02) return "7";
  if(r < 0.07) return "🌳";
  return symbols[Math.floor(Math.random()*symbols.length)];
}

// 🎡 رسم الكانفاس
function draw(reelData, offset=0){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  for(let i=0;i<reels;i++){
    let x = i * reelWidth + reelWidth/2;

    ctx.font = "70px Arial";
    ctx.textAlign="center";
    ctx.textBaseline="middle";

    let symbol = reelData[i];

    ctx.save();
    ctx.translate(x,canvas.height/2);

    let scale = 1 + Math.sin(Date.now()/200 + i)*0.1;
    ctx.scale(scale,scale);

    ctx.fillText(symbol,0,0);
    ctx.restore();
  }
}

// 🎡 spin animation
async function spin(){
  if(spinning) return;
  spinning = true;

  let bet = Number(document.getElementById("bet").value);
  if(!bet || bet<=0) return alert("أدخل رهان");
  if(bet > balance) return alert("رصيد غير كافي");

  balance -= bet;
  document.getElementById("balance").innerText = balance;

  spinSound.play();

  let final = [];

  for(let i=0;i<reels;i++){
    final.push(smartSymbol());
  }

  // animation
  let frames = 25;
  for(let f=0; f<frames; f++){
    let temp = [];
    for(let i=0;i<reels;i++){
      temp.push(symbols[Math.floor(Math.random()*symbols.length)]);
    }

    draw(temp);

    if(f % 3 === 0){
      tickSound.currentTime=0;
      tickSound.play();
    }

    await new Promise(r=>setTimeout(r,80));
  }

  draw(final);

  // 💥 النتائج
  let win = 0;
  let resultText = "";

  if(final.every(x=>x==="7")){
    win = bet * 100;
    resultText = "🔥 JACKPOT 7x100!";
    spawnParticles(innerWidth/2,innerHeight/2);
  }

  else if(final[2]==="🌳" && final[1]===final[3]){
    win = bet * 20;
    resultText = "🌳 TREE BONUS!";
    spawnParticles(innerWidth/2,innerHeight/2);
  }

  else{
    let count = {};
    final.forEach(s=>count[s]=(count[s]||0)+1);
    let max = Math.max(...Object.values(count));
    if(max >= 3){
      win = bet * 5;
      resultText = "✨ WIN!";
      spawnParticles(innerWidth/2,innerHeight/2);
    } else{
      resultText = "❌ خسرت";
      boomSound.play();
    }
  }

  balance += win;
  document.getElementById("balance").innerText = balance;
  document.getElementById("result").innerText = resultText;

  if(win > 0) winSound.play();

  spinning = false;
}

document.getElementById("spin").onclick = spin;
