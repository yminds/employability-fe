// components/ScreenSharing.tsx
import React, { useState, useEffect, useRef } from 'react';

const ScreenSharing: React.FC = () => {
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleShareScreen = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      setScreenStream(stream);
      setIsScreenSharing(true);
    } catch (error) {
      console.error('Error capturing screen:', error);
    }
  };

  const stopScreenSharing = () => {
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
      setScreenStream(null);
      setIsScreenSharing(false);
    }
  };

  useEffect(() => {
    if (videoRef.current && screenStream) {
      videoRef.current.srcObject = screenStream;
    }

    return () => {
      stopScreenSharing();
    };
  }, [screenStream]);

  return (
    <div className="bg-[#FAFAFA] border  p-6 rounded-md">
        <div>
            
        </div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Screen Sharing</h2>
        <i className="fas fa-desktop text-green-500"></i>
      </div>
      <p className="text-gray-500 mb-4">
        Share your screen if required.
      </p>
      {isScreenSharing ? (
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md"
          onClick={stopScreenSharing}
        >
          Stop Sharing
        </button>
      ) : (
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md"
          onClick={handleShareScreen}
        >
          Share Screen
        </button>
      )}
      <div
        className="w-full h-32 bg-gray-200 mt-4 rounded-md flex items-center justify-center"
      >
        {isScreenSharing && screenStream && (
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            autoPlay
            playsInline
            muted
          />
        )}
      </div>
    </div>
  );
};

export default ScreenSharing;