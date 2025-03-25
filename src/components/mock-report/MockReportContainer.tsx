import React from "react";
import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import html2pdf from "html2pdf.js";
import excellentIcon from "@/assets/skills/excellent.svg";
import manageSearch from "@/assets/skills/manage_search.svg";
import arrow from "@/assets/skills/arrow.svg";
import download from "@/assets/reports/download.png";
import PerformanceHighlights from "@/components/skills-report/PerformanceHighlights";
import InterviewPlayer from "../interview/InterviewPlayer";
import TechnicalSkills from "@/assets/reports/technicalSkills.png";
import ProblemSolvingSkills from "@/assets/reports/problemSolving.png";
import SoftSkills from "@/assets/reports/softSkills.png";
import { useGetMessagesByThreadIdQuery } from "@/api/mentorUtils";
import ProfileAvatar from "@/assets/profile/ProfileAvatar.svg";
import CircularProgress from "../ui/circular-progress-bar";
import logo from "@/assets/skills/e-Logo.svg";
import { Share2 } from "lucide-react";
import NewInterviewPlayer from "../interview/NewInterviewPlayer";

// Add Message interface
interface Message {
  _id: string;
  thread_id: string;
  user_id: string;
  message: string;
  content: any[];
  role: string;
  createdAt: string;
  updatedAt: string;
  index: number;
}

interface Performance {
  criteria: string;
  rating: number;
}

interface TechnicalSkills {
  score: number;
  strengths: string[];
  areasForImprovement: string[];
}

interface ProblemSolvingSkills {
  score: number;
  strengths: string[];
  areasForImprovement: string[];
}

interface SoftSkills {
  score: number;
  strengths: string[];
  areasForImprovement: string[];
}

interface Summary {
  text: string;
  strengths: string[];
  improvements: string[];
  performance_highlights: Performance[];
  technicalSkills: TechnicalSkills;
  problemSolvingSkills: ProblemSolvingSkills;
  softskills: SoftSkills;
}

interface ConceptRating {
  concept: string;
  rating: number;
  reason: string;
}

interface Report {
  interview_id: {
    title: string;
    type?: string;
  };
  summary: Summary;
  concept_ratings?: {
    concept: string;
    rating: number;
    reason: string;
  }[];
  _id?: string;
  updatedAt?: string;
  final_rating: number;
  s3_recording_url: [string];
  reportType: string;
}

interface JobDetails {
  jobTitle?: string;
  company?: string;
  description?: string;
  skills_pool_ids?: Array<{ name: string; icon: string }>;
  jobDescription?: {
    summary: string;
    requiredSkillsAndQualifications: string[];
    keyResponsibilities: string[];
  };
  title?: string;
}

interface MockReportContentProps {
  reportData: Report;
  userName: string;
  handleBackToSkillsPage: () => void;
  userImg: string | undefined;
  sharedReport?: boolean;
  publicProfileName: string;
  isPublic?: boolean;
  thread_id?: string;
  jobDetails: JobDetails;
}

const getShareUrl = (publicProfileName: string) => {
  if (typeof window === "undefined") return "";
  const currentPath = window.location.pathname;
  const interviewId = currentPath.split("/").pop();
  const baseUrl = window.location.origin;
  const url = new URL(`${baseUrl}/skill-report/${publicProfileName}/Project/${interviewId}`);
  return url.toString();
};

