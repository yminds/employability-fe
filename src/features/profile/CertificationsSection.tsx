import React, { useEffect, useState } from "react";
import { Plus, Edit } from "lucide-react";
// import CertificationsForm from "../../components/forms/certification-form"; // Adjust if needed
import AddEditCertificationsModal from "@/components/modal/AddEditCertificationsModal";
import { Certification } from "../../features/profile/types";
import { useGetCertificationsByUserIdQuery } from "@/api/certificatesApiSlice";
import { useSelector } from "react-redux";

interface CertificationsSectionProps {
  /**
   *  Optionally allow parent to pass initial certifications;
   *  but we’ll primarily display the fetched data from Redux query.
   */
  certifications: Certification[];
  onAdd?: () => void;
  onEdit?: (index: number) => void;
  onSave?: (updatedCertifications: Certification[]) => void;
}

const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  certifications: initialCertifications,
  onAdd,
  onEdit,
  onSave,
}) => {
  const user = useSelector((state: any) => state.auth.user);
  const { data } = useGetCertificationsByUserIdQuery(user._id);

  // Local state to store the currently displayed certifications
  const [certifications, setCertifications] = useState<Certification[]>(
    initialCertifications || []
  );

  // Keep track of whether the Add/Edit modal is open
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // Which certification index is being edited; null means “add new”
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Fetch latest data from the server and update local state
  useEffect(() => {
    if (data?.data) {
      setCertifications(data.data);
    }
  }, [data]);

  // Handle Add
  const handleOpenModalForAdd = () => {
    setSelectedIndex(null);
    onAdd?.(); // Call parent callback if provided
    setIsModalOpen(true);
  };

  // Handle Edit
  const handleOpenModalForEdit = (index: number) => {
    setSelectedIndex(index);
    onEdit?.(index); // Call parent callback if provided
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // After saving from the modal, update local state & inform parent if needed
  const handleSave = (updatedCertifications: Certification[]) => {
    setCertifications(updatedCertifications);
    onSave?.(updatedCertifications);
    setIsModalOpen(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No Expiration";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };


  return (
    <div className="space-y-6 p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-lg">Certifications</h3>
        <button
          onClick={handleOpenModalForAdd}
          className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700 focus:outline-none"
          aria-label="Add Certification"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certification</span>
        </button>
      </div>

      {/* If no certifications */}
      {certifications.length === 0 && (
        <p className="text-gray-500">No certifications added yet.</p>
      )}

      {/* Display certifications */}
      <div className="divide-y divide-gray-200">
        {certifications.map((cert, index) => (
          <div key={index} className="flex items-start gap-4 py-4">
            {/* Icon */}
            <div className="flex-shrink-0 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                className="text-gray-500"
              >
                {/* Replace with an appropriate icon */}
                <path
                  d="M12 2L2 7.5V17.5L12 23L22 17.5V7.5L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Certification Details */}
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{cert.title}</h4>
              <p className="text-sm text-gray-500">
                Issued by: {cert.issued_by}
              </p>
              <p className="text-sm text-gray-500">
                {formatDate(cert.issue_date)} - {formatDate(cert.expiration_date) || "Present"}
              </p>
              {cert.certificate_s3_url && (
                <a
                  href={cert.certificate_s3_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline text-sm"
                >
                  View Credential
                </a>
              )}
            </div>

            {/* Edit Action */}
            <div>
              <button
                // onClick={() => handleOpenModalForEdit(index)}
                className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                aria-label={`Edit certification entry ${index + 1}`}
              >
                {/* <Edit className="w-4 h-4" /> */}
                <span>View certifications</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Certifications Modal */}
      {isModalOpen && (
        <AddEditCertificationsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          initialCertifications={certifications}
          onSave={handleSave}
          selectedIndex={selectedIndex}
        />
      )}
    </div>
  );
};

export default CertificationsSection;
