import React, { useState } from "react";
import LinkedInImportModal from "../../components/modal/LinkedInImportModal";
import ResumeUploadModal from "../../components/modal/ResumeUploadModal";
import ResumeUploadProgressModal from "../../components/modal/ResumeUploadProgressModal";
import CompleteProfileModal from "@/components/modal/CompleteProfileModal";
import { ProfileFormData } from "./types";
import EditBioModal from "@/components/modal/EditBioModal";
import EducationSection from "./EducationSection";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button"
// import arrow from '@/assets/skills/arrow.svg';

import coverPhoto from '@/assets/images/coverPhoto.png'


import {
  Education,
  Certification,
  ExperienceItem,
} from "../../features/profile/types";
import ExperienceSection from "./ExperienceSection";
// import CertificationsSection from "@/components/inputs/CertificationsSection";
import {
  useGetEducationByIdQuery,
  useAddEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
} from "../../api/educationSlice";
import { useSelector } from "react-redux";
import { Check } from "lucide-react";



const UserProfile: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user);
  console.log(user, "hhhhhhhhhhhhh");

  const initialEducationEntries: Education[] = [
    {
      education_level: "bachelors",
      degree: "B Tech Computer Science",
      institute: "APJ Abdul Kalam University",
      from_date: "2020-10-01",
      till_date: "2024-04-30",
      cgpa_or_marks: "9.1",
      _id: "",
      board_or_certification: '',
      highest_education_level: undefined
    },

  ];
  const initialExperiences: ExperienceItem[] = [
    {
      duration: "1y 2m",
      id: "1",
      companyLogo: "https://st3.depositphotos.com/43745012/44906/i/450/depositphotos_449066958-stock-photo-financial-accounting-logo-financial-logo.jpg",
      jobTitle: "Lead Full-stack Engineer",
      companyName: "Ernst and Young",
      employmentType: "Full time",
      location: "Bangalore Urban, Karnataka, India",
      startDate: "Apr 2022",
      endDate: "Present",
      description: "As a lead full-stack developer at EY for over a year, I spearheaded the development of scalable web applications. My expertise in React, Python, and MongoDB allowed me to drive innovative, user-centric solutions that enhanced our clients' digital experiences.",
      currentlyWorking: false,
      currentCTC: "",
      expectedCTC: "",
      jobType: undefined,
      isVerified: undefined,
      company: ""
    },
  ];

  const [contactInfo, setContactInfo] = useState({
    profileURL: "employability.ai/sreya",
    mobileNumber: "+91 1234567890",
    email: "contact@mathew.com",
  });
  const initialCertifications: Certification[] = [
    {
      title: "Certified React Developer",
      issuedBy: "React Training",
      issueDate: "2022-06-15",
      expirationDate: "",
      credentialURL: "https://example.com/certificate/react",
    },
  ];
  const [isEditBioModalOpen, setIsEditBioModalOpen] = useState(false);
  const [bio, setBio] = useState<string>(
    "Full-stack developer with a strong foundation in React, Python, and MongoDB. A quick learner passionate about building user-friendly web applications, eager to apply skills in a professional environment."
  );

  const handleEditBio = (updatedBio: string) => {
    setBio(updatedBio);
  };
  const [educationEntries, setEducationEntries] = useState<Education[]>(
    initialEducationEntries
  );
  const [experiences, setExperiences] =
    useState<ExperienceItem[]>(initialExperiences);

  const [certifications, setCertifications] = useState<Certification[]>(
    initialCertifications
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] =
    useState<ExperienceItem | null>(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  // Handle Experience Save
  const handleSaveExperience = (updatedExperiences: ExperienceItem[]) => {
    setExperiences(updatedExperiences);
    // console.log("Experiences updated:", updatedExperiences);
    // Optionally, perform API calls or other side effects here
  };

  const handleAddExperience = () => {
    setSelectedExperience(null); // No experience selected for adding
    setIsExperienceModalOpen(true);
  };
  const handleExperiencesChange = (updatedExperiences: ExperienceItem[]) => {
    setExperiences(updatedExperiences);
  };
  const handleEditExperience = (experience: ExperienceItem) => {
    setSelectedExperience(experience); // Set the experience to edit
    setIsExperienceModalOpen(true);
  };

  // Handle Education Save
  const handleSaveEducation = (updatedEducation: Education[]) => {
    setEducationEntries(updatedEducation);
    // Optionally, perform API calls or other actions here
  };

  // Handle Certifications Save
  const handleSaveCertifications = (updatedCertifications: Certification[]) => {
    setCertifications(updatedCertifications);
    // Optionally, perform API calls or other actions here
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileDetails, setFileDetails] = useState<{
    name: string;
    size: string;
  }>({ name: "", size: "" });

  const handleUpload = (file: File) => {
    setFileDetails({
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    });
    setIsUploadModalOpen(false);
    setIsProgressModalOpen(true);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return progress;
      });
    }, 300);
  };

  const handleProgressContinue = () => {
    if (uploadProgress === 100) {
      setIsProgressModalOpen(false);
      setIsProfileModalOpen(true); // Open the CompleteProfileModal
    }
  };

  return (
    <div className="">
      <div className="max-w-6xl mx-auto space-y-8 grid grid-cols-1 lg:grid-cols-3 gap-8 ">
        {/* Left Section */}
        <div className="lg:col-span-2">
          <button
            className="text-gray-600 hover:text-gray-800 flex items-center space-x-4 mb-6"
            onClick={handleOpenModal}
          >
            <div className="p-3 border bg-white border-gray-300 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="white"
              >
                <path
                  id="Vector 84"
                  d="M0.505025 5.50503C0.231658 5.77839 0.231658 6.22161 0.505025 6.49497L4.9598 10.9497C5.23316 11.2231 5.67638 11.2231 5.94975 10.9497C6.22311 10.6764 6.22311 10.2332 5.94975 9.9598L1.98995 6L5.94975 2.0402C6.22311 1.76684 6.22311 1.32362 5.94975 1.05025C5.67638 0.776886 5.23316 0.776886 4.9598 1.05025L0.505025 5.50503ZM1 6.7H12V5.3H1V6.7Z"
                  fill="#666666"
                />
              </svg>
            </div>
            <span>Back to Home</span>
          </button>

          <div className=" rounded-lg sm:bg-cover md:bg-contain lg:bg-auto " style={{
            backgroundImage: "url('src/assets/images/Frame 1410078135.jpg')", backgroundRepeat: "no-repeat", // Prevents the background from repeating
            backgroundSize: "cover",      // Ensures the image covers the div
            backgroundPosition: "center", // Centers the background image
          }}>

            <div className="max-w-5xl mx-auto p-8">
              <div className="flex flex-col gap-8">
                {/* Profile Header */}
                <div className="flex items-center justify-between ">
                  <div className="relative flex gap-6 items-center">
                    <div className="relative w-[130px] h-[130px]">
                      {/* Profile Image */}
                      <img
                        src="https://s3-alpha-sig.figma.com/img/62e2/8e4d/486c896150b27448a2d7336ecf91ec03?Expires=1735516800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=PaRvDr2ySVWPht9AHLTJMmciWrZRJHyxvxEqVhNES7am-m6K81OXp8vOQMgLZxuvbaY-Jl2vvROupZnTD~ro4oOrUiOZCEyyJlQiJvxX7er1OuA8QpigQzDQDTL0nVb92alO6boKf5RuujpPT7AiHq9ZH2JCyEr0QJZ0sI9qxi2yHbmqQaDnDZGNjM4y0S7gzbfdrrTOtpe613ckT5OU32SEAWRyH2HYKrJo-u8PJ4jiR-aO7OJwgQoDwQrSaMPZWIj0Laa8Y3SCg1nEV2Vf2XVpFMFVOwLSEsd4G8UzPpEnlxFL6iVwKlzncApMdQFzO8DqW0N9AVn1LNTMbxw~sA__" alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                      {/* SVG Semi-Circle */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="130"
                        height="130"
                        viewBox="0 0 130 91"
                        className="absolute bottom-[-20px] left-[0px]"
                        fill="none"
                      >
                        <path
                          d="M123.72 53.8731C116.42 69.2531 103.377 81.1549 87.3944 87.0204C71.412 92.8859 53.7664 92.2469 38.2502 85.2406C22.734 78.2343 10.5859 65.4201 4.41711 49.5524C-1.75169 33.6846 -1.44876 16.0299 5.26076 0.383137L28.3705 10.2928C24.2565 19.8868 24.0707 30.7119 27.8532 40.4413C31.6356 50.1707 39.0843 58.0278 48.5981 62.3238C58.112 66.6197 68.9316 67.0116 78.7313 63.4151C88.531 59.8186 96.5285 52.5209 101.005 43.0906L123.72 53.8731Z"
                          fill="url(#paint0_linear_40001011_4895)"
                        />
                        <defs>
                          <linearGradient id="paint0_linear_40001011_4895" x1="57.5949" y1="-11.411" x2="-7.13081" y2="86.2261" gradientUnits="userSpaceOnUse">
                            <stop stopColor="white" stopOpacity="0" />
                            <stop offset="0.858943" stopColor="#0AD472" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="mb-[]">
                      <span className=" bg-slate-600 ">
                      </span>
                      </div>
                    
                      
                    </div>


                    <div className="flex flex-col gap-2 items-start justify-end">
                      <h1 className="text-4xl font-semibold text-gray-900">Shreya</h1>
                      <p className="text-xl text-gray-600">Hyderabad, India</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-gray-600">Actively seeking work</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-start justify-end gap-2 mt-7">
                    <h2 className="text-2xl font-medium text-gray-900">
                      Full Stack developer
                    </h2>
                    <div className="flex items-center gap-2  rounded-lg">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-semibold">8.8</span>
                        <span className="text-sm text-gray-600">/10</span>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
                          <path d="M13.0359 15.9001L10.7728 13.5635C10.5797 13.3622 10.3405 13.2593 10.0554 13.2547C9.77024 13.2501 9.51948 13.3604 9.30312 13.5857C9.10116 13.7964 9.00019 14.0517 9.00019 14.3516C9.00019 14.6514 9.10116 14.9067 9.30312 15.1174L12.1536 18.0884C12.4057 18.3509 12.6998 18.4822 13.0359 18.4822C13.3719 18.4822 13.666 18.3509 13.9182 18.0884L19.6969 12.0655C19.9042 11.8492 20.0064 11.5962 20.0036 11.3065C20.0011 11.0169 19.8988 10.7593 19.6969 10.5338C19.4805 10.3085 19.232 10.1921 18.9512 10.1846C18.6707 10.1771 18.4223 10.2861 18.2059 10.5116L13.0359 15.9001ZM9.4938 27.6968L7.56571 24.3179L3.91869 23.5015C3.60588 23.4383 3.35605 23.2669 3.16921 22.9874C2.98236 22.7079 2.90776 22.4051 2.94541 22.0791L3.30202 18.1694L0.821755 15.2123C0.607252 14.9739 0.5 14.687 0.5 14.3516C0.5 14.0161 0.607252 13.7292 0.821755 13.4908L3.30202 10.5338L2.94541 6.62402C2.90776 6.298 2.98236 5.99523 3.16921 5.71571C3.35605 5.43619 3.60588 5.26482 3.91869 5.2016L7.56571 4.38521L9.4938 1.0063C9.66182 0.719515 9.89062 0.523925 10.1802 0.41953C10.4698 0.315135 10.7639 0.331 11.0625 0.467125L14.5 1.98182L17.9375 0.467125C18.2361 0.331 18.5302 0.315135 18.8198 0.41953C19.1094 0.523925 19.3382 0.719515 19.5062 1.0063L21.4343 4.38521L25.0813 5.2016C25.3941 5.26482 25.6439 5.43619 25.8308 5.71571C26.0176 5.99523 26.0922 6.298 26.0546 6.62402L25.698 10.5338L28.1782 13.4908C28.3927 13.7292 28.5 14.0161 28.5 14.3516C28.5 14.687 28.3927 14.9739 28.1782 15.2123L25.698 18.1694L26.0546 22.0791C26.0922 22.4051 26.0176 22.7079 25.8308 22.9874C25.6439 23.2669 25.3941 23.4383 25.0813 23.5015L21.4343 24.3179L19.5062 27.6968C19.3382 27.9836 19.1094 28.1792 18.8198 28.2836C18.5302 28.388 18.2361 28.3721 17.9375 28.236L14.5 26.7213L11.0625 28.236C10.7639 28.3721 10.4698 28.388 10.1802 28.2836C9.89062 28.1792 9.66182 27.9836 9.4938 27.6968Z" fill="#10B754" />
                          <path d="M13.0359 15.9001L10.7728 13.5635C10.5797 13.3622 10.3405 13.2593 10.0554 13.2547C9.77024 13.2501 9.51948 13.3604 9.30312 13.5857C9.10116 13.7964 9.00019 14.0517 9.00019 14.3516C9.00019 14.6514 9.10116 14.9067 9.30312 15.1174L12.1536 18.0884C12.4057 18.3509 12.6998 18.4822 13.0359 18.4822C13.3719 18.4822 13.666 18.3509 13.9182 18.0884L19.6969 12.0655C19.9042 11.8492 20.0064 11.5962 20.0036 11.3065C20.0011 11.0169 19.8988 10.7593 19.6969 10.5338C19.4805 10.3085 19.232 10.1921 18.9512 10.1846C18.6707 10.1771 18.4223 10.2861 18.2059 10.5116L13.0359 15.9001ZM9.4938 27.6968L7.56571 24.3179L3.91869 23.5015C3.60588 23.4383 3.35605 23.2669 3.16921 22.9874C2.98236 22.7079 2.90776 22.4051 2.94541 22.0791L3.30202 18.1694L0.821755 15.2123C0.607252 14.9739 0.5 14.687 0.5 14.3516C0.5 14.0161 0.607252 13.7292 0.821755 13.4908L3.30202 10.5338L2.94541 6.62402C2.90776 6.298 2.98236 5.99523 3.16921 5.71571C3.35605 5.43619 3.60588 5.26482 3.91869 5.2016L7.56571 4.38521L9.4938 1.0063C9.66182 0.719515 9.89062 0.523925 10.1802 0.41953C10.4698 0.315135 10.7639 0.331 11.0625 0.467125L14.5 1.98182L17.9375 0.467125C18.2361 0.331 18.5302 0.315135 18.8198 0.41953C19.1094 0.523925 19.3382 0.719515 19.5062 1.0063L21.4343 4.38521L25.0813 5.2016C25.3941 5.26482 25.6439 5.43619 25.8308 5.71571C26.0176 5.99523 26.0922 6.298 26.0546 6.62402L25.698 10.5338L28.1782 13.4908C28.3927 13.7292 28.5 14.0161 28.5 14.3516C28.5 14.687 28.3927 14.9739 28.1782 15.2123L25.698 18.1694L26.0546 22.0791C26.0922 22.4051 26.0176 22.7079 25.8308 22.9874C25.6439 23.2669 25.3941 23.4383 25.0813 23.5015L21.4343 24.3179L19.5062 27.6968C19.3382 27.9836 19.1094 28.1792 18.8198 28.2836C18.5302 28.388 18.2361 28.3721 17.9375 28.236L14.5 26.7213L11.0625 28.236C10.7639 28.3721 10.4698 28.388 10.1802 28.2836C9.89062 28.1792 9.66182 27.9836 9.4938 27.6968Z" stroke="#10B754" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">Employability score</span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-lg text-gray-600 max-w-3xl">
                  Full-stack developer with a strong foundation in React, Python, and MongoDB.
                  A quick learner passionate about building user-friendly web applications,
                  eager to apply skills in a professional environment.
                </p>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button
                    variant="default"
                    className="bg-[#001F3F] text-white hover:bg-[#001F3F]/90 px-8"
                  >
                    Contact
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#001F3F] text-[#001F3F] hover:bg-[#001F3F]/10 px-8"
                  >
                    Schedule AI interview
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg mt-6 overflow-y-auto overflow-x-auto max-h-3xl">
            {/* Education Section */}
            <div className="bg-white rounded-lg mt-6 p-6 overflow-y-auto overflow-x-auto max-h-3xl">
              <EducationSection
                initialEducation={educationEntries} // Pass the initial education entries
              />
            </div>
          </div>

          <div className="bg-white rounded-lg mt-6 mb-10">
            {/* Education Section */}
            <ExperienceSection
              experiences={experiences}
              totalDuration="4 years 5 months"
              onAdd={handleAddExperience}
              onEdit={() => console.log("Edit clicked")}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6 ">
          <div className="bg-white p-6 rounded-lg mt-8">
            <h2 className="font-semibold text-gray-700 mb-4">Current Status</h2>
            <select className="block w-full border border-gray-300 rounded-md py-2 px-4">
              <option>Actively seeking job</option>
              <option>Open to offers</option>
              <option>Not looking</option>
            </select>
          </div>

          <div className="bg-white p-6 rounded-lg">
            <h2 className="font-semibold text-gray-700 mb-4 pl-4 pt-2">
              Contact Information
            </h2>
            <div className="space-y-4 p-4">
              {/* Profile URL */}
              <div className="flex items-center space-x-4 pb-4 border-b border-gray-300">
                <div className="p-3 border bg-white rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="23"
                    height="22"
                    viewBox="0 0 23 22"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_40000365_1179)">
                      <path
                        d="M7.68324 14.8211C7.47241 14.6103 7.27441 14.3793 7.09566 14.1355C6.79774 13.7266 6.88757 13.1528 7.29732 12.8549C7.70616 12.557 8.27907 12.6468 8.57791 13.0556C8.69616 13.2188 8.82907 13.3755 8.97849 13.524C9.71457 14.2601 10.6927 14.6653 11.7331 14.6653C12.7735 14.6653 13.7525 14.2601 14.4877 13.524L19.5293 8.48238C21.0482 6.96346 21.0482 4.49121 19.5293 2.97229C18.0104 1.45337 15.5382 1.45337 14.0192 2.97229L13.0494 3.94213C12.691 4.30054 12.1117 4.30054 11.7532 3.94213C11.3948 3.58371 11.3948 3.00437 11.7532 2.64596L12.7231 1.67613C14.957 -0.558708 18.5916 -0.558708 20.8255 1.67613C23.0594 3.91004 23.0594 7.54462 20.8255 9.77854L15.7838 14.8202C14.7022 15.9028 13.263 16.4986 11.7331 16.4986C10.2032 16.4986 8.76399 15.9028 7.68324 14.8211ZM6.23307 21.9986C7.76391 21.9986 9.20216 21.4028 10.2838 20.3202L11.2537 19.3504C11.6121 18.9929 11.6121 18.4126 11.2537 18.0542C10.8962 17.6958 10.3159 17.6967 9.95749 18.0542L8.98674 19.024C8.25066 19.7601 7.27257 20.1653 6.23216 20.1653C5.19174 20.1653 4.21366 19.7601 3.47757 19.024C2.74149 18.288 2.33632 17.3099 2.33632 16.2695C2.33632 15.229 2.74149 14.25 3.47757 13.5149L8.51924 8.47321C9.25532 7.73712 10.2334 7.33196 11.2738 7.33196C12.3142 7.33196 13.2932 7.73712 14.0284 8.47321C14.1751 8.62079 14.3089 8.77754 14.4281 8.94071C14.7251 9.35046 15.298 9.44213 15.7087 9.14329C16.1184 8.84538 16.2092 8.27246 15.9112 7.86271C15.7371 7.62254 15.54 7.39246 15.3255 7.17796C14.2429 6.09446 12.8037 5.49862 11.2738 5.49862C9.74391 5.49862 8.30474 6.09446 7.22307 7.17704L2.18232 12.2187C1.09974 13.3004 0.503906 14.7395 0.503906 16.2695C0.503906 17.7994 1.09974 19.2385 2.18232 20.3202C3.26399 21.4028 4.70224 21.9986 6.23307 21.9986Z"
                        fill="black"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_40000365_1179">
                        <rect
                          width="22"
                          height="22"
                          fill="white"
                          transform="translate(0.5)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div>
                  <h3 className="text-gray-700 font-medium">Profile URL</h3>
                  <p className="text-gray-600">{contactInfo.profileURL}</p>
                </div>
              </div>

              {/* Mobile Number */}
              <div className="flex items-center space-x-4 pb-4 border-b border-gray-300 ">
                <div className="p-3 border bg-white rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="23"
                    height="22"
                    viewBox="0 0 23 22"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_40000365_1187)">
                      <path
                        d="M20.8221 1.66604L19.8596 0.831875C18.7505 -0.277292 16.9538 -0.277292 15.8446 0.831875C15.8171 0.859375 14.1213 3.06854 14.1213 3.06854C13.0763 4.16854 13.0763 5.90104 14.1213 6.99188L15.1846 8.33021C13.8463 11.3644 11.7655 13.4544 8.83212 14.701L7.49379 13.6285C6.40296 12.5744 4.66129 12.5744 3.57046 13.6285C3.57046 13.6285 1.36129 15.3244 1.33379 15.3519C0.224622 16.461 0.224622 18.2577 1.28796 19.321L2.20462 20.3752C3.25879 21.4294 4.67962 22.0069 6.21962 22.0069C13.223 22.0069 22.4996 12.721 22.4996 5.72688C22.4996 4.19604 21.9221 2.76604 20.8221 1.67521V1.66604ZM6.21962 20.1644C5.17462 20.1644 4.21212 19.7794 3.55212 19.1102L2.63546 18.056C2.25962 17.6802 2.24129 17.066 2.59879 16.6719C2.59879 16.6719 4.78962 14.9852 4.81712 14.9577C5.19296 14.5819 5.85296 14.5819 6.23796 14.9577C6.26546 14.9852 8.10796 16.461 8.10796 16.461C8.36462 16.6627 8.70379 16.7177 9.00629 16.5985C12.8013 15.1502 15.5238 12.4369 17.0913 8.52271C17.2105 8.22021 17.1646 7.87188 16.9538 7.60604C16.9538 7.60604 15.478 5.75438 15.4596 5.73604C15.0655 5.34188 15.0655 4.70938 15.4596 4.31521C15.4871 4.28771 17.1738 2.09688 17.1738 2.09688C17.568 1.73938 18.1821 1.74854 18.6038 2.17021L19.5663 3.00438C20.2721 3.71021 20.6663 4.67271 20.6663 5.71771C20.6663 12.0977 11.7105 20.1644 6.21962 20.1644Z"
                        fill="#0C0F12"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_40000365_1187">
                        <rect
                          width="22"
                          height="22"
                          fill="white"
                          transform="translate(0.5)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div>
                  <h3 className="text-gray-700 font-medium">Mobile number</h3>
                  <p className="text-gray-600">{contactInfo.mobileNumber}</p>
                </div>
              </div>

              {/* Email ID */}
              <div className="flex items-center space-x-4">
                <div className="p-3 border bg-white rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="23"
                    height="22"
                    viewBox="0 0 23 22"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_40000365_1195)">
                      <path
                        d="M11.501 0C8.58455 0.00315432 5.78849 1.16309 3.72627 3.22531C1.66405 5.28753 0.504113 8.08359 0.500959 11C0.385459 19.7752 10.73 25.1432 17.826 19.9989C17.9279 19.9311 18.0153 19.8435 18.0828 19.7414C18.1504 19.6392 18.1968 19.5246 18.2193 19.4042C18.2418 19.2838 18.24 19.1601 18.2139 19.0405C18.1878 18.9208 18.138 18.8076 18.0675 18.7075C17.9969 18.6074 17.907 18.5225 17.803 18.4577C17.6991 18.3929 17.5832 18.3496 17.4623 18.3304C17.3413 18.3112 17.2178 18.3163 17.0988 18.3457C16.9799 18.375 16.8681 18.4278 16.77 18.5011C10.8593 22.7847 2.24263 18.3132 2.33429 11C2.83754 -1.1605 20.1662 -1.15775 20.6676 11V12.8333C20.6676 13.3196 20.4745 13.7859 20.1307 14.1297C19.7868 14.4735 19.3205 14.6667 18.8343 14.6667C18.3481 14.6667 17.8817 14.4735 17.5379 14.1297C17.1941 13.7859 17.001 13.3196 17.001 12.8333V11C16.77 3.73175 6.23104 3.73267 6.00096 11C6.01163 12.1147 6.35979 13.1999 6.99956 14.1128C7.63933 15.0256 8.54068 15.7232 9.58481 16.1135C10.6289 16.5039 11.7668 16.5687 12.8486 16.2995C13.9303 16.0302 14.905 15.4395 15.6443 14.6052C16.0419 15.3071 16.6599 15.8582 17.4025 16.1732C18.1451 16.4882 18.9709 16.5496 19.7519 16.3477C20.5329 16.1459 21.2255 15.6922 21.7225 15.0568C22.2195 14.4215 22.4931 13.6399 22.501 12.8333V11C22.4978 8.08359 21.3379 5.28753 19.2757 3.22531C17.2134 1.16309 14.4174 0.00315432 11.501 0ZM11.501 14.6667C10.5285 14.6667 9.59587 14.2804 8.90823 13.5927C8.2206 12.9051 7.83429 11.9725 7.83429 11C7.83429 10.0275 8.2206 9.09491 8.90823 8.40727C9.59587 7.71964 10.5285 7.33333 11.501 7.33333C12.4734 7.33333 13.4061 7.71964 14.0937 8.40727C14.7813 9.09491 15.1676 10.0275 15.1676 11C15.1676 11.9725 14.7813 12.9051 14.0937 13.5927C13.4061 14.2804 12.4734 14.6667 11.501 14.6667Z"
                        fill="#0C0F12"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_40000365_1195">
                        <rect
                          width="22"
                          height="22"
                          fill="white"
                          transform="translate(0.5)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div>
                  <h3 className="text-gray-700 font-medium">Email Id</h3>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg">
            <h2 className="font-semibold text-gray-700 mb-4">
              Complete your profile
            </h2>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex-grow bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-green-500 h-full"
                  style={{ width: "30%" }}
                ></div>
              </div>
              <span className="text-gray-700 text-sm font-medium">30%</span>
            </div>
            <p className="text-gray-600 text-sm mb-6">
              Employers are{" "}
              <span className="text-green-600 font-semibold">3 times</span> more
              likely to hire a candidate with a complete profile.
            </p>
            <div className="space-y-4">
              <button
                onClick={handleOpenModal} // <-- Added onClick handler
                className="flex items-center space-x-3 w-full text-gray-600 hover:text-gray-800"
              >
                <div className="p-2 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M2.03111 0C1.22 0 0.5625 0.641645 0.5625 1.43268V18.5673C0.5625 19.3586 1.22 20 2.03111 20H18.9673C19.7784 20 20.4359 19.3586 20.4359 18.5673V1.43268C20.4359 0.641645 19.7784 0 18.9673 0H2.03111ZM6.58665 7.70517V16.7363H3.58495V7.70517H6.58665ZM6.78406 4.91198C6.78406 5.77864 6.13254 6.47213 5.08578 6.47213H5.06622C4.05888 6.47213 3.40751 5.77864 3.40751 4.91198C3.40751 4.02581 4.07885 3.35156 5.10564 3.35156C6.13254 3.35156 6.76455 4.02581 6.78406 4.91198ZM11.2492 16.7363H8.24754C8.24754 16.7363 8.28702 8.55259 8.24763 7.70517H11.2493V8.98381L11.2293 9.01492H11.2493V8.98381C11.6482 8.36843 12.3622 7.49325 13.9544 7.49325C15.9293 7.49325 17.4102 8.78402 17.4102 11.558V16.7363H14.4088V11.9049C14.4088 10.6908 13.9743 9.86261 12.8881 9.86261C12.0589 9.86261 11.565 10.4211 11.348 10.9604C11.2687 11.1534 11.2492 11.423 11.2492 11.6929V16.7363Z"
                      fill="#414447"
                    />
                  </svg>
                </div>
                <span>Import from LinkedIn</span>
              </button>

              {/* LinkedIn Import Modal */}
              {isModalOpen && (
                <LinkedInImportModal onClose={handleCloseModal} />
              )}

              {isProgressModalOpen && (
                <ResumeUploadProgressModal
                  onClose={() => setIsProgressModalOpen(false)}
                  fileName={fileDetails.name}
                  fileSize={fileDetails.size}
                  uploadProgress={uploadProgress}
                />
              )}
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center space-x-3 w-full text-gray-600 hover:text-gray-800"
              >
                <div className="p-2 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                  >
                    <mask
                      id="mask0_40000636_3427"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="25"
                      height="24"
                    >
                      <rect x="0.5" width="24" height="24" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_40000636_3427)">
                      <path
                        d="M6.5 20.0008C5.95 20.0008 5.47917 19.8049 5.0875 19.4133C4.69583 19.0216 4.5 18.5508 4.5 18.0008V16.0008C4.5 15.7174 4.59583 15.4799 4.7875 15.2883C4.97917 15.0966 5.21667 15.0008 5.5 15.0008C5.78333 15.0008 6.02083 15.0966 6.2125 15.2883C6.40417 15.4799 6.5 15.7174 6.5 16.0008V18.0008H18.5V16.0008C18.5 15.7174 18.5958 15.4799 18.7875 15.2883C18.9792 15.0966 19.2167 15.0008 19.5 15.0008C19.7833 15.0008 20.0208 15.0966 20.2125 15.2883C20.4042 15.4799 20.5 15.7174 20.5 16.0008V18.0008C20.5 18.5508 20.3042 19.0216 19.9125 19.4133C19.5208 19.8049 19.05 20.0008 18.5 20.0008H6.5ZM11.5 7.85078L9.625 9.72578C9.425 9.92578 9.1875 10.0216 8.9125 10.0133C8.6375 10.0049 8.4 9.90078 8.2 9.70078C8.01667 9.50078 7.92083 9.26745 7.9125 9.00078C7.90417 8.73411 8 8.50078 8.2 8.30078L11.8 4.70078C11.9 4.60078 12.0083 4.52995 12.125 4.48828C12.2417 4.44661 12.3667 4.42578 12.5 4.42578C12.6333 4.42578 12.7583 4.44661 12.875 4.48828C12.9917 4.52995 13.1 4.60078 13.2 4.70078L16.8 8.30078C17 8.50078 17.0958 8.73411 17.0875 9.00078C17.0792 9.26745 16.9833 9.50078 16.8 9.70078C16.6 9.90078 16.3625 10.0049 16.0875 10.0133C15.8125 10.0216 15.575 9.92578 15.375 9.72578L13.5 7.85078V15.0008C13.5 15.2841 13.4042 15.5216 13.2125 15.7133C13.0208 15.9049 12.7833 16.0008 12.5 16.0008C12.2167 16.0008 11.9792 15.9049 11.7875 15.7133C11.5958 15.5216 11.5 15.2841 11.5 15.0008V7.85078Z"
                        fill="#414447"
                      />
                    </g>
                  </svg>
                </div>
                <span>Upload your resume</span>
              </button>
              {isUploadModalOpen && (
                <ResumeUploadModal
                  onClose={() => setIsUploadModalOpen(false)}
                  onUpload={handleUpload}
                  userId={user._id}
                />
              )}

              {isProgressModalOpen && (
                <ResumeUploadProgressModal
                  onClose={() => setIsProgressModalOpen(false)}
                  onContinue={handleProgressContinue} // Hooked to handle state transition
                  fileName={fileDetails.name}
                  fileSize={fileDetails.size}
                  uploadProgress={uploadProgress}
                  isUploading={uploadProgress < 100} // Indicates upload is ongoing
                  error={null}
                />
              )}
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center space-x-3 w-full text-gray-600 hover:text-gray-800"
              >
                <div className="p-2 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                  >
                    <mask
                      id="mask0_40000636_3438"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="25"
                      height="24"
                    >
                      <rect x="0.5" width="24" height="24" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_40000636_3438)">
                      <path
                        d="M16.85 16.1739L20.4 12.6239C20.6 12.4239 20.8333 12.3281 21.1 12.3364C21.3667 12.3448 21.6 12.4489 21.8 12.6489C21.9833 12.8489 22.075 13.0823 22.075 13.3489C22.075 13.6156 21.9833 13.8489 21.8 14.0489L17.575 18.2989C17.375 18.4989 17.1417 18.5989 16.875 18.5989C16.6083 18.5989 16.375 18.4989 16.175 18.2989L14.025 16.1489C13.8417 15.9656 13.75 15.7323 13.75 15.4489C13.75 15.1656 13.8417 14.9323 14.025 14.7489C14.2083 14.5656 14.4417 14.4739 14.725 14.4739C15.0083 14.4739 15.2417 14.5656 15.425 14.7489L16.85 16.1739ZM16.85 8.17394L20.4 4.62394C20.6 4.42394 20.8333 4.3281 21.1 4.33644C21.3667 4.34477 21.6 4.44894 21.8 4.64894C21.9833 4.84894 22.075 5.08227 22.075 5.34894C22.075 5.6156 21.9833 5.84894 21.8 6.04894L17.575 10.2989C17.375 10.4989 17.1417 10.5989 16.875 10.5989C16.6083 10.5989 16.375 10.4989 16.175 10.2989L14.025 8.14894C13.8417 7.9656 13.75 7.73227 13.75 7.44894C13.75 7.1656 13.8417 6.93227 14.025 6.74894C14.2083 6.5656 14.4417 6.47394 14.725 6.47394C15.0083 6.47394 15.2417 6.5656 15.425 6.74894L16.85 8.17394ZM3.5 16.9989C3.21667 16.9989 2.97917 16.9031 2.7875 16.7114C2.59583 16.5198 2.5 16.2823 2.5 15.9989C2.5 15.7156 2.59583 15.4781 2.7875 15.2864C2.97917 15.0948 3.21667 14.9989 3.5 14.9989H10.5C10.7833 14.9989 11.0208 15.0948 11.2125 15.2864C11.4042 15.4781 11.5 15.7156 11.5 15.9989C11.5 16.2823 11.4042 16.5198 11.2125 16.7114C11.0208 16.9031 10.7833 16.9989 10.5 16.9989H3.5ZM3.5 8.99894C3.21667 8.99894 2.97917 8.9031 2.7875 8.71144C2.59583 8.51977 2.5 8.28227 2.5 7.99894C2.5 7.7156 2.59583 7.4781 2.7875 7.28644C2.97917 7.09477 3.21667 6.99894 3.5 6.99894H10.5C10.7833 6.99894 11.0208 7.09477 11.2125 7.28644C11.4042 7.4781 11.5 7.7156 11.5 7.99894C11.5 8.28227 11.4042 8.51977 11.2125 8.71144C11.0208 8.9031 10.7833 8.99894 10.5 8.99894H3.5Z"
                        fill="#414447"
                      />
                    </g>
                  </svg>
                </div>
                <span>Fill out manually</span>
              </button>
              {isProfileModalOpen && (
                <CompleteProfileModal
                  type="resume"
                  onClose={() => setIsProfileModalOpen(false)}
                  onSave={function (data: ProfileFormData): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
