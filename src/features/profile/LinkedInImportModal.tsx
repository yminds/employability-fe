import React from "react";
import { X, Upload } from "lucide-react";

// LinkedInImportModal Component
const LinkedInImportModal: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl p-8 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">
            Import your profile from LinkedIn
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-sm font-medium">
                1
              </span>
              <p className="text-gray-900">
                Go to you{" "}
                <a
                  href="https://linkedin.com/profile"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn profile
                </a>{" "}
                and download your profile as shown below
              </p>
            </div>
            <div className="">
              <img
                src="src/features/profile/Frame 1410077928.png"
                alt="LinkedIn profile download instructions"
                className="w-full "
              />
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-sm font-medium">
                2
              </span>
              <p className="text-gray-900">
                Upload the downloaded pdf by clicking the button below
              </p>
            </div>
            <button className=" flex items-center justify-center gap-2 px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors">
              <Upload className="w-4 h-4" />
              Upload LinkedIn profile
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end">
          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkedInImportModal;
