import YouTubeEmbed from "./YouTubeEmbed";
import { useYouTubeContext } from "./YouTubeContext";

/** The "child" that displays all collected videos in a 3-col layout. */
const VideosAtEnd = () => {
  const { videos } = useYouTubeContext();

  // Regex that ensures the URL has exactly 11 valid characters after /embed/
  const embedUrlRegex = /^https?:\/\/(www\.)?youtube\.com\/embed\/[A-Za-z0-9_-]{11}$/;

  // Filter out incomplete or invalid embed links
  const validVideos = videos.filter((url) => embedUrlRegex.test(url));

  // If no valid YouTube links are found, render nothing
  if (!validVideos.length) return null;

  return (
    <div className="my-8">
      <h3 className="text-lg font-bold mb-4">Relevant Videos</h3>
      <div className="grid grid-cols-3 gap-4">
        {validVideos.map((href, idx) => (
          <div key={idx} className="w-full">
            <YouTubeEmbed src={href} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideosAtEnd;
