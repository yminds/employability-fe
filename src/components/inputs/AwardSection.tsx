import React from "react";
import TextInput from "./TextInput";
import { Button } from "@/components/ui/button";

interface AwardsSectionProps {
  awards: string[];
  setAwards: React.Dispatch<React.SetStateAction<string[]>>;
}

const AwardsSection: React.FC<AwardsSectionProps> = ({ awards, setAwards }) => {
  // Ensure awards is always an array
  const handleAwardChange = (index: number, value: string) => {
    const updatedAwards = [...awards];
    updatedAwards[index] = value;
    setAwards(updatedAwards);
  };

  const addAward = () => {
    setAwards([...awards, ""]);
  };

  const removeAward = (index: number) => {
    setAwards(awards.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-4">Awards</h3>
      {Array.isArray(awards) &&
        awards.map((award, index) => (
          <div key={index} className="mb-4 p-4 border border-gray-300 rounded">
            <TextInput
              label={`Award ${index + 1}`}
              value={award}
              onChange={(e) => handleAwardChange(index, e.target.value)}
              placeholder="e.g., Employee of the Year, Best Innovator"
            />
            <Button
              onClick={() => removeAward(index)}
              variant="destructive"
              size="sm"
              className="mt-2"
            >
              Remove Award
            </Button>
          </div>
        ))}
      <Button onClick={addAward} variant="default">
        Add Award
      </Button>
    </div>
  );
};

export default AwardsSection;
