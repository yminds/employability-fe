import React, { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Share2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import excellentIcon from "@/assets/skills/excellent.svg";
import manageSearch from "@/assets/skills/manage_search.svg";
import arrow from "@/assets/skills/arrow.svg";
import PerformanceHighlights from "./PerformanceHighlights";
import ReportScore from "./ReportScorecard";
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
  userImg:string;
  sharedReport?: boolean;
}

const getShareUrl = (params = {}) => {
  if (typeof window === 'undefined') return '';
  
  // Get the current URL and split it to get the ID
  const currentPath = window.location.pathname;
  const interviewId = currentPath.split('/').pop();
  
  // Get the base URL (e.g., http://localhost:5173)
  const baseUrl = window.location.origin;

  // Create URL with path
  const url = new URL(`${baseUrl}/share/skills-report/${interviewId}`);
  
  // Add non-empty parameters to URL
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, value as string);
    }
  });
  
  return url.toString();
};

const ReportContent: React.FC<ReportContentProps> = ({
  reportData,
  userName,
  handleBackToSkillsPage,
  goal_name,
  skill_icon,
  userImg,
  sharedReport
}) => {
  const componentRef = useRef<HTMLDivElement>(null);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [copyText, setCopyText] = useState("Copy");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleShareClick = () => {
    setShowSharePopup((prev) => !prev);
  };

  const shareUrl = getShareUrl({
    userName: userName,
    goal_name: goal_name,
    skill_icon: skill_icon,
    userImg: userImg
  });

  const generatePDF = async () => {
    if (!componentRef.current || isGeneratingPDF) return;

    try {
      setIsGeneratingPDF(true);

      const element = document.getElementById("mainContent");
      if (!element) return;

      // Save original inline styles of mainContent
      const originalStyle = element.style.cssText;

      // Temporarily adjust styles to ensure all content is captured properly
      element.style.position = "relative";
      element.style.height = "auto";
      element.style.overflow = "visible";
      element.style.maxHeight = "none";

      // Also adjust all parent elements (if necessary)
      let parent = element.parentElement;
      const originalStyles: { element: HTMLElement; style: string }[] = [];
      while (parent && parent !== document.body) {
        originalStyles.push({
          element: parent,
          style: parent.style.cssText,
        });
        parent.style.position = "relative";
        parent.style.height = "auto";
        parent.style.overflow = "visible";
        parent.style.maxHeight = "none";
        parent = parent.parentElement;
      }

      // Add a PDF-specific class to the container
      element.classList.add("pdf-export");

      // Inject PDF-specific CSS to improve margins/paddings and to hide unwanted sections
      const pdfStyle = document.createElement("style");
      pdfStyle.textContent = `
        .pdf-export {
          background: #f5f5f5 !important;
          padding: 30px !important;
          margin: 0 auto !important;
          width: 100% !important;
        }
        .pdf-export header {
          padding: 10px 0 !important;
          margin-bottom: 20px !important;
        }
        .pdf-export main {
          padding: 20px !important;
        }
        .pdf-export section {
          margin-bottom: 20px !important;
          padding: 15px !important;
        }
        .pdf-export .pdf-hide {
          display: none !important;
        }
        .pdf-export * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .pdf-export .bg-none {
        background: none !important;
        }
      `;
      document.head.appendChild(pdfStyle);

      // Capture the element using html2canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: "#f5f5f5",
        height: element.scrollHeight,
        windowHeight: element.scrollHeight,
        onclone: (clonedDoc, clonedElement) => {
          // Copy over styles from the original document
          const styles = Array.from(document.styleSheets);
          styles.forEach((styleSheet) => {
            try {
              const cssRules = Array.from(styleSheet.cssRules);
              const style = document.createElement("style");
              cssRules.forEach((rule) => {
                style.appendChild(clonedDoc.createTextNode(rule.cssText));
              });
              clonedElement.appendChild(style);
            } catch (e) {
              console.warn("Could not copy styles", e);
            }
          });
        },
      });

      // Create a new PDF document (A4)
      const pdf = new jsPDF({
        format: "a4",
        unit: "pt",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const contentRatio = canvas.height / canvas.width;
      const finalWidth = pageWidth;
      const finalHeight = pageWidth * contentRatio;
      const pageCount = Math.ceil(finalHeight / pageHeight);

      // Add the image to each page of the PDF
      for (let i = 0; i < pageCount; i++) {
        if (i > 0) {
          pdf.addPage();
        }
        pdf.addImage(
          canvas.toDataURL("image/jpeg", 1.0),
          "JPEG",
          0,
          0 - i * pageHeight, // Shift the image upward for each page
          finalWidth,
          finalHeight,
          undefined,
          "FAST"
        );
      }

      // Restore original inline styles and remove PDF-specific styles
      element.style.cssText = originalStyle;
      originalStyles.forEach(({ element, style }) => {
        element.style.cssText = style;
      });
      element.classList.remove("pdf-export");
      pdfStyle.remove();

      // Finally, download the generated PDF
      pdf.save(`${userName}-${reportData.interview_id?.title}-Report.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="flex w-full h-screen print:h-auto justify-center overflow-y-auto print:overflow-visible font-ubuntu p-6 ">
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
                  <img className="w-[10px] h-[10px]" src={arrow} alt="Back" />
                </button>
              )}
              <span className="text-h1">
                {userName}&apos;s {reportData.interview_id?.title} Report
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
          {/* Left Section */}
          <section className="w-full flex-[7.5]">
            {/* Video Container – hidden in PDF via the "pdf-hide" class */}
            {reportData.s3_recording_url && (
              <section className="flex justify-center pdf-hide">
                <div className="continer-player w-full h-[28rem] relative">
                  <InterviewPlayer urls={reportData.s3_recording_url} />
                </div>
              </section>
            )}

            {/* Summary Section */}
            <section className="bg-white rounded-md shadow-sm p-6 mb-6">
              <h2 className="text-h2 font-medium text-grey-7 mb-6">
                Summary
              </h2>
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

            <section className="bg-white rounded-md shadow-sm p-6 mb-6">
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
          <section className="w-full flex-[2.5] gap-5">
            <ReportScore
              goalName={goal_name}
              ReportScore={reportData.final_rating}
              skill_icon={skill_icon}
              isSharedReport={sharedReport}
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
              <section className="bg-white rounded-md p-8 pdf-hide">
                <div className="text-body2 mb-6">
                  Get a PDF version of this skill report to be shared with employers
                </div>
                <button
                  className="flex gap-2 items-center px-4 py-2 bg-[#001630] text-white hover:bg-[#062549] rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={generatePDF}
                  disabled={isGeneratingPDF}
                >
                  {isGeneratingPDF ? "Generating PDF..." : "Download PDF"}
                </button>
              </section>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default ReportContent;
