let selectedBet = 300;
let balance = 0;
let finalResult = [];
const PAYLINES = [
  [0,0,0,0,0], // خط أفقي
  [1,1,1,1,1],
  [2,2,2,2,2],
  [0,1,2,1,0], // X shape
  [2,1,0,1,2]
];
const spinSound = new Audio("../sounds/spin.mp3");
spinSound.loop = true;
spinSound.volume = 0.4;

const stopSound = new Audio("../sounds/stop.mp3");
const winSound = new Audio("../sounds/win.mp3");
const jackpotSound = new Audio("../sounds/jackpot.mp3");
const currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
alert("يرجى تسجيل الدخول أولاً!");
window.location.href = "../index.html";
}
function playSound(sound) {
  sound.pause();
  sound.currentTime = 0;
  sound.play();
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
  { img: "جبس.بس.jpg", payouts: { 3: 1, 4: 2, 5: 4 } },
  { img: "برتقان.قان.jpg", payouts: { 3: 2, 4: 4, 5: 8 } },
  { img: "جرس.رس.jpg", payouts: { 3: 3, 4: 6, 5: 12 } },
  { img: "خوخ.خ.jpg", payouts: { 3: 4, 4: 8, 5: 16 } },
  { img: "دولر.لر.jpg", payouts: { 3: 5, 4: 10, 5: 20 } },
  { img: "سبعة.بعة.jpg", payouts: { 3: 6, 4: 12, 5: 25 } },
  { img: "شجرةرة.jpg", payouts: { 3: 2, 4: 5, 5: 10 } },
  { img: "عنبي.بي.jpg", payouts: { 3: 3, 4: 7, 5: 14 } },
  { img: "كرز.رز.jpg", payouts: { 3: 4, 4: 9, 5: 18 } },
  { img: "ليمون.مون.jpg", payouts: { 3: 5, 4: 11, 5: 22 } },
  { img: "نجمي.مي.jpg", payouts: { 3: 7, 4: 15, 5: 30 } }
];
function isWild(symbol, index) {
  return symbol === "شجرةرة.jpg" && index >= 1 && index <= 3;
}

const SYMBOL_RARITY = {
  "جبس.بس.jpg": 25,
  "برتقان.قان.jpg": 20,
  "جرس.رس.jpg": 18,
  "خوخ.خ.jpg": 15,
  "عنبي.بي.jpg": 15,
  "كرز.رز.jpg": 15,
  "ليمون.مون.jpg": 12,
  "نجمي.مي.jpg": 4,
  "دولر.لر.jpg": 3,
  "شجرةرة.jpg": 2,
  "سبعة.بعة.jpg": 1
};
const RTP = 0.85; // مثال احترافي

function adjustWin(win) {
  return win * RTP;
}
function getRandomSymbol() {
  let pool = [];

  SYMBOLS.forEach(s => {
    let weight = SYMBOL_RARITY[s.img] || 10;

    for (let i = 0; i < weight; i++) {
      pool.push(s);
    }
  });

  return pool[Math.floor(Math.random() * pool.length)];
}
function forceTreeLogic() {

  // احتمال الشجرة الحقيقي 1%
  if (Math.random() < 0.01) {
    return SYMBOLS.find(s => s.img === "شجرةرة.jpg");
  }

  return getRandomSymbol();
}
// البكرات
const reels = [
document.getElementById("reel1"),
document.getElementById("reel2"),
document.getElementById("reel3"),
document.getElementById("reel4"),
document.getElementById("reel5")
];
function getVisibleSymbols() {
  const grid = [];

  reels.forEach(reel => {
    const strip = reel.querySelector(".reel-strip");
    const imgs = strip.querySelectorAll("img");

    const row = [];

    imgs.forEach(img => {
      row.push(img.dataset.symbol || img.src.split("/").pop());
    });

    grid.push(row);
  });

  return grid;
}
function checkPaylines() {

  let win = 0;

  PAYLINES.forEach(line => {

    let symbols = [];

    for (let i = 0; i < reels.length; i++) {
      const reel = finalResult[i];
      symbols.push(reel[line[i]]);
    }

    const first = symbols[0];

    let matchCount = 0;

    for (let s of symbols) {
      if (s.img === first.img) {
        matchCount++;
      } else {
        break;
      }
    }

    const symbolData = SYMBOLS.find(s => s.img === first.img);

    if (symbolData?.payouts?.[matchCount]) {
      win += selectedBet * symbolData.payouts[matchCount];
    }

  });

  return win;
  }
