import React, { useState } from "react";
import ProfileCard from "@/features/dashboard/ProfileCard";
import SetGoalCard from "@/features/dashboard/SetGoalCard";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import GoalList from "@/features/dashboard/GoalList";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from '@/store/store';
import { useGetUserGoalQuery } from "@/api/predefinedGoalsApiSlice";

const Dashboard: React.FC = () => {
  const [journeyDialog, setJourneyDialog] = useState(false);
  const user_id = useSelector((state) => state.auth.user._id)
  const user_name = useSelector((state: RootState) => state.auth.user?.name);
  const navigate = useNavigate(); // Initialize useNavigate hook
  const handleLinkClick = (route: string) => {
    navigate(route); // Navigate to the specified route
  };
  const { data } = "";
  //const { data } = useGetUserGoalQuery(user_id);
  const goalName = data?.data?.[0]?.name || "";
  const completionPercentage = 50;

  return (
    <>
      <main className="h-screen overflow-auto">
        <div className="bg-[#F5F5F5] flex flex-col items-start gap-7 p-[55px] pt-[55px] pb-[42px] flex-1 self-stretch">
          <div className="mx-auto">

            {data ? (
              <main>
                <header className="mb-7">
                  <h1 className="text-gray-600 text-2xl font-medium leading-8 tracking-tight">Welcome Back, {user_name} <span className="wave">👋</span></h1>
                </header>

                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-3 flex flex-col gap-10 shrink-0">
                    {/* Set Your Goal Section */}
                    <section className="bg-white shadow-sm rounded-[8px] p-8 border border-1 border-[#eee] relative">
                      <div className="flex flex-col items-start gap-6 self-stretch relative">
                        <div className="flex flex-col items-start gap-2">
                          <h2 className="text-[#0C0F12] text-[20px] font-medium leading-[26px] tracking-[-0.2px]">Goal: {goalName}</h2>
                          <div className="flex flex-col items-start gap-[50px] self-stretch">
                            <p className="text-gray-500 text-base font-normal leading-6 tracking-[0.24px]">You’re doing great! Keep going and unlock your next milestone.</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-5 self-stretch">
                          <div className="relative w-full bg-[#DBFFEA] rounded-full h-[6px]">
                            <div className="bg-[#2EE578] h-[6px] rounded-full" style={{ width: `${completionPercentage}%` }}></div>
                          </div>
                        </div>
                        <span className="text-[#1FD167] text-[24px] font-bold leading-[32px] tracking-[-0.24px] absolute end-0 top-0">{completionPercentage}%</span>
                      </div>
                    </section>

                    {/* Skills */}
                    <section className="bg-white shadow-sm rounded-[8px] p-8 border border-1 border-[#eee] relative">
                      <div>
                        <h5>Skills (5)</h5>
                      </div>
                    </section>

                  </div>

                  <div className="flex flex-col items-start gap-6 flex-1">
                    <aside className="bg-white p-6 flex flex-col items-start self-stretch rounded-[9px] border border-[#0000000D] shadow-sm gap-6">
                      <ul className="flex flex-col items-start gap-5 self-stretch">
                        <li className="flex h-[48px] items-center gap-[14px] self-stretch">
                          <div className="flex w-[48px] h-[48px] p-[9px] px-[10px] justify-center items-center gap-[10px] rounded-[48px] border border-black/5 bg-[rgba(250,250,250,0.98)]">
                            <img
                              src="./src/assets/dashboard/puzzle_piece.svg"
                              alt=""
                              className="w-6 h-6"
                            />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-black text-base font-medium leading-5">6/10</span>
                            <span className="text-gray-600 text-base font-normal leading-6 tracking-wide">verified skills</span>
                          </div>
                        </li>
                        <li className="flex h-[48px] items-center gap-[14px] self-stretch">
                          <div className="flex w-[48px] h-[48px] p-[9px] px-[10px] justify-center items-center gap-[10px] rounded-[48px] border border-black/5 bg-[rgba(250,250,250,0.98)]">
                            <img
                              src="./src/assets/dashboard/folder_open.svg"
                              alt=""
                              className="w-6 h-6"
                            />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-black text-base font-medium leading-5">3</span>
                            <span className="text-gray-600 text-base font-normal leading-6 tracking-wide">projects added</span>
                          </div>
                        </li>
                        <li className="flex h-[48px] items-center gap-[14px] self-stretch">
                          <div className="flex w-[48px] h-[48px] p-[9px] px-[10px] justify-center items-center gap-[10px] rounded-[48px] border border-black/5 bg-[rgba(250,250,250,0.98)]">
                            <img
                              src="./src/assets/dashboard/chalkboard_user.svg"
                              alt=""
                              className="w-6 h-6"
                            />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-black text-base font-medium leading-5">5</span>
                            <span className="text-gray-600 text-base font-normal leading-6 tracking-wide">upskilling</span>
                          </div>
                        </li>
                      </ul>
                    </aside>

                    {/* Profile Sidebar */}
                    <ProfileCard
                      name={user_name}
                      completionPercentage={30}
                      importButtonLabel="Import from LinkedIn"
                      uploadButtonLabel="Upload your resume"
                      manualButtonLabel="Fill out manually"
                    />
                  </div>
                </div>

              </main>

            ) : (
              <main>
                <header className="mb-7">
                  <h1 className="text-gray-600 text-2xl font-medium leading-8 tracking-tight">Hi, {user_name} <span className="wave">👋</span></h1>
                </header>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-3 flex flex-col gap-10 shrink-0">
                    {/* Set Your Goal Section */}
                    <section className="bg-white shadow-sm rounded-[8px] p-8 border border-1 border-[#eee] relative">
                      <div className="flex w-[417px] flex-col items-start gap-2">
                        <h2 className="text-[#0C0F12] text-[20px] font-medium leading-[26px] tracking-[-0.2px]">Set Your Goal</h2>
                        <div className="flex flex-col items-start gap-[50px] self-stretch">
                          <p className="text-[#68696B] text-base font-normal leading-6 tracking-[0.24px]">Define your career aspirations and get a personalized roadmap to success.</p>
                          <Button
                            onClick={() => {
                              setJourneyDialog(true)
                            }}
                            className="bg-[#00183D] text-white py-[10px] px-6 rounded hover:bg-gray-600 hover:text-white text-base leading-6 tracking-wide focus:outline-none">Start Your Journey</Button>

                          {/* Dialog */}
                          {<Dialog open={journeyDialog} onOpenChange={setJourneyDialog}>
                            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto gap-8">
                              {/* Visually hidden title */}
                              <DialogTitle className="hidden">Set Your Goal</DialogTitle>

                              <div className="flex flex-col items-start gap-1 flex-1">
                                <h2 className="text-[#1A1A1A] text-[24px] font-medium leading-[32px] tracking[-0.24px]">Set Your Goal</h2>
                                <p className="text-black text-opacity-60 text-base font-normal leading-6 tracking-wide">Choose your goal and get tailored resources to help you succeed.</p>
                              </div>
                              <SetGoalCard setJourneyDialog={setJourneyDialog} />
                            </DialogContent>
                          </Dialog>}
                        </div>
                      </div>

                      <div className="flex absolute bottom-0 end-0">
                        <img
                          src="./src/assets/dashboard/set_goal_cyborg.svg"
                          alt="Goal"
                          className="w-[500px]"
                        />
                      </div>
                    </section>

                    {/* Try These Things Out Section */}
                    <section className="flex flex-col items-start gap-4 self-stretch">
                      <h5 className="text-[#68696B] text-[20px] font-medium leading-[26px] tracking[-0.2px]"
                      >Try these things out</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="rounded-lg border border-gray-200 bg-white p-6 flex flex-col items-start gap-8 relative"
                        >
                          <div className="h-[100px]">
                            <img
                              src="./src/assets/dashboard/skills.svg"
                              alt="Skills"
                              className="absolute top-0 end-0 rounded-e-[9px] rounded-s-[9px] rounded-b-none"
                            />
                          </div>

                          <div className="flex flex-col items-start gap-2">
                            <h3 className="text-[#202326] text-base font-medium leading-5"
                            >Showcase Your Skills</h3>
                            <p className="text-gray-500 text-base font-normal leading-6 tracking-wide">Highlight top skills to help us match you with the right opportunities.</p>
                          </div>

                          <button className="flex p-2 px-4 justify-center items-center gap-2 rounded-[4px] bg-white border border-solid border-[#00183D] text-[#00183D] text-base font-medium leading-6 tracking-wide" onClick={() => handleLinkClick("/skills")}>Add Skills</button>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-6 flex flex-col items-start gap-8 relative"
                        >
                          <div className="h-[100px]">
                            <img
                              src="./src/assets/dashboard/project.svg"
                              alt="Project"
                              className="absolute top-0 end-0 rounded-e-[9px] rounded-s-[9px] rounded-b-none"
                            />
                          </div>

                          <div className="flex flex-col items-start gap-2">
                            <h3 className="text-[#202326] text-base font-medium leading-5"
                            >Build Your Portfolio</h3>
                            <p className="text-gray-500 text-base font-normal leading-6 tracking-wide">Start adding projects that showcase your expertise and creativity.</p>
                          </div>

                          <button className="flex p-2 px-4 justify-center items-center gap-2 rounded-[4px] bg-white border border-solid border-[#00183D] text-[#00183D] text-base font-medium leading-6 tracking-wide" onClick={() => handleLinkClick("/projects")}>Add a Project</button>
                        </div>

                        <div className="rounded-lg border border-gray-200 bg-white p-6 flex flex-col items-start gap-8 relative"
                        >
                          <div className="h-[100px]">
                            <img
                              src="./src/assets/dashboard/practice.svg"
                              alt="Practice"
                              className="absolute top-0 end-0 rounded-e-[9px] rounded-s-[9px] rounded-b-none"
                            />
                          </div>

                          <div className="flex flex-col items-start gap-2">
                            <h3 className="text-[#202326] text-base font-medium leading-5"
                            >Take a Mock Interview</h3>
                            <p className="text-gray-500 text-base font-normal leading-6 tracking-wide">Prepare for real interviews by practicing with AI-driven questions.</p>
                          </div>

                          <button className="flex p-2 px-4 justify-center items-center gap-2 rounded-[4px] bg-white border border-solid border-[#00183D] text-[#00183D] text-base font-medium leading-6 tracking-wide" onClick={() => handleLinkClick("/interviews")}>Start Practice</button>
                        </div>
                      </div>
                    </section>

                    {/* Explore Trending Goals Section */}
                    <section className="flex flex-col items-start gap-4 self-stretch">
                      <h5 className="text-[#68696B] text-[20px] font-medium leading-[26px] tracking[-0.2px]">
                        Explore trending goals
                      </h5>
                      <GoalList isLoading={false} error={false} setJourneyDialog={false} />
                    </section>
                  </div>

                  <div className="flex flex-col items-start gap-6 flex-1">
                    {/* Profile Sidebar */}
                    <ProfileCard
                      name={user_name}
                      completionPercentage={30}
                      importButtonLabel="Import from LinkedIn"
                      uploadButtonLabel="Upload your resume"
                      manualButtonLabel="Fill out manually"
                    />

                    <aside className="bg-white p-6 flex flex-col items-start self-stretch rounded-[9px] border border-[#0000000D] shadow-sm gap-6">
                      <h4 className="text-black text-base font-medium leading-5">My activity</h4>
                      <ul className="flex flex-col items-start gap-5 self-stretch">
                        <li className="flex h-[48px] items-center gap-[14px] self-stretch">
                          <div className="flex w-[48px] h-[48px] p-[9px] px-[10px] justify-center items-center gap-[10px] rounded-[48px] border border-black/5 bg-[rgba(250,250,250,0.98)]">
                            <img
                              src="./src/assets/dashboard/puzzle_piece.svg"
                              alt=""
                              className="w-6 h-6"
                            />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-black text-base font-medium leading-5">0</span>
                            <span className="text-gray-600 text-base font-normal leading-6 tracking-wide">verified skills</span>
                          </div>
                        </li>
                        <li className="flex h-[48px] items-center gap-[14px] self-stretch">
                          <div className="flex w-[48px] h-[48px] p-[9px] px-[10px] justify-center items-center gap-[10px] rounded-[48px] border border-black/5 bg-[rgba(250,250,250,0.98)]">
                            <img
                              src="./src/assets/dashboard/folder_open.svg"
                              alt=""
                              className="w-6 h-6"
                            />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-black text-base font-medium leading-5">0</span>
                            <span className="text-gray-600 text-base font-normal leading-6 tracking-wide">projects added</span>
                          </div>
                        </li>
                        <li className="flex h-[48px] items-center gap-[14px] self-stretch">
                          <div className="flex w-[48px] h-[48px] p-[9px] px-[10px] justify-center items-center gap-[10px] rounded-[48px] border border-black/5 bg-[rgba(250,250,250,0.98)]">
                            <img
                              src="./src/assets/dashboard/chalkboard_user.svg"
                              alt=""
                              className="w-6 h-6"
                            />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-black text-base font-medium leading-5">0</span>
                            <span className="text-gray-600 text-base font-normal leading-6 tracking-wide">upskilling</span>
                          </div>
                        </li>
                      </ul>
                    </aside>
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
