

var target_sets = 3;
var target_reps = 10;
var is_started = false;
var current_sets = 0;
var current_reps = 0;
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var synth = window.speechSynthesis;
var the_words = ["1"];

var recognition = new SpeechRecognition();
if (SpeechGrammarList) {
  // SpeechGrammarList is not currently available in Safari, and does not have any effect in any other browser.
  // This code is provided as a demonstration of possible capability. You may choose not to use it.
  var speechRecognitionList = new SpeechGrammarList();
  var grammar = "#JSGF V1.0; grammar the_words; public <the_words> = " + the_words.join(" | ") + " ;"
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
}
recognition.continuous = true;
recognition.lang = "en-US";
recognition.maxAlternatives = 1;
recognition.interimResults = true;

function updateInfo(count_mode = false) {
    if (count_mode) {
        document.querySelector("#set-number").innerHTML = target_sets - current_sets;
        document.querySelector("#rep-number").innerHTML = target_reps - current_reps;
    } else {
        document.querySelector("#set-number").innerHTML = target_sets;
        document.querySelector("#rep-number").innerHTML = target_reps;
    }
}

window.onload = function loadPage() {
    updateInfo();
}

function addNumberSet(number) {
    target_sets += number;
    if (target_sets < 0) {
        target_sets = 0
    }
    document.querySelector("#set-number").innerHTML = target_sets;
}

function addNumberRep(number) {
    target_reps += number;
    if (target_reps < 0) {
        target_reps = 0
    }
    document.querySelector("#rep-number").innerHTML = target_reps;
}

function toggleRecording() {
    if (is_started) {
        stopRecording();
    } else {
        startRecording();
    }
}

function setupStart() {
    if (target_sets == 0 || target_reps == 0) {
        alert("Please set the number of sets and reps");
        return;
    }
    is_started = true;
    const btn = document.querySelector("#begin");
    btn.innerHTML = "Stop!";
    const controls = document.querySelectorAll(".number-controls");
    for (const el of controls) {
        el.classList.add("hidden");
    }
}

function setupStop() {
    is_started = false;
    const btn = document.querySelector("#begin");
    btn.innerHTML = "Begin!";
    const controls = document.querySelectorAll(".number-controls");
    for (const el of controls) {
        el.classList.remove("hidden");
    }
}

function startRecording() {
    setupStart();
    recognition.start();
}

function stopRecording() {
    setupStop();
    recognition.stop();
}

recognition.onresult = function(event) {
    var word = event.results[event.results.length-1][0].transcript;
    if (word == "1") {
      current_reps += 1;
      if (current_reps == target_reps) {
        current_reps = 0;
        current_sets += 1;
      }
      if (current_sets == target_sets) {
        stopRecording();
        updateInfo();
      } else {
        updateInfo(true);
      }
    }
  }
  
  recognition.onspeechend = function() {
    console.log("end");
  }
  
  recognition.onnomatch = function(event) {
    // diagnostic.textContent = "I didn"t recognise that color.";
  }
  
  recognition.onerror = function(event) {
    // diagnostic.textContent = "Error occurred in recognition: " + event.error;
  }