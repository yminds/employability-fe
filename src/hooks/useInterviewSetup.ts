import { useUpdateReportRecordingMutation } from "@/api/reportApiSlice";
import { RootState } from "@/store/store";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const getPresignedUrl = async (interviewId: string, chunkNumber: number, folder = "default") => {
  const fileName = `interview_record/interview_chunk_${interviewId}_${chunkNumber}.webm`;
  try {
    const response = await fetch(`${process.env.VITE_API_BASE_URL}/api/v1/s3/upload-video`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName,
        interviewId,
        folder,
      }),
    });

    const data = await response.json();
    console.log("data", data);

    return data.data.url; // Assuming backend returns { url: "presigned-url" }
  } catch (error) {
    console.error("Error getting presigned URL:", error);
    return null;
  }
};

const uploadFileToS3 = async (
  updateReportRecording: any,
  file: Blob,
  interviewId: string,
  chunkNumber: number,
  folder = "interviews"
) => {
  try {
    // Step 1: Get the pre-signed URL
    const presignedUrl = await getPresignedUrl(interviewId, chunkNumber, folder);

    console.log("presignedUrl", presignedUrl);

    if (!presignedUrl) {
      throw new Error("Failed to get pre-signed URL.");
    }

    // Step 2: Upload the file to S3 using the pre-signed URL
    const uploadResponse = await fetch(presignedUrl, {
      method: "PUT",
      mode: 'cors',
      headers: {
        "Content-Type": file.type, // Ensure correct MIME type
      },
      body: file, // Actual file data
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload file to S3.");
    }

    const fileUrl = presignedUrl.split("?")[0];
    console.log("File uploaded successfully! URL:", fileUrl);
    console.log(fileUrl);

    if (fileUrl) {
      const respone = await updateReportRecording({ interview_id: interviewId, s3RecordingUrl: fileUrl }).unwrap();
      console.log("respone", respone);
    }

    return fileUrl;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    return null;
  }
};

const useInterviewSetup = () => {
  const [updateReportRecording] = useUpdateReportRecordingMutation();
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
  const { id } = useParams<{ id: string }>();
  const interviewId: string = id || "";
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const lastChunkRef = useRef<Promise<void> | null>(null);
  const [allBlobFiles, setAllBlobFiles] = useState<Blob[]>([]);
  const [chunkNumber, setChunkNumber] = useState(1);

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
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
  
      
      const audioContext = new AudioContext();
      const destination = audioContext.createMediaStreamDestination();
  
     
      const micSource = audioContext.createMediaStreamSource(micStream);
      micSource.connect(destination);
  
    
      const systemAudioSource = audioContext.createMediaStreamSource(
        new MediaStream(screenStream.getAudioTracks())
      );
      systemAudioSource.connect(destination);
  
     
      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(), 
        ...destination.stream.getAudioTracks(), 
      ]);
  

      setScreenStream(combinedStream);
      setIsScreenSharing(true);
      localStorage.setItem("isScreenSharing", "true");

      const startRecording = () => {
        const recorder = new MediaRecorder(combinedStream, {
          mimeType: "video/webm; codecs=vp8,opus",
        });

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            uploadFileToS3(updateReportRecording, event.data, interviewId, chunkNumber);
            setChunkNumber(chunkNumber + 1);
          }
        };

        recorder.onstop = () => {
          // restart recoding after 1 second
          setTimeout(startRecording, 1000);
        };

        recorder.start();

        recorderRef.current = recorder;
        // Stop recording after 3 minutes (180000ms)
        setTimeout(() => {
          if (recorder && recorder.state !== "inactive") {
            recorder.stop();
          }
        }, 30000);
      };

      // Start the first recording
      startRecording();
    } catch (error) {
      console.error("Error capturing screen and microphone:", error);
    }
  };

  const stopScreenSharing = async () => {
    // we should upload the last chunk to S3 here
    if (recorderRef.current) {
      recorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          lastChunkRef.current = uploadFileToS3(updateReportRecording, event.data, interviewId, chunkNumber);
          setChunkNumber(chunkNumber + 1);
        }
      };
    }
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = null;
    }
    if (lastChunkRef.current) {
      console.log("Waiting for the last chunk to finish uploading...");
      await lastChunkRef.current;
    }

    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
      setIsScreenSharing(false);
      localStorage.setItem("isScreenSharing", "false");
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Clear all recorded chunks
    recordedChunks.current = [];
    setAllBlobFiles([]);
  };

  const handleScaleChange = (scale: number) => {
    setCameraScale(scale);
  };

  useEffect(() => {
    const savedState = localStorage.getItem("isScreenSharing");
    if (savedState === "true") {
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
      setMicTested(false);
      localStorage.setItem("isScreenSharing", "true");
    } catch (error) {
      console.error("Error capturing screen:", error);
    }
  };

  const isProceedButtonEnabled = isScreenSharing && isMicSelected && isMicTested && isCameraSelected;

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
