let selectedBet = 300;
let balance = 0;
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
    for (let i = 0; i < 25; i++) {

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
if(balance < selectedBet){
alert("رصيدك غير كافٍ!");
return;
}

spin();
};

function spin() {
  balance -= selectedBet;
  document.getElementById("balance").innerText = balance;

  firebase.database()
    .ref("users/" + currentUser)
    .update({ balance });

  spinSound.currentTime = 0;
  spinSound.play();

  reels.forEach((reel, index) => {

    const strip = reel.querySelector(".reel-strip");

strip.style.transition = "none";

// حركة دوران ثابتة (سريعة)
let position = 0;

const interval = setInterval(() => {
  position += 60; // سرعة النزول
  strip.style.transform = `translateY(-${position}px)`;
}, 16);

// التوقف
setTimeout(() => {

  clearInterval(interval);

  const STEP = 60; // لازم يطابق ارتفاع الصورة

  const finalIndex = Math.floor(Math.random() * 20); // أكثر عشوائية = احتراف
  const final = finalIndex * STEP;

  strip.style.transition = "transform 0.8s cubic-bezier(0.17, 0.67, 0.21, 1)";
  strip.style.transform = `translateY(-${final}px)`;

  stopSound.currentTime = 0;
  stopSound.play();

  if (index === reels.length - 1) {
    spinSound.pause();
    checkWin();
  }

}, 1200 + index * 400);

      
  });
}
function checkWin() {

    const visible = getVisibleSymbols();

const rows = [
    visible.map(r => r[0]),
    visible.map(r => r[1]),
    visible.map(r => r[2])
];

    let totalWin = 0;

    rows.forEach(row => {

        let firstSymbol = row[0];
        let matchCount = 1;

        if (checkRow(row)) {
            matchCount = 3;
        } else {
            for (let i = 1; i < row.length; i++) {
                if (row[i] === firstSymbol) {
                    matchCount++;
                } else break;
            }
        }

        const symbolName = firstSymbol.split("/").pop();
        const symbolData = SYMBOLS.find(s => s.img === symbolName);

        
    if (symbolData && symbolData.payouts[matchCount] !== undefined)  {  
        totalWin += selectedBet * symbolData.payouts[matchCount];  
    }  
      
    });

    const grid = reels.flatMap(r =>
        Array.from(r.querySelectorAll("img")).map(img => img.src)
    );

    if (checkRare("دولر.لر.jpg", grid)) totalWin += selectedBet * 10;
    if (checkRare("نجمي.مي.jpg", grid)) totalWin += selectedBet * 10;

    if (totalWin > 0) {
        balance += totalWin;
        alert("🎉 مبروك! ربحت " + totalWin);
        dropGold();
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
function getVisibleSymbols() {
    return reels.map(reel => {
        const imgs = reel.querySelectorAll(".reel-strip img");

        const middleIndex = Math.floor(imgs.length / 2);

        return [
            imgs[middleIndex - 1].src,
            imgs[middleIndex].src,
            imgs[middleIndex + 1].src
        ];
    });
}
function checkRow(row) {

    const left = row[0];
    const middle = row[1];
    const right = row[2];

    // 🌳 Wild
    if (middle.includes("شجرةرة.jpg")) {
        return left === right || left.includes(right.split("/").pop());
    }

    // عادي
    return left === middle && middle === right;
}
function checkRare(symbolName, grid) {

    let count = 0;

    grid.forEach(cell => {
        if (cell.includes(symbolName)) {
            count++;
        }
    });

    return count >= 3;
}
function showBigWin(amount) {

    const el = document.createElement("div");

    el.innerText = "BIG WIN 💰 " + amount;
    el.className = "big-win";

    document.body.appendChild(el);

    setTimeout(() => {
        el.remove();
    }, 2000);
}
function dropGold() {

    for (let i = 0; i < 20; i++) {

        const gold = document.createElement("div");
        gold.innerText = "💰";
        gold.className = "gold";

        gold.style.left = Math.random() * 100 + "vw";

        document.body.appendChild(gold);

        setTimeout(() => gold.remove(), 2000);
    }
}
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
