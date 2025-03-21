import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useGetUserGoalQuery } from "@/api/predefinedGoalsApiSlice";
import SkillList from "@/components/skills/skillslist";
import TryThingsSection from "@/features/dashboard/TryThingsSection";
import MyActivityCard from "@/features/dashboard/MyActivity";
import ProjectList from "@/components/projects/ProjectList";
import InterviewList from "@/features/dashboard/InterviewInvitationsList";
import { useGetUserDetailsQuery } from "@/api/userApiSlice";
import { useGetUserSkillsMutation } from "@/api/skillsApiSlice";
import { useGetProjectsByUserIdQuery } from "@/api/projectApiSlice";
import EmployabilityBannerSection from "@/features/dashboard/EmployabilityBanner";
import SkillProgress from "@/features/dashboard/SkillCard";
import SetGoalCard from "@/features/dashboard/SetGoalCard";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogDescription } from "@radix-ui/react-dialog";
import emojiWavingImg from "@/assets/dashboard/emoji_waving.svg";
import GoalCyborgImg from "@/assets/dashboard/set_goal_cyborg.svg";
import ProfessionalGoalsImg from "@/assets/dashboard/professional_goals.svg";
import logo from "@/assets/skills/e-Logo.svg";
import CircularProgress from "@/components/ui/circular-progress-bar";
import { useNavigate } from "react-router-dom";
import ProfileAvatar from "@/assets/profile/ProfileAvatar.svg";
import { useGetInvitesByUserIdQuery } from "@/api/interviewApiSlice";

