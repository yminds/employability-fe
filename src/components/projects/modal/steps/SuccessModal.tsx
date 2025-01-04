import { X } from "lucide-react";

interface SuccessModalProps {
  onClose: () => void; // Add an onClose prop for closing the modal
}

export default function SuccessModal({ onClose }: SuccessModalProps) {
  const handleClose = () => {
    console.log("Close button clicked"); // Debug log
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg max-w-md w-full p-6">
        <button
          onClick={handleClose} // Use the debugged close handler
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </button>

        {/* Content */}
        <div className="relative text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 relative">
              <div className="absolute inset-0 animate-pulse">
                <svg
                  viewBox="0 0 24 24"
                  className="w-full h-full text-green-500"
                >
                  <path
                    fill="currentColor"
                    d="M13.13 22.19l-1.63-3.83c1.57-.58 3.04-1.36 4.4-2.27l-2.77 6.1M5.64 12.5l-3.83-1.63 6.1-2.77c-.91 1.36-1.69 2.83-2.27 4.4M21.61 2.39C21.61 2.39 16.66.269 11 5.93c-2.19 2.19-3.5 4.6-4.32 6.91-.81 2.28-.94 4.4-.76 6.02l1.9-1.9c.81-2.38 2.37-4.74 4.59-6.96 1.89-1.89 3.81-3.07 5.54-3.77 1.79-.71 3.28-.96 4.17-.96.45 0 .72.05.77.06.01.05.06.31.06.77 0 .9-.25 2.39-.96 4.17-.7 1.73-1.88 3.64-3.77 5.54-2.22 2.22-4.58 3.78-6.96 4.59l-1.9 1.9c1.62.18 3.74.05 6.02-.76 2.31-.82 4.72-2.13 6.91-4.32 5.66-5.66 3.54-10.61 3.54-10.61z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900">
            Project Successfully Updated!
          </h2>
          <p className="text-gray-600">
            Your project has been updated successfully. It's now visible to
            potential employers and included in your portfolio.
          </p>
        </div>
      </div>
    </div>
  );
}
