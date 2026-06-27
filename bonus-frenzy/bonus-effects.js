function applyBonusWild(symbols, col){

  // ❌ ممنوع في أول وآخر بكرة
  if(col === 0 || col === COLS - 1) return;

  let wildsAdded = 0;

  for(let i = 0; i < symbols.length; i++){

    if(wildsAdded >= bonus.wildCount) break;

    if(Math.random() < 0.25){ // 25% chance

      symbols[i] = {
        img: "شجرةرة.jpg",
        payouts: {}
      };

      wildsAdded++;
    }
  }

  return symbols;
}
