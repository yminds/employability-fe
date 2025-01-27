import React, { useState } from "react";
import LinkedInImportModal from "../../components/modal/LinkedInImportModal";
import ResumeUploadModal from "../../components/modal/ResumeUploadModal";
import ResumeUploadProgressModal from "../../components/modal/ResumeUploadProgressModal";
import CompleteProfileModal from "@/components/modal/CompleteProfileModal";
import { ProfileFormData } from "./types";
import EducationSection from "./EducationSection";
import {
  Education,
  Certification,
  ExperienceItem,
} from "../../features/profile/types";
import ExperienceSection from "./ExperienceSection";
import CertificationsSection from "./CertificationsSection";
import { useSelector, useDispatch } from "react-redux";
import SkillList from "@/components/skills/skillslist";
import ProfileBanner from "./ProfileBanner";
import { useNavigate } from "react-router-dom";
import MockInterviewSection from "./MockInterviewSection";
import MockInterivewImage from "@/assets/profile/MockInterview.svg";
import StatsSection from "./StatsSection";
import CurrentStatusSection from "./CurrentStatusSection";
import ContactInformationSection from "./ContactInformationSection";
import { useGetUserGoalQuery } from "@/api/predefinedGoalsApiSlice";
import { useUpdateUserMutation } from "@/api/userApiSlice";
import { updateUserProfile } from "../authentication/authSlice";
// import useGetUser

