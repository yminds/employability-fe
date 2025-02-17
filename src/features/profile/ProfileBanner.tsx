import { currentStatusSVG } from "./svg/currentStatusSVG";
import { Button } from "@/components/ui/button";
import threeDots from "@/assets/profile/threedots.svg";
import { Pencil } from "lucide-react";
import EditBioModal from "@/components/modal/EditBioModal";
import { useEffect, useState } from "react";
import { Country, State } from "country-state-city";
import backgroundImage from "@/assets/images/Frame 1410078135.jpg";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ProfileFormData } from "./types";
import CompleteProfileModal from "@/components/modal/CompleteProfileModal";
import { useGetPublicUserSkillSummaryMutation } from "@/api/userPublicApiSlice";

interface ProfileBannerProps {
  user: any;
  bio: string;
  onBioUpdate: (newBio: string) => void;
  isPublic: boolean;
  goalData: any;
}

const ProfileBanner = ({
  user,
  bio,
  onBioUpdate,
  isPublic,
  goalData,
}: ProfileBannerProps) => {
  const country = user.address?.country
    ? Country.getCountryByCode(user.address.country)
    : null;
  const state =
    user.address?.state && user.address?.country
      ? State.getStateByCodeAndCountry(user.address.state, user.address.country)
      : null;

  const [getUserSkillsSummary, { data: skillsSummaryData }] =
    useGetPublicUserSkillSummaryMutation();

  const totalSkills = skillsSummaryData?.data?.totalSkills || "0";
  const totalVerifiedSkills =
    skillsSummaryData?.data?.totalVerifiedSkills || "0";

  const [isEditBioOpen, setIsEditBioOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const goalName = goalData?.data?.[0]?.name || "";

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

  const handleBioSave = (newBio: string) => {
    onBioUpdate(newBio);
  };

  const handleShareProfile = () => {
    const publicProfileUrl = `${window.location.origin}/profile/${user.username}`;
    window.open(publicProfileUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className=" rounded-lg sm:bg-cover md:bg-contain lg:bg-auto "
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-5xl mx-auto p-8">
        <div className="flex flex-col gap-8">
          {/* Profile Header */}
          <div className="flex items-center justify-between ">
            <div className="relative flex gap-6 items-center">
              <div className="relative w-[130px] h-[130px]">
                {/* Profile Image */}
                <img
                  src={user?.profile_image}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
                {/* SVG Semi-Circle */}
                {user.current_status === "Actively seeking job" &&
                  currentStatusSVG}
                <div className="mb-[]">
                  <span className=" bg-slate-600 "></span>
                </div>
              </div>

              <div className="flex flex-col gap-2 items-start justify-end">
                <h1 className="text-[#202326] text-h2">
                  {user.name}
                </h1>
                <p className="text-[#414447] text-body2">
                  {country !== null ? `${state?.name}, ${country?.name}` : ""}
                </p>
                {/* <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="18"
                    viewBox="0 0 17 18"
                    fill="none"
                  >
                    <circle cx="8.5" cy="9" r="8.5" fill="#0AD472" />
                    <circle
                      cx="8.5"
                      cy="9"
                      r="7.5"
                      stroke="white"
                      strokeOpacity="0.5"
                      strokeWidth="2"
                    />
                  </svg>
                  <span className="text-[#000] text-base font-normal font-sf-pro leading-6 tracking-[0.24px]">
                    {currentStatus}
                  </span>
                </div> */}
              </div>
            </div>
            <div className="flex flex-col items-start justify-end gap-2 ">
              <h2 className="text-[#414447] text-h2">
                {isPublic ? user.goals?.[0]?.name : goalName}
              </h2>
              <div className="flex items-center gap-2  rounded-lg">
                <div className="flex items-baseline gap-1">
                  <span className="text-black text-[28px] font-ubuntu font-bold leading-[42px] tracking-[-0.5px]">
                    {employabilityScore}
                  </span>
                  <span className="text-black/40 text-[28px] font-ubuntu font-bold leading-[42px] tracking-[-0.5px]">/10</span>
                </div>
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
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
              </div>
              <span className="text-body2 text-[#414447]">Employability score</span>
            </div>
          </div>

          {/* Bio */}
          <div className="flex items-start justify-between gap-4">
            <p className="text-[#414447] text-body2 flex-1">
              {bio}
            </p>
            {!isPublic && (
              <Button
                variant="ghost"
                size="icon"
                className="mt-1"
                onClick={() => setIsEditBioOpen(true)}
              >
                <Pencil className="h-4 w-4 text-[#414447]" />
              </Button>
            )}
          </div>

          {/* Action Buttons */}
          {!isPublic && (
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="flex w-[187px] h-[40px] px-3 py-2 justify-center items-center gap-3 bg-white text-black rounded-[11px] border border-[#001630] font-sf-pro"
                onClick={handleShareProfile}
              >
                Share Profile
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="w-10 h-10 p-0">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <img
                        src={threeDots || "/placeholder.svg"}
                        alt="Three Dots"
                      />
                    </div>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-44">
                  <div className="grid gap-4">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm font-normal leading-6 tracking-[0.24px] text-black font-['SF Pro Display', sans-serif]"
                      onClick={() => setIsProfileModalOpen(true)}
                    >
                      Edit Profile
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
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
          onSave={(data: ProfileFormData) => {
            // Implement the save functionality here
            console.log("Profile data to save:", data);
            setIsProfileModalOpen(false);
          }}
          user={user}
          isParsed={false}
          goalId={goalData?.data?.[0]?._id}
        />
      )}
    </div>
  );
};

export default ProfileBanner;
