let balance = 0;
let selectedBet = 300;

let currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
  alert("يرجى تسجيل الدخول أولاً!");
  window.location.href = "../index.html";
}

/* 🔥 Firebase Load */
firebase.database()
  .ref("users/" + currentUser + "/balance")
  .get()
  .then(snap => {
    balance = snap.val() || 1000;
    updateUI();
    initGame();
  });

const SYMBOLS = [
  "tree1.jpg",
  "خوخ.jpg",
  "كرز.jpg",
  "جرس.jpg",
  "777.jpg"
];

const reels = [
  document.getElementById("r1"),
  document.getElementById("r2"),
  document.getElementById("r3"),
  document.getElementById("r4"),
  document.getElementById("r5")
];

function updateUI() {
  document.getElementById("balance").innerText = balance;
  document.getElementById("bet").innerText = selectedBet;
}

function randomSymbol() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function fillReel(reel) {
  reel.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    let img = document.createElement("img");
    img.src = "../images/" + randomSymbol();
    reel.appendChild(img);
  }
}

function initGame() {
  reels.forEach(fillReel);

  document.getElementById("spin").onclick = spin;

  document.querySelectorAll("button[data-bet]").forEach(btn => {
    btn.onclick = () => {
      selectedBet = +btn.dataset.bet;
      updateUI();
    };
  });
}

/* 🎰 SPIN */
function spin() {

  if (balance < selectedBet) {
    alert("❌ لا يوجد رصيد");
    return;
  }

  balance -= selectedBet;
  updateUI();
  sync();

  reels.forEach((r, i) => {
    setTimeout(() => fillReel(r), i * 200);
  });

  setTimeout(checkWin, 1200);
}

/* 🏆 WIN */
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

  if (firstRow.includes("777.jpg")) {
    win += selectedBet * 3;
  }

  if (win > 0) {
    balance += win;
    updateUI();
    sync();
    alert("🔥 WIN +" + win);
  }
}

/* 🔄 Firebase Sync */
function sync() {
  firebase.database()
    .ref("users/" + currentUser)
    .update({ balance });
}
