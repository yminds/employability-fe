import React from 'react';
import { Link } from 'react-router-dom';
import GoalList from "@/features/dashboard/GoalList";
import GoalFormDialog from "@/features/dashboard/GoalFormDialog";

const SetGoalCard: React.FC = () => {
    return <>
        <div className="flex flex-col items-start gap-12 self-stretch">
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="mentor" className="rounded-[9px] border border-black/10 bg-[#FFF] hover:border-[#8B5CF6]">
                    <div className="flex flex-col items-start gap-8 relative p-6">
                        <div className="h-[50px]">
                            <img
                                src="./src/assets/set-goal/career_goal.svg"
                                alt="Skills"
                                className="absolute top-0 start-0"
                            />
                        </div>

                        <div className="flex flex-col items-start gap-3.5 self-stretch">
                            <h3 className="text-gray-800 text-lg font-medium leading-6 tracking-tight"
                            >Career Mentor</h3>
                            <p className="text-gray-600 text-base font-normal leading-6 tracking-wide">Unsure where to start? Let AI guide you to the perfect career goal.</p>
                        </div>
                    </div>
                </Link>

                {/* Custom Goal Dialog */}
                <GoalFormDialog isLoading={false} error={false} />
            </section>

            <section className="flex flex-col items-start gap-4 self-stretch">
                <h5 className="text-[#909091] text-[20px] font-medium leading-[26px] tracking[-0.2px]"
                >Predefined Goals</h5>
                <GoalList isLoading={false} error={false}/>
            </section>

        </div>
    </>
};

export default SetGoalCard;