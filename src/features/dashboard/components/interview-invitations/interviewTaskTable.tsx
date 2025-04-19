import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateInterview } from '../../../../hooks/useCreateInterview';
import { useGetFundamentalNamesAsCsvMutation } from '@/api/interviewInvitesApiSlice';
import { useUpdateInterviewIdMutation, useGetCandidateResponseQuery } from '@/api/interviewInvitesApiSlice';
import { useGetUserSkillIdMutation, useCreateUserSkillsMutation } from '@/api/skillsApiSlice';
import ScreeningModal, { ScreeningResponse } from './ScreeningForm';
import { toast } from 'sonner';
import { useSubmitScreeningResponseMutation } from '@/api/InterviewInvitation';

// Removed duplicate definition of ScreeningResponse to avoid conflicts.

const TaskTable: React.FC<{ task: any, jobDescription: any, inviteId: string, user_id: string | undefined, userGoal: string | undefined, companyDetails: any, isScreeningCompleted: boolean, candidateResponse: string | undefined }> = ({ task, jobDescription, inviteId, user_id, userGoal, companyDetails, isScreeningCompleted, candidateResponse }) => {

  const navigate = useNavigate();
  const { createInterview } = useCreateInterview();
  const [getFundamentalNamesAsCsv, { data: conceptNamesCSV }] = useGetFundamentalNamesAsCsvMutation();
  const [updateInterviewId] = useUpdateInterviewIdMutation();
  const [getSkillId] = useGetUserSkillIdMutation();
  const [createUserSkill] = useCreateUserSkillsMutation();
  const [submitScreeningResponse] =
    useSubmitScreeningResponseMutation();
  const { data, isLoading, isError } = useGetCandidateResponseQuery(candidateResponse, {
    skip: !candidateResponse
  })
  console.log({ data, isLoading, isError })

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScreeningForm, setShowScreeningForm] = useState(false);
  // Memoize skill pool IDs
  const skillPoolIds = useMemo(() =>
    jobDescription.skills_required
      .filter((skill: any) => skill.importance === 'Very Important')
      .map((skill: any) => skill.skill),
    [jobDescription.skills_required]
  );
  // console.log("SkillPoolIds for the Very Important Skills", skillPoolIds)

  // Memoize the mutation call
  useMemo(() => {
    // Only call the mutation if we have skill pool IDs
    if (skillPoolIds.length > 0) {
      getFundamentalNamesAsCsv(skillPoolIds);
    }
  }, [skillPoolIds, getFundamentalNamesAsCsv]);

  // Actual task data
  const [taskData] = useState(task);
  // console.log("taskData", taskData)
  // Action text decision function
  const getActionText = (type: string, status: string, isInterviewCompleted: boolean, interviewId: string | undefined) => {
    // console.log(type, status, isInterviewCompleted, interviewId)
    if (status === 'completed') {
      return 'View Report';
    } else if (isInterviewCompleted === false) {
      return 'Resume Interview';
    } else if (type === 'skill' || type === 'task' || type === 'screening') {
      return 'Start Interview';
    } else {
      return 'Unknown Action';
    }
  };

  console.log("candidateResponse", candidateResponse)


  const isScreeningAvailable = jobDescription.screening_questions.length > 0 ? true : false;
  // console.log("jobDescription.screening_questions", jobDescription.screening_questions)
  // console.log("isScreeningAvailable",isScreeningAvailable)

  const screeningTask = {
    process: 'Questionnaire',
    estimatedDuration: '10',
    status: 'incomplete',
    action: `${isScreeningCompleted ? 'View Application' : 'Answer Questions'}`,
    interview_id: '', // no interview id for screening questions
  };

  // Prepare tasks for rendering
  const tasks = [
    {
      process: `${taskData.interview_type.type.charAt(0).toUpperCase() + taskData.interview_type.type.slice(1)} Interview`,
      estimatedDuration: taskData.interview_type.estimated_time,
      status: taskData.interview_type.status,
      action: getActionText('task', taskData.interview_type.status, taskData.interview_type.is_interview_completed, taskData.interview_type.interview_id),
      interview_id: taskData.interview_type.interview_id
    },
    ...taskData.skills.map((skill: any) => ({
      process: skill.name,
      skillId: skill._id,
      estimatedDuration: skill.estimated_time,
      status: skill.status,
      action: getActionText('skill', skill.status, skill.is_interview_completed, skill.interview_id),
      interview_id: skill.interview_id
    })),
    ...(isScreeningAvailable ? [screeningTask] : [])
  ];

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-[#DBFFEA80] text-green-600';
      case 'incomplete':
        return 'bg-[#F0F0F0] text-[#68696B]';
      default:
        return 'bg-gray-500';
    }
  };

  // Start Interview Handler
  const handleStartInterview = async () => {
    // Validate interview status is incomplete
    if (taskData.interview_type.status === 'incomplete') {
      const interviewId = await createInterview({
        title: `${jobDescription.title}`,
        type: `${taskData.interview_type.type === "full" ? 'Full' : 'Screening'}`,
      });
      // console.log("handleStartInterview Passing the updateInterviewId")
      // console.log("inviteId", inviteId)
      // console.log("interviewId", interviewId)
      // console.log("type", taskData.interview_type.type)

      updateInterviewId({
        inviteId: inviteId,
        interviewId: interviewId,
        type: taskData.interview_type.type
      });

      // Start the interview directly if tutorial is disabled
      navigate(`/interview/${interviewId}`, {
        state: {
          title: `${jobDescription.title}`,
          type: `${taskData.interview_type.type === "full" ? 'Full' : 'Screening'}`,
          jobDescription: jobDescription,
          Fundamentals: conceptNamesCSV?.data,
          comanyDetails: companyDetails,
        },
      });

      // console.log("conceptNamesCSV", conceptNamesCSV?.data)
    }
  };


  // Handle user skill logic (fetch or create new user skill)
  const handleUserSkill = async (skillId: string) => {
    let userSkillId: string;

    try {
      const result = await getSkillId({ user_id: user_id, skill_pool_id: skillId }).unwrap();
      userSkillId = result.data.skill_id;
    } catch (error: any) {
      if (error?.status === 404 && error?.data?.message === "User skill not found for the given skill_pool_id") {
        const createResponse = await createUserSkill({
          user_id: user_id,
          goal_id: userGoal,
          skills: [{ skill_pool_id: skillId, self_rating: 0, level: "1" }],
        }).unwrap();
        userSkillId = createResponse.data;
      } else {
        throw error;
      }
    }

    return userSkillId;
  };
  // Generic Resume Interview Handler (for both task and skill)
  const handleResumeInterview = async (type: string, interview_id: string, skillId?: string) => {
    // console.log("type", type);
    // console.log("interview_id", interview_id);
    // console.log("skillId", skillId);
    try {
      if (skillId !== undefined) {
        // Skill Interview
        const skillToVerify = taskData.skills.find((skill: any) => skill._id === skillId);
        if (skillToVerify) {
          const userSkillId = await handleUserSkill(skillId || "");
          navigate(`/interview/${interview_id}`, { state: { title: skillToVerify.name, userSkillId, skillPoolId: skillId, level: "1", type: "Skill", isResume: true } });
        }
      } else {
        // Task Interview (Full/Screening)
        if (taskData.interview_type.status === 'incomplete') {
          navigate(`/interview/${interview_id}`, {
            state: { title: jobDescription.title, type: taskData.interview_type.type === "full" ? 'Full' : 'Screening', jobDescription: jobDescription, isResume: true },
          });
        } else {
          toast.error("Interview already completed or not started yet.");
        }
      }
    } catch (error) {
      console.error("Error resuming interview:", error);
    }
  };

  // Verify Skill Handler
  const handleVerifySkill = async (skillId: string) => {
    const skillToVerify = taskData.skills.find((skill: any) => skill._id === skillId);

    // console.log("skillId", skillId);
    // console.log("skillToVerify", skillToVerify);

    try {
      // // Step 1: Fetch related fundamentals
      // const fundamentalsResponse = await fetchFundamental({
      //   skill_pool_id: skillId,
      //   level: "1",
      // }).unwrap();

      // console.log("fundamental", fundamentalsResponse);
      // setFundamentals(fundamentalsResponse.data[0]?.concepts || []);

      // Step 2: Try to get the user skill ID
      let userSkillId: string;

      try {
        const result = await getSkillId({
          user_id: user_id,
          skill_pool_id: skillId,
        }).unwrap();

        userSkillId = result.data.skill_id;
        // console.log("User SkillId (found)", userSkillId);

      } catch (error: any) {
        if (error?.status === 404 && error?.data?.message === "User skill not found for the given skill_pool_id") {
          console.warn("Skill not found — creating new one...");

          // Step 3: Create a new user skill
          const createResponse = await createUserSkill({
            user_id: user_id,
            goal_id: userGoal,
            skills: [
              {
                skill_pool_id: skillId,
                self_rating: 0,
                level: "1", // or skillToVerify.level if available
              },
            ],
          }).unwrap();

          userSkillId = createResponse.data; // adjust if your API returns a different structure
          // console.log("New User Skill created with ID:", userSkillId);
        } else {
          throw error; // rethrow if it's another kind of error
        }
      }

      // Step 4: You can proceed with interview flow using userSkillId
      const interviewId = await createInterview({
        title: `${skillToVerify.name} Interview`,
        type: "Skill",
        user_skill_id: userSkillId,
        skill_id: skillId,
      });

      // Start the interview directly if tutorial is disabled
      navigate(`/interview/${interviewId}`, {
        state: { title: skillToVerify.name, userSkillId, skillPoolId: skillId, level: "1", type: "Skill" },
      });

    } catch (err) {
      console.error("Error handling skill verification:", err);
    }
  };

  // View Full Report Handler
  const handleViewFullReport = (type: 'interview' | 'skill', itemId: string) => {
    let reportUrl: string;

    // Step 1: Determine the report URL based on the type (interview or skill)
    if (type === 'interview') {
      reportUrl = `/report/Full/${inviteId}/aman7479/${itemId}`; // Example for interview report URL
    } else {
      reportUrl = `/skills-report/aman7479/${itemId}`; // Example for skill report URL
    }

    // Step 3: Open the report URL in a new tab after a short delay
    setTimeout(() => {
      const newTab = window.open(reportUrl, "_blank", "noopener,noreferrer");

      // Optional: Focus on the new tab if it doesn't open automatically
      if (newTab) {
        newTab.focus();
      }
    }, 100); // Adjust delay if necessary
  };

  const handleAnswerApplication = () => {
    setShowScreeningForm(true);
    setIsModalOpen(true);
  };

  const handleScreeningSubmit = async (responses: ScreeningResponse[]) => {
    // console.log("Submitted responses", responses);
    // API call, etc...
    await submitScreeningResponse({ inviteId, responses }).unwrap();
  };

  return (
    <div className="w-full pt-4">
      {showScreeningForm ? (
        <ScreeningModal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false), setShowScreeningForm(false) }}
          questions={jobDescription.screening_questions.map((q: any) => ({
            question_id: q._id,
            question: q.question,
            question_type: q.type,
            options: q.options,
            is_mandatory: q.is_mandatory,
          }))}
          onSubmit={handleScreeningSubmit}
          // responses={candidateResponse} // Previously submitted responses
          // mode={candidateResponse ? "view" : "edit"}
        />
      ) : (
        <div className="border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full border-collapse">
            <thead className="bg-grey-1">
              <tr>
                <th className="p-3 text-body2 text-grey-5 text-left border-b">Interview Process</th>
                <th className="p-3 text-body2 text-grey-5 text-left border-b">Est. Duration</th>
                <th className="p-3 text-body2 text-grey-5 text-left border-b">Status</th>
                <th className="p-3 text-body2 text-grey-5 text-left border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 border-b text-body2">{task.process}</td>
                  <td className="p-3 border-b text-body2">{task.estimatedDuration} Mins</td>
                  <td className={`p-3 border-b text-body2 text-white`}>
                    <span className={`${getStatusColor(task.status)} rounded-full px-2 py-1`}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-3 border-b text-body2">
                    <button
                      className="underline"
                      onClick={() => {
                        if (task.action === 'Answer Questions') {
                          handleAnswerApplication();
                        } else if (task.action === 'Start Interview') {
                          handleStartInterview();
                        } else if (task.action === 'Resume Interview') {
                          handleResumeInterview(task.process.includes('Skill') ? 'skill' : 'task', task.interview_id, task.skillId);
                        } else if (task.action === 'View Report') {
                          handleViewFullReport(task.process.includes('Interview') ? 'interview' : 'skill', task.interview_id);
                        } else if (task.action === 'Verify Skill') {
                          handleVerifySkill(task.skillId);
                        }
                      }}
                    >
                      {task.action}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

};

export default TaskTable;