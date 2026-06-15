const express = require("express");
const admin = require("firebase-admin");
const app = express();

app.use(express.json());

// Firebase Admin (سيرفر)
admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccountKey.json")),
  databaseURL: "https://YOUR_PROJECT.firebaseio.com"
});

const db = admin.database();

// رموز اللعبة
const SYMBOLS = [
  { img: "tree1.jpg", weight: 30, payout: 1 },
  { img: "خوخ.jpg", weight: 25, payout: 1.5 },
  { img: "كرز.jpg", weight: 20, payout: 2 },
  { img: "جرس.jpg", weight: 15, payout: 3 },
  { img: "اخضر.jpg", weight: 7, payout: 5 },
  { img: "ornj.jpg", weight: 2, payout: 8 },
  { img: "Anb.jpg", weight: 0.8, payout: 12 },
  { img: "777.jpg", weight: 0.2, payout: 25 }
];

// اختيار عشوائي weighted
function weightedRandom() {
  let total = SYMBOLS.reduce((a, s) => a + s.weight, 0);
  let r = Math.random() * total;

  for (let s of SYMBOLS) {
    if (r < s.weight) return s;
    r -= s.weight;
  }
}

// حساب RTP يومي (بسيط)
const userStats = {}; // مؤقت (يفضل DB لاحقاً)

app.post("/spin", async (req, res) => {
  const { userId, bet } = req.body;

  const userRef = db.ref("users/" + userId + "/balance");
  const snap = await userRef.get();

  let balance = snap.val() || 1000;

  if (balance < bet) {
    return res.json({ error: "NO_BALANCE" });
  }

  // خصم الرهان
  balance -= bet;

  // توليد نتائج 5 reels × 3 rows
  let grid = [];
  for (let r = 0; r < 5; r++) {
    let reel = [];
    for (let i = 0; i < 3; i++) {
      reel.push(weightedRandom());
    }
    grid.push(reel);
  }

  // حساب الربح (row الأولى فقط مثل كودك)
  let firstRow = grid.map(r => r[0]);
  let counts = {};

  firstRow.forEach(s => {
    counts[s.img] = (counts[s.img] || 0) + 1;
  });

  let winAmount = 0;

  let symbol = firstRow[0];
  if (counts[symbol.img] === 3) {
    winAmount = bet * symbol.payout;
  }

  // 🔒 نظام 10% RTP (سيرفر)
  let stats = userStats[userId] || { income: 0, payout: 0 };
  stats.income += bet;

  let maxPayout = stats.income * 0.10;

  if (stats.payout + winAmount > maxPayout) {
    winAmount = 0;
  }

  stats.payout += winAmount;
  userStats[userId] = stats;

  balance += winAmount;

  await userRef.set(balance);

  res.json({
    balance,
    grid,
    win: winAmount
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
