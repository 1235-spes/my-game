// =====================
// GOLDEN TREE - BASIC WORKING VERSION
// =====================

let currentBet = 0;
let isSpinning = false;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const fxCanvas = document.getElementById("fxCanvas");
const fxCtx = fxCanvas.getContext("2d");

// ضبط fxCanvas ليملأ الشاشة
function resizeCanvas() {
    fxCanvas.width = window.innerWidth;
    fxCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// زر SPIN
const spinBtn = document.getElementById("spin");
const resultBox = document.getElementById("result");

// رسم شجرة بسيطة
function drawTree() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // خلفية
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // جذع
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(canvas.width / 2 - 10, canvas.height / 2, 20, 80);

    // تاج الشجرة
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
    ctx.fill();

    // نص
    ctx.fillStyle = "gold";
    ctx.font = "22px Arial";
    ctx.textAlign = "center";
    ctx.fillText("🌳 GOLDEN TREE 🌳", canvas.width / 2, 30);
}

// loop للرسم مستمر
function loop() {
    drawTree();
    requestAnimationFrame(loop);
}
loop();

// اختيار الرهان
function selectBet(amount) {
    currentBet = amount;
    resultBox.innerText = `💰 الرهان: ${amount}`;
}

// SPIN
spinBtn.addEventListener("click", async () => {

    if (isSpinning) return;

    if (currentBet <= 0) {
        alert("اختر الرهان أولاً!");
        return;
    }

    isSpinning = true;
    spinBtn.disabled = true;
    resultBox.innerText = "⏳ جاري اللعب...";

    const currentUser = localStorage.getItem("currentUser");
    if(!currentUser) {
        alert("خطأ: المستخدم غير موجود");
        return;
    }

    const db = firebase.database();
    const userRef = db.ref("users/" + currentUser);
    const snap = await userRef.once("value");
    const user = snap.val();
    if(!user) return;

    if((user.balance || 0) < currentBet){
        resultBox.innerText = "❌ رصيد غير كافي";
        isSpinning = false;
        spinBtn.disabled = false;
        return;
    }

    // تحديد الفوز
    const win = Math.random() < 0.5;
    let reward = 0;
    let balance = user.balance - currentBet;

    if(win){
        reward = currentBet * (1 + Math.random()*2);
        balance += reward;
    }

    await userRef.update({
        balance: balance,
        earnings: (user.earnings || 0) + (win ? reward : 0),
        wins: (user.wins || 0) + (win ? 1 : 0)
    });

    resultBox.innerText = win ? `🎉 فزت ${Math.floor(reward)}` : "😢 خسرت";

    setTimeout(() => {
        isSpinning = false;
        spinBtn.disabled = false;
    }, 1000);
});
