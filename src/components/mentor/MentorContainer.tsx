import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { skipToken } from "@reduxjs/toolkit/query/react";
import { useGetUserFundamentalsByIdMutation } from "@/api/userFundamentalsAppiSlice";
import { useGetThreadByUserAndTitleQuery } from "@/api/threadApiSlice";
import { useSendMentorMessageMutation } from "@/api/mentorChatApiSlice";
import { useMentorChat } from "@/hooks/useChatMentor";
import { useUpdateFundamentalStatusMutation } from "@/api/userFundamentalsAppiSlice";

import FundamentalsList from "@/components/mentor/FundamentalsList";
import MentorChatThreads from "./MentorChatThreads";
import QuizDialog from "./QuizDialog";
import QuizActionBtns from "./QuizActionBtns";

interface AnswerRecord {
  question: string;
  selectedOption: string;
  correctAnswer: string;
}

interface MentorContainerProps {
  skill: string;
  skillId: string;
  skillPoolId: string;
}

const MentorContainer: React.FC<MentorContainerProps> = ({
  skill,
  skillId,
  skillPoolId,
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [fundamentals, setFundamentals] = useState<any[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSentHello, setHasSentHello] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finalScore, setFinalScore] = useState<any>({});
  const [currentPendingTopic, setCurrentPendingTopic] = useState("");
  const [canTakeFinalQuiz, setCanTakeFinalQuiz] = useState(false);
  // New state for quiz topic selected from the fundamentals bar
  const [selectedQuizTopic, setSelectedQuizTopic] = useState("");
  const [isUpdated, setIsUpdated] = useState<boolean>(false);

  const userId = useSelector((state: RootState) => state.auth.user?._id);
  const userExperience = useSelector((state: RootState) => state.auth.user?.experience_level);
  const [updateFundamentalStatus] = useUpdateFundamentalStatusMutation();
  // We'll derive the thread title from skill + user
  const title = userId ? `${skill}'s Mentor Thread` : null;

  // RTK Query hooks
  const [fetchFundamentals] = useGetUserFundamentalsByIdMutation();
  const { startMentorChat } = useMentorChat();
  const [sendMentorMessage] = useSendMentorMessageMutation();

  const {
    data: thread,
    isLoading: isThreadLoading,
  } = useGetThreadByUserAndTitleQuery(
    userId && title ? { userId, title } : skipToken
  );

  console.log("thread",thread)

  // -------- 1) Load fundamentals --------------
  useEffect(() => {
    if (!userId || !skillPoolId) return;

    const fetchUserFundamentals = async () => {
      try {
        setIsLoading(true);
        const res = await fetchFundamentals({
          user_id: userId,
          skill_pool_id: skillPoolId,
        }).unwrap();

        setFundamentals(res?.data?.fundamentals || []);
      } catch (err) {
        console.error("Error fetching fundamentals:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserFundamentals();
  }, [userId, skillPoolId, fetchFundamentals]);

  // -------- 2) Create or reuse the mentor thread --------------
  useEffect(() => {
    if (!userId || !skillId || !skillPoolId) return;
    if (isThreadLoading) return;
    if (isInitialized) return;

    const createOrReuseThread = async () => {
      try {
        // If a thread already exists in DB, reuse it
        if (thread?.data?._id) {
          setChatId(thread.data._id);
        } else {
          // Otherwise, create a new one
          const { threadId: newChatId } = await startMentorChat({
            title: `${skill}'s Mentor Thread`,
            skill_id: skillId,
            skill_pool_id: skillPoolId,
          });

          setChatId(newChatId);

          // Send "Hello!" message
          await sendInitialMessage(newChatId);
        }

        setIsInitialized(true);
      } catch (err) {
        console.error("Error creating/reusing thread:", err);
      }
    };

    createOrReuseThread();
  }, [
    userId,
    skillId,
    skillPoolId,
    thread,
    isThreadLoading,
    isInitialized,
    startMentorChat,
  ]);

  // Helper to send the initial "Hello!" once
  const sendInitialMessage = useCallback(
    async (currentChatId: string) => {
      if (hasSentHello || !currentChatId || !userId) return;
      try {
        await sendMentorMessage({
          prompt: "Hello! Give me a small introduction about yourself and start the journey",
          chatId: currentChatId,
          userId,
          fundamentals,
          skill,
        }).unwrap();
        setHasSentHello(true);
      } catch (error) {
        console.error("Error sending initial message:", error);
      }
    },
    [hasSentHello, userId, fundamentals, skill, sendMentorMessage]
  );

  // Keep chatId up-to-date if we find the thread _after_ we have one
  useEffect(() => {
    if (thread?.data?._id && chatId !== thread.data._id) {
      setChatId(thread.data._id);
    }
  }, [thread, chatId]);

  // -------- 3) Extract the next "pending" fundamental --------------
  const pendingFundamentals = fundamentals.filter(
    (f) => f.status.toLowerCase() === "pending"
  );
  const firstPendingFundamental = pendingFundamentals.map((f) => f.name);
  // Default to the first pending in the array:
  useEffect(() => {
    if (firstPendingFundamental.length > 0) {
      if (currentIndex >= firstPendingFundamental.length) {
        setCurrentIndex(0);
      }
      setCurrentPendingTopic(firstPendingFundamental[currentIndex]);
    } else {
      setCurrentPendingTopic("No pending fundamentals");
      setCanTakeFinalQuiz(true);
    }
  }, [firstPendingFundamental, currentIndex, isUpdated]);

  // -------- 4) Quiz handlers --------------

  // Updated to use separate state for quiz topic
  const handleStartQuiz = (topic: string) => {
    if(topic === "Final Quiz") {
      setCanTakeFinalQuiz(true);
    } else {
      console.log("Topic inside handleStartQuiz:", topic);
      setIsQuizOpen(true);
      setSelectedQuizTopic(topic);
    }
  };

  const handleSkipCurrentConcept = () => {
    setCurrentIndex((prevIndex) => {
      let next = prevIndex + 1;
      if (next >= firstPendingFundamental.length) {
        next = 0; // or set to first concept again
      }
      return next;
    });
  };

  const handleFinalScore = async (result: { score: number; correctAnswers: AnswerRecord[]; wrongAnswers: AnswerRecord[] }) => {
    setFinalScore(result);
    setIsQuizOpen(false);
    // Reset the selected quiz topic after finishing the quiz

    // ✅ Update status to "Completed" only if score >= 3
    if (result.score >= 3 && userId && skillPoolId && currentPendingTopic) {
      try {
        await updateFundamentalStatus({
          user_id: userId,
          skill_pool_id: skillPoolId,
          name: currentPendingTopic, // Name of the fundamental
          newStatus: "Completed",
        }).unwrap();

        // Remap the fundamentals array so that the updated item is no longer pending
        setFundamentals((prevFundamentals) =>
          prevFundamentals.map((fund) =>
            fund.name === currentPendingTopic
              ? { ...fund, status: "Completed" }
              : fund
          )
        );
      } catch (error) {
        console.error("Error updating fundamental status:", error);
      }
    }
    setIsUpdated(true);
  };

  // Show a skeleton layout while threads, fundamentals, or messages are loading
  if (isLoading || isThreadLoading) {
    return (
      <div className="flex flex-col h-screen w-full max-w-[1800px] border-0 relative">
        <div className="flex h-[84px] justify-center items-center gap-4 self-stretch">
          <section className="flex items-center justify-between w-[820px]">
            <section className="flex-col p-2 min-w-[350px] items-center justify-center">
              <div className="text-body2 text-grey-5 text-sm">
                <Skeleton width={200} height={20} />
              </div>
              <div className="text-h1">
                <Skeleton width={250} height={40} />
              </div>
            </section>
            <div>
              <Skeleton width={100} height={40} />
            </div>
          </section>
          <section>
            <Skeleton width={150} height={30} />
          </section>
        </div>
        <div className="relative w-full flex-1 min-w-[70vh] ">
          <div className="w-full h-full flex-col min-w-[70vh] justify-around">
            {Array.from({ length: 3 }).map((_, index) => (
              <React.Fragment key={index}>
                <div className="max-w-[40%]">
                  {/* Mimic message thread skeleton */}
                  <Skeleton count={1} height={80} />
                </div>
                <div className="max-w-[50%] ml-auto">
                  {/* Mimic message thread skeleton */}
                  <Skeleton count={1} height={80} />
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
        <div className="flex flex-col h-full w-full border-0 relative">
          <div className="flex h-[84px] justify-around items-center gap-[75px] 2xl:gap-0 self-stretch border-b">
            <section className=" flex min-w-[800px] ml-auto 2xl:mr-auto  items-center">
              <section className="flex-col p-[14px] min-w-[450px]">
                <div className="text-body2 text-grey-5 text-[14px] leading-6 tracking-[0.7px] ">
                  Fundamentals of {skill}
                </div>
                <div className="text-h1">{currentPendingTopic}</div>
              </section>
              {canTakeFinalQuiz && currentPendingTopic === "No pending fundamentals" ? (
                <section>
                  <button onClick={() => {handleStartQuiz("Final Quiz"); setIsQuizOpen(true)}}>
                    Take final quiz
                  </button>
                </section> ) : (
                <QuizActionBtns
                  fundamentals={fundamentals}
                  currentQuizTopic={currentPendingTopic}
                  onStartQuiz={handleStartQuiz}
                  skipCurrentConcept={handleSkipCurrentConcept}
                  showSkipBtn={pendingFundamentals.length > 1}
                />
              )}
            </section>

            <section className="mx-10">
              {!isSidebarOpen ? (
                <button onClick={() => setSidebarOpen(true)}>
                  View curriculum
                </button>
              ) : (
                <button onClick={() => setSidebarOpen(false)}>
                  Hide curriculum
                </button>
              )}
            </section>
          </div>

          <div className="relative w-full h-full p-[55px] pb-[42px] flex items-center justify-center">
            {/* Chat + Threads component */}
            <div className="w-full h-full relative">
              <MentorChatThreads
                chatId={chatId}
                userId={userId}
                fundamentals={fundamentals}
                skill={skill}
                isLoading={isLoading || isThreadLoading}
                setIsLoading={setIsLoading}
                finalQuizScore={finalScore}
                currentPendingTopic={selectedQuizTopic || currentPendingTopic}
                onStartQuiz={handleStartQuiz}
                skipCurrentConcept={handleSkipCurrentConcept}
              />
            </div>

            {/* Fundamentals sidebar */}
            {fundamentals.length > 0 && isSidebarOpen && (
              <div className="absolute right-0 bottom-0 h-full w-full max-w-md z-10 transition-transform duration-300 transform">
                <FundamentalsList
                  isSidebarOpen={isSidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                  skill={skill}
                  fundamentals={fundamentals}
                  onStartQuiz={handleStartQuiz}
                  onClose={()=>{setSidebarOpen(false)}}
                />
              </div>
            )}
          </div>

          {/* Quiz Dialog */}
          {isQuizOpen && userId && chatId && (
            <QuizDialog
              canTakeFinalQuiz={canTakeFinalQuiz}
              fundamentals={fundamentals}
              onClose={() => setIsQuizOpen(false)}
              // Pass the selected quiz topic if available, otherwise default to the current pending topic
              currentQuizTopic={selectedQuizTopic || currentPendingTopic}
              finalScore={handleFinalScore}
              user_id={userId}
              thread_id={chatId}
              experience_level={userExperience}
            />
          )}
        </div>
    </div>
  );
};

export default MentorContainer;
