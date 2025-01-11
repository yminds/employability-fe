import { useState, useMemo } from "react";

const useInlineSVGs = (iconUrls: string[]) => {
  const [inlineSVGs, setInlineSVGs] = useState<string[]>([]);

  useMemo(() => {
    const fetchSVGs = async () => {
      try {
        const promises = iconUrls.map(async (iconUrl) => {
          const response = await fetch(iconUrl);
          return await response.text();
        });

        const svgs = await Promise.all(promises);
        setInlineSVGs(svgs);
      } catch (error) {
        console.error("Error fetching SVGs:", error);
      }
    };

    if (iconUrls.length > 0) {
      fetchSVGs();
    }
  }, [iconUrls]);

  return inlineSVGs;
};

export default useInlineSVGs;