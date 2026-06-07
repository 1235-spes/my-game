const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ضبط حجم الكانفاس
canvas.width = 900;
canvas.height = 250;

// الرموز
const symbols = ["🍒","🍋","🍇","🍎","🍉","🌳","7"];
const reelCount = 5;
const reelWidth = canvas.width / reelCount;

// رسم الرموز على الكانفاس
function draw(reelData){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i=0;i<reelCount;i++){
        let x = i * reelWidth + reelWidth/2;
        let symbol = reelData[i];
        ctx.save();
        ctx.translate(x, canvas.height/2);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "70px Arial";
        ctx.fillText(symbol, 0, 0);
        ctx.restore();
    }
}

// رسم مجموعة رموز عشوائية عند البداية
function init(){
    let temp = [];
    for(let i=0;i<reelCount;i++){
        temp.push(symbols[Math.floor(Math.random()*symbols.length)]);
    }
    draw(temp);
}

init();

// زر SPIN
document.getElementById("spin").onclick = () => {
    let temp = [];
    for(let i=0;i<reelCount;i++){
        temp.push(symbols[Math.floor(Math.random()*symbols.length)]);
    }
    draw(temp);
};
