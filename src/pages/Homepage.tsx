import { useNavigate } from "react-router-dom"; // Import useNavigate

const Homepage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Handle role selection and navigation
  const handleOptionClick = (route: string) => {
    navigate(route); // Navigate to the specified route
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-6xl mx-4 p-6">
        {/* Header Section */}
        <div className="flex flex-col justify-center items-center gap-4 text-center mb-12 text-[32px]">
          <h2 className=" font-bold text-gray-800 font-ubuntu">
            What brings you to{" "}
            <span className="text-primary-500">Employability?</span>
          </h2>
          <p className="text-secondary-200 text-base text-[20px] font-normal font-poppins">
            Choose your path and let us customize your experience.
          </p>
        </div>
        {/* Options Section */}
        <div className="flex flex-wrap justify-center items-center gap-6">
          {/* Option 1 - Candidate */}
          <img
            src="./src/assets/candidate.svg"
            alt="Candidate"
            className="rounded-xl border border-transparent transition-all duration-300 ease-in-out hover:border-primary-400 hover:scale-105 hover:shadow-lg cursor-pointer"
            onClick={() => handleOptionClick("/candidate/register")}
          />
          {/* Option 2 - Employer */}
          <img
            src="./src/assets/recruiter.svg"
            alt="Employer"
            className="rounded-xl border border-transparent transition-all duration-300 ease-in-out hover:border-primary-400 hover:scale-105 hover:shadow-lg cursor-pointer"
            onClick={() => handleOptionClick("/employer/register")}
          />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
