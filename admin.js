function createSuperAdmin() {

  const name = document.getElementById("newSuper").value.trim();
  const pass = document.getElementById("newSuperPass").value.trim();
  const balance = Number(document.getElementById("newSuperBalance").value || 0);

  const status = document.getElementById("status");

  if (!name || !pass) {
    status.innerHTML = "أدخل بيانات Super Admin";
    return;
  }

  const doktorRef = db.ref("users/doktor");

  doktorRef.get().then(snapshot => {

    const doktor = snapshot.val();
    const currentBalance = Number(doktor.balance || 0);

    if (balance > currentBalance) {
      status.innerHTML = "رصيد الدكتور غير كافي";
      return;
    }

    // خصم من الدكتور
    doktorRef.update({
      balance: currentBalance - balance
    });

    // إنشاء SuperAdmin
    db.ref("superAdmins/" + name).set({
      password: pass,
      balance: balance,
      parent: "doktor",
      role: "superAdmin"
    });

    status.innerHTML = "تم إنشاء Super Admin بنجاح";

  });
}


function createSubAdmin(){

  const name = document.getElementById("newSub").value.trim();
  const pass = document.getElementById("newSubPass").value.trim();
  const balance = Number(document.getElementById("newSubBalance").value || 0);

  const status = document.getElementById("status");

  if(!name || !pass){
    status.innerHTML = "أدخل بيانات Sub Admin";
    return;
  }

  const doktorRef = db.ref("users/doktor");

  doktorRef.get().then(snapshot => {

    const doktor = snapshot.val();
    const currentBalance = Number(doktor.balance || 0);

    if(balance > currentBalance){
      status.innerHTML = "رصيد الدكتور غير كافي";
      return;
    }

    // خصم من الدكتور
    doktorRef.update({
      balance: currentBalance - balance
    });

    // إنشاء SubAdmin
    db.ref("subAdmins/" + name).set({
      password: pass,
      balance: balance,
      parent: "doktor",
      role: "subAdmin"
    });

    status.innerHTML = "تم إنشاء Sub Admin بنجاح";

  });

}
function loadSubAdmins(){
  db.ref("subAdmins").on("value", snapshot=>{

    const data = snapshot.val();

    let html = "";

    if(!data){
      document.getElementById("subAdminsList").innerHTML = "";
      return;
    }

    Object.keys(data).forEach(name=>{

      const sa = data[name];

      const users = sa.users ? Object.keys(sa.users).length : 0;

      let totalBalance = 0;

      if(sa.users){
        Object.values(sa.users).forEach(u=>{
          totalBalance += Number(u.balance || 0);
        });
      }

      html += `
      <div class="user-card">

        <div class="user-name">${name}</div>

        <div class="user-info">
          💰 الرصيد : ${sa.balance || 0}
        </div>

        <div class="user-info">
          👥 عدد اللاعبين : ${users}
        </div>

        <div class="user-info">
          💵 مجموع أرصدتهم : ${totalBalance}
        </div>

      </div>
      `;

    });

    document.getElementById("subAdminsList").innerHTML = html;

  });
}
loadSubAdmins();
