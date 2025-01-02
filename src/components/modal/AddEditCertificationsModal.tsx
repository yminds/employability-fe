import React, { useState, useEffect } from "react";
import CertificationsForm from "../../components/forms/certification-form";
import { Certification } from "../../features/profile/types";
import { useSelector } from "react-redux";
import {
  useAddCertificationMutation,
  useUpdateCertificationMutation,
} from "@/api/certificatesApiSlice";

interface AddEditCertificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCertifications: Certification[];
  onSave: (certifications: Certification[]) => void;
}

const AddEditCertificationsModal: React.FC<AddEditCertificationsModalProps> = ({
  isOpen,
  onClose,
  initialCertifications,
  onSave,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const user = useSelector((state: any) => state.auth.user);

  const [addCertification] = useAddCertificationMutation();
  const [updateCertification] = useUpdateCertificationMutation();

  useEffect(() => {
    if (isOpen) {
      setCertifications(initialCertifications);
      setErrors({});
      setIsSaving(false);
    }
  }, [isOpen, initialCertifications]);

  const handleFormChange = (updatedCertifications: Certification[]) => {
    setCertifications(updatedCertifications);
  };

  const handleAddCertification = async (newCertification: Certification) => {
    setCertifications((prevCertifications) => [
      ...prevCertifications,
      newCertification,
    ]);

    try {
      const result = await addCertification({
        ...newCertification,
        user_id: user._id,
      }).unwrap();

      setCertifications((prevCertifications) =>
        prevCertifications.map((cert) =>
          cert._id === newCertification._id ? result.data : cert
        )
      );
    } catch (err) {
      console.error("Failed to save new certification:", err);
      setErrors((prev) => ({
        ...prev,
        addCertification: "Failed to add certification",
      }));
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const updatedCertifications = await Promise.all(
        certifications.map(async (cert) => {
          if (cert._id) {
            const result = await updateCertification({
              id: cert._id,
              updatedCertification: cert,
            }).unwrap();
            return result;
          } else {
            const result = await addCertification({
              ...cert,
              user_id: user._id,
            }).unwrap();
            return result;
          }
        })
      );

      onSave(updatedCertifications);
      onClose();
    } catch (error) {
      console.error("Failed to save certifications:", error);
      setErrors({
        ...errors,
        saveCertification: "Failed to save certifications",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-hidden">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 flex flex-col h-[90vh]">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white z-10 px-10 py-4 border-b mt-4 mb-4 border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">
              {initialCertifications.length > 0
                ? "Edit Certification Details"
                : "Add Certification Details"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto px-8 py-4">
          <CertificationsForm
            certifications={certifications}
            onChange={handleFormChange}
            errors={errors}
            onAddCertification={handleAddCertification}
          />

          {errors.saveCertification && (
            <p className="text-red-500 text-sm mt-2">
              {errors.saveCertification}
            </p>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-4">
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditCertificationsModal;
