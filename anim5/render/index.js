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

let triangleDensity = 10 / 17;
let cameraRotationRadius = finalSize / 2;

// cooleurs because we are cool 😎
let cooleurs = [
    "#ff9ccd",
    "#ff53bd",
    "#270046",
    "#675ffe",
    "#8ca7ff"
];

let triangoles = [];

let sizeLimiter = 1;

for (let i = 0; i < finalSize * triangleDensity; i++) {
    let newR = finalSize / 40;
    let newX = Math.random() * finalSize * 2;
    let newY = Math.random() * finalSize * 2;
    let tries = 0;
    while (triangoles.some((triangole) => dist(newX, newY, triangole.x, triangole.y) < newR * 2.5) && tries < 1000) {
        newX = Math.random() * finalSize * 2;
        newY = Math.random() * finalSize * 2;
        //console.info("againe");
        tries++;
    }
    tries >= 100 ? console.info("Ridiculous amount of relocation tries! (" + tries + ")") : 0;
    triangoles.push({
        x: newX,
        y: newY,
        r: newR,
        rotation: Math.random() * 360,
        rotationVariationFactor: Math.round(Math.random() * 4) - 2
    });
}

canvas.width = finalSize;
canvas.height = finalSize;
let outputFolder = path.join("./", "frames_" + canvas.width + "x" + fps);
if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder);

startingTime = Date.now();
draw();

function draw() {
    let t = currentFrame / fps;

    // Rendering code here
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, finalSize, finalSize);

    ctx.lineCap = "round";

    let cameraRotation = t / tEnd * -360;

    let offsetX = Math.cos(degToRad(cameraRotation)) * cameraRotationRadius + finalSize / 2;
    let offsetY = Math.sin(degToRad(cameraRotation)) * cameraRotationRadius + finalSize / 2;

    let rotationVariation = t / tEnd * 360 * 2;

    for (let triangole of triangoles) {
        let thisX = triangole.x - offsetX;
        let thisY = triangole.y - offsetY;

        ctx.strokeStyle = cooleurs[Math.floor((thisY + triangole.r) / (finalSize + triangole.r * 2) * cooleurs.length)];
        ctx.lineWidth = dist(0, 0, finalSize / 2, finalSize / 2) / dist(thisX, thisY, finalSize / 2, thisY) * 2;
        if (sizeLimiter) ctx.lineWidth = ctx.lineWidth > triangole.r / 2 ? triangole.r / 2 : ctx.lineWidth;

        ctx.lineJoin = "round";

        ctx.beginPath();
        pointTriangole(thisX, thisY, triangole.r, triangole.rotation + rotationVariation * triangole.rotationVariationFactor);
        ctx.closePath();
        ctx.stroke();
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
function pointTriangole(x, y, r, rotation) {
    let points = 3;
    for (let i = 0; i < points; i++) {
        if (!i) {
            ctx.moveTo(Math.cos(degToRad((i) / points * 360 + rotation)) * r + x,
                Math.sin(degToRad((i) / points * 360 + rotation)) * r + y);
        } else {
            ctx.lineTo(Math.cos(degToRad((i) / points * 360 + rotation)) * r + x,
                Math.sin(degToRad((i) / points * 360 + rotation)) * r + y);
        }
    }
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function degToRad(deg) {
    return Math.PI / 180 * deg;
}