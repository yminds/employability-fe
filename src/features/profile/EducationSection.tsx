import React, { useEffect, useState } from "react";
import { Building2, Clock } from "lucide-react";
import AddEditEducationModal from "../../components/modal/AddEditEducationModal"; // Adjust the path as necessary
import { Education } from "../../features/profile/types"; // Define these types accordingly

import {
  useGetEducationByIdQuery,
  useAddEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
} from "../../api/educationSlice";
import { useSelector } from "react-redux";
interface EducationSectionProps {
  initialEducation?: Education[];
}

const EducationSection: React.FC<EducationSectionProps> = ({}) => {
  const [fetchEdu , setFetchEdu]= useState(false)
  const user = useSelector((state: any) => state.auth.user);

  const [education, setEducation] = useState<Education[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(
    null
  );

  const { data } = useGetEducationByIdQuery(user._id,{


  });

  const [addEducation] = useAddEducationMutation();
  const [updateEducation] = useUpdateEducationMutation();
  const [deleteEducation] = useDeleteEducationMutation();

  useEffect(() => {
    if (data && data.data) {
      setEducation(data.data); // Unwrap the data from the response
    }
  }, [data, education]);

  console.log(education, "education");

  const openModal = (educationItem?: Education) => {
    setEditingEducation(educationItem || null); // Open modal for editing or adding
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (updatedEducation: Education[]) => {
    if (editingEducation) {
      // Update existing record
      const updated = updatedEducation[0];
      try {
        await updateEducation({
          id: updated._id, // Use the ID from the record
          updatedEducation: updated,
        }).unwrap();
        setFetchEdu(false)
        alert("Education updated successfully!");
      } catch (err) {
        console.error("Failed to update education:", err);
      }
    } else {
      // Add new record
      const newEducation = updatedEducation[0];
      try {
        await addEducation({
          ...newEducation,
          user_id: user._id,
        }).unwrap();
        alert("Education added successfully!");
      } catch (err) {
        console.error("Failed to add education:", err);
      }
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await deleteEducation(id).unwrap();
        alert("Education deleted successfully!");
      } catch (err) {
        console.error("Failed to delete education:", err);
      }
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 overflow-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Education</h2>
        <div className="flex space-x-2">
          <button
            onClick={openModal}
            className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 focus:outline-none"
            aria-label="Add/Edit education and certifications"
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
                fill-opacity="0.1"
              />
              <path
                d="M15.5 17H10.5C10.2167 17 9.97917 16.9042 9.7875 16.7125C9.59583 16.5208 9.5 16.2833 9.5 16C9.5 15.7167 9.59583 15.4792 9.7875 15.2875C9.97917 15.0958 10.2167 15 10.5 15H15.5V10C15.5 9.71667 15.5958 9.47917 15.7875 9.2875C15.9792 9.09583 16.2167 9 16.5 9C16.7833 9 17.0208 9.09583 17.2125 9.2875C17.4042 9.47917 17.5 9.71667 17.5 10V15H22.5C22.7833 15 23.0208 15.0958 23.2125 15.2875C23.4042 15.4792 23.5 15.7167 23.5 16C23.5 16.2833 23.4042 16.5208 23.2125 16.7125C23.0208 16.9042 22.7833 17 22.5 17H17.5V22C17.5 22.2833 17.4042 22.5208 17.2125 22.7125C17.0208 22.9042 16.7833 23 16.5 23C16.2167 23 15.9792 22.9042 15.7875 22.7125C15.5958 22.5208 15.5 22.2833 15.5 22V17Z"
                fill="#03963F"
              />
            </svg>
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
                fill-opacity="0.1"
              />
              <mask
                id="mask0_40000631_6956"
                maskUnits="userSpaceOnUse"
                x="6"
                y="6"
                width="21"
                height="20"
              >
                <rect x="6.5" y="6" width="20" height="20" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_40000631_6956)">
                <path
                  d="M11 21.5H12.0625L19.875 13.6875L18.8125 12.625L11 20.4375V21.5ZM10.2537 23C10.0429 23 9.86458 22.9285 9.71875 22.7854C9.57292 22.6425 9.5 22.4653 9.5 22.2537V20.4444C9.5 20.2453 9.53472 20.0556 9.60417 19.875C9.67361 19.6944 9.78472 19.5278 9.9375 19.375L19.875 9.4375C20.0278 9.28472 20.1933 9.17361 20.3717 9.10417C20.5499 9.03472 20.7374 9 20.9342 9C21.1308 9 21.3194 9.03472 21.5 9.10417C21.6806 9.17361 21.8472 9.28472 22 9.4375L23.0625 10.5C23.2153 10.6528 23.3264 10.8194 23.3958 11C23.4653 11.1806 23.5 11.3649 23.5 11.5529C23.5 11.7536 23.4651 11.9449 23.3954 12.1267C23.3257 12.3085 23.2147 12.4746 23.0625 12.625L13.125 22.5625C12.9722 22.7153 12.8059 22.8264 12.626 22.8958C12.4462 22.9653 12.257 23 12.0585 23H10.2537ZM19.3344 13.1656L18.8125 12.625L19.875 13.6875L19.3344 13.1656Z"
                  fill="#03963F"
                />
              </g>
            </svg>
          </button>
        </div>
      </div>

      {/* Education Entries */}
      <div className="divide-y divide-gray-200">
        {education.length === 0 && (
          <p className="text-gray-500">No education added yet.</p>
        )}

        {education.map((entry, index) => (
          <div key={index} className="flex items-start gap-4 py-4">
            {/* Icon */}
            <div className="flex-shrink-0 mt-1">
              {entry.highest_education_level
                ?.toLowerCase()
                ?.includes("secondary") ? (
                <Clock className="h-6 w-6 text-gray-500" />
              ) : (
                <Building2 className="h-6 w-6 text-gray-500" />
              )}
            </div>

            {/* Education Details */}
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">
                {entry.degree || "N/A"}
              </h3>
              <p className="text-sm text-gray-500">
                {entry.institute || "N/A"}
              </p>
              <p className="text-sm text-gray-500">
                {entry.board_or_certification || "N/A"}
              </p>
            </div>

            {/* CGPA and Dates */}
            <div className="text-right">
              <p className="font-medium text-gray-900">
                {entry.cgpa_or_marks ? `${entry.cgpa_or_marks} CGPA` : "N/A"}
              </p>
              <p className="text-sm text-gray-500">
                {entry.from_date
                  ? new Date(entry.from_date).toLocaleDateString()
                  : "N/A"}{" "}
                -{" "}
                {entry.till_date
                  ? new Date(entry.till_date).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AddEditEducationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialEducation={education}
        onSave={handleSave}
      />
    </div>
  );
};

export default EducationSection;
