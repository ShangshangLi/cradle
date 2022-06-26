let song;
let cursorImg;
let infoImg;
let title = "Cradle";
let subtitle = "Shangshang Li";
let titleFS;

// const textToWrite = "Circular Hello Curves";
const SEGMENTS = 200;
//auto start variables
let centerX, centerY, fontSize, INNER_RADIUS, RADIUS_VARIATION;
let pct, pixToAngularPct;

function preload() {
  song = createAudio('./src/lullaby.mp3');
  cursorImg = loadImage('./src/stopCursor.png');
  infoImg = loadImage('./src/info.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  centerX = windowWidth / 2;
  centerY = windowHeight / 2;
  let screenPct = min(height, width) / 1000;
  INNER_RADIUS = screenPct * 200;
  RADIUS_VARIATION = screenPct * 200;
  textFont('Nova Flat');
  fontSize = screenPct * 45;
  textSize(fontSize);
  titleFS = screenPct * 100;
  song.volume(0.2);
  song.loop();
  noCursor();

}

//code adapted from @GoToLoop
//generates a circular noise with perfect looping
//https://forum.processing.org/one/topic/how-to-make-perlin-noise-loop.html
function pointForIndex(pct) {
  const NOISE_SCALE = 1.5;
  let angle = pct * TWO_PI;
  let cosAngle = cos(angle);
  let sinAngle = sin(angle);
  let time = frameCount / 100;
  let noiseValue = noise(NOISE_SCALE * cosAngle + NOISE_SCALE, NOISE_SCALE * sinAngle + NOISE_SCALE, time);
  let radius = INNER_RADIUS + RADIUS_VARIATION * noiseValue;
  return {
    x: radius * cosAngle + centerX,
    y: radius * sinAngle + centerY
  };
}

function draw() {
  background(255);

  let startColor = color(137, 207, 240, 0.5); //babyblue;
  let endColor = color('pink');
  for (let i = 0; i <= windowWidth; i++) {
    fill(lerpColor(startColor, endColor, i / windowWidth), 0.5);
    rect(0 + i, 0, 1, windowHeight);
  }

  textSize(titleFS);
  text(title,windowWidth/20,windowHeight-windowWidth/20*2.5);
  textSize(fontSize);
  text(subtitle,windowWidth/20,windowHeight-windowWidth/20*1.7);

  textSize(fontSize);
  noFill();
  noStroke();
  //draw sphere
  beginShape();
  for (let i = 0; i < SEGMENTS; i++) {
    let p0 = pointForIndex(i / SEGMENTS);
    vertex(p0.x, p0.y);
  }
  endShape(CLOSE);

  fill("white")
  //draw text shadow
  pct = atan2(mouseY - centerY - 5, mouseX - centerX - 5) / TWO_PI; //follow mouse
  pixToAngularPct = 1 / ((INNER_RADIUS + RADIUS_VARIATION / 2) * TWO_PI);
  drawText();

  fill(137, 207, 240)
  //draw text
  pct = atan2(mouseY - centerY, mouseX - centerX) / TWO_PI; //follow mouse
  pixToAngularPct = 1 / ((INNER_RADIUS + RADIUS_VARIATION / 2) * TWO_PI);
  drawText();

  image(cursorImg, mouseX, mouseY, 30, 30);
  // if(mouseX>windowWidth-40){
  //   if(mouseY<20){
  //     tint(0, 0);
  //     image(cursorImg,mouseX,mouseY,30,30,0);
  //   }
  // }
  image(infoImg, windowWidth - 40, 20, 30, 30)
  //console.log('mouseX:' + mouseX + ',mouseY:' + mouseY)
}

function drawText() {
  for (var i = 0; i < title.length; i++) {//control the number of the words;
    let charWidth = textWidth("cradle ");
    pct += charWidth / 2 * pixToAngularPct;

    //calculate angle
    let leftP = pointForIndex(pct - 0.01);
    let rightP = pointForIndex(pct + 0.01);
    let angle = atan2(leftP.y - rightP.y, leftP.x - rightP.x) + PI;

    push();
    let p = pointForIndex(pct);
    //apply angle

    //adjust the position of the text;
    let adjustX = 0;
    if (p.y < centerX) {
      adjustX = -10;
    } else {
      adjustX = +10;
    }
    let adjustY = 0;
    if (p.y < centerY) {
      adjustY = -10;
    } else {
      adjustY = +10;
    }
    translate(p.x + adjustX, p.y + adjustY); //make the text above the breathing heart a little bit;
    //console.log("p.x=" + p.x + ",p.y=" + p.y);
    rotate(angle);
    translate(-p.x, -p.y);

    text("Cradle", p.x - charWidth / 2, p.y);
    pop();

    pct += charWidth / 2 * pixToAngularPct;
  }
}