// ===============================
// GOLDEN TREE - SAFE START VERSION
// ===============================

let canvas, ctx;
let fxCanvas, fxCtx;
let spinBtn;
let resultBox;

let selectedBet = 0;
let balance = 0;

// ننتظر تحميل الصفحة بالكامل
window.addEventListener("load", () => {

    canvas = document.getElementById("gameCanvas");
    fxCanvas = document.getElementById("fxCanvas");
    spinBtn = document.getElementById("spin");
    resultBox = document.getElementById("result");

    // تحقق أمان
    if (!canvas || !spinBtn || !resultBox) {
        console.log("Game elements not ready");
        return;
    }

    ctx = canvas.getContext("2d");
    fxCtx = fxCanvas.getContext("2d");

    fxCanvas.width = window.innerWidth;
    fxCanvas.height = window.innerHeight;

    balance = Number(document.getElementById("balance")?.innerText || 0);

    draw();

    spinBtn.addEventListener("click", spinGame);

    requestAnimationFrame(loop);
});

// ===============================
// اختيار الرهان
// ===============================
window.selectBet = function(amount){
    selectedBet = amount;
    document.getElementById("result").innerText =
        "💰 الرهان: " + amount;
};

// ===============================
// رسم بسيط جداً (للتأكد أنه يعمل)
// ===============================
function draw(){
    if (!ctx) return;

    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, 60, 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle = "gold";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GOLDEN TREE LOADED", canvas.width/2, 50);
}

// ===============================
// SPIN
// ===============================
function spinGame(){

    if (selectedBet <= 0) {
        alert("اختر رهان أولاً");
        return;
    }

    if (selectedBet > balance) {
        document.getElementById("result").innerText = "❌ رصيد غير كافي";
        return;
    }

    let win = Math.random() > 0.5;

    if (win) {
        let reward = selectedBet * 2;
        balance += reward;
        document.getElementById("result").innerText =
            "🎉 فزت " + reward;
    } else {
        balance -= selectedBet;
        document.getElementById("result").innerText =
            "😢 خسرت";
    }

    document.getElementById("balance").innerText = balance;
}

// ===============================
// LOOP (للتأكد أن الرسم شغال)
// ===============================
function loop(){
    draw();
    requestAnimationFrame(loop);
}
