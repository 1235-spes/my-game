
let selectedBet = 300;
let balance = 0;
let finalResult = [];
let spinSpeed = 4000;
let isSpinning = false;
const ROWS = 4;
const COLS = 5;
const spinSound = new Audio("../sounds/spin.mp3");
spinSound.loop = true;
spinSound.volume = 0.4;

const stopSound = new Audio("../sounds/stop.mp3");
const wildSound = new Audio("../sounds/Eooz.mp3");
wildSound.volume = 0.6;
const winSound = new Audio("../sounds/win.mp3");
const jackpotSound = new Audio("../sounds/jackpot.mp3");
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
  
function getRandomSymbol() {

 const weightedSymbols = [
    

    SYMBOLS[0], SYMBOLS[0], SYMBOLS[0], SYMBOLS[0], SYMBOLS[0], // جبس
    SYMBOLS[1], SYMBOLS[1], SYMBOLS[1], SYMBOLS[1], SYMBOLS[1], // برتقال
    SYMBOLS[2], SYMBOLS[2], SYMBOLS[2], SYMBOLS[2],             // جرس
    SYMBOLS[3], SYMBOLS[3], SYMBOLS[3], SYMBOLS[3],             // خوخ
    SYMBOLS[4], SYMBOLS[4],                                     // دولار
    SYMBOLS[5],                                                 // سبعة
    SYMBOLS[6],                                                 // شجرة Wild
    SYMBOLS[7], SYMBOLS[7], SYMBOLS[7],                         // عنب
    SYMBOLS[8], SYMBOLS[8], SYMBOLS[8],                         // كرز
    SYMBOLS[9], SYMBOLS[9], SYMBOLS[9],                         // ليمون
    SYMBOLS[10]                                                 // نجمة
  ];

  return weightedSymbols[
    Math.floor(Math.random() * weightedSymbols.length)
  ];
    }
// البكرات
const reels = [
document.getElementById("reel1"),
document.getElementById("reel2"),
document.getElementById("reel3"),
document.getElementById("reel4"),
document.getElementById("reel5")
];
function spinReel(reel, delay, onStop) {


let speed = 30;

const interval = setInterval(() => {

for (let i = 0; i < reel.children.length; i++) {  
  const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];  
  reel.children[i].src = "../images/" + symbol.img;  
}

}, speed);