const UserProfile: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: goalsData } = useGetUserGoalQuery(user._id) || "";
  const [updateUser] = useUpdateUserMutation();

  const educationEntries: Education[] = [];
  const experiences: ExperienceItem[] = [];
  const certifications: Certification[] = [];

  const goalId = goalsData?.data?.[0]?._id || "";

  const [bio, setBio] = useState<string>(
    user.bio ||
      "Full-stack developer with a strong foundation in React, Python, and MongoDB. A quick learner passionate about building user-friendly web applications, eager to apply skills in a professional environment."
  );
  const handleEditBio = async (updatedBio: string) => {
    try {
      await updateUser({
        userId: user._id,
        data: { bio: updatedBio },
      }).unwrap();
      setBio(updatedBio);
      dispatch(updateUserProfile({ bio: updatedBio }));
    } catch (error) {
      console.error("Failed to update bio:", error);
    }
  };

  const handleEditStatus = async (updatedStatus: string) => {
    try {
      await updateUser({
        userId: user._id,
        data: { currentStatus: updatedStatus },
      }).unwrap();
      dispatch(updateUserProfile({ current_status: updatedStatus }));
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileDetails, setFileDetails] = useState<{
    name: string;
    size: string;
  }>({ name: "", size: "" });

  const handleUpload = (file: File) => {
    setFileDetails({
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    });
    setIsUploadModalOpen(false);
    setIsProgressModalOpen(true);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return progress;
      });
    }, 300);
  };

  const handleProgressContinue = () => {
    if (uploadProgress === 100) {
      setIsProgressModalOpen(false);
      setIsProfileModalOpen(true); // Open the CompleteProfileModal
    }
  };

 
  return (
    <div className="w-full max-w-screen-xl mx-auto px-6 p-0">
      <button
        className="text-gray-600 hover:text-gray-800 flex items-center space-x-4 mb-6"
        onClick={() => navigate("/")}
      >
        <div className="p-3 border bg-white border-gray-300 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="white"
          >
            <path
              id="Vector 84"
              d="M0.505025 5.50503C0.231658 5.77839 0.231658 6.22161 0.505025 6.49497L4.9598 10.9497C5.23316 11.2231 5.67638 11.2231 5.94975 10.9497C6.22311 10.6764 6.22311 10.2332 5.94975 9.9598L1.98995 6L5.94975 2.0402C6.22311 1.76684 6.22311 1.32362 5.94975 1.05025C5.67638 0.776886 5.23316 0.776886 4.9598 1.05025L0.505025 5.50503ZM1 6.7H12V5.3H1V6.7Z"
              fill="#666666"
            />
          </svg>
        </div>
        <span className="text-[#040609] font-sf-pro text-base font-normal leading-6 tracking-[0.24px]">
          Back to Home
        </span>
      </button>
      <div className="grid grid-cols-4 gap-4">
        <div className="flex flex-col col-span-3">
          <ProfileBanner
            user={user}
            bio={bio}
            onBioUpdate={handleEditBio}
          />

          <div className="bg-white rounded-lg mt-6 p-6 overflow-y-auto overflow-x-auto max-h-3xl">
            <SkillList isDashboard={true} goalId={goalId} />
          </div>

          <div className="bg-white rounded-lg mt-6 p-6 overflow-y-auto overflow-x-auto max-h-3xl">
            <ExperienceSection intialExperiences={experiences} />
          </div>

          <div className="bg-white rounded-lg mt-6 p-6 overflow-y-auto overflow-x-auto max-h-3xl">
            <EducationSection initialEducation={educationEntries} />
          </div>

          <div className="bg-white rounded-lg mt-6 p-6 overflow-y-auto overflow-x-auto max-h-3xl">
            <CertificationsSection certifications={certifications} />
          </div>
          <div className="mb-6"></div>
        </div>

        {/* Right Section */}
        <div className="space-y-6 flex flex-col flex-1">
          {/* MockInterview Section */}
          <MockInterviewSection
            duration="5m 32s"
            timeAgo="3 weeks ago"
            role="Full stack developer"
            percentile={60}
            thumbnailUrl={MockInterivewImage || ""}
          />

          {/* Stats Section */}
          <StatsSection skills={6} projects={4} certifications={2} />

          {/* Current Status Section */}
          <CurrentStatusSection onStatusChange={handleEditStatus} user={user}/>

          <ContactInformationSection
            profileUrl="employability.ai"
            phoneNumber={user.phone_number}
            email={user.email}
          />

          {/* Complete your profile */}
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-[#000] font-ubuntu text-base font-medium leading-[22px] mb-4">
              Complete your profile
            </h2>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex-grow bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-green-500 h-full"
                  style={{ width: "30%" }}
                ></div>
              </div>
              <span className="text-gray-700 text-sm font-medium">30%</span>
            </div>
            <p className="text-[#000] text-base font-normal mb-6 leading-6 tracking-[0.24px]">
              Employers are{" "}
              <span className="text-[#03963F] text-base font-normal">
                3 times
              </span>{" "}
              more likely to hire a candidate with a complete profile.
            </p>
            <div className="space-y-4">
              <button
                onClick={handleOpenModal} // <-- Added onClick handler
                className="flex items-center space-x-3 w-full text-gray-600 hover:text-gray-800"
              >
                <div className="p-2 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M2.03111 0C1.22 0 0.5625 0.641645 0.5625 1.43268V18.5673C0.5625 19.3586 1.22 20 2.03111 20H18.9673C19.7784 20 20.4359 19.3586 20.4359 18.5673V1.43268C20.4359 0.641645 19.7784 0 18.9673 0H2.03111ZM6.58665 7.70517V16.7363H3.58495V7.70517H6.58665ZM6.78406 4.91198C6.78406 5.77864 6.13254 6.47213 5.08578 6.47213H5.06622C4.05888 6.47213 3.40751 5.77864 3.40751 4.91198C3.40751 4.02581 4.07885 3.35156 5.10564 3.35156C6.13254 3.35156 6.76455 4.02581 6.78406 4.91198ZM11.2492 16.7363H8.24754C8.24754 16.7363 8.28702 8.55259 8.24763 7.70517H11.2493V8.98381L11.2293 9.01492H11.2493V8.98381C11.6482 8.36843 12.3622 7.49325 13.9544 7.49325C15.9293 7.49325 17.4102 8.78402 17.4102 11.558V16.7363H14.4088V11.9049C14.4088 10.6908 13.9743 9.86261 12.8881 9.86261C12.0589 9.86261 11.565 10.4211 11.348 10.9604C11.2687 11.1534 11.2492 11.423 11.2492 11.6929V16.7363Z"
                      fill="#414447"
                    />
                  </svg>
                </div>
                <span className="text-[#414447] text-base font-normal leading-6 tracking-[0.24px]">
                  Import from LinkedIn
                </span>
              </button>

              {/* LinkedIn Import Modal */}
              {isModalOpen && (
                <LinkedInImportModal onClose={handleCloseModal} />
              )}

              {isProgressModalOpen && (
                <ResumeUploadProgressModal
                  onClose={() => setIsProgressModalOpen(false)}
                  fileName={fileDetails.name}
                  fileSize={fileDetails.size}
                  uploadProgress={uploadProgress}
                  onContinue={function (): void {
                    throw new Error("Function not implemented.");
                  }}
                  isUploading={undefined}
                />
              )}
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center space-x-3 w-full text-gray-600 hover:text-gray-800"
              >
                <div className="p-2 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                  >
                    <mask
                      id="mask0_40000636_3427"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="25"
                      height="24"
                    >
                      <rect x="0.5" width="24" height="24" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_40000636_3427)">
                      <path
                        d="M6.5 20.0008C5.95 20.0008 5.47917 19.8049 5.0875 19.4133C4.69583 19.0216 4.5 18.5508 4.5 18.0008V16.0008C4.5 15.7174 4.59583 15.4799 4.7875 15.2883C4.97917 15.0966 5.21667 15.0008 5.5 15.0008C5.78333 15.0008 6.02083 15.0966 6.2125 15.2883C6.40417 15.4799 6.5 15.7174 6.5 16.0008V18.0008H18.5V16.0008C18.5 15.7174 18.5958 15.4799 18.7875 15.2883C18.9792 15.0966 19.2167 15.0008 19.5 15.0008C19.7833 15.0008 20.0208 15.0966 20.2125 15.2883C20.4042 15.4799 20.5 15.7174 20.5 16.0008V18.0008C20.5 18.5508 20.3042 19.0216 19.9125 19.4133C19.5208 19.8049 19.05 20.0008 18.5 20.0008H6.5ZM11.5 7.85078L9.625 9.72578C9.425 9.92578 9.1875 10.0216 8.9125 10.0133C8.6375 10.0049 8.4 9.90078 8.2 9.70078C8.01667 9.50078 7.92083 9.26745 7.9125 9.00078C7.90417 8.73411 8 8.50078 8.2 8.30078L11.8 4.70078C11.9 4.60078 12.0083 4.52995 12.125 4.48828C12.2417 4.44661 12.3667 4.42578 12.5 4.42578C12.6333 4.42578 12.7583 4.44661 12.875 4.48828C12.9917 4.52995 13.1 4.60078 13.2 4.70078L16.8 8.30078C17 8.50078 17.0958 8.73411 17.0875 9.00078C17.0792 9.26745 16.9833 9.50078 16.8 9.70078C16.6 9.90078 16.3625 10.0049 16.0875 10.0133C15.8125 10.0216 15.575 9.92578 15.375 9.72578L13.5 7.85078V15.0008C13.5 15.2841 13.4042 15.5216 13.2125 15.7133C13.0208 15.9049 12.7833 16.0008 12.5 16.0008C12.2167 16.0008 11.9792 15.9049 11.7875 15.7133C11.5958 15.5216 11.5 15.2841 11.5 15.0008V7.85078Z"
                        fill="#414447"
                      />
                    </g>
                  </svg>
                </div>

                <span className="text-[#414447] text-base font-normal leading-6 tracking-[0.24px]">
                  Upload your resume
                </span>
              </button>
              {isUploadModalOpen && (
                <ResumeUploadModal
                  onClose={() => setIsUploadModalOpen(false)}
                  onUpload={() => {
                    console.log();
                  }}
                  userId={user._id}
                />
              )}

              {isProgressModalOpen && (
                <ResumeUploadProgressModal
                  onClose={() => setIsProgressModalOpen(false)}
                  onContinue={handleProgressContinue} // Hooked to handle state transition
                  fileName={fileDetails.name}
                  fileSize={fileDetails.size}
                  uploadProgress={uploadProgress}
                  isUploading={uploadProgress < 100} // Indicates upload is ongoing
                />
              )}
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center space-x-3 w-full text-gray-600 hover:text-gray-800"
              >
                <div className="p-2 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                  >
                    <mask
                      id="mask0_40000636_3438"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="25"
                      height="24"
                    >
                      <rect x="0.5" width="24" height="24" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_40000636_3438)">
                      <path
                        d="M16.85 16.1739L20.4 12.6239C20.6 12.4239 20.8333 12.3281 21.1 12.3364C21.3667 12.3448 21.6 12.4489 21.8 12.6489C21.9833 12.8489 22.075 13.0823 22.075 13.3489C22.075 13.6156 21.9833 13.8489 21.8 14.0489L17.575 18.2989C17.375 18.4989 17.1417 18.5989 16.875 18.5989C16.6083 18.5989 16.375 18.4989 16.175 18.2989L14.025 16.1489C13.8417 15.9656 13.75 15.7323 13.75 15.4489C13.75 15.1656 13.8417 14.9323 14.025 14.7489C14.2083 14.5656 14.4417 14.4739 14.725 14.4739C15.0083 14.4739 15.2417 14.5656 15.425 14.7489L16.85 16.1739ZM16.85 8.17394L20.4 4.62394C20.6 4.42394 20.8333 4.3281 21.1 4.33644C21.3667 4.34477 21.6 4.44894 21.8 4.64894C21.9833 4.84894 22.075 5.08227 22.075 5.34894C22.075 5.6156 21.9833 5.84894 21.8 6.04894L17.575 10.2989C17.375 10.4989 17.1417 10.5989 16.875 10.5989C16.6083 10.5989 16.375 10.4989 16.175 10.2989L14.025 8.14894C13.8417 7.9656 13.75 7.73227 13.75 7.44894C13.75 7.1656 13.8417 6.93227 14.025 6.74894C14.2083 6.5656 14.4417 6.47394 14.725 6.47394C15.0083 6.47394 15.2417 6.5656 15.425 6.74894L16.85 8.17394ZM3.5 16.9989C3.21667 16.9989 2.97917 16.9031 2.7875 16.7114C2.59583 16.5198 2.5 16.2823 2.5 15.9989C2.5 15.7156 2.59583 15.4781 2.7875 15.2864C2.97917 15.0948 3.21667 14.9989 3.5 14.9989H10.5C10.7833 14.9989 11.0208 15.0948 11.2125 15.2864C11.4042 15.4781 11.5 15.7156 11.5 15.9989C11.5 16.2823 11.4042 16.5198 11.2125 16.7114C11.0208 16.9031 10.7833 16.9989 10.5 16.9989H3.5ZM3.5 8.99894C3.21667 8.99894 2.97917 8.9031 2.7875 8.71144C2.59583 8.51977 2.5 8.28227 2.5 7.99894C2.5 7.7156 2.59583 7.4781 2.7875 7.28644C2.97917 7.09477 3.21667 6.99894 3.5 6.99894H10.5C10.7833 6.99894 11.0208 7.09477 11.2125 7.28644C11.4042 7.4781 11.5 7.7156 11.5 7.99894C11.5 8.28227 11.4042 8.51977 11.2125 8.71144C11.0208 8.9031 10.7833 8.99894 10.5 8.99894H3.5Z"
                        fill="#414447"
                      />
                    </g>
                  </svg>
                </div>
                <span className="text-[#414447] text-base font-normal leading-6 tracking-[0.24px]">
                  Fill out manually
                </span>
              </button>
              {isProfileModalOpen && (
                <CompleteProfileModal
                  type="resume"
                  onClose={() => setIsProfileModalOpen(false)}
                  onSave={function (data: ProfileFormData): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
