import React, { useEffect, useState } from 'react';
import SkillCard from '@/components/cards/skills/skillsCard';
import { useGetUserSkillsMutation } from '@/api/skillsApiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import search from '@/assets/skills/search.svg';

interface SkillPoolId {
  _id: string;
  name: string;
  icon?: string;
}

interface Skill {
  _id: string;
  skill_pool_id: SkillPoolId;
  verified_rating: number;
  self_rating: number | null;
  level?:string;
}

interface SkillListProps {
  isDashboard: boolean;
  goalId: string | null;
  isSkillsUpdated?: boolean;
}

type SkillCategory = 'mandatory' | 'optional' | 'all';

const SkillList: React.FC<SkillListProps> = ({ isDashboard, goalId ,isSkillsUpdated}) => {
  const navigate = useNavigate();
  const userId = useSelector((state: RootState) => state.auth.user?._id);

  const [getUserSkills, { data: skillsData, isLoading, isError }] =
    useGetUserSkillsMutation();

  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);

  useEffect(() => {
    if (userId && goalId) {
      fetchSkills(userId, goalId);
    }
  }, [userId, goalId]);

  useEffect(() => {
    if (skillsData?.data) {
      const selectedSkills = getSelectedSkills();
      const filtered = selectedSkills.filter((skill) =>
        skill.skill_pool_id.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSkills(filtered);
    }
  }, [searchQuery, skillsData, selectedCategory]);

  const fetchSkills = async (userId: string | undefined, goalId: string|null) => {
    try {
      await getUserSkills({ userId, goalId }).unwrap();
    } catch (err) {
      console.error('Error fetching skills:', err);
    }
  };

  const handleCategorySelect = (category: SkillCategory) => {
    setSelectedCategory(category);
  };

  const renderSkillChips = () => {
    if (isDashboard) return null;

    const categories = [
      { id: 'all', label: `All` },
      {
        id: 'mandatory',
        label: `Mandatory`,
      },
      {
        id: 'optional',
        label: `Added by you`,
      },
    ];

    useEffect(() => {
      if (isSkillsUpdated) {
        fetchSkills(userId, goalId);
      }
    }, [isSkillsUpdated]);

    return (
      <div className="flex gap-1 items-center mb-4 sm:max-w-[280px] sm:flex sm:flex-col-reverse sm:items-start md:items-start">
        <div className=' sm:flex h-[46px]'>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id as SkillCategory)}
              className={`px-4 py-2 rounded-[3px] text-sm font-normal transition-all sm:px-2 sm:py-2
                ${
                  selectedCategory === category.id
                    ? 'bg-[#001630] text-white hover:bg-[#062549]'
                    : 'text-gray-600'
                }`}
            >
              {category.label}
            </button>
          ))}          
        </div>

        <div className="flex items-center ml-auto sm:ml-0">
          <div className="relative w-64 sm:max-w-[200px]">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-[#D6D7D9] rounded-[6px] px-4 py-2 pl-10 text-sm w-full focus:outline-none  "
            />
            <div className="absolute inset-y-0 left-3 flex items-center">
              <img src={search} alt="Search Icon" className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLoadingSkeleton = () => (
    <div>
      <div className="flex items-center justify-between w-full bg-white p-4 rounded-md  border-gray-200">
        {/* Icon Skeleton */}
        <div className="flex items-center">
          <Skeleton circle={true} height={40} width={40} className="mr-4" />
          <div>
            {/* Skill Name Skeleton */}
            <Skeleton height={16} width={100} className="mb-2" />
            {/* Self-Rating Skeleton */}
            <Skeleton height={12} width={80} />
          </div>
        </div>
        <div>
          {/* Status Skeleton */}
          <Skeleton height={16} width={120} />
        </div>
        {/* Status and Buttons Skeleton */}
        <div className="flex items-center gap-4">
          {/* Buttons Skeleton */}
          <div className="flex gap-2">
            <Skeleton height={30} width={100} />
            <Skeleton height={30} width={100} />
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center ">
        <Skeleton height={1} width={720} />
      </div>
    </div>
  );

  const renderSkills = (skills: Skill[]) => {
    const displaySkills = isDashboard ? skills.slice(0, 5) : skills;
    console.log(displaySkills)

    return displaySkills.length > 0 ? (
      <>
      <div className=" scroll-smooth pr-2 snap-y snap-proximity minimal-scrollbar sm:min-w-[290px]">
        {displaySkills.map((skill: Skill, index: number) => (
          <React.Fragment key={skill._id}>
            <SkillCard
              key={skill._id}
              skillId={skill._id}
              skill={skill.skill_pool_id.name}
              skillImg={skill.skill_pool_id.icon as string}
              verified_rating={skill.verified_rating}
              selfRating={skill.self_rating ?? 0}
              initialStatus={
                skill.verified_rating > 0 ? 'Verified' : 'Unverified'
              }
              level={skill.level}
            />
            {index < displaySkills.length - 1 && (
              <div className="w-full h-[1px] my-6 bg-[#E0E0E0]" />
            )}
          </React.Fragment>
        ))}
      </div>      
      </>

    ) : (
      <div className="text-gray-500 text-center py-4">
        No skills found
      </div>
    );
  };

  const getSelectedSkills = () => {
    if (!skillsData?.data) return [];
  
    let selectedSkills: Skill[] = [];
  
    // Filter skills based on the selected category
    switch (selectedCategory) {
      case 'mandatory':
        selectedSkills = skillsData.data?.mandatory || [];
        break;
      case 'optional':
        selectedSkills = skillsData.data?.optional || [];
        break;
      case 'all':
      default:
        selectedSkills = skillsData.data?.all || [];
        break;
    }
  
    // Split the selected skills into unverified and verified
    const unverifiedSkills = selectedSkills.filter((skill) => skill.verified_rating === 0);
    const verifiedSkills = selectedSkills.filter((skill) => skill.verified_rating > 0);
  
    // Ensure the first skill is unverified, followed by verified and remaining unverified
    return [...unverifiedSkills.slice(0, 1), ...verifiedSkills, ...unverifiedSkills.slice(1)];
  };
  

  return (
    <section className="w-full flex flex-col rounded-[8px] items-center bg-white justify-center p-[42px] mb-4  overflow-x-auto scrollbar-hide">
      <div className="w-full h-full bg-white flex flex-col rounded-t-[8px]">
        {isDashboard ? (
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-gray-900 text-base font-medium leading-5">
              Skills ({skillsData?.data?.all.length || 0})
            </h2>
            <button
              className="px-4 py-0 text-sm font-medium rounded-md text-[#001630] underline"
              onClick={() => navigate('/skills')}
            >
              View All
            </button>
          </div>
        ) : null}

        {renderSkillChips()}

        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div key={index}>{renderLoadingSkeleton()}</div>
            ))
          : renderSkills(filteredSkills)}
      </div>
    </section>
  );
};

export default SkillList;
