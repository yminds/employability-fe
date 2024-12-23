// src/components/modal/AddEditCertificationsModal.tsx

import React, { useState, useEffect } from "react";
import CertificationsForm from "../../components/forms/certification-form"; // Adjust the path as necessary
import { Certification } from "../../features/profile/types"; // Ensure Certification type is defined

interface AddEditCertificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCertifications: Certification[];
  onSave: (certifications: Certification[]) => void;
  selectedIndex: number | null; // null for add, index for edit
}

const AddEditCertificationsModal: React.FC<AddEditCertificationsModalProps> = ({
  isOpen,
  onClose,
  initialCertifications,
  onSave,
  selectedIndex,
}) => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      setCertifications(initialCertifications);
      setErrors({});
    }
  }, [isOpen, initialCertifications]);

  const handleFormChange = (updatedCertifications: Certification[]) => {
    setCertifications(updatedCertifications);
  };

  const handleSave = () => {
    // Optionally, perform additional validation here
    onSave(certifications);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="certifications-modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 p-6 overflow-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 id="certifications-modal-title" className="text-2xl font-semibold">
            {selectedIndex !== null
              ? "Edit Certification"
              : "Add Certification"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div>
          <CertificationsForm
            certifications={certifications}
            onChange={handleFormChange}
            errors={errors}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditCertificationsModal;
