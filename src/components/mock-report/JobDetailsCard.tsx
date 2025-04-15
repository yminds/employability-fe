
import React, { useEffect, useState } from 'react';
import defaultImg from "@/assets/employer-company/DefaultCompanyLogo.svg"
import { useGetCountriesQuery, useGetStatesQuery } from '@/api/locationApiSlice';
import { useSelector } from 'react-redux';
import { RootState } from "@/store/store";
import { useShortlistMutation, useGetShortlistStatusQuery } from '@/api/interviewInvitesApiSlice';

const JobCard: React.FC<{ jobDetails: any, takenAT: string, isEmployer: boolean, profile: any, inviteId: string }> = ({ jobDetails, takenAT, isEmployer, profile, inviteId }) => {
	const { data, error: shortListError, isLoading: shortListStatus } = useGetShortlistStatusQuery(inviteId);
	const [shortlistCandidate] = useShortlistMutation();
	const [shortlist, setShortlist] = useState<boolean | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { job } = jobDetails;
	const company = job?.company;

	const { data: countries = [] } = useGetCountriesQuery();
	const { data: states = [] } = useGetStatesQuery(profile.address.country, {
		skip: !profile.address.country,
	});
	const user = useSelector((state: RootState) => state.auth.user);

	const country = profile.address?.country
		? countries.find((c) => c.isoCode === profile.address.country)
		: "";

	const state =
		user?.address?.state && user?.address?.country
			? states.find((s) => s.isoCode === user?.address.state)
			: null;


	const handleShortlist = async () => {
		setIsLoading(true);
		try {
			// Call your shortlist mutation API here
			await shortlistCandidate(inviteId).unwrap();
			setShortlist(true); // Update the shortlist state to true after success
		} catch (err) {
			console.error("Error shortlisting candidate:", err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (data) {
			console.log('data', data)
			setShortlist(data.shortlist); // Set the shortlist value from API response
		}
	}, [data]);

	return (
		<>
			{!isEmployer ?
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
							<h3 className="text-h2 text-grey-7">{job?.title}</h3>
							<p className="text-body2 text-[#00000099]">{company?.name}</p>
							<p className="text-grey-10 font-dm-sans text-[14px] font-normal leading-6 tracking-[0.07px]">
								{new Date(takenAT).toLocaleString()} IST
							</p>
						</div>
					</div>
				</div>
				:
				<div className="flex items-center justify-between bg-white shadow-sm rounded-lg p-4 w-full border border-gray-200">
					{/* Left Section: Logo + Job Info */}
					<div className="flex items-center space-x-4">
						{/* Company Logo */}
						<div className="w-10 h-10 flex items-center justify-center bg-white rounded-full">
							<img
								src={profile?.profile_image !== "" ? profile?.profile_image : defaultImg}
								alt={company?.name}
								className=" w-10 h-10 object-cover rounded-full"
							/>
						</div>

						{/* Job Details */}
						<div>
							<h3 className="text-h2 text-grey-7">{profile.name}</h3>
							<p className="text-body2 text-[#00000099]">{typeof country === "object" && country?.name} {state?.name}</p>
							<p className=" text-grey-10 font-dm-sans text-[14px] font-normal leading-6 tracking-[0.07px]">
								{new Date(takenAT).toLocaleString()} IST
							</p>
						</div>
					</div>

					<div className="flex gap-2">
						<a
							href={`https://employability.ai/profile/${profile.username}`}
							target="_blank"
							rel="noopener noreferrer"
							className="px-4 py-2 rounded border border-[#001738] text-[#001738] text-sm font-medium hover:bg-[#0017380d] transition"
						>
							View Full profile
						</a>
						<button
							onClick={handleShortlist}
							disabled={isLoading || (shortlist ?? false)} 
							className={`px-4 py-2 rounded text-sm font-medium transition ${isLoading || shortlist
									? "bg-[#E0E0E0] cursor-not-allowed text-white" // Lighter background when disabled
									: "bg-[#001738] text-white hover:bg-[#001738cc]"
								}`}
						>
							{isLoading
								? "Shortlisting..."
								: shortlist
									? "Shortlisted" // Show "Shortlisted" text if the candidate is already shortlisted
									: "Shortlist candidate"}
						</button>
					</div>
				</div>}
		</>
	);
};

export default JobCard;
