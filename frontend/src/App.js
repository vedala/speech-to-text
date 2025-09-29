import './App.css';
import RecordUploadAudio from './RecordUploadAudio';

function App() {
  navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    // got audio stream
  })
  .catch(err => {
    console.error("Microphone access denied:", err);
  });

  return (
    <div className="App">
      <h1>STT</h1>
      <RecordUploadAudio />
    </div>
  );
}

export default App;
