import { useEffect, useRef } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { useSttMutation } from "@/api/aiApiSlice";

export const useSTT = () => {
  const [stt, { isSuccess, data, error }] = useSttMutation();

  const recordingProcessed = useRef(false);

  const { startRecording, stopRecording, clearBlobUrl } = useReactMediaRecorder({
    audio: true,
    mediaRecorderOptions: { mimeType: "audio/webm" },
    onStop: async (blobUrl) => {
      if (recordingProcessed.current) return;
      recordingProcessed.current = true;

      try {
        const response = await fetch(blobUrl);
        const audioBlob = await response.blob();

        // Send audioBlob for STT
        stt(audioBlob);
        clearBlobUrl();
      } catch (error) {
        console.error("Error transcribing audio:", error);
      } finally {
        recordingProcessed.current = false;
      }
    },
  });

  useEffect(() => {
   return () => {
     clearBlobUrl();
     stopRecording();
   }
  }, []);
  return {
    startRecording,
    stopRecording,
    isSttSuccess: isSuccess,
    sttResponse: data,
    sttError: error,
  };
};
