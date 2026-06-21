let selectedBet = 300;
let balance = 0;
let rareCount = 0;
let finalResult = [];

const spinSound = new Audio("../sounds/spin.mp3");
spinSound.loop = true;
spinSound.volume = 0.4;

const stopSound = new Audio("../sounds/stop.mp3");
const winSound = new Audio("../sounds/win.mp3");
const SYMBOLS = [
  { img: "جبس.بس.jpg", payouts: { 3: 1, 4: 2, 5: 4 } },
  { img: "برتقان.قان.jpg", payouts: { 3: 2, 4: 4, 5: 8 } },
  { img: "جرس.رس.jpg", payouts: { 3: 3, 4: 6, 5: 12 } },
  { img: "خوخ.خ.jpg", payouts: { 3: 4, 4: 8, 5: 16 } },
  { img: "دولر.لر.jpg", payouts: { 3: 5, 4: 10, 5: 20 } },
  { img: "سبعة.بعة.jpg", payouts: { 3: 6, 4: 12, 5: 25 } },
  { img: "شجرةرة.jpg", payouts: { 3: 2, 4: 5, 5: 10 } },
  { img: "عنبي.بي.jpg", payouts: { 3: 3, 4: 7, 5: 14 } },
  { img: "كرز.رز.jpg", payouts: { 3: 4, 4: 9, 5: 18 } },
  { img: "ليمون.مون.jpg", payouts: { 3: 5, 4: 11, 5: 22 } },
  { img: "نجمي.مي.jpg", payouts: { 3: 7, 4: 15, 5: 30 } }
];
function getRandomSymbol() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}
function forceSymbol(colIndex) {

  let symbol = getRandomSymbol();

  // ⭐ Rare limit (نجمة + دولار)
  if (symbol.img.includes("نجمي") || symbol.img.includes("دولر")) {
    if (rareCount >= 3) return getRandomSymbol();
    rareCount++;
    return symbol;
  }

  // 🌳 WILD (شجرة)
  if (symbol.img === "شجرةرة.jpg") {

    if (colIndex < 2) return getRandomSymbol(); // ممنوع أول عمودين

    if (Math.random() > 0.02) return getRandomSymbol(); // نادر جداً

    return symbol;
  }

  return symbol;
}
function generateFinalResult() {
  finalResult = [];

  for (let col = 0; col < 5; col++) {
    const column = [];

    for (let row = 0; row < 4; row++) {
      column.push(forceSymbol(col));
    }

    finalResult.push(column);
  }
    }
function spin() {

  rareCount = 0;

  if (balance < selectedBet) {
    alert("رصيدك غير كافٍ!");
    return;
  }

  generateFinalResult(); // ⭐ مهم جداً

  balance -= selectedBet;
  document.getElementById("balance").innerText = balance;

  firebase.database()
    .ref("users/" + currentUser)
    .update({ balance });

  spinSound.currentTime = 0;
  spinSound.play();

  // 🎰 تشغيل الحركة
  reels.forEach((reel, colIndex) => {

    const strip = reel.querySelector(".reel-strip");

    strip.style.transition = "none";

    let position = 0;

    // حركة سريعة
    const interval = setInterval(() => {
      position += 60;
      strip.style.transform = `translateY(-${position}px)`;
    }, 16);

    // التوقف لكل بكرة
    setTimeout(() => {

      clearInterval(interval);

      const STEP = 60;

      const finalIndex = Math.floor(Math.random() * 20);
      const final = finalIndex * STEP;

      strip.style.transition = "transform 0.8s cubic-bezier(0.17, 0.67, 0.21, 1)";
      strip.style.transform = `translateY(-${final}px)`;

      stopSound.play();

      if (colIndex === reels.length - 1) {

        setTimeout(() => {
          spinSound.pause();
          checkWin();
        }, 300);
      }

    }, 1200 + colIndex * 400);
  });
}
function initializeReels() {

  reels.forEach((reel, colIndex) => {

    const strip = reel.querySelector(".reel-strip");
    strip.innerHTML = "";

    for (let i = 0; i < 25; i++) {

      const img = document.createElement("img");
      img.src = "../images/" + getRandomSymbol().img;

      strip.appendChild(img);
    }
  });
}

initializeReels();
function checkWin() {

  let totalWin = 0;

  for (let row = 0; row < 4; row++) {

    let symbols = [];

    for (let col = 0; col < 5; col++) {
      symbols.push(finalResult[col][row]);
    }

    let base = symbols[0];
    let match = 1;

    for (let i = 1; i < symbols.length; i++) {

      if (symbols[i].img === "شجرةرة.jpg") {
        match++;
        continue;
      }

      if (symbols[i].img === base.img) {
        match++;
      } else break;
    }

    if (match >= 3) {

      let data = SYMBOLS.find(s => s.img === base.img);

      if (data?.payouts?.[match]) {
        totalWin += selectedBet * data.payouts[match];
      }
    }
  }

  if (totalWin > 0) {
    balance += totalWin;
    alert("🎉 ربحت " + totalWin);
    winSound.play();
  }

  document.getElementById("balance").innerText = balance;

  firebase.database()
    .ref("users/" + currentUser)
    .update({ balance });
}
