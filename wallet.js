// ===== WALLET.JS =====

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
const statusEl = document.getElementById("status");

userRef.on("value", snapshot => {
    const user = snapshot.val();
    if (!user) return;

    balanceEl.innerText = user.balance || 0;
    earningsEl.innerText = user.earnings || 0;
    pointsEl.innerText = user.points || 0;
});

// ===== ADD BALANCE =====
function addBalance() {
    const amountInput = document.getElementById("add-amount");
    let amount = Number(amountInput.value || 0);

    if (amount <= 0) {
        statusEl.innerText = "❌ أدخل مبلغًا صالحًا للإضافة";
        return;
    }

    userRef.get().then(snapshot => {
        const user = snapshot.val();
        const newBalance = (user.balance || 0) + amount;

        userRef.update({ balance: newBalance });

        // تسجيل العملية
        db.ref("users/" + currentUser + "/transactions").push({
            type: "إضافة رصيد",
            amount: amount,
            status: "مكتمل",
            date: new Date().toLocaleString("ar")
        });

        amountInput.value = "";
        statusEl.innerText = `✅ تمت إضافة ${amount} بنجاح`;
    });
}

// ===== WITHDRAW BALANCE =====
function withdrawBalance() {
    const amountInput = document.getElementById("withdraw-amount");
    let amount = Number(amountInput.value || 0);

    if (amount <= 0) {
        statusEl.innerText = "❌ أدخل مبلغًا صالحًا للسحب";
        return;
    }

    userRef.get().then(snapshot => {
        const user = snapshot.val();
        const currentBalance = user.balance || 0;

        if (amount > currentBalance) {
            statusEl.innerText = "❌ لا يمكنك سحب أكثر من رصيدك الحالي";
            return;
        }

        const newBalance = currentBalance - amount;

        userRef.update({ balance: newBalance });

        // تسجيل العملية
        db.ref("users/" + currentUser + "/transactions").push({
            type: "سحب رصيد",
            amount: amount,
            status: "مكتمل",
            date: new Date().toLocaleString("ar")
        });

        amountInput.value = "";
        statusEl.innerText = `✅ تم سحب ${amount} بنجاح`;
    });
}

// ===== LOGOUT =====
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}
