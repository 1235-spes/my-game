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

// 🎰 الرموز
const symbols = ["🍒","🍋","🍇","🍎","🍉","🌳","7"];
const reelCount = 5;
const reelWidth = canvas.width / reelCount;
let spinning = false;

// 🎧 الأصوات
const spinSound = document.getElementById("spinSound");
const tickSound = document.getElementById("tickSound");
const winSound = document.getElementById("winSound");
const boomSound = document.getElementById("boomSound");

// 🔗 Firebase
const userId = "user_123"; // غيره حسب UID المستخدم
const balanceRef = database.ref('users/' + userId + '/balance');
const treeRef = database.ref('users/' + userId + '/treeLevel');
const jackpotRef = database.ref('jackpot/amount');

let balance = 1000;
let treeLevel = 1;
let jackpot = 5000;

balanceRef.on('value', snap => {
  const val = snap.val();
  if(val !== null) balance = val;
  document.getElementById("balance").innerText = balance;
});

treeRef.on('value', snap => {
  const val = snap.val();
  if(val !== null) treeLevel = val;
});

jackpotRef.on('value', snap => {
  const val = snap.val();
  if(val !== null) jackpot = val;
});

// 🎆 particles
let particles = [];
function spawnParticles(x, y, color="gold"){
  for(let i=0;i<80;i++){
    particles.push({
      x, y,
      vx:(Math.random()-0.5)*8,
      vy:(Math.random()-0.5)*8,
      life:120,
      size:Math.random()*3+1,
      color
    });
  }
}

function drawParticles(){
  fx.clearRect(0,0,fxCanvas.width,fxCanvas.height);
  particles.forEach((p,i)=>{
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.05; // gravity
    p.life--;
    fx.globalAlpha = p.life / 120;
    fx.fillStyle = p.color;
    fx.beginPath();
    fx.arc(p.x,p.y,p.size,0,Math.PI*2);
    fx.fill();
    if(p.life<=0) particles.splice(i,1);
  });
  fx.globalAlpha = 1;
  requestAnimationFrame(drawParticles);
}
drawParticles();

function flash(){
  fx.fillStyle="rgba(255,215,0,0.2)";
  fx.fillRect(0,0,fxCanvas.width,fxCanvas.height);
}

// 🎡 رسم الرموز
function draw(reelData){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(let i=0;i<reelCount;i++){
    let x = i * reelWidth + reelWidth/2;
    ctx.textAlign="center";
    ctx.textBaseline="middle";
    let symbol = reelData[i];
    ctx.save();
    ctx.translate(x,canvas.height/2);
    let scale = 1 + Math.sin(Date.now()/200 + i)*0.1;
    ctx.scale(scale,scale);
    if(symbol==="🌳"){
      ctx.shadowColor="gold";
      ctx.shadowBlur=20;
      ctx.font = `${70+treeLevel*5}px Arial`;
      ctx.fillText("🌳",0,0);
      ctx.shadowBlur=0;
    } else {
      ctx.font="70px Arial";
      ctx.fillText(symbol,0,0);
    }
    ctx.restore();
  }
}

// 🎰 RNG ذكي مع Jackpot
function smartSymbol(){
  let r = Math.random();
  if(r < 0.01) return "7"; // Jackpot احتمال أقل
  if(r < 0.06) return "🌳";
  return symbols[Math.floor(Math.random()*symbols.length)];
}

// 🏆 spin
async function spin(){
  if(spinning) return;
  spinning = true;

  let bet = Number(document.getElementById("bet").value);
  if(!bet || bet<=0) return alert("أدخل الرهان");
  if(bet > balance) return alert("رصيد غير كافي");

  balance -= bet;
  document.getElementById("balance").innerText = balance;
  balanceRef.set(balance);

  spinSound.play();

  let final=[];
  for(let i=0;i<reelCount;i++) final.push(smartSymbol());

  let frames = 30;
  for(let f=0;f<frames;f++){
    let temp=[];
    for(let i=0;i<reelCount;i++) temp.push(symbols[Math.floor(Math.random()*symbols.length)]);
    draw(temp);
    flash();
    if(f%3===0){ tickSound.currentTime=0; tickSound.play();}
    await new Promise(r=>setTimeout(r,70));
  }

  draw(final);

  // 💥 حساب النتائج
  let win=0;
  let resultText="";

  if(final.every(x=>"7"===x)){
    win = jackpot;
    resultText = `🎉 JACKPOT! +${win}`;
    spawnParticles(innerWidth/2,innerHeight/2,"red");
    jackpot = 1000; // Jackpot resets
    jackpotRef.set(jackpot);
  }
  else if(final[2]==="🌳" && final[1]===final[3]){
    win = bet*10;
    resultText = `🌳 TREE BONUS +${win}`;
    treeLevel++;
    treeRef.set(treeLevel);
    spawnParticles(innerWidth/2,innerHeight/2,"green");
  }
  else{
    let count={};
    final.forEach(s=>count[s]=(count[s]||0)+1);
    let max=Math.max(...Object.values(count));
    if(max>=3){
      win=bet*5;
      resultText=`✨ WIN +${win}`;
      spawnParticles(innerWidth/2,innerHeight/2,"gold");
    } else{
      resultText="❌ خسرت";
      boomSound.play();
      navigator.vibrate?.(200);
      jackpot += bet;
      jackpotRef.set(jackpot);
    }
  }

  balance += win;
  document.getElementById("balance").innerText = balance;
  balanceRef.set(balance);
  document.getElementById("result").innerText = resultText;

  if(win>0){ flash(); spawnParticles(innerWidth/2,innerHeight/2,"gold"); winSound.play();}
  spinning=false;
}

document.getElementById("spin").onclick=spin;
