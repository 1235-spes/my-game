// ===== SIDEBAR & USER =====
function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("open");
}

const currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
    window.location.href = "index.html";
}
document.getElementById("username").innerText = currentUser;

const headerUser = document.getElementById("header-username");
if(headerUser){
    headerUser.innerText = currentUser;
}

const profileName = document.getElementById("profileName");
if(profileName){
    profileName.innerText = currentUser;
}

// ===== FIREBASE =====
if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: "AIzaSyBsx_iEGWKEDlEQe6B2rz4yqKAhGdz1uas",
        authDomain: "chanci-app.firebaseapp.com",
        databaseURL: "https://chanci-app-default-rtdb.firebaseio.com",
        projectId: "chanci-app",
        storageBucket: "chanci-app.firebasestorage.app",
        messagingSenderId: "18416485348",
        appId: "1:18416485348:web:918a393569acb47a7b3df1"
    });
}

const db = firebase.database();
const userRef = db.ref("users/" + currentUser);
window.userRef = userRef;

// ===== UPDATE DASHBOARD DATA =====
const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
};

userRef.on("value", snapshot => {
    const user = snapshot.val();
    if (!user) return;

    setText("top-balance", user.balance || 0);
    setText("balance", user.balance || 0);
    setText("hero-balance", user.balance || 0);
    setText("hero-earnings", user.earnings || 0);
    setText("earnings", user.earnings || 0);
    setText("points", user.points || 0);
    setText("wins", user.wins || 0);
});

// ===== GAME SECTION =====
function openGame() {

    document.querySelector(".hero")?.style.setProperty("display", "none");
    document.querySelector(".quick-menu")?.style.setProperty("display", "none");
    document.querySelector(".games-section")?.style.setProperty("display", "none");
    document.querySelector(".cards")?.style.setProperty("display", "none");

    const game = document.getElementById("game-section");

    if (game) {
        game.style.display = "block";
    }

    setTimeout(() => {
        if (window.initGame) {
            window.initGame();
        }
    }, 200);
}

// ===== LOGOUT & PROFILE =====
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

function toggleProfile() {
    document.getElementById("profilePanel").classList.toggle("open");
}
