const YouTubeEmbed: React.FC<{ src: string }> = ({ src }) => {
    const match = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    return match ? <iframe src={`https://www.youtube.com/embed/${match[1]}`} className="w-full aspect-video" allowFullScreen /> : null;
  };
  
export default YouTubeEmbed;
  