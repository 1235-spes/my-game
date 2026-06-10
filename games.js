
// ===== SIDEBAR =====
function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("open");
}

// ===== USER =====
const currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
    window.location.href = "index.html";
}

document.getElementById("username").innerText = currentUser;

// ===== FIREBASE =====
firebase.initializeApp({
    apiKey: "YOUR_API_KEY",
    authDomain: "chanci-app.firebaseapp.com",
    databaseURL: "https://chanci-app-default-rtdb.firebaseio.com",
    projectId: "chanci-app",
    storageBucket: "chanci-app.firebasestorage.app",
    messagingSenderId: "18416485348",
    appId: "1:18416485348:web:918a393569acb47a7b3df1"
});

const db = firebase.database();

db.ref("users/" + currentUser).on("value", snapshot => {
    const user = snapshot.val();

    if (!user) return;

    document.getElementById("top-balance").innerText =
        user.balance || 0;
});

// ===== OPEN GAME =====
function openGoldenTree() {

    window.location.href = "dashboard.html";

}

// ===== LOGOUT =====
function logout() {

    localStorage.removeItem("currentUser");

    window.location.href = "index.html";

}
