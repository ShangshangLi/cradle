// https://www.youtube.com/watch?v=q_bXBcmfTJM
//please speak anything;
//press mouse to let the computer speak out the new sentence;

let speechResult;
let speechProduct;
let speech;
let initialSound;
let speechOutput;
const disciplineWord = ["Little baby, what did you say? Say that again.", "Look at you, so cute. Keep saying, keep saying", "Are you trying to say something? slower, clearer, try it again so we can understand you.", "Nice kid will keep their voice low.", "You are so expressive, but need a bit more practice to let me understand you. What did you want to say?"];
let song;
let cursorImg;
let infoImg;

// const textToWrite = "Circular Hello Curves";
const SEGMENTS = 200;
//auto start variables
let centerX, centerY, fontSize, INNER_RADIUS, RADIUS_VARIATION;
let pct, pixToAngularPct;

function preload() {
  initialSound = loadTable('./src/initialSound.csv', 'csv', 'header');
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
  fontSize = screenPct * 50;
  textSize(fontSize);

  song.volume(0.2);
  song.loop();

  noCursor();

  let lang = navigator.language || 'en-US';
  let speechRec = new p5.SpeechRec(lang, gotSpeech);

  let continuous = true; //the SpeechRec originally only listen to one thing, the folloing step help to make it work continuously;
  let interim = false; //if interim is true, the SpeechRec will keep listening, like the painting example;
  speechRec.start(continuous, interim);

  // speechRec.start();//the program only listen once;  

  function gotSpeech() {
    if (speechRec.resultValue == true) { //to ensure whether the recognition is successful or not;
      speechResult = speechRec.resultString;

      // createP('input: '+speechResult);//type out the string;
      // dealSpeech(speechResult);
      // createP('output: '+ dealSpeech(speechResult));
      speechOutput = dealSpeech(speechResult);

      //speak;
      speech = new p5.Speech(voiceReady);

      // speech.started(startSpeaking);
      // speech.ended(endSpeaking);
      //speech.speak(dealSpeech(speechResult));
    }
    console.log(speechRec);
  }

  //functions to make user recognize and let computer speak;
  // function startSpeaking(){
  //   background('green');
  // }

  // function endSpeaking(){
  //   background(0);
  // }

  function voiceReady() {
    console.log(speech.voices); //i don't know why it cannot load the voice list;
  }

}

//functions to make user recognize and let computer speak;
// function startSpeaking(){
//     background('green');
// }
// function endSpeaking(){
//     background(0);
// }

function mousePressed() {
  // startSpeaking();
  let voices = speech.voices;
  //let voice = random(voices);//get a random speaker;
  // console.log(voice.name);
  let voice = speech.setVoice(10);
  // speech.setVoice(voice.name);//to change the voice by number or by name;
  // speech.setVoice('Alex');
  //10\16\17\25;
  // voice.setVolume(0.1);
  speech.setRate(1);
  speech.setPitch(1);

  let dIndex = int(random(0, disciplineWord.length));
  console.log("discipline: " + disciplineWord[dIndex]);

  //speak
  // speech.speak(dealSpeech(speechResult));
  speech.speak(speechOutput);
  speech.speak(disciplineWord[dIndex]);

  // endSpeaking();
}

function dealSpeech(speechResult) {

  let splitString = split(speechResult, ' ');
  let sLen = splitString.length;
  console.log(sLen);
  let deleteController = false;
  for (let i = 0; i < sLen; i++) {
    // if((i%2==1)&&(deleteController==false)){//delete the string on the even position in the array;
    //   splitString.splice(i,1);
    //   // console.log(splitString);
    //   deleteController=true;
    // }else if ((i%2==0)&&(deleteController==true)){
    //   splitString.splice(i,1);
    //   // console.log(splitString);
    //   deleteController=false;

    splitString[i] = splitWord(splitString[i]);
    //}

  }

  // speechResult=splitString.join(' ');
  speechResult = join(splitString, ' ');
  console.log('speechResult is: ' + speechResult);

  // speechResult=join(split)
  return speechResult;
}

