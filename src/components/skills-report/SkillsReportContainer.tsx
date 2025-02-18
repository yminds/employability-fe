import React, { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Share2 } from "lucide-react";
import html2pdf from "html2pdf.js";

import excellentIcon from "@/assets/skills/excellent.svg";
import manageSearch from "@/assets/skills/manage_search.svg";
import arrow from "@/assets/skills/arrow.svg";
import download from "@/assets/skills/download.svg";

import PerformanceHighlights from "./PerformanceHighlights";
import ReportScore from "./ReportScorecard";
import InterviewPlayer from "../interview/InterviewPlayer";
import { useNavigate } from "react-router-dom";
import { useCreateInterview } from "@/hooks/useCreateInterview";

interface Performance {
  criteria: string;
  rating: number;
}

interface Summary {
  text: string;
  strengths: string[];
  improvements: string[];
  performance_highlights: Performance[];
}

interface Report {
  interview_id: {
    title: string;
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
}

interface ReportContentProps {
  reportData: Report;
  userName: string;
  handleBackToSkillsPage: () => void;
  goal_name: string;
  skill_icon: string;
  userImg: string | undefined;
  sharedReport?: boolean;
  skillId: string;
  userSkillId: string;
  level: string;
  skill:string;
}

const getShareUrl = () => {
  if (typeof window === "undefined") return "";
  const currentPath = window.location.pathname;
  const interviewId = currentPath.split("/").pop();
  const baseUrl = window.location.origin;
  const url = new URL(`${baseUrl}/share/skills-report/${interviewId}`);
  return url.toString();
};

const ReportContent: React.FC<ReportContentProps> = ({
  reportData,
  userName,
  handleBackToSkillsPage,
  goal_name,
  skill_icon,
  userImg,
  sharedReport,
  skillId,
  userSkillId,
  level,
  skill
}) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const [showSharePopup, setShowSharePopup] = useState(false);
  const [copyText, setCopyText] = useState("Copy");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleShareClick = () => {
    setShowSharePopup((prev) => !prev);
  };

  const shareUrl = getShareUrl();

  /**
   * Wait for all images in the given element to be loaded.
   */
  const waitForImagesToLoad = async (element: HTMLElement) => {
    const images = Array.from(element.getElementsByTagName("img"));
    await Promise.all(
      images.map((img) => {
        // Optional debug:
        console.log("Attempting to load image:", img.src);
        if (img.complete) {
          console.log("Image already loaded:", img.src);
          return Promise.resolve();
        }
        return new Promise<void>((resolve, reject) => {
          img.onload = () => {
            console.log("Loaded image:", img.src);
            resolve();
          };
          img.onerror = () => {
            console.error("Failed to load image:", img.src);
            reject(new Error(`Failed to load image: ${img.src}`));
          };
        });
      })
    );
  };

