import { useState } from "react";
import { Plus, Pencil, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ExperienceProps } from "../profile/types";
import AddEditExperienceModal from "@/components/modal/AddEditExperienceModal";

export default function ExperienceSection({
  experiences,
  totalDuration,
  onAdd,
  onEdit,
}: ExperienceProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const initialData =experiences
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [experience, setExperience] = useState(initialData);

  const handleSave = (updatedExperience: typeof initialData) => {
    setExperience(updatedExperience);
  };
  const displayedExperiences = isExpanded
    ? experiences
    : experiences.slice(0, 3);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium text-gray-900">Experience</h2>
          <span className="text-gray-500">({totalDuration})</span>
        </div>
        <div className="flex items-center gap-2">
          {onAdd && (
            <button
            onClick={() => setIsModalOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
          {onEdit && (
            <button
        onClick={() => setIsModalOpen(true)}
              className="w-8 h-8 flex items-center justify-center rounded-full  bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
            >
              <Pencil className="h-5 w-5" />
            </button>
          )}
        </div>
        <AddEditExperienceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialExperience={experiences}
          onSave={handleSave}
        />
      </CardHeader>

      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {displayedExperiences.map((item: any) => (
            <div key={item.id} className="flex items-start gap-6 p-6">
              <img
                src={item.companyLogo}
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
                <p className="mt-4 text-gray-600 text-sm">{item.description}</p>
              </div>

              <div className="flex flex-col items-end gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">{item.duration}</span>
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
                          d="M9.0065 11.0508L7.47083 9.46525C7.33978 9.32867 7.17751 9.25881 6.98401 9.25569C6.79052 9.25257 6.62036 9.32744 6.47354 9.48029C6.3365 9.62329 6.26798 9.79652 6.26798 10C6.26798 10.2035 6.3365 10.3767 6.47354 10.5197L8.4078 12.5357C8.5789 12.7138 8.77847 12.8029 9.0065 12.8029C9.23453 12.8029 9.4341 12.7138 9.6052 12.5357L13.5265 8.44876C13.6671 8.30199 13.7365 8.13031 13.7346 7.93374C13.7329 7.73716 13.6635 7.56236 13.5265 7.40934C13.3796 7.25649 13.211 7.17751 13.0205 7.17242C12.8301 7.16732 12.6616 7.24128 12.5147 7.3943L9.0065 11.0508ZM6.60294 19.0557L5.29459 16.7629L2.81983 16.2089C2.60756 16.166 2.43804 16.0497 2.31125 15.86C2.18446 15.6704 2.13384 15.4649 2.15938 15.2437L2.40137 12.5907L0.718334 10.5841C0.572778 10.4223 0.5 10.2276 0.5 10C0.5 9.77236 0.572778 9.57767 0.718334 9.41594L2.40137 7.40934L2.15938 4.75631C2.13384 4.53508 2.18446 4.32963 2.31125 4.13996C2.43804 3.95028 2.60756 3.834 2.81983 3.7911L5.29459 3.23712L6.60294 0.944286C6.71695 0.749682 6.87221 0.61696 7.0687 0.546121C7.26519 0.475281 7.46476 0.486047 7.6674 0.578418L10 1.60625L12.3326 0.578418C12.5352 0.486047 12.7348 0.475281 12.9313 0.546121C13.1278 0.61696 13.283 0.749682 13.3971 0.944286L14.7054 3.23712L17.1802 3.7911C17.3924 3.834 17.562 3.95028 17.6888 4.13996C17.8155 4.32963 17.8662 4.53508 17.8406 4.75631L17.5986 7.40934L19.2817 9.41594C19.4272 9.57767 19.5 9.77236 19.5 10C19.5 10.2276 19.4272 10.4223 19.2817 10.5841L17.5986 12.5907L17.8406 15.2437C17.8662 15.4649 17.8155 15.6704 17.6888 15.86C17.562 16.0497 17.3924 16.166 17.1802 16.2089L14.7054 16.7629L13.3971 19.0557C13.283 19.2503 13.1278 19.383 12.9313 19.4539C12.7348 19.5247 12.5352 19.514 12.3326 19.4216L10 18.3938L7.6674 19.4216C7.46476 19.514 7.26519 19.5247 7.0687 19.4539C6.87221 19.383 6.71695 19.2503 6.60294 19.0557Z"
                          fill="#10B754"
                        />
                        <path
                          d="M9.0065 11.0508L7.47083 9.46525C7.33978 9.32867 7.17751 9.25881 6.98401 9.25569C6.79052 9.25257 6.62036 9.32744 6.47354 9.48029C6.3365 9.62329 6.26798 9.79652 6.26798 10C6.26798 10.2035 6.3365 10.3767 6.47354 10.5197L8.4078 12.5357C8.5789 12.7138 8.77847 12.8029 9.0065 12.8029C9.23453 12.8029 9.4341 12.7138 9.6052 12.5357L13.5265 8.44876C13.6671 8.30199 13.7365 8.13031 13.7346 7.93374C13.7329 7.73716 13.6635 7.56236 13.5265 7.40934C13.3796 7.25649 13.211 7.17751 13.0205 7.17242C12.8301 7.16732 12.6616 7.24128 12.5147 7.3943L9.0065 11.0508ZM6.60294 19.0557L5.29459 16.7629L2.81983 16.2089C2.60756 16.166 2.43804 16.0497 2.31125 15.86C2.18446 15.6704 2.13384 15.4649 2.15938 15.2437L2.40137 12.5907L0.718334 10.5841C0.572778 10.4223 0.5 10.2276 0.5 10C0.5 9.77236 0.572778 9.57767 0.718334 9.41594L2.40137 7.40934L2.15938 4.75631C2.13384 4.53508 2.18446 4.32963 2.31125 4.13996C2.43804 3.95028 2.60756 3.834 2.81983 3.7911L5.29459 3.23712L6.60294 0.944286C6.71695 0.749682 6.87221 0.61696 7.0687 0.546121C7.26519 0.475281 7.46476 0.486047 7.6674 0.578418L10 1.60625L12.3326 0.578418C12.5352 0.486047 12.7348 0.475281 12.9313 0.546121C13.1278 0.61696 13.283 0.749682 13.3971 0.944286L14.7054 3.23712L17.1802 3.7911C17.3924 3.834 17.562 3.95028 17.6888 4.13996C17.8155 4.32963 17.8662 4.53508 17.8406 4.75631L17.5986 7.40934L19.2817 9.41594C19.4272 9.57767 19.5 9.77236 19.5 10C19.5 10.2276 19.4272 10.4223 19.2817 10.5841L17.5986 12.5907L17.8406 15.2437C17.8662 15.4649 17.8155 15.6704 17.6888 15.86C17.562 16.0497 17.3924 16.166 17.1802 16.2089L14.7054 16.7629L13.3971 19.0557C13.283 19.2503 13.1278 19.383 12.9313 19.4539C12.7348 19.5247 12.5352 19.514 12.3326 19.4216L10 18.3938L7.6674 19.4216C7.46476 19.514 7.26519 19.5247 7.0687 19.4539C6.87221 19.383 6.71695 19.2503 6.60294 19.0557Z"
                          stroke="#10B754"
                        />
                      </svg>
                      <span className="text-sm">Verified</span>
                    </div>
                  )}
                </div>
                <button className="text-sm text-gray-600 border rounded-lg px-4 py-1.5 hover:bg-gray-50">
                  View report
                </button>
              </div>
            </div>
          ))}
        </div>

        {experiences.length > 3 && (
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
