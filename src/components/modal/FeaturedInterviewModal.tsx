import type React from "react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useGetVerifiedSkillsMutation } from "@/api/interviewDetailsApiSlice";
import { useGetReportByInterviewIdQuery } from "@/api/reportApiSlice";
import {
  useAddFeaturedInterviewMutation,
  useUpdateFeaturedInterviewMutation,
  useGetFeaturedInterviewQuery,
} from "@/api/featuredInterviewApiSlice";
import { Loader2 } from "lucide-react";

interface FeaturedInterviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedGoal: string | null;
  selectedGoalId: string | undefined;
  userId: string | undefined;
}

const FeaturedInterviewModal: React.FC<FeaturedInterviewModalProps> = ({
  open,
  onOpenChange,
  selectedGoal,
  selectedGoalId,
  userId,
}) => {
  const [getVerifiedSkills, { data: skillsData, isLoading: skillsLoading }] =
    useGetVerifiedSkillsMutation();
  const [verifiedSkills, setVerifiedSkills] = useState<any[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [bestInterviewId, setBestInterviewId] = useState<string | null>(null);
  const [selectedSkillData, setSelectedSkillData] = useState<any>(null);
  const [addFeaturedInterview, { isLoading: isAdding }] =
    useAddFeaturedInterviewMutation();
  const [updateFeaturedInterview, { isLoading: isUpdating }] =
    useUpdateFeaturedInterviewMutation();

  const { data: existingFeaturedInterview, isLoading: isLoadingExisting } =
    useGetFeaturedInterviewQuery(userId || "", {
      skip: !userId,
      refetchOnMountOrArgChange: true,
    });

  const isSaving = isAdding || isUpdating;
  const hasExistingInterview = existingFeaturedInterview?.data;

  const {
    data: reportData,
    isLoading: reportLoading,
    error: reportError,
  } = useGetReportByInterviewIdQuery(bestInterviewId || "", {
    skip: !bestInterviewId,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (open && userId && selectedGoalId) {
      fetchSkills(userId, selectedGoalId);
    }
  }, [open, userId, selectedGoalId, hasExistingInterview]);

  useEffect(() => {
    if (hasExistingInterview) {
      const featured = existingFeaturedInterview.data;

      // Set the interview ID from the existing featured interview
      if (featured.interviewId) {
        setBestInterviewId(featured.interviewId);
      }

      // Once we have verified skills loaded, find the skill that matches this interview
      if (verifiedSkills.length > 0 && featured.interviewId) {
        const matchingSkill = verifiedSkills.find(
          (skill) => skill.best_interview === featured.interviewId
        );

        if (matchingSkill) {
          setSelectedSkill(matchingSkill._id);
          setSelectedSkillData(matchingSkill);
        }
      }
    }
  }, [existingFeaturedInterview, hasExistingInterview, verifiedSkills]);

  useEffect(() => {
    if (skillsData?.data) {
      setVerifiedSkills(skillsData.data.userSkills || []);
    }
  }, [skillsData]);

  useEffect(() => {
    if (selectedSkill) {
      const skill = verifiedSkills.find((skill) => skill._id === selectedSkill);
      if (skill) {
        setSelectedSkillData(skill);
        if (skill.best_interview) {
          setBestInterviewId(skill.best_interview);
        } else {
          setBestInterviewId(null);
        }
      } else {
        setSelectedSkillData(null);
        setBestInterviewId(null);
      }
    } else {
      setSelectedSkillData(null);
      setBestInterviewId(null);
    }
  }, [selectedSkill, verifiedSkills]);

  const handleSkillChange = (skillId: string) => {
    setSelectedSkill(skillId);
  };

  const handleSaveFeaturedInterview = async () => {
    if (
      !userId ||
      !selectedGoalId ||
      !selectedSkill ||
      !bestInterviewId ||
      !reportData
    ) {
      return;
    }

    try {
      const data = {
        goalId: selectedGoalId,
        title: reportData.data?.interview_id?.title || "Featured Interview",
        duration:
          reportData.data?.duration ||
          (reportData.data?.s3_recording_url &&
          Array.isArray(reportData.data.s3_recording_url)
            ? reportData.data.s3_recording_url.length * 30
            : 0),
        date: reportData.data?.createdAt || new Date().toISOString(),
        verifiedRatingAttachment: selectedSkillData?.verified_rating || "N/A",
        interviewId: bestInterviewId,
      };

      if (hasExistingInterview) {
        await updateFeaturedInterview({
          userId,
          data,
        }).unwrap();
      } else {
        await addFeaturedInterview({ userId, data }).unwrap();
      }

      onOpenChange(false);
    } catch (err) {
      console.error("Error saving featured interview:", err);
    }
  };

  const renderReportContent = () => {
    if (!selectedSkill) {
      return (
        <div className="text-center py-6 text-muted-foreground">
          Select a skill to view your best interview report
        </div>
      );
    }

    if (!bestInterviewId) {
      return (
        <div className="text-center py-6 text-muted-foreground">
          No best interview found for this skill
        </div>
      );
    }

    if (reportLoading) {
      return (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">
            Loading report...
          </span>
        </div>
      );
    }

    if (reportError) {
      return (
        <div className="text-center py-6 text-red-500">
          Error loading report. Please try again.
        </div>
      );
    }

    if (!reportData) {
      return (
        <div className="text-center py-6 text-muted-foreground">
          No report data available
        </div>
      );
    }

    return (
      <div className="space-y-4 mt-4">
        <h4 className="font-medium">
          Best Interview Report for {selectedSkillData?.skill_pool_id?.name}
        </h4>
        <div className="bg-muted p-4 rounded-md">
          <div className="grid gap-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Title:</span>
              <span className="text-sm">
                {reportData.data?.interview_id?.title || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Duration:</span>
              <span className="text-sm">
                {reportData.data?.s3_recording_url &&
                Array.isArray(reportData.data.s3_recording_url)
                  ? `${Math.floor(
                      (reportData.data.s3_recording_url.length * 30) / 60
                    )} mins ${
                      (reportData.data.s3_recording_url.length * 30) % 60
                    } secs`
                  : reportData.data?.duration
                  ? `${Math.floor(reportData.data.duration / 60)} mins`
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Date:</span>
              <span className="text-sm">
                {reportData.data?.createdAt
                  ? new Date(reportData.data.createdAt).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Verified Rating:</span>
              <span className="text-sm">
                {selectedSkillData?.verified_rating || "N/A"}
              </span>
            </div>
          </div>

          {reportData.data?.feedback && (
            <div className="mt-4">
              <h5 className="text-sm font-medium mb-2">Feedback:</h5>
              <p className="text-sm">{reportData.data.feedback}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const fetchSkills = async (userId: string, goalId: string) => {
    try {
      await getVerifiedSkills({ userId, goalId }).unwrap();

      if (!hasExistingInterview) {
        setSelectedSkill(null);
        setBestInterviewId(null);
        setSelectedSkillData(null);
      }
    } catch (err) {
      console.error("Error fetching verified skills:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-left text-sub-header mb-4">
            Featured Interview
          </DialogTitle>
          <DialogDescription className="text-left text-body2">
            Reflect on your most outstanding interview performance that
            showcases your expertise in {selectedGoal}.
          </DialogDescription>
        </DialogHeader>

        {isLoadingExisting && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
            <span className="text-sm">
              Checking existing featured interviews...
            </span>
          </div>
        )}

        {hasExistingInterview && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
            <p className="text-sm text-amber-800 text-body2">
              You already have a featured interview. Saving will update your
              existing featured interview.
            </p>
          </div>
        )}

        <div className="py-1">
          <div className="space-y-4">
            <div>
              <label htmlFor="skill-select" className="text-body2 block mb-2">
                Select Skill to View Best Interview
              </label>
              {skillsLoading ? (
                <div className="flex items-center h-10">
                  <Loader2 className="h-4 w-4 animate-spin text-primary mr-2" />
                  <span className="text-sm text-muted-foreground">
                    Loading skills...
                  </span>
                </div>
              ) : verifiedSkills.length > 0 ? (
                <Select
                  value={selectedSkill || ""}
                  onValueChange={handleSkillChange}
                >
                  <SelectTrigger id="skill-select" className="w-full">
                    <SelectValue placeholder="Select a skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {verifiedSkills.map((skill) => (
                      <SelectItem
                        key={skill._id}
                        value={skill._id}
                        disabled={!skill.best_interview}
                      >
                        {skill.skill_pool_id?.name}
                        {!skill.best_interview &&
                          " (No best interview available)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-sm text-muted-foreground p-2 border rounded-md">
                  No verified skills found for this goal
                </div>
              )}
            </div>

            {renderReportContent()}
          </div>
        </div>

        <DialogFooter className="flex flex-row justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveFeaturedInterview}
            disabled={!selectedSkill || !bestInterviewId || isSaving}
            className="bg-[#00183d] hover:bg-[#00183d]/90 text-button text-white"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {hasExistingInterview ? "Updating..." : "Saving..."}
              </>
            ) : hasExistingInterview ? (
              "Update Featured"
            ) : (
              "Save as Featured"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeaturedInterviewModal;
