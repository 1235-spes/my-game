// ===== Golden Tree Game =====
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let fxCanvas = document.getElementById("fxCanvas");
let fxCtx = fxCanvas.getContext("2d");
fxCanvas.width = window.innerWidth;
fxCanvas.height = window.innerHeight;

let selectedBet = 300;
let balance = parseInt(document.getElementById("balance").innerText);

function selectBet(amount){
    selectedBet = amount;
    document.getElementById("result").innerText = `تم اختيار الرهان: ${selectedBet}`;
}

// رسم الشجرة
function drawTree(){
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // الجذع
    ctx.fillStyle = "#654321";
    ctx.fillRect(canvas.width/2 - 20, canvas.height-100, 40, 100);

    // التاج
    ctx.fillStyle = "#228B22";
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, canvas.height-250);
    ctx.lineTo(canvas.width/2 - 100, canvas.height-100);
    ctx.lineTo(canvas.width/2 + 100, canvas.height-100);
    ctx.closePath();
    ctx.fill();
}

// تأثيرات الذهبية
let particles = [];
function spawnParticles(x, y){
    for(let i=0;i<10;i++){
        particles.push({
            x: x,
            y: y,
            vx: (Math.random()-0.5)*4,
            vy: -Math.random()*3,
            alpha: 1,
        });
    }
}

function updateParticles(){
    fxCtx.clearRect(0,0,fxCanvas.width, fxCanvas.height);
    for(let i=0;i<particles.length;i++){
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;
        fxCtx.fillStyle = `rgba(255,215,0,${p.alpha})`;
        fxCtx.beginPath();
        fxCtx.arc(p.x, p.y, 4, 0, Math.PI*2);
        fxCtx.fill();
        if(p.alpha <= 0) particles.splice(i,1);
    }
}

// عملية الدوران والربح
document.getElementById("spin").addEventListener("click",()=>{
    if(selectedBet > balance){
        document.getElementById("result").innerText = "رصيدك غير كافي!";
        return;
    }

    balance -= selectedBet;
    document.getElementById("balance").innerText = balance;

    let win = Math.random() < 0.5; // 50% فوز أو خسارة
    if(win){
        let winnings = selectedBet * 2;
        balance += winnings;
        document.getElementById("balance").innerText = balance;
        document.getElementById("wins").innerText = parseInt(document.getElementById("wins").innerText)+1;
        document.getElementById("result").innerText = `🎉 فزت بـ ${winnings} !`;
        spawnParticles(canvas.width/2, canvas.height-150);
    }else{
        document.getElementById("result").innerText = "😢 خسرت! حاول مرة أخرى";
    }
});

// تحديث الرسومات باستمرار
function gameLoop(){
    drawTree();
    updateParticles();
    requestAnimationFrame(gameLoop);
}

// تهيئة اللعبة عند فتحها
function initGame(){
    gameLoop();
}
