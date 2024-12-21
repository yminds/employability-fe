import { useState } from 'react';
import verifiedImg from '@/assets/skills/verified.svg';
import unverifiedImg from '@/assets/skills/unverifies.svg';

const useSkillStatus = (initialStatus: string) => {
  const [status, setStatus] = useState(initialStatus);

  // Get the corresponding image based on status
  const getStatusImage = () => {
    return status === 'Verified' ? verifiedImg : unverifiedImg;
  };

  // Toggle status (for demonstration purposes)
  const toggleStatus = () => {
    setStatus((prev) => (prev === 'Verified' ? 'Unverified' : 'Verified'));
  };

  return { status, setStatus, getStatusImage, toggleStatus };
};

export default useSkillStatus;
