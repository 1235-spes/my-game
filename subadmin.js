const firebaseConfig = {
  apiKey: "AIzaSyBsx_iEGWKEDlEQe6B2rz4yqKAhGdz1uas",
  authDomain: "chanci-app.firebaseapp.com",
  databaseURL: "https://chanci-app-default-rtdb.firebaseio.com",
  projectId: "chanci-app"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const currentUser = localStorage.getItem("currentUser");

// 🔐 حماية
if(!currentUser){
  window.location.href = "index.html";
}

// =====================
// إنشاء مستخدم (نفس admin لكن من subAdmin)
// =====================
function createUser(){

  const name = document.getElementById("newUser").value.trim();
  const pass = document.getElementById("newPass").value.trim();
  const balance = Number(document.getElementById("newBalance").value || 0);

  const status = document.getElementById("status");

  if(!name || !pass){
    status.innerHTML = "أدخل البيانات";
    return;
  }

  // 🔥 subAdmin نفسه
  const ref = db.ref("subAdmins/" + currentUser);

  ref.get().then(snap=>{
    const sa = snap.val() || {};
    const currentBalance = Number(sa.balance || 0);

    if(balance > currentBalance){
      status.innerHTML = "الرصيد غير كافي";
      return;
    }

    // خصم من subAdmin
    ref.update({
      balance: currentBalance - balance
    });

    // إنشاء user
    db.ref("users/" + name).set({
      password: pass,
      balance: balance,
      owner: currentUser
    });

    status.innerHTML = "تم إنشاء المستخدم";

    loadUsers();
  });
}

// =====================
// عرض المستخدمين (فقط تابعين له)
// =====================
function loadUsers(){

  db.ref("users").on("value",snap=>{
    const data = snap.val();
    let html = "";

    if(!data) return;

    Object.keys(data).forEach(name=>{
      const u = data[name];

      if(u.owner !== currentUser) return;

      html += `
        <div class="user-card">
          <div>👤 ${name}</div>
          <div>💰 ${u.balance}</div>
        </div>
      `;
    });

    document.getElementById("usersList").innerHTML = html;
  });
}

// =====================
function logout(){
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

loadUsers();
