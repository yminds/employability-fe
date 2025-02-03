import React, { useState } from "react";
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
import CompleteProfileSection from "./CompleteProfileSection";
import arrow from "@/assets/skills/arrow.svg";

const UserProfile: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user);
  console.log("user in complete modal", user);

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

  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // const handleOpenModal = () => {
  //   setIsModalOpen(true);
  // };

  // const handleCloseModal = () => {
  //   setIsModalOpen(false);
  // };

  // const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  // const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  // const [uploadProgress, setUploadProgress] = useState(0);
  // const [fileDetails, setFileDetails] = useState<{
  //   name: string;
  //   size: string;
  // }>({ name: "", size: "" });

  // const handleUpload = (file: File) => {
  //   setFileDetails({
  //     name: file.name,
  //     size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
  //   });
  //   setIsUploadModalOpen(false);
  //   setIsProgressModalOpen(true);

  //   // Simulate upload progress
  //   let progress = 0;
  //   const interval = setInterval(() => {
  //     progress += 10;
  //     setUploadProgress((prevProgress) => {
  //       if (prevProgress >= 100) {
  //         clearInterval(interval);
  //         return 100;
  //       }
  //       return progress;
  //     });
  //   }, 300);
  // };

  // const handleProgressContinue = () => {
  //   if (uploadProgress === 100) {
  //     setIsProgressModalOpen(false);
  //     setIsProfileModalOpen(true); // Open the CompleteProfileModal
  //   }
  // };

  // const handleSaveProfile = (data: ProfileFormData) => {
  //   console.log("profile Data Saved: ", data);
  // };

  return (
    <div className="w-full max-w-screen-xl mx-auto p-0">
      <div className="flex justify-between items-center mb-4 sm:mt-3">
        <div className="flex items-center space-x-2 gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-[30px] h-[30px] bg-white border-2 rounded-full flex justify-center items-center"
          >
            <img className="w-[10px] h-[10px]" src={arrow} alt="Back" />
          </button>
          <h1 className="text-black font-ubuntu text-[20px] font-bold leading-[26px] tracking-[-0.025rem]">
            Profile
          </h1>
        </div>
      </div>
      <div className="grid grid-cols-10 gap-6">
        {/* Left Section */}
        <div className="flex flex-col col-span-7">
          <ProfileBanner user={user} bio={bio} onBioUpdate={handleEditBio} />

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
        <div className="space-y-6 flex flex-col flex-1 col-span-3">
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
          <CurrentStatusSection onStatusChange={handleEditStatus} user={user} />

          <ContactInformationSection
            profileUrl="employability.ai"
            phoneNumber={user.phone_number}
            email={user.email}
          />
          {/* Complete your profile */}
          <CompleteProfileSection userId={user._id} isDashboard={false} />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
