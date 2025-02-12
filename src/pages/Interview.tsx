import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import useInterviewSetup from "@/hooks/useInterviewSetup";
import Interview from "@/components/interview/Interview";
import CheckSetup from "../components/setup/CheckSetup";
import { useGetUserFundamentalsBySkillIdMutation } from "@/api/fundementalSlice";
import toggleBrowserFullscreen from "@/components/skills/fullscreen";

const InterviewSetupNew: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();

  const [fetchFundamental] = useGetUserFundamentalsBySkillIdMutation();
  const [fundamentals, setFundamentals] = useState<any[]>([]);
  // State to control showing the permission note modal
  const [showPermissionNote, setShowPermissionNote] = useState(false);
  // New state to track if the user has the required camera and mic permissions
  const [hasPermissions, setHasPermissions] = useState(false);

  const { title, skillPoolId, level } = location.state || {};
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
      try {
        const fundamentalsResponse = await fetchFundamental({
          skill_pool_id: skillPoolId,
          level,
        }).unwrap();
        setFundamentals(fundamentalsResponse.data[0]?.concepts || []);
      } catch (error) {
        console.error("Error fetching fundamentals:", error);
      }
    };
    sync();
  }, [fetchFundamental, skillPoolId, level]);

  // Only show the Interview component if the user has required permissions,
  // the fundamentals have loaded, and the interview is started.
  const canShowInterview = isInterviewStarted && fundamentals.length > 0 && hasPermissions;

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
            <div className=" text-body space-y-3">
              <p>
                <strong>Step 1:</strong> Locate the padlock icon in your browser's address bar.
              </p>
              <p>
                <strong>Step 2:</strong> Click the padlock icon and select <em>"Site settings"</em> from the dropdown.
              </p>
              <p>
                <strong>Step 3:</strong> In the Site Settings, scroll down to find the <strong>Camera</strong> and <strong>Microphone</strong> permissions.
              </p>
              <p>
                <strong>Step 4:</strong> Change both the Camera and Microphone settings to <em>"Allow"</em>.
              </p>
              <p>
                <strong>Step 5:</strong> Refresh the page to apply the changes.
              </p>
            </div>
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
              <button
                className={`bg-[#10B754] ${isProceedButtonEnabled ? "hover:bg-green-600" : "cursor-not-allowed opacity-50"} text-white rounded-[4px] font-semibold text-[16px] w-72 py-2`}
                onClick={() => {
                  setIsInterviewStarted(true);
                  toggleBrowserFullscreen();
                }}
                disabled={!isProceedButtonEnabled}
              >
                Proceed to Interview
              </button>
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
        />
      )}
    </>
  );
};

export default InterviewSetupNew;
