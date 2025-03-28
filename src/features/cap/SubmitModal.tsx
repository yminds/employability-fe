import { X, CheckCircle } from "lucide-react";

interface SubmitModalProps {
  onClose: () => void;
  onRefresh?:() => Promise<void>
  onSubmit:() => void
}

export default function SubmitModal({ onClose,onRefresh ,onSubmit}: SubmitModalProps) {
  const handleClose = async() => {
    if(onRefresh){
      await onRefresh()
    }
    onClose();
  };

  const handleSubmit = async() => {
    onSubmit()

  }
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 font-ubuntu">
      <div className="relative bg-white rounded-lg max-w-md w-full p-8 shadow-xl">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>

        <div className="text-center space-y-6">


          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Are You sure you want to submit the Code?
            </h2>
            <p className="text-gray-600 leading-relaxed">
                Please make sure you have tested the code before submitting it.
            </p>
          </div>

   

          <div className="mt-6">
            <button
              onClick={handleSubmit}
              className="w-full bg-primary-700 text-white py-3 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}