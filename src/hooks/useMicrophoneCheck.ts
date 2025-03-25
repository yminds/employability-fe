import { useEffect, useRef, useState } from "react";

export const useMicrophoneCheck = (onMicQualityChange: (isMicSelected: boolean, isMicTested: boolean) => void) => {
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [selectedMic, setSelectedMic] = useState<string | null>(null);
  const [dots, setDots] = useState<boolean[]>(Array(16).fill(false));
  const [soundQuality, setSoundQuality] = useState<string>("Low");
  const [isMicSelected, setIsMicSelected] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [qualityTested, setQualityTested] = useState<boolean>(true);
  const [isMicTested, setIsMicTested] = useState<boolean>(true);

  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const getMicrophones = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const micDevices = devices.filter((device) => device.kind === "audioinput");
      setMicrophones(micDevices);

      const storedMic = localStorage.getItem("selectedMic");
      const storedMicSelected = localStorage.getItem("isMicSelected") === "true";
      const isMicTested = localStorage.getItem("isTested") === "true";

      if (storedMic) setSelectedMic(storedMic);
      setIsMicSelected(storedMicSelected);
      onMicQualityChange(storedMicSelected, isMicTested);
      setIsMicTested(isMicTested);
    };

    getMicrophones();
  }, []);

  useEffect(() => {
    if (isMicSelected && qualityTested) {
      onMicQualityChange(isMicSelected, qualityTested);
    }
    else if (isMicSelected && isMicTested) {
      onMicQualityChange(isMicSelected, isMicTested);
    }
  }, [isMicSelected, qualityTested, isMicTested]);

  useEffect(() => {
    if (selectedMic && isSpeaking) {
      const startMic = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: { deviceId: { exact: selectedMic } },
          });

          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
          }
          streamRef.current = stream;

          const audioContext = new (window.AudioContext || window.AudioContext)();
          audioContextRef.current = audioContext;

          const analyser = audioContext.createAnalyser();
          analyserRef.current = analyser;

          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);

          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          const update = () => {
            analyser.getByteFrequencyData(dataArray);
            const volume = dataArray.reduce((a, b) => a + b, 0) / bufferLength;

            // If the mic is not selected or quality is tested, set all dots to gray
            if (!isMicSelected || qualityTested || !isMicTested) {
              setDots(Array(16).fill(false));
            } else {
              setDots(Array(16).fill(false).map((_, i) => volume > i * 10));
            }

            const lowFreq = dataArray.slice(0, 20);
            const midFreq = dataArray.slice(20, 50);
            const highFreq = dataArray.slice(50, 150);

            const avgLow = lowFreq.reduce((a, b) => a + b, 0) / lowFreq.length;
            const avgMid = midFreq.reduce((a, b) => a + b, 0) / midFreq.length;
            const avgHigh = highFreq.reduce((a, b) => a + b, 0) / highFreq.length;

            if (avgMid > 100 && avgHigh > 80) {
              setSoundQuality("High");
              setQualityTested(true);
              setIsSpeaking(false);
              setIsMicTested(true);
              localStorage.setItem("isTested", "true");
            } else if (avgMid > 20 && avgLow < 10) {
              setSoundQuality("Medium");
              setQualityTested(true);
              setIsSpeaking(false);
              setIsMicTested(true);
              localStorage.setItem("isTested", "true");
            } else {
              setSoundQuality("Low");
            }

            if (isSpeaking && !qualityTested && !isMicTested) requestAnimationFrame(update);
          };

          update();
        } catch (err) {
          console.error("Error accessing microphone:", err);
        }
      };

      startMic();
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [selectedMic, isSpeaking, isMicSelected, qualityTested]);

  const handleMicChange = (micId: string) => {
    setIsSpeaking(false)
    setQualityTested(false);
    setIsMicTested(false);
    setSelectedMic(micId || null);
    if (micId) {
      localStorage.setItem("selectedMic", micId);

      setIsMicSelected(true);
      localStorage.setItem("isMicSelected", "true");
    } else {
      localStorage.removeItem("selectedMic");
      setIsMicSelected(false);
      localStorage.setItem("isMicSelected", "false");
    }
    onMicQualityChange(isMicSelected, false);
  };

  const handleSpeakClick = () => {
    setIsSpeaking(true);
  };

  return {
    microphones,
    selectedMic,
    dots,
    soundQuality,
    isMicSelected,
    isSpeaking,
    qualityTested,
    isMicTested,
    handleMicChange,
    handleSpeakClick,
  };
};
