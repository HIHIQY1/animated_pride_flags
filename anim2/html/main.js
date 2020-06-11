let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let finalSize = 1024;

let tStart = 0;
let tEnd = 8;

// cooleurs because we are cool 😎
let cooleurs = [
    "#d52d00",
    "#ff9a56",
    "#ffffff",
    "#d362a4",
    "#a30262"
];

canvas.width = finalSize;
canvas.height = finalSize;
tStart = Date.now();
requestAnimationFrame(draw);

function draw() {
    let t = ((Date.now() - tStart) / 1000) % tEnd;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, finalSize, finalSize);
    //ctx.clearRect(0, 0, finalSize, finalSize);

    ctx.lineCap = "round";

    if (t < tEnd / 4) {
        let maxDelay = tEnd / 8;

        ctx.lineWidth = finalSize / cooleurs.length;

        for (let i = 0; i < cooleurs.length; i++) {
            let thisDelay = i / (cooleurs.length - 1) * maxDelay;
            let thisTime = easeInCubic(t < thisDelay ? 0 : (t - thisDelay) / (tEnd / 4 - maxDelay)); // oh damn this line took me a while to figure out

            ctx.strokeStyle = cooleurs[i];
            ctx.beginPath();
            ctx.moveTo(thisTime * (finalSize + ctx.lineWidth / 2), ctx.lineWidth * i + ctx.lineWidth / 2);
            ctx.lineTo(finalSize * 2, ctx.lineWidth * i + ctx.lineWidth / 2);
            ctx.stroke();
        }
    } else if (t < tEnd / 2) {
        //let newT = (t - tEnd / 4) / (tEnd / 4);
        let newT = (t - tEnd / 4);

        let maxDelay = tEnd / 8;

        let finalLineWidth = finalSize / cooleurs.length;
        let finalOutlineSize = finalLineWidth / 40;

        for (let i = 0; i < cooleurs.length; i++) {
            for (let j = 0; j < cooleurs.length; j++) {
                let thisDelay = ((i + j) / (cooleurs.length - 1) / 2) * maxDelay;
                let thisT = newT < thisDelay ? 0 : (newT - thisDelay) / (tEnd / 4 - maxDelay);
                thisT = easeOutCubic(thisT > 1 ? 1 : thisT);

                let thisX = finalLineWidth * j + finalLineWidth / 2;
                let thisY = finalLineWidth * i + finalLineWidth / 2;
                let thisR = thisT * finalLineWidth / 4;

                ctx.lineWidth = finalOutlineSize;
                ctx.strokeStyle = cooleurs[i];
                ctx.fillStyle = cooleurs[i];

                ctx.beginPath();
                ctx.arc(thisX, thisY, thisR, 0, Math.PI * 2);
                ctx.globalAlpha = thisT;
                ctx.fill();
                ctx.globalAlpha = 1;

                // ctx.fillStyle = "white";
                // ctx.font = "30px Arial";
                // ctx.fillText(Math.round(thisR), thisX, thisY);
            }
        }
    } else if (t < tEnd / 4 * 3) {
        let newT = (t - tEnd / 2);

        let maxDelay = tEnd / 8;

        let finalLineWidth = finalSize / cooleurs.length;

        for (let i = 0; i < cooleurs.length; i++) {
            f3(i, -1, newT, maxDelay, finalLineWidth);
            f3(i, cooleurs.length, newT, maxDelay, finalLineWidth); // what? how does this work? I thought i was for X and j was for y????? I mean, I won't judge but whutttt howwwww
            for (let j = 0; j < cooleurs.length; j++) {
                f3(i, j, newT, maxDelay, finalLineWidth);
            }
        }
    } else if (t < tEnd) {
        let newT = (t - tEnd / 4 * 3);

        let maxDelay = tEnd / 8;

        let finalLineWidth = finalSize / cooleurs.length;

        for (let i = 0; i < cooleurs.length; i++) {
            f4(i, -1, newT, maxDelay, finalLineWidth);
            f4(i, cooleurs.length, newT, maxDelay, finalLineWidth);
            for (let j = 0; j < cooleurs.length; j++) {
                f4(i, j, newT, maxDelay, finalLineWidth);
            }
        }
    }

    ctx.fillStyle = "#00D4FF";
    ctx.fillRect(finalSize / 4, finalSize / 4, 2, 2);

    requestAnimationFrame(draw);
}

function f3(i, j, newT, maxDelay, finalLineWidth) {
    let timeI = i < 0 ? 0 : i >= cooleurs.length ? cooleurs.length - 1 : i; // If these lines weren't here the animation would snap between phase 3 & 4, which is not what we want - we want it to be as smooth as possible
    let timeJ = j < 0 ? 0 : j >= cooleurs.length ? cooleurs.length - 1 : j;
    let thisDelay = (((cooleurs.length - 1 - timeI) + (cooleurs.length - 1 - timeJ)) / (cooleurs.length - 1) / 2) * maxDelay;
    let thisT = newT < thisDelay ? 0 : (newT - thisDelay) / (tEnd / 4 - maxDelay);
    thisT = easeInCubic(thisT > 1 ? 1 : thisT);

    let thisXStart = finalLineWidth * j + finalLineWidth / 2;
    let thisYStart = finalLineWidth * i + finalLineWidth / 2;
    let thisPosChange = finalLineWidth / 3 * 2;

    ctx.lineWidth = finalLineWidth / 2;
    ctx.strokeStyle = cooleurs[i];

    ctx.save();
    ctx.beginPath();
    ctx.rect(j * finalLineWidth - finalLineWidth / 2, i * finalLineWidth, finalLineWidth + finalLineWidth, finalLineWidth);
    ctx.clip();

    ctx.beginPath();
    ctx.moveTo(thisXStart - thisPosChange * thisT, thisYStart + thisPosChange * thisT);
    ctx.lineTo(thisXStart + thisPosChange * thisT, thisYStart - thisPosChange * thisT);
    ctx.stroke();
    ctx.restore();
}
function f4(i, j, newT, maxDelay, finalLineWidth) {
    let timeI = i < 0 ? 0 : i >= cooleurs.length ? cooleurs.length - 1 : i;
    let timeJ = j < 0 ? 0 : j >= cooleurs.length ? cooleurs.length - 1 : j;
    let thisDelay = ((timeI + timeJ) / (cooleurs.length - 1) / 2) * maxDelay;
    let thisT = newT < thisDelay ? 0 : (newT - thisDelay) / (tEnd / 4 - maxDelay);
    thisT = easeOutCubic(thisT > 1 ? 1 : thisT);

    let thisXStart = finalLineWidth * j + finalLineWidth / 2;
    let thisYStart = finalLineWidth * i + finalLineWidth / 2;
    let thisPosChange = finalLineWidth / 3 * 2;

    ctx.lineWidth = finalLineWidth / 2 + finalLineWidth / (cooleurs.length - .5) * thisT;
    ctx.strokeStyle = cooleurs[i];

    ctx.save();
    ctx.beginPath();
    ctx.rect(j * finalLineWidth - finalLineWidth / 2, i * finalLineWidth, finalLineWidth + finalLineWidth, finalLineWidth);
    ctx.clip();

    ctx.beginPath();
    ctx.moveTo(thisXStart - thisPosChange, thisYStart + thisPosChange);
    ctx.lineTo(thisXStart + thisPosChange, thisYStart - thisPosChange);
    ctx.stroke();
    ctx.restore();
}

// https://gist.github.com/gre/1650294
function easeInCubic(t) { return t * t * t; }
function easeOutCubic(t) { return (--t) * t * t + 1; };