import { Card, CardContent } from "@/components/ui/card";
import ProfileURL from "@/assets/profile/profileURL.svg";
import Phone from "@/assets/profile/phone.svg";
import Mail from "@/assets/profile/mail.svg";

interface ContactInformationProps {
  profileUrl: string;
  phoneNumber: string;
  email: string;
}

export default function ContactInformationSection({
  profileUrl,
  phoneNumber,
  email,
}: ContactInformationProps) {
  return (
    <Card className="w-full bg-white p-0 rounded-lg">
      <CardContent className="p-8 space-y-8">
        <h2 className="text-[#000000] font-ubuntu text-base font-medium leading-[22px]">
          Contact Information
        </h2>
        <div className="space-y-3 w-full">
          {/* Profile URL */}
          <div className="flex items-start space-x-4 pb-4 border-b border-[#E5E7EB]">
            <div className="flex-shrink-0 flex w-12 h-12 justify-center items-center rounded-md border border-black/10 bg-white">
              <img src={ProfileURL} alt="Profile Url" className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-[#000000] font-ubuntu text-base font-medium leading-[22px] mb-1">
                Profile URL
              </h3>
              <p className="text-[#414447] text-sm font-sf-pro font-normal leading-6 tracking-[0.24px]">
                {profileUrl}
              </p>
            </div>
          </div>

          {/* Mobile Number */}
          <div className="flex items-start space-x-4 pb-4 border-b border-[#E5E7EB]">
            <div className="flex-shrink-0 flex w-12 h-12 justify-center items-center rounded-md border border-black/10 bg-white">
              <img src={Phone} alt="Phone" className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-[#000000] font-ubuntu text-base font-medium leading-[22px] mb-1">
                Mobile number
              </h3>
              <p className="text-[#414447] text-sm font-sf-pro font-normal leading-6 tracking-[0.24px]">
                {phoneNumber}
              </p>
            </div>
          </div>

          {/* Email ID */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 flex w-12 h-12 justify-center items-center rounded-md border border-black/10 bg-white">
              <img src={Mail} alt="Email" className="w-6 h-6" />
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
  );
}
