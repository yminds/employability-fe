import micUrl from "@/assets/interview/mic.svg?url";

interface IControls {
  doneAnswering: () => void;
}

const Controls: React.FC<IControls> = ({ doneAnswering }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <div className=" max-w-[250px] flex flex-col gap-2 items-start">
        <Recording />
        <div
          onClick={() => doneAnswering()}
          className="w-full cursor-pointer h-12 px-3 py-3.5 bg-button/90 rounded-xl border border-button justify-center items-center inline-flex"
        >
          <div className="text-center text-white text-base font-medium leading-tight">
            Done Answering
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;

const Recording: React.FC = () => {
  return (
    <div className="flex gap-4 flex-row items-center py-1.5 px-4 w-[100%] ">
      <img src={micUrl} className="w-12 h-12" />
      {/* <div className="flex  gap-2 w-full"> */}
        <p className="text-center font-ubuntu   font-medium text-base text-slate-900">
         Recording...
        </p>
      {/* </div> */}
    </div>
  );
};
