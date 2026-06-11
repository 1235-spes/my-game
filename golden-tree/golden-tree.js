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

function spin(){
  balance -= selectedBet;
  document.getElementById("balance").innerText = balance;
  
  // لكل بكرة نملأها 3 رموز عشوائية
  reels.forEach(reel=>{
    reel.innerHTML = "";
    for(let i=0;i<3;i++){
      const img = document.createElement("img");
      img.src = "../images/" + SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)];
      reel.appendChild(img);
    }
  });

  // تحقق من الفوز (مثال: كل الرموز في الصف الأول متساوية)
  checkWin();
}

function checkWin(){
  const firstRow = reels.map(r=>r.children[0].src);
  if(new Set(firstRow).size === 1){
    balance += selectedBet*2;
    alert("مبروك! فزت!");
  }
  document.getElementById("balance").innerText = balance;
  firebase.database().ref("users/" + currentUser).update({ balance });
}
