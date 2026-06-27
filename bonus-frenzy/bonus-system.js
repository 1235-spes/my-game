// ===============================
// BONUS SYSTEM
// ===============================

const bonusBtn = document.getElementById("bonusBtn");
const bonusMenu = document.getElementById("bonusMenu");


const bonus = {
    active: false,
    totalSpins: 0,
    spinsLeft: 0,
    totalWin: 0,
    cost: 0,

    multiplier: 1,
    wildBoost: false,
    jackpotBoost: false
};
// فتح وإغلاق القائمة
bonusBtn.addEventListener("click", () => {
    bonusMenu.classList.toggle("hidden");
});

// أزرار شراء البونص
bonusMenu.querySelectorAll("button").forEach(btn => {

    btn.addEventListener("click", () => {

        const cost = Number(btn.dataset.cost);
        const spins = Number(btn.dataset.spins);

        buyBonus(spins, cost);

    });

});

// شراء البونص
function buyBonus(spins, cost){

    bonusMenu.classList.add("hidden");

    if(isSpinning){
        return;
    }

    if(balance < cost){
        alert("الرصيد غير كافٍ");
        return;
    }

    // خصم الرصيد
    balance -= cost;

    document.getElementById("balance").innerText = balance;

    firebase.database()
    .ref("users/" + currentUser)
    .update({
        balance: balance
    });

    // تشغيل البونص
    bonus.active = true;
bonus.totalSpins = spins;
bonus.spinsLeft = spins;
bonus.totalWin = 0;
bonus.cost = cost;

// 💎 ميزات البونص
bonus.multiplier = 2;
bonus.wildBoost = true;
bonus.jackpotBoost = true;

    playBonusIntro();
    
    
function showBonusIntro(spins){

    const overlay = document.getElementById("bonusOverlay");
    const text = document.getElementById("bonusSpinsText");

    overlay.classList.remove("hidden");

    text.innerText = "عدد اللفات: " + spins;

    setTimeout(() => {

        overlay.classList.add("hidden");

        // ⏳ بعد 3 ثواني يبدأ البونص فعليًا
        setTimeout(() => {
            playBonus();
        }, 300);

    }, 3000);
}
function playBonus(){

    if(!bonus.active) return;

    if(isSpinning) return;

    if(bonus.spinsLeft <= 0){
        finishBonus();
        return;
    }

    bonus.spinsLeft--;

    // 🔥 تأثير زيادة السرعة داخل البونص
    spinSpeed = 3000;

    spin();

    // ⏳ تشغيل اللفة التالية
    setTimeout(() => {

        if(bonus.active){
            playBonus();
        }

    }, spinSpeed + 800);
    }
function finishBonus(){

    bonus.active = false;

    // 💰 إظهار ملخص الربح
    alert(
        "🎉 انتهى البونص\n" +
        "💰 إجمالي الربح: " + bonus.totalWin
    );

    // 🔄 إعادة الوضع الطبيعي
    bonus.multiplier = 1;
    bonus.wildBoost = false;
    bonus.jackpotBoost = false;
}
