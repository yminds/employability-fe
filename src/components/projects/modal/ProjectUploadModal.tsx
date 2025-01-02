"use client";

import * as React from "react";
import { Check, ChevronRight, Github, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FormData {
  projectName: string;
  description: string;
  tech: string[];
  files: File[];
  links: string[];
}

interface ProjectUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STEPS = [
  "Enter Project Details",
  "Project Tech",
  "Upload Files & Links",
  "Review Your Project",
];

export function ProjectUploadModal({
  open,
  onOpenChange,
}: ProjectUploadModalProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState<FormData>({
    projectName: "",
    description: "",
    tech: [],
    files: [],
    links: [],
  });
  const [isUploading, setIsUploading] = React.useState(false);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsUploading(false);
    onOpenChange(false); // Close modal on submit
    setCurrentStep(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="text-left">
          <DialogTitle>{STEPS[currentStep]}</DialogTitle>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="relative mb-8 mt-4">
          <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-gray-200" />
          <div
            className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-green-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
          <div className="relative z-10 flex justify-between">
            {STEPS.map((step, index) => (
              <div
                key={step}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-sm font-semibold",
                  index <= currentStep
                    ? "border-green-500 text-green-500"
                    : "text-gray-400"
                )}
              >
                {index < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Project Details */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  placeholder="e.g. Portfolio Website, Expense Tracker App"
                  value={formData.projectName}
                  onChange={(e) =>
                    setFormData({ ...formData, projectName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Briefly describe your project goals, features, and challenges..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          )}

          {/* Step 2: Project Tech */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Pick Your Tech</Label>
                <Input type="search" placeholder="Search..." />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {["React", "Next.js", "TypeScript", "Tailwind CSS"].map(
                  (tech) => (
                    <Button
                      key={tech}
                      variant="outline"
                      className={cn(
                        "justify-start",
                        formData.tech.includes(tech) &&
                          "border-green-500 bg-green-50"
                      )}
                      onClick={() => {
                        const newTech = formData.tech.includes(tech)
                          ? formData.tech.filter((t) => t !== tech)
                          : [...formData.tech, tech];
                        setFormData({ ...formData, tech: newTech });
                      }}
                      type="button"
                    >
                      {tech}
                    </Button>
                  )
                )}
              </div>
            </div>
          )}

          {/* Step 3: Upload Files & Links */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Images & PDFs</Label>
                <div className="rounded-lg border-2 border-dashed p-4">
                  <Input
                    type="file"
                    multiple
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        files: Array.from(e.target.files || []),
                      })
                    }
                    className="cursor-pointer"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Code Files</Label>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" type="button">
                    <Github className="mr-2 h-4 w-4" />
                    Connect GitHub Repository
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">Project Details</h3>
                <p className="text-sm text-gray-500">{formData.projectName}</p>
                <p className="text-sm text-gray-500">{formData.description}</p>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">Files</h3>
                <ul className="space-y-2">
                  {formData.files.map((file) => (
                    <li
                      key={file.name}
                      className="flex items-center text-sm text-gray-500"
                    >
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            {currentStep === STEPS.length - 1 ? (
              <Button type="submit" disabled={isUploading}>
                {isUploading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Publish Project
              </Button>
            ) : (
              <Button type="button" onClick={handleNext}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
