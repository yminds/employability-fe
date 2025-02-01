import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ExperienceItem } from "@/features/profile/types";
import AddEditExperienceModal from "@/components/modal/AddEditExperienceModal";
import { useGetExperiencesByUserIdQuery } from "@/api/experienceApiSlice";
import { useSelector } from "react-redux";

// Images
import noExperience from "@/assets/profile/noeducation.svg";
import ExperienceIcon from "@/assets/profile/experienceIcon.svg";

interface ExperienceSectionProps {
  intialExperiences?: ExperienceItem[];
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  intialExperiences,
}) => {
  const user = useSelector((state: any) => state.auth.user);

  const { data, error } = useGetExperiencesByUserIdQuery(user?._id);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);

  const experiences = error ? [] : data?.data || intialExperiences;

  console.log(experiences);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const displayedExperiences = isExpanded
    ? experiences
    : experiences?.slice(0, 3) || [];

  const handleOpenModal = (mode: "add" | "edit") => {
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalMode(null);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-medium text-black font-['Ubuntu'] leading-[22px]">
            Experience
          </h2>
        </div>
        <div className="sticky top-0 bg-white z-10 px-6 py-4">
          {experiences?.length > 0 && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleOpenModal("add")}
                className="flex items-center space-x-1 text-[#001630] hover:text-[#062549] focus:outline-none"
                aria-label="Add experience"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="33"
                  height="32"
                  viewBox="0 0 33 32"
                  fill="none"
                >
                  <rect
                    x="0.5"
                    width="32"
                    height="32"
                    rx="16"
                    fill="currentColor"
                    fillOpacity="0.1"
                  />
                  <path
                    d="M15.5 17H10.5C10.2167 17 9.97917 16.9042 9.7875 16.7125C9.59583 16.5208 9.5 16.2833 9.5 16C9.5 15.7167 9.59583 15.4792 9.7875 15.2875C9.97917 15.0958 10.2167 15 10.5 15H15.5V10C15.5 9.71667 15.5958 9.47917 15.7875 9.2875C15.9792 9.09583 16.2167 9 16.5 9C16.7833 9 17.0208 9.09583 17.2125 9.2875C17.4042 9.47917 17.5 9.71667 17.5 10V15H22.5C22.7833 15 23.0208 15.0958 23.2125 15.2875C23.4042 15.4792 23.5 15.7167 23.5 16C23.5 16.2833 23.4042 16.5208 23.2125 16.7125C23.0208 16.9042 22.7833 17 22.5 17H17.5V22C17.5 22.2833 17.4042 22.5208 17.2125 22.7125C17.0208 22.9042 16.7833 23 16.5 23C16.2167 23 15.9792 22.9042 15.7875 22.7125C15.5958 22.5208 15.5 22.2833 15.5 22V17Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
              <button
                onClick={() => handleOpenModal("edit")}
                className="flex items-center space-x-1 text-[#001630] hover:text-[#062549] focus:outline-none"
                aria-label="Edit experience"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="33"
                  height="32"
                  viewBox="0 0 33 32"
                  fill="none"
                >
                  <rect
                    x="0.5"
                    width="32"
                    height="32"
                    rx="15"
                    fill="currentColor"
                    fillOpacity="0.1"
                  />
                  <path
                    d="M11 21.5H12.0625L19.875 13.6875L18.8125 12.625L11 20.4375V21.5ZM10.2537 23C10.0429 23 9.86458 22.9285 9.71875 22.7854C9.57292 22.6425 9.5 22.4653 9.5 22.2537V20.4444C9.5 20.2453 9.53472 20.0556 9.60417 19.875C9.67361 19.6944 9.78472 19.5278 9.9375 19.375L19.875 9.4375C20.0278 9.28472 20.1933 9.17361 20.3717 9.10417C20.5499 9.03472 20.7374 9 20.9342 9C21.1308 9 21.3194 9.03472 21.5 9.10417C21.6806 9.17361 21.8472 9.28472 22 9.4375L23.0625 10.5C23.2153 10.6528 23.3264 10.8194 23.3958 11C23.4653 11.1806 23.5 11.3649 23.5 11.5529C23.5 11.7536 23.4651 11.9449 23.3954 12.1267C23.3257 12.3085 23.2147 12.4746 23.0625 12.625L13.125 22.5625C12.9722 22.7153 12.8059 22.8264 12.626 22.8958C12.4462 22.9653 12.257 23 12.0585 23H10.2537ZM19.3344 13.1656L18.8125 12.625L19.875 13.6875L19.3344 13.1656Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          )}
          <AddEditExperienceModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            initialExperience={experiences}
            mode={modalMode}
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {experiences?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <img
              src={noExperience || "/placeholder.svg"}
              alt="No experience entries"
              className="w-20 h-20 mb-6"
            />
            <h3 className="text-base text-[#414447] font-normal mb-2 text-center font-sans leading-6 tracking-[0.24px]">
              You haven't added any experience yet.
            </h3>
            <p className="text-[#414447] text-center font-sans text-base font-normal leading-6 tracking-[0.24px]">
              <button
                onClick={() => handleOpenModal("add")}
                className="text-[#414447] underline underline-offset-2 hover:text-emerald-700 focus:outline-none"
              >
                Add experience
              </button>{" "}
              to show up here
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-[#E5E7EB] px-6">
              {displayedExperiences.map((item: ExperienceItem) => (
                <div key={item.id} className="flex items-start gap-6 p-6">
                  <div className="flex-shrink-0 mt-1">
                    <img
                      src={item.companyLogo || ExperienceIcon}
                      alt="Company Logo"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#000000] font-ubuntu text-base font-medium leading-[22px]">
                      {item.title}
                    </h3>
                    <p className="text-[#414447] text-base font-sf-pro font-normal leading-6 tracking-[0.24px]">
                      {item.company} • {item.employment_type}
                    </p>
                    <p className="text-[#68696B] text-sm font-sf-pro font-normal leading-6 tracking-[0.21px]">
                      {item.location}
                    </p>
                    <p className="text-[#68696B] text-sm font-sf-pro font-normal leading-5 tracking-[0.21px]">
                      {formatDate(item.start_date)} -{" "}
                      {formatDate(item.end_date) || "Present"}
                    </p>

                    {item.description && (
                      <p className="mt-4 text-[#414447] text-base font-sf-pro font-normal leading-6 tracking-[0.24px]">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* <div className="flex flex-col items-end gap-4">
                    <div className="flex items-center gap-4">
                      {item.duration && (
                        <span className="text-sm font-medium">
                          {item.duration}
                        </span>
                      )}
                      {item.isVerified && (
                        <div className="flex items-center text-emerald-600 space-x-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <path
                              d="M9.0065 11.0508L7.47083 9.46525C7.33978 9.32867 7.17751 9.25881 6.98401 9.25569C6.79052 9.25257 6.62036 9.32744 6.47354 9.48029C6.3365 9.62329 6.26798 9.79652 6.26798 10C6.26798 10.2035 6.3365 10.3767 6.47354 10.5197L8.4078 12.5357C8.5789 12.7138 8.77847 12.8029 9.0065 12.8029C9.23453 12.8029 9.4341 12.7138 9.6052 12.5357L13.5265 8.44876C13.6671 8.30199 13.7365 8.13031 13.7346 7.93374C13.7329 7.73716 13.6635 7.56236 13.5265 7.40934C13.3796 7.25649 13.211 7.17751 13.0205 7.17242C12.8301 7.16732 12.6616 7.24128 12.5147 7.3943L9.0065 11.0508Z"
                              fill="#10B754"
                            />
                            <path
                              d="M6.60294 19.0557L5.29459 16.7629L2.81983 16.2089C2.60756 16.166 2.43804 16.0497 2.31125 15.86C2.18446 15.6704 2.13384 15.4649 2.15938 15.2437L2.40137 12.5907L0.718334 10.5841C0.572778 10.4223 0.5 10.2276 0.5 10C0.5 9.77236 0.572778 9.57767 0.718334 9.41594L2.40137 7.40934L2.15938 4.75631C2.13384 4.53508 2.18446 4.32963 2.31125 4.13996C2.43804 3.95028 2.60756 3.834 2.81983 3.7911L5.29459 3.23707L6.60294 0.944311L7.99346 2.35266L10.384 4.74318L12.7746 7.1337L15.1651 9.52422L17.5557 11.9147L19.9462 14.3052L21.3546 16.6957L23.7451 19.0862C23.9574 19.2985 24.0747 19.567 24.0747 19.86C24.0747 20.1529 23.9574 20.4214 23.7451 20.6337L21.3546 23.0242L19.9462 25.4147L17.5557 27.8052L15.1651 30.1957L12.7746 32.5862L10.384 35C10.1717 35.1529 9.90318 35.2276 9.60854 35.2276C9.3139 35.2276 9.04538 35.1529 8.83301 35L6.4425 32.5862L4.05198 30.1957L1.66146 27.8052L0.253125 25.4147L1.66146 23.0242L4.05198 20.6337C4.26425 20.4214 4.43277 20.1529 4.43277 19.86C4.43277 19.567 4.26425 19.2985 4.05198 19.0862L1.66146 16.6957L0.253125 14.3052L2.64367 11.9147L0.253125 9.52422L2.64367 7.1337L5.0342 4.74318L7.42472 2.35266L8.83301 0.944311L10.2414 2.35266L12.6319 4.74318L15.0224 7.1337L17.413 9.52422L19.8035 11.9147L22.194 14.3052L24.5845 16.6957L23.1762 19.0862Z"
                              fill="#10B754"
                            />
                          </svg>
                          <span className="text-sm font-medium">Verified</span>
                        </div>
                      )}
                    </div>
                  </div> */}
                </div>
              ))}
            </div>
            {experiences?.length > 3 && (
              <div className="flex justify-center py-4">
                <button
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                  onClick={toggleExpand}
                >
                  {isExpanded ? "Show less" : "View all"}
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 ml-1" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-1" />
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ExperienceSection;
