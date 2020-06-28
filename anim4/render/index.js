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
    "#000000",
    "#a3a3a3",
    "#ffffff",
    "#800080"
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
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, finalSize, finalSize);

    ctx.lineCap = "round";

    if (t < tEnd / 4) {
        let theTimeIsNow = easeInOutCubic(t / (tEnd / 4));

        ctx.save();
        ctx.rotate(degToRad(theTimeIsNow * 90));

        ctx.fillStyle = cooleurs[0];
        ctx.fillRect(0, 0, finalSize / 2, finalSize / 4);
        ctx.fillStyle = cooleurs[1];
        ctx.fillRect(0, finalSize / 4, finalSize / 2, finalSize / 4);
        ctx.restore();

        ctx.save();
        ctx.translate(finalSize, 0);
        ctx.rotate(degToRad(theTimeIsNow * -90));
        ctx.translate(-finalSize, 0);

        ctx.fillStyle = cooleurs[0];
        ctx.fillRect(finalSize / 2, 0, finalSize / 2, finalSize / 4);
        ctx.fillStyle = cooleurs[1];
        ctx.fillRect(finalSize / 2, finalSize / 4, finalSize / 2, finalSize / 4);
        ctx.restore();

        let lowerHalfOffsetY = finalSize / 2 * theTimeIsNow;

        ctx.fillStyle = cooleurs[2];
        ctx.fillRect(- finalSize / 2 * theTimeIsNow, finalSize / 2 + lowerHalfOffsetY, finalSize / 2, finalSize / 4);
        ctx.fillStyle = cooleurs[3];
        ctx.fillRect(- finalSize / 2 * theTimeIsNow, finalSize / 4 * 3 + lowerHalfOffsetY, finalSize / 2, finalSize / 4);

        ctx.fillStyle = cooleurs[2];
        ctx.fillRect(finalSize / 2 + finalSize / 2 * theTimeIsNow, finalSize / 2 + lowerHalfOffsetY, finalSize / 2, finalSize / 4);
        ctx.fillStyle = cooleurs[3];
        ctx.fillRect(finalSize / 2 + finalSize / 2 * theTimeIsNow, finalSize / 4 * 3 + lowerHalfOffsetY, finalSize / 2, finalSize / 4);
    } else if (t < tEnd / 2) {
        let theTimeIsNow = easeInOutCubic((t - tEnd / 4) / (tEnd / 4));

        let maxSize = Math.sqrt((finalSize / 2) ** 2 / 2) * 2;

        let hnow = maxSize / 4 * theTimeIsNow;

        ctx.save();
        ctx.translate(finalSize / 2, finalSize / 2);
        ctx.rotate(degToRad(theTimeIsNow * 180 - 180));
        ctx.translate(-finalSize / 2, -finalSize / 2);

        ctx.fillStyle = cooleurs[0];
        ctx.fillRect(finalSize / 2 - maxSize / 2, finalSize / 2 - hnow * 2, maxSize, hnow);

        ctx.fillStyle = cooleurs[1];
        ctx.fillRect(finalSize / 2 - maxSize / 2, finalSize / 2 - hnow, maxSize, hnow);

        ctx.fillStyle = cooleurs[2];
        ctx.fillRect(finalSize / 2 - maxSize / 2, finalSize / 2, maxSize, hnow);

        ctx.fillStyle = cooleurs[3];
        ctx.fillRect(finalSize / 2 - maxSize / 2, finalSize / 2 + hnow, maxSize, hnow);
        ctx.restore();
    } else if (t < tEnd / 4 * 3) {
        let theTimeIsNow = easeInOutCubic((t - tEnd / 2) / (tEnd / 4));

        let maxSize = Math.sqrt((finalSize / 2) ** 2 / 2) * 2;

        ctx.save();
        ctx.translate(finalSize / 2, finalSize / 2);
        //ctx.rotate(degToRad(theTimeIsNow * 180 - 180));
        ctx.translate(-finalSize / 2, -finalSize / 2);

        ctx.fillStyle = cooleurs[1];
        ctx.fillRect(finalSize / 2 - maxSize / 2, finalSize / 2 - maxSize / 4, maxSize, maxSize / 4);

        ctx.fillStyle = cooleurs[2];
        ctx.fillRect(finalSize / 2 - maxSize / 2, finalSize / 2, maxSize, maxSize / 4);

        ctx.fillStyle = cooleurs[3];
        ctx.fillRect(finalSize / 2 - maxSize / 2, finalSize / 2 + maxSize / 4, maxSize, maxSize / 4);

        ctx.fillStyle = cooleurs[0];
        ctx.fillRect((finalSize / 2 - maxSize / 2) * (1 - theTimeIsNow), (finalSize / 2 - maxSize / 2) * (1 - theTimeIsNow),
            maxSize + (finalSize - maxSize) * theTimeIsNow, maxSize / 4 + (finalSize - maxSize / 4) * theTimeIsNow);
        ctx.restore();
    } else if (t < tEnd) {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, finalSize, finalSize);

        let theTimeIsNow = easeInOutCubic((t - tEnd / 4 * 3) / (tEnd / 4));

        ctx.save();
        ctx.translate(0, finalSize);
        ctx.rotate(degToRad(theTimeIsNow * 90 - 90));
        ctx.translate(0, -finalSize);

        ctx.fillStyle = cooleurs[2];
        ctx.fillRect(0, finalSize / 2, finalSize / 2, finalSize / 4);
        ctx.fillStyle = cooleurs[3];
        ctx.fillRect(0, finalSize / 4 * 3, finalSize / 2, finalSize / 4);
        ctx.restore();

        ctx.save();
        ctx.translate(finalSize, finalSize);
        ctx.rotate(degToRad(theTimeIsNow * -90 + 90));
        ctx.translate(-finalSize, -finalSize);

        ctx.fillStyle = cooleurs[2];
        ctx.fillRect(finalSize / 2, finalSize / 2, finalSize / 2, finalSize / 4);
        ctx.fillStyle = cooleurs[3];
        ctx.fillRect(finalSize / 2, finalSize / 4 * 3, finalSize / 2, finalSize / 4);
        ctx.restore();

        let upperHalfOffsetY = finalSize / 2 * (1 - theTimeIsNow);

        ctx.fillStyle = cooleurs[0];
        ctx.fillRect(-upperHalfOffsetY, -upperHalfOffsetY, finalSize / 2, finalSize / 4);
        ctx.fillStyle = cooleurs[1];
        ctx.fillRect(-upperHalfOffsetY, -upperHalfOffsetY + finalSize / 4, finalSize / 2, finalSize / 4);

        ctx.fillStyle = cooleurs[0];
        ctx.fillRect(finalSize / 2 + upperHalfOffsetY, -upperHalfOffsetY, finalSize / 2, finalSize / 4);
        ctx.fillStyle = cooleurs[1];
        ctx.fillRect(finalSize / 2 + upperHalfOffsetY, -upperHalfOffsetY + finalSize / 4, finalSize / 2, finalSize / 4);
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
function easeInOutCubic(t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; }