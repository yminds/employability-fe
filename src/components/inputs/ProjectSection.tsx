import React from "react";
import TextInput from "./TextInput";
import { Button } from "@/components/ui/button";

interface Project {
  name: string;
  description: string;
  technologies: string[];
  link: string;
}

interface ProjectSectionProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const ProjectSection: React.FC<ProjectSectionProps> = ({
  projects,
  setProjects,
}) => {
  const updateProject = (index: number, field: string, value: string) => {
    const updatedProjects = [...projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setProjects(updatedProjects);
  };

  const addProject = () => {
    setProjects([
      ...projects,
      { name: "", description: "", technologies: [], link: "" },
    ]);
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-4">Projects</h3>
      {projects.map((project, index) => (
        <div key={index} className="mb-4 p-4 border border-gray-300 rounded">
          <TextInput
            label="Project Name"
            value={project.name}
            onChange={(e) => updateProject(index, "name", e.target.value)}
          />
          <TextInput
            label="Description"
            value={project.description}
            onChange={(e) =>
              updateProject(index, "description", e.target.value)
            }
          />
          <TextInput
            label="Technologies"
            value={project.technologies.join(", ")}
            onChange={(e) =>
              updateProject(index, "technologies", e.target.value.split(", "))
            }
          />
          <TextInput
            label="Project Link"
            value={project.link}
            onChange={(e) => updateProject(index, "link", e.target.value)}
          />
          {/* Use ShadCN Button for "Remove Project" */}
          <Button
            onClick={() => removeProject(index)}
            variant="destructive"
            size="sm"
            className="mt-2"
          >
            Remove Project
          </Button>
        </div>
      ))}
      {/* Use ShadCN Button for "Add Project" */}
      <Button onClick={addProject} variant="default">
        Add Project
      </Button>
    </div>
  );
};

export default ProjectSection;
