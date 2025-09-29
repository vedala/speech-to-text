import React, { useState, useRef } from "react";

function RecordUploadAudio() {
  const [recording, setRecording] = useState(false);
  // const [audioURL, setAudioURL] = useState("");
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [transcript, setTranscript] = useState("");

  const uploadRecording = async (file) => {
    const formData = new FormData();
    formData.append("audio", file);

console.log("In uploadRecording");
    const res = await fetch("http://localhost:4000/transcribe", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const file = new File([blob], "recording.webm", { type: "audio/webm" });
        // const url = URL.createObjectURL(blob);

console.log("In onstop");
        // setAudioURL(url);
        const transcriptData = await uploadRecording(file);
        console.log("transcriptData=", transcriptData);
        setTranscript(transcriptData.text);
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div className="p-4">
      <h2>Record & Upload Audio</h2>
      <button
        onClick={recording ? stopRecording : startRecording}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
      <textarea
        value={transcript}
        onChange={e => setTranscript(e.target.value)}
        rows={10}
        cols={60}
      />
{/*
      {audioURL && (
        <div className="mt-4">
          <audio controls src={audioURL}></audio>
          <a href={audioURL} download="recording.webm" className="ml-2 text-blue-500">
            Download
          </a>
        </div>
      )}
 */}
      <button
        onClick={() => {
          const blob = new Blob([transcript], { type: "text/plain" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "transcript.txt";
          link.click();
        }}
      >
        Download Transcript
      </button>

    </div>
  );
}


export default RecordUploadAudio;
