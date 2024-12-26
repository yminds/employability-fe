import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { progressProps } from "@/types/userSkillsType";
import { getRatingColor, getRatingValue } from "@/utils/skills/skillDetail";


const SkillsProgress:React.FC<progressProps>= ({areas}) => {
    return (
        <Card className="border-none shadow-sm p-6 bg-white rounded-lg">
            <CardContent>
                {areas?.map((area, index) => (
                    <div key={index} className="mb-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">{area.name}</span>
                            <span className={`text-xs text-gray-500 font-medium text-${getRatingColor(area.rating)}`}>{area.rating}</span>
                        </div>
                        <Progress value={getRatingValue(area.rating)} max={100} className={`h-2 mt-2 bg-white border-2 border-gray-100`} color={`${getRatingColor(area.rating)}`}/>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

export default SkillsProgress