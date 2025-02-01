// /src/components/YouTubeEmbed.tsx

import React from "react";

interface YouTubeEmbedProps {
  src: string;
  width?: string;
  height?: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ src, width = '100%', height = '400px' }) => {
  // Extract video ID from various YouTube URL formats
  const getVideoId = (url: string): string | null => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(src);

  if (!videoId) return null;

  return (
    <div className="youtube-embed-container my-4 w-full aspect-video">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
        width={width}
        height={height}
      />
    </div>
  );
};

export default YouTubeEmbed;
