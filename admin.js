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

console.log("ADMIN LOADED ✔");

function createUser(){

const username = document.getElementById("newUser").value.trim();
const password = document.getElementById("newPass").value.trim();
const balance = Number(document.getElementById("newBalance").value || 0);

if(!username || !password){
alert("أدخل البيانات");
return;
}

db.ref("users/" + username).set({
password,
balance,
earnings: 0,
points: 0,
wins: 0
});

alert("تم إنشاء المستخدم ✔");
}
