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


let outputFolder = path.join("./", "frames_" + canvas.width + "x" + fps);
if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder);

startingTime = Date.now();
draw();

function draw() {
    let t = currentFrame / fps;
    
    // Rendering code here

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