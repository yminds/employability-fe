import type React from "react"
import { useState, useCallback, useEffect } from "react"
import SetGoalCard from "@/features/dashboard/SetGoalCard"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { useGetUserGoalQuery } from "@/api/predefinedGoalsApiSlice"
import SkillList from "@/components/skills/skillslist"
import TryThingsSection from "@/features/dashboard/TryThingsSection"
import MyActivityCard from "@/features/dashboard/MyActivity"
import CircularProgress from "@/components/ui/circular-progress-bar"
import EmailVerification from "@/components/signup/EmailVerification"
import logo from "@/assets/skills/e-Logo.svg"
import emojiWavingImg from "@/assets/dashboard/emoji_waving.svg"
import GoalCyborgImg from "@/assets/dashboard/set_goal_cyborg.svg"
import ProfessionalGoalsImg from "@/assets/dashboard/professional_goals.svg"
import { DialogDescription } from "@radix-ui/react-dialog"
import EmployabilityBannerSection from "@/features/dashboard/EmployabilityBanner"
import { SkillCard } from "@/features/dashboard/SkillCard"
import { useGetUserSkillsMutation } from "@/api/skillsApiSlice"
import { useGetProjectsByUserIdQuery } from "@/api/projectApiSlice"
import ProjectList from "@/components/projects/ProjectList"
import InterviewList from "@/features/dashboard/InterviewList"
import { useGetUserDetailsQuery } from "@/api/userApiSlice"


interface Props {
  isDashboard: boolean
  displayScore: boolean
}

