// https://www.youtube.com/watch?v=q_bXBcmfTJM
//please speak anything;
//press mouse to let the computer speak out the new sentence;

let speechResult;
let speechProduct;
let speech;
let initialSound;

function preload() {
  initialSound = loadTable('initialSound.csv', 'csv', 'header');
}

function setup(){
  createCanvas(400,100);
  let lang = navigator.language || 'en-US';
  let speechRec = new p5.SpeechRec(lang,gotSpeech);
 
  let continuous = true;//the SpeechRec originally only listen to one thing, the folloing step help to make it work continuously;
  let interim = false;//if interim is true, the SpeechRec will keep listening, like the painting example;
  speechRec.start(continuous,interim);
  
  // speechRec.start();//the program only listen once;  
  
  function gotSpeech(){
    if (speechRec.resultValue==true){//to ensure whether the recognition is successful or not;
      speechResult=speechRec.resultString;
      
      createP('input: '+speechResult);//type out the string;
      dealSpeech(speechResult)
      createP('output: '+ dealSpeech(speechResult));
      
      //speak;
      speech = new p5.Speech(voiceReady);
      speech.started(startSpeaking);
      speech.ended(endSpeaking);
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
  
  function voiceReady(){
    console.log(speech.voices);//i don't know why it cannot load the voice list;
  }
  
}

//functions to make user recognize and let computer speak;
function startSpeaking(){
    background('green');
}
function endSpeaking(){
    background(0);
}

function mousePressed(){
  startSpeaking();
  //let voices = speech.voices;
  // let voice = random(voices);//get a random speaker;
  // console.log(voice.name);
  speech.setVoice(10);
  // speech.setVoice(voice.name);//to change the voice by number or by name;
  // speech.setVoice('Alex');
  //10\16\17\25;
  // voice.setVolume(0.1);
  speech.setRate(1);
  speech.setPitch(10);
  speech.speak(dealSpeech(speechResult));
  endSpeaking();
}

function dealSpeech(speechResult){
    
    let splitString = split(speechResult, ' ');
    let sLen =  splitString.length;
    console.log(sLen);
    let deleteController=false;
    for(let i=0;i<sLen;i++){
      // if((i%2==1)&&(deleteController==false)){//delete the string on the even position in the array;
      //   splitString.splice(i,1);
      //   // console.log(splitString);
      //   deleteController=true;
      // }else if ((i%2==0)&&(deleteController==true)){
      //   splitString.splice(i,1);
      //   // console.log(splitString);
      //   deleteController=false;
      
      splitString[i]=splitWord(splitString[i]);
      //}
  
    }
  
    // speechResult=splitString.join(' ');
    speechResult = join(splitString, ' ');
    console.log('speechResult is: '+speechResult);

    // speechResult=join(split)
    return speechResult;
}

function splitWord(oneWordFromSplitString){
  let length = oneWordFromSplitString.length;
  let splitWord = split(oneWordFromSplitString,'');
  console.log(splitWord);
  
  let firstTwoSound = [splitWord[0], splitWord[1]];
  console.log("First two sound of the word: "+firstTwoSound);
  let twoSound = firstTwoSound.join('');
  console.log("First two sound of the word: "+twoSound);
  
  let match = false;
  
  //delete the initial sound of the word;
  for (let c = 0; c < initialSound.getColumnCount(); c++)
  {
    for (let r = 0; r < initialSound.getRowCount(); r++)
    {
      let current=initialSound.getString(r, c);//go through the initial sound list;
      let currentIS=current.toLowerCase();//decapitalize of the table;
      // console.log(currentIS);
      if((match == false) && (twoSound==currentIS)){
        splitWord.splice(0,2);//remove the first two initial sound;
        console.log("New word: "+splitWord);
        match = true;
      }else if((match == false) && (splitWord[0]==currentIS)){
        splitWord.splice(0,1);//remove the first initial sound;
        console.log("New word: "+splitWord);
        match = true;
      }
    }
  }
  
  let wordResult=join(splitWord, '');
  console.log("wordResult: "+wordResult);
  return wordResult;
}