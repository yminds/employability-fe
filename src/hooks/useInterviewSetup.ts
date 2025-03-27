import { useUpdateReportRecordingMutation } from "@/api/reportApiSlice";
import { setRecordingReference } from "@/store/slices/recorderSlice";
import { RootState } from "@/store/store";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
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

    return data.data.url;
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
    const presignedUrl = await getPresignedUrl(interviewId, chunkNumber, folder);

    console.log("presignedUrl", presignedUrl);

    if (!presignedUrl) {
      throw new Error("Failed to get pre-signed URL.");
    }

    // Upload the file to S3 using the pre-signed URL
    const uploadResponse = await fetch(presignedUrl, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
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
  const globalReference = useRef<any>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const chunkNumberRef = useRef<number>(1);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const dispatch = useDispatch();

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

  const isStoppingRef = useRef(false);

  const handleShareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      // Check if system audio is enabled (i.e. if there are audio tracks)
      if (screenStream.getAudioTracks().length === 0) {
        screenStream.getTracks().forEach((track) => track.stop());
        alert("Please enable system audio when sharing your screen (share the entire window with audio enabled).");
        return;
      }

      if (screenStream.getAudioTracks().length === 0) {
        screenStream.getTracks().forEach((track) => track.stop());
        alert("Please enable system audio when sharing your screen (share the entire window with audio enabled).");
        return;
      }

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

      const systemAudioSource = audioContext.createMediaStreamSource(new MediaStream(screenStream.getAudioTracks()));
      systemAudioSource.connect(destination);

      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...destination.stream.getAudioTracks(),
      ]);
      // setGlobalReference({
      //   screenStream,
      //   micStream,
      //   audioContext,
      //   destination,
      //   micSource,
      //   systemAudioSource,
      // });
      globalReference.current = {
        screenStream,
        micStream,
        audioContext,
        destination,
        micSource,
        systemAudioSource,
      };
      dispatch(
        setRecordingReference({ screenStream, micStream, audioContext, destination, micSource, systemAudioSource })
      );

      setScreenStream(combinedStream);
      setIsScreenSharing(true);

      const startRecording = () => {
        const recorder = new MediaRecorder(combinedStream, {
          mimeType: "video/webm; codecs=vp8,opus",
        });

        recorder.ondataavailable = async (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);

            // If we're stopping or this is a regular chunk, upload it
            if (isStoppingRef.current || recordedChunksRef.current.length >= 1) {
              const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
              await uploadFileToS3(updateReportRecording, blob, interviewId, chunkNumberRef.current);

              chunkNumberRef.current++;
              recordedChunksRef.current = [];
            }
          }
        };

        recorder.onstop = () => {
          if (!isStoppingRef.current) {
            setTimeout(startRecording, 500);
          }
        };

        recorder.start();
        recorderRef.current = recorder;

        // Stop recording after 3 minutes
        setTimeout(() => {
          if (recorder && recorder.state !== "inactive") {
            recorder.stop();
          }
        }, 30000);
      };

      startRecording();
    } catch (error) {
      console.error("Error capturing screen and microphone:", error);
    }
  };

  const stopScreenSharing = async () => {
    try {
      isStoppingRef.current = true;

      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        recorderRef.current.stop();
      }

      await new Promise((resolve) => setTimeout(resolve, 200));

      recordedChunksRef.current = [];
      console.log("screenStream", screenStream);

      if (screenStream) {
        console.log("oh we got some stream");

        screenStream.getTracks().forEach((track) => track.stop());
        setScreenStream(null);
      } else {
        console.log("oh we got no stream");
      }

      // reset the all things in glbal reference
      if (globalReference.current) {
        console.log("entred to global reference");
        
        globalReference.current.audioContext.close();
        globalReference.current.micStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        globalReference.current.screenStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        globalReference.current.destination.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
        globalReference.current.micSource.disconnect();
        globalReference.current.systemAudioSource.disconnect();
        globalReference.current = null;
        recorderRef.current = null;
      }

      setIsScreenSharing(false);
      isStoppingRef.current = false;
      if (videoRef.current) {
        console.log("videoRef", videoRef.current);
        
        videoRef.current.srcObject = null;
      }
      if (screenStreamRef.current) {
        console.log("screenStreamRef", screenStreamRef.current);
        
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      recorderRef.current = null;
    } catch (error) {
      console.error("Error stopping screen sharing:", error);
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

  useEffect(() => {
    // check is there any instance of recording availabele
    if (isInterviewStarted) {
      const interval = setInterval(() => {
        if (recorderRef.current && recorderRef.current.state !== "inactive") {
          recorderRef.current.stop();
        }
      }, 30000);
      intervalRef.current = interval;
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      stopScreenSharing();
      console.log('-------------------------------------------------------');
      console.log('cleaning the recorings');
      console.log('-------------------------------------------------------');
      
    };
  }, []);
  const handleReinitiateScreenSharing = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      screenStreamRef.current = stream;
      setScreenStream(stream);
      setIsScreenSharing(true);
      setMicTested(false);
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
