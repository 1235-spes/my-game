let selectedBet = 300;
let balance = null; // مهم جدًا
let currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
  alert("يرجى تسجيل الدخول أولاً!");
  window.location.href = "../index.html";
}
// Firebase balance
firebase.database()
  .ref("users/" + currentUser + "/balance")
  .get()
  .then(snapshot => {

    balance = snapshot.val() || 1000;

    document.getElementById("balance").innerText = balance;

    // ✅ تشغيل اللعبة بعد تحميل الرصيد
    initGame();
  });

const SYMBOLS = [
  "tree1.jpg",
  "خوخ.jpg",
  "كرز.jpg",
  "جرس.jpg",
  "777.jpg" // ⭐ رمز نادر
];

const reels = [
  document.getElementById("r1"),
  document.getElementById("r2"),
  document.getElementById("r3"),
  document.getElementById("r4"),
  document.getElementById("r5")
];

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

// اختيار الرهان
document.querySelectorAll("button[data-bet]").forEach(btn => {
  btn.onclick = () => {
    selectedBet = +btn.dataset.bet;
    document.getElementById("bet").innerText = selectedBet;
  };
});

document.getElementById("spin").onclick = spin;

function spin() {

  if (balance < selectedBet) {
    alert("❌ لا يوجد رصيد كافٍ");
    return;
  }

  balance -= selectedBet;

  document.getElementById("balance").innerText = balance;

  firebase.database()
    .ref("users/" + currentUser)
    .update({ balance });

  reels.forEach((r, i) => {
    setTimeout(() => fillReel(r), i * 200);
  });

  setTimeout(checkWin, 1200);
}

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

  // ⭐ مكافأة الرمز النادر
  if (firstRow.includes("777.jpg")) {
    win += selectedBet * 3;
  }

  if (win > 0) {
    balance += win;
    alert("🔥 WIN +" + win);
  }

  document.getElementById("balance").innerText = balance;

  firebase.database()
    .ref("users/" + currentUser)
    .update({ balance });
}

reels.forEach(fillReel);
