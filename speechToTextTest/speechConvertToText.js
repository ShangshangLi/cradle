//this script credit to iamabhishek (https://www.studytonight.com/post/javascript-speech-recognition-example-speech-to-text);

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
        output.classList.remove("hide");
    };
  
     // start recognition
     recognition.start();
}