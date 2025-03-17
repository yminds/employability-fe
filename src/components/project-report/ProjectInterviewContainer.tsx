import type React from "react";
import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Share2 } from "lucide-react";
import html2pdf from "html2pdf.js";

import excellentIcon from "@/assets/skills/excellent.svg";
import manageSearch from "@/assets/skills/manage_search.svg";
import arrow from "@/assets/skills/arrow.svg";
import download from "@/assets/skills/download.svg";
import PerformanceHighlights from "@/components/skills-report/PerformanceHighlights";
import InterviewPlayer from "../interview/InterviewPlayer";
import { useCreateInterview } from "@/hooks/useCreateInterview";
import TechnicalSkills from "@/assets/reports/technicalSkills.png";
import ProblemSolvingSkills from "@/assets/reports/problemSolving.png";
import SoftSkills from "@/assets/reports/softSkills.png";

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
    reportType:string
  }

interface MockReportContentProps {
    reportData: Report;
    userName: string;
    handleBackToSkillsPage: () => void;
    userImg: string | undefined;
    sharedReport?: boolean;
    publicProfileName: string;
    isPublic?: boolean;
}

const getShareUrl = (publicProfileName: string) => {
    if (typeof window === "undefined") return "";
    const currentPath = window.location.pathname;
    const interviewId = currentPath.split("/").pop();
    const baseUrl = window.location.origin;
    const url = new URL(`${baseUrl}/skills-report/${publicProfileName}/${interviewId}`);
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
}) => {
    const componentRef = useRef<HTMLDivElement>(null);

    const [showSharePopup, setShowSharePopup] = useState(false);
    const [copyText, setCopyText] = useState("Copy");
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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
    const renderHeaderCard = () => {
        return (
            <section className="bg-white rounded-md p-6 mb-6 shadow-sm">
                {/* Header row for Job Title, Company, and Actions */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                        <div>
                            <img src={userImg} alt="" className=" w-10 h-10 object-cover rounded-full" />
                        </div>
                        <div>
                            <h3>{userName}</h3>
                            <p><span className=" pr-2">Web Innovators</span>Frontend Web Developer</p>  
                        </div>
                    </div>

                    {/* Example "Download report" and "More" actions */}
                    <div className="flex items-center gap-4">
                        <button className="text-sm font-medium flex gap-3 text-green-600 hover:underline" onClick={generatePDF}>
                            Download report <span className=" text-green-600"> <img src={download} alt="" /></span>
                        </button>
                        {/* <button className="w-6 h-6 inline-flex items-center justify-center text-gray-500 hover:text-gray-600">
                            <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-5 h-5"
                            >
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="19" r="1" />
                            </svg>
                        </button> */}
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded p-4">
                    <h3 className="text-sub-header mb-1">Summary</h3>
                    <p className="text-body2 text-gray-600">
                        {reportData.summary?.text || "No summary available"}   
                    </p>    
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
                            <h3 className="text-sub-header font-medium text-grey-7 flex items-center gap-2">
                                Strengths
                            </h3>
                        </div>
                        <ul className="space-y-2">
                            {reportData.summary?.strengths?.length ? (
                                reportData.summary.strengths.map((strength, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-body2 text-grey-6">{strength}</span>
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
                                    src={manageSearch || "/placeholder.svg"}
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

            {/* ----------- Performance Highlights Section ----------- */}
            <section
                className={`bg-white rounded-md shadow-sm p-8 ${isGeneratingPDF ? "mb-0" : "mb-6"
                    }`}
            >
                <PerformanceHighlights
                    highlights={reportData.summary?.performance_highlights}
                    isGeneratingPDF={isGeneratingPDF}
                />
            </section>

            {/* ----------- Detailed Skills Breakdown ----------- */}
            <section className="mb-6 bg-white rounded-xl p-8">
                {/* Technical Skills */}
                {reportData.summary?.technicalSkills && (
                    <div className="">
                        <div className=" flex justify-between mb-4">
                            <div className=" flex gap-4 items-center">
                                <img
                                    src={TechnicalSkills || "/placeholder.svg"}
                                    alt="Technical Skills"
                                    className="w-8 h-8 rounded-full border p-1" />
                                <h3 className="text-sub-header font-medium text-grey-7">
                                    Technical Skills
                                </h3>
                            </div>
                            <span className=" text-body2">Score: <span className=" text-green-600 text-body2">{reportData.summary.technicalSkills.score}/5</span></span>
                        </div>
                        <div className=" rounded-lg flex justify-between gap-6">
                            <div className=" w-1/2 bg-grey-1 p-2 rounded-lg">
                                <div className=" text-body2 text-grey-5">Strengths:</div>
                                {reportData.summary.technicalSkills.strengths?.length ? (
                                    <ul className="list-disc list-inside ml-4">
                                        {reportData.summary.technicalSkills.strengths.map(
                                            (strength, idx) => (
                                                <li key={idx} className="text-body2 text-grey-6">
                                                    {strength}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                ) : (
                                    <p className="text-body2 text-grey-6">No strengths available.</p>
                                )}
                            </div>
                            <div className=" w-1/2 bg-grey-1 p-2 rounded-lg">
                                <div className=" text-body2 text-grey-5">Areas for Improvement:</div>
                                {reportData.summary.technicalSkills.areasForImprovement?.length ? (
                                    <ul className="list-disc list-inside ml-4">
                                        {reportData.summary.technicalSkills.areasForImprovement.map(
                                            (item, idx) => (
                                                <li key={idx} className="text-body2 text-grey-6">
                                                    {item}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                ) : (
                                    <p className="text-body2 text-grey-6">
                                        No areas for improvement listed.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </section>
            <section className="mb-6 bg-white rounded-xl p-8">
                {/* Problem Solving Skills */}
                {reportData.summary?.problemSolvingSkills && (
                    <div className="">
                        <div className=" flex justify-between mb-4">
                            <div className=" flex gap-4 items-center">
                                <img
                                    src={ProblemSolvingSkills || "/placeholder.svg"}
                                    alt="Technical Skills"
                                    className="w-8 h-8 rounded-full border p-1" />
                                <h3 className="text-sub-header font-medium text-grey-7">
                                    Problem Solving Skills
                                </h3>
                            </div>
                            <span className=" text-body2"> Score: <span className=" text-green-600 text-body2">{reportData.summary.problemSolvingSkills.score}/5</span></span>
                        </div>
                        <div className="rounded-lg p-4 flex justify-between gap-6">
                            <div className="w-1/2 bg-grey-1 p-2 rounded-lg">
                                <div className=" text-body2 text-grey-5">Strengths:</div>
                                {reportData.summary.problemSolvingSkills.strengths?.length ? (
                                    <ul className="list-disc list-inside ml-4">
                                        {reportData.summary.problemSolvingSkills.strengths.map(
                                            (strength, idx) => (
                                                <li key={idx} className="text-body2 text-grey-6">
                                                    {strength}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                ) : (
                                    <p className="text-body2 text-grey-6">No strengths available.</p>
                                )}
                            </div>
                            <div className="w-1/2 bg-grey-1 p-2 rounded-lg">
                                <div className=" text-body2 text-grey-5">Areas for Improvement:</div>
                                {reportData.summary.problemSolvingSkills.areasForImprovement
                                    ?.length ? (
                                    <ul className="list-disc list-inside ml-4">
                                        {reportData.summary.problemSolvingSkills.areasForImprovement.map(
                                            (item, idx) => (
                                                <li key={idx} className="text-body2 text-grey-6">
                                                    {item}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                ) : (
                                    <p className="text-body2 text-grey-6">
                                        No areas for improvement listed.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </section>
            {/* Soft Skills */}
            <section className="mb-6 bg-white rounded-xl p-8">
                {reportData.summary?.softskills && (
                    <div className="">
                        <div className=" flex justify-between mb-4">
                            <div className=" flex gap-4 items-center">
                                <img
                                    src={SoftSkills || "/placeholder.svg"}
                                    alt="Technical Skills"
                                    className="w-8 h-8 rounded-full border p-1" />
                                <h3 className="text-sub-header font-medium text-grey-7">
                                    Soft Skills
                                </h3>
                            </div>
                            <span className=" text-body2">Score: <span className=" text-green-600 text-body2">{reportData.summary.softskills.score}/5</span></span>
                        </div>
                        <div className=" gap-6 rounded-lg p-4 flex justify-between">
                            <div className="w-1/2 bg-grey-1 p-2 rounded-lg">
                                <div className=" text-body2 text-grey-5">Strengths:</div>
                                {reportData.summary.softskills.strengths?.length ? (
                                    <ul className="list-disc list-inside ml-4">
                                        {reportData.summary.softskills.strengths.map(
                                            (strength, idx) => (
                                                <li key={idx} className="text-body2 text-grey-6">
                                                    {strength}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                ) : (
                                    <p className="text-body2 text-grey-6">No strengths available.</p>
                                )}
                            </div>
                            <div className="w-1/2 bg-grey-1 p-2 rounded-lg">
                                <div className=" text-body2 text-grey-5">Areas for Improvement:</div>
                                {reportData.summary.softskills.areasForImprovement?.length ? (
                                    <ul className="list-disc list-inside ml-4">
                                        {reportData.summary.softskills.areasForImprovement.map(
                                            (item, idx) => (
                                                <li key={idx} className="text-body2 text-grey-6">
                                                    {item}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                ) : (
                                    <p className="text-body2 text-grey-6">
                                        No areas for improvement listed.
                                    </p>
                                )}
                            </div>

                        </div>
                    </div>
                )}
            </section>

            {/* ----------- Concept Breakdown ----------- */}
            <section className="mb-6 bg-white rounded-xl p-8">
                <h2 className="text-h2 font-medium text-grey-7 mb-4">
                    Concept Breakdown
                </h2>
                <div className="grid grid-cols-1 gap-6">
                    {uniqueRatings.length ? (
                        uniqueRatings.map((rating, index) => (
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
                        <p className="text-grey-5">No competency ratings available</p>
                    )}
                </div>
            </section>
        </>
    );

    const renderRightSection = () => (
        <>
            {/* Example: a placeholder for a Score component, if any */}
            {/* 
         <ReportScore 
           userName={userName} 
           userImg={userImg} 
           ... 
         /> 
      */}
            <section className={`bg-white rounded-md shadow-sm  p-8 ${isGeneratingPDF ? "mb-0" : "mb-6"}`}>
                <div className="flex-cols gap-6">
                    {uniqueRatings.length ? (
                        uniqueRatings.map((rating, index) => (
                            <div key={index} className="py-2">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-sub-header font-medium text-grey-7">
                                        {rating.concept}
                                    </h3>
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
                </div>
            </section>

            {/* {!sharedReport && (
                <div className="flex flex-col gap-6">
                    <section
                        className={`bg-white rounded-md p-8 pdf-hide ${!isGeneratingPDF ? "" : "hidden"
                            }`}
                    >
                        <div className="text-body2 mb-6">
                            Retake the interview to refine your skill verification and achieve
                            a higher score.
                        </div>
                        {/* 
            <button
              className="flex gap-2 items-center px-4 py-2 bg-[#001630] text-white hover:bg-[#062549] rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleImproveScore}
            >
              Improve Score
            </button> 
            */}
            {/* </section>
                    <section
                        className={`bg-white rounded-md p-8 pdf-hide ${!isGeneratingPDF ? "" : "hidden"
                            }`}
                    >
                        <div className="text-body2 mb-6">
                            Get a PDF version of this skill report to share with employers.
                        </div>
                        <button
                            className="flex gap-2 items-center w-full justify-center px-4 py-2 bg-white border border-[#001630] rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={generatePDF}
                            disabled={isGeneratingPDF}
                        >
                            <img
                                className="w-4 h-4"
                                src={download || "/placeholder.svg"}
                                alt="Download PDF"
                            />
                            {isGeneratingPDF ? "Generating PDF..." : "Download PDF"}
                        </button>
                    </section>
                </div> */}

        </>
    );

    const renderInterviewPlayer = () =>
        reportData.s3_recording_url && (
            <section className="flex justify-center pdf-hide mb-6">
                <div className="continer-player w-full h-[28rem] relative">
                    <InterviewPlayer urls={reportData.s3_recording_url} />
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
                            <span className="text-h1">
                                {reportData?.reportType} Interview Report
                            </span>
                        </h1>
                    </div>

                    {/* Share Button and Popup */}
                    {/* {!sharedReport && (
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
                    )} */}
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
                            {renderHeaderCard()}
                            {!isGeneratingPDF && renderInterviewPlayer()}
                            <div className="space-y-6 mb-6">{renderRightSection()}</div>
                            <div className="space-y-6">{renderLeftSection()}</div>
                        </div>
                    </div>

                    {/* DESKTOP (1024px and up) */}
                    <div className="hidden lg:block xl:block 2xl:block">
                        <div
                            id="printable-area"
                            className="relative grid grid-cols-10 gap-6"
                        >
                            <div className="col-span-7 flex flex-col max-h-[80vh] overflow-auto minimal-scrollbar p-1">
                                {renderHeaderCard()}
                                {!isGeneratingPDF && renderInterviewPlayer()}
                                <div className="space-y-6 ">{renderLeftSection()}</div>
                            </div>
                            <div className="col-span-3 flex flex-col space-y-6">
                                {renderRightSection()}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MockReportContent;