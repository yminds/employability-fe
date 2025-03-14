import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, CheckCircle } from "lucide-react";
import ResumeUploader from "@/components/employer/ResumeUpload";
import { IJob, ProcessedResume } from "../../types/candidate";

interface UploadResumeTabProps {
  job: IJob;
  employerId?: string;
  onResumesProcessed: (resumes: ProcessedResume[]) => void;
  onSelectCandidates: (candidateIds: string[]) => void;
  selectedCandidates: string[];
  isScreening: boolean;
  onScreenCandidates: () => void;
}

const UploadResumeTab: React.FC<UploadResumeTabProps> = ({
  job,
  employerId,
  onResumesProcessed,
  onSelectCandidates,
  selectedCandidates,
  isScreening,
  onScreenCandidates,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="h-5 w-5 mr-2" />
          Upload Resumes
        </CardTitle>
        <CardDescription>
          Upload candidate resumes in PDF format for automatic processing
          and matching.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* ResumeUploader with callbacks for selection and processing */}
        <ResumeUploader
          jobId={job._id}
          employerId={employerId}
          companyId={job.company}
          onResumesProcessed={onResumesProcessed}
          onSelectCandidates={onSelectCandidates}
        />

        {/* Screen Selected Candidates Button - Only shown when candidates are selected */}
        {selectedCandidates.length > 0 && (
          <div className="mt-4 flex justify-end">
            <Button onClick={onScreenCandidates} disabled={isScreening}>
              {isScreening ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Screening...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Screen Selected Candidates ({selectedCandidates.length})
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadResumeTab;