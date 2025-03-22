import type React from "react";
import { useState, useEffect } from "react";
import { X, Upload, FileText, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { s3Upload } from "@/utils/s3Service";
import plusIcon from "@/assets/profile/plusicon.svg";
import { useSelector } from "react-redux";
import { DatePicker } from "../ui/date-picker";

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
  onPendingDeletions?: (deletions: string[]) => void;
}

const CertificationsForm: React.FC<CertificationsFormProps> = ({
  certifications,
  onChange,
  errors = {},
  onAddCertification,
  onDeleteCertification,
  mode,
  onPendingDeletions,
}) => {
  const userId = useSelector((state: any) => state.auth.user._id);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: number]: number;
  }>({});
  const [isUploading, setIsUploading] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [pendingDeletions, setPendingDeletions] = useState<string[]>([]);

  const getFileNameFromUrl = (url: string): string => {
    if (!url) return "";
    const urlParts = url.split("/");
    const rawFileName = urlParts[urlParts.length - 1].split("?")[0];
    const parts = rawFileName.split("-");

    if (parts.length >= 4) {
      const lastParts = parts.slice(3).join("-");
      if (lastParts.includes("certificate")) {
        return "Certificate." + parts[2];
      }
      return "Certificate." + parts[2];
    }
    return rawFileName;
  };

  const [fileNames, setFileNames] = useState<{ [key: number]: string }>(() => {
    const initialFileNames: { [key: number]: string } = {};
    certifications.forEach((cert, index) => {
      if (cert.certificate_s3_url) {
        initialFileNames[index] = getFileNameFromUrl(cert.certificate_s3_url);
      }
    });
    return initialFileNames;
  });

  useEffect(() => {
    if (onPendingDeletions) {
      onPendingDeletions(pendingDeletions);
    }
  }, [pendingDeletions, onPendingDeletions]);

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

  const handleFileUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileNames((prev) => ({ ...prev, [index]: file.name }));

    setIsUploading((prev) => ({ ...prev, [index]: true }));
    setUploadProgress((prev) => ({ ...prev, [index]: 0 }));

    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("userId", userId || "");
      formData.append("folder", "certifications");
      formData.append("name", file.name);

      const response = await s3Upload(formData, (progress) => {
        setUploadProgress((prev) => ({ ...prev, [index]: progress }));
      });
      if (response && response.data && response.data[0]) {
        updateCertification(
          index,
          "certificate_s3_url",
          response.data[0].fileUrl
        );
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleDeleteFile = async (index: number) => {
    const cert = certifications[index];
    if (!cert.certificate_s3_url) return;
    setFileNames((prev) => {
      const updated = { ...prev };
      delete updated[index];
      return updated;
    });

    if (cert.certificate_s3_url) {
      setPendingDeletions((prev) => [...prev, cert.certificate_s3_url]);
    }
    updateCertification(index, "certificate_s3_url", "");
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
              <DatePicker
                value={formatDateForInput(cert.issue_date)}
                onChange={(value) =>
                  updateCertification(index, "issue_date", value)
                }
                maxDate={new Date().toISOString().split("T")[0]}
                placeholder="Select issue date"
                className={
                  getError(`certifications.${index}.issue_date`)
                    ? "border-red-500"
                    : ""
                }
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
              <DatePicker
                value={formatDateForInput(cert.expiration_date || "")}
                onChange={(value) =>
                  updateCertification(index, "expiration_date", value)
                }
                minDate={formatDateForInput(cert.issue_date)}
                placeholder="Select expiration date"
                className={
                  getError(`certifications.${index}.expiration_date`)
                    ? "border-red-500"
                    : ""
                }
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
              Certificate <span className="text-red-500">*</span>
            </Label>
            {cert.certificate_s3_url ? (
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm truncate max-w-[250px]">
                    {fileNames[index] ||
                      getFileNameFromUrl(cert.certificate_s3_url)}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteFile(index)}
                  className="text-green-500 hover:text-green-600 hover:bg-transparent"
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="p-3">
                <label
                  className={`flex flex-col items-center justify-center py-4 border-2 border-dashed rounded-md ${
                    getError(`certifications.${index}.certificate_s3_url`)
                      ? "border-red-500"
                      : "border-gray-300"
                  } bg-gray-50 hover:bg-gray-100 cursor-pointer relative`}
                >
                  {isUploading[index] ? (
                    <div className="flex flex-col items-center space-y-2">
                      <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                      <p className="text-sm text-gray-500">
                        Uploading... {uploadProgress[index]}%
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-medium text-gray-500 mb-1">
                        Drag and drop or click to upload
                      </p>
                      <p className="text-xs text-gray-400 mb-2">
                        PDF, PNG, JPG (max 10MB)
                      </p>
                      <div className="text-gray-700 underline py-2 px-4 rounded-md text-sm">
                        Browse Files
                      </div>
                      <Input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(index, e);
                          }
                        }}
                      />
                    </>
                  )}
                </label>
                {isUploading[index] && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${uploadProgress[index]}%` }}
                    ></div>
                  </div>
                )}

                {/* Hidden input to store the S3 URL */}
                <Input
                  type="hidden"
                  value={cert.certificate_s3_url}
                  onChange={(e) =>
                    updateCertification(
                      index,
                      "certificate_s3_url",
                      e.target.value
                    )
                  }
                />

                {getError(`certifications.${index}.certificate_s3_url`) && (
                  <p className="text-red-500 text-xs mt-1">
                    {getError(`certifications.${index}.certificate_s3_url`)}
                  </p>
                )}
              </div>
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
