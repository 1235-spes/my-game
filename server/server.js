
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// =====================
// بيانات اللاعبين (مؤقتة)
// =====================
const users = {};

// =====================
// إعدادات RTP
// =====================
const MAX_RTP = 0.10;

let dailyIncome = 0;
let dailyPayout = 0;

// =====================
// جلب بيانات اللاعب
// =====================
app.post("/get-user", (req, res) => {
  const { userId } = req.body;

  if (!users[userId]) {
    users[userId] = {
      balance: 1000
    };
  }

  res.json(users[userId]);
});

// =====================
// تنفيذ spin (المنطق الحقيقي)
// =====================
app.post("/spin", (req, res) => {
  const { userId, bet, symbolsMatch, payoutMultiplier } = req.body;

  if (!users[userId]) {
    users[userId] = { balance: 1000 };
  }

  let user = users[userId];

  if (user.balance < bet) {
    return res.json({ ok: false, message: "رصيد غير كافي" });
  }

  // خصم الرهان
  user.balance -= bet;
  dailyIncome += bet;

  let winAmount = 0;

  // إذا في فوز
  if (symbolsMatch) {
    winAmount = bet * payoutMultiplier;

    let maxAllowed = dailyIncome * MAX_RTP;

    // منع تجاوز 10%
    if (dailyPayout + winAmount > maxAllowed) {
      return res.json({
        ok: true,
        win: 0,
        balance: user.balance,
        message: "RTP limit reached"
      });
    }

    user.balance += winAmount;
    dailyPayout += winAmount;
  }

  res.json({
    ok: true,
    win: winAmount,
    balance: user.balance
  });
});

// =====================
// تشغيل السيرفر
// =====================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
