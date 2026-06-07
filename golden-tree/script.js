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

// الرموز
const symbols = ["🍒","🍋","🍇","🍎","🍉","🌳","7"];
const reels = 5;

let balance = 1000;
let bet = 300;
let spinning = false;

document.getElementById("balance").innerText = balance;

// اختيار الرهان
window.setBet = function(value){
  bet = value;
  document.getElementById("result").innerText = "Bet: " + bet;
};

// رسم
function draw(data){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  for(let i=0;i<reels;i++){
    ctx.font = "60px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    let x = (i+1) * 150;
    ctx.fillText(data[i], x, 120);
  }
}

// عشوائي
function randomSymbol(){
  return symbols[Math.floor(Math.random()*symbols.length)];
}

// spin
document.getElementById("spin").onclick = async function(){

  if(spinning) return;
  spinning = true;

  if(bet > balance){
    alert("رصيد غير كافي");
    spinning = false;
    return;
  }

  balance -= bet;
  document.getElementById("balance").innerText = balance;

  let result = [];

  for(let i=0;i<reels;i++){
    result.push(randomSymbol());
  }

  // أنيميشن بسيط
  for(let i=0;i<20;i++){
    draw([randomSymbol(),randomSymbol(),randomSymbol(),randomSymbol(),randomSymbol()]);
    await new Promise(r=>setTimeout(r,80));
  }

  draw(result);

  // win logic بسيط
  let win = 0;

  if(result.every(x=>x==="7")){
    win = bet * 50;
    document.getElementById("result").innerText = "JACKPOT!";
  }
  else if(result.includes("🌳")){
    win = bet * 3;
    document.getElementById("result").innerText = "TREE WIN!";
  }
  else{
    document.getElementById("result").innerText = "LOSE";
  }

  balance += win;
  document.getElementById("balance").innerText = balance;

  spinning = false;
};
