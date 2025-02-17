import { Card, CardContent } from "@/components/ui/card";
import SkillsIcon from "@/assets/profile/verifiedskills.svg";
import ProjectsIcon from "@/assets/profile/verifiedproject.svg";
import CertificationsIcon from "@/assets/profile/certification.svg";

interface StatsSectionProps {
  skills: number;
  projects: number;
  certifications: number;
}

export default function StatsSection({
  skills,
  projects,
  certifications,
}: StatsSectionProps) {
  return (
    <Card className="w-full bg-white p-0 rounded-lg">
      <CardContent className="p-8">
        <div className="space-y-6 divide-y divide-[#E5E7EB]">
          <div className="flex items-start gap-3">
            <div className="flex w-12 h-12 justify-center items-center bg-[#ffffff] rounded-lg border border-black/5">
              <img
                src={SkillsIcon || "/placeholder.svg"}
                alt=""
                className="w-6 h-6 flex-shrink-0"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] text-[#000000] font-ubuntu font-medium leading-[22px]">
                {skills}
              </span>
              <span className="text-[#414447] text-body2">
                Verified skills
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-6">
            <div className="flex w-12 h-12 justify-center items-center bg-[#ffffff] rounded-lg border border-black/5">
              <img
                src={ProjectsIcon || "/placeholder.svg"}
                alt=""
                className="w-6 h-6 flex-shrink-0"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] text-[#000000] font-ubuntu font-medium leading-[22px]">
                {projects}
              </span>
              <span className="text-[#414447] text-body2">
                Verified Projects
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-6">
            <div className="flex w-12 h-12 justify-center items-center bg-[#ffffff] rounded-lg border border-black/5">
              <img
                src={CertificationsIcon || "/placeholder.svg"}
                alt=""
                className="w-6 h-6 flex-shrink-0"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] text-[#000000] font-ubuntu font-medium leading-[22px]">
                {certifications}
              </span>
              <span className="text-[#414447] text-body2">
                Certifications
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
