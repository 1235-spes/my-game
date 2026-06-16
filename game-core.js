
const GameCore = {
  user: null,
  balance: 0,

  init(userId) {
    this.user = userId;

    return firebase.database()
      .ref("users/" + userId)
      .get()
      .then(snap => {
        const data = snap.val() || { balance: 1000 };

        this.balance = data.balance;

        this.syncUI();

        return this.balance;
      });
  },

  syncUI() {
    const el = document.getElementById("balance");
    if (el) el.innerText = this.balance;
  },

  canBet(amount) {
    return this.balance >= amount;
  },

  bet(amount) {
    if (!this.canBet(amount)) {
      alert("❌ رصيد غير كافي");
      return false;
    }

    this.balance -= amount;
    this.save();
    this.syncUI();
    return true;
  },

  win(amount) {
    this.balance += amount;
    this.save();
    this.syncUI();
  },

  save() {
    firebase.database()
      .ref("users/" + this.user)
      .update({ balance: this.balance });
  }
};
