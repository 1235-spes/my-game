let selectedBet = 300;
let bonusMode = false;

const currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
  alert("يرجى تسجيل الدخول أولاً!");
  window.location.href = "../index.html";
}

/* 🎰 الرموز */
const symbols = [
  "tree1.jpg",
  "خوخ.jpg",
  "كرز.jpg",
  "جرس.jpg",
  "777.jpg"
];

const grid = document.getElementById("grid");

/* 🔥 تشغيل GameEngine */
GameEngine.init(currentUser).then(() => {
  createGrid();
  updateBalanceUI();
});

/* 💰 تحديث الرصيد */
function updateBalanceUI() {
  document.getElementById("balance").innerText = GameEngine.balance;
}

/* 🎯 إنشاء الشبكة */
function createGrid() {
  grid.innerHTML = "";
  for (let i = 0; i < 20; i++) {
    let div = document.createElement("div");
    div.classList.add("cell");
    grid.appendChild(div);
  }
}

/* 🎲 رمز عشوائي */
function randomSymbol() {
  let pool = bonusMode ? [...symbols, "777.jpg"] : symbols;
  return pool[Math.floor(Math.random() * pool.length)];
}

/* 🎰 SPIN */
document.getElementById("spin").onclick = () => {

  // ❌ منع اللعب بدون رصيد
  if (!GameEngine.spendBet()) return;

  let cells = document.querySelectorAll(".cell");

  cells.forEach(cell => {
    cell.innerHTML = `<img src="../images/${randomSymbol()}" width="60">`;
  });

  checkWin();
  updateBalanceUI();
};

/* 🔥 BUY BONUS */
document.getElementById("bonus").onclick = () => {

  // ❌ شرط الرصيد
  if (GameEngine.balance < 500) {
    alert("❌ لا يوجد رصيد للبونص");
    return;
  }

  GameEngine.balance -= 500;
  GameEngine.sync();

  bonusMode = true;

  updateBalanceUI();

  alert("🔥 BONUS ACTIVATED!");
};

/* 🏆 CHECK WIN */
function checkWin() {

  let cells = document.querySelectorAll(".cell");

  let counts = {};

  cells.forEach(cell => {
    let img = cell.querySelector("img");
    if (!img) return;

    let src = img.src;
    counts[src] = (counts[src] || 0) + 1;
  });

  let max = Math.max(...Object.values(counts));

  let win = 0;

  if (max >= 8) win = selectedBet * 2;
  if (max >= 12) win = selectedBet * 5;
  if (max >= 16) win = selectedBet * 10;

  if (bonusMode) win *= 2;

  if (win > 0) {
    GameEngine.addWin(win);
    alert("🔥 WIN +" + win);
  }
}
