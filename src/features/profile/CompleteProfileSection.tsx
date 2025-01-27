import { Card, CardContent } from "@/components/ui/card"
import { LinkedinIcon as LinkedInIcon, UploadIcon, EditIcon } from "lucide-react"

interface CompleteProfileSectionProps {
  completionPercentage: number
  onLinkedInImport: () => void
  onResumeUpload: () => void
  onManualFill: () => void
}

export default function CompleteProfileSection({
  completionPercentage,
  onLinkedInImport,
  onResumeUpload,
  onManualFill,
}: CompleteProfileSectionProps) {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h2 className="text-[#000000] font-ubuntu text-base font-medium leading-[22px] mb-4">Complete your profile</h2>
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex-grow bg-[#E5E7EB] h-2 rounded-full overflow-hidden">
            <div className="bg-[#03963F] h-full" style={{ width: `${completionPercentage}%` }}></div>
          </div>
          <span className="text-[#414447] text-sm font-medium">{completionPercentage}%</span>
        </div>
        <p className="text-[#000000] text-base font-normal mb-6 leading-6 tracking-[0.24px]">
          Employers are <span className="text-[#03963F] text-base font-normal">3 times</span> more likely to hire a
          candidate with a complete profile.
        </p>
        <div className="space-y-4">
          <button
            onClick={onLinkedInImport}
            className="flex items-center space-x-3 w-full text-[#414447] hover:text-[#000000] transition-colors"
          >
            <div className="p-2">
              <LinkedInIcon className="w-5 h-5" />
            </div>
            <span className="text-base font-normal leading-6 tracking-[0.24px]">Import from LinkedIn</span>
          </button>

          <button
            onClick={onResumeUpload}
            className="flex items-center space-x-3 w-full text-[#414447] hover:text-[#000000] transition-colors"
          >
            <div className="p-2">
              <UploadIcon className="w-5 h-5" />
            </div>
            <span className="text-base font-normal leading-6 tracking-[0.24px]">Upload your resume</span>
          </button>

          <button
            onClick={onManualFill}
            className="flex items-center space-x-3 w-full text-[#414447] hover:text-[#000000] transition-colors"
          >
            <div className="p-2">
              <EditIcon className="w-5 h-5" />
            </div>
            <span className="text-base font-normal leading-6 tracking-[0.24px]">Fill out manually</span>
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

