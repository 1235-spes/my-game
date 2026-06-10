// ===== SIDEBAR & USER =====
function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("open");
}

const currentUser = localStorage.getItem("currentUser");
if (!currentUser) window.location.href = "index.html";

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

// ===== LOAD WALLET DATA =====
userRef.on("value", snapshot => {
    const user = snapshot.val();
    if (!user) return;

    document.getElementById("balance").innerText = user.balance || 0;
    document.getElementById("earnings").innerText = user.earnings || 0;
    document.getElementById("points").innerText = user.points || 0;
});

// ===== ADD / REMOVE BALANCE =====
function addBalance() {
    const amount = Number(document.getElementById("addAmount").value);
    const status = document.getElementById("walletStatus");

    if (amount <= 0) {
        status.innerText = "أدخل مبلغ صحيح";
        return;
    }

    userRef.get().then(snapshot => {
        const user = snapshot.val();
        const newBalance = (user.balance || 0) + amount;

        userRef.update({ balance: newBalance }).then(() => {
            status.innerText = "تم إضافة الرصيد بنجاح";
            document.getElementById("addAmount").value = "";
        });
    });
}

function removeBalance() {
    const amount = Number(document.getElementById("removeAmount").value);
    const status = document.getElementById("walletStatus");

    if (amount <= 0) {
        status.innerText = "أدخل مبلغ صحيح";
        return;
    }

    userRef.get().then(snapshot => {
        const user = snapshot.val();
        if ((user.balance || 0) < amount) {
            status.innerText = "الرصيد غير كافي";
            return;
        }

        const newBalance = (user.balance || 0) - amount;
        userRef.update({ balance: newBalance }).then(() => {
            status.innerText = "تم خصم الرصيد بنجاح";
            document.getElementById("removeAmount").value = "";
        });
    });
}

// ===== LOGOUT =====
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}
