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

let tStart = 0;
let tEnd = 8;

// cooleurs because we are cool 😎
let cooleurs = [
    "#5bcffa",
    "#f5abb9",
    "#ffffff",
    "#f5abb9",
    "#5bcffa"
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
        let theT = easeInCubic(t / (tEnd / 4));

        ctx.fillStyle = cooleurs[0];
        ctx.fillRect(0, 0, finalSize, finalSize);

        ctx.lineWidth = finalSize / cooleurs.length;

        let flagW = finalSize / 2 + finalSize / 2 * theT;
        let flagH = finalSize / 2 + finalSize / 2 * theT;
        let flagX = finalSize / 2 - flagW / 2;
        let flagY = finalSize / 2 - flagH / 2;

        ctx.save();
        ctx.translate(finalSize / 2, finalSize / 2);
        ctx.rotate(degToRad(theT * -90));
        ctx.translate(-finalSize / 2, -finalSize / 2);

        trabsFlag(flagX, flagY, flagW, flagH);

        ctx.restore();
    } else if (t < tEnd / 2) {
        let theT = easeOutCubic((t - tEnd / 4) / (tEnd / 4));

        ctx.fillStyle = cooleurs[1];
        ctx.fillRect(0, 0, finalSize, finalSize);

        ctx.lineWidth = finalSize / cooleurs.length;

        let flagW = finalSize - finalSize / 2 * theT;
        let flagH = finalSize - finalSize / 2 * theT;
        let flagX = finalSize / 2 - flagW / 2;
        let flagY = finalSize / 2 - flagH / 2;

        ctx.save();
        ctx.translate(finalSize / 2, finalSize / 2);
        ctx.rotate(degToRad(theT * -90 - 90));
        ctx.translate(-finalSize / 2, -finalSize / 2);

        trabsFlag(flagX, flagY, flagW, flagH);

        ctx.restore();
    } else if (t < tEnd / 4 * 3) {
        let theT = easeInCubic((t - tEnd / 2) / (tEnd / 4));

        ctx.fillStyle = theT < .5 ? cooleurs[1] : cooleurs[2];
        ctx.fillRect(0, 0, finalSize, finalSize);

        ctx.lineWidth = finalSize / cooleurs.length;

        let sizingT = theT < .5 ? theT / .5 : 1;

        let flagW = finalSize / 2 + finalSize / 2 * sizingT;
        let flagH = finalSize / 2 + finalSize / 2 * sizingT;
        let flagX = finalSize / 2 - flagW / 2;
        let flagY = finalSize / 2 - flagH / 2;

        ctx.save();
        ctx.translate(finalSize / 2, finalSize / 2);
        ctx.rotate(degToRad(theT * 180 - 180));
        ctx.translate(-finalSize / 2, -finalSize / 2);

        trabsFlag(flagX, flagY, flagW, flagH);

        ctx.restore();
    } else if (t < tEnd) {
        let theT = easeOutCubic((t - tEnd / 4 * 3) / (tEnd / 4));

        ctx.fillStyle = theT < .5 ? cooleurs[2] : cooleurs[0];
        ctx.fillRect(0, 0, finalSize, finalSize);

        ctx.lineWidth = finalSize / cooleurs.length;

        let sizingT = theT > .5 ? (theT - .5) / .5 : 0;

        let flagW = finalSize - finalSize / 2 * sizingT;
        let flagH = finalSize - finalSize / 2 * sizingT;
        let flagX = finalSize / 2 - flagW / 2;
        let flagY = finalSize / 2 - flagH / 2;

        ctx.save();
        ctx.translate(finalSize / 2, finalSize / 2);
        ctx.rotate(degToRad(theT * 180));
        ctx.translate(-finalSize / 2, -finalSize / 2);

        trabsFlag(flagX, flagY, flagW, flagH);

        ctx.restore();
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
function trabsFlag(x, y, w, h) {
    ctx.lineWidth = h / cooleurs.length;
    ctx.lineCap = "round";
    for (let i = 0; i < cooleurs.length; i++) {
        ctx.strokeStyle = cooleurs[i];
        ctx.beginPath();
        ctx.moveTo(x, y + ctx.lineWidth * (i + .5));
        ctx.lineTo(x + w, y + ctx.lineWidth * (i + .5));
        ctx.stroke();
    }
}

function degToRad(deg) {
    return Math.PI / 180 * deg;
}

// https://gist.github.com/gre/1650294
function easeInCubic(t) { return t * t * t; }
function easeOutCubic(t) { return (--t) * t * t + 1; };

// https://gist.github.com/gre/1650294#gistcomment-1924831
function easeInSin(t) { return 1 + Math.sin(Math.PI / 2 * t - Math.PI / 2); }
function easeOutSin(t) { return Math.sin(Math.PI / 2 * t); }
function easeInOutSin(t) { return (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2; }