let selectedBet = 300;
let currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
  alert("يرجى تسجيل الدخول أولاً!");
  window.location.href = "../index.html";
}

/* 🔥 تشغيل GameEngine */
GameEngine.init(currentUser).then(() => {
  initGame();
});

/* 🎰 الرموز */
const SYMBOLS = [
  "tree1.jpg",
  "خوخ.jpg",
  "كرز.jpg",
  "جرس.jpg",
  "777.jpg"
];

/* 🎰 البكرات */
const reels = [
  document.getElementById("r1"),
  document.getElementById("r2"),
  document.getElementById("r3"),
  document.getElementById("r4"),
  document.getElementById("r5")
];

/* 🚀 بدء اللعبة */
function initGame() {
  reels.forEach(fillReel);
  document.getElementById("spin").onclick = spin;
}

/* 🎲 رمز عشوائي */
function randomSymbol() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

/* 🎰 تعبئة بكرة */
function fillReel(reel) {
  reel.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    let img = document.createElement("img");
    img.src = "../images/" + randomSymbol();
    reel.appendChild(img);
  }
}

/* 🎯 spin */
function spin() {

  /* 💰 خصم الرهان من GameEngine */
  if (!GameEngine.spendBet()) return;

  /* 🎰 دوران البكرات */
  reels.forEach((r, i) => {
    setTimeout(() => fillReel(r), i * 200);
  });

  setTimeout(checkWin, 1200);
}

/* 🏆 فحص الفوز */
function checkWin() {

  const firstRow = reels.map(r => r.children[0].src);

  let counts = {};

  firstRow.forEach(src => {
    counts[src] = (counts[src] || 0) + 1;
  });

  let max = Math.max(...Object.values(counts));

  let win = 0;

  if (max === 3) win = selectedBet * 2;
  if (max === 4) win = selectedBet * 5;
  if (max === 5) win = selectedBet * 10;

  /* ⭐ بونص 777 */
  if (firstRow.includes("777.jpg")) {
    win += selectedBet * 3;
  }

  /* 💰 إضافة الربح عبر GameEngine */
  if (win > 0) {
    GameEngine.addWin(win);
    alert("🔥 WIN +" + win);
  }
}
