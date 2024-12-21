import React, { RefObject } from "react";

// Images
import check_circle from '@/assets/screen-setup/check_circle.svg'
import screenshare from '@/assets/screen-setup/screen_share.svg'

interface ScreenSharingComponentProps {
  isScreenSharing: boolean;
  screenStream: MediaStream | null;
  stopScreenSharing: () => void;
  handleShareScreen: () => void;
  videoRef: RefObject<HTMLVideoElement>; // Prop to pass the videoRef
}

const ScreenSharingComponent: React.FC<ScreenSharingComponentProps> = ({
  isScreenSharing,
  screenStream,
  stopScreenSharing,
  handleShareScreen,
  videoRef,
}) => {
  return (
    <div
      className={`bg-[#FAFAFA] p-[24px] pe-8 flex flex-col gap-6 rounded-xl h-[310px] ${
        isScreenSharing
          ? " border-[#10B754] border-2"
          : "border border-[#DBDBDB]"
      }`}
    >
      <div className="flex justify-between items-center">
        <div className="text-[#333] text-xl not-italic font-medium leading-[normal] flex items-center gap-5">
          <span className="flex w-10 h-10 p-3 justify-center items-center gap-2 bg-white border border-[#ddd] rounded-[42px]">
            <img
              src={screenshare}
              alt="screenShare"
            />
          </span>
          Screen Sharing
        </div>

        {/* Display checkbox only if screen sharing is active */}
        {isScreenSharing && (
          <div className="flex items-center gap-2 relative">
            <input
              type="checkbox"
              checked
              readOnly
              id="screenShare-check"
              className="w-6 h-6 appearance-none"
            />
            <img
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm"
              src={check_circle}
              alt=""
            />
          </div>
        )}
      </div>

      {/* Button to start or stop screen sharing */}
      {isScreenSharing ? (
        <button
          className="text-red-500 text-center text-[0.86rem] not-italic font-normal font-ubuntu leading-[1.24rem] flex py-2 px-3 justify-center items-center rounded-[5px] border border-1 border-red-500 w-32"
          onClick={stopScreenSharing}
        >
          Stop Sharing
        </button>
      ) : (
        <button
          className="text-[#10B754] text-center text-[0.86rem] not-italic font-normal font-ubuntu leading-[1.24rem] flex py-2 px-3 justify-center items-center rounded-[5px] border border-1 border-[#10B754] w-32"
          onClick={handleShareScreen}
        >
          Share Screen
        </button>
      )}

      {/* Video container */}
      <div className="w-full h-[140px] bg-[#E8FAF1] flex p-1 justify-center items-center gap-[0.16rem] rounded-md">
        {isScreenSharing && screenStream && (
          <video
            ref={videoRef} // Using the videoRef prop
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

export default ScreenSharingComponent;
