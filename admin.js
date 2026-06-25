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
function loadSuperAdmins() {

  db.ref("superAdmins").on("value", snapshot => {

    const data = snapshot.val();
    if (!data) return;

    let html = "";

    Object.keys(data).forEach(name => {

      const sa = data[name];

      html += `
        <div class="user-card">

          <div class="user-name">${name}</div>

          <div class="user-info">
            الرصيد: ${sa.balance}
          </div>

          <div class="user-info">
            المدير: ${sa.parent}
          </div>

        </div>
      `;
    });

    document.getElementById("superAdminsList").innerHTML = html;
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
loadSuperAdmins();
