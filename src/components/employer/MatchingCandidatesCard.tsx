import Candidate1 from "@/assets/candidates/Candidate1.png";
import Candidate2 from "@/assets/candidates/Candidate2.png";
import Candidate3 from "@/assets/candidates/Candidate3.png";

export default function MatchingCandidatesCard() {
  return (
    <div className="w-full max-w-lg rounded-lg border border-gray-100 bg-white p-7 shadow-sm">
      <div className="flex flex-col gap-6">
        <div className="flex items-center">
          {/* Overlapping profile images */}
          <div className="flex -space-x-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white">
              <img
                src={Candidate1}
                alt="Candidate profile"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white">
              <img
                src={Candidate2}
                alt="Candidate profile"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white">
              <img
                src={Candidate3}
                alt="Candidate profile"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="ml-6">
            <div className="flex flex-col items-baseline">
              <span className="text-[24px] font-ubuntu font-medium leading-8 tracking-[-0.36px] text-[#10b754]">
                300+
              </span>
              <span className="text-[20px] font-ubuntu font-medium leading-8 tracking-[-0.3px] text-[#333333]">
                Matching candidates Found.
              </span>
            </div>
          </div>
        </div>

        <div className="">
          <h3 className="text-h1 text-[#333333]">Send Interview Invites</h3>
        </div>
      </div>
    </div>
  );
}
