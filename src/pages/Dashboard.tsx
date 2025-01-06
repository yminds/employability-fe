import React, { useState } from "react";
import SetGoalCard from "@/features/dashboard/SetGoalCard";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from '@/store/store';
import { useGetUserGoalQuery } from "@/api/predefinedGoalsApiSlice";
import SkillList from "@/components/skills/skillslist";
import ProfileCompletionCard from "@/components/cards/ProfileCompletionCard";
import TryThingsSection from "@/features/dashboard/TryThingsSection";
import MyActivityCard from "@/features/dashboard/MyActivity";
import CircularProgress from "@/components/ui/circular-progress-bar";
import logo from '@/assets/skills/e-Logo.svg';
import emojiWavingImg from '@/assets/dashboard/emoji_waving.svg';
import GoalCyborgImg from '@/assets/dashboard/set_goal_cyborg.svg';
import ProfessionalGoalsImg from '@/assets/dashboard/professional_goals.svg';
import { DialogDescription } from "@radix-ui/react-dialog";

interface Props {
  isDashboard: boolean; // Define the prop type here
  displayScore: boolean;
}

const Dashboard: React.FC<Props> = () => {
  const [journeyDialog, setJourneyDialog] = useState(false);
  //const user_id = useSelector((state) => state.auth.user._id);
  const user = useSelector((state: RootState) => state.auth.user);
  const user_id = user ? user._id : "";
  const user_name = user ? user.name : "";
  const profile_image = user ? user.profile_image : "";

  const { data: goalsData } = "";
  // const { data: goalsData } = useGetUserGoalQuery(user_id) || "";
  const goalName = goalsData?.data?.[0]?.name || "";
  const goalId = goalsData?.data?.[0]?._id || "";

  const completionPercentage = 50;
  const averageVerifiedPercentage = 5;
  const averageVerifiedScore = 0;

  return (
    <>
      <main className="h-screen overflow-y-auto minimal-scrollbar font-ubuntu">
        <div className="bg-[#F5F5F5] flex flex-col items-start gap-7 p-[55px] pt-[55px] pb-[42px] flex-1 self-stretch">
          <div className="mx-auto">
            {goalsData ? (
              <main>
                <header className="mb-7">
                  <h1 className="text-gray-600 text-2xl font-medium leading-8 tracking-tight flex items-center gap-3">
                    Welcome Back, {user_name}
                    <span className="wave">
                      <img
                        src={emojiWavingImg}
                        alt="Emoji"
                        className="w-8"
                      />
                    </span>
                  </h1>
                </header>

                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-3 flex flex-col gap-10 shrink-0">
                    <section className="bg-white shadow-sm rounded-[8px] p-8 border border-1 border-[#eee] relative">
                      <div className="flex flex-col items-start gap-6 self-stretch relative">
                        <div className="flex flex-col items-start gap-2">
                          <h2 className="text-[#0C0F12] text-[20px] font-medium leading-[26px] tracking-[-0.2px]">Goal: {goalName}</h2>
                          <div className="flex flex-col items-start gap-[50px] self-stretch">
                            <p className="text-gray-500 text-base font-normal leading-6 tracking-[0.24px] font-sf-pro">You’re doing great! Keep going and unlock your next milestone.</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-5 self-stretch">
                          <div className="relative w-full bg-[#DBFFEA] rounded-full h-[6px]">
                            <div className="bg-[#1FD167] h-[6px] rounded-full" style={{ width: `${completionPercentage}%` }}></div>
                          </div>
                        </div>
                        <span className="text-[#1FD167] text-[24px] font-bold leading-[32px] tracking-[-0.24px] absolute end-0 top-0">{completionPercentage}%</span>
                      </div>
                    </section>

                    {/* Skills */}
                    <section className="bg-white shadow-sm rounded-[8px] border border-1 border-[#eee] relative">
                      <SkillList isDashboard={true} goalId={goalId} />
                    </section>
                  </div>

                  <div className="flex flex-col items-start gap-6 flex-1">
                    {/* Profile Sidebar */}
                    <ProfileCompletionCard />

                    {/* My Activity Sidebar */}
                    <MyActivityCard displayScore={true} goalId={goalId} />
                  </div>
                </div>

              </main>

            ) : (
              <main>
                <header className="mb-7">
                  <h1 className="text-gray-600 text-2xl font-medium leading-8 tracking-tight flex items-center gap-3">
                    Hi, {user_name}
                    <span className="wave">
                      <img
                        src={emojiWavingImg}
                        alt="Emoji"
                        className="w-8"
                      />
                    </span>
                  </h1>
                </header>
                <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-2 gap-4">
                  <div className="col-span-3 flex flex-col gap-10 shrink-0">
                    {/* Set Your Goal Section */}
                    <section className="bg-white shadow-sm rounded-[8px] p-8 border border-1 border-[#eee] relative">
                      <div className="flex w-[417px] flex-col items-start gap-2">
                        <h2 className="text-[#0C0F12] text-[20px] font-medium leading-[26px] tracking-[-0.2px]">Set Your Goal</h2>
                        <div className="flex flex-col items-start gap-[50px] self-stretch">
                          <p className="text-[#68696B] text-base font-normal leading-6 tracking-[0.24px] font-sf-pro">Define your career aspirations and get a personalized roadmap to success.</p>
                          <Button
                            onClick={() => {
                              setJourneyDialog(true)
                            }}
                            className="bg-[#001630] text-white py-[10px] px-6 rounded hover:bg-[#062549] hover:text-white text-base leading-6 tracking-wide focus:outline-none font-sf-pro">Start Your Journey</Button>

                          {/* Dialog */}
                          {<Dialog open={journeyDialog} onOpenChange={setJourneyDialog}>
                            <DialogContent className="max-w-[1400px] rounded-[12px]">
                              {/* Visually hidden title */}
                              <DialogTitle className="hidden">Set Your Goal</DialogTitle>
                              <DialogDescription className="hidden">Set your goal to get a personalized roadmap to success.</DialogDescription>

                              <div className="flex flex-col items-start gap-1 flex-1">
                                <h2 className="text-[#1A1A1A] text-[24px] font-medium leading-[32px] tracking[-0.24px]">Set Your Goal</h2>
                              </div>
                              <hr className="pt-3" />
                              <SetGoalCard setJourneyDialog={setJourneyDialog} />
                            </DialogContent>
                          </Dialog>}
                        </div>
                      </div>

                      <div className="flex absolute bottom-0 end-0">
                        <img
                          src={GoalCyborgImg}
                          alt="Goal"
                          className="w-[500px]"
                        />
                      </div>
                    </section>

                    {/* Try These Things Out Section */}
                    <TryThingsSection />

                    <section className="flex flex-col items-start gap-4 self-stretch relative">
                      <h5 className="text-[#000] text-[20px] font-medium leading-[26px] tracking[-0.2px]">
                        What is Employability?
                      </h5>
                      <div className="flex h-[192px] p-6 flex-col justify-center items-start gap-[23px] rounded-[8px] border border-[#0000000D] bg-[#FCF9D3] w-full">
                        <div className="flex flex-col items-start gap-2">
                          <h2 className="text-[#202326] text-[20px] font-medium leading-[26px] tracking[-0.2px]">Acheive your professional goals</h2>
                          <p className="text-gray-500 text-base font-normal leading-6 tracking-[0.24px] font-sf-pro">Be it learning a new skill or getting that dream job, we help accelerate your journey through the power of AI </p>
                        </div>
                        <div className="flex absolute bottom-0 end-0">
                          <img
                            src={ProfessionalGoalsImg}
                            alt="Goal"
                          />
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className="flex flex-col items-start gap-6 flex-1 lg:col-span-2">
                    {/* Profile Sidebar */}
                    <aside className="bg-white p-6 flex flex-col items-start self-stretch rounded-[9px] border border-[#0000000D] shadow-sm gap-3">
                      <div className="flex items-center">
                        <img src={profile_image} alt="profile" className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold mr-3" />
                        <div>
                          <h3 className="text-gray-600 text-[20px] font-medium leading-[26px] tracking-[-0.2px]">{user_name}</h3>
                        </div>
                      </div>

                      <div className="p-4 w-full h-[92px] bg-green-50 rounded-lg flex items-center space-x-4">
                        <div className="relative w-[60px] h-[60px] flex items-center justify-center border rounded-full">
                          {/* Circular Progress Bar */}
                          <CircularProgress progress={averageVerifiedPercentage} size={60} strokeWidth={6} showText={false} />
                          <img className="absolute w-8 h-8" src={logo} alt="short logo" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{averageVerifiedScore}</p>
                          <p className="text-base text-[#414447] font-sf-pro">Employability Score</p>
                        </div>
                      </div>
                    </aside>

                    {/* My Activity Sidebar */}
                    <MyActivityCard displayScore={false} goalId={goalId} />
                  </div>
                </div>

              </main>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;