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
import {
  useGetPublicUserSkillSummaryMutation,
  useGetUserContactInfoQuery,
} from "@/api/userPublicApiSlice";
import Share from "@/assets/profile/share.svg";
import { toast } from "sonner";
import GoalDialog from "@/components/skills/setGoalDialog";
import { useSelector } from "react-redux";
import EmailComposerModal from "@/components/modal/EmailComposerModal";
import ContactInfoModal from "@/components/modal/ContactInfoModal";
import LoginRequiredModal from "@/components/modal/LoginRequiredModal";
import EditProfileImageModal from "@/components/modal/EditProfileImageModal";
import VerfiedIcon from "../../assets/skills/verified.svg";
import UnverifiedIcon from "../../assets/skills/unverifies.svg";

interface ProfileBannerMobileProps {
  user: any;
  bio: string;
  onBioUpdate: (bio: string) => void;
  isPublic: boolean;
}

const ProfileBannerMobile: React.FC<ProfileBannerMobileProps> = ({
  user,
  bio,
  onBioUpdate,
  isPublic,
}) => {
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

  const employabilityScore = skillsSummaryData?.data?.employabilityScore || 0;

  useEffect(() => {
    if (user) {
      getUserSkillsSummary({ username: user.username });
    }
  }, [user, getUserSkillsSummary]);

  const [isEditBioOpen, setIsEditBioOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isContactInfoModalOpen, setIsContactInfoModalOpen] = useState(false);
  const [isLoginRequiredModalOpen, setIsLoginRequiredModalOpen] =
    useState(false);
  const [isProfileImageModalOpen, setIsProfileImageModalOpen] = useState(false);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const fullName = user.name;
  const goalId = user.goals?.[0]?._id || "";
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

  const handleContact = () => {
    if (!employer) {
      setIsLoginRequiredModalOpen(true);
    } else if (user.is_contact_info_public) {
      setIsContactInfoModalOpen(true);
    } else {
      setIsEmailModalOpen(true);
    }
  };

  const hasGoalData = user.goals && user.goals.length > 0;

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
        <div className="pt-8 sm:pt-5 pb-4 sm:pb-1">
          {/* Profile header section */}
          <div className="flex items-center justify-between px-8 sm:px-5">
            {/* Profile image */}
            <div
              className={`w-[96px] h-[96px] ${
                !isPublic ? "cursor-pointer" : ""
              }`}
              onClick={() => !isPublic && setIsProfileImageModalOpen(true)}
            >
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
            <div className="flex-1 mx-6">
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
              <div className="mt-6 mb-[6px] px-8 sm:px-5">
                <h3 className="text-[#202326] text-lg font-medium font-ubuntu">
                  {user.goals?.[0]?.name}
                </h3>
              </div>

              {/* Employability score */}
              <div className="px-8 sm:px-5 flex items-center">
                <div className="flex items-baseline">
                  <span className="text-black text-[28px] font-ubuntu font-bold leading-[42px] tracking-[-0.5px]">
                    {employabilityScore}
                  </span>
                  <span className="text-black/40 text-[28px] font-ubuntu font-bold leading-[42px] tracking-[-0.5px]">
                    /10
                  </span>
                </div>
                <img
                  src={employabilityScore >= 4 ? VerfiedIcon : UnverifiedIcon}
                  className="w-5 h-5"
                  alt="Verified"
                />
              </div>
              <div className="px-8 sm:px-5">
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
          <div className="mt-2 px-4 sm:px-1">
            <div className="rounded-lg p-4">
              <p className="text-[#414447] text-body2">{bio || ""}</p>
            </div>
          </div>

          {/* contact */}
          {isPublic && !candidate && (
            <div className="flex items-start justify-between px-8 sm:px-4 pb-4">
              <Button
                className="bg-[#001630] text-body2 text-white rounded-md px-6 py-2 hover:bg-[#001630]/90"
                onClick={handleContact}
              >
                Contact
              </Button>
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

export default ProfileBannerMobile;
