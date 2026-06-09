// ===== SIDEBAR & USER =====
function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("open");
}

const currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
    window.location.href = "index.html";
}

document.getElementById("username").innerText = currentUser;

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
window.userRef = db.ref("users/" + currentUser);
// ===== UPDATE DASHBOARD DATA =====
userRef.on("value", snapshot => {
    const user = snapshot.val();
    if (!user) return;
document.getElementById("top-balance").innerText =
user.balance || 0;
    document.getElementById("balance").innerText = user.balance || 0;
   document.getElementById("hero-balance").innerText =
user.balance || 0;
    document.getElementById("hero-earnings").innerText =
user.earnings || 0;
    document.getElementById("earnings").innerText = user.earnings || 0;
    document.getElementById("points").innerText = user.points || 0;
    document.getElementById("wins").innerText = user.wins || 0;
});

// ===== GAME SECTION =====
function openGame() {
    document.querySelector(".hero").style.display = "none";
    document.querySelector(".cards").style.display = "none";

    const game = document.getElementById("game-section");
    game.style.display = "block";

    setTimeout(() => {
        if (window.initGame) initGame();
    }, 200);
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}
