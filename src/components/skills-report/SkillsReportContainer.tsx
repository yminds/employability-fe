// ReportContent.tsx

import React, { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Share2 } from "lucide-react";
import excellentIcon from "@/assets/skills/excellent.svg";
import manageSearch from "@/assets/skills/manage_search.svg";
import arrow from "@/assets/skills/arrow.svg";
import PerformanceHighlights from "./PerformanceHighlights";
import ReportScore from "./ReportScorecard";
import generatePDF from 'react-to-pdf';
import InterviewPlayer from "../interview/InterviewPlayer";

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
}


const ReportContent: React.FC<ReportContentProps> = ({
  reportData,
  userName,
  handleBackToSkillsPage,
  goal_name,
  skill_icon,
}) => {
  // Create a ref for the printable part of the page.
  const componentRef = useRef<HTMLDivElement>(null);

  // Define page styles that override on-screen restrictions when printing.
  const pageStyle = `
    @page {
      size: auto;
      margin: 0mm;
    }
    @media print {
      html, body {
        width: auto;
        height: auto;
      }
      /* Remove fixed height and overflow restrictions */
      .printable-container {
        height: auto !important;
        overflow: visible !important;
      }
    }
  `;

  const getTargetElement = () => document.getElementById('mainContent');
  // State to manage the share popup.
  const [showSharePopup, setShowSharePopup] = useState(false);
  const handleShareClick = () => {
    setShowSharePopup((prev) => !prev);
  };
  const [copyText, setCopyText] = useState('Copy');

  // The current URL to share.
  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";


  return (
    // Note: The use of Tailwind’s print variants (e.g. print:h-auto, print:overflow-visible)
    // ensures that on print the container does not limit the height or clip the content.
    <div className="flex w-full h-screen print:h-auto justify-center overflow-y-auto print:overflow-visible font-ubuntu p-6">
      <div className="w-full max-w-[1800px]">
        {/* Header */}
        <header className="py-6 flex justify-between">
          <div className="max-w-[7/10] px-4 flex flex-col gap-2">
            <h1 className="text-title text-grey-7 font-bold flex gap-4 items-center">
              <button
                onClick={handleBackToSkillsPage}
                className="w-[30px] h-[30px] bg-white border-2 rounded-full flex justify-center items-center"
              >
                <img className="w-[10px] h-[10px]" src={arrow} alt="Back" />
              </button>
              <span className="text-h1">
                {userName}&apos;s {reportData.interview_id?.title} Report
              </span>
            </h1>
          </div>

          {/* Share Button and Popup */}
          <div className="flex gap-4 relative">
            <button
              className="flex gap-2 items-center px-4 py-2 rounded-md text-grey-7 hover:bg-gray-100 relative"
              onClick={handleShareClick}
            >
              <Share2 />
              Share Report
            </button>
            {showSharePopup && (
              <div className="absolute right-0 top-[40px] bg-white border border-gray-300 rounded p-4 shadow-md min-w-[250px]">
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
                      setCopyText('Copied');
                      setTimeout(() => setCopyText('Copy'), 2000); // Reset back to "Copy" after 2 seconds
                    }}
                  >
                    {copyText}
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content to be printed/downloaded */}
        <main
          ref={componentRef}
          className="max-w-[1800px] h-full print:h-auto flex mx-auto px-4 gap-6 printable-container"
          id="mainContent"
        >
          <section className="w-full flex-[7]">

            {reportData.s3_recording_url &&
              <section className="flex justify-center  ">
                <div className="continer-player w-full h-[28rem] relative">
                  <InterviewPlayer urls={reportData.s3_recording_url} />
                </div>
              </section>}

            {/* Summary Section */}
            <section className="bg-white rounded-md shadow-sm p-6 mb-6">
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
                      reportData.summary.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-body2 text-grey-6">
                            {improvement}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-body2 text-grey-5">
                        No improvements available
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-6">
              <PerformanceHighlights
                highlights={reportData.summary?.performance_highlights}
              />
            </section>

            {/* Concept Breakdown */}
            <section className="mb-6 bg-white rounded-xl p-[42px]">
              <h2 className="text-h2 font-medium text-grey-7 mb-4">
                Concept Breakdown
              </h2>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
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
                        <p className="text-body2 text-grey-6">{rating.reason}</p>
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
          <section className="w-full flex-[3] gap-5">
            <ReportScore
              goalName={goal_name}
              ReportScore={reportData.final_rating}
              skill_icon={skill_icon}
            />

            {/* Progress Bars for Concept Ratings */}
            <section className="bg-white border border-grey-2 rounded-md shadow-sm mt-6 p-8 mb-6">
              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
                {reportData.concept_ratings?.length ? (
                  reportData.concept_ratings.map((rating, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sub-header font-medium text-grey-7">
                          {rating.concept}
                        </h3>
                      </div>
                      <div className="min-w-full bg-background-grey min-h-2 relative rounded-full overflow-hidden">
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

            <section className="bg-white rounded-md p-8">
              <div className="text-body2 mb-6">
                Get a pdf version of this skill report to be shared with employers
              </div>
              <div>
                <button
                  className="flex gap-2 items-center px-4 py-2 bg-[#001630] text-white hover:bg-[#062549] rounded-md"
                  onClick={() => generatePDF(getTargetElement)}
                >
                  Download PDF
                </button>
              </div>
            </section>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ReportContent;
