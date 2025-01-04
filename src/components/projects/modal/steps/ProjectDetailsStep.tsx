// components/ProjectUploadModal/steps/ProjectDetailsStep.tsx

"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProjectDetailsStepProps {
  projectName: string;
  description: string;
  onChange: (field: string, value: string) => void;
}

const ProjectDetailsStep: React.FC<ProjectDetailsStepProps> = ({
  projectName,
  description,
  onChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="projectName">Project Name</Label>
        <Input
          id="projectName"
          placeholder="e.g. Portfolio Website, Expense Tracker App"
          value={projectName}
          onChange={(e) => onChange("projectName", e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Briefly describe your project goals, features, and challenges..."
          value={description}
          onChange={(e) => onChange("description", e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default ProjectDetailsStep;
