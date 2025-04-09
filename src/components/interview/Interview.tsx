import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";

// Components
import Header from "@/components/interview/Header";
import WebCam from "@/components/interview/WebCam";
import Controls from "@/components/interview/Controls";
import AIProfile from "@/components/interview/AIProfile";
import Conversation from "@/components/interview/Conversation";

// Hooks and API
import { useInterviewStreamMutation } from "@/api/aiApiSlice";
import { useGetInterviewbyIdQuery } from "@/api/interviewApiSlice";
import { useTTS } from "@/hooks/useTTS";
import { useSTT } from "@/hooks/useSTT";
import CodeSnippetQuestion from "./CodeSnippetQuestion";
import { Disc, Disc2, Timer } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import toggleBrowserFullscreen from "../skills/fullscreen";
import { JobDescription } from "../interview-list/ViewJD";
import useScreenShot from "@/hooks/useScreenShot";
import { useUpdateThumbnailMutation } from "@/api/reportApiSlice";
import Example from "@/features/cap/Example";
import { flushSync } from "react-dom";

// Constants and Types
const SOCKET_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : window.location.hostname === "dev.employability.ai"
      ? "wss://dev.employability.ai"
      : "wss://employability.ai";

interface CodeSnippetType {
  code: string;
  question: string;
}

export interface IMessage {
  id: number;
  message: string;
  role: "USER" | "AI";
}

export interface IDsaQuestionResponse {
  code: string;
  testCases: any[];
}

interface QuestionState {
  question: string;
  codeSnippet: CodeSnippetType | null;
  isCodeSnippetMode: boolean;
  concept: string;
}

type InterviewState = "WAITING" | "LISTENING" | "SPEAKING";
const initialState = {
  question: "",
  codeSnippet: null,
  isCodeSnippetMode: false,
  concept: "",
};

