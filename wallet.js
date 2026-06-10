// ===== SIDEBAR =====
window.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.querySelector(".menu-btn");
    const sidebar = document.querySelector(".sidebar");

    if(menuBtn && sidebar){
        menuBtn.addEventListener("click", () => {
            sidebar.classList.toggle("open");
        });
    }
});

// ===== USER SESSION =====
const currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
    window.location.href = "index.html";
}

// عرض اسم المستخدم
const usernameEl = document.getElementById("username");
if(usernameEl) usernameEl.innerText = currentUser;

// ===== LOGOUT =====
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

// ===== FIREBASE INITIALIZATION =====
const firebaseConfig = {
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
const userRef = db.ref("users/" + currentUser);

// ===== LOAD WALLET DATA =====
userRef.on("value", snapshot => {
    const user = snapshot.val();
    if(!user) return;

    document.getElementById("balance").innerText = user.balance || 0;
    document.getElementById("earnings").innerText = user.earnings || 0;
    document.getElementById("points").innerText = user.points || 0;
});