const MockReportContent: React.FC<MockReportContentProps> = ({
  reportData,
  userName,
  handleBackToSkillsPage,
  userImg,
  sharedReport,
  publicProfileName,
  isPublic,
  thread_id,
  jobDetails,
}) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const { data: threadMessages } = useGetMessagesByThreadIdQuery({ threadId: thread_id });
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [copyText, setCopyText] = useState("Copy");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);

  const handleShareClick = () => {
    setShowSharePopup((prev) => !prev);
  };

  const shareUrl = getShareUrl(publicProfileName);

  /** Wait for all images in the given element to be loaded. */
  const waitForImagesToLoad = async (element: HTMLElement) => {
    const images = Array.from(element.getElementsByTagName("img"));
    await Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error(`Failed to load image: ${img.src}`));
        });
      })
    );
  };
  const conceptRatings = reportData.concept_ratings || [];
  const reversedUnique: ConceptRating[] = [];
  const seen = new Set<string>();

  for (let i = conceptRatings.length - 1; i >= 0; i--) {
    const item = conceptRatings[i];
    if (!seen.has(item.concept)) {
      reversedUnique.push(item);
      seen.add(item.concept);
    }
  }

  // 3) Reverse back to restore the original left-to-right order
  const uniqueRatings = reversedUnique.reverse();

  /** Generate PDF using html2pdf.js */
  const generatePDF = async () => {
    if (!componentRef.current || isGeneratingPDF) return;
    try {
      setIsGeneratingPDF(true);

      const element = document.getElementById("printable-area");
      if (!element) return;

      // Wait until all images within the printable area have loaded
      await waitForImagesToLoad(element);

      const opt = {
        margin: [32, 32, 32, 32],
        filename: `${userName}-${reportData.interview_id?.title}-Report.pdf`,
        image: { type: "jpeg", quality: 0.2 },
        html2canvas: {
          scale: 2,
          useCORS: true, // must be true if any images are crossOrigin
          allowTaint: false,
        },
        jsPDF: {
          unit: "pt",
          format: "a4",
          orientation: "portrait",
        },
        pagebreak: { mode: ["avoid-all"] },
      };

      await html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // const { createInterview } = useCreateInterview();
  // // If you have a "Retake" or "Improve Score" flow, handle it here
  // // const handleImproveScore = async () => {
  // //   ...
  // // };

  // -------------------------------------------
  // RENDER METHODS
  // -------------------------------------------
  // Inside your MockReportContent component, define a new method:
  const renderHeaderCard = (jobDetails: JobDetails) => {
    return (
      <section className="bg-white rounded-md p-6 mb-6 shadow-sm">
        {/* Header row for Job Title, Company, and Actions */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <div>
              <img src={ProfileAvatar} alt="" className=" w-10 h-10 object-cover rounded-full" />
            </div>
            <div>
              <h3>{reportData.interview_id.type === "Job" ? jobDetails?.jobTitle : userName}</h3>
              <p>{reportData.interview_id.type === "Job" ? jobDetails?.company : jobDetails?.title}</p>
            </div>
          </div>

          {/* Example "Download report" and "More" actions */}
          <div className="flex items-center gap-4">
            <button className="text-body2 font-medium flex gap-3 text-[#03963F]" onClick={generatePDF}>
              Download report{" "}
              <span className=" text-green-600">
                {" "}
                <img src={download} alt="" />
              </span>
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-[#F7F7F7] rounded p-4">
          <h3 className="text-sub-header">Summary</h3>
          <p className="text-body2 text-grey-6">{reportData.summary?.text || "No summary available"}</p>
        </div>

        {/* Show job description link, if needed */}
        {/* <button className="mt-3 text-sm font-medium text-green-600 hover:underline">
                    Show job description
                </button> */}
      </section>
    );
  };

  const renderLeftSection = () => (
    <>
      {/* ----------- Summary Section ----------- */}
      <section className={`bg-white rounded-md shadow-sm p-8 ${isGeneratingPDF ? "mb-0" : "mb-6"}`}>
        <h2 className="text-h2 font-medium text-grey-7 mb-6">Summary</h2>
        <div className="mb-8">
          <p className="text-body2 text-grey-6 leading-relaxed">{reportData.summary?.text || "No summary available"}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-6 sm:col-span-1">
          {/* Strengths */}
          <div className="bg-grey-1 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center rounded-full w-[32px] h-[32px] bg-[#FAFAFAFA] border">
                <img
                  crossOrigin="anonymous"
                  src={excellentIcon || "/placeholder.svg"}
                  alt="Verified icon"
                  className="w-[20px] h-[20px]"
                />
              </div>
              <h3 className="text-sub-header font-medium text-grey-7 flex items-center gap-2">Strengths</h3>
            </div>
            <ul className="space-y-2">
              {reportData.summary?.strengths?.length ? (
                reportData.summary.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-body2 text-grey-6">{strength}</span>
                  </li>
                ))
              ) : (
                <li className="text-body2 text-grey-5">No strengths available</li>
              )}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-grey-1 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center rounded-full w-[32px] h-[32px] bg-[#FAFAFAFA] border">
                <img
                  crossOrigin="anonymous"
                  src={manageSearch || "/placeholder.svg"}
                  alt="Verified icon"
                  className="w-[24px] h-[24px]"
                />
              </div>
              <h3 className="text-sub-header font-medium text-grey-7 flex items-center gap-2">Areas for Improvement</h3>
            </div>
            <ul className="space-y-2">
              {reportData.summary?.improvements?.length ? (
                reportData.summary.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-body2 text-grey-6">{improvement}</span>
                  </li>
                ))
              ) : (
                <li className="text-body2 text-grey-5">No improvements available</li>
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* ----------- Performance Highlights Section ----------- */}
      <section className={`bg-white rounded-lg border-0 p-8 ${isGeneratingPDF ? "mb-0" : "mb-6"}`}>
        <PerformanceHighlights
          highlights={reportData.summary?.performance_highlights}
          isGeneratingPDF={isGeneratingPDF}
        />
      </section>

      {/* ----------- Detailed Skills Breakdown ----------- */}
      <section className="mb-6 bg-white rounded-lg p-8">
        {/* Technical Skills */}
        {reportData.summary?.technicalSkills && (
          <div className="">
            <div className=" flex justify-between mb-4">
              <div className=" flex gap-4 items-center">
                <img
                  src={TechnicalSkills || "/placeholder.svg"}
                  alt="Technical Skills"
                  className="w-8 h-8 rounded-full border p-1"
                />
                <h3 className="text-sub-header font-medium text-grey-7">Technical Skills</h3>
              </div>
              <span className=" text-body2">
                Score: <span className=" text-green-600 text-body2">{reportData.summary.technicalSkills.score}/5</span>
              </span>
            </div>
            <div className=" rounded-lg flex justify-between gap-6">
              <div className=" w-1/2 bg-grey-1 p-2 rounded-lg">
                <div className=" text-body2 text-grey-5">Strengths:</div>
                {reportData.summary.technicalSkills.strengths?.length ? (
                  <ul className="list-disc list-inside ml-4">
                    {reportData.summary.technicalSkills.strengths.map((strength, idx) => (
                      <li key={idx} className="text-body2 text-grey-6">
                        {strength}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-body2 text-grey-6">No strengths available.</p>
                )}
              </div>
              <div className=" w-1/2 bg-grey-1 p-2 rounded-lg">
                <div className=" text-body2 text-grey-5">Areas for Improvement:</div>
                {reportData.summary.technicalSkills.areasForImprovement?.length ? (
                  <ul className="list-disc list-inside ml-4">
                    {reportData.summary.technicalSkills.areasForImprovement.map((item, idx) => (
                      <li key={idx} className="text-body2 text-grey-6">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-body2 text-grey-6">No areas for improvement listed.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
      <section className="mb-6 bg-white rounded-lg p-8">
        {/* Problem Solving Skills */}
        {reportData.summary?.problemSolvingSkills && (
          <div className="">
            <div className=" flex justify-between mb-4">
              <div className=" flex gap-4 items-center">
                <img
                  src={ProblemSolvingSkills || "/placeholder.svg"}
                  alt="Technical Skills"
                  className="w-8 h-8 rounded-full border p-1"
                />
                <h3 className="text-sub-header font-medium text-grey-7">Problem Solving Skills</h3>
              </div>
              <span className=" text-body2">
                {" "}
                Score:{" "}
                <span className=" text-green-600 text-body2">{reportData.summary.problemSolvingSkills.score}/5</span>
              </span>
            </div>
            <div className="rounded-lg p-4 flex justify-between gap-6">
              <div className="w-1/2 bg-grey-1 p-2 rounded-lg">
                <div className=" text-body2 text-grey-5">Strengths:</div>
                {reportData.summary.problemSolvingSkills.strengths?.length ? (
                  <ul className="list-disc list-inside ml-4">
                    {reportData.summary.problemSolvingSkills.strengths.map((strength, idx) => (
                      <li key={idx} className="text-body2 text-grey-6">
                        {strength}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-body2 text-grey-6">No strengths available.</p>
                )}
              </div>
              <div className="w-1/2 bg-grey-1 p-2 rounded-lg">
                <div className=" text-body2 text-grey-5">Areas for Improvement:</div>
                {reportData.summary.problemSolvingSkills.areasForImprovement?.length ? (
                  <ul className="list-disc list-inside ml-4">
                    {reportData.summary.problemSolvingSkills.areasForImprovement.map((item, idx) => (
                      <li key={idx} className="text-body2 text-grey-6">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-body2 text-grey-6">No areas for improvement listed.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
      {/* Soft Skills */}
      <section className="mb-6 bg-white rounded-lg p-8">
        {reportData.summary?.softskills && (
          <div className="">
            <div className=" flex justify-between mb-4">
              <div className=" flex gap-4 items-center">
                <img
                  src={SoftSkills || "/placeholder.svg"}
                  alt="Technical Skills"
                  className="w-8 h-8 rounded-full border p-1"
                />
                <h3 className="text-sub-header font-medium text-grey-7">Soft Skills</h3>
              </div>
              <span className=" text-body2">
                Score: <span className=" text-green-600 text-body2">{reportData.summary.softskills.score}/5</span>
              </span>
            </div>
            <div className=" gap-6 rounded-lg p-4 flex justify-between">
              <div className="w-1/2 bg-grey-1 p-2 rounded-lg">
                <div className=" text-body2 text-grey-5">Strengths:</div>
                {reportData.summary.softskills.strengths?.length ? (
                  <ul className="list-disc list-inside ml-4">
                    {reportData.summary.softskills.strengths.map((strength, idx) => (
                      <li key={idx} className="text-body2 text-grey-6">
                        {strength}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-body2 text-grey-6">No strengths available.</p>
                )}
              </div>
              <div className="w-1/2 bg-grey-1 p-2 rounded-lg">
                <div className=" text-body2 text-grey-5">Areas for Improvement:</div>
                {reportData.summary.softskills.areasForImprovement?.length ? (
                  <ul className="list-disc list-inside ml-4">
                    {reportData.summary.softskills.areasForImprovement.map((item, idx) => (
                      <li key={idx} className="text-body2 text-grey-6">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-body2 text-grey-6">No areas for improvement listed.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ----------- Concept Breakdown ----------- */}
      <section className="mb-6 bg-white rounded-lg p-8">
        <h2 className="text-h2 font-medium text-grey-7 mb-4">Concept Breakdown</h2>
        <div className="grid grid-cols-1 gap-6">
          {uniqueRatings.length ? (
            uniqueRatings.map((rating, index) => (
              <Card key={index} className="bg-white border border-grey-2 rounded-md shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sub-header font-medium text-grey-7">{rating.concept}</h3>
                    <span>{rating.rating}/5</span>
                  </div>
                  <p className="text-body2 text-grey-6">{rating.reason}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-grey-5">No competency ratings available</p>
          )}
        </div>
      </section>
    </>
  );

  const renderTranscriptBlock = () => {
    if (!threadMessages || !threadMessages.data) return null;
    // Search functionality state and handlers

    // Create an array of structured conversation data from the messages
    const conversations: { speaker: string; message: string }[] = [];

    // Skip the first message and process the rest
    const processedMessages = threadMessages.data.slice(1) as Message[];

    // Parse messages into a structured format for easier rendering
    processedMessages.forEach((msg: Message) => {
      // Determine speaker name based on role
      const speaker = msg.role === "USER" ? userName : "Interviewer";
      conversations.push({
        speaker: speaker,
        message: msg.message,
      });
    });

    // Function to copy transcript to clipboard
    const handleCopy = () => {
      const textToCopy = conversations.map((conv) => `${conv.speaker}: ${conv.message}`).join("\n\n");

      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          // You could add a toast notification here
          console.log("Transcript copied to clipboard");
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    };

    const toggleSearch = () => {
      setIsSearching(!isSearching);
      if (!isSearching) {
        // Focus search input when opened
        setTimeout(() => {
          document.getElementById("transcript-search")?.focus();
        }, 100);
      } else {
        // Clear search when closing
        setSearchTerm("");
      }
    };

    // Filter conversations based on search term
    const filteredConversations = searchTerm
      ? conversations.filter(
          (conv) =>
            conv.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            conv.speaker.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : conversations;

    // Function to highlight text that matches the search term
    const highlightText = (text: string, highlight: string) => {
      if (!highlight.trim()) {
        return text;
      }

      const regex = new RegExp(`(${escapeRegExp(highlight)})`, "gi");

      // Split the text by the matched term and wrap the matches in highlighted spans
      const parts = text.split(regex);

      return parts.map((part, index) => {
        // Check if this part matches our search term (case insensitive)
        if (part.toLowerCase() === highlight.toLowerCase()) {
          return (
            <span key={index} className="bg-yellow-200 font-medium rounded px-0.5">
              {part}
            </span>
          );
        }
        return part;
      });
    };

    // Helper function to escape special regex characters
    const escapeRegExp = (string: string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    };

    return (
      <section className="bg-white rounded-lg border-0 mt-6 px-8 py-[42px]">
        <div className="flex justify-between items-center border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Transcript</h2>
          <div className="flex space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-md text-sm hover:bg-green-100 transition-colors"
              aria-label="Copy transcript"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy
            </button>
            <button
              onClick={toggleSearch}
              className="flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-md text-sm hover:bg-green-100 transition-colors"
              aria-label="Search transcript"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Search
            </button>
          </div>
        </div>

        {isSearching && (
          <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
            <div className="relative">
              <input
                id="transcript-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search transcript..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
              <button
                onClick={() => setSearchTerm("")}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 ${
                  !searchTerm && "hidden"
                }`}
                aria-label="Clear search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {searchTerm && (
              <div className="mt-2 text-sm text-gray-500">
                {filteredConversations.length} {filteredConversations.length === 1 ? "result" : "results"} found
              </div>
            )}
          </div>
        )}

        <div className=" py-4 max-h-[500px] overflow-y-auto minimal-scrollbar m-2">
          {filteredConversations.length > 0
            ? filteredConversations.map((conv, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="flex">
                    <div className="font-medium text-gray-900 min-w-[100px]">
                      {searchTerm ? highlightText(conv.speaker, searchTerm) : conv.speaker} :
                    </div>
                    <div className="text-gray-800">
                      {searchTerm ? highlightText(conv.message, searchTerm) : conv.message}
                    </div>
                  </div>
                </div>
              ))
            : searchTerm && (
                <div className="text-center py-6 text-gray-500">No matching results found for "{searchTerm}"</div>
              )}
        </div>

        {searchTerm && filteredConversations.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {filteredConversations.length} of {conversations.length} messages
            </div>
            <div className="flex space-x-2">
              <button
                className="text-sm text-green-700 hover:text-green-800 disabled:text-gray-400"
                disabled={true} // This would be dynamic in a real implementation
              >
                Previous
              </button>
              <button
                className="text-sm text-green-700 hover:text-green-800 disabled:text-gray-400"
                disabled={true} // This would be dynamic in a real implementation
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>
    );
  };

  // Inside your MockReportContent component

  const renderRightSection = (jobDetails: JobDetails | undefined, reportData: Report | undefined) => {
    return (
      <section className={`bg-white rounded-md shadow-sm p-8 ${isGeneratingPDF ? "mb-0" : "mb-6"}`}>
        {/* 1. Interview Score Card */}
        <div className="bg-green-50 p-4 rounded-md flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {/* Example icon or your own brand icon */}
            <div className="p-4 w-[100%] h-[92px] bg-green-50 rounded-lg flex items-center space-x-4">
              <div className="relative w-[60px] h-[60px] flex items-center justify-center border rounded-full">
                {/* Circular Progress Bar */}
                <CircularProgress
                  progress={reportData?.final_rating ? Number(reportData.final_rating.toFixed(1)) * 10 : 0}
                  size={60}
                  strokeWidth={6}
                  showText={false}
                />
                <img className="absolute w-8 h-8" src={logo} alt="short logo" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData?.final_rating ? Number(reportData.final_rating.toFixed(1)) : 0}
                  <span className="text-2xl font-bold text-[#00000099]">/10</span>
                </p>
                <p className="text-gray-900 font-sf-pro-display text-lg font-medium leading-6 tracking-[0.27px]">
                  Interview Score
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Job Description */}
        <div className="mb-6">
          <h2 className="text-sub-header font-semibold text-grey-6 mb-2 ">Job description</h2>
          <p className="text-body2 text-grey-6">
            {reportData?.interview_id.type === "Job"
              ? jobDetails?.jobDescription?.summary
              : jobDetails?.description || ""}
          </p>
        </div>

        {/* 3. Skills Required */}
        <div className="mb-6">
          <h3 className="text-sub-header font-medium text-grey-6 mb-2">Skills required</h3>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(jobDetails?.jobDescription?.requiredSkillsAndQualifications) ? (
              jobDetails.jobDescription.requiredSkillsAndQualifications.map((skill: string) => (
                <span
                  key={skill}
                  className="inline-block bg-[#E7EFEB] text-[#03963F] text-xs font-medium px-2 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))
            ) : Array.isArray(jobDetails?.skills_pool_ids) ? (
              jobDetails.skills_pool_ids.map((skill: { name: string; icon: string }) => (
                <span
                  key={skill.name}
                  className="inline-block bg-[#E7EFEB] text-[#03963F] text-xs font-medium px-2 py-1 rounded-full flex items-center gap-2"
                >
                  <img src={skill.icon} alt={skill.name} className="w-4 h-4" />
                  {skill.name}
                </span>
              ))
            ) : (
              <p className="text-sm text-grey-5">No skills listed</p>
            )}
          </div>
        </div>

        {/* 4. Key Responsibilities */}
        {reportData?.interview_id.type === "Job" ? (
          <div className="mb-6">
            <h3 className="text-sub-header font-medium text-grey-6 mb-2 ">Key Responsibilities:</h3>
            {Array.isArray(jobDetails?.jobDescription?.keyResponsibilities) ? (
              <ol className="list-decimal list-inside space-y-1 text-body2 text-grey-6">
                {jobDetails.jobDescription.keyResponsibilities.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-grey-5">No responsibilities listed</p>
            )}
          </div>
        ) : (
          <></>
        )}

        {/* 5. Concept / Competency Bars (existing code) */}
        {/* <div className="flex-cols gap-6">
        {uniqueRatings.length ? (
          uniqueRatings.map((rating, index) => (
            <div key={index} className="py-2">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sub-header font-medium text-grey-7">
                  {rating.concept}
                </h4>
              </div>
              <div className="min-w-full bg-background-grey min-h-2 relative rounded-full overflow-hidden mt-2">
                <div
                  className="min-h-2 bg-primary-green absolute left-0 top-0 transition-all duration-300 rounded-full"
                  style={{
                    width: `${(rating.rating / 5) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-grey-5">No competency ratings available</p>
        )}
      </div> */}
      </section>
    );
  };

  const renderInterviewPlayer = () =>
    reportData.s3_recording_url && (
      <section className="flex justify-center pdf-hide mb-6">
        <div className="continer-player w-full h-[70vh] relative">
          {reportData?.s3_recording_url.length > 1 ? (
            <InterviewPlayer urls={reportData.s3_recording_url} />
          ) : (
            <NewInterviewPlayer url={reportData.s3_recording_url[0]} />
          )}
          {/* <NewInterviewPlayer
            url={
              "https://employability-user-profile.s3.us-east-1.amazonaws.com/interview/videos/67cbcea0b1bd605d0874fb4b-1741436001672-webm"
            }
          /> */}
        </div>
      </section>
    );

  // -------------------------------------------
  // MAIN RENDER
  // -------------------------------------------
  return (
    <div className="flex w-full h-screen print:h-auto justify-center overflow-y-auto print:overflow-visible font-ubuntu p-6">
      <div className="w-[90%] max-w-[1800px]">
        {/* Header */}
        <header className="py-6 flex justify-between">
          <div className="max-w-[70%] px-4 flex flex-col gap-2">
            <h1 className="text-title text-grey-7 font-bold flex gap-4 items-center">
              {(!sharedReport || isPublic) && (
                <button
                  onClick={handleBackToSkillsPage}
                  className="w-[30px] h-[30px] bg-white border-2 rounded-full flex justify-center items-center"
                >
                  <img
                    crossOrigin="anonymous"
                    className="w-[10px] h-[10px]"
                    src={arrow || "/placeholder.svg"}
                    alt="Back"
                  />
                </button>
              )}
              <span className="text-body2">{reportData?.interview_id.type || ""} Interview Report</span>
            </h1>
          </div>

          {/* Share Button and Popup */}
          {true && (
            <div className="flex gap-4 relative">
              <button
                className="flex gap-2 items-center px-4 py-2 rounded-md text-grey-7 hover:bg-gray-100 relative"
                onClick={handleShareClick}
              >
                <Share2 />
                Share Report
              </button>
              {showSharePopup && (
                <div className="absolute right-0 top-[40px] bg-white border border-gray-300 rounded p-4 shadow-md min-w-[250px] z-10">
                  <p className="text-sm text-grey-7 font-medium mb-2">Share this link:</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="flex-1 text-sm py-1 px-2 border border-gray-300 rounded focus:outline-none"
                    />
                    <button
                      className="text-sm px-2 py-1 bg-primary-green text-white rounded hover:opacity-90"
                      onClick={() => {
                        navigator.clipboard.writeText(shareUrl);
                        setCopyText("Copied");
                        setTimeout(() => setCopyText("Copy"), 2000);
                      }}
                    >
                      {copyText}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Main Content */}
        <main
          ref={componentRef}
          id="mainContent"
          className="max-w-[1800px] h-[80vh] print:h-auto mx-auto px-4 printable-container"
        >
          {isGeneratingPDF && (
            <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
              <div className="text-xl font-semibold">Generating PDF...</div>
            </div>
          )}

          {/* MOBILE (below 1024px) */}
          <div className="lg:hidden xl:hidden 2xl:hidden">
            <div id="printable-area" className="relative flex flex-col gap-6">
              {renderHeaderCard(jobDetails)}
              {!isGeneratingPDF && renderInterviewPlayer()}
              <div className="space-y-6 mb-6">{renderRightSection(jobDetails, reportData)}</div>
              <div className="space-y-6">{renderLeftSection()}</div>
              <div className="space-y-6 ">{renderTranscriptBlock()}</div>
            </div>
          </div>

          {/* DESKTOP (1024px and up) */}
          <div className="hidden lg:block xl:block 2xl:block">
            <div id="printable-area" className="relative grid grid-cols-10 gap-6">
              <div className="col-span-7 flex flex-col max-h-[85vh] overflow-auto minimal-scrollbar p-1">
                {renderHeaderCard(jobDetails)}
                {!isGeneratingPDF && renderInterviewPlayer()}
                <div className="space-y-6 ">{renderLeftSection()}</div>
                <div className="space-y-6 ">{renderTranscriptBlock()}</div>
              </div>
              <div className="col-span-3 flex flex-col space-y-6">{renderRightSection(jobDetails, reportData)}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MockReportContent;
