import { X } from 'lucide-react'


interface ResumeUploadProgressModalProps {
  onClose: () => void
  fileName: any
  fileSize: any
  uploadProgress: number
}

export default function ResumeUploadProgressModal({
  onClose,
  fileName,
  fileSize,
  uploadProgress,
}: ResumeUploadProgressModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Upload your Resume</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Progress Container */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* PDF Icon */}
              <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                <span className="text-red-700 text-sm font-medium">PDF</span>
              </div>
              {/* File Details */}
              <div>
                <p className="font-medium text-gray-900">{fileName}</p>
                <p className="text-sm text-gray-500">{fileSize}</p>
              </div>
            </div>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          {/* Progress Percentage */}
          <p className="text-right text-sm text-gray-600 mt-1">
            {uploadProgress}%
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-6">
          <button
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-900 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

