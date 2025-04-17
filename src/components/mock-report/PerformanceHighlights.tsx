import React, { useState } from 'react';
import CircularProgress from '../ui/circular-progress-bar';
import { TableSection } from './updatedReport';
import RatingScore from './RatingScore';
import { Info } from 'lucide-react';

interface PerformanceHighlightsProps {
  backgroundImage: string;
  overallScore: number | string;
  logo: string;
  reportData: {
    reportType: string;
  };
  summary: {
    performance_highlights: Array<{ criteria: string; rating: string; remarks: string }>;
    text?: string;
  };
  isEmployerReport: boolean;
  jobIllustration: string;
  screeningIllustration: string;
  mockIllustration: string;
  getPerformanceRatingStyle: (rating: string) => string;
  getRatingText: (score: number | string) => string;
  formatJobType: (jobType: string) => string;
  formatWorkplaceType: (type: "remote" | "hybrid" | "on-site") => string;
  getRatingStyles: (rating: number) => string;
  getRatingLabel: (rating: number) => string;
  companyDetails: any;
}

const PerformanceHighlights: React.FC<PerformanceHighlightsProps> = ({
  backgroundImage,
  overallScore,
  logo,
  reportData,
  summary,
  isEmployerReport,
  jobIllustration,
  screeningIllustration,
  mockIllustration,
  getPerformanceRatingStyle,
  getRatingText,
  formatJobType,
  formatWorkplaceType,
  companyDetails = {}
}) => {
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  console.log("Company details", companyDetails)
  return (
    <section id="highlights" className="rounded-lg bg-white">
      <div className="bg-white w-full space-y-4">
        {(isEmployerReport && reportData) ? (
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-h2">
                <span className="text-h2">{companyDetails?.job?.title}</span>
              </h2>
              <p className="text-body2 text-grey-6">
                {formatJobType(companyDetails?.job?.job_type)} • {formatWorkplaceType(companyDetails?.job?.work_place_type)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-[60px] h-[60px] flex items-center justify-center border rounded-full">
                <CircularProgress
                  progress={Number(overallScore) * 10}
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
                <p className="font-dm-sans text-[14px] normal-case font-normal leading-5 tracking-[0.07px] text-gray-500">
                  {reportData.reportType} Interview Score
                </p>
              </div>
            </div>
          </div>
        ) : (
          <h2 className="text-sub-header font-bold mb-6 text-gray-800 font-dm-sans">
            Performance Highlights
          </h2>
        )}

        <div
          className="flex flex-col md:flex-row items-start md:items-center rounded-lg mb-6 min-h-[230px]"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="flex items-center max-h-full p-8">
            <div className="flex h-full min-w-1/2 flex-[2] justify-center items-center sm:hidden">
              <img
                src={
                  reportData.reportType === 'Full'
                    ? jobIllustration
                    : reportData.reportType === 'Screening'
                      ? screeningIllustration
                      : mockIllustration
                }
                alt="Illustration"
              />
            </div>

            <div className="flex-col flex-[8] justify-center items-start text-left max-w-full">
              {!isEmployerReport && (
                <div className="flex items-center gap-3">
                  <div className="relative w-[60px] h-[60px] flex items-center justify-center border rounded-full">
                    <CircularProgress
                      progress={Number(overallScore) * 10}
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
                    <p className="font-dm-sans text-[14px] normal-case font-normal leading-5 tracking-[0.07px] text-gray-500">
                      {reportData.reportType} Interview Score
                    </p>
                  </div>
                </div>
              )}

              <div className="h-9 flex items-center justify-between w-full">
                <div className="mt-[14px] flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-[5px] text-sm font-medium ${getPerformanceRatingStyle(
                      getRatingText(Number(overallScore))
                    )}`}
                  >
                    <span className=' opacity-90'>Rating:</span> {getRatingText(Number(overallScore))}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowInfoDialog(true)}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                    title="What does this rating mean?"
                  >
                    <Info className="w-5 h-5" />
                  </button>
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
          rows={
            summary.performance_highlights?.map((item: any) => ({
              criteria: item.criteria,
              rating: item.rating,
              remarks: item.remarks,
            })) || []
          }
        />
      </div>

      {/* Conditionally render the rating score popup */}
      {showInfoDialog && <RatingScore onClose={() => setShowInfoDialog(false)} />}
    </section>
  );
};

export default PerformanceHighlights;
