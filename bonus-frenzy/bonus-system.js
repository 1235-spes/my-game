
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
