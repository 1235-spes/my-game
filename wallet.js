// ===== SIDEBAR =====
function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("open");
}

// ===== USER SESSION =====
const currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
    window.location.href = "index.html";
}

// عند تحميل الصفحة
window.addEventListener("load", () => {

    const usernameEl = document.getElementById("username");
    if (usernameEl) {
        usernameEl.innerText = currentUser;
    }

});

// ===== LOGOUT =====
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}