function generateFinalResult() {
  finalResult = [];

  for (let r = 0; r < reels.length; r++) {
    const reelResult = [];

    for (let i = 0; i < 25; i++) {
      const symbol = forceTreeLogic();
      reelResult.push(symbol);
    }

    finalResult.push(reelResult);
  }
}
function spinReel(reel, delay, onStop) {

  let speed = 30;

  const interval = setInterval(() => {

    for (let i = 0; i < reel.children.length; i++) {
      const symbol = forceTreeLogic();
      reel.children[i].src = "../images/" + symbol.img;
    }

  }, speed);

  setTimeout(() => {
    clearInterval(interval);

    // توقف نهائي
    for (let i = 0; i < reel.children.length; i++) {
      const symbol = forceTreeLogic();
      reel.children[i].src = "../images/" + symbol.img;
    }

    onStop();

  }, delay);
}
// تعبئة البكرات لأول مرة عند فتح اللعبة

function initializeReels() {
  reels.forEach(reel => {

    const strip = reel.querySelector(".reel-strip");
    strip.innerHTML = "";

    // نملأ الشريط بصور كثيرة (هذا سر الاحتراف)
    for (let i = 0; i < 25; i++) {

      const img = document.createElement("img");
      const symbol = forceTreeLogic();

      img.src = "../images/" + symbol.img;
img.dataset.symbol = symbol.img;

      strip.appendChild(img);
    }

  });
}

// استدعاء الدالة
initializeReels();
 // اختيار الرهان من النظام الجديد (bet-box)
document.querySelectorAll(".bet-box button").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedBet = parseInt(btn.dataset.bet);
    document.getElementById("bet").innerText = selectedBet;
  });
});

// دوران البكرات
 document.getElementById("spin").onclick = () => {
if(balance < selectedBet){
alert("رصيدك غير كافٍ!");
return;
}

spin();
};

function spin() {
let winChecked = false;
  generateFinalResult(); // 👈 أهم سطر

  let finished = 0;

  balance -= selectedBet;
  document.getElementById("balance").innerText = balance;

  firebase.database()
    .ref("users/" + currentUser)
    .update({ balance });

  playSound(spinSound);

  reels.forEach((reel, index) => {

    const strip = reel.querySelector(".reel-strip");
    if (!strip) return;

    let position = 0;

    const interval = setInterval(() => {
      position += 60;
      strip.style.transform = `translateY(-${position}px)`;
    }, 16);

    setTimeout(() => {

      clearInterval(interval);

      // 🎯 هنا نضع النتيجة الحقيقية
      const reelData = finalResult[index];

      strip.innerHTML = "";

      reelData.forEach(symbol => {
        const img = document.createElement("img");
        img.src = "../images/" + symbol.img;
        img.dataset.symbol = symbol.img;
        strip.appendChild(img);
      });

      strip.style.transition = "transform 0.8s ease-out";
      strip.style.transform = "translateY(0px)";

      playSound(stopSound);

      finished++;

      if (finished === reels.length && !winChecked) {
  winChecked = true;

  // تأخير بسيط لضمان توقف بصري كامل
  setTimeout(() => {
    spinSound.pause();
    checkWin();
  }, 200);
      }

    }, 1200 + index * 400);

  });
}
function applyWild(row) {

  const base = row.find((s, i) => !isWild(s, i)) || row[0];

  return row.map((s, i) =>
    isWild(s, i) ? base : s
  );

}

