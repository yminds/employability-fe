import { useCallback, useEffect, useRef, useState, useTransition } from "react";
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
  const preloadAudioRef = useRef<{ current: HTMLAudioElement | null }>({ current: null });
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
  const [nextChunkPreloaded, setNextChunkPreloaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [tempProgress, setTempProgress] = useState(0);
  const [isPending, startTransition] = useTransition();

  const [updatedProgresssion, setUpdatedProgression] = useState(0);
  const CHUNK_DURATION = 30;

  // Preload next chunk
  const preloadNextChunk = useCallback(() => {
    if (currentChunk < urls.length - 1 && !nextChunkPreloaded) {
      const audio = new Audio();
      audio.src = urls[currentChunk + 1];
      audio.preload = "auto";
      
      audio.addEventListener('canplaythrough', () => {
        setNextChunkPreloaded(true);
        console.log("Next chunk preloaded:", currentChunk + 1);
      });

      preloadAudioRef.current.current = audio;
    }
  }, [currentChunk, urls, nextChunkPreloaded]);

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    if (seeking) return;

    const totalDuration = urls.length * CHUNK_DURATION;
    const currentProgress = Math.floor(((currentChunk * CHUNK_DURATION + state.playedSeconds) / totalDuration) * 100);
    setProgress(currentProgress);
    setCurrentTime(formatTime(currentChunk * CHUNK_DURATION + Math.floor(state.playedSeconds)));

    // Start preloading when we're 5 seconds away from the end
    if (state.playedSeconds >= CHUNK_DURATION - 20 && !nextChunkPreloaded) {
      preloadNextChunk();
    }

    // Handle chunk transition
    if (state.played >= 0.99 && currentChunk < urls.length - 1) {
      setIsLoading(true);
      setCurrentChunk((prev) => prev + 1);
      setNextChunkPreloaded(false);
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleTimelineMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
    setIsDragging(true);
    const value = parseInt((e.target as HTMLInputElement).value);
    setTempProgress(value);
  };

  const handleTimelineDrag = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (isDragging) {
    const value = parseInt(e.target.value);
    requestAnimationFrame(() => {
      setTempProgress(value);
    });
  }
  };

  const handleTimelineMouseUp = async () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    const totalDuration = urls.length * CHUNK_DURATION;
    const newTime = Math.floor((tempProgress / 100) * totalDuration);
    const chunkIndex = Math.floor(newTime / CHUNK_DURATION);
    const progressWithinChunk = Math.floor(newTime % CHUNK_DURATION);

    setIsLoading(true);
    setProgress(tempProgress);
    setCurrentTime(formatTime(newTime));

    if (playerRef.current) {
      const player = playerRef.current.getInternalPlayer();
      if (player) {
        try {
          player.pause();
          player.src = urls[chunkIndex];

          await new Promise((resolve) => {
            player.addEventListener("loadedmetadata", resolve, { once: true });
          });

          setSeeking(true);
          setCurrentChunk(chunkIndex);
          setNextChunkPreloaded(false);
          setUpdatedProgression(progressWithinChunk);
          
          if (chunkIndex < urls.length - 1) {
            preloadNextChunk();
          }
        } catch (error) {
          console.log("Playback error:", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    if (playerRef.current) {
      const player = playerRef.current.getInternalPlayer();
      if (player) {
        player.currentTime = updatedProgresssion;
        player.play();
      }
      setIsPlaying(true);
      setSeeking(false);
    }
    return () => {
      setSeeking(false);
    };
  }, [seeking]);

  useEffect(() => {
    if (isPlaying && !nextChunkPreloaded && currentChunk < urls.length - 1) {
      preloadNextChunk();
    }
  }, [isPlaying, currentChunk, nextChunkPreloaded, preloadNextChunk]);

  // Cleanup preloaded audio when unmounting or changing chunks
  useEffect(() => {
    return () => {
      if (preloadAudioRef.current) {
        if (preloadAudioRef.current.current) {
          preloadAudioRef.current.current.src = '';
        }
      }
    };
  }, [currentChunk]);

  
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleTimelineMouseUp();
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging, tempProgress]);

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
          onReady={() => {
            console.log("player is now ready to receive commands");
            setIsLoading(false);
            
            // Start preloading next chunk when current chunk is ready
            if (!nextChunkPreloaded && currentChunk < urls.length - 1) {
              preloadNextChunk();
            }
          }}
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
                background: `linear-gradient(to right, rgb(34 197 94) ${isDragging ? tempProgress : progress}%, rgb(209 213 219) ${isDragging ? tempProgress : progress}%)`,
              }}
              value={isDragging ? tempProgress : progress}
              onMouseDown={handleTimelineMouseDown}
              onChange={handleTimelineDrag}
              onMouseUp={handleTimelineMouseUp}
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