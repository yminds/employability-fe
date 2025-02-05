import React from "react";
import Webcam from "react-webcam";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const WebCam: React.FC = () => {
  const userName = useSelector((state: RootState) => state.auth.user?.name);
  return (
    <div className="relative w-full max-w-full">
      <Webcam
        audio={false}
        height={900}
        screenshotFormat="image/jpeg"
        width={1280}
        videoConstraints={{
          width: 1280,
          height: 850,
          facingMode: "user",
        }}
        className="w-full h-full rounded-xl object-cover transform -scale-x-100"
      ></Webcam>
      <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-xl">
        <p>{userName}</p>
      </div>
    </div>
  );
};

export default WebCam;