let width = window.innerWidth;
let height = window.innerHeight;
let size = width < height ? width * 0.6 : height * 0.6;
let angleX = 55;
let angleY = 0;
let angleZ = 45;
let keyDown = 0;

let fileByLine = [];
let lineCounter = 0;

let pointBoxes = [];
let point = [];

const defaultZ = 18;
const boxSize = 2;

let prevVector = [0,0, defaultZ];


window.onresize = () => {
  width = window.innerWidth;
  height = window.innerHeight;
  resizeCanvas(width, height);
  normalMaterial();
}

const fileInput = document.getElementById('file');

fileInput.addEventListener("change", () => {

  const reader = new FileReader();

  reader.onload = (event) => {
      const file = event.target.result;
      const allLines = file.split(/\r\n|\n/);
      // Reading line by line
      allLines.forEach((line) => {
        fileByLine.push(line);
      });
  };

  reader.onerror = (event) => {
      alert(event.target.error.name);
  };

  reader.readAsText(fileInput.files[0]);
}, false);

document.getElementById('clear').addEventListener("click", () => {
  pointBoxes = [];
}, false);


function setup() {
  createCanvas(width, height, WEBGL);
  angleMode(DEGREES);
}

function keyPressed() {
  keyDown = keyCode;
}

function keyReleased() {
  keyDown = 0;
}

function draw() {
  background(175);

  rotateX(angleX);
  rotateY(angleY);
  rotateZ(angleZ);
  stroke(0, 0, 0);

  // Draw build area platform
  fill(225, 225, 225);
  box(size, size, 30);

  // Draw cylinder "Laser Head"
  fill(255, 204, 0);
  translate(0, 0, 300);
  rotateX(90);
  cylinder(size * 0.05, 10, 15);
  rotateX(-90);
  translate(0, 0, -300);

  // Draw laser
  drawLaser(getNextPoint());

  fill(50,50,50);
  noStroke();
  for (let i = 0; i < pointBoxes.length - 1; i++) {
    point = pointBoxes[i];
    translate(point[0], point[1], defaultZ);
    box(boxSize,boxSize,boxSize);
    translate(-point[0], -point[1], -defaultZ);
  }
  stroke(0,0,0);


  // Move camera via arrow keys
  if (keyDown === LEFT_ARROW) {
    angleZ += 0.75;
  } else if (keyDown === RIGHT_ARROW) {
    angleZ -= 0.75;
  } else if (keyDown == UP_ARROW) {
    angleX += 0.5;
  } else if (keyDown == DOWN_ARROW) {
    angleX -= 0.5;
  }
}

function drawLaser(vectorToPoint) {
  if (vectorToPoint[2] == -1) {
    return;
  }
  stroke(255,0,0);
  strokeWeight(3);
  line(vectorToPoint[0], vectorToPoint[1], vectorToPoint[2], 0, 0, 300);

  if (vectorToPoint[0] != prevVector[0] || vectorToPoint[1] != prevVector[1] || vectorToPoint[2] != prevVector[2]) {
    pointBoxes.push([vectorToPoint[0], vectorToPoint[1], vectorToPoint[2]]);
  }

  stroke(0,0,0);
  strokeWeight(1);

  prevVector[0] = vectorToPoint[0];
  prevVector[1] = vectorToPoint[1];
  prevVector[2] = vectorToPoint[2];

}

function getNextPoint() {
  let commandName = "";

  if (fileByLine.length == 0) {
    return [0,0,-1];
  }

  do {
    commandName = fileByLine[lineCounter].split(" ")[0];
    if(fileByLine.length - lineCounter > 5) {
      lineCounter += 3;
    } else {
      fileByLine = [];
      return [0,0,-1];
    }
  } while(commandName !== "G1");


  let x = 0;
  let y = 0;
  let z = 0;


  try {
    x = 2.75 * (parseInt(fileByLine[lineCounter].split("X")[1].split(" ")[0]) - 100);
  } catch(e) {
    x = prevVector[0];
  }
  try {
    y = 2.75 * (parseInt(fileByLine[lineCounter].split("Y")[1].split(" ")[0]) - 100);
  } catch(e) {
    y = prevVector[1];
  }

  try {
    z = (2 * parseInt(fileByLine[lineCounter].split("Z")[1].split(" ")[0])) + defaultZ;
  } catch(e) {
    z = prevVector[2];
  }

  return [x, y, z];

}


/* Fun math functions that you dont need lol
function translateVector(vector) {

  let rotationMatrix = [
    [cos(angleY)*cos(angleZ), cos(angleX)*sin(angleZ)+sin(angleX)*sin(angleY)*cos(angleZ), sin(angleX)*sin(angleZ)-cos(angleX)*sin(angleY)*cos(angleZ)],
    [-cos(angleY)*cos(angleZ), cos(angleX)*sin(angleZ)-sin(angleX)*sin(angleY)*cos(angleZ), sin(angleX)*sin(angleZ)+cos(angleX)*sin(angleY)*cos(angleZ)],
    [sin(angleY), -sin(angleX)*cos(angleY), cos(angleX)*cos(angleY)]
  ];

  let translatedVector = vectorTimesMatrix(vector, rotationMatrix);

  return translatedVector;
}


function vectorTimesMatrix(vector, matrix) {
  return vector;
  let result = [];
  for (let i = 0; i < vector.length; i++) {
    let sum = 0;
    for (let j = 0; j < vector.length; j++) {
      sum += vector[j] * matrix[j][i];
    }
    result.push(sum);
  }

  return result;
} */