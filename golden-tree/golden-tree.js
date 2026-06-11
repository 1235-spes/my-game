let selectedBet = 300;

const COLS = 5;
const ROWS = 4;

let canvas, ctx;
let spinning = false;
let images = {};
let grid = [];
let balanceBox;

// ===== الرموز =====
const SYMBOLS = [
  { name: "tree", img: "images/IMG_٢٠٢٦٠٦١٠_٢٢٥٨٢٢.jpg", rarity: 0.05, reward: 50 },
  { name: "grape", img: "images/IMG_٢٠٢٦٠٦١٠_٢٢٥٩٤٣.jpg", rarity: 0.15, reward: 5 },
  { name: "orange", img: "images/IMG_٢٠٢٦٠٦١٠_٢٣٠٠١١.jpg", rarity: 0.15, reward: 5 },
  { name: "peach", img: "images/IMG_٢٠٢٦٠٦١٠_٢٣٠١٢٩.jpg", rarity: 0.15, reward: 5 },
  { name: "seven", img: "images/IMG_٢٠٢٦٠٦١٠_٢٣٠٢٢٠.jpg", rarity: 0.07, reward: 100 },
  { name: "cherry", img: "images/IMG_٢٠٢٦٠٦١٠_٢٣٠٥٠١.jpg", rarity: 0.15, reward: 5 },
  { name: "bell", img: "images/IMG_٢٠٢٦٠٦١٠_٢٣٠٥٣٨.jpg", rarity: 0.10, reward: 20 },
  { name: "gum", img: "images/IMG_٢٠٢٦٠٦١٠_٢٣٠٦٣٠.jpg", rarity: 0.13, reward: 3 },
  { name: "dollar", img: "images/IMG_٢٠٢٦٠٦١٠_٢٣٠٧٥٦.jpg", rarity: 0.05, reward: 10 }
];

// ===== تحميل الصور =====
function loadImages(callback) {
  let loaded = 0;
  SYMBOLS.forEach(s => {
    const img = new Image();
    img.src = s.img;
    img.onload = () => {
      loaded++;
      if (loaded === SYMBOLS.length) callback();
    };
    images[s.name] = img;
  });
}

// ===== اختيار عشوائي حسب الندرة =====
function getRandomSymbol(col, row) {
  let pool = SYMBOLS.filter(s => {
    if (s.name === "tree" && (row === 0 || row === ROWS - 1)) return false;
    return true;
  });

  let total = pool.reduce((a, b) => a + b.rarity, 0);
  let rand = Math.random() * total;
  let sum = 0;

  for (let s of pool) {
    sum += s.rarity;
    if (rand <= sum) return s;
  }

  return pool[0];
}

// ===== إنشاء الشبكة =====
function generateGrid() {
  grid = [];
  for (let c = 0; c < COLS; c++) {
    let col = [];
    for (let r = 0; r < ROWS; r++) {
      col.push(getRandomSymbol(c, r));
    }
    grid.push(col);
  }
}

// ===== الرسم =====
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const size = 90;
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      let symbol = grid[c][r];
      let x = c * size + 50;
      let y = r * size + 30;
      ctx.drawImage(images[symbol.name], x, y, 70, 70);
    }
  }
}

// ===== حساب الفوز =====
function calculateWin() {
  let totalWin = 0;
  let counts = {};
  for (let col of grid) {
    for (let s of col) counts[s.name] = (counts[s.name] || 0) + 1;
  }

  for (let key in counts) {
    if (counts[key] >= 3) {
      let symbol = SYMBOLS.find(s => s.name === key);
      let win = symbol.reward * selectedBet;

      if (key === "dollar") win *= 10;
      if (key === "seven") win *= 50;

      totalWin += win;
    }
  }
  return totalWin;
}

// ===== تحديث الرصيد في واجهة المستخدم =====
function updateBalanceUI(balance) {
  if (balanceBox) balanceBox.innerText = "الرصيد: " + balance;
}

// ===== SPIN =====
async function spin() {
  if (spinning) return;
  spinning = true;

  const userRef = window.userRef;
  if (!userRef) return;

  let snap = await userRef.once("value");
  let user = snap.val();

  if (!user || user.balance < selectedBet) {
    alert("رصيدك غير كافي!");
    spinning = false;
    return;
  }

  let balance = user.balance - selectedBet;
  updateBalanceUI(balance);

  generateGrid();
  draw();

  setTimeout(async () => {
    let win = calculateWin();
    balance += win;

    await userRef.update({
      balance: balance,
      earnings: (user.earnings || 0) + win,
      wins: (user.wins || 0) + (win > 0 ? 1 : 0)
    });

    spinning = false;
  }, 1200);
}

// ===== Firebase Initialization =====
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const userId = "user_1"; // مؤقت، لاحقًا تسجيل دخول المستخدم
window.userRef = database.ref("users/" + userId);

// إنشاء المستخدم إذا لم يكن موجودًا
userRef.once("value").then(snap => {
  if (!snap.exists()) {
    userRef.set({
      balance: 1000,
      earnings: 0,
      wins: 0
    });
  }
});

// تحديث الرصيد مباشرة عند التغير في Firebase
userRef.on("value", snap => {
  const user = snap.val();
  if (user) updateBalanceUI(user.balance);
});

// ===== تشغيل =====
window.addEventListener("load", () => {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  balanceBox = document.getElementById("balance"); // عنصر عرض الرصيد

  loadImages(() => {
    generateGrid();
    draw();
  });

  document.getElementById("spin").addEventListener("click", spin);
});
