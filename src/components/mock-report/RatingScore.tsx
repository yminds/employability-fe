import React from "react";

interface RatingScoreProps {
  onClose: () => void;
}

const RatingScore: React.FC<RatingScoreProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"
      onClick={onClose} // Clicking on the overlay closes the modal
    >
      <div
        className="bg-white rounded-xl shadow-lg w-[398px] h-[525px] p-6 relative flex-col "
        onClick={(e) => e.stopPropagation()} // Prevents modal clicks from closing it
      >
        <div>
          <h2 className=" text-grey-10 font-dm-sans text-lg font-medium leading-6 tracking-tight text-center">Excellent Interview score</h2>
          <div className=" w-full h-[1px] bg-[#D9D9D9] my-6"></div>
        </div>
        <div className=" flex flex-col h-[336px] justify-around">
          <h3 className="font-dm-sans text-base font-medium leading-6 tracking-tight mb-[10px]">Score Range</h3>
          <div className="w-[350px] border border-[rgba(0,0,0,0.10)] rounded-xl overflow-hidden mb-[10px]">
            <table className="w-full rounded-xl">
              <thead className="bg-grey-1 h-11">
                <tr className="text-left">
                  <th className="p-3 font-dm-sans text-[14px] font-medium leading-[20px] tracking-[0.21px] text-grey-5 border-b  w-1/2">
                    Category
                  </th>
                  <th className="p-3 font-dm-sans text-[14px] font-medium leading-[20px] tracking-[0.21px] text-grey-5 border-b w-1/2">
                    Score Range
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-grey-1">
                  <td className="p-3 font-dm-sans text-base font-normal leading-6 tracking-[0.08px] text-[#03963F]">
                    <span className=" bg-[#DBFFEA80] rounded-full p-1 px-4 items-center gap-2.5">Excellent </span>
                  </td>
                  <td className="p-3 text-body2 text-grey-6">
                    9.1–10
                  </td>
                </tr>
                <tr className="hover:bg-grey-1">
                  <td className="p-3 font-dm-sans text-base font-normal leading-6 tracking-[0.08px] text-[#D48A0C]">
                  <span className=" bg-[#FFF2DB80] rounded-full  p-1 px-4 items-center gap-2.5">Good </span>
                  </td>
                  <td className="p-3 text-body2 text-grey-6">
                    7.1–9
                  </td>
                </tr>
                <tr className="hover:bg-grey-1">
                  <td className="p-3 font-dm-sans text-base font-normal leading-6 tracking-[0.08px] text-[#F08F64]">
                  <span className=" bg-[#F08F641F] rounded-full p-1 px-4 items-center gap-2.5">Average </span>
                  </td>
                  <td className="p-3 text-body2 text-grey-6">
                    4.1–7
                  </td>
                </tr>
                <tr className="hover:bg-grey-1">
                  <td className="p-3 font-dm-sans text-base font-normal leading-6 tracking-[0.08px] text-[#CF0C19]">
                  <span className=" bg-[#FFE5E780] rounded-full p-1 px-4 items-center gap-2.5">Poor </span>
                  </td>
                  <td className="p-3 text-body2 text-grey-6">
                    0–4
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-grey-5 font-dm-sans text-base font-normal leading-6 tracking-[0.08px]">
            *These scores help you categorize your skill level as compared to the industry average
          </p>

        </div>

        <button
          className=" mt-6 w-full bg-blue-950 text-white py-2 rounded-md font-medium hover:bg-blue-900 transition"
          onClick={onClose}
        >
          Okay, Got it
        </button>

      </div>
    </div>
  );
};

export default RatingScore;
