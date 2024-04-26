let r;
let points = [];
let video;
let captureWidth = 320;
let captureHeight = 240;

function setup() {
  const aspectRatio = captureWidth / captureHeight;
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  

  video = createCapture(VIDEO);
  video.size(captureWidth, captureHeight);
  video.hide();
}

function draw() {
  background(220);
  points = []; // Clear points array on each frame

  video.loadPixels();

  const edgeThreshold = 100; // Experiment with different values

  for (let y = 1; y < captureHeight - 1; y++) {
    for (let x = 1; x < captureWidth - 1; x++) {
      let horizontalSobel = 0;
      let verticalSobel = 0;

      for (let kernelY = -1; kernelY <= 1; kernelY++) {
        for (let kernelX = -1; kernelX <= 1; kernelX++) {
          const neighborX = x + kernelX;
          const neighborY = y + kernelY;
          const neighborIndex = 4 * (neighborY * captureWidth + neighborX);

          const neighborRed = video.pixels[neighborIndex];
          const neighborGreen = video.pixels[neighborIndex + 1];
          const neighborBlue = video.pixels[neighborIndex + 2];

          const kernelValue = SobelKernel[kernelY + 1][kernelX + 1];

          horizontalSobel += neighborRed * kernelValue;
          verticalSobel += neighborGreen * kernelValue;
        }
      }

      const edgeStrength = Math.sqrt(horizontalSobel * horizontalSobel + verticalSobel * verticalSobel);

      if (edgeStrength > edgeThreshold) {
        stroke(255);
        const scaledX = map(x, 0, captureWidth, 0, windowWidth);
        const scaledY = map(y, 0, captureHeight, 0, windowHeight);
        points.push([scaledX, scaledY]);
        point(scaledX, scaledY);
      }
    }
  }

  if (points.length > 0) {
    for (let i = 0; i < 400; i++) {
      randomBezier();
    }
  }
}


// Sobel kernel for edge detection
const SobelKernel = [
  [-1, -1, -1],
  [-1, 8, -1],
  [-1, -1, -1],
];

function randomBezier() {
  let point1 = points[floor(random(0, points.length))];
  let point2 = points[floor(random(0, points.length))];
  let point3 = points[floor(random(0, points.length))];
  let point4 = points[floor(random(0, points.length))];
  noFill();
  bezier(point1[0], point1[1], point2[0], point2[1], point3[0], point3[1], point4[0], point4[1]);
}