const Dashboard: React.FC<Props> = () => {
  const [journeyDialog, setJourneyDialog] = useState(false)
  const user = useSelector((state: RootState) => state.auth.user)
  const user_id = user ? user._id : ""
  const user_name = user ? user.name : ""
  const profile_image = user ? user.profile_image : ""
  const { data } = useGetUserDetailsQuery(user_id,{
    refetchOnMountOrArgChange: true
  }) || {}
  const userDetails = data?.data
  console.log("userDetails:", userDetails)
  const is_Email_Verified = userDetails?.is_email_verified

  const { data: goalsData } = useGetUserGoalQuery(user_id, {
    refetchOnMountOrArgChange: true,
  })
  const goalName = goalsData?.data?.[0]?.name || ""
  const goalId = goalsData?.data?.[0]?._id || ""

  const completionPercentage = 50
  const averageVerifiedPercentage = 5
  const averageVerifiedScore = 0

  const [getUserSkills, { data: skillsData }] = useGetUserSkillsMutation()
  const { data: userProjects } = useGetProjectsByUserIdQuery(user_id)
  const [verifiedSkillsCount, setVerifiedSkillsCount] = useState(0)
  const [totalMandatorySkillsCount, setTotalMandatorySkillsCount] = useState(0)
  const [totalProjects, setTotalProjects] = useState(0)
  const [verifiedProjects, setVerifiedProjects] = useState(0)
  const [completedProfileSections, setCompletedProfileSections] = useState(0)

  useEffect(() => {
    if (userDetails) {
      let completedCount = 0
      if (isBasicInfoComplete(user)) completedCount++
      if (isExperienceComplete(user)) completedCount++
      if (isEducationComplete(user)) completedCount++
      if (isCertificationComplete(user)) completedCount++

      setCompletedProfileSections(completedCount)
    }
  })

  const isBasicInfoComplete = (user: any) => {
    return !!(
      user?.name &&
      user?.email &&
      user?.phone_number &&
      user?.gender &&
      user?.address?.country &&
      user?.address?.state &&
      user?.address?.city
    )
  }

  const isExperienceComplete = (user: any) => {
    if (user?.is_experienced === false) return true
    return Array.isArray(user?.experience) && user.experience.length > 0
  }

  const isEducationComplete = (user: any) => {
    return Array.isArray(user?.education) && user.education.length > 0
  }

  const isCertificationComplete = (user: any) => {
    if (user?.has_certificates === false) return true
    return Array.isArray(user?.certificates) && user.certificates.length > 0
  }

  const fetchSkills = useCallback(
    async (userId: string | undefined, goalId: string | null) => {
      try {
        await getUserSkills({ userId, goalId }).unwrap()
      } catch (err) {
        console.error("Error fetching skills:", err)
      }
    },
    [getUserSkills],
  )

  useEffect(() => {
    if (user_id && goalId) {
      fetchSkills(user_id, goalId)
    }
  }, [user_id, goalId])

  useEffect(() => {
    if (userProjects?.data) {
      const projects = userProjects.data
      setTotalProjects(projects.length)
      const verifiedCount = projects.filter((project) => project.status === "Verified").length
      setVerifiedProjects(verifiedCount)
    }
  }, [userProjects])

  useEffect(() => {
    if (skillsData?.data?.mandatory) {
      const mandatorySkills = skillsData.data.mandatory
      setTotalMandatorySkillsCount(mandatorySkills.length)
      setVerifiedSkillsCount(mandatorySkills.filter((skill) => skill.verified_rating >= 4).length)
    }
  }, [skillsData])

  return (
    <main className="h-screen w-full overflow-y-auto minimal-scrollbar font-ubuntu">
      <div className="bg-[#F5F5F5] flex flex-col items-start gap-7 p-[55px] pt-[55px] pb-[42px] flex-1 self-stretch">
        <div className="mx-auto">
          {/* Email Verification Banner - Show only if email is not verified */}
          {!is_Email_Verified && <EmailVerification />}

          {goalsData?.data && goalsData.data.length > 0 ? (
            <main>
              <header className="mb-7">
                <h1 className="text-gray-600 text-h1 flex items-center gap-3">
                  Welcome Back, {user_name}
                  <span className="wave">
                    <img src={emojiWavingImg || "/placeholder.svg"} alt="Emoji" className="w-5" />
                  </span>
                </h1>
              </header>

              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3 flex flex-col gap-6 shrink-0">
                  {/* Goal Progress Section
                  <section className="bg-white shadow-sm rounded-[8px] p-8 border border-1 border-[#eee] relative">
                    <div className="flex flex-col items-start gap-6 self-stretch relative">
                      <div className="flex flex-col items-start gap-2">
                        <h2 className="text-[#0C0F12] text-[18px] font-medium leading-[26px] tracking-[-0.01em] font-ubuntu">
                          Goal: {goalName}
                        </h2>
                        <div className="flex flex-col items-start gap-[50px] self-stretch">
                          <p className="text-gray-500 text-[16px] font-normal leading-[26px] tracking-[0.015em] font-['SF Pro Display']">
                            You're doing great! Keep going and unlock your next milestone.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-5 self-stretch">
                        <div className="relative w-full bg-[#DBFFEA] rounded-full h-[6px]">
                          <div
                            className="bg-[#1FD167] h-[6px] rounded-full"
                            style={{ width: `${completionPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-[#1FD167] text-[24px] font-bold leading-[32px] tracking-[-0.24px] absolute end-0 top-0">
                        {completionPercentage}%
                      </span>
                    </div>
                  </section> */}

                  {/* Skill Cards */}
                  <div className="flex justify-between space-x-4">
                    <SkillCard type="profile" total={4} completedProfileSections={completedProfileSections} />
                    <SkillCard
                      type="skills"
                      total={50}
                      verifiedSkills={verifiedSkillsCount}
                      totalMandatorySkills={totalMandatorySkillsCount}
                    />
                    <SkillCard
                      type="projects"
                      total={totalProjects}
                      verifiedProjects={verifiedProjects}
                      totalProjects={totalProjects}
                    />
                    <SkillCard type="interview" total={10} />
                  </div>

                  <TryThingsSection />

                  <section className="bg-white shadow-sm rounded-[8px] border border-1 border-[#eee] relative">
                    <SkillList
                      isDashboard={true}
                      goalId={goalId}
                      onSkillsUpdate={() => {}}
                      isSkillsUpdated={false}
                      goals={goalsData}
                    />
                  </section>

                  <section className="bg-white shadow-sm rounded-[8px] border border-1 border-[#eee] relative">
                    <ProjectList
                      projects={userProjects?.data}
                      isLoading={false}
                      isDashboard={true}
                      onOpenUploadModal={() => {}}
                      onOpenDeleteModal={() => {}}
                    />
                  </section>

                  <section className="bg-white shadow-sm rounded-[8px] border border-1 border-[#eee] relative">
                    <InterviewList isDashboard={true} />
                  </section>

                  <EmployabilityBannerSection imageSrc={ProfessionalGoalsImg} altText="Professional Goals Image" />
                </div>

                {/* Sidebar */}
                <div className="flex flex-col items-start gap-6 flex-1">
                  {/* <CompleteProfileSection userId={user_id} isDashboard={true} goalId="" /> */}
                  {/* <ExampleComponent/> */}
                  <MyActivityCard displayScore={true} goalId={goalId} />
                </div>
              </div>
            </main>
          ) : (
            <main>
              {/* Content for users without goals */}
              <header className="mb-7">
                <h1 className="text-gray-600 text-h1 flex items-center gap-3">
                  Hi, {user_name}
                  <span className="wave">
                    <img src={emojiWavingImg || "/placeholder.svg"} alt="Emoji" className="w-8" />
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
                          Define your career aspirations and get a personalized roadmap to success.
                        </p>
                        <Button
                          onClick={() => setJourneyDialog(true)}
                          className="bg-[#001630] text-white py-[10px] px-6 rounded hover:bg-[#062549] text-[14px] leading-[24px] tracking-[0.015em] font-medium font-['SF Pro Display']"
                        >
                          Start Your Journey
                        </Button>
                      </div>
                    </div>
                    <div className="flex absolute bottom-0 end-0">
                      <img src={GoalCyborgImg || "/placeholder.svg"} alt="Goal" className="w-[500px]" />
                    </div>
                  </section>

                  {/* <TryThingsSection /> */}
                  <EmployabilityBannerSection imageSrc={ProfessionalGoalsImg} altText="Professional Goals Image" />
                </div>

                {/* Sidebar for users without goals */}
                <div className="flex flex-col items-start gap-6 flex-1 lg:col-span-2">
                  <aside className="bg-white p-6 flex flex-col items-start self-stretch rounded-[9px] border border-[#0000000D] shadow-sm gap-3">
                    <div className="flex items-center">
                      <img
                        src={profile_image || "/placeholder.svg"}
                        alt="profile"
                        className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold mr-3"
                      />
                      <div>
                        <h3 className="text-gray-600 text-sub-header">
                          {user_name}
                        </h3>
                      </div>
                    </div>

                    <div className="p-4 w-full h-[92px] bg-green-50 rounded-lg flex items-center space-x-4">
                      <div className="relative w-[60px] h-[60px] flex items-center justify-center border rounded-full">
                        <CircularProgress
                          progress={Number.parseFloat(averageVerifiedPercentage.toFixed(2))}
                          size={60}
                          strokeWidth={6}
                          showText={false}
                        />
                        <img className="absolute w-8 h-8" src={logo || "/placeholder.svg"} alt="short logo" />
                      </div>
                      <div>
                        <p className="text-[32px] font-bold leading-[42px] tracking-[-0.015em] text-gray-900 font-ubuntu">
                          {averageVerifiedScore}
                        </p>
                        <p className="text-[16px] leading-[26px] tracking-[0.015em] text-[#414447] font-['SF Pro Display']">
                          Employability Score
                        </p>
                      </div>
                    </div>
                  </aside>

                  <MyActivityCard displayScore={false} goalId={goalId} />
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
                  <SetGoalCard setJourneyDialog={setJourneyDialog} selectedLevel="all" />
                </DialogContent>
              </Dialog>
            </main>
          )}
        </div>
      </div>
    </main>
  )
}

export default Dashboard

