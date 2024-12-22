import React from 'react';

interface ProfileCardProps {
    name: string;
    completionPercentage: number;
    importButtonLabel: string;
    uploadButtonLabel: string;
    manualButtonLabel: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
    name,
    completionPercentage,
    importButtonLabel,
    uploadButtonLabel,
    manualButtonLabel,
}) => {
    return <>
        <aside className="bg-white p-6 flex flex-col items-start self-stretch rounded-[9px] border border-[#0000000D] shadow-sm gap-3">
            <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold mr-3">Y</div>
                <div>
                    <h3 className="text-gray-600 text-[20px] font-medium leading-[26px] tracking-[-0.2px]">{name}</h3>
                </div>
            </div>

            <div className="h-px self-stretch bg-[#D9D9D9] mt-2 mb-2"></div>

            <div className="flex flex-col items-start gap-2 self-stretch">
                <h4 className="text-gray-900 text-base font-medium leading-5">Complete your profile</h4>
                <div className="flex items-center gap-5 self-stretch">
                    <div className="relative w-full bg-[#FAFAFA] rounded-full h-[6px]">
                        <div className="bg-[#2EE578] h-[6px] rounded-full" style={{ width: `${completionPercentage}%` }}></div>
                    </div>
                    <span className="text-gray-60 text-sm font-medium leading-normal">{completionPercentage}%</span>
                </div>
            </div>

            <p className="text-black text-base font-normal leading-6 tracking-wide mb-2">Employers are <span className="text-green-500">3 times</span> more likely to hire a candidate with a complete profile.</p>

            <button className="flex items-center gap-3 p-1 py-0 justify-between overflow-hidden text-gray-600 text-ellipsis text-base font-normal leading-6 tracking-[0.24px]">
                <img
                    src="./src/assets/dashboard/subtract.svg"
                    alt=""
                    className="w-5 h-5"
                />
                {importButtonLabel}
            </button>
            <button className="flex items-center gap-3 p-1 py-0 justify-between overflow-hidden text-gray-600 text-ellipsis text-base font-normal leading-6 tracking-[0.24px]">
                <img
                    src="./src/assets/dashboard/upload.svg"
                    alt=""
                    className="w-5 h-5"
                />
               {uploadButtonLabel}
            </button>
            <button className="flex items-center gap-3 p-1 py-0 justify-between overflow-hidden text-gray-600 text-ellipsis text-base font-normal leading-6 tracking-[0.24px]">
                <img
                    src="./src/assets/dashboard/checklist_rtl.svg"
                    alt=""
                    className="w-5 h-5"
                />
                {manualButtonLabel}
            </button>
        </aside>
    </>
};

export default ProfileCard;