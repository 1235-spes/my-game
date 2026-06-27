window.bonus = {
  active: false,
  type: 1,
  spinsLeft: 0,
  totalSpins: 5,
  multiplier: 1,
  wildCount: 1,
  totalWin: 0,
  cost: 0
};

function startBonus(type, spins, cost){

  if(isSpinning) return;

  bonus.active = true;
  bonus.type = type;
  bonus.totalSpins = spins;
  bonus.spinsLeft = spins;
  bonus.totalWin = 0;
  bonus.cost = cost;

  // 🎯 تحديد قوة البونص
  if(type === 1){
    bonus.multiplier = 2;
    bonus.wildCount = 1;
  }

  if(type === 2){
    bonus.multiplier = 3;
    bonus.wildCount = 2;
  }

  if(type === 3){
    bonus.multiplier = 5;
    bonus.wildCount = 3;
  }

  showBonusIntro(spins);

  setTimeout(() => {
    playBonus();
  }, 3000);
}

function playBonus(){

  if(!bonus.active) return;

  if(bonus.spinsLeft <= 0){
    finishBonus();
    return;
  }

  bonus.spinsLeft--;

  // 🔥 تشغيل السبين الأساسي من لعبتك
  document.getElementById("spin").click();
}

function finishBonus(){

  bonus.active = false;

  alert(
    "🎉 BONUS FINISHED\n" +
    "💰 WIN: " + bonus.totalWin
  );

}
