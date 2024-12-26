import { Card } from "@/components/ui/card";
import { Interview } from "@/types/userSkillsType";
import { convertTimestamp } from "@/utils/skills/skillDetail";


const Transcript:React.FC<Interview>= ({transcription}) => {

    return (
        <Card className="border-none shadow-sm p-6">
            <div className="flex justify-between items-center pb-4 mb-1">
                <h1 className="text-md font-semibold">Transcript</h1>
                <div className="flex items-center space-x-4">
                    <button className="px-4 py-2 bg-green-100 text-green-600 rounded-lg text-sm">
                        Copy
                    </button>
                    <div className="flex items-center border border-gray-300 rounded-lg text-sm">
                        <button className="px-4 py-2 bg-gray-200 rounded-md text-sm">Search</button>
                    </div>
                </div>
            </div>

            {/* Transcript Entries */}
            <div className="space-y-4">
                {transcription?.map((entry, index) => (
                    <div key={index} className="text-sm">
                        <div className="flex space-x-4">
                            <span className="text-[#03963F]">{convertTimestamp(entry.timestamp)}</span>
                            <span className={`${entry.role=="User"?"text-green-800":"text-green-800"}`}>{entry.role}</span>
                            <div>
                                <p className="font-normal text-gray-800">{entry.message}</p>
                             
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default Transcript;
