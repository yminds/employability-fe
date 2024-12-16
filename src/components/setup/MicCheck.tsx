import React, { useEffect, useState, useRef } from "react";

const MicCheck: React.FC = () => {
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [selectedMic, setSelectedMic] = useState<string | null>(null); // Default to null
  const [dots, setDots] = useState<boolean[]>(Array(10).fill(false));
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Get available microphones
  useEffect(() => {
    const getMicrophones = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const micDevices = devices.filter((device) => device.kind === "audioinput");
      setMicrophones(micDevices);

      // If no mic is selected, keep the default as null
    };

    getMicrophones();
  }, []);

  // Handle audio context and volume analysis when the mic is selected
  useEffect(() => {
    if (selectedMic) {
      const startMic = async () => {
        try {
          // Request access to the selected microphone
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: { deviceId: { exact: selectedMic } },
          });

          // Clean up any previous stream if necessary
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
          }

          streamRef.current = stream;

          // Create AudioContext for analyzing the mic
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          audioContextRef.current = audioContext;

          const analyser = audioContext.createAnalyser();
          analyserRef.current = analyser;

          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);

          // Setup frequency data analysis
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          const update = () => {
            analyser.getByteFrequencyData(dataArray);

            // Calculate average volume
            const volume = dataArray.reduce((a, b) => a + b) / bufferLength;
            setDots(Array(10).fill(false).map((_, i) => volume > i * 10));

            // Continue updating
            requestAnimationFrame(update);
          };

          update();
        } catch (err) {
          console.error("Error accessing microphone:", err);
        }
      };

      startMic();
    }

    // Clean up on component unmount or microphone change
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [selectedMic]);

  return (
    <div className="bg-[#FAFAFA] border p-6 rounded-lg flex flex-col justify-around">
      <div className="w[42px] h-[42px]">
        <img src="src/assets/images/mic.png" alt="microphone icon" />
      </div>
      <div className="w-[244px] h-[52px] mb-7">
        <h2 className="text-xl font-medium text-gray-800 mb-1 flex items-center gap-2">
          <i className="fas fa-microphone text-green-500"></i> Mic Check
        </h2>
        <p className="text-gray-500 mb-4">
          Check your microphone to ensure clarity and proper volume.
        </p>
      </div>
      <select
        className="bg-gray-100 border border-gray-300 rounded-md px-4 py-2 w-full mb-4"
        value={selectedMic || ""}
        onChange={(e) => setSelectedMic(e.target.value)}
      >
        <option value="">Select Microphone</option>
        {microphones.map((mic) => (
          <option key={mic.deviceId} value={mic.deviceId}>
            {mic.label || `Microphone ${mic.deviceId}`}
          </option>
        ))}
      </select>
  
      {/* Always display dots */}
      <div className="flex gap-1">
        {dots.map((dot, i) => (
          <span
            key={i}
            className={`w-3 h-6 rounded-sm ${
              selectedMic && dot ? "bg-green-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
  
};

export default MicCheck;
