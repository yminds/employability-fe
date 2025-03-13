import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";

interface Goal {
  _id: string;
  user_id: string;
  predefined_goal_id: string;
  name: string;
  description: string;
  skill_pool_ids: string[];
  experience: number;
  createdAt: string;
  updatedAt: string;
}

interface Skill {
  _id: string;
  skill_pool_id: {
    _id: string;
    name: string;
    icon: string;
  };
  verified_rating: number;
  level: string;
  best_interview?: string;
  latest_interview_status?: {
    interview_id: string;
    isCompleted: boolean;
  };
}

interface SkillsData {
  mandatory: Skill[];
  optional: Skill[];
  all: Skill[];
  allUserSkills: Skill[];
}

interface GoalsCardProps {
  goal: Goal;
  skillsData: SkillsData;
}

const GoalsCard: React.FC<GoalsCardProps> = ({ goal, skillsData }) => {
  // Filter out the skills that belong to the current goal using the skill_pool_ids
  const goalSkills = skillsData.allUserSkills.filter(skill =>
    goal.skill_pool_ids.includes(skill.skill_pool_id._id)
  );

  return (
    <Card className="w-full my-4">
      <CardHeader>
        <h2 className="text-lg font-bold">{goal.name}</h2>
        <p className="text-sm text-gray-500">{goal.description}</p>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Experience:</strong> {goal.experience} {goal.experience > 1 ? "years" : "year"}
        </p>
        <p>
          <strong>Created At:</strong> {new Date(goal.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Updated At:</strong> {new Date(goal.updatedAt).toLocaleDateString()}
        </p>

        <div className="mt-4">
          <h3 className="text-md font-medium mb-2">Skills</h3>
          {goalSkills.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Icon</TableCell>
                  <TableCell>Skill Name</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Level</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {goalSkills.map(skill => (
                  <TableRow key={skill._id}>
                    <TableCell>
                      <img
                        src={skill.skill_pool_id.icon}
                        alt={skill.skill_pool_id.name}
                        className="w-6 h-6"
                      />
                    </TableCell>
                    <TableCell>{skill.skill_pool_id.name}</TableCell>
                    <TableCell>{skill.verified_rating}</TableCell>
                    <TableCell>{skill.level}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No skills found for this goal.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalsCard;
