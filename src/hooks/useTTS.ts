import { useState, useRef, useEffect } from 'react';
import { useTtsMutation } from "@/api/aiApiSlice";

interface UseTTSOptions {
  onPlaybackComplete?: () => void;
}

export const useTTS = (options: UseTTSOptions = {}) => {
  const [tts] = useTtsMutation();
  const [frequencyData, setFrequencyData] = useState<number>(0);
  const frequencyDataRef = useRef<number>(0);
  
  // Sentence management refs
  const bufferRef = useRef<string>("");
  const sentenceIndexRef = useRef<number>(0);
  const nextSentenceToPlayRef = useRef<number>(0);
  const audioBufferMap = useRef<Map<number, Blob>>(new Map());
  const activeAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Function to play audio and handle frequency analysis
  const playAudio = async (audioBlob: Blob): Promise<void> => {
    return new Promise((resolve, reject) => {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(audioUrl);
      audioElement.crossOrigin = "anonymous";
      activeAudioElementRef.current = audioElement;

      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;
      const source = audioContext.createMediaElementSource(audioElement);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      source.connect(analyser);
      analyser.connect(audioContext.destination);

      const calculateFrequency = () => {
        analyser.getByteFrequencyData(dataArray);
        const avgFrequency =
          dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        const normalizedFrequency = avgFrequency / 255;

        frequencyDataRef.current = normalizedFrequency;
        if (frequencyData !== normalizedFrequency) {
          setFrequencyData(normalizedFrequency);
        }
      };

      audioElement.addEventListener("timeupdate", calculateFrequency);

      audioElement.play();

      audioElement.onended = () => {
        audioElement.removeEventListener("timeupdate", calculateFrequency);
        
        if (nextSentenceToPlayRef.current + 1 === sentenceIndexRef.current) {
          options.onPlaybackComplete?.();
        }

        frequencyDataRef.current = 0;
        setFrequencyData(0);
        resolve();
      };

      audioElement.onerror = (error) => {
        audioElement.removeEventListener("timeupdate", calculateFrequency);
        reject(error);
      };

      return () => {
        audioElement.removeEventListener("timeupdate", calculateFrequency);
        audioElement.pause();
        audioElement.src = "";
        if (audioContext) {
          audioContext.close();
        }
      };
    });
  };

  // Function to attempt playback of the next sentence
  const attemptPlayback = () => {
    const currentPlayIndex = nextSentenceToPlayRef.current;
    const audioBlob = audioBufferMap.current.get(currentPlayIndex);

    if (audioBlob) {
      audioBufferMap.current.delete(currentPlayIndex);

      playAudio(audioBlob)
        .then(() => {
          nextSentenceToPlayRef.current += 1;
          attemptPlayback();
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
          nextSentenceToPlayRef.current += 1;
          attemptPlayback();
        });
    }
  };

  // Handle incoming data by accumulating and parsing sentences
  const handleIncomingData = (data: string, onSentenceProcessed?: (sentence: string) => void) => {
    bufferRef.current += data;

    const sentenceRegex = /[^.!?]+[.!?]/g;
    const sentences = bufferRef.current.match(sentenceRegex) || [];

    sentences.forEach((sentence) => {
      const trimmedSentence = sentence.trim();
      if (trimmedSentence) {
        onSentenceProcessed?.(trimmedSentence);

        const currentIndex = sentenceIndexRef.current;
        sentenceIndexRef.current += 1;

        tts({ text: trimmedSentence })
          .unwrap()
          .then((audioBlob) => {
            audioBufferMap.current.set(currentIndex, audioBlob);
            attemptPlayback();
          })
          .catch((error) => {
            console.error("Error fetching TTS audio:", error);
          });
      }
    });

    bufferRef.current = bufferRef.current.replace(sentenceRegex, "");
  };

  // Reset all state and refs
  const reset = () => {
    bufferRef.current = "";
    sentenceIndexRef.current = 0;
    nextSentenceToPlayRef.current = 0;
    audioBufferMap.current.clear();
    frequencyDataRef.current = 0;
    setFrequencyData(0);
    if (activeAudioElementRef.current) {
      activeAudioElementRef.current.pause();
      activeAudioElementRef.current.src = '';
      activeAudioElementRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      reset();
    };
  }, []);

  return {
    frequencyData,
    handleIncomingData,
    reset
  };
};