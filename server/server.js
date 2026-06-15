const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// مثال بسيط لحساب نتيجة اللعب
app.post("/spin", (req, res) => {
  const { bet } = req.body;

  // 🎰 هنا نحدد الفوز أو الخسارة
  const win = Math.random() < 0.3; // 30% فقط ربح

  if (win) {
    const multiplier = Math.floor(Math.random() * 5) + 1;
    const winAmount = bet * multiplier;

    return res.json({
      result: "win",
      amount: winAmount
    });
  } else {
    return res.json({
      result: "lose",
      amount: 0
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
