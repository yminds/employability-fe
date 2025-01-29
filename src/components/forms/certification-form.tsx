import type React from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import plusIcon from "@/assets/profile/plusicon.svg";

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
  onAddCertification: () => void;
  onDeleteCertification: (index: number) => void;
  mode: "add" | "edit" | null;
}

const CertificationsForm: React.FC<CertificationsFormProps> = ({
  certifications,
  onChange,
  errors = {},
  onAddCertification,
  onDeleteCertification,
  mode,
}) => {
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

  const formatDateForInput = (isoDate: string) => {
    if (!isoDate) return "";
    return isoDate.split("T")[0];
  };

  return (
    <div className="space-y-6 w-full">
      {certifications.map((cert, index) => (
        <div
          key={cert._id || index}
          className="bg-white rounded-lg p-8 space-y-6 relative border border-[#E5E7EB]"
        >
          <button
            type="button"
            onClick={() => onDeleteCertification(index)}
            className="absolute right-4 top-4"
            aria-label={`Remove certification ${index + 1}`}
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                value={cert.title}
                onChange={(e) =>
                  updateCertification(index, "title", e.target.value)
                }
                className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
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

            <div className="space-y-2">
              <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
                Issued By <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                value={cert.issued_by}
                onChange={(e) =>
                  updateCertification(index, "issued_by", e.target.value)
                }
                className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
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

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
                Issue Date <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                value={formatDateForInput(cert.issue_date)}
                onChange={(e) =>
                  updateCertification(index, "issue_date", e.target.value)
                }
                max={new Date().toISOString().split("T")[0]}
                className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
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

            <div className="space-y-2">
              <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
                Expiration Date
              </Label>
              <Input
                type="date"
                value={formatDateForInput(cert.expiration_date || "")}
                onChange={(e) =>
                  updateCertification(index, "expiration_date", e.target.value)
                }
                min={formatDateForInput(cert.issue_date)}
                className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
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

          <div className="space-y-2">
            <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
              Certificate URL <span className="text-red-500">*</span>
            </Label>
            <Input
              type="url"
              value={cert.certificate_s3_url}
              onChange={(e) =>
                updateCertification(index, "certificate_s3_url", e.target.value)
              }
              className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
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

      {mode === "add" && (
        <Button
          type="button"
          onClick={onAddCertification}
          variant="ghost"
          className="text-[#03963F] hover:text-[#03963F]/90 hover:bg-transparent p-0 font-sf-pro text-base font-medium leading-6 tracking-[0.24px]"
        >
          <img
            src={plusIcon || "/placeholder.svg"}
            alt="Plus Icon"
            className="mr-2"
          />
          Add Certification
        </Button>
      )}
    </div>
  );
};

export default CertificationsForm;
