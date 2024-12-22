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
    return <div>
    <aside className="mt-8 bg-white shadow-sm rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold mr-3">Y</div>
        <div>
          <h3 className="text-lg font-medium">{name}</h3>
          <p className="text-gray-500">Profile completion <span className="text-green-500">{completionPercentage}%</span></p>
        </div>
      </div>
  
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Complete your profile</h4>
        <div className="relative w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
        </div>
        <div className="text-right text-sm mt-1 text-gray-600">{completionPercentage}%</div>
      </div>
  
      <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded w-full mb-2 hover:bg-gray-300">{importButtonLabel}</button>
      <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded w-full mb-2 hover:bg-gray-300">{uploadButtonLabel}</button>
      <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded w-full hover:bg-gray-300">{manualButtonLabel}</button>
    </aside>
    </div>
  };

export default ProfileCard;