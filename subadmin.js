const firebaseConfig = {
  apiKey: "AIzaSyBsx_iEGWKEDlEQe6B2rz4yqKAhGdz1uas",
  authDomain: "chanci-app.firebaseapp.com",
  databaseURL: "https://chanci-app-default-rtdb.firebaseio.com",
  projectId: "chanci-app"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const currentUser = localStorage.getItem("currentUser");

if(!currentUser){
  window.location.href = "index.html";
}

/* =======================
   💰 عرض رصيد الساب
======================= */
function loadBalance(){
  db.ref("subAdmins/" + currentUser).on("value", snap=>{
    const data = snap.val();
    document.getElementById("balance").innerText = data?.balance || 0;
  });
}

/* =======================
   ➕ إنشاء مستخدم
======================= */
function createUser(){

  const name = document.getElementById("newUser").value.trim();
  const pass = document.getElementById("newPass").value.trim();
  const balance = Number(document.getElementById("newBalance").value || 0);

  const status = document.getElementById("status");

  if(!name || !pass){
    status.innerHTML = "أدخل البيانات";
    return;
  }

  const ref = db.ref("subAdmins/" + currentUser);

  ref.get().then(snap=>{
    const sa = snap.val();
    const currentBalance = Number(sa?.balance || 0);

    if(balance > currentBalance){
      status.innerHTML = "الرصيد غير كافي";
      return;
    }

    // خصم من subAdmin
    ref.update({
      balance: currentBalance - balance
    });

    // إنشاء مستخدم
    db.ref("subAdmins/" + currentUser + "/users/" + name).set({
      password: pass,
      balance: balance,
      owner: currentUser
    });

    status.innerHTML = "تم إنشاء المستخدم بنجاح";

    loadUsers();
  });
}

/* =======================
   👥 عرض المستخدمين
======================= */
function loadUsers(){
  db.ref("subAdmins/" + currentUser + "/users").on("value", snap=>{
    const data = snap.val();
    let html = "";

    if(!data){
      document.getElementById("usersList").innerHTML = "";
      return;
    }

    Object.keys(data).forEach(name=>{
      const u = data[name];

      html += `
      <div class="user-card">
        <div class="user-title">👤 ${name}</div>
        <div>💰 الرصيد: ${u.balance}</div>

        <input class="small-input" id="add-${name}" placeholder="إضافة أو خصم">

        <div class="actions">
          <button class="btn add" onclick="addBalance('${name}')">إضافة</button>
          <button class="btn remove" onclick="removeBalance('${name}')">خصم</button>
        </div>
      </div>
      `;
    });

    document.getElementById("usersList").innerHTML = html;
  });
}

/* =======================
   ➕ إضافة رصيد
======================= */
function addBalance(name){

  const amount = Number(document.getElementById("add-" + name).value || 0);
  if(amount <= 0) return;

  const ref = db.ref("subAdmins/" + currentUser + "/users/" + name);

  ref.get().then(snap=>{
    const user = snap.val();

    ref.update({
      balance: (user.balance || 0) + amount
    });
  });
}

/* =======================
   ➖ خصم رصيد
======================= */
function removeBalance(name){

  const amount = Number(document.getElementById("add-" + name).value || 0);
  if(amount <= 0) return;

  const ref = db.ref("subAdmins/" + currentUser + "/users/" + name);

  ref.get().then(snap=>{
    const user = snap.val();

    ref.update({
      balance: Math.max(0, (user.balance || 0) - amount)
    });
  });
}

/* =======================
   🚪 تسجيل خروج
======================= */
function logout(){
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

loadBalance();
loadUsers();
