
// =========================
// BONUS ENGINE
// =========================

let bonus = {

    active: false,

    totalSpins: 0,

    spinsLeft: 0,

    totalWin: 0,

    cost: 0

};

// بدء البونص
function startBonus(spins, cost){

    if(bonus.active) return;

    bonus.active = true;

    bonus.totalSpins = spins;

    bonus.spinsLeft = spins;

    bonus.totalWin = 0;

    bonus.cost = cost;

    console.log("BONUS STARTED");

}
// =========================
// شراء البونص
// =========================

function buyBonus(spins, cost){

    if(isSpinning) return;

    if(balance < cost){

        alert("رصيدك غير كافٍ");

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

    // تشغيل نظام البونص
    startBonus(spins, cost);

    updateBonusUI();

    playBonusIntro();

}
