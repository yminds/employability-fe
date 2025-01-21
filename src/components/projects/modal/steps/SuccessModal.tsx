import { X, CheckCircle } from "lucide-react";

interface SuccessModalProps {
  onClose: () => void;
  onRefresh?:() => Promise<void>
}

export default function SuccessModal({ onClose,onRefresh }: SuccessModalProps) {
  const handleClose = async() => {
    if(onRefresh){
      await onRefresh()
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="relative bg-white rounded-lg max-w-md w-full p-8 shadow-xl">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>

        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
            <CheckCircle 
              className="w-16 h-16 text-yellow-500 animate-pulse" 
              strokeWidth={1.5} 
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Project Submitted for Review
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Your project has been successfully submitted and is now under review. 
              Our team will verify the details and assess your project.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              What happens next?
            </p>
            <ul className="text-left text-gray-600 space-y-2 bg-gray-50 p-4 rounded-lg">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" strokeWidth={2} />
                Review by our expert team
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" strokeWidth={2} />
                Verification of project details
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" strokeWidth={2} />
                Potential feedback for improvement
              </li>
            </ul>
          </div>

          <div className="mt-6">
            <button
              onClick={handleClose}
              className="w-full bg-primary-700 text-white py-3 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Continue to Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}