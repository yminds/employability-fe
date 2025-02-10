import React from "react";
import Dropdown from "@/components/ui/custom-dropdown";
import { useCameraCheck } from "@/hooks/useCameraCheck";

import camera from '@/assets/screen-setup/camera.svg'
import check_circle from '@/assets/screen-setup/check_circle.svg'
import person from '@/assets/screen-setup/person-skeleton.svg'

interface CameraCheckProps {
  onCameraChange: (isCameraSelected: boolean) => void;
  onScaleChange: (scale: number) => void;
}

const CameraCheck: React.FC<CameraCheckProps> = ({
  onCameraChange,
  onScaleChange,
}) => {
  const {
    cameras,
    selectedCamera,
    zoom,
    videoRef,
    handleCameraChange,
    handleZoomChange,
  } = useCameraCheck();

  const isCameraSelected = selectedCamera !== null;

  // Notify parent component of camera selection status
  React.useEffect(() => {
    onCameraChange(isCameraSelected);
  }, [isCameraSelected, onCameraChange]);

  // Notify parent component of zoom scale
  React.useEffect(() => {
    onScaleChange(zoom / 100);
  }, [zoom, onScaleChange]);

  return (
    <div
      className={`bg-[#FAFAFA] p-6 pe-8 flex h-[75vh] flex-col  justify-around rounded-xl ${
        isCameraSelected
          ? "border-[#10B754] border-2"
          : "border border-[#DBDBDB]"
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="text-[#333] text-xl not-italic font-medium leading-[normal] flex items-center gap-5">
          <span className="flex sm:w-[1vw]h-[2vh] md:w-12 h-12 justify-center items-center bg-white border border-[#ddd] rounded-[42px]">
            <img
              className="sm:w-[1vw] sm:h-[3vh] md:w-6 w-[41px] h-6"
              src={camera}
              alt="Camera Icon"
            />
          </span>
          <span className="text-[#333] text-xl not-italic font-medium leading-[normal]">
            Camera Check
          </span>
        </div>
        {isCameraSelected && (
          <div className="flex items-center gap-2 relative">
            <input
              type="checkbox"
              checked
              readOnly
              id="camera-check"
              className="w-6 h-6 appearance-none"
            />
            <img
              className="h-6 w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm"
              src={check_circle}
              alt="Checked"
            />
          </div>
        )}
      </div>

      <Dropdown
        options={cameras.map((camera) => ({
          label: camera.label || `Camera ${camera.deviceId}`,
          value: camera.deviceId,
        }))}
        value={selectedCamera || ""}
        placeholder="Select Video Source"
        onChange={handleCameraChange}
        width={40}
        dropdownWidth={30}
      />

      <div className="w-full flex h-[40vh] items-center justify-center  border-2 border-[#10B754] rounded-xl relative">
        {selectedCamera ? (
          <>
            <img
              className=" w-[40vh] absolute z-10 left-1/2 transform -translate-x-1/2 bottom-0"
              src={person}
              alt="Head Skeleton"
            />
            <div
              className="relative w-full h-full flex items-center justify-center rounded-[10px]"
              style={{ overflow: "hidden" }}
            >
              <video className="border-0"
                ref={videoRef}
                autoPlay
                muted
                style={{
                  transform: `scale(${zoom / 100})`,
                  transition: "transform 0.3s ease",
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                  
                }}
              />
            </div>
          </>
        ) : (
          <span className="text-gray-400">No Camera Selected</span>
        )}
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <div className="flex justify-between">
          <span className="text-[#4C4C4C] text-sm font-medium">
            Camera Zoom
          </span>
          <span className="text-[#4C4C4C] text-sm font-medium">
            {zoom - 100}%
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="300"
          step="2"
          value={zoom}
          onChange={(e) => handleZoomChange(Number(e.target.value))}
          className="w-full h-1.5 bg-gray-200 rounded appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #4CAF50 ${
              (zoom - 100) / 2
            }%, #ddd ${(zoom - 100) / 2}%)`,
          }}
        />
        {/* Custom Thumb Style */}
        <style>{`
            input[type="range"]::-webkit-slider-thumb {
              background-color: white;
              border: 2px solid #4CAF50; /* Optional: Add green border around the thumb */
              width: 12px; /* Adjust thumb size */
              height: 12px; /* Adjust thumb size */
              border-radius: 50%; /* Make thumb circular */
              cursor: pointer; /* Keep pointer cursor */
              appearance: none; /* Remove default appearance */
            }

            input[type="range"]::-moz-range-thumb {
              background-color: white; 
              border: 2px solid #4CAF50; /* Optional: Add green border around the thumb */
              width: 20px;
              height: 20px;
              border-radius: 50%;
              cursor: pointer;
            }
          `}</style>
      </div>
    </div>
  );
};

export default CameraCheck;
