let balance = 0;
let selectedBet = 300;
let currentUser = localStorage.getItem("currentUser");

/* 🚨 تسجيل الدخول */
if (!currentUser) {
  alert("يرجى تسجيل الدخول أولاً!");
  window.location.href = "../index.html";
}

/* 🔥 تحميل الرصيد من Firebase */
firebase.database()
  .ref("users/" + currentUser + "/balance")
  .get()
  .then(snapshot => {
    balance = snapshot.val() || 1000;
    updateBalance();
  })
  .catch(err => {
    console.error("Firebase Error:", err);
  });

/* 💰 تحديث الرصيد في الواجهة */
function updateBalance() {
  const el = document.getElementById("balance");
  if (el) el.innerText = balance;
}

/* 💸 خصم الرهان */
function spendBet(amount) {
  if (balance < amount) {
    alert("❌ لا يوجد رصيد كافٍ");
    return false;
  }

  balance -= amount;
  updateBalance();
  sync();
  return true;
}

/* 💰 إضافة ربح */
function addWin(amount) {
  balance += amount;
  updateBalance();
  sync();
}

/* 🔄 مزامنة Firebase */
function sync() {
  firebase.database()
    .ref("users/" + currentUser)
    .update({ balance });
}

/* 🎰 SPIN (تستخدم داخل كل لعبة فقط) */
function spin(callback) {
  if (!spendBet(selectedBet)) return;

  if (typeof callback === "function") {
    callback();
  }
}

/* 🏆 مثال فحص الفوز (تعدله داخل كل لعبة) */
function checkWin(winAmount) {
  if (winAmount > 0) {
    addWin(winAmount);
    alert("🔥 WIN +" + winAmount);
  }
}
