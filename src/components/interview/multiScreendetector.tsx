import { useState, useEffect } from 'react';
import { Alert } from '@/components/ui/alert';

interface MultiScreenDetectorProps {
  onScreenCountChange: (count: number) => void;
}

const MultiScreenDetector: React.FC<MultiScreenDetectorProps> = ({ onScreenCountChange }) => {
  const [screenCount, setScreenCount] = useState<number>(1);
  const [permissionRequested, setPermissionRequested] = useState<boolean>(false);

  // Accurate detection using getScreenDetails
  const detectScreens = async () => {
    if ('getScreenDetails' in window) {
      try {
        const screenDetails = await (window as any).getScreenDetails();
        setScreenCount(screenDetails.screens.length);
        onScreenCountChange(screenDetails.screens.length);

        // Monitor future screen changes
        screenDetails.addEventListener('screenschange', () => {
          setScreenCount(screenDetails.screens.length);
          onScreenCountChange(screenDetails.screens.length);
        });
      } catch (error) {
        console.error('Error accessing screen details:', error);
      }
    } else {
      console.warn('Screen Enumeration API not supported. Limited detection.');
      setScreenCount(1);
      onScreenCountChange(1);
    }
  };

  const handleCheckScreens = () => {
    setPermissionRequested(true);
    detectScreens();
  };

  return (
    <div>
      {screenCount > 1 && (
        <Alert variant="destructive">Multiple screens detected! Please disconnect other displays.</Alert>
      )}
      {!permissionRequested && (
        <button className='text-[#10B754] text-center text-[0.86rem] not-italic font-normal font-ubuntu leading-[1.24rem] flex py-2 px-3 justify-center items-center rounded-[5px] border border-1 border-[#10B754] w-[1/2]' onClick={handleCheckScreens}>Check for Multiple Screens</button>
      )}
    </div>
  );
};

export default MultiScreenDetector;
