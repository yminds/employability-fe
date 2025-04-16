import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useState } from "react";
import {
  CheckIcon,
  CopyIcon,
  PencilIcon,
} from "lucide-react";
import ProfileURL from "@/assets/profile/profileURL.svg";
import Phone from "@/assets/profile/phone.svg";
import Mail from "@/assets/profile/mail.svg";
import { PhoneEditDialog } from "@/components/modal/PhoneNumberEditModal";

interface ContactInformationProps {
  profileUrl: string;
  phoneNumber: string;
  email: string;
  userId: string;
}

export default function ContactInformationSection({
  profileUrl,
  phoneNumber,
  email,
  userId,
}: ContactInformationProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState(phoneNumber);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      toast.success("Profile URL Copied");
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      toast.error("Failed to Copy URL");
    }
  };

  const handlePhoneNumberUpdated = (newPhoneNumber: string) => {
    setCurrentPhoneNumber(newPhoneNumber);
  };

  return (
    <>
      <Card className="w-full bg-white p-0 rounded-lg">
        <CardContent className="p-8 space-y-8">
          <h2 className="text-[#000000] font-ubuntu text-base font-medium leading-[22px]">
            Contact Information
          </h2>
          {/* </div> */}
          <div className="space-y-3 w-full">
            {/* Profile URL */}
            <div className="flex items-start space-x-4 pb-4 border-b border-[#E5E7EB]">
              <div className="flex-shrink-0 flex w-12 h-12 justify-center items-center rounded-md border border-black/10 bg-white">
                <img
                  src={ProfileURL || "/placeholder.svg"}
                  alt="Profile Url"
                  className="w-6 h-6"
                />
              </div>
              <div
                className="min-w-0 flex-1 group cursor-pointer"
                onClick={() => copyToClipboard(profileUrl)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-[#000000] font-ubuntu text-base font-medium leading-[22px] mb-1">
                    Profile URL
                  </h3>
                  <div className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isCopied ? (
                      <CheckIcon className="w-4 h-4 text-green-500" />
                    ) : (
                      <CopyIcon className="w-4 h-4" />
                    )}
                  </div>
                </div>
                <p className="text-[#414447] text-sm font-sf-pro font-normal leading-6 tracking-[0.24px] truncate">
                  {profileUrl}
                </p>
              </div>
            </div>

            {/* Mobile Number */}
            <div
              className="flex items-start space-x-4 pb-4 border-b border-[#E5E7EB] cursor-pointer group"
              onClick={() => setIsPhoneModalOpen(true)}
            >
              <div className="flex-shrink-0 flex w-12 h-12 justify-center items-center rounded-md border border-black/10 bg-white">
                <img
                  src={Phone || "/placeholder.svg"}
                  alt="Phone"
                  className="w-6 h-6"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-[#000000] font-ubuntu text-base font-medium leading-[22px] mb-1">
                    Mobile number
                  </h3>
                  <div className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <PencilIcon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-[#414447] text-sm font-sf-pro font-normal leading-6 tracking-[0.24px]">
                  {currentPhoneNumber || "Not Provided"}
                </p>
              </div>
            </div>

            {/* Email ID */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 flex w-12 h-12 justify-center items-center rounded-md border border-black/10 bg-white">
                <img
                  src={Mail || "/placeholder.svg"}
                  alt="Email"
                  className="w-6 h-6"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[#000000] font-ubuntu text-base font-medium leading-[22px] mb-1">
                  Email Id
                </h3>
                <p className="text-[#414447] text-sm font-sf-pro font-normal leading-6 tracking-[0.24px] break-words">
                  {email}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phone Number Edit Modal */}
      <PhoneEditDialog
        isOpen={isPhoneModalOpen}
        onOpenChange={setIsPhoneModalOpen}
        currentPhoneNumber={currentPhoneNumber}
        userId={userId}
        onPhoneNumberUpdated={handlePhoneNumberUpdated}
      />
    </>
  );
}
