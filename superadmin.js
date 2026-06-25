
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const currentUser = localStorage.getItem("currentUser");

// تحميل بيانات السوبر
db.ref("superAdmins/" + currentUser).get().then(snapshot => {

  const data = snapshot.val();
  document.getElementById("balance").innerText = data.balance;
});

// إنشاء user من رصيد السوبر

function createUser() {

  const name = document.getElementById("newUser").value.trim();
  const pass = document.getElementById("newPass").value.trim();
  const balance = Number(document.getElementById("newBalance").value || 0);

  const status = document.getElementById("status");

  const ref = db.ref("superAdmins/" + currentUser);

  ref.get().then(snapshot => {

    const sa = snapshot.val();

    if (balance > sa.remainingBalance) {
      status.innerHTML = "الرصيد غير كافي عند السوبر ادمن";
      return;
    }

    // خصم من السوبر
    ref.update({
      remainingBalance: sa.remainingBalance - balance
    });

    // إنشاء اللاعب
    db.ref("users/" + name).set({
      password: pass,
      balance: balance,
      role: "user",
      parent: currentUser
    });

    status.innerHTML = "تم إنشاء اللاعب بنجاح";

  });
}
