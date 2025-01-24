import React, { useEffect, useState } from 'react';
import { useGetSkillSuggestionsMutation } from "@/api/skillSuggestionsApiSlice"
import { useCreateUserSkillsMutation, useGetUserSkillsMutation } from '@/api/skillsApiSlice';
import AddSkillsModal from './addskills';
import Skeleton from 'react-loading-skeleton';

interface SuggestedSkillsProps {
  userId: string | undefined
  goalId: string | null;
  onSkillsUpdate: (isUpdated: boolean) => void;
  isSkillsUpdated:boolean
}

interface Skills {
  skill_Id: string;
  name: string;
  rating: string;
  level: string;
  visibility: string;
}


const SuggestedSkills: React.FC<SuggestedSkillsProps> = ({ userId, goalId, onSkillsUpdate, isSkillsUpdated }) => {
  const [getUserSkills, { data: userSkills }] = useGetUserSkillsMutation();
  const [getSuggestedSkills] = useGetSkillSuggestionsMutation();
  
  const [suggestedSkillsData, setSuggestedSkillsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if ( userId && goalId ) {
      fetchData();
    }
  }, [userId, goalId]);

  useEffect(() => {
    if ( isSkillsUpdated ) {
      fetchData();
    }
  }, [ isSkillsUpdated]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Separate fetch calls
      const userSkills = await getUserSkills({ userId, goalId }).unwrap();
      const allSkillNames = getSkillNames(userSkills.data.all);

      const suggestedSkills = await getSuggestedSkills({ query:allSkillNames }).unwrap();
      setSuggestedSkillsData(suggestedSkills);
    } catch (err) {
      console.error('Error fetching skills:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const [skills] = useState<Skills[]>([
    {
      skill_Id: "",
      name: "",
      rating: "0",
      level: "1", 
      visibility: "All users",
    },
  ]);

  const getSkillNames = (skills: any[]) => {
    return skills.map(skill => skill.skill_pool_id.name).join(',');
   };

  const [showAll, setShowAll] = useState(false);

  const displayedSkills = showAll ? suggestedSkillsData : suggestedSkillsData.slice(0, 3);

  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal
  const [selectedSkills, setSelectedSkills] = useState<any[]>([]);
  const handleOpenModal = (skill: any) => {
    setSelectedSkills([skill]); // Set the selected skill to prefill
    setIsModalOpen(true); // Open the modal
  };    
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSkills([]);
  };


  if (isLoading) {
    return (
      <div className='sm:max-w-[90vw] overflow-auto'>
        <section className="p-6 bg-white rounded-lg sm:flex sm:flex-col sm:items-start sm:w-[68vw] sm:p-4">
          <div className="flex justify-between items-start mb-6 w-full sm:max-w-[90vw]">
            <Skeleton width={200} height={30} />
            <Skeleton width={100} height={20} />
          </div>
          <div className="flex flex-wrap gap-4">
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg flex-1 flex-col space-y-4 min-w-[230px]"
              >
                <div className="flex items-center space-x-3">
                  <Skeleton circle width={42} height={42} />
                  <Skeleton width={150} height={20} />
                </div>
                <Skeleton count={2} />
                <Skeleton width={100} height={20} />
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className='sm:max-w-[90vw] overflow-auto'>
      <section className="p-6 bg-white rounded-lg sm:flex sm:flex-col sm:items-start sm:w-[68vw] sm:p-4">
        <div className="flex justify-between items-start mb-6 w-full sm:max-w-[90vw]">
          <h2 className="text-[20px] font-medium leading-[26px] sm:text-sm">
            Suggested Skills ({suggestedSkillsData?.length || 0})
          </h2>
          <button
            className="text-[14px] text-green-600 font-medium hover:underline"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : 'View All →'}
          </button>
        </div>
        <div className="flex flex-wrap gap-4">
          {displayedSkills?.map((skill, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-lg flex-1 flex-col space-y-4 min-w-[230px]"
            >
              <div className="flex items-center space-x-3">
                <div className="w-[42px] h-[42px] rounded-full flex justify-center items-center bg-white">
                  <img src={skill?.icon} alt={skill?.name} className="w-[22px] h-[22px]" />
                </div>
                <h3 className="text-[16px] font-medium text-gray-800">{skill?.name}</h3>
              </div>
              <p className="text-[14px] text-gray-600 leading-[20px]">{skill?.description}</p>
              <button
                className="text-[14px] text-left text-green-600 font-medium hover:text-green-700 hover:underline"
                onClick={() => handleOpenModal(skill)}
              >
                Add Skill
              </button>
            </div>
          ))}
        </div>
      </section>


      {/* AddSkillsModal Component */}
      {isModalOpen && (
        <AddSkillsModal
            userId={userId}
            goalId={goalId}
            onClose={handleCloseModal}
            onSkillsUpdate={onSkillsUpdate} goals={undefined}
            prefillSkills={selectedSkills}
        />
      )}
    </div>
  );
};

export default SuggestedSkills;