function splitWord(oneWordFromSplitString) {
  let length = oneWordFromSplitString.length;
  let splitWord = split(oneWordFromSplitString, '');
  console.log(splitWord);

  let firstTwoSound = [splitWord[0], splitWord[1]];
  console.log("First two sound of the word: " + firstTwoSound);
  let twoSound = firstTwoSound.join('');
  console.log("First two sound of the word: " + twoSound);

  let match = false;

  //delete the initial sound of the word;
  for (let c = 0; c < initialSound.getColumnCount(); c++) {
    for (let r = 0; r < initialSound.getRowCount(); r++) {
      let current = initialSound.getString(r, c); //go through the initial sound list;
      let currentIS = current.toLowerCase(); //decapitalize of the table;
      // console.log(currentIS);
      if ((match == false) && (twoSound == currentIS)) {
        splitWord.splice(0, 2); //remove the first two initial sound;
        console.log("New word: " + splitWord);
        match = true;
      } else if ((match == false) && (splitWord[0] == currentIS)) {
        splitWord.splice(0, 1); //remove the first initial sound;
        console.log("New word: " + splitWord);
        match = true;
      }
    }
  }

  let wordResult = join(splitWord, '');
  console.log("wordResult: " + wordResult);
  return wordResult;
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

  //   let startColor=color(137, 207, 240,1);//babyblue;
  //   let endColor=color('white');
  //   for(let i=0; i<=windowWidth/2; i++){
  //   fill(lerpColor(startColor,endColor,i/windowWidth),0.5);
  //   rect(0+i,0, 1,windowHeight);
  //   }

  //   let startColor2=color(255, 192, 203,1);//babyblue;
  //   let endColor2=color('white');
  //   for(let j=0; j<=windowWidth/2; j++){
  //   fill(lerpColor(startColor2,endColor2,j/windowWidth),0.5);
  //   rect(windowWidth/2+j,0, 1,windowHeight);
  //   }

  // 	let startColor=color(137, 207, 240,0.5);//babyblue;
  // 	let endColor=color('white');//white
  // 	// endColor=color('pink');
  // 	for(i=0; i<=windowWidth; i++){
  // 	fill(lerpColor(startColor,endColor,i/windowWidth),0.5);
  // 	rect(0+i,0, 1,windowHeight);
  // 	}

  // 	let startColor2=color('white');
  //     // let startColor2=color('white');
  // 	let endColor2=color(255, 192, 203,1);//pink
  // 	// let endColor2=color('pink');
  // 	for(i=0; i<=windowWidth; i++){
  // 	fill(lerpColor(startColor2,endColor2,i/windowWidth),0.5);
  // 	rect(0+i,0, 1,windowHeight);
  // 	}

  // let startColor=color(137, 207, 240,0.5);//babyblue;
  // let endColor=color(150,150,240,1);
  // // endColor=color('pink');
  // for(i=0; i<=windowWidth; i++){
  // fill(lerpColor(startColor,endColor,i/windowWidth),0.5);
  // circle(0+i,0,windowHeight*2);
  // }
  // let startColor2=color(137, 207, 240,0.5);//babyblue;
  // let endColor2=color(255, 192, 203,0.5);
  // // endColor=color('pink');
  // for(i=0; i<=windowWidth; i++){
  // fill(lerpColor(startColor2,endColor2,i/windowWidth),0.5);
  // circle(0+i,0,windowHeight*2);
  // }

  fill('rgba(255, 192, 203,0.25)');
  beginShape();
  for (let i = 0; i < SEGMENTS; i++) {
    let p0 = pointForIndex(i / SEGMENTS);
    vertex(p0.x - 10, p0.y - 5);
  }
  endShape(CLOSE);

  fill('rgba(100,100,100,0.25)');
  beginShape();
  for (let i = 0; i < SEGMENTS; i++) {
    let p0 = pointForIndex(i / SEGMENTS);
    vertex(p0.x + 15, p0.y + 15);
  }
  endShape(CLOSE);

  fill('rgba(255, 255, 255,0.5)');
  noStroke();
  //draw sphere
  beginShape();
  for (let i = 0; i < SEGMENTS; i++) {
    let p0 = pointForIndex(i / SEGMENTS);
    vertex(p0.x, p0.y);
  }
  endShape(CLOSE);

  fill('rgba(137, 207, 240,0.5)');
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
  if (speechOutput != null) {
    drawText();
  }

  fill(137, 207, 240)
  //draw text
  pct = atan2(mouseY - centerY, mouseX - centerX) / TWO_PI; //follow mouse
  pixToAngularPct = 1 / ((INNER_RADIUS + RADIUS_VARIATION / 2) * TWO_PI);
  if (speechOutput != null) {
    drawText();
  }

  image(cursorImg, mouseX, mouseY, 30, 30);
  // if(mouseX>windowWidth-40){
  //   if(mouseY<20){
  //     tint(0, 0);
  //     image(cursorImg,mouseX,mouseY,30,30,0);
  //   }
  // }
  image(infoImg, windowWidth - 40, 20, 30, 30)
  console.log('mouseX:' + mouseX + ',mouseY:' + mouseY)
}

function drawText() {
  //   background(255);
  //   fill(0);
  //   noStroke();
  //   //draw sphere
  //   beginShape();
  //   for (let i = 0; i < SEGMENTS; i++) {
  //     let p0 = pointForIndex(i/SEGMENTS);
  // 	vertex(p0.x, p0.y);
  //   }
  //   endShape(CLOSE);

  //   //draw text
  //   let pct = atan2(mouseY - centerY, mouseX - centerX) / TWO_PI;//follow mouse
  //   let pixToAngularPct = 1/((INNER_RADIUS+RADIUS_VARIATION/2)*TWO_PI);
  for (var i = 0; i < speechOutput.length; i++) {
    let charWidth = textWidth(speechOutput.charAt(i));
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
    console.log("p.x=" + p.x + ",p.y=" + p.y);
    rotate(angle);
    translate(-p.x, -p.y);

    text(speechOutput.charAt(i), p.x - charWidth / 2, p.y);
    pop();

    pct += charWidth / 2 * pixToAngularPct;
  }
}