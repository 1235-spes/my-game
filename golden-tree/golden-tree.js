let dailyIncome = 0;
let dailyPayout = 0;
const MAX_RTP = 0.10;
const currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
  alert("يرجى تسجيل الدخول أولاً!");
  window.location.href = "../index.html";
}

// جلب الرصيد من Firebase
firebase.database().ref("users/" + currentUser + "/balance").get()
  .then(snapshot => {
    balance = snapshot.exists() ? snapshot.val() : 1000;
    if(!snapshot.exists()){
      firebase.database().ref("users/" + currentUser).update({ balance });
    }
    document.getElementById("balance").innerText = balance;
  })
  .catch(err => console.error(err));

// الرموز
const SYMBOLS = [
  "tree1.jpg",
  "خوخ.jpg",
  "كرز.jpg",
  "جرس.jpg",
  "اخضر.jpg",
  "ornj.jpg",
  "Anb.jpg",
  "777.jpg"
];

// البكرات
const reels = [
  document.getElementById("reel1"),
  document.getElementById("reel2"),
  document.getElementById("reel3"),
  document.getElementById("reel4"),
  document.getElementById("reel5")
];
// تعبئة البكرات لأول مرة عند فتح اللعبة
function initializeReels() {
  reels.forEach(reel => {
    reel.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      const img = document.createElement("img");
      img.src = "../images/" + SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      reel.appendChild(img);
    }
  });
}

// استدعاء الدالة
initializeReels();
// اختيار الرهان
document.querySelectorAll(".bet-buttons button").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    selectedBet = parseInt(btn.dataset.bet);
    document.getElementById("bet").innerText = selectedBet;
  });
});

// دوران البكرات
let spinning = false;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function spin() {
  if (spinning) return;
  spinning = true;

  if (balance < selectedBet) {
    alert("رصيدك غير كافٍ!");
    spinning = false;
    return;
  }

  balance -= selectedBet;
  document.getElementById("balance").innerText = balance;

  // تشغيل دوران لكل reel تدريجياً
  for (let i = 0; i < reels.length; i++) {
    reels[i].classList.add("spinning");
  }

  // تغيير الرموز بسرعة (إحساس دوران)
  let interval = setInterval(() => {
    reels.forEach(reel => {
      reel.innerHTML = "";
      for (let i = 0; i < 3; i++) {
        let img = document.createElement("img");
        img.src = randomSymbol();
        reel.appendChild(img);
      }
    });
  }, 100);

  // توقف تدريجي لكل reel
  for (let i = 0; i < reels.length; i++) {
    await sleep(700 + i * 300);
    reels[i].classList.remove("spinning");
  }

  clearInterval(interval);

  checkWin();
  document.getElementById("balance").innerText = balance;

  spinning = false;
}

function checkWin() {
  const firstRow = reels.map(r => r.children[0].src);

  let counts = {};
  firstRow.forEach(src => {
    counts[src] = (counts[src] || 0) + 1;
  });

  let max = Math.max(...Object.values(counts));

  const maxAllowedPayout = dailyIncome * MAX_RTP;

  if (max === 3) {
    let winAmount = selectedBet * 5;

    if (dailyPayout + winAmount > maxAllowedPayout) {
      console.log("🚫 تم منع الربح بسبب حد 10%");
      return;
    }

    balance += winAmount;
    dailyPayout += winAmount;

    showWin(winAmount);
  }
}
