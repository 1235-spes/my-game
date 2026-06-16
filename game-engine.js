
const GameEngine = {
  currentUser: null,
  balance: 0,
  selectedBet: 300,

  init(userId) {
    this.currentUser = userId;

    return firebase.database()
      .ref("users/" + userId + "/balance")
      .get()
      .then(snapshot => {
        this.balance = snapshot.val() || 1000;
        this.updateUI();
        return this.balance;
      });
  },

  updateUI() {
    document.getElementById("balance").innerText = this.balance;
  },

  canPlay() {
    return this.balance >= this.selectedBet;
  },

  bet(amount) {
    this.selectedBet = amount;
    document.getElementById("bet").innerText = amount;
  },

  spendBet() {
    if (!this.canPlay()) {
      alert("❌ لا يوجد رصيد كافٍ");
      return false;
    }

    this.balance -= this.selectedBet;
    this.sync();
    this.updateUI();
    return true;
  },

  addWin(amount) {
    this.balance += amount;
    this.sync();
    this.updateUI();
  },

  sync() {
    firebase.database()
      .ref("users/" + this.currentUser)
      .set({ balance: this.balance });
  }
};
