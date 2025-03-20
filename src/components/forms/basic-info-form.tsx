"use client";

import type React from "react";
import { useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";
import { useSelector } from "react-redux";
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
import { s3Upload, s3Delete } from "@/utils/s3Service";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useGetCountriesQuery,
  useGetStatesQuery,
  useGetCitiesQuery,
} from "@/api/locationApiSlice";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

//Images
import VectorFile from "@/assets/profile/completeprofile/file.svg";
import UploadFileArrow from "@/assets/profile/completeprofile/uploadfile.svg";
import UploadProgressBar from "@/features/profile/UploadProgressBar";
import type { BasicInfo } from "@/features/profile/types";
import { PhoneInput } from "../cards/phoneInput/PhoneInput";
import { DatePicker } from "../ui/date-picker";

interface BasicInfoFormProps {
  onChange: (
    basicInfo: BasicInfo,
    socialProfiles: any,
    isImageDeleted: boolean,
    newlyUploadedImage: string | null
  ) => void;
  errors: { [key: string]: string };
  initialData?: {
    basicInfo: BasicInfo;
    socialProfiles: any;
  };
}

export default function BasicInfoForm({
  onChange,
  errors,
  initialData,
}: BasicInfoFormProps) {
  const user = useSelector((state: RootState) => state.auth.user);

  const [formData, setFormData] = useState<BasicInfo>(
    initialData?.basicInfo || {
      name: "",
      mobile: "",
      email: "",
      date_of_birth: "",
      gender: "",
      country: "",
      state: "",
      city: "",
      profile_image: "",
    }
  );

  const [socialProfiles, setSocialProfiles] = useState({
    gitHub: initialData?.socialProfiles?.gitHub || user?.gitHub || "",
    linkedIn: initialData?.socialProfiles?.linkedIn || user?.linkedIn || "",
    portfolio: initialData?.socialProfiles?.portfolio || user?.portfolio || "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(
    formData.profile_image || null
  );
  const [imageError, setImageError] = useState<string>("");
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const [newlyUploadedImage, setNewlyUploadedImage] = useState<string | null>(
    null
  );

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const { data: countriesData = [] } = useGetCountriesQuery();

  const { data: statesData = [] } = useGetStatesQuery(formData.country || "", {
    skip: !formData.country,
  });

  const { data: citiesData = [] } = useGetCitiesQuery(
    { countryCode: formData.country || "", stateCode: formData.state || "" },
    { skip: !formData.country || !formData.state }
  );

  useEffect(() => {
    if (formData.country && statesData.length > 0) {
      if (
        formData.state &&
        !statesData.find((state: any) => state.isoCode === formData.state)
      ) {
        setFormData((prev) => ({ ...prev, state: "", city: "" }));
      }
    }
  }, [formData.country, statesData, formData.state]);

  useEffect(() => {
    if (formData.country && formData.state && citiesData.length > 0) {
      if (
        formData.city &&
        !citiesData.find((city: any) => city.name === formData.city)
      ) {
        setFormData((prev) => ({ ...prev, city: "" }));
      }
    }
  }, [formData.country, formData.state, citiesData, formData.city]);

  // Call onChange whenever formData or socialProfiles change
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(formData, socialProfiles, isImageDeleted, newlyUploadedImage);
    }, 300);

    return () => clearTimeout(timer);
  }, [formData, socialProfiles, isImageDeleted, newlyUploadedImage, onChange]);

  const handleBasicInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      mobile: value,
    }));
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

      const response = await s3Upload(formData, setUploadProgress);

      setNewlyUploadedImage(response.data[0].fileUrl);
      setImagePreview(response.data[0].fileUrl);
      setFormData((prev) => ({
        ...prev,
        profile_image: response.data[0].fileUrl,
      }));
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
      if (newlyUploadedImage) {
        const bucketBaseUrl =
          "https://employability-user-profile.s3.us-east-1.amazonaws.com/";
        const key = newlyUploadedImage.replace(bucketBaseUrl, "");
        await s3Delete(key, user?._id, "profile-image");
        setNewlyUploadedImage(null);
      }

      setImagePreview(null);
      setImageError("");
      setFormData((prev) => ({ ...prev, profile_image: "" }));
      setIsImageDeleted(true);
    } catch (error) {
      console.error("Error removing image:", error);
      setImageError("Failed to remove image. Please try again.");
    }
  };

  const handleSocialProfileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setSocialProfiles((prev) => ({ ...prev, [name]: value }));
  };

  const getError = (field: string) => {
    return errors[field] || "";
  };

  return (
    <div className="space-y-6 w-full">
      {/* Personal Information Section */}
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
                  getError("name") ? "border-red-500" : ""
                }`}
                placeholder="Enter your full name"
              />
              {getError("name") && (
                <p className="text-red-500 text-sm">{getError("name")}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="mobile"
                className="text-[#000] text-base font-medium font-ubuntu leading-[22px]"
              >
                Mobile number <span className="text-red-500">*</span>
              </Label>
              <PhoneInput
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handlePhoneChange}
                className={`w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px] ${
                  getError("mobile") ? "border-red-500" : ""
                }`}
                placeholder="+91 1234567891"
              />
              {getError("mobile") && (
                <p className="text-red-500 text-sm">{getError("mobile")}</p>
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
            <div
              className={`border-2 border-dashed border-[#E5E7EB] rounded-lg p-6 flex flex-col items-center justify-center bg-[#ffffff] ${
                imagePreview ? "min-h-[260px]" : "min-h-[230px]"
              }`}
            >
              {imagePreview ? (
                <>
                  <div className="relative">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Profile preview"
                      className="w-24 h-24 rounded-full object-cover"
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
                <p className="text-red-500 text-sm">{imageError}</p>
              )}
              {getError("profile_image") && (
                <p className="text-red-500 text-sm">
                  {getError("profile_image")}
                </p>
              )}
            </div>
            {!imagePreview && (
              <p className="text-sm text-[#202326] mt-4">
                Image should be 2mb or less
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="bg-white rounded-lg p-8 space-y-6 relative border border-[#E5E7EB]">
        <div className="grid grid-cols-2 gap-6">
          {/* Date of Birth field */}
          <div className="space-y-2">
            <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
              Date Of Birth <span className="text-red-500">*</span>
            </Label>
            <DatePicker
              value={formData.date_of_birth}
              onChange={(value) =>
                handleBasicInfoChange({
                  target: { name: "date_of_birth", value },
                } as React.ChangeEvent<HTMLSelectElement>)
              }
              maxDate={new Date().toISOString().split("T")[0]}
              placeholder="Select date of birth"
              className={getError("date_of_birth") ? "border-red-500" : ""}
            />
            {getError("date_of_birth") && (
              <p className="text-red-500 text-sm">
                {getError("date_of_birth")}
              </p>
            )}
          </div>

          {/* Gender field */}
          <div className="space-y-2">
            <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
              Gender <span className="text-red-500">*</span>
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
                  getError("gender") ? "border-red-500" : ""
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
            {getError("gender") && (
              <p className="text-red-500 text-sm">{getError("gender")}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Country Combobox */}
          <div className="space-y-2">
            <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
              Country <span className="text-red-500">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px]",
                    !formData.country && "text-muted-foreground"
                  )}
                >
                  {formData.country
                    ? countriesData.find(
                        (country) => country.isoCode === formData.country
                      )?.name
                    : "Select country"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Search country..." />
                  <CommandList>
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-y-auto">
                      {countriesData.map((country) => (
                        <CommandItem
                          key={country.isoCode}
                          onSelect={() => {
                            handleBasicInfoChange({
                              target: {
                                name: "country",
                                value: country.isoCode,
                              },
                            } as React.ChangeEvent<HTMLSelectElement>);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.country === country.isoCode
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {country.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {getError("country") && (
              <p className="text-red-500 text-sm">{getError("country")}</p>
            )}
          </div>

          {/* State Combobox */}
          <div className="space-y-2">
            <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
              State <span className="text-red-500">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px]",
                    !formData.state && "text-muted-foreground"
                  )}
                  disabled={!formData.country}
                >
                  {formData.state
                    ? statesData.find(
                        (state) => state.isoCode === formData.state
                      )?.name
                    : "Select state"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Search state..." />
                  <CommandList>
                    <CommandEmpty>No state found.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-y-auto">
                      {statesData.map((state) => (
                        <CommandItem
                          key={state.isoCode}
                          onSelect={() => {
                            handleBasicInfoChange({
                              target: { name: "state", value: state.isoCode },
                            } as React.ChangeEvent<HTMLSelectElement>);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.state === state.isoCode
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {state.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {getError("state") && (
              <p className="text-red-500 text-sm">{getError("state")}</p>
            )}
          </div>

          {/* City Combobox */}
          <div className="space-y-2">
            <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
              City <span className="text-red-500">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px]",
                    !formData.city && "text-muted-foreground"
                  )}
                  disabled={!formData.state}
                >
                  {formData.city
                    ? citiesData.find((city) => city.name === formData.city)
                        ?.name
                    : "Select city"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Search city..." />
                  <CommandList>
                    <CommandEmpty>No city found.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-y-auto">
                      {citiesData.map((city) => (
                        <CommandItem
                          key={city.name}
                          onSelect={() => {
                            handleBasicInfoChange({
                              target: { name: "city", value: city.name },
                            } as React.ChangeEvent<HTMLSelectElement>);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.city === city.name
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {city.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {getError("city") && (
              <p className="text-red-500 text-sm">{getError("city")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Social Profiles Section */}
      <h3 className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
        Social Profiles
      </h3>
      <div className="bg-white rounded-lg p-8 space-y-6 relative border border-[#E5E7EB]">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[#000] text-base font-medium font-ubuntu leading-[22px]">
              GitHub
            </Label>
            <Input
              type="url"
              name="gitHub"
              value={socialProfiles.gitHub}
              onChange={handleSocialProfileChange}
              className="w-full text-[#000] h-[50px] font-sf-pro text-base font-normal leading-6 tracking-[0.24px]"
              placeholder="https://github.com/username"
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
              placeholder="https://linkedin.com/in/username"
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
