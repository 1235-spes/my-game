let selectedBet = 300;
const betButtons = document.querySelectorAll(".bet-buttons button");
betButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        selectedBet = Number(btn.innerText.replace(/K|M/g, m => {
            if (m === "K") return "000";
            if (m === "M") return "000000";
        }));
        document.getElementById("result").innerText = `تم اختيار الرهان: ${selectedBet}`;
    });
});

const spinBtn = document.getElementById("spin");
const resultDiv = document.getElementById("result");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

async function initGame() {
    // رسم خلفية بسيطة
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "gold";
    ctx.font = "24px Arial";
    ctx.fillText("🌳 لعبة الشجرة الذهبية", 20, 40);
}

spinBtn.addEventListener("click", async () => {
    let snap = await userRef.once("value");
    let user = snap.val();
    let balance = user.balance || 0;

    if (balance < selectedBet) {
        resultDiv.innerText = "رصيدك غير كافي!";
        return;
    }

    // خصم الرهان
    balance -= selectedBet;

    // حساب ربح عشوائي
    const winMultiplier = [0, 0, 0, 2, 3, 5]; // أحياناً تخسر
    const multiplier = winMultiplier[Math.floor(Math.random() * winMultiplier.length)];
    const winAmount = selectedBet * multiplier;

    balance += winAmount;

    // تحديث النقاط والأرباح والفوز
    const newPoints = (user.points || 0) + 10;
    const newEarnings = (user.earnings || 0) + winAmount;
    const newWins = (user.wins || 0) + (winAmount > 0 ? 1 : 0);

    await userRef.update({
        balance: balance,
        points: newPoints,
        earnings: newEarnings,
        wins: newWins
    });

    // عرض النتيجة
    resultDiv.innerText = winAmount > 0 
        ? `فزت بـ ${winAmount} 💰` 
        : "خسرت 😢";

    // تحديث الكانفاس مؤقت
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "gold";
    ctx.font = "24px Arial";
    ctx.fillText(winAmount > 0 ? `🎉 +${winAmount}` : "💔 خسارة", 20, 50);
});
