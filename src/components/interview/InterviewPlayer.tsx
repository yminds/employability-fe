import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Loader } from "lucide-react";

interface InterviewPlayerProps {
  urls: string[];
}

const InterviewPlayer = ({ urls }: InterviewPlayerProps) => {
  if (urls === undefined || urls.length === 0) { return <div>No Recordings Available</div>; }
  
  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingSeek, setPendingSeek] = useState<number | null>(null);
  
  const CHUNK_DURATION = 180; // 3 minutes in seconds

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    // Only update progress if we're not in the middle of seeking
    if (pendingSeek === null) {
      const totalDuration = urls.length * CHUNK_DURATION;
      const currentProgress = ((currentChunk * CHUNK_DURATION + state.playedSeconds) / totalDuration) * 100;
      setProgress(Number(currentProgress.toFixed(2)));
      setCurrentTime(formatTime(currentChunk * CHUNK_DURATION + state.playedSeconds));
    }

    if (state.played >= 0.99) {
      if (currentChunk < urls.length - 1) {
        setIsLoading(true);
        setCurrentChunk((prev) => prev + 1);
        setIsPlaying(true);
        setTimeout(() => {
          playerRef.current?.seekTo(0, "seconds");
          setIsLoading(false);
        }, 500);
      } else {
        setIsPlaying(false);
      }
    }
  };

  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    const totalDuration = urls.length * CHUNK_DURATION;
    const newTime = (value / 100) * totalDuration;
    const chunkIndex = Math.floor(newTime / CHUNK_DURATION);
    const progressWithinChunk = newTime % CHUNK_DURATION;

    setProgress(value);
    setCurrentTime(formatTime(newTime));

    if (chunkIndex !== currentChunk) {
      setIsLoading(true);
      setPendingSeek(progressWithinChunk);
      setCurrentChunk(chunkIndex);
    } else {
      playerRef.current?.seekTo(progressWithinChunk, "seconds");
    }
  };

  // Handle seeking after chunk change
  useEffect(() => {
    if (pendingSeek !== null && playerRef.current) {
      const timeoutId = setTimeout(() => {
        playerRef.current?.seekTo(pendingSeek, "seconds");
        setPendingSeek(null);
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [currentChunk, pendingSeek]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(1);
      setIsMuted(false);
    } else {
      setVolume(0);
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (pendingSeek === null) {
      setProgress((currentChunk / urls.length) * 100);
    }
    setDuration(formatTime(urls.length * CHUNK_DURATION));
  }, [currentChunk, urls.length, pendingSeek]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <div className="absolute top-0 left-0 w-full h-full">
        <ReactPlayer
          ref={playerRef}
          url={urls[currentChunk]}
          width="100%"
          height="100%"
          playing={isPlaying}
          volume={volume}
          muted={isMuted}
          onProgress={handleProgress}
          onEnded={() => {
            if (currentChunk === urls.length - 1) {
              setIsPlaying(false);
            }
          }}
          controls={false}
          playsInline
        />
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="flex flex-col items-center gap-2">
              <Loader className="w-8 h-8 text-green-500 animate-spin" />
              <span className="text-white text-sm">Loading...</span>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white hover:text-green-500 transition-colors"
            disabled={isLoading}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          <div className="flex-1">
            <input
              type="range"
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                accentColor: "rgb(34 197 94)",
                background: `linear-gradient(to right, rgb(34 197 94) ${progress}%, rgb(209 213 219) ${progress}%)`,
              }}
              value={progress}
              onChange={handleTimelineChange}
              min={0}
              max={100}
              step={0.1}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={toggleMute} 
              className="text-white hover:text-green-500 transition-colors"
              disabled={isLoading}
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>

            <div className="w-20">
              <input
                type="range"
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                style={{
                  accentColor: "rgb(34 197 94)",
                  background: `linear-gradient(to right, rgb(34 197 94) ${volume * 100}%, rgb(209 213 219) ${
                    volume * 100
                  }%)`,
                }}
                value={volume}
                onChange={handleVolumeChange}
                min={0}
                max={1}
                step={0.1}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="text-white text-sm">
            {currentTime} / {duration}
          </div>

          <button 
            onClick={toggleFullscreen} 
            className="text-white hover:text-green-500 transition-colors"
            disabled={isLoading}
          >
            {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewPlayer;