// YouTubeContext.tsx
import { createContext, useContext, useState, PropsWithChildren } from "react";

interface YouTubeContextType {
  videos: string[];
  addYouTubeLink: (url: string) => void;
}

const YouTubeContext = createContext<YouTubeContextType>({
  videos: [],
  addYouTubeLink: () => {},
});

export const YouTubeProvider = ({ children }: PropsWithChildren<{}>) => {
  const [videos, setVideos] = useState<string[]>([]);

  const addYouTubeLink = (url: string) => {
    setVideos((prev) => {
      // Avoid duplicates (optional)
      if (prev.includes(url)) return prev;
      return [...prev, url];
    });
  };

  return (
    <YouTubeContext.Provider value={{ videos, addYouTubeLink }}>
      {children}
    </YouTubeContext.Provider>
  );
};

// Hook for easier usage:
export const useYouTubeContext = () => useContext(YouTubeContext);
