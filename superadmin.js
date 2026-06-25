
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
function loadMyPlayers() {

  db.ref("users").on("value", snapshot => {

    const users = snapshot.val();
    if (!users) return;

    let html = "";

    Object.keys(users).forEach(name => {

      const u = users[name];

      // 👇 أهم شرط: فقط لاعبين هذا السوبر
      if (u.parent !== currentUser) return;

      html += `
        <div class="user-card">

          <div class="user-name">${name}</div>

          <div class="user-info">الرصيد: ${u.balance}</div>

          <input type="number" id="amt-${name}" class="input" placeholder="المبلغ">

          <div class="actions">

            <button class="btn add-btn" onclick="add('${name}')">
              إضافة
            </button>

            <button class="btn remove-btn" onclick="remove('${name}')">
              خصم
            </button>

          </div>

        </div>
      `;
    });

    document.getElementById("usersList").innerHTML = html;
  });
}
function add(name) {

  const amount = Number(document.getElementById("amt-" + name).value || 0);

  const ref = db.ref("users/" + name);

  ref.get().then(s => {

    const u = s.val();
    ref.update({
      balance: Number(u.balance || 0) + amount
    });

  });
}

function remove(name) {

  const amount = Number(document.getElementById("amt-" + name).value || 0);

  const ref = db.ref("users/" + name);

  ref.get().then(s => {

    const u = s.val();
    ref.update({
      balance: Math.max(0, Number(u.balance || 0) - amount)
    });

  });
}
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}
loadMyPlayers();
