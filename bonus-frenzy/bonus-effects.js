function playBonusIntro(){

    const intro = document.getElementById("bonusIntro");

    const text = document.getElementById("bonusSpinsText");

    text.innerText = bonus.totalSpins + " FREE SPINS";

    intro.classList.remove("hidden");

    setTimeout(()=>{

        intro.classList.add("hidden");

        playBonus();

    },3000);

}
