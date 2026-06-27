function showBonusIntro(spins){

  const overlay = document.getElementById("bonusIntro");
  const text = document.getElementById("bonusSpinsText");

  overlay.classList.remove("hidden");

  text.innerText = spins + " FREE SPINS";

  setTimeout(() => {
    overlay.classList.add("hidden");
  }, 3000);
}