// Skeleton Components
const SkillCardSkeleton = () => (
  <div className="w-full">
    {/* Header section skeleton */}
    <div className="flex justify-between items-center mb-4">
      <div className="h-6 w-80 bg-gray-200 rounded animate-pulse"></div>
      <div className="flex items-center h-[46px] rounded-lg bg-white pl-4">
        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mr-2"></div>
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>

    {/* Main content skeleton */}
    <div className="bg-white rounded-lg p-8 pl-10">
      <div className="flex">
        {/* Iterate 4 times for each progress section */}
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="flex-1">
            <div className="px-4">
              {/* Title skeleton */}
              <div className="h-7 w-24 bg-gray-200 rounded mb-4 animate-pulse"></div>

              {/* Progress indicator and line */}
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                {index < 4 && (
                  <div className="h-0.5 bg-gray-200 flex-1 ml-5 animate-pulse"></div>
                )}
              </div>

              {/* Progress value and status */}
              <div className="mt-4">
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-200 rounded mt-1 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const SkillListSkeleton = () => (
  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
    <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="flex-1">
            <div className="h-4 w-48 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
);

interface Props {
  isDashboard: boolean;
  displayScore: boolean;
}

interface Goal {
  id: string;
  name: string;
  experience: string;
}

interface GoalsData {
  data: Goal[];
}

const Dashboard: React.FC<Props> = () => {
  const [journeyDialog, setJourneyDialog] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<{
    _id: string;
    name: string;
    experience: string;
  } | null>(null);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [verifiedSkillsCount, setVerifiedSkillsCount] = useState(0);
  const [totalMandatorySkillsCount, setTotalMandatorySkillsCount] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [verifiedProjects, setVerifiedProjects] = useState(0);
  const [completedProfileSections, setCompletedProfileSections] = useState(0);
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);
  // const token = useSelector((state:RootState)=>state.auth.token);
  const user_id = user ? user._id : "";
  const user_name = user ? user.name : "";
  const profile_image = user ? user.profile_image : "";
  const experience_level = user ? user.experience_level : "";

  // Queries and Mutations
  const { data: userDetails, isLoading: isUserDetailsLoading } =
    useGetUserDetailsQuery(user_id);

  const {
    data: goalsData,
    isLoading: isGoalsLoading,
    isFetching: isGoalsFetching,
    refetch: refetchGoals,
  } = useGetUserGoalQuery(user_id, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: userProjects,
    isLoading: isProjectsLoading,
    refetch: refetchProjects,
  } = useGetProjectsByUserIdQuery({
    userId: user_id,
    goalId: currentGoal?._id,
  });

  const [getUserSkills, { data: skillsData, isLoading: isSkillsLoading }] =
    useGetUserSkillsMutation();

  const { data: invitesData, isLoading: isInvitesLoading, error: invitesError } = useGetInvitesByUserIdQuery(user_id);

  // Define hasGoals first
  const hasGoals = goalsData?.data && goalsData.data.length > 0;
  
  // Unified loading state that covers all data fetching operations
  const isInitialLoading = isGoalsLoading || isUserDetailsLoading;
  const isAnyDataNull = !goalsData || (hasGoals && (!userProjects || !skillsData || !invitesData));
  const isContentLoading =
    isGoalsFetching || isProjectsLoading || isSkillsLoading || isInvitesLoading || isAnyDataNull;

  const is_Email_Verified = userDetails?.data?.is_email_verified;

  // Calculate project percentage based on mandatory skills usage
  const calculateProjectPercentage = useCallback(() => {
    if (skillsData?.data?.mandatory && userProjects?.data) {
      const mandatorySkills = skillsData.data.mandatory.map(
        (skill) => skill.skill_pool_id.name
      );
      const verifiedProjects = userProjects.data.filter(
        (project) => project.status === "Verified"
      );

      if (verifiedProjects.length === 0) return 0;

      // Calculate percentage for each verified project based on mandatory skills usage
      const projectPercentages = verifiedProjects.map((project) => {
        const usedMandatorySkills = project.tech.filter((tech) =>
          mandatorySkills.includes(tech.name)
        ).length;
        return (usedMandatorySkills / mandatorySkills.length) * 100;
      });

      // Calculate average percentage across all verified projects
      const totalPercentage = projectPercentages.reduce(
        (acc, curr) => acc + curr,
        0
      );
      return Math.round(totalPercentage / verifiedProjects.length);
    }
    return 0;
  }, [skillsData, userProjects]);

  // Update project and skill stats when data changes
  useEffect(() => {
    if (skillsData?.data?.mandatory && userProjects?.data) {
      // Project percentage calculation
      const projectPercentage = calculateProjectPercentage();
      setVerifiedProjects(projectPercentage);
      setTotalProjects(100); // Since we're working with percentage for projects

      // Actual count for skills verification
      const mandatorySkills = skillsData.data.mandatory;
      setTotalMandatorySkillsCount(mandatorySkills.length);
      const verifiedCount = mandatorySkills.filter(
        (skill) => skill.verified_rating >= 4
      ).length;
      setVerifiedSkillsCount(verifiedCount);
    }
  }, [skillsData, userProjects, calculateProjectPercentage]);

  // Fetch skills when goal changes
  const fetchSkills = useCallback(async () => {
    if (user_id && currentGoal?._id) {
      try {
        await getUserSkills({
          userId: user_id,
          goalId: currentGoal._id,
        }).unwrap();
      } catch (err) {
        console.error("Error fetching skills:", err);
      }
    }
  }, [user_id, currentGoal, getUserSkills]);

  useEffect(() => {
    if (currentGoal) {
      fetchSkills();
    }
  }, [currentGoal, fetchSkills]);

  // Handle goal change
  const handleGoalChange = async (goalId: string) => {
    const newGoal = goalsData?.data?.find((g) => g._id === goalId);
    if (newGoal) {
      setCurrentGoal({
        _id: newGoal._id,
        name: newGoal.name,
        experience: newGoal.experience || "",
      });
      await Promise.all([refetchProjects(), fetchSkills()]);
    }
  };

  // Initialize current goal
  useEffect(() => {
    if (goalsData?.data && goalsData?.data?.length > 0 && !currentGoal) {
      const firstGoal = goalsData.data[0];
      // Add a type guard to ensure experience exists
      if (firstGoal.experience) {
        setCurrentGoal({
          _id: firstGoal._id,
          name: firstGoal.name,
          experience: firstGoal.experience, // Now TypeScript knows this is string
        });
      }
    }
  }, [goalsData, currentGoal]);

  // Calculate profile completion
  useEffect(() => {
    if (userDetails?.data) {
      let completedCount = 0;
      if (isBasicInfoComplete(userDetails.data)) completedCount += 25;
      if (isExperienceComplete(userDetails.data)) completedCount += 25;
      if (isEducationComplete(userDetails.data)) completedCount += 25;
      if (isCertificationComplete(userDetails.data)) completedCount += 25;
      setCompletedProfileSections(completedCount);
    }
  }, [userDetails]);

  // Refetch data when updates occur
  useEffect(() => {
    if (isUpdated) {
      refetchGoals();
      setIsUpdated(false);
    }
  }, [isUpdated, refetchGoals]);

  // Helper functions for profile completion
  const isBasicInfoComplete = (user: any) => {
    return !!(
      user?.name &&
      user?.email &&
      user?.phone_number &&
      user?.gender &&
      user?.address?.country &&
      user?.address?.state &&
      user?.address?.city
    );
  };

  const isExperienceComplete = (user: any) => {
    if (user?.is_experienced === false) return true;
    return Array.isArray(user?.experience) && user.experience.length > 0;
  };

  const isEducationComplete = (user: any) => {
    return Array.isArray(user?.education) && user.education.length > 0;
  };

  const isCertificationComplete = (user: any) => {
    if (user?.has_certificates === false) return true;
    return Array.isArray(user?.certificates) && user.certificates.length > 0;
  };

  return (
    <main className="h-screen w-full overflow-hidden font-ubuntu">
      <div className="h-full flex flex-col bg-[#F5F5F5]">
        <div className="flex-1 p-[55px] min-h-0">
          {isInitialLoading ? (
            // Initial loading state for the entire dashboard
            <div className="h-full flex flex-col justify-center items-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading your dashboard...</p>
            </div>
          ) : hasGoals ? (
            <div className="h-full flex flex-col">
              {/* Header */}
              <header className="flex-none mb-6">
                <h1 className="text-[#414447] text-h1 flex items-center gap-3">
                  Hey, {user_name}
                  <span className="wave">
                    <img
                      src={emojiWavingImg || "/placeholder.svg"}
                      alt="Emoji"
                      className="w-5"
                    />
                  </span>
                </h1>
              </header>

              {/* Main Content */}
              <div className="flex-1 h-[98%]">
                <div className="grid grid-cols-4 gap-2 h-full">
                  {/* Left Column */}
                  <div className="col-span-3 min-h-0 flex flex-col">
                    <div className="overflow-y-auto pr-4 scrollbar-hide">
                      <div className="flex flex-col gap-6">
                        {/* Skill Progress */}
                        <div>
                          {isContentLoading ? (
                            <SkillCardSkeleton />
                          ) : (
                            <SkillProgress
                              userId={user_id}
                              goals={goalsData}
                              selectedGoalName={currentGoal?.name}
                              onSkillsStatusChange={(isUpdated) => {
                                if (isUpdated && user_id && currentGoal?._id) {
                                  fetchSkills();
                                }
                              }}
                              onGoalChange={handleGoalChange}
                              selectedGoalExperienceLevel={
                                currentGoal?.experience
                              }
                              completedProfileSections={
                                completedProfileSections
                              }
                              verifiedSkillsCount={verifiedSkillsCount}
                              totalMandatorySkillsCount={
                                totalMandatorySkillsCount
                              }
                              verifiedProjects={verifiedProjects}
                              totalProjects={totalProjects}
                            />
                          )}
                        </div>

                        {/* Interview List */}
                        {isContentLoading ? (
                          <SkillListSkeleton />
                        ) : (
                          // Only show interview list if there are invites
                          (invitesData?.data && invitesData.data.length > 0) && (
                            <section className="bg-white shadow-sm rounded-[8px] border border-1 border-[#eee] relative">
                              <InterviewList 
                                isDashboard={true} 
                                invites={invitesData?.data}
                                onAccept={(id) => {
                                  console.log("Accept interview", id);
                                  // Add your acceptance logic here
                                }}
                                onDecline={(id) => {
                                  console.log("Decline interview", id);
                                  // Add your decline logic here
                                }}
                              />
                            </section>
                          )
                        )}

                        {/* Try Things Section */}
                        {isContentLoading ? (
                          <SkillCardSkeleton />
                        ) : (
                          <TryThingsSection />
                        )}

                        {/* Skills List */}
                        <section className="bg-white shadow-sm rounded-[8px] border border-1 border-[#eee] relative">
                          {isContentLoading ? (
                            <SkillListSkeleton />
                          ) : (
                            <SkillList
                              isDashboard={true}
                              goalId={currentGoal?._id || null}
                              onSkillsUpdate={() => fetchSkills()}
                              isSkillsUpdated={false}
                              goals={goalsData?.data.map(goal => ({
                                ...goal,
                                experience: goal.experience || ""
                              })) || []}
                              selectedGoalName={currentGoal?.name || ""}
                            />
                          )}
                        </section>

                        {/* Projects List */}
                        <section className="bg-white shadow-sm rounded-[8px] border border-1 border-[#eee] relative">
                          {isContentLoading ? (
                            <SkillListSkeleton />
                          ) : (
                            <ProjectList
                              projects={userProjects?.data}
                              isLoading={false}
                              isDashboard={true}
                              onOpenUploadModal={() => {}}
                              onOpenDeleteModal={() => {}}
                            />
                          )}
                        </section>

                        {/* Employability Banner */}
                        <EmployabilityBannerSection
                          imageSrc={ProfessionalGoalsImg}
                          altText="Professional Goals Image"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="col-span-1">
                    <div className="sticky top-0">
                      <MyActivityCard
                        displayScore={true}
                        goalId={currentGoal?._id || ""}
                        goalName={currentGoal?.name || ""}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            !isInitialLoading && (
              <div>
                <header className="mb-7">
                  <h1 className="text-gray-600 text-h1 flex items-center gap-3">
                    Hi, {user_name}
                    <span className="wave">
                      <img
                        src={emojiWavingImg || "/placeholder.svg"}
                        alt="Emoji"
                        className="w-8"
                      />
                    </span>
                  </h1>
                </header>

                <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-2 gap-4">
                  {/* Set Goal Section */}
                  <div className="col-span-3 flex flex-col gap-6 shrink-0">
                    <section className="bg-white shadow-sm rounded-[8px] p-8 border border-1 border-[#eee] relative">
                      <div className="flex w-[417px] flex-col items-start gap-2">
                        <h2 className="text-[#0C0F12] text-h2">
                          Set Your Goal
                        </h2>
                        <div className="flex flex-col items-start gap-[50px] self-stretch">
                          <p className="text-[#68696B] text-body1">
                            Define your career aspirations and get a
                            personalized roadmap to success.
                          </p>
                          <Button
                            onClick={() => setJourneyDialog(true)}
                            className="bg-[#001630] text-button text-white py-[10px] px-6 rounded hover:bg-[#062549]"
                          >
                            Start Your Journey
                          </Button>
                        </div>
                      </div>
                      <div className="flex absolute bottom-0 end-0">
                        <img
                          src={GoalCyborgImg || "/placeholder.svg"}
                          alt="Goal"
                          className="w-[500px]"
                        />
                      </div>
                    </section>

                    <EmployabilityBannerSection
                      imageSrc={ProfessionalGoalsImg}
                      altText="Professional Goals Image"
                    />
                  </div>

                  {/* Sidebar for users without goals */}
                  <div className="flex flex-col items-start gap-6 flex-1 lg:col-span-2">
                    <aside className="bg-white p-6 flex flex-col items-start self-stretch rounded-[9px] border border-[#0000000D] shadow-sm gap-3">
                      <div className="flex items-center">
                        {user?.profile_image ? (
                          <img
                            src={profile_image || "/placeholder.svg"}
                            alt="profile"
                            className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold mr-3"
                          />
                        ) : (
                          <img
                            src={ProfileAvatar || "/placeholder.svg"}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                        )}
                        <div>
                          <h3 className="text-gray-600 text-sub-header">
                            {user_name}
                          </h3>
                        </div>
                      </div>

                      <div className="p-4 w-full h-[92px] bg-green-50 rounded-lg flex items-center space-x-4">
                        <div className="relative w-[60px] h-[60px] flex items-center justify-center border rounded-full">
                          <CircularProgress
                            progress={0}
                            size={60}
                            strokeWidth={6}
                            showText={false}
                          />
                          <img
                            className="absolute w-8 h-8"
                            src={logo || "/placeholder.svg"}
                            alt="short logo"
                          />
                        </div>
                        <div>
                          <p className="text-[32px] font-bold leading-[42px] tracking-[-0.015em] text-gray-900 font-ubuntu">
                            0
                          </p>
                          <p className="text-[16px] leading-[26px] tracking-[0.015em] text-[#414447] font-['SF Pro Display']">
                            Employability Score
                          </p>
                        </div>
                      </div>
                    </aside>
                  </div>
                </div>

                {/* Set Goal Dialog */}
                <Dialog open={journeyDialog} onOpenChange={setJourneyDialog}>
                  <DialogContent className="max-w-[1400px] rounded-[12px]">
                    <DialogTitle className="hidden">Set Your Goal</DialogTitle>
                    <DialogDescription className="hidden">
                      Set your goal to get a personalized roadmap to success.
                    </DialogDescription>
                    <div className="flex flex-col items-start gap-1 flex-1">
                      <h2 className="text-[#1A1A1A] text-[32px] font-bold leading-[42px] tracking-[-0.015em] font-ubuntu">
                        Set Your Goal
                      </h2>
                    </div>
                    <hr className="pt-3" />
                    <SetGoalCard
                      setJourneyDialog={setJourneyDialog}
                      onGoalUpdate={() => {
                        setIsUpdated(true);
                      }}
                      selectedLevel={
                        experience_level === "entry"
                          ? "1"
                          : experience_level === "mid"
                          ? "2"
                          : experience_level === "senior"
                          ? "3"
                          : "all"
                      }
                    />
                  </DialogContent>
                </Dialog>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
