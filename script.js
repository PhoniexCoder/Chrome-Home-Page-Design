function googleSearch() {
  var text = document.getElementById("search").value;
  var cleanQuery = text.replace(" ", "+", text);
  var url = 'http://www.google.com/search?q=' + cleanQuery;
  window.open(url, '_blank').focus();
}


const editableText = document.getElementById('editable-text');

if (localStorage.getItem('savedText')) {
  editableText.textContent = localStorage.getItem('savedText');
}


editableText.addEventListener('input', function () {

  localStorage.setItem('savedText', this.textContent);
})


const input = document.getElementById('search');
input.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    googleSearch();
  }
}
);



/** New code */
const resultParagraph = document.getElementById('result');
let x = 0;

let recognition;
let silenceTimeout;

if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = "en-GB";

  recognition.onstart = function () {
    document.getElementById("search").value = "";
    document.getElementById("search").placeholder = "Speak now...";
  };

  recognition.onresult = function (event) {
    let transcript = event.results[event.results.length - 1][0].transcript;
    document.getElementById('search').value = event.results[0][0].transcript;
    resetSilenceTimeout();
  };

  recognition.onsoundend = function () {
    console.log('Sound ended');
    resetSilenceTimeout();
  };

  recognition.onspeechend = function () {
    console.log('Speech ended');
    resetSilenceTimeout();
  };

  recognition.onerror = function (event) {
    console.error('Recognition error: ' + event.error);
  };

  recognition.onend = function () {
    document.getElementById("search").placeholder = "Search here...";
    clearTimeout(silenceTimeout);
  };

  /** New voice function. */

  function voice() {
    if (x == 0) {
      recognition.start();
      resetSilenceTimeout();
      x = 1;
    } else {
      recognition.stop();
      clearTimeout(silenceTimeout);
      x = 0;
    }
  }

  function resetSilenceTimeout() {
    clearTimeout(silenceTimeout);
    silenceTimeout = setTimeout(function () {
      recognition.stop();
    }, 5000); // 5000 ms = 5 seconds of silence
  }
} else {
  console.error('webkitSpeechRecognition is not supported in this browser.');
}



/**function voice() {
   * Old code 
   * 
   * 
    document.getElementById("search").placeholder = "Speak now...";
    var recognition = new webkitSpeechRecognition();
    recognition.lang = "en-GB";
    recognition.onresult = function (event) {
      console.log(event);
      document.getElementById('search').value = event.results[0][0].transcript;
    }
    recognition.start();
  
   
} **/
