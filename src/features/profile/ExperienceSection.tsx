import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ExperienceItem } from "@/features/profile/types";
import AddEditExperienceModal from "@/components/modal/AddEditExperienceModal";
import { useGetExperiencesByUserIdQuery } from "@/api/experienceApiSlice";
import { useSelector } from "react-redux";

// Images
import noExperience from "@/assets/profile/noskills.svg";
import ExperienceIcon from "@/assets/profile/experienceIcon.svg";

interface ExperienceSectionProps {
  intialExperiences?: ExperienceItem[];
  isPublic: boolean;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  intialExperiences,
  isPublic,
}) => {
  const user = useSelector((state: any) => state.auth.user);

  const { data, error } = useGetExperiencesByUserIdQuery(user?._id, {
    skip: isPublic,
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<boolean[]>(
    []
  );

  const experiences = error ? [] : data?.data || intialExperiences;

  console.log(experiences);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleDescription = (index: number) => {
    setExpandedDescriptions((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
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
      <CardHeader className="flex flex-row items-start justify-between px-8 pt-8 pb-0">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-medium text-black font-['Ubuntu'] leading-[22px]">
            Experience
          </h2>
        </div>
        {experiences?.length > 0 && !isPublic && (
          <div className="sticky top-0 bg-white">
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
          </div>
        )}
        <AddEditExperienceModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          initialExperience={experiences}
          mode={modalMode}
        />
      </CardHeader>

      <CardContent className="p-0">
        {experiences?.length === 0 ? (
          <div className="flex flex-col items-center justify-center pb-10 pt-6 px-8">
            <div className="py-[50px] items-center justify-center flex flex-col">
              <img
                src={noExperience || "/placeholder.svg"}
                alt="No experience entries"
                className="w-20 h-20 mb-6"
              />
              <h3 className="text-[#414447] text-body2 mb-2 text-center">
                {isPublic
                  ? "No Experience added yet."
                  : "You haven't added any experience yet."}
              </h3>
              {!isPublic && (
                <p className="text-[#414447] text-body2 text-center">
                  <button
                    onClick={() => handleOpenModal("add")}
                    className="text-[#414447] underline underline-offset-2 hover:text-emerald-700 focus:outline-none"
                  >
                    Add experience
                  </button>{" "}
                  to show up here
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="divide-y divide-[#E5E7EB] p-8 relative">
              {displayedExperiences.map(
                (item: ExperienceItem, index: number) => (
                  <div
                    key={item._id || index}
                    className={`flex items-start gap-6 ${
                      index === 0
                        ? "pt-0 pb-6"
                        : index === displayedExperiences.length - 1
                        ? "pt-6 pb-0"
                        : "py-6"
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <img
                        src={item.companyLogo || ExperienceIcon}
                        alt="Company Logo"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#000000] text-sub-header">
                        {item.title}
                      </h3>
                      <p className="text-[#414447] text-body2">
                        {item.company} • {item.employment_type}
                      </p>
                      <p className="text-[#68696B] text-sm font-dm-sans font-normal leading-6 tracking-[0.21px]">
                        {item.location}
                      </p>
                      <p className="text-[#68696B] text-sm font-dm-sans font-normal leading-5 tracking-[0.21px]">
                        {formatDate(item.start_date)} -{" "}
                        {formatDate(item.end_date) || "Present"}
                      </p>

                      {item.description && (
                        <div className="mt-4">
                          <p className="text-[#414447] text-body2">
                            {item.description.length > 150 ? (
                              <>
                                {expandedDescriptions[index]
                                  ? item.description
                                  : `${item.description.slice(0, 250)}...`}
                                <button
                                  onClick={() => toggleDescription(index)}
                                  className="text-blue-600 hover:text-blue-800 ml-1 focus:outline-none"
                                >
                                  {expandedDescriptions[index]
                                    ? "view less"
                                    : "view more"}
                                </button>
                              </>
                            ) : (
                              item.description
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
              {!isExpanded && experiences?.length > 3 && (
                <>
                  <div className="absolute bottom-0 left-0 right-0 ">
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[211px]"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(255, 255, 255, 0) 20%, #FFF 100%)",
                      }}
                    />
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
                      <button
                        className="flex items-center text-sm text-[#000] hover:text-gray-900"
                        onClick={toggleExpand}
                      >
                        View all
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            {isExpanded && experiences?.length > 3 && (
              <div className="flex justify-center pb-4">
                <button
                  className="flex items-center text-sm text-[#000] hover:text-gray-900"
                  onClick={toggleExpand}
                >
                  Show less
                  <ChevronUp className="h-4 w-4 ml-1" />
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
