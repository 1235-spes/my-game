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

/* 🔥 تحميل GameEngine */
GameEngine.init(currentUser).then(() => {
  createGrid();
  updateBalanceUI();
});

/* 💰 تحديث الرصيد */
function updateBalanceUI() {
  document.getElementById("balance").innerText = GameEngine.balance;
}

/* إنشاء الشبكة */
function createGrid() {
  grid.innerHTML = "";
  for (let i = 0; i < 20; i++) {
    let div = document.createElement("div");
    div.classList.add("cell");
    grid.appendChild(div);
  }
}

/* 🎲 رمز */
function randomSymbol() {
  let pool = bonusMode ? [...symbols, "777.jpg"] : symbols;
  return pool[Math.floor(Math.random() * pool.length)];
}

/* 🎰 spin */
document.getElementById("spin").onclick = () => {

  if (!GameEngine.spendBet()) return;

  let cells = document.querySelectorAll(".cell");

  cells.forEach(cell => {
    cell.innerHTML = `<img src="../images/${randomSymbol()}" width="60">`;
  });

  updateBalanceUI();
  checkWin();
};

/* 🔥 شراء بونص */
document.getElementById("bonus").onclick = () => {

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

/* 🏆 الفوز */
function checkWin() {

  let cells = document.querySelectorAll(".cell");

  let counts = {};

  cells.forEach(cell => {
    let src = cell.querySelector("img").src;
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

  updateBalanceUI();
}
