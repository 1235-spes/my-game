let selectedBet = 300;

let spinBtn;
let resultDiv;
let canvas;
let ctx;

// ننتظر تحميل الصفحة بالكامل (مهم جداً للموبايل)
window.addEventListener("load", () => {

    spinBtn = document.getElementById("spin");
    resultDiv = document.getElementById("result");
    canvas = document.getElementById("gameCanvas");

    if (!spinBtn || !resultDiv || !canvas) {
        console.log("❌ عناصر اللعبة غير جاهزة");
        return;
    }

    ctx = canvas.getContext("2d");

    // الأزرار
    const betButtons = document.querySelectorAll(".bet-buttons button");

    betButtons.forEach(btn => {
        btn.addEventListener("click", () => {

            let value = btn.innerText;

            if (value.includes("K")) {
                selectedBet = parseFloat(value) * 1000;
            } else if (value.includes("M")) {
                selectedBet = parseFloat(value) * 1000000;
            } else {
                selectedBet = Number(value);
            }

            resultDiv.innerText = "تم اختيار الرهان: " + selectedBet;
        });
    });

    spinBtn.addEventListener("click", spinGame);

    initGame();
});

// رسم بسيط
function initGame() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "gold";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("🌳 Golden Tree جاهزة", canvas.width/2, 50);
}

// لعبة SPIN
async function spinGame() {

    const userRef = window.userRef;

    if (!userRef) {
        resultDiv.innerText = "❌ خطأ: userRef غير موجود";
        return;
    }

    let snap = await userRef.once("value");
    let user = snap.val();

    if (!user) {
        resultDiv.innerText = "❌ لا يوجد مستخدم";
        return;
    }

    let balance = user.balance || 0;

    if (balance < selectedBet) {
        resultDiv.innerText = "❌ رصيدك غير كافي!";
        return;
    }

    // خصم الرهان
    balance -= selectedBet;

    // نظام الفوز
    const win = Math.random() > 0.5;
    let winAmount = win ? selectedBet * (1 + Math.random() * 2) : 0;

    balance += winAmount;

    await userRef.update({
        balance: balance,
        earnings: (user.earnings || 0) + winAmount,
        points: (user.points || 0) + 10,
        wins: (user.wins || 0) + (win ? 1 : 0)
    });

    resultDiv.innerText = win
        ? "🎉 فزت " + Math.floor(winAmount)
        : "😢 خسرت";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "gold";
    ctx.font = "24px Arial";
    ctx.fillText(
        win ? "🎉 WIN!" : "💔 LOSE",
        canvas.width/2,
        120
    );
}
