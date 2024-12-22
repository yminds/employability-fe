import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import ProfileCard from "@/features/dashboard/ProfileCard";
import { useGetAllPreDefinedGoalsQuery } from "@/api/goalsApiSlice";

const Dashboard: React.FC = () => {
  const { data, error, isLoading } = useGetAllPreDefinedGoalsQuery(); // Fetch all predefined goals

  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    console.log(data);
  }, [data, error, isLoading]);

  // Handle role selection and navigation
  const handleOptionClick = (route: string) => {
    navigate(route); // Navigate to the specified route
  };

  return (
    <>
      <main>
        <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-start gap-7 p-[55px] pt-[55px] pb-[42px] flex-1 self-stretch">
          <div className="mx-auto">
            <header className="mb-7">
              <h1 className="text-gray-600 text-2xl font-medium leading-8 tracking-tight">
                Hi, Mathew Johns <span className="wave">👋</span>
              </h1>
            </header>

            <main>
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3 flex flex-col gap-10 shrink-0">
                  {/* Set Your Goal Section */}
                  <section className="bg-white shadow-sm rounded-[8px] p-8 border border-1 border-[#eee] relative">
                    <div className="flex w-[417px] flex-col items-start gap-2">
                      <h2 className="text-[#0C0F12] text-[20px] font-medium leading-[26px] tracking-[-0.2px]">
                        Set Your Goal
                      </h2>
                      <div className="flex flex-col items-start gap-[50px] self-stretch">
                        <p className="text-[#68696B] text-base font-normal leading-6 tracking-[0.24px]">
                          Define your career aspirations and get a personalized roadmap to success.
                        </p>
                        <button
                          className="bg-[#1FD167] text-white py-[10px] px-6 rounded hover:bg-green-600 text-base leading-6 tracking-wide"
                          onClick={() => handleOptionClick("/SetGoal")}
                        >
                          Start Your Journey
                        </button>
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
                    <h5 className="text-[#68696B] text-[20px] font-medium leading-[26px] tracking[-0.2px]">
                      Try these things out
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white shadow-sm rounded-lg p-6 flex flex-col items-start gap-8 relative">
                        <div className="h-[100px]">
                          <img
                            src="./src/assets/dashboard/skills.svg"
                            alt="Skills"
                            className="absolute top-0 end-0"
                          />
                        </div>

                        <div className="flex flex-col items-start gap-2">
                          <h3 className="text-[#202326] text-base font-medium leading-5">
                            Showcase Your Skills
                          </h3>
                          <p className="text-gray-500 text-base font-normal leading-6 tracking-wide">
                            Highlight top skills to help us match you with the right opportunities.
                          </p>
                        </div>

                        <button className="flex p-2 px-4 justify-center items-center gap-2 rounded-[4px] bg-[#DBFFEA] text-green-600 text-base font-medium leading-6 tracking-wide">
                          Add Skills
                        </button>
                      </div>

                      <div className="bg-white shadow-sm rounded-lg p-6 flex flex-col items-start gap-8 relative">
                        <div className="h-[100px]">
                          <img
                            src="./src/assets/dashboard/project.svg"
                            alt="Project"
                            className="absolute top-0 end-0"
                          />
                        </div>

                        <div className="flex flex-col items-start gap-2">
                          <h3 className="text-[#202326] text-base font-medium leading-5">
                            Build Your Portfolio
                          </h3>
                          <p className="text-gray-500 text-base font-normal leading-6 tracking-wide">
                            Start adding projects that showcase your expertise and creativity.
                          </p>
                        </div>

                        <button className="flex p-2 px-4 justify-center items-center gap-2 rounded-[4px] bg-[#DBFFEA] text-green-600 text-base font-medium leading-6 tracking-wide">
                          Add a Project
                        </button>
                      </div>

                      <div className="bg-white shadow-sm rounded-lg p-6 flex flex-col items-start gap-8 relative">
                        <div className="h-[100px]">
                          <img
                            src="./src/assets/dashboard/practice.svg"
                            alt="Practice"
                            className="absolute top-0 end-0"
                          />
                        </div>

                        <div className="flex flex-col items-start gap-2">
                          <h3 className="text-[#202326] text-base font-medium leading-5">
                            Take a Mock Interview
                          </h3>
                          <p className="text-gray-500 text-base font-normal leading-6 tracking-wide">
                            Prepare for real interviews by practicing with AI-driven questions.
                          </p>
                        </div>

                        <button className="flex p-2 px-4 justify-center items-center gap-2 rounded-[4px] bg-[#DBFFEA] text-green-600 text-base font-medium leading-6 tracking-wide">
                          Start Practice
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Explore Trending Goals Section */}
                  <section className="flex flex-col items-start gap-4 self-stretch">
                    <h5 className="text-[#68696B] text-[20px] font-medium leading-[26px] tracking[-0.2px]">
                      Explore trending goals
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {isLoading && <p>Loading trending goals, please wait...</p>}
                      {error && <p>Oops! Something went wrong while loading goals.</p>}
                      {data?.data?.map((goal) => (
                        <div
                          key={goal._id}
                          className="bg-[#FCFCFC] shadow-sm rounded-[9px] border-1 border-[#eee] cursor-pointer"
                          onClick={() => navigate(`/goals/${goal._id}`)}
                        >
                          <img
                            src={goal.image || "./src/assets/dashboard/jobs_banner.png"}
                            alt={goal.name}
                            className="rounded-e-none-[9px] rounded-s-none-[9px] w-full"
                          />
                          <div className="flex flex-col p-6 justify-center items-start gap-2 self-stretch">
                            <h3 className="text-gray-800 text-base font-medium leading-5">
                              {goal.name}
                            </h3>
                            <p className="text-gray-600 text-base font-normal leading-6 tracking-wide">
                              {goal.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="flex flex-col items-start gap-6 flex-1">
                  {/* Profile Sidebar */}
                  <ProfileCard
                    name="Mathew Johns"
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
                          <span className="text-gray-600 text-base font-normal leading-6 tracking-wide">
                            verified skills
                          </span>
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
                          <span className="text-gray-600 text-base font-normal leading-6 tracking-wide">
                            projects added
                          </span>
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
                          <span className="text-gray-600 text-base font-normal leading-6 tracking-wide">
                            upskilling
                          </span>
                        </div>
                      </li>
                    </ul>
                  </aside>
                </div>
              </div>
            </main>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
