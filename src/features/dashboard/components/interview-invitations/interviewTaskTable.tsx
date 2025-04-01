import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateInterview } from '../../../../hooks/useCreateInterview';
import { useGetFundamentalNamesAsCsvMutation } from '@/api/interviewInvitesApiSlice';
import { useUpdateInterviewIdMutation } from '@/api/interviewInvitesApiSlice';
import { useGetUserSkillIdMutation, useCreateUserSkillsMutation } from '@/api/skillsApiSlice';

const TaskTable: React.FC<{ task: any, jobDescription: any, inviteId: string, user_id:string | undefined, userGoal:string | undefined }> = ({ task, jobDescription, inviteId, user_id, userGoal }) => {
  const navigate = useNavigate();
  const { createInterview } = useCreateInterview();
  const [getFundamentalNamesAsCsv, { data: conceptNamesCSV }] = useGetFundamentalNamesAsCsvMutation();
  const [updateInterviewId] = useUpdateInterviewIdMutation();
  const [getSkillId] = useGetUserSkillIdMutation();
  const [createUserSkill] = useCreateUserSkillsMutation();

  // Memoize skill pool IDs
  const skillPoolIds = useMemo(() =>
    jobDescription.skills_required.map((skill: any) => skill.skill),
    [jobDescription.skills_required]
  );

  // Memoize the mutation call
  useMemo(() => {
    // Only call the mutation if we have skill pool IDs
    if (skillPoolIds.length > 0) {
      getFundamentalNamesAsCsv(skillPoolIds);
    }
  }, [skillPoolIds, getFundamentalNamesAsCsv]);

  // Actual task data
  const [taskData, setTaskData] = useState(task);

  // Prepare tasks for rendering
  const tasks = [
    {
      process: `${taskData.interview_type.type.charAt(0).toUpperCase() + taskData.interview_type.type.slice(1)} Interview`,
      estimatedDuration: taskData.interview_type.estimated_time,
      status: taskData.interview_type.status,
      action: `${taskData.interview_type.status === 'completed' ? 'View Report' : 'Start Interview'}`,
      interview_id: taskData.interview_type.interview_id
    },
    ...taskData.skills.map((skill: any) => ({
      process: skill.name,
      skillId: skill._id,
      estimatedDuration: skill.estimated_time,
      status: skill.status,
      action: `${skill.status === 'completed' ? 'View Report' : 'Verify Skill'}`,
      interview_id : skill.interview_id
    }))
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
        type: "Job",
      });

      updateInterviewId({
        inviteId: inviteId,
        interviewId: interviewId,
        type: taskData.interview_type.type
      });

      // Start the interview directly if tutorial is disabled
      navigate(`/interview/${interviewId}`, {
        state: {
          title: `${jobDescription.title}`,
          type: 'Job',
          jobDescription: jobDescription,
          Fundamentals: conceptNamesCSV?.data
        },
      });

      console.log("conceptNamesCSV", conceptNamesCSV?.data)
    }
  };

  // Verify Skill Handler
  const handleVerifySkill = async (skillId: string) => {
    const skillToVerify = taskData.skills.find((skill: any) => skill._id === skillId);

    console.log("skillId", skillId);
    console.log("skillToVerify", skillToVerify);

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
        console.log("User SkillId (found)", userSkillId);

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
                self_rating: null,
                level: "1", // or skillToVerify.level if available
              },
            ],
          }).unwrap();

          userSkillId = createResponse.data; // adjust if your API returns a different structure
          console.log("New User Skill created with ID:", userSkillId);
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
        state: { title: skillToVerify.name, userSkillId, skillPoolId:skillId, level:"1", type: "Skill" },
      });

    } catch (err) {
      console.error("Error handling skill verification:", err);
    }
  };

  // View Full Report Handler
  const handleViewFullReport = (type: 'interview' | 'skill', itemId: string) => {
    console.log(type,itemId)
    if (type === 'interview') {
      navigate(`/skill/report/Job/${taskData.interview_type.interview_id}`, {
        state: { best_interview: itemId },
      });
    } else if (type === 'skill') {
      // Find specific skill report
      const skillReport = taskData.skills.find((skill: any) => skill.id === itemId);
      handleVerifySkillReport(itemId)
      if (skillReport) {
        // Potential future implementation for skill report navigation
        console.log('Viewing skill report:', skillReport.name);
      }
    }
  };

  // Verify Skill Report Handler
  const handleVerifySkillReport = (interviewId: string) => {
    console.log("skillId",interviewId)
    navigate(`/skill/report/${interviewId}`, {
      state: { best_interview: interviewId },
    });
  };

  return (
    <div className="w-full pt-4">
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
                      console.log(task)
                      if (task.action === 'Start Interview') {
                        handleStartInterview();
                      } else if (task.action === 'Verify Skill') {
                        handleVerifySkill(task.skillId);
                      } else if (task.action === 'View Report') {
                        handleViewFullReport(
                          task.process.includes('Interview') ? 'interview' : 'skill',
                          task.interview_id
                        );
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
    </div>
  );
};

export default TaskTable;