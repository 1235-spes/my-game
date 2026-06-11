let selectedBet = 300;
let balance = 1000;

const COLS = 5;
const ROWS = 4;

let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 400;

let spinning = false;
let grid = [];

const SYMBOLS = [
  { name: "tree", img: "images/tree.png" },
  { name: "coin", img: "images/coin.png" },
  { name: "star", img: "images/star.png" },
  { name: "chest", img: "images/chest.png" },
  { name: "gold", img: "images/gold.png" }
];

let loadedImages = {};

function loadImages(callback) {
  let count = 0;
  SYMBOLS.forEach(sym => {
    let img = new Image();
    img.src = sym.img;
    img.onload = () => {
      loadedImages[sym.name] = img;
      count++;
      if (count === SYMBOLS.length) callback();
    }
  });
}

function initGrid() {
  grid = [];
  for (let r = 0; r < ROWS; r++) {
    let row = [];
    for (let c = 0; c < COLS; c++) {
      row.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].name);
    }
    grid.push(row);
  }
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let cellWidth = canvas.width / COLS;
  let cellHeight = canvas.height / ROWS;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let sym = grid[r][c];
      ctx.drawImage(loadedImages[sym], c*cellWidth, r*cellHeight, cellWidth, cellHeight);
    }
  }
}

function spin() {
  if (spinning) return;
  spinning = true;
  let spins = 20;
  let interval = setInterval(() => {
    initGrid();
    drawGrid();
    spins--;
    if (spins <= 0) {
      clearInterval(interval);
      spinning = false;
      checkWin();
    }
  }, 100);
}

function checkWin() {
  // مثال بسيط: زيادة الرصيد إذا كانت كل الرموز في الصف الأول متشابهة
  if (new Set(grid[0]).size === 1) {
    balance += selectedBet * 2;
    alert("مبروك! فزت!");
  } else {
    balance -= selectedBet;
  }
  document.getElementById("balance").innerText = balance;
}

document.getElementById("spinBtn").addEventListener("click", spin);

loadImages(() => {
  initGrid();
  drawGrid();
});
