// components/WorkExperience.tsx
import React from "react";
import TextInput from "./TextInput";
import { Button } from "./ui/button";

interface WorkExperienceProps {
  workExperiences: Array<any>;
  onUpdate: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
}

const WorkExperience: React.FC<WorkExperienceProps> = ({
  workExperiences,
  onUpdate,
  onRemove,
  onAdd,
}) => {
  return (
    <section className="mb-6">
      <h3 className="text-xl font-semibold mb-4">Work Experience</h3>
      {workExperiences.map((experience, index) => (
        <div key={index} className="mb-4 p-4 border border-gray-300 rounded">
          <div className="flex justify-between">
            <h4 className="text-lg font-medium mb-2">Experience {index + 1}</h4>
            <Button variant="outline" onClick={() => onRemove(index)}>
              Remove
            </Button>
          </div>
          <TextInput
            label="Job Title"
            value={experience.jobTitle}
            onChange={(e) => onUpdate(index, "jobTitle", e.target.value)}
          />
          <TextInput
            label="Company"
            value={experience.company}
            onChange={(e) => onUpdate(index, "company", e.target.value)}
          />
          <div className="flex space-x-2">
            <div className="w-1/2">
              <TextInput
                label="Start Date"
                value={experience.startDate}
                onChange={(e) => onUpdate(index, "startDate", e.target.value)}
                type="month"
              />
            </div>
            <div className="w-1/2">
              <TextInput
                label="End Date"
                value={experience.endDate}
                onChange={(e) => onUpdate(index, "endDate", e.target.value)}
                type="month"
              />
            </div>
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Responsibilities</label>
            <textarea
              value={experience.responsibilities}
              onChange={(e) =>
                onUpdate(index, "responsibilities", e.target.value)
              }
              className="w-full p-2 mt-1 border border-gray-300 rounded"
              rows={3}
            />
          </div>
        </div>
      ))}
      <Button onClick={onAdd}>Add Work Experience</Button>
    </section>
  );
};

export default WorkExperience;
