function createSubAdmin() {

  const name = document.getElementById("newSub").value.trim();
  const pass = document.getElementById("newSubPass").value.trim();
  const balance = Number(document.getElementById("newSubBalance").value || 0);

  const status = document.getElementById("status");

  if (!name || !pass) {
    status.innerHTML = "أدخل بيانات SubAdmin";
    return;
  }

  // مهم: الرصيد يخصم من doktor
  const doktorRef = db.ref("users/doktor");

  doktorRef.get().then(snapshot => {

    const doktor = snapshot.val();
    const currentBalance = Number(doktor.balance || 0);

    if (balance > currentBalance) {
      status.innerHTML = "رصيد الدكتور غير كافي";
      return;
    }

    const newDoktorBalance = currentBalance - balance;

    // تحديث رصيد الدكتور
    doktorRef.update({
      balance: newDoktorBalance
    });

    // إنشاء subAdmin
    db.ref("subAdmins/" + name).set({
      password: pass,
      balance: balance,
      parent: "doktor",
      role: "subAdmin"
    });

    status.innerHTML = "تم إنشاء SubAdmin بنجاح";

  });
      }
function loadSubAdmins() {

  db.ref("subAdmins").on("value", snapshot => {

    const subs = snapshot.val();
    if (!subs) return;

    let html = "";

    Object.keys(subs).forEach(name => {

      const sub = subs[name];

      html += `
        <div class="user-card">

          <div class="user-name">${name}</div>

          <div class="user-info">
            الرصيد: ${sub.balance || 0}
          </div>

          <div class="user-info">
            المدير: ${sub.parent || "غير معروف"}
          </div>

        </div>
      `;
    });

    document.getElementById("subAdminsList").innerHTML = html;
  });
}
loadSubAdmins();
