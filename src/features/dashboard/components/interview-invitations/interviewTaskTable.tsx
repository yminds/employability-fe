import React from 'react';

const TaskTable = ({ task }: { task: any }) => {
  // Actual task data
  const taskData = task;

  // Prepare tasks for rendering
  const tasks = [
    {
      process: `${taskData.interview_type.type.charAt(0).toUpperCase() + taskData.interview_type.type.slice(1)} Interview`,
      estimatedDuration: taskData.interview_type.estimated_time,
      status: taskData.interview_type.status,
      action: `${taskData.interview_type.status === 'completed' ? 'View Report' : 'Start Interview'}`
    },
    ...taskData.skills.map((skill: any) => ({
      process: skill.name,
      estimatedDuration: skill.estimated_time,
      status: skill.status,
      action: `${skill.status === 'completed' ? 'View Report' : 'Verify Skill'}`
    }))
  ];

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed':
        return 'bg-[#DBFFEA80] text-green-600';
      case 'incomplete':
        return 'bg-[#F0F0F0] text-[#68696B]';
      default:
        return 'bg-gray-500';
    }
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
                <td className={`p-3 border-b text-body2 text-white }`}>
                  <span className={`${getStatusColor(task.status)} rounded-full px-2 py-1 `}>{task.status.charAt(0).toUpperCase() + task.status.slice(1)}</span>
                </td>
                <td className="p-3 border-b text-body2">
                  <button className=" underline">
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