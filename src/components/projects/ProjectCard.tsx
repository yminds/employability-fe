import React from "react";

interface Skill {
  _id: string;
  name: string;
  description: string;
  icon?: string;
}

interface ProjectCardProps {
  project: {
    _id: string;
    projectName: string;
    description: string;
    skills: Skill[];
    githubLink: string;
    liveLink: string;
    thumbnail?: string;
    isVerified?: boolean;
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  // Show first 5 skills and hide the rest
  const visibleSkills = project.skills.slice(0, 5);
  const remainingSkills = project.skills.length - 5;

  // Placeholder value for demo purposes
  const rating = 9.4;

  return (
    <div className="flex flex-col gap-4 w-full p-6 bg-white rounded-md border border-gray-100">
      {/* Main Row */}
      <div className="flex items-center gap-6">
        {/* Column 1: Thumbnail (only rendered if thumbnail exists) */}
        {project.thumbnail && (
          <div className="w-[120px] h-[90px] flex-shrink-0">
            <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={project.thumbnail}
                alt={`${project.projectName} Thumbnail`}
                className="absolute w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-black/80 border-b-[6px] border-b-transparent ml-1"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Column 2: Title and Skills */}
        <div className="flex-1">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            {project.projectName}
          </h2>
          <div className="flex flex-wrap gap-2">
            {visibleSkills.map((skill) => (
              <span
                key={skill._id}
                className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm"
              >
                {skill.name}
              </span>
            ))}
            {remainingSkills > 0 && (
              <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">
                +{remainingSkills}
              </span>
            )}
          </div>
        </div>

        {/* Column 3: Rating and Verification Status */}
        <div className="flex flex-col items-center">
          {project.isVerified ? (
            <>
              <div className="flex items-center gap-1">
                <span className="text-xl font-semibold">{rating}</span>
                <span className="text-gray-500">/10</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-full h-full text-green-500"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <span className="text-green-500 text-sm">Verified</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="text-orange-500"
              >
                <path
                  d="M7.33333 4H8.66667V5.33333H7.33333V4ZM7.33333 6.66667H8.66667V12H7.33333V6.66667ZM8 0.666667C4 0.666667 0.666667 4 0.666667 8C0.666667 12 4 15.3333 8 15.3333C12 15.3333 15.3333 12 15.3333 8C15.3333 4 12 0.666667 8 0.666667ZM8 14C4.68667 14 2 11.3133 2 8C2 4.68667 4.68667 2 8 2C11.3133 2 14 4.68667 14 8C14 11.3133 11.3133 14 8 14Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-orange-500 text-sm">Unverified</span>
            </div>
          )}
        </div>

        {/* Column 4: Improve Score or View Project (link) */}
        <div className="flex items-center">
          {project.isVerified ? (
            <button className="text-blue-500 text-sm hover:underline whitespace-nowrap">
              Improve score
            </button>
          ) : (
            <button className="text-blue-500 text-sm hover:underline whitespace-nowrap">
              View Project
            </button>
          )}
        </div>

        {/* Column 5: View Project or Verify (button) */}
        <div className="flex items-center">
          {project.isVerified ? (
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 whitespace-nowrap">
              View Project
            </button>
          ) : (
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 whitespace-nowrap">
              Verify
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed">
        {project.description}
      </p>

      {/* Links */}
      <div className="flex gap-4">
        <a
          href={project.githubLink}
          className="text-gray-500 text-sm hover:text-gray-700"
        >
          View GIT repo
        </a>
        <a
          href={project.liveLink}
          className="text-gray-500 text-sm hover:text-gray-700"
        >
          Live link
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
