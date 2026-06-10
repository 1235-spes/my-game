// ===== WALLET.JS READ-ONLY =====

// ===== USER =====
const currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
    window.location.href = "index.html";
}

// ===== FIREBASE =====
firebase.initializeApp({
    apiKey: "AIzaSyBsx_iEGWKEDlEQe6B2rz4yqKAhGdz1uas",
    authDomain: "chanci-app.firebaseapp.com",
    databaseURL: "https://chanci-app-default-rtdb.firebaseio.com",
    projectId: "chanci-app",
    storageBucket: "chanci-app.firebasestorage.app",
    messagingSenderId: "18416485348",
    appId: "1:18416485348:web:918a393569acb47a7b3df1"
});

const db = firebase.database();
const userRef = db.ref("users/" + currentUser);

// ===== DISPLAY USER INFO =====
const balanceEl = document.getElementById("balance");
const earningsEl = document.getElementById("earnings");
const pointsEl = document.getElementById("points");

userRef.on("value", snapshot => {
    const user = snapshot.val();
    if (!user) return;

    balanceEl.innerText = user.balance || 0;
    earningsEl.innerText = user.earnings || 0;
    pointsEl.innerText = user.points || 0;
});

// ===== LOGOUT =====
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}
