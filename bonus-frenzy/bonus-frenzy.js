let balance = 1000;
let selectedBet = 300;
let bonusMode = false;

const symbols = [
  "tree1.jpg",
  "خوخ.jpg",
  "كرز.jpg",
  "جرس.jpg",
  "777.jpg"
];

const grid = document.getElementById("grid");

// إنشاء الشبكة 5×4
function createGrid() {
  grid.innerHTML = "";
  for (let i = 0; i < 20; i++) {
    let div = document.createElement("div");
    div.classList.add("cell");
    grid.appendChild(div);
  }
}

// توليد رمز
function randomSymbol() {
  let pool = symbols;

  // 🔥 إذا Bonus Mode يزيد الحظ
  if (bonusMode) {
    pool = [...symbols, "777.jpg"];
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

// spin
document.getElementById("spin").onclick = () => {

  if (balance < selectedBet) {
    alert("❌ لا يوجد رصيد");
    return;
  }

  balance -= selectedBet;

  let cells = document.querySelectorAll(".cell");

  cells.forEach(cell => {
    cell.innerHTML = `<img src="../images/${randomSymbol()}" width="60">`;
  });

  document.getElementById("balance").innerText = balance;

  checkWin();
};

// bonus buy
document.getElementById("bonus").onclick = () => {

  if (balance < 500) {
    alert("❌ لا يوجد رصيد للبونص");
    return;
  }

  balance -= 500;
  bonusMode = true;

  alert("🔥 BONUS ACTIVATED!");
};

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
    balance += win;
    alert("🔥 WIN +" + win);
  }

  document.getElementById("balance").innerText = balance;
};

createGrid();
