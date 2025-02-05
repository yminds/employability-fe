import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import arrow from "@/assets/skills/arrow.svg";
import { useNavigate } from "react-router-dom";
import { useGetReportByInterviewIdQuery, useUpdateReportSummaryMutation } from "@/api/reportApiSlice";

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
    console.log(userExp)

    const navigate = useNavigate();
    const [reportData, setReport] = useState(null)
    // Fetch report data
    const { data: fetchReportData, isLoading: reportLoading, error: reportError } = useGetReportByInterviewIdQuery("67a31776fd573660add2be48");

    useEffect(() => {
        if (fetchReportData?.data) {
            setReport(fetchReportData?.data)
        }
    }, [fetchReportData])

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

    if (reportLoading) return <LoadingState />;
    if (reportError) return <div className="text-red-500 text-center mt-10">Error fetching report data</div>;

    return (
        <>
            {reportData &&
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
                                    <span>{userName}&apos;s {reportData?.interview_id.title} Report</span>
                                </h1>
                            </div>
                        </header>

                        {/* Main Content */}
                        <main className="max-w-6xl mx-auto px-4">
                            {/* Summary Section */}
                            <section className="bg-white rounded-md shadow-sm p-6 mb-8">
                                <h2 className="text-h2 font-medium text-grey-7 mb-3">
                                    Overall Summary
                                </h2>
                                <p className="text-body2 text-grey-6 leading-relaxed">
                                    {reportData?.summary || "No summary available"}
                                </p>
                            </section>

                            {/* Competency Breakdown */}
                            <section>
                                <h2 className="text-h2 font-medium text-grey-7 mb-4">
                                    Competency Breakdown
                                </h2>
                                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
                                    {reportData?.concept_ratings?.map((rating: { concept: string; rating: number; reason: string }, index: number) => (
                                        <Card key={index} className="bg-white border border-grey-2 rounded-md shadow-sm">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-sub-header font-medium text-grey-7">
                                                        {rating.concept}
                                                    </h3>
                                                    <Badge className={`${getRatingColor(rating.rating)} px-3 py-1`}>
                                                        {rating.rating}/5
                                                    </Badge>
                                                </div>
                                                <p className="text-body2 text-grey-6">{rating.reason}</p>
                                            </CardContent>
                                        </Card>
                                    )) || <p className="text-grey-5">No competency ratings available</p>}
                                </div>
                            </section>
                        </main>

                        {/* Footer */}
                        <footer className="mt-8 py-6 border-grey-2">
                            <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row sm:justify-between text-body2 text-grey-5 gap-2">
                                <span>
                                    Report ID: <span className="font-medium">{reportData?._id || "N/A"}</span>
                                </span>
                                <span>Last updated: {reportData?.updatedAt ? new Date(reportData.updatedAt).toLocaleString() : "N/A"}</span>
                            </div>
                        </footer>
                    </div>
                </div>
            }
        </>
    );
};

export default ReportPage;
