import { Card } from "@/components/ui/card";
import { Area } from "@/types/userSkillsType";
import { getRatingColor } from "@/utils/skills/skillDetail";

interface skillConceptsProps {
  areas: Area[];
}

const SkillConcepts: React.FC<skillConceptsProps> = ({ areas }) => {
  return (
    <div className="space-y-6">
      {areas.map((area, index) => (
        <div key={index} className="space-y-4">
          {/* Main card with name and score on the same line */}
          <Card className="border-none shadow-sm bg-white p-6 rounded-lg">
            <div className="flex justify-between items-center pb-4">
              <h3 className="text-sm font-semibold text-gray-800 font-ubuntu">{area.name}</h3>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-gray-500">Score :</p>
                <p className={`text-sm font-normal text-${getRatingColor(area.rating)}`}>{area.rating}</p>
              </div>
            </div>
            <div className="flex flex-row gap-4">



              {/* Card for Strengths */}
              <Card className="bg-[#F7F7F7] shadow-sm p-4 rounded-lg h-full border-none">
                <p className="text-sm font-normal text-gray-600">Strengths</p>
                <ul className="pl-5 mt-1 list-disc space-y-1 text-sm text-black">
                  {area.strengths.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </Card>

              {/* Card for Areas for Improvement */}
              <Card className="bg-[#F7F7F7] shadow-sm p-4 rounded-lg h-full border-none">
                <p className="text-sm font-normal text-gray-600">Areas for Improvement</p>
                <ul className="pl-5 mt-1 list-disc space-y-1 text-sm text-black">
                  {area.areas_for_improvement.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </Card>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default SkillConcepts;
