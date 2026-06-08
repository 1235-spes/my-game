
function toggleSidebar(){  
document.querySelector(".sidebar").classList.toggle("closed");  
}  
const currentUser =  
localStorage.getItem("currentUser");  if(!currentUser){
window.location.href = "index.html";
}

document.getElementById("username").innerText =
currentUser;

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

db.ref("users/" + currentUser)
.on("value", snapshot=>{

const user = snapshot.val();

if(!user) return;

document.getElementById("balance").innerText =
user.balance || 0;

document.getElementById("earnings").innerText =
user.earnings || 0;

document.getElementById("points").innerText =
user.points || 0;

document.getElementById("wins").innerText =
user.wins || 0;

});
function openGame(){
document.querySelector(".hero").style.display = "none";
document.querySelector(".cards").style.display = "none";

const game = document.getElementById("game-section");
game.style.display = "block";

// أهم خطوة: نبدأ اللعبة بعد ظهور الـ game-section
setTimeout(() => {
if(window.initGame) initGame();
}, 200); // 200ms لتجنب أي مشاكل عرض
}
function logout(){

localStorage.removeItem("currentUser");

window.location.href = "index.html";
}
