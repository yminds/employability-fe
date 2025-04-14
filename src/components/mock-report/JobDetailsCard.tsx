
import React from 'react';
import defaultImg from "@/assets/employer-company/DefaultCompanyLogo.svg"

const JobCard: React.FC<{ jobDetails: any, takenAT: string }> = ({ jobDetails, takenAT }) => {
    console.log("Invite Id in the Job Card", takenAT);

    const { job } = jobDetails;
    const company = job?.company;
  
    return (
        <div className="flex items-center justify-between bg-white shadow-sm rounded-lg p-4 w-full border border-gray-200">
            {/* Left Section: Logo + Job Info */}
            <div className="flex items-center space-x-4">
                {/* Company Logo */}
                <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full">
                    <img
                        src={company?.logo !== "" ? company?.logo : defaultImg}
                        alt={company?.name}
                        className="w-[80%] h-[80%] object-cover"
                    />
                </div>

                {/* Job Details */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-900">{job?.title}</h3>
                    <p className="text-sm text-gray-500">{company?.name}</p>
                    <p className="text-xs text-gray-400">
                        {new Date(takenAT).toLocaleString()} IST
                    </p>
                </div>
            </div>
        </div>
    );
};

export default JobCard;
