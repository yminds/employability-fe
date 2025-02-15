import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Loader } from "lucide-react";

interface InterviewPlayerProps {
  urls: string[];
}

const InterviewPlayer = ({ urls }: InterviewPlayerProps) => {
  if (urls === undefined || urls.length === 0) {
    return <div>No Recordings Available</div>;
  }

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
  const [seeking, setSeeking] = useState(false);

  const [updatedProgresssion, setUpdatedProgression] = useState(0);
  const CHUNK_DURATION = 180; // 3 minutes in seconds

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const [isSeeking, setIsSeeking] = useState(false);

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    // Don't update progress while seeking
    if (isSeeking) return;

    const totalDuration = urls.length * CHUNK_DURATION;
    const currentProgress = Math.floor(((currentChunk * CHUNK_DURATION + state.playedSeconds) / totalDuration) * 100);
    setProgress(currentProgress);
    setCurrentTime(formatTime(currentChunk * CHUNK_DURATION + Math.floor(state.playedSeconds)));

    // Only handle auto-progression if not seeking
    if (state.played >= 0.99 && currentChunk < urls.length - 1) {
      setIsLoading(true);
      setCurrentChunk((prev) => prev + 1);
      setIsPlaying(true);
    }
  };

  const handleTimelineChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSeeking(true);
    const value = Math.floor(parseFloat(e.target.value));
    const totalDuration = urls.length * CHUNK_DURATION;
    const newTime = Math.floor((value / 100) * totalDuration);
    const chunkIndex = Math.floor(newTime / CHUNK_DURATION);
    const progressWithinChunk = Math.floor(newTime % CHUNK_DURATION);


    setUpdatedProgression(progressWithinChunk);
    console.log(`cunk index is ${chunkIndex}`);

    setIsLoading(true);
    setProgress(value);
    setCurrentTime(formatTime(newTime));

    console.log("++++++++++++++++++++++++++++++++++++++++");
    console.log(progressWithinChunk);
    console.log("++++++++++++++++++++++++++++++++++++++++");

    if (playerRef.current) {
      const player = playerRef.current.getInternalPlayer();
      if (player) {
        try {
          player.pause();

          // console.log(`url before setting: ${player.src}`);

          player.src = urls[chunkIndex];

          // console.log(`Player src set to ${player.src}`);

          await new Promise((resolve) => {
            player.addEventListener("loadedmetadata", resolve, { once: true });
          });

          console.log(`Seeking to chunk ${chunkIndex} at ${progressWithinChunk} seconds`);
          // player.currentTime = progressWithinChunk;

          // playerRef.current.seekTo(progressWithinChunk, 'seconds');
          console.log(`Player currentTime set to ${player.currentTime}`);

          // player.currentTime = progressWithinChunk;
          // await player.play();
          console.log("Player playing");
          setSeeking(true);
          setCurrentChunk(chunkIndex);
          // setIsPlaying(true);
        } catch (error) {
          console.log("Playback error:", error);
        } finally {
          setIsLoading(false);
          setIsSeeking(false); // Reset seeking state
        }
      }
    }
  };

  useEffect(() => {
   
    if (playerRef.current) {

      console.log('Inside the useEffect of seeking with progress:', updatedProgresssion);
      // playerRef.current.seekTo(updatedProgresssion);

      const player = playerRef.current.getInternalPlayer();
      if (player)
      {
        player.currentTime = updatedProgresssion;
        player.play();
        console.log("Player playing");
      }
      setIsPlaying(true);

      setSeeking(false);
    }
    return () => {
      setSeeking(false);
    }
  }, [seeking]);

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
    setProgress(Math.floor((currentChunk / urls.length) * 100));
    setDuration(formatTime(urls.length * CHUNK_DURATION));
  }, [currentChunk, urls.length]);

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
          onReady={() => setIsLoading(false)}
          onEnded={() => {
            if (currentChunk === urls.length - 1) {
              setIsPlaying(false);
            }
          }}
          playsInline
          onBuffer={() => {
            console.log("Buffering start");
            setIsLoading(true);
          }}
          onBufferEnd={() => {
            console.log("Buffering end");
            setIsLoading(false);
          }}
          autoPlay={false}
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

      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 z-50">
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
              step={1}
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
