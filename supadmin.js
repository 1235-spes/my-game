supAdminsmins firebaseConfig = {
  apiKey: "AIzaSyBsx_iEGWKEDlEQe6B2rz4yqKAhGdz1uas",
  authDomain: "chanci-app.firebaseapp.com",
  databaseURL: "https://chanci-app-default-rtdb.firebaseio.com",
  projectId: "chanci-app",
  storageBucket: "chanci-app.firebasestorage.app",
  messagingSenderId: "18416485348",
  appId: "1:18416485348:web:918a393569acb47a7b3df1"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const currentUser = localStorage.getItem("currentUser");

// 🔴 حماية الدخول
if(!currentUser){
  window.location.href = "index.html";
}

// 🟣 تحميل بيانات السوبر
function loadBalance(){
  db.ref("subAdmins/" + currentUser).on("value", snap=>{
    const data = snap.val();
    if(data){
      document.getElementById("balance").innerText = data.balance || 0;
    }
  });
}

// 🟢 إنشاء لاعب من رصيد السوبر
function createUser(){

  const name = document.getElementById("userName").value.trim();
  const pass = document.getElementById("userPass").value.trim();
  const balance = Number(document.getElementById("userBalance").value || 0);

  const ref = db.ref("supAdmins/" + currentUser);

  ref.get().then(snap=>{
    const sa = snap.val();

    if(balance > sa.balance){
      alert("الرصيد غير كافي");
      return;
    }

    // خصم من السوبر
    ref.update({
      balance: sa.balance - balance
    });

    // إنشاء لاعب
    db.ref("users/" + name).set({
      password: pass,
      balance: balance,
      role: "user"
    });

    loadUsers();
  });
}

// 🟡 عرض اللاعبين
function loadUsers(){

  db.ref("users").on("value", snap=>{
    const data = snap.val();
    let html = "";

    if(!data) return;

    Object.keys(data).forEach(name=>{
      const u = data[name];

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

// 🔴 تسجيل خروج
function logout(){
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

loadBalance();
loadUsers();
