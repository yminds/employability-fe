import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import useInterviewSetup from "@/hooks/useInterviewSetup";
import Interview from "@/components/interview/Interview";
import CheckSetup from "../components/setup/CheckSetup";
import { useGetUserFundamentalsBySkillIdMutation } from "@/api/fundementalSlice";
import toggleBrowserFullscreen from "@/components/skills/fullscreen";
import MultiScreenDetector from "@/components/interview/multiScreendetector";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const InterviewSetupNew: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const userExperience = useSelector((state: RootState) => state.auth.user?.experience_level);
  const [fetchFundamental] = useGetUserFundamentalsBySkillIdMutation();
  const [fundamentals, setFundamentals] = useState<any[]>([]);
  const [screenCount, setScreenCount] = useState<number>(1);
  
  // State to control showing the permission note modal
  const [showPermissionNote, setShowPermissionNote] = useState(false);
  // New state to track if the user has the required camera and mic permissions
  const [hasPermissions, setHasPermissions] = useState(false);

  const { title, skillPoolId, level, type, jobDescription ,isResume} = location.state || {};
  console.log("jobDescription", jobDescription);
  const {
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
    cameraScale,
    isProceedButtonEnabled,
  } = useInterviewSetup();

  // Function to request camera and microphone permissions.
  const requestPermissions = async () => {
    try {
      // Check if the browser supports mediaDevices.getUserMedia
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Request both video and audio permissions.
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        console.log("Media stream:", stream);
        setHasPermissions(true);
        setShowPermissionNote(false);

        // Reload the page automatically after permissions are granted.
        // Some browsers support window.location.reload(true) (force reload)
        // but since true is deprecated, we use a fallback to ensure compatibility.
        if (typeof window.location.reload === "function") {
          // Try to force a reload from the server, if supported.
          try {
            window.location.reload(); // Most modern browsers
          } catch (e) {
            // Fallback if an error occurs (shouldn't normally happen)
            window.location.href = window.location.href;
          }
        } else {
          // Fallback for very old browsers
          window.location.href = window.location.href;
        }
      } else {
        throw new Error("getUserMedia not supported in this browser.");
      }
    } catch (error) {
      console.error("Error requesting media devices:", error);
      setHasPermissions(false);
      setShowPermissionNote(true);
    }
  };

  // Check camera and microphone permissions by verifying if device labels are available.
  // Device labels are only populated when permission has been granted.
  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const hasCamera = devices.some(
          (device) => device.kind === "videoinput" && device.label !== ""
        );
        const hasMic = devices.some(
          (device) => device.kind === "audioinput" && device.label !== ""
        );
        if (hasCamera && hasMic) {
          setHasPermissions(true);
        } else {
          setHasPermissions(false);
          setShowPermissionNote(true);
        }
      })
      .catch((err) => {
        console.error("Error checking devices:", err);
        setHasPermissions(false);
        setShowPermissionNote(true);
      });
  }, []);

  // Fetch the fundamentals for the interview
  useEffect(() => {
    const sync = async () => {
      if (type === 'Skill'){
        try {
          const fundamentalsResponse = await fetchFundamental({
           
            skill_pool_id: skillPoolId,
            level,
          }).unwrap();
          console.log("fundemental", fundamentalsResponse);
          
          setFundamentals(fundamentalsResponse.data[0]?.concepts || []);
        } catch (error) {
          console.error("Error fetching fundamentals:", error);
        }
      }
    };
    sync();
  }, [fetchFundamental, skillPoolId, level, type]);

  // Only show the Interview component if the user has required permissions,
  // the fundamentals have loaded, and the interview is started.
  const canShowInterview = isInterviewStarted && (fundamentals.length > 0 || type != 'Skill') && hasPermissions;

  return (
    <>
      {/* Permission Note Modal */}
      {showPermissionNote && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 transition-colors"
              onClick={() => setShowPermissionNote(false)}
              aria-label="Close"
            >
              <svg
                className="h-6 w-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 18L18 6M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-6 text-h2">Permissions Required</h2>
            <div className="text-body space-y-3 mb-4">
              <p>
                This interview requires access to your camera and microphone.
              </p>
              <p>
                Please click the button below to grant access. If you've previously denied permissions, you may need to adjust your browser settings.
              </p>
              <p>
                After providing the permissions, Reload the window to apply changed.
              </p>
            </div>
            <button
              className="text-button bg-button text-white px-4 py-2 rounded"
              onClick={requestPermissions}
            >
              Request Permissions
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!canShowInterview ? (
        <div className="flex items-center h-screen w-[70%] mx-auto sm:w-[95%]">
          <main className="py-4 w-full">
            <div className="flex flex-row items-center justify-between mb-6">
              <div>
                <div className="text-black text-[32px] font-bold font-ubuntu">
                  Check Your Setup
                </div>
                <p className="text-base font-normal text-[#00000099]">
                  Before you proceed to the interview, make sure your setup is working properly.
                </p>
              </div>

              {screenCount != 1 && (
              <MultiScreenDetector onScreenCountChange={setScreenCount} />
              )}
              {screenCount === 1 && (
              <button
                className={`bg-button ${isProceedButtonEnabled ? "hover:bg-[#062549]" : "cursor-not-allowed opacity-50"} text-white rounded-[4px] font-normal text-[14px] w-72 py-2 leading-5`}
                onClick={() => {
                  setIsInterviewStarted(true);
                  toggleBrowserFullscreen();
                }}
                disabled={!isProceedButtonEnabled}
              >
                Proceed to Interview
              </button>)
              }
            </div>
            <CheckSetup
              isScreenSharing={isScreenSharing}
              screenStream={screenStream}
              handleShareScreen={handleShareScreen}
              stopScreenSharing={stopScreenSharing}
              handleMicQualityChange={handleMicQualityChange}
              handleCameraChange={handleCameraChange}
              handleScaleChange={handleScaleChange}
              videoRef={videoRef}
            />
          </main>
        </div>
      ) : (
        <Interview
          cameraScale={100}
          id={id as string}
          interviewTopic={title}
          concepts={fundamentals}
          stopScreenSharing={stopScreenSharing}
          skillLevel={level}
          type={type}
          jobDescription={jobDescription}
          isResume={isResume}
          userExperience={userExperience}
        />
      )}
    </>
  );
};

export default InterviewSetupNew;