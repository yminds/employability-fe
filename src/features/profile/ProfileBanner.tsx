import { currentStatusSVG } from "./svg/currentStatusSVG";
import { Button } from "@/components/ui/button";
import threeDots from "@/assets/profile/threedots.svg";
import EditBioModal from "@/components/modal/EditBioModal";
import { useEffect, useState } from "react";
import backgroundImage from "@/assets/images/Frame 1410078135.jpg";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CompleteProfileModal from "@/components/modal/CompleteProfileModal";
import {
  useGetPublicUserSkillSummaryMutation,
  useGetUserContactInfoQuery,
} from "@/api/userPublicApiSlice";
import ProfileAvatar from "@/assets/profile/ProfileAvatar.svg";
import {
  useGetCountriesQuery,
  useGetStatesQuery,
} from "@/api/locationApiSlice";
import GoalDialog from "@/components/skills/setGoalDialog";
import EditProfile from "@/assets/profile/editprofile.svg";
import EditBio from "@/assets/profile/editbio.svg";
import Share from "@/assets/profile/share.svg";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import EmailComposerModal from "@/components/modal/EmailComposerModal";
import ContactInfoModal from "@/components/modal/ContactInfoModal";
import LoginRequiredModal from "@/components/modal/LoginRequiredModal";
import EditProfileImageModal from "@/components/modal/EditProfileImageModal";
import VerfiedIcon from "../../assets/skills/verified.svg";
import UnverifiedIcon from "../../assets/skills/unverifies.svg";

interface ProfileBannerProps {
  user: any;
  bio: string;
  onBioUpdate: (newBio: string) => void;
  isPublic: boolean;
}

