import React, { useState } from "react";
import { useGetMultipleSkillsQuery } from "@/api/skillsPoolApiSlice";
import { useCreateUserSkillsMutation } from "@/api/skillsApiSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Skill {
  skill_Id: string;
  name: string;
  rating: string;
  visibility: string;
}

interface AddSkillsModalProps {
  onClose: () => void;
  userId: string;
  onSkillsUpdate: (isUpdated: boolean) => void;
}

const AddSkillsModal: React.FC<AddSkillsModalProps> = ({
  onClose,
  userId,
  onSkillsUpdate,
}) => {
  const [user_Id] = useState<string>(userId);
  const [searchTerm, setSearchTerm] = useState("");

  const [skills, setSkills] = useState<Skill[]>([
    {
      skill_Id: "",
      name: "",
      rating: "__/10",
      visibility: "All users",
    },
  ]);

  const [suggestedSkills] = useState([
    { id: "1", name: "React" },
    { id: "2", name: "MongoDB" },
    { id: "3", name: "Node.js" },
    { id: "4", name: "GraphQL" },
    { id: "5", name: "MySQL" },
    { id: "6", name: "Express" },
  ]);

  const ratings = Array.from({ length: 10 }, (_, i) => `${i + 1}/10`);

  const { data: skillsData, error, isLoading } = useGetMultipleSkillsQuery(searchTerm);

  const handleAddSkill = () => {
    const newSkill: Skill = {
      skill_Id: "",
      name: "",
      rating: "__/10",
      visibility: "All users",
    };
    setSkills([...skills, newSkill]);
  };

  const handleRemoveSkill = (id: string) => {
    setSkills(skills.filter((skill) => skill.skill_Id !== id));
  };

  const handleAddSuggestedSkill = (suggestedSkill: { id: string; name: string }) => {
    if (!skills.some((skill) => skill.skill_Id === suggestedSkill.id)) {
      setSkills([
        ...skills,
        {
          skill_Id: suggestedSkill.id,
          name: suggestedSkill.name,
          rating: "__/10",
          visibility: "All users",
        },
      ]);
    }
  };

  const [createUserSkills, { isLoading: isSaving }] = useCreateUserSkillsMutation();

  const handleSave = async () => {
    if (!userId || typeof userId !== "string") {
      console.error("Invalid user ID.");
      return;
    }

    const payload = {
      user_id: user_Id,
      skills: skills.map((skill) => ({
        skill_pool_id: skill.skill_Id,
        self_rating: parseInt(skill.rating.split("/")[0]),
      })),
    };

    try {
      const response = await createUserSkills(payload).unwrap();
      console.log("Skills added successfully:", response);
      onSkillsUpdate(true);
      onClose();
    } catch (error) {
      console.error("Failed to add skills:", error);
      onSkillsUpdate(false);
    }
  };

  const filteredSkills = skillsData?.data?.filter((skill: any) =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
          <p>Loading skills...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
          <p>Error loading skills. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold">Add Skills</h2>
            <p className="text-sm text-gray-500">Select the skills you want to appear in the profile</p>
          </div>
          <Button variant="ghost" className="h-6 w-6 p-0" onClick={onClose}>
            ×
          </Button>
        </div>

        <div className="space-y-4">
          {skills.map((skill, index) => (
            <div key={index} className="bg-gray-50 rounded-lg border p-4">
              <div className="grid grid-cols-2 gap-4 relative">
                <div>
                  <label className="text-sm font-medium mb-2 block">Skill {index + 1}</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {skill.name || "Select a skill"}
                        <Search className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      <div className="p-2">
                        <Input
                          placeholder="Search skills..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="mb-2"
                        />
                      </div>
                      {filteredSkills?.map((availableSkill: any) => (
                        <DropdownMenuItem
                          key={availableSkill._id}
                          onClick={() => {
                            setSkills((prev) =>
                              prev.map((s, i) =>
                                i === index
                                  ? {
                                      ...s,
                                      skill_Id: availableSkill._id,
                                      name: availableSkill.name,
                                    }
                                  : s
                              )
                            );
                          }}
                        >
                          {availableSkill.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Self rating</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {skill.rating}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {ratings.map((rating) => (
                        <DropdownMenuItem
                          key={rating}
                          onClick={() => {
                            setSkills((prev) =>
                              prev.map((s, i) =>
                                i === index ? { ...s, rating } : s
                              )
                            );
                          }}
                        >
                          {rating}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Button
                  variant="ghost"
                  className="absolute right-0 top-0 h-6 w-6 p-0"
                  onClick={() => handleRemoveSkill(skill.skill_Id)}
                >
                  ×
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button
            variant="outline"
            className="text-green-600 border-green-600"
            onClick={handleAddSkill}
          >
            <span className="mr-2">+</span>
            Add Skill
          </Button>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-2">Suggested Skills</h3>
          <div className="flex flex-wrap gap-2">
            {suggestedSkills.map((suggestedSkill) => (
              <Button
                key={suggestedSkill.id}
                variant="outline"
                className="text-sm"
                onClick={() => handleAddSuggestedSkill(suggestedSkill)}
              >
                {suggestedSkill.name} +
              </Button>
            ))}
          </div>
        </div>

        <Button
          className="w-full mt-6 bg-[#00183D] hover:bg-[#001A4D]"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default AddSkillsModal;