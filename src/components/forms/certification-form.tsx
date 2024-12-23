import React from "react";
import { Plus } from "lucide-react";

interface Certification {
  title: string;
  issuedBy: string;
  issueDate: string;
  expirationDate: string;
  credentialURL: string;
}

interface CertificationsFormProps {
  certifications: Certification[];
  onChange: (certifications: Certification[]) => void;
  errors: { [key: string]: string };
}

const CertificationsForm: React.FC<CertificationsFormProps> = ({
  certifications,
  onChange,
  errors,
}) => {
  const addCertification = () => {
    const newCertification: Certification = {
      title: "",
      issuedBy: "",
      issueDate: "",
      expirationDate: "",
      credentialURL: "",
    };
    onChange([...certifications, newCertification]);
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

  const getError = (path: string) => {
    return errors[path] || "";
  };

  return (
    <div className="space-y-6">
      <h3 className="font-medium">Certifications</h3>

      {certifications.map((cert, index) => (
        <div
          key={index}
          className="bg-gray-50 rounded-lg p-6 space-y-4 mb-4"
        >
          <div className="grid grid-cols-2 gap-4">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Title
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
                Issued By
              </label>
              <input
                type="text"
                value={cert.issuedBy}
                onChange={(e) =>
                  updateCertification(index, "issuedBy", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`certifications.${index}.issuedBy`)
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Enter issuing organization"
              />
              {getError(`certifications.${index}.issuedBy`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`certifications.${index}.issuedBy`)}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Issue Date Field */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Issue Date
              </label>
              <input
                type="date"
                value={cert.issueDate}
                onChange={(e) =>
                  updateCertification(index, "issueDate", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`certifications.${index}.issueDate`)
                    ? "border-red-500"
                    : ""
                }`}
              />
              {getError(`certifications.${index}.issueDate`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`certifications.${index}.issueDate`)}
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
                value={cert.expirationDate}
                onChange={(e) =>
                  updateCertification(index, "expirationDate", e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  getError(`certifications.${index}.expirationDate`)
                    ? "border-red-500"
                    : ""
                }`}
              />
              {getError(`certifications.${index}.expirationDate`) && (
                <p className="text-red-500 text-xs mt-1">
                  {getError(`certifications.${index}.expirationDate`)}
                </p>
              )}
            </div>
          </div>

          {/* Credential URL Field */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Credential URL
            </label>
            <input
              type="url"
              value={cert.credentialURL}
              onChange={(e) =>
                updateCertification(index, "credentialURL", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                getError(`certifications.${index}.credentialURL`)
                  ? "border-red-500"
                  : ""
              }`}
              placeholder="https://example.com/credential"
            />
            {getError(`certifications.${index}.credentialURL`) && (
              <p className="text-red-500 text-xs mt-1">
                {getError(`certifications.${index}.credentialURL`)}
              </p>
            )}
          </div>
        </div>
      ))}

      {/* Add Certification Button */}
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
