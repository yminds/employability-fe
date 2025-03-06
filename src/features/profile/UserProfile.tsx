import React, { useState } from "react";
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
// import MockInterviewSection from "./MockInterviewSection";
// import MockInterivewImage from "@/assets/profile/MockInterview.svg";
import StatsSection from "./StatsSection";
import CurrentStatusSection from "./CurrentStatusSection";
import ContactInformationSection from "./ContactInformationSection";
import { useGetUserGoalQuery } from "@/api/predefinedGoalsApiSlice";
import { useUpdateUserMutation } from "@/api/userApiSlice";
import { updateUserProfile } from "../authentication/authSlice";
import arrow from "@/assets/skills/arrow.svg";
import ProjectList from "@/components/projects/ProjectList";
import { useGetProjectsByUserIdQuery } from "@/api/projectApiSlice";
const UserProfile: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user);
  console.log("user in complete modal", user);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: goalsData } = useGetUserGoalQuery(user._id) || "";
  const [updateUser] = useUpdateUserMutation();
  const goalId = goalsData?.data?.[0]?._id || "";
  const { data: userProjects } = useGetProjectsByUserIdQuery({
    userId: user._id,
    goalId: goalId,
  });
  const profileUrl = `employability.ai/profile/${user?.username}`;

  const educationEntries: Education[] = [];
  const experiences: ExperienceItem[] = [];
  const certifications: Certification[] = [];

  const [bio, setBio] = useState<string>(user.bio || "");
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
        data: { current_status: updatedStatus },
      }).unwrap();
      dispatch(updateUserProfile({ current_status: updatedStatus }));
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

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
          <ProfileBanner
            user={user}
            bio={bio}
            onBioUpdate={handleEditBio}
            isPublic={false}
            goalData={goalsData}
          />

          {user?.goals && user?.goals.length > 0 && (
            <div className="bg-white rounded-lg mt-6 overflow-y-auto overflow-x-auto max-h-3xl relative">
              <SkillList
                isDashboard={true}
                goalId={goalId}
                onSkillsUpdate={() => {}}
                isSkillsUpdated={false}
                goals={goalsData}
              />
            </div>
          )}

          <div className="bg-white rounded-lg mt-6 overflow-y-auto overflow-x-auto max-h-3xl relative">
            <ProjectList
              projects={userProjects?.data}
              isLoading={false}
              isDashboard={true}
              isPublic={false}
              onOpenUploadModal={() => {}}
              onOpenDeleteModal={() => {}}
            />
          </div>

          {user.is_experienced && (
            <div className="bg-white rounded-lg mt-6 overflow-y-auto overflow-x-auto max-h-3xl">
              <ExperienceSection
                intialExperiences={experiences}
                isPublic={false}
              />
            </div>
          )}

          <div className="bg-white rounded-lg mt-6 overflow-y-auto overflow-x-auto max-h-3xl">
            <EducationSection
              initialEducation={educationEntries}
              isPublic={false}
            />
          </div>

          {user.has_certificates && (
            <div className="bg-white rounded-lg mt-6 overflow-y-auto overflow-x-auto max-h-3xl">
              <CertificationsSection
                certifications={certifications}
                isPublic={false}
              />
            </div>
          )}

          <div className="mb-6"></div>
        </div>

        {/* Right Section */}
        <div className="space-y-6 flex flex-col flex-1 col-span-3">
          {/* MockInterview Section */}
          {/* <MockInterviewSection
            duration="5m 32s"
            timeAgo="3 weeks ago"
            role="Full stack developer"
            percentile={60}
            thumbnailUrl={MockInterivewImage || ""}
          /> */}

          {/* Current Status Section */}
          <CurrentStatusSection onStatusChange={handleEditStatus} user={user} />

          {/* Stats Section */}
          <StatsSection username={user?.username}/>

          <ContactInformationSection
            profileUrl={profileUrl}
            phoneNumber={user.phone_number}
            email={user.email}
          />
          {/* Complete your profile */}
          {/* <CompleteProfileSection
            userId={user._id}
            isDashboard={false}
            goalId={goalId}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
