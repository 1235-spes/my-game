let maxAllowedPayout = 0;
let selectedBet = 300;
let balance = 0;

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
{ img: "tree1.jpg", weight: 30, payout: 1 },
{ img: "خوخ.jpg", weight: 25, payout: 1.5 },
{ img: "كرز.jpg", weight: 20, payout: 2 },
{ img: "جرس.jpg", weight: 15, payout: 3 },
{ img: "اخضر.jpg", weight: 7, payout: 5 },
{ img: "ornj.jpg", weight: 2, payout: 8 },
{ img: "Anb.jpg", weight: 0.8, payout: 12 },
{ img: "777.jpg", weight: 0.2, payout: 25 }
];
function weightedRandomSymbol() {
let total = SYMBOLS.reduce((a, s) => a + s.weight, 0);
let r = Math.random() * total;

for (let s of SYMBOLS) {
if (r < s.weight) return s;
r -= s.weight;
}
}
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
const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
img.src = "../images/" + sym.img;
img.dataset.symbol = sym.img;
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
dailyIncome += selectedBet;
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
const sym = weightedRandomSymbol();
img.src = "../images/" + sym.img;
img.dataset.symbol = sym.img;
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
  let maxAllowedPayout = dailyIncome * MAX_RTP;
  const firstRow = reels.map(r => r.children[0]);

  let counts = {};

  firstRow.forEach(el => {
    let src = el.dataset.symbol;
    counts[src] = (counts[src] || 0) + 1;
  });

  let symbol = firstRow[0].dataset.symbol;
  let symbolData = SYMBOLS.find(s => s.img === symbol);



  if (counts[symbol] === 3) {

    let winAmount = selectedBet * symbolData.payout;

    if (dailyPayout + winAmount > maxAllowedPayout) {
      console.log("🚫 RTP limit reached");
      return;
    }

    balance += winAmount;
    dailyPayout += winAmount;

    showWin(winAmount);
  }
      }
