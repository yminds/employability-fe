import type React from "react";
import { useEffect, useState } from "react";
import backgroundImage from "@/assets/images/Frame 1410078135.jpg";
import ProfileAvatar from "@/assets/profile/ProfileAvatar.svg";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import threeDots from "@/assets/profile/threedots.svg";
import EditBioModal from "@/components/modal/EditBioModal";
import CompleteProfileModal from "@/components/modal/CompleteProfileModal";
import EditProfile from "@/assets/profile/editprofile.svg";
import EditBio from "@/assets/profile/editbio.svg";
import {
  useGetCountriesQuery,
  useGetStatesQuery,
} from "@/api/locationApiSlice";
import { useGetPublicUserSkillSummaryMutation } from "@/api/userPublicApiSlice";
import Share from "@/assets/profile/share.svg";
import { toast } from "sonner";
import GoalDialog from "@/components/skills/setGoalDialog";

interface ProfileBannerMobileProps {
  user: any;
  bio: string;
  onBioUpdate: (bio: string) => void;
  isPublic: boolean;
  goalData?: any;
}

const ProfileBannerMobile: React.FC<ProfileBannerMobileProps> = ({
  user,
  bio,
  onBioUpdate,
  isPublic,
  goalData,
}) => {
  const { data: countries = [] } = useGetCountriesQuery();
  const { data: states = [] } = useGetStatesQuery(user.address?.country || "", {
    skip: !user.address?.country,
  });

  const country = user.address?.country
    ? countries.find((c) => c.isoCode === user.address.country)
    : null;
  const state =
    user.address?.state && user.address?.country
      ? states.find((s) => s.isoCode === user.address.state)
      : null;

  const [getUserSkillsSummary, { data: skillsSummaryData }] =
    useGetPublicUserSkillSummaryMutation();

  const totalSkills = skillsSummaryData?.data?.totalSkills || "0";
  const totalVerifiedSkills =
    skillsSummaryData?.data?.totalVerifiedSkills || "0";

  useEffect(() => {
    if (user) {
      getUserSkillsSummary({ username: user.username });
    }
  }, [user, getUserSkillsSummary]);

  const totalSkillsNum = Number(totalSkills) || 0;
  const totalVerifiedSkillsNum = Number(totalVerifiedSkills) || 0;
  const averageVerifiedPercentage =
    totalSkillsNum > 0
      ? Number.parseFloat(
          ((totalVerifiedSkillsNum / totalSkillsNum) * 100).toFixed(2)
        )
      : 0;
  const employabilityScore =
    totalSkillsNum > 0
      ? Number.parseFloat((averageVerifiedPercentage / 10).toFixed(1))
      : 0;

  const [isEditBioOpen, setIsEditBioOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const fullName = user.name;
  const goalName = goalData?.data?.[0]?.name || "";
  const goalId = goalData?.data?.[0]?._id || "";

  const handleBioSave = (newBio: string) => {
    onBioUpdate(newBio);
  };

  const handleShareProfile = () => {
    const publicProfileUrl = `${window.location.origin}/profile/${user.username}`;
    navigator.clipboard
      .writeText(publicProfileUrl)
      .then(() => {
        toast.success("Profile URL copied to clipboard!");
        setIsPopoverOpen(false);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
    setTimeout(() => {
      window.open(publicProfileUrl, "_blank", "noopener,noreferrer");
    }, 1500);
  };

  const hasGoalData = isPublic
    ? user.goals && user.goals.length > 0
    : goalData?.data && goalData.data.length > 0;

  return (
    <div className="w-full flex flex-col">
      <div
        className="w-full rounded-lg bg-white overflow-hidden"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="pt-4 pb-4">
          {/* Profile header section */}
          <div className="flex items-center justify-between px-4">
            {/* Profile image */}
            <div className="w-16 h-16">
              {user?.profile_image ? (
                <img
                  src={user?.profile_image || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <img
                  src={ProfileAvatar || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              )}
            </div>

            {/* Name and location */}
            <div className="flex-1 mx-3">
              <h2 className="text-[#202326] text-h2">{fullName}</h2>
              <p className="text-[#414447] text-body2">
                {country !== null ? `${state?.name}, ${country?.name}` : ""}
              </p>
            </div>

            {/* Three dots menu */}
            {!isPublic && (
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <img src={threeDots || "/placeholder.svg"} alt="Menu" />
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-1.5" align="end">
                  <div className="grid gap-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-[#414447] text-body2 px-3 py-2 h-auto"
                      onClick={() => setIsProfileModalOpen(true)}
                    >
                      <img
                        src={EditProfile || "/placeholder.svg"}
                        alt="Edit Profile"
                      />
                      Edit profile
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-[#414447] text-body2 px-3 py-2 h-auto"
                      onClick={() => setIsEditBioOpen(true)}
                    >
                      <img src={EditBio || "/placeholder.svg"} alt="Edit Bio" />
                      Edit bio
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-[#414447] text-body2 px-3 py-2 h-auto"
                      onClick={handleShareProfile}
                    >
                      <img
                        src={Share || "/placeholder.svg"}
                        alt="Share Profile"
                      />
                      Share Profile
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {hasGoalData ? (
            <>
              {/* Job title */}
              <div className="mt-4 px-8">
                <h3 className="text-[#202326] text-lg font-medium font-ubuntu">
                  {isPublic ? user.goals?.[0]?.name : goalName}
                </h3>
              </div>

              {/* Employability score */}
              <div className="px-8 flex items-center">
                <div className="flex items-baseline">
                  <span className="text-black text-[28px] font-ubuntu font-bold leading-[42px] tracking-[-0.5px]">
                    {employabilityScore}
                  </span>
                  <span className="text-black/40 text-[28px] font-ubuntu font-bold leading-[42px] tracking-[-0.5px]">
                    /10
                  </span>
                </div>
                {employabilityScore >= 4 && (
                  <div className="ml-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="29"
                      height="29"
                      viewBox="0 0 29 29"
                      fill="none"
                    >
                      <path
                        d="M13.0359 15.9001L10.7728 13.5635C10.5797 13.3622 10.3405 13.2593 10.0554 13.2547C9.77024 13.2501 9.51948 13.3604 9.30312 13.5857C9.10116 13.7964 9.00019 14.0517 9.00019 14.3516C9.00019 14.6514 9.10116 14.9067 9.30312 15.1174L12.1536 18.0884C12.4057 18.3509 12.6998 18.4822 13.0359 18.4822C13.3719 18.4822 13.666 18.3509 13.9182 18.0884L19.6969 12.0655C19.9042 11.8492 20.0064 11.5962 20.0036 11.3065C20.0011 11.0169 19.8988 10.7593 19.6969 10.5338C19.4805 10.3085 19.232 10.1921 18.9512 10.1846C18.6707 10.1771 18.4223 10.2861 18.2059 10.5116L13.0359 15.9001ZM9.4938 27.6968L7.56571 24.3179L3.91869 23.5015C3.60588 23.4383 3.35605 23.2669 3.16921 22.9874C2.98236 22.7079 2.90776 22.4051 2.94541 22.0791L3.30202 18.1694L0.821755 15.2123C0.607252 14.9739 0.5 14.687 0.5 14.3516C0.5 14.0161 0.607252 13.7292 0.821755 13.4908L3.30202 10.5338L2.94541 6.62402C2.90776 6.298 2.98236 5.99523 3.16921 5.71571C3.35605 5.43619 3.60588 5.26482 3.91869 5.2016L7.56571 4.38521L9.4938 1.0063C9.66182 0.719515 9.89062 0.523925 10.1802 0.41953C10.4698 0.315135 10.7639 0.331 11.0625 0.467125L14.5 1.98182L17.9375 0.467125C18.2361 0.331 18.5302 0.315135 18.8198 0.41953C19.1094 0.523925 19.3382 0.719515 19.5062 1.0063L21.4343 4.38521L25.0813 5.2016C25.3941 5.26482 25.6439 5.43619 25.8308 5.71571C26.0176 5.99523 26.0922 6.298 26.0546 6.62402L25.698 10.5338L28.1782 13.4908C28.3927 13.7292 28.5 14.0161 28.5 14.3516C28.5 14.687 28.3927 14.9739 28.1782 15.2123L25.698 18.1694L26.0546 22.0791C26.0922 22.4051 26.0176 22.7079 25.8308 22.9874C25.6439 23.2669 25.3941 23.4383 25.0813 23.5015L21.4343 24.3179L19.5062 27.6968C19.3382 27.9836 19.1094 28.1792 18.8198 28.2836C18.5302 28.388 18.2361 28.3721 17.9375 28.236L14.5 26.7213L11.0625 28.236C10.7639 28.3721 10.4698 28.388 10.1802 28.2836C9.89062 28.1792 9.66182 27.9836 9.4938 27.6968Z"
                        fill="#10B754"
                      />
                      <path
                        d="M13.0359 15.9001L10.7728 13.5635C10.5797 13.3622 10.3405 13.2593 10.0554 13.2547C9.77024 13.2501 9.51948 13.3604 9.30312 13.5857C9.10116 13.7964 9.00019 14.0517 9.00019 14.3516C9.00019 14.6514 9.10116 14.9067 9.30312 15.1174L12.1536 18.0884C12.4057 18.3509 12.6998 18.4822 13.0359 18.4822C13.3719 18.4822 13.666 18.3509 13.9182 18.0884L19.6969 12.0655C19.9042 11.8492 20.0064 11.5962 20.0036 11.3065C20.0011 11.0169 19.8988 10.7593 19.6969 10.5338C19.4805 10.3085 19.232 10.1921 18.9512 10.1846C18.6707 10.1771 18.4223 10.2861 18.2059 10.5116L13.0359 15.9001ZM9.4938 27.6968L7.56571 24.3179L3.91869 23.5015C3.60588 23.4383 3.35605 23.2669 3.16921 22.9874C2.98236 22.7079 2.90776 22.4051 2.94541 22.0791L3.30202 18.1694L0.821755 15.2123C0.607252 14.9739 0.5 14.687 0.5 14.3516C0.5 14.0161 0.607252 13.7292 0.821755 13.4908L3.30202 10.5338L2.94541 6.62402C2.90776 6.298 2.98236 5.99523 3.16921 5.71571C3.35605 5.43619 3.60588 5.26482 3.91869 5.2016L7.56571 4.38521L9.4938 1.0063C9.66182 0.719515 9.89062 0.523925 10.1802 0.41953C10.4698 0.315135 10.7639 0.331 11.0625 0.467125L14.5 1.98182L17.9375 0.467125C18.2361 0.331 18.5302 0.315135 18.8198 0.41953C19.1094 0.523925 19.3382 0.719515 19.5062 1.0063L21.4343 4.38521L25.0813 5.2016C25.3941 5.26482 25.6439 5.43619 25.8308 5.71571C26.0176 5.99523 26.0922 6.298 26.0546 6.62402L25.698 10.5338L28.1782 13.4908C28.3927 13.7292 28.5 14.0161 28.5 14.3516C28.5 14.687 28.3927 14.9739 28.1782 15.2123L25.698 18.1694L26.0546 22.0791C26.0922 22.4051 26.0176 22.7079 25.8308 22.9874C25.6439 23.2669 25.3941 23.4383 25.0813 23.5015L21.4343 24.3179L19.5062 27.6968C19.3382 27.9836 19.1094 28.1792 18.8198 28.2836C18.5302 28.388 18.2361 28.3721 17.9375 28.236L14.5 26.7213L11.0625 28.236C10.7639 28.3721 10.4698 28.388 10.1802 28.2836C9.89062 28.1792 9.66182 27.9836 9.4938 27.6968Z"
                        stroke="#10B754"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="px-8">
                <p className="text-[#414447] text-body2">Employability score</p>
              </div>
            </>
          ) : (
            !isPublic && (
              <div className="mt-6 px-8">
                <Button
                  onClick={() => setIsGoalModalOpen(true)}
                  className="bg-[#001630] text-white rounded-md px-6 py-3 font-medium hover:bg-[#001630]/90"
                >
                  Set a goal
                </Button>
              </div>
            )
          )}

          {/* Bio section */}
          <div className="mt-2 px-4">
            <div className="rounded-lg p-4">
              <p className="text-[#414447] text-body2">
                {bio ||
                  "No bio available. Add a bio to tell others about yourself."}
              </p>
            </div>
          </div>
        </div>
      </div>
      {!isPublic && (
        <EditBioModal
          isOpen={isEditBioOpen}
          onClose={() => setIsEditBioOpen(false)}
          onSave={handleBioSave}
          currentBio={bio}
        />
      )}
      {isProfileModalOpen && !isPublic && (
        <CompleteProfileModal
          type="basic"
          onClose={() => setIsProfileModalOpen(false)}
          user={user}
          goalId={goalId}
        />
      )}
      {isGoalModalOpen && (
        <GoalDialog
          isOpen={isGoalModalOpen}
          onClose={() => setIsGoalModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProfileBannerMobile;
