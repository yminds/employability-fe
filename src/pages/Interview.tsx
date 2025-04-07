import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import useInterviewSetup from "@/hooks/useInterviewSetup";
import Interview from "@/components/interview/Interview";
import CheckSetup from "../components/setup/CheckSetup";
import { useGetUserFundamentalsBySkillIdMutation } from "@/api/fundementalSlice";
import toggleBrowserFullscreen from "@/components/skills/fullscreen";
import { projectConcepts } from "@/utils/projects/projectConcpets";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import useOnline from "@/hooks/useOnline";
import { toast } from "sonner";
import { Info } from "lucide-react";
import InterviewGuide from "@/components/interview/InterviewGuide";

const InterviewSetupNew: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const userExperience = useSelector((state: RootState) => state.auth.user?.experience_level);
  const [fetchFundamental] = useGetUserFundamentalsBySkillIdMutation();
  const [fundamentals, setFundamentals] = useState<any[]>([]);
  const [screenCount, setScreenCount] = useState<number>(0);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);

  // State to control showing the permission note modal
  const [showPermissionNote, setShowPermissionNote] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const online = useOnline();

  const {
    title,
    skillPoolId,
    level,
    type,
    jobDescription,
    isResume,
    Fundamentals = "",
    projectId,
    skills_required,
    interviewIcon
  } = location.state || {};

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

  const [showMultipleScreenWarning, setShowMultipleScreenWarning] = useState(false);

  const requestPermissions = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        console.log("Media stream:", stream);
        setHasPermissions(true);
        setShowPermissionNote(false);

        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        throw new Error("getUserMedia not supported in this browser.");
      }
    } catch (error) {
      console.error("Error requesting media devices:", error);
      setHasPermissions(false);
      setShowPermissionNote(true);
    }
  };

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const hasCamera = devices.some((device) => device.kind === "videoinput" && device.label !== "");
        const hasMic = devices.some((device) => device.kind === "audioinput" && device.label !== "");
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

  useEffect(() => {
    const monitorScreens = async () => {
      if ("getScreenDetails" in window) {
        try {
          const screenDetails = await (window as any).getScreenDetails();
          const updateScreenCount = () => {
            const screens = screenDetails.screens.length;
            if (screens > 1) {
              setShowMultipleScreenWarning(true);
            } else {
              setShowMultipleScreenWarning(false);
            }
          };

          updateScreenCount();
          screenDetails.addEventListener('screenschange', updateScreenCount);
        } catch (error) {
          console.error("Screen monitoring failed:", error);
        }
      }
    };

    monitorScreens();
    const intervalId = setInterval(monitorScreens, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const sync = async () => {
      if (type === "Skill") {
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

  const canShowInterview = isInterviewStarted && (fundamentals.length > 0 || type !== "Skill") && hasPermissions;

  useEffect(() => {
    if (!online) {
      console.log("Connection lost, redirecting...");
      setTimeout(() => {
        window.location.replace("/");
      }, 500);
    }
  }, [online]);

    useEffect(() => {
      const hasSeenInterviewGuide = localStorage.getItem("hasSeenInterviewGuide");
      if (hasSeenInterviewGuide === "true") {
        setIsGuideOpen(false);
      }else{
        setIsGuideOpen(true);
      }
    }, []);
  
    const handleCloseTutorial = () => {
      setIsGuideOpen(false);
    };

    
  
    useEffect(() => {
      // Check if the user has disabled the tutorial
      const hasSeenInterviewGuide = localStorage.getItem("hasSeenInterviewGuide");
      if (hasSeenInterviewGuide  === "true") {
        setDontShowAgain(true);
      }
    }, []);
    const handleConfirmInterviewGuide = async () => {
      console.log("handleConfirmInterviewGuide");
      
      if (dontShowAgain) {
        localStorage.setItem("hasSeenInterviewGuide", "true");
      }
      setIsGuideOpen(false);
    };

  if (!online) return <div>You are offline</div>;

  return (
    <>
      {/* Permission Modal */}
      {showPermissionNote && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 transition-colors"
              onClick={() => setShowPermissionNote(false)}
              aria-label="Close"
            >
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
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
              <p>This interview requires access to your camera and microphone.</p>
              <p>
                Please click the button below to grant access. If you've previously denied permissions, you may need to
                adjust your browser settings.
              </p>
              <p className="text-red-600 font-medium">
                If you deny access, the interview cannot proceed. Please allow access to your camera and microphone.
              </p>
            </div>
            <button className="text-button bg-button text-white px-4 py-2 rounded" onClick={requestPermissions}>
              Request Permissions
            </button>
          </div>
        </div>
      )}

      {/* Retry Permission Block Message */}
      {!hasPermissions && !showPermissionNote && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center max-w-md">
            <h2 className="text-xl font-bold mb-4 text-red-600">Permissions Blocked</h2>
            <p className="mb-3">
              Access to your camera and microphone is required to start the interview.
            </p>
            <p className="text-sm text-gray-500 mb-5">
              You've blocked access to the camera, microphone, or have multiple screens connected. Please enable camera and microphone access, and disconnect extra screens from your browser or system settings to continue with the interview.
            </p>

          </div>
        </div>
      )}

      {/* Setup / Interview Screen */}
      {!canShowInterview ? (
        <div className="flex items-center h-screen w-[70%] mx-auto sm:w-[95%]">
          <main className="py-4 w-full">
            <div className="flex flex-row items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-4 ">
                  <p className="text-[#1A1A1A] text-[24px] font-medium font-ubuntu ">Check Your Setup</p>
                  <p
                    className="font-[400px] text-[14px] underline text-[#909091] flex gap-1 items-center cursor-pointer mt-2"
                    onClick={() => setIsGuideOpen(true)}
                  >
                    <Info size={16} /> Guide me
                  </p>
                </div>
                <p className="text-[16px] font-normal text-[#00000099]">
                  Before you proceed to the interview, make sure your setup is working properly.
                </p>
              </div>

              <div>
                <div className="flex flex-col justify-end items-end gap-2">
                  <button
                    className={`bg-button ${
                      isProceedButtonEnabled && !showMultipleScreenWarning
                        ? "hover:bg-[#062549]"
                        : "cursor-not-allowed opacity-50"
                    } text-white rounded-[4px] font-normal text-[14px] w-72 py-2 leading-5`}
                    onClick={() => {
                      setIsInterviewStarted(true);
                      toggleBrowserFullscreen();
                    }}
                    disabled={showMultipleScreenWarning || !isProceedButtonEnabled}
                  >
                    Proceed to Interview
                  </button>

                  {showMultipleScreenWarning && (
                    <div className="text-red-500 text-sm">
                      *Multiple screens detected. Please use a single screen to proceed.
                    </div>
                  )}
                </div>
              </div>
            </div>
            {isGuideOpen && (
              <InterviewGuide
                onClose={() => {
                  setIsGuideOpen(false);
                  handleConfirmInterviewGuide();
                }}
                onConfirm={handleConfirmInterviewGuide}
                dontShowAgain={dontShowAgain}
                setDontShowAgain={setDontShowAgain}
                component={"InterviewSetup"}
              />
            )}
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
          concepts={projectId ? projectConcepts : fundamentals}
          stopScreenSharing={stopScreenSharing}
          skillLevel={level}
          type={type}
          jobDescription={jobDescription}
          isResume={isResume}
          projectId={projectId}
          userExperience={userExperience}
          Fundamentals={Fundamentals ? Fundamentals.split(",").map((concept: string) => concept.trim()) : []}
          skills_required={skills_required || []}
          interviewIcon={interviewIcon || ""}
        />
      )}
    </>
  );
};

export default InterviewSetupNew;
