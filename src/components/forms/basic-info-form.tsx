import type React from "react";
import { useEffect, useState } from "react";
import { Country, State, City } from "country-state-city";
import "react-phone-input-2/lib/style.css";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

//Images
import VectorFile from "@/assets/profile/completeprofile/file.svg";
import UploadFileArrow from "@/assets/profile/completeprofile/uploadfile.svg";
import { updateUserProfile } from "@/features/authentication/authSlice";
import axios from "axios";
import UploadProgressBar from "@/features/profile/UploadProgressBar";

interface BasicInfoFormProps {
  initialData?: {
    basicInfo: any;
    socialProfiles: any;
  };
  onChange: (basicInfo: any, socialProfiles: any) => void;
  errors: { [key: string]: string };
}

export default function BasicInfoForm({
  initialData,
  onChange,
  errors = {},
}: BasicInfoFormProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  console.log("intial data", initialData);

  const [formData, setFormData] = useState(initialData?.basicInfo);

  const [socialProfiles, setSocialProfiles] = useState({
    gitHub: initialData?.socialProfiles?.gitHub || user?.gitHub || "",
    linkedIn: initialData?.socialProfiles?.linkedIn || user?.linkedIn || "",
    portfolio: initialData?.socialProfiles?.portfolio || user?.portfolio || "",
  });

  // const [socialProfiles, setSocialProfiles] = useState(initialData?.socialProfiles)

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(
    formData.profile_image || null
  );
  const [imageError, setImageError] = useState<string>("");

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const dispatch = useDispatch();

  // Load countries
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  // Update states when country changes
  useEffect(() => {
    if (formData.country) {
      const countryStates = State.getStatesOfCountry(formData.country);
      setStates(countryStates);

      if (
        formData.state &&
        !countryStates.find((state) => state.isoCode === formData.state)
      ) {
        setFormData((prev: any) => ({ ...prev, state: "", city: "" }));
      }
    } else {
      setStates([]);
      setCities([]);
    }
  }, [formData.country, formData.state]); // Added formData.state to dependencies

  // Update cities when state changes
  useEffect(() => {
    if (formData.country && formData.state) {
      const stateCities = City.getCitiesOfState(
        formData.country,
        formData.state
      );
      setCities(stateCities);

      if (
        formData.city &&
        !stateCities.find((city) => city.name === formData.city)
      ) {
        setFormData((prev: any) => ({ ...prev, city: "" }));
      }
    } else {
      setCities([]);
    }
  }, [formData.country, formData.state]);

  // Call onChange whenever formData or socialProfiles change
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(formData, socialProfiles);
    }, 300);

    return () => clearTimeout(timer);
  }, [formData, socialProfiles]);

  const handleBasicInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    // dispatch(updateUserProfile({ [name]: value }))
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError("");
    setIsUploading(true);
    setUploadProgress(0);

    try {
      if (!file) return;

      // Validate file type
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

      // Create preview immediately for better UX
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

      const response = await axios.post(
       `${process.env.VITE_API_BASE_URL}/api/v1/s3/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            setUploadProgress(progress);
          },
        }
      );

      // if (!response.ok) {
      //   throw new Error("Failed to upload image");
      // }

      // const result = await response.json();

      const result = response.data;

      // Update form data with the returned S3 URL
      setFormData((prev: any) => ({
        ...prev,
        profile_image: result.data[0].fileUrl,
      }));
      dispatch(updateUserProfile({ profile_image: result.data[0].fileUrl }));
    } catch (error) {
      console.error("Error uploading image:", error);
      setImageError("Failed to upload image. Please try again.");
      setImagePreview(null); // Reset preview on error
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = async () => {
    try {
      console.log("Remove image");

      if (formData.profile_image && user?._id) {
        const bucketBaseUrl =
          "https://employability-user-profile.s3.us-east-1.amazonaws.com/";
        const key = formData.profile_image.replace(bucketBaseUrl, "");
        console.log("Deleting image with key:", key, "for user:", user._id);
        const response = await fetch(`${process.env.VITE_API_BASE_URL}/api/v1/s3/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            key,
            userId: user._id,
            folder: "profile-image.",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete file from S3");
        }
      }

      setImagePreview(null);
      setImageError("");
      setFormData((prev: any) => ({ ...prev, profile_image: "" }));
      dispatch(updateUserProfile({ profile_image: "" }));
    } catch (error) {
      console.error("Error removing image:", error);
      setImageError("Failed to remove image. Please try again.");
    }
  };

  const handleSocialProfileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setSocialProfiles((prev: any) => ({ ...prev, [name]: value }));
    dispatch(updateUserProfile({ ...formData, [name]: value }));
  };

  const getError = (field: string) => errors[field] || "";

  return (
    <div className="space-y-6 w-full">
      <div className="bg-white rounded-lg p-8 space-y-6 relative border border-[#E5E7EB]">
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-[#000] text-base font-medium font-ubuntu leading-[22px]"
              >
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleBasicInfoChange}
                className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
                  getError("basicInfo.name") ? "border-red-500" : ""
                }`}
                placeholder="Enter your full name"
              />
              {getError("basicInfo.name") && (
                <p className="text-red-500 text-sm">
                  {getError("basicInfo.name")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="mobile"
                className="text-[#000] text-base font-medium font-ubuntu leading-[22px]"
              >
                Mobile number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="mobile"
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleBasicInfoChange}
                className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
                  getError("basicInfo.mobile") ? "border-red-500" : ""
                }`}
                placeholder="+91 1234567891"
              />
              {getError("basicInfo.mobile") && (
                <p className="text-red-500 text-sm">
                  {getError("basicInfo.mobile")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-[#000] text-base font-medium font-ubuntu leading-[22px]"
              >
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] bg-gray-100`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
              Profile image
            </Label>
            <div className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-6 flex flex-col items-center justify-center min-h-[230px] bg-[#ffffff]">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Profile preview"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
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

              {isUploading && <UploadProgressBar progress={uploadProgress} />}

              {imageError && (
                <p className="text-red-500 text-xs mt-1">{imageError}</p>
              )}
              {getError("basicInfo.profile_image") && (
                <p className="text-red-500 text-xs mt-1">
                  {getError("basicInfo.profile_image")}
                </p>
              )}
            </div>
            <p className="text-sm text-[#202326] mt-4">
              Image should be 2mb or less
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
        Basic Info
      </h3>
      <div className="bg-white rounded-lg p-8 space-y-6 relative border border-[#E5E7EB]">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
              Date Of Birth
            </Label>
            <Input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleBasicInfoChange}
              max={new Date().toISOString().split("T")[0]}
              className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
                getError("basicInfo.date_of_birth") ? "border-red-500" : ""
              }`}
            />
            {getError("basicInfo.date_of_birth") && (
              <p className="text-red-500 text-xs mt-1">
                {getError("basicInfo.date_of_birth")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
              Gender
            </Label>
            <Select
              name="gender"
              value={formData.gender}
              onValueChange={(value) =>
                handleBasicInfoChange({
                  target: { name: "gender", value },
                } as React.ChangeEvent<HTMLSelectElement>)
              }
            >
              <SelectTrigger
                className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
                  getError("basicInfo.gender") ? "border-red-500" : ""
                }`}
              >
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
            {getError("basicInfo.gender") && (
              <p className="text-red-500 text-xs mt-1">
                {getError("basicInfo.gender")}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
              Country
            </Label>
            <Select
              name="country"
              value={formData.country}
              onValueChange={(value) =>
                handleBasicInfoChange({
                  target: { name: "country", value },
                } as React.ChangeEvent<HTMLSelectElement>)
              }
            >
              <SelectTrigger
                className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
                  getError("basicInfo.country") ? "border-red-500" : ""
                }`}
              >
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto">
                {countries.map((country) => (
                  <SelectItem key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getError("basicInfo.country") && (
              <p className="text-red-500 text-xs mt-1">
                {getError("basicInfo.country")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
              State
            </Label>
            <Select
              name="state"
              value={formData.state}
              onValueChange={(value) =>
                handleBasicInfoChange({
                  target: { name: "state", value },
                } as React.ChangeEvent<HTMLSelectElement>)
              }
              disabled={!formData.country}
            >
              <SelectTrigger
                className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
                  getError("basicInfo.state") ? "border-red-500" : ""
                }`}
              >
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto">
                {states.map((state) => (
                  <SelectItem key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getError("basicInfo.state") && (
              <p className="text-red-500 text-xs mt-1">
                {getError("basicInfo.state")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
              City
            </Label>
            <Select
              name="city"
              value={formData.city}
              onValueChange={(value) =>
                handleBasicInfoChange({
                  target: { name: "city", value },
                } as React.ChangeEvent<HTMLSelectElement>)
              }
              disabled={!formData.state}
            >
              <SelectTrigger
                className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
                  getError("basicInfo.city") ? "border-red-500" : ""
                }`}
              >
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto">
                {cities.map((city) => (
                  <SelectItem key={city.name} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getError("basicInfo.city") && (
              <p className="text-red-500 text-xs mt-1">
                {getError("basicInfo.city")}
              </p>
            )}
          </div>
        </div>
      </div>

      <h3 className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
        Social Profiles
      </h3>
      <div className="bg-white rounded-lg p-8 space-y-6 relative border border-[#E5E7EB]">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
              gitHub
            </Label>
            <Input
              type="url"
              name="gitHub"
              value={socialProfiles.gitHub}
              onChange={handleSocialProfileChange}
              className="w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px]"
              placeholder="https://gitHub.com/username"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
              LinkedIn
            </Label>
            <Input
              type="url"
              name="linkedIn"
              value={socialProfiles.linkedIn}
              onChange={handleSocialProfileChange}
              className="w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px]"
              placeholder="https://linkedIn.com/in/username"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
              Portfolio
            </Label>
            <Input
              type="url"
              name="portfolio"
              value={socialProfiles.portfolio}
              onChange={handleSocialProfileChange}
              className="w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px]"
              placeholder="https://yourportfolio.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
