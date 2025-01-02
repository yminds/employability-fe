import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useDeleteCertificationMutation } from "@/api/certificatesApiSlice";
import { useSelector } from "react-redux";

interface Certification {
  _id?: string;
  user_id?: string;
  title: string;
  issued_by: string;
  issue_date: string;
  expiration_date: string | null;
  certificate_s3_url: string;
}

interface CertificationsFormProps {
  certifications: Certification[];
  onChange: (certifications: Certification[]) => void;
  errors?: { [key: string]: string };
  onAddCertification?: (newCertification: Certification) => void;
  onDeleteCertification?: (id: string) => void;
}

const CertificationsForm: React.FC<CertificationsFormProps> = ({
  certifications = [], 
  onChange,
  errors = {},
  onAddCertification,
  onDeleteCertification,
}) => {
  const user = useSelector((state: any) => state.auth.user);
  const [deleteCertificate] = useDeleteCertificationMutation();

  const checkFormValidity = (cert: Certification) => {
    const requiredFields = {
      title: "Title",
      issued_by: "Issuing Organization",
      issue_date: "Issue Date",
      certificate_s3_url: "Certificate URL"
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key]) => !cert[key as keyof Certification])
      .map(([_, label]) => label);

    return missingFields.length === 0 ? true : missingFields;
  };

  const addCertification = () => {
    if (certifications.length > 0) {
      const lastCertification = certifications[certifications.length - 1];
      const formValidity = checkFormValidity(lastCertification);
    }

    const newCertification: Certification = {
      title: "",
      issued_by: "",
      issue_date: "",
      expiration_date: "",
      certificate_s3_url: "",
    };

    if (onAddCertification) {
      onAddCertification(newCertification);
    } else {
      onChange([...certifications, newCertification]);
    }
  };

  const updateCertification = (
    index: number,
    field: keyof Certification,
    value: string
  ) => {
    const updatedCertifications = certifications.map((cert, i) =>
      i === index ? { ...cert, [field]: value } : cert
    );
    onChange(updatedCertifications);
  };

  const removeCertification = async (index: number) => {
    try {
      const certificationToDelete = certifications[index];

      if (certificationToDelete._id) {
        await deleteCertificate(certificationToDelete._id).unwrap();
        
        if (onDeleteCertification) {
          onDeleteCertification(certificationToDelete._id);
        }
      }

      const updatedCertifications = certifications.filter((_, i) => i !== index);
      onChange(updatedCertifications);
    } catch (error) {
      console.error("Failed to delete certification:", error);
      alert("Failed to delete certification. Please try again.");
    }
  };

  const getError = (path: string) => {
    return errors[path] || "";
  };

  // Convert ISO date to YYYY-MM format for input
  const formatDateForInput = (isoDate: string) => {
    if (!isoDate) return "";
    return isoDate.split('T')[0];
  };

  return (
    <div className="space-y-6">
      <h3 className="font-medium">Certifications</h3>

      {certifications.map((cert, index) => (
        <div
          key={cert._id || index}
          className="bg-gray-50 rounded-lg p-6 space-y-4 mb-4 relative"
        >
          <button
            onClick={() => removeCertification(index)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            type="button"
            aria-label="Delete certification"
            disabled={certifications.length === 1}
          >
            <Trash2 className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-2 gap-4">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={cert.title}
                onChange={(e) =>
                  updateCertification(index, "title", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`certifications.${index}.title`)
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Enter certification title"
              />
              {getError(`certifications.${index}.title`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`certifications.${index}.title`)}
                </p>
              )}
            </div>

            {/* Issued By Field */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Issued By <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={cert.issued_by}
                onChange={(e) =>
                  updateCertification(index, "issued_by", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`certifications.${index}.issued_by`)
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Enter issuing organization"
              />
              {getError(`certifications.${index}.issued_by`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`certifications.${index}.issued_by`)}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Issue Date Field */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Issue Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formatDateForInput(cert.issue_date)}
                onChange={(e) =>
                  updateCertification(index, "issue_date", e.target.value)
                }
                max={new Date().toISOString().split("T")[0]}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`certifications.${index}.issue_date`)
                    ? "border-red-500"
                    : ""
                }`}
              />
              {getError(`certifications.${index}.issue_date`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`certifications.${index}.issue_date`)}
                </p>
              )}
            </div>

            {/* Expiration Date Field */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Expiration Date
              </label>
              <input
                type="date"
                value={formatDateForInput(cert.expiration_date || '')}
                onChange={(e) =>
                  updateCertification(index, "expiration_date", e.target.value)
                }
                min={formatDateForInput(cert.issue_date)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`certifications.${index}.expiration_date`)
                    ? "border-red-500"
                    : ""
                }`}
              />
              {getError(`certifications.${index}.expiration_date`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`certifications.${index}.expiration_date`)}
                </p>
              )}
            </div>
          </div>

          {/* Certificate URL Field */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Certificate URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={cert.certificate_s3_url}
              onChange={(e) =>
                updateCertification(index, "certificate_s3_url", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                getError(`certifications.${index}.certificate_s3_url`)
                  ? "border-red-500"
                  : ""
              }`}
              placeholder="https://example.com/credential"
            />
            {getError(`certifications.${index}.certificate_s3_url`) && (
              <p className="text-red-500 text-xs mt-1">
                {getError(`certifications.${index}.certificate_s3_url`)}
              </p>
            )}
          </div>
        </div>
      ))}

      <button
        onClick={addCertification}
        className="inline-flex items-center text-emerald-600 hover:text-emerald-700"
        type="button"
      >
        <Plus className="w-4 h-4 mr-1" />
        Add Certification
      </button>
    </div>
  );
};

export default CertificationsForm;