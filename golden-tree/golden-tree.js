let selectedBet = 300;
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
document.getElementById("spin").onclick = () => {
if(balance < selectedBet){
alert("رصيدك غير كافٍ!");
return;
}
alert("Spin Started 🎰");
spin();
};

function spin() {
balance -= selectedBet;
document.getElementById("balance").innerText = balance;

reels.forEach((reel, index) => {
reel.classList.add("spinning");

setTimeout(() => {  
  reel.innerHTML = "";  
  for (let i = 0; i < 3; i++) {  
    const img = document.createElement("img");  
    img.src = "../images/" + SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];  
    reel.appendChild(img);  
  }  

  reel.classList.remove("spinning");  

  // بعد توقف آخر بكرة، تحقق من الفوز  
  if (index === reels.length - 1) {  
    checkWin();  
  }  
}, 500 + (index * 300)); // كل بكرة تتأخر قليلاً عن الأخرى  


});
}
function checkWin() {

    const rows = [
        reels.map(r => r.children[0].src), // الصف العلوي
        reels.map(r => r.children[1].src), // الصف الأوسط
        reels.map(r => r.children[2].src)  // الصف السفلي
    ];

    let totalWin = 0;

    rows.forEach(row => {

        const counts = {};

        row.forEach(symbol => {
            counts[symbol] = (counts[symbol] || 0) + 1;
        });

        Object.values(counts).forEach(count => {

            if (count === 3) {
                totalWin += selectedBet * 2;
            }

            if (count === 4) {
                totalWin += selectedBet * 5;
            }

            if (count === 5) {
                totalWin += selectedBet * 10;
            }

        });

    });

    if (totalWin > 0) {
        balance += totalWin;
        alert("🎉 مبروك! ربحت " + totalWin);
    }

    document.getElementById("balance").innerText = balance;

    firebase.database()
        .ref("users/" + currentUser)
        .update({ balance });

}
