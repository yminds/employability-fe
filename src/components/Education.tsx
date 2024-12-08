// components/Education.tsx
import React from "react";
import { Button } from "./ui/button";
import TextInput from "./TextInput";

interface EducationProps {
  educations: Array<any>;
  onUpdate: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
}

const Education: React.FC<EducationProps> = ({
  educations,
  onUpdate,
  onRemove,
  onAdd,
}) => {
  return (
    <section className="mb-6">
      <h3 className="text-xl font-semibold mb-4">Education</h3>
      {educations.map((education, index) => (
        <div key={index} className="mb-4 p-4 border border-gray-300 rounded">
          <div className="flex justify-between">
            <h4 className="text-lg font-medium mb-2">Education {index + 1}</h4>
            <Button variant="outline" onClick={() => onRemove(index)}>
              Remove
            </Button>
          </div>
          <TextInput
            label="Degree"
            value={education.degree}
            onChange={(e) => onUpdate(index, "degree", e.target.value)}
          />
          <TextInput
            label="Institution"
            value={education.institution}
            onChange={(e) => onUpdate(index, "institution", e.target.value)}
          />
          <div className="flex space-x-2">
            <div className="w-1/2">
              <TextInput
                label="Start Date"
                value={education.startDate}
                onChange={(e) => onUpdate(index, "startDate", e.target.value)}
                type="month"
              />
            </div>
            <div className="w-1/2">
              <TextInput
                label="End Date"
                value={education.endDate}
                onChange={(e) => onUpdate(index, "endDate", e.target.value)}
                type="month"
              />
            </div>
          </div>
          <TextInput
            label="Location"
            value={education.location}
            onChange={(e) => onUpdate(index, "location", e.target.value)}
          />
        </div>
      ))}
      <Button onClick={onAdd}>Add Education</Button>
    </section>
  );
};

export default Education;
