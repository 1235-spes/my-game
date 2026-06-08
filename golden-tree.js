// ===============================
// GOLDEN TREE - FIX VISUAL VERSION
// ===============================

let currentBet = 0;
let isSpinning = false;

const spinBtn = document.getElementById("spin");
const resultBox = document.getElementById("result");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const fxCanvas = document.getElementById("fxCanvas");
const fxCtx = fxCanvas.getContext("2d");

const currentUser = localStorage.getItem("currentUser");
const db = firebase.database();

// 🔥 ضبط حجم fxCanvas
function resizeCanvas() {
    fxCanvas.width = window.innerWidth;
    fxCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ===============================
// رسم الخلفية (مهم جداً)
// ===============================
function drawBackground() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // شجرة وهمية بسيطة (مؤقتاً)
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(450, 120, 40, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#8B4513";
    ctx.fillRect(440, 160, 20, 60);

    ctx.fillStyle = "gold";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("🌳 GOLDEN TREE", 450, 40);
}

// loop للرسم
function loop() {
    drawBackground();
    requestAnimationFrame(loop);
}
loop();

// ===============================
function selectBet(amount) {
    currentBet = amount;
    resultBox.innerText = `💰 الرهان: ${amount}`;
}

// ===============================
spinBtn.addEventListener("click", async () => {

    if (isSpinning) return;

    if (currentBet <= 0) {
        alert("اختر رهان أولاً!");
        return;
    }

    isSpinning = true;
    spinBtn.disabled = true;

    resultBox.innerText = "⏳ جاري اللعب...";

    const userRef = db.ref("users/" + currentUser);
    const snap = await userRef.once("value");
    const user = snap.val();

    if (!user) return;

    if ((user.balance || 0) < currentBet) {
        resultBox.innerText = "❌ رصيد غير كافي";
        isSpinning = false;
        spinBtn.disabled = false;
        return;
    }

    let balance = user.balance - currentBet;

    const win = Math.random() < 0.5;
    let reward = 0;

    if (win) {
        reward = currentBet * (1 + Math.random() * 2);
        balance += reward;
    }

    await userRef.update({
        balance: balance,
        earnings: (user.earnings || 0) + (win ? reward : 0),
        wins: (user.wins || 0) + (win ? 1 : 0)
    });

    resultBox.innerText = win
        ? `🎉 فزت ${Math.floor(reward)}`
        : "😢 خسرت";

    setTimeout(() => {
        isSpinning = false;
        spinBtn.disabled = false;
    }, 800);
});
