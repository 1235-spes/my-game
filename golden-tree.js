
// ===============================
// GOLDEN TREE GAME - CHANCI
// ===============================

let currentBet = 0;
let isSpinning = false;

// عناصر اللعبة
const spinBtn = document.getElementById("spin");
const resultBox = document.getElementById("result");

// Canvas (جاهز للتطوير لاحقاً)
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// fx canvas (مستقبل تأثيرات)
const fxCanvas = document.getElementById("fxCanvas");

// Firebase user
const currentUser = localStorage.getItem("currentUser");
const db = firebase.database();

// ===============================
// اختيار الرهان
// ===============================
function selectBet(amount) {
    currentBet = amount;
    resultBox.innerText = `💰 تم اختيار الرهان: ${amount}`;
}

// ===============================
// زر SPIN
// ===============================
spinBtn.addEventListener("click", async () => {

    if (isSpinning) return;

    if (currentBet <= 0) {
        alert("اختر قيمة الرهان أولاً!");
        return;
    }

    isSpinning = true;
    spinBtn.disabled = true;

    resultBox.innerText = "⏳ جاري اللعب...";

    // جلب بيانات المستخدم
    const userRef = db.ref("users/" + currentUser);
    const snapshot = await userRef.once("value");
    const user = snapshot.val();

    if (!user) {
        alert("المستخدم غير موجود");
        isSpinning = false;
        spinBtn.disabled = false;
        return;
    }

    // التحقق من الرصيد
    if ((user.balance || 0) < currentBet) {
        resultBox.innerText = "❌ رصيد غير كافي";
        isSpinning = false;
        spinBtn.disabled = false;
        return;
    }

    // خصم الرهان
    let newBalance = (user.balance || 0) - currentBet;

    // نتيجة عشوائية (50% ربح)
    const win = Math.random() < 0.5;

    let reward = 0;

    if (win) {
        reward = currentBet * (Math.random() * 2 + 1); // 1x - 3x
        newBalance += reward;
    }

    // تحديث Firebase
    await userRef.update({
        balance: newBalance,
        earnings: (user.earnings || 0) + (win ? reward : 0),
        wins: (user.wins || 0) + (win ? 1 : 0)
    });

    // عرض النتيجة
    if (win) {
        resultBox.innerText = `🎉 فزت بـ ${Math.floor(reward)}!`;
        drawWinEffect();
    } else {
        resultBox.innerText = "😢 خسرت هذه الجولة";
    }

    // إعادة التفعيل
    setTimeout(() => {
        isSpinning = false;
        spinBtn.disabled = false;
    }, 1000);
});

// ===============================
// تأثير بسيط (مستقبلي تطوير FX)
// ===============================
function drawWinEffect() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "gold";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";

    ctx.fillText("🎉 WIN!", canvas.width / 2, canvas.height / 2);

    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 800);
}
