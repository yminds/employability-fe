import React, { useContext, useCallback } from "react";
import Webcam from "react-webcam";
import { WebCamContext } from "@/pages/Interview";


interface WebCamContextType {
  webcamRef: React.RefObject<Webcam>;
  mediaRecorderRef: React.RefObject<MediaRecorder | null>;
  recording: boolean;
  setRecording: React.Dispatch<React.SetStateAction<boolean>>;
  recordedChunks: Blob[];
  setRecordedChunks: React.Dispatch<React.SetStateAction<Blob[]>>;
}

function WebContainer() {
  const {
    webcamRef,
    mediaRecorderRef,
    recording,
    setRecording,
    recordedChunks,
    setRecordedChunks,
  } = useContext<WebCamContextType>(WebCamContext);

  const handleDataAvailable = useCallback(
    ({ data }: { data: Blob }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const startRecording = useCallback(() => {
    if (!webcamRef.current?.stream) {
      alert("Webcam not ready!");
      return;
    }

    setRecording(true);
    // Capture both video and audio streams
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm;codecs=vp8,opus", // Ensures audio and video codecs are supported
    });

    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setRecording, mediaRecorderRef, handleDataAvailable]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  }, [mediaRecorderRef, setRecording]);

  const downloadVideo = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "webcam-video-with-audio.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks, setRecordedChunks]);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Webcam Recorder with Audio</h1>
      <Webcam
        ref={webcamRef}
        audio
        videoConstraints={videoConstraints}
        style={{
          width: "100%",
          maxWidth: "640px",
          border: "2px solid black",
          borderRadius: "8px",
        }}
      />
      <div style={{ marginTop: "20px" }}>
        <button onClick={startRecording} disabled={recording}>
          Start Recording
        </button>
        <button onClick={stopRecording} disabled={!recording}>
          Stop Recording
        </button>
        <button onClick={downloadVideo} disabled={!recordedChunks.length}>
          Download Video
        </button>
      </div>
      <p>{recording ? "Recording in progress..." : "Not recording"}</p>
    </div>
  );
}

export default WebContainer;
