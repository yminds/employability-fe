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
import { Timer } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import toggleBrowserFullscreen from "../skills/fullscreen";
import { JobDescription } from "../interview-list/ViewJD";
import useScreenShot from "@/hooks/useScreenShot";
import { useUpdateThumbnailMutation } from "@/api/reportApiSlice";

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
  type: "Skill" | "Mock" | "Project" | "Job";
  jobDescription: JobDescription;
  isResume: boolean;
  projectId: string;
  userExperience: string | undefined;
  Fundamentals: string | string[];
  skills_required: string | string[];
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
}) => {
  console.log("in interviews jobDescription", jobDescription);
  const { id: interviewId } = useParams<{ id: string }>();
  const [interviewStream] = useInterviewStreamMutation();
  const [interviewState, setInterviewState] = useState<InterviewState>("WAITING");
  const [allConcepts, setAllConcepts] = useState<any[]>(concepts.map((concept) => ({ ...concept, status: "pending" })));
  const [updateThumbnail] = useUpdateThumbnailMutation();

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

  // Socket Connection
  useEffect(() => {
    if (!isInterviewLoaded || !interviewDetails?.data?._id) return;

    const newSocket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });
    const handleConnect = async () => {
      console.log("entred handleConnect from handleConnect");
      if (!isInitialized) {
        console.log("Connected handleConnect isInitialized");
        
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
      console.log("[enetred to ai response]", question);

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
      console.log(question);
      setQuestion({
        question,
        codeSnippet: null,
        isCodeSnippetMode: false,
        concept,
      });
    };

    const handleGenerateCodeSnippet = (codeSnippetData: CodeSnippetType, concept: string) => {
      console.log("Generate Code Snippet", codeSnippetData, concept);
      setQuestion((prev) => ({
        ...prev,
        codeSnippet: codeSnippetData,
        isCodeSnippetMode: true,
        concept,
      }));
    };

    const handleEndInterview = () => {
      setTimeout(() => {
        setIsInterviewEnded(true);
      }, 5000);
      stopScreenSharing();
    };

    const handleConceptValidation = (concepts: any) => {
      console.log("========================+");
      console.log(concepts);
      console.log("========================+");

      setAllConcepts((prev) => {
        const updatedConcepts = prev.map((concept) => {
          if (concepts?.ratedConcepts?.includes(concept?.name)) {
            console.log("Concept entred", { ...concept, status: "completed" });

            return { ...concept, status: "completed" };
          }
          console.log("concept", concept);

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
    console.log("🔥 addMessage called with prompt:", prompt);

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
      concepts: type === "Mock" || type === "Job" ? 
        (Array.isArray(Fundamentals) ? Fundamentals : typeof Fundamentals === 'string' ? Fundamentals.split(',').map((c: string) => c.trim()) : []) 
        : concepts,
      interview_id: interviewDetails.data._id,
      level: user?.experience_level || "entry",
      type: type,
      jobDescription: jobDescription,
      userName: user?.name,
      projectId: projectId,
      userExperience: userExperience,
      skills_required: skills_required,
    }).unwrap();

    console.log("response", response);

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

  return (
    <div className="w-full h-screen pt-12 ">
      <div className="flex flex-col max-w-[80%] mx-auto gap-y-12">
        <Header SkillName={interviewTopic} type={type} skillLevel={skillLevel} />
        {isInterviewEnded ? (
          <div className="text-center text-gray-500  font-ubuntu">
            <p>Thank you for your time. We will get back to you soon.</p>
            <button className=" text-button bg-button text-white m-2 p-2 rounded-md" onClick={handleBackBtn}>
              Back
            </button>
          </div>
        ) : (
          <LayoutBuilder
            isUserAnswering={isUserAnswering}
            handleDoneAnswering={handleDoneAnswering}
            question={question}
            frequencyData={frequencyData}
            messages={messages}
            layoutType={2}
            interviewState={interviewState}
            concepts={allConcepts}
          />
        )}
      </div>
    </div>
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

  console.log("all conepts", concepts);

  // console.log("concepts", concepts);
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
    <div className="w-full flex flex-col gap-8 max-h-[calc(100vh-100px)]  ">
      <div className="info-container   flex gap-2 items-center justify-center w-full  ">
        <div className="progression-wrapper h-2 w-full bg-white rounded-md">
          <div
            className="progressbar h-full bg-green-500 rounded-md transition-all duration-300 ease-in-out"
            style={{ width: `${progression}%` }}
          ></div>
        </div>
        <Timer className="text-green-500" />
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
        <div className="w-[55%] flex flex-col gap-1 ">
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
