import micUrl from "@/assets/interview/mic.svg?url";
import { QuestionState } from "./Interview";

interface IControls {
  doneAnswering: () => void;
  setQuestion: React.Dispatch<React.SetStateAction<QuestionState>>;
}

const Controls: React.FC<IControls> = ({ doneAnswering, setQuestion }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[50%] bg-[rgba(31,209,103,0.05)] mt-2 relative">
      <div className=" max-w-[350px] flex flex-col gap-2 items-center ">
        {/* <div className="text-center text-h2 text-base font-medium leading-tight ">Speak your answer and once done answering click on the "Done Answeing" button</div> */}
        <div>
          <Recording />
        </div>
        <div
          onClick={() => {
            doneAnswering();
            setQuestion((prev) => ({ ...prev, isCodeSnippetMode: false }));
          }}
          className="w-full cursor-pointer h-12 px-3 py-3.5 bg-button/90 rounded-sm border border-button justify-center items-center inline-flex max-w-[250px]"
        >
          <div className="text-center text-white text-[14px] font-medium leading-tight ">Done Answering</div>
        </div>
      </div>
      <p className="text-[14px] font-normal absolute bottom-[5%] leading-[24px]">
        *Press 'Done Answering' to move to the next one.
      </p>
    </div>
  );
};

export default Controls;

const Recording: React.FC = () => {
  return (
    <div className="flex gap-4 flex-row items-center py-1 px-4 w-[100%] bg-white rounded-sm ">
      <img src={micUrl} className="w-10 h-10" />
      {/* <div className="flex  gap-2 w-full"> */}
      <p className="text-center font-ubuntu   font-medium text[14px] text-slate-900">Recording...</p>
      {/* </div> */}
    </div>
  );
};
