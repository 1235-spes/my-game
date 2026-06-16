let balance = 0;
let selectedBet = 300;
let bonusMode = false;

let currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
  alert("يرجى تسجيل الدخول أولاً!");
  window.location.href = "../index.html";
}

/* 🔥 تحميل الرصيد */
firebase.database()
  .ref("users/" + currentUser + "/balance")
  .get()
  .then(snap => {
    balance = snap.val() || 1000;
    updateBalance();
    createGrid();
  });

function updateBalance() {
  document.getElementById("balance").innerText = balance;
}

function createGrid() {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  for (let i = 0; i < 20; i++) {
    let div = document.createElement("div");
    div.classList.add("cell");
    grid.appendChild(div);
  }
}

/* 🎰 SPIN */
document.getElementById("spin").onclick = () => {

  if (balance < selectedBet) {
    alert("❌ لا يوجد رصيد");
    return;
  }

  balance -= selectedBet;
  updateBalance();
  sync();

  let cells = document.querySelectorAll(".cell");

  cells.forEach(cell => {
    cell.innerHTML = `<img src="../images/tree1.jpg" width="60">`;
  });

  checkWin();
};

/* 🔥 BONUS */
document.getElementById("bonus").onclick = () => {

  if (balance < 500) {
    alert("❌ لا يوجد رصيد للبونص");
    return;
  }

  balance -= 500;
  bonusMode = true;

  updateBalance();
  sync();

  alert("🔥 BONUS ACTIVATED");
};

/* 🏆 WIN */
function checkWin() {
  let win = selectedBet * 2;

  if (bonusMode) win *= 2;

  if (win > 0) {
    balance += win;
    updateBalance();
    sync();
    alert("🔥 WIN +" + win);
  }
}

/* 🔄 SYNC */
function sync() {
  firebase.database()
    .ref("users/" + currentUser)
    .update({ balance });
}
