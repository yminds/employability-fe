import type React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useAddCertificationMutation,
  useUpdateCertificationMutation,
  useDeleteCertificationMutation,
} from "@/api/certificatesApiSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CertificationsForm from "../forms/certification-form";
import type { Certification } from "@/features/profile/types";
import { toast } from "sonner";
import { validateCertifications } from "@/features/profile/validation/validateCertification";
import { updateUserProfile } from "@/features/authentication/authSlice";

interface AddEditCertificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCertifications: Certification[];
  mode: "add" | "edit" | null;
}

const AddEditCertificationsModal: React.FC<AddEditCertificationsModalProps> = ({
  isOpen,
  onClose,
  initialCertifications,
  mode,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const user = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();

  const [addCertification] = useAddCertificationMutation();
  const [updateCertification] = useUpdateCertificationMutation();
  const [deleteCertification] = useDeleteCertificationMutation();

  useEffect(() => {
    if (isOpen) {
      setCertifications(
        mode === "add"
          ? [
              {
                title: "",
                issued_by: "",
                issue_date: "",
                expiration_date: "",
                certificate_s3_url: "",
              },
            ]
          : initialCertifications
      );
      setErrors({});
      setIsSaving(false);
    }
  }, [isOpen, initialCertifications, mode]);

  const handleFormChange = (updatedCertifications: Certification[]) => {
    setCertifications(updatedCertifications);
  };

  const handleAddCertification = () => {
    const newCertification: Certification = {
      title: "",
      issued_by: "",
      issue_date: "",
      expiration_date: "",
      certificate_s3_url: "",
    };
    setCertifications([...certifications, newCertification]);
  };

  const handleDeleteCertification = async (index: number) => {
    const certificationToDelete = certifications[index];
    if (certificationToDelete._id) {
      try {
        await deleteCertification(certificationToDelete._id).unwrap();
        toast.success("Certification entry deleted successfully");
      } catch (error) {
        console.error("Failed to delete certification:", error);
        setErrors({ ...errors, delete: "Failed to delete certification" });
        toast.error("Failed to delete certification entry");
        return;
      }
    }
    const updatedCertifications = certifications.filter((_, i) => i !== index);
    setCertifications(updatedCertifications);
  };

  const validateForm = (): boolean => {
    const newErrors = validateCertifications(certifications);
    setErrors(newErrors);
    setTimeout(() => setErrors({}), 2000);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);

      let addedCount = 0;
      let updatedCount = 0;
      const newCertificateIds: any[] = [];

      await Promise.all(
        certifications.map(async (cert) => {
          if (cert._id) {
            await updateCertification({
              id: cert._id,
              updatedCertification: cert,
            }).unwrap();
            updatedCount++;
          } else {
            const response = await addCertification({
              ...cert,
              user_id: user._id,
            }).unwrap();
            newCertificateIds.push(response.data._id);
            addedCount++;
          }
        })
      );
      if (newCertificateIds.length > 0) {
        dispatch(
          updateUserProfile({
            certificates: [...user.certificates, ...newCertificateIds],
          })
        );
      }

      if (addedCount > 0) {
        toast.success(
          `${addedCount} certificate ${
            addedCount === 1 ? "entry" : "entries"
          } added successfully`
        );
      } else if (updatedCount > 0) {
        toast.success(
          `Certificate ${
            updatedCount === 1 ? "entry" : "entries"
          } updated successfully`
        );
      }

      onClose();
    } catch (error) {
      console.error("Failed to save certifications:", error);
      setErrors({
        ...errors,
        saveCertification: "Failed to save certifications",
      });
      toast.error("Failed to save certification entries");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent className="bg-white rounded-lg max-w-4xl p-[42px] flex flex-col justify-center">
        <DialogHeader className="w-full flex justify-between items-start">
          <div className="flex flex-col items-start">
            <DialogTitle className="text-black text-[20px] font-medium leading-[26px] tracking-[-0.2px] font-ubuntu">
              {mode === "add" ? "Add Certification" : "Edit Certifications"}
            </DialogTitle>
            <p
              className="text-[16px] font-normal leading-6 tracking-[0.24px]"
              style={{
                color: "rgba(0, 0, 0, 0.60)",
                fontFamily: '"SF Pro Display", sans-serif',
              }}
            >
              {mode === "add"
                ? "Enter your new certification details"
                : "Edit your certification details"}
            </p>
          </div>
        </DialogHeader>
        <div className="max-h-[calc(98vh-300px)] overflow-y-auto pr-6 minimal-scrollbar">
          <CertificationsForm
            certifications={certifications}
            onChange={handleFormChange}
            errors={errors}
            onDeleteCertification={handleDeleteCertification}
            onAddCertification={handleAddCertification}
            mode={mode}
          />
          {errors.saveCertification && (
            <p className="text-red-500 text-sm mt-2">
              {errors.saveCertification}
            </p>
          )}
        </div>
        <Button
          onClick={handleSave}
          className="w-full mt-6 bg-[#00183D] hover:bg-[#062549] text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
          disabled={isSaving || Object.keys(errors).length > 0}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditCertificationsModal;
