// App.jsx
import React, { useEffect, useRef, useState } from "react";
import { pipeline } from "@xenova/transformers";

const App = () => {
  const [transcription, setTranscription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const whisperRef = useRef(null);

  // Load Whisper model with WebGPU on mount
  useEffect(() => {
    const loadModel = async () => {
      whisperRef.current = await pipeline("automatic-speech-recognition", "Xenova/whisper-tiny.en", {
        quantized: true,
        use_gpu: true,
      });
    };
    loadModel();
  }, []);

  const handleStartRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    audioChunksRef.current = [];
    mediaRecorderRef.current.ondataavailable = event => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current);
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioContext = new AudioContext({ sampleRate: 16000 });
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const audioData = audioBuffer.getChannelData(0);

      console.log("Audio data sample:", audioData.slice(0, 20));

      const result = await whisperRef.current(audioData);
      setTranscription(result.text);
    };

    mediaRecorderRef.current.start();
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current.stop();
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-4">Whisper WebGPU STT</h1>
      <button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        className="bg-white text-black px-4 py-2 rounded"
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
      <p className="mt-6 max-w-xl text-center">{transcription || "Your transcription will appear here..."}</p>
    </div>
  );
};

export default App;