const Interview: React.FC<{
  id: string;
  cameraScale: number;
  interviewTopic: string;
  concepts: any[];
  stopScreenSharing: () => void;
  skillLevel: "1" | "2" | "3";
  type: "Skill" | "Mock" | "Project" | "Full" | "Screening";
  jobDescription: JobDescription;
  isResume: boolean;
  projectId: string;
  userExperience: string | undefined;
  Fundamentals: string | string[];
  skills_required: string | string[];
  comanyDetails: {
    name : string;
    location:any
  }
  interviewIcon?: string;
}> = ({
  interviewTopic,
  concepts,
  stopScreenSharing,
  skillLevel,
  type,
  jobDescription,
  isResume = false,
  projectId,
  userExperience,
  Fundamentals,
  skills_required,
  comanyDetails,
  interviewIcon,
}) => {
    // console.log("in interviews jobDescription", jobDescription);
    const [showScreenWarning, setShowScreenWarning] = useState(false);
    const { id: interviewId } = useParams<{ id: string }>();
    const [interviewStream] = useInterviewStreamMutation();
    const [interviewState, setInterviewState] = useState<InterviewState>("WAITING");
    const [allConcepts, setAllConcepts] = useState<any[]>(concepts.map((concept) => ({ ...concept, status: "pending" })));
    const [updateThumbnail] = useUpdateThumbnailMutation();
    const [isDsaRoundStarted, setIsDsaRoundStarted] = useState(false);
    const [isDsaRoundActive, setIsDsaRoundActive] = useState(false);
    const [dsaQuestion, setDsaQuestion] = useState<any>(null);
    const { captureScreenshot, screenshot } = useScreenShot();
    // Queries and Speech Hooks
    const { startRecording, stopRecording, isSttSuccess, sttResponse, sttError } = useSTT();
    const { data: interviewDetails, isSuccess: isInterviewLoaded } = useGetInterviewbyIdQuery(interviewId as string, {
      skip: !interviewId,
    });

    const user = useSelector((state: RootState) => state.auth.user);

    // State
    const [isUserAnswering, setIsUserAnswering] = useState(false);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [question, setQuestion] = useState<QuestionState>(initialState);

    const [isInitialized, setIsInitialized] = useState(false);
    const [layoutType, setLayoutType] = useState<1 | 2>(1);
    const [isInterviewEnded, setIsInterviewEnded] = useState(false);

    const isComponentMounted = useRef(true);

    // TTS Setup
    const { frequencyData, handleIncomingData } = useTTS({
      onPlaybackComplete: () => {
        setInterviewState("LISTENING"); // Move to LISTENING state when TTS finishes
        setTimeout(() => {
          setIsUserAnswering(true);
          startRecording();
        }, 50);
      },
    });

    useEffect(() => {
      const monitorScreens = async () => {
        if ('getScreenDetails' in window) {
          try {
            const screenDetails = await (window as any).getScreenDetails();
            const updateScreenCount = () => {
              const screens = screenDetails.screens.length;
              if (screens > 1) {
                setShowScreenWarning(true);
              }
            };

            updateScreenCount(); // Initial check

            screenDetails.addEventListener('screenschange', updateScreenCount);
          } catch (error) {
            console.error("Screen monitoring failed:", error);
          }
        }
      };

      monitorScreens();
    }, []);

    // Socket Connection
    useEffect(() => {
      if (!isInterviewLoaded || !interviewDetails?.data?._id) return;

      const newSocket = io(SOCKET_URL, {
        transports: ["websocket", "polling"],
      });
      const handleConnect = async () => {
        // console.log("entred handleConnect from handleConnect");
        if (!isInitialized) {
          // console.log("Connected handleConnect isInitialized");

          // taking screenshot for candidate
          setTimeout(async () => {
            const response = await captureScreenshot();
            updateThumbnail({ thubmnail_url: response as string, interview_id: interviewDetails.data._id });
          }, 1000 * 30);

          setIsInitialized(true);
          const initialGreeting = "Hello, before starting the interview, introduce yourself?";
          const resumeMessage = "Hello, sorry for the interruption. We can continue from where we left off.";
          if (isResume) {
            addMessage(resumeMessage);
            return;
          }
          addMessage(initialGreeting);
        }
      };

      const handleAIResponse = (data: string) => {
        // console.log("[enetred to ai response]", question);

        // if (data === "") {
        //   // creating a fallback for empty response
        //   addMessage("Sorry, I didn't get that. Can you please repeat the question?");
        //   return;
        // }

        setInterviewState("SPEAKING"); // Move to SPEAKING when AI starts speaking

        handleIncomingData(data, (sentence) => handleMessage(sentence, "AI"));
      };

      const handleShiftLayout = (data: string) => {
        setLayoutType(data === "1" ? 1 : 2);
        setQuestion((prev) => ({
          ...prev,
          isCodeSnippetMode: false,
        }));
      };

      const handleGenerateQuestion = (question: string, concept: string) => {
        // console.log(question);
        setQuestion({
          question,
          codeSnippet: null,
          isCodeSnippetMode: false,
          concept,
        });
      };

      const handleGenerateCodeSnippet = (codeSnippetData: CodeSnippetType, concept: string) => {
        // console.log("Generate Code Snippet", codeSnippetData, concept);
        setQuestion((prev) => ({
          ...prev,
          codeSnippet: codeSnippetData,
          isCodeSnippetMode: true,
          concept,
        }));
      };

      const handleGenerateDsaQuestion = (question: any) => {
        // console.log("[DSA Question]", question);
        // making sure the state is updated synchronously
        flushSync(() => {
          setDsaQuestion(question);
        });
        setIsDsaRoundStarted(true);
        setIsDsaRoundActive(true);
      };
      const handleEndInterview = () => {
        setTimeout(() => {
          setIsInterviewEnded(true);
        }, 5000);
        stopScreenSharing();
      };

      const handleConceptValidation = (concepts: any) => {
        setAllConcepts((prev) => {
          const updatedConcepts = prev.map((concept) => {
            if (concepts?.ratedConcepts?.includes(concept?.name)) {
              // console.log("Concept entred", { ...concept, status: "completed" });

              return { ...concept, status: "completed" };
            }
            // console.log("concept", concept);

            return concept;
          });
          return updatedConcepts;
        });
      };

      // Socket event listeners
      newSocket.on("connect", handleConnect);
      newSocket.on(`aiResponse${interviewDetails.data._id}`, handleAIResponse);
      newSocket.on(`shiftLayout${interviewDetails.data._id}`, handleShiftLayout);
      newSocket.on(`generateQuestion${interviewDetails.data._id}`, handleGenerateQuestion);
      newSocket.on(`generateCodeSnippet${interviewDetails.data._id}`, handleGenerateCodeSnippet);
      newSocket.on(`endInterview${interviewDetails.data._id}`, handleEndInterview);
      newSocket.on(`conceptValidation${interviewDetails.data._id}`, handleConceptValidation);
      newSocket.on(`generateDsaQuestion${interviewDetails.data._id}`, handleGenerateDsaQuestion);

      return () => {
        isComponentMounted.current = false;
        newSocket.off("connect", handleConnect);
        newSocket.off(`aiResponse${interviewDetails.data._id}`, handleAIResponse);
        newSocket.off(`shiftLayout${interviewDetails.data._id}`, handleShiftLayout);
        newSocket.off(`generateQuestion${interviewDetails.data._id}`, handleGenerateQuestion);
        newSocket.off(`generateCodeSnippet${interviewDetails.data._id}`, handleGenerateCodeSnippet);

        newSocket.disconnect();
      };
    }, [isInterviewLoaded, interviewDetails]);

    // Speech-to-Text handling
    useEffect(() => {
      // if dsaround started then return
      if (isDsaRoundActive) return;

      if (isSttSuccess && sttResponse) {
        const { text } = sttResponse.transcription;
        handleMessage(text, "USER");
        addMessage(text);
      }

      if (sttError) {
        console.error("Speech-to-text error:", sttError);
      }
    }, [isSttSuccess, sttResponse, sttError]);

    const handleDoneAnswering = () => {
      if (isUserAnswering) {
        stopRecording();
        setIsUserAnswering(false);
        setInterviewState("WAITING"); // Back to WAITING before AI processes the response
      }
    };

    const handleMessage = (message: string, role: "USER" | "AI") => {
      setMessages((prevMessages) => {
        if (role === "AI") {
          if (prevMessages.length === 0) {
            return [{ id: 1, message, role }];
          }

          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage.role === "AI") {
            return [...prevMessages.slice(0, -1), { ...lastMessage, message: `${lastMessage.message} ${message}` }];
          }
        }

        return [
          ...prevMessages,
          {
            id: prevMessages.length + 1,
            message,
            role,
          },
        ];
      });
    };

    const addMessage = async (prompt: string) => {
      // console.log("🔥 addMessage called with prompt:", prompt);

      if (!interviewDetails?.data?._id) {
        console.error("⚠️ Interview details not available, skipping API call.");
        return;
      }

      // Move to "WAITING" state when sending a new question
      setInterviewState("WAITING");

      const response = await interviewStream({
        prompt,
        // model: "deepseek-chat",
        // provider: "deepseek",
        model: "gpt-4o",
        provider: "openai",
        // model: "gemini-2.0-flash-exp",
        // provider: "google",
        _id: interviewDetails.data._id,
        thread_id: interviewDetails.data.thread_id,
        user_id: interviewDetails.data.user_id,
        user_skill_id: interviewDetails.data.user_skill_id,
        skill_id: interviewDetails.data.skill_id,
        code_snippet: question.codeSnippet?.code || "",
        question: question.question,
        skill_name: interviewTopic,
        concepts:
          type === "Mock" || type === "Full"
            ? Array.isArray(Fundamentals)
              ? Fundamentals
              : typeof Fundamentals === "string"
                ? Fundamentals.split(",").map((c: string) => c.trim())
                : []
            : concepts,
        interview_id: interviewDetails.data._id,
        level: user?.experience_level || "entry",
        type: type,
        jobDescription: jobDescription,
        userName: user?.firstName,
        projectId: projectId,
        userExperience: userExperience,
        skills_required: skills_required,
        companyDetails: comanyDetails,
      }).unwrap();

      // console.log("response", response);

      setAllConcepts((prev) => {
        const updatedConcepts = prev.map((concept) => {
          if (response?.event?.ratedConcepts?.includes(concept?.name)) {
            return { ...concept, status: "completed" };
          }

          return concept;
        });
        return updatedConcepts;
      });
    };

    const navigate = useNavigate();
    const handleBackBtn = () => {
      stopScreenSharing();
      toggleBrowserFullscreen();
      navigate(-1);
    };

    const handleDsaQuestionSubmit = ({ code, testCases }: IDsaQuestionResponse) => {
      // console.log("DSA Question Submitted", code);

      const response = `
    user submitted code: ${code} \n
    test cases: ${JSON.stringify(testCases)}
    `;
      addMessage(response);
      handleDoneAnswering();

      setIsDsaRoundStarted(false);

      setTimeout(() => {
        setIsDsaRoundActive(false);
      }, 5000);
    };

    const getLatestMessages = (allMessages: IMessage[]) => {
      const latestAI = [...allMessages].reverse().find((m) => m.role === "AI");
      const latestUser = [...allMessages].reverse().find((m) => m.role === "USER");

      // Preserve order: oldest first
      const latest = [latestUser, latestAI].filter(Boolean).sort((a, b) => (a!.id - b!.id));
      return latest as IMessage[];
    };


    return (
      <>
        {showScreenWarning && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-6 text-h2 text-red-600">Second Screen Detected</h2>
              <div className="text-body space-y-3 mb-4">
                <p>We detected an additional screen connected during the interview.</p>
                <p>Please disconnect it to continue. You will be redirected to the setup screen.</p>
              </div>
              <button
                className="text-button bg-button text-white px-4 py-2 rounded"
                onClick={() => {
                  stopScreenSharing();
                  toggleBrowserFullscreen();
                  navigate(-1); // go back to previous screen (Check Setup)
                }}
              >
                Return to Setup
              </button>
            </div>
          </div>
        )}
        <div className={`w-full h-[${isDsaRoundStarted ? "80vh" : "100vh"}] pt-12 `}>
          <div className="flex flex-col max-w-[80%] mx-auto gap-y-12">
            <Header SkillName={interviewTopic} type={type} skillLevel={skillLevel} interviewIcon={interviewIcon}  />
            {/* check dsa round started or not */}

              {isInterviewEnded ? (
              <div className="text-center text-gray-500  font-ubuntu">
                <p>Thank you for your time. We will get back to you soon.</p>
                <button className=" text-button bg-button text-white m-2 p-2 rounded-md" onClick={handleBackBtn}>
                  Back
                </button>
              </div>
            ) : isDsaRoundStarted ? (
                <div className=" h-[70vh] mx-auto">
                  <Example question={dsaQuestion} handleDsaQuestionSubmit={handleDsaQuestionSubmit} />
                </div>
              ) : (
              <LayoutBuilder
                isUserAnswering={isUserAnswering}
                handleDoneAnswering={handleDoneAnswering}
                question={question}
                frequencyData={frequencyData}
                messages={getLatestMessages(messages)}
                layoutType={2}
                interviewState={interviewState}
                concepts={allConcepts}
              />
            )}
          </div>
        </div>
      </>
    );
  };

