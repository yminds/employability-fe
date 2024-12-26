import React, { useState } from "react";
import LinkedInImportModal from "../../components/modal/LinkedInImportModal";
import ResumeUploadModal from "../../components/modal/ResumeUploadModal";
import ResumeUploadProgressModal from "../../components/modal/ResumeUploadProgressModal";
import CompleteProfileModal from "@/components/modal/CompleteProfileModal";
import { ProfileFormData } from "./types";
import EditBioModal from "@/components/modal/EditBioModal";
import EducationSection from "./EducationSection";
// import { useSelector } from "react-redux";
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



const UserProfile: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user);
  // console.log(user, "hhhhhhhhhhhhh");

  const initialEducationEntries: Education[] = [
    {
      education_level: "bachelors",
      degree: "B Tech Computer Science",
      institute: "APJ Abdul Kalam University",
      from_date: "2020-10-01",
      till_date: "2024-04-30",
      cgpa_or_marks: "9.1",
      _id: "",
      board_or_certification: ''
    },

  ];
  const initialExperiences: ExperienceItem[] = [
    {
      duration: "1y 2m",
      id: "1",
      companyLogo:
        "https://st3.depositphotos.com/43745012/44906/i/450/depositphotos_449066958-stock-photo-financial-accounting-logo-financial-logo.jpg",
      jobTitle: "Lead Full-stack Engineer",
      companyName: "Ernst and Young",
      employmentType: "Full time",
      location: "Bangalore Urban, Karnataka, India",
      startDate: "Apr 2022",
      endDate: "Present",
      description:
        "As a lead full-stack developer at EY for over a year, I spearheaded the development of scalable web applications. My expertise in React, Python, and MongoDB allowed me to drive innovative, user-centric solutions that enhanced our clients' digital experiences.",
      currentlyWorking: false,
      currentCTC: "",
      expectedCTC: "",
      jobType: undefined,
      isVerified: undefined,
      company: "",
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
    <div className="bg-gray-100 min-h-screen py-8 ">
      <div className="max-w-6xl mx-auto space-y-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
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

          <div className="bg-white rounded-lg">
            <div className=" ">
              <img
                src="src/features/profile/images/Banner.png"
                alt="Banner"
                className="w-full rounded-t-lg"
              />
            </div>
            <div className="  p-8">
              <div className="flex justify-between">
                <div className="flex items-center space-x-6">
                  <img
                    src="https://s3-alpha-sig.figma.com/img/62e2/8e4d/486c896150b27448a2d7336ecf91ec03?Expires=1735516800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=PaRvDr2ySVWPht9AHLTJMmciWrZRJHyxvxEqVhNES7am-m6K81OXp8vOQMgLZxuvbaY-Jl2vvROupZnTD~ro4oOrUiOZCEyyJlQiJvxX7er1OuA8QpigQzDQDTL0nVb92alO6boKf5RuujpPT7AiHq9ZH2JCyEr0QJZ0sI9qxi2yHbmqQaDnDZGNjM4y0S7gzbfdrrTOtpe613ckT5OU32SEAWRyH2HYKrJo-u8PJ4jiR-aO7OJwgQoDwQrSaMPZWIj0Laa8Y3SCg1nEV2Vf2XVpFMFVOwLSEsd4G8UzPpEnlxFL6iVwKlzncApMdQFzO8DqW0N9AVn1LNTMbxw~sA__"
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                      {user.name}
                    </h1>
                    <p className="text-gray-500">Front-end Developer</p>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="flex items-center space-x-4">
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-800"
                    aria-label="GitHub"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="24"
                      viewBox="0 0 25 24"
                      fill="none"
                    >
                      <g id="layer1">
                        <path
                          id="path16"
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12.6241 0.296875C5.99836 0.296875 0.625 5.66952 0.625 12.2974C0.625 17.5986 4.0631 22.0967 8.83163 23.6843C9.43202 23.7941 9.65082 23.4235 9.65082 23.1053C9.65082 22.8201 9.64038 22.0658 9.63411 21.0646C6.29621 21.7895 5.59195 19.4558 5.59195 19.4558C5.04607 18.0693 4.25929 17.7003 4.25929 17.7003C3.16973 16.9562 4.34177 16.9709 4.34177 16.9709C5.54624 17.0557 6.17979 18.2078 6.17979 18.2078C7.25019 20.0414 8.98875 19.5117 9.67239 19.2045C9.7814 18.4296 10.0916 17.9006 10.4341 17.6008C7.76956 17.2973 4.96795 16.2681 4.96795 11.6698C4.96795 10.3592 5.43575 9.28881 6.20337 8.44974C6.07953 8.14622 5.6678 6.92625 6.32135 5.27388C6.32135 5.27388 7.32838 4.95124 9.62094 6.50344C10.5779 6.23748 11.6048 6.10488 12.6251 6.09972C13.6447 6.1039 14.6709 6.23754 15.6293 6.50344C17.9204 4.95124 18.9259 5.27388 18.9259 5.27388C19.5808 6.92625 19.169 8.14622 19.046 8.44974C19.8151 9.28881 20.2792 10.3592 20.2792 11.6698C20.2792 16.2799 17.4732 17.2943 14.8005 17.5912C15.2307 17.9617 15.6145 18.694 15.6145 19.8138C15.6145 21.4175 15.5999 22.7119 15.5999 23.1053C15.5999 23.4264 15.8165 23.8 16.425 23.6828C21.1899 22.0923 24.625 17.5979 24.625 12.2974C24.625 5.66952 19.252 0.296875 12.6241 0.296875Z"
                          fill="#1B1817"
                        />
                      </g>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-800"
                    aria-label="LinkedIn"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="20"
                      viewBox="0 0 21 20"
                      fill="none"
                    >
                      <path
                        id="Subtract"
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M2.09361 0C1.2825 0 0.625 0.641645 0.625 1.43268V18.5673C0.625 19.3586 1.2825 20 2.09361 20H19.0298C19.8409 20 20.4984 19.3586 20.4984 18.5673V1.43268C20.4984 0.641645 19.8409 0 19.0298 0H2.09361ZM6.64915 7.70517V16.7363H3.64745V7.70517H6.64915ZM6.84656 4.91198C6.84656 5.77864 6.19504 6.47213 5.14828 6.47213H5.12872C4.12138 6.47213 3.47001 5.77864 3.47001 4.91198C3.47001 4.02581 4.14135 3.35156 5.16814 3.35156C6.19504 3.35156 6.82705 4.02581 6.84656 4.91198ZM11.3117 16.7363H8.31004C8.31004 16.7363 8.34952 8.55259 8.31013 7.70517H11.3118V8.98381L11.2918 9.01492H11.3118V8.98381C11.7107 8.36843 12.4247 7.49325 14.0169 7.49325C15.9918 7.49325 17.4727 8.78402 17.4727 11.558V16.7363H14.4713V11.9049C14.4713 10.6908 14.0368 9.86261 12.9506 9.86261C12.1214 9.86261 11.6275 10.4211 11.4105 10.9604C11.3312 11.1534 11.3117 11.423 11.3117 11.6929V16.7363Z"
                        fill="#414447"
                      />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-800"
                    aria-label="Website"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="24"
                      viewBox="0 0 25 24"
                      fill="none"
                    >
                      <mask
                        id="mask0_40000154_5146"
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="25"
                        height="24"
                      >
                        <rect x="0.5" width="24" height="24" fill="#D9D9D9" />
                      </mask>
                      <g mask="url(#mask0_40000154_5146)">
                        <path
                          d="M21.2 21.7693L18 18.5693V21.15H16.5V16H21.65V17.5H19.0443L22.2443 20.7L21.2 21.7693ZM12.5 21.5C11.1858 21.5 9.95083 21.2507 8.795 20.752C7.63917 20.2533 6.63375 19.5766 5.77875 18.7218C4.92375 17.8669 4.24692 16.8617 3.74825 15.706C3.24942 14.5503 3 13.3156 3 12.0017C3 10.6877 3.24933 9.45267 3.748 8.2965C4.24667 7.14033 4.92342 6.13467 5.77825 5.2795C6.63308 4.42433 7.63833 3.74725 8.794 3.24825C9.94967 2.74942 11.1844 2.5 12.4983 2.5C13.8123 2.5 15.0473 2.74942 16.2035 3.24825C17.3597 3.74692 18.3653 4.42375 19.2205 5.27875C20.0757 6.13375 20.7528 7.13917 21.2518 8.295C21.7506 9.45083 22 10.6858 22 12C22 12.3013 21.9858 12.6026 21.9573 12.9038C21.9288 13.2051 21.8859 13.5064 21.8288 13.8077H20.2885C20.359 13.5064 20.4118 13.2051 20.447 12.9038C20.4823 12.6026 20.5 12.3013 20.5 12C20.5 11.6367 20.476 11.2734 20.428 10.9102C20.3798 10.5469 20.3045 10.1858 20.202 9.827H16.4845C16.5473 10.1858 16.5929 10.5469 16.6212 10.9102C16.6494 11.2734 16.6635 11.6367 16.6635 12C16.6635 12.3013 16.6534 12.6026 16.6333 12.9038C16.6129 13.2051 16.5826 13.5064 16.5423 13.8077H15.0423C15.0828 13.5064 15.1131 13.2051 15.1333 12.9038C15.1534 12.6026 15.1635 12.3013 15.1635 12C15.1635 11.6367 15.1494 11.2734 15.1212 10.9102C15.0929 10.5469 15.0474 10.1858 14.9848 9.827H10.0152C9.95258 10.1858 9.90708 10.5472 9.87875 10.911C9.85058 11.2748 9.8365 11.6387 9.8365 12.0025C9.8365 12.3662 9.85058 12.7291 9.87875 13.0913C9.90708 13.4536 9.95258 13.8142 10.0152 14.173H13.6923V15.673H10.3595C10.5812 16.4597 10.8673 17.2144 11.218 17.9373C11.5688 18.6599 11.9962 19.3404 12.5 19.9788C12.8013 19.9788 13.1026 19.9612 13.4038 19.926C13.7051 19.8907 14.0064 19.8563 14.3077 19.823V21.3443C14.0064 21.3776 13.7051 21.4118 13.4038 21.447C13.1026 21.4823 12.8013 21.5 12.5 21.5ZM4.798 14.173H8.5155C8.45267 13.8142 8.40708 13.4528 8.37875 13.089C8.35058 12.7252 8.3365 12.3613 8.3365 11.9975C8.3365 11.6338 8.35058 11.2709 8.37875 10.9087C8.40708 10.5464 8.45267 10.1858 8.5155 9.827H4.798C4.6955 10.1858 4.62017 10.5472 4.572 10.911C4.524 11.2748 4.5 11.6387 4.5 12.0025C4.5 12.3662 4.524 12.7291 4.572 13.0913C4.62017 13.4536 4.6955 13.8142 4.798 14.173ZM5.427 8.327H8.81475C8.98692 7.60133 9.216 6.89942 9.502 6.22125C9.78783 5.54292 10.1417 4.89483 10.5635 4.277C9.44167 4.52567 8.43558 5.00383 7.54525 5.7115C6.65475 6.41917 5.94867 7.291 5.427 8.327ZM10.5635 19.723C10.161 19.0987 9.81517 18.4474 9.526 17.7693C9.23683 17.0911 9.00125 16.3923 8.81925 15.673H5.427C5.94867 16.7025 6.65633 17.5711 7.55 18.2788C8.44367 18.9866 9.44817 19.468 10.5635 19.723ZM10.3595 8.327H14.6405C14.4277 7.53983 14.141 6.78842 13.7805 6.07275C13.42 5.35725 12.9932 4.67342 12.5 4.02125C12.0025 4.65958 11.5746 5.34 11.2163 6.0625C10.8579 6.785 10.5723 7.53983 10.3595 8.327ZM16.1807 8.327H19.573C19.0513 7.291 18.3453 6.41758 17.4548 5.70675C16.5644 4.99575 15.5583 4.51917 14.4365 4.277C14.839 4.90133 15.18 5.55417 15.4595 6.2355C15.739 6.917 15.9794 7.61417 16.1807 8.327Z"
                          fill="#1C1B1F"
                        />
                      </g>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
              {/* Bio Section */}
              <div className="relative md:col-span-2 bg-gray-50 p-6 rounded-lg group">
                <h2 className="font-semibold text-gray-700">Bio</h2>
                <p className="text-gray-600 mt-2">
                  Full-stack developer with a strong foundation in React,
                  Python, and MongoDB. A quick learner passionate about building
                  user-friendly web applications, eager to apply skills in a
                  professional environment.
                </p>
                {/* Edit Icon */}
                <button
                  className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full shadow hover:bg-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setIsEditBioModalOpen(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="text-gray-600"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15.502 1.94a1.5 1.5 0 0 1 0 2.12L14.121 5.44l-3.564-3.564 1.38-1.38a1.5 1.5 0 0 1 2.12 0l1.445 1.445ZM13.44 6.56l-3.564-3.564L2 11v3h3l8.44-8.44Z" />
                  </svg>
                </button>
                {/* Edit Bio Modal */}
                {isEditBioModalOpen && (
                  <EditBioModal
                    isOpen={isEditBioModalOpen}
                    onClose={() => setIsEditBioModalOpen(false)}
                    onSave={handleEditBio}
                    initialBio={bio}
                  />
                )}
              </div>

              {/* Info Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="bg-white p-3 rounded-lg shadow-md">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 14.75C15.3137 14.75 18 12.0637 18 8.75C18 5.4363 15.3137 2.75 12 2.75C8.6863 2.75 6 5.4363 6 8.75C6 12.0637 8.6863 14.75 12 14.75ZM12 16.25C8.2721 16.25 3.75 18.2886 3.75 22C3.75 22.5523 4.1977 23 4.75 23H19.25C19.8023 23 20.25 22.5523 20.25 22C20.25 18.2886 15.7279 16.25 12 16.25Z"
                        fill="#0C0F12"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-700">Experience</h2>
                    <p className="text-gray-600">Fresher</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-white p-3 rounded-lg shadow-md">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 14.75C15.3137 14.75 18 12.0637 18 8.75C18 5.4363 15.3137 2.75 12 2.75C8.6863 2.75 6 5.4363 6 8.75C6 12.0637 8.6863 14.75 12 14.75ZM12 16.25C8.2721 16.25 3.75 18.2886 3.75 22C3.75 22.5523 4.1977 23 4.75 23H19.25C19.8023 23 20.25 22.5523 20.25 22C20.25 18.2886 15.7279 16.25 12 16.25Z"
                        fill="#0C0F12"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-700">Location</h2>
                    <p className="text-gray-600">Bangalore, India</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg mt-6">
            {/* Education Section */}
            <div className="bg-white rounded-lg mt-6 p-6 ">
              <EducationSection
                initialEducation={educationEntries} // Pass the initial education entries
              />
            </div>
          </div>

          <div className="bg-white rounded-lg mt-6">
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
