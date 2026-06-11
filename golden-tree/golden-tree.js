let selectedBet = 300;
let balance = 0; // سيتم جلبه من Firebase

const currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
  alert("يرجى تسجيل الدخول أولاً!");
  window.location.href = "../index.html"; // أو صفحة تسجيل الدخول
}

// جلب الرصيد من Firebase
firebase.database().ref("users/" + currentUser + "/balance").get()
  .then(snapshot => {
    if(snapshot.exists()){
      balance = snapshot.val();
      document.getElementById("balance").innerText = balance;
    } else {
      // إذا لم يكن لدى المستخدم رصيد، أنشئ رصيد ابتدائي
      balance = 1000;
      firebase.database().ref("users/" + currentUser).update({ balance });
      document.getElementById("balance").innerText = balance;
    }
  })
  .catch(err => console.error(err));

const COLS = 5;
const ROWS = 4;

let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 400;

let spinning = false;
let grid = [];

// استخدام أسماء الصور الموجودة لديك
const SYMBOLS = [
  { name: "tree", img: "../images/tree1.jpg" },
  { name: "coin", img: "../images/خوخ.jpg" },
  { name: "star", img: "../images/كرز.jpg" },
  { name: "chest", img: "../images/جرس.jpg" },
  { name: "gold", img: "../images/اخضر.jpg" },
  { name: "orange", img: "../images/ornj.jpg" },
  { name: "anb", img: "../images/Anb.jpg" },
  { name: "777", img: "../images/777.jpg" }
];

let loadedImages = {};

function loadImages(callback) {
  let count = 0;
  SYMBOLS.forEach(sym => {
    let img = new Image();
    img.src = sym.img;
    img.onload = () => {
      loadedImages[sym.name] = img;
      count++;
      if (count === SYMBOLS.length) callback();
    }
  });
}

function initGrid() {
  grid = [];
  for (let r = 0; r < ROWS; r++) {
    let row = [];
    for (let c = 0; c < COLS; c++) {
      row.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].name);
    }
    grid.push(row);
  }
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let cellWidth = canvas.width / COLS;
  let cellHeight = canvas.height / ROWS;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let sym = grid[r][c];
      ctx.drawImage(loadedImages[sym], c*cellWidth, r*cellHeight, cellWidth, cellHeight);
    }
  }
}

function spin() {
  if (spinning) return;
  if (balance < selectedBet) {
    alert("رصيدك غير كافٍ!");
    return;
  }
  spinning = true;
  let spins = 20;
  let interval = setInterval(() => {
    initGrid();
    drawGrid();
    spins--;
    if (spins <= 0) {
      clearInterval(interval);
      spinning = false;
      checkWin();
    }
  }, 100);
}

function checkWin() {
  // مثال: الفوز إذا كانت كل الرموز في الصف الأول متشابهة
  if (new Set(grid[0]).size === 1) {
    balance += selectedBet * 2;
    alert("مبروك! فزت!");
  } else {
    balance -= selectedBet;
  }

  // تحديث الرصيد في الصفحة
  document.getElementById("balance").innerText = balance;

  // تحديث الرصيد في Firebase
  firebase.database().ref("users/" + currentUser).update({ balance })
    .catch(err => console.error(err));
}

document.getElementById("spinBtn").addEventListener("click", spin);

loadImages(() => {
  initGrid();
  drawGrid();
});
document.getElementById("spin").onclick = () => {
  alert("Spin Started 🎰");
};
