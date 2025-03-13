import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface ScreeningQuestion {
  question: string;
  type: "multiple_choice" | "yes_no" | "text" | "numeric";
  options?: string[];
  is_mandatory: boolean;
  is_eliminatory: boolean;
  ideal_answer?: string;
  customField?: string;
  customFieldValue?: string;
}

interface ScreeningQuestionsFormProps {
  screeningQuestions: ScreeningQuestion[];
  setScreeningQuestions: (questions: ScreeningQuestion[]) => void;
}

const ScreeningQuestionsForm: React.FC<ScreeningQuestionsFormProps> = ({
  screeningQuestions,
  setScreeningQuestions,
}) => {
  const [customQuestionMode, setCustomQuestionMode] = useState(false);
  const [customQuestion, setCustomQuestion] = useState({
    question: "",
    type: "yes_no" as "yes_no" | "numeric",
    is_mandatory: true,
    is_eliminatory: false,
    ideal_answer: "Yes",
    customField: "",
    customFieldValue: "",
    options: [] as string[],
  });

  // Question templates
  const questionTemplates = [
    {
      id: "background-check",
      label: "Background Check",
      question: "Are you willing to undergo a background check, in accordance with local law/regulations?",
      type: "yes_no" as const,
    },
    {
      id: "drivers-license",
      label: "Driver's License",
      question: "Do you have a valid driver's license?",
      type: "yes_no" as const,
    },
    {
      id: "drug-test",
      label: "Drug Test",
      question: "Are you willing to take a drug test, in accordance with local law/regulations?",
      type: "yes_no" as const,
    },
    {
      id: "education",
      label: "Education",
      question: "Have you completed the following level of education: [Degree]?",
      type: "yes_no" as const,
      hasCustomField: true,
      customFieldName: "Degree",
    },
    {
      id: "expertise",
      label: "Experience with Skill",
      question: "How many years of work experience do you have with [Skill]?",
      type: "numeric" as const,
      hasCustomField: true,
      customFieldName: "Skill",
    },
    {
      id: "hybrid-work",
      label: "Hybrid Work",
      question: "Are you comfortable working in a hybrid setting?",
      type: "yes_no" as const,
    },
    {
      id: "industry-exp",
      label: "Industry Experience",
      question: "How many years of [Industry] experience do you currently have?",
      type: "numeric" as const,
      hasCustomField: true,
      customFieldName: "Industry",
    },
    {
      id: "language",
      label: "Language",
      question: "What is your level of proficiency in [Language]?",
      type: "multiple_choice" as const,
      hasCustomField: true,
      customFieldName: "Language",
      options: ["None", "Conversational", "Professional", "Native or bilingual"],
    },
    {
      id: "location",
      label: "Location",
      question: "Are you comfortable commuting to this job's location?",
      type: "yes_no" as const,
    },
    {
      id: "onsite-work",
      label: "Onsite Work",
      question: "Are you comfortable working in an onsite setting?",
      type: "yes_no" as const,
    },
    {
      id: "remote-work",
      label: "Remote Work",
      question: "Are you comfortable working in a remote setting?",
      type: "yes_no" as const,
    },
    {
      id: "urgent-hiring",
      label: "Urgent Hiring Need",
      question: "We must fill this position urgently. Can you start immediately?",
      type: "yes_no" as const,
    },
    {
      id: "work-exp",
      label: "Work Experience",
      question: "How many years of [Job Function] experience do you currently have?",
      type: "numeric" as const,
      hasCustomField: true,
      customFieldName: "Job Function",
    },
  ];

  // Handle adding predefined questions
  const handleAddPredefinedQuestion = (templateId: string) => {
    if (customQuestionMode) {
      setCustomQuestionMode(false);
    }

    const template = questionTemplates.find((t) => t.id === templateId);
    if (!template) return;

    // Avoid adding duplicates
    const exists = screeningQuestions.some((q) => q.question === template.question);
    if (exists) return;

    const newScreeningQuestion: ScreeningQuestion = {
      question: template.question,
      type: template.type,
      is_mandatory: true,
      is_eliminatory: false,
      ideal_answer:
        template.type === "yes_no"
          ? "Yes"
          : template.type === "numeric"
          ? "1"
          : template.type === "multiple_choice" && template.options
          ? "Conversational"
          : undefined,
      options: template.type === "multiple_choice" ? template.options : undefined,
      customField: template.hasCustomField ? template.customFieldName : undefined,
      customFieldValue: "",
    };

    setScreeningQuestions([...screeningQuestions, newScreeningQuestion]);
  };

  // Handle adding custom questions
  const handleAddCustomQuestion = () => {
    if (!customQuestion.question.trim()) return;

    // Create new question object
    const newScreeningQuestion: ScreeningQuestion = {
      ...customQuestion,
      options: undefined, // Not needed for yes/no or numeric
    };

    // Add to the list
    setScreeningQuestions([...screeningQuestions, newScreeningQuestion]);

    // Reset
    setCustomQuestion({
      question: "",
      type: "yes_no",
      is_mandatory: true,
      is_eliminatory: false,
      ideal_answer: "Yes",
      customField: "",
      customFieldValue: "",
      options: [],
    });
    setCustomQuestionMode(false);
  };

  const handleCancelCustomQuestion = () => {
    setCustomQuestionMode(false);
    setCustomQuestion({
      question: "",
      type: "yes_no",
      is_mandatory: true,
      is_eliminatory: false,
      ideal_answer: "Yes",
      customField: "",
      customFieldValue: "",
      options: [],
    });
  };

  const toggleCustomQuestionMode = () => {
    setCustomQuestionMode(!customQuestionMode);
  };

  const handleRemoveQuestion = (index: number) => {
    const updated = [...screeningQuestions];
    updated.splice(index, 1);
    setScreeningQuestions(updated);
  };

  const toggleQuestionEliminatory = (index: number) => {
    const updated = [...screeningQuestions];
    updated[index].is_eliminatory = !updated[index].is_eliminatory;
    setScreeningQuestions(updated);
  };

  // Replace placeholders like [Skill], [Industry], etc.
  const getFormattedQuestion = (question: ScreeningQuestion) => {
    if (!question.customField || !question.customFieldValue) return question.question;
    return question.question.replace(`[${question.customField}]`, question.customFieldValue);
  };

  // Get IDs of question templates already added
  const getAddedQuestionTemplateIds = () => {
    return screeningQuestions
      .map((q) => {
        const template = questionTemplates.find((t) => t.question === q.question);
        return template ? template.id : null;
      })
      .filter((id) => id !== null) as string[];
  };

  const addedQuestionIds = getAddedQuestionTemplateIds();

  return (
    <div>
      <h3 className="text-lg font-medium">Applicant questions</h3>
      <p className="text-sm text-gray-500 mb-4">
        We recommend adding 3 or more questions. Applicants must answer each question.
      </p>

      {/* Existing questions list */}
      <div className="space-y-3 mb-4">
        {screeningQuestions.map((question, index) => (
          <div
            key={index}
            className="border border-gray-300 bg-[#fafbfe] rounded-md overflow-hidden"
          >
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div className="font-medium pr-8">{getFormattedQuestion(question)}</div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-700"
                  onClick={() => handleRemoveQuestion(index)}
                >
                  <X size={18} />
                </Button>
              </div>

              {/* customField input */}
              {question.customField && (
                <div className="mt-3">
                  <Label className="text-sm mb-1 flex items-center">
                    {question.customField}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    value={question.customFieldValue || ""}
                    onChange={(e) => {
                      const updated = [...screeningQuestions];
                      updated[index].customFieldValue = e.target.value;
                      setScreeningQuestions(updated);
                    }}
                    className="border border-gray-300 rounded-md"
                    placeholder={question.customField}
                  />
                </div>
              )}

              {/* ideal_answer + must-have */}
              <div className="flex justify-between items-center mt-3">
                <div className="flex-grow text-sm text-gray-600">
                  {question.type === "yes_no" && (
                    <div>
                      <span className="font-medium">Ideal answer:</span> Yes
                    </div>
                  )}
                  {question.type === "numeric" && (
                    <div className="flex items-center">
                      <span className="font-medium mr-1">Ideal answer (minimum):</span>
                      <Input
                        type="number"
                        value={question.ideal_answer || "1"}
                        onChange={(e) => {
                          const updated = [...screeningQuestions];
                          updated[index].ideal_answer = e.target.value;
                          setScreeningQuestions(updated);
                        }}
                        className="ml-1 w-16 h-8 text-sm p-1 border border-gray-300 rounded-md"
                        min="0"
                      />
                    </div>
                  )}
                  {question.type === "multiple_choice" && question.options && (
                    <div>
                      <span className="font-medium">Ideal answer:</span>{" "}
                      {question.ideal_answer || "Conversational"}
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  <Checkbox
                    id={`must-have-${index}`}
                    checked={question.is_eliminatory}
                    onCheckedChange={() => toggleQuestionEliminatory(index)}
                    className="mr-2 h-5 w-5 border-2 rounded"
                  />
                  <Label htmlFor={`must-have-${index}`} className="text-sm cursor-pointer">
                    Must-have qualification
                  </Label>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Custom Question Form */}
        {customQuestionMode && (
          <div className="border border-gray-300 bg-[#fafbfe] rounded-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="font-medium">Write a custom screening question</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancelCustomQuestion}
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </Button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <Label className="text-sm font-medium mb-1 block">
                  Question <span className="text-red-500 ml-1">*</span>
                </Label>
                <Textarea
                  value={customQuestion.question}
                  onChange={(e) =>
                    setCustomQuestion({ ...customQuestion, question: e.target.value })
                  }
                  placeholder="e.g. 'Will you be able to bring your own device?'"
                  className="w-full border border-gray-300 rounded-md"
                  rows={2}
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {customQuestion.question.length}/200
                </div>
              </div>

              <div className="flex space-x-4 mb-4">
                <div className="w-1/2">
                  <Label className="text-sm mb-1 block">Response type:</Label>
                  <Select
                    value={customQuestion.type}
                    onValueChange={(val) =>
                      setCustomQuestion({
                        ...customQuestion,
                        type: val as "yes_no" | "numeric",
                      })
                    }
                  >
                    <SelectTrigger className="border border-gray-300 rounded-md">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes_no">Yes / No</SelectItem>
                      <SelectItem value="numeric">Numeric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {customQuestion.type === "yes_no" && (
                  <div className="w-1/2">
                    <Label className="text-sm mb-1 block">Ideal answer:</Label>
                    <Input
                      value="Yes"
                      disabled
                      className="border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                )}
                {customQuestion.type === "numeric" && (
                  <div className="w-1/2">
                    <Label className="text-sm mb-1 block">Ideal answer (min):</Label>
                    <Input
                      type="number"
                      value={customQuestion.ideal_answer || "1"}
                      onChange={(e) =>
                        setCustomQuestion({
                          ...customQuestion,
                          ideal_answer: e.target.value,
                        })
                      }
                      className="border border-gray-300 rounded-md"
                      min="0"
                    />
                  </div>
                )}
              </div>

              {customQuestion.type === "numeric" && (
                <div className="mb-4">
                  <Label className="text-sm mb-1 block">
                    Field Name (e.g. Skill, Industry, Job Function):
                  </Label>
                  <Input
                    value={customQuestion.customField || ""}
                    onChange={(e) =>
                      setCustomQuestion({ ...customQuestion, customField: e.target.value })
                    }
                    className="border border-gray-300 rounded-md"
                    placeholder="Skill or Job Function"
                  />
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Checkbox
                    id="must-have-qualification"
                    checked={customQuestion.is_eliminatory}
                    onCheckedChange={(checked) =>
                      setCustomQuestion({ ...customQuestion, is_eliminatory: !!checked })
                    }
                    className="h-5 w-5 rounded border-2 mr-2"
                  />
                  <Label htmlFor="must-have-qualification" className="text-sm cursor-pointer">
                    Must-have qualification
                  </Label>
                </div>
                <div className="flex">
                  <Button
                    type="button"
                    variant="outline"
                    className="mr-2 border border-gray-300"
                    onClick={handleCancelCustomQuestion}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleAddCustomQuestion}
                    disabled={!customQuestion.question.trim()}
                    className="bg-green-600 hover:bg-green-700 text-white border-none"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Predefined question templates */}
      <div>
        <div className="flex flex-wrap gap-2 mb-2">
          {questionTemplates.map((template) => {
            if (template.id === "visa-status" || template.id === "work-auth") {
              return null; // Skip these
            }
            const isAdded = addedQuestionIds.includes(template.id);
            if (isAdded) {
              return (
                <Button
                  key={template.id}
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled
                  className="flex items-center opacity-60 bg-gray-100 "
                >
                  <span className="w-4 h-4 mr-1 text-green-600">✓</span>
                  {template.label}
                </Button>
              );
            }
            return (
              <Button
                key={template.id}
                type="button"
                variant="outline"
                size="sm"
                className="flex items-center text-gray-500"
                onClick={() => handleAddPredefinedQuestion(template.id)}
              >
                <Plus className="w-4 h-4 mr-1" />
                {template.label}
              </Button>
            );
          })}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={`flex items-center text-gray-500 ${customQuestionMode ? "bg-gray-100" : ""}`}
          onClick={toggleCustomQuestionMode}
          disabled={customQuestionMode}
        >
          {customQuestionMode ? (
            <span className="w-4 h-4 mr-1 text-green-600">✓</span>
          ) : (
            <Plus className="w-4 h-4 mr-1" />
          )}
          Custom Question
        </Button>
      </div>
    </div>
  );
};

export default ScreeningQuestionsForm;