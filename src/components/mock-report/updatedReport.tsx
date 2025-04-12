import React, { useState, useEffect } from "react";
import { useGetCompanyAndJobDetailsQuery } from '@/api/InterviewInvitation';
import CircularProgress from "../ui/circular-progress-bar";
import logo from "@/assets/skills/e-Logo.svg";
import screeningIllustration from "@/assets/reports/ScreeningIllustration.png"
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
import softSkills from "@/assets/reports/softSkills.png"

interface UpdatedMockReportContainerProps {
	inviteId: string;
	reportData: any;
	isSharedReport: boolean;
	professionalExperience: ExperienceItem[];
	publicProfileName: string;
}

const TableSection: React.FC<{
	title: string;
	rows: Array<{ criteria: string; rating: number | string; remarks: string }>;
}> = ({ rows }) => (
	<div className="w-full pt-4">
		<div className="border rounded-xl overflow-hidden shadow-sm">
			<table className="w-full border-collapse">
				<thead className="bg-gray-50">
					<tr>
						<th className="p-3 font-dm-sans text-[14px] font-medium leading-[20px] tracking-[0.21px] text-gray-600 text-left border-b">Criteria</th>
						<th className="p-3 font-dm-sans text-[14px] font-medium leading-[20px] tracking-[0.21px] text-gray-600 text-left border-b">Rating</th>
						<th className="p-3 font-dm-sans text-[14px] font-medium leading-[20px] tracking-[0.21px] text-gray-600 text-left border-b">Remarks</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((row, idx) => (
						<tr key={idx} className="hover:bg-gray-50">
							<td className="p-3 border-b text-body2 text-grey-6">{row.criteria}</td>
							<td className="p-3 border-b text-sm text-gray-600">
								<span className={`p-3 rounded-full text-sm text-gray-600"> font-medium bg-none ${getRatingStyles(Number(row.rating))} `}>
									{getRatingLabel(Number(row.rating))}
								</span>
							</td>
							<td className="p-3 border-b text-body2  text-gray-600">{row.remarks}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	</div>
);

const UpdatedMockReportContainer: React.FC<UpdatedMockReportContainerProps> = ({ reportData, isSharedReport = true, professionalExperience, inviteId, publicProfileName }) => {
	console.log("reportdata", reportData.createdAt)
	const {
		data: companyAndJobDetails,
} = useGetCompanyAndJobDetailsQuery(inviteId);
	const [reportTitle, setTitle] = useState("")
	console.log("report professionalExperience", professionalExperience);
	const navigate = useNavigate();
	const isEmployerReport = true;

	// Determine whether to use employer_summary or summary
	const summary = isEmployerReport
		? reportData.employer_summary || {}
		: reportData.summary || {}

	const videoUrl = reportData.s3_recording_url?.[0];
	const [showSharePopup, setShowSharePopup] = useState(false);
	const [copyText, setCopyText] = useState("Copy");
	console.log("reportData", reportData.s3_recording_url);
	const [activeSection, setActiveSection] = useState("highlights");

	// Calculate overall score based on available ratings
	const calculateOverallScore = () => {
		let totalScore = 0;
		let count = 0;

		// Check technical proficiency
		if (summary.technicalProficiency?.length) {
			summary.technicalProficiency.forEach((item: any) => {
				if (typeof item.rating === 'number') {
					totalScore += item.rating;
					count++;
				}
			});
		}

		// Check skill proficiency
		if (summary.skillProficiency?.length) {
			summary.skillProficiency.forEach((item: any) => {
				if (typeof item.rating === 'number') {
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

	const overallScore = calculateOverallScore();
	const sharePopupRef = React.useRef<HTMLDivElement>(null);

	// Get rating text based on score
	const getRatingText = (score: number | string) => {
		if (score === "N/A") return "N/A";
		const numScore = Number(score);
		if (numScore >= 8.5) return "Excellent";
		if (numScore >= 7) return "Good";
		if (numScore >= 5) return "Average";
		return "Needs Improvement";
	};

	const sections = [
		{ id: "highlights", title: "Summary" },
		{ id: "video", title: "Video Assessment", hidden: !videoUrl },
		{ id: "tech-proficiency", title: "Technical Skills" },
		{ id: "skill-proficiency", title: "Skill Proficiency" },
		{ id: "professional-exp", title: "Professional experience", hidden: !isEmployerReport },
		{ id: "problem-solving", title: "Problem Solving", hidden: !summary.problemSolvingSkills },
		{ id: "soft-skills", title: "Soft Skills", hidden: !summary.softskills },
		{ id: "screening-qst", title: "Screening Questions", hidden: !summary.screening_questions },
		// { id: "concept-ratings", title: "Concept Ratings" },
		// { id: "specific-questions", title: "Specific Questions" },
		// { id: "conceptual-breakdown", title: "Conceptual Breakdown" },
		// { id: "cheat-analysis", title: "Cheat Analysis" },
	].filter(section => !section.hidden);

	// Scroll to the selected section but give some gap for the sticky header
	const scrollToSection = (sectionId: string) => {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
			setActiveSection(sectionId);
		}
	};

	// Update active section based on scroll position
	useEffect(() => {
		const handleScroll = () => {
			for (const section of sections) {
				const element = document.getElementById(section.id);
				if (element) {
					const rect = element.getBoundingClientRect();
					if (rect.top <= 100 && rect.bottom >= 100) {
						setActiveSection(section.id);
						break;
					}
				}
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
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
			case 'Excellent':
				return 'bg-[#ECFFF4] border border-[rgba(3,150,63,0.2)] text-green-800';
			case 'Good':
				return 'bg-[#FFF8ED] border border-[rgba(240,164,34,0.2)] text-yellow-800';
			case 'Average':
				return 'bg-[#F0F4FF] border border-[rgba(66,133,244,0.2)] text-blue-800';
			default:
				return 'bg-gray-100 border border-gray-200 text-gray-700';
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
	
	useEffect(() => {
		console.log("companyAndJobDetails", companyAndJobDetails);
		if (companyAndJobDetails) {
			const { job } = companyAndJobDetails;
			if (job) {
				setTitle(job.title);
			}
		}
	},[companyAndJobDetails]
	)
	return (
		<main className=" flex w-full h-screen justify-center sm:overflow-y-auto sm:flex-col">
			<div className=" flex-col justify-center bg-[#F5F5F5] w-[95%] max-w-[1800px] h-full sm:p-0">
				{/* Header Section */}
				<div className="sticky top-0 left-0 p-6 h-9 bg-[#F5F5F5] sm:min-w-[200px] sm:relative max-w-[1800px]" style={{ zIndex: 10 }}>
					<header className=" flex justify-between w-full ">
						<div className="max-w-[70%] px-4 flex flex-col gap-2">
							<h1 className="text-title text-grey-7 font-bold flex gap-4 items-center">
								{(!isSharedReport) && (
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
									<div ref={sharePopupRef} className="absolute right-0 top-[40px] bg-white border border-gray-300 rounded p-4 shadow-md min-w-[250px] z-[99]" style={{ zIndex: 30 }}>
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
				<div className="flex bg-[#f5f5f5] h-[90vh] max-w-[1800px] justify-center overflow-y-auto p-2 mt-6">


					{/* Left Navigation Panel */}
					<div className=" flex max-w-[260px] rounded-lg  h-fit overflow-y-auto">
						<nav className=" bg-white w-full p-6">
							<h2 className="text-sub-header font-semibold mb-4">Content</h2>
							<ul className=" list-none space-y-2">
								{sections.map((section) => (
									<li key={section.id} >
										<button
											onClick={() => scrollToSection(section.id)}
											className={`w-full text-left px-4 py-3 rounded-md hover:bg-gray-100 transition flex items-center h-9 ${activeSection === section.id
												? 'bg-gray-200 text-gray-700 font-medium'
												: 'text-gray-700'
												}`}
										>
											{section.title}
										</button>
									</li>
								))}
							</ul>
						</nav>
					</div>

					{/* Right Content Panel */}
					<div className="flex-[8] px-6 h-full overflow-y-auto minimal-scrollbar">

						<div className="space-y-4">
							{companyAndJobDetails && (
								<section className="sticky top-0 z-[4] w-full bg-[#F5F5F5] ">
								<JobCard jobDetails={companyAndJobDetails} takenAT={reportData.createdAt} />
							</section>
							)}
							{/* 1. Performance Highlights */}
							<section id="highlights" className="rounded-lg p-8 shadow-sm bg-white ">
								<div className="bg-white w-full">
									<h2 className="text-sub-header font-bold mb-6 text-gray-800 font-dm-sans">Performance Highlights</h2>
									<div
										className="flex flex-col md:flex-row items-start md:items-center rounded-lg mb-6 min-h-[230px]"
										style={{
											backgroundImage: `url(${mockBackground})`,
											backgroundSize: "cover",
											backgroundPosition: "center",
										}}
									>
										<div className="flex items-center max-h-full p-8">
											<div className="flex h-full min-w-1/2 flex-[2] justify-center items-center">
												<img src={reportData.reportType === "Full" ? jobIllustration : reportData.reportType === "Screening" ? screeningIllustration : mockIllustration } alt="Illustration" />
											</div>

											<div className="flex-col flex-[8] justify-center items-start text-left max-w-full">
												<div className="flex items-center gap-3">
													<div className="relative w-[60px] h-[60px] flex items-center justify-center border rounded-full">
														{/* Circular Progress Bar */}
														<CircularProgress
															progress={overallScore ? Number(overallScore) * 10 : 0}
															size={60}
															strokeWidth={6}
															showText={false}
														/>
														<img className="absolute w-8 h-8" src={logo} alt="short logo" />
													</div>
													<div>
														<p className="text-2xl font-bold text-gray-900">
															{overallScore || "N/A"}
															<span className="text-[20px] font-medium leading-[26px] text-[#00000099]">/10</span>
														</p>
														<p className=" font-dm-sans text-[14px] normal-case font-normal leading-5 tracking-[0.07px] text-gray-500">Mock Interview Score</p>
													</div>
												</div>
												<div className=" h-9 flex items-center justify-between w-full">
													<div className="mt-[14px]">
														<span
															className={`px-3 py-1 rounded-[5px] text-sm font-medium ${getPerformanceRatingStyle(getRatingText(overallScore))}`}
														>
															Rating: {getRatingText(overallScore)}
														</span>
													</div>

												</div>
												<div className="flex-1 mt-[14px] w-[95%]">
													<p className="text-body2 text-grey-6 leading-relaxed">
														{summary.text ||
															"You demonstrated strong React fundamentals and problem-solving skills. Showed excellence at component design and state management but need to refine performance optimization techniques."}
													</p>
												</div>
											</div>
										</div>
									</div>

									<TableSection
										title="Performance Highlights"
										rows={summary.performance_highlights?.map((item: any) => ({
											criteria: item.criteria,
											rating: item.rating,
											remarks: item.remarks,
										})) || []}
									/>
								</div>
							</section>

							{/* 2. Interview Recording */}
							{videoUrl && (
								<section id="video" className="bg-white rounded-lg overflow-hidden p-8">
									<h2 className="text-xl font-semibold ">Video Assessment</h2>
									<div className=" relative mt-6 ">
										<div className="continer-player w-full h-[70vh] relative">
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
							{summary.technicalProficiency && (
								<section id="tech-proficiency" className="rounded-lg p-8 shadow-sm bg-white">
									<div className=" flex gap-2 items-center">
										<img src={tech_skill} alt="" className=" p-1 object-contain border rounded-full" />
										<h2 className="text-sub-header font-bold text-gray-800 font-dm-sans">Technical Proficiency</h2>
									</div>
									<TableSection
										title="Technical Proficiency"
										rows={summary.technicalProficiency?.map((item: any) => ({
											criteria: item.concepts,
											rating: item.rating,
											remarks: item.remarks,
										})) || []}
									/>
								</section>
							)}


							{/* 4. Skill Proficiency only if there is data inside it*/}
							{summary.skillProficiency && summary.skillProficiency.length > 0 && (
								<section id="skill-proficiency" className="rounded-lg p-8 shadow-sm bg-white">
									<div className=" flex gap-2 items-center">
										<img src={tech_skill} alt="" className=" p-1 object-contain border rounded-full" />
										<h2 className="text-sub-header font-bold text-gray-800 font-dm-sans">Skill Proficiency</h2>
									</div>
									<TableSection
										title="Skill Proficiency"
										rows={summary.skillProficiency?.map((item: any) => ({
											criteria: item.skill,
											rating: item.rating,
											remarks: item.remarks,
										})) || []}
									/>
								</section>
							)}


							{/* 5. Problem Solving Skills */}
							{summary.problemSolvingSkillsDetails && (
								<section id="problem-solving" className="rounded-lg p-8 shadow-sm bg-white">
									<div className=" flex gap-2 items-center">
										<img src={problemSolving} alt="" className=" p-1 object-contain border rounded-full" />
										<h2 className="text-sub-header font-bold text-gray-800 font-dm-sans">Problem Solving Skills</h2>
									</div>
									<h2 className="text-sub-header font-bold text-gray-800 font-dm-sans"></h2>
									<TableSection
										title="Problem Solving Skills"
										rows={summary.problemSolvingSkillsDetails.map((item: any) => ({
											criteria: item.criteria,
											rating: item.rating,
											remarks: item.remarks,
										})) || []}
									/>
								</section>

							)}

							{/* 6. Conceptual Breakdown */}

							<section id="soft-skills" className="rounded-lg p-8 shadow-sm bg-white">
								<div className=" flex gap-2 items-center">
									<img src={softSkills} alt="" className=" p-1 object-contain border rounded-full" />
									<h2 className="text-sub-header font-bold text-gray-800 font-dm-sans">Skill Proficiency</h2>
								</div>
								<TableSection
									title="Conceptual Breakdown"
									rows={summary.softskills?.map((item: any) => ({
										criteria: item.concept,
										rating: item.rating,
										remarks: item.reason,
									})) || []}
								/>
							</section>


							{/* 7. Cheat Analysis */}
							{isEmployerReport && (
								<section id="professional-exp" className="rounded-lg p-8 shadow-sm bg-white">
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