interface LayoutBuilderProps {
  isUserAnswering: boolean;
  handleDoneAnswering: () => void;
  question: QuestionState;
  frequencyData: any;
  messages: IMessage[];
  layoutType: 1 | 2;
  interviewState: InterviewState;
  concepts: any[];
}

const LayoutBuilder = ({
  isUserAnswering,
  handleDoneAnswering,
  question,
  frequencyData,
  messages,
  layoutType,
  interviewState,
  concepts,
}: LayoutBuilderProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [InterviewTime, setInterviewTime] = useState<number>(0);
  const [formattedTime, setFormattedTime] = useState<string>("00:00");

  // console.log("all conepts", concepts);

  // // console.log("concepts", concepts);
  const coveredConceptsLength = concepts.filter((concept) => concept.status === "completed").length;
  const calculateProgress = (concepts: any[]) => {
    if (!concepts.length) return 0;

    const completedCount = concepts.filter((concept) => concept.status === "completed").length;

    // Round to 1 decimal place for cleaner display
    return Math.round((completedCount / concepts.length) * 1000) / 10;
  };

  // In the component:
  const progression = calculateProgress(concepts);

  console.log("progression", progression);

  // settign a interview timer

  useEffect(() => {
    const interval = setInterval(() => {
      setInterviewTime((prevTime) => {
        const newTime = prevTime + 1;
        const minutes = Math.floor(newTime / 60);
        const seconds = newTime % 60;
        const formattedMinutes = String(minutes).padStart(2, "0");
        const formattedSeconds = String(seconds).padStart(2, "0");
        setFormattedTime(`${formattedMinutes}:${formattedSeconds}`);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return layoutType === 1 ? (
    <div className="w-full flex gap-8 max-h-screen">
      <div className="w-[60%] flex flex-col gap-8">

        <WebCam />
        {isUserAnswering ? (
          <Controls doneAnswering={handleDoneAnswering} />
        ) : (
          <div className="text-center text-gray-500" />
        )}
      </div>
      <div className="w-[40%] flex flex-col gap-8">
        <AIProfile frequency={frequencyData} interviewState={interviewState} />
        <Conversation layoutType={1} messages={messages} />
      </div>
    </div>
  ) : (
    <div className="w-full flex flex-col gap-4  max-h-[calc(100vh-100px)]  ">
      <div className="info-container   flex flex-col gap-2 justify-center w-full    ">
        <div className="progression-wrapper h-2 w-full bg-[rgba(16,183,84,0.20);] rounded-md">
          <div
            className="progressbar h-full bg-green-500 rounded-md transition-all duration-300 ease-in-out"
            style={{ width: `${progression}%` }}
          ></div>
        </div>
        {/* <Timer className="text-green-500" /> */}
        <div className="timer flex gap-2 items-center  ">
          <Disc className="w-5 h-5 text-red-500" />
          <p className="text-[16px] font-semibold">{formattedTime} </p>
        </div>
      </div>

      <div className="main-container w-full flex gap-8">
        <div className="w-[45%] flex flex-col gap-5  ">
          <AIProfile frequency={frequencyData} interviewState={interviewState} /> {/* Pass state here */}
          {question.isCodeSnippetMode && question.codeSnippet ? (
            <CodeSnippetQuestion question={question.codeSnippet.question} codeSnippet={question.codeSnippet.code} />
          ) : (
            <Conversation layoutType={2} messages={messages} />
          )}
        </div>
        <div className="w-[55%] flex flex-col gap-3">
          <WebCam />
          {isUserAnswering ? (
            <Controls doneAnswering={handleDoneAnswering} />
          ) : (
            <div className="text-center text-gray-500" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Interview;
