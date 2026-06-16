ifselectedBet = 300;
let balance = 0;

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
  { img: "tree1.jpg", payouts: { 3: 1, 4: 2, 5: 4 } },
  { img: "خوخ.jpg", payouts: { 3: 2, 4: 4, 5: 8 } },
  { img: "كرز.jpg", payouts: { 3: 3, 4: 6, 5: 12 } },
  { img: "جرس.jpg", payouts: { 3: 5, 4: 10, 5: 20 } },
  { img: "اخضر.jpg", payouts: { 3: 8, 4: 16, 5: 32 } },
  { img: "ornj.jpg", payouts: { 3: 12, 4: 24, 5: 48 } },
  { img: "Anb.jpg", payouts: { 3: 20, 4: 40, 5: 80 } },
  { img: "777.jpg", payouts: { 3: 25, 4: 50, 5: 100 } }
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

const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

img.src = "../images/" + symbol.img;
img.dataset.symbol = symbol.img;

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
document.getElementById("spin").onclick = () => {
if(balance < selectedBet){
alert("رصيدك غير كافٍ!");
return;
}

spin();
};
function spin() {

  if (balance < selectedBet) {
    alert("❌ لا يوجد رصيد");
    return;
  }

  balance -= selectedBet;
  updateBalance();
  sync();

  // 🔥 تأثير دوران احترافي
  reels.forEach((r) => {
    r.style.opacity = "0.5";
    r.style.transform = "scale(0.95)";
  });

  let spins = 10;
  let count = 0;

  let interval = setInterval(() => {

    reels.forEach(r => fillReel(r));

    count++;

    if (count >= spins) {
      clearInterval(interval);

      reels.forEach((r, i) => {
        setTimeout(() => {
          fillReel(r);
          r.style.opacity = "1";
          r.style.transform = "scale(1)";
        }, i * 200);
      });

      setTimeout(checkWin, 1000);
    }

  }, 80);
}

function checkWin() {

    const rows = [
        reels.map(r => r.children[0].src),
        reels.map(r => r.children[1].src),
        reels.map(r => r.children[2].src)
    ];

    let totalWin = 0;

    rows.forEach(row => {

        let firstSymbol = row[0];
        let matchCount = 1;

        for (let i = 1; i < row.length; i++) {

            if (row[i] === firstSymbol) {
                matchCount++;
            } else {
                break;
            }

        }

        const symbolName = firstSymbol.split("/").pop();

const symbolData = SYMBOLS.find(s => s.img === symbolName);

if (symbolData && symbolData.payouts[matchCount]) {
    totalWin += selectedBet * symbolData.payouts[matchCount];
}
    });

    if (totalWin > 0) {

    balance += totalWin;

    alert("🎉 JACKPOT +" + totalWin);
    }

    document.getElementById("balance").innerText = balance;

    firebase.database()
        .ref("users/" + currentUser)
        .update({ balance });

}
