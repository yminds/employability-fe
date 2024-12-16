import React, { useEffect, useState, useRef } from "react";

const CameraCheck: React.FC = () => {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]); // List of cameras
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null); // Default to null
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Fetch available cameras on component mount
  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((device) => device.kind === "videoinput");
        setCameras(videoDevices); // Update the list of cameras

        // Do not pre-select any camera; keep dropdown default
        if (!selectedCamera) {
          setSelectedCamera(null);
        }
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };

    getCameras();
  }, [selectedCamera]);

  // Start video stream when a camera is selected
  useEffect(() => {
    if (selectedCamera && videoRef.current) {
      const constraints = { video: { deviceId: { exact: selectedCamera } } };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing selected camera:", err);
        });
    }
  }, [selectedCamera]);

  // Handle dropdown selection changes
  const handleCameraChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedCamera(value || null); // Set camera ID or reset to null
  };

  return (
    <div className="bg-[#FAFAFA] p-6 border rounded-lg flex flex-col justify-around">
      <div className="w[42px] h-[42px]">
      <img src="src\assets\images\video.png" alt="video img" />
      </div>
      <div className="w-[244px] h-[52px] mb-7">
      <h2 className="text-xl font-medium text-gray-800 mb-1 flex items-center">
        <i className="fas fa-video text-green-500"></i> Camera Check
      </h2>
      <p className="text-gray-500 ">Make sure your camera is working and positioned correctly.</p>
      </div>
      <select
        className="bg-gray-100 border border-gray-300 rounded-md px-4 py-2 w-full mb-4"
        value={selectedCamera || ""} // Default to an empty string if null
        onChange={handleCameraChange}
      >
        <option value="">Select Video Source</option> {/* Default option */}
        {cameras.map((camera) => (
          <option key={camera.deviceId} value={camera.deviceId}>
            {camera.label || `Camera ${camera.deviceId}`}
          </option>
        ))}
      </select>
      <div className="w-full h-[160px] bg-gray-200 rounded-lg flex items-center justify-center">
        {selectedCamera ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <span className="text-gray-400">No Camera Selected</span>
        )}
      </div>
    </div>
  );
};

export default CameraCheck;
