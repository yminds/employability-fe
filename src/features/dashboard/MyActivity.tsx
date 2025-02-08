import React, { useEffect } from "react";
import { useGetUserSkillsSummaryMutation } from '@/api/skillsApiSlice';
import CircularProgress from "@/components/ui/circular-progress-bar";
import logo from '@/assets/skills/e-Logo.svg';
import { useSelector } from "react-redux";
import { RootState } from '@/store/store';
import PuzzlePieceImg from '@/assets/dashboard/puzzle_piece.svg';
import FolderOpenImg from '@/assets/dashboard/folder_open.svg';
import ChalkboardUserImg from '@/assets/dashboard/chalkboard_user.svg';

interface MyActivityProps {
    displayScore: boolean;
    goalId : string
}

const MyActivityCard: React.FC<MyActivityProps> = ({ displayScore, goalId}) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const user_id = user ? user._id : "";
    
    const [getUserSkillsSummary, { data: skillsSummaryData, error, isLoading }] = useGetUserSkillsSummaryMutation();

    let verifiedSkillsCnt = "0";
    const totalSkills:any = skillsSummaryData?.data?.totalSkills || "0";
    const totalVerifiedSkills = skillsSummaryData?.data?.totalVerifiedSkills || "0";
    if(totalSkills > 0){
        verifiedSkillsCnt = totalVerifiedSkills+"/"+totalSkills;
    }

    // Fetch data when component mounts or selectedGoalId changes
    useEffect(() => {
      if (user_id && goalId) {
        getUserSkillsSummary({ userId: user_id, goalId }); // Call the mutation with parameters
      }
    }, [user_id, goalId, getUserSkillsSummary]);
   
    // Activity Score
    const totalSkillsNum = Number(totalSkills) || 0;
    const totalVerifiedSkillsNum = Number(totalVerifiedSkills) || 0;

    const averageVerifiedPercentage = totalSkillsNum > 0 ? parseFloat(((totalVerifiedSkillsNum / totalSkillsNum) * 100).toFixed(2)) : 0;
    const averageVerifiedScore = totalSkillsNum > 0 ? parseFloat((averageVerifiedPercentage / 10).toFixed(2)) : 0;

    return <>
        <aside className="bg-white p-6 flex flex-col items-start self-stretch rounded-[9px] border border-[#0000000D] shadow-sm gap-6">

            {displayScore ? (
                <div className="p-4 w-full h-[92px] bg-green-50 rounded-lg flex items-center space-x-4">
                    <div className="relative w-[60px] h-[60px] flex items-center justify-center border rounded-full">
                    {/* Circular Progress Bar */}
                    <CircularProgress progress={averageVerifiedPercentage} size={60} strokeWidth={6} showText={false} />
                    <img className="absolute w-8 h-8" src={logo} alt="short logo" />
                    </div>
                    <div>
                    <p className="text-2xl font-bold text-gray-900">{averageVerifiedScore}/10</p>
                    <p className="text-body2 text-[#414447] ">Employability Score</p>
                    </div>
                </div>
            ) : (
                <h4 className="text-black text-base font-medium leading-5">My activity</h4>
            )}

            <ul className="flex flex-col items-start gap-5 self-stretch">
                <li className="flex h-[48px] items-center gap-[14px] self-stretch">
                    <div className="flex w-[48px] h-[48px] p-[9px] px-[10px] justify-center items-center gap-[10px] rounded-[48px] border border-black/5 bg-[rgba(250,250,250,0.98)]">
                        <img
                            src={PuzzlePieceImg}
                            alt=""
                            className="w-6 h-6"
                        />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-black text-sub-header">{verifiedSkillsCnt}</span>
                        <span className="text-gray-600 text-body2 ">verified skills</span>
                    </div>
                </li>
                <li className="flex h-[48px] items-center gap-[14px] self-stretch">
                    <div className="flex w-[48px] h-[48px] p-[9px] px-[10px] justify-center items-center gap-[10px] rounded-[48px] border border-black/5 bg-[rgba(250,250,250,0.98)]">
                        <img
                            src={FolderOpenImg}
                            alt=""
                            className="w-6 h-6"
                        />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-black text-sub-header">0</span>
                        <span className="text-gray-600 text-body2 ">projects added</span>
                    </div>
                </li>
                <li className="flex h-[48px] items-center gap-[14px] self-stretch">
                    <div className="flex w-[48px] h-[48px] p-[9px] px-[10px] justify-center items-center gap-[10px] rounded-[48px] border border-black/5 bg-[rgba(250,250,250,0.98)]">
                        <img
                            src={ChalkboardUserImg}
                            alt=""
                            className="w-6 h-6"
                        />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-black text-sub-header">0</span>
                        <span className="text-gray-600 text-body2 ">upskilling</span>
                    </div>
                </li>
            </ul>
        </aside>
    </>
};

export default MyActivityCard;