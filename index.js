const fs = require('fs');
const sdk = require("microsoft-cognitiveservices-speech-sdk");

const audioFilePath = "audio/my-audio-file-1.wav";

// offsets are 100 nano second incements
const nanoToSeconds = value => value / (10000000);

// Its okay, you can steal it. Its a free subscription that is already deleted.
const speechConfig = sdk.SpeechConfig.fromSubscription(
  "c072d816c3dc4e34a8d1571d4d25e986",
  "southeastasia");

const fromFile = () => {
  const audioConfig = sdk.AudioConfig.fromWavFileInput(
    fs.readFileSync(audioFilePath)
  );

  const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  recognizer.recognized = (s, e) => {
    if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
      console.log(`RECOGNIZED: Text=${e.result.text} at offset=${nanoToSeconds(e.result.offset)}seconds, duration=${nanoToSeconds(e.result.duration)}seconds`);
    }
    else if (e.result.reason === sdk.ResultReason.NoMatch) {
      console.log(`RECOGNIZED: Text=${e.result.text} at offset=${nanoToSeconds(e.result.offset)}seconds`);
    }
  };

  recognizer.canceled = (s, e) => {
    console.log(`CANCELED: Reason=${e.reason}`);

    if (e.reason === sdk.CancellationReason.Error) {
      console.log(`"CANCELED: ErrorCode=${e.errorCode}, ErrorDetails=${e.errorDetails}`);
    }

    recognizer.stopContinuousRecognitionAsync();
  };

  recognizer.sessionStopped = (s, e) => {
    console.log("Session stopped.");
    recognizer.stopContinuousRecognitionAsync();
  };

  recognizer.startContinuousRecognitionAsync();
}
fromFile();

