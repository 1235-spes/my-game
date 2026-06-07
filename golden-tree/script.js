let currentBet = 300;

function selectBet(amount){
  currentBet = amount;
  document.getElementById("result").innerText =
    "تم اختيار الرهان: " + currentBet;
}
window.initGame = function () {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  // تأكد من حجم الكانفاس
  canvas.width = 900;
  canvas.height = 250;

  // خلفية بسيطة
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // نص اختبار
  ctx.fillStyle = "gold";
  ctx.font = "40px Arial";
  ctx.textAlign = "center";
  ctx.fillText("🎰 GAME LOADED SUCCESSFULLY", canvas.width / 2, canvas.height / 2);
};
