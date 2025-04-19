import React, { useState, useEffect, useRef } from "react";
import { useGetCompanyAndJobDetailsQuery } from "@/api/InterviewInvitation";
import logo from "@/assets/skills/e-Logo.svg";
import screeningIllustration from "@/assets/reports/ScreeningIllustration.png";
import mockIllustration from "@/assets/reports/mockIllustration.png";
import mockBackground from "@/assets/reports/mockBackground.png";
import jobIllustration from "@/assets/reports/jobIllustration.png";
import InterviewPlayer from "../interview/InterviewPlayer";
import NewInterviewPlayer from "../interview/NewInterviewPlayer";
import { getRatingStyles, getRatingLabel } from "../skills-report/PerformanceHighlights";
import { useNavigate } from "react-router-dom";
import arrow from "@/assets/skills/arrow.svg";
import { Share2 } from "lucide-react";
import JobCard from "./JobDetailsCard";
import { ExperienceItem } from "@/pages/MockReportPage";
import ProfessionalExperience from "@/components/mock-report/professionalExp";
import tech_skill from "@/assets/reports/technicalSkills.png";
import problemSolving from "@/assets/reports/problemSolving.png";
import softSkills from "@/assets/reports/softSkills.png";
import Section from "./Section";
import PerformanceHighlights from "./PerformanceHighlights";
import InterviewDetails from "./InterviewDetails";
import CodeSnippetComponent from "./CodeSnippetPart";

interface UpdatedMockReportContainerProps {
  inviteId: string;
  reportData: any;
  isSharedReport: boolean;
  professionalExperience: ExperienceItem[];
  publicProfileName: string;
  profile: any;
}

