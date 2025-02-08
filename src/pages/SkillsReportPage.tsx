import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import arrow from "@/assets/skills/arrow.svg";
import { useNavigate } from "react-router-dom";
import { useGetReportByInterviewIdQuery } from "@/api/reportApiSlice";
import InterviewPlayer from "@/components/interview/InterviewPlayer";

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
  s3_recording_url: [string];
}

// Loading Component
const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-background-grey">
    <div className="space-y-2 text-center">
      <div className="animate-pulse bg-grey-2 h-4 w-48 rounded mx-auto" />
      <div className="animate-pulse bg-grey-3 h-3 w-32 rounded mx-auto" />
    </div>
  </div>
);

const ReportPage = () => {
  const userName = useSelector((state: RootState) => state.auth.user?.name);
  const userExp = useSelector((state: RootState) => state.auth.user?.experience_level);
  console.log(userExp);

  const navigate = useNavigate();

  // State to store report data
  // Use the `Report` interface; `null` when not fetched yet
  const [reportData, setReport] = useState<Report | null>(null);

  // Fetch report data
  // Adjust "67a31776fd573660add2be48" to the correct interviewId if needed
  const {
    data: fetchReportData,
    isLoading: reportLoading,
    error: reportError,
  } = useGetReportByInterviewIdQuery("67a7072c2717d685ae7a760d");
  // useGetReportByInterviewIdQuery("67a5a35c13272447be987fe9");

  useEffect(() => {
    if (fetchReportData?.data) {
      // The actual data is inside `fetchReportData.data`
      // cast it to `Report` if necessary
      setReport(fetchReportData.data as Report);
    }
  }, [fetchReportData]);

  // Badge color determination function
  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "bg-primary-green text-white";
    if (rating >= 3) return "bg-grey-4 text-white";
    return "bg-grey-5 text-white";
  };

  // Navigate back to skills page
  const handleBackToSkillsPage = () => {
    navigate("/skills");
  };

  console.log("reportData", reportData);

  if (reportLoading) return <LoadingState />;
  if (reportError) return <div className="text-red-500 text-center mt-10">Error fetching report data</div>;

  return (
    <>
      {reportData && (
        <div className="flex w-full h-screen justify-center sm:overflow-y-auto font-ubuntu p-6">
          <div className="w-full">
            {/* Header */}
            <header className="py-6 mb-8">
              <div className="max-w-6xl mx-auto px-4 flex flex-col gap-2">
                <h1 className="text-title text-grey-7 font-bold flex gap-4 items-center">
                  <button
                    onClick={handleBackToSkillsPage}
                    className="w-[30px] h-[30px] bg-white border-2 rounded-full flex justify-center items-center"
                  >
                    <img className="w-[10px] h-[10px]" src={arrow} alt="Back" />
                  </button>
                  <span>
                    {userName}&apos;s {reportData.interview_id?.title} Report
                  </span>
                </h1>
              </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4">
              {/* Summary Section */}
              {/* Summary Section */}
              {/* creat here a video pplayer by react player  */}

              <div className="flex justify-center  ">
                <div className="continer-player w-full h-[28rem] relative">
                  <InterviewPlayer urls={reportData.s3_recording_url} />
                </div>
              </div>

              <section className="bg-white rounded-md shadow-sm p-6 mb-8">
                <h2 className="text-h2 font-medium text-grey-7 mb-6">Summary</h2>

                {/* Overall Summary Text */}
                <div className="mb-8">
                  <p className="text-body2 text-grey-6 leading-relaxed">
                    {reportData.summary?.text || "No summary available"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Strengths */}
                  <div className="bg-grey-1 rounded-lg p-4">
                    <h3 className="text-sub-header font-medium text-grey-7 mb-3 flex items-center gap-2">Strengths</h3>
                    <ul className="space-y-2">
                      {reportData.summary?.strengths?.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-body2 text-grey-6">{strength}</span>
                        </li>
                      )) || <li className="text-body2 text-grey-5">No strengths available</li>}
                    </ul>
                  </div>

                  {/* Areas for Improvement */}
                  <div className="bg-grey-1 rounded-lg p-4">
                    <h3 className="text-sub-header font-medium text-grey-7 mb-3 flex items-center gap-2">
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-2">
                      {reportData.summary?.improvements?.map((improvement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-body2 text-grey-6">{improvement}</span>
                        </li>
                      )) || <li className="text-body2 text-grey-5">No improvements available</li>}
                    </ul>
                  </div>

                  {/* Performance Highlights */}
                  <div className="bg-grey-1 rounded-lg p-4">
                    <h3 className="text-sub-header font-medium text-grey-7 mb-3 flex items-center gap-2">
                      Performance Highlights
                    </h3>
                    <ul className="space-y-2">
                      {reportData.summary?.performance_highlights?.map((highlight, index) => (
                        <li key={index} className="flex items-center justify-between p-2 bg-white rounded">
                          <span className="text-body2 text-grey-6">{highlight.criteria}</span>
                          <Badge className={getRatingColor(highlight.rating)}>{highlight.rating}/5</Badge>
                        </li>
                      )) || <li className="text-body2 text-grey-5">No performance highlights available</li>}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Competency Breakdown */}
              <section>
                <h2 className="text-h2 font-medium text-grey-7 mb-4">Competency Breakdown</h2>
                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
                  {reportData.concept_ratings?.length ?? 0 > 0 ? (
                    reportData.concept_ratings?.map((rating, index) => (
                      <Card key={index} className="bg-white border border-grey-2 rounded-md shadow-sm">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sub-header font-medium text-grey-7">{rating.concept}</h3>
                            <Badge className={`${getRatingColor(rating.rating)} px-3 py-1`}>{rating.rating}/5</Badge>
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
            </main>

            {/* Footer */}
            <footer className="mt-8 py-6 border-grey-2">
              <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row sm:justify-between text-body2 text-grey-5 gap-2">
                <span>
                  Report ID: <span className="font-medium">{reportData._id || "N/A"}</span>
                </span>
                <span>
                  Last updated: {reportData.updatedAt ? new Date(reportData.updatedAt).toLocaleString() : "N/A"}
                </span>
              </div>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportPage;
