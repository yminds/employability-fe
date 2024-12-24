import React, { useState } from "react";

interface EditBioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bio: string) => void;
  initialBio?: string;
}

const EditBioModal: React.FC<EditBioModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialBio = "",
}) => {
  const [bio, setBio] = useState<string>(initialBio);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(bio);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 ">
      <div className="bg-white rounded-lg w-full max-w-xl  p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Edit Bio</h2>
            <p className="text-gray-500 text-sm">
              Enter your goal and tailor your learning path.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 focus:outline-none"
            aria-label="Close Modal"
          >
            &times;
          </button>
        </div>

        {/* Textarea */}
        <div className="mb-6">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Enter here"
            className="w-full h-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-800 placeholder-gray-400 resize-none"
          ></textarea>
        </div>

        {/* Save Button */}
        <div className="flex w-full">
          <button
            onClick={handleSave}
            className="bg-green-700 text-white py-2 px-6 rounded-lg hover:bg-emerald-600 focus:outline-none w-full"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBioModal;