export const TableSection: React.FC<{
  title: string;
  rows: Array<{ criteria: string; rating: number | string; remarks: string }>;
}> = ({ rows }) => (
  <div className="w-full pt-4">
    <div className="border rounded-xl overflow-hidden shadow-sm">
      <table className="w-full border-collapse">
        <thead className="bg-gray-50 sm:hidden">
          <tr>
            <th className="p-3 font-dm-sans text-[14px] font-medium leading-[20px] tracking-[0.21px] text-gray-600 text-left border-b w-[20%]">
              Criteria
            </th>
            <th className="p-3 font-dm-sans text-[14px] font-medium leading-[20px] tracking-[0.21px] text-gray-600 text-left border-b w-[5%]">
              Rating
            </th>
            <th className="p-3 font-dm-sans text-[14px] font-medium leading-[20px] tracking-[0.21px] text-gray-600 text-left border-b w-[75%]">
              Remarks
            </th>
          </tr>
        </thead>
        <thead className="bg-gray-50 hidden sm:block">
          <tr>
            <th className="p-3 font-dm-sans text-[14px] font-medium leading-[20px] tracking-[0.21px] text-gray-600 text-left border-b w-[20%]">
              Criteria
            </th>
          </tr>
        </thead>
        <tbody className="sm:hidden">
          {rows.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="p-3 border-b text-body2 text-grey-6">{row.criteria}</td>
              <td className="p-3 border-b text-sm text-gray-600">
                <span
                  className={`py-1 px-4 rounded-full font-dm-sans text-base font-normal leading-6 tracking-[0.08px] ${getRatingStyles(
                    Number(row.rating)
                  )}`}
                >
                  {getRatingLabel(Number(row.rating))}
                </span>
              </td>
              <td className="p-3 border-b text-body2 text-gray-600">{row.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* For smaller devices */}
      <div className="hidden sm:block">
        {rows.map((row, idx) => (
          <div key={idx} className="border-b p-4 hover:bg-gray-50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-body2 text-grey-6">{row.criteria}</div>
              <div
                className={`py-1 px-4 rounded-full text-base font-normal leading-6 tracking-[0.08px] max-w-fit ${getRatingStyles(
                  Number(row.rating)
                )}`}
              >
                {getRatingLabel(Number(row.rating))}
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-2">{row.remarks}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const UpdatedMockReportContainer: React.FC<UpdatedMockReportContainerProps> = ({
  reportData,
  isSharedReport = true,
  professionalExperience,
  inviteId,
  publicProfileName,
  profile,
}) => {
  const { data: companyAndJobDetails } = useGetCompanyAndJobDetailsQuery(inviteId, {
    skip: !inviteId,
    refetchOnMountOrArgChange: true,
  });

  const [reportTitle, setTitle] = useState("");
  const navigate = useNavigate();
  const isEmployerReport = window.location.pathname.includes("employer");

  // Determine whether to use employer_summary or summary
  const summary = isEmployerReport ? reportData.employer_summary || {} : reportData.summary || {};

  const videoUrl = reportData.s3_recording_url?.[0];
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [copyText, setCopyText] = useState("Copy");
  const [activeSection, setActiveSection] = useState("highlights");

  const sharePopupRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
// Calculate overall score based on available ratings
const calculateOverallScore = () => {
  let totalScore = 0;
  let count = 0;

  // Check technical proficiency
  if (summary.technicalProficiency?.length) {
    summary.technicalProficiency.forEach((item: any) => {
      if (typeof item.rating === "number") {
        totalScore += item.rating;
        count++;
      }
    });
  }

  // Check skill proficiency
  if (summary.skillProficiency?.length) {
    summary.skillProficiency.forEach((item: any) => {
      if (typeof item.rating === "number") {
        totalScore += item.rating;
        count++;
      }
    });
  }

  // Add problem solving if available
  if (summary.problemSolvingSkills?.score) {
    totalScore += summary.problemSolvingSkills.score;
    count++;
  }

  // Add soft skills if available
  if (summary.softskills?.score) {
    totalScore += summary.softskills.score;
    count++;
  }

  return count > 0 ? (totalScore / count).toFixed(1) : "N/A";
};

const overallScore =
  (reportData.reportType === "Full" || reportData.reportType === "Screening")
    ? 2 * Number(calculateOverallScore())
    : reportData.final_rating?.toFixed(1) || "N/A";

  // Get rating text based on score
  const getRatingText = (score: number | string) => {
    if (score === "N/A") return "N/A";
    const numScore = Number(score);
    if (numScore >= 9.1) return "Excellent";
    if (numScore >= 7.1) return "Good";
    if (numScore >= 4.1) return "Average";
    return "Poor";
  };

  const getEmpRatingText = (score: number | string) => {
    if (score === "N/A") return "N/A";
    const numScore = Number(score);
    if (numScore >= 9.1) return "Excellent";
    if (numScore >= 7.1) return "Good Fit";
    if (numScore >= 4.1) return "May Be";
    return "Not Fit";
  };


  const sections = [
    { id: "highlights", title: "Summary" },
    { id: "video", title: "Video Assessment", hidden: !videoUrl },
    { id: "tech-proficiency", title: "Technical Skills" },
    { id: "skill-proficiency", title: "Skill Proficiency" },
    { id: "professional-exp", title: "Professional experience", hidden: !isEmployerReport },
    { id: "problem-solving", title: "Problem Solving", hidden: !summary.problemSolvingSkillsDetails },
    { id: "soft-skills", title: "Soft Skills", hidden: !summary.softskills },
    { id: "screening-qst", title: "Screening Questions", hidden: !summary.screening_questions },
    { id: "conceptual-breakdown", title: "Conceptual Breakdown", hidden: !summary.conceptualBreakdown },
  ].filter((section) => !section.hidden);

  // Scroll to the selected section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  // Set up Intersection Observer for sections
  useEffect(() => {
    // Create a container for observers
    const observers: { element: HTMLElement; observer: IntersectionObserver }[] = [];

    // Options for the observer
    const options = {
      root: null, // use the viewport
      rootMargin: "-100px 0px -60% 0px", // bias toward elements at top
      threshold: 0, // trigger as soon as even 1px is visible
    };

    // Callback for the observer
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Find the first section that's intersecting
      const visibleEntry = entries.find((entry) => entry.isIntersecting);

      if (visibleEntry) {
        setActiveSection(visibleEntry.target.id);
      }
    };

    // Create observer
    const observer = new IntersectionObserver(observerCallback, options);

    // Observe all section elements
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
        observers.push({ element, observer });
      }
    });

    // Cleanup function
    return () => {
      observers.forEach(({ element, observer }) => {
        observer.unobserve(element);
      });
    };
  }, [sections]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sharePopupRef.current && !sharePopupRef.current.contains(event.target as Node)) {
        setShowSharePopup(false);
      }
    }

    if (showSharePopup) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSharePopup]);

  const handleBackBtn = () => {
    navigate("/");
  };

  const handleShareClick = () => {
    setShowSharePopup((prev) => !prev);
  };

  const getPerformanceRatingStyle = (rating: string) => {
    switch (rating) {
      case "Excellent":
        return "bg-[#DBFFEA80] border border-[rgba(3,150,63,0.2)] text-[#03963F]";
      case "Good":
        return "bg-[#FFF2DB80] border border-[rgba(240,164,34,0.2)] text-[#D48A0C]";
      case "Average":
        return "bg-[#F08F641F] border border-[rgba(66,133,244,0.2)] text-[#F08F64]";
      default:
        return "bg-[#FFE5E780] border border-gray-200 text-[#CF0C19]";
    }
  };

  const getShareUrl = (publicProfileName: string, inviteId: string) => {
    if (typeof window === "undefined") return "";
    const currentPath = window.location.pathname;
    const interviewId = currentPath.split("/").pop();
    const baseUrl = window.location.origin;
    const url = new URL(`${baseUrl}/report/${reportData.reportType}/${inviteId}/${publicProfileName}/${interviewId}`);
    return url.toString();
  };

  const shareUrl = getShareUrl(publicProfileName, inviteId);

  const formatJobType = (jobType: string) => {
    switch (jobType) {
      case "full-time":
        return "Full Time";
      case "part-time":
        return "Part Time";
      case "contract":
        return "Contract";
      case "internship":
        return "Internship";
      default:
        return jobType;
    }
  };

  function formatWorkplaceType(type: "remote" | "hybrid" | "on-site"): string {
    if (type === "on-site") return "Onsite";
    return type?.charAt(0)?.toUpperCase() + type?.slice(1);
  }

  useEffect(() => {
    if (companyAndJobDetails) {
      const { job } = companyAndJobDetails;
      if (job) {
        setTitle(job.title);
      }
    } else {
      let title = "";
      switch (reportData.reportType) {
        case "Skill":
          title = "Skill";
          break;
        case "Project":
          title = "Project";
          break;
        case "Mock":
          title = "Mock";
          break;
        default:
          title = "";
      }
      setTitle(title);
    }
  }, [companyAndJobDetails, reportData.reportType]);

  

  return (
    <main className="flex w-full h-screen justify-center sm:overflow-y-auto sm:flex-col">
      <div className="flex-col justify-center bg-[#F5F5F5] w-[95%] max-w-[1800px] h-full sm:p-0">
        {/* Header Section */}
        <div
          className="sticky top-0 left-0 p-6 h-9 bg-[#F5F5F5] sm:min-w-[200px] sm:relative max-w-[1800px]"
          style={{ zIndex: 10 }}
        >
          <header className="flex justify-between w-full">
            <div className="max-w-[70%] sm:max-w-[100%] px-4 flex flex-col gap-2">
              <h1 className="text-title text-grey-7 font-bold flex gap-4 items-center">
                {!isSharedReport && (
                  <button
                    onClick={handleBackBtn}
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
                <span className="text-h1">{reportTitle || ""} Interview Report</span>
              </h1>
            </div>

            {/* Share Button and Popup */}
            {false && (
              <div className="flex gap-4 relative">
                <button
                  className="flex gap-2 items-center px-4 py-2 rounded-md text-grey-7 hover:bg-gray-100 relative"
                  onClick={handleShareClick}
                >
                  <Share2 />
                  Share Report
                </button>
                {showSharePopup && (
                  <div
                    ref={sharePopupRef}
                    className="absolute right-0 top-[40px] bg-white border border-gray-300 rounded p-4 shadow-md min-w-[250px] z-[99]"
                    style={{ zIndex: 30 }}
                  >
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
        </div>

        {/* Main Content Section */}
        <div className="flex bg-[#f5f5f5] h-[90vh] max-w-[1800px] justify-center overflow-y-auto p-2 mt-6 sm:flex-col sm:p-1">
          {/* Left Navigation Panel */}
          <div className="flex max-w-[260px] rounded-lg w-full h-fit overflow-y-auto sm:hidden" ref={navRef}>
            <nav className="bg-white w-full p-6 sticky top-4">
              <h2 className="text-sub-header font-semibold mb-4">Content</h2>
              <ul className="list-none space-y-2">
                {sections.map((section) => (
                  <li key={section.id} id={`nav-${section.id}`}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-4 py-3 rounded-md transition flex items-center h-9 text-body2 truncate
                        ${
                          activeSection === section.id
                            ? "bg-[#00183D1A] bg-opacity-10"
                            : "text-[#001630] hover:bg-gray-100"
                        }`}
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Right Content Panel - Container for all sections to be observed */}
          <div className="flex-[8] px-6 h-full overflow-y-auto minimal-scrollbar space-y-2" ref={contentRef}>
            <div>
              {companyAndJobDetails ? (
                <section className="sticky top-0 z-[4] w-full bg-[#F5F5F5]">
                  <JobCard
                    jobDetails={companyAndJobDetails}
                    takenAT={reportData.createdAt}
                    isEmployer={isEmployerReport}
                    profile={profile}
                    inviteId={inviteId}
                  />
                </section>
              ) : (
                <section className="sticky top-0 z-[4] w-full bg-[#F5F5F5]">
                  <InterviewDetails takenAt={reportData.createdAt} interviewType={reportData.reportType} />
                </section>
              )}
            </div>

            <div className="space-y-2">
              {/* 1. Performance Highlights */}
              <section id="highlights" className="rounded-lg p-8 shadow-sm bg-white sm:p-4">
                {(companyAndJobDetails || reportData.reportType === "Skill" || reportData.reportType === "Project") && (
                  <PerformanceHighlights
                    backgroundImage={mockBackground}
                    overallScore={overallScore}
                    logo={logo}
                    reportData={reportData}
                    summary={summary}
                    isEmployerReport={isEmployerReport}
                    jobIllustration={jobIllustration}
                    screeningIllustration={screeningIllustration}
                    mockIllustration={mockIllustration}
                    getPerformanceRatingStyle={getPerformanceRatingStyle}
                    getRatingText={getRatingText}
                    getEmpRatingText={getEmpRatingText}
                    formatJobType={formatJobType}
                    formatWorkplaceType={formatWorkplaceType}
                    getRatingStyles={getRatingStyles}
                    getRatingLabel={getRatingLabel}
                    companyDetails={companyAndJobDetails}
                  />
                )}
              </section>

              {/* 2. Interview Recording */}
              {videoUrl && (
                <section id="video" className="bg-white rounded-lg overflow-hidden p-8 sm:p-4">
                  <h2 className="text-sub-header font-bold text-gray-800 font-dm-sans">Video Assessment</h2>
                  <div className="relative mt-6">
                    <div className="continer-player w-full h-[70vh] sm:h-[30vh] relative">
                      {reportData?.s3_recording_url.length > 1 ? (
                        <InterviewPlayer urls={reportData.s3_recording_url} />
                      ) : (
                        <NewInterviewPlayer url={reportData.s3_recording_url[0]} />
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* 3. Technical Proficiency */}
              {summary.technicalProficiency && summary.technicalProficiency.length  > 0 && (
                <Section
                  id="tech-proficiency"
                  title="Technical Proficiency"
                  imageSrc={tech_skill}
                  data={summary.technicalProficiency.map((item: any) => ({
                    criteria: item.concepts,
                    rating: item.rating,
                    remarks: item.remarks,
                  }))}
                />
              )}

              {/* Skill Proficiency */}
              {summary.skillProficiency && summary.skillProficiency.length > 0 && (
                <Section
                  id="skill-proficiency"
                  title="Skill Proficiency"
                  imageSrc={tech_skill}
                  data={summary.skillProficiency.map((item: any) => ({
                    criteria: item.skill,
                    rating: item.rating,
                    remarks: item.remarks,
                  }))}
                />
              )}

              {/* Problem Solving Skills */}
              {summary.problemSolvingSkillsDetails && summary.problemSolvingSkillsDetails.length >0  && (
                <Section
                  id="problem-solving"
                  title="Problem Solving Skills"
                  imageSrc={problemSolving}
                  data={summary.problemSolvingSkillsDetails.map((item: any) => ({
                    criteria: item.criteria,
                    rating: item.rating,
                    remarks: item.remarks,
                  }))}
                />
              )}

              {/* 6. Soft Skills */}
              {summary.soft_skills && (
                <Section
                  id="soft-skills"
                  title="Soft Skills"
                  imageSrc={softSkills}
                  data={summary.soft_skills.map((item: any) => ({
                    criteria: item.concept,
                    rating: item.rating,
                    remarks: item.reason,
                  }))}
                />
              )}

              {/* 7. Conceptual Breakdown */}
              {summary.conceptualBreakdown && summary.conceptualBreakdown.concepts.length >0  && (
                <Section
                  id="conceptual-breakdown"
                  title="Conceptual Breakdown"
                  imageSrc={softSkills}
                  data={summary.conceptualBreakdown.concepts.map((item: any) => ({
                    criteria: item.criteria,
                    rating: item.rating,
                    remarks: item.remarks,
                  }))}
                />
              )}

              {reportData.reportType === "Project" && reportData.codeSnippetReport.length > 0  && <CodeSnippetComponent snippets={reportData.codeSnippetReport} />}
              {/* 8. Professional Experience */}
              {isEmployerReport && (
                <section id="professional-exp" className="rounded-lg p-8 shadow-sm bg-white sm:p-4">
                  <ProfessionalExperience experiences={professionalExperience} />
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UpdatedMockReportContainer;
