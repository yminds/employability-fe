import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, CloudCog } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ExperienceItem } from "../profile/types"; // Adjust your import path as needed
import type { ExperienceProps } from "../profile/types";
import AddEditExperienceModal from "@/components/modal/AddEditExperienceModal";
import { useGetExperiencesByUserIdQuery } from "@/api/experienceApiSlice";
import { useSelector } from "react-redux";

export default function ExperienceSection({
  experiences, // Possibly passed from parent
}: ExperienceProps) {
  const user = useSelector((state: any) => state.auth.user);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperince, setEditingExperince] =
    useState<ExperienceItem | null>(null);
  const [mappedExperiences, setMappedExperiences] = useState<ExperienceItem[]>(
    []
  );

  // console.log(experiences);

  // Fetch experiences from the server
  const { data, error, isLoading } = useGetExperiencesByUserIdQuery(user?._id);
  console.log(data);

  // Whenever we get new data from the server, map it to our ExperienceItem shape
  useEffect(() => {
    console.log("Raw data from API", data);

    if (data && data.data) {
      const mappedData: ExperienceItem[] = data.data.map((exp: any) => {
        // Function to format date to "Month Year"
        const formatDate = (dateString: string | null) => {
          if (!dateString) return null;
          const date = new Date(dateString);
          return date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          });
        };

        return {
          id: exp._id,
          jobTitle: exp.title,
          employmentType: exp.employment_type,
          companyName: exp.company,
          companyLogo: "",
          location: exp.location ?? "",
          startDate: formatDate(exp.start_date) ?? "",
          endDate: exp.currently_working ? null : formatDate(exp.end_date),
          currentlyWorking: exp.currently_working,
          jobType: exp.employment_type,
          isVerified: false,
          duration: "",
          currentCTC: "",
          expectedCTC: "",
          description: "",
        };
      });

      console.log("mapped data", mappedData);
      setMappedExperiences(mappedData);
    }
    // If the parent passed in "experiences" prop, you might want to default to that
    // else if (experiences && experiences.length > 0) {
    //   setMappedExperiences(experiences as ExperienceItem[]);
    // }
  }, [data, experiences]);

  // Handler when the modal “Save” is clicked
  // const handleSave = (updated: ExperienceItem[]) => {
  //   setMappedExperiences(updated);
  // };

  // Toggling how many items we show
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const displayedExperiences = isExpanded
    ? mappedExperiences
    : mappedExperiences.slice(0, 3);

  const openModal = (experience?: ExperienceItem) => {
    setEditingExperince(experience || null);
    setIsModalOpen(true);
  };

  // Render
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between ">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium text-gray-900">Experience</h2>
          {/* <span className="text-gray-500">({totalDuration})</span> */}
        </div>
        <div className="sticky top-0 bg-white z-10 px-6 py-4 ">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button
                onClick={() => openModal()}
                className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 focus:outline-none"
                aria-label="Add education"
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
                    fill="#03963F"
                    fillOpacity="0.1"
                  />
                  <path
                    d="M15.5 17H10.5C10.2167 17 9.97917 16.9042 9.7875 16.7125C9.59583 16.5208 9.5 16.2833 9.5 16C9.5 15.7167 9.59583 15.4792 9.7875 15.2875C9.97917 15.0958 10.2167 15 10.5 15H15.5V10C15.5 9.71667 15.5958 9.47917 15.7875 9.2875C15.9792 9.09583 16.2167 9 16.5 9C16.7833 9 17.0208 9.09583 17.2125 9.2875C17.4042 9.47917 17.5 9.71667 17.5 10V15H22.5C22.7833 15 23.0208 15.0958 23.2125 15.2875C23.4042 15.4792 23.5 15.7167 23.5 16C23.5 16.2833 23.4042 16.5208 23.2125 16.7125C23.0208 16.9042 22.7833 17 22.5 17H17.5V22C17.5 22.2833 17.4042 22.5208 17.2125 22.7125C17.0208 22.9042 16.7833 23 16.5 23C16.2167 23 15.9792 22.9042 15.7875 22.7125C15.5958 22.5208 15.5 22.2833 15.5 22V17Z"
                    fill="#03963F"
                  />
                </svg>
              </button>
              <button
                onClick={() => openModal(experiences[0])}
                className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 focus:outline-none"
                aria-label="Edit education"
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
                    fill="#03963F"
                    fillOpacity="0.1"
                  />
                  <path
                    d="M11 21.5H12.0625L19.875 13.6875L18.8125 12.625L11 20.4375V21.5ZM10.2537 23C10.0429 23 9.86458 22.9285 9.71875 22.7854C9.57292 22.6425 9.5 22.4653 9.5 22.2537V20.4444C9.5 20.2453 9.53472 20.0556 9.60417 19.875C9.67361 19.6944 9.78472 19.5278 9.9375 19.375L19.875 9.4375C20.0278 9.28472 20.1933 9.17361 20.3717 9.10417C20.5499 9.03472 20.7374 9 20.9342 9C21.1308 9 21.3194 9.03472 21.5 9.10417C21.6806 9.17361 21.8472 9.28472 22 9.4375L23.0625 10.5C23.2153 10.6528 23.3264 10.8194 23.3958 11C23.4653 11.1806 23.5 11.3649 23.5 11.5529C23.5 11.7536 23.4651 11.9449 23.3954 12.1267C23.3257 12.3085 23.2147 12.4746 23.0625 12.625L13.125 22.5625C12.9722 22.7153 12.8059 22.8264 12.626 22.8958C12.4462 22.9653 12.257 23 12.0585 23H10.2537ZM19.3344 13.1656L18.8125 12.625L19.875 13.6875L19.3344 13.1656Z"
                    fill="#03963F"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <AddEditExperienceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialExperience={mappedExperiences} // Pass the mapped data to the modal
        />
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-gray-100 px-6">
          {displayedExperiences.map((item) => (
            <div key={item.id} className="flex items-start gap-6 p-6">
              {/* If you have or want a company logo */}
              <img
                src={item.companyLogo || "https://via.placeholder.com/80"}
                alt={item.companyName}
                className="w-12 h-12 rounded-full object-cover bg-gray-50"
              />

              <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium text-gray-900">
                  {item.jobTitle}
                </h3>
                <p className="text-gray-600 mt-0.5">
                  {item.companyName} • {item.jobType}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">{item.location}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {item.startDate} - {item.endDate || "Present"}
                </p>

                {/* Description if you have one */}
                {item.description && (
                  <p className="mt-4 text-gray-600 text-sm">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end gap-4">
                <div className="flex items-center gap-4">
                  {/* If you compute a “duration” somewhere */}
                  {item.duration && (
                    <span className="text-sm font-medium">{item.duration}</span>
                  )}
                  {/* Verified badge if you have logic for that */}
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
                          d="M6.60294 19.0557L5.29459 16.7629L2.81983 16.2089C2.60756 16.166 2.43804 16.0497 2.31125 15.86C2.18446 15.6704 2.13384 15.4649 2.15938 15.2437L2.40137 12.5907L0.718334 10.5841C0.572778 10.4223 0.5 10.2276 0.5 10C0.5 9.77236 0.572778 9.57767 0.718334 9.41594L2.40137 7.40934L2.15938 4.75631C2.13384 4.53508 2.18446 4.32963 2.31125 4.13996C2.43804 3.95028 2.60756 3.834 2.81983 3.7911L5.29459 3.23712L6.60294 0.944286C6.71695 0.749682 6.87221 0.61696 7.0687 0.546121C7.26519 0.475281 7.46476 0.486047 7.6674 0.578418L10 1.60625L12.3326 0.578418C12.5352 0.486047 12.7348 0.475281 12.9313 0.546121C13.1278 0.61696 13.283 0.749682 13.3971 0.944286L14.7054 3.23712L17.1802 3.7911C17.3924 3.834 17.562 3.95028 17.6888 4.13996C17.8155 4.32963 17.8662 4.53508 17.8406 4.75631L17.5986 7.40934L19.2817 9.41594C19.4272 9.57767 19.5 9.77236 19.5 10C19.5 10.2276 19.4272 10.4223 19.2817 10.5841L17.5986 12.5907L17.8406 15.2437C17.8662 15.4649 17.8155 15.6704 17.6888 15.86C17.562 16.0497 17.3924 16.166 17.1802 16.2089L14.7054 16.7629L13.3971 19.0557C13.283 19.2503 13.1278 19.383 12.9313 19.4539C12.7348 19.5247 12.5352 19.514 12.3326 19.4216L10 18.3938L7.6674 19.4216C7.46476 19.514 7.26519 19.5247 7.0687 19.4539C6.87221 19.383 6.71695 19.2503 6.60294 19.0557Z"
                          stroke="#10B754"
                        />
                      </svg>
                      <span className="text-sm">Verified</span>
                    </div>
                  )}
                </div>
                {/* Another sample button */}
                <button className="text-sm text-gray-600 border rounded-lg px-4 py-1.5 hover:bg-gray-50">
                  View report
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View all / Show less toggle */}
        {mappedExperiences.length > 3 && (
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
      </CardContent>
    </Card>
  );
}
