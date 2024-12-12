import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { setRole } from "@/store/slices/roleSlice"; // Import setRole action

const Homepage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Handle role selection and navigation
  const handleOptionClick = (role: string) => {
    dispatch(setRole(role)); // Set the role in Redux store
    navigate("/register"); // Navigate to the /register route
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-6xl mx-4 p-6">
        {/* Header Section */}
        <div className="flex flex-col justify-center items-center gap-4 text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 font-ubuntu">
            What brings you to{" "}
            <span className="text-green-500">Employability?</span>
          </h2>
          <p className="text-[#B3B3B3] text-base sm:text-3xl font-normal font-ubuntu">
            Choose your path and let us customize your experience.
          </p>
        </div>

        {/* Options Section */}
        <div className="flex flex-wrap justify-center items-center gap-6">
          {/* Option 1 - Candidate */}
          <div
            className="group p-6 bg-[#fcfcfc] rounded-xl border border-black/10 flex flex-col justify-start items-start gap-5 w-full sm:w-[45%] hover:border-[#24D680] hover:shadow-lg transition duration-300"
            onClick={() => handleOptionClick("candidate")} // Set role as 'candidate'
          >
            {/* Icon Section */}
            <div className="w-12 h-12 flex items-center justify-center relative">
              <img src="./src/assets/upskill.svg" alt="Upskill Icon" />
            </div>

            {/* Text Section */}
            <div className="flex flex-col gap-2">
              <h3 className="text-[#333333] text-lg sm:text-2xl font-medium font-['Ubuntu']">
                I’m here to upskill and find a job.
              </h3>
              <p className="text-[#656565] text-sm sm:text-base font-normal font-['Ubuntu'] leading-relaxed">
                Take mock interviews, get personalized mentorship, and apply for
                top jobs to accelerate your career.
              </p>
            </div>
          </div>

          {/* Option 2 - Employer */}
          <div
            className="group p-6 bg-[#fcfcfc] rounded-xl border border-black/10 flex flex-col justify-start items-start gap-5 w-full sm:w-[45%] hover:border-[#24D680] hover:shadow-lg transition duration-300"
            onClick={() => handleOptionClick("employer")} // Set role as 'employer'
          >
            {/* Icon Section */}
            <div className="w-12 h-12 flex items-center justify-center relative">
              <img src="./src/assets/find-talent.svg" alt="Hire Icon" />
            </div>

            {/* Text Section */}
            <div className="flex flex-col gap-2">
              <h3 className="text-[#333333] text-lg sm:text-2xl font-medium font-['Ubuntu']">
                I’m here to hire top talent.
              </h3>
              <p className="text-[#656565] text-sm sm:text-base font-normal font-['Ubuntu'] leading-relaxed">
                Take mock interviews, get personalized mentorship, and apply for
                top jobs to accelerate your career.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