const ProfileBanner = ({
  user,
  bio,
  onBioUpdate,
  isPublic,
}: ProfileBannerProps) => {
  const candidate = useSelector((state: any) => state.auth.user);
  const employer = useSelector((state: any) => state.employerAuth.employer);

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

  const { data: contactInfo } = useGetUserContactInfoQuery({
    username: user.username,
  });

  const [isEditBioOpen, setIsEditBioOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isContactInfoModalOpen, setIsContactInfoModalOpen] = useState(false);
  const [isLoginRequiredModalOpen, setIsLoginRequiredModalOpen] =
    useState(false);
  const [isProfileImageModalOpen, setIsProfileImageModalOpen] = useState(false);

  const goalId = user.goals?.[0]?._id || "";

  useEffect(() => {
    if (user) {
      getUserSkillsSummary({ username: user.username });
    }
  }, [user, getUserSkillsSummary]);

  const employabilityScore = skillsSummaryData?.data?.employabilityScore || 0;

  const handleBioSave = (newBio: string) => {
    onBioUpdate(newBio);
  };

  const handleShareProfile = () => {
    const publicProfileUrl = `${window.location.origin}/profile/${user.username}`;
    navigator.clipboard
      .writeText(publicProfileUrl)
      .then(() => {
        toast.success("Profile URL copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
    setTimeout(() => {
      window.open(publicProfileUrl, "_blank", "noopener,noreferrer");
    }, 1500);
  };

  const handleContact = () => {
    if (!employer) {
      setIsLoginRequiredModalOpen(true);
    } else if (user.is_contact_info_public) {
      setIsContactInfoModalOpen(true);
    } else {
      setIsEmailModalOpen(true);
    }
  };

  const hasGoalData = user?.goals && user?.goals.length > 0;
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
      <div className="mx-auto p-8">
        <div className="flex flex-col gap-8">
          {/* Profile Header */}
          <div className="flex items-center justify-between ">
            <div className="relative flex gap-6 items-center">
              <div
                className={`relative w-[130px] h-[130px] ${
                  !isPublic ? "cursor-pointer" : ""
                }`}
                onClick={() => !isPublic && setIsProfileImageModalOpen(true)}
              >
                {/* Profile Image */}
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
                {/* SVG Semi-Circle */}
                {user.current_status === "Actively seeking jobs" &&
                  currentStatusSVG}
                <div className="mb-[]">
                  <span className=" bg-slate-600 "></span>
                </div>
              </div>

              <div className="flex flex-col gap-2 items-start justify-end">
                <h1 className="text-[#202326] text-h2">{user.name}</h1>
                {hasGoalData ? (
                  <p className="text-[#414447] text-body2">
                    {country !== null ? `${state?.name}, ${country?.name}` : ""}
                  </p>
                ) : (
                  !isPublic && (
                    <button
                      onClick={() => setIsProfileModalOpen(true)}
                      className="text-[#000] text-body2  cursor-pointer flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 33 32"
                        fill="none"
                      >
                        <rect
                          x="0.5"
                          width="32"
                          height="32"
                          rx="16"
                          fill="currentColor"
                          fillOpacity="0.1"
                        />
                        <path
                          d="M15.5 17H10.5C10.2167 17 9.97917 16.9042 9.7875 16.7125C9.59583 16.5208 9.5 16.2833 9.5 16C9.5 15.7167 9.59583 15.4792 9.7875 15.2875C9.97917 15.0958 10.2167 15 10.5 15H15.5V10C15.5 9.71667 15.5958 9.47917 15.7875 9.2875C15.9792 9.09583 16.2167 9 16.5 9C16.7833 9 17.0208 9.09583 17.2125 9.2875C17.4042 9.47917 17.5 9.71667 17.5 10V15H22.5C22.7833 15 23.0208 15.0958 23.2125 15.2875C23.4042 15.4792 23.5 15.7167 23.5 16C23.5 16.2833 23.4042 16.5208 23.2125 16.7125C23.0208 16.9042 22.7833 17 22.5 17H17.5V22C17.5 22.2833 17.4042 22.5208 17.2125 22.7125C17.0208 22.9042 16.7833 23 16.5 23C16.2167 23 15.9792 22.9042 15.7875 22.7125C15.5958 22.5208 15.5 22.2833 15.5 22V17Z"
                          fill="currentColor"
                        />
                      </svg>
                      Add profile details
                    </button>
                  )
                )}
              </div>
            </div>
            <div className="flex flex-col items-start justify-end gap-2 ">
              {hasGoalData ? (
                <>
                  <h2 className="text-[#414447] text-h2">
                    {user.goals?.[0]?.name} 
                  </h2>
                  <div className="flex items-center gap-2 rounded-lg">
                    <div className="flex items-baseline gap-1">
                      <span className="text-black text-[28px] font-ubuntu font-bold leading-[42px] tracking-[-0.5px]">
                        {employabilityScore}
                      </span>
                      <span className="text-black/40 text-[28px] font-ubuntu font-bold leading-[42px] tracking-[-0.5px]">
                        /10
                      </span>
                    </div>
                    <img
                      src={
                        employabilityScore >= 4 ? VerfiedIcon : UnverifiedIcon
                      }
                      className="w-5 h-5"
                      alt="Verified"
                    />
                  </div>
                  <span className="text-body2 text-[#414447]">
                    EmployAbility score
                  </span>
                </>
              ) : (
                !isPublic && (
                  <Button
                    onClick={() => setIsGoalModalOpen(true)}
                    className="bg-[#001630] text-white rounded-md px-6 py-3 font-medium hover:bg-[#001630]/90"
                  >
                    Set a goal
                  </Button>
                )
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="flex items-start justify-between gap-4">
            <p className="text-[#414447] text-body2 flex-1">{bio || ""}</p>
          </div>

          {/* contact */}
          {isPublic && !candidate && (
            <div className="flex items-start justify-between">
              <Button
                className="bg-[#001630] text-body2 text-white rounded-md px-6 py-2 hover:bg-[#001630]/90"
                onClick={handleContact}
              >
                Contact
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          {!isPublic && hasGoalData && (
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="flex w-[130px] h-[40px] px-3 py-2 justify-center items-center gap-3 text-black text-body2 hover:bg-transparent hover:text-black focus:ring-0"
                  onClick={handleShareProfile}
                >
                  <img src={Share || "/placeholder.svg"} alt="Share" />
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
                  <PopoverContent className="w-48 p-1.5" align="start">
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
                        <img
                          src={EditBio || "/placeholder.svg"}
                          alt="Edit Bio"
                        />
                        Edit bio
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
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
      {isPublic && (
        <EmailComposerModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          recipientEmail={contactInfo?.data?.email || ""}
          recipientName={user?.name || ""}
          employer={employer}
        />
      )}
      {/* Contact Info Modal */}
      {isPublic && (
        <ContactInfoModal
          isOpen={isContactInfoModalOpen}
          onClose={() => setIsContactInfoModalOpen(false)}
          email={contactInfo?.data?.email || ""}
          phoneNumber={contactInfo?.data?.phone_number || ""}
        />
      )}
      {isPublic && (
        <LoginRequiredModal
          isOpen={isLoginRequiredModalOpen}
          onClose={() => setIsLoginRequiredModalOpen(false)}
        />
      )}
      {!isPublic && (
        <EditProfileImageModal
          isOpen={isProfileImageModalOpen}
          onClose={() => setIsProfileImageModalOpen(false)}
          currentImage={user?.profile_image || null}
        />
      )}
    </div>
  );
};

export default ProfileBanner;
