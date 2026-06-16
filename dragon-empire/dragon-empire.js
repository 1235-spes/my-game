let selectedBet = 300;
let balance = 0;

const currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
    alert("يرجى تسجيل الدخول أولاً!");
    window.location.href = "../index.html";
}
firebase.database()
    .ref("users/" + currentUser + "/balance")
    .get()
    .then(snapshot => {

        balance = snapshot.exists() ? snapshot.val() : 1000;

        if (!snapshot.exists()) {
            firebase.database()
                .ref("users/" + currentUser)
                .update({ balance });
        }

        document.getElementById("balance").innerText = balance;

    })
    .catch(err => console.error(err));
/* 🐉 الصور مع ../ لأن الملف JS داخل مجلد */
let symbols = [
  "../images/Messenger_creation_F6703251-9446-437D-A421-BEBF0552D499.png",
  "../images/Messenger_creation_DDC8E6FA-90CC-4535-A2AB-C1EA3DD83F7A.png",
  "../images/Messenger_creation_9383B2DC-3E76-46F0-90F1-37C6382437E3.png",
  "../images/Messenger_creation_6A447BA5-6E15-498B-8F5E-1F8DD2EBEFDD.png",
  "../images/Messenger_creation_6A0A96CD-7269-40C5-893D-3725CC6942FF.png",
  "../images/Messenger_creation_28A4EE31-42D5-47A6-82D9-6317605FCE02.png",
  "../images/Messenger_creation_0A0631E3-FAB6-4341-BA29-A020A4C4793C.png"
];

let reels = [
  document.getElementById("r1"),
  document.getElementById("r2"),
  document.getElementById("r3"),
  document.getElementById("r4"),
  document.getElementById("r5")
];

function randomSymbol() {
  return symbols[Math.floor(Math.random() * symbols.length)];
}

function fillReel(reel) {
  reel.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    let img = document.createElement("img");
    img.src = randomSymbol();
    reel.appendChild(img);
  }
}

function spin() {
  balance -= selectedBet;

document.getElementById("balance").innerText = balance;

// حفظ الرصيد في Firebase (هذا المهم)
firebase.database()
  .ref("users/" + currentUser)
  .update({ balance });

  reels.forEach((reel, i) => {
    setTimeout(() => fillReel(reel), i * 200);
  });

  setTimeout(checkWin, 1200);

  document.getElementById("balance").innerText = balance;
}

function checkWin() {
  const firstRow = reels.map(r => r.children[0].src);

  let counts = {};
  firstRow.forEach(src => {
    counts[src] = (counts[src] || 0) + 1;
  });

  let max = Math.max(...Object.values(counts));

  if (max === 3) {
    balance += selectedBet * 5;
    alert("🔥 WIN x5!");
  }

  document.getElementById("balance").innerText = balance;
}

reels.forEach(fillReel);
document.getElementById("spin").onclick = spin;
