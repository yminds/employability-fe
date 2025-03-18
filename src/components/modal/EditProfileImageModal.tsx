import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { X } from "lucide-react";
import { s3Upload, s3Delete } from "@/utils/s3Service";
import { useSelector, useDispatch } from "react-redux";
import { useUpdateUserMutation } from "@/api/userApiSlice";
import { updateUserProfile } from "@/features/authentication/authSlice";

// Import your assets
import VectorFile from "@/assets/profile/completeprofile/file.svg";
import UploadFileArrow from "@/assets/profile/completeprofile/uploadfile.svg";
import UploadProgressBar from "@/features/profile/UploadProgressBar";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface EditProfileImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage: string | null;
  onSave?: (imageUrl: string) => void;
}

export default function EditProfileImageModal({
  isOpen,
  onClose,
  currentImage,
  onSave,
}: EditProfileImageModalProps) {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const [updateUser] = useUpdateUserMutation();

  const [imagePreview, setImagePreview] = useState<string | null>(currentImage);
  const [imageError, setImageError] = useState<string>("");
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const [newlyUploadedImage, setNewlyUploadedImage] = useState<string | null>(
    null
  );
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setImagePreview(currentImage);
      setImageError("");
      setIsImageDeleted(false);
      setNewlyUploadedImage(null);
      setUploadProgress(0);
      setIsUploading(false);
      setIsSaving(false);
    }
  }, [isOpen, currentImage]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError("");
    setIsUploading(true);
    setUploadProgress(0);

    try {
      if (!file) return;

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setImageError("File must be either JPEG, PNG or WebP");
        setIsUploading(false);
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setImageError("File size must be less than 2MB");
        setIsUploading(false);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Create FormData for S3 upload
      const formData = new FormData();
      formData.append("files", file);
      formData.append("userId", user?._id || "");
      formData.append("folder", "profile-image");
      formData.append("name", file.name);

      const response = await s3Upload(formData, setUploadProgress);

      setNewlyUploadedImage(response.data[0].fileUrl);
      setImagePreview(response.data[0].fileUrl);
      setIsImageDeleted(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      setImageError("Failed to upload image. Please try again.");
      if (!currentImage) {
        setImagePreview(null);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = async () => {
    try {
      if (newlyUploadedImage) {
        const bucketBaseUrl =
          "https://employability-user-profile.s3.us-east-1.amazonaws.com/";
        const key = newlyUploadedImage.replace(bucketBaseUrl, "");
        await s3Delete(key, user?._id, "profile-image");
        setNewlyUploadedImage(null);
      }

      setImagePreview(null);
      setImageError("");
      setIsImageDeleted(true);
    } catch (error) {
      console.error("Error removing image:", error);
      setImageError("Failed to remove image. Please try again.");
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      if (currentImage && !newlyUploadedImage && !isImageDeleted) {
        onClose();
        return;
      }
      const updatedUserData: any = {};

      if (isImageDeleted && user.profile_image) {
        try {
          const bucketBaseUrl =
            "https://employability-user-profile.s3.us-east-1.amazonaws.com/";
          const key = user.profile_image.replace(bucketBaseUrl, "");
          await s3Delete(key, user._id, "profile-image");

          updatedUserData.profile_image = "";
        } catch (error) {
          console.error("Error deleting image from S3:", error);
          toast.error("Failed to delete image. Please try again.");
          setIsSaving(false);
          return;
        }
      } else if (newlyUploadedImage) {
        updatedUserData.profile_image = newlyUploadedImage;
      } else if (!imagePreview) {
        toast.error("Please upload an image or cancel");
        setIsSaving(false);
        return;
      }
      try {
        const response = await updateUser({
          userId: user._id,
          data: updatedUserData,
        }).unwrap();

        if (response.error) {
          throw new Error("Failed to update user profile image");
        }

        // Update Redux state
        dispatch(
          updateUserProfile({
            ...user,
            profile_image: updatedUserData.profile_image ?? user.profile_image,
          })
        );

        // Call onSave callback if provided
        if (onSave) {
          onSave(updatedUserData.profile_image ?? "");
        }

        if (isImageDeleted) {
          toast.success("Profile image removed successfully");
        } else if (newlyUploadedImage) {
          toast.success("Profile image updated successfully");
        }

        onClose();
      } catch (error) {
        console.error("Error updating user profile:", error);
        toast.error("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-lg p-8">
        <DialogHeader>
          <DialogTitle className="text-left text-sub-header">
            {!currentImage ? "Add Profile Image" : "Edit Profile Image"}
          </DialogTitle>
          <DialogDescription className="text-left text-body2 text-[rgba(0,0,0,0.60)] ">
            Upload a new profile image.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <div
              className={`border-2 border-dashed border-[#E5E7EB] rounded-lg p-6 flex flex-col items-center justify-center bg-[#ffffff] w-full ${
                imagePreview ? "min-h-[260px]" : "min-h-[230px]"
              }`}
            >
              {imagePreview ? (
                <>
                  <div className="relative">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Profile preview"
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  </div>

                  {isUploading && (
                    <UploadProgressBar progress={uploadProgress} />
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4 flex items-center gap-1"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" /> Remove image
                  </Button>
                </>
              ) : (
                <>
                  <div className="relative mb-4">
                    <img
                      src={VectorFile || "/placeholder.svg"}
                      alt="Upload"
                      className="w-16 h-16 opacity-80"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-[#10b754] rounded-full p-2">
                      <img
                        src={UploadFileArrow || "/placeholder.svg"}
                        alt="Upload arrow"
                        className="w-4 h-4"
                      />
                    </div>
                  </div>
                  <p className="text-base text-[#000000] mb-2">
                    Upload a profile image
                  </p>
                  <Label className="text-[#10b754] hover:text-[#0e9d48] cursor-pointer underline">
                    select from files
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </Label>
                </>
              )}

              {imageError && (
                <p className="text-red-500 text-sm mt-2">{imageError}</p>
              )}
            </div>
            {!imagePreview && (
              <p className="text-sm text-[#202326]">
                Image should be 2MB or less
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="flex flex-row justify-end gap-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-body2 hover:bg-transparent"
            disabled={isUploading || isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-[#00183D] hover:bg-[#062549] text-body2 text-white transition-colors"
            disabled={isUploading || isSaving}
          >
            {isUploading
              ? "Uploading..."
              : isSaving
              ? "Saving..."
              : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
