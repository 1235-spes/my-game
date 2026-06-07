alert("script يعمل");
console.log("SCRIPT LOADED OK");

window.initGame = function(){
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "gold";
  ctx.font = "40px Arial";
  ctx.fillText("GAME WORKS", 250, 120);
};
