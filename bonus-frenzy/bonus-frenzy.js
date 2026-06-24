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

  if (!snapshot.exists()) {
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

// random symbol
function getRandomSymbol() {

  const weightedSymbols = [
    SYMBOLS[0], SYMBOLS[0], SYMBOLS[0], SYMBOLS[0], SYMBOLS[0],
    SYMBOLS[1], SYMBOLS[1], SYMBOLS[1], SYMBOLS[1], SYMBOLS[1],
    SYMBOLS[2], SYMBOLS[2], SYMBOLS[2], SYMBOLS[2],
    SYMBOLS[3], SYMBOLS[3], SYMBOLS[3], SYMBOLS[3],
    SYMBOLS[4], SYMBOLS[4],
    SYMBOLS[5],
    SYMBOLS[6],
    SYMBOLS[7], SYMBOLS[7], SYMBOLS[7],
    SYMBOLS[8], SYMBOLS[8], SYMBOLS[8],
    SYMBOLS[9], SYMBOLS[9], SYMBOLS[9],
    SYMBOLS[10]
  ];

  return weightedSymbols[Math.floor(Math.random() * weightedSymbols.length)];
}

// reels
const reels = [
  document.getElementById("reel1"),
  document.getElementById("reel2"),
  document.getElementById("reel3"),
  document.getElementById("reel4"),
  document.getElementById("reel5")
];

// init
function initializeReels() {
  reels.forEach(reel => {

    const strip = reel.querySelector(".reel-strip");
    strip.innerHTML = "";

    for (let i = 0; i < 200; i++) {
      const img = document.createElement("img");
      const symbol = getRandomSymbol();
      img.src = "../images/" + symbol.img;
      strip.appendChild(img);
    }

  });
}

initializeReels();

// bet system
document.querySelectorAll(".bet-box button").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedBet = parseInt(btn.dataset.bet);
    document.getElementById("bet").innerText = selectedBet;
  });
});

// spin button
document.getElementById("spin").onclick = () => spin();

// 💥 FIX: تحديث النتائج بدون innerHTML
function setFinalStrip(strip, colIndex) {
  const imgs = strip.querySelectorAll("img");

  for (let row = 0; row < ROWS; row++) {
    imgs[row].src = "../images/" + finalResult[colIndex][row].img;
  }
}

// spin function (FIXED ONLY ANIMATION PART)
function spin() {

  if (isSpinning) return;

  if (balance < selectedBet) {
    alert("رصيدك غير كافٍ!");
    return;
  }

  isSpinning = true;

  document.getElementById("winAmount").innerText = 0;

  balance -= selectedBet;
  document.getElementById("balance").innerText = balance;

  firebase.database()
    .ref("users/" + currentUser)
    .update({ balance });

  generateFinalResult();

  spinSound.currentTime = 0;
  spinSound.play();

  reels.forEach((reel, colIndex) => {

    const strip = reel.querySelector(".reel-strip");

    let position = 0;
    let speed = 60;

    const animate = () => {

      position += speed;

      // loop
      if (position > strip.scrollHeight / 2) {
        position = 0;
      }

      strip.style.transform = `translateY(-${position}px)`;

      // slowdown
      speed *= 0.93;

      if (speed < 2.5) {

        // 🔥 FIX: بدون innerHTML
        setFinalStrip(strip, colIndex);

        strip.style.transition = "transform 0.6s ease-out";
        strip.style.transform = "translateY(0px)";

        stopSound.play();

        if (colIndex === reels.length - 1) {

          spinSound.pause();

          setTimeout(() => {
            checkWin();
            isSpinning = false;
          }, 400);
        }

        return;
      }

      requestAnimationFrame(animate);
    };

    setTimeout(() => animate(), colIndex * 250);
  });
}

// باقي الكود بدون تغيير (كما هو عندك)
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
