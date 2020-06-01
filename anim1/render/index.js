const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");

let canvas = createCanvas(50, 50);
let ctx = canvas.getContext("2d");

let fps = 60;
let currentFrame = 0;
let startingTime = Date.now();
let frameRenderStart = Date.now();

// Further setup code here
let finalSize = 1024;
let tEnd = 8;

// cooleurs because we are cool 😎
let cooleurs = [
    "#e50000",
    "#ff8d00",
    "#ffee00",
    "#008121",
    "#004cff",
    "#760188"
];

canvas.width = finalSize;
canvas.height = finalSize;

let outputFolder = path.join("./", "frames_" + canvas.width + "x" + fps);
if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder);

startingTime = Date.now();
draw();

function draw() {
    let t = currentFrame / fps;
    
    // Rendering code here
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, finalSize, finalSize);
    //ctx.clearRect(0, 0, finalSize, finalSize);

    ctx.lineCap = "round";

    if (t < tEnd / 4) {
        let interpolatedT = easeOutCubic(t / (tEnd / 4));

        let maxArcSize = finalSize / 3;

        ctx.lineWidth = maxArcSize / (cooleurs.length - .5) * interpolatedT;
        for (let i = 0; i < cooleurs.length; i++) {
            ctx.strokeStyle = cooleurs[i];
            ctx.beginPath();
            ctx.arc(finalSize / 2, finalSize / 2,
                maxArcSize - (interpolatedT ? i * ctx.lineWidth : 0),
                degToRad(-90), degToRad(interpolatedT * -360 - 90), true);
            ctx.stroke();
        }
    } else if (t < tEnd / 2) {
        let interpolatedT = easeInCubic((t - tEnd / 4) / (tEnd / 4));

        let minArcSize = finalSize / 3;
        let maxArcSize = finalSize - finalSize / cooleurs.length / 2;

        let y1 = finalSize / 2;
        let y2 = finalSize;

        let currentY = y1 + (y2 - y1) * interpolatedT;
        let currentArcSize = minArcSize + (maxArcSize - minArcSize) * interpolatedT;

        let arcStart = degToRad(-180 * (1 - interpolatedT) - 90);
        let arcEnd = degToRad(180 * (1 - interpolatedT) - 90);

        ctx.lineWidth = currentArcSize / (cooleurs.length - .5);
        for (let i = 0; i < cooleurs.length; i++) {
            ctx.strokeStyle = cooleurs[i];
            ctx.beginPath();

            ctx.arc(finalSize / 2, currentY,
                currentArcSize - (i * ctx.lineWidth), arcStart, arcEnd);
            ctx.stroke();
        }
    } else if (t < tEnd / 4 * 3) {
        let interpolatedT = easeOutCubic((t - tEnd / 2) / (tEnd / 4));

        let lineStart = finalSize / 2 * (1 - interpolatedT);
        let lineEnd = finalSize / 2 + finalSize / 2 * interpolatedT;

        ctx.lineWidth = finalSize / cooleurs.length;
        for (let i = 0; i < cooleurs.length; i++) {
            ctx.strokeStyle = cooleurs[i];
            ctx.beginPath();
            ctx.moveTo(lineStart, i * ctx.lineWidth + ctx.lineWidth / 2);
            ctx.lineTo(lineEnd, i * ctx.lineWidth + ctx.lineWidth / 2);
            ctx.stroke();
        }
    } else if (t < tEnd) {
        let interpolatedT = easeInCubic((t - tEnd / 4 * 3) / (tEnd / 4));

        let lineWidthStart = finalSize / cooleurs.length;
        let lineWidthEnd = 0;

        let ballSize = lineWidthStart + (lineWidthEnd - lineWidthStart) * (interpolatedT);
        ctx.lineWidth = lineWidthStart;

        for (let i = 0; i < cooleurs.length; i++) {
            ctx.strokeStyle = cooleurs[i];
            ctx.fillStyle = cooleurs[i];
            let circleAmount = Math.ceil(finalSize / lineWidthStart);
            for (let j = 0; j < circleAmount + 1; j++) {
                let centeredXStart = finalSize / 2 - circleAmount / 2 * lineWidthStart;
                ctx.beginPath();
                ctx.arc(j * lineWidthStart + centeredXStart, i * lineWidthStart + lineWidthStart / 2, ballSize / 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = (1 - interpolatedT);
            ctx.beginPath();
            ctx.moveTo(0, i * lineWidthStart + lineWidthStart / 2);
            ctx.lineTo(finalSize, i * lineWidthStart + lineWidthStart / 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
    }

    ctx.fillStyle = "#00D4FF";
    ctx.fillRect(finalSize / 4, finalSize / 4, 2, 2);

    if (currentFrame < tEnd * fps) {
        fs.writeFileSync(path.join(outputFolder, currentFrame + ".png"), canvas.toBuffer());
        console.info("Render + write of frame " + currentFrame + " took " + (Date.now() - frameRenderStart) + "ms.");
        currentFrame++;
        frameRenderStart = Date.now();
        draw();
    } else {
        console.info("Done. Took " + (Date.now() - startingTime) + "ms (" + Math.round((Date.now() - startingTime) / 100) / 10 + "s).");
    }
}

// Other functions here
function degToRad(deg) {
    return Math.PI / 180 * deg;
}

// https://gist.github.com/gre/1650294
function easeInCubic(t) { return t * t * t; }
function easeOutCubic(t) { return (--t) * t * t + 1; };