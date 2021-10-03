const fs = require('fs');
const sdk = require("microsoft-cognitiveservices-speech-sdk");

// Its okay, you can steal it. Its a free subscription that is already deleted.
const speechConfig = sdk.SpeechConfig.fromSubscription(
  "c072d816c3dc4e34a8d157s1d4d25e986",
  "southeastasia");

const fromFile = () => {
  const audioConfig = sdk.AudioConfig.fromWavFileInput(
    fs.readFileSync("audio/my-audio-file-1.wav"));

  const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  recognizer.recognizeOnceAsync(result => {
    if(!result.text){
      console.error(result.privErrorDetails);
    }
    console.log(`Text=${result.text}`);
    recognizer.close();
  });
}

fromFile();

