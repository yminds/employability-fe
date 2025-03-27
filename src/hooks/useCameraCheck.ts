import { useEffect, useRef, useState } from "react";

export const useCameraCheck = () => {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(100); // Zoom percentage
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoStream = useRef<MediaStream | null>(null);

  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((device) => device.kind === "videoinput");
        setCameras(videoDevices);

        // Load the previously selected camera from local storage, if available
        const storedCamera = localStorage.getItem("selectedCamera");
        if (storedCamera) {
          setSelectedCamera(storedCamera);
        }
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };

    getCameras();
  }, []);

  useEffect(() => {
    if (selectedCamera && videoRef.current) {
      const constraints = {
        video: { deviceId: { exact: selectedCamera } },
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoStream.current = stream;
          }
        })
        .catch((error) => {
          console.error("Error accessing selected camera:", error);
        });

      // Cleanup function
      return () => {
        console.log('Cleaning up video stream');
        
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        
        if (videoStream.current) {
          videoStream.current.getTracks().forEach((track) => track.stop());
          videoStream.current = null;
        }
      };
    }
  }, [selectedCamera]);

  const handleCameraChange = (value: string) => {
    setSelectedCamera(value || null);

    if (value) {
      localStorage.setItem("selectedCamera", value);
    } else {
      localStorage.removeItem("selectedCamera");
    }
  };

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  return {
    cameras,
    selectedCamera,
    zoom,
    videoRef,
    handleCameraChange,
    handleZoomChange,
  };
};