setTimeout(() => {
clearInterval(interval);

// توقف نهائي  
for (let i = 0; i < reel.children.length; i++) {  
  const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];  
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
    for (let i = 0; i < 200; i++) {

      const img = document.createElement("img");
      const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

      img.src = "../images/" + symbol.img;

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

  if (isSpinning) return; // ⛔ يمنع إعادة الضغط

  if (balance < selectedBet) {
    alert("رصيدك غير كافٍ!");
    return;
  }

  spin();
};

function spin() {
isSpinning = true; // 🔒 قفل الزر

// 🌳 تنظيف تأثير الشجرة (Wild)
document.querySelectorAll(".reel-strip img").forEach(img => {
img.classList.remove("wild-big");
});

// إزالة تأثير العمود كامل
document.querySelectorAll(".reel-strip").forEach(strip => {
strip.classList.remove("wild-column");
});
document.querySelectorAll(".reel-strip img").forEach(img => {
img.classList.remove("win-glow");
});

document.getElementById("winAmount").innerText = 0;
if (balance < selectedBet) {
alert("رصيدك غير كافٍ!");
return;
}

balance -= selectedBet;
document.getElementById("balance").innerText = balance;

firebase.database()
.ref("users/" + currentUser)
.update({ balance });

generateFinalResult(); // 👈 أهم سطر

spinSound.currentTime = 0;
spinSound.play();

reels.forEach((reel, colIndex) => {

const strip = reel.querySelector(".reel-strip");  

strip.style.transition = "none";  

let position = 20;  

const interval = setInterval(() => {  
  position += 60;  
  strip.style.transform = `translateY(-${position}px)`;  
}, 16);  

setTimeout(() => {  

  clearInterval(interval);  

  strip.style.transition = "transform 0.8s cubic-bezier(0.17,0.67,0.21,1)";  

  // 🔥 هنا نستخدم نفس finalResult

strip.innerHTML = "";

for (let row = 0; row < ROWS; row++) {

const img = document.createElement("img");

img.src =
"../images/" +
finalResult[colIndex][row].img;

strip.appendChild(img);
}
strip.style.transform = "translateY(0px)";
stopSound.currentTime = 0;
stopSound.play();

if (colIndex === reels.length - 1) {  
    spinSound.pause();  

    setTimeout(() => {  
      checkWin();  
      isSpinning = false; // 🔓 فتح الزر بعد انتهاء اللعب  
    }, 300);  
  }  

}, 1200 + colIndex * 400);

});
}


function generateFinalResult() {
  finalResult = [];

  for (let col = 0; col < COLS; col++) {
    const column = [];

    for (let row = 0; row < ROWS; row++) {
      let symbol = getRandomSymbol();

      // ❌ شرط الشجرة: لا تظهر في أول وآخر عمود
      if (
        symbol.img === "شجرةرة.jpg" &&
        (col === 0 || col === COLS - 1)
      ) {
        // نعيد الاختيار مرة ثانية بدون Wild
        do {
          symbol = getRandomSymbol();
        } while (symbol.img === "شجرةرة.jpg");
      }

      column.push(symbol);
    }

    finalResult.push(column);
  }
}

function highlightWins(winningImg) {

  const images = document.querySelectorAll(".reel-strip img");

  images.forEach(img => {

    img.classList.remove("win-glow");

    const src = img.getAttribute("src");

    if (src && src.includes(winningImg)) {
      img.classList.add("win-glow");
    }

  });
}

function highlightWild() {

  let wildFound = false;

  reels.forEach(reel => {

    const strip = reel.querySelector(".reel-strip");
    const imgs = strip.querySelectorAll("img");

    let hasWild = false;

    imgs.forEach(img => {
      const name = img.getAttribute("src").split("/").pop();

      if (name === "شجرةرة.jpg") {
        hasWild = true;
        wildFound = true;
      }
    });

    if (hasWild) {

      imgs.forEach(img => {
        img.src = "../images/شجرةرة.jpg";
        img.classList.add("wild-big");
      });

      strip.classList.add("wild-column");
    }
  });

  // ✅ تشغيل الصوت مرة واحدة فقط
  if (wildFound) {
    wildSound.currentTime = 0;
    wildSound.play().catch(() => {});
  }
}
function checkWin() {

  let totalWin = 0;

  for (let row = 0; row < ROWS; row++) {

    let symbols = [];

    for (let col = 0; col < COLS; col++) {
      symbols.push(finalResult[col][row]);
    }

    let base = symbols[0];
    let match = 1;

    for (let i = 1; i < symbols.length; i++) {

      if (symbols[i].img === "شجرةرة.jpg") {
        match++;
        continue;
      }

      if (symbols[i].img === base.img) {
        match++;
      } else {
        break;
      }
    }

    if (match >= 3) {
      const symbolData = SYMBOLS.find(s => s.img === base.img);

      if (symbolData?.payouts?.[match]) {
        totalWin += selectedBet * symbolData.payouts[match];
      }
    }
  }

  if (totalWin > 0) {

  balance += totalWin;

  document.getElementById("winAmount").innerText = totalWin;

  // 🔥 هنا نحدد رمز الفوز من النتيجة الصحيحة
  let winningImg = null;

  for (let row = 0; row < ROWS; row++) {

    let symbols = [];

    for (let col = 0; col < COLS; col++) {
      symbols.push(finalResult[col][row]);
    }

    let base = symbols[0];
    let match = 1;

    for (let i = 1; i < symbols.length; i++) {
      if (symbols[i].img === "شجرةرة.jpg") {
        match++;
        continue;
      }

      if (symbols[i].img === base.img) {
        match++;
      } else {
        break;
      }
    }

    if (match >= 3) {
      winningImg = base.img;
      break;
    }
  }

  if (winningImg) {
    highlightWins(winningImg);
    highlightWild();
      if (winningImg === "شجرةرة.jpg") {
    wildSound.currentTime = 0;
    wildSound.play(); 
   }
    }
  winSound.play();
  }
  document.getElementById("balance").innerText = balance;

  firebase.database()
    .ref("users/" + currentUser)
    .update({ balance });
}
let fakeJP;

function initFakeJP() {

  const saved = localStorage.getItem("fakeJP");

  if (saved) {
    try {
      fakeJP = JSON.parse(saved);
    } catch (e) {
      fakeJP = null;
    }
  }

  // 🎯 إذا لا يوجد بيانات → رقم شبه واقعي عشوائي
  if (!fakeJP) {
    fakeJP = {
      spade: 1000 + Math.floor(Math.random() * 2000),
      club: 3000 + Math.floor(Math.random() * 3000),
      diamond: 5000 + Math.floor(Math.random() * 3000),
      heart: 7000 + Math.floor(Math.random() * 3000)
    };
  }
}

function startFakeJackpot() {

  const jp1 = document.getElementById("jp1");
  const jp2 = document.getElementById("jp2");
  const jp3 = document.getElementById("jp3");
  const jp4 = document.getElementById("jp4");

  setInterval(() => {

    // 🎰 زيادة واقعية (بطيئة + غير ثابتة)
    fakeJP.spade += Math.random() * 25;
    fakeJP.club += Math.random() * 30;
    fakeJP.diamond += Math.random() * 35;
    fakeJP.heart += Math.random() * 40;

    // 🔄 إعادة تدوير طبيعية (بدون أرقام ثابتة)
    if (fakeJP.spade > 9999) fakeJP.spade = 1000 + Math.random() * 500;
    if (fakeJP.club > 9999) fakeJP.club = 2000 + Math.random() * 800;
    if (fakeJP.diamond > 9999) fakeJP.diamond = 3000 + Math.random() * 900;
    if (fakeJP.heart > 9999) fakeJP.heart = 4000 + Math.random() * 1000;

    // 📊 عرض
    jp1.innerText = Math.floor(fakeJP.spade);
    jp2.innerText = Math.floor(fakeJP.club);
    jp3.innerText = Math.floor(fakeJP.diamond);
    jp4.innerText = Math.floor(fakeJP.heart);

    // 💾 حفظ الحالة
    localStorage.setItem("fakeJP", JSON.stringify(fakeJP));

  }, 150);
}

window.addEventListener("load", () => {
  initFakeJP();
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

    // 1) إخفاء الأرقام
    betMenu.classList.add("hidden");

    // 2) إظهار صندوق الرهان الخاص بهذا الرقم فقط
    showBox(btn.dataset.tab);

  });
});
}
const autoBtn = document.getElementById("autoSpinBtn");
const autoMenu = document.getElementById("autoMenu");

let autoInterval = null;

autoBtn.addEventListener("click", () => {
  autoMenu.classList.toggle("hidden");
});

// تشغيل Auto Spin
autoMenu.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("click", () => {
    const times = parseInt(btn.dataset.spin);

    autoMenu.classList.add("hidden");

    startAutoSpin(times);
  });
});

function startAutoSpin(times) {
  let count = 0;

  function runNext() {

    if (count >= times) return;

    document.getElementById("spin").click();
    count++;

    // ⛔ ننتظر وقت أطول من spin الحقيقي
    // (1200 + colIndex*400 + checkWin delay ≈ 2500ms آمن)
setTimeout(runNext, spinSpeed);
  }

  runNext();
}
const speedMenu = document.getElementById("speedMenu");
const speedBtn = document.getElementById("speedBtn");

if (speedBtn && speedMenu) {

  speedBtn.addEventListener("click", () => {
    speedMenu.classList.toggle("hidden");
  });

  speedMenu.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      spinSpeed = parseInt(btn.dataset.speed);
      speedMenu.classList.add("hidden");
    });
  });

}
