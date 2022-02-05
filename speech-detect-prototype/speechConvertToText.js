
const taboo = [
    'artificial intelligence',
    'AI',
    'robot',
    'robots',
    'against',
    'fight'
];

//original function runSpeechRecognition() credit to iamabhishek (https://www.studytonight.com/post/javascript-speech-recognition-example-speech-to-text);
function runSpeechRecognition() {
    // get output div reference
    var output = document.getElementById("output");
    // get action element reference
    var action = document.getElementById("action");
    // new speech recognition object
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var recognition = new SpeechRecognition();

    // This runs when the speech recognition service starts
    recognition.onstart = function() {
        action.innerHTML = "listening, please speak...";
    };
    
    recognition.onspeechend = function() {
        action.innerHTML = "stopped listening, hope you are done...";
        recognition.stop();
    }
  
    // This runs when the speech recognition service returns result
    recognition.onresult = function(event) {
        var transcript = event.results[0][0].transcript; 
        output.innerHTML = "<b>Text:</b> " + transcript;

        //use tabooOrNot to control the text color;
        let tabooOrNot=false;

        //my taboo recgonition function;
        for(let i=0;i<taboo.length;i++){
            if (transcript.includes(taboo[i])) {
                console.log("yes. the taboo included is: "+ taboo[i]);
                tabooOrNot=true;
            } else {
                console.log(taboo[i]+" isn't included");
            }
        }

        //change color of the taboo;
        if(tabooOrNot==true){
            const warning = document.getElementById("output");
            warning.style.color = "red";
        }else{
            const warning = document.getElementById("output");
            warning.style.color = "black";
        }

        output.classList.remove("hide");
    };
  
     // start recognition
     recognition.start();
}