  /**
   * Generate PDF using html2pdf.js
   */
  const generatePDF = async () => {
    if (!componentRef.current || isGeneratingPDF) return;
    try {
      setIsGeneratingPDF(true);

      // Grab the printable container by ID
      const element = document.getElementById("printable-area");
      if (!element) return;

      // Wait until all images within the printable area have loaded
      await waitForImagesToLoad(element);

      const opt = {
        margin: [32, 32, 32, 32],
        filename: `${userName}-${reportData.interview_id?.title}-Report.pdf`,
        image: { type: "jpeg", quality: 0.20 },
        html2canvas: {
          scale: 2,
          useCORS: true,         // must be true for crossOrigin images
          allowTaint: false,
        },
        jsPDF: {
          unit: "pt",
          format: "a4",
          orientation: "portrait",
        },
        pagebreak: { mode: ["avoid-all"] },
      };

      // Generate and save PDF
      await html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  
  const { createInterview } = useCreateInterview();

  const navigate = useNavigate();
  const handleImproveScore = async () => {
    const interviewId = await createInterview({
      title: `${skill} Interview`,
      type: "Skill",
      user_skill_id: userSkillId,
      skill_id: skillId,
    });
    
    // Start the interview after closing the tutorial
    navigate(`/interview/${interviewId}`, {
      state: { skill, skillId:userSkillId, skillPoolId:skillId, level },
    });
  }

  return (
    <div className="flex w-full h-screen print:h-auto justify-center overflow-y-auto print:overflow-visible font-ubuntu p-6">
      <div className="w-[90%] max-w-[1800px]">
        {/* Header */}
        <header className="py-6 flex justify-between">
          <div className="max-w-[70%] px-4 flex flex-col gap-2">
            <h1 className="text-title text-grey-7 font-bold flex gap-4 items-center">
              {!sharedReport && (
                <button
                  onClick={handleBackToSkillsPage}
                  className="w-[30px] h-[30px] bg-white border-2 rounded-full flex justify-center items-center"
                >
                  {/* Add crossOrigin="anonymous" here */}
                  <img
                    crossOrigin="anonymous"
                    className="w-[10px] h-[10px]"
                    src={arrow}
                    alt="Back"
                  />
                </button>
              )}
              <span className="text-h1">
                 {reportData.interview_id?.title} Report
              </span>
            </h1>
          </div>

          {/* Share Button and Popup */}
          {!sharedReport && (
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
                  <p className="text-sm text-grey-7 font-medium mb-2">
                    Share this link:
                  </p>
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
          className="max-w-[1800px] h-full print:h-auto flex mx-auto px-4 gap-6 printable-container"
        >
          {isGeneratingPDF && (
            <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
              <div className="text-xl font-semibold">Generating PDF...</div>
            </div>
          )}
          <div
            id="printable-area"
            className={`relative flex gap-6 ${!isGeneratingPDF ? "flex-row" : "flex-col-reverse"
              }`}
          >
            {/* Left Section */}
            <section className="w-full flex-[7.5]">
              {/* Video Container – hidden in PDF via the "pdf-hide" class */}
              {reportData.s3_recording_url && (
                <section
                  className={`flex justify-center pdf-hide ${!isGeneratingPDF ? "flex" : "hidden"
                    }`}
                >
                  <div className="continer-player w-full h-[28rem] relative">
                    <InterviewPlayer urls={reportData.s3_recording_url} />
                  </div>
                </section>
              )}

              {/* Summary Section */}
              <section
                className={`bg-white rounded-md shadow-sm p-8 ${isGeneratingPDF ? "mb-0" : "mb-6"
                  }`}
              >
                <h2 className="text-h2 font-medium text-grey-7 mb-6">Summary</h2>
                <div className="mb-8">
                  <p className="text-body2 text-grey-6 leading-relaxed">
                    {reportData.summary?.text || "No summary available"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="bg-grey-1 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center justify-center rounded-full w-[32px] h-[32px] bg-[#FAFAFAFA] border">
                        <img
                          crossOrigin="anonymous"
                          src={excellentIcon}
                          alt="Verified icon"
                          className="w-[20px] h-[20px]"
                        />
                      </div>
                      <h3 className="text-sub-header font-medium text-grey-7 flex items-center gap-2">
                        Strengths
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {reportData.summary?.strengths?.length ? (
                        reportData.summary.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-body2 text-grey-6">
                              {strength}
                            </span>
                          </li>
                        ))
                      ) : (
                        <li className="text-body2 text-grey-5">
                          No strengths available
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Areas for Improvement */}
                  <div className="bg-grey-1 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center justify-center rounded-full w-[32px] h-[32px] bg-[#FAFAFAFA] border">
                        <img
                          crossOrigin="anonymous"
                          src={manageSearch}
                          alt="Verified icon"
                          className="w-[24px] h-[24px]"
                        />
                      </div>
                      <h3 className="text-sub-header font-medium text-grey-7 flex items-center gap-2">
                        Areas for Improvement
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {reportData.summary?.improvements?.length ? (
                        reportData.summary.improvements.map(
                          (improvement, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-body2 text-grey-6">
                                {improvement}
                              </span>
                            </li>
                          )
                        )
                      ) : (
                        <li className="text-body2 text-grey-5">
                          No improvements available
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </section>

              <section
                className={`bg-white rounded-md shadow-sm p-8 ${isGeneratingPDF ? "mb-0" : "mb-6"
                  }`}
              >
                <PerformanceHighlights
                  highlights={reportData.summary?.performance_highlights}
                  isGeneratingPDF={isGeneratingPDF}
                />
              </section>

              {/* Concept Breakdown */}
              <section className="mb-6 bg-white rounded-xl p-8">
                <h2 className="text-h2 font-medium text-grey-7 mb-4">
                  Concept Breakdown
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  {reportData.concept_ratings?.length ? (
                    reportData.concept_ratings.map((rating, index) => (
                      <Card
                        key={index}
                        className="bg-white border border-grey-2 rounded-md shadow-sm"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sub-header font-medium text-grey-7">
                              {rating.concept}
                            </h3>
                            <span>{rating.rating}/5</span>
                          </div>
                          <p className="text-body2 text-grey-6">
                            {rating.reason}
                          </p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-grey-5">
                      No competency ratings available
                    </p>
                  )}
                </div>
              </section>
            </section>

            {/* Right Section */}
            <section className="w-full flex-[2.5] gap-5">
              <ReportScore
                userName={userName}
                userImg={userImg}
                goalName={goal_name}
                ReportScore={reportData.final_rating}
                // Add crossOrigin manually if you are rendering an <img>
                skill_icon={skill_icon}
              />

              {/* Progress Bars for Concept Ratings */}
              <section
                className={`bg-white rounded-md shadow-sm mt-6 p-8 ${isGeneratingPDF ? "mb-0" : "mb-6"
                  }`}
              >
                <div className="flex-cols gap-6">
                  {reportData.concept_ratings?.length ? (
                    reportData.concept_ratings.map((rating, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sub-header font-medium text-grey-7">
                            {rating.concept}
                          </h3>
                        </div>
                        <div className="min-w-full bg-background-grey min-h-2 relative rounded-full overflow-hidden mt-4">
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
                    <p className="text-grey-5">
                      No competency ratings available
                    </p>
                  )}
                </div>
              </section>

              {/* PDF Download Section – hidden in PDF */}
              {!sharedReport && (
                <div className="flex flex-col gap-6">
                  <section
                    className={`bg-white rounded-md p-8 pdf-hide ${!isGeneratingPDF ? "" : "hidden"
                      }`}
                  >
                    <div className="text-body2 mb-6">
                      Retake the interview to refine your skill verification and achieve a higher score.
                    </div>
                    <button
                      className="flex gap-2 items-center px-4 py-2 bg-[#001630] text-white hover:bg-[#062549] rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleImproveScore} 
                    >
                      Improve Score
                    </button>
                  </section>
                  <section
                    className={`bg-white rounded-md p-8 pdf-hide ${!isGeneratingPDF ? "" : "hidden"
                      }`}
                  >
                    <div className="text-body2 mb-6">
                      Get a PDF version of this skill report to share with employers
                    </div>
                    <button
                      className="flex gap-2 items-center w-full justify-center px-4 py-2 bg-white border border-[#001630] rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={generatePDF}
                      disabled={isGeneratingPDF}
                    >
                      <img
                        className="w-4 h-4"
                        src={download}
                        alt="Download PDF"/>
                      {isGeneratingPDF ? "Generating PDF..." : "Download PDF"}
                    </button>
                  </section></div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportContent;
