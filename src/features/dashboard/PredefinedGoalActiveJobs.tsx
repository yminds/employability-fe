import React from 'react';

// Jobs
const jobs = [
    {
        id: 1,
        logo: "https://via.placeholder.com/40", // Replace with actual logo URL
        title: "Product Engineer",
        company: "Zoho",
        type: "Freelance",
        salary: "$120k-$160k",
        location: "Kochi, Kerala, India",
    },
    {
        id: 2,
        logo: "https://via.placeholder.com/40", // Replace with actual logo URL
        title: "Technical Lead",
        company: "Paypal",
        type: "Full-time",
        salary: "$120k-$160k",
        location: "Mountain View, California, USA",
    },
    {
        id: 3,
        logo: "https://via.placeholder.com/40", // Replace with actual logo URL
        title: "Frontend Developer",
        company: "Facebook",
        type: "Full-time",
        salary: "$120k-$160k",
        location: "Menlo Park, California, USA",
    },
    {
        id: 4,
        logo: "https://via.placeholder.com/40", // Replace with actual logo URL
        title: "Frontend Developer",
        company: "EY",
        type: "Full-time",
        salary: "$120k-$160k",
        location: "Menlo Park, California, USA",
    },
];

const PredefinedGoalActiveJobs: React.FC = () => {
    return <>
        <div className="flex flex-col items-start gap-6 flex-1 self-stretch">
            <h5 className="text-black text-opacity-80 text-base font-medium leading-5 font-ubuntu">400 Active Jobs in India</h5>
            <div className="flex flex-col items-start gap-3 w-full">
                {jobs.map((job) => (
                    <div
                        key={job.id}
                        className="flex items-center gap-4 p-6 border border-gray-200 bg-[#FAFAFA] rounded-md w-full"
                    >
                        {/* Logo */}
                        <img
                            src={job.logo}
                            alt={job.company}
                            className="w-12 h-12 rounded-full object-cover"
                        />

                        {/* Job Details */}
                        <div className="flex-1 flex flex-col items-start gap-1">
                            <h3 className="text-black text-base font-medium leading-5 font-ubuntu">
                                {job.title}
                            </h3>
                            <div>
                                <p className="text-gray-600 text-base font-normal leading-6 tracking-[0.24px]">
                                    {job.company} • {job.type} • {job.salary}
                                </p>
                                <p className="text-gray-500 text-sm font-normal leading-6 tracking-[0.21px]">{job.location}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    </>
};

export default PredefinedGoalActiveJobs;