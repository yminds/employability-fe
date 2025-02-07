import { RootState } from "@/store/store";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

// const uploadChunkToS3 = async (chunk: Blob, interviewId: string, chunkNumber: number): Promise<void> => {
//   console.log(`Uploading chunk ${chunkNumber}, size: ${chunk.size} bytes`);

//   const formData = new FormData();
//   const fileName = `interview_record/interview_chunk_${interviewId}_${chunkNumber}.webm`;

//   formData.append("files", chunk);
//   formData.append("key", fileName);
//   formData.append("interviewId", interviewId);
//   formData.append("chunkNumber", chunkNumber.toString());

//   try {
//     const s3Response = await fetch(`${process.env.VITE_API_BASE_URL}/api/v1/s3/upload-video`, {
//       method: "POST",
//       body: formData,
//     });

//     const responseData = await s3Response.json();
//     if (!s3Response.ok) {
//       throw new Error(`Upload failed: ${responseData.message || "Unknown error"}`);
//     }

//     console.log(`Chunk ${chunkNumber} uploaded successfully`);
//   } catch (error) {
//     console.error(`Upload error for chunk ${chunkNumber}:`, error);
//   }
// };


const getPresignedUrl = async ( interviewId:string, chunkNumber:number,folder = "default") => {
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
    return data.url;  // Assuming backend returns { url: "presigned-url" }
  } catch (error) {
    console.error("Error getting presigned URL:", error);
    return null;
  }
};


const uploadFileToS3 = async (file:Blob, interviewId:string, chunkNumber:number,folder = "interviews") => {
  try {
    // Step 1: Get the pre-signed URL
    const presignedUrl = await getPresignedUrl( interviewId,chunkNumber,folder);

    if (!presignedUrl) {
      throw new Error("Failed to get pre-signed URL.");
    }

    // Step 2: Upload the file to S3 using the pre-signed URL
    const uploadResponse = await fetch(presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,  // Ensure correct MIME type
      },
      body: file,  // Actual file data
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload file to S3.");
    }

    console.log("File uploaded successfully!");

    // Step 3: Optionally return the S3 file URL (without query params)
    const fileUrl = presignedUrl.split("?")[0];
    return fileUrl;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    return null;
  }
};

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
  const { id } = useParams<{ id: string }>();
  const interviewId: string = id || "";
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const lastChunkRef = useRef<Promise<void> | null>(null);
  const [allBlobFiles, setAllBlobFiles] = useState<Blob[]>([]);

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
      localStorage.setItem("isScreenSharing", "true");
      // let mediaHeaderRequested: boolean = false;
      // let headerBlob: Blob | null = null;
      // let audioChunkInterval: any = null;

      // if (audioChunkInterval) clearInterval(audioChunkInterval);
      // if (intervalRef.current) clearInterval(intervalRef.current);
      // intervalRef.current = setInterval(() => {
      //   if (recorder) {
      //     recorder.requestData();
      //   }
      // }, 10000);
      // const recorder = new MediaRecorder(combinedStream, {
      //   mimeType: "video/webm;", // Simplified MIME type

      // });
      // recorder.start();
      let chunkNumber = 1;
      const startRecording = () => {
        const recorder = new MediaRecorder(combinedStream, {
          mimeType: "video/webm; codecs=vp8,opus", // Ensure proper codecs
        });

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
                  uploadFileToS3(event.data, interviewId, chunkNumber);
                  chunkNumber++;  // Upload the recorded chunk
          }
        };

        recorder.onstop = () => {
          // Automatically restart the recording after stopping
          setTimeout(startRecording, 1000); // 1-second gap between chunks
        };

        recorder.start();

        // Stop recording after 3 minutes (180000ms)
        setTimeout(() => {
          if (recorder && recorder.state !== "inactive") {
            recorder.stop();
          }
        }, 10000);
  
      };

      // Start the first recording
      startRecording();

      // recorder.onstart = async () => {
      //   if (!recorder) return;
      //   recorder.requestData();
      // };

      // let chunkNumber = 1;

      // recorder.ondataavailable = async (event) => {
      //   if (event.data.size > 0) {
      //     if (!mediaHeaderRequested) {
      //       headerBlob = event.data; // Store the first chunk as header
      //       mediaHeaderRequested = true;
      //       return;
      //     }

      //     // Ensure each chunk starts with the WebM header
      //     if (headerBlob) {
      //       const mergedChunk = new Blob([headerBlob, event.data], { type: "video/webm" });
      //       setAllBlobFiles((prev) => [...prev, mergedChunk]);
      //       uploadChunkToS3(mergedChunk, interviewId, chunkNumber);
      //       chunkNumber++;

      //     }
      //   }
      // };
      // audioChunkInterval = setInterval(() => {
      //   if (recorder) {
      //     recorder.requestData();
      //   }
      // }, 11000);
      // recorderRef.current = recorder;
    } catch (error) {
      console.error("Error capturing screen and microphone:", error);
    }
  };

  const stopScreenSharing = async () => {
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