function checkSpecialSymbols(grid) {

let starCount = 0;
let dollarCount = 0;

grid.flat().forEach(s => {

const symbol = SYMBOLS.find(x => x.img === s);
if (!symbol) return;

if (symbol.img.includes("نجمي")) starCount++;
if (symbol.img.includes("دولر")) dollarCount++;

});
  let bonus = 0;

  if (starCount >= 3) bonus += selectedBet * 10;
  if (dollarCount >= 3) bonus += selectedBet * 7;

  return bonus;
}
function checkPaylines() {

  let win = 0;

  PAYLINES.forEach(line => {

    let symbols = [];

    // 🎯 نأخذ الرموز حسب الخط
    for (let i = 0; i < reels.length; i++) {

      const reel = finalResult[i];
      symbols.push(reel[line[i]]);

    }

    const first = symbols[0];

    // ❗ شرط مهم: لازم يبدأ من أول رمز
    if (!first) return;

    let matchCount = 1;

    // 🔥 تطابق متصل فقط
    for (let i = 1; i < symbols.length; i++) {

      if (symbols[i].img === first.img) {
        matchCount++;
      } else {
        break; // ❌ ينقطع فوراً
      }

    }

    // 🎯 لازم 3+ فقط
    if (matchCount >= 3) {

      const symbolData = SYMBOLS.find(s => s.img === first.img);

      if (symbolData?.payouts?.[matchCount]) {
        win += selectedBet * symbolData.payouts[matchCount];
      }

    }

  });

  return win;
}
function checkWin() {

  let totalWin = 0;

  // 🎯 Paylines system
  totalWin += checkPaylines();

  // ⭐ + 💰 بونص خاص
  totalWin += checkSpecialSymbols(finalResult.map(r => r.map(s => s.img)));

  
  const RTP = 0.05;
totalWin = Math.floor(adjustWin(totalWin));
  if (totalWin > 0) {
    balance += totalWin;
    alert("🎉 مبروك! ربحت " + totalWin);
    winSound.play();
  }

  document.getElementById("balance").innerText = balance;

  firebase.database()
    .ref("users/" + currentUser)
    .update({ balance });
}
let fakeJP = {
  spade: 1200,
  club: 3400,
  diamond: 5600,
  heart: 7800
};
function startFakeJackpot() {

  setInterval(() => {

    fakeJP.spade += Math.floor(Math.random() * 40);
    fakeJP.club += Math.floor(Math.random() * 40);
    fakeJP.diamond += Math.floor(Math.random() * 40);
    fakeJP.heart += Math.floor(Math.random() * 40);

    // إعادة دورة وهمية
    if (fakeJP.spade > 9999) fakeJP.spade = 1000;
    if (fakeJP.club > 9999) fakeJP.club = 2000;
    if (fakeJP.diamond > 9999) fakeJP.diamond = 3000;
    if (fakeJP.heart > 9999) fakeJP.heart = 4000;

    document.getElementById("jp1").innerText = fakeJP.spade;
    document.getElementById("jp2").innerText = fakeJP.club;
    document.getElementById("jp3").innerText = fakeJP.diamond;
    document.getElementById("jp4").innerText = fakeJP.heart;

  }, 200);
}

window.addEventListener("load", () => {
  startFakeJackpot();
});
function showBox(id) {
  const boxes = document.querySelectorAll(".bet-box");

  boxes.forEach(b => {
    b.classList.remove("active");
    if (b.dataset.box === id.toString()) {
      b.classList.add("active");
    }
  });
}
const betToggle = document.getElementById("betToggle");
const betMenu = document.getElementById("betMenu");

if (betToggle && betMenu) {
  betToggle.addEventListener("click", () => {
    betMenu.classList.toggle("hidden");
  });

  betMenu.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      showBox(btn.dataset.tab);
      betMenu.classList.add("hidden");
    });
  });
}
