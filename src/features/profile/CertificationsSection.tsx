// src/components/CertificationsSection.tsx

import React from "react";
import { Plus, Edit } from "lucide-react";
import CertificationsForm from "../../components/forms/certification-form"; // Adjust the path as necessary
import AddEditCertificationsModal from "@/components/modal/AddEditCertificationsModal"; // You'll need to create this modal
import { Certification } from "../../features/profile/types"; // Ensure the Certification type is correctly defined
import { useState } from "react";

interface CertificationsSectionProps {
  certifications: Certification[];
  onAdd: () => void;
  onEdit: (index: number) => void;
  onSave: (updatedCertifications: Certification[]) => void;
}

const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  certifications,
  onAdd,
  onEdit,
  onSave,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleOpenModalForAdd = () => {
    setSelectedIndex(null);
    onAdd();
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (index: number) => {
    setSelectedIndex(index);
    onEdit(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = (updatedCertifications: Certification[]) => {
    onSave(updatedCertifications);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
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

      {certifications.length === 0 && (
        <p className="text-gray-500">No certifications added yet.</p>
      )}

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
              <p className="text-sm text-gray-500">Issued by: {cert.issuedBy}</p>
              <p className="text-sm text-gray-500">
                {cert.issueDate} - {cert.expirationDate || "Present"}
              </p>
              <a
                href={cert.credentialURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:underline text-sm"
              >
                View Credential
              </a>
            </div>

            {/* Actions */}
            <div>
              <button
                onClick={() => handleOpenModalForEdit(index)}
                className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                aria-label={`Edit certification entry ${index + 1}`}
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
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
