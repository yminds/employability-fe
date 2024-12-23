import React, { useState } from "react";

interface Experience {
  position: string;
  jobType: string;
  company: string;
  location: string;
  from: string;
  till: string;
}

const EditExperienceModal: React.FC<{ isVisible: boolean; onClose: () => void }> = ({ isVisible, onClose }) => {
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      position: "Lead Full-stack Engineer",
      jobType: "Full time",
      company: "Bangalore University",
      location: "Bangalore Urban, Karnataka, India",
      from: "2017-07-20",
      till: "2019-11-20",
    },
  ]);

  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      { position: "", jobType: "", company: "", location: "", from: "", till: "" },
    ]);
  };

  const handleUpdateExperience = (index: number, field: keyof Experience, value: string) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index][field] = value;
    setExperiences(updatedExperiences);
  };

  const handleRemoveExperience = (index: number) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(updatedExperiences);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full p-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Edit Experience</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            ×
          </button>
        </div>
        <p className="text-gray-500 mt-2">Enter your goal and tailor your learning path.</p>

        <div className="space-y-6 mt-6">
          {experiences.map((exp, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-md border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-700 font-medium">Position</h3>
                <button
                  onClick={() => handleRemoveExperience(index)}
                  className="text-gray-600 hover:text-red-600"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Position</label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => handleUpdateExperience(index, "position", e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter position"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Job type</label>
                  <input
                    type="text"
                    value={exp.jobType}
                    onChange={(e) => handleUpdateExperience(index, "jobType", e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter job type"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Company</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => handleUpdateExperience(index, "company", e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter company"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Location</label>
                  <input
                    type="text"
                    value={exp.location}
                    onChange={(e) => handleUpdateExperience(index, "location", e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter location"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 text-sm mb-1">From</label>
                  <input
                    type="date"
                    value={exp.from}
                    onChange={(e) => handleUpdateExperience(index, "from", e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Till</label>
                  <input
                    type="date"
                    value={exp.till}
                    onChange={(e) => handleUpdateExperience(index, "till", e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={handleAddExperience}
            className="flex items-center space-x-2 text-green-600 hover:text-green-800"
          >
            <span className="text-xl font-bold">+</span>
            <span>Add experience</span>
          </button>
        </div>

        <button
          onClick={() => console.log("Experiences Saved:", experiences)}
          className="mt-6 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditExperienceModal;
