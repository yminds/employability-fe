import { useState, useEffect, useRef } from 'react';

const useInterviewSetup = () => {
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isMicSelected, setIsMicSelected] = useState(false);
  const [isMicTested, setMicTested] = useState(false);
  const [isCameraSelected, setIsCameraSelected] = useState(false);
  const [cameraScale, setCameraScale] = useState(1);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && screenStream) {
      videoRef.current.srcObject = screenStream;
    }

    return () => {
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [screenStream]);

  const handleMicQualityChange = (isSelected: boolean, isMicTested: boolean) => {
    setIsMicSelected(isSelected);
    setMicTested(isMicTested);
  };

  const handleCameraChange = (isCameraSelected: boolean) => {
    setIsCameraSelected(isCameraSelected);
  };

  const handleShareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...screenStream.getAudioTracks(),
        ...micStream.getAudioTracks(),
      ]);

      setScreenStream(combinedStream);
      setIsScreenSharing(true);
      localStorage.setItem('isScreenSharing', 'true');

      const recorder = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm; codecs=vp9,opus',
      });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        console.log('Recording stopped');
      };

      recorderRef.current = recorder;
      recorder.start();
    } catch (error) {
      console.error('Error capturing screen and microphone:', error);
    }
  };

  const stopScreenSharing = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
    }

    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
      setIsScreenSharing(false);
      localStorage.setItem('isScreenSharing', 'false');
    }
  };

  const handleScaleChange = (scale: number) => {
    setCameraScale(scale);
  };

  useEffect(() => {
    const savedState = localStorage.getItem('isScreenSharing');
    if (savedState === 'true') {
      handleReinitiateScreenSharing();
    }
  }, []);

  const handleReinitiateScreenSharing = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      setScreenStream(stream);
      setIsScreenSharing(true);
      setMicTested(false)
      localStorage.setItem('isScreenSharing', 'true');
    } catch (error) {
      console.error('Error capturing screen:', error);
    }
  };

  const isProceedButtonEnabled =
    isScreenSharing && isMicSelected && isMicTested && isCameraSelected;

  return {
    isInterviewStarted,
    setIsInterviewStarted,
    isScreenSharing,
    handleShareScreen,
    stopScreenSharing,
    screenStream,
    videoRef,
    handleMicQualityChange,
    handleCameraChange,
    handleScaleChange,
    isMicSelected,
    isMicTested,
    isCameraSelected,
    cameraScale,
    isProceedButtonEnabled,
  };
};

export default useInterviewSetup;
