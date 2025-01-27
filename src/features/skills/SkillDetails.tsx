import { Card, CardContent } from "@/components/ui/card";
import arrow from '@/assets/skills/arrow.svg';
import { useGetUserSkillDetailsQuery } from "@/api/skillsApiSlice";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserSkill, UserSkillsIntialValues } from "@/types/userSkillsType";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import SkillSummary from "./skilldetails/SkillSummary";
import SkillConcepts from "./skilldetails/SkillConcepts";
import Transcript from "./skilldetails/Transcript";
import PerformanceSummary from "./skilldetails/PerformanceSummary";
import SkillsProgress from "./skilldetails/SkillsProgress";

const SkillDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data } = useGetUserSkillDetailsQuery(id!);
  const [skillDetails, setSkillDetails] = useState<UserSkill>(UserSkillsIntialValues);


  useEffect(() => {
    if (data) {
      setSkillDetails(data.data);
      console.log(data.data)
    }

  }, [data]);

  return (

    <div className="h-[90vh] w-[88vw] max-w-[1800px] sm:px-[10%]">
      {/* Title Section */}
      <div className="flex items-center mb-2 pl-4 space-x-2">
        <button
          className="w-6 h-6 flex items-center justify-center bg-white rounded-full border border-gray-200"
          aria-label="Back"
        >
          <img src={arrow} alt="Back" className="w-3 h-3" />
        </button>
        <h2 className="text-md font-ubuntu font-medium text-black">
          React Skill Report
        </h2>
      </div>

      {/* Main Content Section */}
      <div className="flex h-[calc(90vh-40px)]">
        <div
          className="flex-1 overflow-y-auto"
          style={{
            scrollbarWidth: "none",
          }}
        >
          <div
            className="h-full"
          >
            <div className="p-5 space-y-4">
              {/* Skill Summary */}
              <SkillSummary summary={skillDetails.summary!} strengths={skillDetails.strengths!} areas_for_improvements={skillDetails.areas_for_improvement!} areas={skillDetails.areas!}/>

              {/* Core Skill Details */}
              <SkillConcepts areas={skillDetails.areas!} />

              {/* Transcript */}
              <Transcript transcription={skillDetails.latest_interview?.transcription!} />
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className=" lg:block w-[30%] bg-[#F7F7F7] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div className="space-y-6 p-6 max-w-3xl">

            <PerformanceSummary />

            {/* Download Report Card */}
            <Card className="border-none shadow-sm p-4 bg-white rounded-lg">
              <CardContent className="flex flex-col items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-800 font-sf-pro">
                    Get a pdf version of this skill report to be shared with employers
                  </h3>
                </div>
                <Button
                  size={"sm"}
                  variant={"outline"}
                  className="text-[#03963F] py-1 rounded-xl w-full border-[#03963F] hover:bg-green-50 hover:text-[#03963F]"
                >
                  <Download />
                  Download report
                </Button>
              </CardContent>
            </Card>

            <SkillsProgress areas={skillDetails.areas!}/>


          </div>
        </div>
      </div>
    </div>

  );
};

export default SkillDetails;
